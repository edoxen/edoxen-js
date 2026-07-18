// Register documents (ContactRegister / VenueRegister / BodyRegister):
// loaders and validators. Fixtures live in fixtures/registers/ and
// follow the canonical 1.0 register shapes (see the gem's
// schema/edoxen.yaml $defs).

import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  loadContacts,
  loadVenues,
  loadBodies,
  loadRegisters,
} from '../src/load/index.js'
import {
  validateContacts,
  validateVenues,
  validateBodies,
  validateRegisters,
} from '../src/validate/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FIXTURES = path.join(__dirname, 'fixtures/registers')
const CONTACTS = path.join(FIXTURES, 'contacts.yaml')
const VENUES = path.join(FIXTURES, 'venues.yaml')
const BODIES = path.join(FIXTURES, 'bodies.yaml')
const INVALID_CONTACTS = path.join(FIXTURES, 'invalid-contacts.yaml')

describe('register loaders', () => {
  it('loadContacts loads a ContactRegister from a single file', async () => {
    const register = await loadContacts(CONTACTS)
    expect(register.scope).toBe('isotc184sc4')
    expect(register.contacts?.length).toBe(2)
    expect(register.contacts?.[0]?.urn).toBe('urn:edoxen:contact:isotc184sc4:jane-doe')
    expect(register.contacts?.[0]?.kind).toBe('person')
  })

  it('loadVenues loads a VenueRegister from a single file', async () => {
    const register = await loadVenues(VENUES)
    expect(register.scope).toBe('isotc184sc4')
    expect(register.venues?.length).toBe(2)
    expect(register.venues?.map((v) => v.kind)).toEqual(['physical', 'virtual'])
  })

  it('loadBodies loads a BodyRegister from a single file', async () => {
    const register = await loadBodies(BODIES)
    expect(register.scope).toBe('isotc184sc4')
    expect(register.bodies?.length).toBe(2)
    expect(register.bodies?.[0]?.parent_ref?.urn).toBe('urn:iso:tc184')
    expect(register.bodies?.[1]?.parent_ref).toBeUndefined()
  })

  it('loadContacts merges member arrays on a directory load', async () => {
    const register = await loadContacts(path.join(FIXTURES, 'contacts-dir'))
    expect(register.scope).toBe('isotc184sc4')
    expect(register.title?.[0]?.value).toBe('Contacts')
    expect(register.contacts?.map((c) => c.urn)).toEqual([
      'urn:edoxen:contact:isotc184sc4:jane-doe',
      'urn:edoxen:contact:isotc184sc4:john-smith',
    ])
  })

  it('loadRegisters loads whichever paths are provided', async () => {
    const all = await loadRegisters({ contacts: CONTACTS, venues: VENUES, bodies: BODIES })
    expect(all.contacts?.contacts?.length).toBe(2)
    expect(all.venues?.venues?.length).toBe(2)
    expect(all.bodies?.bodies?.length).toBe(2)

    const partial = await loadRegisters({ venues: VENUES })
    expect(partial.contacts).toBeUndefined()
    expect(partial.venues?.venues?.length).toBe(2)
    expect(partial.bodies).toBeUndefined()
  })
})

describe('register validators', () => {
  it('validateContacts accepts the ContactRegister fixture', async () => {
    const result = await validateContacts(await loadContacts(CONTACTS))
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('validateVenues accepts the VenueRegister fixture', async () => {
    const result = await validateVenues(await loadVenues(VENUES))
    expect(result.valid).toBe(true)
  })

  it('validateBodies accepts the BodyRegister fixture', async () => {
    const result = await validateBodies(await loadBodies(BODIES))
    expect(result.valid).toBe(true)
  })

  it('validateContacts rejects an unknown property (additionalProperties: false)', async () => {
    const result = await validateContacts(await loadContacts(INVALID_CONTACTS))
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]?.message).toMatch(/additional properties/i)
  })

  it('validateRegisters validates whichever documents are present', async () => {
    const good = await validateRegisters({
      contacts: await loadContacts(CONTACTS),
      venues: await loadVenues(VENUES),
      bodies: await loadBodies(BODIES),
    })
    expect(good.errors).toEqual([])
    expect(good.valid).toBe(true)

    const empty = await validateRegisters({})
    expect(empty.valid).toBe(true)
  })

  it('validateRegisters prefixes error paths with the register key', async () => {
    const result = await validateRegisters({
      contacts: await loadContacts(INVALID_CONTACTS),
      venues: await loadVenues(VENUES),
    })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    for (const error of result.errors) {
      expect(error.path.startsWith('contacts')).toBe(true)
    }
  })
})
