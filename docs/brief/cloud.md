# cloud.farazahmad.dev — Content brief & design direction

> **DRAFT — no research merged yet.** Written from general market knowledge of the systems / DevOps / cloud engineering space. Revise after `cloud-shortlist.md` comes back.

---

## 1. Positioning

**One line:** Cloud and DevOps engineering for small teams — faster deploys, fewer outages, smaller bills.

**Who it's for:**
- Startups with no dedicated DevOps person.
- Small SaaS teams whose cloud bill or deploy process got out of hand.
- Businesses moving off shared hosting / a single server.

**What they fear:** downtime, surprise cloud bills, one person who "knows the server", security gaps, risky migrations.

**Where Faraz wins:** a developer who understands the application, not only the infrastructure — he can fix the app and the pipeline together.

---

## 2. Offer ladder

| Step | Offer | What it is | Price display |
|---|---|---|---|
| 0 | Scoping call | 30 min, free | Free |
| 1 | **Infra & cost audit** | Architecture, security, CI/CD and bill review; prioritized fix list with savings estimate | "From $X" |
| 2 | **CI/CD setup** | Automated tests, preview environments, one-click deploys and rollbacks | "From $X" |
| 3 | **Migration** | Move to AWS / GCP / Vercel / containers with zero-downtime plan | "Typically $X–$Y" |
| 4 | **Cost optimization** | Right-size, reserved capacity, cleanup | "From $X" |
| 5 | **On-call / care plan** | Monitoring, alerts, patching, monthly report | "$X / month" |

---

## 3. Proof plan

**Gap: no cloud case study identified yet.** Candidates to write up:
| Case | Angle | Numbers to collect |
|---|---|---|
| Yard Terminal infra | Multi-channel sync at scale: queues, workers, scheduling | uptime, jobs/day, deploy frequency |
| SolidMake infra | GPU / heavy compute pipeline | cost per job, processing time |
| Any client migration / CI setup | Before → after | deploy time, outages, monthly bill |

Until real numbers exist, use an **"infra teardown"** of your own stack as proof.

---

## 4. Home — section order

1. **Hero** — headline, CTA "Book a scoping call", secondary "Get a cost audit".
2. **Proof strip** — uptime, deploys, savings; marks for AWS, GCP, Docker, Terraform, GitHub Actions, Vercel (only those used).
3. **The problem** — "Your infrastructure lives in one person's head."
4. **Status board ★ (signature)** — a live-looking ops panel: latency, error rate, deploys, monthly cost. Scroll flips it from "before" (red, slow, $$$) to "after".
5. **Cost slider** — drag current monthly bill → typical savings range (clearly labelled as an estimate).
6. **Case studies**
7. **Offers**
8. **What every engagement includes** — infra as code, runbooks, alerting, backups + tested restore, least-privilege access, handover.
9. **Process** — Audit → Plan → Implement → Monitor.
10. **About / FAQ**
11. **Final CTA + form**

---

## 5. Copy direction

**Headline options:**
1. "Infrastructure that stays up and costs less."
2. "Ship daily. Sleep nightly."
3. "DevOps for teams too small to hire DevOps."

**Use:** uptime, rollback, infra as code, runbook, measured savings.
**Avoid:** "enterprise-grade", buzzword piles (Kubernetes everything).

**FAQ:** Which clouds? · Will migration cause downtime? · Do I keep access to everything? · Do you do on-call? · How do you estimate savings? · Security / compliance basics?

---

## 6. Design direction

**Concept: "Uptime."** A quiet, precise operations room at night.

- **Type:** Geist (display/body), Geist Mono for metrics and logs.
- **Colour:** deep blue-black `#0B0F14`, cool grey text, cyan `#35E0FF` for healthy states, amber `#FFB020` only for warnings. Dark theme.
- **Motion:** status-board graphs draw live; terminal-style deploy logs; numbers tick; subtle scanline grid.
- **Mobile:** status board becomes stacked metric cards.
- **Brand thread:** footer signature in Clash Display.

---

## 7. Inputs needed

- [ ] Headline pick
- [ ] Prices
- [ ] At least one real infra story with numbers
- [ ] Clouds/tools you actually use and are certified in
- [ ] Do you offer on-call? Hours / time zone
- [ ] Testimonials, booking link
