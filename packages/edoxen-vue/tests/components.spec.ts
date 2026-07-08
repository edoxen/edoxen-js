// Component tests for every @edoxen/vue component.
//
// Uses @vue/test-utils mount() to verify each component renders
// correctly with various prop combinations and emits the expected
// events.

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ActionTypeBadge from '../src/components/ActionTypeBadge.vue'
import CountryFlag from '../src/components/CountryFlag.vue'
import EmptyState from '../src/components/EmptyState.vue'
import PrevNextNav from '../src/components/PrevNextNav.vue'
import ResolutionList from '../src/components/ResolutionList.vue'
import ResolutionDetail from '../src/components/ResolutionDetail.vue'
import MeetingList from '../src/components/MeetingList.vue'
import MeetingDetail from '../src/components/MeetingDetail.vue'
import FilterBar from '../src/components/FilterBar.vue'
import CommitteeCard from '../src/components/CommitteeCard.vue'

// --- ActionTypeBadge --------------------------------------------------

describe('ActionTypeBadge', () => {
  it('renders the action verb in title-case', () => {
    const w = mount(ActionTypeBadge, { props: { type: 'resolves' } })
    expect(w.text()).toBe('Resolves')
  })

  it('renders nothing when type is empty', () => {
    const w = mount(ActionTypeBadge, { props: { type: null } })
    expect(w.text()).toBe('')
    expect(w.find('.edoxen-action-badge').exists()).toBe(false)
  })

  it('title-cases unknown verbs', () => {
    const w = mount(ActionTypeBadge, { props: { type: 'customverb' } })
    expect(w.text()).toBe('Customverb')
  })
})

// --- CountryFlag ------------------------------------------------------

describe('CountryFlag', () => {
  it('renders emoji from country name', () => {
    const w = mount(CountryFlag, { props: { country: 'Japan' } })
    expect(w.text()).toContain('🇯🇵')
  })

  it('renders emoji from ISO code', () => {
    const w = mount(CountryFlag, { props: { country: 'DE' } })
    expect(w.text()).toContain('🇩🇪')
  })

  it('renders nothing for unknown country', () => {
    const w = mount(CountryFlag, { props: { country: null } })
    expect(w.find('.edoxen-flag').exists()).toBe(false)
  })
})

// --- EmptyState -------------------------------------------------------

describe('EmptyState', () => {
  it('renders the message', () => {
    const w = mount(EmptyState, { props: { message: 'No data.' } })
    expect(w.text()).toContain('No data.')
  })

  it('shows default message when none provided', () => {
    const w = mount(EmptyState)
    expect(w.text()).toContain('Nothing to show.')
  })
})

// --- PrevNextNav ------------------------------------------------------

describe('PrevNextNav', () => {
  it('renders both buttons when prev and next exist', () => {
    const w = mount(PrevNextNav, {
      props: {
        prev: { id: 'a', title: 'Previous' },
        next: { id: 'b', title: 'Next' },
      },
    })
    const btns = w.findAll('button')
    expect(btns).toHaveLength(2)
    expect(btns[0].text()).toContain('Previous')
    expect(btns[1].text()).toContain('Next')
  })

  it('emits "prev" and "next" on click', async () => {
    const w = mount(PrevNextNav, {
      props: {
        prev: { id: 'a' },
        next: { id: 'b' },
      },
    })
    const btns = w.findAll('button')
    await btns[0].trigger('click')
    expect(w.emitted('prev')).toHaveLength(1)
    await btns[1].trigger('click')
    expect(w.emitted('next')).toHaveLength(1)
  })

  it('hides prev button when null', () => {
    const w = mount(PrevNextNav, {
      props: { prev: null, next: { id: 'b' } },
    })
    expect(w.findAll('button')).toHaveLength(1)
  })
})

// --- ResolutionList ---------------------------------------------------

describe('ResolutionList', () => {
  const decisions = [
    {
      id: 'CIML-2009-1',
      identifier: 'CIML/2009-1',
      urn: 'urn:test:1',
      doi: '',
      year: '2009',
      title: 'Test Resolution',
      subject: 'Test Subject',
      snippet: 'A test snippet here',
      isAcclamation: false,
      actions: [{ type: 'resolves', message: 'Resolves to test' }],
      considerations: [],
      approvals: [],
    },
    {
      id: 'CIML-2010-2',
      identifier: 'CIML/2010-2',
      urn: 'urn:test:2',
      doi: '',
      year: '2010',
      title: 'Another',
      subject: '',
      snippet: '',
      isAcclamation: false,
      actions: [{ type: 'decides', message: 'Decides something' }],
      considerations: [],
      approvals: [],
    },
  ]

  it('renders all decisions', () => {
    const w = mount(ResolutionList, { props: { decisions } })
    expect(w.findAll('.edoxen-resolution-list__item')).toHaveLength(2)
  })

  it('shows year + identifier', () => {
    const w = mount(ResolutionList, { props: { decisions } })
    const items = w.findAll('.edoxen-resolution-list__item')
    expect(items[0].find('.edoxen-resolution-list__year').text()).toBe('2010')
    expect(items[0].find('.edoxen-resolution-list__id').text()).toBe('CIML/2010-2')
  })

  it('filters by selectedYears', () => {
    const w = mount(ResolutionList, {
      props: { decisions, selectedYears: ['2009'] },
    })
    expect(w.findAll('.edoxen-resolution-list__item')).toHaveLength(1)
  })

  it('filters by text query', () => {
    const w = mount(ResolutionList, {
      props: { decisions, query: 'Another' },
    })
    expect(w.findAll('.edoxen-resolution-list__item')).toHaveLength(1)
    expect(w.text()).toContain('Another')
  })

  it('emits select on click', async () => {
    const w = mount(ResolutionList, { props: { decisions } })
    await w.find('.edoxen-resolution-list__item').trigger('click')
    expect(w.emitted('select')).toEqual([['CIML-2010-2']])
  })

  it('sorts newest-first by default', () => {
    const w = mount(ResolutionList, { props: { decisions } })
    const years = w.findAll('.edoxen-resolution-list__year').map((e) => e.text())
    expect(years).toEqual(['2010', '2009'])
  })

  it('shows empty state when no matches', () => {
    const w = mount(ResolutionList, {
      props: { decisions, query: 'zzzznotfound' },
    })
    expect(w.text()).toContain('No resolutions match')
  })
})

// --- ResolutionDetail -------------------------------------------------

describe('ResolutionDetail', () => {
  const decision = {
    id: 'CIML-2009-1',
    identifier: 'CIML/2009-1',
    urn: 'urn:test:ciml:decision:1',
    doi: '10.63493/resolutions/ciml20091',
    year: '2009',
    title: 'Advance ISO 12345',
    subject: 'ISO 12345 ed2',
    snippet: 'Advance to stage 30',
    isAcclamation: false,
    actions: [{ type: 'resolves', message: 'Resolves to advance' }],
    considerations: [{ type: 'noting', message: 'Noting the work' }],
    approvals: [{ type: 'affirmative', degree: 'unanimous' }],
  }

  it('renders the title + identifier + urn', () => {
    const w = mount(ResolutionDetail, { props: { decision } })
    expect(w.find('.edoxen-resolution-detail__title').text()).toBe('Advance ISO 12345')
    expect(w.find('.edoxen-resolution-detail__id').text()).toBe('CIML/2009-1')
    expect(w.find('.edoxen-resolution-detail__urn').text()).toBe('urn:test:ciml:decision:1')
  })

  it('renders actions section with badges', () => {
    const w = mount(ResolutionDetail, { props: { decision } })
    const actions = w.findAll('.edoxen-resolution-detail__block')[1]
    expect(actions.find('h2').text()).toBe('Actions')
    expect(actions.findAll('.edoxen-action-badge')).toHaveLength(1)
  })

  it('renders considerations section', () => {
    const w = mount(ResolutionDetail, { props: { decision } })
    const cons = w.findAll('.edoxen-resolution-detail__block')[0]
    expect(cons.find('h2').text()).toBe('Considerations')
  })

  it('hides sections when empty', () => {
    const minimal = { ...decision, actions: [], considerations: [], approvals: [] }
    const w = mount(ResolutionDetail, { props: { decision: minimal } })
    expect(w.findAll('.edoxen-resolution-detail__block')).toHaveLength(0)
  })
})

// --- MeetingList ------------------------------------------------------

describe('MeetingList', () => {
  const meetings = [
    { urn: 'urn:t:1', slug: 'm1', title: 'Meeting 2024', ordinal: 42, type: 'plenary', status: 'completed', year: 2024, start: '2024-05-01', end: '2024-05-05', venue: 'Tokyo', committee: 'TC' },
    { urn: 'urn:t:2', slug: 'm2', title: 'Meeting 2023', ordinal: 41, type: 'plenary', status: 'completed', year: 2023, start: '2023-10-01', end: '2023-10-05', venue: 'Berlin', committee: 'TC' },
  ]

  it('renders all meetings sorted by year desc', () => {
    const w = mount(MeetingList, { props: { meetings } })
    const items = w.findAll('.edoxen-meeting-list__item')
    expect(items).toHaveLength(2)
    expect(items[0].find('.edoxen-meeting-list__year').text()).toBe('2024')
    expect(items[1].find('.edoxen-meeting-list__year').text()).toBe('2023')
  })

  it('filters by year', () => {
    const w = mount(MeetingList, {
      props: { meetings, selectedYears: ['2023'] },
    })
    expect(w.findAll('.edoxen-meeting-list__item')).toHaveLength(1)
  })

  it('emits select with URN', async () => {
    const w = mount(MeetingList, { props: { meetings } })
    await w.find('.edoxen-meeting-list__item').trigger('click')
    expect(w.emitted('select')).toEqual([['urn:t:1']])
  })
})

// --- MeetingDetail ----------------------------------------------------

describe('MeetingDetail', () => {
  const meeting = {
    urn: 'urn:t:meeting:1',
    slug: 'meeting-1',
    title: '42nd Plenary',
    ordinal: 42,
    type: 'plenary',
    status: 'completed',
    year: 2024,
    start: '2024-05-01',
    end: '2024-05-05',
    venue: 'Tokyo, Japan',
    committee: 'ISO/TC 184/SC 4',
  }

  it('renders title + venue + dates', () => {
    const w = mount(MeetingDetail, { props: { meeting } })
    expect(w.find('h1').text()).toBe('42nd Plenary')
    expect(w.text()).toContain('Tokyo, Japan')
    expect(w.text()).toContain('2024-05-01')
  })

  it('renders URN', () => {
    const w = mount(MeetingDetail, { props: { meeting } })
    expect(w.find('.edoxen-meeting-detail__urn').text()).toBe('urn:t:meeting:1')
  })

  it('renders default slot content', () => {
    const w = mount(MeetingDetail, {
      props: { meeting },
      slots: { default: '<p>Agenda items here</p>' },
    })
    expect(w.html()).toContain('Agenda items here')
  })
})

// --- FilterBar --------------------------------------------------------

describe('FilterBar', () => {
  const facets = [
    { id: 'year', label: 'Year', values: ['2024', '2023'], selected: ['2024'], multiple: true },
    { id: 'type', label: 'Type', values: ['resolution', 'order'], selected: [] },
  ]

  it('renders all facet groups with labels', () => {
    const w = mount(FilterBar, { props: { facets } })
    const labels = w.findAll('.edoxen-filter-bar__label')
    expect(labels).toHaveLength(2)
    expect(labels[0].text()).toBe('Year')
  })

  it('marks selected values as active', () => {
    const w = mount(FilterBar, { props: { facets } })
    const chips = w.findAll('.edoxen-filter-bar__chip')
    const active = chips.filter((c) => c.classes().includes('edoxen-filter-bar__chip--active'))
    expect(active).toHaveLength(1)
    expect(active[0].text()).toBe('2024')
  })

  it('emits toggle on chip click', async () => {
    const w = mount(FilterBar, { props: { facets } })
    const chips = w.findAll('.edoxen-filter-bar__chip')
    await chips[0].trigger('click')
    expect(w.emitted('toggle')).toEqual([['year', '2024']])
  })
})

// --- CommitteeCard ----------------------------------------------------

describe('CommitteeCard', () => {
  it('renders name + title + established', () => {
    const w = mount(CommitteeCard, {
      props: {
        name: 'ISO/TC 184/SC 4',
        title: 'Industrial data',
        established: 1984,
      },
    })
    expect(w.find('.edoxen-committee-card__name').text()).toBe('ISO/TC 184/SC 4')
    expect(w.find('.edoxen-committee-card__title').text()).toBe('Industrial data')
    expect(w.text()).toContain('1984')
    expect(w.text()).toContain('Established')
  })

  it('renders stats array', () => {
    const w = mount(CommitteeCard, {
      props: {
        name: 'Test',
        stats: [
          { label: 'Members', value: 21 },
          { label: 'Standards', value: 822 },
        ],
      },
    })
    const stats = w.findAll('.edoxen-committee-card__stat')
    expect(stats).toHaveLength(2)
    expect(stats[0].find('.edoxen-committee-card__stat-value').text()).toBe('21')
    expect(stats[0].find('.edoxen-committee-card__stat-label').text()).toBe('Members')
  })

  it('handles null stat values', () => {
    const w = mount(CommitteeCard, {
      props: {
        name: 'Test',
        stats: [{ label: 'Unknown', value: null }],
      },
    })
    expect(w.text()).toContain('—')
  })
})
