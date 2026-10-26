# Authentication: implementation and boundaries

## Current product behavior

Registration is implemented. It submits the verified registration contract and
displays the backend's generic acceptance message. It does not set a user, issue
tokens, sign in, or claim an email was sent. The inspected backend creates pending
accounts/challenges, and delivery/verification is separate unfinished work.

There is no login/current-user/refresh/logout browser endpoint. `/login` therefore
explains availability instead of presenting a form that cannot work. The production
session controller has **no adapter** and initializes anonymously without making
a request. Session tests use injected adapters and MSW; they are not evidence of
an integrated login flow.

## Session controller

`lib/auth/session.ts` defines a frontend-owned SessionIdentity, SessionSnapshot and
SessionAdapter. These are integration interfaces, **not invented backend DTOs**.
An eventual adapter must map real generated login/profile/refresh responses into
the frontend identity and memory-held access token.

The controller transitions through `initializing`, `anonymous`, and
`authenticated`. `initialize()` is shared by concurrent callers. `AuthProvider`
subscribes through effects, while components use `useSyncExternalStore` to observe
a consistent snapshot. A protected route shows loading while initializing and
redirects anonymously without flashing private UI. Return destinations are carried
as route state; `safeReturnPath` rejects external and auth-loop destinations for
the future login handler. There is no successful-login redirect until login exists.

## Access tokens and refresh tokens

An access token is a short-lived credential sent as `Authorization: Bearer ...`.
The controller stores it in memory, so a reload loses it. A supported restoration
endpoint would need to establish a new session using backend-controlled cookies.
There is no localStorage/sessionStorage token persistence in this codebase.

A refresh token typically rotates a short-lived access token. Prefer a Secure,
HttpOnly cookie if the verified backend supports it. Secure limits transport to
HTTPS, HttpOnly prevents JavaScript reads, and SameSite controls some cross-site
inclusion. Cookies do not eliminate XSS impact: injected script can still issue
requests in a user's session. Use CSP, avoid untrusted HTML and protect dependencies.

Cookie-based authentication also needs a real CSRF strategy appropriate to the
backend. Confirm refresh and logout methods, cookie Path/Domain, SameSite and
cross-origin credentials before configuring an adapter. Don't assume the backend
uses cookies simply because the frontend prefers them.

## Coordinated refresh and bounded replay

The session controller shares one in-flight refresh promise. Several expired
requests wait for that same rotation, avoiding simultaneous use of a single-use
refresh token. A failed refresh expires the local session. A revision counter
changes on logout/expiration; late restore/refresh results cannot revive the old
session.

The Axios interceptor retries only authenticated **GET/HEAD/OPTIONS** once after a
401, and only if a session adapter exists. It notices if another request already
rotated the token and reuses that token rather than rotating again. A repeated 401
expires the current token. Writes aren't automatically replayed, because ambiguous
effects and duplication need explicit backend idempotency guarantees. Registration
is public and never needs a refresh. The adapter itself must use a separate raw
transport for refresh so its own 401 cannot recursively trigger the interceptor.

TanStack Query never retries 401/403. It retries network/5xx reads at most once;
mutations never retry. These policies prevent transport and query retries from
multiplying indefinitely.

## Logout and expiration

The controller clears identity immediately and increments its revision, then asks
the adapter to revoke remotely when one exists. AuthProvider cancels queries and
clears the Query client when an authenticated snapshot becomes anonymous. Private
components unmount through the guard. If remote logout fails, local data remains
cleared and the menu shows a message that revocation could not be confirmed.

This is lifecycle infrastructure, not current working server revocation. Once the
backend supports logout, verify that it invalidates its refresh session and clears
the cookie. Consider cross-tab logout propagation before calling multi-tab session
behavior complete; this release coordinates refresh only within one browser tab.

## Tests and future integration gate

Tests cover one initialization, coordinated refresh, refresh failure, logout during
restore/refresh, remote logout failure, anonymous guards, cache cleanup and limited
HTTP replay. Login success/invalid credentials, real rotation cookie behavior and
server logout cannot be tested until their contracts exist. Add those tests when
wiring an adapter; also verify unauthorized return paths, CSRF, token expiration,
disabled accounts and server-side revocation in an isolated environment.

Never log credentials or raw Axios errors. The registration mutation resets its
observer and form after success and detaches mutation data after failure. Form
fields remain editable on failure so users can correct input; navigating away
unmounts them. No persistence plugin stores sensitive form state.
