// FlexSearch backend — the default SearchIndex implementation.
// Created via `createFlexSearchBackend()` (async) since FlexSearch
// loads via dynamic ESM import. Avoids the globalThis hack.
//
// The FlexSearch peer dep is only loaded when this backend is
// actually selected; consumers using `backend: 'none'` (or a
// different backend) never pull it into their bundle.

import type { SearchDoc, SearchIndex, IndexOptions } from './index.js'

interface FlexSearchDocument {
  add: (doc: Record<string, unknown>) => void
  search: (query: string) => Array<Array<{ doc?: Record<string, unknown> } | number>>
}

interface FlexSearchModule {
  Document: new (opts: unknown) => FlexSearchDocument
}

let cachedModule: Promise<FlexSearchModule> | null = null

async function loadFlexSearch(): Promise<FlexSearchModule> {
  if (!cachedModule) {
    cachedModule = import('flexsearch').then((m) => {
      // flexsearch's ESM shape: { Document, ... } or { default: { Document, ... } }
      const mod = m as unknown as FlexSearchModule & { default?: FlexSearchModule }
      return (mod.Document ? mod : mod.default ?? mod) as FlexSearchModule
    })
  }
  return cachedModule
}

export async function createFlexSearchBackend<T extends SearchDoc>(
  docs: T[],
  opts: IndexOptions<T>,
): Promise<SearchIndex<T>> {
  const mod = await loadFlexSearch()
  const idx = new mod.Document({
    document: { id: opts.idField, index: opts.fields },
    tokenize: 'forward',
  })
  for (const doc of docs) idx.add(doc as Record<string, unknown>)

  return {
    search(query: string): T[] {
      if (!query) return docs
      const hits = idx.search(query)
      const ids = new Set<unknown>()
      for (const group of hits) {
        for (const h of group) {
          if (typeof h === 'number') ids.add(h)
          else if (h.doc) ids.add(h.doc[opts.idField])
        }
      }
      return docs.filter((d) => ids.has(d[opts.idField]))
    },
  }
}
