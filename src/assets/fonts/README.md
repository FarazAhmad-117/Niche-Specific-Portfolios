# Fonts (ai niche)

Self-hosted; no runtime font requests. The Layout preloads only Clash Display (the h1 / LCP).
Fallback metric overrides live in `src/styles/ai/tokens.css` (spec docs/design/ai.md §3.3).

## Web fonts (woff2, shipped to the browser)

| File | Family / weights | Source | License |
|---|---|---|---|
| `ClashDisplay-Semibold.woff2` | Clash Display 600 | Fontshare CDN, URL from `https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap` (downloaded 2026-11-03, 15,284 bytes) | ITF Free Font License (Indian Type Foundry). Free for commercial use; credit ITF as the owner of the font. See open question in spec §10.2 about committing it to a public repo. |
| `Geist-Variable-latin.woff2` | Geist, variable wght 100–900 (latin subset) | Copied from npm `@fontsource-variable/geist@5.3.0`, `files/geist-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2024 The Geist Project Authors) |
| `JetBrainsMono-Variable-latin.woff2` | JetBrains Mono, variable wght 100–800 (latin subset) | Copied from npm `@fontsource-variable/jetbrains-mono@5.3.0`, `files/jetbrains-mono-latin-wght-normal.woff2` | SIL Open Font License 1.1 (© 2020 The JetBrains Mono Project Authors) |

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

Glyph notes: the latin subsets have no `→ ↗ ✕ ●`. Arrows fall back to the system font,
status dots are drawn with CSS/SVG, and OG images should draw dots as shapes, not glyphs.
