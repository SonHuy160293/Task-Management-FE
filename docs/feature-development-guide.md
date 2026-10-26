# Build your next feature: a maintainer's walkthrough

New to frontend development? Begin with [Build a feature by hand](manual-feature-tutorial.md),
the detailed course with syntax explanations, complete checkpoints, exercises,
and tests. This page is the shorter checklist for applying those concepts.

This guide is for a .NET developer adding a feature independently. It follows the
registration slice that actually exists: page -> form -> hook -> API -> shared
transport, with generated types, Zod, clear errors and tests. The example below is
a **hypothetical Project Management feature**. No Project endpoint, permission code,
DTO, or project screen is implemented by this release. Example names represent
roles in the architecture; substitute verified contracts before writing requests.

Before designing the UI, read [PRODUCT.md](../PRODUCT.md),
[DESIGN.md](../DESIGN.md), and [AGENTS.md](../AGENTS.md). Reuse the selected Nova
(`base-nova`) components, neutral semantic theme, Geist Variable, and Lucide icons.
Keep the Linear-inspired information density and clear feedback. Component/token
changes must update the design contract together with their implementation; do
not create a feature palette or parallel design system.

## 1. Establish the real backend behavior

Write the user story in observable terms: an authorized member can create a project
in an organization and see it in that organization's list. Identify its owner in
the backend and inspect the active controller/endpoint, handler, validator,
authorization, host registration and response filters. Read task cards for intent,
but do not treat Pending work as implemented.

For each operation record method/path, route IDs, query parameters, body DTO,
success statuses/shapes, errors, permissions, pagination, lifecycle semantics and
idempotency guarantees. Ask whether delete means soft archive or permanent removal;
do not decide that from a trash-can icon. Confirm whether names/slugs have unique
constraints and what a conflict returns.

If no endpoint exists, implement only independent presentation/infrastructure and
add a row in backend-integration-gaps.md. Do not add an Axios call to a route that
merely looks conventional. This rule is why Organizations and Teams have availability
pages today instead of seemingly functional CRUD that always fails.

## 2. Refresh and review OpenAPI

For an Identity change, use the existing workflow:

```powershell
npm run api:pull
git diff -- contracts/identity/openapi.json
npm run api:generate
npm run api:check
```

A separate Projects backend module needs its own reviewed specification under
contracts and a generation target under src/api/generated/projects. Extend the
generator with an explicit module entry; don't merge unrelated contracts by hand.
Use type aliases pointing into generated components/operations, as
features/auth/types/auth.ts does. Verify that HTTP response filters match Swagger;
registration currently requires handling a runtime envelope not reflected there.

## 3. Create only needed feature files

Suggested eventual structure:

```text
src/features/projects/
  api/projects.ts
  hooks/use-projects.ts
  hooks/use-create-project.ts
  schemas/project-form.ts
  components/project-form.tsx
  pages/projects-page.tsx
  types/projects.ts
```

Create a file when it has a responsibility. Don't begin with empty repositories,
services, domain entities or a second QueryClient. Shared infrastructure remains
in lib. Avoid importing another feature's private hooks/components; shared
organization membership/context should have an intentional public interface once
implemented, or be passed into the project view as verified inputs.

## 4. Define a typed API boundary

Use generated request and response types, and keep Axios outside components.
Registration's actual function is a working model:

```ts
const response = await http.post<unknown>('/v1/auth/register', request, {
  signal,
  authentication: 'omit',
});
return unwrapResponse(response.data, (value) => acceptedSchema.parse(value));
```

For Projects, substitute the **verified** path, generated DTO and runtime parser.
Do not copy authentication:omit for a private endpoint. Include organizationId in
the path/body exactly as the actual backend expects, and encode path segments if
their contract allows non-UUID strings. Pass AbortSignal as an Axios option. Return
business data from the API function so components do not depend on AxiosResponse.

Use runtime parsing for external or incompletely described shapes. Don't cast
unknown JSON with `as Project[]` and call it validation. Keep error normalization
in the interceptor, while a feature can translate known business codes into a
better field-level message. Do not log raw request configs.

## 5. Design query keys before hooks

Define a family such as tenant/project/list keys including organizationId, filters
and pagination. These names describe keys only, not a proposed HTTP contract.
The implemented tenantKeys.teams utility shows the structure. A list and detail
must have distinct keys. Permission snapshots also require the resource scope ID.

A read hook should receive verified organization context and URL-derived filters,
construct a deterministic key, pass signal to its API function and wait until
membership/access checks resolve. Let Query own isPending, isError, data and
refetch state; do not copy them into Zustand or a second set of booleans.

Mutations capture the organization ID that the user acted in, then invalidate only
that organization's relevant keys after success. Await invalidation when the next
navigation expects fresh data. Do not derive a mutation's tenant from a mutable
global selection after it starts. Query cannot cancel writes already accepted by
the server; prevent ambiguous switching or handle the result in its original scope.

## 6. Create a Zod form schema

Translate the backend validator into user-friendly client validation. Required
strings should reject whitespace-only values. Trim names if the server does;
never trim passwords. Validate lengths using the server's notion of characters.
Registration demonstrates why this matters: .NET Rune counts Unicode code points,
so JavaScript's string.length would reject some valid emoji passphrases.

```ts
// Illustrative UI-only schema. Match real project rules before use.
const exampleSchema = z.object({
  name: z.string().trim().min(1, 'Enter a project name.'),
});
type ExampleValues = z.infer<typeof exampleSchema>;
```

Deriving form values from Zod avoids duplicating validation and field type
definitions. A form model can differ from the API DTO: for example, an empty input
string may map to an optional nullable description. Make that transformation
explicit in the submit handler or API boundary, not in generated source.

## 7. Build the accessible form

Use useForm with zodResolver, defaults, registered inputs and handleSubmit. Give
every input a stable id and matching label. Connect hint/error IDs with
aria-describedby and set aria-invalid. Expose async failures in a role=alert
summary, known server errors under their fields, and focus the first error.

Compose new forms with the installed `FieldGroup`, `Field`, `FieldLabel`,
`FieldDescription`, and `FieldError` plus `Input`. Put `data-invalid` on Field
and `aria-invalid` on the input; use FieldSet/FieldLegend for related groups.
Registration's current native field markup is a working lifecycle example,
not a requirement to duplicate its layout. Reuse the installed control variants
and semantic roles; check the [styling guide](styling-guide.md) before composing.

Disable submission while pending and show a text loading label with a spinner.
Set type=button on non-submit controls. A mutation must not fire from useEffect or
rendering: it belongs in the submit event. Keep the submit handler async and catch
mutateAsync rejection. A toast confirms success; a durable inline error gives
enough detail to correct failure. Confirm success only after the server accepts
the request. Use the existing Sonner setup, and retain the user's values on
recoverable failure. Keep loading feedback meaningful under reduced motion.

For edit mode, do not overwrite user edits whenever a background refetch happens.
Initialize from the verified entity when the editor opens, track dirty state,
and handle concurrency/conflict responses explicitly. Capture any server version
token according to the contract rather than inventing an If-Match mechanism.

## 8. Compose route pages and states

A list page composes PageHeading, a filter toolbar, loading/error/empty/list
content, and creation UI. Distinguish:

- Initial loading: no authorized data has arrived yet.
- Empty membership: user has no accessible organization.
- Empty list: authorized request returned no projects.
- Filter-empty: projects may exist, but none match this search.
- Forbidden: server denied membership/permission; clear stale private content.
- Network failure: offer a controlled retry for reads.
- Background refetch: preserve usable content with a subtle pending indication.

Do not show an empty list for a request failure. Do not show a create button as
functional when its endpoint or permission query is missing. Existing availability
pages use disabled actions plus visible explanatory content.

Use the owned Card, Table, Badge, and Skeleton components when appropriate,
alongside the existing shared page/state components. Preserve heading order,
provide accessible names for icon-only actions, and allow long names to wrap or
expose their full value. Keep wide-table scrolling local. Follow DESIGN.md's
typography and spacing; the existing PageHeading has its own responsive title
sizes, so using it does not require restyling it to the recommended type scale.

Keep search/page in Router search params when a real search contract exists. Parse
numbers safely, reset pagination when filters change, and retain the URL for Back,
Forward and sharing. Do not guess cursor versus offset pagination.

## 9. Register scoped routes and navigation

Use an organization-aware URL shape alongside the implemented scoped Teams route
skeleton. Put private routes beneath ProtectedRoute, then a verified membership
boundary and PermissionRoute. An organization ID from the URL is untrusted input.
Load permissions for that exact resource scope before showing sensitive content.

Add only implemented destinations to navigation.ts. Give each page a title,
breadcrumb, heading and not-found behavior. Internal Link elements preserve SPA
navigation. Lazy-load route pages and reuse the existing Suspense fallback.

Use backend-defined permission codes from verified catalog data. Do not implement
`user.role === 'Admin'` to bypass permissions. Both route access and individual
actions should fail closed, and the backend must independently enforce everything.

## 10. Confirm destructive actions accessibly

If the backend supports deletion/archive, explain exactly what the action does,
show the affected name and require an explicit confirmation using an accessible
dialog. Cancel must be clear and safe; focus should return to the trigger. Do not
label a permanent delete as Archive or imply it is recoverable without evidence.
Use the installed AlertDialog composition with an accessible title/description.
Base UI triggers use `render`; older Radix shell triggers use `asChild`. Keep
each library's root and children together rather than mixing their APIs.
After success invalidate the original tenant's list/detail and navigate away from
an unavailable detail. Handle conflicts and permission loss without retrying writes.

## 11. Test observable behavior with MSW

Follow RegistrationForm tests: render with a QueryClientProvider, interact through
labels/roles with userEvent and intercept the verified URL in MSW. Tests should
cover happy path, required-field validation, server field errors, 403, network/5xx,
double-submit prevention, success feedback and invalidation.

For an organization-owned feature, preload separate keys for organization A and B;
switch context and confirm A's values never render under B. Delay an old request
and verify cancellation. Revoke membership and verify stale content/actions disappear.
For deletes test cancel as well as confirmation. For edit conflicts assert users
see the conflict and can recover without silent data loss.

The installed MSW 3 setup uses `onUnhandledFrame: 'error'`. Unexpected requests
must fail tests rather than silently hitting a real backend. Keep mocks inside
test files and src/test; never start a worker from main.tsx.

## 12. Verify real integration separately

Use an isolated backend/test account with known memberships and permissions. Check
the Network panel for exact URLs/statuses, server-side persistence for writes, and
the original organization context for cached results. A mock 201 cannot prove a
real transaction or authorization policy. Include two organizations, different
grants, revoked access, expired session and duplicate submission in acceptance.

When unavailable, record the exact missing capability and the strongest evidence
you have. Keep UI availability explicit. Avoid changing the backend as an implicit
side effect of frontend development.

## 13. Finish the change

```powershell
npm run format
npm run verify
npm run test:e2e
docker build -t devflow-frontend:local .
```

`verify` includes `npm run design:lint`; browser tests run separately. Install
Chromium once with `npx playwright install chromium`. For visible changes,
review 320px, 375px, 768px, 1024px, and 1440px layouts, 200% zoom, keyboard/touch
use, long/missing content, both themes, and reduced motion. Check focus and actual
contrast, browser errors, and unexpected network failures. Automated axe checks
do not establish full accessibility. Record remaining fixed-light/theme gaps
honestly rather than claiming complete dark coverage.

Review the diff for secrets and generated edits, update navigation/capability
inventory only after the feature works, and update docs/backend-integration-gaps.md,
DESIGN.md for any changed tokens/defaults, the relevant learning pages and
verification evidence. Follow the repository's
Git policy; do not automatically commit or push. A future reviewer should be able
to tell which paths are real integrations and which remain blocked.
