# Architecture decisions

## ADR 001 — Feature-oriented SPA

**Context:** the owner knows Clean Architecture, but browser state and UI have a
different lifecycle than backend domain/application layers. **Decision:** one React
Vite SPA with feature pages/components/hooks/api/schemas and shared lib/UI. **Reason:**
direct navigation from a user workflow to its implementation. **Alternative:**
repository/service/domain layers copied from .NET, Next.js, or a larger framework.
**Tradeoff:** feature boundaries need contributor discipline; AGENTS.md records the
direction and generated contracts stay independent. SSR is unnecessary for this
authenticated-workspace product foundation.

## ADR 002 — Source and runtime evidence before integration

**Context:** backend task cards describe many endpoints, but current source/Swagger
exposes registration and an internal lookup only. **Decision:** implement registration
and honest availability states, without fabricated organization/team/login requests.
**Reason:** fake requests/data would give a false sense of working product behavior.
**Alternative:** implement planned DTOs and guessed calls now. **Tradeoff:** CRUD and
sign-in are visibly unavailable until backend work exists; a detailed gap register
and extension guide make the next steps concrete.

## ADR 003 — Types generated, transport handwritten

**Context:** live Swagger differs from runtime response envelopes. **Decision:**
openapi-typescript generates module types from a checked-in snapshot; handwritten
API functions use one Axios client and parse unknown responses. **Reason:** preserve
real contracts while centralizing errors/session/cancellation. **Alternative:**
generate an unreviewed client with its own fetch transport or edit generated types.
**Tradeoff:** API functions must handle envelope drift explicitly, but builds and CI
are deterministic and never require a live server. api:check detects local drift.

## ADR 004 — State ownership by lifecycle

**Context:** server data, form values, UI preferences and sessions change for
different reasons. **Decision:** Query for server state, RHF/Zod for forms, useState
for local interactions, Zustand only for shared UI, URL params for future filters.
**Reason:** avoid duplicate mutable copies. **Alternative:** a universal Zustand or
Redux store. **Tradeoff:** several small tools to learn, each with a clear purpose.
No server API data or credentials are persisted in Zustand.

## ADR 005 — Session adapter absent until verified

**Context:** login/restore/rotation/logout contracts and browser cookie strategy do
not exist in the running API. **Decision:** test an in-memory lifecycle controller
with an injectable adapter; production has no adapter and starts anonymous.
**Reason:** ship safe reusable behavior without claiming invented backend support.
**Alternative:** localStorage JWTs, fake sessions, or integration-key user lookup.
**Tradeoff:** no working production authentication yet. The eventual adapter must
map real generated types and use raw transport for refresh to avoid recursion.

## ADR 006 — Bounded retries and scoped cache isolation

**Context:** simultaneous 401s can rotate refresh tokens multiple times; stale
requests/caches can cross tenant transitions. **Decision:** shared rotation promise,
session revision guard, one authenticated idempotent-read replay, no write retries,
exact tenant/scope keys, cancellation/removal on switch and cache clear on logout.
**Reason:** prevent loops, duplicate writes and private data reuse. **Alternative:**
retry every request or retain all previous tenant caches for faster switching.
**Tradeoff:** some operations require explicit retry and switching fetches fresh data.
Cross-tab rotation and real revocation handling remain integration work.

## ADR 007 — Owned components with accessible behavior

**Context:** a consistent SaaS UI is needed without a second architecture framework.
**Decision:** [DESIGN.md](../DESIGN.md) is the design contract for the
Linear-inspired productivity interface. Keep Tailwind v4 semantic tokens and
owned shadcn/ui Nova (`base-nova`) components, the neutral theme, locally bundled
Geist Variable, Lucide icons, and the existing Sonner notifications. Nova uses
Base UI primitives; the older shell retains direct Radix dialogs and menus.
**Reason:** own the styling while reusing focus/menu/dialog interaction and one
shared theme. **Alternative:** a competing component library or fully hand-rolled
focus management. **Tradeoff:** local component source needs visual/keyboard
review, and Base UI `render` and Radix `asChild` must not be interchanged. The
font is served with the app, without an external font service. Dark variables
exist, but fixed light styles and a missing theme switcher remain documented gaps.
Update the design contract alongside token/default changes and run `design:lint`;
the linter does not establish CSS parity or screen accessibility.

## ADR 008 — Compatible stable tooling, exact pins

**Context:** npm registry latest included TypeScript 7 while openapi-typescript
requires TS 5.x and typescript-eslint supports below 6.1; resolver 6 produced an
optional Effect 3/4 peer conflict. **Decision:** TypeScript 5.9.3 and resolver 5.2.2,
other compatible selected stable packages exactly pinned. ESLint 9 was initially
tried, then replaced with supported ESLint 10 after all plugin peers were verified.
Node 24.21.0 and npm 11.x match the tested runtime; Node type definitions use 24.x.
**Reason:** respect declared peer support without --force/--legacy-peer-deps.
**Alternative:** upgrade every major blindly or accept an invalid peer tree.
**Tradeoff:** TypeScript/resolver trail the newest major until upstream compatibility
is resolved. Exact versions are recorded in technology-versions.md and the lock.
MSW 3 uses onUnhandledFrame, verified against installed package types.

## ADR 009 — Static, non-root production container

**Context:** this SPA needs static hosting and API path routing, not a Node server
at runtime. **Decision:** Node build stage, non-root Nginx runtime, SPA fallback,
same-origin /api upstream and security headers. **Reason:** small operational
surface and predictable browser connectivity. **Alternative:** run vite dev in
production or add SSR/hosting-specific infrastructure. **Tradeoff:** VITE values
are build-time; backend upstream DNS is runtime, and TLS belongs at ingress.

## ADR 010 — Mock tests and real acceptance remain distinct

**Context:** backend CRUD/session features are absent, but frontend behavior still
needs automated verification. **Decision:** MSW only in tests, pure/controller
tests for security boundaries, browser checks for UI, separate real transport checks.
**Reason:** deterministic tests without misrepresenting server functionality.
**Alternative:** runtime fallback mocks or claiming a mock 202 proves persistence.
**Tradeoff:** several integration scenarios remain explicitly unverified until real
endpoints and an isolated acceptance environment are available.
