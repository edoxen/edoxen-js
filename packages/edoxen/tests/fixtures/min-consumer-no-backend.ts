// Consumer that uses `backend: 'none'` for search. flexsearch
// must NOT be loaded.
import { buildSearchIndex } from '../../src/index.js'

export const canary = {
  build: () => buildSearchIndex([], { backend: 'none', fields: ['id'], idField: 'id' }),
}
