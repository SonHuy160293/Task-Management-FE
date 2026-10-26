# Testing the frontend

`npm run verify` includes design validation and runs Vitest tests under `src`.
`npm run test:e2e` starts the local Vite server and runs desktop and mobile
Chromium projects, including an automated axe scan. Install Chromium once with
`npx playwright install chromium`; CI installs it with system dependencies.
Automated checks cover selected flows and are not a full accessibility audit.

Use [DESIGN.md](../DESIGN.md) as the visual and interaction contract. Its Nova
theme, component defaults, responsive guidance, and known gaps describe what to
check; passing document validation alone does not verify a rendered screen.

## What each test layer proves

Unit tests exercise an isolated rule, such as registration validation or exact-scope
permissions. Component tests render actual React UI and interact through labels
and roles. HTTP integration tests exercise Axios against an intercepted request.
Real-backend acceptance checks prove something different: that the deployed API,
database, authentication and authorization work together. Do not label MSW results
as successful backend integration.

Vitest runs the tests, React Testing Library renders/interacts with UI, userEvent
simulates realistic input, and MSW intercepts HTTP at the network layer. jsdom
provides DOM APIs without a visible browser. It cannot verify visual layout,
responsive rendering, native cookie behavior or server persistence.

## Commands

```powershell
npm test
npm run test:run
npm run test:coverage
npm run test:run -- src/features/auth/components/registration-form.test.tsx
npm run design:lint
npm run test:e2e
```

Watch mode is useful while developing; press q to stop. `test:run` exits after a
single run. Coverage creates an ignored coverage directory and HTML/text reports.
Coverage numbers show executed lines, not proof of all business scenarios. Focus
on important observable behavior and external boundaries.

`npm run verify` checks formatting, lint, types, generated contracts, Vitest,
DESIGN.md, and build. It does not run Playwright; CI runs those browser checks
separately. `design:lint` validates document structure, references, and declared
color pairs, not parity with CSS. After token/default changes, compare the
frontmatter and full color inventory with `globals.css`, its Tailwind aliases,
and the relevant component source.

## Setup and isolation

vite.config.ts enables Vitest globals, jsdom and src/test/setup.ts. The setup starts
the Node MSW server, fails unhandled frames with MSW 3's `onUnhandledFrame: 'error'`,
cleans React DOM and resets handlers after each test, then closes the server.
Test mocks are never imported by main.tsx or any production feature.

renderApp wraps components in a MemoryRouter and a new QueryClient, with retries
disabled for deterministic feedback. Avoid sharing production query state between
tests. Test cases that construct clients directly clear them at the end.

The test registration URL uses jsdom's localhost:3000 origin. It is a test fixture,
not the production API setting. The actual API function still uses the same shared
Axios instance and `/api/v1/auth/register` relative path as production.

## An actual form test

Registration tests find fields with getByLabelText, enter values with user.type,
and click the accessible submit button. `findByText` waits for asynchronous output;
getByText is immediate. Use waitFor for a changing non-DOM assertion, such as a
mutation leaving the cache after reset. Avoid arbitrary sleeps in tests.

```tsx
renderApp(<RegistrationForm />);
await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
expect(await screen.findByText('Enter your display name.')).toBeVisible();
```

Test the user's experience instead of component internal state, class strings or
implementation function call order. A validation test should show that an invalid
form does not submit, not merely repeat the schema's code inside a test.

## Overriding HTTP behavior

Use server.use inside one test to replace a response. Existing cases inspect the
submitted payload and headers, delay acceptance to verify duplicate prevention,
return server field errors, fail with 429/503, or simulate a network error.

```ts
server.use(
  http.post(registrationUrl, () =>
    HttpResponse.json(
      {
        success: false,
        data: null,
        error: { code: 'Validation.Failure', message: 'Check your details.' },
      },
      { status: 400 },
    ),
  ),
);
```

Use fake values only. Passwords/tokens in tests are synthetic fixtures, never real
credentials. Don't save full HTTP payloads from a real user into snapshots.

## Security-sensitive behavior covered

- Password Unicode length, preserving whitespace, invalid email/name/locale/time zone.
- Registration success, pending disable, generic acceptance, field/summary errors,
  service failures and sensitive mutation cleanup.
- Initialization coordinated across callers and anonymous production behavior.
- Refresh single-flight, expiration, restoration/logout races and remote logout failure.
- Axios bounded GET retry, token reuse, mutation no-replay, public failure, 403,
  cancellation, network error normalization and direct/enveloped DTO handling.
- No private-content flash, anonymous redirection, cache cleanup on expiration,
  exact tenant/scope denial and safe return paths.
- Tenant key separation, authorized switching, invalid selection and cancel-before-remove.
- Honest missing-contract UI with disabled organization/team writes.

Login success/invalid credentials and real organization/team CRUD/member tests are
not implemented because the corresponding contracts are missing. Add them with the
real feature instead of testing pretend endpoints. See backend-integration-gaps.md.

## Debugging a failed test

Read the first assertion and its rendered DOM. If a role/label is missing, inspect
whether the component is loading, unauthorized, errored or inaccessible. A findBy
timeout may mean the expected request was never made, the MSW path is wrong, or
runtime response validation rejected the mock shape. Unhandled MSW failures should
be fixed by matching the real contract, not by allowing all network requests.

If timing is flaky, use a promise gate/delayed MSW response to control the event
being tested, then await visible output. Don't enlarge timeouts as the first fix.
React act warnings usually indicate state work wasn't awaited or a component
wasn't cleaned up. Check QueryClient ownership and controller subscriptions.

On this managed Windows environment, Vite's native configuration tooling initially
received spawn EPERM inside the sandbox. The same commands passed with authorized
child-process access. That is an execution restriction, not a reason to disable
tests or change source to hide errors.

## Browser and real API verification

After tests and build pass, check keyboard Tab/Escape, mobile navigation, dialog
focus, route refreshes, disabled states, long text and narrow layouts in a browser.
Test loading, empty, error, success, disabled, and permission states as applicable.
Follow DESIGN.md's viewport cases (320px, 375px, 768px, 1024px, 1440px), 200% zoom,
light/dark rendering, and reduced-motion preference. Keep page overflow absent
and table scrolling local, ensure icon actions have names, and verify contrast
on actual surfaces/states. Mobile emulation does not replace real-device touch
testing. Existing fixed-light shell styles and the absent theme switcher remain
gaps; toggling `.dark` during review only tests token-driven rendering.

The current Playwright suite covers registration navigation/validation, search
Escape dismissal, mobile navigation, and registration axe findings at critical
or serious severity. It does not assert all these manual cases, complete dark
coverage, or every accessibility rule. Extend tests for changed critical behavior
and record which manual cases actually ran.

For real registration success, use a designated disposable test account/database;
the generic 202 cannot prove creation. Observe server-side persistence using backend
acceptance tests. Keep verification evidence explicit about mocks versus real APIs.
