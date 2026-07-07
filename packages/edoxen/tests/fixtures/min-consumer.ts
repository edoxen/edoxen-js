// Minimal data-only consumer. Imports only `loadDecisions` — no
// search backend, no validation. Used by tree-shaking.spec.ts to
// verify no heavy deps leak.
import { loadDecisions, normalizeSnippet, buildUrn, displayName } from '../../src/index.js'

export const canary = {
  load: loadDecisions,
  snippet: normalizeSnippet,
  urn: buildUrn,
  name: displayName,
}
