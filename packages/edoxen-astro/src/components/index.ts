// Components barrel — re-exports every Astro server component.
// Astro components are .astro files, so consumers import directly:
//   import ResolutionList from '@edoxen/astro/components/ResolutionList.astro'
//
// This barrel exists to give consumers a single import path for
// discoverability; the .astro files themselves are the components.

export { default as ResolutionList } from './ResolutionList.astro'
export { default as ActionTypeBadge } from './ActionTypeBadge.astro'
export { default as MeetingDetail } from './MeetingDetail.astro'

// Site chrome (Header, Footer, About, Layout) — the package ships
// sensible defaults; consumers override via `edoxen.config.ts` or by
// shadowing the .astro files in their own src/components/chrome/.
export { default as Header } from './chrome/Header.astro'
export { default as Footer } from './chrome/Footer.astro'
export { default as About } from './chrome/About.astro'
export { default as SiteLayout } from './chrome/SiteLayout.astro'
