// URN — branded type + helpers for edoxen scoped URNs (1.0).
//
// 1.0 URN format: `urn:edoxen:{entity}:{scope}:{local-id}`.
// Examples:
//   urn:edoxen:contact:isotc154:jianfang-zhang
//   urn:edoxen:venue:isotc154:fairmont-house-hkma
//   urn:edoxen:meeting:isotc154:plenary-42
//   urn:edoxen:decision:isotc154:2023-res-41

// General URN regex (RFC 8141-ish, NID + NSS).
const URN_RE = /^urn:[a-z0-9][a-z0-9-]{0,30}:[^\s]+$/

// Edoxen scoped URN regex (4 segments after urn:).
const SCOPED_URN_RE =
  /^urn:edoxen:(?<entity>[a-z][a-z0-9_-]*):(?<scope>[a-z][a-z0-9_-]*):(?<id>[a-z0-9][a-z0-9_-]*)$/i

export type Urn = string & { readonly __brand: 'Urn' }

export function isUrn(value: unknown): value is Urn {
  return typeof value === 'string' && URN_RE.test(value)
}

export function buildUrn(value: string): Urn {
  if (!URN_RE.test(value)) {
    throw new Error(`Invalid URN: ${value}`)
  }
  return value as Urn
}

// DecisionId — opaque identifier string derived from a Decision's
// structured identifier (e.g. "CIML/2009-1" → "CIML-2009-1").
export type DecisionId = string & { readonly __brand: 'DecisionId' }

export function buildDecisionId(value: string): DecisionId {
  return value.replace(/\//g, '-') as DecisionId
}

// Parsed segments of an edoxen scoped URN.
export interface ScopedUrnParts {
  entity: string
  scope: string
  id: string
}

export function parseUrn(value: string): { nid: string; nss: string } | null {
  const m = value.match(/^urn:([a-z0-9][a-z0-9-]{0,30}):(.+)$/)
  if (!m) return null
  return { nid: m[1], nss: m[2] }
}

// Parse a 1.0 scoped URN. Returns null when not an edoxen scoped URN.
export function parseScopedUrn(value: string): ScopedUrnParts | null {
  const m = SCOPED_URN_RE.exec(value)
  if (!m || !m.groups) return null
  return {
    entity: m.groups.entity,
    scope: m.groups.scope,
    id: m.groups.id,
  }
}

export function isScopedUrn(value: unknown): value is Urn {
  return typeof value === 'string' && SCOPED_URN_RE.test(value)
}

// Format a 1.0 scoped URN from its parts.
export function formatScopedUrn(entity: string, scope: string, id: string): Urn {
  return buildUrn(`urn:edoxen:${entity}:${scope}:${id}`)
}

export function slugFromUrn(urn: string): string {
  const parts = parseScopedUrn(urn)
  if (parts) return parts.id
  const m = urn.match(/:([-\w]+)$/)
  return m ? m[1] : ''
}

export function urnPath(urn: string, prefix?: string): string {
  const slug = slugFromUrn(urn)
  return prefix ? `${prefix.replace(/\/$/, '')}/${slug}` : slug
}

// Build a scoped meeting URN. Convenience used by sites that
// construct URNs from a scope (registry/dataset name) + identifier.
export function buildMeetingUrn(scope: string, id: string): Urn {
  return formatScopedUrn('meeting', scope, id)
}

export function buildContactUrn(scope: string, id: string): Urn {
  return formatScopedUrn('contact', scope, id)
}

export function buildVenueUrn(scope: string, id: string): Urn {
  return formatScopedUrn('venue', scope, id)
}

export function buildDecisionUrn(scope: string, id: string): Urn {
  return formatScopedUrn('decision', scope, id)
}
