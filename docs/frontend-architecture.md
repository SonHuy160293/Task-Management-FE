# Frontend architecture

The detailed architecture map and dependency direction are in [architecture.md](architecture.md).
The browser is a React/Vite SPA: the router composes pages, pages compose features,
feature hooks own server-state lifecycles, and feature API functions use the shared
HTTP boundary. Shared components and `lib` must not depend on feature internals.

TanStack Query owns remote data and mutation state. Query keys for private data
include organization and resource scope; tenant switches cancel and remove old data.
Zustand holds shared UI state, not server records. React Hook Form and Zod own form
state and validation. Tokens stay in memory; permission checks deny by default and
never replace server authorization.

Generated types live under `src/api/generated` and are regenerated from reviewed
OpenAPI snapshots. Current registration uses generated types with Axios and runtime
envelope validation. `openapi-fetch` is installed but is not the active transport;
migrating requires preserving cancellation, normalized errors, authentication and
replay safeguards, and verifying the real contract.

The design contract is implemented by `components.json`, the owned Nova
(`base-nova`) UI components, and `src/app/styles/globals.css`. Keep the neutral
semantic theme, locally bundled Geist Variable, and Lucide icons. Tailwind v4
exposes the CSS variables through `@theme inline`; no parallel token stylesheet
or separate Tailwind config is needed. Base UI powers the installed primitives,
while the older shell still composes Radix directly. Follow the owning component's
API and the [styling guide](styling-guide.md). Keep tokens and documentation in
sync and retain the documented distinction between dark variables and complete
dark screen support.

Read [PRODUCT.md](../PRODUCT.md), [DESIGN.md](../DESIGN.md),
[API integration](api-integration.md), and the [gap register](backend-integration-gaps.md)
before designing a feature. The register distinguishes fixtures and planned work
from deployed APIs.
