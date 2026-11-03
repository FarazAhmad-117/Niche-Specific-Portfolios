# Fonts (ai niche)

Self-hosted; no runtime font requests. The Layout preloads only Clash Display (the h1 / LCP).
Fallback metric overrides live in `src/styles/ai/tokens.css` (spec docs/design/ai.md §3.3).

## Web fonts (woff2, shipped to the browser)

| File | Family / weights | Source | License |
|---|---|---|---|
| `ClashDisplay-Semibold.woff2` | Clash Display 600 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap` (downloaded 2026-11-03, 15,284 bytes) | ITF Free Font License (Indian Type Foundry). Free for commercial use; credit ITF as the owner of the font. See open question in spec §10.2 about committing it to a public repo. |
| `Geist-Variable-latin.woff2` | Geist, variable wght 100–900 (latin subset) | Copied from npm `@fontsource-variable/geist@5.3.0`, `files/geist-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2024 The Geist Project Authors) |
| `JetBrainsMono-Variable-latin.woff2` | JetBrains Mono, variable wght 100–800 (latin subset) | Copied from npm `@fontsource-variable/jetbrains-mono@5.3.0`, `files/jetbrains-mono-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2020 The JetBrains Mono Project Authors) |

### funnels niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `CabinetGrotesk-Extrabold.woff2` | Cabinet Grotesk 800 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800&display=swap` (downloaded 2026-11-03, 20,204 bytes) | ITF Free Font License |
| `Satoshi-Variable.woff2` | Satoshi, variable wght 300–900 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap` (downloaded 2026-11-03, 42,588 bytes) | ITF Free Font License |

The funnels Layout preloads only Cabinet Grotesk (the h1 / LCP).

### seo niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `SchibstedGrotesk-Variable-latin.woff2` | Schibsted Grotesk, variable wght 400–900 (latin subset) | Copied from npm `@fontsource-variable/schibsted-grotesk@5.3.0`, `files/schibsted-grotesk-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2023 The Schibsted-Grotesk Project Authors) |
| `InstrumentSans-Variable-latin.woff2` | Instrument Sans, variable wght 400–700 (latin subset, normal width) | Copied from npm `@fontsource-variable/instrument-sans@5.3.0`, `files/instrument-sans-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2022 The Instrument Sans Project Authors) |

The seo niche also uses `JetBrainsMono-Variable-latin.woff2` and `ClashDisplay-Semibold.woff2`
(footer signature) from above. The seo Layout preloads only Schibsted Grotesk (the h1 / LCP). Bricolage Grotesque and Inter,
used in the first seo build, were removed (nothing else referenced them).

### cloud niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `Archivo-Variable-wdth-latin.woff2` | Archivo, variable wght 100–900 AND wdth 62–125% (latin subset) | Copied from npm `@fontsource-variable/archivo@5.3.0`, `files/archivo-latin-wdth-normal.woff2` | SIL Open Font License 1.1 (© 2020 The Archivo Project Authors) |
| `Manrope-Variable-latin.woff2` | Manrope, variable wght 200–800 (latin subset) | Copied from npm `@fontsource-variable/manrope@5.3.0`, `files/manrope-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2019 The Manrope Project Authors) |
| `MartianMono-Variable-latin.woff2` | Martian Mono, variable wght 100–800 (latin subset, normal width) | Copied from npm `@fontsource-variable/martian-mono@5.3.0`, `files/martian-mono-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2020 The Martian Mono Project Authors) |

The cloud niche also uses `ClashDisplay-Semibold.woff2` (footer signature). The cloud Layout
preloads only Archivo (the h1 / LCP); headings run it semi-expanded (`font-stretch` 104–112%).

### apps niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `MonaSans-Variable-latin.woff2` | Mona Sans, variable wght 200–900 AND wdth 75–125% (latin subset) | Copied from npm `@fontsource-variable/mona-sans@5.3.0`, `files/mona-sans-latin-wdth-normal.woff2` | SIL Open Font License 1.1 (© 2022 The Mona Sans Project Authors, Reserved Font Name "Mona") |
| `IBMPlexSans-Variable-latin.woff2` | IBM Plex Sans, variable wght 100–700 (latin subset, normal width) | Copied from npm `@fontsource-variable/ibm-plex-sans@5.3.0`, `files/ibm-plex-sans-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2019 IBM Corp.) |
| `IBMPlexMono-Regular-latin.woff2` | IBM Plex Mono 400 (latin subset) | Copied from npm `@fontsource/ibm-plex-mono@5.3.0`, `files/ibm-plex-mono-latin-400-normal.woff2` | SIL Open Font License 1.1 (© 2017 IBM Corp.) |
| `IBMPlexMono-Medium-latin.woff2` | IBM Plex Mono 500 (latin subset) | Copied from npm `@fontsource/ibm-plex-mono@5.3.0`, `files/ibm-plex-mono-latin-500-normal.woff2` | SIL Open Font License 1.1 (© 2017 IBM Corp.) |

The apps niche also uses `ClashDisplay-Semibold.woff2` (footer signature). The apps Layout
preloads only Mona Sans (the h1 / LCP); the h1 runs at `font-stretch` 112%, headings 104–110%,
and title-block labels at 125%. Fallback metrics are in `src/styles/apps/tokens.css`.

### ghl niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `SairaExpanded-Variable-latin.woff2` | Saira, fixed at wdth 125% (Expanded), variable wght 600–800 (latin subset) | Instanced with fontTools (`varLib.instancer`, wdth=125, wght 600:800) from npm `@fontsource-variable/saira@5.3.0`, `files/saira-latin-wdth-normal.woff2` (98,912 → 24,072 bytes) | SIL Open Font License 1.1 (© 2017 The Saira Project Authors) |
| `RedHatText-Variable-latin.woff2` | Red Hat Text, variable wght 300–700 (latin subset) | Copied from npm `@fontsource-variable/red-hat-text@5.3.0`, `files/red-hat-text-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2021 Red Hat, Inc.) |

The ghl niche also uses `JetBrainsMono-Variable-latin.woff2` (labels) and
`ClashDisplay-Semibold.woff2` (footer signature). The ghl Layout preloads only Saira Expanded
(the h1 / LCP). Fallback metrics are in `src/styles/ghl/tokens.css`.

### ads niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `ClashGrotesk-Variable.woff2` | Clash Grotesk, variable wght 200–700 (used at 500–600) | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=clash-grotesk@1&display=swap` (downloaded 2026-11-03, 47,264 bytes) | ITF Free Font License (Indian Type Foundry) |
| `InterTight-Variable-latin.woff2` | Inter Tight, variable wght 100–900 (latin subset) | Copied from npm `@fontsource-variable/inter-tight@5.3.0`, `files/inter-tight-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2022 The Inter Tight Project Authors) |
| `og/ClashGrotesk-Semibold.ttf` | Clash Grotesk 600 (build-only, OG images) | Fontshare CDN, the `.ttf` URL from `https://api.fontshare.com/v2/css?f[]=clash-grotesk@500,600&display=swap` | ITF Free Font License |
| `og/InterTight-Medium.woff` | Inter Tight 500 (build-only, OG images) | npm `@fontsource/inter-tight@5.3.0`, `files/inter-tight-latin-500-normal.woff` | SIL OFL 1.1 |

The ads niche also uses `JetBrainsMono-Variable-latin.woff2` (numbers, labels, rule syntax) and
`ClashDisplay-Semibold.woff2` (footer signature). Clash Grotesk is a different family from Clash
Display. The ads Layout preloads only Clash Grotesk (the h1 / LCP). Fallback metrics (measured
with fontTools against Arial) are in `src/styles/ads/tokens.css`.

### shopify niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `Gambetta-Semibold.woff2` | Gambetta 600 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=gambetta@500,600,700&display=swap` (downloaded 2026-11-03, 20,044 bytes) | ITF Free Font License (Indian Type Foundry) |
| `GeneralSans-Regular.woff2` | General Sans 400 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap` (downloaded 2026-11-03, 23,084 bytes) | ITF Free Font License |
| `GeneralSans-Medium.woff2` | General Sans 500 | Same CSS as above (22,904 bytes) | ITF Free Font License |
| `GeneralSans-Semibold.woff2` | General Sans 600 | Same CSS as above (23,092 bytes) | ITF Free Font License |
| `og/Gambetta-Semibold.ttf` | Gambetta 600 (build-only, OG images) | Fontshare CDN, the `.ttf` URL from the Gambetta CSS above | ITF Free Font License |
| `og/GeneralSans-Medium.woff` | General Sans 500 (build-only, OG images) | Fontshare CDN, the `.woff` URL from the General Sans CSS above | ITF Free Font License |

The shopify niche also uses `JetBrainsMono-Variable-latin.woff2` (labels, receipts) and
`ClashDisplay-Semibold.woff2` (footer signature), plus `og/ClashDisplay-Semibold.ttf` and
`og/JetBrainsMono-Regular.woff` for OG images. The shopify Layout preloads only Gambetta (the
h1 / LCP). Fallback metrics (Georgia for Gambetta, Arial for General Sans, measured with
fontTools) are in `src/styles/shopify/tokens.css`. Fontshare serves these as latin +
latin-ext static cuts (no separate latin-only subset).

### wp niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `Boska-Regular.woff2` | Boska 400 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=boska@400,500,700,400i,500i&display=swap` (downloaded 2026-11-04, 30,372 bytes) | ITF Free Font License (Indian Type Foundry) |
| `Boska-Medium.woff2` | Boska 500 (h1 / LCP, preloaded) | Same CSS (29,916 bytes) | ITF Free Font License |
| `Boska-Italic.woff2` | Boska 400 italic | Same CSS (33,396 bytes) | ITF Free Font License |
| `Boska-MediumItalic.woff2` | Boska 500 italic (the accent word) | Same CSS (32,752 bytes) | ITF Free Font License |
| `HankenGrotesk-Variable-latin.woff2` | Hanken Grotesk, variable wght 100–900 (latin subset) | Copied from npm `@fontsource-variable/hanken-grotesk@5.3.0`, `files/hanken-grotesk-latin-wght-normal.woff2` | SIL OFL 1.1 (© 2021 The Hanken Grotesk Project Authors) |
| `og/Boska-Medium.woff` | Boska 500 (build-only, OG images) | Fontshare CDN, the `.woff` URL from the Boska CSS above | ITF Free Font License |
| `og/Boska-MediumItalic.woff` | Boska 500 italic (build-only, OG images) | Same | ITF Free Font License |
| `og/HankenGrotesk-Medium.woff` | Hanken Grotesk 500 (build-only, OG images) | npm `@fontsource/hanken-grotesk@5.3.0`, `files/hanken-grotesk-latin-500-normal.woff` | SIL OFL 1.1 |

The wp niche also uses `JetBrainsMono-Variable-latin.woff2` (labels) and
`ClashDisplay-Semibold.woff2` (footer signature), plus `og/ClashDisplay-Semibold.ttf` and
`og/JetBrainsMono-Regular.woff` for OG images. The wp Layout preloads only Boska 500 (the h1 /
LCP). Fallback metrics (Times New Roman for Boska, Arial for Hanken Grotesk, measured with
fontTools) are in `src/styles/wp/tokens.css`. Fontshare serves Boska as static latin +
latin-ext cuts.

### webflow niche

| File | Family / weights | Source | License |
|---|---|---|---|
| `Unbounded-Variable-latin.woff2` | Unbounded, variable wght 200–900 (latin subset) | Copied from npm `@fontsource-variable/unbounded@5.3.0`, `files/unbounded-latin-wght-normal.woff2` (50,904 bytes) | SIL Open Font License 1.1 (© The Unbounded Project Authors) |
| `Switzer-Variable.woff2` | Switzer, variable wght 100–900 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=switzer@1&display=swap` (downloaded 2026-11-03, 43,220 bytes) | ITF Free Font License (Indian Type Foundry) |
| `og/Unbounded-Bold.woff` | Unbounded 700 (build-only, OG images) | npm `@fontsource/unbounded@5.3.0`, `files/unbounded-latin-700-normal.woff` | SIL OFL 1.1 |
| `og/Switzer-Medium.woff` | Switzer 500 (build-only, OG images) | Fontshare CDN, the `.woff` URL from `https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap` | ITF Free Font License |

The webflow niche also uses `JetBrainsMono-Variable-latin.woff2` (class names, specs) and
`ClashDisplay-Semibold.woff2` (footer signature), plus `og/ClashDisplay-Semibold.ttf` and
`og/JetBrainsMono-Regular.woff` for OG images. The webflow Layout preloads only Unbounded (the
h1 / LCP). Fallback metrics (Arial Black for Unbounded at 113%, Arial for Switzer at 101.6%,
measured with fontTools) are in `src/styles/webflow/tokens.css`.

The Fontsource files were copied out of the packages (not added as dependencies) so the
build does not depend on them. To update: `npm pack <package>` in a temp folder and copy
the same file names.

## Build-only fonts for OG images (`og/`, satori cannot read woff2)

Never imported by client code; read from disk by the OG endpoint at build time.

| File | Weight | Source | License |
|---|---|---|---|
| `og/ClashDisplay-Semibold.ttf` | 600 | Fontshare CDN (same CSS as above, the `.ttf` URL) | ITF Free Font License |
| `og/Geist-Regular.woff` | 400 | npm `@fontsource/geist-sans@5.3.0`, `files/geist-sans-latin-400-normal.woff` | SIL OFL 1.1 |
| `og/Geist-SemiBold.woff` | 600 | npm `@fontsource/geist-sans@5.3.0`, `files/geist-sans-latin-600-normal.woff` | SIL OFL 1.1 |
| `og/JetBrainsMono-Regular.woff` | 400 | npm `@fontsource/jetbrains-mono@5.3.0`, `files/jetbrains-mono-latin-400-normal.woff` | SIL OFL 1.1 |
| `og/CabinetGrotesk-Extrabold.ttf` | 800 | Fontshare CDN (funnels CSS above, the `.ttf` URL) | ITF Free Font License |
| `og/Satoshi-Medium.woff` | 500 | Fontshare CDN (`satoshi@500`, the `.woff` URL) | ITF Free Font License |
| `og/SchibstedGrotesk-ExtraBold.woff` | 800 | npm `@fontsource/schibsted-grotesk@5.3.0`, `files/schibsted-grotesk-latin-800-normal.woff` | SIL OFL 1.1 |
| `og/InstrumentSans-Medium.woff` | 500 | npm `@fontsource/instrument-sans@5.3.0`, `files/instrument-sans-latin-500-normal.woff` | SIL OFL 1.1 |
| `og/Archivo-ExtraBold.woff` | 800 (normal width) | npm `@fontsource/archivo@5.3.0`, `files/archivo-latin-800-normal.woff` | SIL OFL 1.1 |
| `og/Manrope-Medium.woff` | 500 | npm `@fontsource/manrope@5.3.0`, `files/manrope-latin-500-normal.woff` | SIL OFL 1.1 |
| `og/MartianMono-Regular.woff` | 400 | npm `@fontsource/martian-mono@5.3.0`, `files/martian-mono-latin-400-normal.woff` | SIL OFL 1.1 |
| `og/MonaSans-ExtraBold.woff` | 800 (normal width; satori has no variable axes) | npm `@fontsource/mona-sans@5.3.0`, `files/mona-sans-latin-800-normal.woff` | SIL OFL 1.1 |
| `og/IBMPlexSans-Medium.woff` | 500 | npm `@fontsource/ibm-plex-sans@5.3.0`, `files/ibm-plex-sans-latin-500-normal.woff` | SIL OFL 1.1 |
| `og/IBMPlexMono-Regular.woff` | 400 | npm `@fontsource/ibm-plex-mono@5.3.0`, `files/ibm-plex-mono-latin-400-normal.woff` | SIL OFL 1.1 |
| `og/SairaExpanded-ExtraBold.ttf` | 800 at wdth 125% (static instance, so satori gets the expanded width) | fontTools static instance (wdth=125, wght=800) of `@fontsource-variable/saira@5.3.0` `files/saira-latin-wdth-normal.woff2` | SIL OFL 1.1 |
| `og/RedHatText-Medium.woff` | 500 | npm `@fontsource/red-hat-text@5.3.0`, `files/red-hat-text-latin-500-normal.woff` | SIL OFL 1.1 |

Glyph notes: the latin subsets have no `→ ↗ ✕ ●`. Arrows fall back to the system font,
status dots are drawn with CSS/SVG, and OG images should draw dots as shapes, not glyphs.
