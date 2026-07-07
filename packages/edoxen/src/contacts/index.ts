// Contacts — v2.2 Contact / Name / ContactMethod helpers.
//
// v2.2 (per TODO.refactor in the gem) collapsed the v2.1 flat
// `email`/`phone`/`orcid` fields on Person into typed
// `contact_methods[]` (kind-discriminated) and `identifiers[]`. The
// `name` field is now a Name object (VCARD-shaped), not a string.
//
// No back-compat — fixtures must conform to the v2.2 wire shape.

import type { Name, Contact, ContactMethod, MeetingExtension, ExtensionAttribute } from '../types/generated/meeting.js'

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

export function primaryContactMethod(
  methods: ContactMethod[] | null | undefined,
  kind: string,
): string {
  if (!Array.isArray(methods)) return ''
  const primary = methods.find((m) => m && m.kind === kind && m.primary) ||
                  methods.find((m) => m && m.kind === kind)
  return primary?.value ?? ''
}

export function presentContact(p: Contact | null | undefined): ResolvedContact | null {
  if (!p) return null
  return {
    name: displayName(p.name as Name | null | undefined),
    organization: (p as { affiliation?: string }).affiliation ?? '',
    email: primaryContactMethod(p.contact_methods as ContactMethod[] | undefined, 'email'),
    phone: primaryContactMethod(p.contact_methods as ContactMethod[] | undefined, 'phone'),
  }
}

// Extensions: pick a typed attribute out of a MeetingExtension list.
//
// Sites register their profile via `registerProfile()` so the lookup
// is type-checked at compile time. Without registration, callers use
// the lower-level `pickExtensionAttribute()` which returns the raw
// value.

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
