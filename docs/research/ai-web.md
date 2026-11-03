# AI / Web products research: Yard Terminal and related products

Researched 2026-11-03. Prices intentionally omitted (owner rule: no prices). Everything below is from public pages fetched on that date, from page source (HTML/JSON-LD of the home page), or from the owner's saved screenshot. Page text was summarised by the fetch tool, so short quotes are as returned by the tool; re-verify before reusing verbatim.

---

## 1. Yard Terminal (https://yardterminal.com)

Note: `yardterminal.com` 308-redirects to `https://www.yardterminal.com/` (source: HTTP response headers).

### 1.1 What it is (one plain sentence)
YardTerminal is browser-based inventory and listing software for auto salvage yards (auto recyclers) that keeps one record per used part, lists it on eBay Motors and a Shopify storefront, and ends the other listings when it sells.
- source: https://www.yardterminal.com (meta description: "Auto salvage inventory and listing software for auto recyclers. One record per part, listed on eBay Motors and Shopify, ended everywhere when it sells.")

### 1.2 Who it is for
- Auto recyclers / auto dismantlers / used-auto-parts yards. Dedicated pages: `/auto-recycling-software`, `/software-for-auto-dismantlers`, `/salvage-yard-software/texas`, `/florida`, `/california`. source: https://yardterminal.com (link list)
- Works alongside existing yard-management systems; names Powerlink, Pinnacle, Checkmate, ITrack. It is NOT a yard management system (no dismantling operations, yard mapping, scrap tickets, accounting). source: https://yardterminal.com/limits
- Multi-yard: one login, separate inventory/staff/permissions per yard (Pro plan covers up to three yards). source: https://yardterminal.com/faq

### 1.3 Problem it solves (home page section "four ways a yard loses money")
- Parts sold twice, causing cancellations and a "Below Standard" account status for about twelve months.
- About twenty minutes of retyping per listing, per channel.
- Ended or forgotten listings still live months later.
- One spreadsheet on one machine that only one person understands.
- Product page: cancellations are a defect on the seller account; "two in a hundred orders" can cause eBay to stop showing listings.
- source: https://yardterminal.com (home), https://yardterminal.com/product
- UNVERIFIED externally: these eBay policy claims are the site's own statements; I did not check eBay's policy pages.

### 1.4 Headline, tagline, section titles (short exact phrases)
- Page title: "YardTerminal - Salvage yard software with AI eBay listings" (source: home page title as returned by fetch)
- OG/Twitter title: "YardTerminal - List once. Sell everywhere. Never oversell." (source: page source meta tags)
- Hero: "List once. Sell everywhere. Never oversell." (source: home page and screenshot)
- Hero subline: "One record per part, from the teardown to the shipping label." (source: screenshot)
- Status pill: "Now opening to founding yards" (source: screenshot and home page)
- Product page tagline: "One record. From the teardown to the shipping label." (source: https://yardterminal.com/product)
- Footer tagline: "Used parts run on YardTerminal." (source: home page footer)
- Section title: "The second alternator is fast. So is every one after it." (label "Catalogue once") (source: home page source)
- Section labels: "Catalogue once"; "The one guarantee"; "Built for this trade"; "The agent"; "The cascade" (source: home / product pages)
- Product page core promises: "Fitment inherited from the donor VIN" / "Nothing publishes without a person" / "Sold once, ended everywhere" (source: https://yardterminal.com/product)
- Product feature titles: "VIN once, fitment everywhere"; "AI drafts the listing"; "You still press approve"; "eBay and Shopify"; "Sold once, ended everywhere"; "Kept on the record"; "Fast from the second one"; "Location tracking"; "Tied to the car" (source: https://yardterminal.com/product)
- Waitlist headline: "We need yards who will tell us what we got wrong." (source: https://yardterminal.com/waitlist)
- Core premise: "a used part has a quantity of one" (source: https://yardterminal.com/about)
- Founder quote (the quote in page source): "I spent years fixing yards one problem at a time." (source: home page source, "Founder quote" section; also /about)
- VIN tool headings: "Decode a VIN."; "You just did step one. Step two is the long one." (source: https://yardterminal.com/tools/vin-decoder)

### 1.5 Features and how they work
Seven-step pipeline (source: https://yardterminal.com/product):
1. **Donor arrives**: a 17-character VIN is decoded once; parts from that vehicle inherit year, make, model, engine.
2. **Agent drafts**: title, category, condition, ordered photos, suggested price based on the yard's own sales history. Not published. Example draft on home page: 2018 Chevrolet Silverado 1500 5.3L alternator, OEM 84143543, Grade A, price suggested "based on 3 sales in the last 90 days" (illustrative example).
3. **You approve**: a person reviews, edits, approves. Page says the gate cannot be bypassed; /limits says there is no auto-publish or "trusted mode".
4. **Live everywhere**: one approval publishes to all connected channels, each in its own format.
5. **It sells once**: quantity is one, so first sale is the only sale.
6. **It ends everywhere**: a sale on one channel ends the other listings automatically.
7. **It goes on the record**: approver, sale channel, end times logged in an append-only trail.

Other features:
- **Fitment**: seeded from donor VIN; extended from eBay's catalog where a part number is known, or from a readable casting number; the agent proposes extra vehicles labelled "verified" or "suggested"; the user confirms and confirmations feed the yard's own catalogue so later listings arrive pre-filled. source: https://yardterminal.com/product
- **Catalogue once / "fast from the second one"**: matching identical parts by part number so later parts arrive pre-filled. No interchange license fee. source: home, /product
- **Location tracking**: Hall, aisle, rack, shelf, bin recorded at teardown; pick lists after a sale. source: home, /product
- **Tied to the car**: per-vehicle cost, parts pulled, sales and channel. Per-car report is described on the home page as "not built yet" (UNVERIFIED current state; home page fetch summary). source: https://yardterminal.com
- **Photos**: shot once, resized per channel. source: /product
- **Multi-yard**: separate inventory and staff, one login. source: /product
- **No silent repricing**: suggested prices appear beside sales history; live prices change only when a person changes them. source: /limits
- **No unverified part numbers**: blank and flagged if a number cannot be established. source: /limits
- **Core charges**: priced and tracked separately. source: /product
- **Existing listings import**: imported and matched to inventory; uncertain matches go to the user for review. source: /faq
- **Export**: records can be exported; on shutdown, the customer's eBay/Shopify accounts remain theirs and live listings keep running. source: /faq, /security
- **Free tools**: VIN decoder (`/tools/vin-decoder`) and oversell calculator (`/tools/oversell-calculator`). source: home page link list

### 1.6 Sales channels and how they sync
- **eBay Motors**: LIVE. source: /product, /limits, home
- **Shopify storefront**: LIVE. source: /product, /limits, home
- **Counter POS** (walk-in sales rung up in the product): LIVE. A counter sale ends the eBay and Shopify listings the same way. source: /limits, https://yardterminal.com/blog/shopify-ebay-sync-for-salvage-yards
- **Facebook Marketplace**: "Coming soon" badge on the home page (confirmed in page HTML). source: https://yardterminal.com (page source)
- **Not supported**: Facebook Marketplace, Google Shopping, Car-Part.com ("Not today, and there is no date." for Car-Part.com). source: https://yardterminal.com/limits and /faq
- **Amazon**: not mentioned anywhere I could find. Do not claim it.
- Connects to the customer's OWN eBay and Shopify accounts; does not list under its own accounts. source: https://yardterminal.com/security
- Sync model: not a stock-count sync between two systems. One record owns the count; channels hold listings, not stock. A sale ends the other listing "not at the next scheduled run"; each ended listing is verified against its channel; failed writes are retried until the channel end is confirmed. Home page says sync "within seconds". Sales made in a yard's separate system do not end any listing. source: https://yardterminal.com/blog/shopify-ebay-sync-for-salvage-yards, /product
- Setup friction: eBay requires every yard to register its own developer application; "plan for about a week" before the first listing goes live. source: /faq, /limits
- Data and shipping logos on home page: CSV/Excel import and export, USPS, FedEx (from home page fetch; UNVERIFIED depth of integration, treat as logos only).
- No API/webhook/polling details are published. source: blog post above

### 1.7 Data model ideas stated on the site
- Quantity one by default (used parts). source: /product
- Donor vehicle is the parent record; parts inherit fitment. source: /product
- Interchange is a structured field; condition and grade structured for buyer filters. source: /product
- Ended listings kept 90 days (returns, payment disputes), then deleted; multi-year archives must be exported manually. source: /product, /security, /limits
- Append-only audit trail ("Rows are added, never edited or deleted, including by YardTerminal staff"). source: https://yardterminal.com/security
- Tenant isolation: every record carries its yard; every database query filtered by it; a query without a yard is refused; unique indexes are compound on yard plus business key; per-module tenant-isolation tests; "enforced, not promised" (FAQ). source: /security, /faq
- Fail-safe: "a part is locked rather than sold twice" if something fails. source: /security
- Roles scoped per yard; drafting and approving are separate permissions. source: /security
- Fitment: NOT Hollander/licensed interchange; comes from donor VIN, eBay's catalog, casting numbers, user confirmation. source: /limits, /ara-2026, /tools/vin-decoder
- VIN decoder data source: NHTSA vPIC (US DOT public database). "No signup, no email, no limit." source: https://yardterminal.com/tools/vin-decoder
- Claim: a single part on eBay Motors can have up to about 3,000 fitment combinations; incomplete fitment hides the part from buyers filtering by vehicle. source: /tools/vin-decoder, home page. (Site's own claim; not checked against eBay.)

### 1.8 Customer and launch status
- Pre-launch / private beta. "Now opening to founding yards." source: screenshot, home
- Beta opens in October 2026; "The product opens to founding yards in October 2026." source: https://yardterminal.com/limits, /ara-2026
- Private beta opens "in waves"; the first 200 yards get the founding rate; founding yards agree to a phone call to say what the company got wrong about their yard; no credit card; waitlist members get one email when the beta opens. source: https://yardterminal.com/waitlist
- "No published metrics": "There is no customer count, testimonial, or time-saved figure yet." and "Unproven at scale: ... has not run for a year with a large yard." source: https://yardterminal.com/limits
- Blog post states: "None of this has a published customer count." source: https://yardterminal.com/blog/shopify-ebay-sync-for-salvage-yards
- Pricing page exists (`/pricing`, title "Salvage yard software pricing - YardTerminal"; Free, Yard, Pro plans; plans differ by listing volume, users, yards). Primary CTA is "Join waitlist". No prices recorded here. Pricing is stated as "not an offer and may change before launch" (/limits).
- Not attending ARA 2026 (Atlanta, 14-17 Oct 2026): "There is no stand and nobody from us on the floor." Offers a video demo instead. source: https://yardterminal.com/ara-2026
- Demo: 20-minute video call via Calendly (https://calendly.com/farazahmad1/30min). source: /contact, home link list

### 1.9 Real numbers stated on the site (exact wording where available)
| Number | Wording / context | Source |
|---|---|---|
| 200 | "first 200 yards" get founding rate; 200 places in founding cohort | /waitlist, /pricing |
| 90 days | ended-listing records and history kept; also "last 90 days" sales as pricing basis in example | /product, /security |
| 17 characters | VIN length | /product |
| 3,000 | up to about 3,000 fitment combinations per part on eBay Motors | /tools/vin-decoder |
| 20 minutes | demo length; also "about twenty minutes of retyping per listing, per channel" | /contact, home |
| about a week | between joining and first listing live (eBay developer app approval) | /faq |
| two in a hundred | orders cancelled that can make eBay stop showing listings | /product |
| about twelve months | "Below Standard" status after cancellations | home |
| 2019 | Indepth Solution operating since | JSON-LD in home page source, /faq, /ara-2026 |
| 42 | "42 parts inherit this fitment" | screenshot, /product ("42 teardown parts inheriting one donor's fitment") - DEMO value |
| 6 live | per channel in hero graphic | screenshot, DEMO value |
No customer, revenue, uptime or time-saved metrics are published.

### 1.10 Tech / stack
- Disclosed by page source: Next.js app (`/_next/static/...`, `X-Nextjs-Prerender` header), hosted on Vercel (`Server: Vercel`, `X-Vercel-Id` header). source: HTTP response headers and HTML of https://www.yardterminal.com
- Image assets on ImageKit (`ik.imagekit.io`). source: page source
- Demo booking via Calendly. source: page source / links
- Per /security: "The website is a separate application on a separate deployment" from the product; it has no access to the product database or API and collects only waitlist emails. The product app's hosting, database, encryption and AI provider are NOT named. source: https://yardterminal.com/security
- AI: "The agent" reads photos and the decoded VIN and drafts listings; AI included in paid plans with fair-use limit. Model/provider not disclosed. source: /product, /faq
- Do NOT state a database, AI model or cloud provider for the product itself: not public.
- Security posture stated: no SOC 2, ISO 27001 or penetration test report; no bug bounty; reports to hello@yardterminal.com. source: /security

### 1.11 Founder, team, Faraz Ahmad
- Faraz Ahmad, Founder ("Founder, YardTerminal"). source: home page source (founder quote section), /about
- JSON-LD: Organization YardTerminal, legalName "Indepth Solution", founder Person "Faraz Ahmad" jobTitle "Founder", parentOrganization Indepth Solution (foundingDate 2019). source: https://www.yardterminal.com page source
- "Yard Terminal is a product of Indepth Solution." source: /about, /product
- FAQ: Indepth Solution is "operating since 2019 and run by Faraz Ahmad. It grew out of years of eBay Motors listing work for clients." source: https://yardterminal.com/faq (fetch summary wording)
- /ara-2026: Indepth Solution "has operated since 2019 and does eBay Motors listing work for clients."
- No other team members named on yardterminal.com. source: /about
- Contact: hello@yardterminal.com ("a person reads it, usually the same day"); LinkedIn https://www.linkedin.com/company/yardterminal; Facebook page https://www.facebook.com/people/Yard-Terminal/61595015110240/. No postal address. source: /contact, JSON-LD

### 1.12 Dates (blog and others)
Blog (4 pages of posts; page 1 read). No author shown on posts.
- 2026-10-08: "eBay and Shopify from one record" (/blog/shopify-ebay-sync-for-salvage-yards)
- 2026-10-08: "Shopify to eBay sync apps for used auto parts" (/blog/shopify-ebay-sync-apps-for-used-auto-parts)
- 2026-10-08: "GridX Connect vs YardTerminal" (/blog/gridx-connect-vs-yardterminal)
- 2026-10-08: "reParta vs YardTerminal" (/blog/reparta-vs-yardterminal)
- 2026-09-26: "Dismantly vs YardTerminal" (/blog/dismantly-vs-yardterminal)
- 2026-09-26: "What a salvage yard can still sell after eBay's airbag ban" (/blog/ebay-airbag-ban-salvage-yards); says eBay's airbag ban took effect 2026-09-24 (site claim, not verified against eBay)
- Copyright: 2026. Beta opens October 2026. ARA 2026: 14-17 Oct 2026.
- No exact public "launch date" other than "October 2026".
source for blog: https://yardterminal.com/blog

### 1.13 Screenshot (C:\Users\OMEN\AppData\Local\Temp\claude\d--work-indepth-faraz-portfolio\69173244-cafc-4e1e-a22d-ada2f721e6fd\images\5.png)
Visible in the screenshot (source: screenshot):
- Header: YardTerminal logo (blue "Y" mark, "Yard" dark + "Terminal" blue); nav Product, Pricing, About, Blog, Free VIN decoder, Contact; right side "Join waitlist" and a dark "Book a demo" button with arrow.
- Left: pill "Now opening to founding yards"; headline "List once. Sell everywhere. Never oversell."; subline "One record per part, from the teardown to the shipping label."; buttons "Book a demo" (dark) and "Join waitlist" (outline).
- Right (hero graphic): VIN field `JM1FE173060213458` with a blue verified check, chips "2006", "Mazda RX-8", "Coupe", "1.3L 13B rotary", "4 doors"; pill "42 parts inherit this fitment".
- Six part cards, each with a line illustration, a verified check, "2006 Mazda RX-8 / 1.3L 13B rotary" and a green "Live" badge plus a price tag: Front door, left; Headlight, left; Door mirror, left; Wheel & tire, 18"; 13B rotary engine; Tail lamp, left. (Price values on cards are visible but deliberately not recorded here.)
- Below: a connector line fanning out from the cards to two channel tiles: eBay with "6 live" and Shopify with "6 live".

Demo-UI values, NOT real customer metrics (flag):
- The VIN, the 2006 Mazda RX-8 vehicle, and all six part cards are an illustrative example.
- "42 parts inherit this fitment": demo value (the product page describes it as an example of teardown parts inheriting one donor's fitment).
- "6 live" on eBay and on Shopify: demo graphic; it equals the six cards shown, not a count of real listings.
- All price tags on the cards: demo.
- The product has no published customer count (/limits), so none of these represent real usage.
- Observation: the screenshot shows eBay and Shopify only (no Facebook tile in the hero graphic); the home page lower down lists Facebook Marketplace as "Coming soon".

---

## 2. Other products

### 2.1 SolidMake (text-to-CAD, STEP export)
NO PUBLIC INFORMATION FOUND.
- Searches: "SolidMake text-to-CAD STEP export"; "SolidMake AI CAD". No site, product page or repo for "SolidMake" returned. Results were unrelated tools (e.g. earthtojake/text-to-cad on GitHub, Zoo.dev Text-to-CAD, gNucleus), none named SolidMake. Not mentioned on yardterminal.com/about or indepthsolution.com.
- https://github.com/indepthsolution returned HTTP 404.
- Do not attribute any of those other tools to the owner.

### 2.2 AI SEO Automator
NO PUBLIC INFORMATION FOUND.
- Searches: `"AI SEO Automator" Faraz Ahmad`; `"AI SEO Automator" tool`. No product with this exact name found. Unrelated tools (SEOBot AI, SEO.ai, etc.) appeared. Not on indepthsolution.com home or /team pages (which list "SEO" as an agency service only, at https://www.indepthsolution.com/services/seo-services).
- A "Faraz Ahmad" Upwork SEO freelancer profile appeared in results; identity match to the owner is UNVERIFIED. Do not use.

### 2.3 Lead Drift
NO PUBLIC INFORMATION FOUND.
- Searches: `"Lead Drift" "Indepth Solution"`; `leaddrift Indepth Solution lead generation growth engine`; `"Lead Drift" growth engine GoHighLevel agency Lahore`. Nothing for the owner's Lead Drift. Results were about Drift (Salesloft chat product), unrelated.
- Not listed under "Products" on https://www.indepthsolution.com ("None listed on the page" per fetch) or on /team.

### 2.4 Indepth Solution (company; the one entity with public facts)
- Self-description: "an AI automation and GoHighLevel agency", also "independent studio". Location: Lahore, Pakistan. Email contact@indepthsolution.com. Mon-Fri 09:00-18:00 PKT. source: https://www.indepthsolution.com
- `https://www.indepthsolution.net/` (the URL in YardTerminal's JSON-LD) 308-redirects to `https://www.indepthsolution.com/`.
- Services listed: AI & Automation; Workflow Automation (n8n); GoHighLevel; Make.com Solutions; Web Development; Shopify & E-commerce; Mobile Apps; Custom Software; SEO; Digital Marketing; eBay Motors Listings (`/services/ebay-motors-listings`). source: https://www.indepthsolution.com
- Credentials listed: Shopify Partner, GHL Certified, Meta Partner, Google Partner. source: same
- Team page: Faraz Ahmad, Founder & CEO; Maliaka Ghafar, Admin; Tuseef Ahmad, Associate Software Engineer; Zubair Ali Khan, Senior Full Stack Developer ("4 humans on active duty"). source: https://www.indepthsolution.com/team
- Site claims (its own, UNVERIFIED externally): "500+ businesses served" (2019-2026), "12,400 hours automated per month", "98% client retention". The site marks sample dashboards as "Reference run · sample data". Several FAQ answers on the page are blank. Case-study client names (PulseCRM, Northwind, Fleetly, MediBook, ScaleUp Digital) and testimonial names (e.g. Emily Foster, David Park) are UNVERIFIED as real clients; do not repeat without owner confirmation.
- Social: https://www.linkedin.com/company/indepthsolution, https://github.com/indepthsolution (404 on fetch), https://www.instagram.com/indepthsolution, demo site https://demo.indepthsolution.net/
- Lead Drift as "growth engine" of Indepth Solution: NOT found anywhere public.
- Indepth Solution site does not link YardTerminal in the home-page product list; the connection is stated only on yardterminal.com.

---

## Discrepancies to be aware of
- Home page still shows Facebook Marketplace as "Coming soon", /limits says it is not supported, and the reParta comparison post says YardTerminal lists only on eBay Motors and Shopify. Safe wording: eBay Motors and Shopify (plus counter sales); Facebook Marketplace "coming soon" at most.
- Counter POS is a sales point inside the product, not an external marketplace.
- The tool-derived "Scale" tier appears only in the pricing comparison table with no details; ignore.
- Founder title: "Founder" at YardTerminal; "Founder & CEO" at Indepth Solution.

---

## Safe to state publicly (stated on the owner's own sites)
- YardTerminal is auto-salvage inventory and listing software for auto recyclers; one record per part, listed on eBay Motors and a Shopify storefront, listing ended elsewhere when it sells. (yardterminal.com meta/product)
- Tagline "List once. Sell everywhere. Never oversell." (home)
- A VIN is decoded once and parts inherit year, make, model, engine from the donor vehicle. (/product)
- An AI agent drafts listings; a person must approve every listing before it publishes; there is no auto-publish mode. (/product, /limits)
- Used parts have quantity one; a sale on one channel ends the others; failures are retried until confirmed; append-only audit trail. (/product, /security)
- Per-yard tenant isolation enforced at the database layer. (/security, /faq)
- Fitment is not licensed Hollander data; built from donor VIN, eBay's catalog, casting numbers, user confirmation. (/limits)
- Free VIN decoder (NHTSA vPIC data, no signup). (/tools/vin-decoder)
- Pre-launch: opening to the first 200 "founding yards" in October 2026; demos by booking; waitlist open. (/waitlist, /limits)
- Runs in the browser; no mobile app. (/limits)
- Works alongside yard-management systems; it is not one. (/limits)
- Faraz Ahmad is the founder of YardTerminal and Founder & CEO of Indepth Solution; YardTerminal is a product of Indepth Solution, operating since 2019, with eBay Motors listing work for clients. (/about, /faq, JSON-LD, indepthsolution.com/team)
- Indepth Solution is a Lahore-based AI automation and GoHighLevel agency offering eBay Motors listings among its services. (indepthsolution.com)
- Marketing site is built with Next.js on Vercel (visible from page source/headers).
- A pricing page exists with a free tier (no prices to be quoted per owner's rule).

## Do not state
- Any customer count, number of yards live, revenue, uptime, time saved or listings processed. None exist publicly; the site says so.
- "42 parts" or "6 live" as real metrics (demo UI values).
- Amazon, Google Shopping, Facebook Marketplace or Car-Part.com as supported channels.
- Product database, hosting, AI model or provider for the YardTerminal app (not disclosed).
- That it is "live" or "launched" or "GA": it is opening to founding yards in October 2026 (site says private beta, no charges during beta).
- SOC 2, ISO, pen-test or any compliance certification (site says none).
- SolidMake, AI SEO Automator, Lead Drift: no public information found; do not describe features, status or ownership.
- That Lead Drift is Indepth Solution's "growth engine" (only the owner's claim to me, not publicly supported).
- Indepth Solution's "500+ businesses", "12,400 hours", "98% retention", named case-study clients and testimonials, unless the owner confirms they are real.
- eBay policy specifics (airbag ban, 3,000 fitment combos, Below Standard duration, two-in-a-hundred threshold) as independently verified facts; attribute them to YardTerminal's site if used.
- Any price.
