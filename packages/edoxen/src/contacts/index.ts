// Contacts — v3.0 Contact / Name / ContactMethod helpers.
//
// v3.0 per-field localization: every translatable field on Contact
// is `Localized<String|Name>[]`. The `name` field is an array of
// `{ spelling, value: Name }` entries (per ISO 24229 spelling codes).
// Use `displayName()` to pick a localized Name and render it.

import type { Name, Contact, ContactMethod, MeetingExtension, ExtensionAttribute, LocalizedName, LocalizedString } from '../types/generated/meeting.js'
import { pickLocalized } from '../i18n/index.js'

export interface ResolvedContact {
  name: string
  organization: string
  email: string
  phone: string
}

export function displayName(name: Name | null | undefined): string {
  if (!name) return ''
  if (name.formatted) return name.formatted
  return [name.prefix, name.given, name.additional, name.family, name.suffix]
    .filter((s) => s != null && String(s).trim() !== '')
    .join(' ')
}

// Pick a localized name from a v3.0 LocalizedName[] collection.
// Returns the matching Name (or first, when fallback). Returns null
// when the collection is empty.
export function pickName(
  names: LocalizedName[] | null | undefined,
  preferred: string,
  fallback = true,
): Name | null {
  const entry = pickLocalized(names as { spelling: string; value: Name }[] | null | undefined, preferred, fallback)
  return entry?.value ?? null
}

// Pick the first localized string value out of a v3.0 LocalizedString[]
// collection. Used for title, affiliation, address, etc.
export function pickString(
  list: LocalizedString[] | null | undefined,
  preferred: string,
  fallback = true,
): string {
  const entry = pickLocalized(list as { spelling: string; value: string }[] | null | undefined, preferred, fallback)
  return entry?.value ?? ''
}

export function primaryContactMethod(
  methods: ContactMethod[] | null | undefined,
  kind: string,
): string {
  if (!Array.isArray(methods)) return ''
  const primary = methods.find((m) => m && m.kind === kind && m.primary) ||
                  methods.find((m) => m && m.kind === kind)
  return primary?.value ?? ''
}

// Resolve a Contact to a display-friendly shape for a preferred spelling.
// Picks the localized name, affiliation, email, phone. Returns null when
// the Contact itself is null or is a `{ ref: ... }` URN reference.
export function presentContact(
  p: Contact | null | undefined,
  preferredSpelling = 'eng',
): ResolvedContact | null {
  if (!p) return null
  // Reference-only Contact (ref: urn:...) carries no inline data.
  if (typeof p === 'object' && 'ref' in p && (p as { ref?: string }).ref) return null
  const name = pickName(p.name as LocalizedName[] | undefined, preferredSpelling)
  return {
    name: displayName(name ?? undefined),
    organization: pickString(p.affiliation as LocalizedString[] | undefined, preferredSpelling),
    email: primaryContactMethod(p.contact_methods as ContactMethod[] | undefined, 'email'),
    phone: primaryContactMethod(p.contact_methods as ContactMethod[] | undefined, 'phone'),
  }
}

// Extensions: pick a typed attribute out of a MeetingExtension list.

export function pickExtensionAttribute(
  extensions: MeetingExtension[] | null | undefined,
  profile: string,
  key: string,
): ExtensionAttribute | null | undefined {
  if (!Array.isArray(extensions)) return null
  const ext = extensions.find((e) => e && e.profile === profile)
  if (!ext || !Array.isArray(ext.attributes)) return null
  return ext.attributes.find((a) => a && a.key === key) ?? null
}

// --- Profile registry (OCP) ---------------------------------------

export interface ProfileShape {
  readonly [key: string]: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime'
}

const PROFILE_REGISTRY = new Map<string, ProfileShape>()

export function registerProfile(profile: string, shape: ProfileShape): void {
  PROFILE_REGISTRY.set(profile, shape)
}

export function getProfile(profile: string): ProfileShape | undefined {
  return PROFILE_REGISTRY.get(profile)
}

export function decodeProfile<T extends ProfileShape>(
  extensions: MeetingExtension[] | null | undefined,
  profile: string,
  shape: T,
): { [K in keyof T]?: string | number | boolean | null } {
  const out: Record<string, string | number | boolean | null> = {}
  if (!Array.isArray(extensions)) return out
  for (const key of Object.keys(shape)) {
    const attr = pickExtensionAttribute(extensions, profile, key)
    if (!attr) {
      out[key] = null
      continue
    }
    out[key] = decodeTypedValue(attr, shape[key])
  }
  return out
}

function decodeTypedValue(
  attr: ExtensionAttribute,
  expected: ProfileShape[string],
): string | number | boolean | null {
  if (expected === 'integer' && typeof attr.intValue === 'number') return attr.intValue
  if (expected === 'float' && typeof attr.floatValue === 'number') return attr.floatValue
  if (expected === 'boolean' && typeof attr.booleanValue === 'boolean') return attr.booleanValue
  if (expected === 'date' && attr.dateValue) return attr.dateValue
  if (expected === 'datetime' && attr.dateTimeValue) return attr.dateTimeValue
  if (expected === 'string' && attr.value) return attr.value
  return null
}
