// Spec coverage for v0.2 polish — branded types, configureEdoxen(),
// date normalisation, search backends.

import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildLocale,
  isLocale,
  buildBodyCode,
  buildUrn,
  buildDecisionId,
} from '../src/index.js'
import {
  configureEdoxen,
  registerBodyTypes,
  bodyTypeFromCommittee,
  registerProfile,
  pickExtensionAttribute,
} from '../src/index.js'
import { normalizeDates } from '../src/load/normalizeDates.js'

describe('branded types', () => {
  it('buildLocale validates 2- or 3-letter codes', () => {
    expect(isLocale(buildLocale('en'))).toBe(true)
    expect(isLocale(buildLocale('fra'))).toBe(true)
    expect(() => buildLocale('fr-CA')).toThrow(/Invalid locale/)
    expect(() => buildLocale('english')).toThrow(/Invalid locale/)
  })

  it('buildBodyCode validates lowercase kebab/codes', () => {
    expect(buildBodyCode('ciml')).toBe('ciml')
    expect(buildBodyCode('national-body')).toBe('national-body')
    expect(() => buildBodyCode('CIML')).toThrow(/Invalid body code/)
  })

  it('buildUrn rejects non-URN strings', () => {
    expect(buildUrn('urn:iso:tc:154:meeting:1')).toBe('urn:iso:tc:154:meeting:1')
    expect(() => buildUrn('https://example.com')).toThrow()
  })

  it('buildDecisionId converts slashes to dashes', () => {
    expect(buildDecisionId('CIML/2009-1')).toBe('CIML-2009-1')
  })
})

describe('configureEdoxen', () => {
  const SCOPE = `test-${Math.random().toString(36).slice(2, 8)}`

  beforeEach(() => {
    registerBodyTypes(SCOPE, [
      { code: 'ciml' as never, name: 'CIML', urnPrefix: 'ciml' },
      { code: 'conf' as never, name: 'Conference', urnPrefix: 'conference' },
    ])
  })

  it('returns a handle bound to the scope', () => {
    const handle = configureEdoxen({ scope: SCOPE, defaultLocale: 'en' })
    expect(handle.config.scope).toBe(SCOPE)
    expect(handle.bodyTypeFromCommittee('CIML meeting')).toBe('ciml')
    expect(handle.bodyTypeFromUrn('urn:oiml:conference:meeting:13')).toBe('conf')
  })

  it('bodyTypeFromCommittee uses the global registry', () => {
    expect(bodyTypeFromCommittee('CIML meeting', SCOPE)).toBe('ciml')
    expect(bodyTypeFromCommittee(null, SCOPE)).toBeNull()
  })

  it('pickExtensionAttribute via handle uses scope as profile', () => {
    registerProfile(SCOPE, { tagline: 'string' })
    const exts = [
      {
        profile: SCOPE,
        attributes: [{ key: 'tagline', value: 'Standards developed' }],
      },
    ] as never
    const handle = configureEdoxen({ scope: SCOPE })
    expect(handle.pickExtensionAttribute(exts, 'tagline')?.value).toBe('Standards developed')
    expect(pickExtensionAttribute(exts, SCOPE, 'tagline')?.value).toBe('Standards developed')
  })
})

describe('normalizeDates', () => {
  it('coerces Date to ISO date string', () => {
    const out = normalizeDates({ date: new Date('2024-10-18T00:00:00Z') })
    expect(out).toEqual({ date: '2024-10-18' })
  })

  it('walks nested structures', () => {
    const out = normalizeDates({
      a: [{ b: new Date('2024-01-01T00:00:00Z') }],
      c: 'string',
    })
    expect(out).toEqual({ a: [{ b: '2024-01-01' }], c: 'string' })
  })

  it('passes through primitives', () => {
    expect(normalizeDates(42)).toBe(42)
    expect(normalizeDates('hello')).toBe('hello')
    expect(normalizeDates(null)).toBe(null)
  })
})
