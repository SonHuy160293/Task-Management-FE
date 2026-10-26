import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/errors/api-error';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) =>
          failureCount < 1 &&
          error instanceof ApiError &&
          (error.status === 0 || error.status >= 500) &&
          error.code !== 'Request.Canceled',
      },
      mutations: { retry: false, gcTime: 0 },
    },
  });
}

export const queryClient = createQueryClient();

export const tenantKeys = {
  root: (organizationId: string) => ['tenant', organizationId] as const,
  permissions: (organizationId: string, scopeId: string) =>
    ['tenant', organizationId, 'permissions', scopeId] as const,
  teams: (organizationId: string, search = '', page = 1) =>
    ['tenant', organizationId, 'teams', { search, page }] as const,
};

/** Call only with IDs from a freshly authorized membership response. */
export async function switchOrganization(
  client: QueryClient,
  next: string,
  accessibleIds: readonly string[],
) {
  if (!accessibleIds.includes(next))
    throw new Error('This organization is not accessible.');
  await client.cancelQueries({ queryKey: ['tenant'] });
  client.removeQueries({ queryKey: ['tenant'] });
  // Mutations are not cancelable by Query; remove their retained variables and
  // let the initiating view unmount before allowing a new tenant's operations.
  client.getMutationCache().clear();
  return next;
}
