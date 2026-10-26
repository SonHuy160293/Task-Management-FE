import { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from '@/components/common/states';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/routes/guards';
import { config } from '@/config/env';
import { navigation } from '@/routes/navigation';

const Layout = lazy(() => import('@/components/layout/app-layout'));
const Overview = lazy(() => import('@/routes/pages/overview-page'));
const Organizations = lazy(
  () => import('@/features/organizations/pages/organizations-page'),
);
const Teams = lazy(() => import('@/features/teams/pages/teams-page'));
const Identity = lazy(() => import('@/routes/pages/identity-page'));
const Settings = lazy(() => import('@/routes/pages/settings-page'));
const Guide = lazy(() => import('@/routes/pages/guide-page'));
const Register = lazy(() => import('@/features/auth/pages/register-page'));
const Login = lazy(() => import('@/features/auth/pages/login-page'));

function Root() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title =
      navigation.find((item) => item.to === pathname)?.label ??
      (pathname === '/register'
        ? 'Create account'
        : pathname === '/login'
          ? 'Sign in'
          : 'Workspace');
    document.title = `${title} · ${config.appName}`;
    document.getElementById('main-content')?.focus();
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <Suspense fallback={<LoadingState />}>
      <Outlet />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: (
      <main className="mx-auto max-w-xl p-8">
        <ErrorState
          message="This page could not be loaded. Reload the app, then try again."
          retry={() => window.location.reload()}
        />
      </main>
    ),
    children: [
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      {
        element: <Layout />,
        children: [
          { index: true, element: <Overview /> },
          { path: '/organizations', element: <Organizations /> },
          { path: '/teams', element: <Teams /> },
          { path: '/identity', element: <Identity /> },
          { path: '/settings', element: <Settings /> },
          { path: '/guide', element: <Guide /> },
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: '/organizations/:organizationId',
                element: <Organizations />,
              },
              {
                path: '/organizations/:organizationId/teams',
                element: <Teams />,
              },
              {
                path: '/organizations/:organizationId/teams/:teamId',
                element: <Teams />,
              },
            ],
          },
          {
            path: '*',
            element: (
              <EmptyState
                icon={<FileQuestion />}
                title="This page took a different path"
                description="The page you’re looking for doesn’t exist. Head back to your workspace to find your way."
                action={
                  <Button
                    role="link"
                    nativeButton={false}
                    render={<Link to="/" />}
                  >
                    Back to overview
                  </Button>
                }
              />
            ),
          },
        ],
      },
    ],
  },
]);
