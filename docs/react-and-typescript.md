# React and TypeScript through the actual code

## Components, JSX and props

A component is a function that describes UI. JSX lets a TypeScript file contain
HTML-like syntax. A `.tsx` extension enables it; `.ts` is used without JSX. In
`components/common/page-heading.tsx`, `PageHeading` receives a typed props object
and returns a heading, description and optional action. Use it as:

```tsx
<PageHeading
  eyebrow="WORKSPACE / TEAMS"
  title="Teams"
  description="Bring the people who plan, build, and ship together."
/>
```

Props are inputs, similar to constructor parameters, but React may invoke the
function again with new inputs. Do not mutate them. `{description}` evaluates a
JavaScript expression inside JSX. `className` sets an HTML class; `htmlFor` connects
a label to an input. Capitalized tags are components; lowercase tags are native DOM.
Close every tag (`<Input />`) and return one root element or a fragment `<>...</>`.

Composition means passing components as children or props. `EmptyState` accepts an
icon and action; each feature supplies its own content. This is more flexible than
a shared component that imports every feature and switches on business names.

## Local state, events and rerendering

`RegistrationForm` uses `useState(false)` to track password visibility. The state
setter schedules a rerender, and the input type becomes `text` or `password`:

```tsx
const [visible, setVisible] = useState(false);
<button type="button" onClick={() => setVisible(!visible)}>
  {visible ? 'Hide password' : 'Show password'}
</button>;
```

The handler is a function passed to React, not a function called while rendering.
`onClick={setVisible(true)}` is wrong: it changes state during render. A state
variable is a snapshot for that render. When updates depend on the previous value,
prefer `setVisible((previous) => !previous)` to avoid stale closures.

React reruns component functions when their state, context, or parent inputs
change. It reconciles the resulting tree with the existing DOM. A rerender is
normal; it is not automatically a network request. List children need stable keys
(`key={title}` for static module cards, real resource IDs for server rows). Array
indices are unreliable keys when items can be reordered or removed.

## Hooks and lifecycle

Hooks are functions named `use...` that integrate with React. Call them only at the
top level of a component or another hook, before conditional returns. Calling a
hook inside a loop or conditional changes call order and corrupts React's state
association. The hooks ESLint rules enforce this.

`useState` owns local UI values. `useForm` owns inputs and validation. `useMutation`
owns the registration request lifecycle. `useSyncExternalStore` in `useAuth` reads
the session controller and subscribes safely to changes.

`useEffect` synchronizes with systems outside rendering. `AuthProvider` subscribes
to the session controller, initializes it, and returns an unsubscribe cleanup.
Effects run after commit, and cleanup runs on unmount or dependency change. During
development, StrictMode deliberately exercises setup/cleanup twice to reveal
unsafe side effects. `session.initialize()` is coordinated so that does not issue
duplicate restore requests once a real adapter is implemented.

Ordinary API reads belong in TanStack Query, not an effect that manually toggles
loading/error booleans. An effect dependency list describes everything the effect
reads from its surrounding render. Omitting dependencies to suppress reruns often
creates stale values. Don't silence the rule; restructure the code.

## TypeScript: types disappear at runtime

`RegisterRequest` is a generated object type. `SessionAdapter` is a handwritten
interface describing the methods an integration must implement. Both help the
compiler reject incompatible values. Neither checks data arriving over HTTP:
`acceptedSchema.parse` performs that runtime check using Zod.

```ts
interface ExampleProps {
  title: string;
  onClose?: () => void;
}
type Status = 'initializing' | 'anonymous' | 'authenticated';
```

`?` means optional. With strict null checking, an optional value might be
`undefined`. Use `value?.property`, a guard, or `value ?? defaultValue`. Avoid `!`
unless an invariant truly guarantees a value. `noUncheckedIndexedAccess` also
requires checking array/dictionary lookups that may not exist.

`SessionSnapshot` is a discriminated union. Checking `status === 'authenticated'`
lets TypeScript know `identity` exists in that branch. This is safer than separate
booleans such as `isLoggedIn` alongside a nullable user that can disagree.

Type inference derives obvious types: `useState(false)` gives a boolean state;
`z.infer<typeof registrationSchema>` derives form values from the schema. Prefer
inference when it stays readable. Annotate public boundaries and ambiguous values.

## Generics, promises and modules

A generic is a type parameter, like `List<T>` in C#. `unwrapResponse<T>` can return
different validated payload types without `any`. `http.post<unknown>` deliberately
starts with untrusted data; a parser must establish its shape.

An async function returns a `Promise<T>`, similar to `Task<T>`. `await` waits for
settlement without blocking the UI thread. Catch expected request failures around
`await mutation.mutateAsync(values)`; otherwise a rejected promise may appear as
an unhandled error. `Promise.all` runs independent asynchronous work concurrently.
It does not make synchronous CPU-heavy code run on separate threads.

`export` publishes a module value; `import` consumes it. `import type` disappears
from runtime output. `@/` resolves to `src/` through Vite and TypeScript aliases.
The generated Identity file is type-only in feature code and does not add an API
client to the browser. Dynamic `lazy(() => import(...))` creates page chunks that
load when visited, with Suspense providing a loading fallback.

## Common mistakes to avoid

- Mutating state arrays directly: make a new array/object through the setter.
- Storing all server results in Zustand: use Query so freshness and invalidation
  remain coherent.
- Believing TypeScript secures JSON: validate HTTP payloads at runtime where needed.
- Using `any` to hide errors: narrow `unknown`, or fix the actual contract mismatch.
- Logging Axios errors: request config can contain a password or Authorization.
- Fetching during render: rendering can run repeatedly; use queries or mutations.
- Treating registration acceptance as login: the current backend explicitly does not.

Continue with [state management](state-management.md) for the data lifecycle and
[styling](styling-guide.md) for how the TSX becomes the visual interface.
