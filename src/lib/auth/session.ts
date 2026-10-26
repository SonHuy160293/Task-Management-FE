export interface SessionIdentity {
  user: { id: string; displayName: string; email: string };
  accessToken: string;
}

export type SessionSnapshot =
  | { status: 'initializing'; identity: null }
  | { status: 'anonymous'; identity: null }
  | { status: 'authenticated'; identity: SessionIdentity };

/** An integration seam, not a declaration of backend endpoints or DTOs. */
export interface SessionAdapter {
  restore: () => Promise<SessionIdentity | null>;
  refresh: () => Promise<SessionIdentity>;
  logout: () => Promise<void>;
}

export function createSession(adapter?: SessionAdapter) {
  let snapshot: SessionSnapshot = { status: 'initializing', identity: null };
  let revision = 0;
  let initialization: Promise<void> | undefined;
  let refresh: Promise<string> | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: SessionSnapshot) => {
    snapshot = next;
    listeners.forEach((listener) => listener());
  };
  const expire = () => {
    revision++;
    publish({ status: 'anonymous', identity: null });
  };
  return {
    available: Boolean(adapter),
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getAccessToken: () => snapshot.identity?.accessToken,
    initialize() {
      initialization ??= (async () => {
        const startedAt = revision;
        try {
          const identity = await adapter?.restore();
          if (revision === startedAt)
            publish(
              identity
                ? { status: 'authenticated', identity }
                : { status: 'anonymous', identity: null },
            );
        } catch {
          if (revision === startedAt) expire();
        }
      })();
      return initialization;
    },
    refreshAccessToken() {
      if (!adapter || snapshot.status !== 'authenticated')
        return Promise.reject(new Error('Session unavailable.'));
      // Share one rotation across simultaneous 401 responses. A logout increments
      // revision so an older refresh can never resurrect a closed session.
      refresh ??= (async () => {
        const startedAt = revision;
        try {
          const identity = await adapter.refresh();
          if (revision !== startedAt)
            throw new Error('Session changed during refresh.');
          publish({ status: 'authenticated', identity });
          return identity.accessToken;
        } catch (error) {
          if (revision === startedAt) expire();
          throw error;
        }
      })().finally(() => {
        refresh = undefined;
      });
      return refresh;
    },
    expire,
    async logout() {
      expire();
      await adapter?.logout();
    },
  };
}

export type SessionController = ReturnType<typeof createSession>;
// No login, restore, refresh, or logout endpoint is implemented by the inspected
// API. Keep the production adapter absent until those contracts are verified.
export const session = createSession();
