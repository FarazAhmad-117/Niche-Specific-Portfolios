# ai.farazahmad.dev — Content brief & design direction

_Built from `ai-shortlist.md` (GPT + Gemini + Claude research, 2 Nov 2026). Put this in the niche repo at `docs/briefs/ai.md`; it is the build spec for the `ai` niche. Nothing here copies competitor wording; references are for patterns only._

---

## 1. Positioning

**One line:** A senior engineer who builds AI and automation systems that actually run in production — fixed scope, monitored, and owned by the client.

**Who it's for:** Founders, ops leads and agency owners at B2B and service businesses (roughly 5–200 people) who have:
- repetitive work eating hours (lead handling, data entry, reporting, document processing), or
- an AI pilot or no-code automation that stalled, broke, or never reached production.

**What they fear (from research):** hype, pilots that never ship, automations that break silently, unclear cost, open-ended retainers, data ownership.

**Where Faraz wins (gaps no competitor fills well):**
1. **Live proof** — show a real workflow running, not a claim.
2. **Production-readiness, stated plainly** — error handling, human override, logging, cost caps, model fallback. Nobody lists this.
3. **Baseline → after** — every case study shows the manual baseline and the measured result.
4. **Engineer, not agency** — real code when no-code hits its limits (SolidMake, Yard Terminal prove this), with agency-level process.

Positioning sits between the cheap no-code freelancer and the expensive agency: agency-grade reliability, direct access to the person building it.

---

## 2. Offer ladder

Research shows the strongest sites give buyers distinct paths with visible prices. Use four, plus a free first step.

| Step | Offer | What it is | Price display |
|---|---|---|---|
| 0 | **Scoping call** | 30-min call, free. Leave with a clear yes/no and a rough cost. | Free |
| 1 | **Automation Audit** | Map current workflows, find the 2–3 highest-ROI automations, written plan with costs. Fee credited toward a build. | "From $X" |
| 2 | **Build** | Fixed-scope build of one system (e.g. lead intake → enrichment → CRM → alerts), production-ready checklist included. | "Most builds $X–$Y" |
| 3 | **Rescue** | Fix a broken or stalled automation / AI pilot (Zapier, Make, n8n, custom). | "From $X" |
| 4 | **Care plan** | Monthly monitoring, fixes, small changes, model/API updates. Cancel any time. | "$X / month" |

**Prices: Faraz decides.** Research reference points (different markets, not recommendations):
- Small/solo shops: entry offers $250–$1,500; builds $750–$5,000; support ~$500/mo.
- US/UK studios: builds from ~$5k, typically $10k–$50k; retainers $10k+/mo.

Rule: always show at least a "from" price and a typical range next to the final CTA (LeftClick pattern). "No hourly billing" is a recurring trust phrase.

---

## 3. Proof plan (case studies)

Four case studies, each as its own page at `/work/<slug>/` plus a card on the home page. Every one uses the same format: **Problem → Baseline → What I built → Stack → Result (numbers) → What runs it now.**

| Case | Angle on this site | Numbers to collect (Faraz) |
|---|---|---|
| **Lead Drift** | Outreach/lead automation end to end — the hero demo workflow comes from this | leads processed/week, hours saved, reply or meeting rate before vs after |
| **Yard Terminal** | AI that runs multi-marketplace selling (eBay, Shopify, Amazon, Google, FB) | listings handled, time per listing before/after, error rate, channels synced |
| **SolidMake** | Custom AI beyond no-code: text → CAD (STEP) | time per model before/after, accuracy, users/models generated |
| **AI SEO Automator** | AI content/SEO pipeline | pages produced, time per page, traffic or ranking change |

**If a number isn't measured, don't invent it.** Use an honest operational fact instead ("runs daily since March, 0 manual steps").

Other proof to gather:
- 3–6 testimonials with name, role, company, photo (Upwork/client messages count if permission given).
- Platform stats if strong (Upwork JSS, rating, project count).
- Stack badges as text or simple marks: n8n, Make, Zapier, OpenAI, Anthropic, LangChain, Supabase, etc. — only tools actually used.

---

## 4. Page structure

**v1 pages:** Home (single long page) + 4 case-study pages + shared 404. Audit page later if needed.

### Home — section order

| # | Section | Purpose | Notes |
|---|---|---|---|
| 1 | **Hero** | Outcome + who it's for | Headline, sub, primary CTA "Book a scoping call", secondary "Watch a workflow run" (scrolls to §4). Micro-line under CTA: "Fixed scope. Builds typically $X–$Y." |
| 2 | **Proof strip** | Instant credibility | 3–4 stats (systems shipped, hours saved, years building) + stack marks |
| 3 | **The problem** | Empathy | "Your AI pilot isn't failing because AI doesn't work." Short: tools bought, nothing in production, automations breaking quietly |
| 4 | **Live workflow** ★ | Signature section, fills the "live proof" gap | Pinned scroll: a real Lead Drift workflow draws node by node; a log panel prints each step (`trigger → enrich → classify → route → notify`). Real step names, anonymized data |
| 5 | **Case studies** | Proof | 4 cards, each headlined with its number (baseline → after) |
| 6 | **Offers** | Buying paths | The ladder from §2 as 4 cards + the free call |
| 7 | **Production checklist** ★ | Fills the "will it break?" gap | "Every build ships with": error handling & retries, human override, logging & alerts, cost caps, model fallback, permissions, data retention, handover docs. Grid of 8, mono labels |
| 8 | **Process** | Reduce uncertainty | 4 steps: Scope (call) → Audit/plan → Build (weeks, with demos) → Run (monitor, care plan) |
| 9 | **Comparison** | Objection handling | Table: Faraz vs typical agency vs no-code freelancer (who builds it, speed, price, code ownership, monitoring, handover) |
| 10 | **About** | Trust | Photo, 3 sentences, direct-access promise ("you talk to the person building it") |
| 11 | **FAQ** | Objections | See §5 |
| 12 | **Final CTA + form** | Convert | Price range repeated, booking link + ContactForm, face beside the button (Goodspeed pattern) |

### Case-study page template
Hero (client type + headline number) → Baseline → Build (diagram + stack) → Result (numbers) → What runs it now / maintenance → Testimonial → Next case + CTA.

---

## 5. Copy direction

**Voice:** direct, technical but plain, first person ("I build"), short sentences, numbers over adjectives. Confident, never hype.

**Headline options (pick one):**
1. "AI automations that survive production."
2. "From stalled AI pilot to a system that runs every day."
3. "I build the AI systems your team keeps putting off."

**Sub option:** "Senior engineer, not an agency. Fixed scope, monitored in production, and you own everything I build."

**Use:** production, fixed scope, measured, monitored, you own it, weeks not months, runs daily.
**Avoid:** revolutionize, unlock, cutting-edge, game-changer, "leverage AI", vague "solutions".

**CTAs:** primary "Book a scoping call"; secondary "Watch a workflow run"; offers "Start with an audit", "Fix my automation".

**FAQ (answer each in 2–3 sentences):**
1. We already tried AI and it didn't work — why would this?
2. What does it cost, and is it fixed?
3. What happens when an API or model changes and it breaks?
4. Who owns the code, the accounts and the data?
5. Is my data sent to OpenAI / used for training?
6. No-code (Zapier/Make/n8n) or custom code — which do I need?
7. How long until something is live?
8. Do I need a care plan?

---

## 6. Design direction

**Concept: "Signal flow."** The site looks like a calm control room for systems that run themselves: precise grids, node diagrams, mono log text, one bright signal colour that marks "live" things. Technical credibility without dashboard clutter.

**Type**
- Display: **Clash Display** (brand thread with farazahmad.dev) — large, tight tracking.
- Body: **Geist** or **Inter Tight**, 17–18px, generous line height.
- System labels, logs, numbers: **JetBrains Mono** (brand thread).

**Colour**
- Base: ink `#111110` background, bone `#f2f1ec` text (brand tokens), dark-first.
- Surfaces: `#1a1a19`, hairline borders at bone 10–12%.
- One signal accent for anything "live" (running nodes, metrics, CTA): acid lime `#D4FF3A` (alternative: signal orange `#FF5A1F`). Use sparingly — under 5% of the screen.
- Contrast: body text AA minimum, accent never used for body text on bone.

**Layout**
- 12-col grid, visible hairline grid in hero and checklist sections only.
- Big numbers in case-study cards; mono captions.
- Generous whitespace; max text width ~65ch.

**Motion (GSAP + Lenis)**
- Hero: the node graph draws in (stroke-dashoffset), then small "packets" travel along the edges on loop — subtle, slow.
- Live workflow (§4): ScrollTrigger pin; each scroll step lights a node and types a log line; ends with a result metric.
- Case studies: baseline → after counters on enter.
- Checklist: items tick on in sequence.
- Everything respects `prefers-reduced-motion` (static final states).
- Budgets: LCP < 2.0s on mobile, hero has no video, motion JS lazy beyond the hero, total JS < ~120 KB gz.

**References from the research (patterns, not looks)**
- Goodspeed — "vs DIY" comparison table; founder face on the CTA.
- LeftClick — price range beside the final CTA; numbers in case-study headlines.
- XRay Tech — workflow map as the hero visual.
- HireAgentic — separate buying paths (build / rescue / ongoing).
- Morningside — empathy section and the "we tried AI and it failed" FAQ.
- AutomateVia — showing the back end of real workflows.

**Mobile:** live workflow becomes a vertical stepper (no pin); comparison table becomes stacked cards; sticky "Book a call" bar after the hero.

---

## 7. Inputs needed from Faraz before build

- [ ] Pick a headline (or reject all three)
- [ ] Accent colour: lime or orange
- [ ] Prices for audit / build range / rescue / care plan
- [ ] Numbers for the 4 case studies (§3)
- [ ] 3–6 testimonials with permission
- [ ] Headshot (good light, plain background)
- [ ] Booking link (Cal.com / Calendly)
- [ ] Real Lead Drift workflow steps for the live demo (anonymized)
- [ ] Stack you actually use
- [ ] Fallback contact email

Once these are in, build order: hero + live workflow first (the signature), then case studies, offers, checklist, the rest.
