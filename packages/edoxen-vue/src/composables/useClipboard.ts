// useClipboard — copy text to the clipboard with a "copied" state
// that resets after 2s. Lifted character-for-character from the
// three downstream sites (tc154, tc184sc4, OIML).

import { ref } from 'vue'

export function useClipboard(timeout = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<void> {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
        timer = null
      }, timeout)
    } catch {
      // ignore — clipboard may be unavailable
    }
  }

  return { copied, copy }
}
