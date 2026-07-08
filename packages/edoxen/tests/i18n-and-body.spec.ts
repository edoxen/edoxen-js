// Specs for the new i18n, multi-body, and useFilteredCollection donations.

import { describe, it, expect } from 'vitest'
import { defineI18n, interpolate, detectLocale, bodyTypeFromSourceFile, buildDoi, buildBodyCode, registerBodyTypes } from '@edoxen/edoxen'

describe('defineI18n + interpolate', () => {
  const i18n = defineI18n({
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    translations: {
      greeting: { en: 'Hello, {name}!', fr: 'Bonjour, {name} !' },
      only_en: { en: 'English only' },
    },
  })

  it('returns the locale-specific translation', () => {
    expect(i18n.t('en', 'greeting', { name: 'World' })).toBe('Hello, World!')
    expect(i18n.t('fr', 'greeting', { name: 'Monde' })).toBe('Bonjour, Monde !')
  })

  it('falls back to default locale', () => {
    expect(i18n.t('fr', 'only_en')).toBe('English only')
  })

  it('returns the key when missing entirely', () => {
    expect(i18n.t('en', 'nonexistent')).toBe('nonexistent')
  })

  it('reports presence via has()', () => {
    expect(i18n.has('en', 'greeting')).toBe(true)
    expect(i18n.has('en', 'nope')).toBe(false)
  })

  it('interpolate replaces {token}', () => {
    expect(interpolate('Hi {a} {b}!', { a: 'X', b: 'Y' })).toBe('Hi X Y!')
    expect(interpolate('Hi {a}!', { other: 1 })).toBe('Hi {a}!')
  })
})

describe('detectLocale', () => {
  it('returns fallback in non-browser env', () => {
    expect(detectLocale(['en', 'fr'], 'en')).toBe('en')
  })
})

describe('body: bodyTypeFromSourceFile + buildDoi', () => {
  const SCOPE = `test-${Math.random().toString(36).slice(2, 8)}`
  registerBodyTypes(SCOPE, [
    { code: buildBodyCode('ciml'), name: 'CIML', urnPrefix: 'ciml' },
    { code: buildBodyCode('conference'), name: 'Conference', urnPrefix: 'conference' },
  ])

  it('derives body code from source filename', () => {
    expect(bodyTypeFromSourceFile('ciml-39-resolutions', SCOPE)).toBe('ciml')
    expect(bodyTypeFromSourceFile('conference-17-resolutions', SCOPE)).toBe('conference')
    expect(bodyTypeFromSourceFile('random', SCOPE)).toBeNull()
  })

  it('buildDoi formats a DOI under a prefix', () => {
    expect(buildDoi('10.63493', 'meetings', 'ciml15')).toBe('10.63493/meetings/ciml15')
  })
})
