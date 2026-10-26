# Docker, CI and deployment

## Development versus release

Vite dev serves source with Fast Refresh and a development API proxy. `npm run build`
checks TypeScript and emits static HTML/CSS/JS in dist. `npm run preview` previews
that build but does not reproduce the dev API proxy. The production Docker image
uses Nginx, not a Vite development server.

Dockerfile has a Node build stage and an Nginx runtime stage. Node 24.21.0-alpine
runs npm ci from package-lock, then builds. Only dist and the Nginx template enter
the runtime, excluding source, node_modules and secrets. The runtime image is
nginxinc/nginx-unprivileged:1.28.0-alpine, runs as UID 101, and listens on port 8080.
Pinned release tags make upgrades deliberate; review/update base-image versions
and optionally digest pins as part of maintenance rather than using latest.

## Build and run on Windows

```powershell
Set-Location D:\Projects\Task-Management-FE
docker build -t devflow-frontend:local .
docker run --rm --name devflow-frontend -p 127.0.0.1:8088:8080 -e API_UPSTREAM=http://host.docker.internal:8081 devflow-frontend:local
```

Open `http://localhost:8088`. Run this in another PowerShell window to check it:

```powershell
Invoke-WebRequest http://localhost:8088/healthz
Invoke-WebRequest http://localhost:8088/organizations/example/teams
docker exec devflow-frontend nginx -t
docker exec devflow-frontend id
docker logs devflow-frontend
docker stop devflow-frontend
```

The sample nested path returns SPA HTML, then the anonymous router redirects to
the honest login availability page. That is a route fallback check, not permission
to access an example organization. --rm removes the stopped test container; it
does not remove the image or any backend data.

Docker Desktop resolves host.docker.internal to the Windows host. On a Linux
Docker host, use --add-host=host.docker.internal:host-gateway or set API_UPSTREAM to
the actual backend service on an existing shared Docker network. Container
localhost refers to that container, not Windows or another service. This repository
does not create extra deployment networks or backend infrastructure.

## API proxy and environment

Nginx envsubst renders deploy/nginx.conf.template when the container starts.
API_UPSTREAM changes where /api/ goes and preserves the original path. It defaults
to the inspected Docker Desktop backend address. Provide a reachable backend
hostname; Nginx may fail startup if that upstream cannot resolve.

VITE_APP_NAME and VITE_API_BASE_URL are build arguments. For a different visible
app name while retaining same-origin /api:

```powershell
docker build --build-arg VITE_APP_NAME=DevFlow --build-arg VITE_API_BASE_URL=/api -t devflow-frontend:local .
```

Changing VITE variables on an already-built container does not rewrite JavaScript.
Prefer keeping /api and changing only server-side API_UPSTREAM between environments.
The default CSP permits same-origin connections. A deliberately cross-origin
browser API requires a reviewed connect-src change plus backend CORS and cookie
policy; simply changing the build URL is insufficient.

No frontend env file may contain secrets. .dockerignore excludes all .env files
and .git/node_modules/dist/test artifacts. Real runtime credentials remain at the
backend or infrastructure secret store. TLS terminates at the deployment ingress;
use HTTPS outside local development. HSTS is an ingress responsibility after HTTPS
is correctly deployed, not a promise made by this local HTTP container.

## Static serving behavior

- Nonexistent document paths fall back to index.html for SPA routing.
- Missing /assets files return 404 so broken deploys are visible.
- /api/ responses come from the upstream; errors are not disguised as SPA HTML.
- Content hashes allow year-long asset caching; documents use no-cache expiration.
- /healthz checks only the static server. It does not prove the backend is healthy.
- Security headers include CSP, frame denial, nosniff and restricted device permissions.
  Inline styles are allowed for Base UI/Radix positioning and component variables;
  inline scripts are not. Geist font assets are bundled with the app and served
  under the same-origin `font-src 'self'` policy; an external font service is not needed.
- No source maps are enabled in the production build.

## GitHub Actions

`.github/workflows/ci.yml` installs the selected Node version, runs npm ci,
format/lint/types, contract drift, unit/component tests, DESIGN.md validation,
and production build, then installs Chromium with system dependencies, runs
Playwright browser/axe checks, and builds Docker.
It needs only contents:read and cancels superseded runs on the same ref. The workflow
does not deploy or need a live backend because generation uses a committed snapshot
and HTTP integration tests use MSW; the current browser flows do not submit a valid
registration to a server. Consult the actual Actions run for hosted results.
Consider pinning Actions to reviewed commit SHAs under your
organization's supply-chain policy when maintaining CI.

## Deployment acceptance

Verify the real HTTPS origin, refresh a nested route, confirm assets and CSP,
request a known API validation error, inspect container health/logs and ensure no
secret appears in browser assets. Check that Geist fonts load from local assets,
the Nova components retain their intended styling, and the changed layouts follow
[DESIGN.md](../DESIGN.md). Design validation does not establish complete dark
coverage or replace browser visual checks. Real successful registration, session cookies,
tenant permissions and CRUD need separate backend acceptance. Record which checks
were performed in plans/verification.md; do not promote a healthy static server
to an end-to-end product health claim.
