// Tree-shaking verification: importing only data-layer functionality
// does NOT bundle Vue, Astro, flexsearch, or ajv into the consumer's
// output.
//
// Bundles a tiny consumer via esbuild (transitive dev-dep) and
// inspects the metafile inputs. Peer deps (js-yaml, flexsearch, ajv)
// are marked external — that's what a real consumer's bundler does.
// If a refactor accidentally turns `await import('ajv')` into a
// static import, this spec fails because the source file paths
// (flexsearch/dist/..., ajv/dist/...) appear in the metafile inputs
// even when externalised.

import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ENTRY = path.join(__dirname, 'fixtures/min-consumer.ts')
const ENTRY_NONE = path.join(__dirname, 'fixtures/min-consumer-no-backend.ts')

describe('tree-shaking', () => {
  const externals = ['js-yaml', 'flexsearch', 'ajv', 'vue', 'astro']

  it('importing loadDecisions does not load flexsearch / ajv source modules', async () => {
    const result = await esbuild.build({
      entryPoints: [ENTRY],
      bundle: true,
      format: 'esm',
      write: false,
      metafile: true,
      platform: 'node',
      external: externals,
    })
    const inputs = Object.keys(result.metafile.inputs)
    // flexsearch / ajv externalised: only their package.json may
    // appear (esbuild reads it for resolution), but never their
    // dist/*.js source files. If dist files appear, a static import
    // crept in.
    const sourceFiles = inputs.filter((i) =>
      /node_modules\/(flexsearch|ajv)\/dist\//.test(i),
    )
    expect(sourceFiles, `flexsearch/ajv source bundled: ${sourceFiles.slice(0, 3).join(', ')}…`).toEqual([])
  })

  it('using backend: "none" does not bundle flexsearch source', async () => {
    const result = await esbuild.build({
      entryPoints: [ENTRY_NONE],
      bundle: true,
      format: 'esm',
      write: false,
      metafile: true,
      platform: 'node',
      external: externals,
    })
    const inputs = Object.keys(result.metafile.inputs)
    const hasFlexSource = inputs.some((i) => /node_modules\/flexsearch\/dist\//.test(i))
    expect(hasFlexSource, 'flexsearch source leaked into a backend:none bundle').toBe(false)
  })
})
