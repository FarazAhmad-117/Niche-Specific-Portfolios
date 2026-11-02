# ads.farazahmad.dev — Content brief & design direction

> **DRAFT — no research merged yet.** Written from general market knowledge of the ads-automation space (Meta / Google Ads automation, scripts, campaign management). Revise after `ads-shortlist.md` comes back.

---

## 1. Positioning

**One line:** Ad automation that guards your budget around the clock — scripts, rules and reporting that cut wasted spend and surface what works.

**Who it's for:**
- In-house marketers and founders spending $5k+/month on Meta or Google.
- Agencies managing many ad accounts who need automation and reporting.

**What they fear:** budget burning overnight, slow reporting, agencies hiding results, tracking broken after iOS/privacy changes, not knowing true cost per customer.

**Where Faraz wins:** an engineer who builds the automation itself (Google Ads scripts, APIs, server-side tracking, dashboards) rather than only running campaigns by hand.

---

## 2. Offer ladder

| Step | Offer | What it is | Price display |
|---|---|---|---|
| 0 | Scoping call | 30 min, free | Free |
| 1 | **Account & tracking audit** | Waste, structure, conversion tracking accuracy; fix list | "From $X" |
| 2 | **Automation build** | Budget guards, bid/pause rules, anomaly alerts, creative rotation | "From $X" |
| 3 | **Tracking setup** | Server-side tracking (Conversions API / enhanced conversions), offline conversions from CRM | "From $X" |
| 4 | **Reporting dashboard** | Spend → leads → revenue, daily, all channels | "From $X" |
| 5 | **Managed automation** | Monitoring + monthly optimization | "$X / month" |

---

## 3. Proof plan

**Gap: no ads case study identified yet.** Candidates:
| Case | Angle | Numbers to collect |
|---|---|---|
| Any account you automated | Waste cut / CPA change | spend saved, CPA before/after, alert catches |
| Tracking fix | Attribution accuracy | conversions recovered |
| Lead Drift / farazahmad.dev | CRM → ad platform offline conversions | match rate |

Until real numbers exist, publish an **anonymized teardown** of an automation (e.g. "the 6 rules every account should run").

---

## 4. Home — section order

1. **Hero** — headline, CTA "Book a scoping call", secondary "Get an account audit".
2. **Proof strip** — spend managed, waste cut, accounts automated.
3. **The problem** — "Ad platforms optimize for spend. Someone has to optimize for you."
4. **Rules engine ★ (signature)** — a mock campaign chart; rule cards ("if CPA > target for 2 days → pause") animate in and visibly act on the chart.
5. **Waste estimator** — monthly spend → typical waste range (labelled estimate).
6. **Case studies / teardown**
7. **Offers**
8. **What every build includes** — change log, spend caps, alert channel (Slack/email), tracking verification, read-only access option.
9. **Process** — Audit → Fix tracking → Automate → Report.
10. **About / FAQ**
11. **Final CTA + form**

---

## 5. Copy direction

**Headline options:**
1. "Ads that watch their own budget."
2. "Stop paying for clicks you'd never approve."
3. "Ad automation built by an engineer, reported in plain numbers."

**Use:** wasted spend, guardrails, true cost per customer, tracked, alerts.
**Avoid:** "10x ROAS", guaranteed results, vanity metrics.

**FAQ:** Meta, Google, or both? · Do you run the campaigns or just automate? · Will rules ever pause good ads? · What access do you need? · Do you fix tracking? · Minimum spend?

---

## 6. Design direction

**Concept: "Spend curve."** Financial-terminal clarity: charts, thresholds, guardrails.

- **Type:** Clash Grotesk (display), Inter Tight (body), JetBrains Mono for numbers.
- **Colour:** graphite `#141414`, light grey text, amber `#FFB020` accent for rules/alerts, muted red for waste, muted green for saved. Dark theme.
- **Motion:** chart lines draw; threshold lines drop in; rule triggers flash then the line corrects; tickers on stats.
- **Mobile:** chart simplified to a single sparkline with rule cards below.
- **Brand thread:** footer signature in Clash Display.

---

## 7. Inputs needed

- [ ] Headline pick
- [ ] Prices
- [ ] At least one real account result (anonymized OK)
- [ ] Platforms supported; are you a Google/Meta partner? (don't claim badges otherwise)
- [ ] Testimonials, booking link
