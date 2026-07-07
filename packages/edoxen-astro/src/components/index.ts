// Components barrel — re-exports every Astro server component.
// Astro components are .astro files, so consumers import directly:
//   import ResolutionList from '@edoxen/astro/components/ResolutionList.astro'
//
// This barrel exists to give consumers a single import path for
// discoverability; the .astro files themselves are the components.

export { default as ResolutionList } from './ResolutionList.astro'
export { default as ActionTypeBadge } from './ActionTypeBadge.astro'
export { default as MeetingDetail } from './MeetingDetail.astro'
