// Config barrel — single import for SiteConfig contract + loaders.

export type {
  SiteConfig,
  NavItem,
  LogoConfig,
  FooterConfig,
} from './types.js'

export {
  defaultSiteConfig,
  mergeSiteConfig,
  resolveFooter,
} from './types.js'

export {
  loadSiteConfig,
  loadSiteConfigSync,
  resolveConfigPath,
  resetSiteConfigCache,
} from './loader.js'
