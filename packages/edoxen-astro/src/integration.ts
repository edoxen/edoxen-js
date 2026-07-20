// @edoxen/astro — Astro integration for the Edoxen data layer.
//
// Native .astro server components render at build time with zero
// client JS. This package provides:
//
//   * `integration()` — registers the SSR data loader + i18n helpers
//     + site chrome configuration with the Astro config.
//   * `components/` — server components:
//       - data presentation (ResolutionList, MeetingDetail, ActionTypeBadge)
//       - site chrome (Header, Footer, About, SiteLayout)
//   * `config/` — the SiteConfig contract + loader. Consumers put an
//     `edoxen.config.ts` at project root to override defaults; the
//     chrome components read the merged config and render.
//
// Zero-config: the package ships sensible chrome (logo, Meetings +
// Decisions + About nav, auto-generated footer, default about page)
// so a consumer can have a working site without writing any layout
// code. Override any piece via `edoxen.config.ts` or by shadowing
// the .astro files.

import type { AstroIntegration } from 'astro'
import type { SiteConfig } from './config/index.js'

export interface EdoxenAstroOptions {
  dataDirs?: Array<{ kind: 'decisions' | 'meetings' | 'series'; path: string }>
  defaultLocale?: string
  /**
   * Site chrome configuration. When set, this overrides any
   * `edoxen.config.ts` at the project root — useful for monorepos
   * that want to inject config programmatically. When unset, the
   * integration loads `edoxen.config.{ts,mjs,js}` from `process.cwd()`.
   */
  siteConfig?: Partial<SiteConfig>
}

export function integration(opts: EdoxenAstroOptions = {}): AstroIntegration {
  return {
    name: '@edoxen/astro',
    hooks: {
      'astro:config:setup'({ config }) {
        // Reserve the dataDir + siteConfig on astro.config for
        // downstream consumers. Actual SSR data loading happens in
        // component frontmatter via `loadDecisions()` from the
        // `edoxen` package directly; chrome components read the
        // siteConfig via `loadSiteConfig()`.
        ;
        (config as Record<string, unknown>).__edoxen = opts
      },
    },
  }
}

export default integration

// Re-export the public API.
export type {
  SiteConfig,
  NavItem,
  LogoConfig,
  FooterConfig,
} from './config/index.js'

export {
  defaultSiteConfig,
  mergeSiteConfig,
  resolveFooter,
  loadSiteConfig,
  loadSiteConfigSync,
  resolveConfigPath,
  resetSiteConfigCache,
} from './config/index.js'
