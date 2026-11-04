/**
 * Copy for the cloud home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › cloud):
 *  - no prices anywhere: "scoped on a call"
 *  - no on-call: the care plan is monitoring and fixes during the support hours (config.ts ›
 *    supportHours); when unset the hours drop out and the copy says "business hours"
 *  - clouds and certifications are OPEN: no logos, no certification claims
 *  - every case number is a baseline TODO; the status board's numbers are illustrative
 * Case studies live in ./cases.ts, the board in ./board.ts.
 *
 * Owner identity comes from src/person (via ./site.ts). Lines about the owner's own stack (the
 * test count, the About paragraph and FAQ sentence on his main site) show only while the
 * `farazahmad-dev` project backs them (./own-stack.ts): otherwise (a new person) the proof cell
 * becomes a TODO and the sentences that name it drop out.
 */
import { PERSON } from '../../person/person';
import { FIRST_NAME, ROLE_IN_SENTENCE, originStory, sentences } from '../../person/claims';
import { getNiche } from '../../niches';
import { fact } from '../../person/case-helpers';
import { OWN_SITE as ownSite } from './own-stack';
import { PERSON_NAME, SUPPORT_HOURS, TOOLS_TODO } from './site';
import { assertLaunchReady, todo, type Field } from './todo';

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave the call knowing what to fix first, and what fixing it involves";

export const HERO = {
  eyebrow: `Cloud & DevOps · ${PERSON_NAME}`,
  /** decisions.md › cloud › Hero headline. The two promises get the mint underline. */
  headline: [
    { text: 'Infrastructure that ', em: false },
    { text: 'stays up', em: true },
    { text: ' and ', em: false },
    { text: 'costs less.', em: true },
  ],
  lede: 'I set up the pipelines, monitoring and cloud housekeeping that small teams never get round to: deploys you can roll back, alerts that mean something, and a bill you can explain.',
  primary: 'Book a scoping call',
  secondary: 'Get a cost audit',
  note: 'Free 30-minute call. No prices to decode: scope and cost are agreed on the call.',
} as const;

/**
 * The hero panel: an example service's status page. Each beat adds one log line and nothing
 * else, so the panel changes calmly. The last beat is the finished state (no-JS / reduced motion).
 */
export const HERO_SERVICES = [
  { name: 'web', note: 'edge' },
  { name: 'api', note: '3 instances' },
  { name: 'worker', note: 'queue' },
  { name: 'database', note: 'primary + replica' },
] as const;

/** The two panels stacked behind the status page: only their header strips show, in full. */
export const HERO_LAYERS = [
  { title: 'pipeline · example-app', status: 'passing' },
  { title: 'alerts · example-app', status: 'quiet' },
] as const;

/** Housekeeping checks on the status page: states, not metrics. */
export const HERO_CHECKS = [
  { k: 'deploys', v: 'automated' },
  { k: 'rollback', v: 'ready' },
  { k: 'restore', v: 'tested' },
] as const;

export const HERO_LOG = [
  { t: '09:14:02', text: 'push main · 41f2c9', tone: 'muted' },
  { t: '09:14:48', text: 'tests passed · 0 failed', tone: 'ok' },
  { t: '09:15:10', text: 'preview deployed · checks green', tone: 'ok' },
  { t: '09:16:31', text: 'canary 10% · error rate normal', tone: 'ok' },
  { t: '09:18:05', text: 'promoted to 100% · rollback ready', tone: 'ok' },
  { t: '03:00:00', text: 'nightly backup · restore test passed', tone: 'ok' },
] as const;

/**
 * Proof strip. The headline ops numbers are baseline TODOs (decisions: real numbers per case =
 * baseline). The one real number is the main site's own test suite (docs/research/ai-local.md §5).
 */
export const PROOF: readonly { label: string; value: Field; note: string }[] = [
  { label: 'Uptime', value: todo('baseline'), note: 'Measured on a real client service, published once cleared' },
  { label: 'Deploys a week', value: todo('baseline'), note: 'Before and after a CI/CD setup' },
  { label: 'Measured savings', value: todo('baseline'), note: 'Monthly bill, before and after an audit' },
  ownSite
    ? {
        label: 'Tests on my own site',
        value: fact(ownSite, 'testsCount'),
        note: `Passing on ${ownSite.name}, ${fact(ownSite, 'checks')} (Oct 2026)`,
      }
    : { label: 'Tests on my own site', value: todo('your own site'), note: 'A verified number from a system you run yourself' },
];

export const PROBLEM = {
  title: 'Your infrastructure lives in one person’s head.',
  body: 'Nobody planned it that way. A server was set up in a hurry, a deploy script grew, the bill crept up, and now one person knows how it all fits together. When they are away, nobody touches it.',
  resolution: 'I write it down, automate it, and hand it back.',
  /** Incident tickets from the brief's fears. Severity is the visual tone only. */
  tickets: [
    { sev: 'bad', id: 'INC-1', title: 'Deploys mean SSH and hope', note: 'No tests gate it, and no rollback plan.' },
    { sev: 'warn', id: 'INC-2', title: 'The bill went up again', note: 'Nobody can say which service grew.' },
    { sev: 'bad', id: 'INC-3', title: 'Backups exist. A restore was never tried.', note: 'You find out on the worst day.' },
    { sev: 'warn', id: 'INC-4', title: 'One person has the keys', note: 'Shared logins, root access, no audit trail.' },
    { sev: 'warn', id: 'INC-5', title: 'The migration is planned for “a quiet weekend”', note: 'For the third time.' },
  ],
} as const;

export interface Offer {
  readonly id: 'audit' | 'cicd' | 'migration' | 'cost' | 'care';
  readonly name: string;
  readonly tag?: string;
  readonly bestFor: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › cloud › Offers to show. Order follows the brief's ladder. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Infra & cost audit',
    bestFor: 'You want to know what you are running, what it costs, and what is risky.',
    description:
      'I review your architecture, access, CI/CD and the bill line by line, then hand you a fix list ranked by risk and by savings.',
    serviceType: 'Cloud infrastructure and cost audit',
    gets: ['Architecture and access map', 'Fixes ranked by risk', 'Savings estimate per line item'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'cicd',
    name: 'CI/CD setup',
    bestFor: 'Deploys are manual, scary or only one person can do them.',
    description:
      'Automated tests on every change, preview environments, one-click deploys and a rollback you have actually tried.',
    serviceType: 'CI/CD pipeline setup',
    gets: ['Tests gate every merge', 'Preview environment per change', 'Deploy and rollback in one step'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'migration',
    name: 'Migration',
    bestFor: 'You are outgrowing shared hosting or a single server.',
    description:
      'A written cutover plan, old and new running side by side, traffic moved in steps, and a way back at every step.',
    serviceType: 'Cloud migration',
    gets: ['Cutover plan you sign off', 'Side-by-side run', 'Rollback at every step'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'cost',
    name: 'Cost optimization',
    bestFor: 'The bill keeps growing and nobody can say why.',
    description:
      'Right-size what is oversized, switch off what nothing uses, and commit only to the capacity you have proved you need.',
    serviceType: 'Cloud cost optimization',
    gets: ['Right-sizing', 'Idle and orphaned resources removed', 'Before and after bill, measured'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'On-call / care plan',
    tag: SUPPORT_HOURS ? `Business hours · ${SUPPORT_HOURS} · not 24/7` : 'Business hours · not 24/7',
    bestFor: 'It runs today and you want someone watching it next month too.',
    description: SUPPORT_HOURS
      ? `Not on-call: monitoring and fixes, ${SUPPORT_HOURS}. Alerts, patching and a monthly report, all in business hours; there is no overnight pager.`
      : 'Not on-call: monitoring, fixes, alerts, patching and a monthly report, all in business hours; there is no overnight pager.',
    serviceType: 'Infrastructure monitoring and maintenance (business hours)',
    gets: ['Monitoring and alert tuning', `Fixes during ${SUPPORT_HOURS ?? 'business hours'}`, 'Monthly report'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

/** "What every engagement includes" (brief §4 item 8). Six items: one complete 3×2 grid. */
export const INCLUDED = [
  {
    icon: 'code',
    title: 'Infrastructure as code',
    text: 'Servers, networks and settings described in files under version control, so the setup can be reviewed, repeated and rebuilt.',
  },
  {
    icon: 'book',
    title: 'Runbooks',
    text: 'Plain steps for the jobs that matter: deploy, roll back, restore, rotate a key. Written so someone other than me can follow them.',
  },
  {
    icon: 'bell',
    title: 'Alerting that means something',
    text: 'Alerts on what users feel, such as errors and slow responses, sent to the right person, tuned until they are not noise.',
  },
  {
    icon: 'disk',
    title: 'Backups, and a tested restore',
    text: 'Backups on a schedule, and a restore actually run and timed, so the number in the runbook is real.',
  },
  {
    icon: 'key',
    title: 'Least-privilege access',
    text: 'Named accounts, no shared root logins, only the access each person needs, and secrets kept out of the code.',
  },
  {
    icon: 'hand',
    title: 'Handover',
    text: 'Every account and key in your name, the docs in your repo, and a walkthrough with whoever runs it next.',
  },
] as const;

/**
 * "Where cloud bills usually leak": six plain-language line items, one complete 3×2 grid.
 * Owner decision (2026-11-03): no calculator, no figures or percentages here. Words only.
 */
export const LEAKS = [
  { tag: 'idle', title: 'Servers on all night', text: 'Machines run around the clock, even in the middle of the night when nobody is using the app.' },
  { tag: 'oversized', title: 'Sized for launch day', text: 'Servers were picked for one big traffic spike, and the bill never shrank back afterwards.' },
  { tag: 'forgotten', title: 'Backups nobody deletes', text: 'Old snapshots and copies pile up quietly, and you keep paying to store every one of them.' },
  { tag: 'left on', title: 'Test setups still running', text: 'A copy of the app built for a demo or a test is still switched on months later.' },
  { tag: 'full rate', title: 'Paying full price', text: 'Things that run all year are billed at the pay-as-you-go rate instead of a cheaper committed one.' },
  { tag: 'transfer', title: 'Data on the move', text: 'Every time data travels between locations, or out to your users, there can be a charge for the trip.' },
] as const;
/** Steps in order (brief §4 item 9): Audit → Plan → Implement → Monitor. */
export const PROCESS = [
  {
    title: 'Audit',
    text: 'A free 30-minute scoping call; for anything bigger, a written audit of what runs, what it costs and what is risky.',
    leaves: 'A ranked fix list',
  },
  {
    title: 'Plan',
    text: 'Every change written down before it happens, with how we check it worked and how we undo it. You sign it off.',
    leaves: 'A plan with rollbacks',
  },
  {
    title: 'Implement',
    text: 'Changes go in through code and the pipeline, in your accounts, in small steps you can see.',
    leaves: 'Infra as code, in your repo',
  },
  {
    title: 'Monitor',
    text: `We watch errors, latency and the bill after each change. A care plan keeps me on it during ${SUPPORT_HOURS ?? 'business hours'}.`,
    leaves: 'Dashboards and alerts',
  },
] as const;

export const ABOUT: { readonly title: string; readonly paragraphs: readonly string[] } = {
  title: 'A developer who reads the app, not only the servers.',
  paragraphs: [
    // The second sentence is config.ts › originStories.cloud, left out when unset.
    sentences(`I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${PERSON.company}.`, originStory('cloud')?.text),
    ...(ownSite
      ? [
          `I run my own stack the way I would run yours: ${ownSite.name} on Next.js and MongoDB with Sentry watching errors, and these niche sites, built to run as one Vercel project, one subdomain each, generated from a single registry.`,
        ]
      : []),
    `Support runs ${SUPPORT_HOURS ?? 'in business hours'}. I don’t offer a 24/7 pager, and I’ll say so before you sign anything.`,
  ],
};

export interface FaqItem {
  readonly q: string;
  readonly a: string;
  /** Shown on the page as a TODO chip, never in the FAQPage JSON-LD. */
  readonly pending?: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    q: 'Which clouds do you work with?',
    a: ownSite
      ? `These niche sites are built to run on Vercel; ${ownSite.name} uses GitHub, Sentry and MongoDB. Which other clouds I take on is confirmed on the scoping call against your setup, and I won’t claim a certification I don’t hold.`
      : 'These niche sites are built to run on Vercel. Which other clouds I take on is confirmed on the scoping call against your setup, and I won’t claim a certification I don’t hold.',
    pending: 'TODO · confirm clouds and any certifications',
  },
  {
    q: 'Will a migration cause downtime?',
    a: 'The plan aims for none: old and new run side by side, traffic moves in steps, and every step has a way back. If a short window can’t be avoided, for example a final database cutover, we agree the time with you in advance.',
  },
  {
    q: 'Do I keep access to everything?',
    a: 'Yes. I work in your accounts under a named login, every key and account stays in your name, the infrastructure code lives in your repository, and my access is removed at handover.',
  },
  {
    q: 'Do you do on-call?',
    a: `No. The care plan is monitoring and fixes during business hours${SUPPORT_HOURS ? `, ${SUPPORT_HOURS}` : ''}. There is no overnight or weekend pager. If you need 24/7 cover, that has to be your own team or a dedicated provider; I can set up the alerting so it reaches them.`,
  },
  {
    q: 'How do you estimate savings?',
    a: 'From your real bill, during the audit. I read it line by line, find what is running for nobody or paid for at the wrong rate, and explain what each fix involves. I don’t put a figure on it before I’ve seen the bill, and a saving only counts once the bill after a change is measured against the bill before it.',
  },
  {
    q: 'What about security and compliance?',
    a: 'I put the basics in: named accounts with least-privilege access, multi-factor sign-in, secrets kept out of code, backups with a tested restore, and logs you can audit. I’m not a compliance auditor and I don’t certify SOC 2, HIPAA or similar; I can prepare the infrastructure side for the person who does.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on what you run and what needs changing, so I scope it on a free 30-minute call. The scope and price are agreed before work starts.',
  },
];


// Launch guard: proof TODOs, tool slots and FAQ chips must all be resolved before indexing.
assertLaunchReady({ noindex: getNiche('cloud').noindex, data: { PROOF, TOOLS_TODO, FAQ }, label: 'home content' });
