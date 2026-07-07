// Multi-body support — for sites that host more than one committee
// under a single archive (e.g. OIML: CIML + Conference + DC).
//
// Lifted from OIML's `bodyTypeFromCommittee` and `bodyTypeFromSourceFile`
// helpers; generalised so any consumer can register its own body set.

export interface BodyType {
  code: string
  name: string
  urnPrefix: string
}

const REGISTRY = new Map<string, BodyType[]>()

export function registerBodyTypes(scope: string, types: BodyType[]): void {
  REGISTRY.set(scope, types)
}

export function getBodyTypes(scope: string): BodyType[] {
  return REGISTRY.get(scope) ?? []
}

export function bodyTypeFromCommittee(
  committee: string | null | undefined,
  scope: string,
): string | null {
  if (!committee) return null
  const c = committee.toLowerCase()
  for (const t of getBodyTypes(scope)) {
    if (c.includes(t.code) || c.includes(t.name.toLowerCase())) return t.code
  }
  return getBodyTypes(scope)[0]?.code ?? null
}

export function bodyTypeFromUrn(
  urn: string | null | undefined,
  scope: string,
): string | null {
  if (!urn) return null
  for (const t of getBodyTypes(scope)) {
    if (urn.includes(t.urnPrefix)) return t.code
  }
  return null
}
