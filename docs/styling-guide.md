# Styling DevFlow

## CSS foundations

CSS rules select elements and apply declarations. `body { margin: 0; }` selects
the document body. `.menu-item` selects a class. `:focus-visible` selects keyboard
focus. Avoid IDs for styling because their high specificity makes overrides harder.
The browser combines applicable rules through the cascade, inheritance and
specificity. DevTools' Styles and Computed panels show the winning declaration.

Each element has a box: content, padding, border, then margin. Padding is space
inside the border; margin is space outside. `p-6` gives uniform internal padding;
`mt-3` separates an element from the one above. `gap-4` spaces children in flex/grid
without assigning margins to individual children. Tailwind's reset uses border-box
so declared width includes padding and border.

## Layout in this application

Flexbox arranges one primary row or column. The header uses `flex items-center
justify-between` to align breadcrumbs and user controls. `min-w-0` lets text shrink
and truncate rather than forcing a horizontal scrollbar. `shrink-0` protects icons.

Grid handles two-dimensional layout. The overview module cards use
`grid gap-4 md:grid-cols-3`: one column on small screens, three at the medium
breakpoint. The registration page switches to two columns at `lg`. The desktop
sidebar is fixed; matching content padding reserves its width. The mobile sidebar
is a Radix modal with an overlay, focus trap, Escape handling, and a Close button.

Breakpoints are minimum widths: unprefixed utilities apply everywhere, `sm:` from
640px, `md:` from 768px, `lg:` from 1024px and `xl:` from 1280px under Tailwind's
defaults. Work from the smallest layout upward. Don't give content a fixed width
larger than the viewport. Tables scroll inside an overflow wrapper rather than
making the whole page wider.

## Tailwind and tokens

Tailwind generates CSS utility classes discovered in source. `rounded-xl border
bg-background p-6` expresses shape, outline, surface and spacing. Keep complete
class names in the source; constructing `bg-${color}-500` prevents reliable class
detection. Use a map of full strings or a component variant instead.

`src/app/styles/globals.css` imports Tailwind v4. `@theme inline` maps semantic
Tailwind colors to CSS variables in `:root` and `.dark`. For example `bg-primary`
uses `--primary`, the Nova neutral action color. [DESIGN.md](../DESIGN.md) is the
design contract: its frontmatter records the exact light/dark OKLCH values and its
prose explains their use. Reuse those roles and keep documentation and CSS in sync.
There is no separate tailwind.config.js in this v4 setup; do not introduce one.

The locally bundled `@fontsource-variable/geist` package supplies Geist Variable.
Both `font-sans` and `font-heading` resolve to it, with a sans-serif fallback;
there is no remote font service. Body copy, headings, helper text and metadata
use Tailwind's existing scale as documented in DESIGN.md. Keep important labels
readable and do not use color alone to convey availability or failure. Dark theme
variables exist, but the legacy shell still has fixed light colors; complete dark
screen coverage and a theme switcher remain gaps, not completed functionality.

## shadcn/ui ownership

shadcn/ui is source you own, not an opaque UI framework. `components.json` records
the selected `base-nova` style, neutral theme, Lucide icons, and `@/` aliases.
The installed UI components use Base UI primitives. The older application shell
also uses Radix directly for its mobile navigation and menus; inspect the actual
component API and keep each primitive's root and children together. Tailwind
controls the visual treatment.
Button variants use class-variance-authority. The application helper at
`@/lib/utils/cn` combines `clsx` and `tailwind-merge`; generated Nova components
currently import the `cn` package directly. Both support class-name composition;
preserve the owning file's existing imports when editing it.

For example:

```tsx
<Button variant="outline" size="sm" onClick={retry}>
  Try again
</Button>
```

Base UI components such as Button use `render` for composition. For a Link,
also set `nativeButton={false}` because it renders an anchor:

```tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

<Button nativeButton={false} render={<Link to="/guide" />}>
  Open guide
</Button>;
```

Radix components in the existing shell use `asChild` instead. Do not pass
Radix-only props to Base UI components. Keep roots and children from the same
primitive library together. Nested interactive elements harm keyboard and screen-reader behavior.
Feature-specific business decisions belong in feature components, not these UI
primitives.

For new forms, compose the installed `FieldGroup`, `Field`, `FieldLabel`,
`FieldDescription`, and `FieldError` with the existing controls. Set
`data-invalid` on Field and `aria-invalid` on the input, and connect hints/errors
with `aria-describedby`. Registration currently uses native label/fieldset
markup; it demonstrates form state and API handling, not the newer Field layout.
Preserve its working behavior when changing composition during relevant UI work.

The installed Button/Input default height is 2rem and their radius is
`rounded-lg` (0.625rem). Card uses `rounded-xl` (0.875rem), a 1rem spacing default,
and `ring-1 ring-foreground/10`; its small variant uses 0.75rem spacing. Use the
component variants before overriding dimensions. Compact visual size still needs
adequate touch hit areas. The exact scales and typography roles live in DESIGN.md.

Notifications currently use `toast` from `sonner`, with its Toaster mounted in
`src/app/providers/providers.tsx`. The generated `components/ui/sonner.tsx` wrapper
is not mounted there; its presence and the installed `next-themes` package do not
establish a working app theme switcher. Reuse the active notification setup.

## A practical editing checklist

1. Read DESIGN.md first and preserve Nova, Geist, and Lucide. Change a shared token
   for a global design change. Change a component utility
   for a local spacing/layout change.
2. Inspect desktop and narrow layouts. Ensure buttons wrap or fit and long names
   don't push content outside the screen.
3. Tab through the page: focus must remain visible. Dialog close should return
   focus to its trigger, and navigation should focus the new main content.
4. Verify every field has a label and error text linked with aria-describedby.
5. Check foreground/background contrast for body copy and controls. Decorative
   disabled/metadata colors should never be the only signal of essential information.
6. Respect reduced motion; globals.css reduces transitions and animation when the
   user requests it. Loading text remains meaningful without relying on spinning.
7. Update DESIGN.md alongside token or component-default changes and run
   `npm run design:lint`. The installed `npm exec -- designmd spec` describes the
   supported document format; validation does not compare the document to CSS.
   Run formatting, linting, typecheck, affected tests, and build for source changes.
   Browser visual review is still needed; jsdom cannot verify pixels or responsive
   layout.

Official references: [Tailwind Vite installation](https://tailwindcss.com/docs/installation/using-vite),
[shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite), and
[MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). Component references:
[Base Button](https://ui.shadcn.com/docs/components/base/button),
[Field](https://ui.shadcn.com/docs/components/base/field), and
[Dialog](https://ui.shadcn.com/docs/components/base/dialog). The local component
source determines the installed API and defaults.
