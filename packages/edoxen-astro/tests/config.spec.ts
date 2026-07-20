// Tests for the SiteConfig contract: defaults, merging, footer auto-generation.

import { describe, it, expect } from 'vitest'
import {
  defaultSiteConfig,
  mergeSiteConfig,
  resolveFooter,
} from '../src/config/index.js'

describe('defaultSiteConfig', () => {
  it('ships Meetings + Decisions + About as the default nav', () => {
    const texts = defaultSiteConfig.nav.map((n) => n.text)
    expect(texts).toEqual(['Meetings', 'Decisions', 'About'])
  })

  it('points the default logo at /edoxen-logo.svg', () => {
    expect(defaultSiteConfig.logo.light).toBe('/edoxen-logo.svg')
    expect(defaultSiteConfig.logo.dark).toBe('/edoxen-logo-dark.svg')
  })

  it('defaults footer.showEdoxenAttribution to true', () => {
    expect(defaultSiteConfig.footer.showEdoxenAttribution).toBe(true)
  })
})

describe('mergeSiteConfig', () => {
  it('returns the defaults when overrides is undefined', () => {
    expect(mergeSiteConfig(undefined)).toEqual(defaultSiteConfig)
  })

  it('overrides top-level fields without losing nested defaults', () => {
    const merged = mergeSiteConfig({ title: 'TC 154 Meetings' })
    expect(merged.title).toBe('TC 154 Meetings')
    expect(merged.nav).toEqual(defaultSiteConfig.nav)
    expect(merged.logo.light).toBe(defaultSiteConfig.logo.light)
  })

  it('merges nested footer one level deep', () => {
    const merged = mergeSiteConfig({
      footer: { message: 'Custom tagline' },
    })
    expect(merged.footer.message).toBe('Custom tagline')
    expect(merged.footer.showEdoxenAttribution).toBe(true)
  })

  it('merges nested logo one level deep', () => {
    const merged = mergeSiteConfig({
      logo: { light: '/tc154.svg' },
    })
    expect(merged.logo.light).toBe('/tc154.svg')
    // Dark falls back to default since the override didn't set it.
    expect(merged.logo.dark).toBe(defaultSiteConfig.logo.dark)
  })

  it('replaces nav wholesale when provided', () => {
    const customNav = [{ text: 'Members', link: '/members' }]
    const merged = mergeSiteConfig({ nav: customNav })
    expect(merged.nav).toEqual(customNav)
  })
})

describe('resolveFooter', () => {
  it('auto-generates a tagline when message is unset', () => {
    const f = resolveFooter({ title: 'TC 154', footer: {} })
    expect(f.message).toMatch(/Edoxen-powered registry/)
    expect(f.copyright).toMatch(/TC 154/)
  })

  it('uses the year argument in the auto-generated copyright', () => {
    const f = resolveFooter({ title: 'X', footer: {} }, 2025)
    expect(f.copyright).toContain('2025')
  })

  it('respects an explicit message and copyright override', () => {
    const f = resolveFooter({
      title: 'X',
      footer: {
        message: 'Hello',
        copyright: '© 1999 X',
      },
    })
    expect(f.message).toBe('Hello')
    expect(f.copyright).toBe('© 1999 X')
  })

  it('respects showEdoxenAttribution from the config', () => {
    const visible = resolveFooter({ title: 'X', footer: { showEdoxenAttribution: false } })
    expect(visible.showEdoxenAttribution).toBe(false)

    const visible2 = resolveFooter({ title: 'X', footer: {} })
    expect(visible2.showEdoxenAttribution).toBe(true)
  })
})
