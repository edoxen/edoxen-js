import { describe, it, expect } from 'vitest'
import {
  normalizeSnippet,
  isAcclamation,
  identifierToDisplay,
  sortDecisions,
} from '../src/transforms/index.js'
import { displayName, primaryContactMethod } from '../src/contacts/index.js'
import { isUrn, buildUrn, parseUrn, slugFromUrn } from '../src/urn/index.js'
import { pickLocalized, pickLocalizedValue, iso6393To6391, formatDate } from '../src/i18n/index.js'
import { yamlDir } from '../src/load/yamlDir.js'

describe('transforms', () => {
  it('normalises snippets and strips PUA bullets', () => {
    expect(normalizeSnippet('hello   world\n\nfriend')).toBe('hello world friend')
    expect(normalizeSnippet('x'.repeat(250)).length).toBe(200)
    expect(normalizeSnippet(null)).toBe('')
  })

  it('detects acclamation identifiers', () => {
    expect(isAcclamation('CIML-2009-acclaim-1')).toBe(true)
    expect(isAcclamation('CIML-2009/1')).toBe(false)
  })

  it('renders StructuredIdentifier as Prefix/Number', () => {
    expect(identifierToDisplay([{ prefix: 'CIML', number: '2009/1' }])).toBe('CIML/2009/1')
    expect(identifierToDisplay([{ prefix: '', number: 'X' }])).toBe('X')
  })

  it('sorts by year desc, identifier asc', () => {
    const list = [
      { identifier: 'B', year: '2020' },
      { identifier: 'A', year: '2024' },
      { identifier: 'C', year: '2024' },
    ]
    expect([...list].sort(sortDecisions)).toEqual([
      { identifier: 'A', year: '2024' },
      { identifier: 'C', year: '2024' },
      { identifier: 'B', year: '2020' },
    ])
  })
})

describe('contacts', () => {
  it('renders Name.formatted when present', () => {
    expect(displayName({ formatted: 'Jane Doe' } as never)).toBe('Jane Doe')
  })

  it('builds display from components when formatted is absent', () => {
    expect(displayName({ given: 'Jane', family: 'Doe' } as never)).toBe('Jane Doe')
  })

  it('returns empty for null', () => {
    expect(displayName(null)).toBe('')
  })

  it('picks the primary contact method for a kind', () => {
    const methods = [
      { kind: 'email', value: 'a@x.org' },
      { kind: 'email', value: 'b@x.org', primary: true },
    ] as never
    expect(primaryContactMethod(methods, 'email')).toBe('b@x.org')
    expect(primaryContactMethod(methods, 'phone')).toBe('')
  })
})

describe('urn', () => {
  it('validates URN shape', () => {
    expect(isUrn('urn:oiml:ciml:meeting:ciml-15')).toBe(true)
    expect(isUrn('not a urn')).toBe(false)
  })

  it('builds a branded Urn', () => {
    const u = buildUrn('urn:iso:tc:184:sc:4:decision:1')
    expect(typeof u).toBe('string')
    expect(() => buildUrn('bad')).toThrow(/Invalid URN/)
  })

  it('parses nid and nss', () => {
    expect(parseUrn('urn:oiml:ciml:meeting:ciml-15')).toEqual({
      nid: 'oiml',
      nss: 'ciml:meeting:ciml-15',
    })
    expect(parseUrn('nope')).toBeNull()
  })

  it('extracts slug from URN', () => {
    expect(slugFromUrn('urn:oiml:ciml:meeting:ciml-15')).toBe('ciml-15')
    expect(slugFromUrn('nope')).toBe('')
  })
})

describe('i18n', () => {
  it('picks the preferred per-field Localized entry with fallback', () => {
    const list = [{ spelling: 'fra', value: 'Bonjour' }, { spelling: 'eng', value: 'Hello' }]
    expect(pickLocalizedValue(list, 'eng')).toBe('Hello')
    expect(pickLocalizedValue(list, 'deu')).toBe('Bonjour')
    expect(pickLocalized(list, 'deu', false)).toBeNull()
  })

  it('maps ISO 639-3 to 639-1', () => {
    expect(iso6393To6391('eng')).toBe('en')
    expect(iso6393To6391('fra')).toBe('fr')
    expect(iso6393To6391('xxx')).toBe('xxx')
  })

  it('formats dates per locale', () => {
    const out = formatDate('2024-10-18', 'en')
    expect(out).toMatch(/2024/)
    expect(formatDate(null, 'en')).toBe('')
  })
})

describe('yamlDir', () => {
  it('returns an empty list for a missing dir', () => {
    expect(yamlDir('/nope/does/not/exist')).toEqual([])
  })

  it('lists yaml files sorted', () => {
    const tmp = `${import.meta.dirname}/.test-yamldir`
    const fs = require('node:fs')
    fs.mkdirSync(tmp, { recursive: true })
    fs.writeFileSync(`${tmp}/b.yaml`, '')
    fs.writeFileSync(`${tmp}/a.yml`, '')
    expect(yamlDir(tmp)).toEqual(['a.yml', 'b.yaml'])
    fs.rmSync(tmp, { recursive: true })
  })
})
