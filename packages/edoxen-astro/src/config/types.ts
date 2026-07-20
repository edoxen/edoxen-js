// SiteConfig — the contract a consumer's edoxen.config.ts implements.
//
// Every field has a default; consumers only override what they want
// to change. The browser package ships sensible chrome out of the
// box: a logo, a Meetings/Decisions/About nav, an auto-generated
// footer, and a default about page that explains the site is
// Edoxen-powered.

export interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
  /** Dropdown children collapse under the parent on narrow screens. */
  collapsed?: boolean
}

export interface LogoConfig {
  /**
   * Path (under the consumer's /public) to the light-mode logo.
   * Defaults to the bundled Edoxen mark.
   */
  light: string
  /**
   * Optional dark-mode variant. When omitted, the light logo is used
   * for both themes.
   */
  dark?: string
  /** Alt text — defaults to the site title. */
  alt?: string
}

export interface FooterConfig {
  /**
   * HTML string rendered in the footer message line. When unset, the
   * package auto-generates: 'An Edoxen-powered registry of meetings
   * and decisions'.
   */
  message?: string
  /**
   * Plain-text copyright line. When unset, the package auto-generates
   * from the current year + site title.
   */
  copyright?: string
  /**
   * Show the 'Powered by Edoxen' attribution link. Defaults to true.
   * Set to false only when the consumer's licence / brand terms
   * require it.
   */
  showEdoxenAttribution?: boolean
}

export interface SiteConfig {
  /** Site title shown in the header next to the logo. */
  title: string
  /** Logo paths under /public. */
  logo: LogoConfig
  /** Top-nav entries. The default ships Meetings + Decisions + About. */
  nav: NavItem[]
  /** Path the About page lives at. Defaults to '/about'. */
  aboutPath: string
  /**
   * Inline markdown for the About page. When set, the bundled default
   * About content is ignored and this string is rendered instead.
   * For longer copy, leave this unset and put an `about.md` in the
   * consumer's `src/pages/` — Astro will route it.
   */
  aboutContent?: string
  /** Footer configuration. */
  footer: FooterConfig
  /** GitHub URL for the header's GitHub link. Optional. */
  githubUrl?: string
  /** Google Fonts (or equivalent) stylesheet URL. Optional. */
  fontsUrl?: string
}

export const defaultSiteConfig: SiteConfig = {
  title: 'Edoxen',
  logo: {
    light: '/edoxen-logo.svg',
    dark: '/edoxen-logo-dark.svg',
  },
  nav: [
    { text: 'Meetings', link: '/meetings' },
    { text: 'Decisions', link: '/decisions' },
    { text: 'About', link: '/about' },
  ],
  aboutPath: '/about',
  footer: {
    showEdoxenAttribution: true,
  },
  githubUrl: 'https://github.com/edoxen/edoxen',
}

/**
 * Merge a partial consumer config with the defaults. Nested objects
 * are merged one level deep (footer.{message,copyright,showEdoxenAttribution}).
 */
export function mergeSiteConfig(
  overrides: Partial<SiteConfig> | undefined,
): SiteConfig {
  if (!overrides) return defaultSiteConfig

  return {
    ...defaultSiteConfig,
    ...overrides,
    logo: { ...defaultSiteConfig.logo, ...(overrides.logo ?? {}) },
    footer: { ...defaultSiteConfig.footer, ...(overrides.footer ?? {}) },
    nav: overrides.nav ?? defaultSiteConfig.nav,
  }
}

/**
 * Auto-generate the footer message + copyright lines when the consumer
 * hasn't supplied them. Returns the same shape as FooterConfig with
 * `message` and `copyright` always populated.
 */
export function resolveFooter(
  cfg: Pick<SiteConfig, 'title' | 'footer'>,
  year: number = new Date().getFullYear(),
): Required<Pick<FooterConfig, 'message' | 'copyright'>> &
  Pick<FooterConfig, 'showEdoxenAttribution'> {
  return {
    message:
      cfg.footer.message ??
      `An Edoxen-powered registry of meetings and decisions.`,
    copyright:
      cfg.footer.copyright ?? `Copyright © ${year} ${cfg.title}.`,
    showEdoxenAttribution: cfg.footer.showEdoxenAttribution ?? true,
  }
}
