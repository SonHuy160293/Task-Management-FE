import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { session, type SessionController } from '@/lib/auth/session';

const AuthContext = createContext<SessionController>(session);

export function AuthProvider({
  children,
  controller = session,
}: {
  children: ReactNode;
  controller?: SessionController;
}) {
  const client = useQueryClient();
  useEffect(() => {
    let previousStatus = controller.getSnapshot().status;
    const unsubscribe = controller.subscribe(() => {
      const nextStatus = controller.getSnapshot().status;
      if (
        previousStatus === 'authenticated' &&
        nextStatus !== 'authenticated'
      ) {
        void client.cancelQueries();
        client.clear();
      }
      previousStatus = nextStatus;
    });
    void controller.initialize();
    return unsubscribe;
  }, [client, controller]);
  return (
    <AuthContext.Provider value={controller}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const controller = useContext(AuthContext);
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  return {
    ...snapshot,
    available: controller.available,
    logout: () => controller.logout(),
  };
}
