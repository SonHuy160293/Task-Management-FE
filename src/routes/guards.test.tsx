import { screen, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import {
  ProtectedRoute,
  PermissionRoute,
  safeReturnPath,
} from '@/routes/guards';
import { AuthProvider } from '@/app/providers/auth-provider';
import { createSession } from '@/lib/auth/session';
import { createQueryClient, tenantKeys } from '@/lib/query/client';

it('prevents private content flashing during initialization, then redirects anonymous users', async () => {
  const session = createSession();
  const client = createQueryClient();
  render(
    <QueryClientProvider client={client}>
      <AuthProvider controller={session}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/private" element={<p>Secret content</p>} />
            </Route>
            <Route path="/login" element={<p>Sign in</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );
  expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  expect(await screen.findByText('Sign in')).toBeVisible();
  client.clear();
});

it('clears private caches and protected content when the session expires', async () => {
  const session = createSession({
    restore: async () => ({
      user: { id: 'a', displayName: 'Alex', email: 'alex@example.com' },
      accessToken: 'token',
    }),
    refresh: async () => {
      throw new Error('Expired');
    },
    logout: async () => {},
  });
  const client = createQueryClient();
  render(
    <QueryClientProvider client={client}>
      <AuthProvider controller={session}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/private" element={<p>Secret content</p>} />
            </Route>
            <Route path="/login" element={<p>Sign in</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );
  expect(await screen.findByText('Secret content')).toBeVisible();
  client.setQueryData(tenantKeys.teams('org-a'), ['private']);
  await act(async () => session.expire());
  expect(await screen.findByText('Sign in')).toBeVisible();
  expect(client.getQueryData(tenantKeys.teams('org-a'))).toBeUndefined();
  client.clear();
});

it('denies access to organization-scoped routes without an exact permission snapshot', () => {
  render(
    <MemoryRouter initialEntries={['/organizations/foreign']}>
      <Routes>
        <Route
          element={
            <PermissionRoute
              snapshot={{
                organizationId: 'own',
                scopeId: 'scope',
                codes: ['view'],
              }}
              scopeId="scope"
              code="view"
            />
          }
        >
          <Route
            path="/organizations/:organizationId"
            element={<p>Private tenant</p>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
  expect(
    screen.getByText('You don’t have access to this workspace'),
  ).toBeVisible();
  expect(screen.queryByText('Private tenant')).not.toBeInTheDocument();
});

it.each([
  'https://evil.example',
  '//evil.example',
  '/\\evil.example',
  '/login',
  '/register?next=x',
  '/LOGIN#again',
  '/login#again',
  '/%2fevil.example',
  '/%5cevil.example',
  null,
])('rejects unsafe return destinations', (path) => {
  expect(safeReturnPath(path)).toBe('/');
});

it('keeps an internal organization destination for a future verified login flow', () => {
  expect(safeReturnPath('/organizations/own/teams?page=2')).toBe(
    '/organizations/own/teams?page=2',
  );
});
