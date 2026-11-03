# Niche-Specific Portfolios

Static [Astro](https://astro.build) site. Each niche portfolio is a folder in this one project and is served as a subdomain of `farazahmad.dev` (`ai.farazahmad.dev`, `seo.farazahmad.dev`, ...) from **one Vercel project**.

The registry in [`src/niches.ts`](src/niches.ts) is the single source of truth. `vercel.json`, the sitemaps/robots, the SEO canonical and the `link()` helper all derive from it.

## Run

Needs Node `>=22.23.4`.

```bash
npm install
npm run dev        # http://localhost:4321/<slug>/  e.g. /ai/, /seo/, /funnels/
npm run build      # runs gen:vercel first, then astro build -> dist/
npm run check      # astro check (TypeScript strict)
```

- There is **no root page**, so `http://localhost:4321/` is a 404 by design. Open `/<slug>/`.
- `npm run preview` serves the production build, where links have no `/<slug>` prefix, so only use it to inspect output. Use `npm run dev` to click around.
- The contact form posts to `PUBLIC_CONTACT_ENDPOINT`: `https://www.farazahmad.dev/api/contact` by default (`.env`), `http://localhost:3000/api/contact` in dev (`.env.development`). Override locally in `.env.local` (git-ignored).

## Structure

```
src/niches.ts                    registry: slug, name, enabled, noindex
src/pages/404.astro               the one shared 404 (builds to /404.html)
src/pages/<slug>/                index.astro, robots.txt.ts, sitemap.xml.ts
src/layouts/<slug>/Layout.astro  per-niche layout, scoped styles only
src/assets/<slug>/               images (astro:assets imports)
src/components/shared/           ContactForm, SEO, Attribution, Motion
src/lib/                         link.ts, motion.ts, attribution.ts, seo-files.ts
scripts/gen-vercel.ts            generates vercel.json from the registry
scripts/new-niche.ts             npm run new:niche
scripts/templates/              file templates used by new:niche
public/favicon.svg               the only file in /public
```

## Briefs and decisions

Content brief + design direction per niche: `docs/brief/<slug>.md`. The owner's final choices are in **`docs/brief/DECISIONS.md`** (read this first; decided items and custom instructions override the briefs). `docs/brief/decisions.json` is the same data in machine form and `docs/brief/PREFILL-REPORT.md` records where pre-filled answers came from.

## Add a niche

```bash
npm run new:niche <slug>                  # slug already in src/niches.ts (e.g. ghl)
npm run new:niche <slug> "Display Name"   # brand-new slug: also appends it to the registry
```

It sets `enabled: true` (noindex stays ON), creates `src/pages/<slug>/`, `src/layouts/<slug>/` and `src/assets/<slug>/` from `scripts/templates/`, and never overwrites existing files. Then:

1. `npm run build` (regenerates `vercel.json`; `gen:vercel` fails fast if an enabled niche has no `src/pages/<slug>/index.astro`).
2. Do the DNS step below.
3. When the niche is ready to be found, set `noindex: false` for it (see below).

By hand it is the same thing: set `enabled: true` in `src/niches.ts` and copy the three folders from an existing niche, replacing the slug inside the files.

## Noindex switch

Every niche has `noindex: true` in `src/niches.ts` by default. While it is on, that niche:

- puts `<meta name="robots" content="noindex">` on every page (via `<SEO />`), and
- serves a `robots.txt` with `Disallow: /` (and no `Sitemap:` line).

Set `noindex: false` to go live: the meta tag disappears and `robots.txt` allows everything and lists the sitemap. A single page can also opt out with `noindex` on its `Layout`/`SEO` props.

Note: a `Disallow` in `robots.txt` stops crawlers from reading the page, so they never see the `noindex` tag. Together they keep a niche out of crawls, but URLs linked from elsewhere can still show up in results without content. Remove both switches (one flag) before launching.

Optional per niche: render `<Motion />` (from `components/shared/Motion.astro`) in the layout to turn on Lenis + GSAP ScrollTrigger. Niches that don't never download them. It does nothing under `prefers-reduced-motion`. Use `getMotion()` from `src/lib/motion.ts` to reach the `gsap`, `ScrollTrigger` and `lenis` instances.

## DNS and domain (per niche)

1. Vercel: Project -> Settings -> Domains -> add `<slug>.farazahmad.dev`.
2. Spaceship (DNS for `farazahmad.dev`): add a **CNAME** record, host `<slug>`, value = the target Vercel shows for that domain (Vercel's generic target is `cname.vercel-dns.com`; use the one Vercel displays).
3. Wait for Vercel to show the domain as valid (SSL is issued automatically).

The rewrite for the host already exists in `vercel.json` once the niche is enabled and deployed.

## Rules

- **No root `src/pages/index.astro`.** Every page lives under `src/pages/<slug>/`. The subdomain rewrite maps `/x` to `/<slug>/x`. The only root page is the shared `src/pages/404.astro`.
- **Images come from `src/assets/<slug>/`** via `astro:assets` (`<Image>` / `getImage`). Nothing in `/public` except the shared favicon.
- **Always build internal links with `link()`**, never hard-coded paths:
  ```astro
  ---
  import { createLink } from '../../lib/link';
  const link = createLink('ai');
  ---
  <a href={link('/about')}>About</a>
  ```

  Dev: `/ai/about/`. Production: `/about/`. It also applies the site-wide trailing slash.
- **Trailing slashes: always** (`trailingSlash: 'always'` in `astro.config.mjs`, `"trailingSlash": true` in the generated `vercel.json`). Keep both in sync.
- **Styles in niche layouts/pages are scoped** (no `is:global`). Style the shared form from a scoped parent: `.contact :global(.cf__input) { ... }`, and via the `--cf-*` custom properties documented at the top of `ContactForm.astro`.
- `vercel.json` is generated and committed; don't edit it by hand, edit `src/niches.ts`.

## Contact form

`<ContactForm niche="ai" />` POSTs `FormData` cross-origin straight to the endpoint (no Vercel proxy) with: `name, email, message, niche, company` (honeypot), `elapsed`, `ft_page, ft_landing, ft_referrer, ft_utm_source, ft_utm_medium, ft_utm_campaign`.

First-touch attribution (landing path, referrer, UTMs) is saved in `sessionStorage` on the visitor's first page view of the session (done by `<SEO />`) and read at submit.

The endpoint must answer cross-origin: send `Access-Control-Allow-Origin` for the niche origins (and `http://localhost:4321` in dev) on success, error and 429 responses. Without it the browser hides the response and the form shows the "could not reach the server" mailto fallback.
