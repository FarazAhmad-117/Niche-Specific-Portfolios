# funnels.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch (`src/niches.ts`). Everything on the page is either
a verified fact (decisions.md, your repo via `docs/research/ai-local.md`) or clearly labelled as
an example / estimate. There are **no illustrative numbers** posing as results.

## 1. Before launch

- **Lead Drift numbers.** Decisions say "not yet; operational facts only", so the case shows a
  dashed chip: *Reply and meeting numbers: published once cleared*. When you clear them, add a
  results row in `src/data/funnels/content.ts` (`CASES[0]`) and delete `pending`.
- **Leak calculator assumptions** (`src/data/funnels/leak.ts`). The reply-speed multipliers
  (1 / 0.8 / 0.6 / 0.4 / 0.25), follow-up multipliers (0.5 / 0.7 / 0.9 / 1) and the default 8%
  booking rate are my working assumptions, **not research figures**. The page says so and shows
  them all. Replace them with numbers from your own CRM if you have them, or keep them.
- **Example lead "Sam" and business "Alex at Northwind"** in the hero, the signature section and
  the OG image are fictional and labelled as examples. The message copy is mine; say if you want
  different wording.

## 2. Please confirm (facts I used)

- **Tools:** GoHighLevel, n8n, Make, Zapier only (decision). The FAQ says other CRMs (HubSpot,
  ActiveCampaign, Klaviyo) are connected *through those tools or an API*, checked on the call.
- **Copy:** "I build the system; you supply the words. I don't write sales copy" (decision:
  build only).
- **Lead pipeline facts:** MongoDB first, then GoHighLevel via API; upsert by email; tags incl.
  `niche:<slug>`; a note; an open opportunity; retry from admin; ft_* fields mapped to GHL custom
  fields. From your GHL and funnels decisions. The example record uses the real field names the
  shared form sends (`ft_landing`, `ft_referrer`, `ft_utm_*`).
- **Every-build list:** SPF/DKIM/DMARC, one-click unsubscribe, STOP for SMS, stop-on-reply,
  quiet hours, attribution, reporting, documentation. Remove any you don't do on every build.
- **About:** "I came to automation through GoHighLevel" paraphrases your own about page
  (`docs/research/ai-local.md`, about-page quote).
- **Scope promise:** "Scope is agreed before any work starts" (Services) and "agreed in writing
  before work starts" (FAQ, cost) are not in the funnels decisions. Confirm or soften.
- **Care plan:** I removed "Cancel any time" (it came from the ai brief, not your funnels
  decisions). Add it back if it's true here too.
- **Case pages** are this site's own: `/work/lead-drift/`, `/work/lead-pipeline/`,
  `/work/ai-seo-automator/` (`src/data/funnels/cases.ts`). Lead Drift and AI SEO Automator also
  link out to their engineering write-ups on `ai.farazahmad.dev`. Read each page once: the
  pipeline's "problem" paragraph is my framing of why first-touch capture matters.
- **Every-build list** is six items now: "Quiet hours" merged into "Consent and quiet hours".

## 3. Technical notes

- **Fonts (new):** Cabinet Grotesk 800 and Satoshi (variable) from Fontshare, ITF Free Font
  License, same as Clash Display. Sources in `src/assets/fonts/README.md`.
- **Portrait:** `src/assets/funnels/faraz.jpg` (a copy of the ai niche's portrait).
- **Placeholder** `src/assets/funnels/hero.svg` from the niche template is no longer used; delete it
  whenever you like.
- **OG image** `/og/home.png` is generated at build (`src/lib/funnels/og.ts`). Favicon
  `/icon.svg` and `/apple-touch-icon.png` come from `src/lib/funnels/brand-mark.ts`.
- **Motion:** Lenis + GSAP load lazily on desktop only (shared `<Motion />`). The signature
  section is an in-place player (autoplay when visible, pause/play, prev/next, click a step);
  it never autoplays under reduced motion, and without JS every step is shown.
- **Page transitions:** cross-document View Transitions (Chrome/Edge 126+, Safari 18.2+). The
  case card morphs into the case page hero; other browsers navigate normally.

## 4. Launch checklist

1. Section 1 done, section 2 confirmed.
2. `src/niches.ts` → `noindex: false` for `funnels`.
3. `npm run check && npm run build`, then mobile Lighthouse on `/`.
4. Vercel domain + Spaceship CNAME for `funnels` (README › DNS).
5. Submit `https://funnels.farazahmad.dev/sitemap.xml` in Search Console.

Leadrift screenshot added: Lead Drift case page, a chat-bubble figure straight under the hero; confirm the job posts shown are fine to publish.
