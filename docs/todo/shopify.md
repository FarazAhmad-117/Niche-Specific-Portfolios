# shopify.farazahmad.dev: what the owner must supply or confirm

Everything below shows on the site as a dashed `TODO ·` chip, an "Example" / "Illustrative"
label, or is a fact I could not verify. Nothing has been invented to fill these gaps.
`noindex` stays ON in `src/niches.ts` until this list is done.

**Repositioned 2026-11-05 (owner's call):** the site now sells *a store that is live soon,
found on Google and built to sell* (launch · search · sales). The Yard Terminal case, the
marketplace sync map and the speed-first pitch ("A faster Shopify store with fewer apps") are
gone. Yard Terminal still appears on the ai, apps and cloud niches.

## Numbers (TODO chips on the site)

- [ ] **Store results** (proof strip, 4th cell): stores launched, with timelines and sales numbers.
- [ ] **Launch example → real launch** (`/work/launch-sprint/`): store type, timeline, what shipped,
      permission to publish.
- [ ] **Indexing example → real store** (`/work/search-ready/`): indexed product pages before and
      after (Search Console screenshots).
- [ ] **Product page example → real store** (`/work/sales-teardown/`): conversion rate and average
      order value before and after.

## Facts to confirm

- [ ] **"Live in weeks"** (hero headline, OG image). A promise with no fixed number; the FAQ says
      "weeks, not months" for a proven theme with products ready to import, and that the date is
      agreed on the call. Confirm this matches how long your launches take.
- [ ] **Offers.** Store launch (incl. migrations from WooCommerce etc. with redirects), Get found on
      Google (Search Console, schema, Merchant Center), Sales lift (product page, bundles,
      free-shipping threshold, express checkout, tracking), Custom builds & integrations, Care plan.
      Confirm these are all things you take on.
- [ ] **Proof strip** uses two registry projects: the supplier catalogue pipeline
      (`catalog-scraper-shopify`, client build: scrape → LLM enrichment → Shopify Admin API) and
      Quarry (own OS 2.0 theme, in progress). Confirm both may be cited this way.
- [ ] **Shopify Partner.** decisions.md says "No; no partner language", and the site has none.
      indepthsolution.com lists "Shopify Partner" among its credentials. Decide whether that
      should change here; until then nothing claims it.
- [ ] **Stack chips** in About: Liquid, Online Store 2.0, Shopify Admin API, Webhooks, Node.js,
      Next.js, MongoDB. Confirm, or name what you actually use.
- [ ] **"Building since 2022"** (About) vs Indepth Solution "since 2019". Pick one story.
- [ ] **Portrait**: reused from the shared portrait. Swap if you supply a new headshot.

## Illustrative content (labelled on the site; keep or replace)

- **Hero panel**: "Launch checklist · Example store". Six real launch tasks with a status each and
  the total "Ready to launch 0/6 → 6/6", which is just the count of that example's own lines.
- **Problem panel**: "Store check · Example store", six tiles, four with a warning tag.
- **Store teardown** (signature): the store "Kiln & Co." at `kiln-and-co.example`, the product, the
  "What Google sees" signals and the "Free shipping on orders over $50" / "Ships tomorrow · Free
  30-day returns" copy are examples. The **"Ready to sell" meter is illustrative**: a position on
  Not yet → Ready, labelled "Illustrative · not a measurement". No scores, rates or rankings.
- **Example cases** `/work/launch-sprint/`, `/work/search-ready/`, `/work/sales-teardown/`:
  labelled Example everywhere, including their OG images and JSON-LD (`genre: Illustrative example`).

## Before launch

- [ ] Run `npm run build` and test page transitions on the production build (dev HMR disables
      bfcache, so browser back looks worse in dev).
- [ ] Set `noindex: false` for shopify in `src/niches.ts`; add the DNS record (README).
