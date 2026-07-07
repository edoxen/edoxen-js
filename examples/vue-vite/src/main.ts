// Example consumer — minimal Vue 3 + Vite app that demonstrates
// the @edoxen/vue library: useDecisions + ResolutionList + EmptyState.
//
// Run: cd examples/vue-vite && pnpm dev
//
// The example mirrors the tc184sc4 site's needs: a Home view with
// stats + a Resolutions list. Real consumers add routing, styling,
// and site-specific navigation around this core.

import { createApp, h, defineComponent } from 'vue'
import { useDecisions, ResolutionList, EmptyState, useCountUp } from '@edoxen/vue'
import { presentDecision, actionTypeFacets, yearRange } from 'edoxen'

const App = defineComponent({
  setup() {
    const { items, isLoaded, loadData } = useDecisions()

    loadData().then(() => {
      // No-op; items ref is now populated.
    })

    return () => {
      if (!isLoaded.value) {
        return h('div', { class: 'loading' }, 'Loading decisions…')
      }

      const viewModels = items.value.map((d) => presentDecision(d))
      const years = yearRange(viewModels)
      const facets = actionTypeFacets(viewModels)

      return h('div', { class: 'home' }, [
        h('h1', null, 'Edoxen Vue Example'),
        h('p', { class: 'stats' }, `${viewModels.length} decisions · ${years.earliest}–${years.latest} · ${facets.all.length} action types`),
        viewModels.length === 0
          ? h(EmptyState, { message: 'No decisions found.' })
          : h(ResolutionList, { decisions: viewModels }),
      ])
    }
  },
})

createApp(App).mount('#app')
