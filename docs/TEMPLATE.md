# Template reference

This page is the reference behind the README's [Make it yours](../README.md#make-it-yours) section. The README has the steps. This page explains how the per-person data flows into the niches, so you can change it safely.

- [Honesty rules](#honesty-rules)
- [Where per-person data lives](#where-per-person-data-lives)
- [Which niche uses which project](#which-niche-uses-which-project)
- [Project fields](#project-fields)
- [Generated cases](#generated-cases)
- [Add a project with no code](#add-a-project-with-no-code)
- [Shared screenshots](#shared-screenshots)
- [Keys each angle reads](#keys-each-angle-reads)
- [The case pattern](#the-case-pattern)
- [Case helper API](#case-helper-api)
- [Example mode in detail](#example-mode-in-detail)
- [Claim helpers](#claim-helpers)
- [Checks and what they cover](#checks-and-what-they-cover)
- [Files a new owner usually replaces](#files-a-new-owner-usually-replaces)

## Honesty rules

Code comments refer to this section as "docs/TEMPLATE.md › honesty rules". Each rule below is followed in the code as described.

1. **Never invent** numbers, prices, testimonials, client names, rankings or credentials. That includes "realistic" metrics in meta tags, OG images or JSON-LD. Prices read "Scoped on a call" (for example `PRICE_LINE` in `src/data/ads/content.ts`), and testimonial sections are omitted.
2. **A missing input is visible.** It renders as a dashed `TODO · …` chip (`src/components/shared/Todo.astro`, `orTodo()`; the ai, cloud and seo Todo components; the `todo()` fields of ai, cloud, seo and apps), or as a visual labelled "Example" or "Illustrative" (`exampleCase()` requires `example: true`; the ai `sample(...)` figures carry an "illustrative figures" note and never reach meta, OG or JSON-LD).
3. **Grids fill complete rows.** When a card or proof cell is missing, a dashed slot takes its place so rows stay full (`slotsToFill()` in `src/person/case-helpers.ts`; the slot constants are listed in [Example mode in detail](#example-mode-in-detail)).
4. **The footers' "Elsewhere" column links only the main site** (`MAIN_SITE_URL`). Stated in the wp and webflow footer comments; checked in the ai and wp footers.
5. **No price, savings or leak calculators on new work.** Cloud's savings calculator, webflow's estimators and the ads waste estimator were removed (comments in `src/components/cloud/Leaks.astro` and `src/data/webflow/content.ts`; `docs/todo/ads.md`). One remains: the funnels leak calculator (`src/components/funnels/LeakCalc.astro`, labelled as an estimate), which `docs/brief/DECISIONS.md` › funnels decided to include.
6. **Unknown credentials are left out.** A credential that is not set in `config.ts` (`credentials`) drops its FAQ entry, its FAQPage JSON-LD entry and any About note (`credentialAnswer()` returns `undefined`). Never set one to `true` without proof.
7. **An unset claim field never prints the previous owner's wording** (`src/person/claims.ts`), and a niche never renders another person's project in place of a missing one ([Example mode](#example-mode-in-detail)).

Where the rules come from: `docs/brief/DECISIONS.md` ("Never invent prices, numbers, testimonials or credentials", visible placeholders for missing inputs, testimonials omitted) and `docs/brief/README.md` ("Never invent numbers"). The calculator rule is a later owner instruction, recorded in `docs/todo/ads.md`, `docs/todo/cloud.md` and the code comments named above. The "Elsewhere" and complete-row rules are stated in code comments only; the owner's private working brief they may come from is not part of the repository.

## Where per-person data lives

| File | What it holds | Loaded by |
|---|---|---|
| `src/person/config.ts` | `PERSON_CONFIG`: identity, contact, domain, claim fields | `src/niches.ts`, `src/person/person.ts`, the scripts (Node, type stripping) |
| `src/person/schema.ts` | `PersonConfig` type, `personConfigProblems()`, `validatePersonConfig()` | `person.ts` (build), `check-person.ts`, `init-person.ts` |
| `src/person/person.ts` | `PERSON` (validated), `jobTitleFor`, `bookingUrlFor`, `yearsBuilding`, `yearsPlus`, `yearsSuffix`, `FOOTER_SIGNATURE` | `src/data/<slug>/site.ts`, endpoints, `scripts/check-claims.ts` |
| `src/person/profile.ts` | `PORTRAIT` (imports `assets/faraz.jpg`), `profileFor(slug)` | `src/data/<slug>/profile.ts` (Astro only) |
| `src/person/claims.ts` | Helpers for the optional first-person claim fields (including `SUPPORT_HOURS`) and wording helpers (`withArticle`, `roleInSentence`, `ROLE_IN_SENTENCE`, `FOUNDED_VERB`, …) | niche data and components, `scripts/check-claims.ts` |
| `src/person/projects.ts` | `PROJECTS` registry, `Project`, `ProjectId`, `ProjectAngle`, `ModulePick` | `case-helpers.ts`, `scripts/check-person.ts` |
| `src/person/case-helpers.ts` | `fromProject`, `present`, `exampleCase`, `autoCases`, `angleFor`, `nicheProjects`, … | `src/data/<slug>/cases.ts`, components |
| `src/person/shots.ts` | `projectShot(p)`: the shared screenshot of a project, by id (`import.meta.glob`, Astro only) | `src/data/<slug>/cases.ts`, components |
| `src/person/assets/projects/<id>.<ext>` | One screenshot per project id, already redacted | `shots.ts` |
| `src/niches.ts` | Registry (slug, name, enabled, noindex), `ROOT_DOMAIN`, `nicheHost`, `nicheOrigin` | everything |

Every niche's `src/data/<slug>/site.ts` derives its constants (`CONTACT_EMAIL`, booking URL, `MAIN_SITE_URL`, `BRAND_COMPANY`, …) from `PERSON`, and `src/data/<slug>/profile.ts` derives `PROFILE` from `profileFor()`. No niche file should contain a literal name, email or domain. `npm run check:person` lists any it finds outside `src/person/`, `src/assets/` and the case/content files, and, with a fixed list of the template owner's identifiers, the leftovers of his identity (including ones in comments).

## Which niche uses which project

A project reaches a niche in one of two ways:

1. **A hand-written angle.** A `fromProject('<id>', angle)` block in the niche's `src/data/<slug>/cases.ts`, with the case's slug in the niche's `CaseSlug` union and the block in its `present([...])` list. These are the niche's `CASES` and they render in its main case grid or list. They render whenever the project exists in `PROJECTS`.
2. **A generated case, with no code.** The project's `niches` lists the slug and the niche has no hand-written angle for it. The niche's one adapter builds the case (`MORE_CASES`), and it renders in the niche's "More builds" section with its own `/work/<id>/` page. See [Generated cases](#generated-cases).

`NICHE_PROJECTS` in a niche's cases.ts is only a list: `src/data/ai/cases.ts` passes it to `companyProjects()` for `COMPANY_PROJECT_NAMES`, `npm run check:person` reads it, and comments refer to it. It does not decide what renders.

At the time of writing:

| Niche | Hand-written angles (`CASES`) | Generated from `niches` (`MORE_CASES`, "More builds") | Other lookups (copy gated on a project) |
|---|---|---|---|
| ai | `lead-drift`, `yard-terminal`, `solidmake`, `ai-seo-automator` | `ai-roofing-estimator`, `ai-ops-command-center`, `opencode-chat` | `getProject('lead-drift')` in `components/ai/About.astro` and `ProofStrip.astro`; `companyProjects(NICHE_PROJECTS)` |
| apps | cases `solidmake`, `yard-terminal`, `farazahmad-dev`; supporting cards `ai-seo-automator`, `lead-drift` | `sluice`, `team-task-saas`, `audio-splitting-saas` | `getProject` of `farazahmad-dev`, `yard-terminal`, `solidmake` in `data/apps/content.ts` |
| cloud | `yard-terminal`, `solidmake`; the `own-stack` case is built from `findOwnSite()` (any `kind: 'own-site'` project whose stack and facts back the copy, see `data/cloud/own-stack.ts`), so cloud passes `farazahmad-dev` to its adapter as hand-written | `indepth-dashboard`, `ftp-feed-handler`, `skip-trace-orchestrator` | `getProject('yard-terminal')` in `lib/cloud/tools.ts` |
| funnels | `lead-drift`, `lead-pipeline`, `ai-seo-automator` | `imessage-campaign-saas` (`farazahmad-dev` is listed too, but the `lead-pipeline` case stands for it: see the `partOf` rule) | `getProject('lead-drift')` in `data/funnels/content.ts`; `getProject(p.partOf)` for the pipeline's parent |
| ghl | `lead-pipeline` | `ghl-crm-dashboard`, `ghl-kpi-dashboard`, `ghl-sync-backend`, `ghl-outbound-ops`, `voice-ai-n8n-workflows`, `ghl-conversation-ai-build` | `getProject('lead-pipeline')` in `data/ghl/content.ts`, `hasProject('lead-pipeline')` in `components/ghl/FinalCta.astro`; `getProject(p.partOf)` |
| seo | `ai-seo-automator`, `farazahmad-dev` | `furniture-bazar` | `getProject` of both in `data/seo/content.ts` |
| shopify | `yard-terminal` | `quarry`, `catalog-scraper-shopify` | `getProject` / `hasProject('yard-terminal')` in `data/shopify/{site,sync,content}.ts`, `lib/shopify/sections.ts`, `components/shopify/About.astro` |
| ads | `lead-pipeline` (as the `offline-conversions` case) | none (no adapter) | `getProject('lead-drift')`, used only when `live: true`; `hasProject('lead-pipeline')` in `data/ads/content.ts` |
| wp | `ai-seo-automator` | none (no adapter) | `getProject('ai-seo-automator')` in `data/wp/content.ts` |
| webflow | none (`niche-sites` describes this repo's own sites, `figma-to-cms` is a labelled example) | none (no adapter) | — |
| all | none (a hub of the other niches) | — | — |

ads, wp and webflow have no adapter on purpose: the owner chose to show no further projects there. A project that lists one of them in `niches` renders there only through a hand-written angle (`npm run check:person` warns otherwise).

Components that branch on a fixed id or position (check them when you add or rename a case): `MAIN_CASE` and `HAS_OWN_PIPELINE` in `src/data/funnels/cases.ts` (`'lead-drift'`, `'lead-pipeline'`), `src/components/funnels/Cases.astro` and `src/pages/funnels/work/[slug].astro` (`'lead-pipeline'`, `'lead-drift'`), `src/components/seo/Cases.astro` (`'farazahmad-dev'`), `src/components/apps/Cases.astro` (`'lead-drift'`), the apps hero (`'solidmake'` in `src/data/apps/content.ts`), `src/components/shopify/SyncMap.astro` (`'yard-terminal'`), and the wp home row, which shows only the first non-example case. The tuned case transition rules in each `src/styles/<slug>/base.css` list the slugs by name.

Re-check with:

```bash
grep -rnE "(fromProject|getProject|hasProject|projectOrExample)\('" src
grep -rn "export type CaseSlug" src/data
grep -rn "autoCases(" src/data          # the niches with a generated-case adapter
grep -n "niches:" src/person/projects.ts
```

## Project fields

The shape is `Project` in `src/person/projects.ts`; `scripts/templates/person-projects.ts.tpl` carries the same types for `init:person --reset-projects`. Fields added for generated cases are all optional, so older records keep working.

| Field | Type | What it is |
|---|---|---|
| `id`, `name`, `kind`, `live`, `facts`, `sources` | required | As before. `kind` now also accepts `'client'`: work built for a client, never named. |
| `cardTitle` | string | Card and page heading when it differs from `name` ("GHL pipeline KPI dashboard"). |
| `ownership` | `'own' \| 'client'` | `client` work gets a "Confidential client" treatment unless it is named on purpose (it has an owner-approved `link`). |
| `niches` | `NicheSlug[]` | Where the project appears. Drives the generated cases; hand-written angles render regardless (their niche is listed here for the record). |
| `proof` | `'strong' \| 'partial' \| 'weak'` | Evidence strength from the code scan. Niches may use it to order or size cards. |
| `repo` | `{ label, href }` | Public source repository, rendered only where present (Sluice is the only one today). |
| `notes` | string[] | Caveats every niche prints on the case page ("Pre-release: no third-party cryptographic review yet."). |
| `screenshot` | `{ alt, copies? }` | `alt` is the shared alt text. The file lives in [the shared folder](#shared-screenshots); `copies` (now optional) lists the older per-niche copies. |
| `angles` | `Partial<Record<NicheSlug, ProjectAngle>>` | A niche's wording for the generated case (below). |

`ProjectAngle` keys, every one optional, plain strings only:

| Key | Used for | Default when absent |
|---|---|---|
| `kicker` | Eyebrow above the title | From what the project is: "Client build", "Own product", "Internal product", "Research", "Own site" (`kindLabel()`) |
| `title` | Card and page heading | `cardTitle`, else `name` |
| `line` | One-line angle: card snippet, "next case" link, OG image | First sentence of `summary`, else the title |
| `problemTitle`, `problemText` | The problem block | The `problemTitle` / `problemText` facts; with neither, niches drop or derive the block from the summary |
| `modulePicks` | Which modules, in which order, with optional rewording (`ModulePick`) | Every module, in order |
| `seoTitle` | Page title core, before ` \| <name>` (46 characters or fewer keeps the full name) | `<name>: Case Study` |
| `seoDescription` | Meta description, 155 characters or fewer | `Case study: <first sentence of summary>` |

The lengths are enforced at build by each niche's `assertMeta` guard; the adapters pass both strings through `fitDescription()` with shorter fallbacks.

## Generated cases

`src/person/case-helpers.ts`:

| Helper | Returns | Notes |
|---|---|---|
| `nicheProjects(slug, handWritten)` | the projects whose `niches` includes `slug`, in registry order, minus `handWritten` | **partOf rule:** a project also counts as shown when a hand-written case is one of its `system` parts (`partOf`). funnels' `lead-pipeline` case stands for `farazahmad-dev`, so that project is not generated a second time. |
| `angleFor(p, slug)` | `ResolvedAngle` | `angles[slug]` over the canonical fields: `kicker`, `title`, `line`, `problem?`, `built`, `flow` (`flow`, else the built titles), `seoTitle`, `seoDescription`, `confidential` (client work). |
| `autoCases(slug, handWritten, build)` | `build(p, angleFor(p, slug))` for each project from `nicheProjects()` | `build` is the niche's one adapter from a project to its own case type. |
| `kindLabel(p)` | the default kicker | |

Each niche with an adapter (ai, apps, cloud, funnels, ghl, seo, shopify) exports, in its `src/data/<slug>/cases.ts`:

- `CASES`: the hand-written cases, unchanged. Every existing home consumer (proof strips, About lines, the main grid) still reads only this.
- `MORE_CASES = autoCases('<slug>', <hand-written ids>, adapter)`: the generated cases, each flagged `generated: true`.
- `ALL_CASES = [...CASES, ...MORE_CASES]`: what every per-case route reads: `CASE_SLUGS` (sitemap), `getCase`, the "next case" ring, `work/[slug].astro`'s `getStaticPaths`, the OG targets in `src/lib/<slug>/og.ts` and the JSON-LD (CreativeWork + BreadcrumbList) in `src/lib/<slug>/jsonld.ts`. So a generated case gets the same page, OG image, structured data and sitemap entry as a hand-written one.

What an adapter prints: only registry values. Title, line, problem, built list and SEO strings from `ResolvedAngle`; the stack; the status and link only when set; every `notes` entry on the case page; the shared screenshot when there is one, otherwise the niche's own illustrative diagram built from the flow, labelled as an illustration. No sample figures, no measured results, no TODO chips: what is unknown is left out.

Where they render: a "More builds" section on the niche's home page, designed in that niche's visual language, sized so rows are complete (one wide card, two or three across, or three by two), or folded into the main grid where the count completes its rows. The main grid and the signature section are unchanged. The "next case" ring runs through `ALL_CASES`, so the last hand-written page now links on to the first generated one.

## Add a project with no code

1. **Add the id** to the `ProjectId` union in `src/person/projects.ts`.
2. **Add the record** to `PROJECTS`, in the order you want the cards (generated cases follow registry order). Fill only verified facts: `name`, `kind`, `ownership`, `live`, `summary`, `stack` (`provisional: false` once confirmed), `modules`, `facts: {}`, `sources`, and `status` / `link` / `flow` / `notes` when you have them.
3. **List the niches** it appears on in `niches`, for example `niches: ['apps', 'cloud']`. Only niches with an adapter (ai, apps, cloud, funnels, ghl, seo, shopify) generate a case.
4. **Optionally word it per niche** in `angles.<slug>` (kicker, title, line, problem, module picks, SEO title and description). Keep the SEO title core at 46 characters or fewer and the description at 155 or fewer.
5. **Optionally add a screenshot**: redact it first, save it as `src/person/assets/projects/<id>.png`, and set `screenshot.alt`.
6. **Check**: `npm run check:person` (warns about unknown niche slugs, a niche that will not render it, `angles` keys missing from `niches`, and module picks the project lacks), then `npm run check`, `npm run build`, `npm run check:seo-title` and `npm run check:leaks`.

Every adapter niche then shows it in "More builds", with a `/work/<id>/` page, an OG image, JSON-LD and a sitemap entry. A hand-written angle is only needed when a niche must say something the generated case cannot.

```ts
// src/person/projects.ts (placeholder values; every value must be a verified fact)
'my-tool': {
  id: 'my-tool',
  name: 'My Tool',
  kind: 'client',
  ownership: 'client',
  niches: ['apps'],
  live: false,
  summary: 'Two or three sentences that are true wherever the project is shown.',
  stack: { items: ['Next.js', 'MongoDB'], provisional: false },
  modules: [{ id: 'portal', title: 'Client portal', text: 'What this part does.' }],
  facts: {},
  notes: ['A caveat every case page must show.'],
  angles: {
    apps: { kicker: 'Client build · SaaS', seoTitle: 'My Tool: a Client Portal SaaS', seoDescription: 'Case study: …' },
  },
  sources: ['where these facts come from (never rendered)'],
},
```

## Shared screenshots

- **One folder for every niche:** `src/person/assets/projects/<project id>.<png|jpg|jpeg|webp>`. `src/person/shots.ts` imports the folder with an eager `import.meta.glob` and `projectShot(p)` returns `{ src, alt }` only when the file exists **and** the project has `screenshot.alt`. No per-niche copy, no import per image. `shots.ts` is Astro-only: never import it from `projects.ts`, `case-helpers.ts` or a script.
- **Redact before the file goes in.** No client brand, file names, host names or people. The current files were redacted with a script and checked by eye (see each project's `screenshot.alt`, which says what is blurred). UI figures inside a screenshot (a mock-up dashboard, run counts) are never quoted in copy.
- **Older per-niche copies** (`src/assets/ai/cases/yard-terminal-site.png`, the three `leadrift.png` files, `src/assets/apps/yard-terminal-site.png`) keep their static imports in their niches and are listed in `screenshot.copies`.
- **Unused files do not ship.** The eager glob makes Astro emit every file in the folder; the `prune-unused-images` integration in `astro.config.mjs` then deletes, after the build, every emitted original that no built page, stylesheet or script mentions and that has no resized copies. A screenshot whose project is absent, or that no niche renders, is removed (the build log prints `removed unused image …`).
- **Template images.** `scripts/template-assets.json` lists the files in the folder, so `npm run check:person` warns while they are still the template owner's.

## Keys each angle reads

`fact(p, key)`, `modules(p, [...])` and `madeBy(p)` throw at build time when the record lacks the key: `[projects] <id> has no fact "<key>"`, `[projects] <id> has no module "<module id>"`, `[projects] <id> has no "madeBy" (the angle names the company that makes it)`. A record under one of these ids needs every key listed for it, or the angles that read the missing key must change. Optional fields (`status`, `link`, `stack`, `summary`, `flow`, `screenshot`, `toolName`, …) never throw: the copy falls back or drops out.

| Id | Facts | Modules | `madeBy` |
|---|---|---|---|
| `ai-seo-automator` | `byok` (wp, funnels), `problemTitle` and `problemText` (ai, seo, funnels), `oneLiner` (apps supporting card) | the record has `crawl`, `competitors`, `keywords`, `publish`, `score`, `byok`, `approvals`, `pipeline`; seo and wp pick `crawl`, `keywords`, `publish`, `approvals`, `score`, `byok`; ai and funnels pick from the same set | — |
| `yard-terminal` | `problemTitle` (ai, apps), `runsNow` (ai, cloud) | `record`, `vin`, `approve`, `delist` (ai, apps, shopify); the record also has `tenant`, `ebay` | — |
| `solidmake` | — | `words`, `normalise`, `models`, `step` (ai, apps) | — |
| `lead-drift` | `problemTitle`, `problemText` (ai, funnels) | `scrape`, `outreach`, `sequences` (ai, funnels); the record also has `pipeline`, `jobfeed`, `crawler`, `templates` | required by ai |
| `farazahmad-dev` | `tests`, `lighthouse`, `leadsFirst` (apps case), `testsCount` (apps proof strip, `src/data/apps/content.ts`) | — | — |
| `lead-pipeline` | `retry` (ghl, funnels) | — | — |

Cloud also reads `testsCount` and `checks` of the own-site project, but only when `OWN_SITE` is set, which requires the facts `testsCount`, `checks`, `lighthouse`, `leadsFirst` and the stack items `Next.js 16`, `MongoDB`, `Sentry`, `PostHog`; otherwise that copy drops out instead of throwing.

Generated cases read no fixed keys: `angleFor()` uses whatever the record has. The one thing that throws is a module id in `angles.<slug>.modulePicks` that the record lacks, which `npm run check:person` reports.

`npm run check:person` warns about missing keys before the build, best effort: it scans the `fromProject('<id>', …)` blocks in `src/data/<slug>/cases.ts` with a regex, resolves `modules(p, SOME_CONST)` against a same-file const array (seo's `AUTOMATOR_MODULES`), and checks every `angles.<slug>.modulePicks`. It does not see reads outside those blocks other than `fact(x, …)` on a same-file `getProject()` constant (the apps proof strip), nor cloud's own-stack angle. Reusing one of these ids also reuses the angle's wording, sample figures and measured numbers; those are tracked in `scripts/owner-claims.json` (`npm run review:copy`).

## The case pattern

A niche's `cases.ts` keeps its own wording ("angle") and reads only project-owned values from the registry:

```ts
import type { ProjectId } from '../../person/projects';
import { exampleCase, fact, fromProject, modules, present } from '../../person/case-helpers';

export const NICHE_PROJECTS = ['ai-seo-automator'] as const satisfies readonly ProjectId[];
export type CaseSlug = 'ai-seo-automator' | 'plugin-heavy-teardown';

const automator = fromProject('ai-seo-automator', (p): WpCase => ({
  id: 'ai-seo-automator',              // literal, so CaseSlug stays a union
  name: p.name,                        // owned by the project
  kicker: 'A product I built · publishing', // the niche's angle, verbatim
  built: modules(p, ['crawl', { id: 'publish', title: 'Written and published' }]),
  facts: [fact(p, 'byok')],
  // ...
}));
const teardown = exampleCase<WpCase>({ id: 'plugin-heavy-teardown', example: true /* ... */ });

export const CASES = present([automator, teardown]);
export const CASE_SLUGS: readonly CaseSlug[] = CASES.map((c) => c.id); // sitemaps import this
```

This is the shape of `src/data/wp/cases.ts`, shortened (wp has no adapter). The hand-written cases are the ones in `present([...])`; `NICHE_PROJECTS` is informational (see [above](#which-niche-uses-which-project)). In a niche with an adapter the file goes on:

```ts
const adapter = (p: Project, a: ResolvedAngle): NicheCase => ({ /* the niche's case, from registry values only */ generated: true });
export const MORE_CASES = autoCases('<slug>', CASES.map((c) => c.id), adapter);
export const ALL_CASES = [...CASES, ...MORE_CASES];
export const CASE_SLUGS = ALL_CASES.map((c) => c.id); // sitemaps import this
```

A project with a new id does not need a hand-written block any more: list the niche in its `niches` ([Add a project with no code](#add-a-project-with-no-code)). Write a `fromProject('<id>', …)` block only for wording the generated case cannot give; then add the slug to `CaseSlug` and the block to `present([...])`, and check the niche's components for fixed-id branches. A project with a hand-written angle in a niche is never generated there too.

Rules:

- **Read from the project only what is identical everywhere.** That means the name, link, status, canonical modules and facts. Where a niche words something differently, keep its wording as an override (a `modules()` pick object or a literal).
- **Derive `CASE_SLUGS` from `ALL_CASES`** (from `CASES` in a niche without an adapter). A hard-coded list would put pages that no longer exist into the sitemap.
- **Select cases by `example` or id, never by position** (`const [main, teardown] = CASES` breaks when one is absent).

## Case helper API

From `src/person/case-helpers.ts`:

| Helper | Returns | Notes |
|---|---|---|
| `getProject(id)` | `Project \| undefined` | |
| `hasProject(id)` | boolean | Use it to gate copy that names a project. |
| `findOwnSite()` | the first `kind: 'own-site'` project, or undefined | For copy about "my own site" in general. |
| `companyProjects(ids)` | the projects among `ids` with `madeBy` set | "the company behind A and B". |
| `madeBy(p)` | `p.madeBy` | Throws when absent: `[projects] <id> has no "madeBy" (…)`. |
| `fromProject(id, angle)` | `angle(p)` or undefined | Pass the results through `present()`. |
| `projectOrExample(id, angle, example?)` | `angle(p)`, else the labelled example | Only where every consumer renders `example: true` as an Example stamp. |
| `present(cases)` | cases without the undefined ones | Keeps the authored order. |
| `exampleCase(c)` | `c` | Type check: an illustrative case must have `example: true`. |
| `isExample(c)` | boolean | |
| `modules(p, picks)` | `{ title, text }[]` | Picks by id, with optional title/text overrides. Throws on an unknown id: `[projects] <id> has no module "<module id>"`. |
| `fact(p, key)` | string | Throws on an unknown key: `[projects] <id> has no fact "<key>"`. |
| `fill(text, p)` | string | Tolerant `{name}` `{status}` `{link}` `{href}` interpolation. |
| `slotsToFill(count, perRow)` | number | Placeholder slots needed to complete the last row. |
| `nicheProjects(slug, handWritten)` | `Project[]` | See [Generated cases](#generated-cases). |
| `angleFor(p, slug)` | `ResolvedAngle` | See [Generated cases](#generated-cases). |
| `autoCases(slug, handWritten, build)` | `C[]` | See [Generated cases](#generated-cases). |
| `kindLabel(p)` | string | The default kicker. |

From `src/person/shots.ts` (Astro only): `projectShot(p)` returns `{ src, alt }` or `undefined`, see [Shared screenshots](#shared-screenshots).

## Example mode in detail

Example mode is what a niche renders when a project it refers to is missing from `PROJECTS`. An empty registry (`npm run init:person -- --force --reset-projects`) puts every niche in Example mode.

What the code guarantees:

- **Absent projects are omitted.** `fromProject()` returns `undefined` and `present()` drops it, so the case, its `/work/<id>/` page, its OG image and its sitemap entry are gone. Generated cases exist only for projects that are present, so with an empty registry `MORE_CASES` is empty and the "More builds" sections render nothing (check each niche's section on your own build).
- **Grids keep full rows.** Where a layout needs complete rows, the gap is filled with dashed `TODO ·` slots. `slotsToFill(count, perRow)` computes the count in `src/data/ads/cases.ts`, `src/data/cloud/cases.ts`, `src/components/apps/Cases.astro`, `src/components/funnels/Cases.astro`, `src/data/ghl/content.ts` and `src/data/shopify/content.ts` (proof cells), and `src/lib/cloud/tools.ts` (tool chips). `projectOrExample()` (fall back to a labelled Example) exists, but no niche uses it yet.
- **No borrowed projects.** A niche never renders another person's project in place of a missing one.

The placeholder constants per niche (all in `src/data/<slug>/cases.ts`):

| Niche | Constants |
|---|---|
| apps | `CASE_SLOT` (case sheets), `DETAIL_SLOT` (supporting cards) |
| funnels | `CASE_SLOT`, `OWN_PROJECT_SLOT` |
| seo | `OWN_RESULT_SLOT` (only when no project case is left) |
| wp | `OWN_PRODUCT_SLOT` (in place of the own-product card), `CASE_SLOT` (the open client case) |
| shopify | `OWN_PROJECT_SLOT` |
| ghl | `OWN_PROJECT_SLOT` |
| ads | `OWN_BUILD_SLOT` (repeated by `HOME_SLOTS`) |
| cloud | `CASE_SLOT` (repeated `CASE_SLOTS` times) |

"Next case" links: every niche whose cases come from projects returns no next case when only one case is left, so a case page never links to itself. webflow's `nextCase()` throws instead, but its two cases have no project behind them and are always present.

Known leftovers (verify on your own build with `npm run check:leaks`):

- **Dead CSS.** Each niche's `src/styles/<slug>/base.css` still contains `::view-transition-*(case-<slug>)` selectors for Faraz's case slugs. They match nothing and render nothing. They were kept so the template refactor left Faraz's build byte-identical; a new case slug does not get these tuned rules.
- **Portrait file name.** The built portrait keeps its source name (`_astro/faraz.<hash>.<ext>`); `check:leaks` reports it in its own class, which `--strict` allows.
- **Cross-niche links.** Some apps and funnels links point at the ai niche's write-up of a project. They assume the ai niche still has that case.
- **Shopify's signature section** (the sync map) is built around one project. Check how it renders for you.

Screenshots of absent projects do not ship: the `prune-unused-images` integration in `astro.config.mjs` removes, after the build, every emitted `_astro/<name>.<hash>.<ext>` image that no built page, stylesheet or script mentions and that has no resized copies. That covers the per-niche imports and the whole shared folder `src/person/assets/projects/` (imported eagerly by `src/person/shots.ts`). A build that renders every import is left exactly as it was.

How a full-Example-mode site looks has not been reviewed in a browser for every niche. Look at each niche's home and case pages before you launch.

## Claim helpers

From `src/person/claims.ts`. Each helper returns `undefined` or an empty list when its field is unset, so the caller drops the clause, uses neutral wording or shows a TODO chip:

| Helper | From | Unset gives |
|---|---|---|
| `FIRST_NAME`, `SHORT_NAME` | `firstName`, `shortName` | `SHORT_NAME` falls back to `firstName` |
| `PRONOUNS`, `pronoun(kind)` | `pronouns` | they / them / their |
| `OWNER_STACK`, `usesTool(t)`, `stackFor(list, always)` | `stack` | empty lists (the niche's own platform in `always` is kept) |
| `PROFESSION`, `SENIORITY`, `seniorNoun(noun)` | `profession`, `seniority` | `undefined` / the bare noun |
| `CAREER_LINE`, `EXPERIENCE_SHORT` | `careerLine`, `experienceShort` | `undefined` |
| `credential(key)`, `credentialAnswer(state, { denied, confirmed })` | `credentials` | `undefined`: the FAQ entry is left out |
| `originStory(slug)` | `originStories` | `undefined` |
| `CONTACT_FEEDS_CRM` | `contactFeedsCrm` | `false` |
| `SUPPORT_HOURS` | `supportHours` | `undefined`: cloud drops the hours lines (Nav, Footer, FinalCta, About, Hero, JSON-LD) and its copy says "business hours" |
| `roleInSentence(role)`, `ROLE_IN_SENTENCE` | `companyRole` | "Lead Engineer" → "lead engineer"; all-caps words ("CTO") are kept |
| `FOUNDED_VERB` | `companyRole` | `'co-founded'` for a co-founder role, `'founded'` for another founder role, else `undefined` (the copy names the role instead) |
| `withArticle(phrase)` | — | "a" / "an" by sound, with exceptions: "an hour", "an honest", "a user", "a unique", "a one-off", "a European"; an all-caps acronym is read letter by letter ("an SEO engineer", "a CTO") |
| `andList`, `capitalize`, `sentences(...)` | — | wording utilities |

From `src/person/person.ts`: `yearsPlus()` gives "3+ years", or `undefined` in the start year (no "0+ years"); `yearsSuffix()` gives " (3+ years)" or "". `npm run check:claims` tests `withArticle`, the years helpers and the role helpers.

Adding a credential programme means adding its key to `CREDENTIAL_KEYS` in `src/person/schema.ts` and writing both answers in the niche that mentions it.

## Checks and what they cover

| Command | Covers | Fails (exit 1) when |
|---|---|---|
| `npm run check:person` | config validity; literal owner strings in `src/` outside `src/person/`, `src/assets/` and `src/data/<slug>/{cases,content}.ts`, plus the template owner's own identifiers (fixed list `scripts/owner-tokens.ts`, searched even after `init:person`; WARN with `file:line`, counts only for the case/content files; skipped when the config is his own); "first-person claims to review": every claim field with its value or `(unset)` (including `supportHours`; an empty `stack` prints `[]`) and the count of registered literal claims still present; the niches with a generated-case adapter; WARNs for projects not in the `ProjectId` union or shown by no niche (no hand-written reference and no adapter niche in `niches`), for `niches` entries that are unknown slugs or will not render (a niche with no adapter and no angle for the project), for `angles` keys missing from `niches`, for `angles.<slug>.modulePicks` ids the project lacks, and (best effort, a regex over the `fromProject` blocks) for facts / modules / `madeBy` an angle reads that the project lacks; WARNs for images in `scripts/template-assets.json` that are still byte-identical and for `PUBLIC_CONTACT_*` in `.env*` that point off `rootDomain` | the config is invalid (warnings never fail) |
| `npm run check:claims` | `withArticle` (exceptions and acronyms), `yearsPlus` / `yearsSuffix`, `roleInSentence`, and `ROLE_IN_SENTENCE` / `FOUNDED_VERB` for the current `companyRole` | an assertion fails |
| `npm run review:copy` | every phrase in `scripts/owner-claims.json` (kinds `claim`, `tools`, `stance`, `positioning`, `metric`, `project-wording`): `STILL PRESENT` or `STALE`. Scans `src/` except `src/person/` (including its `.backup/`); a phrase found only in comments is flagged `[only in comments]` | `--strict` and any phrase present (always the case with Faraz's copy) |
| `npm run check:seo-title` | the `withNameSuffix` title helper with the current and a 29-character name; `fitDescription`; a lint that every case title / description in `src/data/<slug>/cases.ts` that interpolates a value goes through `fitDescription` | an assertion fails |
| `npm run check` | TypeScript (astro check) | type errors |
| `npm run build` | identity validation, per-page title/description limits, launch guards (ai, cloud), the `gen:vercel` page check | any of them throws |
| `npm run check:links` | internal links, `<loc>` entries and `Sitemap:` lines in a build | a target file is missing |
| `npm run check:leaks` | tokens of the previous owner in a build (and `src/` minus `src/person/` and `src/assets/` with `--src`), classed by where they sit; build file names too, with the portrait's (`faraz.*`) in their own class, "asset file name (portrait keeps the source name)". `--tokens-file` resolves against the folder npm was run from, `--dir` against the repository root. **Always, independent of the flags:** the client-name blocklist in `scripts/client-blocklist.ts` (client companies, people, brands, domains and screenshot file names; never kept in `src/`), matched case-insensitively and word-bounded over the build (text files and every file name) and all of `src/`, `src/person/` and file names included | **any client-name hit** (with or without `--strict`); `--strict` and a hit of the owner tokens outside dead CSS selectors and the portrait file-name class. With Faraz's identity still in `config.ts` the `--strict` part always fails (his name renders everywhere): run it after replacing the identity, or with a `--tokens-file` of project tokens |

## Files a new owner usually replaces

| Path | Why |
|---|---|
| `src/person/config.ts` | Your identity (`npm run init:person`). |
| `src/person/projects.ts` | Your projects (with `niches`, so they render with no code), or an empty registry. Keep the ids in `ProjectId` that the niches' hand-written angles name, and add yours. |
| `src/person/assets/faraz.jpg` | Your portrait, same file name. |
| `src/person/assets/projects/*` | Faraz's shared project screenshots: delete them, add yours as `<your id>.png`. |
| `src/assets/<slug>/*.png` screenshots | Faraz's older per-niche project screenshots. |
| `scripts/client-blocklist.ts` | Faraz's client names; replace with your own clients' names so `check:leaks` guards them. |
| `src/data/<slug>/content.ts`, `cases.ts` | The niche copy: remaining first-person claims (`npm run review:copy`) and case angles. |
| `.env`, `.env.development` | Nothing to do for the contact form if `contactEndpoint` / `contactFallbackEmail` are set in `config.ts`: the template ships no `.env` (a `PUBLIC_CONTACT_*` line in one would override the config), and `.env.development` only points `npm run dev` at a local endpoint. |
| `docs/brief/`, `docs/research/`, `docs/design/`, `docs/todo/`, `docs/screenshots/` | Faraz's briefs, research, decisions, todo lists and review images. (A local `docs/resume/` folder is untracked and not part of the repository.) |
| `LICENSE` | Add your own copyright line for your changes, if you want one. |
