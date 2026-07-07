// Specs for Result<T, E>, EdoxenProject, and memoised view-models
// (TODOs 41, 42, 44).

import { describe, it, expect } from 'vitest'
import {
  ok,
  err,
  tryOk,
  tryOkAsync,
  isOk,
  isErr,
  buildProject,
  presentDecision,
  presentMeeting,
} from '../src/index.js'

describe('Result<T, E>', () => {
  it('ok / err constructors + narrowing', () => {
    const good = ok(42)
    const bad = err(new Error('nope'))
    expect(isOk(good)).toBe(true)
    expect(isErr(bad)).toBe(true)
    if (isOk(good)) expect(good.value).toBe(42)
    if (isErr(bad)) expect(bad.error.message).toBe('nope')
  })

  it('tryOk wraps a throwing fn', () => {
    const good = tryOk(() => 1 + 1)
    const bad = tryOk(() => { throw new Error('x') })
    expect(isOk(good)).toBe(true)
    expect(isErr(bad)).toBe(true)
  })

  it('tryOkAsync wraps a rejecting promise', async () => {
    const good = await tryOkAsync(async () => 'ok')
    const bad = await tryOkAsync(async () => { throw new Error('boom') })
    expect(isOk(good)).toBe(true)
    expect(isErr(bad)).toBe(true)
  })
})

describe('EdoxenProject', () => {
  const decisions = [
    {
      identifier: [{ prefix: 'CIML', number: '2009/1' }],
      urn: 'urn:oiml:ciml:decision:1',
      dates: [{ date: '2009-01-01' }],
      meeting: { date: '2009-01-01' },
      localizations: [{ language_code: 'eng', title: 'D1' }],
    },
    {
      identifier: [{ prefix: 'CIML', number: '2010/2' }],
      urn: 'urn:oiml:ciml:decision:2',
      dates: [{ date: '2010-06-15' }],
      meeting: { date: '2010-06-15' },
      localizations: [{ language_code: 'eng', title: 'D2' }],
    },
  ] as never

  const meetings = [
    { urn: 'urn:oiml:ciml:meeting:ciml-39', type: 'plenary', identifier: [{ prefix: 'CIML', number: '39' }] },
  ] as never

  it('indexes decisions by meeting and by year', () => {
    const project = buildProject({ decisions, meetings })
    expect(project.decisionsByMeeting().size).toBeGreaterThan(0)
    expect(project.decisionsByYear().get('2009')?.length).toBe(1)
    expect(project.decisionsByYear().get('2010')?.length).toBe(1)
  })

  it('meetingByUrn returns the meeting', () => {
    const project = buildProject({ decisions, meetings })
    expect(project.meetingByUrn('urn:oiml:ciml:meeting:ciml-39')?.type).toBe('plenary')
    expect(project.meetingByUrn('urn:does:not:exist')).toBeUndefined()
  })

  it('decisionsForMeeting returns empty for unknown', () => {
    const project = buildProject({ decisions, meetings })
    expect(project.decisionsForMeeting('urn:unknown')).toEqual([])
  })

  it('indexes are memoised (same reference across calls)', () => {
    const project = buildProject({ decisions, meetings })
    const first = project.decisionsByYear()
    const second = project.decisionsByYear()
    expect(first).toBe(second)
  })
})

describe('memoised view-models', () => {
  it('presentDecision returns the same reference for the same source', () => {
    const d = {
      identifier: [{ prefix: 'X', number: '1' }],
      localizations: [{ language_code: 'eng', title: 'Same' }],
    } as never
    const a = presentDecision(d)
    const b = presentDecision(d)
    expect(a).toBe(b)
  })

  it('presentMeeting returns the same reference for the same source + opts', () => {
    const m = {
      urn: 'urn:test:meeting:1',
      type: 'plenary',
      identifier: [{ prefix: 'T', number: '1' }],
    } as never
    const a = presentMeeting(m, { title: 'Plenary' })
    const b = presentMeeting(m, { title: 'Plenary' })
    expect(a).toBe(b)
  })

  it('presentMeeting returns DIFFERENT reference when opts differ', () => {
    const m = {
      urn: 'urn:test:meeting:2',
      type: 'plenary',
      identifier: [{ prefix: 'T', number: '2' }],
    } as never
    const a = presentMeeting(m, { title: 'A' })
    const b = presentMeeting(m, { title: 'B' })
    expect(a).not.toBe(b)
    expect(a.title).toBe('A')
    expect(b.title).toBe('B')
  })
})
