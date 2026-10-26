# Frontend glossary for a backend developer

| Term               | Meaning and useful analogy                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| HTML               | Document structure and semantics: headings, forms, links; closer to a view than a DTO                                          |
| CSS                | Rules for layout, colors and typography; the browser's visual presentation language                                            |
| JavaScript         | Runtime language in the browser and Node; its async event loop differs from ASP.NET thread handling                            |
| TypeScript         | JavaScript with compile-time types; unlike C# runtime types, most annotations disappear from output                            |
| DOM                | In-memory tree of HTML elements the browser displays and exposes to scripts                                                    |
| JSX / TSX          | Syntax for describing React element trees inside JavaScript/TypeScript                                                         |
| Component          | Reusable UI function receiving props and returning a tree, not a server endpoint                                               |
| Props              | Inputs passed by a parent component; treat as immutable                                                                        |
| Children           | Nested content supplied to a component for composition                                                                         |
| State              | A value that can change and cause the UI to rerender                                                                           |
| Hook               | React function integrating state, context or lifecycle; called in a stable top-level order                                     |
| Effect             | Synchronization after rendering with an external system; not a substitute for every data query                                 |
| Render             | React evaluating component functions to describe UI; not necessarily repainting every pixel                                    |
| Reconciliation     | Matching old and new React trees to update the DOM efficiently                                                                 |
| Key                | Stable identity for an item in a rendered list, similar to resource identity rather than its row number                        |
| Context / provider | Scoped value made available to a subtree; resembles DI scope but follows UI lifetime                                           |
| StrictMode         | Development checks that reveal unsafe rendering/effects, including extra lifecycle exercise                                    |
| SPA                | Single-page application: persistent browser shell with client-side navigation                                                  |
| Router             | Maps browser paths to components and manages navigation/history                                                                |
| Route guard        | Client access UX check; unlike backend policy middleware it cannot secure an API                                               |
| Vite               | Dev server and production bundler orchestrator; analogous to part of the web build toolchain                                   |
| Fast Refresh       | Updating changed components during development without a full manual reload                                                    |
| Bundle / chunk     | Compiled browser assets; lazy-loaded pages create separate chunks                                                              |
| Source map         | Mapping compiled code back to original files for debugging                                                                     |
| Node.js            | JavaScript runtime used here for tooling and tests, not the production SPA runtime                                             |
| npm                | Dependency/package/script manager; package.json roughly combines project metadata and tool commands                            |
| Lockfile           | Exact transitive dependency resolution; npm ci uses it for reproducible installs                                               |
| Dependency         | A package the application imports; devDependency is primarily needed for tooling/build/testing                                 |
| ES module          | A file with import/export boundaries, roughly a code module rather than a C# namespace                                         |
| Promise            | Async completion/result, similar in use to Task; await doesn't move synchronous work to a thread                               |
| Generic            | A type parameter such as T in unwrapResponse<T>, comparable to C# generics at compile time                                     |
| Union              | A value that can be one of several types; discriminated status fields allow safe narrowing                                     |
| unknown            | Untrusted type requiring narrowing/validation before use, safer than any                                                       |
| Null checking      | Compiler enforcement that missing values must be handled; strict mode enables it                                               |
| Tailwind           | CSS utility generator: p-4, flex, text-sm express presentation in component class names                                        |
| Design token       | Shared semantic value such as primary color; one change updates many components                                                |
| DESIGN.md          | DevFlow's design contract: structured tokens, usage guidance, and known implementation gaps                                    |
| Semantic theme     | Purpose-based roles such as background and primary, mapped to CSS variables for each theme                                     |
| Nova               | Selected shadcn/ui preset (`base-nova`), preserving compact controls and the neutral productivity theme                        |
| Geist Variable     | Locally bundled font used for both body text and headings                                                                      |
| Lucide             | The project's icon library; icons supplement labels and need accessible names in icon-only controls                            |
| Flexbox / Grid     | Browser layout systems for row/column alignment and multi-column arrangements                                                  |
| Breakpoint         | Minimum viewport width at which responsive styles apply                                                                        |
| shadcn/ui          | Owned component source/conventions, not an opaque server or architecture framework                                             |
| Base UI            | Interaction primitives used by Nova components; composition uses render and non-button Button elements need nativeButton=false |
| Radix              | Interaction primitives still used directly by the older shell; composition uses asChild                                        |
| Zustand            | Small shared client-state store; used only for sidebar UI here                                                                 |
| Server state       | Data owned by the backend with remote freshness/failure rules                                                                  |
| TanStack Query     | Cache and lifecycle manager for server reads/writes; not a database authorization layer                                        |
| Query key          | Structured cache identity including all inputs such as tenant and filters                                                      |
| staleTime          | How long cached data is considered fresh before normal refetch triggers may refresh it                                         |
| gcTime             | How long unused cache entries remain after observers leave                                                                     |
| Invalidation       | Marking matching cached reads stale and triggering eligible refetches after writes                                             |
| Mutation           | User-initiated remote write/request; not the same as modifying an object in memory                                             |
| RHF                | React Hook Form, managing field values, errors, submission and focus                                                           |
| Zod                | Runtime input/response validation with TypeScript inference; analogous to validator rules plus inferred types                  |
| Axios              | HTTP client used for base URL, timeout, headers, interceptors and cancellation                                                 |
| Interceptor        | Request/response processing hook; resembles a client-side middleware pipeline                                                  |
| AbortSignal        | Cooperative cancellation passed from Query through API functions to the transport                                              |
| OpenAPI            | Machine-readable HTTP contract used to generate types; must match deployed behavior                                            |
| ProblemDetails     | Standard HTTP error representation exposed by ASP.NET Core, normalized for UI here                                             |
| Envelope           | Runtime wrapper such as success/data/error around a response DTO                                                               |
| Origin / CORS      | Scheme+host+port identity and browser cross-origin access rules; not enforced by PowerShell                                    |
| Cookie             | Browser-managed data attached according to origin/path/security attributes                                                     |
| HttpOnly / Secure  | Cookie protections: JavaScript cannot read it / browser sends it only over HTTPS                                               |
| CSRF / XSS         | Unwanted cross-site requests / injected script; frontend token choices require backend defenses                                |
| CSP                | Content Security Policy, restricting sources and embedding; this container sends it as a header                                |
| Tenant / scope     | Organization boundary / exact resource authorization context                                                                   |
| RBAC / permission  | Roles group action grants; a role name alone does not establish authorization                                                  |
| MSW                | HTTP mocking for tests; no production worker is started in DevFlow                                                             |
| Vitest / RTL       | Test runner / React Testing Library, asserting user-visible UI behavior                                                        |
| jsdom              | Test DOM environment, unable to prove actual visual layout or server behavior                                                  |
| Playwright / axe   | Browser interaction runner / automated accessibility checker; selected checks do not establish full accessibility              |
| CI                 | Automated quality commands on the repository host; configured here for GitHub Actions                                          |
| Static hosting     | Serving built HTML/CSS/JS without running React code as a server                                                               |
| Reverse proxy      | Nginx forwarding /api traffic to backend, distinct from client-side routing                                                    |
| Multi-stage build  | Docker build separates compiler/dependencies from the lightweight runtime                                                      |

When a term is unclear, find its actual owning file through the folder map in
architecture.md, then trace one registration request end to end in api-integration.md.
