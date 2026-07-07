// Search — pluggable full-text over Decision / Meeting records.
//
// Backend default: flexsearch (peer dep). Other backends can be
// registered via `registerBackend()`. Consumers that bring their own
// search pass `backend: 'none'` and ignore this module entirely.

export interface SearchDoc {
  readonly [key: string]: unknown
}

export interface SearchIndex<T extends SearchDoc> {
  search(query: string): T[]
}

export type SearchBackend = 'flexsearch' | 'none'

export interface IndexOptions<T extends SearchDoc> {
  backend?: SearchBackend
  fields: Array<keyof T & string>
  idField: keyof T & string
}

export async function buildSearchIndex<T extends SearchDoc>(
  docs: T[],
  opts: IndexOptions<T>,
): Promise<SearchIndex<T>> {
  const backend = opts.backend ?? 'flexsearch'
  if (backend === 'none') {
    return new LinearScanIndex(docs, opts)
  }
  const { createFlexSearchBackend } = await import('./flexsearch.js')
  return createFlexSearchBackend(docs, opts)
}

class LinearScanIndex<T extends SearchDoc> implements SearchIndex<T> {
  constructor(
    private readonly docs: T[],
    private readonly opts: IndexOptions<T>,
  ) {}
  search(query: string): T[] {
    if (!query) return this.docs
    const q = query.toLowerCase()
    return this.docs.filter((d) =>
      this.opts.fields.some((f) => String(d[f] ?? '').toLowerCase().includes(q)),
    )
  }
}
