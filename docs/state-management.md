# Choosing the right home for state

State is information that can change over time. Its owner determines who may
update it, how long it lives, and how it becomes stale. DevFlow deliberately uses
different tools for different lifecycles rather than one universal store.

| State                                      | Actual owner                 | Why                                                            |
| ------------------------------------------ | ---------------------------- | -------------------------------------------------------------- |
| Password visibility, search-dialog open    | Component useState           | Only that interaction needs it                                 |
| Registration field values and field errors | React Hook Form + Zod        | Validation, dirty fields, submission and focus belong together |
| Registration pending/error/request result  | TanStack mutation            | Request lifecycle with no automatic write retries              |
| Sidebar collapsed                          | Zustand UI store             | Shared preference needed by sidebar and content layout         |
| Session identity/access token              | In-memory session controller | Rotation, restoration, expiration and logout are one lifecycle |
| Future organizations/teams/permissions     | TanStack queries             | Data belongs to the server and needs freshness/cancellation    |
| Future team search/page                    | URL search params            | Shareable and restored through Back/Forward                    |

Props carry state from an owning component into children. If two siblings need the
same local value, lift it to their nearest common parent before adding a global
store. Never copy a server organization list into Zustand: two mutable copies will
disagree after a mutation or background refetch.

## Query cache basics

`createQueryClient` sets a **30-second staleTime**: cached reads are considered fresh
for that period. Stale does not mean immediately deleted or invalid; it means an
eligible event may refetch. Window focus is enabled for stale queries. Query's
default mount/reconnect behavior also refetches stale data.

**gcTime is five minutes** for queries. Once the last observer unmounts, inactive
data can be garbage-collected after that period. Active queries aren't removed
merely because gcTime passes. An explicit cache removal/logout can remove them
sooner. Form/registration mutations use zero gcTime; reset detaches their observer
so credentials do not linger in the mutation cache after settlement.

Reads retry at most once only for normalized network/5xx failures. A 400, 401, 403,
404 or 429 does not receive an automatic Query retry. Writes have `retry: false`
because repeating a POST after a network failure could create duplicates. Axios
does not run general retries; its narrow authenticated read replay is documented
in [authentication](authentication.md).

## Deterministic tenant keys

```ts
tenantKeys.teams('org-a', 'platform', 2);
// ['tenant', 'org-a', 'teams', { search: 'platform', page: 2 }]
tenantKeys.permissions('org-a', 'scope-a');
// ['tenant', 'org-a', 'permissions', 'scope-a']
```

Every input that changes a result must be in the key. A key without organizationId
can show another organization's cached teams. Permissions also require exact scope;
an organization grant does not imply a grant on every project or team. Query hashes
structured keys; a string concatenation scheme is unnecessary and error-prone.

These utilities are implemented and tested; there are no running organization/team
queries because those backend endpoints are missing. The following integration
pattern becomes appropriate **after** a real team API exists:

```ts
// Pattern only: fetchVerifiedTeams is an example name, not an existing function.
useQuery({
  queryKey: tenantKeys.teams(organizationId, search, page),
  queryFn: ({ signal }) =>
    fetchVerifiedTeams(organizationId, search, page, signal),
  enabled: membershipIsVerified && permissionIsGranted,
});
```

The query function must pass `signal` to Axios so canceled requests can't refill an
obsolete view. `enabled: false` does not authorize access; it only avoids a request.
Check membership and backend-defined permissions in addition to server enforcement.

## Switching and revocation

`switchOrganization(client, next, accessibleIds)` checks next against a verified
membership list, cancels tenant reads, removes tenant caches, and clears retained
mutation variables. It returns the accepted ID for navigation. It does not fetch
memberships, change backend context, or manufacture an active organization.

When wiring it, get current memberships first, await the utility, navigate to the
new organization URL, then query that organization's permissions. Unmount the old
view before enabling new actions. Query cannot cancel already executing mutations;
each mutation must capture its organization ID in its variables/API URL and avoid
writing results into the new organization's key. Disable switching during writes
when the eventual business flow cannot tolerate that ambiguity.

On membership revocation/403, fail closed, cancel/remove that tenant's queries and
return to an authorized organization selection. Refresh memberships and permissions;
do not keep showing old permission data as authorization evidence. The current
production UI does not fetch tenant data, so it cannot yet demonstrate this real
backend lifecycle. Tests prove only the available switching/cache/guard utilities.

## Mutations and invalidation

A successful future team update should invalidate that organization's team list
and detail keys. Invalidation marks data stale and refetches active matching queries;
it is not a database transaction. Avoid invalidating `['tenant']` for every edit
when one tenant/detail is sufficient. Keep mutation success feedback in the view
that initiated it and show server field errors instead of discarding them.

Registration does not invalidate a user profile: it does not sign the user in.
`AuthProvider` subscribes to the controller and clears Query caches when an
authenticated session becomes anonymous. This prevents a later browser user from
seeing retained private results.
