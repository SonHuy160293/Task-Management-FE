import {
  createSession,
  type SessionAdapter,
  type SessionIdentity,
} from '@/lib/auth/session';

const identity: SessionIdentity = {
  user: { id: 'user-a', displayName: 'Alex', email: 'alex@example.com' },
  accessToken: 'original',
};

function adapter(changes: Partial<SessionAdapter> = {}): SessionAdapter {
  return {
    restore: vi.fn(async () => identity),
    refresh: vi.fn(async () => ({ ...identity, accessToken: 'rotated' })),
    logout: vi.fn(async () => {}),
    ...changes,
  };
}

it('initializes once, including concurrent StrictMode calls', async () => {
  const transport = adapter();
  const session = createSession(transport);
  expect(session.getSnapshot().status).toBe('initializing');
  await Promise.all([session.initialize(), session.initialize()]);
  expect(transport.restore).toHaveBeenCalledTimes(1);
  expect(session.getSnapshot().status).toBe('authenticated');
});

it('stays anonymous without inventing a restore endpoint', async () => {
  const session = createSession();
  await session.initialize();
  expect(session.available).toBe(false);
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('coordinates simultaneous refresh requests into one rotation', async () => {
  const transport = adapter();
  const session = createSession(transport);
  await session.initialize();
  expect(
    await Promise.all([
      session.refreshAccessToken(),
      session.refreshAccessToken(),
      session.refreshAccessToken(),
    ]),
  ).toEqual(['rotated', 'rotated', 'rotated']);
  expect(transport.refresh).toHaveBeenCalledTimes(1);
});

it('expires the session when refresh fails', async () => {
  const session = createSession(
    adapter({
      refresh: async () => {
        throw new Error('Expired');
      },
    }),
  );
  await session.initialize();
  await expect(session.refreshAccessToken()).rejects.toThrow('Expired');
  expect(session.getAccessToken()).toBeUndefined();
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('does not resurrect a logged-out session from an in-flight refresh', async () => {
  let resolve!: (value: SessionIdentity) => void;
  const session = createSession(
    adapter({
      refresh: () =>
        new Promise((done) => {
          resolve = done;
        }),
    }),
  );
  await session.initialize();
  const refresh = session.refreshAccessToken();
  await session.logout();
  resolve({ ...identity, accessToken: 'stale' });
  await expect(refresh).rejects.toThrow('Session changed');
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('does not resurrect a session when restoration finishes after logout', async () => {
  let resolve!: (value: SessionIdentity) => void;
  const session = createSession(
    adapter({
      restore: () =>
        new Promise((done) => {
          resolve = done;
        }),
    }),
  );
  const init = session.initialize();
  await session.logout();
  resolve(identity);
  await init;
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('clears the local session even if remote logout fails', async () => {
  const session = createSession(
    adapter({
      logout: async () => {
        throw new Error('Offline');
      },
    }),
  );
  await session.initialize();
  await expect(session.logout()).rejects.toThrow('Offline');
  expect(session.getAccessToken()).toBeUndefined();
});
