# ghl.farazahmad.dev: what needs your input

The site stays `noindex` until you say launch (`src/niches.ts`). Everything on the page is either
a verified fact (decisions.md, your repo via `docs/research/ai-local.md`) or clearly labelled as
an example. There are **no numbers posing as results** anywhere: not on the page, not in the OG
images, not in the JSON-LD.

## 1. Before launch (visible TODO chips on the page)

- **Lead-delivery numbers from farazahmad.dev** (decision: open). Shown as a dashed chip in the
  proof strip and on the pipeline case (card and page):
  *TODO · Leads delivered and send success rate from farazahmad.dev*. When you have them, add
  them to `PROOF` in `src/data/ghl/content.ts` and to the case in `src/data/ghl/cases.ts`, then
  delete `PROOF_TODO` and the case's `pending`.
- **A real GHL client story with screenshots** (decision: open). The third case slot on the home
  page is a dashed, empty placeholder: *TODO · Client GHL story and anonymized screenshots*.
  The example teardown page also carries *TODO · Replace with a real anonymized client teardown
  and screenshots*. When one is cleared, add it as a case in `src/data/ghl/cases.ts` (it gets a
  `/work/<slug>/` page, OG image and sitemap entry automatically) and add its slug to the
  view-transition lists in `src/styles/ghl/base.css`.
- **Headshot** (global decision: you'll supply one). About uses `src/assets/ghl/faraz.jpg`, a
  copy of the portrait the other niches use. Replace the file to update it.

## 2. Examples on the page (labelled; confirm you're happy with them)

- **"Sam Rivera · sam@northwind.example"** in the hero rack and on the pipeline case page is a
  made-up contact, labelled "example contact". The pipeline *steps* are real.
- **"Northwind Dental"**, the sub-account in the Switchboard and the example teardown, is
  fictional, labelled "illustrative" and "Illustrative account, not a client's". Its workflow
  names and the three faults (fires twice, never fires, alert to an ex-staff inbox) are my
  framing of common GHL problems from the brief, not a real audit.
- **The Problem section's workflow list** ("New Lead (copy)", "TEST - do not use", …) is labelled
  "Example account" and "Illustrative".

## 3. Please confirm (facts and promises I used)

- **Pipeline facts** are exactly your decision text: MongoDB first, then the GoHighLevel API;
  contact upsert by email; tags including `niche:<slug>`; a note; an open opportunity; failed
  sends retried from admin. "Authenticated with a Private Integration Token" comes from
  `docs/research/ai-local.md`. The copy also says the form on this site goes through it and
  arrives tagged `niche:ghl` (the shared form posts `niche=ghl` to farazahmad.dev). Confirm the
  backend tags niche-site leads that way.
- **The pipeline case's "problem" paragraph** ("a lead should never depend on one fragile hop")
  is my framing of why you built it. Rewrite if your reason was different.
- **Every-build list:** naming conventions, documentation, test contacts, error notifications,
  deliverability check (SPF/DKIM/DMARC + A2P 10DLC status), handover video. From the brief.
  Remove any you don't do on every build, especially the **handover video**.
- **White-label** (FAQ): "I work in your agency account … we agree whether I'm introduced to your
  client or stay behind your team." Decisions say you serve agencies; white-label itself isn't
  decided. Confirm or soften.
- **A2P 10DLC** (FAQ): "I can help prepare a registration; approval is up to the carriers."
- **Care plan:** "Monitoring, fixes and small changes every month, on accounts I built or
  audited." The "built or audited" limit is mine.
- **Custom integration** says "Quoted after scoping" (from the brief) instead of "Scoped on a
  call". Both mean no price; say if you want them identical.
- **Comparison table** (you vs a typical GHL VA vs a typical agency) is a generalisation, and the
  page says so. Check you're comfortable with "Rarely" (VAs and custom code) and "Often the
  agency's" (logins).
- **About:** "A friend showed me GoHighLevel…" paraphrases your about page
  (`docs/research/ai-local.md`). The "Works with" tapes (GoHighLevel API, webhooks, n8n, Make,
  Zapier, Node.js, Python, MongoDB) come from your stack decision and research.
- **"Live on every form"** (status chip on the pipeline case) and **"My own sites don't use a
  GoHighLevel form"** (case text): both follow from the decision, but are my wording. Confirm.
- **Not used on purpose:** indepthsolution.com lists "GHL Certified". Decisions don't mention it,
  so the site makes no credential claim. Tell me if it's real and you want it shown.

## 4. Technical notes

- **Fonts (new pair):** Saira, cut to its Expanded width (display), and Red Hat Text (body), both
  SIL OFL. Neither is used by another niche. I first picked Archivo + IBM Plex Sans, then found
  the parallel `cloud` and `apps` builds use those, so I switched. Sources and instancing in
  `src/assets/fonts/README.md`. JetBrains Mono (shared) for labels, Clash Display for the
  footer signature.
- **Accent:** deep teal `#0b6e68` (light) / `#2cc9b5` (dark), per decisions (overrides the
  brief's cobalt). Amber is used only for faults. All text pairs pass WCAG AA in both themes;
  fault cables and outlines use a darker amber in light theme (`--fault-line`, 4.5:1). The
  decorative LEDs and the dimmed (not-in-focus) parts of the Switchboard diagram are
  intentionally below that; the diagram is `aria-hidden` and fully described in text.
- **Hero animation** loops while on screen, with a pause button in the rack (pausing shows the
  finished state). It never plays under reduced motion.
- **`og:site_name`** is "Faraz Ahmad · GoHighLevel" (the ghl `name` in `src/niches.ts`, which the
  shared `SEO.astro` uses), so link previews don't read like GoHighLevel's own site.
- **Call length:** "Free 30-minute call" confirmed (matches the Calendly `/30min` link).
- **Signature section:** the Switchboard is a mock workflow builder (workflow list, a vertical
  flow of action cards with an If/Else branch, an execution log), in this site's colours, with
  no GoHighLevel logo or screenshot, and labelled "illustrative mock, not a GoHighLevel
  screenshot". It is an in-place player: autoplay once a third of it is on screen, pause/play,
  prev/next, click a step or a list row, a Before/After switch, and story-segment progress whose
  `animationend` advances it. It never autoplays under reduced motion; without JS it shows the
  clean, tested flow and every step as a list. Content lives in `src/data/ghl/switchboard.ts`.
  Check the action names (Create / Update Opportunity, Internal Notification, If / Else, Contact
  Tag, Call Status) read right to you.
- **Page transitions:** cross-document View Transitions (Chrome/Edge 126+, Safari 18.2+). The
  case card's box morphs into the case hero; the page wipes in from the right, and from the left
  going back. Tested on a production build with `pageswap`/`pagereveal` logging.
- **OG images** `/og/home.png`, `/og/lead-pipeline.png`, `/og/account-teardown.png` are generated
  at build (`src/lib/ghl/og.ts`). Favicon `/icon.svg` and `/apple-touch-icon.png` come from
  `src/lib/ghl/brand-mark.ts` (two jacks and one teal cable).
- **Removed:** the niche template's placeholder `src/assets/ghl/hero.svg` (unused).

## 5. Launch checklist

1. Section 1 done, sections 2–3 confirmed.
2. `src/niches.ts` → `noindex: false` for `ghl`.
3. `npm run check && npm run build`, then mobile Lighthouse on `/`.
4. Vercel domain + Spaceship CNAME for `ghl` (README › DNS).
5. Submit `https://ghl.farazahmad.dev/sitemap.xml` in Search Console.
