# Authorization and tenant boundaries

Authentication answers who a user is. Authorization asks whether that user may
perform an action on this resource in this organization. A role groups permissions;
a permission is a backend-defined action code. A familiar role name such as Admin
does not prove universal access across organizations or resource scopes.

## Exact scope, fail closed

`PermissionSnapshot` is a frontend integration shape containing organizationId,
scopeId and codes. `hasPermission` returns true only when all three match the
requested organization, exact scope, and action code. Null snapshots, other tenants,
other scopes and absent codes are denied. It does not infer permission from role
names or inherit organization permissions into every team/project.

```ts
hasPermission(snapshot, organizationId, scopeId, backendPermissionCode);
```

`backendPermissionCode` must come from a verified catalog, not a guessed constant.
No production snapshot is loaded today because the effective-permission endpoint
is only a backend planning card. Test codes are synthetic fixtures, explicitly
limited to unit tests.

## Route and action checks

ProtectedRoute blocks anonymous access and waits for session initialization.
PermissionRoute takes a verified snapshot and renders its child route only for an
exact organization/scope/code match. Otherwise it shows the forbidden state.
Availability routes are public because they contain no tenant data. Scoped route
skeletons contain the organization ID in the URL but do not make data requests.

When backend access APIs exist, guard private content with membership AND permission
queries before mounting it. Buttons should use the same check for visibility or an
explanation, but the backend must independently authorize every HTTP request.
Disabling a button is a usability feature, not a security boundary: users can edit
the DOM or send arbitrary API requests.

## Organization context

The URL is the eventual active-context source of truth. An arbitrary path ID is
untrusted input; confirm it against current memberships and an authorized detail
response. Do not trust a localStorage organization ID, a route parameter alone,
or a stale list from a previous user.

The current switcher explains missing integration and has no pretend selections.
`switchOrganization` validates against supplied authorized IDs and removes tenant
data before returning an ID for navigation. The caller must provide fresh backend
evidence; the utility itself cannot verify membership with an absent API.

## Permission caching and revocation

Use `tenantKeys.permissions(organizationId, scopeId)`. Clear or invalidate it after
membership/grant changes, organization switches, logout and relevant 403s. A cached
permission can improve interface responsiveness but cannot guarantee continuing
authorization. Server enforcement must account for suspensions, resource state,
expired grants and revoked memberships on every request.

A 403 should not trigger token refresh. Recheck the active tenant's membership,
clear its data and show access denied or return to another accessible organization.
If no organization remains, show an honest empty membership state. Never fall back
to another tenant's data or the most recently cached successful permission snapshot.

## Backend evidence and unimplemented pieces

Backend Identity documentation proposes exact-scope effective access, but no route
implements it in the inspected runtime. Permission catalog seeds, tenant resource
authorization, and safe revoked-membership behavior remain backend integration gaps.
The frontend tests prove the pure matching/cache/guard behavior; they do not prove
the eventual backend policy. See [backend gaps](backend-integration-gaps.md).
