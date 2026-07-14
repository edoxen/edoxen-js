// AUTO-GENERATED from src/schema/*.json. Do not edit by hand.

/**
 * Schema for validating Edoxen decision-side YAML files.
 *
 * Accepts three top-level document kinds via `oneOf`:
 *
 *   * `DecisionCollection` — the formal outcomes adopted by a Meeting.
 *   * `ContactCollection` — a scoped-URN registry of Contacts.
 *   * `VenueCollection`  — a scoped-URN registry of Venues.
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
export type EdoxenDecisionCollectionSchema = DecisionCollection | ContactCollection | VenueCollection
/**
 * Edoxen::Enums::SOURCE_URL_KIND.
 */
export type SourceUrlKind =
  'agenda_pdf' | 'minutes_pdf' | 'decisions_pdf' | 'report_pdf' | 'register_url' | 'landing_page'
/**
 * Edoxen::Enums::DECISION_KIND.
 */
export type DecisionKind =
  'resolution' | 'order' | 'ruling' | 'determination' | 'recommendation' | 'statement' | 'finding' | 'opinion' | 'other'
/**
 * Edoxen::Enums::DECISION_STATUS.
 */
export type DecisionStatus =
  'draft' | 'proposed' | 'under_consideration' | 'decided' | 'negatived' | 'withdrawn' | 'deferred'
/**
 * Edoxen::Enums::DECISION_DATE_TYPE.
 */
export type DecisionDateType =
  'adoption' | 'drafted' | 'discussed' | 'proposed' | 'decided' | 'negatived' | 'withdrawn' | 'published' | 'effective'
/**
 * Edoxen::Enums::DECISION_RELATION_TYPE.
 */
export type DecisionRelationType = 'annex_of' | 'has_annex' | 'updates' | 'refines' | 'replaces' | 'considers' | 'cites'
/**
 * Edoxen::Enums::URL_KIND.
 */
export type UrlKind = 'access' | 'report'
/**
 * Consideration verb. Edoxen::Enums::CONSIDERATION_TYPE lists the
 * canonical set. The schema is permissive — adopters may use
 * body-specific verbs outside the canonical set (same rationale as
 * ActionType).
 *
 */
export type ConsiderationType = string
/**
 * Edoxen::Enums::APPROVAL_TYPE.
 */
export type ApprovalType = 'affirmative' | 'negative'
/**
 * Edoxen::Enums::APPROVAL_DEGREE.
 */
export type ApprovalDegree = 'unanimous' | 'majority' | 'minority'
/**
 * Action verb. Edoxen::Enums::ACTION_TYPE lists the canonical set
 * (28 values). The schema is permissive — adopters may use
 * body-specific verbs (e.g. "scopes", "directs", "establishes")
 * outside the canonical set. The canonical set is advisory; the
 * body_vocabulary mechanism (1.0, TODO.refactor/1.0-design) will
 * eventually map body-specific verbs to canonical types.
 *
 */
export type ActionType = string
/**
 * Polymorphic communication channel kind.
 */
export type ContactMethodKind = 'phone' | 'mobile' | 'fax' | 'email' | 'url' | 'mail' | 'pager' | 'message' | 'other'
/**
 * Polymorphic external identifier scheme for a Contact.
 */
export type ContactIdentifierKind = 'orcid' | 'isni' | 'wikidata' | 'ror' | 'ringgold' | 'github' | 'other'
/**
 * Edoxen::Enums::VENUE_KIND.
 */
export type VenueKind = 'physical' | 'virtual'
/**
 * Edoxen::Enums::VIRTUAL_FEATURE.
 */
export type VirtualFeature = 'audio' | 'video' | 'chat' | 'phone' | 'screen' | 'feed'

/**
 * Top-level container for a published decision collection: metadata
 * plus the list of decisions.
 *
 */
export interface DecisionCollection {
  metadata?: DecisionMetadata
  decisions: Decision[]
}
/**
 * Collection-level metadata (localized title, meeting date, source, source URLs, host venue).
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
 * A formal Decision. 1.0: per-field Localized (every translatable
 * field carries its own spelling tag). Removed `localizations[]`.
 *
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
 */
export interface StructuredIdentifier {
  prefix: string
  number: string
}
/**
 * Date with semantic kind (adoption / drafted / discussed).
 */
export interface DecisionDate {
  date: string
  type: DecisionDateType
}
/**
 * Identifies the meeting a Decision belongs to.
 */
export interface MeetingIdentifier {
  venue?: string
  date?: string
}
/**
 * Directed relation between two decisions identified by their StructuredIdentifier.
 */
export interface DecisionRelation {
  source: StructuredIdentifier
  destination: StructuredIdentifier
  type: DecisionRelationType
}
/**
 * URL with a kind (access / report) and an optional format hint.
 */
export interface Url {
  kind: UrlKind
  ref: string
  format?: string
}
/**
 * The basis for a Decision: a verb + one effective date + reasoning.
 */
export interface Consideration {
  type: ConsiderationType
  date_effective: DecisionDate
  message: LocalizedString[]
}
/**
 * Approval record: vote type, consensus degree, date, message.
 */
export interface Approval {
  type: ApprovalType
  degree: ApprovalDegree
  date: DecisionDate
  message?: LocalizedString[]
}
/**
 * A verb + one effective date + human-readable message.
 */
export interface Action {
  type: ActionType
  date_effective: DecisionDate
  message: LocalizedString[]
}
/**
 * Registry of Contacts indexed by scoped URN. Members carry
 * `urn: urn:edoxen:contact:{scope}:{local-id}`; the collection's
 * `scope` MUST match the scope segment in member URNs.
 *
 */
export interface ContactCollection {
  scope?: string
  title?: LocalizedString[]
  contacts?: Contact[]
  extensions?: MeetingExtension[]
}
/**
 * VCARD-like abstract contact. 1.0: per-field Localized
 * (name, title, affiliation, address). Added `urn` (registry
 * identity) and `ref` (reference-by-URN).
 *
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
 * Registry of Venues indexed by scoped URN. Mirrors ContactCollection.
 *
 */
export interface VenueCollection {
  scope?: string
  title?: LocalizedString[]
  venues?: Venue[]
  extensions?: MeetingExtension[]
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
