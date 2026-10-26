# Backend integration: evidence and remaining work

Reviewed **2026-10-25**, against the adjacent `D:\Projects\Task-Management`
repository and the running `http://localhost:8081/swagger/v1/swagger.json`.
That repository has no resolvable HEAD commit, so evidence is recorded by source
path and snapshot rather than by an invented revision. No backend files were changed.

## Evidence hierarchy

1. Running Swagger: checked in at `contracts/identity/openapi.json`.
2. Active controllers, handlers, validators, host registration, filters and middleware.
3. Backend task cards: **planned contracts**, even when they include concrete DTOs.

`src/Modules/DevFlow.Identity/DevFlow.Identity.API/Controllers/AuthController.cs`
contains only `POST /api/v1/auth/register`. Its host invokes Application and
Infrastructure registration, response envelopes, registration protection, JWT
authentication, CORS, and authorization. `UsersController.cs` exposes
`GET /api/v1/integrations/Users/{userId}` using an integration API key. This is a
service-to-service endpoint, **not** a browser current-user endpoint. Its schema
is retained in generated output for snapshot fidelity; the frontend never calls it.

## Capability status

| Feature                       | Required capability                                        | Evidence / missing information                                                                                    | Frontend status                                                                                    | Completion steps                                                                                                   |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Registration                  | Public registration POST                                   | Present in source and live Swagger; nullable schema fields, stricter actual validator                             | Form, generated types, runtime parsing, mutation/error UX and MSW tests implemented                | Verify 202 against an isolated database and its security services; confirm persistence separately                  |
| Registration response         | Runtime success/error envelope                             | `ApiResponseEnvelopeFilter`, `ApiResponse`, exception/status middleware; Swagger describes unwrapped DTOs         | Handles envelope and direct DTO, validates accepted message                                        | Backend should document its runtime envelope in OpenAPI; regenerate and simplify parsing only after verification   |
| Verification and delivery     | Deliver challenge, verify email, resend                    | Backend handler creates pending account/challenge; backend docs say delivery absent                               | Acceptance screen explains limits; no fabricated link or session                                   | Implement and publish delivery and verification contracts                                                          |
| Login                         | Credentials exchange and actual token/cookie contract      | No login controller action in source or runtime                                                                   | `/login` is an honest availability screen                                                          | Publish implemented login, verification gating and error contracts, then build login mutation/form                 |
| Current user / initialization | Browser session/current-user endpoint                      | Integration user lookup cannot substitute; requires a server secret                                               | Session controller is tested with injected adapters; production adapter absent and anonymous       | Implement current-user/restore endpoints, then map generated DTOs into SessionIdentity                             |
| Refresh                       | Rotation contract, cookie settings, CSRF handling          | No refresh endpoint or verified browser cookie strategy                                                           | Single-flight and logout-race infrastructure tested, no refresh HTTP call configured               | Verify actual request/response, cookie Path/SameSite/Secure/HttpOnly and replay policy; implement adapter          |
| Logout                        | Revoke session and clear refresh cookie                    | No endpoint                                                                                                       | Local lifecycle/clear-cache infrastructure tested; no working production session                   | Add server revocation, map adapter, validate server cookie removal and remote failure UX                           |
| Organizations                 | Authorized list/detail/create/update/archive               | No source or runtime actions. ID-015 onward are planning cards                                                    | Availability page; create disabled; no API functions, fake lists, or guessed generated module      | Implement runtime contracts and memberships, snapshot/generate, add schemas/hooks/CRUD/tests                       |
| Organization switching        | Fresh memberships and authorized organization detail       | No accessible-organizations endpoint                                                                              | Switcher explains availability; validated cache-switch utility tested, not wired to fictional data | Query fresh memberships, reject revoked IDs, cancel old requests, mount new route, refetch permissions             |
| Authorization                 | Effective permissions at exact organization/resource scope | ID-039 is proposed only; no callable endpoint or seeded catalog verified                                          | Exact-scope deny-by-default utility and route guard tested                                         | Generate verified permission types/codes and wire a fail-closed query; invalidate on 403, switch and grant changes |
| Teams                         | Team CRUD, search, pagination, members, assignments        | No Teams controller, module contract, or Swagger paths. Identity ERD resource scopes do not establish a Teams API | Availability page; create disabled; scoped URL skeleton only                                       | Owning module must publish real team/member endpoints and permissions before implementing vertical slice           |
| Tenant revocation             | Authoritative membership/resource checks                   | Not browser-accessible today                                                                                      | UI makes no tenant data requests; infrastructure removes caches on switch/session end              | Test membership revocation with real 403s, remove affected tenant queries and redirect to an authorized selection  |

## Real integration checks versus mocks

The current frontend retains the existing Axios registration transport and generated
types. Installing `openapi-fetch` does not add an API integration; migration remains
unverified. UI composition fixes and local browser tests do not change the backend
capabilities listed above.

The backend readiness endpoint returned Healthy with PostgreSQL reachable. Live
Swagger was downloaded. An intentionally invalid registration submitted through
the Vite `/api` proxy returned HTTP 400 with the actual failure envelope. This
checks routing and error transport without creating an account. It does **not**
prove successful registration persistence, verification delivery, login, rotation,
authorization, organizations, or teams. Those integrations remain unverified or
missing as shown above. The `202` acceptance path is verified by MSW, not by the
real database. There is no runtime demonstration mode and MSW is test-only.

## Integration procedure

Implement one backend contract and its authorization first. Start Identity using
its documented dependencies. From this frontend run `npm run api:pull`, inspect
the snapshot diff, then `npm run api:generate` and `npm run api:check`. Add typed API
functions and hooks only for endpoints that now exist. Add runtime shape validation
where backend metadata is incomplete. Replace availability screens when the full
user workflow can succeed. Run negative authorization and tenant isolation checks
in a designated test environment before calling the feature integrated.

No Organizations/Teams generated files are created because no module specifications
exist. The absence is intentional; empty generated contracts would imply evidence
that is not present.
