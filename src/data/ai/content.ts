/**
 * Copy for the home sections that are plain content (spec §5.3, §5.6-§5.9, §5.11).
 * Kept as data so the same text feeds the markup and the JSON-LD (FAQPage,
 * Service) and cannot drift. No prices anywhere; no invented figures.
 */

export const PRICE_LINE = 'Fixed scope, agreed before work starts';
export const CALL_PROMISE = "You'll leave the call with a clear plan and a cost range";

export const PROBLEM = {
  title: "Your AI pilot isn't failing because AI doesn't work.",
  body: "It's failing on the boring parts: messy inputs, no error handling, and nobody watching it once the demo is over.",
  resolution: "That's the part I build first.",
  logTitle: 'What usually goes wrong',
  incidents: [
    {
      tag: 'warn',
      title: 'Tools bought, nothing in production.',
      text: 'The licences renew. The pilot is still in a sandbox.',
    },
    {
      tag: 'fail',
      title: 'Automations that break quietly.',
      text: 'A step stopped running and nobody noticed until a customer did.',
    },
    {
      tag: 'warn',
      title: 'Nobody owns it.',
      text: 'The person who built it left, and no one knows how it works.',
    },
  ],
} as const;

/**
 * "What I build, and who it's for" (home): plain-language kinds of system, each tied to a
 * real build on this site. `example` is a case slug from src/data/ai/cases.ts.
 */
export interface Capability {
  readonly title: string;
  readonly text: string;
  readonly forWhom: string;
  readonly example: 'lead-drift' | 'yard-terminal' | 'solidmake' | 'ai-seo-automator';
}

export const CAPABILITIES: readonly Capability[] = [
  {
    title: 'Lead and outreach systems',
    text: 'Prospects found, contacted and followed up on a schedule, so the pipeline does not depend on someone remembering to do it.',
    forWhom: 'Founders and small sales teams',
    example: 'lead-drift',
  },
  {
    title: 'AI that drafts, people who approve',
    text: 'The model writes the listing, the reply or the record. A person approves it before anything goes out.',
    forWhom: 'Ops teams buried in repetitive data entry',
    example: 'yard-terminal',
  },
  {
    title: 'Custom AI where no-code stops',
    text: "When a Zapier or n8n flow can't do the job: custom models and Python, built to run inside your product.",
    forWhom: 'Products that need AI as a real feature',
    example: 'solidmake',
  },
  {
    title: 'Content and SEO pipelines',
    text: 'Audit, research, write and publish on a schedule, on your own AI key, with a score that shows whether it is working.',
    forWhom: 'Site owners and marketing teams',
    example: 'ai-seo-automator',
  },
];

/**
 * How many trailing diagram nodes of a case run side by side rather than in sequence.
 * Yard Terminal publishes to eBay Motors and Shopify at the same time, so drawing them as
 * "eBay Motors → Shopify" would be wrong. Lives here until cases.ts carries `diagram.fanOut`
 * (requested from the data owner); read it through fanOutOf().
 */
const CASE_FAN_OUT: Readonly<Record<string, number>> = { 'yard-terminal': 2 };

export function fanOutOf(study: { slug: string; diagram: object }): number {
  const own = (study.diagram as { fanOut?: unknown }).fanOut;
  return typeof own === 'number' ? own : (CASE_FAN_OUT[study.slug] ?? 0);
}

export interface Offer {
  readonly id: 'audit' | 'build' | 'rescue' | 'care';
  readonly name: string;
  /** Plain "pick this if" line, so a first-time visitor knows which path is theirs. */
  readonly bestFor: string;
  /** Short description reused as the Service JSON-LD description. */
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
  readonly cta: string;
}

export const OFFERS: readonly Offer[] = [
  {
    id: 'audit',
    name: 'Automation Audit',
    bestFor: "You know something should be automated, but not what to start with.",
    description:
      'I map how work moves through your team today and find the 2–3 automations worth building first.',
    serviceType: 'Automation audit',
    gets: ['Workflow map', 'Ranked opportunities', 'Written plan with costs'],
    priceLine: PRICE_LINE,
    cta: 'Start with an audit',
  },
  {
    id: 'build',
    name: 'Build',
    bestFor: 'You know the workflow and want it running, properly, in your accounts.',
    description:
      'One system, built to the production checklist. For example: lead intake → enrichment → CRM → alerts.',
    serviceType: 'AI and workflow automation development',
    gets: ['Working system in your accounts', 'Runbook', 'Handover call'],
    priceLine: PRICE_LINE,
    cta: 'Book a scoping call',
  },
  {
    id: 'rescue',
    name: 'Rescue',
    bestFor: 'Something already exists and it keeps breaking, or never got finished.',
    description:
      'A broken or stalled automation or AI pilot, made reliable. Zapier, Make, n8n or custom code.',
    serviceType: 'Automation repair',
    gets: ['Diagnosis', 'Fixes', 'Logging and alerts added'],
    priceLine: PRICE_LINE,
    cta: 'Fix my automation',
  },
  {
    id: 'care',
    name: 'Care plan',
    bestFor: 'It works today and you want someone watching it next month too.',
    description:
      'Monitoring, fixes, small changes and model/API updates, every month. Cancel any time.',
    serviceType: 'Automation monitoring and maintenance',
    gets: ['Monitoring', 'Fixes', 'Monthly changes'],
    priceLine: 'Monthly, scoped on a call',
    cta: 'Book a scoping call',
  },
];

export const CHECKLIST = [
  {
    code: 'RETRY',
    title: 'Error handling & retries',
    text: 'Every external call has a timeout, retries with backoff, and a place for failures to land. Nothing fails silently.',
  },
  {
    code: 'HUMAN',
    title: 'Human override',
    text: 'A person can pause, approve or correct any automated decision, and low-confidence cases go to a person by default.',
  },
  {
    code: 'LOGS',
    title: 'Logging & alerts',
    text: 'Every run is logged, and failures alert a named person where your team already works.',
  },
  {
    code: 'COST',
    title: 'Cost caps',
    text: "Hard limits on model and API spend per run and per day, so a loop can't run up a bill.",
  },
  {
    code: 'FALLBACK',
    title: 'Model fallback',
    text: 'If a model is down or returns junk, the step falls back to a second provider or a safe default.',
  },
  {
    code: 'ACCESS',
    title: 'Permissions',
    text: 'Least-privilege API keys per system, stored as secrets, never pasted into a workflow.',
  },
  {
    code: 'DATA',
    title: 'Data retention',
    text: 'Personal data is kept only as long as the workflow needs it, then deleted on a schedule we agree.',
  },
  {
    code: 'HANDOVER',
    title: 'Handover docs',
    text: 'A plain-language runbook, the architecture diagram, and every account in your name.',
  },
] as const;

/** Steps in order; the page shows order with the wire, never with printed numbers. */
export const PROCESS = [
  {
    title: 'Scope',
    text: 'A free 30-minute call. You leave with a clear yes or no, a plan and a cost range.',
    leaves: 'A plan and a cost range',
  },
  {
    title: 'Plan',
    text: 'For bigger or unclear jobs, an audit first: a written plan with fixed scope and costs.',
    leaves: 'Fixed scope, in writing',
  },
  {
    title: 'Build',
    text: 'Weeks, not months. I build in your accounts and show it running as it comes together.',
    leaves: 'A working system you own',
  },
  {
    title: 'Run',
    text: 'It goes live with logging and alerts. Your team runs it, or a care plan keeps me on it.',
    leaves: 'Logs, alerts and a runbook',
  },
] as const;

export const COMPARISON = {
  columns: ['Me (Faraz)', 'Typical agency', 'No-code freelancer'],
  rows: [
    {
      criterion: 'Who builds it',
      cells: [
        'The senior engineer you talk to, from call to handover',
        'A team; you mostly talk to an account manager',
        'One person, usually inside one no-code tool',
      ],
    },
    {
      criterion: 'Speed to first live version',
      cells: [
        'Weeks, with working demos along the way',
        'Often longer: discovery and hand-offs between roles',
        'Fast for simple flows; slows when logic gets complex',
      ],
    },
    {
      criterion: 'Price',
      cells: [
        'Fixed scope, agreed before work starts; scoped on a call',
        'Usually higher; retainers are common',
        'Usually lowest up front; often hourly',
      ],
    },
    {
      criterion: 'Code & account ownership',
      cells: [
        'Yours from day one: code, accounts, data',
        'Varies; check the contract',
        "Often built in the freelancer's own accounts",
      ],
    },
    {
      criterion: 'Monitoring',
      cells: [
        'Logging and alerts in every build; care plan optional',
        'Usually available, often as a retainer',
        'Rarely included',
      ],
    },
    {
      criterion: 'Handover',
      cells: [
        'Runbook, diagram, accounts in your name',
        'Usually documented',
        'Often minimal',
      ],
    },
    {
      criterion: 'When no-code hits its limits',
      cells: [
        'I write the custom code (Python, Next.js)',
        'Can, through a dev team',
        'Usually workarounds',
      ],
    },
  ],
} as const;

export const FAQ = [
  {
    q: "We already tried AI and it didn't work. Why would this?",
    a: 'Most pilots stall on the unglamorous parts: messy inputs, no error handling, and nobody watching after launch. I start with one workflow and its current baseline, build the production pieces first, and show it running before we call it done.',
  },
  {
    q: 'What does it cost, and is it fixed?',
    a: "Yes, it's fixed. Cost depends on the systems involved, so I scope it with you on a free 30-minute call, and you leave with a clear plan and a cost range. The final scope and price are agreed in writing before work starts.",
  },
  {
    q: 'What happens when an API or model changes and it breaks?',
    a: 'Every build logs its runs and alerts on failures, and model steps have a fallback, so a change shows up as an alert, not as silent bad data. On a care plan I handle the fix. Without one, you have the runbook, or you can bring me back for a fixed-scope fix.',
  },
  {
    q: 'Who owns the code, the accounts and the data?',
    a: 'You do. I build in your accounts, under your own API keys, and any custom code lives in your repository. At handover every credential is in your name.',
  },
  {
    q: 'Is my data sent to OpenAI or used for training?',
    a: "Only the fields a step actually needs go to a model, and I use the providers' APIs, not consumer chat apps. OpenAI and Anthropic say API data isn't used for training by default; check their current terms for your case. Where data is sensitive I mask it or keep that step off the model entirely.",
  },
  {
    q: 'No-code (Zapier, Make, n8n) or custom code: which do I need?',
    a: "Most systems start in n8n, Make or Zapier because they're quick to change and easy to hand over. I move a step to custom code in Python or Next.js when it needs heavy logic, high volume or tight cost control. We decide step by step on the scoping call.",
  },
  {
    q: 'How long until something is live?',
    a: 'It depends on scope, so we set the timeline on the scoping call and it goes in the written plan. I ship in stages, so you see something running early rather than everything at the end.',
  },
  {
    q: 'Do I need a care plan?',
    a: 'No. Every build ships with logging, alerts and a runbook so your team can run it. A care plan suits you if you want someone watching it, fixing breaks and making small changes each month, and you can cancel any time.',
  },
] as const;
