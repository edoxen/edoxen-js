// yamlDir — list YAML files in a directory, sorted. The same helper
// appears (verbatim) in tc154, tc184sc4, and OIML; this is the
// canonical version.
//
// Future site: import { yamlDir } from 'edoxen'

import fs from 'node:fs'

const YAML_RE = /\.ya?ml$/i

export function yamlDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => YAML_RE.test(f))
    .sort()
}
