# Prefill report

Prefilled from the existing farazahmad.dev project (`D:\work\indepth\faraz-portfolio\farazahmad`, read-only) on 2026-11-02. Written only through `PUT /__decisions/api/state`. Nothing was decided before this run, so no existing answer was touched.

**Result: 60 filled, 100 open** (160 questions). `priority`, `first` and `pace` were skipped by rule.

Evidence paths below are relative to the farazahmad project. Tier: T1 = explicit value in code or content; T2 = implied by working code or published copy. Class: A = factual claim, B = preference.

## 1. Filled

### global

| Key | Value | Evidence | Tier | Class |
|---|---|---|---|---|
| `global/booking-tool` | GoHighLevel calendar | `lib/booking.ts:13-33`; `lib/ghl/core.ts:116-123,541-547` (booking URL is derived from the selected GHL calendar); `PLAN.md:22`; `docs/GHL-LEAD-SETUP.md:47-48,88-92` | T1 | A |
| `global/email` | `faraz@cupupmarketing.com` | `lib/content.ts:104` (`FALLBACK_SETTINGS.email`); `app/(admin)/admin/(panel)/settings/page.tsx:156`; shown by `components/site/Footer.tsx:29,44` and `app/(site)/contact/page.tsx:90-95` | T1 | A |
| `global/headshot` | I will supply one | `public/portrait.jpg` (B&W studio portrait, plain black background, already published): `app/(site)/about/page.tsx:55-65` | T1 | A |
| `global/footer` | Clash Display footer signature | `lib/fonts.ts:4-9` (Clash Display is the site's display font, file in `app/fonts/`) | T1 | B |
| `global/motion` | As each brief describes (GSAP + Lenis) | `package.json:27-28`; `CLAUDE.md:30-31,81-85`; `scripts/seed-data.mjs:291` (reduced motion treated as a scored category) | T1 | B |

### Every niche tab (`ai`, `ghl`, `apps`, `cloud`, `funnels`, `ads`, `shopify`, `wp`, `webflow`, `seo`)

| Key | Value | Evidence | Tier | Class |
|---|---|---|---|---|
| `<niche>/cta` (10 keys) | Book a scoping call | The main site's CTA is "Book a call" / "Book a 20-minute call": `components/site/BookCall.tsx:18`; `app/(site)/contact/page.tsx:55`. Same shape as the brief default. | T2 | B |
| `<niche>/tone` (10 keys) | Direct, technical but plain, first person | Published copy is first person and plain: `lib/agency.ts:38-94`; `lib/case-studies.ts`; `scripts/seed-data.mjs` posts. `AGENTS.md:22`, `CLAUDE.md:87-89` ban invented numbers. | T2 | B |
| `<niche>/testimonials` (10 keys) | None yet; omit the section | `PLAN.md:26,75-82` (proof upgrade "blocked on real numbers and quotes from Faraz"); no testimonial model in `models/index.ts`; none in `scripts/seed-data.mjs` | T1 | A |
| `<niche>/placeholders` (10 keys) | Build with visible placeholders and a TODO list | The evidence project already works this way: `docs/SITE-COPY.md:4,137-143` (`[…]` marks facts to supply); `AGENTS.md:22` | T1 | B |

### Niche-specific

| Key | Value | Evidence | Tier | Class |
|---|---|---|---|---|
| `ai/stack` | n8n, Make, Zapier, GoHighLevel, Claude, OpenAI, Python, MongoDB, Next.js | `docs/CONTENT-BRIEF.md:39-47` (toolbox "all confirmed by Faraz"); `scripts/seed-data.mjs:35-121`; `app/llms.txt/route.ts:36` (names Claude, OpenAI); `lib/ai/adapters.ts:1-2` (Anthropic and OpenAI adapters in shipped code) | T1 | A |
| `ai/cases` | Lead Drift, Yard Terminal, SolidMake, AI SEO Automator | All four are published case studies: `lib/case-studies.ts:19-142`; `scripts/seed-data.mjs:125-254` | T1 | A |
| `ai/numbers` c1 (Lead Drift) | "Lead Drift is Indepth Solution's own growth engine, running in production." | Copied from `lib/case-studies.ts:138` and `scripts/seed-data.mjs:250`. An operational fact, not a measured number. | T1 | A |
| `ghl/audience` | Agencies and businesses | `lib/agency.ts:42-47` and `app/(site)/agencies/page.tsx` (agencies); `scripts/seed-data.mjs:35-44` (full client GHL buildouts) | T1 | A |
| `ghl/cases` | farazahmad.dev → GHL lead pipeline | `lib/ghl/core.ts:386-418`; `docs/GHL-LEAD-SETUP.md:72-86`; `PROGRESS.md:101-111`. Built and unit-tested, but see warning W1. | T1 | A |
| `ghl/numbers` c1 | Saved to MongoDB first, then sent to GoHighLevel through its API: contact upsert by email, tags added (including `niche:<slug>`), a note, and an open opportunity. Failed sends can be retried from admin. | `docs/GHL-LEAD-SETUP.md:72-86`; `lib/ghl/core.ts:154-163` | T1 | A |
| `apps/cases` | SolidMake, Yard Terminal, farazahmad.dev, AI SEO Automator / Lead Drift | Case studies as above; farazahmad.dev is the repo itself (`CLAUDE.md`, `STATUS.md`) | T1 | A |
| `apps/numbers` c3 (farazahmad.dev) | Home page, Lighthouse 13.5 (local production build, 2026-10-02): Accessibility, Best Practices, SEO and Agentic browsing 100; mobile Performance 93–95, desktop 100; CLS 0. | `STATUS.md:23-31` | T1 | A |
| `funnels/tools` | GoHighLevel, n8n, Make, Zapier | `scripts/seed-data.mjs:35-76`; `lib/agency.ts:61,78` | T1 | A |
| `funnels/cases` | Lead Drift, farazahmad.dev lead pipeline | `lib/case-studies.ts:112-142`; `lib/first-touch.ts`; `PROGRESS.md:39-40` | T1 | A |
| `funnels/numbers` c1 | Same Lead Drift sentence as `ai/numbers` | `lib/case-studies.ts:138` | T1 | A |
| `funnels/numbers` c2 | Landing page, referrer and UTM source/medium/campaign are captured at first touch and stored with every lead, then mapped onto GoHighLevel custom fields. | `lib/first-touch.ts`; `lib/ghl/core.ts:19-31`; `CLAUDE.md:152-154` | T1 | A |
| `shopify/cases` | Yard Terminal (marketplace sync) | `lib/case-studies.ts:22-24,33` (synced with eBay, Shopify, Amazon, Google, Facebook Marketplace) | T1 | A |
| `shopify/sync-map` | Include (Yard Terminal) | Same source as above | T1 | B |
| `seo/cases` | AI SEO Automator, farazahmad.dev (technical SEO) | `lib/case-studies.ts:81-111`; `PROGRESS.md:21-28`; `app/llms.txt/route.ts`; `app/sitemap.ts` | T1 | A |
| `seo/numbers` c2 (farazahmad.dev) | Lighthouse 13.5 SEO score 100 on /, /audit, /templates, /agencies and /contact (local production build, 2026-10-02). Ships llms.txt, an ai-catalog, a sitemap, canonical URLs and JSON-LD. | `STATUS.md:23-31`; `PROGRESS.md:21-28` | T1 | A |

Nothing was filled for `cloud`, `ads`, `wp` or `webflow` beyond the four shared answers. There is no evidence for them in the project.

## 2. Left open, per tab

Open on every niche tab: **headline** (no evidence; it belongs to the brief), **accent, theme, typography, signature section** (design belongs to the briefs), **prices** (`PLAN.md:62`: "prices come from Faraz"), **build priority** (owner's call).

**Offers to show** is open on every niche tab on purpose. The evidence supports "Build" style work (`lib/agency.ts:60-65`) and the free `/audit` quiz. A paid audit, rescue and care plan appear only as planning (`PLAN.md:49-55`). Ticking only the evidenced offers would drop tiers the owner may well want, so I left the choice to the owner.

| Tab | Owner must supply |
|---|---|
| global | Booking link (derived from the GHL calendar stored in MongoDB; unreadable). How prices are shown (`PLAN.md:51-52` is planning only). Search indexing while building (the evidence site is fully indexable, so there is no niche precedent). |
| ai | Numbers for Yard Terminal, SolidMake and AI SEO Automator, and measured numbers for Lead Drift. Live workflow source: only the public steps Scrape → Nurture → Convert exist in the evidence, not the brief's `trigger → enrich → classify → route → notify`. |
| ghl | GHL client stories or screenshots (`docs/CONTENT-BRIEF.md:95` says "many GoHighLevel buildouts", with no specifics). Lead delivery numbers (none measured anywhere). Cases 2 and 3 (no evidence Lead Drift touches GHL). |
| apps | Numbers and screenshots for SolidMake, Yard Terminal and the small cards. Architecture diagrams (no repos for SolidMake or Yard Terminal in the evidence). |
| cloud | Everything: on-call (yes/no, hours, time zone), tools and certifications, the savings slider, and at least one real infra story. The only hosting trace is Vercel in an unticked checklist (`docs/LAUNCH-CHECKLIST.md`). |
| funnels | Whether you write the copy. Permission to publish Lead Drift numbers. Leak calculator (see W3). Measured Lead Drift numbers. |
| ads | All of it: platforms, run vs automate, partner status, minimum spend, any account result. A search for Meta, Google Ads and Search Console in the project found nothing. |
| shopify | Shopify Partner status. Plus work. A storefront project (theme or speed). Yard Terminal numbers. |
| wp | WooCommerce scope. Hosting and care plans. A project with before/after numbers. No WordPress work appears in the evidence. |
| webflow | Design included or build only. Certification status. Any Webflow project. Interaction gallery (design, so skipped). |
| seo | Link building yes/no. Search Console screenshots. AI SEO Automator numbers. Any client site. |

## 3. Conflicts

1. **Call length.** Evidence says "Book a **20-minute** call" (`app/(site)/contact/page.tsx:55`). Every brief says "30 min, free". The evidence wins; the briefs' scoping-call copy should say 20 minutes unless you change the evidence site.
2. **Test count.** `STATUS.md:16` says 257. The apps brief says 261. A static count of `test(` calls in `lib/**/*.test.ts` gives 261 (not run). STATUS.md looks stale. I left the test count out of the filled numbers.
3. **GHL pipeline status.** The ghl brief says "his own site pushes every lead into GHL". `STATUS.md:12,36-37` says the pipeline is **inactive until the location ID and token are set in admin**, and that checklist item is unticked.
4. **Lead Drift.** The funnels brief calls it "his own outreach company/system". In the evidence the company is Indepth Solution and Lead Drift is the product (`lib/case-studies.ts:113`).
5. **Sync map.** The shopify brief puts "Shopify in the centre". Yard Terminal's own design makes the listing record the hub and every marketplace an endpoint (`scripts/seed-data.mjs`, post "the-hard-part-is-the-delist").
6. **Cut ideas.** `PLAN.md:33-41` cut "bulk programmatic SEO pages" and a "Zapier/Make/n8n cost calculator" for the owner's own site. The seo brief sells "Programmatic SEO build", and the cloud and funnels briefs include calculators. These apply to a different context, but check you still want them.
7. **Email domain.** The only contact email in the evidence is on `cupupmarketing.com`, while the schema placeholder suggests `name@farazahmad.dev`.
8. **Unconfirmed names.** `docs/CONTENT-BRIEF.md:97` says the AI voice-agent product names (heard as "retell") are unresolved. I left them out of `ai/stack`. The Ahrefs/SEMrush names are also unconfirmed (`docs/SITE-COPY.md:101`).

## 4. Top 5 to double-check first

1. **`global/email`.** It is the code's fallback address, on another company's domain. If admin Settings holds a different address, the niche sites would show a different one from the main site. Confirm which address you want public.
2. **GHL being live (W1).** `ghl/cases`, `ghl/numbers` and `funnels/numbers` c2 describe what the pipeline does. Confirm the sub-account is actually connected, and that a booking calendar is selected, before anything says "every lead goes to GHL". The booking link also needs filling.
3. **`ai/numbers` and `funnels/numbers` c1.** "Running in production" is copied from your published Lead Drift copy, but `docs/SITE-COPY.md:104` still marks the result "[leads/clients — confirm]". Confirm it is true today.
4. **Case-study status.** `ai/cases` and `apps/cases` feature four projects whose status, users and year are still marked "confirm" in `docs/SITE-COPY.md`. Confirm each is live and OK to name. Keep the rule to say Yard Terminal and never "AES".
5. **`ai/stack` and `testimonials = none`.** Confirm OpenAI and Claude are tools you use in client work. Confirm you have no Upwork or client messages you could publish, since "none" omits that section on all 10 sites.

## Warnings

- **W1.** Items 3 and 2 above: the GHL pipeline is shipped code, not confirmed live traffic.
- **W2.** The `global/headshot` portrait is black and white on black. It suits the dark niches (ai, cloud, ads); the light-themed sites will need a treatment or another photo.
- **W3.** The funnels leak calculator and the cloud savings slider were left open: both need conversion or savings assumptions that don't exist in the evidence. Leaving them open uses the brief default (include, labelled as an estimate), but the numbers would have to come from you.
- **W4.** The Lighthouse figures are local-build measurements from 2026-10-02 (`STATUS.md:19-31`) and can drift. Re-run before publishing.
- **W5.** Runtime settings (the booking link, admin email, GHL pipeline IDs) live in MongoDB, which I could not read. Where the repo shows only a shape, I treated it as no evidence.
