import { http as mswHttp, HttpResponse, delay } from 'msw';
import axios from 'axios';
import { createHttpClient, unwrapResponse } from '@/lib/http/client';
import { createSession } from '@/lib/auth/session';
import { ApiError, normalizeApiError } from '@/lib/errors/api-error';
import { server } from '@/test/server';

const base = 'http://localhost:3000/api';
const identity = {
  user: { id: 'a', displayName: 'Alex', email: 'alex@example.com' },
  accessToken: 'old',
};

async function authenticatedClient(
  refresh = vi.fn(async () => ({ ...identity, accessToken: 'new' })),
) {
  const session = createSession({
    restore: async () => identity,
    refresh,
    logout: async () => {},
  });
  await session.initialize();
  return { client: createHttpClient(base, session), session, refresh };
}

it('refreshes concurrent expired GET requests once and retries with the new access token', async () => {
  server.use(
    mswHttp.get(`${base}/private`, async ({ request }) => {
      if (request.headers.get('authorization') === 'Bearer new')
        return HttpResponse.json({ ok: true });
      await delay(10);
      return new HttpResponse(null, { status: 401 });
    }),
  );
  const { client, refresh } = await authenticatedClient();
  const results = await Promise.all([
    client.get('/private'),
    client.get('/private'),
    client.get('/private'),
  ]);
  expect(results.map((result) => result.data)).toEqual([
    { ok: true },
    { ok: true },
    { ok: true },
  ]);
  expect(refresh).toHaveBeenCalledTimes(1);
});

it('stops after one failed retry and expires the local session', async () => {
  let requests = 0;
  server.use(
    mswHttp.get(`${base}/private`, () => {
      requests++;
      return new HttpResponse(null, { status: 401 });
    }),
  );
  const { client, session, refresh } = await authenticatedClient();
  await expect(client.get('/private')).rejects.toMatchObject({ status: 401 });
  expect(requests).toBe(2);
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('does not refresh or automatically replay non-idempotent mutations', async () => {
  let calls = 0;
  server.use(
    mswHttp.post(`${base}/write`, () => {
      calls++;
      return new HttpResponse(null, { status: 401 });
    }),
  );
  const { client, refresh, session } = await authenticatedClient();
  await expect(client.post('/write', { value: 'test' })).rejects.toMatchObject({
    status: 401,
  });
  expect(calls).toBe(1);
  expect(refresh).not.toHaveBeenCalled();
  expect(session.getSnapshot().status).toBe('anonymous');
});

it('does not refresh public registration on a 401', async () => {
  server.use(
    mswHttp.post(
      `${base}/v1/auth/register`,
      () => new HttpResponse(null, { status: 401 }),
    ),
  );
  const session = createSession();
  await session.initialize();
  const client = createHttpClient(base, session);
  await expect(client.post('/v1/auth/register', {})).rejects.toMatchObject({
    status: 401,
  });
});

it('preserves the session on a forbidden response', async () => {
  server.use(
    mswHttp.get(`${base}/private`, () =>
      HttpResponse.json(
        { title: 'Forbidden', detail: 'Membership revoked' },
        { status: 403 },
      ),
    ),
  );
  const { client, session, refresh } = await authenticatedClient();
  await expect(client.get('/private')).rejects.toMatchObject({
    status: 403,
    message: 'Membership revoked',
  });
  expect(refresh).not.toHaveBeenCalled();
  expect(session.getSnapshot().status).toBe('authenticated');
});

it('omits credentials on explicitly public calls even while a session exists', async () => {
  server.use(
    mswHttp.post(`${base}/v1/auth/register`, ({ request }) => {
      expect(request.headers.get('authorization')).toBeNull();
      return new HttpResponse(null, { status: 401 });
    }),
  );
  const { client, session, refresh } = await authenticatedClient();
  await expect(
    client.post('/v1/auth/register', {}, { authentication: 'omit' }),
  ).rejects.toMatchObject({ status: 401 });
  expect(refresh).not.toHaveBeenCalled();
  expect(session.getSnapshot().status).toBe('authenticated');
});

it('preserves Axios cancellation so Query can discard obsolete requests', async () => {
  server.use(
    mswHttp.get(`${base}/slow`, async () => {
      await delay(100);
      return HttpResponse.json({});
    }),
  );
  const client = createHttpClient(base, createSession());
  const controller = new AbortController();
  const request = client.get('/slow', { signal: controller.signal });
  controller.abort();
  await expect(request).rejects.toSatisfy(axios.isCancel);
});

it('normalizes network failures without leaking the Axios request or credentials', async () => {
  server.use(mswHttp.get(`${base}/offline`, () => HttpResponse.error()));
  const client = createHttpClient(base, createSession());
  await expect(client.get('/offline')).rejects.toMatchObject({
    status: 0,
    code: 'Network.Unavailable',
  });
  try {
    await client.get('/offline');
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    expect(error).not.toHaveProperty('config');
  }
});

it('supports direct DTOs and the active runtime envelope without silently accepting invalid envelopes', () => {
  const parse = (value: unknown) => value;
  expect(
    unwrapResponse({ success: true, data: { message: 'Accepted' } }, parse),
  ).toEqual({ message: 'Accepted' });
  expect(unwrapResponse({ message: 'Accepted' }, parse)).toEqual({
    message: 'Accepted',
  });
  expect(() => unwrapResponse({ success: false, data: null }, parse)).toThrow(
    ApiError,
  );
});

it('normalizes ASP.NET ProblemDetails field errors and filters malformed error shapes', () => {
  const error = new axios.AxiosError(
    'Bad request',
    '400',
    undefined,
    undefined,
    {
      data: {
        title: 'Invalid',
        errors: { Email: ['Invalid email'], unsafe: { a: 1 } },
        traceId: 'trace',
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    },
  );
  expect(normalizeApiError(error)).toMatchObject({
    status: 400,
    message: 'Invalid',
    fields: { Email: ['Invalid email'] },
    traceId: 'trace',
  });
});
