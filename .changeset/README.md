# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) for version + release management.

## Workflow

1. While working on a PR, run `pnpm changeset` to declare the change.
2. Pick the affected package(s) and the bump (patch / minor / major).
3. Commit the generated `.changeset/*.md` file alongside your code changes.
4. When the PR merges, the Changesets release workflow opens a "Version Packages" PR that bumps versions + publishes to npm.

## Lockstep

`edoxen`, `@edoxen/astro`, and `@edoxen/vue` are versioned in lockstep while pre-1.0. After v1.0, types changes in `edoxen` may trigger minor bumps in UI packages.
