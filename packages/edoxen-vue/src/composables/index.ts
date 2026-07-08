// Composables barrel.
export {
  createCollection,
  createListCollection,
  injectSsrData,
  resetSsrRegistry,
  type Collection,
  type ListCollection,
} from './createCollection.js'
export { useDecisions, type UseDecisionsResult } from './useDecisions.js'
export { useMeetings, type UseMeetingsResult } from './useMeetings.js'
export { useCommittee, type UseCommitteeResult } from './useCommittee.js'
export { useClipboard } from './useClipboard.js'
export { useCountUp } from './useCountUp.js'
export { useNeighborNav, type NeighborNav } from './useNeighborNav.js'
export { useEdoxenProject, type UseEdoxenProjectResult } from './useEdoxenProject.js'
export { useI18n, type UseI18nOptions, type UseI18nResult } from './useI18n.js'
export {
  useLocalizedRoute,
  type UseLocalizedRouteOptions,
  type UseLocalizedRouteResult,
} from './useLocalizedRoute.js'
export {
  useFilteredCollection,
  type SingleSelectFacetConfig,
  type MultiSelectFacetConfig,
  type FacetConfig,
  type TextSearchConfig,
  type FilteredCollectionConfig,
  type FilteredCollectionResult,
} from './useFilteredCollection.js'
