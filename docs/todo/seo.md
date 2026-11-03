# seo.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch (`src/niches.ts`). Everything on the page is either
a verified fact (decisions.md, your repo via `docs/research/ai-local.md`, the ai niche's verified
AI SEO Automator facts) or clearly labelled as an **Example** / **Illustration**. There are **no
illustrative numbers** posing as results: missing numbers are dashed `TODO ·` chips.

## 1. Before launch (visible placeholders)

| Placeholder id | Where | What to supply |
|---|---|---|
| `proof.clicks` | Home › proof strip (4th item) | Organic clicks gained for client sites, from Search Console |
| `case.client.gsc` | Home › case studies, 3rd result ("Client site") | Anonymized Search Console screenshots, before and after. Then the card can become a real case page |
| `case.ai-seo-automator.status` | AI SEO Automator page › at a glance | Is it live? How many users? |
| `case.ai-seo-automator.pages` | AI SEO Automator page › results | Pages produced |
| `case.ai-seo-automator.time` | AI SEO Automator page › results | Time per page, before and after |
| `case.ai-seo-automator.gsc` | AI SEO Automator page › results | Impressions/clicks growth, anonymized screenshot |
| `case.farazahmad-dev.traffic`, `case.farazahmad-dev.gsc` | farazahmad.dev page | Indexed pages and clicks from Search Console |

All of these live in `src/data/seo/content.ts` and `src/data/seo/cases.ts` as `todo(...)`;
replace each with a plain string once you have the real value.

**Screenshots:** put image files in `src/assets/seo/` and tell me which case they belong to;
I'll add them with `astro:assets`.

**Growth chart with real data (optional):** the signature chart is an illustration of a typical
engagement (shape only, labelled "Illustration · no real data"). To show a real client curve,
set `GROWTH_DATA` in `src/data/seo/growth.ts` to `{ kind: 'real', source, range, clicks, impressions }`
(exported Search Console series). The label, caption and axis peaks switch automatically.

## 2. Please confirm (wording and facts I used)

- **No link building**, said plainly in proof, FAQ, "How I keep it safe" and About (decision).
- **Human edit gate:** the page says the content engine *I build for clients* has a human editor
  and quality checks before publishing. AI SEO Automator itself publishes straight to the site
  (verified fact), and its case page says so; the "lesson" box says client builds add the human
  step. Confirm that is how you work.
- **"How I keep it safe" rules:** staged rollouts via version control with rollback; work inside
  Google Search Essentials and spam policies; Search Console, analytics, code and content stay in
  the client's accounts with revocable access. Remove any you don't do every time.
- **FAQ › CMS/framework:** "Next.js and React apps are home ground". I did not list WordPress,
  Shopify or Webflow by name; add them if you want.
- **FAQ › timing:** "Technical fixes can show in Search Console within weeks… content takes
  months". General guidance, no promise. Edit if you prefer different wording.
- **Job title in JSON-LD:** "Full-Stack Engineer, Technical SEO" (`src/data/seo/profile.ts`).
- **farazahmad.dev facts:** Lighthouse 13.5 SEO 100 on `/`, `/audit`, `/templates`, `/agencies`,
  `/contact`; home page Accessibility / Best Practices / SEO / Agentic browsing 100, Performance
  mobile 93–95, desktop 100, CLS 0 (local production build, 2026-10-02). From decisions.md (seo +
  apps). Ships llms.txt, an ai-catalog, a sitemap, canonical URLs, JSON-LD (decision). The card
  says "Next.js app" (apps decision).
- **Portrait:** `src/assets/seo/faraz.jpg` is a copy of the ai/funnels portrait. Swap it when you
  send the new headshot (decision: "I will supply one").
- **Example content:** the hero "snippet lab" and the OG image use a fictional "Your Store" /
  `yourstore.com` and the query "trail running shoes wide feet", labelled "Example".

## 3. Technical notes

- **Fonts (new):** Schibsted Grotesk (headings, variable) and Instrument Sans (body, variable), both SIL OFL 1.1,
  copied from Fontsource packages; OG fonts `og/SchibstedGrotesk-ExtraBold.woff`, `og/InstrumentSans-Medium.woff`.
  Sources in `src/assets/fonts/README.md`.
- **OG images** `/og/home.png`, `/og/ai-seo-automator.png`, `/og/farazahmad-dev.png` are generated
  at build (`src/lib/seo/og.ts`). Favicon `/icon.svg` and `/apple-touch-icon.png` come from
  `src/lib/seo/brand-mark.ts`.
- **Meta lengths** are asserted at build (title ≤ 60, description ≤ 155, `src/data/seo/seo.ts`).
- **Sitemap** lists `/`, `/work/ai-seo-automator/`, `/work/farazahmad-dev/`.
- **Motion:** Lenis + GSAP load lazily on desktop only (shared `<Motion />`); nothing on this site
  depends on them. The growth chart and the snippet lab are in-place interactives (no pinned scroll),
  with pause/play, and render their finished state without JS or under reduced motion.
- **Placeholder** `src/assets/seo/hero.svg` from the niche template is no longer used; delete it
  whenever you like.

## 4. Launch checklist

1. Section 1 done, section 2 confirmed.
2. `src/niches.ts` → `noindex: false` for `seo`.
3. `npm run check && npm run build`, then mobile Lighthouse on `/` and both case pages.
4. Vercel domain + Spaceship CNAME for `seo` (README › DNS).
5. Submit `https://seo.farazahmad.dev/sitemap.xml` in Search Console.
