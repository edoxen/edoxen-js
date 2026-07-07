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
