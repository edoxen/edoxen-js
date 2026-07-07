// AsciiDoc rendering — wraps @asciidoctor/core (peer dep) and
// pre-processes the PDF-extracted bullet artefacts that the gem's
// fixtures carry (PUA range U+E000–U+F8FF).
//
// Lifted from tc184sc4's src/utils/asciidoc.ts.

import * as AsciidoctorNS from '@asciidoctor/core'

// @asciidoctor/core's ESM shape varies by bundler; handle both.
type AsciidoctorFactory = { (): { convert: (input: string, opts: Record<string, unknown>) => unknown } }
const factory: AsciidoctorFactory =
  (AsciidoctorNS as { default?: AsciidoctorFactory }).default ??
  (AsciidoctorNS as unknown as AsciidoctorFactory)

// Lazily construct — keeps consumers that never render AsciiDoc from
// paying the cost at module load.
let cached: ReturnType<AsciidoctorFactory> | null = null
function asciidoctor() {
  if (!cached) cached = factory()
  return cached
}

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
  const preprocessed = preprocess(text)
  return String(
    asciidoctor.convert(preprocessed, {
      standalone: false,
      safe: 'safe',
      attributes: { showtitle: false },
    }),
  )
}
