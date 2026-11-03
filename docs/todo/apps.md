# apps niche: what the owner must supply or confirm before launch

Site: `apps.farazahmad.dev` (dev: `/apps/`). `noindex` is still ON in `src/niches.ts`.
Every item below is visible on the site as a dashed `TODO ·` chip, or is a wording/assumption
that should be confirmed. Nothing here is printed in meta, OG images or JSON-LD.

## TODO chips on the site

### SolidMake (home card + `/work/solidmake/`)
- [ ] Time to model a part, before → after (card chip + result row)
- [ ] Accuracy / number of models generated (card chip + result row)
- [ ] Start date of the project (timeline)
- [ ] Year: code fallback says 2025, unconfirmed (timeline)
- [ ] Front end and hosting stack (only Python, DeepCAD, Text2CAD are verified)

### Yard Terminal (home card + `/work/yard-terminal/`)
- [ ] Yards using it (card chip)
- [ ] Listings synced (card chip)
- [ ] Yards, listings synced, measured sale-to-delist time (result row, "after the founding beta")
- [ ] Start date (timeline: "first built as software for a client, then rebuilt as Yard Terminal")
- [ ] Product app stack (not public). Shown: MongoDB (named on farazahmad.dev as YT's data layer)
      and "Next.js on Vercel" for the public website only (from its response headers). Confirm both.

### Supporting cards (home)
- [ ] AI SEO Automator: one key metric
- [ ] Lead Drift: one key metric (not cleared for publication yet)

### farazahmad.dev
- No chips. Uses only the decided Lighthouse figures (13.5, local production build, 2 Oct 2026),
  257 passing tests (6 Oct 2026, from STATUS.md, NOT the brief's unverified "261"), and repo dates
  (first commit 28 Jun 2024, overhaul 1 Oct 2026, cross-origin endpoint 2 Nov 2026).
- [ ] Optional: the before/after of the 1 Oct overhaul (research says "Lighthouse 40 mobile / 57
      desktop before"; the category is ambiguous, so it is not shown). Confirm to add it.

## Wording and assumptions to confirm

- [ ] **Product sprint "one to two weeks"** comes from the brief's offer ladder; confirm the duration.
- [ ] **"Build in 2-week cycles"**, "weekly demo", "staging link", "CI on every push", "tests",
      "repo in your GitHub org from day one", "accounts in your name": these are process promises
      from the brief (§4 items 7–8). Confirm you commit to all of them on every build.
- [ ] **Retainer** "an agreed number of days each month": no number given (brief said X days/month).
- [ ] **"Senior"**: the hero lede says "I'm a senior full-stack engineer", About and the proof strip
      say "including as a senior full-stack team lead", and the retainer says "a senior engineer".
      Meta and JSON-LD say only "full-stack engineer" until you confirm "senior".
- [ ] **Career wording**: "three roles in three offices, including as a senior full-stack team lead"
      (research §3). The earlier "…before founding Indepth Solution" was dropped: yardterminal.com's
      JSON-LD says Indepth Solution has operated since 2019, which conflicts with that order.
- [ ] **"3+ years of full-stack engineering"** (July 2026 brief) in the proof strip and About, also
      against Indepth "since 2019". Confirm the number. No start year is shown.
- [ ] **Solo vs team**: indepthsolution.com/team lists four people. The copy now says: Compare
      "Who writes the code: Me, with my team at Indepth Solution"; About "you work with me directly,
      from the scoping call to the code in your repo"; "products … I built or led" (Yard Terminal "from
      Indepth Solution, the company I founded"). Confirm who actually writes client code, and adjust.
- [ ] **Typography differs from the brief**: the brief asks for Satoshi (display/body) + IBM Plex
      Mono. Satoshi is already used by the funnels niche, so apps uses **Mona Sans** (display, with its
      width axis) + **IBM Plex Sans** (body) + **IBM Plex Mono** (annotations). Confirm.
- [ ] **Stack marks** in the proof strip: Next.js, React, TypeScript, Node.js, Python, MongoDB,
      Vercel. The brief also lists Postgres and AWS; they are NOT shown because nothing verifies
      them. Add them if you use them.
- [ ] **FAQ "What stack do you use"** names Next.js/React, Node.js or Python, MongoDB, TypeScript,
      Vercel. Confirm.
- [ ] **Comparison table** (me vs agency vs low-cost freelancer vs hiring) is qualitative and
      labelled "typical, not universal". Confirm you are happy with the framing.
- [ ] **About**: "The products on this page are the ones I built and run" covers Yard Terminal
      (founder), SolidMake (final-year project) and farazahmad.dev. Confirm.
- [ ] **Headshot**: reused `src/assets/funnels/faraz.jpg` (the repo's B&W studio portrait) as
      `src/assets/apps/faraz.jpg`. Decisions say you will supply one; swap the file if so.
- [ ] **Yard Terminal screenshot** on its case page is the public site's home page
      (`src/assets/apps/yard-terminal-site.png`, copied from the ai niche). Its parts, prices and
      "6 live" counts are the site's demo values; the caption says so. A product screenshot would be better.

## Design pass (Nov 2026): what changed, to confirm
- [ ] **Dark theme is graphite, not navy.** Page `#0e0f11`, surfaces `#15171a` / `#1b1d21`, neutral hairlines;
      ink blue (`#7f9cff`, text `#9db3ff`) is only the accent. The dark "print" sections (case studies, spec
      terminal, architecture, contact card) are graphite film `#15171b` in both themes. Light theme unchanged.
- [ ] **Home case cards are compact drawing sheets** showing **2 of the 3 facts** per case. The third
      (SolidMake "Model work in Python…", Yard Terminal "No auto-publish…", farazahmad.dev "Every lead saved to
      MongoDB first…") is not on the card; the same point is covered in each case page's "What I built" list.
      Confirm which two you want on the card.
- [ ] **Card thumbnails** are each case's own (simplified) architecture diagram reduced to line work; the
      dimension line counts its stages. No new claims.
- [ ] **New brand mark**: an "F" cut from drafting strokes with a crop-mark corner (nav, favicon, apple-touch-icon,
      OG images). The nav no longer says "App development" next to the name.
- [ ] **Hero fills the first screen** on desktop (landscape, ≥1024px); the headline scales down on short screens.

## Labelled examples (not claims; listed for completeness)

- Hero drawing: an "Example app" orders dashboard with example customer names (Juniper,
  Tidewell, Larkspur, Ashgrove; "Northwind" was dropped because indepthsolution.com uses it as an
  unverified client name) and example counts (24 / 118 / 3). Title block says "Example app";
  the notes say "Example project and data".
- Spec → shipped player: "Example · clinic booking app" ("Riverside Physio", slots, tables, an
  example architecture, a deploy log ending at `bookings.example.com`). The section note says
  "Example project, screens and data".
- Architecture diagrams on case pages are simplified and captioned with their source
  ("drawn from the repo descriptions" / "drawn from yardterminal.com's product and security pages").

- Yard Terminal diagram: approval publishes to eBay Motors and Shopify; the counter POS has no publish edge,
  only a dashed "ends listings" line to the channels (a counter sale ends the online listings), matching
  yardterminal.com's /product and /limits.
- farazahmad.dev diagram: a dashed line from the Next.js app to Sentry · PostHog (errors and analytics), from the repo.

## Not fixable inside the apps folders
- [ ] `og:type` is hard-coded to `website` in the shared `src/components/shared/SEO.astro`; case
      pages should be `article`. Needs an `ogType` prop on the shared component (outside this niche).

## Before going live
- [ ] Clear every chip above (or accept it as visible), then set `noindex: false` for `apps` in `src/niches.ts`.
- [ ] DNS: CNAME `apps` → the Vercel target (README › DNS and domain).

Leadrift screenshot added: small thumbnail on the Lead Drift (Detail B) card, desktop only, no case page here; confirm the job posts shown are fine to publish.
