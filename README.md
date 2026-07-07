# edoxen-js

Monorepo for the Edoxen JavaScript packages:

- **`edoxen`** — framework-agnostic TypeScript data layer. JSON-Schema-driven types, YAML loaders, transforms, search, URN, i18n, body, and validate helpers.
- **`@edoxen/astro`** — Astro integration (primary UI package). Native `.astro` server components + SSR data loader.
- **`@edoxen/vue`** — Vue 3 adapter for existing Vue/Vite consumers (tc154, tc184sc4, OIML).

## Status

Pre-v0.1. The data package (`edoxen`) is functional with smoke tests; the Astro and Vue packages are skeletons. See `TODO.js/` (git-ignored) for the per-PR breakdown.

## Quick start

```bash
pnpm install
pnpm -r --filter='./packages/*' build
pnpm -F edoxen test
```

## Architecture

The data layer is the source of truth for types: `pnpm gen:types` runs `json-schema-to-typescript` against the gem's canonical schemas (synced via `pnpm sync:schema` from the sibling `edoxen/edoxen/` repo). The Astro and Vue packages depend on `edoxen` for all data concerns.

## License

BSD-2-Clause (mirrors the Ruby gem).
