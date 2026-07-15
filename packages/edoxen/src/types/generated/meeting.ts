// AUTO-GENERATED from src/schema/*.json. Do not edit by hand.

/**
 * Schema for validating Edoxen Meeting/Agenda YAML files.
 *
 * Mirrors the canonical LutaML information model in
 * https://github.com/edoxen/edoxen-model/tree/main/models (meeting*.lutaml,
 * agenda*.lutaml, etc.).
 *
 * The root accepts either a single Meeting or a MeetingCollection.
 *
 * Enum lists in this schema are kept in lockstep with
 * Edoxen::Enums::* (Meeting side) by
 * `spec/edoxen/schema_meeting_enum_sync_spec.rb`.
 *
 */
export type EdoxenMeetingSchema = MeetingCollection | Meeting | MeetingSeries
/**
 * Edoxen::Enums::MEETING_TYPE.
 */
export type MeetingType =
  | 'plenary'
  | 'working_group'
  | 'task_group'
  | 'ad_hoc'
  | 'joint'
  | 'general_assembly'
  | 'committee'
  | 'subcommittee'
  | 'conference'
  | 'workshop'
  | 'seminar'
  | 'webinar'
  | 'hearing'
  | 'markup'
  | 'board_meeting'
  | 'annual_general_meeting'
  | 'other'
/**
 * Edoxen::Enums::MEETING_STATUS.
 */
export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled'
/**
 * Edoxen::Enums::VISIBILITY.
 */
export type Visibility = 'public' | 'private' | 'confidential'
/**
 * Edoxen::Enums::RECURRENCE_FREQ.
 */
export type RecurrenceFreq = 'secondly' | 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
/**
 * Edoxen::Enums::VENUE_KIND.
 */
export type VenueKind = 'physical' | 'virtual'
/**
 * Polymorphic communication channel kind.
 */
export type ContactMethodKind = 'phone' | 'mobile' | 'fax' | 'email' | 'url' | 'mail' | 'pager' | 'message' | 'other'
/**
 * Edoxen::Enums::VIRTUAL_FEATURE.
 */
export type VirtualFeature = 'audio' | 'video' | 'chat' | 'phone' | 'screen' | 'feed'
/**
 * Edoxen::Enums::OFFICER_ROLE.
 */
export type OfficerRole =
  | 'chair'
  | 'vice_chair'
  | 'deputy_chair'
  | 'secretary'
  | 'treasurer'
  | 'parliamentarian'
  | 'presiding_officer'
  | 'sergeant_at_arms'
  | 'other'
/**
 * Polymorphic external identifier scheme for a Contact.
 */
export type ContactIdentifierKind = 'orcid' | 'isni' | 'wikidata' | 'ror' | 'ringgold' | 'github' | 'other'
/**
 * Edoxen::Enums::HOST_TYPE.
 */
export type HostType = 'national_body' | 'liaison' | 'associate' | 'organizer'
/**
 * Edoxen::Enums::SOURCE_URL_KIND.
 */
export type SourceUrlKind =
  'agenda_pdf' | 'minutes_pdf' | 'decisions_pdf' | 'report_pdf' | 'register_url' | 'landing_page'
/**
 * Edoxen::Enums::AGENDA_STATUS.
 */
export type AgendaStatus = 'draft' | 'final' | 'amended' | 'cancelled' | 'superseded'
/**
 * Edoxen::Enums::AGENDA_ITEM_KIND.
 */
export type AgendaItemKind = 'numbered' | 'unnumbered' | 'header' | 'opening' | 'closing' | 'aob'
/**
 * Edoxen::Enums::AGENDA_ITEM_OUTCOME.
 */
export type AgendaItemOutcome =
  'discussed' | 'resolved' | 'deferred' | 'adopted' | 'withdrawn' | 'carried' | 'negatived'
/**
 * Edoxen::Enums::TOPIC_STATUS.
 */
export type TopicStatus = 'open' | 'under_discussion' | 'decided' | 'deferred' | 'withdrawn'
/**
 * Discriminator for the three BS 0:2006 statement types. Adding a
 * new kind is a one-line enum extension; the Statement model
 * itself never needs to change (OCP).
 *
 */
export type StatementKind = 'statement' | 'comment' | 'standpoint'
/**
 * Discriminator for the two BS 0:2006 declaration types
 * (conflict of interest, IPR).
 *
 */
export type DeclarationKind = 'conflict_of_interest' | 'ipr'
/**
 * Edoxen::Enums::COMPONENT_KIND.
 */
export type ComponentKind =
  | 'track'
  | 'session'
  | 'debate'
  | 'breakout'
  | 'bof'
  | 'plenary_session'
  | 'working_group_session'
  | 'committee_of_the_whole'
  | 'keynote'
  | 'address'
  | 'statement'
  | 'question_time'
  | 'opening'
  | 'closing'
  | 'break'
  | 'reception'
  | 'registration'
  | 'networking'
  | 'other'
/**
 * Edoxen::Enums::PARTICIPATION_STATUS.
 */
export type ParticipationStatus = 'present' | 'absent' | 'apologies' | 'observer' | 'excused'
/**
 * Edoxen::Enums::ATTENDANCE_ROLE.
 */
export type AttendanceRole = 'chair' | 'required' | 'optional' | 'non_participant'
/**
 * Edoxen::Enums::ATTENDANCE_RESPONSE.
 */
export type AttendanceResponse = 'pending' | 'confirmed' | 'declined' | 'tentative' | 'delegated'
/**
 * Edoxen::Enums::MEETING_RELATION_TYPE.
 */
export type MeetingRelationType =
  | 'continues_from'
  | 'continues_to'
  | 'joint_with'
  | 'supersedes'
  | 'superseded_by'
  | 'rescheduled_from'
  | 'rescheduled_to'
  | 'parent_of'
  | 'child_of'
  | 'sibling_of'
  | 'depends_on'
  | 'finish_to_start'
  | 'finish_to_finish'
  | 'start_to_start'
  | 'start_to_finish'

/**
 * Top-level wrapper for many Meetings in one file.
 */
export interface MeetingCollection {
  metadata?: MeetingCollectionMetadata
  meetings: Meeting[]
}
/**
 * Display-level metadata for a MeetingCollection. 1.0: per-field Localized.
 */
export interface MeetingCollectionMetadata {
  title?: LocalizedString[]
  source?: string
  body_vocabulary?: BodyVocabularyEntry[]
}
/**
 * One language-specific value of a translatable String field.
 * `spelling` is an ISO 24229 spelling/conversion system code.
 * Always verbose — single-language data uses the same
 * `[{ spelling, value }]` shape as multi-language data.
 *
 */
export interface LocalizedString {
  spelling: string
  value: string
  extensions?: MeetingExtension[]
}
/**
 * Profile-specific extension. Adopters register their namespace via
 * `profile` and discriminate via `kind`. Field semantics tightened
 * 1.0 (TODO.refactor/1.0-design): `kind` is the in-profile discriminator,
 * `ref` is the URN of an external profile document, and the
 * recursive `extensions[]` slot was removed (YAGNI — use dotted
 * keys in `attributes[]` for nesting).
 *
 */
export interface MeetingExtension {
  profile?: string
  kind?: string
  ref?: string
  attributes?: ExtensionAttribute[]
}
/**
 * One typed key/value pair within a MeetingExtension. Polymorphic on
 * value type so consumers don't re-parse strings back into Int/Float/
 * Bool/Date (1.0 tighten, TODO.refactor/1.0-design).
 *
 */
export interface ExtensionAttribute {
  key?: string
  type?: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'datetime'
  value?: string
  intValue?: number
  floatValue?: number
  booleanValue?: boolean
  dateValue?: string
  dateTimeValue?: string
}
/**
 * One entry in a per-dataset body_vocabulary list. Maps a free-form
 * body_type to a short canonical value. SSOT for body_type ->
 * canonical_type resolution within the declaring collection.
 *
 */
export interface BodyVocabularyEntry {
  body_type?: string
  canonical_type?: string
  definition?: string
}
/**
 * A single Meeting (event). 1.0: per-field Localized.
 */
export interface Meeting {
  /**
   * @minItems 1
   */
  identifier: [StructuredIdentifier, ...StructuredIdentifier[]]
  urn?: string
  ordinal?: number
  series_ref?: string
  type: MeetingType
  status?: MeetingStatus
  visibility?: Visibility
  body_type?: string
  title?: LocalizedString[]
  scheduled_date_range?: DateRange
  occurred_date_range?: DateTimeRange
  recurrence?: Recurrence
  venues?: Venue[]
  general_area?: LocalizedString[]
  practical_info?: LocalizedString[]
  city?: string
  country_code?: string
  committee?: Body
  committee_group?: Body
  officers?: Officer[]
  hosts?: HostRef[]
  source_urls?: SourceUrl[]
  landing_url?: string
  registration_url?: string
  note?: LocalizedString[]
  contact?: Contact
  contacts?: Contact[]
  bodies?: Body[]
  agenda?: Agenda
  components?: MeetingComponent[]
  deadlines?: Deadline[]
  attendance?: Attendance[]
  minutes?: Minutes[]
  declarations?: Declaration[]
  decisions?: StructuredIdentifier[]
  motions?: StructuredIdentifier[]
  votings?: StructuredIdentifier[]
  relations?: MeetingRelation[]
  extensions?: MeetingExtension[]
}
/**
 * An identifier (prefix + number). A Decision carries 1..* of these.
 */
export interface StructuredIdentifier {
  prefix: string
  number: string
}
/**
 * Start + end date pair for multi-day meetings.
 */
export interface DateRange {
  start?: string
  end?: string
}
/**
 * Start + end pair with sub-day precision. Parallel to DateRange;
 * use when day granularity is insufficient (e.g. a meeting that
 * ran 09:00–11:30).
 *
 */
export interface DateTimeRange {
  start?: string
  end?: string
}
/**
 * Structured ISO 8601-2 §13 recurrence.
 */
export interface Recurrence {
  freq?: RecurrenceFreq
  interval?: number
  count?: number
  until?: string
  by_day?: RecurrenceByDay[]
  by_month_day?: number[]
  by_month?: number[]
  by_week_no?: number[]
  by_year_day?: number[]
  by_hour?: number[]
  by_minute?: number[]
  by_second?: number[]
  by_set_pos?: number[]
  week_start?: string
  extensions?: MeetingExtension[]
}
/**
 * BYDAY part of a recurrence. `ordinal` is null for 'every', +1 for first, -1 for last.
 */
export interface RecurrenceByDay {
  ordinal?: number
  weekday?: string
}
/**
 * Polymorphic place where a Meeting happens. `kind` discriminates
 * physical vs virtual; all fields from both subtypes live here as
 * optional siblings. 1.0: per-field Localized (name, label,
 * description, address, building, floor, room, access_notes).
 * Added `urn` (registry identity) and `ref` (reference-by-URN).
 *
 */
export interface Venue {
  ref?: string
  local_ref?: string
  urn?: string
  kind?: VenueKind
  name?: LocalizedString[]
  label?: LocalizedString[]
  description?: LocalizedString[]
  capacity?: number
  url?: string
  contact_methods?: ContactMethod[]
  unlocode?: string
  iata_code?: string
  address?: LocalizedString[]
  city?: string
  country_code?: string
  lat?: number
  lon?: number
  building?: LocalizedString[]
  floor?: LocalizedString[]
  room?: LocalizedString[]
  access_notes?: LocalizedString[]
  uri?: string
  features?: VirtualFeature[]
  passcode?: string
  meeting_id?: string
  dial_in_numbers?: string[]
  waiting_room?: boolean
  registration_required?: boolean
  extensions?: MeetingExtension[]
}
/**
 * One polymorphic communication channel — phone, email, fax, url,
 * mail, etc. `kind` discriminates the channel; `value` carries the
 * address/number; `label` is a free-form display hint ("Office",
 * "Front desk"). OCP: new channel kinds are added via the
 * ContactMethodKind enum (or `other` + extensions).
 *
 */
export interface ContactMethod {
  kind?: ContactMethodKind
  value?: string
  label?: string
  primary?: boolean
  extensions?: MeetingExtension[]
}
/**
 * A committee, subcommittee, working group, or other organised body.
 * Three-tier entity resolution (ref / local_ref / inline).
 *
 */
export interface Body {
  ref?: string
  local_ref?: string
  code?: string
  name?: LocalizedString[]
  kind?: string
  parent_ref?: EntityRef
  extensions?: MeetingExtension[]
}
/**
 * Typed cross-reference between entities (1.0, TODO.refactor/1.0-design).
 * Exactly one of `urn`, `identifier`, or `local_ref` should be set;
 * the gem's `EntityRef#valid?` enforces this in Ruby.
 *
 */
export interface EntityRef {
  urn?: string
  identifier?: StructuredIdentifier
  local_ref?: string
  kind?: string
  role?: string
  note?: string
}
/**
 * A person holding a structural role in a Meeting.
 */
export interface Officer {
  role?: OfficerRole
  person?: Person
  term_start?: string
  term_end?: string
  extensions?: MeetingExtension[]
}
/**
 * A Contact that is specifically an individual human. Schema
 * duplicates Contact's properties because JSON-Schema draft-07
 * doesn't support `extends`. Same shape; semantically a subclass.
 *
 */
export interface Person {
  ref?: string
  local_ref?: string
  urn?: string
  name?: LocalizedName[]
  kind?: string
  role?: string
  title?: LocalizedString[]
  affiliation?: LocalizedString[]
  contact_methods?: ContactMethod[]
  identifiers?: ContactIdentifier[]
  address?: LocalizedString[]
  extensions?: MeetingExtension[]
}
/**
 * One language-specific value of a translatable Name field.
 * Mirrors LocalizedString but carries a structured Name.
 *
 */
export interface LocalizedName {
  spelling: string
  value: Name
  extensions?: MeetingExtension[]
}
/**
 * Structured personal/organisational name (VCARD RFC 6350
 * conventions). `formatted` is the pre-built display string (FN);
 * the structured components (N) are stored separately for sorting,
 * indexing, or locale-aware rendering.
 *
 */
export interface Name {
  formatted?: string
  family?: string
  given?: string
  additional?: string
  prefix?: string
  suffix?: string
  extensions?: MeetingExtension[]
}
/**
 * One polymorphic external identifier — ORCID, ISNI, Wikidata QID,
 * ROR, Ringgold, GitHub handle, etc. Replaces the hard-coded `orcid`
 * field. OCP: new identifier schemes are added via the
 * ContactIdentifierKind enum (or `other` + extensions).
 *
 */
export interface ContactIdentifier {
  kind?: ContactIdentifierKind
  value?: string
  extensions?: MeetingExtension[]
}
/**
 * Typed reference to a hosting organization.
 */
export interface HostRef {
  ref: string
  type?: HostType
  role?: string
  contact?: Contact
}
/**
 * VCARD-like abstract contact. 1.0: per-field Localized
 * (name, title, affiliation, address). Added `urn` (registry
 * identity) and `ref` (reference-by-URN).
 *
 */
export interface Contact {
  ref?: string
  local_ref?: string
  urn?: string
  name?: LocalizedName[]
  kind?: string
  role?: string
  title?: LocalizedString[]
  affiliation?: LocalizedString[]
  contact_methods?: ContactMethod[]
  identifiers?: ContactIdentifier[]
  address?: LocalizedString[]
  extensions?: MeetingExtension[]
}
/**
 * Per-spelling canonical source URL (e.g. one PDF per language).
 */
export interface SourceUrl {
  ref: string
  format?: string
  /**
   * ISO 24229 spelling/conversion system code
   */
  spelling?: string
  kind?: SourceUrlKind
}
/**
 * The business-order document of a Meeting. Versioned independently
 * of the Meeting via the `status` field (draft, final, amended).
 *
 */
export interface Agenda {
  identifier?: StructuredIdentifier[]
  status?: AgendaStatus
  source_doc?: string
  items?: AgendaItem[]
  extensions?: MeetingExtension[]
}
/**
 * One entry on an Agenda. 1.0: per-field Localized.
 */
export interface AgendaItem {
  label?: string
  kind?: AgendaItemKind
  title?: LocalizedString[]
  description?: LocalizedString[]
  references?: Reference[]
  outcome?: AgendaItemOutcome
  decision_ref?: string
  topics?: Topic[]
  components?: string[]
  extensions?: MeetingExtension[]
}
/**
 * Generic document reference.
 */
export interface Reference {
  ref?: string
  kind?: string
  title?: LocalizedString[]
}
/**
 * The subject of discussion at a Meeting. 1.0: per-field Localized.
 */
export interface Topic {
  identifier?: string
  urn?: string
  title?: LocalizedString[]
  description?: LocalizedString[]
  status?: TopicStatus
  resumption_of?: string
  documents?: TopicDocument[]
  assets?: TopicAsset[]
  references?: Reference[]
  motions?: string[]
  decisions?: string[]
  statements?: Statement[]
  declarations?: Declaration[]
  extensions?: MeetingExtension[]
}
/**
 * Text-bearing document about a Topic. 1.0: per-field Localized.
 */
export interface TopicDocument {
  identifier?: string
  title?: LocalizedString[]
  version?: string
  status?: string
  url?: string
  format?: string
  /**
   * ISO 24229 spelling/conversion system code
   */
  spelling?: string
  extensions?: MeetingExtension[]
}
/**
 * Non-text resource about a Topic. 1.0: per-field Localized.
 */
export interface TopicAsset {
  identifier?: string
  title?: LocalizedString[]
  kind?: string
  url?: string
  format?: string
  extensions?: MeetingExtension[]
}
/**
 * One remark made by one or more meeting members on a topic or a
 * minutes section. Per-field Localized description; party is a
 * list of Person references. The `kind` discriminator separates
 * the three BS 0:2006 statement types.
 *
 */
export interface Statement {
  kind?: StatementKind
  description?: LocalizedString[]
  party?: Person[]
  extensions?: MeetingExtension[]
}
/**
 * A formal declaration (conflict of interest or IPR) made by one
 * or more meeting members. IPR-specific fields (`ipr_subject_ref`,
 * `ipr_target_ref`) are populated only when `kind == "ipr"`.
 *
 */
export interface Declaration {
  kind?: DeclarationKind
  description?: LocalizedString[]
  party?: Person[]
  ipr_subject_ref?: EntityRef
  ipr_target_ref?: EntityRef
  extensions?: MeetingExtension[]
}
/**
 * Flat sub-event of a Meeting. 1.0: per-field Localized.
 */
export interface MeetingComponent {
  identifier?: string
  urn?: string
  kind?: ComponentKind
  body_type?: string
  title?: LocalizedString[]
  description?: LocalizedString[]
  starts_at?: string
  ends_at?: string
  time_label?: LocalizedString[]
  venue_refs?: string[]
  officers?: Officer[]
  agenda_ref?: string
  minutes_ref?: string
  attendance_refs?: string[]
  extensions?: MeetingExtension[]
}
/**
 * A time-bound requirement. 1.0: per-field Localized.
 */
export interface Deadline {
  date: string
  description?: LocalizedString[]
}
/**
 * One attendance record per person at a Meeting.
 */
export interface Attendance {
  person: Person
  status: ParticipationStatus
  role?: AttendanceRole
  response?: AttendanceResponse
  affiliation?: string
  proxy_for?: Person
  notes?: string
  extensions?: MeetingExtension[]
}
/**
 * The narrative record of a Meeting. 1.0: per-document language_code
 * + script replaced by a single `spelling` (ISO 24229).
 *
 */
export interface Minutes {
  identifier?: StructuredIdentifier[]
  urn?: string
  /**
   * ISO 24229 spelling/conversion system code
   */
  spelling?: string
  source_doc?: string
  source_pages?: string
  sections?: MinutesSection[]
}
/**
 * One section of a Meeting's minutes — typically tied to an agenda item by `number`. 1.0: per-field Localized.
 */
export interface MinutesSection {
  number?: string
  title?: LocalizedString[]
  narrative?: LocalizedString[]
  page_start?: number
  page_end?: number
  references?: Reference[]
  statements?: Statement[]
  /**
   * URN back-reference to the Topic this section records.
   * Optional; formalises the convention that
   * `MinutesSection#number` matches `AgendaItem#label`.
   *
   */
  topic_ref?: string
}
/**
 * Directed link between two meetings.
 */
export interface MeetingRelation {
  source: StructuredIdentifier
  destination: StructuredIdentifier
  type: MeetingRelationType
}
/**
 * Parent of recurring Meeting instances. 1.0: per-field Localized.
 */
export interface MeetingSeries {
  identifier?: StructuredIdentifier[]
  urn?: string
  name?: LocalizedString[]
  description?: LocalizedString[]
  recurrence?: Recurrence
  term?: string
  contact?: Contact
  hosts?: HostRef[]
  kind?: string
  meeting_refs?: string[]
  extensions?: MeetingExtension[]
  body_type?: string
}
