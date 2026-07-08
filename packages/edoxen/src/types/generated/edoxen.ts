// AUTO-GENERATED from src/schema/*.json. Do not edit by hand.

/**
 * Edoxen::Enums::SOURCE_URL_KIND.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "SourceUrlKind".
 */
export type SourceUrlKind =
  'agenda_pdf' | 'minutes_pdf' | 'decisions_pdf' | 'report_pdf' | 'register_url' | 'landing_page'
/**
 * Edoxen::Enums::DECISION_KIND.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionKind".
 */
export type DecisionKind =
  'resolution' | 'order' | 'ruling' | 'determination' | 'recommendation' | 'statement' | 'finding' | 'opinion' | 'other'
/**
 * Edoxen::Enums::DECISION_STATUS.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionStatus".
 */
export type DecisionStatus =
  'draft' | 'proposed' | 'under_consideration' | 'decided' | 'negatived' | 'withdrawn' | 'deferred'
/**
 * Edoxen::Enums::DECISION_DATE_TYPE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionDateType".
 */
export type DecisionDateType =
  'adoption' | 'drafted' | 'discussed' | 'proposed' | 'decided' | 'negatived' | 'withdrawn' | 'published' | 'effective'
/**
 * Edoxen::Enums::DECISION_RELATION_TYPE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionRelationType".
 */
export type DecisionRelationType = 'annex_of' | 'has_annex' | 'updates' | 'refines' | 'replaces' | 'considers' | 'cites'
/**
 * Edoxen::Enums::URL_KIND.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "UrlKind".
 */
export type UrlKind = 'access' | 'report'
/**
 * Consideration verb. Edoxen::Enums::CONSIDERATION_TYPE lists the
 * canonical set. The schema is permissive — adopters may use
 * body-specific verbs outside the canonical set (same rationale as
 * ActionType).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ConsiderationType".
 */
export type ConsiderationType = string
/**
 * Edoxen::Enums::APPROVAL_TYPE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ApprovalType".
 */
export type ApprovalType = 'affirmative' | 'negative'
/**
 * Edoxen::Enums::APPROVAL_DEGREE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ApprovalDegree".
 */
export type ApprovalDegree = 'unanimous' | 'majority' | 'minority'
/**
 * Action verb. Edoxen::Enums::ACTION_TYPE lists the canonical set
 * (28 values). The schema is permissive — adopters may use
 * body-specific verbs (e.g. "scopes", "directs", "establishes")
 * outside the canonical set. The canonical set is advisory; the
 * body_vocabulary mechanism (v2.1, TODO.refactor/46) will
 * eventually map body-specific verbs to canonical types.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ActionType".
 */
export type ActionType = string
/**
 * Polymorphic communication channel kind.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ContactMethodKind".
 */
export type ContactMethodKind = 'phone' | 'mobile' | 'fax' | 'email' | 'url' | 'mail' | 'pager' | 'message' | 'other'
/**
 * Polymorphic external identifier scheme for a Contact.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ContactIdentifierKind".
 */
export type ContactIdentifierKind = 'orcid' | 'isni' | 'wikidata' | 'ror' | 'ringgold' | 'github' | 'other'
/**
 * Edoxen::Enums::MOTION_STATUS.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "MotionStatus".
 */
export type MotionStatus =
  'introduced' | 'seconded' | 'debating' | 'question_put' | 'voting' | 'carried' | 'negatived' | 'withdrawn' | 'lapsed'
/**
 * Edoxen::Enums::VOTING_STATUS.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VotingStatus".
 */
export type VotingStatus = 'called' | 'in_progress' | 'decided' | 'withdrawn' | 'deferred'
/**
 * Edoxen::Enums::VOTING_METHOD.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VotingMethod".
 */
export type VotingMethod =
  | 'voice'
  | 'division'
  | 'show_of_hands'
  | 'roll_call'
  | 'electronic'
  | 'secret_ballot'
  | 'unanimous_consent'
  | 'consensus'
/**
 * Edoxen::Enums::VOTING_OUTCOME.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VotingOutcome".
 */
export type VotingOutcome = 'passed' | 'negatived' | 'tied' | 'withdrawn'
/**
 * Edoxen::Enums::VOTE_TYPE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VoteType".
 */
export type VoteType = 'affirmative' | 'negative' | 'abstain' | 'absent' | 'not_applicable'
/**
 * Edoxen::Enums::TOPIC_STATUS.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "TopicStatus".
 */
export type TopicStatus = 'open' | 'under_discussion' | 'decided' | 'deferred' | 'withdrawn'
/**
 * Edoxen::Enums::VENUE_KIND.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VenueKind".
 */
export type VenueKind = 'physical' | 'virtual'
/**
 * Edoxen::Enums::VIRTUAL_FEATURE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VirtualFeature".
 */
export type VirtualFeature = 'audio' | 'video' | 'chat' | 'phone' | 'screen' | 'feed'
/**
 * Marker — Venue with kind=physical. Wire shape is identical to Venue.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "PhysicalVenue".
 */
export type PhysicalVenue = Venue
/**
 * Marker — Venue with kind=virtual. Wire shape is identical to Venue.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VirtualVenue".
 */
export type VirtualVenue = Venue
/**
 * Edoxen::Enums::RECURRENCE_FREQ.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "RecurrenceFreq".
 */
export type RecurrenceFreq = 'secondly' | 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
/**
 * Edoxen::Enums::OFFICER_ROLE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "OfficerRole".
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
 * Edoxen::Enums::COMPONENT_KIND.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ComponentKind".
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
 * Edoxen::Enums::HOST_TYPE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "HostType".
 */
export type HostType = 'national_body' | 'liaison' | 'associate' | 'organizer'
/**
 * Edoxen::Enums::DECISION_KIND_CANONICAL — short abstract set (v2.1,
 * TODO.refactor/46). Bodies extend via `body_type` + per-dataset
 * `body_vocabulary[]`.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionKindCanonical".
 */
export type DecisionKindCanonical = 'decision' | 'recommendation' | 'statement' | 'finding' | 'other'
/**
 * Edoxen::Enums::VISIBILITY.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Visibility".
 */
export type Visibility = 'public' | 'private' | 'confidential'
/**
 * Edoxen::Enums::ATTENDANCE_ROLE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "AttendanceRole".
 */
export type AttendanceRole = 'chair' | 'required' | 'optional' | 'non_participant'
/**
 * Edoxen::Enums::ATTENDANCE_RESPONSE.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "AttendanceResponse".
 */
export type AttendanceResponse = 'pending' | 'confirmed' | 'declined' | 'tentative' | 'delegated'
/**
 * Edoxen::Enums::COMPONENT_KIND_CANONICAL — short abstract set
 * (v2.1, TODO.refactor/46).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ComponentKindCanonical".
 */
export type ComponentKindCanonical = 'deliberative' | 'working' | 'ceremonial' | 'break' | 'other'

/**
 * Schema for validating Edoxen DecisionCollection YAML files.
 *
 * Mirrors the canonical LutaML information model in
 * https://github.com/edoxen/edoxen-model/tree/main/models .
 *
 * The enum constants declared under `$defs` are the authoritative wire
 * values. `spec/edoxen/schema_enum_sync_spec.rb` asserts each one is
 * character-for-character identical to the corresponding `Edoxen::Enums::*`
 * frozen array.
 *
 * Trade-off: json_schemer's `valid_values` is not populated when an
 * `enum` is reached via `$ref`, so the validator's enum-violation
 * message degrades to "value ... is not one of: (see schema)". This
 * is documented in `Edoxen::SchemaValidator#format_message`.
 *
 */
export interface EdoxenDecisionCollectionSchema {
  metadata?: DecisionMetadata
  decisions: Decision[]
}
/**
 * Collection-level metadata (localized title, meeting date, source, source URLs, host venue).
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionMetadata".
 */
export interface DecisionMetadata {
  title?: LocalizedString[]
  date?: string
  source?: string
  source_urls?: SourceUrl[]
  city?: string
  country_code?: string
  meeting_urn?: string
  body_vocabulary?: BodyVocabularyEntry[]
  extensions?: MeetingExtension[]
}
/**
 * One language-specific value of a translatable String field.
 * `spelling` is an ISO 24229 spelling/conversion system code.
 * Always verbose — single-language data uses the same
 * `[{ spelling, value }]` shape as multi-language data.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "LocalizedString".
 */
export interface LocalizedString {
  spelling: string
  value: string
  extensions?: MeetingExtension[]
}
/**
 * Profile-specific extension. Adopters register their namespace via
 * `profile` and discriminate via `kind`. Field semantics tightened
 * v2.1 (TODO.refactor/47): `kind` is the in-profile discriminator,
 * `ref` is the URN of an external profile document, and the
 * recursive `extensions[]` slot was removed (YAGNI — use dotted
 * keys in `attributes[]` for nesting).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "MeetingExtension".
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
 * Bool/Date (v2.1 tighten, TODO.refactor/47).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ExtensionAttribute".
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
 * Per-spelling canonical source URL (e.g. one PDF per language).
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "SourceUrl".
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
 * One entry in a per-dataset body_vocabulary list. Maps a free-form
 * body_type to a short canonical value. SSOT for body_type ->
 * canonical_type resolution within the declaring collection.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "BodyVocabularyEntry".
 */
export interface BodyVocabularyEntry {
  body_type?: string
  canonical_type?: string
  definition?: string
}
/**
 * A formal Decision. v3.0: per-field Localized (every translatable
 * field carries its own spelling tag). Removed `localizations[]`.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Decision".
 */
export interface Decision {
  /**
   * @minItems 1
   */
  identifier: [StructuredIdentifier, ...StructuredIdentifier[]]
  kind?: DecisionKind
  status?: DecisionStatus
  body_type?: string
  doi?: string
  urn?: string
  agenda_item?: string
  dates?: DecisionDate[]
  categories?: string[]
  meeting?: MeetingIdentifier
  relations?: DecisionRelation[]
  urls?: Url[]
  brought_by_motions?: string[]
  about_topics?: string[]
  made_in_component?: string
  title?: LocalizedString[]
  subject?: LocalizedString[]
  message?: LocalizedString[]
  considering?: LocalizedString[]
  considerations?: Consideration[]
  approvals?: Approval[]
  actions?: Action[]
  extensions?: MeetingExtension[]
}
/**
 * An identifier (prefix + number). A Decision carries 1..* of these.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "StructuredIdentifier".
 */
export interface StructuredIdentifier {
  prefix: string
  number: string
}
/**
 * Date with semantic kind (adoption / drafted / discussed).
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionDate".
 */
export interface DecisionDate {
  date: string
  type: DecisionDateType
}
/**
 * Identifies the meeting a Decision belongs to.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "MeetingIdentifier".
 */
export interface MeetingIdentifier {
  venue?: string
  date?: string
}
/**
 * Directed relation between two decisions identified by their StructuredIdentifier.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "DecisionRelation".
 */
export interface DecisionRelation {
  source: StructuredIdentifier
  destination: StructuredIdentifier
  type: DecisionRelationType
}
/**
 * URL with a kind (access / report) and an optional format hint.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Url".
 */
export interface Url {
  kind: UrlKind
  ref: string
  format?: string
}
/**
 * The basis for a Decision: a verb + one effective date + reasoning.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Consideration".
 */
export interface Consideration {
  type: ConsiderationType
  date_effective: DecisionDate
  message: LocalizedString[]
}
/**
 * Approval record: vote type, consensus degree, date, message.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Approval".
 */
export interface Approval {
  type: ApprovalType
  degree: ApprovalDegree
  date: DecisionDate
  message?: LocalizedString[]
}
/**
 * A verb + one effective date + human-readable message.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Action".
 */
export interface Action {
  type: ActionType
  date_effective: DecisionDate
  message: LocalizedString[]
}
/**
 * Typed cross-reference between entities (v2.1, TODO.refactor/44).
 * Exactly one of `urn`, `identifier`, or `local_ref` should be set;
 * the gem's `EntityRef#valid?` enforces this in Ruby.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "EntityRef".
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
 * One language-specific value of a translatable Name field.
 * Mirrors LocalizedString but carries a structured Name.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "LocalizedName".
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
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Name".
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
 * A procedural act that brings a Decision.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Motion".
 */
export interface Motion {
  identifier?: string
  urn?: string
  text?: LocalizedString[]
  mover?: Person
  seconders?: Person[]
  status?: MotionStatus
  introduced_at?: string
  proposed_decision?: string
  resulting_decision?: string
  resulting_decision_ref?: EntityRef
  votings?: string[]
  extensions?: MeetingExtension[]
}
/**
 * A Contact that is specifically an individual human. Schema
 * duplicates Contact's properties because JSON-Schema draft-07
 * doesn't support `extends`. Same shape; semantically a subclass.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Person".
 */
export interface Person {
  ref?: string
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
 * One polymorphic communication channel — phone, email, fax, url,
 * mail, etc. `kind` discriminates the channel; `value` carries the
 * address/number; `label` is a free-form display hint ("Office",
 * "Front desk"). OCP: new channel kinds are added via the
 * ContactMethodKind enum (or `other` + extensions).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ContactMethod".
 */
export interface ContactMethod {
  kind?: ContactMethodKind
  value?: string
  label?: string
  primary?: boolean
  extensions?: MeetingExtension[]
}
/**
 * One polymorphic external identifier — ORCID, ISNI, Wikidata QID,
 * ROR, Ringgold, GitHub handle, etc. Replaces the hard-coded `orcid`
 * field. OCP: new identifier schemes are added via the
 * ContactIdentifierKind enum (or `other` + extensions).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ContactIdentifier".
 */
export interface ContactIdentifier {
  kind?: ContactIdentifierKind
  value?: string
  extensions?: MeetingExtension[]
}
/**
 * Tally for a Voting instance.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VotingCounts".
 */
export interface VotingCounts {
  ayes?: number
  noes?: number
  abstentions?: number
  absent?: number
}
/**
 * State machine for a single vote on a Motion.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Voting".
 */
export interface Voting {
  identifier?: string
  urn?: string
  on_motion?: string
  status?: VotingStatus
  voting_method?: VotingMethod
  called_by?: Person
  called_at?: string
  result_declared_at?: string
  result?: VotingOutcome
  counts?: VotingCounts
  casting_vote?: VoteRecord
  vote_records?: VoteRecord[]
  extensions?: MeetingExtension[]
}
/**
 * One vote by one person on one decision/voting.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VoteRecord".
 */
export interface VoteRecord {
  decision_ref?: string
  voting_ref?: string
  person: Person
  affiliation?: string
  vote: VoteType
  role?: string
  notes?: string
  extensions?: MeetingExtension[]
}
/**
 * Text-bearing document about a Topic. v3.0: per-field Localized.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "TopicDocument".
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
 * Non-text resource about a Topic. v3.0: per-field Localized.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "TopicAsset".
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
 * The subject of discussion at a Meeting. v3.0: per-field Localized.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Topic".
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
  extensions?: MeetingExtension[]
}
/**
 * Generic document reference.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Reference".
 */
export interface Reference {
  ref?: string
  kind?: string
  title?: LocalizedString[]
}
/**
 * Polymorphic place where a Meeting happens. `kind` discriminates
 * physical vs virtual; all fields from both subtypes live here as
 * optional siblings. v3.0: per-field Localized (name, label,
 * description, address, building, floor, room, access_notes).
 * Added `urn` (registry identity) and `ref` (reference-by-URN).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Venue".
 */
export interface Venue {
  /**
   * URN reference; if set, ignore other fields
   */
  ref?: string
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
 * BYDAY part of a recurrence. `ordinal` is null for 'every', +1 for first, -1 for last.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "RecurrenceByDay".
 */
export interface RecurrenceByDay {
  ordinal?: number
  weekday?: string
}
/**
 * Structured ISO 8601-2 §13 recurrence.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Recurrence".
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
 * VCARD-like abstract contact. v3.0: per-field Localized
 * (name, title, affiliation, address). Added `urn` (registry
 * identity) and `ref` (reference-by-URN).
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Contact".
 */
export interface Contact {
  /**
   * URN reference; if set, ignore other fields
   */
  ref?: string
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
 * A person holding a structural role in a Meeting.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "Officer".
 */
export interface Officer {
  role?: OfficerRole
  person?: Person
  term_start?: string
  term_end?: string
  extensions?: MeetingExtension[]
}
/**
 * Flat sub-event of a Meeting. v3.0: per-field Localized.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "MeetingComponent".
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
 * Parent of recurring Meeting instances. v3.0: per-field Localized.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "MeetingSeries".
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
/**
 * Typed reference to a hosting organization.
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "HostRef".
 */
export interface HostRef {
  ref: string
  type?: HostType
  role?: string
  contact?: Contact
}
/**
 * Registry of Contacts indexed by scoped URN. Members carry
 * `urn: urn:edoxen:contact:{scope}:{local-id}`; the collection's
 * `scope` MUST match the scope segment in member URNs.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "ContactCollection".
 */
export interface ContactCollection {
  scope?: string
  title?: LocalizedString[]
  contacts?: Contact[]
  extensions?: MeetingExtension[]
}
/**
 * Registry of Venues indexed by scoped URN. Mirrors ContactCollection.
 *
 *
 * This interface was referenced by `EdoxenDecisionCollectionSchema`'s JSON-Schema
 * via the `definition` "VenueCollection".
 */
export interface VenueCollection {
  scope?: string
  title?: LocalizedString[]
  venues?: Venue[]
  extensions?: MeetingExtension[]
}
