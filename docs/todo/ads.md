# ads.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch (`src/niches.ts`). Everything on the page is either
a verified fact (decisions.md, your repo via `docs/research/ai-local.md`) or clearly labelled as
an example. There are **no numbers posing as results** anywhere: not on the page,
not in the OG images, not in the JSON-LD. No prices anywhere ("Scoped on a call").

## 1. Before launch (visible dashed TODO chips on the page)

- **Proof strip numbers** (brief: spend managed, waste cut, accounts automated). Three dashed
  cells: *TODO · Monthly spend across automated accounts*, *TODO · Spend stopped by rules, with
  the period*, *TODO · Count of accounts with rules live*. Edit `PROOF_TODOS` in
  `src/data/ads/content.ts`.
- **Minimum spend currency.** Decision says "500 at least" with no currency, so the site says
  "500 a month in ad spend" and shows *TODO · Confirm the currency (USD?)* in the proof strip and
  the FAQ. Set `MIN_SPEND_LINE` / `MIN_SPEND_TODO` in `src/data/ads/site.ts`.
- **Client case "An account I automated"**: dashed placeholder slot on the home page with
  *TODO · Spend saved*, *TODO · CPA before / after*, *TODO · Alerts caught*. No page yet.
- **Client case "A tracking fix"**: dashed placeholder slot with *TODO · Conversions recovered*,
  *TODO · Platform and setup*. No page yet.
  To publish either: add it to `CASES` in `src/data/ads/cases.ts` (it gets a `/work/<slug>/`
  page, OG image and sitemap entry automatically), remove it from `PLACEHOLDERS`, and add its
  slug to the view-transition lists in `src/styles/ads/base.css`.
- **Offline conversions case** (`/work/offline-conversions/`):
  - *TODO · Confirm whether outcomes are uploaded to Google / Meta yet, and from which data.*
    The docs only verify capture (landing page, referrer, UTMs at first touch), MongoDB first,
    then GoHighLevel via API with custom fields. So the upload back to ad platforms is framed as
    "the step built on top", drawn dashed in the flow and marked "next" in the OG image.
  - *TODO · Match rate and conversions uploaded, once the upload runs.*
  - *TODO · Confirm the custom fields used in GoHighLevel.*
  - *TODO · Confirm leads from these niche sites go through the same pipeline.*
- **Six-rules teardown** (`/work/six-rules/`): *TODO · Replace with a real anonymized account
  teardown and its numbers.*
- **Headshot**: About uses `src/assets/ads/faraz.jpg`, a copy of the portrait the other niches use.

## 2. Examples (labelled; confirm you're happy with them)

- **Hero guard board**: "Example account · illustrative". Four guards (budget cap, CPA guard,
  tracking check, spend anomaly), each with a mini chart where 1 = its own threshold; one trips
  per beat, acts, and is logged. "Campaign A", "ad set B" and the log time stamps (14:20,
  Tue 09:00, …) are made up. Relative values only, never money.
- **Rules engine** (signature): "Example account · illustrative", 14 invented days of CPA ÷
  target and spend ÷ cap (7-day average spend 0.55 of cap; day 8 runs past the cap; day 12 jumps
  above average + 50% while staying under the cap). Day counts ("CPA over target on 11 of 14 days" → 3) are properties of
  the example data, not results. Rule thresholds (2 days, 6 hours, +50%) are my starting points.
- **Six-rules teardown**: labelled "Example · illustrative" everywhere; the thresholds in its rule
  sheet (2× target CPA, CTR 30% below its first week, etc.) are starting points, said so on the page.
- **Lead record example** on the offline case: field names are the real ones the shared form
  sends (`ft_landing`, `ft_referrer`, `ft_utm_*`, `niche`); the values are an example.
- **No calculator.** The brief's waste estimator was removed on your rule: no price or estimate
  calculators on any niche.

## 3. Please confirm (facts and promises I used)

- **Tools / methods named in offers and FAQ**: "the platforms' own APIs and scripts", Meta's
  Conversions API, Google's enhanced conversions, offline conversions from the CRM, Slack or
  email alerts, creative rotation. These come from the brief's offer ladder, not from your repo.
  Remove any you don't do.
- **Every-build list**: change log, spend caps, alert channel (Slack/email), tracking verification,
  read-only / alert-only option (from the brief) plus **"Rules in plain words"** (mine, added to
  fill the 3 × 2 grid).
- **Safety promises** (FAQ "Will rules ever pause good ads?", process step "Automate"): thresholds
  agreed with you, a minimum amount of data before acting, alert-only mode first, hard spend
  caps, every action logged and reversible.
- **Access** (FAQ): read-only for the audit, narrowest access for automation, accounts stay yours.
- **Managed automation** scope: "monitoring of the rules and alerts I built, plus a monthly pass".
  The "I built" limit is mine.
- **"No Google or Meta partner status, and no badges"** is stated on the page (About, FAQ), per
  the decision. Say if you'd rather not mention it at all.
- **About copy**: "found automation through GoHighLevel" paraphrases your about page; "Works with"
  (n8n, Make, Zapier, Python, Node.js, MongoDB, GoHighLevel) is from your stack decision/research.
- **Lead Drift** appears only as "runs in production with MongoDB as its data layer" (the
  research's wording). Confirm, and tell me if any of its data actually feeds ads.
- **Niche-site leads**: decisions verify the MongoDB → GoHighLevel pipeline and first-touch
  capture for farazahmad.dev only. The page therefore claims it for farazahmad.dev, makes no
  claim about the form on this site, and shows *TODO · Confirm leads from these niche sites go
  through the same pipeline* on the offline-conversions case. Once confirmed, the case can say
  the form at the bottom of the page goes through it.
- **"Lead pipeline live"** status chip on the offline case card and page: my wording.

## 4. Technical notes

- **Fonts (assigned pair):** Clash Grotesk (display, Fontshare, ITF FFL) and Inter Tight (body,
  SIL OFL). JetBrains Mono shared, Clash Display for the footer signature. Sources in
  `src/assets/fonts/README.md`.
- **Accent:** amber `#ffb020` fills in both themes (graphite text on it, 10:1). On light paper,
  amber words use `--accent-text` `#875200` (5.7:1) and strokes `--accent-line` `#b06f00` (3.6:1).
  Waste is a muted red, saved a muted green; all text pairs pass AA in both themes.
- **Signature:** in-place player, never scroll-jacked; autoplay at 1/3 visible, pause/play,
  prev/next, click a step, story segments whose `animationend` advances. Never autoplays under
  reduced motion (shows the finished state); without JS the chart shows the finished state and
  every step as a list.
- **Page transitions:** cross-document View Transitions. The new page rises in through six
  columns, like bars on a chart, each topped by an amber strip (left to right forward, right to
  left back); only the clicked case's box morphs into the case hero. Verify on a production
  build (dev disables bfcache).
- **OG images** `/og/home.png`, `/og/offline-conversions.png`, `/og/six-rules.png` built by
  `src/lib/ads/og.ts` (rule syntax and flow only, no numbers). Favicon `/icon.svg` and
  `/apple-touch-icon.png` from `src/lib/ads/brand-mark.ts`.
- **Removed:** the template placeholder `src/assets/ads/hero.svg`.

## 5. Launch checklist

1. Section 1 done, sections 2–3 confirmed.
2. `src/niches.ts` → `noindex: false` for `ads`.
3. `npm run check && npm run build`, then mobile Lighthouse on `/`.
4. Vercel domain + Spaceship CNAME for `ads` (README › DNS).
5. Submit `https://ads.farazahmad.dev/sitemap.xml` in Search Console.
