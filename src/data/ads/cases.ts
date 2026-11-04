/**
 * Case studies for the ads niche: the home cards and the /work/<slug>/ pages.
 *
 * decisions.md › ads › Case studies to feature: "Any account you automated"; "Tracking fix";
 * "Offline conversions (Lead Drift / farazahmad.dev)"; "Anonymized teardown ('6 rules every
 * account should run')". Real numbers per case: OPEN. So:
 *  - offline-conversions uses verified facts only (decisions.md › funnels/ghl and
 *    docs/research/ai-local.md): every lead stored in MongoDB first, then sent to GoHighLevel
 *    through its API; landing page, referrer and UTM source/medium/campaign captured at first
 *    touch, stored with every lead, mapped onto GoHighLevel custom fields; Lead Drift runs in
 *    production on MongoDB. The upload of outcomes back to ad platforms is NOT documented as
 *    built, so it is framed as the step built on top of that data, with a TODO chip.
 *  - six-rules is an EXAMPLE teardown, labelled illustrative everywhere, describing method.
 *  - the two client cases have no material yet: visible placeholders (PLACEHOLDERS), no page.
 *
 * offline-conversions describes the owner's own lead pipeline, so it is built from the shared
 * registry (src/person/projects.ts): it needs the `lead-pipeline` project, and its Lead Drift
 * line also needs `lead-drift` to be live. A person without `lead-pipeline` gets no such case
 * (Example mode): no page, no OG image, no sitemap entry, and the home grid gets one more dashed
 * slot (OWN_BUILD_SLOT) so its rows stay full. six-rules is niche content and always present.
 */
import type { ProjectId } from '../../person/projects';
import { exampleCase, fromProject, getProject, present, slotsToFill } from '../../person/case-helpers';
import { withNameSuffix } from '../../lib/shared/seo-title';
import { BRAND_COMPANY, MAIN_SITE_URL, PERSON_NAME } from './site';

/** The registry projects this niche shows, in card order. */
export const NICHE_PROJECTS = ['lead-pipeline', 'lead-drift'] as const satisfies readonly ProjectId[];

/** Every slug this niche can have (the type); CASE_SLUGS lists the ones present. */
export type CaseSlug = 'offline-conversions' | 'six-rules';

export interface FlowStep {
  readonly label: string;
  /** A step that is not documented as built yet: drawn dashed, with a TODO. */
  readonly todo?: boolean;
}

export interface RuleSpec {
  readonly if: string;
  readonly for?: string;
  readonly then: string;
}

export interface AdsCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** True for an illustrative case: shown with an "Example" label everywhere. */
  readonly example: boolean;
  readonly flow: readonly FlowStep[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string; readonly rule?: RuleSpec; readonly todo?: string }[];
  readonly runsNow: { readonly label: string; readonly text: string };
  /** Something the owner still has to supply (rendered as a dashed chip). */
  readonly pending: readonly string[];
  readonly seo: { readonly title: string; readonly description: string };
}

/** The host the person's own lead pipeline runs on (their main site). */
const siteHost = new URL(MAIN_SITE_URL).host;

/** Lead Drift, only when the person has it AND it is confirmed live (the fact says it runs in production). */
const leadDrift = ((p) => (p?.live ? p : undefined))(getProject('lead-drift'));

/** `<core> | <name>`, falling back to a shorter suffix when a long name would break the 60-char limit. */
const caseTitle = (core: string): string => withNameSuffix(core, PERSON_NAME);

/** The person's lead pipeline from the registry, with the ads angle (offline conversions). */
const offlineConversions = fromProject(
  'lead-pipeline',
  (): AdsCase => ({
    id: 'offline-conversions',
    name: 'Offline conversions, from the lead up',
    kicker: leadDrift ? `Own build · ${leadDrift.name} / ${siteHost}` : `Own build · ${siteHost}`,
    title: 'Every lead keeps where it came from, so the ad platforms can be told what happened next.',
    text: `An offline-conversion upload is only as good as the lead record behind it. On ${siteHost} every lead is saved to MongoDB first, with the landing page, referrer and UTMs from its first visit, then sent to GoHighLevel through its API with that source on the contact.`,
    status: 'Lead pipeline live',
    example: false,
    flow: [
      { label: 'First visit: landing page, referrer, UTMs' },
      { label: 'Form posted with that first touch' },
      { label: 'Saved to MongoDB first' },
      { label: 'Sent to GoHighLevel through its API' },
      { label: 'Source mapped onto custom fields' },
      { label: 'Outcome uploaded to the ad platform', todo: true },
    ],
    facts: [
      'Landing page, referrer and UTM source, medium and campaign captured at first touch',
      'Stored with every lead in MongoDB before anything else',
      'Sent to GoHighLevel through its API, mapped onto custom fields',
      ...(leadDrift ? [`${leadDrift.name}, ${leadDrift.madeBy ?? BRAND_COMPANY}’s own growth engine, runs in production with MongoDB as its data layer`] : []),
    ],
    problem: {
      title: 'The ad platform never hears what happened next',
      text: 'A lead form tells the platform that someone filled it in. It doesn’t say which of those people became a call, a client, or nothing. Without that, bidding optimises for form fills, good and bad alike. Sending the outcome back needs every lead to keep its source from the very first visit.',
    },
    built: [
      {
        title: 'Source captured at first touch',
        text: 'The landing page, referrer and UTM source, medium and campaign are recorded on the visitor’s first page view and sent with the form, so a lead keeps its origin even if they browse for a while first.',
      },
      {
        title: 'Stored before anything else',
        text: 'The form posts to my own API, which writes the lead and its first touch to MongoDB first. Whatever happens next, the record exists.',
      },
      {
        title: 'Handed to the CRM, already labelled',
        text: 'The lead is then sent to GoHighLevel through its API, with the first-touch source mapped onto custom fields, so every contact says where it came from.',
      },
      {
        title: 'Then: outcomes back to the platforms',
        text: 'This is the step an offline-conversion upload adds on top: when a lead becomes a client in the CRM, that outcome is sent back to the ad platform with the source the lead arrived with, so bidding learns from clients, not form fills.',
        todo: 'TODO · Confirm whether outcomes are uploaded to Google / Meta yet, and from which data',
      },
    ],
    runsNow: {
      label: 'Where it is now',
      text: `Capture, storage and the CRM hand-off run on ${siteHost}. The upload back to ad platforms is what the tracking setup builds on top of a pipeline like this.`,
    },
    pending: [
      'TODO · Match rate and conversions uploaded, once the upload runs',
      'TODO · Confirm the custom fields used in GoHighLevel',
      'TODO · Confirm leads from these niche sites go through the same pipeline',
    ],
    seo: {
      title: caseTitle('Offline Conversions: Lead Source to CRM'),
      description:
        'Every lead saved to MongoDB with its first-visit landing page, referrer and UTMs, then sent to GoHighLevel: the base offline conversions need.',
    },
  }),
);

/** Niche content, not a project: an illustrative teardown, labelled as such everywhere. */
const sixRules = exampleCase<AdsCase>({
  id: 'six-rules',
  name: '6 rules every account should run',
  kicker: 'Teardown · anonymized',
  title: 'The guards I’d put on any account first, and what each one catches.',
  text: 'An anonymized, illustrative teardown, not a client account: six rules written the way they run, each with the failure it exists for and what keeps it from doing harm.',
  status: null,
  example: true,
  flow: [
    { label: 'CPA guard' },
    { label: 'Budget cap' },
    { label: 'Zero-conversion spend' },
    { label: 'Tracking check' },
    { label: 'Spend anomaly' },
    { label: 'Creative fatigue' },
  ],
  facts: [
    'Each rule is one IF / FOR / THEN sentence you can read',
    'Alert-only first; rules act once their thresholds prove out',
    'Every action logged, capped and reversible',
  ],
  problem: {
    title: 'Most waste happens between two reports',
    text: 'Nobody decides to waste budget. An ad set drifts for a week, a pixel breaks on a Friday, a budget gets an extra zero. Each one is obvious in hindsight and invisible in the moment, because nobody reads the account every few hours. Rules do.',
  },
  built: [
    {
      title: 'CPA guard',
      text: 'Catches slow drift: an ad set that crept over target and stayed there. It waits for a minimum number of conversions before judging, so a quiet morning doesn’t pause a good ad set.',
      rule: { if: 'CPA > target', for: '2 days', then: 'pause ad set' },
    },
    {
      title: 'Budget cap',
      text: 'Catches runaway days. The cap is yours, not the platform’s pacing; the rule only enforces it.',
      rule: { if: 'spend ≥ daily cap', then: 'stop for the day' },
    },
    {
      title: 'Zero-conversion spend',
      text: 'Catches the ad that spends and never converts. Twice the target CPA with nothing to show is enough evidence to stop it.',
      rule: { if: 'spend ≥ 2× target CPA, 0 conversions', then: 'pause ad' },
    },
    {
      title: 'Tracking check',
      text: 'Catches a broken pixel or tag. Clicks keep coming and conversions stop: that is usually tracking, not the ads, so it alerts rather than pauses.',
      rule: { if: 'clicks, 0 conversions', for: '6 hours', then: 'alert on Slack' },
    },
    {
      title: 'Spend anomaly',
      text: 'Catches what a cap can’t: a jump well above normal that is still under the cap, like a budget edit with an extra zero.',
      rule: { if: 'spend > 7-day avg + 50%', then: 'alert and hold' },
    },
    {
      title: 'Creative fatigue',
      text: 'Catches an ad the audience has stopped seeing. When its click-through rate falls well below its own first week, the next creative in the queue goes in.',
      rule: { if: 'CTR < first week − 30%', then: 'rotate creative' },
    },
  ],
  runsNow: {
    label: 'What you get at the end',
    text: 'These six rules tuned to your own targets and caps, running in alert-only mode first, and a change log that says what each one did and why.',
  },
  pending: ['TODO · Replace with a real anonymized account teardown and its numbers'],
  seo: {
    title: caseTitle('6 Rules Every Ad Account Should Run (Example)'),
    description:
      'An illustrative teardown of six ad account rules: CPA guard, budget cap, zero-conversion spend, tracking check, spend anomaly and creative fatigue.',
  },
});

/** The cases that exist for this person, in card order. `offline-conversions` is omitted without its project. */
export const CASES: readonly AdsCase[] = present([offlineConversions, sixRules]);
export const CASE_SLUGS: readonly CaseSlug[] = CASES.map((c) => c.id);

/** A dashed placeholder card on the home grid: no page, no link, no invented result. */
export interface CaseSlot {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly text: string;
  readonly todos: readonly string[];
}

/** Client cases decided but with no material yet: dashed placeholders on the home page only. */
export const PLACEHOLDERS = [
  {
    id: 'automated-account',
    kicker: 'Client case · automation',
    title: 'An account I automated',
    text: 'Waste cut and CPA before and after, from a real account, anonymized. This slot stays empty until a client clears it for publishing.',
    todos: ['TODO · Spend saved', 'TODO · CPA before / after', 'TODO · Alerts caught'],
  },
  {
    id: 'tracking-fix',
    kicker: 'Client case · tracking',
    title: 'A tracking fix',
    text: 'Conversions the platform was missing or double-counting, found and fixed. No made-up numbers in the meantime.',
    todos: ['TODO · Conversions recovered', 'TODO · Platform and setup'],
  },
] as const satisfies readonly CaseSlot[];

/**
 * Takes the place of the lead-pipeline case when the person has no `lead-pipeline` project
 * (Example mode): their own build, to be added in src/person/projects.ts. Never someone else's.
 */
export const OWN_BUILD_SLOT: CaseSlot = {
  id: 'own-build',
  kicker: 'Own build · pipeline',
  title: 'A build of my own',
  text: 'The lead or tracking pipeline behind my own site, once it is written up here. This slot stays empty until it is.',
  todos: ['TODO · Add your own project to src/person/projects.ts', 'TODO · What it captures, and where it sends it'],
};

/** Cards per row of the home grid (2 × n). */
export const GRID_COLUMNS = 2;

/**
 * Every dashed slot the home grid shows: the client placeholders, plus the own-build slot(s)
 * needed so cases + slots fill complete rows (4 = 2 × 2 today, so none are added).
 */
export const HOME_SLOTS: readonly CaseSlot[] = [
  ...PLACEHOLDERS,
  ...Array.from({ length: slotsToFill(CASES.length + PLACEHOLDERS.length, GRID_COLUMNS) }, () => OWN_BUILD_SLOT),
];

export const getCase = (slug: string): AdsCase | undefined => CASES.find((c) => c.id === slug);

/**
 * Next case in a fixed ring, or undefined when this is the only case (the ring would point at
 * itself) or the slug is unknown.
 */
export function nextCase(slug: CaseSlug): AdsCase | undefined {
  const i = CASES.findIndex((c) => c.id === slug);
  if (i < 0 || CASES.length < 2) return undefined;
  return CASES[(i + 1) % CASES.length];
}

/**
 * The lead record behind the offline-conversions case (field names are the real first-touch
 * fields the shared form sends; the values are an example).
 */
export const LEAD_RECORD = [
  ['ft_landing', '/work/six-rules/'],
  ['ft_referrer', 'google.com'],
  ['ft_utm_source', 'google'],
  ['ft_utm_medium', 'cpc'],
  ['ft_utm_campaign', 'audit-q4'],
  ['niche', 'ads'],
] as const;
