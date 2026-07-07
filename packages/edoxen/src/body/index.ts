// Multi-body support — for sites that host more than one committee
// under a single archive (e.g. OIML: CIML + Conference + DC).
//
// Lifted from OIML's `bodyTypeFromCommittee` and `bodyTypeFromSourceFile`
// helpers; generalised so any consumer can register its own body set.

// BodyCode — branded string (e.g. 'ciml', 'conference', 'dc').
// Branded to prevent passing arbitrary strings where a body code is
// expected (e.g. locale codes, identifiers).
export type BodyCode = string & { readonly __brand: 'BodyCode' }

export function buildBodyCode(value: string): BodyCode {
  if (!/^[a-z][a-z0-9_-]*$/.test(value)) {
    throw new Error(`Invalid body code: ${value}`)
  }
  return value as BodyCode
}

export interface BodyType {
  code: BodyCode
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
): BodyCode | null {
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
): BodyCode | null {
  if (!urn) return null
  for (const t of getBodyTypes(scope)) {
    if (urn.includes(t.urnPrefix)) return t.code
  }
  return null
}
