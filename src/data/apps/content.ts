/**
 * Copy for the apps home page. Kept as data so the same text feeds the markup and the
 * JSON-LD (FAQPage, Service) and cannot drift.
 *
 * Rules (docs/brief/DECISIONS.md › apps):
 *  - no prices anywhere: "scoped on a call"
 *  - farazahmad.dev numbers are the only measured ones (Lighthouse 2 Oct 2026, 257 tests 6 Oct 2026)
 *  - SolidMake / Yard Terminal numbers are missing: visible TODO chips, never figures
 *  - the Spec → shipped player is an example project and says so
 * Case studies live in ./cases.ts.
 */
import type { Diagram } from './cases';

export const PRICE_LINE = 'Scoped on a call';
export const CALL_PROMISE = 'You’ll leave the call knowing what v1 should include, and what building it involves';

export const HERO = {
  eyebrow: 'App development · Faraz Ahmad',
  /** decisions.md › apps › Hero headline. The second line gets the ink-blue underline. */
  headline: ['Products that ship —', 'and keep shipping.'],
  accent: 'keep shipping.',
  lede: 'I’m a senior full-stack engineer. I take a product from spec to production: MVPs, SaaS and APIs, built in your repo with tests, CI and a demo every week, so v2 is the next step, not a rewrite.',
  primary: 'Book a scoping call',
  secondary: 'See how SolidMake was built',
  note: 'Free 30-minute call. No price list: scope and cost are agreed on the call.',
} as const;

/** Proof strip. Each value is measured and dated, or the owner's own statement. */
export const PROOF = [
  { value: '3+ yrs', label: 'Of full-stack engineering, including as a senior full-stack team lead' },
  { value: '257', label: 'Tests passing on farazahmad.dev, my own production Next.js app (6 Oct 2026)' },
  { value: '100', label: 'Lighthouse Accessibility, Best Practices and SEO on its home page (2 Oct 2026)' },
  { value: 'CLS 0', label: 'No layout shift in the same run; Performance 93–95 mobile, 100 desktop' },
] as const;
export const PROOF_NOTE = 'Lighthouse 13.5 on a local production build of farazahmad.dev.';

/** The problem: the fears from the brief as struck revision notes, each answered in ink. */
export const PROBLEM = {
  title: 'Most MVPs die in the rewrite.',
  body: 'The first version gets built fast, then nobody can change it: no tests, no docs, a repo you can’t see, an architecture that only made sense to the person who left. Six months on, the choice is a rewrite or a stall.',
  resolution: 'I build v1 like it will have a v2.',
  revisions: [
    { issue: 'The agency went quiet mid-build', fix: 'A working demo every week, on a staging link you can click' },
    { issue: 'Scope crept and the budget went with it', fix: 'Fixed scope per cycle; a change is sized and priced before it’s built' },
    { issue: 'Code nobody else can maintain', fix: 'Tests, docs and a common stack the next engineer already knows' },
    { issue: 'No access to our own repo', fix: 'Your GitHub organisation and accounts from the first commit' },
    { issue: 'The MVP can’t take real users', fix: 'The data model and architecture drawn before anything is built' },
  ],
} as const;

/**
 * Signature: Spec → shipped (brief §4 item 4) as an in-place player. The project is an
 * example (a booking app for a clinic); the section labels it.
 */
export interface SpecStep {
  readonly id: 'sketch' | 'schema' | 'arch' | 'ui' | 'deploy';
  readonly phase: string;
  readonly title: string;
  readonly text: string;
}
export const SPEC_STEPS: readonly SpecStep[] = [
  {
    id: 'sketch',
    phase: 'Product sprint',
    title: 'Sketch the screens',
    text: 'We sketch the key screens together. Rough is fine: the point is deciding what v1 does, and what it doesn’t.',
  },
  {
    id: 'schema',
    phase: 'Product sprint',
    title: 'Write down the data',
    text: 'The data model comes first, because it’s the hardest thing to change later. Every table, field and relation, on paper.',
  },
  {
    id: 'arch',
    phase: 'Product sprint',
    title: 'Draw the system',
    text: 'What runs where, what talks to what, and what happens when one part fails. You get this drawing with the fixed quote.',
  },
  {
    id: 'ui',
    phase: 'Build cycles',
    title: 'Build it, demo it weekly',
    text: 'Built in two-week cycles and demoed every week on a staging link, so you see the real thing while it can still change cheaply.',
  },
  {
    id: 'deploy',
    phase: 'Launch',
    title: 'Ship through CI',
    text: 'Every change runs types, tests and a preview before production. Shipping becomes routine, which is how it keeps happening.',
  },
];

/** Step 3 of the player: the example app's architecture, drawn with the same renderer as the cases. */
export const SPEC_ARCH: Diagram = {
  cols: 3,
  rows: 2,
  stages: ['Clients', 'Server', 'Data and services'],
  source: 'Example project',
  nodes: [
    { id: 'web', label: 'Booking app', sub: 'Next.js', col: 0, row: 0, tone: 'io' },
    { id: 'api', label: 'API', sub: 'Node.js', col: 1, row: 0, tone: 'core' },
    { id: 'db', label: 'Database', sub: 'MongoDB', col: 2, row: 0, tone: 'core' },
    { id: 'admin', label: 'Clinic admin', sub: 'Next.js', col: 0, row: 1, tone: 'gate' },
    { id: 'jobs', label: 'Job queue', sub: 'reminders', col: 1, row: 1, tone: 'core' },
    { id: 'msg', label: 'Email · SMS', sub: 'provider API', col: 2, row: 1, tone: 'ext' },
  ],
  edges: [
    { from: 'web', to: 'api' },
    { from: 'api', to: 'db' },
    { from: 'admin', to: 'api' },
    { from: 'api', to: 'jobs' },
    { from: 'jobs', to: 'msg', label: 'retry on fail' },
  ],
};

export interface Offer {
  readonly id: 'sprint' | 'mvp' | 'feature' | 'rescue' | 'retainer';
  readonly name: string;
  readonly bestFor: string;
  readonly description: string;
  readonly serviceType: string;
  readonly gets: readonly [string, string, string];
  readonly priceLine: string;
}

/** decisions.md › apps › Offers to show, in the brief's ladder order. */
export const OFFERS: readonly Offer[] = [
  {
    id: 'sprint',
    name: 'Product sprint',
    bestFor: 'An idea or a rough spec that needs to become a plan you can fund.',
    description: 'One to two weeks: a written spec, the architecture, a clickable prototype, and a fixed quote for the build.',
    serviceType: 'Product discovery and technical specification',
    gets: ['Written spec and data model', 'Architecture drawing', 'Clickable prototype and a fixed quote'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'mvp',
    name: 'MVP build',
    bestFor: 'A defined v1 that has to reach real users.',
    description: 'A fixed-scope first version, built in two-week cycles with a demo every week, and deployed.',
    serviceType: 'MVP development',
    gets: ['Fixed scope, agreed in writing', 'Weekly demo on staging', 'Deployed, with CI and tests'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'feature',
    name: 'Feature / API build',
    bestFor: 'A product that already runs and needs one more thing done properly.',
    description: 'A new feature, an integration or a public API, added to the product you already have.',
    serviceType: 'Feature and API development',
    gets: ['Fits your codebase’s conventions', 'Tests for everything added', 'API docs your partners can use'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'rescue',
    name: 'Code rescue',
    bestFor: 'A stalled or messy codebase, or a developer who disappeared.',
    description: 'I take it over: audit it, stabilise it, then keep building.',
    serviceType: 'Codebase audit and rescue',
    gets: ['A written audit first', 'Tests around the risky parts', 'A plan to continue'],
    priceLine: PRICE_LINE,
  },
  {
    id: 'retainer',
    name: 'Retainer',
    bestFor: 'A live product that needs a senior engineer every month.',
    description: 'Ongoing development: an agreed number of days each month, priorities set by you.',
    serviceType: 'Ongoing product development retainer',
    gets: ['Agreed days each month', 'A standing weekly demo', 'Priorities set by you'],
    priceLine: 'Monthly, scoped on a call',
  },
];

/** "What you always get" (brief §4 item 7), as six items so the grid fills 3×2. */
export const INCLUDED = [
  { key: 'repo', title: 'Your repo from day one', text: 'The code lives in your GitHub organisation from the first commit. You can read every line as it lands.' },
  { key: 'ci', title: 'CI/CD', text: 'Every push runs types, lint and tests; every merge deploys. Nobody ships from a laptop.' },
  { key: 'tests', title: 'Tests', text: 'Tests around the parts that matter: money, data, permissions, and anything that broke once.' },
  { key: 'staging', title: 'A staging environment', text: 'A copy of production to click through before anything goes live, with its own data.' },
  { key: 'demo', title: 'A weekly demo', text: 'A short call and a link each week: what shipped, what’s next, what needs your decision.' },
  { key: 'docs', title: 'Docs and handover', text: 'How to run it, deploy it and change it, written down, with every account in your name.' },
] as const;

/** Brief §4 item 8: Sprint → Build in 2-week cycles → Launch → Support. */
export const PROCESS = [
  {
    title: 'Sprint',
    text: 'A free scoping call, then a product sprint: spec, data model, architecture and a clickable prototype.',
    leaves: 'A fixed quote for v1',
  },
  {
    title: 'Build in 2-week cycles',
    text: 'Each cycle starts with an agreed scope and ends deployed to staging, with a demo every week in between.',
    leaves: 'Working software, every cycle',
  },
  {
    title: 'Launch',
    text: 'Production deploy, monitoring and error tracking switched on, and a checklist run before real users arrive.',
    leaves: 'A live product you own',
  },
  {
    title: 'Support',
    text: 'A clean handover, or a retainer where I keep shipping. Many products need both.',
    leaves: 'Docs, access, a roadmap',
  },
] as const;

/**
 * Comparison (brief §4 item 9). Qualitative and typical, never a claim about a named firm;
 * the section says so.
 */
export const COMPARE = {
  cols: ['Me', 'Agency', 'Low-cost freelancer', 'Hiring in-house'],
  rows: [
    {
      label: 'Who writes the code',
      cells: ['Me, with my team at Indepth Solution', 'Often a team you never meet', 'Varies by person', 'Your employee'],
    },
    {
      label: 'Your repo and accounts',
      cells: ['Yours from day one', 'Often handed over at the end', 'Often on their account', 'Yours'],
    },
    {
      label: 'Tests, CI and docs',
      cells: ['In every build', 'Depends on the contract', 'Often skipped', 'Depends on the hire'],
    },
    {
      label: 'Time to start',
      cells: ['After a scoping call', 'After sales and onboarding', 'Usually quick', 'After recruiting'],
    },
    {
      label: 'Commitment',
      cells: ['Per sprint, or a retainer', 'A contract', 'Per task', 'Salary and benefits'],
    },
    {
      label: 'Best for',
      cells: ['A product that has to keep shipping', 'Big projects across many disciplines', 'Small, well-defined tasks', 'A long-term core team'],
    },
  ],
  note: 'Typical, not universal. Plenty of agencies and freelancers do excellent work; this is how the options usually differ.',
} as const;

export const ABOUT = {
  title: 'You work with the engineer, not an account manager.',
  paragraphs: [
    'I’m Faraz, founder of Indepth Solution, based in Lahore. I’ve worked in full-stack engineering across three roles in three offices, including as a senior full-stack team lead.',
    'The products on this page are ones I built or led: Yard Terminal, a multi-channel commerce product from Indepth Solution, the company I founded; SolidMake, my final-year project, turning text into CAD; and farazahmad.dev, my own site, held to the same tests and checks as client work.',
    'No account managers in between: you work with me directly, from the scoping call to the code in your repo.',
  ],
} as const;

export const FAQ = [
  {
    q: 'Fixed price or time and materials?',
    a: 'Both, depending on what is known. The product sprint ends in a fixed quote for a defined v1. Open-ended work after launch runs as a retainer. Either way, scope and price are agreed in writing before work starts.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes. The repo lives in your GitHub organisation from the first commit, and every account (hosting, database, email) is in your name. At handover nothing depends on me.',
  },
  {
    q: 'What stack do you use, and why?',
    a: 'Usually Next.js and React on the front, Node.js or Python behind it, MongoDB for data and TypeScript throughout, deployed on Vercel. It is common enough that the next engineer can pick it up. If your product needs something else, we decide that on the call.',
  },
  {
    q: 'Can you take over an existing codebase?',
    a: 'Yes, that is the code rescue offer. I audit it first, put tests around the risky parts, then continue. You get the written audit before any big change is made.',
  },
  {
    q: 'How do you handle scope changes?',
    a: 'Changes are welcome; surprises are not. A new idea is written down, sized and priced before it is built, then goes into the next cycle or replaces something of the same size.',
  },
  {
    q: 'What happens after launch?',
    a: 'Either a clean handover (docs, access and a walkthrough) or a retainer where I keep shipping. Many products need both: a handover now and occasional help later.',
  },
  {
    q: 'Can you work with my designer or my team?',
    a: 'Yes. I build from your designer’s Figma files, review pull requests from your developers, or work inside your existing repo and process.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on scope, so I do not publish prices. We scope it on a free 30-minute call, and the product sprint ends in a fixed quote for the build.',
  },
] as const;
