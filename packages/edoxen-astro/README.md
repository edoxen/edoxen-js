# @edoxen/astro

Astro integration for the Edoxen data layer. Renders meetings and
decisions as static HTML at build time.

## What's in the box

- **Data presentation components**: `ResolutionList`, `MeetingDetail`, `ActionTypeBadge`.
- **Site chrome**: `Header`, `Footer`, `About`, `SiteLayout`. Zero-config sensible defaults; override any piece via `edoxen.config.ts`.
- **Config loader**: discovers `edoxen.config.{ts,mjs,js}` at the project root, merges with defaults.

## Quick start (zero config)

```astro
---
import SiteLayout from '@edoxen/astro/components/chrome/SiteLayout.astro'
---
<SiteLayout>
  <h1>Hello</h1>
</SiteLayout>
```

The package ships a default logo, Meetings + Decisions + About nav, and an auto-generated footer. A consumer can have a working site with **zero configuration**.

## Override via `edoxen.config.ts`

Drop an `edoxen.config.ts` at the project root to override any piece:

```typescript
import type { SiteConfig } from '@edoxen/astro'

export default {
  title: 'ISO/TC 154 Meetings',
  logo: {
    light: '/tc154-logo.svg',
    dark: '/tc154-logo-dark.svg',
  },
  nav: [
    { text: 'Meetings', link: '/meetings' },
    { text: 'Decisions', link: '/decisions' },
    { text: 'About', link: '/about' },
  ],
  footer: {
    message: 'Maintained by ISO/TC 154 Secretariat',
    copyright: '© 2026 ISO/TC 154',
    showEdoxenAttribution: true,
  },
  githubUrl: 'https://github.com/isotc154/www.isotc154.org',
} satisfies SiteConfig
```

## Override the About page

Two ways:

1. Drop an `about.md` in `src/pages/` — Astro routes it to `/about` and ignores the package default.
2. Set `aboutContent` in the config to a markdown string — the default `About.astro` renders that content instead of the bundled default.

## Shadow individual chrome components

Create any of these files in your project to override the package
default — Astro's resolution prefers the local file:

- `src/components/chrome/Header.astro`
- `src/components/chrome/Footer.astro`
- `src/components/chrome/About.astro`
- `src/components/chrome/SiteLayout.astro`

## Auto-generated footer

When `footer.message` and `footer.copyright` are unset, the package auto-generates:

- Message: `"An Edoxen-powered registry of meetings and decisions."`
- Copyright: `"Copyright © {current year} {site title}."`

## License

BSD-2-Clause.
