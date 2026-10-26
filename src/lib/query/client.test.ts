import {
  createQueryClient,
  tenantKeys,
  switchOrganization,
} from '@/lib/query/client';
import { hasPermission } from '@/lib/auth/permissions';

it('keeps organization and scope data separate in query keys', () => {
  const client = createQueryClient();
  client.setQueryData(tenantKeys.teams('org-a'), ['Team A']);
  client.setQueryData(tenantKeys.teams('org-b'), ['Team B']);
  client.setQueryData(tenantKeys.permissions('org-a', 'scope-a'), ['read']);
  expect(client.getQueryData(tenantKeys.teams('org-a'))).toEqual(['Team A']);
  expect(client.getQueryData(tenantKeys.teams('org-b'))).toEqual(['Team B']);
  expect(
    client.getQueryData(tenantKeys.permissions('org-a', 'scope-b')),
  ).toBeUndefined();
  client.clear();
});

it('removes tenant data on an authorized switch, preserving public queries', async () => {
  const client = createQueryClient();
  client.setQueryData(tenantKeys.teams('org-a'), ['private']);
  client.setQueryData(tenantKeys.permissions('org-a', 'scope'), ['manage']);
  client.setQueryData(['public-config'], { name: 'DevFlow' });
  expect(await switchOrganization(client, 'org-b', ['org-a', 'org-b'])).toBe(
    'org-b',
  );
  expect(client.getQueryCache().findAll({ queryKey: ['tenant'] })).toHaveLength(
    0,
  );
  expect(client.getQueryData(['public-config'])).toEqual({ name: 'DevFlow' });
  client.clear();
});

it('rejects invalid organization selections before clearing the current workspace', async () => {
  const client = createQueryClient();
  client.setQueryData(tenantKeys.teams('org-a'), ['private']);
  await expect(
    switchOrganization(client, 'foreign-org', ['org-a']),
  ).rejects.toThrow('not accessible');
  expect(client.getQueryData(tenantKeys.teams('org-a'))).toEqual(['private']);
  client.clear();
});

it('cancels in-flight tenant requests before removing their cache', async () => {
  const client = createQueryClient();
  let canceled = false;
  const request = client
    .fetchQuery({
      queryKey: tenantKeys.teams('org-a'),
      queryFn: ({ signal }) =>
        new Promise((resolve) => {
          signal.addEventListener('abort', () => {
            canceled = true;
            resolve(['obsolete']);
          });
        }),
    })
    .catch(() => undefined);
  await switchOrganization(client, 'org-b', ['org-b']);
  await request;
  expect(canceled).toBe(true);
  expect(client.getQueryData(tenantKeys.teams('org-a'))).toBeUndefined();
  client.clear();
});

it('denies absent, foreign-organization, and foreign-scope permissions', () => {
  const snapshot = {
    organizationId: 'org-a',
    scopeId: 'team-a',
    codes: ['team.read'],
  };
  expect(hasPermission(null, 'org-a', 'team-a', 'team.read')).toBe(false);
  expect(hasPermission(snapshot, 'org-b', 'team-a', 'team.read')).toBe(false);
  expect(hasPermission(snapshot, 'org-a', 'team-b', 'team.read')).toBe(false);
  expect(hasPermission(snapshot, 'org-a', 'team-a', 'team.write')).toBe(false);
  expect(hasPermission(snapshot, 'org-a', 'team-a', 'team.read')).toBe(true);
});
