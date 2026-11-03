/**
 * Case studies for the ghl niche: the home cards and the /work/<slug>/ pages.
 *
 * Sources (nothing else):
 *  - decisions.md › ghl › Real numbers per case: saved to MongoDB first, then sent to
 *    GoHighLevel through its API; contact upsert by email; tags incl. niche:<slug>; a note;
 *    an open opportunity; failed sends retried from admin
 *  - docs/research/ai-local.md: the API is called with a Private Integration Token
 * Lead-delivery numbers are open, so there are none: a visible TODO chip says so.
 *
 * `account-teardown` is an EXAMPLE (decisions: client stories are open). It is labelled as
 * illustrative everywhere it appears and describes method, never results.
 */

export const CASE_SLUGS = ['lead-pipeline', 'account-teardown'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export interface GhlCase {
  readonly id: CaseSlug;
  readonly name: string;
  readonly kicker: string;
  /** One-line angle: card subtitle and the case page's lead line. */
  readonly title: string;
  /** Two or three plain sentences. */
  readonly text: string;
  readonly status: string | null;
  /** True for an illustrative case: shown with an "Example" tape everywhere. */
  readonly example: boolean;
  /** The flow, in order. */
  readonly flow: readonly string[];
  readonly facts: readonly string[];
  readonly problem: { readonly title: string; readonly text: string };
  readonly built: readonly { readonly title: string; readonly text: string }[];
  readonly runsNow: { readonly label: string; readonly text: string };
  /** Something the owner still has to supply (rendered as a dashed chip). */
  readonly pending?: string;
  readonly seo: { readonly title: string; readonly description: string };
}

export const CASES: readonly GhlCase[] = [
  {
    id: 'lead-pipeline',
    name: 'farazahmad.dev → GoHighLevel',
    kicker: 'Custom integration · main case',
    title: 'Every form lead lands in GoHighLevel, labelled, and nothing is lost.',
    text: 'My own sites don’t use a GoHighLevel form. Each lead is saved to MongoDB first, then sent to GoHighLevel through its API: the contact is upserted by email, tagged with the site it came from, and given a note and an open opportunity. If a send fails, it can be retried from my admin.',
    status: 'Live on every form',
    example: false,
    flow: ['Form posted', 'Saved to MongoDB', 'Contact upserted', 'Tags incl. niche:<slug>', 'Note added', 'Open opportunity'],
    facts: [
      'Saved to MongoDB first, then sent through the GoHighLevel API',
      'Upserted by email: a repeat visitor stays one contact',
      'Tagged niche:<slug>, so each of my sites is its own segment',
      'Failed sends can be retried from the admin',
    ],
    problem: {
      title: 'A lead should never depend on one fragile hop',
      text: 'A form that posts straight into a CRM, or through one more connector, works until a step fails. Then nobody notices and the lead is simply gone. I wanted every lead stored on my side before anything else could go wrong, and GoHighLevel to receive a contact that arrives already labelled.',
    },
    built: [
      {
        title: 'Saved before anything else',
        text: 'The form posts to my own API, which writes the lead to MongoDB first. Whatever happens next, the lead exists.',
      },
      {
        title: 'One contact per person',
        text: 'The lead is sent to GoHighLevel through its API, authenticated with a Private Integration Token, and the contact is upserted by email rather than created, so a second enquiry updates the same person.',
      },
      {
        title: 'Labelled for routing',
        text: 'Tags are added, including niche:<slug> for the site the lead came from, with a note holding the message and an open opportunity in the pipeline.',
      },
      {
        title: 'Nothing silently lost',
        text: 'If the send to GoHighLevel fails, the lead is still in the database and can be retried from the admin.',
      },
    ],
    runsNow: {
      label: 'Where it is now',
      text: 'Live on farazahmad.dev and on these niche sites. The form at the bottom of this page goes through it and arrives tagged niche:ghl.',
    },
    pending: 'TODO · Leads delivered and send success rate from farazahmad.dev',
    seo: {
      title: 'Website to GoHighLevel Lead Pipeline (API) | Faraz Ahmad',
      description:
        'Case study: website leads saved to MongoDB, then upserted into GoHighLevel by email with niche tags, a note and an open opportunity, retried from admin.',
    },
  },
  {
    id: 'account-teardown',
    name: 'Anatomy of a messy account',
    kicker: 'Example teardown · illustrative',
    title: 'What an audit finds, and how the rewire goes.',
    text: 'An illustrative sub-account built from the faults that come up most in GoHighLevel: duplicate workflows, drafts that never fire, alerts to inboxes nobody reads. Not a client account; a walk-through of how I audit and rebuild one.',
    status: null,
    example: true,
    flow: ['Map what exists', 'Rank the faults', 'Rewire', 'Test contacts', 'Handover'],
    facts: [
      'Every trigger, workflow, stage and alert drawn as it actually runs',
      'Faults ranked by risk before anything is switched off',
      'Rewired as one trigger, one workflow, one job',
    ],
    problem: {
      title: 'Nobody can say what happens when a lead comes in',
      text: 'The names say one thing and the account does another. Two workflows answer the same form, the booking confirmation is still a draft, and the hot-lead alert goes to someone who left. Each fault is small; together they decide whether a lead is answered.',
    },
    built: [
      {
        title: 'Map what is really there',
        text: 'A read-only pass over every trigger, workflow, pipeline stage and notification, drawn as it actually fires, not as the names suggest.',
      },
      {
        title: 'Rank the faults',
        text: 'Each fault gets a risk: double sends and dead alerts first, cosmetic naming last. Nothing is switched off until we agree the order.',
      },
      {
        title: 'Rewire, one job per workflow',
        text: 'One trigger starts one workflow; workflows are numbered and named by purpose; one pipeline replaces the near-copies.',
      },
      {
        title: 'Test with test contacts',
        text: 'Every path run end to end with a test contact, with error notifications wired, before a real lead touches it.',
      },
      {
        title: 'Hand it over',
        text: 'A map, the naming scheme and a recorded walkthrough, so the next person can read the account without me.',
      },
    ],
    runsNow: {
      label: 'What you get at the end',
      text: 'A map of the account, a ranked fix list, the rewired workflows, and a recorded walkthrough of your own account.',
    },
    pending: 'TODO · Replace with a real anonymized client teardown and screenshots',
    seo: {
      title: 'GoHighLevel Account Audit: Example Teardown | Faraz Ahmad',
      description:
        'An illustrative GoHighLevel sub-account teardown: duplicate workflows, drafts that never fire, dead alerts, and how an audit and rewire fixes them.',
    },
  },
];

export const getCase = (slug: string): GhlCase | undefined => CASES.find((c) => c.id === slug);

/** Next case in a fixed ring. */
export function nextCase(slug: CaseSlug): GhlCase {
  const i = CASES.findIndex((c) => c.id === slug);
  const next = CASES[(i + 1) % CASES.length];
  if (!next) throw new Error(`[ghl] no case after ${slug}`);
  return next;
}

/**
 * What GoHighLevel receives for one lead (example contact; field names are the real steps).
 * Rendered on the pipeline case page as a record.
 */
export const GHL_RECORD = [
  ['contact', 'upsert by email · sam@northwind.example'],
  ['tags', 'niche:ghl'],
  ['note', 'the message from the form'],
  ['opportunity', 'status: open'],
] as const;
