// Date normalisation — coerce Date/Time instances to ISO strings so
// the loaded data is JSON-serialisable and matches the wire form
// (which the schema declares as `type: string, format: date`).
//
// Mirrors the gem's SchemaValidator#normalize_dates. Walks the parsed
// YAML tree once; O(n) over the document.

export function normalizeDates<T>(value: T): T {
  return walk(value) as T
}

function walk(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  if (Array.isArray(value)) {
    return value.map(walk)
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = walk(v)
    }
    return out
  }
  return value
}
