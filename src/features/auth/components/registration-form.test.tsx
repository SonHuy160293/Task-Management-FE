import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { RegistrationForm } from '@/features/auth/components/registration-form';
import { renderApp } from '@/test/render';
import { acceptedMessage, registrationUrl, server } from '@/test/server';

async function completeForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Full name'), 'Alex Morgan');
  await user.type(screen.getByLabelText('Work email'), 'alex@example.com');
  await user.type(
    screen.getByLabelText('Password'),
    'a unique long passphrase',
  );
  return user;
}

it('validates before sending requests', async () => {
  renderApp(<RegistrationForm />);
  await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
  expect(await screen.findByText('Enter your display name.')).toBeVisible();
  expect(screen.getByText('Enter a valid email address.')).toBeVisible();
});

it('submits the verified payload, prevents duplicates, and displays privacy-preserving acceptance', async () => {
  let calls = 0;
  server.use(
    http.post(registrationUrl, async ({ request }) => {
      calls++;
      expect(await request.json()).toMatchObject({
        displayName: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'a unique long passphrase',
        locale: 'en',
      });
      expect(request.headers.get('authorization')).toBeNull();
      await delay(100);
      return HttpResponse.json(
        { success: true, data: { message: acceptedMessage }, error: null },
        { status: 202 },
      );
    }),
  );
  const { client } = renderApp(<RegistrationForm />);
  const user = await completeForm();
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
  expect(await screen.findByText(acceptedMessage)).toBeVisible();
  expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  expect(calls).toBe(1);
  await waitFor(() =>
    expect(client.getMutationCache().getAll()).toHaveLength(0),
  );
});

it('maps server field errors and displays unmatched validation errors with a trace ID', async () => {
  server.use(
    http.post(registrationUrl, () =>
      HttpResponse.json(
        {
          success: false,
          data: null,
          error: {
            code: 'Validation.Failure',
            message: 'Check your details.',
            errors: {
              Email: ['This address is invalid.'],
              request: ['Password is compromised.'],
            },
            traceId: 'trace-test',
          },
        },
        { status: 400 },
      ),
    ),
  );
  renderApp(<RegistrationForm />);
  const user = await completeForm();
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  expect(await screen.findByText('This address is invalid.')).toBeVisible();
  await waitFor(() =>
    expect(screen.getByLabelText('Work email')).toHaveFocus(),
  );
  expect(screen.getByText('Password is compromised.')).toBeVisible();
  expect(screen.getByText('Reference: trace-test')).toBeVisible();
});

it.each([429, 503])(
  'shows service errors without retrying a mutation (%i)',
  async (status) => {
    let calls = 0;
    server.use(
      http.post(registrationUrl, () => {
        calls++;
        return new HttpResponse(null, { status });
      }),
    );
    renderApp(<RegistrationForm />);
    const user = await completeForm();
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(calls).toBe(1);
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeEnabled();
  },
);

it('toggles password visibility with an accessible control', async () => {
  renderApp(<RegistrationForm />);
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

it('opens collapsed preferences to show and focus a server field error', async () => {
  server.use(
    http.post(registrationUrl, () =>
      HttpResponse.json(
        {
          success: false,
          error: {
            message: 'Check preferences.',
            errors: { TimeZone: ['This time zone is not supported.'] },
          },
        },
        { status: 400 },
      ),
    ),
  );
  renderApp(<RegistrationForm />);
  const user = await completeForm();
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  expect(
    await screen.findByText('This time zone is not supported.'),
  ).toBeVisible();
  await waitFor(() => expect(screen.getByLabelText('Time zone')).toHaveFocus());
});

it('rejects malformed acceptance without resubmitting the password', async () => {
  let calls = 0;
  server.use(
    http.post(registrationUrl, () => {
      calls++;
      return HttpResponse.json(
        { success: true, data: { message: null } },
        { status: 202 },
      );
    }),
  );
  renderApp(<RegistrationForm />);
  const user = await completeForm();
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  expect(
    await screen.findByText(/returned an unexpected response/),
  ).toBeVisible();
  expect(screen.queryByText('Request received')).not.toBeInTheDocument();
  expect(calls).toBe(1);
});
