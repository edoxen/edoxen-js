// Loaders — read edoxen YAML from disk into typed JS objects.
//
// Two flavours:
//   * loadDecisions(pathOrDir) — DecisionCollection documents
//   * loadMeetings(pathOrDir)  — Meeting / MeetingCollection / MeetingSeries
//
// `pathOrDir` may be a single file or a directory. Directory loads
// return every `*.ya?ml` file concatenated; single-file loads return
// the parsed document.
//
// The returned types come straight from the generated types — no
// `unknown` here. Callers can rely on shape.

import fs from 'node:fs'
import path from 'node:path'
import { load as yamlLoad } from 'js-yaml'

import { yamlDir } from './yamlDir.js'
import { normalizeDates } from './normalizeDates.js'
import type {
  Decision,
  DecisionMetadata,
} from '../types/generated/edoxen.js'
import type {
  Meeting,
  MeetingCollection,
  MeetingCollectionMetadata,
  MeetingSeries,
} from '../types/generated/meeting.js'

export interface LoadedDecisions {
  metadata: DecisionMetadata | Record<string, never>
  decisions: Decision[]
}

export interface LoadedMeetings {
  metadata?: MeetingCollectionMetadata
  meetings: Meeting[]
  series?: MeetingSeries[]
}

interface DocumentLike {
  [key: string]: unknown
}

function isObject(value: unknown): value is DocumentLike {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function fromSingleDecisionDoc(parsed: unknown): LoadedDecisions {
  if (!isObject(parsed)) return { metadata: {}, decisions: [] }
  return {
    metadata: (isObject(parsed.metadata) ? parsed.metadata : {}) as DecisionMetadata,
    decisions: Array.isArray(parsed.decisions) ? (parsed.decisions as Decision[]) : [],
  }
}

function fromSingleMeetingDoc(parsed: unknown): LoadedMeetings {
  if (!isObject(parsed)) return { meetings: [] }

  if (Array.isArray(parsed.meetings)) {
    return {
      metadata: isObject(parsed.metadata)
        ? (parsed.metadata as MeetingCollectionMetadata)
        : undefined,
      meetings: parsed.meetings as Meeting[],
    }
  }
  if ('meeting_refs' in parsed || ('identifier' in parsed && !('type' in parsed) && !('date_range' in parsed))) {
    return { series: [parsed as unknown as MeetingSeries], meetings: [] }
  }
  return { meetings: [parsed as unknown as Meeting] }
}

export async function loadDecisions(target: string): Promise<LoadedDecisions> {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    const all: Decision[] = []
    let metadata: DecisionMetadata | Record<string, never> = {}
    for (const file of yamlDir(target)) {
      const sub = fromSingleDecisionDoc(readYaml(path.join(target, file)))
      all.push(...sub.decisions)
      if (!metadata || (isObject(metadata) && Object.keys(metadata).length === 0)) {
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
    const allMeetings: Meeting[] = []
    const allSeries: MeetingSeries[] = []
    for (const file of yamlDir(target)) {
      const sub = fromSingleMeetingDoc(readYaml(path.join(target, file)))
      allMeetings.push(...sub.meetings)
      if (sub.series) allSeries.push(...sub.series)
    }
    return { meetings: allMeetings, series: allSeries.length ? allSeries : undefined }
  }
  return fromSingleMeetingDoc(readYaml(target))
}

export async function loadMeetingSeries(file: string): Promise<MeetingSeries | null> {
  const parsed = readYaml(file)
  if (!isObject(parsed)) return null
  return 'meeting_refs' in parsed ? (parsed as unknown as MeetingSeries) : null
}

export async function loadCollection(file: string): Promise<LoadedDecisions> {
  return fromSingleDecisionDoc(readYaml(file))
}

function readYaml(file: string): unknown {
  return normalizeDates(yamlLoad(fs.readFileSync(file, 'utf8')))
}

export { yamlDir }
export type { MeetingCollection }
