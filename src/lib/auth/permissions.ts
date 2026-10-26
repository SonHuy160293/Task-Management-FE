export interface PermissionSnapshot {
  organizationId: string;
  scopeId: string;
  codes: readonly string[];
}

export function hasPermission(
  snapshot: PermissionSnapshot | null | undefined,
  organizationId: string,
  scopeId: string,
  code: string,
) {
  return (
    snapshot?.organizationId === organizationId &&
    snapshot.scopeId === scopeId &&
    snapshot.codes.includes(code)
  );
}
