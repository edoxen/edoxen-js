// @edoxen/vue — Vue 3 adapter for the Edoxen data layer.
//
// The Vue adapter wraps the framework-agnostic `edoxen` package in
// reactive composables and Vue single-file components. The 3
// existing Vue consumers (tc154, tc184sc4, OIML) migrate gradually
// from their local copies to these.
//
// See TODO 16 (composables) and TODO 17 (components) for the full
// lift. v0.1 ships skeleton only; v0.2 lands with the full set.

export * from './composables/index.js'
