// URN — branded type + helpers for edoxen URN handling.
//
// Branded `Urn` type prevents accidental string-vs-URN mixing at
// compile time. `buildUrn()` is the only way to construct one.

const URN_RE = /^urn:[a-z0-9][a-z0-9-]{0,30}:[^\s]+$/

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
// Branded to prevent passing arbitrary strings.
export type DecisionId = string & { readonly __brand: 'DecisionId' }

export function buildDecisionId(value: string): DecisionId {
  return value.replace(/\//g, '-') as DecisionId
}

export function parseUrn(value: string): { nid: string; nss: string } | null {
  const m = value.match(/^urn:([a-z0-9][a-z0-9-]{0,30}):(.+)$/)
  if (!m) return null
  return { nid: m[1], nss: m[2] }
}

export function slugFromUrn(urn: string): string {
  const m = urn.match(/:([-\w]+)$/)
  return m ? m[1] : ''
}

export function urnPath(urn: string, prefix?: string): string {
  const slug = slugFromUrn(urn)
  return prefix ? `${prefix.replace(/\/$/, '')}/${slug}` : slug
}

// Build a meeting URN from a nid (e.g. 'oiml') and an identifier
// slug (e.g. 'ciml-15'). Convenience used by sites that construct
// URNs from committee + slug.
export function buildMeetingUrn(nid: string, slug: string): Urn {
  return buildUrn(`urn:${nid}:meeting:${slug}`)
}
