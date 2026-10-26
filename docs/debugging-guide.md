# Debugging DevFlow

Start with the first failure and the boundary it belongs to. Capture the URL,
method/status, safe response message and trace ID. Never share a password,
Authorization header, refresh cookie, full Axios error or unredacted request body.

## White screen or rendering crash

**Symptoms:** blank content, error boundary or Vite overlay. **Likely causes:** JSX
syntax, missing module, runtime throw, invalid build config or stale cached chunks.
**Investigate:** Console's first relevant error and terminal output; confirm the
index script and page chunk load in Network. **Fix:** correct source/import/config,
or reload after a deployment updates chunk names. **Verify:** npm run typecheck,
npm run build and revisit the same URL. A render boundary cannot repair a missing
JavaScript bundle; distinguish network loading from component errors.

## TypeScript errors and missing imports

**Symptoms:** tsc exits nonzero or the editor underlines a symbol. **Likely causes:**
wrong generated property name, unchecked nullable value, stale schema or an alias
configured in only one tool. **Investigate:** read the exact file/line and expected
type, then inspect generated DTOs. **Fix:** narrow unknown/null, regenerate after
reviewing OpenAPI, and use the actual export. Both Vite and tsconfig map @/ to src.
**Verify:** npm run typecheck. Avoid `any` or assertions that only silence the problem.

## Tailwind styles missing or unexpected

**Symptoms:** unstyled controls, spacing ignored, wrong token color. **Likely causes:**
globals.css import removed, Tailwind plugin missing, dynamically constructed class,
or conflicting utilities/specificity. **Investigate:** Elements -> Styles/Computed;
search the generated CSS for the expected class. **Fix:** import the stylesheet in
main.tsx, use complete class names and cn for overrides, edit semantic variables
for shared colors according to [DESIGN.md](../DESIGN.md). Keep the Nova neutral
theme, Geist font, and Lucide icons. Tailwind v4 configuration lives in the CSS
and Vite plugin; do not add a separate Tailwind config. **Verify:** browser reload
and production build, plus narrow layout. For changed tokens/defaults, update
DESIGN.md and run `npm run design:lint`, then compare against actual CSS values.

## Component composition or theme mismatch

**Symptoms:** a trigger does not work, nested buttons appear, or `asChild` is
rejected by TypeScript. **Likely causes:** a Radix example copied into a Base UI
component, mixed roots/children, or an assumed catalog component not installed
locally. **Investigate:** inspect `components.json` (`base-nova`) and the owning
`src/components/ui` file. The older shell still imports Radix directly.
**Fix:** use the installed component API: Base UI composes through `render`,
Radix through `asChild`. A Base UI Button rendered as a Link needs
`nativeButton={false}`. **Verify:** typecheck, keyboard/focus behavior, and actual
rendered semantics; see [styling](styling-guide.md).

**Symptoms:** dark canvas with light-only areas, or an unexpected font.
**Investigate:** check the `.dark` ancestor, computed semantic variables, the
`@theme inline` bridge, and loaded local Geist assets. Fixed slate/indigo/white
styles and global helpers remain documented gaps; no app theme switcher is wired.
**Fix:** follow DESIGN.md during relevant UI work, reuse semantic roles, and
preserve the bundled font import. A present `next-themes` dependency or generated
Toaster wrapper does not make theme support complete. **Verify:** both themes
and actual contrast; document any remaining coverage gaps.

## Wrong environment or API base

**Symptoms:** requests reach port 5173 with HTML, a previous backend URL, or an
invalid configuration error. **Likely causes:** mode-specific env overrides, missing
VITE_ prefix, stale server, build-time value changed only at runtime. **Investigate:**
Settings shows the compiled API base; Network shows actual URLs. Inspect local env
files without sharing secrets. **Fix:** set VITE_API_BASE_URL=/api and correct
DEV_API_PROXY_TARGET for dev, then restart Vite; rebuild production for VITE changes.
**Verify:** expected URL/status in Network and backend-integration-gaps evidence.

## API connection refused, timeout or 502

**Symptoms:** connectivity message, proxy error, timeout, gateway failure. **Likely
causes:** Identity stopped, wrong port/protocol, backend dependencies unavailable,
container-to-host address wrong. **Investigate:** test localhost:8081/health/ready,
Swagger and backend/container logs. **Fix:** follow the backend's documented Compose
setup; update the proxy target. Do not disable TLS validation to bypass certificates.
**Verify:** readiness, then an intentionally invalid request to confirm routing/error
transport; successful persistence needs a separate test environment.

## CORS blocked

**Symptoms:** browser Console mentions CORS; PowerShell request succeeds. **Likely
causes:** cross-origin API base without exact backend origin/method/header allowlist,
credentials configured inconsistently. **Investigate:** preflight OPTIONS response,
Origin and Access-Control-* headers. **Fix:** use the dev same-origin /api proxy or
configure the backend's exact permitted origin; do not use wildcard credentials.
**Verify:** perform the request in the actual browser, not just PowerShell.

## 401 or repeated refresh

**Symptoms:** sign-in redirect, expired-session message, repeated unauthorized calls.
**Likely causes:** no session, expired access/refresh, incorrect bearer audience,
adapter recursively using the intercepted client. **Investigate:** count requests,
status sequence and whether an adapter exists. **Fix:** today, recognize login is
not implemented. When integrating, use raw refresh transport, one shared rotation
promise and the existing one-retry guard. Never loop until a request succeeds.
**Verify:** HTTP/session tests and real expiry/rotation tests after contracts exist.

## 403 or unavailable controls

**Symptoms:** access denied or Create organization/team disabled. **Likely causes:**
missing contract (current release), foreign tenant/scope or revoked membership.
**Investigate:** read Integration readiness; for future live features inspect the
authoritative permission response and server denial. **Fix:** connect missing
contracts, or clear affected tenant caches and refresh membership/access. Never
give everyone an Admin fallback. **Verify:** positive/negative exact-scope cases and
backend authorization. A token refresh should not be triggered by 403.

## Cookie or restoration problem

**Symptoms:** login vanishes after reload or no refresh cookie sent. **Likely causes:**
no restore endpoint (current release), wrong Path/Domain/SameSite/Secure,
cross-origin credentials omitted or browser cookie policy. **Investigate:** Network
Set-Cookie warnings and Application cookies without copying values. **Fix:** only
after verifying the backend contract, align cookie attributes, HTTPS and CSRF/
credentials policy. **Verify:** reload, expiration and logout in the real browser.
Do not move refresh tokens into localStorage as a workaround.

## Query cache shows old or foreign content

**Symptoms:** changed data not updating, previous organization visible. **Likely
causes:** missing invalidation, a key without organization/filter/scope, or obsolete
request not canceled. **Investigate:** inspect the exact query key and captured
mutation variables; determine which organization initiated the request. **Fix:**
include all result-defining inputs, pass AbortSignal, cancel/remove old tenant
queries and invalidate the original tenant after writes. **Verify:** tenant isolation
tests with delayed requests and a two-organization backend acceptance scenario.

## Route not found after refresh

**Symptoms:** Nginx 404 on a valid SPA path, or app's not-found view. **Likely causes:**
missing server fallback versus an unregistered client route. **Investigate:** inspect
the first document response and router.tsx. **Fix:** deploy the provided Nginx
try_files fallback for documents; register only implemented destinations. Missing
assets/API paths should remain 404 rather than receive index.html. **Verify:** hard
refresh a nested route and request /assets/missing.js and /api/missing separately.

## Docker networking/startup

**Symptoms:** container exits, 502 proxy, no healthy state. **Likely causes:** unresolved
API_UPSTREAM hostname, incorrect host mapping, occupied port or invalid Nginx template.
**Investigate:** docker logs, inspect health and nginx -t. **Fix:** use
host.docker.internal:8081 on Docker Desktop; on Linux add host-gateway or use a real
shared-network service DNS name. Publish host port 8088 to container 8080, not port 80. Do not point a container upstream to its own localhost unless backend is there.
**Verify:** /healthz, nested route, error proxy and docker exec ... id.

## npm installation or test tooling

**Symptoms:** ERESOLVE, ENOTCACHED or native spawn EPERM. **Likely causes:** unsupported
peer majors, offline registry policy, sandbox child-process restrictions. **Investigate:**
read the actual npm peer requirements and local execution policy. **Fix:** npm ci
from the lock; use compatible pinned versions documented in technology-versions.md.
Do not use --force/--legacy-peer-deps to conceal the mismatch. On this managed host,
authorized execution was needed for native Vite tooling. **Verify:** clean npm ci,
npm run verify and the Linux Docker build.
