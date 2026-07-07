// useCountUp — animate a number from 0 to target when `active`
// becomes true. Lifted character-for-character from tc184sc4 and
// OIML's identical copies.

import { ref, watch, type Ref } from 'vue'

export function useCountUp(
  target: Ref<number | null>,
  active: Ref<boolean>,
  duration = 1500,
): Ref<number | null> {
  const current = ref<number | null>(0)
  let started = false

  watch(
    active,
    (go) => {
      if (!go || started) return
      const tgt = target.value
      if (tgt == null) return
      started = true

      const start = typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now()
      const tick = (now: number) => {
        const elapsed = Math.max(0, now - start)
        const t = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        current.value = Math.round(eased * tgt)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { immediate: true },
  )

  return current
}
