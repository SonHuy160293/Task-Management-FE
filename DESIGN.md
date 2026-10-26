---
version: alpha
name: DevFlow
description: An information-dense engineering workspace using the Nova neutral theme.
colors:
  background: 'oklch(1 0 0)'
  foreground: 'oklch(0.145 0 0)'
  card: 'oklch(1 0 0)'
  card-foreground: 'oklch(0.145 0 0)'
  popover: 'oklch(1 0 0)'
  popover-foreground: 'oklch(0.145 0 0)'
  primary: 'oklch(0.205 0 0)'
  primary-foreground: 'oklch(0.985 0 0)'
  dark-background: 'oklch(0.145 0 0)'
  dark-foreground: 'oklch(0.985 0 0)'
  dark-card: 'oklch(0.205 0 0)'
  dark-card-foreground: 'oklch(0.985 0 0)'
  dark-popover: 'oklch(0.205 0 0)'
  dark-popover-foreground: 'oklch(0.985 0 0)'
  dark-primary: 'oklch(0.922 0 0)'
  dark-primary-foreground: 'oklch(0.205 0 0)'
typography:
  body:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: Geist Variable
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.25rem
  label:
    fontFamily: Geist Variable
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.25rem
  metadata:
    fontFamily: Geist Variable
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1rem
  page-title:
    fontFamily: Geist Variable
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 2rem
  section-title:
    fontFamily: Geist Variable
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.75rem
  panel-title:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.375
  dialog-title:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
  2xl: 1.125rem
  3xl: 1.375rem
  4xl: 1.625rem
spacing:
  1: 0.25rem
  2: 0.5rem
  3: 0.75rem
  4: 1rem
  5: 1.25rem
  6: 1.5rem
  8: 2rem
  10: 2.5rem
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.lg}'
    height: 2rem
    typography: '{typography.label}'
  button-primary-dark:
    backgroundColor: '{colors.dark-primary}'
    textColor: '{colors.dark-primary-foreground}'
    rounded: '{rounded.lg}'
    height: 2rem
    typography: '{typography.label}'
  canvas:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
  canvas-dark:
    backgroundColor: '{colors.dark-background}'
    textColor: '{colors.dark-foreground}'
  card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.card-foreground}'
    rounded: '{rounded.xl}'
    padding: '{spacing.4}'
    typography: '{typography.compact}'
  card-dark:
    backgroundColor: '{colors.dark-card}'
    textColor: '{colors.dark-card-foreground}'
    rounded: '{rounded.xl}'
    padding: '{spacing.4}'
    typography: '{typography.compact}'
  popover:
    backgroundColor: '{colors.popover}'
    textColor: '{colors.popover-foreground}'
  popover-dark:
    backgroundColor: '{colors.dark-popover}'
    textColor: '{colors.dark-popover-foreground}'
---

## Overview

DevFlow is a workspace for engineering delivery. Make frequent tasks quick to scan
and operate: show useful information at a comfortable density, preserve a clear
hierarchy, and keep controls predictable. Linear's efficiency and Notion's
simplicity are reference points, not licenses to copy their identity. Use restrained
surfaces, quiet borders, clear labels, and meaningful feedback. Avoid decoration that
competes with work. User-visible functionality must reflect actual backend support.

The implementation uses React, TypeScript, Tailwind CSS v4, shadcn/ui `base-nova`,
Lucide, and Geist Variable. `components.json` and `src/app/styles/globals.css` are
the implementation mapping. The frontmatter records exact OKLCH values for the surface and primary-action
pairs used by its component recipes in both themes. The Colors section inventories
all theme variables, including alpha colors, sidebar roles, and chart roles. It documents the
existing system; it does not introduce another theme or generated stylesheet.

This file follows the `alpha` format emitted by `npm exec -- designmd spec` in
the installed `@google/design.md` CLI v0.4.0. The frontmatter `version` identifies
the format, not the CLI release. See the [official specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md);
use the installed command when checking this repository's supported format.

This document is the design authority for new UI and its intended behavior; the
CSS and components implement those decisions. Keep the frontmatter, prose, and
implementation synchronized in the same change; resolve discrepancies against the
selected preset and actual component behavior. Do not regenerate or reapply a
preset to resolve documentation drift. Planned patterns below do not imply an
available API.

Principles: make the next action obvious; keep related information together; use
compact, legible density; expose context and feedback; make every task operable by
keyboard and touch; preserve tenant boundaries and backend authority.

## Colors

Use semantic Tailwind roles (`bg-background`, `text-foreground`, `border-border`,
etc.), not hard-coded palette colors. The `.dark` class selects the dark values.
Foreground roles are intended for their corresponding surfaces; verify actual rendered
contrast, especially on translucent and interactive states.

### Token naming and maintenance

Use role names rather than hue or module names: `--background` is a surface,
`--foreground` is its text, and a paired `--<role>-foreground` is text on
`--<role>`. Sidebar and chart tokens are scoped by their existing prefixes. The
Tailwind v4 `@theme inline` bridge exposes them as `--color-<role>` and utilities
such as `bg-card`, `text-card-foreground`, and `ring-ring`. Define a new semantic
role in both `:root` and `.dark`, map it in `@theme inline`, and document its use
and contrast when an actual need justifies it. Do not create per-feature palettes
or assume a `destructive-foreground` token exists. Frontmatter keys without a prefix
map directly to `:root` variables (`colors.card` → `--card`); `dark-` keys map to
the same variable in `.dark` (`colors.dark-card` → `.dark { --card: … }`). The
`dark-` prefix is a documentation convention, not a second set of CSS variables.
The frontmatter covers the declared component recipes; the table and chart list
below inventory every implemented color role in both themes. Keep that full
inventory synchronized even when a role is not part of a frontmatter recipe.

| CSS variable                                     | Light                                                        | Dark                                                             | Purpose                            |
| ------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------- |
| `background` / `foreground`                      | `oklch(1 0 0)` / `oklch(0.145 0 0)`                          | `oklch(0.145 0 0)` / `oklch(0.985 0 0)`                          | Canvas and main text               |
| `card` / `card-foreground`                       | `oklch(1 0 0)` / `oklch(0.145 0 0)`                          | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`                          | Grouped content                    |
| `popover` / `popover-foreground`                 | `oklch(1 0 0)` / `oklch(0.145 0 0)`                          | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`                          | Floating surfaces                  |
| `primary` / `primary-foreground`                 | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`                      | `oklch(0.922 0 0)` / `oklch(0.205 0 0)`                          | Primary action                     |
| `secondary` / `secondary-foreground`             | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`                       | `oklch(0.269 0 0)` / `oklch(0.985 0 0)`                          | Secondary action                   |
| `muted` / `muted-foreground`                     | `oklch(0.97 0 0)` / `oklch(0.556 0 0)`                       | `oklch(0.269 0 0)` / `oklch(0.708 0 0)`                          | Quiet surfaces and supporting text |
| `accent` / `accent-foreground`                   | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`                       | `oklch(0.269 0 0)` / `oklch(0.985 0 0)`                          | Hover and selected surfaces        |
| `destructive`                                    | `oklch(0.577 0.245 27.325)`                                  | `oklch(0.704 0.191 22.216)`                                      | Destructive actions and errors     |
| `border` / `input` / `ring`                      | `oklch(0.922 0 0)` / `oklch(0.922 0 0)` / `oklch(0.708 0 0)` | `oklch(1 0 0 / 10%)` / `oklch(1 0 0 / 15%)` / `oklch(0.556 0 0)` | Boundaries, controls, focus        |
| `sidebar` / `sidebar-foreground`                 | `oklch(0.985 0 0)` / `oklch(0.145 0 0)`                      | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`                          | Navigation surface                 |
| `sidebar-primary` / `sidebar-primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)`                      | `oklch(0.488 0.243 264.376)` / `oklch(0.985 0 0)`                | Sidebar primary emphasis           |
| `sidebar-accent` / `sidebar-accent-foreground`   | `oklch(0.97 0 0)` / `oklch(0.205 0 0)`                       | `oklch(0.269 0 0)` / `oklch(0.985 0 0)`                          | Sidebar interaction                |
| `sidebar-border` / `sidebar-ring`                | `oklch(0.922 0 0)` / `oklch(0.708 0 0)`                      | `oklch(1 0 0 / 10%)` / `oklch(0.556 0 0)`                        | Sidebar boundaries and focus       |

Chart roles `chart-1` through `chart-5` are the same in both themes: respectively
`oklch(0.87 0 0)`, `oklch(0.556 0 0)`, `oklch(0.439 0 0)`, `oklch(0.371 0 0)`,
and `oklch(0.269 0 0)`. Check each chart against its actual surface; use labels,
patterns, and accessible summaries in addition to color. No dedicated success,
warning, or informational status tokens exist yet. Add reviewed semantic roles
for both themes when needed; never encode meaning by color alone.

The blue dark `sidebar-primary` is retained from the installed theme. It is a
scoped navigation role, not a new global brand accent; `primary` stays neutral.

## Typography

Geist Variable is locally supplied via `@fontsource-variable/geist`; `font-sans`
and `font-heading` both resolve to it with a sans-serif fallback. Use Tailwind's
existing scale: `text-base` (1rem) for normal body and mobile inputs, `text-sm`
(0.875rem) for compact controls and data, and `text-xs` (0.75rem) for secondary
metadata. Use medium or semibold weight for hierarchy, and sentence case for labels.
Headings should follow semantic document order; choose their size by context rather
than adding a second typeface. Avoid tiny text for essential information. Truncation
must not make important information inaccessible.

The frontmatter typography records combinations of existing Tailwind utilities,
not additional CSS variables or custom type classes. Values come from Tailwind's
imported scale and the installed component overrides:

| Role            | Existing utility combination         | Size / line height |
| --------------- | ------------------------------------ | ------------------ |
| `body`          | `text-base font-normal`              | 1rem / 1.5rem      |
| `compact`       | `text-sm font-normal`                | 0.875rem / 1.25rem |
| `label`         | `text-sm font-medium`                | 0.875rem / 1.25rem |
| `metadata`      | `text-xs font-normal`                | 0.75rem / 1rem     |
| `page-title`    | `text-2xl font-semibold`             | 1.5rem / 2rem      |
| `section-title` | `text-lg font-semibold`              | 1.125rem / 1.75rem |
| `panel-title`   | `text-base leading-snug font-medium` | 1rem / 1.375       |
| `dialog-title`  | `text-base leading-none font-medium` | 1rem / 1           |

For new work, use the page and section roles for hierarchy, the panel role for
compact panel titles, and compact or metadata roles for dense content. Preserve
readable line height and avoid using headings merely to enlarge text. Use tabular
numerals for aligned metrics and dates where it improves scanning. Existing
`PageHeading` uses 28px/32px responsive titles with -0.035em tracking; preserve
that shared component during routine feature work rather than restyling screens
to adopt the recommended 24px page-title role. CardTitle uses the panel role
(0.875rem in a small Card); DialogTitle uses the dialog role.

## Layout

Tailwind's default spacing step is 0.25rem. Use 0.5rem for closely related items,
0.75–1rem for controls and compact groups, 1.25–1.5rem between related sections,
and 2–2.5rem for larger separation. The installed Card uses 1rem padding and gap,
or 0.75rem in its small variant. Keep dense tables scannable with alignment, stable
columns, and clear row states; use server pagination or virtualization when needed.

The existing shell has a 250px desktop sidebar (76px collapsed), a 78px header,
and content capped at 1500px. At `lg` (64rem) it shows the sidebar; below that it
uses a mobile navigation overlay. Existing content gutters are 1.25rem, 2rem from
`sm` (40rem), and 2.5rem from `lg`. These describe the current shell, not universal
fixed dimensions. Adapt layout to available width, zoom, and content. Stack controls
and preserve task priority on small screens; contain necessary table scrolling within
the table rather than the page. Keep navigation, tenant context, and focus clear.

Use landmarks (`header`, `nav`, `main`, `footer`) and one clear page heading.
Keep global navigation stable, show the current location and organization, and
place page actions near the heading. At narrow widths, allow filters and actions
to wrap or move into a labeled disclosure, maintaining access to the same tasks.
Test at 320px, 375px, 768px, 1024px, and 1440px as well as 200% zoom; these are
test cases, not additional breakpoint tokens. Avoid clipping long names and
unbroken identifiers; allow wrapping or provide an accessible full value.

## Elevation & Depth

Prefer surface contrast and one-pixel borders or subtle rings to layered shadows.
Cards use a `ring-1 ring-foreground/10`; dialogs use a subdued backdrop and a
surface ring. Reserve stronger elevation for floating menus and overlays. Motion
should communicate state, remain brief, and respect `prefers-reduced-motion`;
the global stylesheet already reduces animation and transition durations.

Use the existing `border-border`, `border-input`, and `ring-ring` roles for
boundaries and focus. `shadow-xs`, `shadow-sm`, and `shadow-lg` appear in existing
components or shell; these are Tailwind utilities, not custom DevFlow shadow tokens.
Use little or no shadow for persistent surfaces, and reserve stronger shadows for
menus and overlays. Avoid nested cards and stacked outlines that obscure hierarchy.

## Shapes

The base radius is `0.625rem` (10px at a 16px root). Tailwind maps `sm`, `md`,
`lg`, `xl`, `2xl`, `3xl`, and `4xl` to 0.6, 0.8, 1, 1.4, 1.8, 2.2, and 2.6
times that base. Buttons and inputs use `rounded-lg`; cards and dialogs use
`rounded-xl`; badges use `rounded-4xl`. Use these roles consistently rather than
inventing per-screen radii.

## Components

Use installed components from `@/components/ui` and the existing `@/` aliases.
The Nova components inspected here use Base UI primitives; the older application
shell also uses Radix directly. Check the actual primitive API when composing them.
Use Lucide icons; icon-only controls require accessible names.

- **Buttons:** use `default` for the primary action; `secondary`, `outline`, or
  `ghost` for lower emphasis; `destructive` for dangerous actions and `link` for
  link-like actions. Default height is 2rem; `xs`, `sm`, and `lg` are 1.5, 1.75,
  and 2.25rem. Icon sizes follow the component. Provide adequate touch targets,
  aiming for 44px where practical without changing the visual density.
- **Forms:** compose `FieldGroup`, `Field`, `FieldLabel`, descriptions, and errors
  with `Input` and other installed controls. Use visible labels, associate errors
  with controls, and set `data-invalid` on the field and `aria-invalid` on the input.
  Input is 2rem high and uses 1rem text until `md`, then 0.875rem. Explain errors
  beside the field and retain user input on failure.
- **Cards and tables:** use Card's header, title, description, content, and footer
  as appropriate. Use semantic Table elements, meaningful headers, and an accessible
  scrolling container for wide data. Design loading, empty, error, and populated
  states; do not fabricate data to fill a screen.
- **Dialogs and navigation:** give dialogs and sheets accessible titles, manage
  focus and dismissal, and restore focus to the trigger. Use predictable active
  navigation, breadcrumbs where useful, and explicit organization context. A
  permission-restricted or unavailable action must be explained without exposing
  data from another tenant.
- **Feedback:** use Badge for compact labels, Skeleton for loading placeholders,
  and the installed notification patterns for actionable feedback. Provide text
  alongside status colors and distinguish errors from unavailable functionality.

Compose components using their own exports and the installed primitive's API.
Keep `TabsTrigger` inside `TabsList`; give `Dialog` and `Sheet` titles; use
`FieldSet` and `FieldLegend` for related options. Base UI composition uses `render`
where supported; Radix uses `asChild`. Do not mix their roots and children, or
assume a component is installed merely because it exists in the shadcn catalog.
Use `data-icon="inline-start"` or `data-icon="inline-end"` for button icons and
allow the component to size them. Use `@/` imports and existing variants before
introducing component-specific overrides.

For example, an action and a labeled field can use the installed primitives:

```tsx
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

<Button type="button">
  <PlusIcon data-icon="inline-start" />
  Add item
</Button>;

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">Name</FieldLabel>
    <Input id="name" name="name" />
  </Field>
</FieldGroup>;
```

These examples describe composition only; they do not claim an item-creation
feature exists. For actual forms use React Hook Form and Zod, connect errors with
`aria-describedby`, and retain entered values on recoverable failures.

### Data-heavy workflows

The following rules apply when corresponding backend capabilities are available:

- **Tables:** use `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, and
  `TableCell`; provide a caption or accessible name and header associations.
  Align numbers consistently, expose sorting direction, and preserve selection
  context. Use pagination or virtualization only when appropriate, retaining
  keyboard and screen-reader access. Keep wide-table scrolling local and discoverable.
- **Task lists:** present title, status, assignee, and other relevant fields in a
  stable order when the data exists. Make row actions keyboard reachable and use
  bulk actions only with clear selection count and scope. Show full values on
  request when truncated; do not imply unsupported task functionality.
- **Kanban:** label columns and counts, keep cards readable, and offer a keyboard
  and non-drag way to change status. Announce changes and failures, preserve focus,
  and respect actual permissions and server outcomes. On narrow screens allow
  deliberate horizontal column scrolling or an equivalent list view.
- **Filters:** label controls, show active filters, provide a clear/reset action,
  and distinguish no records from no matches. Reflect shareable filters and
  pagination in the URL where appropriate; never put sensitive data there.
- **KPI charts:** identify metric, unit, time range, source or definition, and
  target when one exists. Use a line for trends and a compact bar or bullet for a
  defined target; provide an accessible text summary and data table. Expose the
  same details to keyboard users as hover users. Do not equate output counts with
  individual performance or invent benchmarks.

### Navigation and interaction

Use links for navigation and buttons for actions. Provide a skip link, visible
focus, clear active location, and meaningful icon names. Keep tab order aligned
with layout; dialogs trap focus while open and return it on close. Menus, tabs,
and other composite widgets follow their installed primitive's keyboard behavior.
Only advertise shortcuts that are actually wired, discoverable, and do not interfere
with typing or browser and assistive-technology shortcuts. The installed Sidebar
component has a Ctrl/Command+B shortcut, but the existing app shell uses its own
sidebar; do not claim that shortcut is active in the shell without verification.

### Feedback and states

- **Loading:** preserve layout with a relevant Skeleton or progress indicator;
  label the region or announce meaningful progress without repeatedly interrupting.
- **Empty:** explain whether there is no data or no match, and offer an available,
  permission-appropriate next action or filter reset.
- **Error:** explain what failed and a practical recovery, with field errors
  associated to inputs. Keep recoverable input and avoid exposing private details.
- **Success:** confirm meaningful completed changes near the action or with a
  restrained toast; do not report success before the server confirms it.
- **Disabled:** use actual disabled semantics and a visible explanation when the
  reason is not obvious. Do not rely on a tooltip as the sole explanation.
- **Permission restricted:** explain access limitations without revealing private
  tenant data; hide sensitive details as required and handle server 403 responses.
  Frontend guards are not authorization boundaries.

### Motion and responsive accessibility

Use short, purposeful transitions for state changes and orientation; keep essential
feedback available immediately. Do not animate large data regions, use continuous
decorative motion, or make an animation a prerequisite for understanding. Respect
reduced-motion settings and preserve focus during state changes. Avoid hover-only
controls, layout shifts, dense targets without sufficient hit area, and visual
effects that reduce text contrast. Test keyboard-only, touch, zoom, and both themes.

Accessibility is a release requirement: use semantic HTML, logical heading and tab
order, visible focus, keyboard-operable controls, descriptive names, and meaningful
error messages. Aim for WCAG AA contrast (4.5:1 normal text, 3:1 large text and
necessary non-text indicators), and verify combinations in both themes and states.
Avoid hover-only interactions; test touch, 200% zoom, reduced motion, and screen
reader behavior. No formal conformance audit is implied by this document.

## Do's and Don'ts

- Do favor clear hierarchy, concise labels, efficient filtering, and consistent
  interaction patterns. Do not add visual noise, gratuitous gradients, or motion.
- Do use semantic variables and installed variants. Do not replace Nova or add a
  competing UI framework.
- Do preserve backend authority and explicit tenant context. Do not imply planned
  workflows or permissions are available before their contracts exist.
- Do check long names, missing values, large counts, keyboard use, and mobile
  layouts. Do not rely on color, hover, or placeholder text alone.

### Maintenance and validation

Before changing UI, read this file and inspect `components.json`, the global
stylesheet, and the relevant installed components. Keep Nova (`base-nova`), the
neutral theme, Geist, Lucide, and the Linear-inspired productivity direction.
Use the existing semantic roles and variants; do not add a parallel token file,
Tailwind configuration, font stack, or component library.

When tokens or component defaults change, update the frontmatter and prose in
the same change. Compare all light/dark color values and their `@theme inline`
aliases with `src/app/styles/globals.css`; compare typography and spacing with
Tailwind's imported defaults, radii with the global radius multipliers, and
component dimensions with their actual source. Run `npm run design:lint` and
resolve validation errors. The CLI validates format, references, and declared
color pairs; it does not check synchronization with the app's CSS or establish
screen accessibility. For source changes, also run lint, typecheck, relevant
tests, and the production build, with browser checks for visible changes.

### Known gaps

Dark variables exist, but the current shell contains hard-coded light slate, indigo,
and white styles, and theme switching and complete dark coverage are not established
by this document. The shell uses separate Base UI and Radix dialogs; keep each
primitive's root and children together. Existing `::selection`, `.eyebrow`, and
`.menu-item` use fixed colors. Migrate or validate these in both themes during
relevant UI work. The compact controls are smaller than the touch target guideline;
enlarge interactive hit areas where appropriate. Validate focus and contrast for
actual combinations, including muted text and destructive states, before release.
