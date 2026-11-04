# Contributing

Thanks for helping. This is a small codebase with a few strict rules. Read the [README](README.md) first, especially [Rules](README.md#rules) and [Honesty and placeholders](README.md#honesty-and-placeholders).

## Run it

```bash
npm install            # Node >= 22.23.4
npm run dev            # http://localhost:4321/<slug>/  (there is no root page)
npm run check          # astro check, 0 errors expected
npm run check:person   # identity is valid (also warns about projects, template default images and env overrides)
npm run check:claims   # article / years / role helper tests
npm run check:seo-title  # title / description helper tests and case meta lint
npm run review:copy    # first-person phrases still literal in the niche copy
npm run build          # gen:vercel + astro build -> dist/
npm run check:links    # no broken internal links in dist/
npm run check:leaks    # the previous owner's tokens in dist/, plus the client-name blocklist (fails on any hit)
```

The scripts in `scripts/` are TypeScript run directly by Node (native type stripping). They use Node built-ins only, explicit `.ts` import extensions, and no enums or namespaces. The same goes for the `src/` files they load: `src/niches.ts` (gen:vercel, new:niche, check:person), `src/person/config.ts` (check:person, check:links), `src/person/schema.ts` (check:person, init:person), `src/person/person.ts` and `src/person/claims.ts` (check:claims), `src/person/projects.ts` (check:person) and `src/lib/shared/seo-title.ts` (check:seo-title). `src/person/case-helpers.ts` follows the same rules (explicit `.ts` import), though no script imports it today. `src/person/shots.ts` is the exception: it uses `import.meta.glob`, so only Astro code may import it, never `projects.ts`, `case-helpers.ts` or a script.

## Honesty rules

These are not style preferences. A change that breaks one is not merged. The full list, with where each rule comes from, is in [`docs/TEMPLATE.md`](docs/TEMPLATE.md#honesty-rules).

- **Never invent** numbers, prices, testimonials, client names, rankings or credentials. That includes "realistic" example metrics in meta tags, OG images or JSON-LD.
- **A missing input is a visible `TODO ·` chip**, never filler copy.
- **Illustrative content is labelled** ("Example" stamp, `exampleCase()`, or an "illustrative figures" note).
- **Identity comes from `src/person/` only.** Never hard-code a name, email, domain or project name in a niche. An unset claim field must never print the previous owner's wording.
- **No client names anywhere**: copy, alt text, file names, ids, meta, OG images, JSON-LD. Client work is described generically, and screenshots are redacted before they go into `src/person/assets/projects/`. The blocklist lives in `scripts/client-blocklist.ts` (never in `src/`) and `npm run check:leaks` fails on any hit.
- **New projects need no niche code**: add the record to `src/person/projects.ts` with its `niches` (see [`docs/TEMPLATE.md`](docs/TEMPLATE.md#add-a-project-with-no-code)). Write a hand-written angle only when a niche needs wording the generated case cannot give.
- **No new price, savings or leak calculators.** The funnels leak calculator (labelled as an estimate) is the one still in the code.
- **Grids fill complete rows** with dashed slots, the footers' "Elsewhere" column links only the main site, and an unknown credential leaves its FAQ entry out.

## Refactors: prove the output did not change

A refactor that is meant to change nothing has to produce the same build, file for file. The workflow:

1. **Baseline.** Before you change anything, build to a folder outside the repository **on the same drive**. A different drive fails with `EXDEV`.
   ```bash
   npx astro build --outDir ../_baseline
   ```
2. **Change**, then build again: `npx astro build --outDir ../_after`.
3. **Compare** the two trees: the same file list and identical bytes.
   ```bash
   diff -r ../_baseline ../_after && echo CLEAN
   ```
   A few generated ids in the HTML can differ between any two builds. If they do, normalise them before you diff, and say so in the pull request.
4. **Delete** the two folders.

Run one build at a time: concurrent builds share `.astro/` and fail with random `ERR_MODULE_NOT_FOUND` errors. When a change is meant to alter the output (copy, design, a new feature), say what changed and how you checked it in a browser: desktop and 390px wide, both themes.

## Commits and pull requests

- **One topic per commit.** Write the subject in the imperative, sentence case, no trailing period, for example `Add SEO backlinks section, Shopify restyle`.
- **Keep generated files in sync.** `vercel.json` is generated from `src/niches.ts`, so commit it together with the registry change that produced it.
- **No secrets.** `.env.development` is committed and contains public `PUBLIC_` values only (they are shipped to the browser). The template has no `.env`, so the contact form uses `src/person/config.ts`; do not add one with `PUBLIC_CONTACT_*` values in a contribution. Put local overrides in `.env.local`, which is git-ignored.
- **No new dependencies** without discussing them first. Fonts are self-hosted files with a row in `src/assets/fonts/README.md` (source and licence), not packages.
