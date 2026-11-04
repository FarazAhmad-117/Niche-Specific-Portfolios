/**
 * PROJECTS: the person's real projects, each stored ONCE. Two ways a project reaches a niche:
 *
 *  1. NO CODE: list the niche slugs in the project's `niches`. Every niche that has a
 *     generated-case adapter (`autoCases()` in its src/data/<slug>/cases.ts) builds its own case
 *     for it: a /work/<id>/ page, an OG image, JSON-LD and a sitemap entry, shown in that niche's
 *     "More builds" section. Wording per niche goes in `angles.<slug>` (kicker, title, line,
 *     problemTitle, problemText, modulePicks, seoTitle, seoDescription); without it the canonical
 *     fields (cardTitle, summary, modules, flow) are used. See docs/TEMPLATE.md › Add a project
 *     with no code.
 *  2. A hand-written angle: a `fromProject('<id>', angle)` block in a niche's cases.ts. The
 *     existing angles are written for ids in `ProjectId`; reuse one only if your project really
 *     fits that case (grep `fromProject('` and `getProject('` in src/data/ and src/components/).
 *
 * Reset by `npm run init:person -- --reset-projects` on {{generatedOn}}.
 *
 * EXAMPLE MODE. The registry below is empty, so every niche runs without any project of yours:
 * a case whose project is missing is left out (its page, OG image and sitemap entry go too), and
 * where a layout needs a fixed number of cards it shows a dashed `TODO ·` slot or a case
 * labelled "Example". Nothing of the previous owner's projects renders.
 *
 * Honesty: every value is a verified fact from the person's own records. Unknown = leave the
 * field out (the niche then shows a dashed `TODO ·` chip or drops the line). Never put an
 * estimate, a sample figure or a placeholder here. `notes` are caveats every niche prints on the
 * case page. Never a client's name, people's names or client domains (`npm run check:leaks`).
 *
 * Pure TS on purpose (Node-loadable, no Astro imports, no image imports). Screenshots: put the
 * file at src/person/assets/projects/<id>.png (or .jpg/.webp) and set `screenshot.alt`; the
 * shared resolver (src/person/shots.ts) finds it by id. Delete the previous owner's files there.
 */
import type { NicheSlug } from '../niches.ts';

/** Every project id the niches may refer to. Keep these (the niches' hand-written angles name some of them) and add yours. */
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


/**
 * The registry. `Partial` on purpose: a project can be absent, and every lookup has to handle
 * that (see case-helpers.ts). Empty = Example mode for every niche. Order matters: generated
 * cases follow it.
 */
export const PROJECTS: Readonly<Partial<Record<ProjectId, Project>>> = {};