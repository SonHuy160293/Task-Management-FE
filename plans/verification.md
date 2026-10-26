# Verification evidence — 2026-10-25

## Environment

- Windows PowerShell, Node 24.21.0, npm 11.19.0, Docker Desktop engine 29.7.2.
- Empty frontend repository at D:\Projects\Task-Management-FE; GitHub remote.
- Backend source inspected read-only at D:\Projects\Task-Management.
- Runtime Identity Swagger/readiness available on http://localhost:8081.
- No commit, push, backend modification, environment-secret overwrite or publication.

## Executed quality checks

| Check                   | Actual result                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------- |
| npm dependency install  | Passed with exact compatible pins; no force/legacy-peer-deps                           |
| Clean Windows npm ci    | Passed: 400 packages installed from lockfile                                           |
| Linux image npm ci      | Passed: 400 packages installed in Node build stage                                     |
| npm ls --depth=0        | Passed; all selected direct dependencies resolved                                      |
| npm run format:check    | Passed in complete quality gate                                                        |
| npm run lint            | Passed with zero warnings                                                              |
| npm run typecheck       | Passed with strict mode and unchecked-index protection                                 |
| npm run api:check       | Passed against checked-in runtime Swagger snapshot                                     |
| npm run test:run        | 57 tests across 7 files passed after final behavior fixes                              |
| npm run build           | Passed; lazy route chunks plus framework/validation chunks, no oversized-chunk warning |
| Docker build            | Passed with pinned Node/Nginx stages                                                   |
| Nginx configuration     | nginx -t passed                                                                        |
| Runtime identity/health | UID 101; Docker health status healthy                                                  |
| Static health endpoint  | GET /healthz -> 200 text/plain                                                         |
| SPA nested path         | GET /organizations/any/teams -> 200 text/html                                          |
| Missing asset           | GET /assets/missing.js -> 404                                                          |
| API error preservation  | GET /api/missing -> 404 application/json from backend                                  |
| Security headers        | CSP returned on successful and failing requests; other headers configured in Nginx     |
| Documentation links     | Local README/learning links checked; verification file included                        |

The complete quality gate passed again after the clean install. Changes after the
first build included public auth omission,
collapsed-field error focus, safe return paths, readable metadata and chunk splitting.

## Browser observations

The local app rendered in the in-app browser at a narrow viewport. Checked overview,
mobile navigation opening, organization route navigation/disabled create/clear
integration state, page search filtering and registration required-field validation
with focus on Full name. A screenshot is saved in ignored artifacts/devflow-preview.png.

The final production image also rendered the overview and registration pages, and
required-field validation focused Full name correctly. Visual inspection did not
cover a separately resized desktop viewport. No claim of
a complete WCAG audit is made. Semantic labels, skip link, main focus, focus styling,
Radix modal/menu behavior and reduced-motion CSS are implemented; screen-reader,
full keyboard and contrast audits remain useful follow-up acceptance work.

## Real-backend evidence (distinct from MSW)

- Downloaded /swagger/v1/swagger.json; inspected real paths and DTO metadata.
- /health/ready returned Healthy with PostgreSQL reachable.
- Intentionally invalid registration through Vite /api proxy returned 400 with
  success=false, data=null, Request.BadRequest and a traceId.
- Intentionally invalid registration through Nginx /api proxy returned the same
  HTTP 400 error shape. No valid account was created as part of these checks.

This verifies proxy transport/error handling, not successful account persistence.
The registration acceptance UI is covered using a mock 202. Real success/persistence,
email delivery/verification, login, token cookies/rotation/logout, membership,
effective permissions and organization/team CRUD are not verified against a backend.
Most of those endpoints are absent; see docs/backend-integration-gaps.md.

## Execution restrictions and fixes

The default sandbox initially blocked registry access (ENOTCACHED) and native Vite
child processes (EPERM). Authorized executions completed installation/tests/builds.
Latest TypeScript/resolver majors produced declared peer conflicts; compatible
versions were selected and documented. Initial source/test failures were fixed and
rerun, including MSW 3's renamed onUnhandledFrame setting, friendly empty-email
validation and error-focus behavior. No known type/lint/test/build failure is waived.

## CI and cleanup

GitHub Actions was configured, but a hosted run requires the owner's later
commit/push. Local checks exercise its commands; hosted execution is unverified.
The task's Vite server and temporary Docker QA container are stopped after checks.
The built image and local source remain available. Other backend containers/data
are preserved.
