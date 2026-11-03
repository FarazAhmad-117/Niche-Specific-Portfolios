# ai.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch. Three kinds of content are on the pages now:

- **Verified facts** (plain text): from your decisions, your own repo (`docs/research/ai-local.md`),
  the Yard Terminal site (`docs/research/ai-web.md`) and what you told me (2022, Lahore, PKT, the
  stack). Nothing to do.
- **Illustrative figures** (22 values, listed below): realistic-looking numbers so the layouts read as
  finished. They are **not measured results**. Every page that shows one prints "Illustrative figures,
  replaced with measured results before launch", they never appear in meta tags, OG images or JSON-LD,
  and **the build refuses to run once `noindex` is switched off while any remain** (launch guard in
  `src/data/ai/todo.ts`, called from `src/data/ai/cases.ts`).
- **TODO chips:** none left. If you add a `todo(...)` it renders as a visible dashed chip.

## 1. Replace the illustrative figures with real ones (blocks launch)

Edit `src/data/ai/cases.ts`: replace each `sample('id', 'value')` with the real string. Delete the
row if you cannot measure it. When none are left the note disappears by itself.

| Case | Value (id suffix) | Shown as |
|---|---|---|
| Lead Drift | Year (`year`) | 2024 (hidden on the page while it is a sample) |
| Lead Drift | Baseline: manual prospecting, leads contacted, follow-ups missed (`base.hours` / `base.leads` / `base.missed`) | 12 hours · 80 · about 1 in 3 |
| Lead Drift | Results before/after (`r1`-`r3`, `.b` / `.a`) | 12 h/week → 2 h/week · 80 → 600 leads/week · 66% → 100% on time |
| Yard Terminal | Year (`year`) | 2025 (hidden while a sample) |
| SolidMake | Year (`year`) | 2025 (hidden while a sample) |
| SolidMake | Baseline time to model a simple part (`base.time`) | 40 minutes |
| SolidMake | Time per part (`r1`) | 40 min → 3 min |
| AI SEO Automator | Year (`year`) | 2024 (hidden while a sample) |
| AI SEO Automator | Baseline: time per page, pages per week (`base.time` / `base.pages`) | 3 hours · 2 |
| AI SEO Automator | Pages published, time per page (`r1`, `r2`) | 2 → 20 per week · 3 h → 15 min |

**Yard Terminal has no illustrative figures on purpose.** Its own `/limits` page says there is no
customer count or time-saved figure yet, so its results are verified product facts only.
The years are the unconfirmed fallbacks from your repo, not dates I can verify.

## 2. Please confirm (facts I used)

- **Yard Terminal channels: eBay Motors and Shopify only.** Your product site says Facebook
  Marketplace is "coming soon" and that Amazon and Google are not supported. The earlier brief
  and repo copy listed five channels; I used the product site. Fix the case copy if that changed.
- **Status:** Lead Drift is shown as running in production (your decision). Yard Terminal is shown as
  "Opening to founding yards" / pre-launch (from yardterminal.com). SolidMake and AI SEO Automator show no status.
- **Stack per project is provisional** where marked "My usual stack for this kind of build":
  Next.js, React, Tailwind CSS and MongoDB for Lead Drift and AI SEO Automator; NestJS added for Yard
  Terminal (your word). SolidMake uses Python, DeepCAD and Text2CAD from your repo. Edit `stack` in
  `src/data/ai/cases.ts` and set `stackProvisional: false`.
- **Years:** "Building since 2022" is your word. Your main site says "3+ years of full-stack"; they
  agree roughly, but check the two statements do not conflict in your own copy.
- **Title:** "Founder, Indepth Solution" and "Automation Expert & Full-Stack Engineer" come from
  farazahmad.dev (also used in the Person JSON-LD, with Lahore, PK).
- **Contact email:** decisions say `farazahmad31048@gmail.com` and that is what the site uses. Your
  main-site code falls back to `faraz@cupupmarketing.com`; make sure that is intentional.
- **Case descriptions** (what Lead Drift, SolidMake and AI SEO Automator do) come from your repo's
  `lib/case-studies.ts`; nothing public confirms them, so read each case once.
- **"Indepth Solution"** is named publicly (copy, OG, JSON-LD). Its team size, founding year and
  numbers (from indepthsolution.com) are deliberately not used.

## 3. Copy that makes a claim: check before launch

- **FAQ 5** says OpenAI and Anthropic state that API data is not used for training by default. Re-check both
  providers' current terms the day you launch (`src/data/ai/content.ts`).
- **"Weeks, not months" / "Weeks, with working demos"** (process, comparison) and **"No hourly billing"**
  (services) come from the brief. Remove any that is untrue.
- **Comparison table** uses generalisations about agencies and no-code freelancers, captioned as such.

## 4. Technical notes

- **Portrait:** `src/assets/ai/faraz.jpg` is copied from your repo (`public/portrait.jpg`, black and white on
  black, so it sits in an ink frame in both themes). Swap the file to change it.
- **Clash Display** is from Fontshare (ITF Free Font License), committed in `src/assets/fonts/` per your
  decision. If the repo is public, re-read the licence terms on redistribution. Sources: `src/assets/fonts/README.md`.
- **Favicon** is `/icon.svg` + `/apple-touch-icon.png` (per-niche paths; `public/favicon.svg` is shared by every niche).
- **CSS is inlined** (`build.inlineStylesheets: 'always'` in `astro.config.mjs`): mobile LCP 2.0s → 1.8s. Applies to every niche.
- **OG images** are generated at build (`src/lib/ai/og.ts`, `satori` + `@resvg/resvg-js`). They never print a
  sample, a placeholder or numbering.
- Research notes are kept in `docs/research/` (sources for every fact above).

## 5. Launch checklist

1. Replace every `sample(...)` (section 1). Confirm section 2.
2. `src/niches.ts` → `noindex: false` for `ai` (removes the robots meta, flips `robots.txt` to allow with a
   `Sitemap:` line; the sitemap already lists home and the four case pages). **The build fails until step 1 is done.**
3. `npm run check && npm run build`, then re-run mobile Lighthouse on `/` and one case page.
4. Submit `https://ai.farazahmad.dev/sitemap.xml` in Search Console.

Leadrift screenshot added: Lead Drift case page, a framed figure straight under the hero; confirm the job posts shown are fine to publish.
