// Edoxen — framework-agnostic TypeScript data layer for the Edoxen
// meeting/decision information model.
//
// Types are auto-generated from the gem's canonical JSON Schemas.
// Only types that json-schema-to-typescript emits are re-exported
// here. Some v2.1 entities (VoteRecord, Motion, Voting, etc.) may
// require schema-tuning to surface as standalone interfaces; for
// now, consumers that need them should cast through `Record<string,
// unknown>` until TODO 02 is fully polished.

// Decision-side types (live in the edoxen.json schema):
export type {
  Action,
  Approval,
  Consideration,
  Decision,
  EdoxenDecisionCollectionSchema,
  DecisionDate,
  DecisionMetadata,
  DecisionRelation,
  Localization,
  MeetingIdentifier,
  Url,
  ActionType,
  ApprovalType,
  ApprovalDegree,
  ConsiderationType,
  DecisionDateType,
  DecisionKind,
  DecisionRelationType,
  DecisionStatus,
  SourceUrlKind,
  UrlKind,
} from './types/generated/edoxen.js'

// VoteRecord, Motion, Voting, VotingCounts, PhysicalVenue,
// VirtualVenue are defined in the decision-collection schema (not
// meeting.json) and surface in the generated output only when
// `unreachableDefinitions: true` is passed to json-schema-to-typescript.
export type {
  Motion,
  Voting,
  VotingCounts,
  VoteRecord,
  PhysicalVenue,
  VirtualVenue,
} from './types/generated/edoxen.js'

// Meeting-side + shared types (live in meeting.json — the superset):
export type {
  MeetingCollection,
  MeetingCollectionMetadata,
  BodyVocabularyEntry,
  Meeting,
  MeetingComponent,
  MeetingSeries,
  MeetingRelation,
  MeetingRelationType,
  MeetingStatus,
  MeetingType,
  MeetingLocalization,
  Officer,
  OfficerRole,
  HostType,
  Topic,
  TopicAsset,
  TopicDocument,
  TopicStatus,
  Venue,
  VenueKind,
  VirtualFeature,
  Visibility,
  Recurrence,
  RecurrenceByDay,
  RecurrenceFreq,
  ComponentKind,
  ComponentLocalization,
  Contact,
  ContactMethod,
  ContactIdentifier,
  ContactMethodKind,
  ContactIdentifierKind,
  Name,
  Person,
  HostRef,
  Deadline,
  DateRange,
  Reference,
  Agenda,
  AgendaItem,
  AgendaItemKind,
  AgendaItemOutcome,
  AgendaStatus,
  Attendance,
  AttendanceRole,
  AttendanceResponse,
  Minutes,
  MinutesSection,
  ParticipationStatus,
  StructuredIdentifier,
  SourceUrl,
  MeetingExtension,
  ExtensionAttribute,
} from './types/generated/meeting.js'

export * from './load/index.js'
export * from './transforms/index.js'
export * from './contacts/index.js'
export * from './search/index.js'
export * from './urn/index.js'
export * from './i18n/index.js'
export * from './body/index.js'
export * from './validate/index.js'
export * from './config/index.js'
