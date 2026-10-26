import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { LoadingState, ForbiddenState } from '@/components/common/states';
import { hasPermission, type PermissionSnapshot } from '@/lib/auth/permissions';

export function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.status === 'initializing')
    return <LoadingState message="Checking your session…" />;
  if (auth.status !== 'authenticated')
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  return <Outlet />;
}

export function PermissionRoute({
  snapshot,
  scopeId,
  code,
}: {
  snapshot: PermissionSnapshot | null;
  scopeId: string;
  code: string;
}) {
  const { organizationId = '' } = useParams();
  return hasPermission(snapshot, organizationId, scopeId, code) ? (
    <Outlet />
  ) : (
    <ForbiddenState />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function safeReturnPath(value: unknown) {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    value.trim() === value &&
    !value.includes('\n') &&
    !value.includes('\r') &&
    !/^\/(?:%2f|%5c)/i.test(value) &&
    !/^\/(login|register)(\/|\?|#|$)/i.test(value)
    ? value
    : '/';
}
