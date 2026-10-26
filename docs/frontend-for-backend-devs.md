# Frontend guide for .NET developers

For a from-scratch course, read [Build a feature by hand](manual-feature-tutorial.md).
It introduces the syntax and tools before walking through a local feature,
the real registration integration, tests, and a reusable feature worksheet.

## Start and navigate

Install the Node version in `.nvmrc`, then run `npm ci` and `npm run dev`.
Open http://127.0.0.1:5173. Registration requires the configured Identity API;
the shell runs without it. See [getting started](getting-started.md) for setup.

## React mental model

A component is a function that maps props and state to UI, like a reusable view
template with explicit inputs. JSX is typed markup in TypeScript. React renders
again when inputs change; rendering should be pure. A hook participates in React's
lifecycle, not an injectable service: call hooks at the top level and in the same
order on every render. `useState` is local UI state; effects synchronize with
external systems, not a default place for data fetching. Use Zustand only for
shared UI state and TanStack Query for server data. See [React and TypeScript](react-and-typescript.md)
and [state](state-management.md).

## Routes, requests, and forms

React Router selects a page from the URL, analogous to endpoint routing; route
guards improve UX but the API must enforce access. A feature API function is the
HTTP boundary; its Query hook owns loading, caching, and cancellation. Query keys
are like cache keys: include tenant and scope to prevent mixing data. Generated
OpenAPI types are compile-time contracts, not runtime validation; Zod checks
untrusted values where necessary. See [API integration](api-integration.md).

React Hook Form manages field state and submission, and Zod validates client input.
The server remains authoritative. Treat form errors as user-facing results, not
exceptions that crash a page. Follow [the feature walkthrough](feature-development-guide.md)
only after verifying the actual backend contract.

## Design contract and implementation

Read [DESIGN.md](../DESIGN.md) before changing UI. Think of its tokens as shared
configuration constants: `src/app/styles/globals.css` implements their values,
and Tailwind's `@theme inline` exposes names such as `bg-primary` to components.
The `.dark` class overrides the same semantic variables, much like selecting a
different configuration profile. Frontmatter `dark-` names document those
overrides; they are not extra CSS variables. Typography and spacing reuse the
imported Tailwind scale rather than a separate token stylesheet.

`components.json` records the Nova (`base-nova`) preset, neutral theme, Lucide
icons, and import aliases. `src/components/ui` contains the owned component
source, primarily using Base UI; the older shell also composes Radix directly.
Geist Variable is bundled locally. Preserve these choices and keep design values
and documentation synchronized when changing a token or component default.
See [styling](styling-guide.md) for composition and debugging guidance.

Use `npm exec -- designmd spec` to read the installed v0.4.0 CLI's `alpha` format,
and `npm run design:lint` to validate the contract. Like schema validation, this
checks the document's structure and references; compare it to actual CSS and
component defaults separately. Existing shell dark-theme gaps are documented in
DESIGN.md and do not require redesigning screens during unrelated work.

## Test, debug, and ship

Run `npm run verify` for formatting, lint, types, contract drift, unit tests,
design validation, and build. Install Playwright Chromium with
`npx playwright install chromium`, then run `npm run test:e2e`; its tests use the
local app and include an axe check. MSW is test-only. Inspect browser Console and
Network, reproduce errors, and avoid logging credentials. See [testing](testing-guide.md),
[debugging](debugging-guide.md), and [deployment](deployment.md).

Common pitfalls: mutating state prevents reliable rendering; conditional hooks
break hook ordering; caching without tenant IDs risks cross-tenant data; and an
effect that copies derived props into state adds a second source of truth. Unlike
an ASP.NET request-scoped object, a component may render many times without
remounting, so do not perform side effects during render.
