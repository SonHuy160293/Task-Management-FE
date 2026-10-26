import { screen } from '@testing-library/react';
import OrganizationsPage from '@/features/organizations/pages/organizations-page';
import TeamsPage from '@/features/teams/pages/teams-page';
import LoginPage from '@/features/auth/pages/login-page';
import { renderApp } from '@/test/render';

it('clearly disables organization writes while the backend contract is absent', () => {
  renderApp(<OrganizationsPage />);
  expect(
    screen.getByRole('button', { name: 'Create organization' }),
  ).toBeDisabled();
  expect(screen.getByText('Your organizations will live here')).toBeVisible();
  expect(
    screen.getByText(/No workspace data is being requested/),
  ).toBeVisible();
});

it('does not fabricate a team list or member management', () => {
  renderApp(<TeamsPage />);
  expect(screen.getByRole('button', { name: 'Create team' })).toBeDisabled();
  expect(screen.getByText('A space for every team')).toBeVisible();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

it('does not present an unusable login form as a working authentication flow', () => {
  renderApp(<LoginPage />);
  expect(screen.getByText('Sign-in is awaiting backend support')).toBeVisible();
  expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Create an account' }),
  ).toHaveAttribute('href', '/register');
});
