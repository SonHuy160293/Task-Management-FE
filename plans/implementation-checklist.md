# Execution checklist

- [x] Inspect empty frontend and adjacent backend source, instructions, live Swagger.
- [x] Confirm source: only registration and service-to-service user lookup exist.
- [x] Scaffold strict React/Vite, Tailwind, shadcn primitives and quality tools.
- [x] Implement HTTP normalization, session lifecycle, exact-scope permissions, tenant cache isolation.
- [x] Build responsive application shell, overview, registration, capability-aware organization/team pages.
- [x] Generate Identity contracts from checked-in live Swagger; verify generation drift.
- [x] Test registration, errors, refresh coordination, logout races, guards, tenant isolation.
- [x] Write all learning documentation, Docker and GitHub Actions.
- [x] Run clean install, format, lint, typecheck, tests, generation check and build.
- [x] Verify browser and Docker where available; record exact limits.

Missing runtime contracts are tracked in docs/backend-integration-gaps.md. Do not
promote planned endpoints to working frontend features.

All independent stages are complete. Actual login/session and organization/team
vertical slices remain blocked by missing implemented contracts, as the request's
execution contract requires us to record instead of fabricating. See verification.md
and docs/backend-integration-gaps.md for the distinction between mocks, real transport
checks, and unverified/missing backend behavior.
