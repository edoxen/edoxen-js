// Loaders — read edoxen YAML from disk into typed JS objects.
//
// Two flavours:
//   * loadDecisions(pathOrDir) — DecisionCollection documents
//   * loadMeetings(pathOrDir)  — Meeting / MeetingCollection / MeetingSeries
//   * loadContacts / loadVenues / loadBodies(pathOrDir) — register
//     documents (ContactRegister / VenueRegister / BodyRegister)
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
  BodyRegister,
  ContactRegister,
  Decision,
  DecisionMetadata,
  VenueRegister,
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

// --- Register documents (ContactRegister / VenueRegister / BodyRegister) ---

export interface RegisterPaths {
  contacts?: string
  venues?: string
  bodies?: string
}

export interface LoadedRegisters {
  contacts?: ContactRegister
  venues?: VenueRegister
  bodies?: BodyRegister
}

type RegisterKey = 'contacts' | 'venues' | 'bodies'

function fromSingleRegisterDoc(parsed: unknown, key: RegisterKey): DocumentLike {
  if (!isObject(parsed)) return { [key]: [] }
  return { ...parsed, [key]: Array.isArray(parsed[key]) ? parsed[key] : [] }
}

// Register files are single YAML documents ({scope, title, <key>: []}).
// A directory load merges the member arrays of every register document
// in it, taking `scope` / `title` from the first file that carries them
// (mirrors loadDecisions' first-non-empty metadata rule).
async function loadRegister<R>(target: string, key: RegisterKey): Promise<R> {
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    const merged: DocumentLike = { [key]: [] }
    for (const file of yamlDir(target)) {
      const sub = fromSingleRegisterDoc(readYaml(path.join(target, file)), key)
      ;(merged[key] as unknown[]).push(...(sub[key] as unknown[]))
      for (const scalar of ['scope', 'title'] as const) {
        if (merged[scalar] === undefined && sub[scalar] !== undefined) {
          merged[scalar] = sub[scalar]
        }
      }
    }
    return merged as R
  }
  return fromSingleRegisterDoc(readYaml(target), key) as R
}

export async function loadContacts(target: string): Promise<ContactRegister> {
  return loadRegister<ContactRegister>(target, 'contacts')
}

export async function loadVenues(target: string): Promise<VenueRegister> {
  return loadRegister<VenueRegister>(target, 'venues')
}

export async function loadBodies(target: string): Promise<BodyRegister> {
  return loadRegister<BodyRegister>(target, 'bodies')
}

export async function loadRegisters(paths: RegisterPaths): Promise<LoadedRegisters> {
  const loaded: LoadedRegisters = {}
  if (paths.contacts) loaded.contacts = await loadContacts(paths.contacts)
  if (paths.venues) loaded.venues = await loadVenues(paths.venues)
  if (paths.bodies) loaded.bodies = await loadBodies(paths.bodies)
  return loaded
}

function readYaml(file: string): unknown {
  return normalizeDates(yamlLoad(fs.readFileSync(file, 'utf8')))
}

export { yamlDir }
export type { MeetingCollection }
