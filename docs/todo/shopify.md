# shopify.farazahmad.dev: what the owner must supply or confirm

Everything below shows on the site as a dashed `TODO ·` chip, an "Example" / "Illustrative"
label, or is a fact I could not verify. Nothing has been invented to fill these gaps.
`noindex` stays ON in `src/niches.ts` until this list is done.

## Numbers (TODO chips on the site)

- [ ] **Storefront results** (proof strip, 4th label): stores sped up, with before/after numbers.
- [ ] **Store case study** (case slot on home): a real store, speed or conversion. Lighthouse and
      load time before/after, conversion change, permission to publish, screenshots.
- [ ] **Yard Terminal: parts / SKUs synced** (sync map, home card, case page).
- [ ] **Yard Terminal: measured sync time** (sync map, card, case page). yardterminal.com says
      "within seconds"; that is the product's own claim, so it is not repeated as a number here.
- [ ] **Yard Terminal: overselling incidents, before and after** (sync map, card, case page).
- [ ] **Yard Terminal: screenshots of the Shopify channel** (case page).
- [ ] **Example teardown → real teardown**: replace `/work/speed-teardown/` with an anonymised
      real store teardown with before/after numbers (or keep it, labelled as an example).

## Facts to confirm

- [ ] **Channels.** The brief says Yard Terminal syncs eBay, Amazon, Google and Facebook
      Marketplace. The research (`docs/research/ai-web.md`, from yardterminal.com) says only
      **eBay Motors and a Shopify storefront are live**, plus counter (POS) sales; Facebook
      Marketplace is "coming soon" on the home page and "not supported" on /limits; **Amazon and
      Google Shopping are not supported**. The site follows the research: Shopify, eBay Motors,
      counter = live; Facebook Marketplace = dashed "coming soon, not live"; Amazon/Google not drawn,
      and the case page says they are not connected. Confirm, or tell me what changed.
- [ ] **Sync map layout: the brief is overridden on purpose.** The brief (and decisions) asked
      for "Shopify in the centre". In Yard Terminal the **Part record** owns the count and every
      channel (Shopify, eBay Motors, the counter, which is Yard Terminal's own point of sale and
      not Shopify POS) connects to it directly. Drawing Shopify as the hub would show it relaying
      eBay sales and owning counter sales, which is false. So the record is the hub and Shopify is
      the emphasised spoke. Say if you want it otherwise.
- [ ] **Yard Terminal status.** Shown as "Opening to founding yards" (pre-launch, October 2026
      per its site). Today is 2026-11-03: has the beta opened? Any live yards I may mention?
- [ ] **Shopify Partner.** decisions.md says "No; no partner language", and the site has none
      (the footer says "Independent developer. Not affiliated with or endorsed by Shopify").
      But indepthsolution.com lists "Shopify Partner" among its credentials
      (`docs/research/ai-web.md` §Indepth Solution). If Indepth Solution is a Partner, decide
      whether that should change here; until then nothing claims it.
- [ ] **Stack chips** in About: Liquid, Online Store 2.0, Shopify Admin API, Webhooks, Node.js,
      Next.js, MongoDB. Liquid / OS 2.0 follow from the decided theme offer, not from a repo
      I could read. Confirm, or name what you actually use (e.g. Hydrogen, Remix app template).
- [ ] **Offer details.** Custom features names bundles, configurators, B2B and checkout
      extensions; the Plus note says checkout customisation and B2B are Plus-only work.
      Confirm these are things you take on.
- [ ] **"Building since 2022"** (About) comes from the owner's statements used in other niches.
      yardterminal.com's FAQ says Indepth Solution has operated since 2019. Pick one story.
- [ ] **Portrait**: reused from `src/assets/ghl/faraz.jpg` (copied to `src/assets/shopify/`).
      Swap if you supply a new headshot.

## Illustrative content (labelled on the site; keep or replace)

- **Hero receipt**: "Example store · App audit · illustrative". Six generic app types with a
  verdict each (keep / replace / remove / defer) and the total "Apps loading on every page 6 → 2",
  which is just the count of that example's own lines.
- **Problem shelf**: "Example store", six generic apps with warning tags.
- **Store teardown** (signature): the store "Kiln & Co." at `kiln-and-co.example`, the product,
  the scripts (`theme.js`, `reviews.js`, `popup.js`, `countdown.js`, `chat.js`, `upsell.js`) and
  the countdown text are examples. The **speed meter is illustrative**: a position on a
  Slow → Fast dial, labelled "Illustrative · not a measurement". No scores or load times.
- **Sync map**: "Example part · 2018 Silverado 1500 alternator" (the same illustrative part
  yardterminal.com uses). The events are the real flow.
- **Example case** `/work/speed-teardown/`: labelled Example everywhere, including its OG image
  and JSON-LD (`genre: Illustrative example`).

## Before launch

- [ ] Run `npm run build` and test page transitions on the production build (dev HMR disables
      bfcache, so browser back looks worse in dev).
- [ ] Set `noindex: false` for shopify in `src/niches.ts`; add the DNS record (README).
