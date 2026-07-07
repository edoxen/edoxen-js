// Search — pluggable full-text over Decision / Meeting records.
//
// Backend default: flexsearch (peer dep). Other backends can be
// registered via `registerBackend()`. Consumers that bring their own
// search pass `backend: 'none'` and ignore this module entirely.

export interface SearchIndex<T> {
  search(query: string): T[]
}

export type SearchBackend = 'flexsearch' | 'none'

export interface IndexOptions {
  backend?: SearchBackend
  fields: string[]
  idField: string
}

export async function buildSearchIndex<T extends Record<string, unknown>>(
  docs: T[],
  opts: IndexOptions,
): Promise<SearchIndex<T>> {
  const backend = opts.backend ?? 'flexsearch'
  if (backend === 'none') {
    return new LinearScanIndex(docs, opts)
  }
  const { FlexSearchBackend } = await import('./flexsearch.js')
  return new FlexSearchBackend(docs, opts)
}

class LinearScanIndex<T extends Record<string, unknown>> implements SearchIndex<T> {
  constructor(private readonly docs: T[], private readonly opts: IndexOptions) {}
  search(query: string): T[] {
    if (!query) return this.docs
    const q = query.toLowerCase()
    return this.docs.filter((d) =>
      this.opts.fields.some((f) => String(d[f] ?? '').toLowerCase().includes(q)),
    )
  }
}
