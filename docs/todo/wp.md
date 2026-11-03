# wp: what the owner must supply or confirm before launch

`noindex` is still ON in `src/niches.ts`. Nothing below is invented on the site: each item is
either a visible dashed `TODO ·` chip, or an "Example" / "Illustrative" label.

## Visible TODO chips (supply the real thing, then remove the chip)

| Where | Chip | Data file |
|---|---|---|
| Home › Proof strip | `TODO · Number of sites` (WordPress sites rescued or rebuilt) | `src/data/wp/content.ts` › `PROOF.todo` |
| Home › Proof strip | `TODO · Real before/after timing` | same |
| Home › Proof strip | `TODO · Plugins before → after` (a real site) | same |
| Home › Case card, AI SEO Automator | `TODO · Confirm WordPress is a publishing target, and how (REST API or plugin)` | `src/data/wp/cases.ts` › `pending[0]` |
| Case page › AI SEO Automator (hero + "Still to confirm") | the chip above, plus `TODO · Posts published and time saved`, `TODO · Status: live? users?` | `src/data/wp/cases.ts` |
| Home › Case slot (dashed, "Any rebuild / rescue") | `TODO · Client site and permission`, `TODO · Load time before → after`, `TODO · Plugins removed, traffic kept` | `src/data/wp/cases.ts` › `CASE_SLOT` |
| Case page › example teardown | `TODO · Replace with a real anonymized rescue or rebuild, with before/after numbers` | `src/data/wp/cases.ts` |

## Example / illustrative content (labelled everywhere it appears)

- **"Anatomy of a plugin-heavy site"** (`/work/plugin-heavy-teardown/`): an example, stamped
  "Example" on the card, the page, the next-case card, the OG image ("Example teardown ·
  illustrative", "Example · not a client site") and JSON-LD (`genre: Illustrative example`,
  name suffixed "(illustrative example)").
- **Before / after player**: the example site "Northwind Journal", invented plugin names, the
  counts 47 → 12 and 9 updates (the brief's illustrative number, also the Problem headline,
  whose folio is stamped "Example · illustrative"), and
  the "Page weight" meter (relative bar, no units). Labelled "Example site", "Illustrative mock,
  not a WordPress screenshot. Plugin names are invented." and an "Illustrative" stamp.
- **Hero proof sheet**: a page of the same example site in the block editor, captioned
  "Illustrative: what I check on every page before I hand a site over."

### Invented plugin names, checked against wordpress.org (2026-11-04)

`https://wordpress.org/plugins/<slug>/` answers 200 for a real plugin and 301 to the search
page for an unknown slug. Paid plugins sold elsewhere are not covered by this check.

| Name in the mock | Slug checked | Result |
|---|---|---|
| Builder Pro | builder-pro | not listed (301 to search) |
| Builder Addons Pack | builder-addons-pack | not listed |
| PageCache Plus | pagecache-plus | not listed |
| TurboCache Lite | turbocache-lite | not listed |
| Guardwall Security | guardwall-security | not listed |
| Meta Tags Kit | meta-tags-kit | not listed (replaces "SEO Toolkit", a real plugin, 200) |
| Title Tag Helper | title-tag-helper | not listed (replaces "SEO Helper", a real plugin, 200) |
| Hero Slider Deluxe | hero-slider-deluxe | not listed |
| Share Bar (asset list) | share-bar | not listed |

## Claims to confirm (written from the brief and decisions, not from verified records)

1. AI SEO Automator publishes to **WordPress** (decisions lists the case as "AI SEO Automator →
   WordPress publishing"; the research only says "published straight to the site"). The site
   never claims WordPress or a mechanism until confirmed.
2. AI SEO Automator "Built as self-serve: a site owner signs up…": from `src/data/ai/cases.ts`;
   live status and users are NOT FOUND.
3. WordPress capability claims from the brief: custom block themes and patterns, malware
   cleanup, Core Web Vitals work, WooCommerce stores, fixing/speeding up page-builder
   (Elementor) sites, white-label work for agencies.
4. Process promises shown as "in every site": daily backups kept off the server, a staging site,
   two-factor for admins and a firewall, a redirect map on rebuilds, a recorded handover video,
   launches "in a quiet hour", checkout tested on staging for WooCommerce.
5. Care plan contents: updates on staging, daily backups, uptime and security monitoring, small
   monthly edits. Hosting: recommended on the call, not sold (decided). Which hosts you
   recommend is not stated anywhere; add if you want it in the FAQ.
6. Profile: "Building since 2022" and job title "Full-Stack Engineer & Automation Expert" are
   reused from the ghl profile.
7. The FAQ answer on rankings ("nobody can honestly promise rankings… sitemap resubmitted, crawl
   errors checked") describes your process; confirm it matches how you work.

## Other inputs

- Testimonials: omitted (decided). No section exists.
- Prices: none anywhere (decided: "Scoped on a call").
- Headshot: the same B&W studio portrait as other niches (`src/assets/wp/faraz.jpg`).
- Before going live: set `noindex: false` for `wp` in `src/niches.ts`, add the Vercel domain
  `wp.farazahmad.dev` and the Spaceship CNAME (README › DNS).
