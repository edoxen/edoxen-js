// useEdoxenProject — reactive bundle of useDecisions + useMeetings +
// useCommittee. Returns an EdoxenProject graph that updates as each
// fetch completes.

import { computed, ref, type Ref, watch } from 'vue'
import { buildProject, type EdoxenProject, type Decision, type Meeting, type MeetingSeries } from 'edoxen'
import { useDecisions } from './useDecisions.js'
import { useMeetings } from './useMeetings.js'
import { useCommittee } from './useCommittee.js'

export interface UseEdoxenProjectResult {
  project: Ref<EdoxenProject | null>
  loaded: Ref<boolean>
  loadData: () => Promise<void>
}

export function useEdoxenProject(opts: {
  decisionsUrl?: string
  meetingsUrl?: string
  committeeUrl?: string
} = {}): UseEdoxenProjectResult {
  const decisionsCol = useDecisions(opts.decisionsUrl)
  const meetingsCol = useMeetings(opts.meetingsUrl)
  const committeeCol = useCommittee(opts.committeeUrl)

  const project = ref<EdoxenProject | null>(null) as Ref<EdoxenProject | null>
  const loaded = ref(false)
  let lastDecisions: readonly Decision[] = []
  let lastMeetings: readonly Meeting[] = []
  let lastCommittee: MeetingSeries | null = null

  function rebuild(): void {
    project.value = buildProject({
      decisions: lastDecisions,
      meetings: lastMeetings,
      committee: lastCommittee,
    })
  }

  watch(
    () => decisionsCol.items.value,
    (d) => {
      lastDecisions = d
      rebuild()
    },
    { immediate: true },
  )
  watch(
    () => meetingsCol.items.value,
    (m) => {
      lastMeetings = m
      rebuild()
    },
    { immediate: true },
  )
  watch(
    () => committeeCol.committee.value,
    (c) => {
      lastCommittee = c
      rebuild()
    },
    { immediate: true },
  )

  const loadData = async (): Promise<void> => {
    await Promise.all([
      decisionsCol.loadData(),
      meetingsCol.loadData(),
      committeeCol.loadData(),
    ])
    loaded.value = true
  }

  return { project, loaded, loadData }
}
