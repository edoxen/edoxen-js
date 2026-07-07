// @edoxen/astro — Astro integration for the Edoxen data layer.
//
// Native .astro server components render at build time with zero
// client JS. This package provides:
//
//   * `integration()` — registers the SSR data loader + i18n helpers
//     with the Astro config.
//   * `components/` — server components (ResolutionList, MeetingDetail,
//     CommitteeCard, ...). Lifted from tc154's Vue components and
//     re-implemented as .astro files.
//
// See TODO 15 for the full component list. v0.1 ships skeleton only.

import type { AstroIntegration } from 'astro'

export interface EdoxenAstroOptions {
  dataDirs?: Array<{ kind: 'decisions' | 'meetings' | 'series'; path: string }>
  defaultLocale?: string
}

export function integration(opts: EdoxenAstroOptions = {}): AstroIntegration {
  return {
    name: '@edoxen/astro',
    hooks: {
      'astro:config:setup'({ config }) {
        // Reserve the dataDir on astro.config for downstream consumers.
        // Actual SSR data loading happens in component frontmatter via
        // `loadDecisions()` from the `edoxen` package directly.
        ;
        (config as Record<string, unknown>).__edoxen = opts
      },
    },
  }
}

export default integration
