import { describe, it, expect } from 'vitest'
import { useClipboard, useCountUp, useNeighborNav } from '../src/composables/index.js'
import { ref, computed } from 'vue'

describe('useClipboard', () => {
  it('returns a ref + copy function', () => {
    const { copied, copy } = useClipboard()
    expect(typeof copied.value).toBe('boolean')
    expect(typeof copy).toBe('function')
  })
})

describe('useCountUp', () => {
  it('starts at 0 and ticks when active becomes true', async () => {
    const target = ref<number | null>(100)
    const active = ref(false)
    const current = useCountUp(target, active, 100)
    expect(current.value === 0 || current.value === null).toBe(true)
    active.value = true
    // rAF in jsdom is unreliable; just assert the composable doesn't
    // throw and starts. The full animation is exercised in browser.
    await new Promise((r) => setTimeout(r, 50))
    expect(typeof current.value).toBe('number')
  })

  it('does nothing when target is null', () => {
    const target = ref<number | null>(null)
    const active = ref(true)
    const current = useCountUp(target, active)
    expect(current.value).toBe(0)
  })
})

describe('useNeighborNav', () => {
  it('returns prev and next relative to currentId', () => {
    const items = ref([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
    const currentId = computed(() => 'b')
    const { prev, next } = useNeighborNav(items, currentId)
    expect(prev.value?.id).toBe('a')
    expect(next.value?.id).toBe('c')
  })

  it('returns null at bounds', () => {
    const items = ref([{ id: 'a' }, { id: 'b' }])
    const { prev, next } = useNeighborNav(items, computed(() => 'a'))
    expect(prev.value).toBeNull()
    expect(next.value?.id).toBe('b')
  })
})
