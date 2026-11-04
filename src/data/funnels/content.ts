/**
 * Copy for the funnels home page. Kept as data so the same text feeds the markup and the
 * JSON-LD (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › funnels):
 *  - no prices anywhere: "scoped on a call"
 *  - no published Lead Drift numbers yet: operational facts only
 *  - build only: the client supplies the copy
 *  - tools: GoHighLevel, n8n, Make, Zapier
 *  - never invent figures; the leak calculator is labelled as an estimate and shows its assumptions
 * Case studies live in ./cases.ts, the calculator model in ./leak.ts.
 *
 * Owner identity comes from src/person (via ./site.ts) and the Lead Drift copy from the project
 * registry: when the person has no `lead-drift` project, the two proof cells, the About paragraph
 * and the offer sentence that name it drop out (the proof strip gets TODO cells instead, so it
 * keeps its five cells).
 */
import { getProject } from '../../person/case-helpers';
import { PERSON } from '../../person/person';
import { FIRST_NAME, ROLE_IN_SENTENCE, originStory, pronoun, sentences } from '../../person/claims';
import { HAS_OWN_PIPELINE } from './cases';
import { BRAND_COMPANY, PERSON_NAME } from './site';

/** The real outbound project this page's copy refers to; undefined in Example mode. */
const leadDrift = getProject('lead-drift');

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = "You'll leave the call knowing where your leads go quiet, and what fixing it involves";

export const HERO = {
  eyebrow: `Marketing automation · ${PERSON_NAME}`,
  /** decisions.md › funnels › Hero headline. The last word gets the rose swash. */
  headline: ['Follow-up that', 'never forgets', 'a lead.'],
  lede: 'I build the email, SMS and CRM follow-up that turns the leads you already have into booked calls, in GoHighLevel, n8n, Make or Zapier, and track where every one came from.',
  primary: 'Book a scoping call',
  secondary: 'Follow a lead',
  note: 'Free 30-minute call. No prices to decode: scope and cost are agreed on the call.',
} as const;

/**
 * The hero card: one example lead through four stages of a typical sequence. Each stage shows
 * one message, so the card changes calmly, once per stage.
 */
export const HERO_STAGES = [
  {
    label: 'New',
    clock: 'Day 0 · 09:14',
    kind: 'event',
    meta: 'Form · /pricing',
    text: 'Saved and tagged: source:google, interest:audit',
  },
  {
    label: 'Nurturing',
    clock: 'Day 0 · 09:15',
    kind: 'out',
    meta: 'Email · within the minute',
    text: 'Hi Sam, thanks for asking about the audit. Here are my open times if it helps to talk.',
  },
  {
    label: 'Replied',
    clock: 'Day 3 · 11:42',
    kind: 'in',
    meta: 'Reply from Sam',
    text: 'This is useful. Could we talk on Thursday?',
  },
  {
    label: 'Booked',
    clock: 'Day 3 · 11:44',
    kind: 'win',
    meta: 'Calendar',
    text: 'Thu 10:30 · Scoping call',
  },
] as const;

export const PROOF: readonly { readonly value: string; readonly label: string }[] = [
  ...(leadDrift
    ? [
        {
          value: leadDrift.name,
          label: `My own outbound engine, running in production for ${leadDrift.madeBy ?? BRAND_COMPANY}`,
        },
        { value: '2', label: 'Lead sources its browser extension pulls from: Google Maps and Apollo' },
      ]
    : []),
  { value: 'Every lead', label: 'Landing page, referrer and UTMs captured at first touch, then mapped into the CRM' },
  { value: '4 tools', label: 'GoHighLevel, n8n, Make and Zapier, built in your accounts' },
];

/** Example mode: dashed TODO cells in place of the Lead Drift cells, so the strip keeps five (none for the current owner). */
export const PROOF_TODO: readonly { readonly title: string; readonly chip: string }[] = leadDrift
  ? []
  : [
      { title: 'Own system', chip: 'TODO · An outbound or follow-up system you run, and its status' },
      { title: 'Another fact', chip: 'TODO · A verified fact about your automation work' },
    ];

export const PROBLEM = {
  title: 'Most leads die in the inbox, not the ad.',
  body: 'You already paid for the click. What usually loses the lead is what happens next: a slow reply, a generic sequence, or no follow-up at all.',
  resolution: 'The follow-up is the part I build.',
  /** What the lead sees from their side. Each is a fear from the brief. */
  messages: [
    { text: 'Hi, I filled in your form about pricing. Is this still available?', receipt: 'Seen 2 days later' },
    { text: 'I got the same "Dear valued customer" email three times this week.', receipt: 'Unsubscribed' },
    { text: 'Booked a call with you last month. Which ad was that from?', receipt: 'Nobody knows' },
    { text: 'Your form and your CRM say different things about me.', receipt: 'Tools not connected' },
  ],
} as const;

/**
 * Signature: follow one example lead (brief §4 item 4). The lead, the business and the
 * timings are illustrative of a typical build, and the section says so.
 *   msg.kind  out = the business's system speaks, in = the lead, event = system log line
 */
export interface JourneyStep {
  readonly id: string;
  readonly day: string;
  readonly time: string;
  readonly title: string;
  readonly text: string;
  readonly channel: 'Form' | 'CRM' | 'Email' | 'SMS' | 'Reply' | 'Calendar';
  readonly msg: { readonly kind: 'out' | 'in' | 'event' | 'win'; readonly meta?: string; readonly text: string };
}

export const JOURNEY: readonly JourneyStep[] = [
  {
    id: 'form',
    day: 'Day 0',
    time: '09:14:02',
    title: 'Sam fills in your form',
    text: 'On your pricing page. Where Sam came from is saved with the lead at that moment: landing page, referrer, and the UTM source, medium and campaign.',
    channel: 'Form',
    msg: { kind: 'event', text: 'New lead · /pricing · google / cpc / spring-audit' },
  },
  {
    id: 'crm',
    day: 'Day 0',
    time: '09:14:05',
    title: 'Saved, tagged, routed',
    text: 'The contact is created or updated by email address, so there are no duplicates. Tags record the source and what Sam asked about, and they decide which sequence starts.',
    channel: 'CRM',
    msg: { kind: 'event', text: 'Contact upserted · tags: source:google, interest:audit' },
  },
  {
    id: 'email-0',
    day: 'Day 0',
    time: '09:15',
    title: 'The first reply, while Sam is still on the page',
    text: 'A short email from a real sender, with the booking link. Your words; I set the timing, the logic and the sending domain.',
    channel: 'Email',
    msg: {
      kind: 'out',
      meta: 'Email · from Alex at Northwind',
      text: 'Hi Sam, thanks for asking about the audit. If it helps to talk it through, here are my open times. If not, I’ll send one useful thing tomorrow.',
    },
  },
  {
    id: 'sms-1',
    day: 'Day 1',
    time: '10:00',
    title: 'A short SMS, in business hours',
    text: 'Only if Sam gave a number and consent. Sent in Sam’s time zone, never at night, with a clear way to opt out.',
    channel: 'SMS',
    msg: {
      kind: 'out',
      meta: 'SMS',
      text: 'Hi Sam, Alex from Northwind. Did yesterday’s email reach you? Happy to answer here. Reply STOP to opt out.',
    },
  },
  {
    id: 'email-3',
    day: 'Day 3',
    time: '09:30',
    title: 'One useful follow-up, not a nag',
    text: 'Something worth reading, aimed at what Sam asked about. Segments mean the pricing lead and the newsletter signup never get the same email.',
    channel: 'Email',
    msg: {
      kind: 'out',
      meta: 'Email',
      text: 'Sam, a two-minute read: the three places follow-up usually breaks, and how to check yours.',
    },
  },
  {
    id: 'reply',
    day: 'Day 3',
    time: '11:42',
    title: 'Sam replies. Everything stops.',
    text: 'Any reply pauses the sequence at once, so Sam never gets an automated nudge after answering. The owner is pinged with the whole thread.',
    channel: 'Reply',
    msg: { kind: 'in', meta: 'Reply from Sam', text: 'This is useful. Could we talk on Thursday?' },
  },
  {
    id: 'booked',
    day: 'Day 3',
    time: '11:44',
    title: 'Call booked, source kept',
    text: 'The opportunity moves to Booked, reminders go out, and the report credits the campaign that brought Sam in, not just “direct”.',
    channel: 'Calendar',
    msg: { kind: 'win', text: 'Booked · Thu 10:30 · credited to google / cpc / spring-audit' },
  },
];

export interface Offer {
  readonly id: 'audit' | 'nurture' | 'outbound' | 'attribution' | 'care';
  readonly name: string;
  readonly bestFor: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

/** decisions.md › funnels › Offers to show. Order follows the brief's ladder. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Funnel audit',
    bestFor: 'Leads come in, but you can’t see where they go cold.',
    description: 'I map every lead source into your CRM and through follow-up, find the leaks, and hand you a written plan.',
    serviceType: 'Marketing automation audit',
    gets: ['Lead-flow map', 'Leaks, ranked by impact', 'Written plan with a cost range'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'nurture',
    name: 'Nurture system',
    bestFor: 'You have leads and a CRM, but follow-up is manual or missing.',
    description: 'Lead capture, segmentation, email and SMS sequences, booking and reporting, built in your CRM.',
    serviceType: 'Email and SMS nurture automation',
    gets: ['Capture, tags and segments', 'Sequences that stop on reply', 'Booking and a report'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'outbound',
    name: 'Outbound engine',
    bestFor: 'You need more conversations, not just better follow-up.',
    description: leadDrift
      ? `Lead sourcing, enrichment, personalised outreach and reply handling, built on the lead-sourcing approach behind ${leadDrift.name}.`
      : 'Lead sourcing, enrichment, personalised outreach and reply handling.',
    serviceType: 'Outbound outreach automation',
    gets: ['Lead sourcing and enrichment', 'Outreach sequences', 'Reply detection and routing'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'attribution',
    name: 'Attribution setup',
    bestFor: 'You can’t say which channel or email actually books calls.',
    description: 'UTMs and first-touch source captured on every lead, mapped into your CRM, with booked calls by channel.',
    serviceType: 'Lead source attribution setup',
    gets: ['Source and UTM capture', 'CRM field mapping', 'Booked calls by channel'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'care',
    name: 'Care plan',
    bestFor: 'It runs today and you want someone watching it next month too.',
    description: 'Monitoring, deliverability checks and a monthly round of fixes and improvements.',
    serviceType: 'Marketing automation monitoring and optimisation',
    gets: ['Monitoring and alerts', 'Deliverability checks', 'Monthly improvements'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

/** "What every build includes" (brief §4 item 8). `icon` keys map to inline SVGs in Included.astro. */
export const INCLUDED = [
  {
    icon: 'shield',
    title: 'Deliverability first',
    text: 'SPF, DKIM and DMARC set up on your sending domain before the first email goes out, and volumes kept sensible.',
  },
  {
    icon: 'exit',
    title: 'Consent and quiet hours',
    text: 'One-click unsubscribe in every email, STOP for SMS, consent stored with the contact, and texts only in the lead’s business hours.',
  },
  {
    icon: 'pause',
    title: 'Stops on reply',
    text: 'Any reply pauses the sequence and alerts a person. Nobody gets a robot nudge after answering.',
  },
  {
    icon: 'pin',
    title: 'Attribution',
    text: 'First-touch source and UTMs on every lead, mapped into CRM fields you can report on.',
  },
  {
    icon: 'chart',
    title: 'Reporting',
    text: 'Leads to booked calls, by source and by sequence, so you can see which emails earn their place.',
  },
  {
    icon: 'doc',
    title: 'Documentation',
    text: 'A map of every flow, tag and trigger, and every account in your name at handover.',
  },
] as const;

/** Steps in order (brief §4 item 9): Audit → Map → Build → Optimize. */
export const PROCESS = [
  {
    title: 'Audit',
    text: 'A free 30-minute scoping call; for bigger setups, an audit of where leads come from and where they stall.',
    leaves: 'A written plan and a cost range',
  },
  {
    title: 'Map',
    text: 'Every trigger, tag, message and exit drawn out before anything is built. You approve the map and supply the copy.',
    leaves: 'A flow map you sign off',
  },
  {
    title: 'Build',
    text: 'Built in your accounts, deliverability first, and tested end to end with test leads before a real one touches it.',
    leaves: 'Live flows, in your name',
  },
  {
    title: 'Optimize',
    text: 'We watch what actually books calls and adjust timing, routing and segments. A care plan keeps me on it.',
    leaves: 'A report you can act on',
  },
] as const;

export const ABOUT = {
  // "runs his own funnel" is true only with an own lead system on the page (Lead Drift or the pipeline).
  // The pronoun is config.ts › pronouns (default "their").
  title: HAS_OWN_PIPELINE ? `An engineer who runs ${pronoun('possessive')} own funnel.` : 'An engineer who builds the whole funnel.',
  paragraphs: [
    // The second sentence is config.ts › originStories.funnels, left out when unset.
    sentences(`I’m ${FIRST_NAME}, ${ROLE_IN_SENTENCE} of ${PERSON.company}.`, originStory('funnels')?.text),
    ...(leadDrift
      ? [
          `${leadDrift.name}, the outbound system on this page, is the one I use to find work for my own company, so I build follow-up the way I need it to behave: fast, polite, and measured from first click to booked call.`,
        ]
      : []),
    'I build the system; you supply the words. I don’t write sales copy, but I will tell you where a message is missing.',
  ],
} as const;

export const FAQ = [
  {
    q: 'Which tools do you work in?',
    a: 'GoHighLevel, n8n, Make and Zapier. If your CRM or email platform is something else, such as HubSpot, ActiveCampaign or Klaviyo, I connect it through one of those tools or its API where it has one. We check your exact setup on the scoping call before anything is agreed.',
  },
  {
    q: 'Will automated follow-up hurt my email reputation?',
    a: 'Done carelessly, it can. Every build starts with deliverability: SPF, DKIM and DMARC on your sending domain, sensible daily volumes, an unsubscribe link in every email, and sequences that stop the moment someone replies.',
  },
  {
    q: 'Do you write the emails and texts?',
    a: 'No. I build the system and you supply the copy. I map every message slot so it is clear what is needed, and I will flag a step that is missing a message or sending the wrong one.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on your tools, lead sources and how many flows are involved, so I scope it on a free 30-minute call. The scope and price are agreed in writing before work starts.',
  },
  {
    q: 'How fast will I see results?',
    a: 'Flows start working the day they go live, but how quickly the numbers mean something depends on your lead volume. We agree on the call what to measure and when to review it, rather than me promising a figure.',
  },
  {
    q: 'Who owns the lists, flows and data?',
    a: 'You do. I build in your accounts, every contact list and workflow stays there, and at handover every login is in your name.',
  },
  {
    q: 'What about GDPR and CAN-SPAM?',
    a: 'I build the mechanics in: consent captured and stored with the contact, unsubscribe and STOP handling, a real sender address, and data you can delete on request. Whether your business is compliant is a question for you and your legal adviser; I’m not a lawyer.',
  },
  {
    q: 'I already have a CRM full of old contacts. Can you use them?',
    a: 'Often, carefully. Old lists are where deliverability problems come from, so we look at consent and age first and decide together whether to re-engage, clean or leave them.',
  },
] as const;
