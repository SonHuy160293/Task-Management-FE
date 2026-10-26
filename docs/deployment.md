# Deployment

See [Docker and deployment](docker-and-deployment.md) for the full procedure.
`npm run build` emits static assets in `dist`. The production Dockerfile serves
them with unprivileged Nginx on port 8080. Nginx returns `index.html` for SPA
routes, caches hashed `/assets/`, and proxies `/api/` to `API_UPSTREAM`. Set that
upstream to a reachable, trusted API address; `host.docker.internal` is a local
default, not a portable production service name. Terminate HTTPS at the deployment
edge and keep secrets out of Vite variables and the browser bundle.

Build with `docker build -t devflow-frontend:local .`; run with
`docker run --rm -p 127.0.0.1:8088:8080 -e API_UPSTREAM=http://host.docker.internal:8081 devflow-frontend:local`.
Check `/healthz`, an SPA deep link, static assets, and API routing in the target
environment. GitHub Actions runs checks, browser tests, and a container build; it
does not deploy. Backend acceptance and tenant security require separate testing.
