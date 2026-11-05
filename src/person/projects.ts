/**
 * PROJECTS: the person's real projects, each stored ONCE. Two ways a project reaches a niche:
 *
 *  1. A hand-written angle: a `fromProject('<id>', angle)` block in src/data/<slug>/cases.ts, with
 *     the niche's own framing (kicker, title, problem, built list, runsNow, pending, seo...).
 *  2. NO CODE: list the niche in the project's `niches`. Every niche has one adapter
 *     (`autoCases()` in its cases.ts, see ./case-helpers.ts) that builds that niche's own case
 *     object for each project whose `niches` includes the slug and that has no hand-written angle
 *     there, in registry order. The wording comes from `angles[slug]` when set, else from the
 *     canonical fields (cardTitle, summary, modules, ...). Those cases get the same /work/<id>/
 *     page, OG image, JSON-LD and sitemap entry as hand-written ones, and render in the niche's
 *     "More builds" section.
 *
 * What belongs here: facts that are true of the project wherever it is shown, and text that is
 * IDENTICAL across niches (name, link, verified status, stack, the canonical module list). A
 * niche's own wording for a project with no hand-written angle goes in `angles[slug]`.
 *
 * Honesty (docs/TEMPLATE.md › honesty rules): every value is a verified fact from the person's own
 * records. Unknown = leave the field out (the niche then shows a dashed `TODO ·` chip or drops the
 * line). Never put an estimate, a sample figure or a placeholder here. `notes` are caveats every
 * niche prints wherever the case is shown in full (its case page). No client names, people's names
 * or client domains anywhere (`npm run check:leaks` fails on the blocklist in scripts/).
 *
 * A NEW PERSON: delete every entry below and add your own. Keep the ids your niches' hand-written
 * angles refer to only if you really have that project. A niche whose angle names a project that
 * is missing here omits that case (or shows a labelled Example / TODO slot); it never renders
 * someone else's project. Extend `ProjectId` with your own ids.
 *
 * Pure TS on purpose (Node-loadable, no Astro imports, no image imports). Screenshots: put the
 * file at src/person/assets/projects/<id>.png (or .jpg/.webp) and set `screenshot.alt`; the
 * shared resolver (src/person/shots.ts, Astro only) finds it by id. The older per-niche copies
 * listed in `screenshot.copies` stay imported by their niches.
 *
 * Sources: project-handoff/projects.json (code scan of 2026-11-05 plus owner-supplied links and
 * screenshots), docs/research/ai-local.md §4, docs/research/ai-web.md §1, docs/brief/DECISIONS.md,
 * and the reviewed copy in src/data/<slug>/cases.ts.
 */
import type { NicheSlug } from '../niches.ts';

/** Every project id a niche angle may refer to. A new person replaces these with their own. */
export type ProjectId =
  | 'ai-seo-automator'
  | 'yard-terminal'
  | 'solidmake'
  | 'lead-drift'
  | 'farazahmad-dev'
  | 'lead-pipeline'
  | 'sluice'
  | 'team-task-saas'
  | 'audio-splitting-saas'
  | 'ghl-crm-dashboard'
  | 'ghl-kpi-dashboard'
  | 'ghl-sync-backend'
  | 'ghl-outbound-ops'
  | 'voice-ai-n8n-workflows'
  | 'ghl-conversation-ai-build'
  | 'imessage-campaign-saas'
  | 'furniture-bazar'
  | 'ai-roofing-estimator'
  | 'ai-ops-command-center'
  | 'opencode-chat'
  | 'quarry'
  | 'catalog-scraper-shopify'
  | 'indepth-dashboard'
  | 'ftp-feed-handler'
  | 'skip-trace-orchestrator';

export type ProjectKind =
  /** A product sold or offered to others. */
  | 'product'
  /** A product the person's own company runs on (not sold). */
  | 'internal'
  /** Research or study work (e.g. a final-year project). */
  | 'research'
  /** The person's own website / app. */
  | 'own-site'
  /** A subsystem of another project (see `partOf`). */
  | 'system'
  /** Work built for a client (never named: describe the client generically). */
  | 'client';

/** One module / capability of the project, in its canonical wording. */
export interface ProjectModule {
  /** Stable key a niche uses to pick it (`modules(p, ['crawl', ...])`). */
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

/** A module pick: its id, or its id plus the niche's own wording for title and/or text. */
export type ModulePick = string | { readonly id: string; readonly title?: string; readonly text?: string };

/**
 * A niche's own wording for a project that has no hand-written angle there. Every field is
 * optional: an absent one falls back to the canonical field (see `angleFor()` in case-helpers).
 * Plain strings only (no interpolation); SEO strings are checked for length at build time.
 */
export interface ProjectAngle {
  /** Eyebrow / kicker above the title ("Client build · GoHighLevel"). */
  readonly kicker?: string;
  /** Card and page heading. Default: `cardTitle`, else `name`. */
  readonly title?: string;
  /** One-line angle for cards, the "next case" link and the OG image. Default: first sentence of `summary`. */
  readonly line?: string;
  readonly problemTitle?: string;
  readonly problemText?: string;
  /** Which modules, in which order, with optional rewording. Default: every module. */
  readonly modulePicks?: readonly ModulePick[];
  /** Page title core, before the ` | <name>` suffix (≤ 46 characters keeps the full name). */
  readonly seoTitle?: string;
  /** Meta description, ≤ 155 characters. */
  readonly seoDescription?: string;
}

export interface Project {
  /** Same as the record key. Also the default case slug in the niches. */
  readonly id: ProjectId;
  /** Display name, exactly as it is written everywhere. */
  readonly name: string;
  /** Card heading when it differs from `name` (generic client work: "GHL pipeline KPI dashboard"). */
  readonly cardTitle?: string;
  readonly kind: ProjectKind;
  /** `own`: the person's or their company's. `client`: built for a client (never named). */
  readonly ownership?: 'own' | 'client';
  /**
   * The niches this project appears on. Drives the generated cases: a niche lists every project
   * whose `niches` includes its slug and that has no hand-written angle there. Hand-written angles
   * render whenever the project exists (their niche is listed here for the record).
   */
  readonly niches?: readonly NicheSlug[];
  /** How strong the evidence is (from the code scan): niches may order or size cards by it. */
  readonly proof?: 'strong' | 'partial' | 'weak';
  /** The parent project, for a `system`. */
  readonly partOf?: ProjectId;
  /** Role tags ("Design · Engineering · AI"), when verified. */
  readonly role?: string;
  /** Who it is built for, one line ("Self-serve product · site owners"). */
  readonly client?: string;
  /** Verified status label ("Running in production"). Absent = unknown: niches show a TODO chip or drop it. */
  readonly status?: string;
  /** True only when the person confirmed it is live in production. */
  readonly live: boolean;
  /** Public link, when there is one. */
  readonly link?: { readonly label: string; readonly href: string };
  /** Public source repository, when the person wants it shown. */
  readonly repo?: { readonly label: string; readonly href: string };
  /** Canonical two- or three-sentence description (verified wording). */
  readonly summary?: string;
  /** Stack, with `provisional` true while it is the person's default, not confirmed per project. */
  readonly stack?: { readonly items: readonly string[]; readonly provisional: boolean };
  /** Canonical module list ("what I built"), in order. */
  readonly modules?: readonly ProjectModule[];
  /** Canonical flow, in order (diagram nodes, flow lists). */
  readonly flow?: readonly string[];
  /** Short verified fact lines, keyed so niches can pick them by name (`fact(p, 'byok')`). */
  readonly facts: Readonly<Record<string, string>>;
  /** Caveats that must be shown with the project wherever it is shown in full (case pages). */
  readonly notes?: readonly string[];
  /**
   * A real screenshot exists. `alt` is the shared alt text. The file is either in the shared
   * folder (src/person/assets/projects/<id>.<ext>, resolved by src/person/shots.ts) or, for the
   * older entries, imported per niche from the paths in `copies`.
   */
  readonly screenshot?: { readonly alt: string; readonly copies?: readonly string[] };
  /**
   * The company that makes / runs the project, exactly as the copy prints it ("Indepth
   * Solution"), when it is a company product rather than a personal one. Niches use it for
   * lines like "the company behind …" and "<company>'s own growth engine". Absent = not a
   * company product: those lines drop the project.
   */
  readonly madeBy?: string;
  /** Name of the project's own internal tool, when it has one (Lead Drift → "Leadrift"). */
  readonly toolName?: string;
  /**
   * What the internal tool does, as the screenshot caption's closing clause (lower-case start,
   * ends with a full stop). Only with `toolName`.
   */
  readonly toolText?: string;
  /** Per-niche wording for the generated case (see ProjectAngle). */
  readonly angles?: Partial<Record<NicheSlug, ProjectAngle>>;
  /** Where the facts come from (docs paths). Documentation only, never rendered. */
  readonly sources: readonly string[];
}

const HANDOFF = 'project-handoff/projects.json (code scan, 2026-11-05)';

/**
 * The registry. `Partial` on purpose: a project can be absent (a new person, or a project not
 * cleared for publishing), and every lookup has to handle that (see case-helpers.ts).
 * Order matters: generated cases follow it.
 */
export const PROJECTS: Readonly<Partial<Record<ProjectId, Project>>> = {
  'ai-seo-automator': {
    id: 'ai-seo-automator',
    name: 'AI SEO Automator',
    cardTitle: 'AI SEO automation platform',
    kind: 'product',
    ownership: 'client',
    niches: ['seo', 'ai', 'apps', 'funnels', 'wp'],
    proof: 'strong',
    role: 'Product · Engineering · AI',
    client: 'Multi-tenant SaaS · agencies and freelancers',
    // status: unknown, so absent.
    live: false,
    summary:
      'AI SEO Automator is a multi-tenant SaaS that runs an automated SEO loop for websites: audit, plan, generate, publish, track and repeat, with configurable human approval gates. It is built for agencies and freelancers, and each organisation brings its own AI provider credentials.',
    stack: {
      items: ['Turborepo', 'Next.js 15', 'Fastify 5', 'BullMQ 5', 'Prisma', 'PostgreSQL + pgvector', 'Clerk', 'Stripe', 'OpenAI / Anthropic / Google GenAI SDKs', 'Puppeteer', 'Socket.IO', 'Playwright', 'Docker'],
      provisional: false,
    },
    modules: [
      { id: 'crawl', title: 'Site audits', text: 'Audits run as queued jobs and flag what is hurting the site.' },
      { id: 'competitors', title: 'Competitors in view', text: 'Competitors sit in the dashboard next to the site’s own audits and analytics.' },
      { id: 'keywords', title: 'A content plan', text: 'Plans what to write next and puts it on a content calendar.' },
      { id: 'publish', title: 'Content, written and published', text: 'AI drafts the content and publishes it to WordPress once the approval gates you set are passed.' },
      { id: 'score', title: 'Tracked, then repeated', text: 'Analytics follow each site after publishing, and the loop runs again.' },
      { id: 'byok', title: 'Your own AI provider', text: 'OpenAI, Claude or Gemini, with the credentials kept per organisation, so costs and data stay theirs.' },
      { id: 'approvals', title: 'Human approval gates', text: 'Configurable checkpoints before anything publishes.' },
      { id: 'pipeline', title: 'Async SEO pipeline', text: 'Audit, AI generation and publishing run as queued jobs.' },
    ],
    flow: ['Audit', 'Plan', 'AI draft', 'Approve', 'Publish', 'Track'],
    facts: {
      byok: 'Runs on each organisation’s own AI provider credentials',
      oneLiner: 'SEO that runs itself.',
      problemTitle: 'SEO is a weekly chore nobody has time for',
      problemText:
        'Auditing, competitor research, keyword work, writing and publishing each take a different tool and a different afternoon, so most sites do them in bursts and then stop.',
    },
    notes: ['WordPress publishing is built; Webflow and Shopify publishing are planned, not built.'],
    screenshot: {
      alt: 'AI SEO landing page: the headline “Automate your SEO. Scale your agency.” beside a mock-up dashboard card (its figures are illustrative).',
    },
    sources: [HANDOFF, 'docs/research/ai-local.md §4 › AI SEO Automator', 'src/data/ai/cases.ts'],
  },
  'yard-terminal': {
    id: 'yard-terminal',
    name: 'Yard Terminal',
    cardTitle: 'YardTerminal',
    kind: 'product',
    ownership: 'own',
    // Not on shopify (owner's call, 2026-11-05): a salvage-yard tool is the wrong example for store owners.
    niches: ['ai', 'apps', 'cloud'],
    proof: 'strong',
    role: 'Design · Engineering · AI',
    client: 'Own product · auto salvage yards · a product of Indepth Solution',
    status: 'Opening to founding yards',
    live: false,
    madeBy: 'Indepth Solution',
    link: { label: 'yardterminal.com', href: 'https://yardterminal.com' },
    summary:
      'Yard Terminal is multi-tenant listing and inventory software for used auto-parts yards. A photographed part becomes an AI-drafted listing, a person approves it, and it is built to publish to eBay and Shopify, with the other listings ended when one sells. The eBay channel runs against eBay’s sandbox today; the Shopify channel is not live yet.',
    stack: {
      items: ['pnpm + Turborepo', 'NestJS', 'MongoDB replica set + outbox', 'Redis + BullMQ', 'better-auth', 'Anthropic SDK', 'Socket.IO', 'Puppeteer', 'Vite + React', 'Next.js', 'Playwright'],
      provisional: false,
    },
    modules: [
      { id: 'record', title: 'One record per part', text: 'Every part is a single record with quantity one, so the same part cannot be sold twice.' },
      {
        id: 'vin',
        title: 'Decode the VIN once',
        text: 'A VIN is decoded once and every part from that donor vehicle inherits its year, make, model and engine.',
      },
      {
        id: 'approve',
        title: 'AI drafts, a person approves',
        text: 'An AI agent writes each listing. Nothing publishes until a person approves it; there is no auto-publish mode.',
      },
      {
        id: 'delist',
        title: 'Sold once, ended everywhere',
        text: 'Built so that when a part sells, or is sold at the counter, its other listings end. An append-only audit trail records what happened.',
      },
      { id: 'tenant', title: 'Per-yard app', text: 'A tenant app on its own subdomain for each yard, plus an admin panel.' },
      { id: 'ebay', title: 'eBay channel', text: 'Channel workers and a webhook receiver, running against eBay’s sandbox.' },
    ],
    facts: {
      runsNow: 'Pre-launch. Opening to the first 200 founding yards, with a waitlist and demo booking open.',
      problemTitle: 'Salvage parts, listed twice and sold twice',
    },
    notes: [
      'The eBay channel runs against eBay’s sandbox; the Shopify channel is built as a library and does not run yet.',
      'A team build: an Indepth Solution product.',
    ],
    screenshot: {
      alt: 'Yard Terminal home page: a decoded VIN with parts inheriting fitment, shown with eBay and Shopify.',
      copies: ['src/assets/ai/cases/yard-terminal-site.png', 'src/assets/apps/yard-terminal-site.png'],
    },
    sources: [HANDOFF, 'docs/research/ai-web.md §1 (yardterminal.com)', 'docs/research/ai-local.md §4 › Yard Terminal', 'src/data/ai/cases.ts'],
  },
  solidmake: {
    id: 'solidmake',
    name: 'SolidMake',
    kind: 'research',
    ownership: 'own',
    niches: ['ai', 'apps', 'cloud'],
    role: 'AI research · Engineering',
    client: 'Final-year project · mechanical engineers',
    status: 'Final-year project',
    live: false,
    summary:
      'SolidMake turns a plain-language description of a part into a production-ready STEP file for cutting, bending and welding. It is not a thin wrapper around a chat model: it is built on the DeepCAD and Text2CAD research models, with prompt normalisation in front.',
    stack: { items: ['Python', 'DeepCAD', 'Text2CAD'], provisional: false },
    modules: [
      { id: 'words', title: 'Say it in words', text: 'The engineer describes the part in natural language, with no modelling steps.' },
      {
        id: 'normalise',
        title: 'Normalise the prompt',
        text: 'The description is cleaned and structured before it reaches the model, so similar requests give consistent results.',
      },
      {
        id: 'models',
        title: 'Custom models, not an API call',
        text: 'Built on DeepCAD and Text2CAD, with pre-designed training and an optimised process flow, in Python.',
      },
      { id: 'step', title: 'A file you can cut', text: 'The output is a STEP file ready for cutting, bending and welding.' },
    ],
    facts: {
      oneLiner: 'Describe the part. Get the STEP file.',
    },
    sources: ['docs/research/ai-local.md §4 › SolidMake', 'src/data/ai/cases.ts'],
  },
  'lead-drift': {
    id: 'lead-drift',
    name: 'Lead Drift',
    cardTitle: 'Leadrift',
    kind: 'internal',
    ownership: 'own',
    niches: ['funnels', 'ai', 'apps'],
    proof: 'strong',
    role: 'Founder build · Indepth Solution',
    client: "Internal product · Indepth Solution's own growth engine",
    status: 'Running in production',
    live: true,
    madeBy: 'Indepth Solution',
    link: { label: 'leadrift.indepthsolution.net', href: 'https://leadrift.indepthsolution.net' },
    summary:
      "Indepth Solution's own lead-generation and outreach workspace. A browser extension pulls leads from Google Maps and Apollo, job posts become leads, and every lead moves through one pipeline (raw, queued, crawled, emailed, replied, closed) with reminders and admin insights. Email sequences are built in; sending is switched off in production for now.",
    stack: {
      items: ['Express 4', 'MongoDB + Mongoose', 'BullMQ + Redis', 'Socket.IO', 'React 18 + Vite', 'Tailwind CSS', 'Puppeteer + Cheerio crawler', 'Chrome extension (Manifest V3)', 'Docker', 'PM2'],
      provisional: false,
    },
    modules: [
      {
        id: 'scrape',
        title: 'Scrape from where buyers already are',
        text: 'A browser extension pulls leads from Google Maps and Apollo into one place.',
      },
      {
        id: 'outreach',
        title: 'One pipeline for every lead',
        text: 'Each lead moves from raw to queued, crawled, emailed, replied and closed, with reminders, so nobody has to remember the next step.',
      },
      {
        id: 'sequences',
        title: 'Email sequences behind a kill switch',
        text: 'Sequences and templates are built in, behind a kill switch. Sending is switched off in production for now.',
      },
      { id: 'pipeline', title: 'Lead pipeline', text: 'Companies and leads with a status pipeline, bulk import and de-duplication.' },
      { id: 'jobfeed', title: 'Job feed harvest', text: 'Keyword sets turn job posts into leads.' },
      { id: 'crawler', title: 'Site crawler', text: 'A queue worker crawls company sites in depth.' },
      { id: 'templates', title: 'Website template library', text: 'Niche HTML/CSS templates with a validator and public previews.' },
    ],
    facts: {
      problemTitle: 'Growth that depended on someone remembering to do it',
      problemText:
        'Finding prospects, writing to them and following up were separate chores in separate tools. Leads cooled while the next batch was still being copied into a sheet.',
    },
    notes: ['Email sending is switched off in production for now: sequences are built, not sending.'],
    screenshot: {
      alt: "Leadrift's sign-in page: the headline “Someone just posted a job. That’s your next client.”, a line on what the tool does for the Indepth Solution sales team, and a Help wanted panel of job posts.",
      copies: ['src/assets/ai/leadrift.png', 'src/assets/apps/leadrift.png', 'src/assets/funnels/leadrift.png'],
    },
    toolName: 'Leadrift',
    toolText: 'job posts and company research turned into leads in one pipeline.',
    sources: [HANDOFF, 'docs/research/ai-local.md §4 › Lead Drift', 'src/data/ai/cases.ts'],
  },
  'farazahmad-dev': {
    id: 'farazahmad-dev',
    name: 'farazahmad.dev',
    cardTitle: 'farazahmad.dev lead pipeline',
    kind: 'own-site',
    ownership: 'own',
    // funnels shows it through its lead-pipeline case (a `system` of this project).
    niches: ['seo', 'funnels', 'apps', 'cloud'],
    proof: 'strong',
    status: 'Live',
    live: true,
    link: { label: 'farazahmad.dev', href: 'https://farazahmad.dev' },
    summary:
      'A WebGL-rich personal portfolio and lead-generation site with a contact form, an AI Automation Audit quiz, a template vault, a blog and an admin CMS. Every lead is saved to MongoDB first and then sent to GoHighLevel.',
    stack: {
      items: [
        'Next.js 16',
        'React 19',
        'TypeScript',
        'Tailwind CSS 4',
        'MongoDB · Mongoose',
        'Better Auth',
        'zod',
        'Tiptap',
        'GSAP · Lenis',
        'three.js',
        'Sentry',
        'PostHog',
      ],
      provisional: false,
    },
    modules: [
      { id: 'leads', title: 'Lead pipeline', text: 'Contact and audit forms with first-touch attribution and booking, saved to MongoDB, then sent to GoHighLevel.' },
      { id: 'audit', title: 'AI Automation Audit quiz', text: 'A quiz with a teaser and an unlock flow.' },
      { id: 'cms', title: 'Backstage CMS', text: 'Blog with import, projects, gallery, media library, templates, messages and GHL/AI settings.' },
      { id: 'seo', title: 'SEO layer', text: 'Per-page meta, JSON-LD for person, article and breadcrumbs, sitemap, robots, llms.txt and an AI catalog.' },
    ],
    facts: {
      tests: '257 tests passing (6 Oct 2026)',
      /** The count alone, for copy that prints the number in its own sentence. Same run as `tests`. */
      testsCount: '257',
      /** The other checks that passed in that run. */
      checks: 'typecheck and lint clean',
      lighthouse: 'Lighthouse 100: Accessibility, Best Practices, SEO, Agentic browsing',
      leadsFirst: 'Every lead saved to MongoDB first, then sent to GoHighLevel',
    },
    screenshot: {
      alt: 'farazahmad.dev home page: the headline “I build systems that work while you sleep.” beside a black-and-white portrait, with “Available for new projects”.',
    },
    sources: [HANDOFF, 'docs/brief/DECISIONS.md › apps, seo', 'docs/research/ai-local.md', 'src/data/apps/cases.ts'],
  },
  'lead-pipeline': {
    id: 'lead-pipeline',
    name: 'farazahmad.dev lead pipeline',
    kind: 'system',
    ownership: 'own',
    niches: ['funnels', 'ghl', 'ads'],
    partOf: 'farazahmad-dev',
    status: 'Live on every form',
    live: true,
    facts: {
      retry: 'Failed sends can be retried from the admin',
    },
    sources: ['docs/brief/DECISIONS.md › funnels, ghl', 'docs/research/ai-local.md', 'src/data/funnels/cases.ts', 'src/data/ghl/cases.ts'],
  },

  // ---------------------------------------------------------------- apps
  sluice: {
    id: 'sluice',
    name: 'Sluice',
    kind: 'product',
    ownership: 'own',
    niches: ['apps'],
    proof: 'strong',
    client: 'Own product · teams that keep secrets in dashboards today',
    status: 'Pre-release',
    live: false,
    repo: { label: 'github.com/FarazAhmad-117/Sluice', href: 'https://github.com/FarazAhmad-117/Sluice' },
    summary:
      'Sluice delivers environment variables to running processes without the server ever holding a plaintext secret, and stops those processes the moment a service token is revoked by a signature from a customer-held key. It is aimed at teams that keep secrets in dashboards today.',
    stack: {
      items: ['TypeScript', 'pnpm + Turborepo', 'Convex', 'React 19 + Vite', 'Next.js 16', 'Tailwind CSS 4', '@noble/curves + @noble/hashes', 'Bun-compiled CLI', 'Vitest', 'GitHub Actions'],
      provisional: false,
    },
    modules: [
      { id: 'crypto', title: 'Crypto core', text: 'AES-256-GCM seal and unseal, an HKDF key split, token minting and parsing, signed handshakes and revocation keys.' },
      { id: 'backend', title: 'Convex backend', text: 'Orgs, projects, environments, versioned secrets, tokens, sessions and bundle subscriptions.' },
      { id: 'dashboard', title: 'Encrypted admin dashboard', text: 'Unlock gate, secret drawers, coverage view, token list, activity feed and a CLI setup guide, with encryption in the browser.' },
      { id: 'cli', title: 'sluice run CLI', text: 'Injects secrets into a child process and supervises it; published as @getsluice/cli with standalone binaries.' },
      { id: 'sdk', title: 'Workload SDK', text: 'Decides whether a running workload installs, keeps or shuts down its secrets.' },
      { id: 'release', title: 'Release pipeline', text: 'Tagged releases build standalone executables and update a Scoop bucket.' },
    ],
    flow: ['Seal in the browser', 'Versioned secret', 'Service token', 'sluice run', 'Revoke, process stops'],
    facts: {
      ci: 'Typecheck and tests run in CI on every push and pull request',
    },
    notes: [
      'Pre-release: there has been no third-party cryptographic review yet.',
      'Not built yet: token minting and revoking from the dashboard, recovery, teams and an audit log reader.',
    ],
    angles: {
      apps: {
        kicker: 'Own product · security tooling · pre-release',
        title: 'Sluice: secrets delivered without a plaintext server',
        line: 'Environment variables reach running processes; the server never holds a plaintext secret.',
        problemTitle: 'Secrets that live in a dashboard in plain text',
        problemText:
          'Most teams paste environment variables into a hosting dashboard, where anyone with access, or anyone who breaches it, can read them. Revoking a leaked token rarely stops a process that already has it.',
        modulePicks: ['crypto', 'cli', 'dashboard', 'sdk', 'backend', 'release'],
        seoTitle: 'Sluice: Zero-Plaintext Secrets Delivery',
        seoDescription:
          'Case study: Sluice, a pre-release secrets tool. Encrypted in the browser, injected by a CLI, and revocation stops the running process. Source on GitHub.',
      },
    },
    sources: [HANDOFF],
  },
  'team-task-saas': {
    id: 'team-task-saas',
    name: 'Team task management SaaS',
    kind: 'client',
    ownership: 'client',
    niches: ['apps'],
    proof: 'strong',
    client: 'Client build · project-management SaaS',
    live: false,
    summary:
      'A project-management platform with Kanban boards, client management with a PIN-protected client portal, project templates, team invites and a Slack integration.',
    stack: {
      items: ['Next.js 16', 'React 19', 'TypeScript', 'Clerk', 'MongoDB + Mongoose', 'dnd-kit', 'Lexical', 'Slack Web API + OAuth', 'ImageKit / Cloudinary'],
      provisional: false,
    },
    modules: [
      { id: 'kanban', title: 'Kanban boards', text: 'Create, move, reorder, update and archive cards and stages, with attachments.' },
      { id: 'portal', title: 'Client portal', text: 'Each client gets a PIN-protected portal view of their projects.' },
      { id: 'team', title: 'Projects, templates and teams', text: 'Project templates, team invites and roles, tickets and notifications.' },
      { id: 'slack', title: 'Slack integration', text: 'OAuth connect, disconnect and status.' },
      { id: 'webhooks', title: 'Inbound webhooks', text: 'Create clients and projects from other tools.' },
    ],
    facts: {
      deploy: 'Deploys on push to main: SSH to a VPS, build, restart with PM2',
    },
    angles: {
      apps: {
        kicker: 'Client build · SaaS',
        title: 'A team task SaaS with a client portal',
        line: 'Kanban boards, a PIN-protected client portal and Slack, in one Next.js app.',
        problemTitle: 'Clients asking for updates the team already has',
        problemText:
          'When a team’s work lives on boards its clients cannot see, every status update is written by hand. A tool like this needs boards for the team and a safe, read-only window for each client.',
        modulePicks: ['kanban', 'portal', 'team', 'slack', 'webhooks'],
        seoTitle: 'Team Task SaaS with a Client Portal',
        seoDescription:
          'Case study: a project-management SaaS with Kanban boards, a PIN-protected client portal, templates, team invites and Slack, built in Next.js.',
      },
    },
    sources: [HANDOFF],
  },
  'audio-splitting-saas': {
    id: 'audio-splitting-saas',
    name: 'Audio splitting SaaS',
    cardTitle: 'Audio splitting SaaS with job queues',
    kind: 'client',
    ownership: 'client',
    niches: ['apps'],
    proof: 'strong',
    client: 'Client build · developer API and web app',
    live: false,
    summary:
      'A SaaS that splits audio files by duration or file size, with optional format conversion. It ships as an API with keys and billing, a web app, a marketing site, developer docs and an n8n community node.',
    stack: {
      items: ['Express + TypeScript', 'MongoDB + Mongoose', 'Redis', 'BullMQ', 'FFmpeg', 'Agenda', 'Socket.IO', 'Clerk', 'Stripe', 'Vite + React', 'Astro', 'Docusaurus 3 + OpenAPI', 'n8n node'],
      provisional: false,
    },
    modules: [
      { id: 'api', title: 'Split API', text: 'Split jobs, status, downloads, webhooks, API keys, billing and usage, GDPR export, tiers and analytics.' },
      { id: 'queues', title: 'Background workers', text: 'Queued split and report jobs with rate limiting.' },
      { id: 'rbac', title: 'Access control', text: 'Role-based access and API-key middleware.' },
      { id: 'app', title: 'Web app', text: 'Clerk sign-in and real-time job updates.' },
      { id: 'docs', title: 'Developer docs', text: 'OpenAPI reference and SDK guides for curl, Node.js, Python, PHP and Postman.' },
      { id: 'n8n', title: 'n8n community node', text: 'A split action and a trigger, with its own credential type.' },
    ],
    flow: ['Upload', 'Queue', 'FFmpeg split', 'Webhook', 'Download'],
    facts: {
      ci: 'CI runs a type check and the test suite, then deploys',
    },
    angles: {
      apps: {
        kicker: 'Client build · API product',
        title: 'An audio splitting API, app and docs',
        line: 'A queued FFmpeg API with keys and billing, plus a web app, docs and an n8n node.',
        problemTitle: 'Long audio files that tools choke on',
        problemText:
          'Many transcription and upload tools cap file length or size. Splitting by hand is slow, and a public API that does it has to queue heavy jobs, meter usage and bill for it.',
        modulePicks: ['api', 'queues', 'app', 'docs', 'n8n', 'rbac'],
        seoTitle: 'Audio Splitting SaaS: API, Queues, Billing',
        seoDescription:
          'Case study: an audio splitting SaaS. A queued FFmpeg API with keys, billing and webhooks, a web app, OpenAPI docs and an n8n community node.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- ghl
  'ghl-crm-dashboard': {
    id: 'ghl-crm-dashboard',
    name: 'GHL CRM reporting dashboard',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'strong',
    client: 'Client build · multi-location service business',
    live: false,
    summary:
      'A central admin dashboard for GoHighLevel and Vagaro integrations. It stores location IDs and API tokens encrypted at rest and shows contacts, pipeline, appointments, payments, conversations, sync logs and webhook logs.',
    stack: {
      items: ['Next.js 16', 'React 19', 'TypeScript', 'Clerk 7', 'MongoDB + Mongoose 8', 'Tailwind CSS', 'Vitest', 'Playwright', 'Vercel'],
      provisional: false,
    },
    modules: [
      { id: 'auth', title: 'Sign-in and roles', text: 'Clerk sign-in; the first user becomes admin through a Clerk webhook.' },
      { id: 'tokens', title: 'Encrypted tokens', text: 'GHL API tokens are encrypted at rest.' },
      { id: 'views', title: 'CRM views', text: 'Contacts, pipeline, appointments, conversations, payments, users and settings.' },
      { id: 'logs', title: 'Sync and webhook logs', text: 'Every sync and webhook is logged, with replay scripts for GHL and Vagaro.' },
    ],
    flow: ['GoHighLevel and booking data', 'Sync and webhooks', 'Logged', 'Admin views'],
    facts: {
      tests: 'Covered by unit and end-to-end tests',
    },
    angles: {
      ghl: {
        kicker: 'Client build · reporting',
        title: 'A CRM reporting dashboard over GoHighLevel',
        line: 'One admin view of contacts, pipeline, bookings and payments, with every sync logged.',
        problemTitle: 'Data spread across sub-accounts and a booking tool',
        problemText:
          'With contacts and payments in GoHighLevel and bookings in another system, one location at a time, nobody sees the whole business in one place, or notices when a sync quietly fails.',
        modulePicks: ['views', 'logs', 'tokens', 'auth'],
        seoTitle: 'GoHighLevel CRM Reporting Dashboard',
        seoDescription:
          'Case study: a GoHighLevel reporting dashboard. Contacts, pipeline, bookings and payments in one admin view, encrypted tokens, every sync logged.',
      },
    },
    sources: [HANDOFF],
  },
  'ghl-kpi-dashboard': {
    id: 'ghl-kpi-dashboard',
    name: 'GHL pipeline KPI dashboard',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'strong',
    client: 'Client build · sales team',
    live: false,
    summary:
      'A read-only dashboard over one GoHighLevel sub-account’s sales pipeline: six KPIs, revenue trend, stage mix, funnel and recent deals, filtered by pipeline and date range.',
    stack: {
      items: ['Next.js 16', 'React 19', 'MongoDB + Mongoose', 'SWR', 'Recharts', 'Tailwind CSS 4', 'zod', 'Vitest', 'GoHighLevel REST API'],
      provisional: false,
    },
    modules: [
      { id: 'discover', title: 'Pipeline discovery', text: 'Finds the account’s pipelines and caches them in MongoDB.' },
      { id: 'classify', title: 'Automatic stage roles', text: 'Picks the right pipeline by name and classifies stages as won, lost or proposal.' },
      { id: 'cache', title: 'Cached search', text: 'Opportunity search with a 5-minute cache.' },
      { id: 'metrics', title: 'Tested metric modules', text: 'Separate metric modules per view, most with their own tests.' },
      { id: 'snapshot', title: 'Daily snapshot', text: 'A Vercel cron takes a snapshot every night at 02:00.' },
    ],
    flow: ['GHL pipelines', 'Stage roles', 'Metric modules', 'Daily snapshot', 'KPI view'],
    facts: {},
    angles: {
      ghl: {
        kicker: 'Client build · pipeline KPIs',
        title: 'A pipeline KPI dashboard on GoHighLevel',
        line: 'Six pipeline KPIs, revenue trend and funnel, read straight from one sub-account.',
        problemTitle: 'A pipeline nobody could read at a glance',
        problemText:
          'A sales pipeline in GoHighLevel holds the deals, but the numbers an owner cares about (won, lost, in proposal, revenue over time) usually mean exporting and counting by hand.',
        modulePicks: ['classify', 'metrics', 'snapshot', 'discover', 'cache'],
        seoTitle: 'GoHighLevel Pipeline KPI Dashboard',
        seoDescription:
          'Case study: a read-only KPI dashboard over a GoHighLevel pipeline. Stages classified automatically, tested metrics and a nightly snapshot.',
      },
    },
    sources: [HANDOFF],
  },
  'ghl-sync-backend': {
    id: 'ghl-sync-backend',
    name: 'Scheduled GHL sync backend',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'strong',
    client: 'Client build · retail business',
    live: false,
    summary:
      'An Express and MongoDB backend with scheduled jobs and connectors that keep GoHighLevel in sync with a retail system (Lightspeed).',
    stack: {
      items: ['Express 4', 'MongoDB + Mongoose 8', 'Agenda 5', 'Joi', 'JWT', 'helmet', 'axios', 'Jest 29', 'PM2', 'GitHub Actions'],
      provisional: false,
    },
    modules: [
      { id: 'connectors', title: 'Connectors', text: 'GoHighLevel and Lightspeed connectors.' },
      { id: 'jobs', title: 'Scheduled jobs', text: 'Agenda-based jobs run the syncs on a schedule.' },
      { id: 'deploy', title: 'Push-to-deploy', text: 'Push to main: SSH to a VPS, pull, install and restart with PM2.' },
    ],
    flow: ['Lightspeed', 'Scheduled job', 'Connector', 'GoHighLevel'],
    facts: {},
    angles: {
      ghl: {
        kicker: 'Client build · integration',
        title: 'A scheduled sync between GoHighLevel and a retail POS',
        line: 'Connectors and scheduled jobs that keep GoHighLevel in step with the store’s system.',
        problemTitle: 'Customers in the till, not in the CRM',
        problemText:
          'When sales happen in a retail system and follow-ups in GoHighLevel, the CRM does not know who has bought without a sync, so automations can fire at the wrong people.',
        seoTitle: 'GoHighLevel Sync with a Retail POS',
        seoDescription:
          'Case study: an Express and MongoDB backend whose scheduled jobs keep GoHighLevel in sync with a Lightspeed retail system. Tested, push-to-deploy.',
      },
    },
    sources: [HANDOFF],
  },
  'ghl-outbound-ops': {
    id: 'ghl-outbound-ops',
    name: 'GHL + Smartlead outbound ops',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'partial',
    client: 'Client build · B2B sales team',
    live: false,
    summary:
      'Outbound email and meeting booking for a B2B client: prospects are contacted through Smartlead, and booked meetings are labelled, routed in GoHighLevel and handed to the sales team.',
    stack: { items: ['GoHighLevel', 'Smartlead', 'Python 3 helper scripts', 'Markdown-to-PDF reports'], provisional: false },
    modules: [
      { id: 'pipelines', title: 'GHL pipelines and review board', text: 'Pipelines, a review board, a separate calls pipeline and follow-up reminders.' },
      { id: 'suppression', title: 'Suppression and hygiene', text: 'Campaign and suppression process with bounce and reply checks and a do-not-contact list.' },
      { id: 'enrich', title: 'List enrichment', text: 'A scraper that fills organisation names for enrichment lists.' },
      { id: 'backups', title: 'Backups before every change', text: 'Dated backups before each live change.' },
    ],
    flow: ['Smartlead outreach', 'Reply', 'Meeting booked', 'Labelled in GHL', 'Sales team'],
    facts: {},
    notes: ['Mostly CRM configuration with a little code, shown anonymised.'],
    angles: {
      ghl: {
        kicker: 'Client build · outbound',
        title: 'Outbound booking routed through GoHighLevel',
        line: 'Cold email in Smartlead, booked meetings labelled and routed in GoHighLevel.',
        problemTitle: 'Booked meetings that fell between two tools',
        problemText:
          'With outreach in one tool and the sales pipeline in another, a booked meeting needs a clear hand-off, and bounced or opted-out contacts must stay out of every later campaign.',
        seoTitle: 'Smartlead + GoHighLevel Outbound Routing',
        seoDescription:
          'Case study: outbound email for a B2B team. Smartlead campaigns, suppression and hygiene, and booked meetings labelled and routed in GoHighLevel.',
      },
    },
    sources: [HANDOFF],
  },
  'voice-ai-n8n-workflows': {
    id: 'voice-ai-n8n-workflows',
    name: 'Voice AI follow-up workflows',
    cardTitle: 'Voice AI follow-up workflows (n8n + GHL)',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'partial',
    client: 'Client build · AI voice agent',
    live: false,
    summary:
      'n8n workflows behind an AI voice agent connected to GoHighLevel: onboarding intake, tenant lookup, knowledge-base sync, in-call tools, a post-call workflow that writes back to GHL, and an error handler.',
    stack: { items: ['n8n', 'GoHighLevel', 'Retell', 'Conversation AI', 'Python', 'SQL'], provisional: false },
    modules: [
      { id: 'intake', title: 'Onboarding intake', text: 'Captures and routes new callers.' },
      { id: 'incall', title: 'In-call tools', text: 'Tools the voice agent calls during a conversation.' },
      { id: 'postcall', title: 'Post-call workflow', text: 'Writes call outcomes back to GoHighLevel.' },
      { id: 'sync', title: 'Custom-value sync', text: 'Keeps GHL custom values and the voice agent’s knowledge in sync.' },
      { id: 'migration', title: 'Data clean-up scripts', text: 'Python scripts for field consolidation and duplicate surveys.' },
      {
        id: 'insights',
        title: 'Weekly agent insights',
        text: 'Every Monday the workflow loops over each account, skips low-volume ones, has Claude write findings from the week’s calls, stores them, and posts a weekly summary to Slack.',
      },
    ],
    flow: ['Call', 'In-call tools', 'Post-call write-back', 'GoHighLevel', 'Weekly insights'],
    facts: {},
    notes: ['From a private client workspace: described in general terms, with no workflow files or exports.'],
    screenshot: {
      alt: 'n8n editor showing a weekly “Agent Insights” workflow: a Monday schedule loops over accounts, checks call volume, asks Claude for findings, stores them and posts a summary to Slack. Request URLs are blurred.',
    },
    angles: {
      ghl: {
        kicker: 'Client build · voice AI',
        title: 'n8n workflows behind a GoHighLevel voice agent',
        line: 'Intake, in-call tools and post-call write-back to GoHighLevel, plus weekly AI insights.',
        problemTitle: 'A voice agent whose calls stay in the call log',
        problemText:
          'An AI voice agent can answer calls, but without workflows behind it, what it learns stays in the call log: outcomes are typed into GoHighLevel by hand, and nobody reviews how it does week to week.',
        modulePicks: ['postcall', 'incall', 'intake', 'sync', 'insights', 'migration'],
        seoTitle: 'Voice AI Workflows for GoHighLevel (n8n)',
        seoDescription:
          'Case study: n8n workflows behind an AI voice agent. In-call tools, post-call write-back to GoHighLevel and a weekly AI review of the calls.',
      },
    },
    sources: [HANDOFF],
  },
  'ghl-conversation-ai-build': {
    id: 'ghl-conversation-ai-build',
    name: 'GHL Conversation AI build',
    cardTitle: 'GHL Conversation AI lead routing',
    kind: 'client',
    ownership: 'client',
    niches: ['ghl'],
    proof: 'weak',
    client: 'Client build · education business',
    live: false,
    summary:
      'Lead capture, sorting and follow-up for an education business: survey and Instagram leads are tagged by capital, high-value leads reach the owner at once, and Instagram DMs get an AI assistant reply that hands serious prospects to the owner.',
    stack: { items: ['GoHighLevel workflows', 'Conversation AI', 'Calendars + pipelines', 'n8n webhook', 'HTML landing pages'], provisional: false },
    modules: [
      { id: 'tagging', title: 'Capital-based tagging', text: 'Leads are tagged by capital, and high-value leads trigger an instant alert.' },
      { id: 'dm', title: 'Instagram DM assistant', text: 'An AI assistant replies to DMs and hands serious prospects to the owner.' },
      { id: 'missed', title: 'Missed-call text-back', text: 'Missed calls get an automatic text, with a unified inbox.' },
      { id: 'pages', title: 'Opt-in funnel', text: 'Opt-in, thank-you and community landing pages.' },
    ],
    flow: ['Survey or DM', 'Tag by capital', 'AI reply', 'Owner alerted'],
    facts: {},
    notes: ['Mostly GoHighLevel configuration, shown anonymised.'],
    screenshot: {
      alt: 'GoHighLevel workflows list for a lead-nurture build: published workflows for capital segmentation of survey submissions, cold-contact win-back, event invites and RSVP replies. Names that identify the client are blurred.',
    },
    angles: {
      ghl: {
        kicker: 'Client build · Conversation AI',
        title: 'Conversation AI lead routing in GoHighLevel',
        line: 'Leads tagged by budget, an AI reply on Instagram DMs, the best ones sent straight to the owner.',
        problemTitle: 'Every lead treated the same',
        problemText:
          'When survey and Instagram leads land in one pile, a serious prospect looks the same as a casual one until someone replies by hand, which can be too late.',
        seoTitle: 'GoHighLevel Conversation AI Lead Routing',
        seoDescription:
          'Case study: lead routing in GoHighLevel. Leads tagged by budget, Conversation AI replies on Instagram DMs and high-value leads alerted at once.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- funnels
  'imessage-campaign-saas': {
    id: 'imessage-campaign-saas',
    name: 'Multi-tenant iMessage campaign SaaS',
    kind: 'client',
    ownership: 'client',
    niches: ['funnels'],
    proof: 'strong',
    client: 'Client build · messaging SaaS',
    live: false,
    summary:
      'A multi-tenant SaaS for iMessage marketing campaigns. Each client connects an iCloud account through a BlueBubbles relay on Mac hardware, with two-way GoHighLevel sync, billing and an admin console.',
    stack: {
      items: ['Express 4 + TypeScript', 'MongoDB + Mongoose', 'Redis + Bull', 'Clerk', 'Stripe', 'Next.js 16', 'Tailwind CSS + shadcn/ui', 'Zustand', 'TanStack Query', 'Docker', 'Nginx', 'GitHub Actions'],
      provisional: false,
    },
    modules: [
      { id: 'tenancy', title: 'Multi-tenant RBAC', text: 'Separate client, staff and admin areas behind role-based access.' },
      { id: 'relay', title: 'Mac relay management', text: 'BlueBubbles instances, a Mac health worker and a setup checklist.' },
      { id: 'messaging', title: 'iMessage send and inbox', text: 'Outbound sends, inbound webhooks and conversation views.' },
      { id: 'campaigns', title: 'Campaigns', text: 'Bulk sends, scheduling and a campaign worker.' },
      { id: 'ghl', title: 'GHL provider integration', text: 'Marketplace OAuth, a provider adapter, message sync and trigger subscriptions.' },
      { id: 'billing', title: 'Billing and limits', text: 'Stripe subscriptions, per-client rate limits, usage resets and an SLA checker.' },
    ],
    flow: ['Campaign', 'Campaign worker', 'Mac relay', 'iMessage', 'Reply synced to GHL'],
    facts: {},
    notes: ['Built with a collaborator.'],
    angles: {
      funnels: {
        kicker: 'Client build · messaging funnel',
        title: 'iMessage campaigns, synced both ways with GoHighLevel',
        line: 'Campaigns sent as iMessage through Mac relays, with replies flowing back into GoHighLevel.',
        problemTitle: 'Follow-ups that look like marketing',
        problemText:
          'SMS follow-ups read like ads and get ignored. Sending as iMessage means running real Apple hardware per client, and keeping every reply in the CRM the sales team already works in.',
        modulePicks: ['campaigns', 'ghl', 'relay', 'messaging', 'tenancy', 'billing'],
        seoTitle: 'iMessage Campaign SaaS with GoHighLevel Sync',
        seoDescription:
          'Case study: a multi-tenant iMessage campaign SaaS. Mac relays per client, scheduled campaigns, Stripe billing and two-way GoHighLevel sync.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- seo
  'furniture-bazar': {
    id: 'furniture-bazar',
    name: 'Furniture Bazar',
    cardTitle: 'Furniture Bazar: e-commerce store with technical SEO',
    kind: 'client',
    ownership: 'client',
    niches: ['seo'],
    proof: 'strong',
    client: 'Client · UK online furniture store',
    status: 'Live',
    live: true,
    link: { label: 'furniturebazar.co.uk', href: 'https://furniturebazar.co.uk/' },
    summary:
      'A UK online furniture store: a Next.js storefront with Stripe payments, an admin app for products and orders, and an Express API, maintained on a retainer for performance and SEO work.',
    stack: { items: ['Next.js 16', 'React 19', 'Stripe', 'Vite 6 admin', 'Express 4', 'MongoDB + Mongoose', 'JWT', 'Vercel', 'GitHub Actions'], provisional: false },
    modules: [
      { id: 'store', title: 'Storefront', text: 'Next.js storefront with Stripe checkout.' },
      { id: 'admin', title: 'Admin app', text: 'Products and orders management, built on a commercial admin template.' },
      { id: 'api', title: 'Express API', text: 'The API behind the store and the admin.' },
      { id: 'seo', title: 'Performance and SEO retainer', text: 'Ongoing performance and SEO upgrades, tracked in a work log.' },
    ],
    facts: {},
    notes: ['The admin app is built on a commercial admin template; its UI is not original design.'],
    screenshot: {
      alt: 'Furniture Bazar home page: a category menu, a search bar and a “Furniture for Every Room” hero banner.',
    },
    angles: {
      seo: {
        kicker: 'Client · e-commerce · retainer',
        title: 'Furniture Bazar: a store kept fast and crawlable',
        line: 'A Next.js furniture store with ongoing performance and technical SEO work.',
        problemTitle: 'A store that has to rank, not just sell',
        problemText:
          'An online furniture shop lives on category and product searches. Every new feature can slow pages down or hide them from crawlers, so the technical SEO work never really ends.',
        modulePicks: ['seo', 'store', 'api', 'admin'],
        seoTitle: 'Furniture Bazar: E-commerce Technical SEO',
        seoDescription:
          'Case study: Furniture Bazar, a UK furniture store on Next.js with Stripe. Built and kept on a retainer for performance and technical SEO.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- ai
  'ai-roofing-estimator': {
    id: 'ai-roofing-estimator',
    name: 'AI roofing estimate generator',
    kind: 'client',
    ownership: 'client',
    niches: ['ai'],
    proof: 'partial',
    client: 'Client build · a roofing company',
    status: 'Live',
    live: true,
    link: { label: 'roofing-dnc.vercel.app', href: 'https://roofing-dnc.vercel.app/' },
    summary:
      'A roofing estimation and inspection app: upload project details, get material rates and let AI generate a professional quote through a chat interface. It includes quote templates, rate admin, inspection reports, HTML-to-PDF conversion and a GoHighLevel integration.',
    stack: {
      items: ['Next.js 16', 'React 19', 'Clerk', 'MongoDB + Mongoose', 'Vercel AI SDK + OpenAI', 'Puppeteer + serverless Chromium', 'pdf-parse', 'Cloudinary / ImageKit', 'xlsx'],
      provisional: false,
    },
    modules: [
      { id: 'chat', title: 'AI quote chat', text: 'An AI chat that turns project details into a quote.' },
      { id: 'admin', title: 'Rates and templates', text: 'Quote templates, materials, wages, commission companies and agent settings.' },
      { id: 'inspection', title: 'Inspection reports', text: 'Report generation that pulls contacts and conversations from GoHighLevel.' },
      { id: 'pdf', title: 'HTML-to-PDF API', text: 'A conversion API with its own dashboard and API-key docs.' },
    ],
    flow: ['Project details', 'Material rates', 'AI quote chat', 'Quote template', 'PDF'],
    facts: {},
    screenshot: {
      alt: 'Roofing estimator landing page: “Generate accurate roofing quotes in seconds” with Start Estimating and See How It Works buttons. The client’s brand name is blurred.',
    },
    angles: {
      ai: {
        kicker: 'Client build · AI quoting',
        title: 'An AI roofing estimate generator',
        line: 'Project details in, a priced roofing quote out, written by AI in a chat.',
        problemTitle: 'Quotes that wait on whoever knows the rates',
        problemText:
          'A roofing quote by hand means looking up material rates, wages and commission, then formatting a document. Quotes queue behind whoever has time to write them.',
        modulePicks: ['chat', 'admin', 'pdf', 'inspection'],
        seoTitle: 'AI Roofing Estimate Generator',
        seoDescription:
          'Case study: an AI roofing quote tool. Project details and material rates in, an AI-written quote out, with templates, PDFs and GoHighLevel reports.',
      },
    },
    sources: [HANDOFF],
  },
  'ai-ops-command-center': {
    id: 'ai-ops-command-center',
    name: 'AI operations command center',
    kind: 'client',
    ownership: 'client',
    niches: ['ai'],
    proof: 'partial',
    client: 'Client build · internal tool',
    live: false,
    summary:
      'An internal operating-system app for a company that runs a team of AI agents for sales, operations, finance, customer success and marketing, with a dashboard, daily briefings and a docs site.',
    stack: {
      items: ['Next.js 15', 'TypeScript', 'Tailwind CSS 4', 'shadcn/ui', 'Prisma + PostgreSQL', 'Clerk', 'Anthropic SDK', 'Recharts', 'Nextra', 'Docker Compose', 'GitHub Actions'],
      provisional: false,
    },
    modules: [
      { id: 'dashboard', title: 'Command dashboard', text: 'A dashboard shell with sign-in over the company’s agents.' },
      { id: 'agents', title: 'Agent workspace', text: 'Per-agent configuration files, synced by CI to the agent gateway, which then restarts.' },
      { id: 'docs', title: 'Docs site', text: 'Agents, architecture, deployment, infrastructure and sprint pages.' },
      { id: 'deploy', title: 'Self-hosted deploy', text: 'Deploys on push to main from a self-hosted runner.' },
    ],
    flow: ['Agent config', 'CI sync', 'Agent gateway', 'Command dashboard'],
    facts: {},
    notes: ['An internal tool for one company, not a shipped product.'],
    angles: {
      ai: {
        kicker: 'Client build · internal AI agents',
        title: 'A command center for a team of AI agents',
        line: 'One internal app over sales, ops, finance and support agents, with config shipped by CI.',
        problemTitle: 'AI agents with no shared control room',
        problemText:
          'A company that runs a separate AI agent for each department needs one place to see them, and a safe way to change an agent’s settings without editing files on a server by hand.',
        seoTitle: 'AI Agent Operations Command Center',
        seoDescription:
          'Case study: an internal command center for a company’s AI agents. A dashboard, per-agent config synced by CI to the gateway, and a docs site.',
      },
    },
    sources: [HANDOFF],
  },
  'opencode-chat': {
    id: 'opencode-chat',
    name: 'OpenCode Chat',
    cardTitle: 'OpenCode Chat (VS Code extension)',
    kind: 'product',
    ownership: 'own',
    niches: ['ai'],
    proof: 'partial',
    client: 'Own tool · developers in VS Code',
    live: false,
    summary:
      'A VS Code extension that puts the OpenCode AI coding agent in a sidebar chat panel and streams its tool calls as progress steps.',
    stack: { items: ['TypeScript', 'VS Code Extension API', '@opencode-ai/sdk', 'Vite', 'Vitest', 'Playwright', 'pnpm'], provisional: false },
    modules: [
      { id: 'panel', title: 'Sidebar chat', text: 'A webview chat panel inside VS Code.' },
      { id: 'stream', title: 'Live tool steps', text: 'Tool calls appear as progress steps while the agent works.' },
      { id: 'e2e', title: 'End-to-end tests', text: 'Playwright suites for abort, generation, permissions, prompts and sessions.' },
    ],
    flow: ['Prompt in VS Code', 'OpenCode agent', 'Tool calls streamed', 'Answer in the panel'],
    facts: {},
    angles: {
      ai: {
        kicker: 'Own tool · developer AI',
        title: 'OpenCode Chat: an AI coding agent in VS Code',
        line: 'The OpenCode agent in a VS Code sidebar, with every tool call shown as it runs.',
        problemTitle: 'An agent you cannot watch work',
        problemText:
          'Terminal coding agents run tool after tool out of sight of the editor. You either trust the result or scroll back through logs to see what it changed.',
        seoTitle: 'OpenCode Chat: AI Coding Agent for VS Code',
        seoDescription:
          'Case study: OpenCode Chat, a VS Code extension that runs the OpenCode AI agent in a sidebar chat and streams its tool calls as steps. E2E tested.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- shopify
  quarry: {
    id: 'quarry',
    name: 'Quarry',
    cardTitle: 'Quarry (Shopify theme)',
    kind: 'product',
    ownership: 'own',
    niches: ['shopify'],
    proof: 'partial',
    client: 'Own product · Shopify merchants',
    status: 'In progress (Milestone 1)',
    live: false,
    summary:
      'An editorial Shopify theme being built for the Shopify Theme Store, for merchants who want an editorial-style storefront. It is built on Shopify’s Skeleton theme.',
    stack: { items: ['Shopify Liquid', 'Online Store 2.0 JSON templates', 'Shopify Skeleton base', 'Shopify CLI', 'Theme Check CI'], provisional: false },
    modules: [
      { id: 'settings', title: 'Theme settings', text: 'Colour, typography, layout and product-card setting groups.' },
      { id: 'sections', title: 'Sections and blocks', text: 'Online Store 2.0 sections, templates, snippets and custom blocks the merchant arranges.' },
      { id: 'ci', title: 'Theme Check CI', text: 'Theme Check runs on every push.' },
    ],
    flow: ['Liquid sections', 'JSON templates', 'Theme editor', 'Theme Check on push'],
    facts: {},
    notes: ['Unfinished: the collection and product pages are not built yet.', 'Built on Shopify’s Skeleton theme.'],
    angles: {
      shopify: {
        kicker: 'Own product · theme · in progress',
        title: 'Quarry: an editorial Shopify theme',
        line: 'An Online Store 2.0 theme for editorial storefronts, aimed at the Theme Store.',
        problemTitle: 'Stores that all look like the default theme',
        problemText:
          'Merchants who sell on story and imagery get templates built for catalogues. An editorial theme has to give them that look while staying editable in the theme editor.',
        seoTitle: 'Quarry: an Editorial Shopify Theme',
        seoDescription:
          'Case study: Quarry, an editorial Online Store 2.0 Shopify theme in progress for the Theme Store. Liquid sections, theme settings and Theme Check in CI.',
      },
    },
    sources: [HANDOFF],
  },
  'catalog-scraper-shopify': {
    id: 'catalog-scraper-shopify',
    name: 'Supplier catalog scraper with AI enrichment',
    cardTitle: 'Supplier catalog scraper with AI enrichment and Shopify upload',
    kind: 'client',
    ownership: 'client',
    niches: ['shopify'],
    proof: 'partial',
    client: 'Client build · wholesale catalogue',
    live: false,
    summary:
      'A Node and TypeScript pipeline that scrapes a wholesale supplier’s product pages, uses an LLM to enrich descriptions, tags and categories, stores products in MongoDB and uploads them to a Shopify store.',
    stack: {
      items: ['Node.js', 'TypeScript', 'Puppeteer', 'cheerio', 'OpenAI SDK', 'Shopify Admin API (REST + GraphQL)', 'MongoDB + Mongoose', 'Express', 'Winston', 'Jest'],
      provisional: false,
    },
    modules: [
      { id: 'scrape', title: 'Category scraper', text: 'Crawls supplier category pages into product records.' },
      { id: 'enrich', title: 'LLM enrichment', text: 'Rewrites descriptions and generates tags and categories.' },
      { id: 'upload', title: 'Shopify upload', text: 'Pushes products to the store through the Admin API.' },
      { id: 'cli', title: 'Step-by-step CLI', text: 'Separate scrape, process, upload and full-workflow scripts, with a progress API.' },
    ],
    flow: ['Supplier pages', 'Scrape', 'LLM enrichment', 'MongoDB', 'Shopify Admin API'],
    facts: {},
    angles: {
      shopify: {
        kicker: 'Client build · catalogue import',
        title: 'A supplier catalogue, enriched by AI and uploaded to Shopify',
        line: 'Supplier pages scraped, descriptions and tags written by an LLM, products pushed to Shopify.',
        problemTitle: 'Every product typed in by hand',
        problemText:
          'A store that resells a wholesaler’s range has to copy every product, rewrite the supplier’s thin descriptions and tag each one before it can go live.',
        seoTitle: 'AI Product Enrichment and Shopify Import',
        seoDescription:
          'Case study: a pipeline that scrapes a supplier catalogue, enriches descriptions, tags and categories with an LLM, and uploads products to Shopify.',
      },
    },
    sources: [HANDOFF],
  },

  // ---------------------------------------------------------------- cloud
  'indepth-dashboard': {
    id: 'indepth-dashboard',
    name: 'Indepth-Dashboard',
    kind: 'internal',
    ownership: 'own',
    niches: ['cloud'],
    proof: 'strong',
    client: 'Internal platform · Indepth Solution',
    live: false,
    madeBy: 'Indepth Solution',
    summary:
      'Indepth Solution’s internal business-management platform: HR, projects, time tracking, CRM, expenses, invoicing, leads, campaigns, a client portal, notifications and reports.',
    stack: {
      items: ['Turborepo + pnpm', 'Next.js 16', 'React 19', 'TanStack Query', 'Zustand', 'Express 5', 'MongoDB + Mongoose', 'BullMQ + ioredis', 'Socket.IO + Redis adapter', 'Better Auth', 'node-cron', 'Zod'],
      provisional: false,
    },
    modules: [
      { id: 'modules', title: 'Business modules', text: 'Activity, auth, campaigns, CRM, expenses, HR, invoicing, leads, notifications, portal, projects, RBAC, reports, settings and time tracking.' },
      { id: 'hr', title: 'HR', text: 'Attendance, leave, salary structure, departments and onboarding.' },
      { id: 'queues', title: 'Redis queues', text: 'Queued email, invoice and scraper jobs, with real-time updates over Socket.IO.' },
      { id: 'invoices', title: 'Invoice PDFs', text: 'Invoices rendered to PDF from an HTML template.' },
      { id: 'deploy', title: 'CI deploy', text: 'The API deploys to a server over SSH on push to main.' },
    ],
    flow: ['Push to main', 'CI', 'SSH deploy', 'API + workers', 'Redis queues'],
    facts: {},
    notes: ['An internal tool, built as a team.'],
    angles: {
      cloud: {
        kicker: 'Internal platform · team build',
        title: 'Indepth-Dashboard: queues, real-time and CI deploys',
        line: 'A company’s own business platform: Redis queues, real-time updates and CI deploys.',
        problemTitle: 'One company, many separate tools',
        problemText:
          'HR, time tracking, invoicing and leads usually live in separate subscriptions. One platform in their place needs background jobs for email and invoices that never block the app.',
        modulePicks: ['queues', 'deploy', 'invoices', 'modules', 'hr'],
        seoTitle: 'Internal Platform: Queues, Real-time, CI',
        seoDescription:
          'Case study: an internal business platform on Express and Next.js. BullMQ queues on Redis, Socket.IO with a Redis adapter, and CI deploys over SSH.',
      },
    },
    sources: [HANDOFF],
  },
  'ftp-feed-handler': {
    id: 'ftp-feed-handler',
    name: 'FTP feed handler',
    cardTitle: 'Automated FTP inventory feed handler',
    kind: 'client',
    ownership: 'client',
    niches: ['cloud'],
    proof: 'strong',
    client: 'Client build · automotive inventory',
    live: false,
    summary:
      'An inventory-ingestion dashboard. Scheduled jobs pick up inventory files from FTP drop points, apply field-mapping rules and send the rows on through verified connectors. Every run is logged with its rows in, rows sent and duration.',
    stack: { items: ['React + Vite', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Vercel rewrites to a VPS API'], provisional: false },
    modules: [
      { id: 'overview', title: 'Ingestion health', text: 'FTP accounts, rules, connectors and rows sent in the last 24 hours, at a glance.' },
      { id: 'runs', title: 'Run history', text: 'Every scheduled ingestion with status, rows in, rows sent and duration.' },
      { id: 'manage', title: 'Accounts, connectors and rules', text: 'Manage FTP accounts, connectors, field-mapping rules and users.' },
    ],
    flow: ['FTP drop', 'Scheduled run', 'Field mapping', 'Connector', 'Run log'],
    facts: {},
    screenshot: {
      alt: 'FTP-Handler overview: cards for FTP accounts, rules, connectors and rows sent, above a table of recent scheduled ingestion runs, all successful. File names are blurred.',
    },
    angles: {
      cloud: {
        kicker: 'Client build · data pipeline',
        title: 'Scheduled FTP inventory feeds, every run logged',
        line: 'FTP drop points picked up on a schedule, mapped by rules and sent on, with every run logged.',
        problemTitle: 'Feeds that failed without anyone noticing',
        problemText:
          'Inventory that arrives as files on FTP servers comes in different shapes from different senders. When a drop is late or a column moves, the listings are wrong until someone spots it.',
        seoTitle: 'Automated FTP Inventory Feed Pipeline',
        seoDescription:
          'Case study: scheduled FTP inventory ingestion. Files picked up from drop points, mapped by rules, sent through verified connectors, every run logged.',
      },
    },
    sources: [HANDOFF],
  },
  'skip-trace-orchestrator': {
    id: 'skip-trace-orchestrator',
    name: 'Skip-trace orchestration service',
    cardTitle: 'Skip-trace orchestration service on Vultr',
    kind: 'client',
    ownership: 'client',
    niches: ['cloud'],
    proof: 'strong',
    client: 'Client build · data enrichment',
    live: false,
    summary:
      'A Flask webhook service that receives GoHighLevel contact events, runs a tiered waterfall of data-enrichment vendors (skip tracing, address and phone checks, court and business records) and writes the results back to the GHL contact, under a cost cap.',
    stack: {
      items: ['Python 3.12', 'Flask 3 + gunicorn', 'requests', 'phonenumbers', 'APScheduler', 'pydantic', 'SQLite', 'Twilio', 'HMAC webhooks', 'Docker', 'GitHub Actions', 'Vultr'],
      provisional: false,
    },
    modules: [
      { id: 'webhook', title: 'Verified webhooks', text: 'HMAC verification and event de-duplication.' },
      { id: 'waterfall', title: 'Tiered waterfall', text: 'Runs data vendors in tiers, cheapest first, under a cost cap.' },
      { id: 'writeback', title: 'GHL write-back', text: 'Results land back on the GoHighLevel contact.' },
      { id: 'sms', title: 'SMS flows', text: 'Claim, completion and alert messages through Twilio and email.' },
      { id: 'deploy', title: 'Deploy to Vultr', text: 'Docker image deployed over SSH with a smoke test.' },
    ],
    flow: ['GHL webhook', 'HMAC check', 'Vendor tiers', 'Cost cap', 'Write-back'],
    facts: {},
    notes: ['Handles personal data, so the details here stay general.'],
    angles: {
      cloud: {
        kicker: 'Client build · webhook service',
        title: 'A skip-trace waterfall behind a verified webhook',
        line: 'GoHighLevel events in, enrichment vendors run in tiers under a cost cap, results written back.',
        problemTitle: 'Paying every vendor for every contact',
        problemText:
          'Enrichment vendors charge per lookup. Calling them all for every new contact wastes money, and a webhook that is not verified or de-duplicated can be replayed or fire twice.',
        modulePicks: ['webhook', 'waterfall', 'deploy', 'writeback', 'sms'],
        seoTitle: 'Webhook Service: Skip-Trace Waterfall',
        seoDescription:
          'Case study: a Flask webhook service on Vultr. HMAC-verified GoHighLevel events, enrichment vendors in tiers under a cost cap, Docker deploys from CI.',
      },
    },
    sources: [HANDOFF],
  },
};
