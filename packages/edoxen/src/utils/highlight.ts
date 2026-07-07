// Code-highlight shim. The actual highlighting backend is
// consumer-configurable: most sites don't need it, so we keep this
// file dependency-free and let consumers register a backend.
//
// Lifted from tc184sc4's src/utils/highlight.ts.

export type HighlightBackend = (text: string, query: string) => string

let backend: HighlightBackend = (text) => text

export function registerHighlightBackend(b: HighlightBackend): void {
  backend = b
}

// HTML-safe highlight: escapes the text first, then wraps query
// matches in <mark>. Default backend returns the text unchanged.
export function highlightText(text: string, query: string): string {
  return backend(text, query)
}

// Browser-only default: uses DOM APIs to escape + wrap.
if (typeof document !== 'undefined') {
  registerHighlightBackend((text, query) => {
    if (!query || !text) return text
    const div = document.createElement('div')
    div.innerText = text
    const escapedText = div.innerHTML
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>')
  })
}
