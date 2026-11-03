# all.farazahmad.dev: owner to-do

The hub page that links every niche site. Code: `src/pages/all/`, `src/layouts/all/`,
`src/components/all/`, `src/data/all/sites.ts`, `src/lib/all/`, `src/styles/all/`.

## Before launch

1. **Build and deploy**: `npm run build` (regenerates `vercel.json` with the `all` host rewrite), then deploy.
2. **Vercel domain**: Project -> Settings -> Domains -> add `all.farazahmad.dev`.
3. **DNS (Spaceship)**: add a **CNAME** record, host `all`, value = the target Vercel shows for that
   domain (generic: `cname.vercel-dns.com`). Wait until Vercel shows the domain as valid (SSL is automatic).
4. **Check production links**: on https://all.farazahmad.dev/ every card should open
   `https://<slug>.farazahmad.dev/` and preview `https://<slug>.farazahmad.dev/og/home.png`.
   A niche whose subdomain is not live yet will show a broken preview and a dead link. Leave it
   disabled in `src/niches.ts` until its domain works.
5. **Noindex**: `all` ships with `noindex: true`. When you want the hub findable, set
   `noindex: false` for `all` in `src/niches.ts` and rebuild.

## Confirm

- **Copy**: labels and one-liners in `src/data/all/sites.ts` are condensed from each niche's own
  hero and HOME_SEO. The headlines are hard-coded, so if a niche changes its hero headline, update it here too.
- **Main-site line**: "My main portfolio. The specialised sites above each go deeper on one kind of work." Edit if you want different wording.
- **Coming soon**: WordPress and Webflow show as "Coming soon" because they are disabled in the registry.
  Enabling one moves it into the live grid automatically, but give it a `headline`/`description` in
  `sites.ts`. The grid assumes the live count fills complete rows (8 = 4×2); with 9 it switches to 3 columns.
- **OG image for `all`**: none yet. Shares of the hub show a plain summary card.
