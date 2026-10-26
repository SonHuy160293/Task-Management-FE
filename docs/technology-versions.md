# Exact selected versions

The initial registry/compatibility review was recorded on 2026-10-25. The direct
dependency inventory below is synchronized with the current [package.json](../package.json)
as of 2026-10-27; this update reads the local manifest rather than asserting a new
registry review. [package-lock.json](../package-lock.json) pins the transitive tree.

Runtime used for local checks: Node 24.21.0 and npm 11.19.0. Node typings use the 24.x line.

The design contract is [DESIGN.md](../DESIGN.md): Nova (`base-nova`), a neutral
semantic theme, Geist Variable, and Lucide. `components.json` records the preset;
Tailwind v4 is configured through the existing CSS and Vite plugin. Google
DESIGN.md CLI v0.4.0 validates format `alpha` through `npm run design:lint`.
Installed packages do not establish completed product features: chart/drag/drop
libraries are not implemented task/KPI workflows, `openapi-fetch` is not the
active Axios transport, and `next-themes` is not a wired theme switcher. Nova uses
Base UI, while the older shell retains direct Radix dialogs and menus.

| Package                       | Exact version | Purpose                                         |
| ----------------------------- | ------------- | ----------------------------------------------- |
| @base-ui/react                | 1.9.0         | Nova interaction primitives                     |
| @dnd-kit/core                 | 6.3.1         | Runtime dependency                              |
| @dnd-kit/sortable             | 10.0.0        | Runtime dependency                              |
| @dnd-kit/utilities            | 3.2.2         | Runtime dependency                              |
| @fontsource-variable/geist    | 5.3.0         | Locally bundled Geist Variable font             |
| @hookform/resolvers           | 5.2.2         | Runtime dependency                              |
| @radix-ui/react-dialog        | 1.3.1         | Runtime dependency                              |
| @radix-ui/react-dropdown-menu | 2.2.1         | Runtime dependency                              |
| @radix-ui/react-slot          | 1.5.0         | Runtime dependency                              |
| @tanstack/react-query         | 5.104.5       | Runtime dependency                              |
| @tanstack/react-table         | 9.3.1         | Runtime dependency                              |
| @tanstack/react-virtual       | 3.14.23       | Runtime dependency                              |
| axios                         | 1.20.0        | Runtime dependency                              |
| class-variance-authority      | 0.7.1         | Runtime dependency                              |
| clsx                          | 2.1.1         | Runtime dependency                              |
| cn                            | 0.5.0         | Class-name merging in generated Nova components |
| date-fns                      | 4.4.0         | Runtime dependency                              |
| lucide-react                  | 1.61.0        | Lucide icons                                    |
| next-themes                   | 0.4.6         | Installed; no app theme switcher wired          |
| openapi-fetch                 | 0.17.0        | Runtime dependency                              |
| react                         | 19.3.1        | Runtime dependency                              |
| react-dom                     | 19.3.1        | Runtime dependency                              |
| react-hook-form               | 7.91.0        | Runtime dependency                              |
| react-router                  | 8.5.0         | Runtime dependency                              |
| react-router-dom              | 7.18.4        | Runtime dependency                              |
| recharts                      | 3.10.1        | Runtime dependency                              |
| shadcn                        | 4.22.2        | Owned UI component tooling                      |
| sonner                        | 2.0.8         | Active notification library                     |
| tailwind-merge                | 3.7.0         | Runtime dependency                              |
| tw-animate-css                | 1.4.0         | Imported animation utilities                    |
| zod                           | 4.6.7         | Runtime dependency                              |
| zustand                       | 5.0.16        | Runtime dependency                              |
| @axe-core/playwright          | 4.14.0        | Automated browser accessibility checks          |
| @eslint/js                    | 10.0.1        | Development/build/test                          |
| @google/design.md             | 0.4.0         | DESIGN.md CLI and validation                    |
| @playwright/test              | 1.64.1        | Desktop/mobile browser test runner              |
| @tailwindcss/vite             | 4.3.3         | Development/build/test                          |
| @testing-library/jest-dom     | 7.0.1         | Development/build/test                          |
| @testing-library/react        | 16.3.3        | Development/build/test                          |
| @testing-library/user-event   | 14.6.8        | Development/build/test                          |
| @types/node                   | 24.19.2       | Development/build/test                          |
| @types/react                  | 19.3.0        | Development/build/test                          |
| @types/react-dom              | 19.3.0        | Development/build/test                          |
| @vitejs/plugin-react          | 6.1.2         | Development/build/test                          |
| @vitest/coverage-v8           | 5.0.5         | Development/build/test                          |
| eslint                        | 10.13.0       | Development/build/test                          |
| eslint-config-prettier        | 10.1.8        | Development/build/test                          |
| eslint-plugin-react-hooks     | 7.1.1         | Development/build/test                          |
| eslint-plugin-react-refresh   | 0.5.7         | Development/build/test                          |
| globals                       | 17.13.0       | Development/build/test                          |
| husky                         | 9.1.7         | Development/build/test                          |
| jsdom                         | 30.1.3        | Development/build/test                          |
| lint-staged                   | 17.6.0        | Development/build/test                          |
| msw                           | 3.0.3         | Development/build/test                          |
| openapi-typescript            | 7.13.0        | Development/build/test                          |
| prettier                      | 3.9.10        | Development/build/test                          |
| prettier-plugin-tailwindcss   | 0.8.1         | Development/build/test                          |
| tailwindcss                   | 4.3.3         | Development/build/test                          |
| typescript                    | 5.9.3         | Development/build/test                          |
| typescript-eslint             | 8.72.0        | Development/build/test                          |
| vite                          | 8.3.5         | Development/build/test                          |
| vitest                        | 5.0.5         | Development/build/test                          |

TypeScript 5.9.3 satisfies openapi-typescript 7.x (TS ^5.x) and typescript-eslint (<6.1).
The original compatibility review found TypeScript 7 incompatible with those peers. Resolver 5.2.2
avoids the resolver 6 optional Effect 3/4 peer resolution conflict. ESLint 10 is supported
by the installed hooks/refresh/TypeScript plugins. No force or legacy-peer-deps was used.

Docker bases: node:24.21.0-alpine and nginxinc/nginx-unprivileged:1.28.0-alpine.
Earlier image-build evidence is recorded in [verification](../plans/verification.md);
the dependency inventory does not imply a new Docker build or registry check.

Official setup references:

- [React versions](https://react.dev/versions)
- [Vite guide](https://vite.dev/guide/)
- [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite)
- [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite)
- [TanStack Query React overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [OpenAPI TypeScript](https://openapi-ts.dev/)

For upgrades, inspect registry peer requirements, use an exact compatible version, review
the lock diff and rerun npm run verify, relevant Playwright checks, and the Linux
Docker build. Update this table and DESIGN.md when affected tokens or component
defaults change. Preserve the selected preset rather than reinitializing shadcn.
