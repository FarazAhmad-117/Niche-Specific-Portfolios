/**
 * Copy for the ghl home page. Kept as data so the same text feeds the markup and the JSON-LD
 * (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › ghl):
 *  - no prices anywhere: "scoped on a call"
 *  - serves agencies and businesses
 *  - the only real case is the farazahmad.dev → GHL lead pipeline; its facts are exactly the
 *    decision text (MongoDB first, GHL API, upsert by email, tags incl. niche:<slug>, a note,
 *    an open opportunity, retry from admin). Lead-delivery numbers are open: TODO chip.
 *  - client stories and screenshots are open: TODO placeholders, never invented
 *  - no testimonials
 * Case studies live in ./cases.ts, the signature section's model in ./switchboard.ts.
 *
 * Owner identity comes from src/person (via ./site.ts) and the pipeline copy from the project
 * registry: when the person has no `lead-pipeline` project, the proof cells and the About
 * paragraph that describe it drop out (the proof strip gets TODO cells instead, so it keeps
 * four), and the hero rack is labelled as an example pipeline instead of "the real pipeline".
 */
import { getProject, slotsToFill } from '../../person/case-helpers';
import { PERSON } from '../../person/person';
import { FIRST_NAME, PROFESSION, ROLE_IN_SENTENCE, originStory, sentences, withArticle } from '../../person/claims';
import { pipelineSite } from './cases';
import { PERSON_NAME } from './site';

/** The real pipeline this page's proof copy is about; undefined in Example mode. */
const pipeline = getProject('lead-pipeline');

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave the call knowing what's wrong or what to build, and what it involves";

export const HERO = {
  eyebrow: `GoHighLevel · ${PERSON_NAME}`,
  /** decisions.md › ghl › Hero headline. The last word is set in teal. */
  headline: ['GoHighLevel,', 'built by a', 'developer.'],
  lede: 'I audit, build and extend GoHighLevel for agencies and businesses: pipelines that make sense, workflows that fire once, snapshots that install clean, and real code through the API when the builder runs out.',
  primary: 'Book a scoping call',
  secondary: 'See inside a clean account',
  note: 'Free 30-minute call. No price list: scope and cost are agreed on the call.',
} as const;

/**
 * The hero panel: the real pipeline behind this site's own form, one port per beat.
 * Every label is a fact from decisions.md › ghl; only the contact is an example.
 * Example mode (no `lead-pipeline` project): the same generic mechanism, labelled as an example
 * (HERO_RACK), with the one first-person detail made neutral.
 */
export const HERO_PORTS = [
  { label: 'Saved first', value: 'MongoDB', detail: pipeline ? 'Stored on my side first' : 'Stored before the send' },
  { label: 'Contact', value: 'Upsert by email', detail: 'sam@northwind.example' },
  { label: 'Tags', value: 'niche:ghl', detail: 'Which site it came from' },
  { label: 'Note', value: 'Message attached', detail: 'On the contact record' },
  { label: 'Opportunity', value: 'Open', detail: 'Ready to work' },
] as const;

/** How the hero rack is labelled: the real pipeline, or (Example mode) an illustrative one. */
export const HERO_RACK: { readonly example: boolean; readonly caption: string } = pipeline
  ? { example: false, caption: 'The real pipeline behind this site’s form. The contact is an example.' }
  : { example: true, caption: 'An example pipeline, website form to GoHighLevel. Illustrative, not a live system.' };

export const PROOF: readonly { readonly value: string; readonly label: string }[] = [
  { value: 'API', label: 'GoHighLevel API and webhooks, not only the builder' },
  ...(pipeline
    ? [
        { value: 'MongoDB → GHL', label: 'My own site stores every lead first, then sends it to GoHighLevel' },
        { value: 'Upsert', label: 'Contacts matched by email, so a repeat visitor stays one contact' },
        { value: 'Retry', label: 'A failed send waits in my admin to be retried, not lost' },
      ]
    : []),
];

/** Extra TODO cells so the rail keeps complete rows of four (none for the current owner). */
export const PROOF_TODO_EXTRA: readonly { readonly title: string; readonly chip: string }[] = Array.from(
  { length: slotsToFill(PROOF.length, 4) },
  (_, i) =>
    i === 0
      ? { title: 'Integration proof', chip: 'TODO · A GoHighLevel integration you built, and what it sends' }
      : { title: 'Another fact', chip: 'TODO · A verified fact about your GoHighLevel work' },
);

export const PROOF_TODO = pipeline
  ? `TODO · Leads delivered and send success rate from ${pipelineSite(pipeline)}`
  : 'TODO · Real GoHighLevel results: accounts cleaned up, leads delivered';

/**
 * The problem. An example workflow list (labelled as such) built from the fears in the brief:
 * double fires, drafts that never fire, live test flows, alerts nobody reads.
 */
export const PROBLEM = {
  title: 'The account nobody wants to touch.',
  body: 'It started clean. Then a VA added a copy "to test", a snapshot brought its own workflows, and someone left with the only map in their head. Now leads get two emails or none, and changing anything feels risky.',
  resolution: 'I make it legible again, then keep it that way.',
  fears: [
    'Workflows that fire twice, or not at all',
    'Snapshots that break on install',
    'A2P 10DLC and email deliverability problems',
    'A setup only the person who left understood',
  ],
  workflows: [
    { name: 'New Lead', status: 'Published', trigger: 'Form submitted', fault: null },
    { name: 'New Lead (copy)', status: 'Published', trigger: 'Form submitted', fault: 'Fires twice' },
    { name: 'new lead FINAL v2', status: 'Draft', trigger: 'None', fault: null },
    { name: 'TEST - do not use', status: 'Published', trigger: 'Tag added', fault: 'Live on real leads' },
    { name: 'Booking confirm (old)', status: 'Draft', trigger: 'Appointment', fault: 'Never fires' },
    { name: 'Hot lead alert', status: 'Published', trigger: 'Tag added', fault: 'Emails an ex-staff inbox' },
  ],
} as const;

export type Audience = 'agency' | 'business';

export interface Offer {
  readonly id: 'audit' | 'build' | 'snapshot' | 'integration' | 'care';
  readonly name: string;
  /** "Pick this if", per audience. */
  readonly forAgency: string;
  readonly forBusiness: string;
  /** Shown dimmed for this audience (the offer is not really for them). */
  readonly notFor?: Audience;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › ghl › Offers to show. Order follows the brief's ladder. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Account audit & cleanup',
    forAgency: 'You inherited a client account and nobody can explain it.',
    forBusiness: 'Your account mostly works, and you’re not sure why.',
    description:
      'I map every trigger, workflow, pipeline and notification, check deliverability, and hand you a written fix list. I can do the cleanup too.',
    serviceType: 'GoHighLevel account audit and cleanup',
    gets: ['Map of every workflow and trigger', 'Fix list, ranked by risk', 'Optional cleanup'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'build',
    name: 'System build',
    forAgency: 'A new client needs a full setup, done properly the first time.',
    forBusiness: 'You’re moving into GoHighLevel, or starting over in it.',
    description:
      'Pipelines, workflows, forms, calendars and reporting for one business model: built, tested with test contacts, and documented.',
    serviceType: 'GoHighLevel system build',
    gets: ['Pipelines and workflows', 'Forms, calendars and reporting', 'Tested and documented'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'snapshot',
    name: 'Snapshot (agencies)',
    forAgency: 'You sell one setup to a niche and want it to install clean every time.',
    forBusiness: 'Only if you resell GoHighLevel. A system build is the business version.',
    notFor: 'business',
    description:
      'A reusable, documented snapshot for one client niche, installed and tested on a fresh sub-account before you sell it.',
    serviceType: 'GoHighLevel snapshot build for agencies',
    gets: ['Built for one niche', 'Tested on a fresh install', 'Setup guide for your team'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'integration',
    name: 'Custom integration',
    forAgency: 'Clients need GoHighLevel to talk to a tool it doesn’t connect to.',
    forBusiness: 'You need GoHighLevel to talk to your own app, store or database.',
    description:
      'API, webhook and external-app sync that GoHighLevel can’t do natively, with logging and retries so nothing fails silently.',
    serviceType: 'GoHighLevel API and webhook integration',
    gets: ['GoHighLevel API and webhooks', 'Your app, database or tool', 'Logging and retries'],
    priceLine: 'Quoted after scoping',
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'Care plan',
    forAgency: 'You want a developer on hand for client accounts every month.',
    forBusiness: 'It runs today, and you want someone watching it next month too.',
    description: 'Monitoring, fixes and small changes every month, on accounts I built or audited.',
    serviceType: 'GoHighLevel monitoring and maintenance',
    gets: ['Monitoring and error alerts', 'Fixes and small changes', 'A monthly check-in'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

/** "What every build includes" (brief §4 item 7). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'tag',
    title: 'Naming conventions',
    text: 'Workflows numbered and named by purpose, tags in a fixed scheme, so the list explains itself.',
  },
  {
    icon: 'map',
    title: 'Documentation',
    text: 'A map of what triggers what, every custom field and tag, written for the next person, not for me.',
  },
  {
    icon: 'flask',
    title: 'Test contacts',
    text: 'Every path run end to end with test contacts before a real lead touches it.',
  },
  {
    icon: 'bell',
    title: 'Error notifications',
    text: 'When a workflow step or an integration fails, someone is told. Nothing breaks quietly.',
  },
  {
    icon: 'shield',
    title: 'Deliverability check',
    text: 'SPF, DKIM and DMARC on the sending domain, and A2P 10DLC status checked against how you text.',
  },
  {
    icon: 'play',
    title: 'Handover video',
    text: 'A recorded walkthrough of your own account, so the knowledge stays with you.',
  },
] as const;

/** Steps in order (brief §4 item 8): Audit → Plan → Build → Handover. */
export const PROCESS = [
  {
    title: 'Audit',
    text: 'A free 30-minute scoping call; for an existing account, a read-only audit of what is really there.',
    leaves: 'A map and a fix list',
  },
  {
    title: 'Plan',
    text: 'Pipelines, workflows, naming and integrations agreed on paper before anything is built or switched off.',
    leaves: 'A plan you sign off',
  },
  {
    title: 'Build',
    text: 'Built in your account, deliverability first, every path tested with test contacts.',
    leaves: 'Live, tested workflows',
  },
  {
    title: 'Handover',
    text: 'Documentation, a recorded walkthrough and every login in your name. A care plan keeps me on it.',
    leaves: 'An account you understand',
  },
] as const;

/**
 * The owner vs a typical GHL VA vs a typical agency (brief §4 item 9). Generalisations, and the
 * section says so. `mark`: yes / some / no.
 */
export const COMPARE = {
  columns: ['Me', 'Typical GHL VA', 'Typical agency'] as const,
  rows: [
    {
      label: 'Works in the GoHighLevel builder',
      cells: [
        { mark: 'yes', text: 'Yes' },
        { mark: 'yes', text: 'Yes' },
        { mark: 'yes', text: 'Yes' },
      ],
    },
    {
      label: 'Custom code, the API and webhooks',
      cells: [
        // "it’s my background" only with config.ts › profession.
        { mark: 'yes', text: PROFESSION ? 'Yes, it’s my background' : 'Yes' },
        { mark: 'no', text: 'Rarely' },
        { mark: 'some', text: 'Sometimes, often outsourced' },
      ],
    },
    {
      label: 'Who you talk to',
      cells: [
        { mark: 'yes', text: 'The developer who builds it' },
        { mark: 'yes', text: 'The person who builds it' },
        { mark: 'some', text: 'An account manager' },
      ],
    },
    {
      label: 'Documentation at handover',
      cells: [
        { mark: 'yes', text: 'Always: map, naming, video' },
        { mark: 'some', text: 'Varies' },
        { mark: 'some', text: 'Varies' },
      ],
    },
    {
      label: 'Accounts and logins',
      cells: [
        { mark: 'yes', text: 'In your name' },
        { mark: 'some', text: 'Varies' },
        { mark: 'some', text: 'Often the agency’s' },
      ],
    },
  ],
  note: 'Generalisations, not a dig at anyone: plenty of VAs and agencies do good work. This is where a developer is different.',
} as const;

/** config.ts › originStories.ghl: the About title and its first story sentence. */
const story = originStory('ghl');
export const ABOUT = {
  // Without an origin story (or one with no title) the title makes no biographical claim.
  title: story?.title ?? 'A developer who builds past the GoHighLevel builder.',
  paragraphs: [
    sentences(`I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${PERSON.company}.`, story?.text),
    // "I’m a full-stack engineer, so" from config.ts › profession; without it the sentence starts at "When".
    `${PROFESSION ? `I’m ${withArticle(PROFESSION)}, so when` : 'When'} the builder runs out I don’t stop at a workaround. I write against the GoHighLevel API, wire the webhooks, and build the small app or sync that does the job.`,
    ...(pipeline
      ? [
          'My own site is the proof I can show today: every lead stored in MongoDB first, then sent to GoHighLevel through its API, tagged by the site it came from. The form at the bottom of this page runs through it.',
        ]
      : []),
  ],
} as const;

export const FAQ = [
  {
    q: 'Can you fix an account someone else built?',
    a: 'Yes, that’s what the audit is for. I map what exists first, so nothing gets switched off that something else depended on, then fix things in an agreed order, riskiest first.',
  },
  {
    q: 'Do you work with agencies, white-label?',
    a: 'Yes. I work in your agency account on your clients’ sub-accounts. We agree on the scoping call whether I’m introduced to your client or stay behind your team.',
  },
  {
    q: 'What about A2P 10DLC and email deliverability?',
    a: 'Both are checked in every audit and build: SPF, DKIM and DMARC on your sending domain, and whether your A2P 10DLC registration matches how you actually text. I can help prepare a registration; approval is up to the carriers.',
  },
  {
    q: 'Can GoHighLevel connect to my tool?',
    a: 'Usually. If there is a native integration, I use it. If not, the GoHighLevel API and webhooks, or n8n, Make or Zapier in between. If your tool has an API, it can usually be connected; we check your exact setup on the call.',
  },
  {
    q: 'Will I understand the setup after handover?',
    a: 'That’s the point of the handover. Workflows are numbered and named by purpose, the map shows what triggers what, and you get a recorded walkthrough of your own account.',
  },
  {
    q: 'Do snapshots include my client’s data?',
    a: 'No. A snapshot carries the setup: pipelines, workflows, forms, calendars and templates. Contacts, conversations and other client data are not part of it.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on the account, the build and any integrations, so I scope it on a free 30-minute call. You know what is involved before anything is agreed.',
  },
  {
    q: 'Who owns the account and the work?',
    a: 'You do. I work in your agency or sub-account with access you grant and can remove, and everything I build stays there.',
  },
] as const;
