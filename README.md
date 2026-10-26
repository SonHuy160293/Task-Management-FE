# DevFlow frontend

Start with the [product context](PRODUCT.md), [design contract](DESIGN.md), and
[contributor instructions](AGENTS.md). See [frontend architecture](docs/frontend-architecture.md),
[the .NET developer guide](docs/frontend-for-backend-devs.md),
and [deployment](docs/deployment.md) for implementation guidance.

A React/TypeScript foundation for DevFlow, a multi-tenant engineering management
platform. This repository includes a responsive workspace shell, real Identity
registration integration, tested session/tenant infrastructure, production Docker,
CI, and a learning path for a .NET developer moving into frontend work.

**Scope is constrained by the actual backend.** The backend review recorded on
2026-10-25 found registration and an internal service-key user lookup. Browser login,
sessions, organizations, permissions and teams are not implemented there. This
frontend makes no fabricated requests or runtime mock substitutions for those
features. See [backend integration gaps](docs/backend-integration-gaps.md) and the
frontend's [capability inventory](src/config/capabilities.ts); recheck actual
backend contracts before enabling a workflow.

## 1. Technology stack

React 19, strict TypeScript 5.9, Vite 8, React Router, and Tailwind CSS 4.
Owned shadcn/ui components use the Nova (`base-nova`) preset with Base UI
primitives; the older application shell also uses Radix directly. Geist Variable
is bundled locally, and Lucide supplies icons.

TanStack Query 5 owns server state; Zustand 5 holds shared UI state. Forms use
React Hook Form 7 and Zod 4. The current API transport is Axios with generated
OpenAPI types; the installed `openapi-fetch` package is not a completed transport
migration. Vitest, React Testing Library, and MSW cover unit/component tests;
Playwright and axe cover selected browser flows. ESLint, Prettier, TypeScript,
and Google DESIGN.md validation provide quality checks.

[package.json](package.json) and [package-lock.json](package-lock.json) define
the current versions. [Technology versions](docs/technology-versions.md) records
the original compatibility decisions; it is not a complete current dependency list.

## 2. Architecture and folder guide

Feature-based, with no frontend replica of backend Domain/Application/Infrastructure
layers. Pages compose features, hooks own request lifecycle, API functions own
typed transport, and lib owns shared invariants.

| Path                                               | Responsibility                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/main.tsx`, `src/app`                          | React entry point, application providers, and global styles                             |
| `src/features/auth`                                | Registration API, schema, hook, form, pages, and colocated tests                        |
| `src/features/organizations`, `src/features/teams` | Explicit availability pages for missing backend capabilities                            |
| `src/components/ui`                                | Owned Nova/shadcn UI primitives                                                         |
| `src/components/common`, `src/components/layout`   | Shared feedback states, headings, branding, and workspace shell                         |
| `src/config`                                       | Validated environment settings and backend capability inventory                         |
| `src/hooks`                                        | Shared hooks, including mobile viewport detection                                       |
| `src/lib`                                          | HTTP/errors, memory sessions, permission checks, scoped query keys, and utilities       |
| `src/routes`                                       | Lazy routes, guards, navigation, and foundation pages                                   |
| `src/stores`                                       | Shared client/UI state; currently sidebar state                                         |
| `src/api/generated/identity`                       | Generated Identity TypeScript contracts; do not edit manually                           |
| `contracts/identity`, `scripts`                    | Reviewed OpenAPI snapshot, download, generation, and drift checks                       |
| `src/test`                                         | Test-only MSW server, render helper, and setup; unit/component tests live beside source |
| `tests`, `playwright.config.ts`                    | Browser E2E tests with desktop/mobile projects and axe checks                           |
| `public`                                           | Static assets, including the favicon                                                    |
| `docs`, `plans`                                    | Learning guides, architecture decisions, checklists, and recorded verification evidence |
| `deploy`, `Dockerfile`                             | Nginx reverse-proxy/SPA configuration and production container build                    |
| `.github/workflows`, `.husky`                      | CI checks and staged-file pre-commit checks                                             |

The `@/` import alias points to `src/`, configured in `tsconfig.json` and
`vite.config.ts`. Tailwind v4 is configured through the Vite plugin and
`src/app/styles/globals.css`, with no separate `tailwind.config.js`.
See [architecture](docs/architecture.md) for diagrams and dependency direction.

## 3. Design system

[DESIGN.md](DESIGN.md) is the contract for all UI work; [PRODUCT.md](PRODUCT.md)
defines product context and [AGENTS.md](AGENTS.md) defines contributor rules.
Preserve the Linear-inspired, information-dense productivity direction: restrained
surfaces, clear hierarchy, compact controls, visible focus, and useful feedback.

The implementation lives in [components.json](components.json),
[globals.css](src/app/styles/globals.css), and the owned components under
`src/components/ui`. Keep the Nova neutral theme, Geist Variable, and Lucide.
Reuse semantic utilities such as `bg-background`, `text-muted-foreground`, and
`border-border`; do not add another theme, token stylesheet, or component library.
Base UI uses `render` for composition where supported; existing Radix components
use `asChild`. Check the actual component API before composing them.

When tokens or component defaults change, update DESIGN.md in the same change
and compare it with the actual CSS and components. The installed Google DESIGN.md
CLI is v0.4.0; its document format version is `alpha`:

```powershell
npm exec -- designmd spec
npm run design:lint
```

Validation checks the document, not implementation parity or screen accessibility.
Light/dark tokens exist, but complete dark screen coverage and theme switching
remain documented gaps. UI changes must consider loading, empty, success, error,
disabled and permission states, keyboard use, long content, responsive layout,
contrast, and reduced motion. See the [styling guide](docs/styling-guide.md).

## 4. Prerequisites

Node **24.21.0** from `.nvmrc`, npm **11.x** (`packageManager` pins 11.19.0),
Git and PowerShell for the commands below. Docker Desktop with Linux
containers is optional for packaging. No global React/Vite installation is needed.

## 5. Installation and running

```powershell
Set-Location D:\Projects\Task-Management-FE
npm ci
Copy-Item .env.development.example .env.development
npm run dev
```

Copy the example only on first setup; do not overwrite an existing local env file.
Open **http://127.0.0.1:5173** and stop the server with Ctrl+C. If npm.ps1 is blocked,
use npm.cmd with the same arguments. The shell runs without a backend; registration
requires the configured Identity API.

## 6. Environment configuration

Development defaults:

```dotenv
VITE_APP_NAME=DevFlow
VITE_API_BASE_URL=/api
DEV_API_PROXY_TARGET=http://localhost:8081
```

Restart Vite after edits. VITE_ variables are public and build-time; never put
secrets in them. Development `/api` proxying avoids browser CORS friction. Production
uses a same-origin Nginx proxy controlled at startup by API_UPSTREAM. Examples for
development, staging and production are included; copy only the one you need.
For staging, create .env.staging from its example and run
`npm run build -- --mode staging`. See [API configuration](docs/api-integration.md).

## 7. Connecting the backend

The backend review used the adjacent `D:\Projects\Task-Management` repository.
Its documented Identity Compose stack exposes port 8081, with PostgreSQL, Redis and migrations.
Follow that backend's deploy/README.md to create its ignored .identity.env and
replace all required secret placeholders **before** startup:

```powershell
Set-Location D:\Projects\Task-Management
docker compose --env-file deploy/env/.identity.env -f deploy/compose/docker-compose.identity.yaml up -d --build --wait
Invoke-RestMethod http://localhost:8081/health/ready
```

The frontend does not edit backend code or secrets. The running Swagger endpoint is
http://localhost:8081/swagger/v1/swagger.json. Do not use the internal Users endpoint
or its integration key in the browser. A healthy API is not proof of account
creation, email delivery or missing business workflows.

## 8. Authentication and organization context

Registration sends POST /api/v1/auth/register, validates inputs and safely handles
runtime response envelopes. Acceptance protects account privacy and does not log
in or promise email delivery. The current login page explains the absent endpoint.

Session infrastructure holds tokens in memory, coordinates refresh and guards
against logout races; production intentionally has no unverified session adapter.
No refresh token is stored in browser storage. Organization-aware route skeletons
are protected. Tenant cache keys, switching cleanup and exact-scope permission
matching are tested, but there are no live organization selections/permission queries.
Read [authentication](docs/authentication.md) and [authorization](docs/authorization.md).

## 9. Available features

| Status                              | Features                                                                                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implemented, automated checks       | Responsive shell, mobile menu, breadcrumbs, page search, user menu, registration validation/mutation/errors, loading/error/empty/not-found states, generated contracts |
| Infrastructure tested with fixtures | Session initialization/rotation/logout, protected/permission routes, tenant query isolation/switching/cache cleanup                                                    |
| Backend transport checked           | Live Swagger/readiness; invalid registration HTTP 400 through Vite and Docker proxies                                                                                  |
| Success integration unverified      | Real registration acceptance/persistence and verification delivery                                                                                                     |
| Blocked by missing backend          | Browser login/profile/session, organizations CRUD/memberships, effective permissions, team CRUD/search/members                                                         |
| Outside current scope               | Projects, work items, goals, reporting and other future business modules                                                                                               |

The backend transport row summarizes recorded checks in the gap register, not a
live health report. Planned domains include Projects, Tasks, KPI/OKR, Performance,
and Risk/Issue/Blocker Management; installed dependencies do not imply those
workflows are implemented.

### Current routes

| Route                                          | Purpose                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `/`                                            | Workspace overview                                               |
| `/register`                                    | Registration form connected to the configured Identity API       |
| `/login`                                       | Login availability explanation                                   |
| `/organizations`, `/teams`                     | Backend capability/availability pages                            |
| `/identity`, `/settings`, `/guide`             | Identity status, connection configuration, and learning guidance |
| `/organizations/:organizationId`               | Protected organization route skeleton                            |
| `/organizations/:organizationId/teams`         | Protected team-list route skeleton                               |
| `/organizations/:organizationId/teams/:teamId` | Protected team-detail route skeleton                             |

Protected routes are UX guards, not security boundaries. Scoped route skeletons
do not provide organization/team CRUD or establish an authenticated session.

## 10. npm scripts

| Script                | Action                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------- |
| dev                   | Vite development on 127.0.0.1:5173 with API proxy                                         |
| build                 | Strict type check, then production bundle in dist                                         |
| preview               | Static production preview on port 4173; no development API proxy                          |
| lint                  | ESLint with zero warnings                                                                 |
| typecheck             | tsc --noEmit                                                                              |
| format / format:check | Write/check Prettier formatting                                                           |
| test / test:run       | Vitest watch / single run                                                                 |
| test:coverage         | Single run plus V8 coverage                                                               |
| test:e2e              | Playwright desktop/mobile browser tests, including an axe check                           |
| test:e2e:ui           | Playwright interactive test runner                                                        |
| api:pull              | Download live Identity Swagger into reviewed snapshot                                     |
| api:generate          | Generate types from local snapshot                                                        |
| api:check             | Verify generated types match snapshot                                                     |
| design:lint           | Validate DESIGN.md with the installed Google DESIGN.md CLI                                |
| verify / check        | Format, lint, types, generation drift, unit/component tests, design validation, and build |

Use `npm run <script>` for the commands above (`npm test` also starts watch mode).
The `prepare` lifecycle script installs Husky hooks; the pre-commit hook runs
lint-staged on changed JavaScript/TypeScript and document/style/config files.
`verify` does not run Playwright or build Docker images; CI adds those checks.

## 11. OpenAPI generation

```powershell
npm run api:pull
git diff -- contracts/identity/openapi.json
npm run api:generate
npm run api:check
```

Normal builds need no backend. Review DTO changes and keep snapshot/generated output
together when committing later. No manual generated edits. Swagger currently omits
the active runtime envelope; handwritten API parsing bridges that documented gap.
No Organizations/Teams contracts are generated from unimplemented plans.

## 12. Tests and verification

```powershell
npm run verify
```

MSW is test-only and unexpected HTTP calls fail. Session/tenant tests use synthetic
adapters/fixtures, not real backend sessions. See [testing](docs/testing-guide.md)
and [executed verification evidence](plans/verification.md).

Run browser checks separately after installing Chromium once:

```powershell
npx playwright install chromium
npm run test:e2e
```

Playwright starts Vite automatically and runs desktop Chrome and Pixel 5 viewport
projects using Chromium. The tests cover registration validation, search dismissal,
mobile navigation, and an axe scan of registration. Device emulation does not
replace testing on real mobile hardware, and an automated axe scan is not a full
accessibility audit. No backend is needed for these validation/navigation checks.

## 13. Debugging

Start with Console and Network in browser DevTools, then the Vite/API terminal.
Read [debugging-guide.md](docs/debugging-guide.md) for symptom/cause/fix/verification
walkthroughs covering white screens, types, styles, env, network, CORS, cookies,
401/403, cache, routes and Docker. Redact credentials before sharing any request.

## 14. Git conventions

Use focused `codex/` branches by default and review the diff before committing.
Keep generated contracts with their snapshots and include docs/tests for behavior
changes. Ignore local env files, node_modules, dist and coverage. No commit or push
is required to run local verification. Contributor rules live in [AGENTS.md](AGENTS.md).

## 15. Docker

```powershell
docker build -t devflow-frontend:local .
docker run --rm --name devflow-frontend -p 127.0.0.1:8088:8080 -e API_UPSTREAM=http://host.docker.internal:8081 devflow-frontend:local
```

Visit http://localhost:8088. Runtime uses UID 101 and Nginx on port 8080, serves SPA
fallbacks, preserves API errors and includes security headers/health check. See
[Docker and deployment](docs/docker-and-deployment.md) for Linux host networking,
configuration, logs and shutdown.

## 16. CI

GitHub Actions in [.github/workflows/ci.yml](.github/workflows/ci.yml) runs on
pushes and pull requests. It installs dependencies, checks formatting, lint,
types, generated contract drift, unit/component tests, and DESIGN.md; builds the
production bundle; installs Chromium with system dependencies; runs Playwright;
and builds the Docker image. It does not deploy. Consult the actual Actions run
for hosted verification results.

## 17. Adding a feature

Read PRODUCT.md, DESIGN.md, and AGENTS.md first. Check the actual backend endpoint
and permissions, regenerate contracts, create an
API function/query hook/schema/form/page, add scoped routes and observable tests,
verify the real backend separately, then update docs. Reuse the existing feature
folders, semantic tokens, and component variants; keep shareable filters/pagination
in the URL and tenant-sensitive server data in appropriately scoped Query caches.
Run `npm run verify`, relevant browser checks, and review desktop/mobile behavior
for visible changes. The detailed
[Project feature walkthrough](docs/feature-development-guide.md) explains each
step without inventing a Project API.

## 18. Learning documentation — recommended order

For a complete beginner, start with [Build a feature by hand](docs/manual-feature-tutorial.md).
It explains every step through a local practice task list, then traces real
registration and shows how to approach future verified backend features. The
guides below remain shorter topic references.

1. [Getting started](docs/getting-started.md)
2. [Frontend fundamentals](docs/frontend-fundamentals.md)
3. [React and TypeScript](docs/react-and-typescript.md)
4. [Styling guide](docs/styling-guide.md)
5. [Architecture](docs/architecture.md)
6. [State management](docs/state-management.md)
7. [API integration](docs/api-integration.md)
8. [Authentication](docs/authentication.md) and [authorization](docs/authorization.md)
9. [Feature development guide](docs/feature-development-guide.md)
10. [Testing](docs/testing-guide.md) and [debugging](docs/debugging-guide.md)
11. [Docker and deployment](docs/docker-and-deployment.md)
12. [Architecture decisions](docs/architecture-decisions.md), [technology versions](docs/technology-versions.md), [glossary](docs/glossary.md)

## 19. Backend integration gaps and known limitations

The [gap register](docs/backend-integration-gaps.md) records source evidence,
missing contracts, frontend status and completion steps for each blocked workflow.
Organization/team CRUD/member screens and real authentication are **not completed**.
There is no runtime demo data, offline fallback or future business-module implementation.
Dark theme variables are available, but fixed light colors remain in the shell
and global helper styles; a theme switcher and complete dark coverage are not
implemented. Consult DESIGN.md's known gaps before changing those areas.
Single-tab refresh coordination is tested; cross-tab sessions and real cookie/CSRF
behavior need backend contracts. Browser visual checks and local Docker checks do
not substitute for full backend acceptance or a formal accessibility/security audit.
