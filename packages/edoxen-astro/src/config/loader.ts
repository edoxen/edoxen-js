// Site-config loader.
//
// Consumers may put an `edoxen.config.ts` at their project root. This
// loader resolves it (via dynamic import), merges with the defaults,
// and returns a complete SiteConfig. When the file is absent, the
// defaults ship directly — the consumer can have a working site with
// zero configuration.

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve as resolvePath } from 'node:path'
import type { SiteConfig } from './types.js'
import { defaultSiteConfig, mergeSiteConfig } from './types.js'

const CONFIG_FILENAMES = [
  'edoxen.config.ts',
  'edoxen.config.mjs',
  'edoxen.config.js',
]

let cachedConfig: SiteConfig | null = null

/**
 * Discover the consumer's `edoxen.config.{ts,mjs,js}` at the project
 * root (CWD). Returns the absolute path or null when not found.
 *
 * The search is anchored to `process.cwd()` (the consumer project
 * root, not the package install dir) so monorepo subpackages can
 * each carry their own config.
 */
export function resolveConfigPath(
  cwd: string = process.cwd(),
): string | null {
  for (const filename of CONFIG_FILENAMES) {
    const candidate = resolvePath(cwd, filename)
    if (existsSync(candidate)) return candidate
  }
  return null
}

/**
 * Load the consumer's site config and merge it with the defaults.
 * Result is cached for the lifetime of the process.
 *
 * Dynamic import is used so the consumer can write config in TS
 * without pre-compiling (Astro's Vite resolves the TypeScript for us
 * at build time; in SSR/dev the import goes through Vite too).
 */
export async function loadSiteConfig(
  cwd: string = process.cwd(),
): Promise<SiteConfig> {
  if (cachedConfig) return cachedConfig

  const path = resolveConfigPath(cwd)
  if (!path) {
    cachedConfig = defaultSiteConfig
    return cachedConfig
  }

  const mod = await import(path)
  const overrides = (mod?.default ?? mod?.config ?? {}) as
    Partial<SiteConfig> | undefined

  cachedConfig = mergeSiteConfig(overrides)
  return cachedConfig
}

/**
 * Synchronous variant for Astro frontmatter where top-level await
 * isn't available. Reads the config from disk using Node's
 * `require()` against the project root.
 *
 * Prefer `loadSiteConfig()` in modern Astro components (which all
 * support top-level await in frontmatter). This synchronous variant
 * is provided for integration code that runs before the Vite
 * SSR pipeline is live.
 */
export function loadSiteConfigSync(
  cwd: string = process.cwd(),
): SiteConfig {
  if (cachedConfig) return cachedConfig

  const path = resolveConfigPath(cwd)
  if (!path) {
    cachedConfig = defaultSiteConfig
    return cachedConfig
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const createRequire = (require('node:module') as { createRequire: (filename: string) => NodeRequire }).createRequire
  const req = createRequire(resolvePath(cwd, 'package.json'))
  const mod = req(path)
  const overrides = (mod?.default ?? mod?.config ?? {}) as
    Partial<SiteConfig> | undefined

  cachedConfig = mergeSiteConfig(overrides)
  return cachedConfig
}

/** Reset the cache. Exposed for tests that flip between configs. */
export function resetSiteConfigCache(): void {
  cachedConfig = null
}

// Re-export the type + defaults so consumers can `import { SiteConfig,
// defaultSiteConfig } from '@edoxen/astro/config'`.
export type { SiteConfig, NavItem, LogoConfig, FooterConfig } from './types.js'
export { defaultSiteConfig, mergeSiteConfig, resolveFooter } from './types.js'
