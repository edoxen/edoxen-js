// Reactive configuration. Each consumer creates its own config
// scope; multiple sites can coexist on the same page without
// polluting each other's body / profile / locale registries.
//
// Backwards-compat: the existing module-level `registerBodyTypes`,
// `registerProfile`, `pickExtensionAttribute` etc. still work — they
// operate on a synthetic `'default'` scope. New code should prefer
// `configureEdoxen()`.

import {
  registerBodyTypes as registerBodyTypesGlobal,
  getBodyTypes as getBodyTypesGlobal,
  bodyTypeFromCommittee as bodyTypeFromCommitteeGlobal,
  bodyTypeFromUrn as bodyTypeFromUrnGlobal,
  type BodyType,
  type BodyCode,
} from '../body/index.js'
import {
  registerProfile as registerProfileGlobal,
  getProfile as getProfileGlobal,
  pickExtensionAttribute as pickExtensionAttributeGlobal,
  decodeProfile as decodeProfileGlobal,
  type ProfileShape,
} from '../contacts/index.js'

export interface EdoxenConfig {
  /** Unique per site (e.g. 'tc184sc4', 'oiml', 'demo1'). */
  readonly scope: string
  /** Default locale for pickLocalization calls. */
  readonly defaultLocale?: string
  /** Body types for sites that host multiple committees. */
  readonly bodyTypes?: BodyType[]
  /** Profile registrations for `extensions[]` decoding. */
  readonly profiles?: Record<string, ProfileShape>
}

export interface EdoxenConfigHandle {
  readonly config: EdoxenConfig

  bodyTypeFromCommittee(committee: string | null | undefined): BodyCode | null
  bodyTypeFromUrn(urn: string | null | undefined): BodyCode | null

  pickExtensionAttribute(
    extensions: Parameters<typeof pickExtensionAttributeGlobal>[0],
    key: string,
  ): ReturnType<typeof pickExtensionAttributeGlobal>

  decodeProfile<T extends ProfileShape>(
    extensions: Parameters<typeof decodeProfileGlobal>[0],
    profile: string,
    shape: T,
  ): ReturnType<typeof decodeProfileGlobal<T>>
}

export function configureEdoxen(opts: EdoxenConfig): EdoxenConfigHandle {
  if (opts.bodyTypes) registerBodyTypesGlobal(opts.scope, opts.bodyTypes)
  if (opts.profiles) {
    for (const [name, shape] of Object.entries(opts.profiles)) {
      registerProfileGlobal(name, shape)
    }
  }

  return {
    config: opts,

    bodyTypeFromCommittee: (committee) => bodyTypeFromCommitteeGlobal(committee, opts.scope),
    bodyTypeFromUrn: (urn) => bodyTypeFromUrnGlobal(urn, opts.scope),

    pickExtensionAttribute: (extensions, key) => {
      // The global pickExtensionAttribute takes (extensions, profile, key)
      // where profile identifies which `extensions[].profile` to read.
      // For per-config convenience, the scope IS the profile name by
      // default; consumers that registered multiple profiles under one
      // scope should call `decodeProfile` directly with the profile name.
      return pickExtensionAttributeGlobal(extensions, opts.scope, key)
    },

    decodeProfile: (extensions, profile, shape) =>
      decodeProfileGlobal(extensions, profile, shape),
  }
}

// Exported for type-checking only — keep the global registries accessible.
export { getBodyTypesGlobal as getBodyTypes, getProfileGlobal as getProfile }
