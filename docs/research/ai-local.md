# Research: Faraz Ahmad main-site repo (facts only)

Repo read (read-only): `D:\work\indepth\faraz-portfolio\farazahmad`. All `source:` paths are relative to that repo. No `.env` file was opened. Report date: 2026-11-03.

Caveat that applies throughout: the live site reads most content from MongoDB (`lib/content.ts`), with hard-coded fallbacks in the repo. This report only knows the repo fallbacks and docs. The live dashboard may hold different (newer) values, for example email, socials, project years and availability. Treat repo values as "last known in code", not as verified live.

---

## 1. Headshot / photo

### Candidates found (all image files in the repo outside node_modules/.next)

| Path | Size | Pixels | Verdict |
|---|---|---|---|
| `public/portrait.jpg` | 202,399 B | 1122 x 1402 (4:5, 0.80) | REAL photo of Faraz. Chosen. |
| `public/portrait-texture.webp` | 26,748 B | could not be read by System.Drawing | Derived texture for the WebGL hero shader (not viewed; derived from the portrait). Not used. |
| `opengraph-image.png` (repo root) | n/a | 1535 x 802 | Screenshot of the site hero (contains the portrait, small, with UI text). Not suitable. |
| `app/opengraph-image.jpg`, `app/twitter-image.jpg` | 66,880 B each | 1200 x 630 | Social share card. Not suitable. |
| `app/icon.png`, `app/apple-icon.png` | 41,637 / 37,232 B | 192x192 / 180x180 | Favicons made from the portrait. Too small. |
| `public/gallery/*` (brick-wall, ceiling, floor, space-backdrop; jpg+png) | 0.3-3 MB | n/a | Background textures for the 3D gallery, no person. |
| `public/tools/*.jpg` (claude-llms, custom-models, gohighlevel, make, mern, mongodb, n8n, nextjs, python, zapier) | 150-300 KB | n/a | "Toolbox series" tool images, no person. |

No other person photos exist in `docs/`, `app/`, `.memory/` or `.cursor/`.

### Chosen and copied

- **Source:** `public/portrait.jpg`
- **Copied to:** `D:\work\indepth\faraz-portfolio\Niche-Specific-Portfolios\src\assets\ai\faraz.jpg` (byte-identical copy, 202,399 B)
- **Dimensions:** 1122 x 1402 px, aspect ratio 4:5 (0.80, portrait orientation)
- **Why:** It is the only real portrait. Viewed with Read: black-and-white studio shot, subject centred, head and shoulders, face sharp and evenly lit, plain solid black background, not AI-stylised, no heavy crop. The site itself uses it as the About-page image (`app/(site)/about/page.tsx`, with alt text "Faraz Ahmad - black and white studio portrait", rendered grayscale at 1122x1402).
- **Caveats for reuse:** (a) it is monochrome with a very dark background and a dark jacket, so on a light page it needs a dark panel or a rounded frame; (b) the owner's brief calls it "a high-quality B&W portrait ... dark background" (`docs/CONTENT-BRIEF.md` section 5); no colour version exists in the repo; (c) the site's own gallery caption calls it "The face behind the systems - shot for this site's hero" (`lib/content.ts`, FALLBACK_GALLERY).

---

## 2. Tech stack

### Actually used (from `package.json`, name `farazahmad-portfolio`, version 2.0.0)

- **Framework:** Next.js `^16.2.11` (App Router, Turbopack dev), React / React-DOM `^19.2.8`, TypeScript `^5.9.3` (type-check via `@typescript/native-preview` / `tsgo`)
- **CSS:** Tailwind CSS `^4.3.3` with `@tailwindcss/postcss`
- **3D / WebGL:** three `^0.185.0`, @react-three/fiber `^9.6.1`, @react-three/drei `^10.7.7`, @react-three/postprocessing `^3.0.4`
- **Animation / scroll:** gsap `^3.15.0`, @gsap/react `^2.1.2`, lenis `^1.3.25`
- **Database:** MongoDB (`mongodb ^7.5.0`) and Mongoose `^8.16.0`
- **Auth:** better-auth `^1.6.0` (admin only)
- **Validation:** zod `^4.0.0`
- **Rich text editor (admin):** Tiptap `^3.29.0` (starter-kit, link, table, react)
- **Monitoring / analytics:** @sentry/nextjs `^10.69.0`, posthog-js `^1.414.0` (GTM also, configured in admin)
- **UI misc:** sonner `^2.0.7` (toasts)
- **Tests/lint:** node:test, ESLint `^9.30.0`; 257 tests passing as of 2026-10-06 (`STATUS.md`)
- source: `package.json`

### Stack statements in docs

- "Next.js 16.2 (stable, Turbopack, App Router). No cacheComponents/PPR. Caching is unstable_cache + tags, and slug pages are SSG via generateStaticParams." source: `CLAUDE.md`
- Tailwind v4 tokens: `bg-ink`, `text-bone`, `text-bone-dim`, `border-bone-faint` (palette is dark "ink" + off-white "bone"). source: `CLAUDE.md`
- GSAP + ScrollTrigger + SplitText loaded lazily; WebGL canvas mounted lazily on first interaction. source: `CLAUDE.md`
- Leads: contact form, AI Automation Audit and template vault; every lead saved to MongoDB first, then to GoHighLevel via API (Private Integration Token). source: `CLAUDE.md`, `PROGRESS.md`
- AI providers supported in the audit: OpenRouter, Groq, Gemini, Anthropic, OpenAI, Custom, with a fallback chain of up to 3. source: `PROGRESS.md` section 2
- Bot protection: Cloudflare Turnstile; media: ImageKit and Cloudinary; secrets encrypted in Mongo. source: `CLAUDE.md`
- Hosting: Vercel is referenced (custom domain step "add in Vercel -> Domains"). source: `docs/LAUNCH-CHECKLIST.md`. Production domain mentioned: farazahmad.dev. NOT FOUND: any explicit "hosted on Vercel" statement in code.
- Site-wide AI-agent surfaces: `llms.txt`, `/.well-known/ai-catalog.json`, robots.txt with AI crawlers. source: `PROGRESS.md` section 0, `app/llms.txt/route.ts`

### What the owner says he works with (languages, tools, platforms)

- Public line: "Faraz works with n8n, Make, Zapier, GoHighLevel, the MERN stack, Next.js, Python and LLMs (Claude, OpenAI) to automate business operations, build client platforms and ship AI agents." source: `app/llms.txt/route.ts`
- Services rows (fallback): 01 AI Automation "Workflows that run your business without you." tools "GoHighLevel · n8n · Make · Zapier"; 02 Full-Stack Engineering "Custom applications, end to end - built to scale to a thousand users and beyond." tools "MERN"; 03 AI Applications & Custom Models "LLMs integrated where they matter - and when off-the-shelf isn't enough, custom models, trained and deployed." tools "Claude · Custom LLMs · Python". source: `lib/content.ts` (FALLBACK_SERVICES)
- Toolbox panels: GoHighLevel, n8n ("the daily driver"), Zapier, Make, MERN Stack, Claude & LLMs, Custom Models (DeepCAD and Text2CAD), Python. Gallery adds Next.js and MongoDB. source: `lib/content.ts` (FALLBACK_PANELS, FALLBACK_GALLERY)
- Self-description from his own interview: ranked skills = 1 technical expert, 2 MERN + Next.js, 3 AI automation expert; "Claude / LLM tooling - mastered"; "self-described AI application engineer"; Python; "LLMs - worked with many; can deploy custom LLMs"; custom AI model development ("also an AI student"); "SaaS - updated/extended many SaaS applications". source: `docs/CONTENT-BRIEF.md` section 3
- Wider work (his words): "A lot of e-commerce applications - that's where my expertise is"; "Countless automations"; "Many Shopify stores"; "Many GoHighLevel buildouts" including configured AI assistants (voice AI agents, creative assistants). Exact AI tool names were NOT confirmed ("Faraz to TYPE the exact product names... do not publish guessed names"). Retell AI appears by name in his 10 published consulting blog posts (see section 6). source: `docs/CONTENT-BRIEF.md` section 4; `docs/SITE-COPY.md`
- Agency page tooling statement: "GoHighLevel, n8n, Make and Zapier for automation; MongoDB, Express, React and Node for custom apps; and the major LLM APIs for AI features." source: `lib/agency.ts` (AGENCY_DEFAULTS.faq)
- JSON-LD `knowsAbout`: AI Automation, Full-Stack Development, GoHighLevel, n8n, MERN Stack, Custom AI Models. source: `app/(site)/page.tsx`

---

## 3. Bio facts

- **Full name:** Faraz Ahmad. source: `lib/site.ts` (SITE_NAME), `app/(site)/page.tsx`
- **Role/title wording (as on the site):**
  - Hero role line: "Automation Expert · Full-Stack Engineer / Founder, Indepth Solution". source: `components/site/Hero.tsx`
  - Home page title: "Faraz Ahmad - Automation Expert & Full-Stack Engineer". source: `app/(site)/page.tsx`
  - JSON-LD jobTitle: "Automation Expert & Full-Stack Engineer"; worksFor Organization "Indepth Solution". source: `app/(site)/page.tsx`
  - Alternate (copy doc): "AI Application Engineer · Founder, Indepth Solution"; sign-off "Faraz Ahmad - Founder, Indepth Solution". source: `docs/SITE-COPY.md`
  - Freelancer framing: "He is an AI-automation / full-stack / AI-apps freelancer in Lahore." source: `CLAUDE.md`
  - Brief: "Automation expert - this is the lead identity." source: `docs/CONTENT-BRIEF.md` section 1
- **Headline:** "I build systems that work while you sleep." source: `components/site/Hero.tsx`
- **Location:** Lahore, Pakistan (JSON-LD addressLocality "Lahore", addressCountry "PK"). source: `app/(site)/page.tsx`; about page caption "Faraz Ahmad - Lahore, PK" source: `app/(site)/about/page.tsx`; "Based in Lahore. Building for anywhere." source: `app/(site)/about/page.tsx`
- **Time zone:** Asia/Karachi (PKT); footer shows live "Lahore, PK - HH:MM PKT". source: `components/site/LocalTime.tsx`, `docs/CONTENT-BRIEF.md` section 8
- **Experience:** "3+ years of full-stack development" (interview, July 2026). source: `docs/CONTENT-BRIEF.md` section 1. Site shows "03+ Years of full-stack engineering". source: `components/site/StatsStrip.tsx`. Hero sub-line: "Three years of full-stack engineering. Custom apps that scale. AI in everything." source: `components/site/Hero.tsx`. Start year: NOT FOUND (no calendar year given for career start).
- **Career arc (his own story):** FSc pre-medical, did not score enough for medical school, switched to computer science; internship in the earliest semesters converted to a job; three roles at three offices, ending as senior full-stack team lead; a friend introduced GoHighLevel, leading to automation + CRM expertise; AI + automation; founded Indepth Solution. source: `app/(site)/about/page.tsx` (TIMELINE), `docs/CONTENT-BRIEF.md` section 2. He is also described as an AI student ("also an AI student"). source: `docs/CONTENT-BRIEF.md` section 3. Final-year project (FYP) = SolidMake. source: `lib/case-studies.ts`, `docs/CONTENT-BRIEF.md`.
- **Company:** Founder of Indepth Solution ("a ground where young talent delivers in-depth work"). Founding year: NOT FOUND (`docs/SITE-COPY.md` marks "[year - confirm]" and lists it under "Facts needed before publish"). Brief also says he is "also working with Cup Up Marketing". source: `docs/CONTENT-BRIEF.md` section 1. Indepth Solution URL, team size, headcount, client list: NOT FOUND.
- **Public contact details:**
  - Email: `faraz@cupupmarketing.com` (fallback in code; the live value comes from the admin Settings document and could differ). source: `lib/content.ts` (FALLBACK_SETTINGS), `app/(admin)/admin/(panel)/settings/page.tsx`
  - Booking: "Book a 20-minute call" (GoHighLevel calendar iframe, shown only if configured). source: `app/(site)/contact/page.tsx`
  - Phone / WhatsApp: NOT FOUND.
  - Contact form on `/contact`; lead pipeline goes to GoHighLevel. source: `CLAUDE.md`
- **Social / profile links:**
  - GitHub: `https://github.com/FarazAhmad-117` (the only social in code). source: `lib/content.ts`. `CLAUDE.md` also states "FarazAhmad-117 is the sole author".
  - LinkedIn: NOT FOUND as a URL (only a launch-checklist reminder "add LinkedIn/X if you have them"; `docs/LAUNCH-CHECKLIST.md`). X/Twitter: NOT FOUND.
  - Upwork / Fiverr: NOT FOUND (Upwork only appears as a distribution channel for the `/audit` link: "Put the /audit link in LinkedIn, Upwork and outreach messages", `STATUS.md`). No job success score, rating, earnings or hours anywhere: NOT FOUND.
- **Availability statements:** Badge "Available for new projects" (or "Currently at capacity", or "Available from <month>"); now-line fallback "Currently building - Portfolio v2". source: `lib/content.ts`. The 2026 hero screenshot shows "Available for new projects" and "Currently building - Yard Terminal" (the live Settings value at screenshot time). source: `opengraph-image.png`
- **Live domain:** farazahmad.dev (per task brief; in repo only referenced as an example/URL in `docs/plans/2026-10-01-lead-pipeline.md` and `docs/LAUNCH-CHECKLIST.md`). `SITE_URL` is read from env `NEXT_PUBLIC_SITE_URL`. source: `lib/site.ts`

---

## 4. Projects / case studies

General notes: four flagship case studies, in order Yard Terminal, SolidMake, AI SEO Automator, Lead Drift. Site rule: "No invented metrics - results stay qualitative until Faraz supplies real numbers." (`lib/case-studies.ts` header) and "Honest copy. Never invent client names, results, numbers or guarantees." (`CLAUDE.md` hard rule 5). Case-study text lives in `lib/case-studies.ts` (curated fallbacks) and is overridden by dashboard-authored bodies in MongoDB when present. No project has a public URL, screenshot, user count or status number anywhere in the repo: all NOT FOUND unless stated.

### Yard Terminal (crown jewel)
- **What:** multi-marketplace commerce dashboard. One-liner: "List once. Sell everywhere." source: `lib/content.ts`
- **Does:** one dashboard synced with eBay, Shopify, Amazon, Google (Marketplace / Shopping) and Facebook Marketplace; create a listing once, publish anywhere; when it sells in one place it disappears from all. source: `lib/case-studies.ts`, `docs/CONTENT-BRIEF.md`
- **AI layer:** AI-written listings; AI dynamic pricing "keeps every product at the best price in the market"; AI reports on what sells and in which market. source: `lib/case-studies.ts`
- **For:** multi-marketplace sellers ("drown in tabs"). source: `lib/case-studies.ts`
- **Role tag:** "Design · Engineering · AI". Tags: AI, Commerce. Year shown: 2025 (code fallback only). source: `lib/content.ts`. Note `docs/SITE-COPY.md` lists year as unconfirmed "[year]".
- **Origin:** "Originally built as software for a client, then Faraz created Yard Terminal on the same concept." Naming rule: never mention the earlier client name "AES"; say Yard Terminal. source: `docs/CONTENT-BRIEF.md` section 4. (Do not reuse the old name.)
- **Status:** "Currently building - Yard Terminal" appears as the now-line in the site screenshot (source: `opengraph-image.png`), so it is in active development as of that screenshot (date not recorded; file is the pre-2026-10-01 original per `STATUS.md`). Live/users: NOT FOUND ("Need: current status - live? users?").
- **Stack:** MongoDB is named as Yard Terminal's data layer ("the data layer of Yard Terminal, Lead Drift and this dashboard"). source: `lib/content.ts` (gallery caption). The related blog post "Shopify and eBay Inventory Sync Without Overselling: Build a Source-of-Truth Ledger" is on the same theme (source: `public/automation-consulting-blogs/10-shopify-ebay-inventory-sync-no-overselling.md`). Full stack: NOT FOUND beyond MERN.

### SolidMake
- **What:** text-to-CAD system. One-liner: "Describe the part. Get the STEP file." source: `lib/content.ts`
- **Does:** natural-language description to production-ready STEP file for cutting, bending, welding; "not a GPT wrapper". Built on DeepCAD and Text2CAD, with prompt normalization and pre-designed training; process flow optimized. source: `lib/case-studies.ts`, `docs/CONTENT-BRIEF.md`
- **For:** mechanical engineers (instead of modelling in SolidWorks/AutoCAD). source: `docs/CONTENT-BRIEF.md`
- **Role tag:** "AI Research · Engineering". Tags: Custom AI, CAD. Year: 2025 (code fallback). It is his final-year project ("My final-year project, and the deepest technical build in this portfolio"). source: `lib/case-studies.ts`
- **Stack:** DeepCAD, Text2CAD, Python ("where the model work happens - training pipelines, data prep"). source: `lib/content.ts`
- **Status / grade / demo / URL / benchmark numbers:** NOT FOUND (`docs/SITE-COPY.md`: "[FYP outcome/grade/demo - confirm]").

### AI SEO Automator
- **What:** self-serve platform that automates SEO with AI. One-liner: "SEO that runs itself." source: `lib/content.ts`
- **Does:** bring-your-own AI API key; deep scraping and site audits; competitor discovery, research, backlinks, alerts when competitors publish; keyword research; AI content generated and published straight to the site; live site health score. source: `lib/case-studies.ts`, `docs/CONTENT-BRIEF.md`
- **For:** site owners who want SEO on autopilot (self-serve sign-up). 
- **Role tag:** "Product · Engineering · AI". Tags: Automation, AI. Year: 2024 (code fallback). source: `lib/content.ts`
- **Stack:** NOT FOUND. Keyword data source uncertain: "Ahrefs API + SEMrush API? - confirm exact integrations" (unconfirmed). source: `docs/CONTENT-BRIEF.md`
- **Status / users / URL:** NOT FOUND ("Need: status - live? users?").

### Lead Drift
- **What:** all-in-one lead-to-conversion system built for his own company (Indepth Solution). One-liner: "The growth engine I built for my own company." source: `lib/content.ts`
- **Does:** browser extension scrapes leads from Google Maps, Yellow Pages, eBay and Apollo; automated outreach workflows and email sequences nurture them; converts to closed work. source: `lib/case-studies.ts`
- **For:** internal use at Indepth Solution (dogfooding: "I automate businesses for a living - starting with mine").
- **Role tag:** "Founder build - Indepth Solution". Tags: Automation, Outreach. Year: 2024 (code fallback). source: `lib/content.ts`
- **Status:** the case-study copy says "Lead Drift is Indepth Solution's own growth engine, running in production." source: `lib/case-studies.ts`. (The brief still lists status/results as "Need: status, results - e.g., leads generated, clients won": no numbers.) Stack: MongoDB named; otherwise NOT FOUND.

### Indepth Solution
- Described as the company he founded so "young talent" can "deliver solutions that are in-depth - the name is literal"; "I had the experience; they had the time and the skill." source: `docs/CONTENT-BRIEF.md`, `app/(site)/about/page.tsx`
- Founding year, team size, services page, website, clients: NOT FOUND.

### Wider work (breadth, no numbers)
"Beyond the case studies: e-commerce applications, Shopify stores, countless automations, and GoHighLevel buildouts with AI and voice agents." source: `docs/SITE-COPY.md`. No client names, counts or results: NOT FOUND.

### Other site features he built (usable as product proof)
- AI Automation Audit (`/audit`): 7-question quiz, about 60 seconds, deterministic scoring with an 18-pattern library, private report. Off by default until enabled in admin. source: `PROGRESS.md` section 2, `STATUS.md`
- Template vault (`/templates`): free n8n/Make/Zapier/GoHighLevel templates, email-gated; empty until real templates are added. source: `STATUS.md`
- `/agencies` white-label page ("You sell it. I build it.", NDA-friendly). source: `lib/agency.ts`
- Admin CMS "Backstage", lead pipeline (GoHighLevel contact upsert, tags, opportunity, booking). source: `CLAUDE.md`, `PROGRESS.md`

### Testimonials / proof
- Testimonials, client logos, results quotes: NOT FOUND. `PLAN.md` item 7 "Proof upgrade (results and testimonials)" is "blocked on real numbers and quotes from Faraz". The `Testimonial` model does not exist yet.

---

## 5. Real measured numbers

| Number | Context | Date | source |
|---|---|---|---|
| Lighthouse 13.5: Accessibility 100, Best Practices 100, SEO 100, Agentic browsing 100 on `/`, `/audit`, `/templates`, template page, `/agencies`, `/contact` | local production build | measured 2026-10-02 | `STATUS.md` |
| Performance: `/` mobile 93-95, desktop 100; `/audit` mobile 94-95, desktop 100; `/templates` and template page mobile 96, desktop 100; `/agencies` mobile 96, desktop 100; `/contact` mobile 93-96, desktop 100 | same | 2026-10-02 | `STATUS.md` |
| CLS 0 everywhere; mobile Performance varies about +/-2 between runs (CPU noise on that machine) | same | 2026-10-02 | `STATUS.md` |
| Before/after of the performance/SEO overhaul: Lighthouse 40 mobile / 57 desktop before; now 100 on the four score categories, Performance about 95 mobile and 99-100 desktop | the overhaul | 2026-10-01 | `PROGRESS.md` section 0 |
| 257 passing tests, typecheck and lint clean | `npm test` | as of 2026-10-06 | `STATUS.md` |
| Site stats strip: "03+" years of full-stack engineering; "04" flagship products shipped; infinity symbol "Automations running unattended" (a decorative stat, not a measurement) | on-site claim | undated (brief July 2026) | `components/site/StatsStrip.tsx` |
| Stated capacity claim: "Custom apps that scale to a thousand users" | his own value-prop wording, not measured | July 2026 interview | `docs/CONTENT-BRIEF.md`, `docs/SITE-COPY.md` |

No client results, revenue, leads generated, hours saved, user counts, or project performance metrics exist anywhere in the repo: NOT FOUND. The audit tool's hours/cost ranges are labelled estimates (conservative, capped), not measurements (`CLAUDE.md` rule 5, `lib/audit/library.ts`).

Repo history facts (only if useful): first commit 2024-06-28, latest local commit seen 2026-11-02 ("feat(leads): cross-origin contact endpoint for the niche sites"). source: `git log` in the repo.

---

## 6. Copy / voice samples

Voice summary: dark, precise, cinematic; calm, assured, few words; first person; no hype; honest about estimates. source: `docs/SITE-COPY.md` ("Tone"), `docs/CONTENT-BRIEF.md` section 8.

- Headline: "I build systems that work while you sleep." (source: `components/site/Hero.tsx`)
- Sub-line: "Three years of full-stack engineering. Custom apps that scale. AI in everything. - Lahore, PK" (source: `components/site/Hero.tsx`)
- Manifesto: "Most businesses run on people doing robot work. I build the robots - workflows, apps and AI that take the boring parts away - so the humans can do the human work." (source: `components/site/Manifesto.tsx`)
- About hook: "I was supposed to become a doctor. I didn't score enough for medical school - and it was the best thing that ever happened to me. Today I run Indepth Solution, teaching software to do the work." (source: `components/site/AboutTeaser.tsx`)
- About paragraph: "Then a friend showed me GoHighLevel, and I discovered the thing I'd been circling my whole career: automation. Connecting platforms. Removing the human from the loop where the human adds no value." (source: `app/(site)/about/page.tsx`)
- About title: "The doctor that never was." and "From memorizing bodies to building brains." (source: `app/(site)/about/page.tsx`, `components/site/AboutTeaser.tsx`)
- Closing line: "Let's build something that runs itself." (source: `components/site/Footer.tsx`)
- Agency voice: "You sell it. I build it." / "I'm Faraz Ahmad. I build AI automations, full-stack web apps and LLM integrations, and agencies bring me in to deliver that work under their own brand." (source: `lib/agency.ts`)
- Project one-liners: "List once. Sell everywhere." / "Describe the part. Get the STEP file." / "SEO that runs itself." / "The growth engine I built for my own company." (source: `lib/content.ts`)
- Services descriptions: "Workflows that run your business without you." / "Custom applications, end to end - built to scale to a thousand users and beyond." (source: `lib/content.ts`)
- Toolbox voice: "The daily driver. Every platform speaks to every other platform - unattended, observable, self-healing." (n8n) (source: `lib/content.ts`)
- 404 copy: "This page doesn't exist. Everything else I build, works." (source: `docs/SITE-COPY.md`)
- Blog (10 consulting posts in `public/automation-consulting-blogs/`, titles show his niche: HighLevel V1 to V2 API migration, n8n 3.0 production migration, Retell AI deprecations, Zapier Agents to AI by Zapier, Shopify expiring offline tokens, Retell + GoHighLevel production integration, scaling n8n queue mode, HighLevel SaaS V1 vs V2 architecture, durable webhook inbox for Zapier/Make, Shopify and eBay inventory sync without overselling). Whether these are published live: NOT FOUND (they are seed/import files; only "How I built this site (so far)", dated 2026-07-26, 6 min read, is the code fallback post, source: `lib/content.ts`).
- Note: copy uses a spaced em dash in many places; the owner's own docs keep it, so reproducing is faithful, but the new niche sites may prefer commas.

---

## Most useful facts (10-line summary)

1. Real portrait exists: `public/portrait.jpg`, 1122x1402 (4:5), B&W studio shot on solid black; copied to `Niche-Specific-Portfolios/src/assets/ai/faraz.jpg`. No colour version.
2. Name Faraz Ahmad; title "Automation Expert · Full-Stack Engineer · Founder, Indepth Solution"; Lahore, Pakistan; Asia/Karachi (PKT).
3. Experience claim: "3+ years of full-stack engineering" (July 2026 brief); no start year and no Indepth Solution founding year in the repo.
4. Stack of the main site: Next.js 16 + React 19 + Tailwind 4 + MongoDB/Mongoose + Better Auth + GSAP/Lenis + three.js/R3F + Sentry/PostHog; leads go to GoHighLevel via API.
5. He works with: n8n (daily driver), Make, Zapier, GoHighLevel, MERN, Next.js, Python, Claude/OpenAI LLMs, custom models (DeepCAD, Text2CAD); also Retell AI voice agents (appears in his blog titles).
6. Four flagship projects: Yard Terminal (multi-marketplace commerce + AI pricing/listings/reports), SolidMake (text-to-CAD FYP, STEP export), AI SEO Automator (BYO-key SEO automation), Lead Drift (lead scraping extension + outreach, internal, "running in production").
7. Only measured numbers: Lighthouse 13.5 on 2026-10-02 (100 on A11y/BP/SEO/Agentic; Perf mobile 93-96, desktop 100; CLS 0), and 40/57 to about 95/100 overhaul on 2026-10-01; 257 tests on 2026-10-06.
8. Public contact: email `faraz@cupupmarketing.com` (code fallback; confirm live), GitHub `github.com/FarazAhmad-117`, "Book a 20-minute call"; availability "Available for new projects".
9. Honesty rule from owner: never invent clients, results or numbers; there are no testimonials, user counts, revenue, or Upwork/LinkedIn data in the repo.
10. Voice: calm, first-person, few words, "I build systems that work while you sleep"; manifesto line "I build the robots ... so the humans can do the human work."

## Gaps (NOT FOUND, need the owner)

- LinkedIn / Upwork / X URLs and any Upwork job-success score or rating.
- Project status (live? users? URLs?), real results, and confirmed years for all four projects (code-fallback years 2024/2025 are not confirmed in `docs/SITE-COPY.md`).
- Indepth Solution founding year, URL and team size; Faraz's career start year; phone/WhatsApp; confirmed live email; testimonials.
