/**
 * Copy for the ads home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › ads):
 *  - no prices anywhere: "Scoped on a call"
 *  - platforms: Meta, Google Ads, TikTok, LinkedIn; automation, tracking and reporting only (he
 *    does not run campaigns); no partner status, no badges
 *  - minimum spend "500 at least", currency unstated: never shown with a symbol, TODO chip
 *  - real numbers per case are OPEN: every missing number is a dashed TODO chip
 *  - no testimonials
 * Case studies live in ./cases.ts, the signature's model in ./rules.ts.
 */
import { hasProject } from '../../person/case-helpers';
import { BRAND_COMPANY, MAIN_SITE_URL, MIN_SPEND_LINE, PARTNER_STATUS, PERSON_NAME, PLATFORMS } from './site';
import { FIRST_NAME, ROLE_IN_SENTENCE, andList, originStory, sentences } from '../../person/claims';
/** The host the owner's own lead pipeline runs on (their main site). */
const SITE_HOST = new URL(MAIN_SITE_URL).host;

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave knowing where the budget leaks, what to automate first, and what it involves";

export const HERO = {
  eyebrow: `Paid ads automation · ${PERSON_NAME}`,
  /** decisions.md › ads › Hero headline. The last line is set in amber. */
  headline: ['Ads that watch', 'their own budget.'],
  lede: 'I build the rules, alerts, tracking and reports that sit on top of your ad accounts, so spend that would never get your approval is stopped by morning, not found at month end.',
  primary: 'Book a scoping call',
  secondary: 'Get an account audit',
  note: 'Free 30-minute call. No price list: scope and cost are agreed on the call.',
} as const;

/**
 * The hero guard board: four guards on an EXAMPLE account (labelled illustrative on the page).
 * Each guard has its own mini chart against its threshold. Per beat, one guard's line reaches
 * its threshold, the guard acts, and the action is logged.
 *
 * Honesty: every series is relative (1 = the guard's threshold: the daily cap, the target CPA,
 * six hours without a conversion, the 7-day average + 50%). No money, no result. `ghost` is the
 * same metric from the trip point on, had the rule not been there.
 */
export interface HeroGuard {
  readonly id: 'cap' | 'cpa' | 'track' | 'spike';
  readonly name: string;
  /** What the mini chart plots, and over what span. */
  readonly metric: string;
  readonly span: string;
  /** Label of the dashed threshold line. */
  readonly limit: string;
  readonly rule: { readonly if: string; readonly for?: string; readonly then: string };
  readonly kind: 'action' | 'alert';
  /** State chip once it has acted, and its change-log line. */
  readonly act: string;
  readonly log: string;
  /** Illustrative time stamp for the log. */
  readonly when: string;
  /** 12 points, 1 = the threshold. */
  readonly series: readonly number[];
  /** Index where it reaches the threshold and acts. */
  readonly trip: number;
  /** From `trip` to the end, without the rule. */
  readonly ghost: readonly number[];
}

export const HERO_GUARDS: readonly HeroGuard[] = [
  {
    id: 'cap',
    name: 'Budget cap',
    metric: 'Spend today ÷ daily cap',
    span: 'Today, by hour',
    limit: 'Daily cap',
    rule: { if: 'spend ≥ daily cap', then: 'stop for the day' },
    kind: 'action',
    act: 'Stopped for the day',
    log: 'Budget cap stopped campaign A for the day',
    when: '14:20',
    series: [0.04, 0.12, 0.22, 0.35, 0.5, 0.66, 0.82, 0.95, 1, 1, 1, 1],
    trip: 8,
    ghost: [1, 1.12, 1.25, 1.38],
  },
  {
    id: 'cpa',
    name: 'CPA guard',
    metric: 'CPA ÷ target, by day',
    span: 'Last 12 days',
    limit: 'Target CPA',
    rule: { if: 'CPA > target', for: '2 days', then: 'pause ad set' },
    kind: 'action',
    act: 'Paused ad set B',
    log: 'CPA guard paused ad set B',
    when: 'Tue 09:00',
    series: [0.86, 0.92, 0.88, 0.94, 1.12, 1.26, 0.97, 0.9, 0.92, 0.88, 0.9, 0.87],
    trip: 5,
    ghost: [1.26, 1.36, 1.44, 1.4, 1.47, 1.5, 1.46],
  },
  {
    id: 'track',
    name: 'Tracking check',
    metric: 'Hours without a conversion ÷ 6',
    span: 'Last 12 hours',
    limit: '6 hours',
    rule: { if: 'clicks, 0 conversions', for: '6 hours', then: 'alert on Slack' },
    kind: 'alert',
    act: 'Alert sent',
    log: 'Tracking check: conversions stopped, alert sent',
    when: 'Wed 16:40',
    series: [0.1, 0.05, 0.15, 0.1, 0.22, 0.45, 0.72, 1, 0.32, 0.1, 0.16, 0.08],
    trip: 7,
    ghost: [1, 1.17, 1.33, 1.5, 1.5],
  },
  {
    id: 'spike',
    name: 'Spend anomaly',
    metric: 'Spend ÷ (7-day avg + 50%)',
    span: 'Last 12 days',
    limit: 'Avg + 50%',
    rule: { if: 'spend > 7-day avg + 50%', then: 'alert and hold' },
    kind: 'alert',
    act: 'Alert · held',
    log: 'Spend anomaly: spike held, alert sent',
    when: 'Thu 11:05',
    series: [0.66, 0.7, 0.64, 0.68, 0.66, 0.69, 1.06, 0.7, 0.66, 0.68, 0.65, 0.67],
    trip: 6,
    ghost: [1.06, 1.1, 1.08, 1.12, 1.09, 1.11],
  },
];

/**
 * Proof strip (brief §4 item 2: spend managed, waste cut, accounts automated). Those three are
 * real numbers the owner has not supplied yet: visible TODO cells, never invented.
 */
export const PROOF_FACTS = [
  { label: 'Platforms', value: PLATFORMS.join(' · '), note: 'One or several, reported in one place' },
  { label: 'What I do', value: 'Automation · tracking · reporting', note: 'I don’t run your campaigns: I build what watches them' },
  { label: 'Minimum spend', value: MIN_SPEND_LINE, note: 'Below that, rules have too little data to act on' },
] as const;
export const PROOF_TODOS = [
  { label: 'Ad spend under automation', todo: 'TODO · Monthly spend across automated accounts' },
  { label: 'Waste cut', todo: 'TODO · Spend stopped by rules, with the period' },
  { label: 'Accounts automated', todo: 'TODO · Count of accounts with rules live' },
] as const;

/** The problem (brief §4 item 3). A plain ledger: what the platform optimizes, what you need. */
export const PROBLEM = {
  title: 'Ad platforms optimize for spend. Someone has to optimize for you.',
  body: 'The platform’s job is to spend your budget well by its own measure. Nobody on its side is paid to notice that an ad set has burned two days over target, that conversions stopped arriving on Tuesday, or that one campaign spent its month by the 20th.',
  rows: [
    { platform: 'Spends the budget it’s given', you: 'Spend that stops where it stops converting' },
    { platform: 'Counts the conversions it can see', you: 'Conversions your CRM can confirm' },
    { platform: 'Learns over days and weeks', you: 'A bad day caught by the next morning' },
    { platform: 'A dashboard per platform', you: 'One report: spend → leads → revenue' },
  ],
  fears: [
    'Budget burning overnight',
    'Reports that arrive too late to act on',
    'Results you can’t check yourself',
    'Tracking broken after privacy changes',
    'No idea of the true cost per customer',
  ],
} as const;

export interface Offer {
  readonly id: 'audit' | 'automation' | 'tracking' | 'reporting' | 'managed';
  readonly name: string;
  readonly pick: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › ads › Offers to show, in the brief's ladder order. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Account & tracking audit',
    pick: 'You suspect waste but can’t point to it, or you don’t trust the conversion numbers.',
    description:
      'A read-only pass over your accounts: where spend goes without converting, how the structure helps or hurts, and whether conversion tracking matches what your CRM records. You get a ranked fix list.',
    serviceType: 'Ad account and conversion tracking audit',
    gets: ['Waste and structure review', 'Tracking accuracy check', 'Fix list, ranked by impact'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'automation',
    name: 'Automation build',
    pick: 'You know the rules you’d apply by hand, if anyone had the time every day.',
    description:
      'Budget guards, bid and pause rules, anomaly alerts and creative rotation, built on the platforms’ own APIs and scripts, with thresholds we agree and every action logged.',
    serviceType: 'Ad account automation: rules, guards and alerts',
    gets: ['Budget guards and pause rules', 'Anomaly alerts', 'Creative rotation'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'tracking',
    name: 'Tracking setup',
    pick: 'The platforms report conversions your sales team has never heard of, or misses ones they have.',
    description:
      'Server-side tracking (Meta’s Conversions API, Google’s enhanced conversions) and offline conversions from your CRM, so the platforms learn from real outcomes.',
    serviceType: 'Server-side and offline conversion tracking setup',
    gets: ['Server-side events', 'Offline conversions from your CRM', 'Verified against your data'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'reporting',
    name: 'Reporting dashboard',
    pick: 'You spend Monday morning stitching four dashboards into one spreadsheet.',
    description: 'Spend → leads → revenue, daily, across every channel, in one dashboard you can read without me.',
    serviceType: 'Cross-channel ad reporting dashboard',
    gets: ['Spend → leads → revenue', 'Daily, all channels', 'Built on your own data'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'managed',
    name: 'Managed automation',
    pick: 'The rules are live and you want someone tuning them as the account changes.',
    description: 'Monitoring of the rules and alerts I built, plus a monthly pass to tune thresholds and add what the account now needs.',
    serviceType: 'Ad automation monitoring and monthly optimization',
    gets: ['Rule and alert monitoring', 'Monthly threshold tuning', 'A monthly check-in'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

/** "What every build includes" (brief §4 item 8). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'log',
    title: 'Change log',
    text: 'Every action a rule takes is written down: when, which rule, what it changed and why.',
  },
  {
    icon: 'cap',
    title: 'Spend caps',
    text: 'Hard limits on what any rule is allowed to spend or shift, so automation can never outspend you.',
  },
  {
    icon: 'bell',
    title: 'Alert channel',
    text: 'Alerts go where you already look: Slack or email, with the numbers that triggered them.',
  },
  {
    icon: 'check',
    title: 'Tracking verification',
    text: 'Before a rule trusts a conversion, I check the conversions are real and arriving.',
  },
  {
    icon: 'eye',
    title: 'Read-only option',
    text: 'Start in alert-only mode on read-only access: rules tell you what they would do before they do it.',
  },
  {
    icon: 'doc',
    title: 'Rules in plain words',
    text: 'Each rule written down as one sentence you can check, change or switch off.',
  },
] as const;

/** Steps in order (brief §4 item 9): Audit → Fix tracking → Automate → Report. */
export const PROCESS = [
  {
    title: 'Audit',
    text: 'A free 30-minute scoping call; then a read-only audit of the accounts and their tracking.',
    leaves: 'A ranked fix list',
  },
  {
    title: 'Fix tracking',
    text: 'Rules are only as good as the conversions they read, so tracking is fixed and verified first.',
    leaves: 'Conversions you can trust',
  },
  {
    title: 'Automate',
    text: 'Guards and alerts go live in alert-only mode, then act once the thresholds have proved themselves.',
    leaves: 'Rules running, every action logged',
  },
  {
    title: 'Report',
    text: 'One dashboard from spend to revenue, and a managed plan if you want the rules tuned monthly.',
    leaves: 'One report you read yourself',
  },
] as const;

export const ABOUT = {
  title: 'An engineer on your ad accounts, not another media buyer.',
  paragraphs: [
    // The second sentence is the owner's story (config.ts › originStories.ads), left out when unset.
    sentences(`I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${BRAND_COMPANY}.`, originStory('ads')?.text),
    'On ad accounts that means I don’t run your campaigns. I build what watches them: rules against the platforms’ own APIs, server-side tracking, and reports that join spend to what your CRM says actually happened.',
    // Names the owner's own pipeline: only when the person has the `lead-pipeline` project.
    ...(hasProject('lead-pipeline')
      ? [
          `My own lead pipeline is where I practise it: every lead from ${SITE_HOST} is stored in MongoDB first, with its landing page, referrer and UTMs from the first visit, then sent to GoHighLevel through its API.`,
        ]
      : []),
  ],
} as const;

/**
 * Answer to "Are you a Google or Meta partner?" from config.ts › credentials. Undefined (no FAQ
 * entry) while either status is unknown; the current wording when neither is held.
 */
const held = PARTNER_STATUS.filter((p) => p.held === true).map((p) => p.platform);
const notHeld = PARTNER_STATUS.filter((p) => p.held === false).map((p) => p.platform);
const PARTNER_ANSWER: string | undefined = PARTNER_STATUS.some((p) => p.held === undefined)
  ? undefined
  : held.length === 0
    ? 'No. I hold no partner status and show no badges. What I can show you is how the automation is built and what it logs.'
    : `Yes for ${andList(held)}${notHeld.length ? `; no for ${andList(notHeld)}` : ''}. Beyond the status, what I can show you is how the automation is built and what it logs.`;
/** The About note "No Google or Meta partner status, and no badges.": only when neither is held. */
export const SHOW_NO_PARTNER_NOTE = PARTNER_STATUS.every((p) => p.held === false);

export const FAQ = [
  {
    q: 'Meta, Google, or both?',
    a: 'Meta, Google Ads, TikTok and LinkedIn. One platform or several; the reporting can pull them into one view.',
  },
  {
    q: 'Do you run the campaigns, or just automate?',
    a: 'I don’t run campaigns. I do automation, tracking and reporting. You, your team or your agency keep running the campaigns; I build the rules, alerts and reports that watch them.',
  },
  {
    q: 'Will rules ever pause good ads?',
    a: 'A rule can be wrong, so every one is built to be safe: thresholds agreed with you, a minimum amount of data before it acts, alert-only mode first, hard spend caps, and every action logged so it can be reversed.',
  },
  {
    q: 'What access do you need?',
    a: 'Read-only access for the audit. For automation, the narrowest access that lets a rule do its one job. The accounts stay yours, and you can remove my access at any time.',
  },
  {
    q: 'Do you fix tracking?',
    a: 'Yes, it usually comes first. Server-side events (Meta’s Conversions API, Google’s enhanced conversions) and offline conversions from your CRM, checked against what your CRM records.',
  },
  {
    q: 'Is there a minimum spend?',
    a: `Yes: ${MIN_SPEND_LINE}. Below that, rules see too little data to act on safely, and an audit is usually the better start.`,
  },
  // config.ts › credentials (googleAdsPartner, metaPartner): left out, with its JSON-LD entry,
  // while either is unknown.
  ...(PARTNER_ANSWER ? [{ q: 'Are you a Google or Meta partner?', a: PARTNER_ANSWER }] : []),
  {
    q: 'What does it cost?',
    a: 'It depends on the platforms, the accounts and what we automate, so I scope it on a free 30-minute call. You know what is involved before anything is agreed.',
  },
] as const;
