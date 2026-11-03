# ghl.farazahmad.dev — Content brief & design direction

> **DRAFT — no research merged yet.** Written from general market knowledge of the GoHighLevel services space. Revise after `ghl-shortlist.md` comes back from the GPT / Gemini / Claude research.

---

## 1. Positioning

**One line:** A developer who builds GoHighLevel systems that go past what the builder can do — clean accounts, reliable automations, and custom integrations when native features run out.

**Who it's for:**
- Marketing agencies running GHL for clients (incl. SaaS mode / white-label).
- Coaches, consultants and local service businesses using GHL as their CRM.

**What they fear:** messy sub-accounts nobody understands, workflows firing twice or not at all, snapshots that break on install, deliverability and SMS compliance (A2P 10DLC) problems, being locked to a VA who disappeared.

**Where Faraz wins:** most GHL sellers are no-code VAs. Faraz is an engineer: webhooks, the GHL API, custom code, external apps and data sync. Real proof already exists — his own site pushes every lead into GHL with tags and opportunities.

---

## 2. Offer ladder

| Step | Offer | What it is | Price display |
|---|---|---|---|
| 0 | Scoping call | 30 min, free | Free |
| 1 | **Account audit & cleanup** | Review pipelines, workflows, triggers, forms, deliverability; written fix list; optional cleanup | "From $X" |
| 2 | **System build** | Pipelines + workflows + forms/funnels + reporting for one business model | "Most builds $X–$Y" |
| 3 | **Snapshot** (for agencies) | A reusable, documented snapshot for a client niche, tested on install | "From $X" |
| 4 | **Custom integration** | API / webhook / external app sync GHL can't do natively | "Quoted after scoping" |
| 5 | **Care plan** | Monitoring, fixes, small changes monthly | "$X / month" |

---

## 3. Proof plan

| Case | Angle | Numbers to collect |
|---|---|---|
| **farazahmad.dev → GHL lead pipeline** | Custom code integration: site forms → Mongo → GHL contacts, opportunities, niche tags, retries | leads synced, delivery success rate, time from form to pipeline |
| **Lead Drift** (if it touches GHL) | Outreach → CRM automation | leads/week, meetings booked |
| Client GHL work (if any) | Cleanup or build | workflows fixed, hours saved, show-up / response rates |

**Gap:** you need at least one more real GHL client story. Until then, lead with the integration case + a detailed teardown.

---

## 4. Home — section order

1. **Hero** — outcome headline, CTA "Book a scoping call", secondary "See inside a clean account".
2. **Proof strip** — stats + "Developer-level GHL: API, webhooks, custom code".
3. **The problem** — the messy account: 40 workflows, nobody knows which fire.
4. **Account X-ray ★ (signature)** — interactive map of a sub-account: trigger → workflow → pipeline stage → notification. Hover a node to see what it does. Before (tangled) vs after (clean) toggle.
5. **Case studies**
6. **Offers** — ladder; separate tab "For agencies" (snapshots, SaaS mode) vs "For businesses".
7. **What every build includes** — naming conventions, documentation, test contacts, error notifications, deliverability check, handover video.
8. **Process** — Audit → Plan → Build → Handover.
9. **Comparison** — Faraz vs GHL VA vs agency.
10. **About**
11. **FAQ**
12. **Final CTA + form**

---

## 5. Copy direction

**Headline options:**
1. "GoHighLevel, built by a developer."
2. "Your GHL account, finally clean — and doing what you think it does."
3. "When GoHighLevel can't do it, I code it."

**Use:** clean, documented, tested, custom integration, you own the snapshot.
**Avoid:** "funnel hacker", "7-figure", hype income claims.

**FAQ:** Can you fix an account someone else built? · Do you work with agencies white-label? · What about A2P / email deliverability? · Can GHL connect to [my tool]? · Will I understand the setup after handover? · Do snapshots include my client's data? (no)

---

## 6. Design direction

**Concept: "Switchboard."** Light, organized, every wire labelled — the opposite of a messy account.

- **Type:** General Sans (display + body), JetBrains Mono for labels.
- **Colour:** warm off-white `#F4F2EC` base, ink `#111110` text, cobalt `#2440FF` accent, soft grey cards. Light theme (distinct from the dark `ai` site).
- **Motion:** X-ray map wires draw and untangle on scroll; workflow nodes pulse when "fired"; counters on case cards.
- **Mobile:** X-ray becomes a vertical list of flows with expandable steps.
- **Brand thread:** footer signature in Clash Display.

---

## 7. Inputs needed

- [ ] Headline pick
- [ ] Prices (audit, build range, snapshot, care plan)
- [ ] GHL client stories / screenshots (anonymized)
- [ ] Integration numbers from farazahmad.dev lead delivery
- [ ] Do you serve agencies, businesses, or both?
- [ ] Testimonials, booking link
