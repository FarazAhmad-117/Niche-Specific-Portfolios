/**
 * Helpers that build a niche's case list from the shared PROJECTS registry plus the niche's own
 * angle. Pure TS (Node-loadable). Generic over each niche's own case interface: nothing here
 * knows a niche's fields except `example`.
 *
 * The pattern in a niche's cases.ts:
 *
 *   export const NICHE_PROJECTS = ['ai-seo-automator'] as const satisfies readonly ProjectId[];
 *
 *   const automator = fromProject('ai-seo-automator', (p): WpCase => ({
 *     id: 'ai-seo-automator',
 *     name: p.name,                                   // owned by the project
 *     kicker: 'My own product · publishing',          // the niche's angle, verbatim
 *     built: modules(p, ['crawl', { id: 'publish', title: 'Written and published' }]),
 *     ...
 *   }));
 *   const teardown = exampleCase<WpCase>({ ..., example: true });
 *
 *   export const CASES = present([automator, teardown]);
 *
 * EXAMPLE MODE. When a project an angle refers to is not in PROJECTS (a new person, or a project
 * not cleared yet), `fromProject` returns `undefined` and `present()` drops it, so the niche
 * never renders someone else's project. A niche whose layout needs a fixed number of cards
 * (grids fill complete rows) fills the gap with a dashed TODO slot or a labelled Example case:
 * `projectOrExample(id, build, example)` and `slotsToFill(count, perRow)`.
 */
import type { NicheSlug } from '../niches.ts';
import { PROJECTS, type ModulePick, type Project, type ProjectId, type ProjectModule } from './projects.ts';

/** The project, or undefined when this person does not have it. */
export const getProject = (id: ProjectId): Project | undefined => PROJECTS[id];

export const hasProject = (id: ProjectId): boolean => PROJECTS[id] !== undefined;

/**
 * The person's own site: the first project with kind 'own-site', in registry order, or undefined.
 * Use it for copy about "my own site" in general. Copy that cites specific measured facts of that
 * site must still check those facts (or stack items) are present before it prints them; a case
 * about one named project keeps its id lookup.
 */
export const findOwnSite = (): Project | undefined => Object.values(PROJECTS).find((p) => p?.kind === 'own-site');

/**
 * The projects among `ids` (in that order) that are company products (`madeBy` set). Used for
 * lines like "the company behind A and B": a missing project, or one with no `madeBy`, is left out.
 */
export const companyProjects = (ids: readonly ProjectId[]): readonly Project[] =>
  ids.flatMap((id) => {
    const p = PROJECTS[id];
    return p?.madeBy ? [p] : [];
  });

/** The project's `madeBy` company. Throws when it is absent: an angle that names the company needs it. */
export function madeBy(p: Project): string {
  if (p.madeBy === undefined) throw new Error(`[projects] ${p.id} has no "madeBy" (the angle names the company that makes it)`);
  return p.madeBy;
}

/**
 * Build a niche case from a project and the niche's angle. The angle is a function of the
 * project so project-owned values (name, link, status, modules) are read from the registry
 * while every niche-specific string stays verbatim in the niche file. Returns undefined when
 * the project is absent (Example mode): pass the result through `present()`.
 */
export function fromProject<C>(id: ProjectId, angle: (p: Project) => C): C | undefined {
  const p = PROJECTS[id];
  return p ? angle(p) : undefined;
}

/**
 * Like fromProject, but when the project is absent returns `example` instead: a case that MUST
 * be labelled (`example: true`, which every niche renders as an "Example" stamp), or undefined to
 * omit it. Use it only where the niche's layout copes with an example in that position.
 */
export function projectOrExample<C extends { readonly example: boolean }>(
  id: ProjectId,
  angle: (p: Project) => C,
  example?: C & { readonly example: true },
): C | undefined {
  const p = PROJECTS[id];
  return p ? angle(p) : example;
}

/** Drop the cases whose project is absent, keeping the authored order. */
export const present = <C>(cases: readonly (C | undefined)[]): readonly C[] => cases.filter((c): c is C => c !== undefined);

/** Identity with a type check: an illustrative case must say so. */
export const exampleCase = <C extends { readonly example: boolean }>(c: C & { readonly example: true }): C => c;

export const isExample = (c: { readonly example?: boolean }): boolean => c.example === true;

export type { ModulePick };

/**
 * The project's modules, in the order picked. An override replaces only the fields it names:
 * use one exactly where the niche's original wording differs from the canonical module.
 * Throws on an unknown id (a typo, or the registry entry lost a module): fail the build loudly.
 */
export function modules(p: Project, picks: readonly ModulePick[]): { title: string; text: string }[] {
  return picks.map((pick) => {
    const id = typeof pick === 'string' ? pick : pick.id;
    const m: ProjectModule | undefined = p.modules?.find((x) => x.id === id);
    if (!m) throw new Error(`[projects] ${p.id} has no module "${id}"`);
    if (typeof pick === 'string') return { title: m.title, text: m.text };
    return { title: pick.title ?? m.title, text: pick.text ?? m.text };
  });
}

/** One keyed fact line. Throws when the project does not have it. */
export function fact(p: Project, key: string): string {
  const f = p.facts[key];
  if (f === undefined) throw new Error(`[projects] ${p.id} has no fact "${key}"`);
  return f;
}

/**
 * Tolerant `{token}` interpolation for angle text authored as plain strings:
 * `{name}`, `{status}`, `{link}` (the link label) and `{href}`. A token whose value is missing,
 * and any other `{...}`, is left exactly as written, so text without tokens is returned
 * unchanged, character for character. Prefer template literals (`${p.name}`) in TS; use this
 * for strings that live in JSON-like tables.
 */
export function fill(text: string, p: Project): string {
  const values: Readonly<Record<string, string | undefined>> = {
    name: p.name,
    status: p.status,
    link: p.link?.label,
    href: p.link?.href,
  };
  return text.replace(/\{(name|status|link|href)\}/g, (whole, key: string) => values[key] ?? whole);
}

/**
 * How many placeholder slots a grid needs so `count` cards fill complete rows of `perRow`
 * (docs/TEMPLATE.md › honesty rules: grids fill complete rows). 0 when the row is already full.
 */
export const slotsToFill = (count: number, perRow: number): number => (perRow - (count % perRow)) % perRow;

// ------------------------------------------------------------------------------------------
// Generated cases: a project reaches a niche with no code when its `niches` lists the slug.
// ------------------------------------------------------------------------------------------

/**
 * The projects listed for `slug` (their `niches` includes it), in registry order, minus the ones
 * the niche already shows through a hand-written angle. `handWritten` is the list of project ids
 * those angles use (normally the niche's hand-written CASE slugs). A project also counts as shown
 * when a hand-written case is one of its `system` parts (`partOf`): funnels' lead-pipeline case
 * stands for farazahmad-dev there, so farazahmad-dev is not generated a second time.
 */
export function nicheProjects(slug: NicheSlug, handWritten: readonly string[]): readonly Project[] {
  const shown = new Set(handWritten);
  for (const id of handWritten) {
    const parent = PROJECTS[id as ProjectId]?.partOf;
    if (parent) shown.add(parent);
  }
  return Object.values(PROJECTS).filter((p): p is Project => p !== undefined && (p.niches ?? []).includes(slug) && !shown.has(p.id));
}

/** A niche's wording for a generated case, every field resolved (see ProjectAngle in projects.ts). */
export interface ResolvedAngle {
  /** Eyebrow / kicker. Default: "Own product", "Client build", … from ownership and kind. */
  readonly kicker: string;
  /** Card and page heading. Default: `cardTitle`, else `name`. */
  readonly title: string;
  /** One-line angle. Default: the first sentence of `summary`, else the title. */
  readonly line: string;
  /** Only when the angle or the project supplies one (never invented). */
  readonly problem?: { readonly title: string; readonly text: string };
  /** The picked modules, or every module. */
  readonly built: readonly { readonly title: string; readonly text: string }[];
  /** Flow nodes: `flow`, else the built titles. */
  readonly flow: readonly string[];
  /** Page title core (before the name suffix). Default: `<name>: Case Study`. */
  readonly seoTitle: string;
  /** Meta description. Default: `Case study: <first sentence of summary>`. */
  readonly seoDescription: string;
  /** True for client work: niches may show a "Confidential client" treatment. */
  readonly confidential: boolean;
}

const firstSentence = (s: string): string => /^(.+?[.!?])(\s|$)/.exec(s)?.[1] ?? s;

/** The default kicker from what the project is. */
export function kindLabel(p: Project): string {
  if (p.ownership === 'client' || p.kind === 'client') return 'Client build';
  if (p.kind === 'internal') return 'Internal product';
  if (p.kind === 'research') return 'Research';
  if (p.kind === 'own-site') return 'Own site';
  return 'Own product';
}

/** The project's wording for `slug`: its `angles[slug]` override over the canonical fields. */
export function angleFor(p: Project, slug: NicheSlug): ResolvedAngle {
  const a = p.angles?.[slug] ?? {};
  const title = a.title ?? p.cardTitle ?? p.name;
  const built = a.modulePicks ? modules(p, a.modulePicks) : (p.modules ?? []).map((m) => ({ title: m.title, text: m.text }));
  const problemTitle = a.problemTitle ?? p.facts.problemTitle;
  const problemText = a.problemText ?? p.facts.problemText;
  return {
    kicker: a.kicker ?? kindLabel(p),
    title,
    line: a.line ?? (p.summary ? firstSentence(p.summary) : title),
    ...(problemTitle && problemText ? { problem: { title: problemTitle, text: problemText } } : {}),
    built,
    flow: p.flow ?? built.map((b) => b.title),
    seoTitle: a.seoTitle ?? `${p.name}: Case Study`,
    seoDescription: a.seoDescription ?? `Case study: ${p.summary ? firstSentence(p.summary) : p.name}`,
    confidential: p.ownership === 'client' || p.kind === 'client',
  };
}

/**
 * The niche's generated cases: `build(p, angle)` for every project from `nicheProjects()`, in
 * registry order. `build` is the niche's one adapter from a project to its own case shape.
 */
export function autoCases<C>(slug: NicheSlug, handWritten: readonly string[], build: (p: Project, a: ResolvedAngle) => C): readonly C[] {
  return nicheProjects(slug, handWritten).map((p) => build(p, angleFor(p, slug)));
}
