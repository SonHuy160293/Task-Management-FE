# Getting started: from .NET to DevFlow frontend

## What runs where

Your ASP.NET Core process receives HTTP and returns data. This frontend is a
program downloaded into each user's browser. HTML describes the page, CSS lays it
out, and JavaScript responds to interaction. TypeScript adds compile-time checks
to JavaScript; the browser receives JavaScript after Vite compiles the source.
Browser code is visible to users and cannot keep a server secret.

React turns small component functions into interactive DOM elements. Vite serves
the source during development, refreshes changed modules, and builds optimized
static assets for release. Node.js runs Vite, tests, and npm tools on your machine;
the production browser does not need Node. npm installs packages and invokes scripts.

## Prerequisites

- Windows PowerShell or PowerShell 7, Git, and an editor such as VS Code.
- Node **24.21.0 LTS**, npm **11.x**. `.nvmrc` records the selected Node release.
- Optional: Docker Desktop using Linux containers for the production image.
- Optional for registration integration: the DevFlow Identity API and dependencies.

Check installation:

```powershell
node --version
npm --version
git --version
```

Install the selected Node version through your preferred trusted Node installer or
existing Windows version manager. Do not install frontend packages globally.

## First run

From this checkout:

```powershell
Set-Location D:\Projects\Task-Management-FE
npm ci
Copy-Item .env.development.example .env.development
npm run dev
```

Copy the example only on first setup; preserve your existing environment file.
Open `http://127.0.0.1:5173`. Keep the terminal running. Press **Ctrl+C** to stop it.
If PowerShell blocks `npm.ps1`, use `npm.cmd ci` and `npm.cmd run dev`; changing the
machine's script-execution policy is unnecessary.

`npm ci` uses `package-lock.json`, removes an existing dependency installation, and
installs exactly that dependency tree. It fails if package.json and the lock disagree.
Use `npm install` when intentionally adding/updating packages, then review both files.

## Backend connection

The shell and learning pages run without a backend. Registration needs Identity.
In `.env.development`, `/api` goes through Vite to `http://localhost:8081`. Adjust
`DEV_API_PROXY_TARGET` for another Identity host, preserving its protocol and port.
Restart Vite after editing environment variables. The browser still sends requests
to `/api/v1/auth/register` on port 5173; Vite forwards the path unchanged.

For the adjacent backend, follow the inspected setup in
`D:\Projects\Task-Management\deploy\README.md`: create its ignored `.identity.env`
with four independent real secrets, then:

```powershell
Set-Location D:\Projects\Task-Management
docker compose --env-file deploy/env/.identity.env -f deploy/compose/docker-compose.identity.yaml up -d --build --wait
Invoke-RestMethod http://localhost:8081/health/ready
```

That command assumes the backend's required env file has already been configured.
It starts PostgreSQL, Redis, migrations and Identity. The frontend does not create
those secrets or change the backend. See [API integration](api-integration.md).

## Your first change

Read [PRODUCT.md](../PRODUCT.md), [DESIGN.md](../DESIGN.md), and
[AGENTS.md](../AGENTS.md) first. Preserve Nova (`base-nova`), the neutral theme,
Geist Variable, and Lucide; the design contract explains the visual rules and gaps.

Open `src/routes/pages/overview-page.tsx`. Find the `PageHeading` title `A better
flow starts here.` and edit the text inside its quotes. Save the file and watch
the browser update. This is Fast Refresh. If you break a JSX tag or import, Vite
shows an error overlay; fix the source and save again.

Next, inspect `--primary` in `src/app/styles/globals.css` and trace its
`@theme inline` alias to a `bg-primary` button in DevTools. These semantic roles
keep the interface consistent. Use temporary DevTools edits to learn how a token
affects multiple controls, then reload to restore the selected theme. A deliberate
token change must update DESIGN.md and both theme values, with contrast checks;
do not reapply a preset or add a second stylesheet for this exercise.

Use `npm exec -- designmd spec` to read the installed Google DESIGN.md v0.4.0
CLI's `alpha` format and `npm run design:lint` to validate the document. The
linter does not compare it with CSS. See [styling](styling-guide.md) for the
existing component APIs and [testing](testing-guide.md) for browser review.

## Everyday commands

| Command                            | Purpose                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`                      | Development server with Fast Refresh and `/api` proxy                          |
| `npm run build`                    | Type check, then generate `dist/`                                              |
| `npm run preview`                  | Serve the existing production build on port 4173; no dev API proxy             |
| `npm run lint`                     | Find unsafe or inconsistent source patterns                                    |
| `npm run typecheck`                | Check TypeScript without emitting files                                        |
| `npm run format`                   | Rewrite formatting consistently                                                |
| `npm run format:check`             | Check formatting without writing                                               |
| `npm test`                         | Watch tests, rerunning affected files                                          |
| `npm run test:run`                 | Run tests once, suitable for CI                                                |
| `npm run test:coverage`            | Run tests and collect V8 coverage                                              |
| `npm run test:e2e`                 | Run Playwright desktop/mobile flows and the registration axe check             |
| `npm run test:e2e:ui`              | Open Playwright's interactive test runner                                      |
| `npm run api:pull`                 | Download current Identity Swagger into the snapshot                            |
| `npm run api:generate`             | Generate TypeScript from the committed snapshot                                |
| `npm run api:check`                | Fail if generated types differ from the snapshot                               |
| `npm run design:lint`              | Validate DESIGN.md's format, references, and declared color pairs              |
| `npm run verify` / `npm run check` | Format, lint, types, contracts, unit/component tests, design validation, build |

Run `npm run verify` before handing off changes. Install Chromium once with
`npx playwright install chromium`, then run browser tests separately with
`npm run test:e2e` for UI changes; `verify` does not include them. If you are new to the browser,
continue with [frontend fundamentals](frontend-fundamentals.md), then
[React and TypeScript](react-and-typescript.md).
