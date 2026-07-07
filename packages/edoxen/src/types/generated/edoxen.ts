// AUTO-GENERATED from src/schema/*.json. Do not edit by hand.

/**
 * Consideration verb. Edoxen::Enums::CONSIDERATION_TYPE lists the
 * canonical set. The schema is permissive — adopters may use
 * body-specific verbs outside the canonical set (same rationale as
 * ActionType).
 *
 */
export type ConsiderationType = string
/**
 * Edoxen::Enums::DECISION_DATE_TYPE.
 */
export type DecisionDateType =
  'adoption' | 'drafted' | 'discussed' | 'proposed' | 'decided' | 'negatived' | 'withdrawn' | 'published' | 'effective'
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
 * body_vocabulary mechanism (v2.1, TODO.refactor/46) will
 * eventually map body-specific verbs to canonical types.
 *
 */
export type ActionType = string
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
 * Edoxen::Enums::DECISION_RELATION_TYPE.
 */
export type DecisionRelationType = 'annex_of' | 'has_annex' | 'updates' | 'refines' | 'replaces' | 'considers' | 'cites'
/**
 * Edoxen::Enums::URL_KIND.
 */
export type UrlKind = 'access' | 'report'

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
 * Collection-level metadata (title, meeting date, source, source URLs, host venue).
 */
export interface DecisionMetadata {
  title?: string
  title_localized?: Localization[]
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
 * A monolingual rendering of a Decision. Mirrors the glossarist
 * LocalizedConcept pattern: language-agnostic fields live on the
 * parent Decision; per-language content lives here.
 *
 */
export interface Localization {
  language_code: string
  script?: string
  title?: string
  subject?: string
  message?: string
  considering?: string
  considerations?: Consideration[]
  approvals?: Approval[]
  actions?: Action[]
}
/**
 * The basis for a Decision: a verb + one effective date + reasoning.
 */
export interface Consideration {
  type: ConsiderationType
  date_effective: DecisionDate
  message: string
}
/**
 * Date with semantic kind (adoption / drafted / discussed).
 */
export interface DecisionDate {
  date: string
  type: DecisionDateType
}
/**
 * Approval record: vote type, consensus degree, date, message.
 */
export interface Approval {
  type: ApprovalType
  degree: ApprovalDegree
  date: DecisionDate
  message?: string
}
/**
 * A verb + one effective date + human-readable message.
 */
export interface Action {
  type: ActionType
  date_effective: DecisionDate
  message: string
}
/**
 * Per-language canonical source URL (e.g. one PDF per language).
 */
export interface SourceUrl {
  ref: string
  format?: string
  language_code?: string
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
 * Profile-specific extension. Adopters register their namespace via
 * `profile` and discriminate via `kind`. Field semantics tightened
 * v2.1 (TODO.refactor/47): `kind` is the in-profile discriminator,
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
 * Bool/Date (v2.1 tighten, TODO.refactor/47).
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
 * A formal Decision. Language-agnostic admin fields live here;
 * every translatable field is wrapped inside `localizations[]`.
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
  /**
   * @minItems 1
   */
  localizations: [Localization, ...Localization[]]
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
