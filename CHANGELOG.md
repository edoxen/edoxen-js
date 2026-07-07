# Changelog

All notable changes to edoxen-js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-07-07

First public release of the Edoxen JavaScript library — a framework-agnostic TypeScript data layer for the Edoxen meeting/decision information model, plus a Vue 3 adapter for existing Vue/Vite consumers.

### Added

- **`edoxen` package** — types auto-generated from the gem's JSON Schemas (`json-schema-to-typescript`), YAML loaders, transforms, contacts, search, URN, i18n, body, validate, and configure helpers. 60 specs passing.
- **`@edoxen/vue` package** — Vue 3 composables (createCollection, useDecisions, useMeetings, useCommittee, useClipboard, useCountUp, useNeighborNav, useEdoxenProject) and components (ResolutionList, ActionTypeBadge, PrevNextNav, CountryFlag, EmptyState). 5 specs passing.
- **`@edoxen/astro` package** — Astro server-component skeletons (ResolutionList, ActionTypeBadge, MeetingDetail).
- **`edoxen-build` CLI** — YAML → JSON build pipeline.
- **Branded types** — `Urn`, `DecisionId`, `BodyCode`, `Locale`.
- **`EdoxenProject`** — unified join of committee + decisions + meetings with memoised O(1) lookups (`decisionsByMeeting`, `decisionsByYear`, `decisionsByKind`, `meetingByUrn`, `meetingByYear`, `decisionByUrn`, `decisionsForMeeting`).
- **`Result<T, E>`** — composable error type with `ok`/`err`/`tryOk`/`tryOkAsync`/`isOk`/`isErr`.
- **Memoised view-models** — `presentDecision` / `presentMeeting` cache via WeakMap.
- **Schema-sync + type-gen** — `pnpm sync:schema` mirrors the gem's canonical JSON Schemas; `pnpm gen:types` regenerates TS types.

### Adopters

- **isotc184sc4/resolutions-data** — fully adopted (data + composables).
- **iso-tc154/www.isotc154.org** — phase-1 adopted (useClipboard + useCountUp).
- **oimlsmart/resolutions-data** — phase-1 adopted (useClipboard + useCountUp).

### License

BSD-2-Clause (mirrors the Ruby gem).
