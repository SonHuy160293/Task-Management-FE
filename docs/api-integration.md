# API integration and environment configuration

The active client is the existing Axios boundary; `openapi-fetch` is installed but
not currently used. Registration uses generated types and runtime envelope
validation. Any transport change must preserve cancellation, error normalization,
session and replay safeguards.

## Verified surface

The checked-in Swagger was downloaded from Identity on port 8081. Only the public
registration route is called by this frontend. The other API path is a Users
integration lookup protected by `X-Integration-Key`; never put that key in this SPA.
Organizations, teams and browser sessions are not available. Planning cards in
the backend are useful requirements but cannot authorize fabricated HTTP requests.

## Request walkthrough

1. `RegistrationForm` validates fields through registrationSchema and RHF.
2. `useRegistration` invokes `registerAccount` with a generated RegisterRequest type.
3. `registerAccount` POSTs to `/v1/auth/register` with an optional AbortSignal.
4. The shared Axios instance adds the configured base URL, Accept header and a
   15-second timeout. In today's anonymous runtime it adds no bearer token.
5. Vite forwards `/api/v1/auth/register` to Identity at port 8081 in development.
6. ASP.NET registration protection/validation/handler processes the request. Its
   response filter wraps the result as `{ success, data, error }`.
7. Success parsing accepts that wrapper or the unwrapped Swagger DTO, then Zod
   requires a nonempty message. An HTML page or malformed success is rejected.
8. Failures become ApiError containing safe message/status/code/field errors/traceId.
   The form focuses known fields and displays unmatched errors in a summary.

Generated types describe JSON at compile time; Zod checks unknown JSON at runtime.
OpenAPI currently leaves registration fields optional/nullable, while actual server
validation requires meaningful email/password/name. The form's stricter schema is
based on inspected validator source, not a manual edit of generated types.

## Error handling

`normalizeApiError` supports runtime ApiErrorResponse envelopes, ordinary
ProblemDetails/ValidationProblemDetails, rate limits, timeouts and connectivity
failures. It retains a trace ID for support and accepts only string-array field
messages. It does not retain Axios config/request objects, which can contain
passwords or tokens. Cancellation remains an Axios cancellation in the interceptor
so Query can discard obsolete work correctly. Do not turn cancellation into a toast.

401 ends an unauthenticated/expired operation; a future authenticated idempotent
read may receive one coordinated refresh/replay. 403 does not refresh a token:
the user may be logged in and still lack access. Feature code must clear/revalidate
revoked tenant access when the corresponding APIs exist. 429 means wait for rate
limit recovery; registration is never retried automatically. Query write retries
are disabled globally, and read retries are bounded to avoid multiplicative loops.

## OpenAPI lifecycle

```powershell
npm run api:pull
git diff -- contracts/identity/openapi.json
npm run api:generate
npm run api:check
npm run typecheck
```

`api:pull` downloads the actual endpoint without authentication secrets, verifies
that it is an Identity registration spec, and writes the snapshot. Use another
verified URL through a process environment variable:

```powershell
$env:OPENAPI_URL = 'http://localhost:8081/swagger/v1/swagger.json'
npm run api:pull
Remove-Item Env:OPENAPI_URL
```

The generator uses openapi-typescript's programmatic API, deterministic Prettier
formatting and the **local** snapshot. It does not require a backend to build or run
CI. `api:check` compares generated source with the snapshot; it does not assert that
the live server still matches. Review and commit both when the owner later commits
the changes. Generated code is never manually edited. Add a module's snapshot and
generation target only when its real contract exists.

## Environment values

Vite reads `.env`, `.env.local`, `.env.[mode]`, and `.env.[mode].local`; mode-specific
values take precedence over generic files, and existing process env values have
highest priority. Restart the dev server after changes. Development uses mode
development; normal build uses production. `npm run build -- --mode staging`
passes staging to the final Vite command, loading `.env.staging` if present.

| Name                 | Visibility             | Meaning                                                  |
| -------------------- | ---------------------- | -------------------------------------------------------- |
| VITE_APP_NAME        | Public browser bundle  | Validated app name configuration                         |
| VITE_API_BASE_URL    | Public browser bundle  | `/api` by default, or verified absolute HTTP(S) base URL |
| DEV_API_PROXY_TARGET | Vite server only       | Development upstream, defaults to http://localhost:8081  |
| OPENAPI_URL          | Generation script only | Source for api:pull                                      |
| API_UPSTREAM         | Nginx container only   | Runtime reverse proxy upstream, not browser config       |

Every `VITE_` value is public. Never use it for API secrets, signing keys, connection
strings, or refresh tokens. env.ts validates the base URL early to make bad
configuration visible. The examples contain no credentials; local env files are ignored.

Vite values are substituted **at build time**. Setting VITE_API_BASE_URL on an
already-built container does not change its JavaScript. Rebuild with Docker build
args or put the appropriate env file in place before a local build. API_UPSTREAM
is different: Nginx substitutes it at container startup. Keep `/api` same-origin
and change only that upstream when moving environments whenever possible.

## CORS, cookies and proxies

Direct cross-origin calls require backend CORS allowlisting the exact origin,
including scheme/port. Credentials require explicit origins and AllowCredentials,
not wildcard origins. Axios does not enable cross-origin credentials here because
no cookie refresh contract exists. A future verified cookie adapter should configure
credentials and CSRF controls deliberately. Same-origin proxying reduces CORS
complexity but does not by itself solve CSRF or cookie scope.

`npm run preview` serves static output without the dev proxy; use the Docker proxy
for production-like API tests, or configure a permitted absolute API URL before
building. Do not mistake a preview HTML fallback for a working API response.

## Pagination and cancellation

No team/organization pagination contract exists. Do not guess pageIndex, cursor,
pageSize, totals or response envelopes. Once published, generate the real request
and response types, keep search/page in URL params, and include every filter and
organizationId in query keys. Pass Query's signal to the typed API function and
Axios options. Never pass an abort signal as part of the JSON DTO.

## Rechecking the real backend

See getting-started for inspected backend Compose commands. Readiness proves only
the reported dependencies, not registration acceptance, permission correctness,
or email delivery. Use a designated test database for successful registration;
the 202 message intentionally does not reveal whether an account was created.
Verify persistence and challenge lifecycle through backend acceptance tests.
