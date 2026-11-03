# webflow niche: what the owner must supply or confirm before launch

`noindex` is still ON in `src/niches.ts`. Nothing below is invented on the site. Each item is
either a visible dashed `TODO ·` chip or a labelled example.

## Placeholders (visible TODO chips)

| Where | Chip text | What to supply |
|---|---|---|
| Home › Proof strip | `TODO · count` | Number of Webflow sites built |
| Home › Proof strip | `TODO · score` | Average Lighthouse on your Webflow builds (say how it was measured) |
| Home › Proof strip | `TODO · count + before/after` | WordPress to Webflow migrations, with traffic before and after |
| Home › Case studies (slot) | `TODO · Webflow project, numbers and screenshots` | Any Webflow project, even a personal one: pages, CMS collections, time to publish a page, Lighthouse |
| Home › Case studies (slot) | `TODO · Migration case: traffic before / after` | A migration with measured traffic and rankings |
| Case › These niche sites | `TODO · Lighthouse scores for these niche sites (production build)` | Run Lighthouse on the production build and add the scores |
| Case › Figma file to editable CMS | `TODO · Replace with a real Webflow build…` | Swap the example for a real project when one is cleared |

## Labelled examples (illustrative, never results)

- **Build system player**: the "Lumen" site, its posts, its classes and its collection are an example. The window says "Illustrative mock" and "Not a Webflow screenshot".
- **Hero panel**: the variables (`color/brand`, `radius/card`, `color/surface`, `font/heading`) are an example design system. The caption says "Illustrative".
- **Problem section**: the "Div Block 27" navigator is labelled "Typical handoff · example".
- **Case `figma-to-cms`**: labelled Example on the card, the page, the OG image ("EXAMPLE BUILD · ILLUSTRATIVE") and the JSON-LD (`genre: Illustrative example`). The collection plan (Posts, Team, Case studies) is an example too.

## Claims to confirm

- **Webflow work.** The site offers Figma builds, design + build, migrations, integrations and care plans (decided). Confirm you're comfortable that there is no shipped Webflow project shown yet.
- **Not certified.** The FAQ says plainly that you're not in Webflow's certified partner programme. Keep it, or drop the question.
- **"Works with" list**: Webflow, Figma, GSAP, Lenis, JavaScript, APIs and webhooks, n8n, Make, Zapier, GoHighLevel. JSON-LD `knowsAbout` adds Webflow CMS, Astro, web animation and WordPress migration.
- **The niche-sites case**: "one Astro project, one subdomain per niche", plus Lenis and GSAP lazy-loaded on desktop only. That is true of this repo and this niche's layout (`<Motion />` default gate). Confirm which other niche subdomains are live. They're mentioned in prose only and never linked.
- **FAQ answers about Webflow**: custom code per page and site-wide, the CMS API, Webflow Localization, and memberships "changed over time". These are general platform statements. Check them against Webflow's current docs before launch.
- **"Loom walkthrough"** in "In every site". Confirm you record handovers in Loom, or change it to "recorded walkthrough".
- **Profile**: Lahore, PKT, building since 2022, founder of Indepth Solution (same as the other niches).
- **Headshot**: uses the same B&W portrait as the other niches (`src/assets/webflow/faraz.jpg`).

## Before launch

- Set `noindex: false` for `webflow` in `src/niches.ts`, then do the Vercel domain and Spaceship CNAME.
- Test page transitions and back/forward on a production build (the dev server disables bfcache).
