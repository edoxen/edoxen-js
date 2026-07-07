// AsciiDoc rendering — wraps @asciidoctor/core (peer dep) and
// pre-processes the PDF-extracted bullet artefacts that the gem's
// fixtures carry (PUA range U+E000–U+F8FF).
//
// Lifted from tc184sc4's src/utils/asciidoc.ts.

import * as AsciidoctorNS from '@asciidoctor/core'

// @asciidoctor.core v3+ exposes the convert function directly on the
// module namespace (no factory call needed).
type ConvertFn = (input: string, opts: Record<string, unknown>) => unknown

const BULLET_RE = /^[-•●▪▸▹‣⁃]\s*/
const SUB_BULLET_RE = /^o\s+/

function preprocess(text: string): string {
  if (!text) return ''

  const lines = text.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '.') {
      i++
      continue
    }

    if (BULLET_RE.test(trimmed)) {
      const content = trimmed.replace(BULLET_RE, '')
      if (result.length > 0 && result[result.length - 1].trim() !== '') result.push('')
      result.push('* ' + content)
      i++
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        lines[i].trim() !== '.' &&
        !BULLET_RE.test(lines[i].trim()) &&
        !SUB_BULLET_RE.test(lines[i].trim())
      ) {
        if (SUB_BULLET_RE.test(lines[i].trim())) break
        if (i + 1 < lines.length && BULLET_RE.test(lines[i + 1].trim())) {
          result.push(lines[i])
          i++
          continue
        }
        break
      }
      continue
    }

    if (SUB_BULLET_RE.test(trimmed) && trimmed.length < 80) {
      const content = trimmed.replace(SUB_BULLET_RE, '')
      result.push('** ' + content)
      i++
      continue
    }

    result.push(line)
    i++
  }

  return result.join('\n')
}

export function asciidocify(text: string): string {
  if (!text) return ''
  // The asciidoctor module shape varies wildly across bundler/ctx:
  //   - ESM direct: ns.convert exists
  //   - CJS interop: ns.default may be the function or have .convert
  //   - Vite browser bundle: ns.default has all exports
  // Walk the shape and find a `convert` function.
  const ns = AsciidoctorNS as unknown as {
    convert?: ConvertFn
    default?: unknown
  }

  function findConvert(obj: unknown, depth = 0): ConvertFn | undefined {
    if (depth > 3) return undefined
    if (typeof obj === 'function') return obj as ConvertFn
    if (obj && typeof obj === 'object') {
      const o = obj as { convert?: ConvertFn; default?: unknown }
      if (typeof o.convert === 'function') return o.convert
      if ('default' in o) {
        const nested = findConvert(o.default, depth + 1)
        if (nested) return nested
      }
    }
    return undefined
  }

  const convertFn = findConvert(ns) ?? (typeof ns.convert === 'function' ? ns.convert : undefined)
  if (!convertFn) {
    throw new Error(
      "@asciidoctor/core peer dep missing or incompatible shape. " +
        `Top-level keys: ${Object.keys(AsciidoctorNS).slice(0, 10).join(', ')}`,
    )
  }
  const preprocessed = preprocess(text)
  return String(
    convertFn(preprocessed, {
      standalone: false,
      safe: 'safe',
      attributes: { showtitle: false },
    }),
  )
}
