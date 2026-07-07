// Loaders — read edoxen YAML from disk into typed JS objects.
//
// Two flavours:
//   * loadDecisions(pathOrDir) — DecisionCollection documents
//   * loadMeetings(pathOrDir)  — Meeting / MeetingCollection / MeetingSeries
//
// `pathOrDir` may be a single file or a directory. Directory loads
// return every `*.ya?ml` file concatenated; single-file loads return
// the parsed document.

import fs from 'node:fs'
import path from 'node:path'
import { load as yamlLoad } from 'js-yaml'

import { yamlDir } from './yamlDir.js'

export interface LoadedDecisions {
  metadata: unknown
  decisions: unknown[]
}

export interface LoadedMeetings {
  metadata?: unknown
  meetings: unknown[]
  series?: unknown[]
}

const YAML_RE = /\.ya?ml$/i

function readYaml(file: string): unknown {
  return yamlLoad(fs.readFileSync(file, 'utf8'))
}

function hasKind<T extends string>(obj: unknown, key: T): obj is Record<T, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj
}

function fromSingleDecisionDoc(parsed: unknown): LoadedDecisions {
  if (!parsed || typeof parsed !== 'object') return { metadata: {}, decisions: [] }
  const doc = parsed as Record<string, unknown>
  const metadata = doc.metadata ?? {}
  const decisions = Array.isArray(doc.decisions) ? doc.decisions : []
  return { metadata, decisions }
}

function fromSingleMeetingDoc(parsed: unknown): LoadedMeetings {
  if (!parsed || typeof parsed !== 'object') return { meetings: [] }
  const doc = parsed as Record<string, unknown>

  if (Array.isArray(doc.meetings)) {
    return { metadata: doc.metadata ?? {}, meetings: doc.meetings }
  }
  if (hasKind(doc, 'meeting_refs')) {
    return { series: [doc], meetings: [] }
  }
  return { meetings: [doc] }
}

export async function loadDecisions(target: string): Promise<LoadedDecisions> {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    const all: unknown[] = []
    let metadata: unknown = {}
    for (const file of yamlDir(target)) {
      const parsed = readYaml(path.join(target, file))
      if (!parsed || typeof parsed !== 'object') continue
      const sub = fromSingleDecisionDoc(parsed)
      all.push(...sub.decisions)
      if (metadata && typeof metadata === 'object' && Object.keys(metadata as object).length === 0) {
        metadata = sub.metadata
      }
    }
    return { metadata, decisions: all }
  }
  return fromSingleDecisionDoc(readYaml(target))
}

export async function loadMeetings(target: string): Promise<LoadedMeetings> {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    const allMeetings: unknown[] = []
    const allSeries: unknown[] = []
    for (const file of yamlDir(target)) {
      const parsed = readYaml(path.join(target, file))
      if (!parsed || typeof parsed !== 'object') continue
      const sub = fromSingleMeetingDoc(parsed)
      allMeetings.push(...sub.meetings)
      if (sub.series) allSeries.push(...sub.series)
    }
    return { meetings: allMeetings, series: allSeries.length ? allSeries : undefined }
  }
  return fromSingleMeetingDoc(readYaml(target))
}

export async function loadMeetingSeries(file: string): Promise<unknown> {
  const parsed = readYaml(file)
  if (!parsed || typeof parsed !== 'object') return null
  const doc = parsed as Record<string, unknown>
  return doc.meeting_refs ? doc : null
}

export async function loadCollection(file: string): Promise<LoadedDecisions> {
  return fromSingleDecisionDoc(readYaml(file))
}

export { yamlDir, YAML_RE }
