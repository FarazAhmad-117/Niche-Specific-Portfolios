# cloud.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch (`src/niches.ts`). Everything on the page is a
verified fact (DECISIONS.md, `docs/research/ai-local.md`, `src/data/ai/cases.ts`, this repo's
README) or is visibly labelled **TODO**, **Example** or **Illustrative**.
`src/data/cloud/todo.ts` makes the build fail if `noindex` is turned off while any TODO remains in
the cases, the proof strip, the tool slots or the FAQ chips.

## 1. Before launch: every TODO chip on the site

### Home › Proof strip (`src/data/cloud/content.ts › PROOF`)
- `TODO · baseline` **Uptime** (a real client service, once cleared)
- `TODO · baseline` **Deploys a week** (before / after a CI/CD setup)
- `TODO · baseline` **Measured savings** (monthly bill before / after)

### Home › Clouds & tools (`src/data/cloud/site.ts › TOOLS_TODO`)
- `TODO · confirm clouds you use (AWS? GCP? Azure?)`
- `TODO · infra-as-code tool` (Terraform, Pulumi, CDK, none?)
- `TODO · CI runner` (GitHub Actions? Vercel builds?)
- `TODO · certifications (or none)`. No certification is claimed anywhere until you confirm one.
- Shown as verified today: **Vercel** (these niche sites are built to run as one Vercel project, per README; not deployed yet), **GitHub**
  (github.com/FarazAhmad-117), **Sentry** and **MongoDB** (farazahmad.dev `package.json`). Remove any
  you do not want listed.

### FAQ (`content.ts › FAQ`, page only, never in JSON-LD)
- `TODO · confirm clouds and any certifications` on "Which clouds do you work with?". The answer now says the niche sites are built to run on
  Vercel and farazahmad.dev uses GitHub, Sentry and MongoDB; where farazahmad.dev is hosted is not claimed.

### Case studies (`src/data/cloud/cases.ts`), every metric is `TODO · baseline` (before AND after)
| Case | Metrics to measure | Other TODOs |
|---|---|---|
| Yard Terminal | Uptime · Sync jobs a day · Deploys a week | `confirm queue / worker setup`, `confirm hosting`, `regions, scaling` |
| SolidMake | Cost per job · Processing time per job · Monthly compute bill | `confirm GPU / compute and hosting`, `confirm compute (GPU?)`, `hosting, queueing`, card chip `compute setup and numbers` |
| Client migration & CI setup | Deploy time · Outages a month · Monthly bill | **Client name withheld / TODO**, `moved from`, `moved to`, `CI setup used`, `what was breaking before`, `how traffic moved, and the rollback`, `tests, previews, deploy steps`, `what is watched, who is alerted`, `docs and access handed back`, `before stack`, `CI pipeline`, `after stack`. The whole case is "Write-up pending" until you name a project and the client approves it. |
| Infra teardown: my own stack | Monthly hosting bill · Build and deploy time · Deploys a month | none (all architecture facts are from the research / README) |

## 2. Savings calculator: removed

- **Removed on the owner's instruction (2026-11-03):** too big and technical for non-technical
  visitors, and dollar figures clash with "no pricing anywhere". `Savings.astro` and
  `src/data/cloud/savings.ts` are deleted; no assumed savings ranges remain on the site.
- **Replaced by "Where cloud bills usually leak"** (`#leaks`, `content.ts › LEAKS`): six
  plain-language line items (servers on all night, sized for launch day, backups nobody deletes,
  test setups still running, paying full price, data on the move), no numbers, one "Get a cost
  audit" CTA. Please confirm these are the things you actually check first ("These are the ones I
  check first" is in the copy).
- **FAQ "How do you estimate savings?"** now answers in words: from your real bill during the
  audit, no figure before the bill is seen, savings only counted once measured.

## 3. Status board and hero (illustrative, please read once)

- **Status board** (`src/data/cloud/board.ts`): an example service, five steps. Every number
  (latency 2,400 → 180 ms, errors 8.2 → 0.1%, deploys 1 → 15 / week, cost $4,800 → $2,900 / month)
  is **illustrative**, stamped so on the screen and under the controls. Change them if you want a
  different story; they never reach meta, OG or JSON-LD.
- **Hero panel**: "example-app" status page and deploy log, stamped "Example". Behind it, two panel
  headers ("pipeline · example-app · passing", "alerts · example-app · quiet"), a shape-only latency
  trace with an alert line (no numbers), and three states ("deploys automated", "rollback ready",
  "restore tested"). All illustrative; they restate promises already in the copy.
- **Process**: drawn as a pipeline run (`on: your call`, `needs: audit` …). No durations, counts
  or "passed" states are shown.
- **Problem section**: the five incident tickets are the brief's fears written as tickets.

## 4. Please confirm (facts and promises I used)

- **Support hours:** "8AM–5PM EST, not on-call" (decision). I did not say which days. Confirm
  weekdays only, and whether you mean EST all year or US Eastern time (EST/EDT).
- **Care plan** keeps the decided label "On-call / care plan" but the copy says **Not on-call**,
  with a "Business hours · 8AM–5PM EST · not 24/7" tag. The FAQ "Do you do on-call?" answers **No**.
- **Service promises** written into copy (not in DECISIONS.md, remove any that are not true):
  "Scope is agreed before any work starts"; "I work in your accounts under a named login, my
  access is removed at handover"; "multi-factor sign-in"; "a restore actually run and timed";
  "I can set up the alerting so it reaches [your 24/7 team]"; FinalCta success message
  "I'll reply within business hours".
- **Every-engagement list:** infra as code, runbooks, alerting, backups + tested restore,
  least-privilege access, handover (brief §4). Remove any you don't do on every job.
- **About:** "I came to infrastructure from full-stack work" is my framing of your career arc.
  "Building since 2022" reuses the funnels niche profile.
- **Own-stack teardown:** facts from `docs/research/ai-local.md` (Next.js 16, MongoDB, Sentry,
  PostHog, leads → MongoDB → GoHighLevel, 257 tests, Lighthouse 2026-10-02) and this repo's README
  (one Vercel project, generated rewrites, noindex switch, build fails if an enabled niche has no
  page). Please confirm farazahmad.dev itself is hosted on Vercel; the research only found Vercel
  referenced, so the page only says the **niche sites** run on Vercel.
- **Yard Terminal:** facts from the ai niche's verified case (eBay Motors + Shopify, one record per
  part, per-yard isolation, append-only audit trail, pre-launch, 200 founding yards). Nothing about
  its infrastructure (queues, hosting) is stated.
- **SolidMake:** "heavy compute" is the brief's angle. No GPU or hosting is claimed.

## 5. Technical notes

- **Fonts (new):** Archivo (variable, width axis), Manrope, Martian Mono, all SIL OFL from
  Fontsource; sources in `src/assets/fonts/README.md`.
- **Portrait:** `src/assets/cloud/faraz.jpg` (copy of the funnels/ai portrait).
- **OG images** `/og/home.png` and `/og/<case>.png` (`src/lib/cloud/og.ts`): no numbers, no TODOs.
  Favicon `/icon.svg` and `/apple-touch-icon.png` from `src/lib/cloud/brand-mark.ts`.
- **Page transitions:** case card ↔ case hero morph (`case-<slug>`), reversed for back/up.

## 6. Launch checklist

1. Sections 1, 2 and 4 done.
2. `src/niches.ts` → `noindex: false` for `cloud` (the build refuses while case TODOs remain).
3. `npm run check && npm run build`, then mobile Lighthouse on `/`.
4. Vercel domain + Spaceship CNAME for `cloud` (README › DNS).
5. Submit `https://cloud.farazahmad.dev/sitemap.xml` in Search Console.
