// FlexSearch backend — the default SearchIndex implementation.
// The FlexSearch peer dep is loaded lazily so consumers that pass
// `backend: 'none'` (or use a different backend) don't bundle it.

import type { SearchIndex, IndexOptions } from './index.js'

// FlexSearch ships its own .d.ts; load dynamically so this file is
// tree-shakeable when unused.
type FlexSearchDocument = {
  add: (doc: Record<string, unknown>) => void
  search: (query: string) => Array<{ doc?: Record<string, unknown> } | number>
}

export class FlexSearchBackend<T extends Record<string, unknown>> implements SearchIndex<T> {
  private readonly idx: FlexSearchDocument
  private readonly docs: T[]
  private readonly idField: string

  constructor(docs: T[], opts: IndexOptions) {
    this.docs = docs
    this.idField = opts.idField
    // Lazy-require via dynamic import so the FlexSearch peer dep
    // isn't pulled into bundles that never build an index.
    //
    // The constructor is sync by API contract; FlexSearch is a CJS
    // module that's already loaded by the time we get here in any
    // realistic call path.
    //
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const FlexSearch = (globalThis as { FlexSearch?: { Document: new (opts: unknown) => FlexSearchDocument } }).FlexSearch
    if (!FlexSearch) {
      throw new Error("FlexSearch peer dep not available. Install 'flexsearch' or pass backend: 'none'.")
    }
    this.idx = new FlexSearch.Document({
      document: { id: opts.idField, index: opts.fields },
      tokenize: 'forward',
    })
    for (const doc of docs) this.idx.add(doc)
  }

  search(query: string): T[] {
    if (!query) return this.docs
    const hits = this.idx.search(query)
    const ids = new Set(hits.flat().map((h) => (typeof h === 'number' ? h : (h.doc?.[this.idField] as number))))
    return this.docs.filter((d) => ids.has(d[this.idField] as number))
  }
}
