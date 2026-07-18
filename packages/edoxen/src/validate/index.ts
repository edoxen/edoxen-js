// Validate — JSON Schema validation against the gem's canonical
// schemas. The schemas are bundled at `src/schema/*.json` (synced
// via `pnpm sync:schema`).
//
// ajv is a peer dep: consumers that don't validate at runtime don't
// pull it in.

import type Ajv from 'ajv'

let ajvInstance: Ajv | null = null

async function getAjv(): Promise<Ajv> {
  if (ajvInstance) return ajvInstance
  const { default: AjvCtor } = await import('ajv')
  ajvInstance = new AjvCtor({ allErrors: true, strict: false })
  return ajvInstance
}

export interface ValidateResult {
  valid: boolean
  errors: Array<{ path: string; message: string }>
}

export async function validateAgainstSchema(
  data: unknown,
  schema: unknown,
): Promise<ValidateResult> {
  const ajv = await getAjv()
  const validate = ajv.compile(schema as Record<string, unknown>)
  const valid = validate(data) as boolean
  if (valid) return { valid: true, errors: [] }
  const errs = (validate.errors ?? []) as unknown as Array<Record<string, unknown>>
  const errors = errs.map((e) => ({
    path: String(e.instancePath ?? ''),
    message: String(e.message ?? 'validation failed'),
  }))
  return { valid: false, errors }
}

export async function validateDecisions(data: unknown): Promise<ValidateResult> {
  const schema = (await import('../schema/edoxen.json', { with: { type: 'json' } })).default
  return validateAgainstSchema(data, schema)
}

export async function validateMeetings(data: unknown): Promise<ValidateResult> {
  const schema = (await import('../schema/meeting.json', { with: { type: 'json' } })).default
  return validateAgainstSchema(data, schema)
}

// Register documents (ContactRegister / VenueRegister / BodyRegister)
// live in edoxen.json's $defs; each validator pins the root to one
// $def via a thin wrapper schema ({ $defs, $ref }) so a register doc
// is checked against its own shape, not the root oneOf.

type RegisterDef = 'ContactRegister' | 'VenueRegister' | 'BodyRegister'

const registerSchemaCache = new Map<RegisterDef, Record<string, unknown>>()

async function registerSchema(def: RegisterDef): Promise<Record<string, unknown>> {
  const cached = registerSchemaCache.get(def)
  if (cached) return cached
  const schema = (await import('../schema/edoxen.json', { with: { type: 'json' } })).default
  const wrapper = {
    $defs: (schema as { $defs: Record<string, unknown> }).$defs,
    $ref: `#/$defs/${def}`,
  }
  registerSchemaCache.set(def, wrapper)
  return wrapper
}

async function validateRegister(data: unknown, def: RegisterDef): Promise<ValidateResult> {
  return validateAgainstSchema(data, await registerSchema(def))
}

export async function validateContacts(data: unknown): Promise<ValidateResult> {
  return validateRegister(data, 'ContactRegister')
}

export async function validateVenues(data: unknown): Promise<ValidateResult> {
  return validateRegister(data, 'VenueRegister')
}

export async function validateBodies(data: unknown): Promise<ValidateResult> {
  return validateRegister(data, 'BodyRegister')
}

export interface RegisterDocuments {
  contacts?: unknown
  venues?: unknown
  bodies?: unknown
}

// Validates whichever register documents are present (the natural
// pair of loadRegisters' output). Error paths are prefixed with the
// register key, e.g. `venues/venues/1/kind`.
export async function validateRegisters(documents: RegisterDocuments): Promise<ValidateResult> {
  const checks: Array<readonly [keyof RegisterDocuments, RegisterDef]> = [
    ['contacts', 'ContactRegister'],
    ['venues', 'VenueRegister'],
    ['bodies', 'BodyRegister'],
  ]
  const errors: ValidateResult['errors'] = []
  for (const [key, def] of checks) {
    if (documents[key] === undefined) continue
    const result = await validateRegister(documents[key], def)
    for (const error of result.errors) {
      errors.push({ path: `${key}${error.path}`, message: error.message })
    }
  }
  return { valid: errors.length === 0, errors }
}
