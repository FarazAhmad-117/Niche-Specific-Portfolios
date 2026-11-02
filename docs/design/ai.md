# ai.farazahmad.dev: design spec ("Signal flow")

Build spec for the `ai` niche. Priority order: custom instructions > `docs/brief/DECISIONS.md` > `docs/brief/ai.md`. This file turns those into a buildable design. Where it differs from the brief, a decision caused it (no prices, no testimonials, light + dark).

**Hard content rules, repeated because they matter most**
- No prices anywhere. Price lines read **"Fixed scope, agreed before work starts"** and **"You'll leave the call with a clear plan and a cost range"**.
- No testimonials section, and no testimonial slot in the case template.
- The only real case fact: **"Lead Drift is Indepth Solution's own growth engine, running in production."** Every number, baseline, client type, per-case stack and result is a visible TODO (see §4.8). Never invent one.
- Stack shown: **n8n, Make, Zapier, GoHighLevel, Claude, OpenAI, Python, MongoDB, Next.js** and nothing else.
- Booking: `https://calendly.com/farazahmad1/30min`. Fallback email: `farazahmad31048@gmail.com`.

---

## 1. Art direction

### Concept: "The spec sheet and the console"
The page is two materials, and each one has a job.

- **The spec sheet** is where I describe things: the problem, offers, process, FAQ. It is calm, typographic and set on a strict grid. In light theme it is bone paper with ink. In dark theme it is ink with bone.
- **The console** is where things *run*: the hero graph, the live workflow, the "Break it on purpose" runner, the final CTA panel. A console is **always ink in both themes**, like an instrument panel set into the page. Lime lives only inside the console, plus the one primary action.

So the light theme is not an inverted dark theme. It is a printed spec with dark instruments set into it. The dark theme is the same instruments flush with a dark page, separated by a 1px stronger hairline and a one-step lighter surface. This also settles the brief's contrast rule mechanically: lime is only ever on ink, so it is never body text on bone.

### Grid behaviour
- **12 columns on desktop, 8 on tablet, 4 on mobile** (tokens in §3.6). Every block snaps to column edges. There are no centred "floating" cards.
- **Section rail (≥1024px):** every section from 02 to 12 opens with a full-bleed 1px hairline. Columns 1–2 hold a mono index and label (`04 / LIVE WORKFLOW`). Content starts at column 3. Where the hairline crosses the column-3 edge there is a 5×5px square "junction" in `--line-strong`. When the section is reached, the junction of the live workflow, and only that one, fills lime on ink. Below 1024px the index sits above the h2 as a mono eyebrow.
- **Visible hairline grid only in the Hero and the Production checklist** (brief §6). These are 12 column lines at `--line`, with "+" crosshairs (9px, 1px stroke, `--line-strong`) where the column lines meet the section's top and bottom rules, on every 3rd column. Elsewhere the grid is implied, not drawn.
- **At 1920px:** content caps at `--container-max` (1600px) and centres. Horizontal hairlines stay full-bleed, so the page feels wider than its text. Type stops growing at the clamp max. Nothing stretches to fill.

### How the signal colour is used
Lime `#D4FF3A` means exactly one thing: **live, running, or the one thing to do next.**

| Allowed | Not allowed |
|---|---|
| The node that is running right now, and packets on edges | Section backgrounds, big decorative fills |
| Status dots (`● running`, `● in production`) | Body text, headings, links on bone |
| The primary CTA fill on ink (dark theme, console panels) | Icons or illustrations "for colour" |
| The 8px square inside the light-theme primary button (on ink) | Hover tints on bone |
| The progress-rail fill in the live workflow | More than one lime *fill* per viewport (dots don't count) |

The light theme's text and border version of the accent is **olive `#4A5E00`** (`--accent-text`). It is used for focus rings, active nav underline, links on hover and the "done" ticks on bone. Lime coverage stays under 5% of any screen.

### Texture and line language
- **1px hairlines everywhere.** No shadows, no blur, no gradients, no grain. Depth comes from surface tone steps (bg → surface-1 → surface-2) and stronger lines.
- **Registration corners:** cards draw 8px L-shaped corner brackets (1px, `--line-strong`) instead of a full border, over a full `--line` hairline border. On hover or focus the brackets extend to 16px. This is the site's "precision" mark.
- **Mono everywhere a machine would speak:** indices, labels, log lines, stack marks, status, TODO chips. Sentence case for prose. UPPERCASE only for mono labels ≤ 3 words.
- **Numbers are typography, not graphics.** Big numbers are set in Clash Display with tabular alignment. No charts.

### Imagery
- **No stock, no 3D, no AI art, no illustrations of robots or brains.** The only images are (a) node and wire schematics drawn in inline SVG from real step data, and (b) the headshot.
- **Headshot:** natural colour, plain background, 4:5. The placeholder is an SVG at `src/assets/ai/headshot-placeholder.svg`: a surface-2 rectangle with a 1px dashed `--line-strong` inset and a mono `TODO: headshot` label. It is replaced 1:1 at the same aspect ratio, so there is no CLS.
- **Stack marks are text, not logos.** I set them in JetBrains Mono at their own casing (`n8n`, `GoHighLevel`). This needs no trademark artwork and adds no image weight.

### Scrolling top to bottom
1. **Hero:** a quiet spec sheet with a lit schematic beside the headline. The schematic draws itself in, and then single packets drift along its wires. The headline is static and instant.
2. **Proof strip and problem:** spec-sheet rhythm, with mono incident lines (`[warn]`, `[fail]`) that make "breaks quietly" literal.
3. **Live workflow:** the page turns into a console. It pins, and as you scroll each node lights and a log line types. It ends with a result line and the "Break it on purpose" controls. This is the climax.
4. **Case studies → offers → checklist:** back on paper. Cards with corner brackets. Checklist boxes tick on in sequence over a visible grid.
5. **Process → comparison → about → FAQ:** a calm, editorial, reading-paced stretch.
6. **Final CTA:** a second console. The face, the lime "Book a scoping call", and the form. Then the footer signature in Clash Display: "Faraz Ahmad", huge, set like a maker's mark.

It should feel like a well-built control room: nothing blinks unless it is running.

### What we deliberately don't do
- Gradient blobs, glassmorphism, frosted cards, glow, neon, purple, or "AI sparkle" icons.
- Stock icon grids (the checklist uses a mono code and a tick, not icons).
- Fake dashboards, fake live counters, or "uptime" numbers we can't back up.
- Logo walls of tools or "as seen in" strips.
- Testimonials, star ratings, prices, "from $X".
- Animated headline text, cursor followers, magnetic buttons, page preloaders.
- Horizontal carousels on mobile (everything stacks).

---

## 2. Three memorable ideas, and the pick

| # | Idea | What the visitor remembers | Cost |
|---|---|---|---|
| A | **"Break it on purpose"**: under the live workflow, a small runner sends a sample lead through the same steps. Three presets: *Good lead*, *Duplicate lead*, *Malformed lead*. The malformed one fails at `enrich`, retries twice with backoff, falls back, and lands in **human review** with an alert line. | "I watched his system catch an error." This is the brief's "survive production" made tangible, and it proves the checklist (retries, human override, alerts) instead of claiming it. | Pure DOM + CSS classes, about 4 KB gz, lazy-loaded with the section. No GSAP needed. |
| B | **Page as a pipeline**: one continuous 1px wire runs down the section rail, and a packet travels it as you scroll. Each section junction lights as reached. The final CTA is the "notify" node. | The page itself behaves like a workflow. | Small (one SVG path + scroll progress), but decorative. It repeats the live workflow's job and adds motion to every section. |
| C | **This page's own log**: a mono status line in the footer counts real events from this visit ("sections reached 7/12 · time on page 01:42"). | A wink: the site logs itself. | Tiny, but gimmicky, and it can read as surveillance to a privacy-minded ops buyer. |

**Pick: A, "Break it on purpose".** It is the only idea that **adds proof rather than decoration**. It answers the buyer's core fear ("will it break silently?") in the brief's own vocabulary, it ties the signature section to the production checklist, and it works on every device, including mobile and reduced motion. It costs about 4 KB of JS that loads only when the section approaches. B survives in a static, zero-JS form: the section rail junctions (§1). C is dropped.

Honesty guard for A: the runner header always reads `SIMULATED RUN · sample data`. While `WORKFLOW_STEPS` contains placeholder steps, a `SAMPLE STEPS` TODO chip shows as well (§5.4).

---

## 3. Design tokens

### 3.1 Colour primitives and semantic tokens (paste-ready)

```css
/* ---------- primitives (never used directly in components) ---------- */
:root {
  --ink-950: #111110;  /* brand ink */
  --ink-900: #1a1a19;
  --ink-850: #232321;
  --ink-800: #2c2c2a;  /* = bone 12% over ink, solid */
  --stone-600: #787670; /* dark-theme UI border (fixed from #706e67) */
  --stone-500: #8f8d85;
  --stone-300: #b8b6ad;
  --stone-light-500: #7a7870; /* light-theme UI border (fixed from #8a8880) */
  --stone-light-600: #64635c;
  --stone-light-700: #45443f;
  --bone-50: #faf9f6;
  --bone-100: #f2f1ec; /* brand bone */
  --bone-200: #e8e6de;
  --bone-300: #d7d6d2; /* = ink 12% over bone, solid */
  --lime-300: #e2ff73;
  --lime-400: #d4ff3a; /* signal */
  --lime-500: #c3ee2a;
  --olive-700: #4a5e00; /* lime-derived, for text/borders on bone */
  --red-light: #b42318;
  --red-dark: #ff8a7a;
  --green-light: #1b6b3a;
  --green-dark: #7ee2a0;
}

/* ---------- LIGHT (default when system is light or user chose light) ---------- */
:root {
  color-scheme: light;
  --bg: var(--bone-100);
  --surface-1: var(--bone-200);        /* sunk panels, table header, chips */
  --surface-2: var(--bone-50);         /* raised cards */
  --line: var(--bone-300);             /* decorative hairline, 1px */
  --line-strong: var(--stone-light-500); /* UI boundaries: inputs, toggles, corner brackets */
  --text: var(--ink-950);
  --text-2: var(--stone-light-700);    /* secondary copy */
  --text-3: var(--stone-light-600);    /* captions, mono labels */
  --accent: var(--lime-400);           /* FILLS ON INK ONLY */
  --accent-hover: var(--lime-300);
  --accent-active: var(--lime-500);
  --on-accent: var(--ink-950);
  --accent-text: var(--olive-700);     /* accent as text/border/ring on bone */
  --error: var(--red-light);
  --success: var(--green-light);
  --focus: var(--olive-700);
  --btn-primary-bg: var(--ink-950);
  --btn-primary-fg: var(--bone-100);
  --btn-primary-bg-hover: var(--ink-800);
  --todo-hatch: color-mix(in srgb, var(--ink-950) 6%, transparent);
}

/* ---------- DARK (system dark with no explicit choice, or explicit dark) ---------- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg: var(--ink-950);
    --surface-1: var(--ink-900);
    --surface-2: var(--ink-850);
    --line: var(--ink-800);
    --line-strong: var(--stone-600);
    --text: var(--bone-100);
    --text-2: var(--stone-300);
    --text-3: var(--stone-500);
    --accent: var(--lime-400);
    --accent-hover: var(--lime-300);
    --accent-active: var(--lime-500);
    --on-accent: var(--ink-950);
    --accent-text: var(--lime-400);   /* lime is allowed as text on ink */
    --error: var(--red-dark);
    --success: var(--green-dark);
    --focus: var(--lime-400);
    --btn-primary-bg: var(--lime-400);
    --btn-primary-fg: var(--ink-950);
    --btn-primary-bg-hover: var(--lime-300);
    --todo-hatch: color-mix(in srgb, var(--bone-100) 6%, transparent);
  }
}
:root[data-theme="dark"] { /* identical block to the one above */ }

/* ---------- CONSOLE: always ink, in both themes ---------- */
.theme-ink {
  color-scheme: dark;
  /* same values as the DARK block, plus: */
  --bg: var(--ink-950);
  --surface-1: var(--ink-900);
  --surface-2: var(--ink-850);
  background: var(--bg);
  color: var(--text);
}
/* In dark theme a console is set apart by surface + line, not by colour: */
:root[data-theme="dark"] .theme-ink,
:root:not([data-theme="light"]) .theme-ink /* inside the dark media query */ {
  --bg: var(--ink-900);
  border-block: 1px solid var(--line-strong);
}
```

Implementation note: write the dark values once as a Sass-free "token block" by putting the shared declarations on a selector list. For example, use `:root[data-theme="dark"], .theme-ink { … }`, then repeat it inside the media query as `:root:not([data-theme="light"]), :root:not([data-theme="light"]) .theme-ink { … }`.

### 3.2 Contrast: computed
These values come from the WCAG 2.x relative-luminance formula (sRGB linearisation), run as a Node one-off. Thresholds: normal text 4.5:1, large text (≥24px, or ≥18.66px bold) 3:1, UI components and graphics 3:1.

| Pair | Ratio | Normal | Large | UI |
|---|---|---|---|---|
| **Dark** text `#f2f1ec` / bg `#111110` | 16.71 | pass | pass | pass |
| text / surface-1 `#1a1a19` | 15.40 | pass | pass | pass |
| text / surface-2 `#232321` | 13.92 | pass | pass | pass |
| text-2 `#b8b6ad` / bg | 9.30 | pass | pass | pass |
| text-2 / surface-1 | 8.57 | pass | pass | pass |
| text-2 / surface-2 | 7.75 | pass | pass | pass |
| text-3 `#8f8d85` / bg | 5.68 | pass | pass | pass |
| text-3 / surface-1 | 5.24 | pass | pass | pass |
| text-3 / surface-2 | 4.74 | pass | pass | pass |
| lime `#d4ff3a` / bg (text, dots, ring) | 16.34 | pass | pass | pass |
| lime / surface-2 | 13.62 | pass | pass | pass |
| ink on lime (primary button) | 16.34 | pass | pass | pass |
| ink on lime-hover `#e2ff73` | 16.90 | pass | pass | pass |
| ink on lime-active `#c3ee2a` | 14.02 | pass | pass | pass |
| line-strong `#787670` / bg | 4.16 | n/a | n/a | pass |
| line-strong / surface-1 | 3.84 | n/a | n/a | pass |
| line-strong / surface-2 | 3.47 | n/a | n/a | pass |
| error `#ff8a7a` / bg | 8.25 | pass | pass | pass |
| error / surface-2 | 6.87 | pass | pass | pass |
| success `#7ee2a0` / bg | 11.94 | pass | pass | pass |
| success / surface-1 | 11.01 | pass | pass | pass |
| hairline `#2c2c2a` / bg | 1.35 | decorative only | | |
| **Light** text `#111110` / bg `#f2f1ec` | 16.71 | pass | pass | pass |
| text / surface-1 `#e8e6de` | 15.12 | pass | pass | pass |
| text / surface-2 `#faf9f6` | 17.95 | pass | pass | pass |
| text-2 `#45443f` / bg | 8.63 | pass | pass | pass |
| text-2 / surface-1 | 7.81 | pass | pass | pass |
| text-2 / surface-2 | 9.27 | pass | pass | pass |
| text-3 `#64635c` / bg | 5.33 | pass | pass | pass |
| text-3 / surface-1 | 4.83 | pass | pass | pass |
| text-3 / surface-2 | 5.73 | pass | pass | pass |
| accent-text `#4a5e00` / bg (links, ring, ticks) | 6.42 | pass | pass | pass |
| accent-text / surface-1 | 5.81 | pass | pass | pass |
| accent-text / surface-2 | 6.90 | pass | pass | pass |
| bone on ink (light primary button) | 16.71 | pass | pass | pass |
| bone on ink-800 (light primary hover) | 12.37 | pass | pass | pass |
| ink button edge / bone bg (UI) | 16.71 | n/a | n/a | pass |
| line-strong `#7a7870` / bg | 3.91 | n/a | n/a | pass |
| line-strong / surface-1 | 3.54 | n/a | n/a | pass |
| line-strong / surface-2 | 4.20 | n/a | n/a | pass |
| error `#b42318` / bg | 5.81 | pass | pass | pass |
| error / surface-1 | 5.26 | pass | pass | pass |
| success `#1b6b3a` / bg | 5.78 | pass | pass | pass |
| success / surface-1 | 5.23 | pass | pass | pass |
| hairline `#d7d6d2` / bg | 1.29 | decorative only | | |

**Fixes made**
- **Light `--line-strong`** was `#8a8880`: it measured 2.84 on surface-1 and failed UI 3:1. Changed to **`#7a7870`** (3.54 to 4.20).
- **Dark `--line-strong`** was `#706e67`: it measured 3.09 on surface-2, too close to the limit. Changed to **`#787670`** (3.47 to 4.16).
- **Forbidden pairs, and why:** lime on bone is **1.02**. Olive `#4a5e00` on ink is **2.60**, so olive never appears inside a console. The brief's "bone 10–12%" hairline measures **1.27–1.35** on ink. That is fine for decorative dividers, so hairlines stay. But any boundary a user must perceive uses `--line-strong`: input borders, the theme toggle track, card corner brackets, and table cell rules on mobile cards.
- **Status never relies on colour alone.** Errors carry an `✕`/"Error:" prefix. Success carries "Sent". Running nodes carry a text state.

### 3.3 Fonts

| Role | Family | Weights shipped | Source | File |
|---|---|---|---|---|
| Display (h1, h2, big numbers, footer signature) | **Clash Display** | **600 only** | **Fontshare** (`api.fontshare.com`, ITF Free Font License). It is not on npm. Download the woff2 once and commit it. | `src/assets/fonts/ClashDisplay-Semibold.woff2`, **15.3 KB** (measured) |
| Body, UI, h3 | **Geist** (variable, wght 400–600) | 400 / 500 / 600 | npm `@fontsource-variable/geist` (latin subset) or npm `geist`. SIL OFL. | `geist-latin-wght-normal.woff2` |
| Labels, logs, numbers in tables | **JetBrains Mono** (variable) | 400 / 500 | npm `@fontsource-variable/jetbrains-mono` (latin). SIL OFL. | `jetbrains-mono-latin-wght-normal.woff2` |

**Body font: Geist, not Inter Tight.**
- Inter Tight is Inter with tightened spacing, designed for display sizes. At 17–18px body it feels cramped, and it fights Clash Display's own tight tracking.
- Geist has open apertures, a slightly mechanical, engineered finish, and normal text spacing. It reads cleanly at 17–18px and sits well under Clash's geometric grotesque.
- With only one Clash weight, Geist 600 carries every h3, which keeps a single display file.

**Loading rules**
- Every `@font-face` uses `font-display: swap`.
- Preload **only** `ClashDisplay-Semibold.woff2`, because the h1 (the LCP element) uses it: `<link rel="preload" as="font" type="font/woff2" crossorigin href={clashUrl}>`. Import it with `?url` so Vite hashes it.
- Geist and JetBrains Mono load from CSS without a preload.

**Fallback metric overrides (CLS < 0.05)**
- **Clash Display:** computed from the actual Fontshare 600 TTF (head/hhea/OS/2/hmtx) against Arial, using character-frequency-weighted average width (capsize method).
- **Geist and JetBrains Mono:** computed from `@capsizecss/metrics` 4.4.0.
- Roboto (Android) has xWidthAvg 911/2048 against Arial's 913/2048, and Liberation Sans (Linux / Lighthouse hosts) is metric-compatible with Arial. So **one fallback face per family covers all platforms.**

```css
@font-face {
  font-family: "Clash Display Fallback";
  src: local("Arial"), local("ArialMT"), local("Helvetica"), local("Roboto"), local("Liberation Sans");
  size-adjust: 109.78%;
  ascent-override: 81.07%;
  descent-override: 22.77%;
  line-gap-override: 8.20%;
}
@font-face {
  font-family: "Geist Fallback";
  src: local("Arial"), local("ArialMT"), local("Helvetica"), local("Roboto"), local("Liberation Sans");
  size-adjust: 104.76%;
  ascent-override: 95.94%;
  descent-override: 28.16%;
  line-gap-override: 0%;
}
@font-face {
  font-family: "JetBrains Mono Fallback";
  src: local("Courier New"), local("CourierNewPSMT"), local("Liberation Mono"), local("Roboto Mono"), local("Droid Sans Mono");
  size-adjust: 100%;
  ascent-override: 102.02%;
  descent-override: 30%;
  line-gap-override: 0%;
}
:root {
  --font-display: "Clash Display", "Clash Display Fallback", system-ui, sans-serif;
  --font-body: "Geist", "Geist Fallback", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, monospace;
}
```

If you ship the npm `geist` files instead of Fontsource's, re-run the measurement (the values above are for the Google Fonts build of Geist). The method is at the end of §10.

### 3.4 Type scale (fluid, 360 → 1920px viewport)
Formula: `clamp(min, intercept + slope·vw, max)`, linear between 360 and 1920. Root is 16px.

```css
:root {
  /* Clash Display 600 */
  --fs-display-xl: clamp(2.75rem, 1.5385rem + 5.3846vw, 8rem);     /* 44 → 128  hero h1 */
  --fs-display-l:  clamp(2.125rem, 1.4615rem + 2.9487vw, 5rem);    /* 34 → 80   section h2 */
  --fs-metric:     clamp(3.5rem, 2.5769rem + 4.1026vw, 7.5rem);    /* 56 → 120  big numbers */
  --fs-display-m:  clamp(1.75rem, 1.4615rem + 1.2821vw, 3rem);     /* 28 → 48   case h2, proof values, footer sub */
  --fs-signature:  clamp(3.5rem, 1.6538rem + 8.2051vw, 11.5rem);   /* 56 → 184  footer "Faraz Ahmad" */
  /* Geist */
  --fs-h3:         clamp(1.375rem, 1.2885rem + 0.3846vw, 1.75rem); /* 22 → 28   Geist 600 */
  --fs-lede:       clamp(1.125rem, 1.0673rem + 0.2564vw, 1.375rem);/* 18 → 22 */
  --fs-body:       clamp(1.0625rem, 1.0481rem + 0.0641vw, 1.125rem);/* 17 → 18 */
  --fs-small:      clamp(0.9375rem, 0.9231rem + 0.0641vw, 1rem);   /* 15 → 16 */
  /* JetBrains Mono */
  --fs-mono-label: clamp(0.8125rem, 0.7981rem + 0.0641vw, 0.875rem); /* 13 → 14 */
  --fs-mono-log:   clamp(0.8125rem, 0.7837rem + 0.1282vw, 0.9375rem);/* 13 → 15 */

  --lh-display: 0.95;  /* h1 */
  --lh-heading: 1.02;  /* h2, metric */
  --lh-h3: 1.2;
  --lh-body: 1.6;
  --lh-mono: 1.5;

  --tr-display: -0.035em; /* h1 (tight, per brief) */
  --tr-heading: -0.025em; /* h2 */
  --tr-metric: -0.04em;
  --tr-body: 0;
  --tr-h3: -0.01em;
  --tr-mono-label: 0.06em; /* uppercase labels only */

  --measure: 65ch;        /* body paragraphs */
  --measure-lede: 52ch;
  --measure-heading: 18ch;/* h2 wrap control */
}
h1, h2 { text-wrap: balance; }
p { text-wrap: pretty; }
.num { font-variant-numeric: tabular-nums; }
```

The h1 is 3 lines at 360px ("AI automations / that survive / production.") and 2–3 lines at 1440/1920 within 8 columns. The ascenders of the h1 sit flush to the hero's top rule.

### 3.5 Spacing, radii, borders, z-index, motion tokens

```css
:root {
  /* 4px base */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;   --space-6: 2rem;    --space-7: 3rem;    --space-8: 4rem;
  --space-9: 6rem;     --space-10: 8rem;
  --space-section: clamp(4.5rem, 3.2308rem + 5.641vw, 10rem);   /* 72 → 160 block padding */
  --space-stack: clamp(1.5rem, 1.2115rem + 1.2821vw, 2.75rem);  /* 24 → 44 heading → content */

  --radius-0: 0;          /* sections, cards, tables, consoles */
  --radius-s: 2px;        /* chips, stack marks, TODO */
  --radius-m: 4px;        /* buttons, inputs, toggle */
  --radius-pill: 999px;   /* status pills only */

  --bw-hair: 1px;         /* all lines */
  --bw-ui: 1px;           /* inputs (line-strong) */
  --bw-focus: 2px;
  --bracket: 8px;         /* card corner brackets; 16px on hover/focus */

  --shadow: none;         /* no shadows anywhere; depth = surface step + line */

  --z-base: 0; --z-raised: 1; --z-pin: 10; --z-nav: 50; --z-sticky-cta: 60;
  --z-menu: 80; --z-toast: 90; --z-skip: 100;

  --nav-h: 56px;          /* 64px at >=1024 */
  --tap: 44px;            /* minimum target */

  --dur-press: 120ms; --dur-hover: 200ms; --dur-reveal: 320ms; --dur-enter: 600ms;
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);   /* GSAP: power3.out */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);/* GSAP: power2.inOut */
}
@media (min-width: 1024px) { :root { --nav-h: 64px; } }
html { scroll-padding-top: calc(var(--nav-h) + 16px); }
```

**Focus ring (global):**
```css
:focus-visible { outline: var(--bw-focus) solid var(--focus); outline-offset: 3px; border-radius: var(--radius-s); }
.theme-ink :focus-visible { outline-color: var(--accent); } /* never olive on ink */
```
Never use `outline: none` without a replacement. Full-card links show the ring on the card box via `:focus-within`/`:has(:focus-visible)`.

### 3.6 Grid and containers

| Range | Columns | Gutter | Side margin | Max content |
|---|---|---|---|---|
| 360–767 | 4 | 16px | `--margin` (16px at 360, about 28px at 767) | fluid |
| 768–1023 | 8 | 20px | `--margin` | fluid |
| 1024–1439 | 12 | 24px | `--margin` | fluid |
| 1440–1919 | 12 | 24px | `--margin` (about 49px at 1440) | 1600px |
| ≥1920 | 12 | 32px | auto (centred) | 1600px |

```css
:root {
  --margin: clamp(1rem, 0.3077rem + 3.0769vw, 4rem); /* 16 → 64 */
  --gutter: 16px;
  --cols: 4;
  --container-max: 1600px;
}
@media (min-width: 768px)  { :root { --gutter: 20px; --cols: 8; } }
@media (min-width: 1024px) { :root { --gutter: 24px; --cols: 12; } }
@media (min-width: 1920px) { :root { --gutter: 32px; } }
.container { width: min(100% - 2 * var(--margin), var(--container-max)); margin-inline: auto; }
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }
html, body { overflow-x: clip; } /* safety net; nothing should rely on it */
```

Breakpoints (CSS media queries can't read variables): **768, 1024, 1440, 1920**. QA widths: **360, 390, 768, 1024, 1440, 1920**.

---

## 4. Global components

### 4.1 Skip link
The first focusable element is "Skip to content", which links to `#main`. It is visually hidden until focused, then shown top-left at `--z-skip` as an ink chip with bone text, 44px tall.

### 4.2 Nav (`<header>` with `<nav aria-label="Primary">`)

| | Mobile 360–1023 | Desktop ≥1024 |
|---|---|---|
| Height | 56px, sticky, `--bg` at 100% plus a bottom `--line` that appears after 8px of scroll | 64px, same |
| Left | Wordmark "Faraz Ahmad" (Geist 600, 16px) + mono `/ ai` in text-3, linking to `/` | Same |
| Centre | none | Links: Workflow (`#workflow`), Work (`#work`), Offers (`#offers`), FAQ (`#faq`). Geist 500, 15px, 44px tall hit area. |
| Right | Theme toggle (44×44) + Menu button (44×44, label "Menu") | Theme toggle + small primary button "Book a call" (Calendly) |

- **Active link** (section in view, via IntersectionObserver): a 2px underline in `--accent-text`, with `aria-current="true"`. **Hover/focus:** the same underline at 1px. The tap equivalent is the active state.
- **Mobile menu:** `<button aria-expanded aria-controls="menu">`. It opens a full-height `.theme-ink` sheet:
  - Contents: the links in Clash Display (`--fs-display-m`) each in a 56px row, a primary "Book a scoping call" pinned to the bottom with the safe-area inset, and the email as text.
  - Behaviour: focus trap; Esc and the Close button close it; focus returns to the Menu button; `lenis?.stop()` and `overflow:hidden` on `<html>` while open.
  - Motion: opens with a clip-path reveal from the top in 280ms `--ease-out`, closes in 180ms. Under reduced motion it appears instantly.

### 4.3 Theme toggle
- `<button type="button" class="theme-toggle" aria-pressed="true|false">` with the visible label hidden and an `aria-label` of **"Dark theme"**, so `aria-pressed` says whether dark is on. The 44×44 hit area holds a 20px glyph: a half-filled circle whose filled half rotates 180° between themes (200ms).
- **Persisted and flash-free.** An inline `<script>` in `<head>`, before any CSS paint and under 600 bytes:
  ```js
  try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}
  ```
  With no stored value, CSS follows `prefers-color-scheme` (the token blocks in §3.1), so there is no JS dependency and no flash.
- **On toggle:** set `data-theme`, store it in `localStorage`, update `<meta name="theme-color">` (`#f2f1ec` / `#111110`), and update `aria-pressed`.
- **First state:** derived from `matchMedia('(prefers-color-scheme: dark)')` when nothing is stored.
- **Transition:** see §7.8.

### 4.4 Sticky mobile CTA bar (< 1024px only)
- Fixed bottom, `--z-sticky-cta`. It is `.theme-ink` in both themes, so the lime fill is legal.
- Height 64px plus `env(safe-area-inset-bottom)`, with a 1px top `--line-strong`.
- Contents: on the left, mono text-3 "Free · 30 min" over Geist 500 "Scoping call"; on the right, a primary button "Book a call" (min 44px tall, Calendly).
- **Shows** when a sentinel at the hero's bottom leaves the viewport (IntersectionObserver). **Hides** while `#contact` is in view and while the menu is open.
- Motion: in via `translateY(100%) → 0` over 240ms `--ease-out`, out over 160ms. Under reduced motion, opacity only at 0ms (instant).
- It is fixed, so it causes no CLS. The footer gets `padding-bottom: calc(80px + env(safe-area-inset-bottom))` below 1024px so nothing hides under it.

### 4.5 Buttons
All buttons have a min-height of 48px (44px for small), padding-inline 20px, `--radius-m`, Geist 500 16px, a trailing glyph (`→` or `↓`) that moves 3px on hover/focus, and `touch-action: manipulation`.

| Variant | Rest | Hover / focus-visible | Active (press) | Disabled |
|---|---|---|---|---|
| **Primary**, dark theme & consoles | bg lime, text ink | bg `--accent-hover`, arrow +3px | bg `--accent-active`, `translateY(1px)` | opacity .45, `cursor:not-allowed`, `aria-disabled` |
| **Primary**, light theme on bone | bg ink, text bone, **8px lime square** before the label (lime on ink) | bg `--ink-800`, square "pulses" once (scale 1→1.25→1, 300ms) | `translateY(1px)` | same |
| **Secondary** | transparent, 1px `--line-strong` border, text `--text` | border `--text`, bg `--surface-1` | `translateY(1px)` | same |
| **Ghost** (in-card CTAs) | text `--text`, 1px underline `--line-strong`, padding to reach 44px | underline `--accent-text` 2px | colour `--text-2` | same |

- Focus-visible always adds the global ring. Hover styles live under `@media (hover:hover)`. **Focus-visible gets the same visual as hover**, and touch gets the press state.
- Loading (form submit): the label stays, a 12px mono spinner `[/-\|]` cycles at 120ms, and `aria-busy`. Under reduced motion the spinner shows a static `…`.

### 4.6 Links
- **Inline:** `text-decoration: underline 1px var(--line-strong); text-underline-offset: 3px`. On hover/focus the decoration takes `--accent-text` at 2px thickness.
- **External links** (Calendly, farazahmad.dev) get a trailing `↗` with `aria-hidden` and visually hidden "(opens …)" text only if `target=_blank`. Recommendation: **don't** use `target=_blank`; it is a normal navigation.

### 4.7 Tags and stack marks
- Stack mark: JetBrains Mono 13–14px, original casing, 1px `--line` border, `--radius-s`, 4px 8px padding. It is not interactive and has no hover. Group them in a `<ul aria-label="Stack">`.
- Status pill: `--radius-pill`, an 8px dot plus mono label. "Running" and "In production" use a lime dot and **must sit on ink** (consoles, or a small ink pill on bone). Other states use a text-3 dot.

### 4.8 Placeholder / TODO treatment (one system everywhere)
Every unknown value renders through one component: `<Todo id="case.lead-drift.result" label="add measured number" />`.

- **Inline chip:**
  ```css
  .todo {
    font: 500 var(--fs-mono-label)/1.4 var(--font-mono);
    color: var(--text-2);
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-s);
    padding: 2px 8px;
    background: repeating-linear-gradient(135deg, var(--todo-hatch) 0 6px, transparent 6px 12px);
  }
  .todo::before { content: "TODO · "; color: var(--text-3); }
  ```
- **Metric slot** (where a big number will go): a block reserving the real number's height (`min-height: calc(var(--fs-metric) * 1.02)`) that shows a long dash `—` in Clash at `--text-3`, with the chip underneath. When the real number arrives, nothing shifts.
- **Screen readers** hear "TODO · add measured number". That is accepted: it is honest, and the owner chose visible placeholders.
- **Build-time list:** the `<Todo>` component registers its `id`. A dev-only page (`/__todo/`) or a `console.warn` summary at build lists every open TODO, which becomes the owner's input checklist.
- **Rule:** a TODO is never animated, counted or given lime.

### 4.9 Footer
- Full-width `--line` top rule.
- **Row 1:** columns. Navigation (mono labels), Contact (Calendly link, `farazahmad31048@gmail.com`), and "Main site" with a link to `https://farazahmad.dev` ("farazahmad.dev ↗").
- **Row 2: the brand signature.** "Faraz Ahmad" in Clash Display 600 at `--fs-signature`, `--tr-display`, `--text`. One line, left-aligned on the grid, cropped by nothing. `aria-hidden="true"`, because it repeats the name already in row 3.
- **Row 3:** mono text-3 "© 2026 Faraz Ahmad · ai.farazahmad.dev".
- It follows the theme (not a console). There is no lime in the footer.
- Below 1024px, the extra bottom padding from §4.4 applies.

---

## 5. Home: section by section
Heading outline (SEO): **one h1** (hero), one h2 per section, h3 for items. Every section is a `<section id aria-labelledby>`, and its h2 id matches.

### 5.1 Hero (01)
**Purpose:** the outcome, who it's for, and the two paths.

**Copy**
- Eyebrow (mono, text-3): `AI & AUTOMATION ENGINEER · FARAZ AHMAD`
- **h1:** "AI automations that survive production."
- Lede (Geist, `--fs-lede`, text-2, `--measure-lede`): "Senior engineer, not an agency. I build AI and automation systems for founders and ops teams: fixed scope, monitored in production, and you own everything I build."
- CTAs: Primary **"Book a scoping call"** (Calendly). Secondary **"Watch a workflow run ↓"** (`#workflow`).
- Micro-line (mono, text-3): "Fixed scope, agreed before work starts. Free 30-minute scoping call."

**Visual:** an inline SVG console card (`.theme-ink`, `aria-hidden="true"`) with 5 nodes, `trigger → enrich → classify → route → notify`, on a 3-row zigzag with orthogonal wires. The nodes are 1px `--line-strong` rectangles with mono labels, and the last node holds a lime "● running" dot. It uses the same step ids as `WORKFLOW_STEPS`, so the hero foreshadows §5.4. The visible hairline grid and "+" crosshairs sit behind everything (§1).

**Layout**
| Range | Layout |
|---|---|
| 360–767 | Eyebrow → h1 (44–55px, 3 lines) → lede → CTAs stacked full-width (primary first, 8px gap) → micro-line → graph as a compact horizontal 5-node strip (328×120, nodes 40px) |
| 768–1023 | h1 spans 7 of 8 cols. CTAs inline. Graph below at 8 cols, 2 rows. |
| 1024–1919 | h1 cols 1–8, lede cols 1–6, CTAs inline; graph console cols 8–12, vertically centred, overlapping the h1's last line by 1 column (z above the grid, below text). `min-height: min(100svh - var(--nav-h), 56rem)`. |
| 1920 | h1 hits its 128px max; the container caps at 1600; the grid lines continue full-bleed. |

**Performance:** the h1 is the LCP and renders in final state with no JS and no entrance animation. The graph is inline SVG under 3 KB and is animated by CSS only (§7.2).

**Interaction:** button states per §4.5. The graph is not interactive (no hover). A hero-bottom sentinel drives the sticky CTA (§4.4).

### 5.2 Proof strip (02)
**Purpose:** instant credibility using only what is true.

**h2** (visually hidden): "Proof"

Four cells. The value is in Clash `--fs-display-m`, the label in mono text-3.

| Cell | Value | Label |
|---|---|---|
| 1 | Status pill on ink: `● In production` | "Lead Drift, Indepth Solution's own growth engine" |
| 2 | `<Todo>` metric slot | "Systems shipped" (`id: proof.systems`) |
| 3 | `<Todo>` metric slot | "Hours saved for clients / month" (`id: proof.hours`) |
| 4 | `<Todo>` metric slot | "Years building" (`id: proof.years`) |

Then the stack row: mono label "Stack I build with" followed by 9 stack marks in this order: n8n, Make, Zapier, GoHighLevel, Claude, OpenAI, Python, MongoDB, Next.js.

**Layout:** desktop is 4 cells × 3 cols with vertical hairlines between them, stack row below. Tablet is a 2×2 grid at 4 cols each. Mobile is a 2×2 grid at 2 cols each, values at 28px, labels wrapping. The stack marks wrap; there is never horizontal scroll.

**Interaction:** none. This is static by design.

### 5.3 The problem (03)
**Purpose:** empathy, so the reader thinks "that's us".

- **h2:** "Your AI pilot isn't failing because AI doesn't work."
- Body (`--measure`): "It's failing on the boring parts. Messy inputs, no error handling, and nobody watching it once the demo is over. That's the part I build first."
- Three "incident lines", in mono and set like a log (`<ul>`). Each is an h3 in Geist 600 plus a short line:
  1. `[warn]` **Tools bought, nothing in production.** "The licences renew. The pilot is still in a sandbox."
  2. `[fail]` **Automations that break quietly.** "A step stopped running and nobody noticed until a customer did."
  3. `[warn]` **Nobody owns it.** "The person who built it left, and no one knows how it works."

  The `[fail]` tag is coloured with `--error` and keeps its text, so it does not rely on colour.

**Layout:** desktop puts the h2 in cols 3–10 and the incident list in cols 3–12 as a 3-row ruled table (tag | title | line). Tablet and mobile stack each incident as a tag line over title over sentence.

**Interaction:** none.

### 5.4 Live workflow (04): the signature
**Purpose:** live proof. Show a system running, and let the visitor break it.

**Copy**
- **h2:** "Watch a lead go through the system."
- Intro: "This is the shape of Lead Drift, Indepth Solution's own growth engine, running in production. Each step is logged, and every failure has somewhere to go."
- Console header (mono): `lead-drift / intake` + `SIMULATED RUN · sample data` + (while placeholders remain) `<Todo label="real Lead Drift steps">`.
- Skip link at the top of the section (visible on focus): "Skip the demo", which links to `#work`.

**Data: ONE const array** (`src/data/ai/workflow.ts`). The section, the hero graph, the mobile stepper, the runner and the Lead Drift case diagram all render from it:
```ts
/** TODO(owner): replace with the real, anonymized Lead Drift steps.
 *  While any step has placeholder:true the UI shows the "SAMPLE STEPS" TODO chip. */
export const WORKFLOW_STEPS = [
  { id: 'trigger',  label: 'Trigger',  tool: null, placeholder: true,
    summary: 'A new lead arrives from a form or inbox.',
    log: 'trigger   new lead received   source=form   id=lead_0001 (sample)' },
  { id: 'enrich',   label: 'Enrich',   tool: null, placeholder: true,
    summary: 'Company and contact details are filled in.',
    log: 'enrich    company=Example Co (sample)   fields=+4' },
  { id: 'classify', label: 'Classify', tool: null, placeholder: true,
    summary: 'A model labels intent and fit, with a confidence score.',
    log: 'classify  intent=TODO   fit=TODO   confidence=TODO' },
  { id: 'route',    label: 'Route',    tool: null, placeholder: true,
    summary: 'The lead goes to the right pipeline, or to a person if unsure.',
    log: 'route     -> pipeline=TODO   owner=TODO' },
  { id: 'notify',   label: 'Notify',   tool: null, placeholder: true,
    summary: 'The owner is alerted with the context they need.',
    log: 'notify    owner alerted   channel=TODO' },
] as const;
export const WORKFLOW_RESULT = { placeholder: true, label: 'Leads processed per week', value: null }; // TODO
```
`tool: null` means no tool chip renders. Never guess the tool for a Lead Drift step.

**Placeholder flag without wrecking the look**
- There is one chip in the console header.
- Each placeholder log value literally reads `TODO`, set in text-3, so it looks like an unfilled field in a real log.
- The console footer carries a comment line in text-3: `# TODO(owner): replace WORKFLOW_STEPS with real Lead Drift steps`.
- In `import.meta.env.DEV` only, each placeholder node also gets a dashed outline.

**Accessible structure (works with no JS):**
- An `<ol class="wf-steps">` lists every step: h3 = label, a summary `<p>`, and the log line in `<code>`. The SVG graph is `aria-hidden`.
- The result line: "Result: `<Todo label="measured result">`".
- No JS, or reduced motion, shows the **final state**: all nodes lit, all logs printed, result visible.

**Layout**
| Range | Layout |
|---|---|
| ≥1024 (pinned) | The h2 and intro scroll normally above. Then the console pins (`height: 100svh - nav`). Graph in cols 1–7 (5 nodes left→right on two rows), log panel in cols 8–12 (mono, fixed height, newest line at the bottom), progress rail along the bottom (5 ticks + labels + mono `03 / 05`). After the last step, the result line, then the runner controls. |
| 768–1023 | **Vertical stepper, no pin**: a rail on the left with 5 nodes; each step is a row of step text (cols 1–5) and its log line (cols 6–8). The runner sits below. |
| 360–767 | Vertical stepper, single column: node dot, h3, summary, log line in a `<code>` block with wrapping (`white-space: pre-wrap; overflow-wrap:anywhere`). The runner sits below with full-width buttons. |
| 1920 | The same, inside the 1600 container; the console background spans full-bleed. |

**"Break it on purpose" runner** (the picked idea). It sits below the console on all sizes.
- **h3:** "Break it on purpose."
- Line: "Send a sample lead through the same steps. Try the malformed one."
- Three buttons (secondary style, 48px; mobile full-width):
  - "Send a good lead"
  - "Send a duplicate"
  - "Send a malformed lead"
- Paths (sample data, labelled as simulated):
  - **Good:** all 5 steps OK, result `routed`.
  - **Duplicate:** `enrich` detects an existing record, the lead merges, and notify is skipped. The log reads `dedupe   match found -> merged (sample)`.
  - **Malformed:** `enrich` fails with an invalid email, then `retry 1/2 (backoff)`, `retry 2/2`, then `fallback -> human review queue`, then `notify   alert sent to owner`. The failing node flips to an `--error` outline with the label "✕ failed". The human-review node appears as a branch below the main line.
- Each run prints log lines into the console with relative timestamps `+0.00s`, at a step interval of 450ms.
- An `aria-live="polite"` status speaks **only the end summary**, e.g. "Run complete. Malformed lead caught at Enrich, retried twice, sent to human review."
- Buttons are disabled with `aria-disabled` during a run. After the run there is a "Run again" ghost button.
- Reduced motion: the run resolves instantly to its final log.
- The error-path step names are also placeholders. They illustrate the production checklist, not a claim about Lead Drift internals, and they are listed in Open questions.

**Interaction:**
- Hover over a node in the pinned graph shows its summary in a tooltip. The tap/focus equivalent: graph nodes are not focusable (decorative), and the same text is always visible in the `<ol>`. The tooltip is a convenience only.
- The runner buttons have full keyboard support.

### 5.5 Case studies (05)
**Purpose:** proof via four builds. Each card leads with its number slot.

- **h2:** "Systems I've built and what they do."
- Line: "Four builds, each written up the same way: the baseline, what I built, the stack, and what runs it now."

**Cards** (h3 = case name; full-card link to `/work/<slug>/` via a stretched `::after` on the h3's link):

| Card | Metric slot (top) | Angle line (from brief §3) | Tags |
|---|---|---|---|
| Lead Drift | Status pill `● In production` (the real fact, as text; no number) | "Outreach and lead automation, end to end. Indepth Solution's own growth engine." | `<Todo label="stack">` |
| Yard Terminal | `<Todo>` metric slot | "AI that runs selling across eBay, Shopify, Amazon, Google and Facebook." | `<Todo label="stack">` |
| SolidMake | `<Todo>` metric slot | "Custom AI beyond no-code: a text description in, a CAD (STEP) file out." | `<Todo label="stack">` |
| AI SEO Automator | `<Todo>` metric slot | "An AI content and SEO pipeline." | `<Todo label="stack">` |

Each card ends with a ghost "Read the case →" (the visible end of the link).

**Layout:**
- Desktop: a 2×2 grid, each card 6 cols, min-height 360px, metric at the top in `--fs-metric`, registration corners.
- Tablet: 2×2 at 4 cols each, metric at `--fs-display-m`.
- Mobile: stacked, full width, metric at `--fs-display-m`.
- 1920: cards keep 6 cols inside 1600.

**Interaction (hover = focus-visible = `:has(:focus-visible)`):**
- The corner brackets extend to 16px.
- A 2px packet travels the card's top hairline once (600ms).
- The arrow moves +3px.
- The h3 underline appears in `--accent-text`.

Touch has no hover dependency: the whole card is the link, with a press state of `translateY(1px)` and bg `--surface-1`.

### 5.6 Offers (06)
**Purpose:** clear buying paths with no prices.

- **h2:** "Four ways to work with me."
- Lead line: "Every path starts with a free 30-minute scoping call."

**The call strip** (top, `.theme-ink`, full width): h3 "Scoping call · free · 30 min". Text: "You'll leave the call with a clear plan and a cost range." Primary "Book a scoping call".

**Four cards** (mono step number, h3, 2-line description, 3 "you get" bullets, a price line, and a CTA):

| # | h3 | Description | You get | Price line | CTA |
|---|---|---|---|---|---|
| 01 | Automation Audit | "I map how work moves through your team today and find the 2–3 automations worth building first." | Workflow map · ranked opportunities · written plan with costs | "Fixed scope, agreed before work starts" | "Start with an audit" |
| 02 | Build | "One system, built to the production checklist. For example: lead intake → enrichment → CRM → alerts." | Working system in your accounts · runbook · handover call | "Fixed scope, agreed before work starts" | "Book a scoping call" |
| 03 | Rescue | "A broken or stalled automation or AI pilot, made reliable. Zapier, Make, n8n or custom code." | Diagnosis · fixes · logging and alerts added | "Fixed scope, agreed before work starts" | "Fix my automation" |
| 04 | Care plan | "Monitoring, fixes, small changes and model/API updates, every month. Cancel any time." | Monitoring · fixes · monthly changes | "Monthly, scoped on a call" | "Book a scoping call" |

Under the grid, a mono text-3 line: "No hourly billing. You'll leave the call with a clear plan and a cost range."

All CTAs go to Calendly with `?utm_source=ai&utm_content=<offer>`.

The brief's "audit fee credited toward a build" is **left out pending confirmation** (Open questions).

**Layout:** desktop is 4 cards × 3 cols (equal heights, price line and CTA aligned to the bottom via subgrid or flex). Tablet is 2×2. Mobile is stacked.

**Interaction:** card hover/focus shows the corner brackets; the CTA states are per §4.5. No card-wide link here, because each card has a single explicit CTA.

### 5.7 Production checklist (07)
**Purpose:** answer "will it break?". The visible hairline grid returns here.

- **h2:** "Every build ships with these eight things."
- Line: "Not extras. This is what 'in production' means to me."

Eight cells (`<ul>`). Each has a mono code, an h3, one sentence, and a tick box (16px square, `--line-strong` border, tick in `--accent-text` on bone or lime in dark):

| Code | h3 | Sentence |
|---|---|---|
| `01 / RETRY` | Error handling & retries | Every external call has a timeout, retries with backoff, and a place for failures to land. Nothing fails silently. |
| `02 / HUMAN` | Human override | A person can pause, approve or correct any automated decision, and low-confidence cases go to a person by default. |
| `03 / LOGS` | Logging & alerts | Every run is logged, and failures alert a named person where your team already works. |
| `04 / COST` | Cost caps | Hard limits on model and API spend per run and per day, so a loop can't run up a bill. |
| `05 / FALLBACK` | Model fallback | If a model is down or returns junk, the step falls back to a second provider or a safe default. |
| `06 / ACCESS` | Permissions | Least-privilege API keys per system, stored as secrets, never pasted into a workflow. |
| `07 / DATA` | Data retention | Personal data is kept only as long as the workflow needs it, then deleted on a schedule we agree. |
| `08 / HANDOVER` | Handover docs | A plain-language runbook, the architecture diagram, and every account in your name. |

**Layout:** desktop is 4×2, each cell 3 cols with hairline cell borders; the grid lines and crosshairs are visible behind it. Tablet is 2×4. Mobile is a 1×8 list (code on the left, content on the right).

**Interaction:** none (a reading section). The tick-in is in §7.6.

### 5.8 Process (08)
**Purpose:** reduce uncertainty.

- **h2:** "How a project runs."

Four steps on one wire (an ordered list). Each has a mono index, an h3 and 1–2 sentences:
1. **Scope:** "A free 30-minute call. You leave with a clear yes or no, a plan and a cost range."
2. **Plan:** "For bigger or unclear jobs, an audit first: a written plan with fixed scope and costs."
3. **Build:** "Weeks, not months. I build in your accounts and show it running as it comes together."
4. **Run:** "It goes live with logging and alerts. Your team runs it, or a care plan keeps me on it."

The wire's 4th node is the only lime dot (on a small ink node): "running".

**Layout:** desktop is a horizontal wire across cols 1–12 with 4 nodes and the text under each (3 cols). Tablet is a 2×2 grid with the wire hidden. Mobile is a vertical wire on the left with the steps stacked.

**Interaction:** none.

### 5.9 Comparison (09)
**Purpose:** handle the objection "why not an agency or a cheaper freelancer?".

- **h2:** "Me, an agency, or a no-code freelancer."
- Caption (text-3): "Generalisations. Good agencies and freelancers exist; this is how the options usually differ."

| | **Me (Faraz)** | Typical agency | No-code freelancer |
|---|---|---|---|
| Who builds it | The senior engineer you talk to, from call to handover | A team; you mostly talk to an account manager | One person, usually inside one no-code tool |
| Speed to first live version | Weeks, with working demos along the way | Often longer: discovery and hand-offs between roles | Fast for simple flows; slows when logic gets complex |
| Price | Fixed scope, agreed before work starts; scoped on a call | Usually higher; retainers are common | Usually lowest up front; often hourly |
| Code & account ownership | Yours from day one: code, accounts, data | Varies; check the contract | Often built in the freelancer's own accounts |
| Monitoring | Logging and alerts in every build; care plan optional | Usually available, often as a retainer | Rarely included |
| Handover | Runbook, diagram, accounts in your name | Usually documented | Often minimal |
| When no-code hits its limits | I write the custom code (Python, Next.js) | Can, through a dev team | Usually workarounds |

**Layout:**
- ≥768: a real `<table>` with `<th scope="row">` and `scope="col"`. The "Me" column is an ink column (`.theme-ink` cells) in light theme and `--surface-2` with `--line-strong` side rules in dark. 1px row hairlines. Sticky first column on tablet.
- <768: **stacked cards, one per criterion.** The same table markup is restyled to `display:block`, and explicit ARIA roles (`role="table|row|rowheader|cell"`) keep the semantics. Each card shows the criterion as a heading-styled row header, then three labelled lines ("Me:", "Agency:", "Freelancer:" via `data-label` → `::before`). The "Me" line comes first, with a 3px `--accent-text` left rule (lime on ink in dark).

**Interaction:** none (no hover row highlight needed).

### 5.10 About (10)
**Purpose:** trust and direct access.

- **h2:** "You talk to the person building it."
- Three sentences:
  - "I'm Faraz Ahmad, a senior engineer who builds AI and automation systems in n8n, Make, Zapier and GoHighLevel, and in custom code with Python, Next.js and MongoDB when no-code hits its limits."
  - "Lead Drift, Indepth Solution's own growth engine, is one of mine, and it runs in production."
  - "From the first call to handover, you deal with me, not an account manager."
- Facts list (mono `<dl>`):
  - Building since: `<Todo>`
  - Based in / time zone: `<Todo>`
  - Main site: farazahmad.dev ↗
- Headshot: the placeholder per §1, 4:5. Astro `<Image>` with width/height, `loading="lazy"`, AVIF/WebP, and `alt="Faraz Ahmad"` (once the real photo exists; the placeholder SVG gets `alt=""` plus its visible TODO label).

**Layout:** desktop has the photo in cols 1–4 and the text in cols 6–12. Tablet has the photo in 3 cols and the text in 5. Mobile puts the photo at 60% width above the text.

**Interaction:** link states only.

### 5.11 FAQ (11)
**Purpose:** answer objections. Output `FAQPage` JSON-LD from the same data.

- **h2:** "Questions buyers ask me."

Native `<details><summary>`: no JS, 56px summary rows, a "+" that rotates 45° into "×" (200ms), and the h3 inside the summary.

| # | Question (h3) | Answer |
|---|---|---|
| 1 | We already tried AI and it didn't work. Why would this? | Most pilots stall on the unglamorous parts: messy inputs, no error handling, and nobody watching after launch. I start with one workflow and its current baseline, build the production pieces first, and show it running before we call it done. |
| 2 | What does it cost, and is it fixed? | Yes, it's fixed. Cost depends on the systems involved, so I scope it with you on a free 30-minute call, and you leave with a clear plan and a cost range. The final scope and price are agreed in writing before work starts. |
| 3 | What happens when an API or model changes and it breaks? | Every build logs its runs and alerts on failures, and model steps have a fallback, so a change shows up as an alert, not as silent bad data. On a care plan I handle the fix. Without one, you have the runbook, or you can bring me back for a fixed-scope fix. |
| 4 | Who owns the code, the accounts and the data? | You do. I build in your accounts, under your own API keys, and any custom code lives in your repository. At handover every credential is in your name. |
| 5 | Is my data sent to OpenAI or used for training? | Only the fields a step actually needs go to a model, and I use the providers' APIs, not consumer chat apps. OpenAI and Anthropic say API data isn't used for training by default; check their current terms for your case. Where data is sensitive I mask it or keep that step off the model entirely. |
| 6 | No-code (Zapier, Make, n8n) or custom code: which do I need? | Most systems start in n8n, Make or Zapier because they're quick to change and easy to hand over. I move a step to custom code in Python or Next.js when it needs heavy logic, high volume or tight cost control. We decide step by step on the scoping call. |
| 7 | How long until something is live? | It depends on scope, so we set the timeline on the scoping call and it goes in the written plan. I ship in stages, so you see something running early rather than everything at the end. |
| 8 | Do I need a care plan? | No. Every build ships with logging, alerts and a runbook so your team can run it. A care plan suits you if you want someone watching it, fixing breaks and making small changes each month, and you can cancel any time. |

**Layout:** desktop has the h2 plus a mono line "Not here? Ask on the call." in cols 1–4 (sticky top inside the section), with the list in cols 5–12. Tablet and mobile stack.

**Interaction:** summary hover/focus shows a `--surface-1` background and the ring; the tap target is the full row.

### 5.12 Final CTA and form (12)
**Purpose:** convert. This is the second console (`.theme-ink`, both themes).

- **h2:** "Bring me the workflow that keeps breaking."
- Line: "Book a free 30-minute scoping call. You'll leave the call with a clear plan and a cost range."
- **Face beside the button:** a 56px circular headshot (placeholder until supplied), then the primary **"Book a scoping call"**. Mono under it: "Fixed scope, agreed before work starts."
- **Form** (`<ContactForm niche="ai" cta="Send message" />`), with the h3 "Or send the details." Style it with the hooks:
  ```css
  #contact {
    --cf-gap: var(--space-5); --cf-border: var(--line-strong); --cf-radius: var(--radius-m);
    --cf-pad: 0.75rem 0.875rem; --cf-bg: var(--surface-1); --cf-focus: var(--accent);
    --cf-btn-bg: var(--accent); --cf-btn-color: var(--on-accent);
    --cf-error: var(--error); --cf-success: var(--success);
  }
  #contact :global(.cf__control) { min-height: 48px; }   /* touch */
  #contact :global(.cf__label) { font: 500 var(--fs-mono-label)/1.4 var(--font-mono); color: var(--text-2); }
  ```
- Under the form: "Prefer email? farazahmad31048@gmail.com" (a mailto link).

**Layout:** desktop has the h2, line, face and button in cols 1–6 and the form in cols 8–12. Tablet and mobile stack: CTA block, then the form. The sticky bar hides here.

**Interaction:** button and form states per §4.5. Field errors use the native validation message; status shows in `.cf__status` (aria-live already present).

---

## 6. Case-study page template (`/work/<slug>/`)
One layout and one data file (`src/data/ai/cases.ts`) whose fields default to TODO.

**Outline:** h1 (case), h2 for Baseline, What I built, Result, What runs it now, and Next case. h3 for metrics and diagram parts.

| # | Section | Content | Layout |
|---|---|---|---|
| 1 | **Hero** | Breadcrumb (mono): `Work / <Case>`. Eyebrow: client type. **h1** headline. Headline metric slot. Status pill if real. | h1 cols 1–9; the metric slot at right (cols 9–12) on desktop, below on mobile. |
| 2 | **Baseline** (h2 "Before") | "How it worked before" paragraph `<Todo>`; baseline metrics `<Todo>` (time per task, volume, error rate) as a mono definition list | Text in cols 3–9 |
| 3 | **What I built** (h2) | A static schematic SVG generated from the case's steps (the same renderer as §5.4, no pin, CSS draw-in on enter); a stack chips row (`<Todo>` until supplied, chosen from the 9 tools only) | The diagram is full-width in a `.theme-ink` console; on mobile it becomes a vertical stepper |
| 4 | **Result** (h2) | Metric grid: 2–4 `<Todo>` metric slots (baseline → after pairs, mono "before" / "after" labels) | 2 cols on mobile, 4 on desktop |
| 5 | **What runs it now** (h2) | Monitoring and maintenance: `<Todo>`, plus which checklist items it uses (`<Todo>`). Lead Drift may state "Running in production." | Text in cols 3–9 |
| 6 | **Next case + CTA** | The next case card (same component as §5.5) plus the final CTA block (a compact version of §5.12 without the form; the button and email) | as §5.5 / §5.12 |

There is **no testimonial slot**.

**Per-case hero copy**

| Slug | Eyebrow (client type) | h1 | Diagram nodes (known only) |
|---|---|---|---|
| `lead-drift` | "Internal product · Indepth Solution" | "Lead Drift: Indepth Solution's own growth engine, in production." | `WORKFLOW_STEPS` (placeholder) |
| `yard-terminal` | `<Todo label="client type">` | "Yard Terminal: AI that runs selling across five channels." | Inputs `<Todo>` → AI `<Todo>` → outputs: eBay, Shopify, Amazon, Google, Facebook |
| `solidmake` | `<Todo label="client type">` | "SolidMake: from a text description to a CAD file." | Text prompt → `<Todo>` → STEP file |
| `ai-seo-automator` | `<Todo label="client type">` | "AI SEO Automator: an AI content and SEO pipeline." | `<Todo>` steps |

**Order of "Next case":** lead-drift → yard-terminal → solidmake → ai-seo-automator → lead-drift.

**Page feel:** the case card's h3 and the case h1 share `view-transition-name: case-<slug>` (§7.9).

---

## 7. Motion spec (GSAP + Lenis)

### 7.1 Loading strategy and budget
Measured gzip sizes (min builds in `node_modules`): **gsap 27.7 KB + ScrollTrigger 17.6 KB + lenis 5.3 KB = 50.6 KB**.

| Chunk | Size (gz, est.) | Loads | On |
|---|---|---|---|
| Inline head theme script | about 0.3 KB | Before paint | All |
| `base.js`: nav, menu, theme toggle, sticky CTA, IO reveals, anchor handling | about 2.5 KB | `type=module` (deferred) | All |
| ContactForm + Attribution (existing) | about 2.5 KB | Deferred | All |
| `workflow.js`: stepper IO + "Break it on purpose" runner | about 4 KB | `import()` when `#workflow` is within 1 viewport (IO `rootMargin: 100% 0px`) | All |
| `motion.ts` chunk: gsap + ScrollTrigger + lenis + pin timeline | about 52 KB | `import()` on `requestIdleCallback` (timeout 2500ms), or on first `wheel`/`pointerdown`/`keydown`, **only if** `(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)` | Desktop only |

**Totals:** about 62 KB on desktop and about 10 KB on mobile, against a budget under 120 KB. Mobile never downloads GSAP or Lenis. Lenis gives nothing on touch (native scroll), and every mobile animation is IntersectionObserver + CSS. This is the biggest lever for mobile Performance ≥ 90.

**General rules**
- Animate `transform`, `opacity`, `clip-path` and `stroke-dashoffset` only.
- Initial hidden states are applied by JS, only to elements **below the fold at init**, so no-JS shows everything.
- Above-the-fold content is never hidden.
- Everything is `once: true` except the pinned scrub.

### 7.2 Hero graph (CSS only, 0 KB JS)

| Element | Animation | Timing |
|---|---|---|
| Edges | `stroke-dashoffset: 100 → 0` (paths use `pathLength="100"`, `stroke-dasharray: 100`) | 700ms each, `--ease-out`, start 200ms, stagger 120ms |
| Nodes | `opacity 0→1`, `scale .92→1` (`transform-box: fill-box`) | 240ms, begins when the incoming edge reaches 70% |
| "● running" dot on notify | opacity 0→1, then a 2.4s opacity breathe 1→.55→1 | after the draw completes (about 1.5s) |
| Packets | Each edge has a duplicate path with `stroke-dasharray: 2 98`, animating `stroke-dashoffset: 100 → 0`, linear, in lime | 3.2s per edge loop, edges offset by 0.8s, so at most 2 packets are visible; starts at 1.8s |

- An IntersectionObserver in `base.js` adds `.is-paused` (`animation-play-state: paused`) when the hero is off screen.
- **Reduced motion:** no animations; edges and nodes are drawn and there are no packets.
- **No JS:** the CSS still runs, which is fine.

### 7.3 Section reveals (IO + CSS, all devices)
- `[data-reveal]` goes from `opacity 0; translateY(24px)` to its final state over 600ms `--ease-out`. Children use `--i` for a 60ms stagger, capped at 6.
- Trigger: IO `threshold: 0.15, rootMargin: 0px 0px -10% 0px`, once.
- Applies to h2 blocks, case cards, offer cards, process steps and FAQ.
- **Reduced motion:** the class is never added, so content stays static.

### 7.4 Live workflow, desktop (pinned, GSAP)
Inside `gsap.matchMedia()` for `(min-width:1024px) and (min-height:640px) and (prefers-reduced-motion:no-preference)`:

- **ScrollTrigger:** `trigger: .wf-console, start: 'top top+=' + navH, end: '+=' + (steps.length * 0.8 + 1.0) * innerHeight` (5 steps → **5.0 × viewport height** of scroll), `pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true`.
- **Snap:** `snapTo: 'labelsDirectional', duration: {min: .2, max: .5}, delay: .1, ease: 'power1.inOut'`.
- **Timeline** (units = 1 step = 80vh of scroll), labelled `step-<id>`, ease `none` (scrubbed):

| Part | Start → end (within the step) | What |
|---|---|---|
| Lead-in (first 0.4 units, once) | 0 → 0.4 | Console header and "trigger" node fade from 0.4 to 1; the progress rail appears |
| Edge in | 0 → 0.35 | Incoming edge `stroke-dashoffset 100 → 0`; a packet head (lime 2px) rides the edge |
| Node lights | 0.35 → 0.5 | Node border becomes lime, fill `--ink-850 → --ink-800`, mono state text `idle → running → ok`; the previous node dims to "ok" (text-2) |
| Log types | 0.4 → 0.9 | The log `<code>` line is fully in the DOM; it reveals via `clip-path: inset(0 calc(100% - var(--ch) * 1ch) 0 0)`, tweening the custom property `--ch` from 0 to its length. Mono makes `ch` exact. No layout shift. |
| Rail | 0 → 1 | Progress fill `scaleX` advances 1/5; the mono counter updates `0n / 05` (via `onUpdate`, `aria-hidden`) |
| Hold | 0.9 → 1 | Nothing, a reading pause |
| Result (last 0.6 units) | after step 5 | The result line slides in (`y 16 → 0`). It shows the `<Todo>` chip, and the lime `● complete` pill appears. **No counting**: the value is a TODO. If `WORKFLOW_RESULT.value` becomes a number, a counter may run from 0 to the value over 1.2s `power2.out` on enter (not scrubbed), only when `placeholder === false`. |
| Runner reveal | end | The "Break it on purpose" controls are not pinned. They sit right after the pin spacer, so they are reached by normal scroll. |

- **"Watch a workflow run"** (the hero secondary CTA): if the motion chunk is loaded, `lenis.scrollTo(st.start)`, then `lenis.scrollTo(st.end, { duration: 7, easing: t => t })`. This auto-plays the pinned run, and any wheel or keyboard input interrupts it (Lenis default). Otherwise it is a normal anchor jump.
- The `<ol>` stays in the DOM. During the pin it is visually the step labels on the graph and is not hidden from AT. The graph and log panel are `aria-hidden`.

### 7.5 Live workflow, mobile and tablet (no pin, IO)
- Each `.wf-step` is observed with `threshold: 0.6, rootMargin: '0px 0px -20% 0px'`. On enter it sets `data-state="done"`:
  - The node dot fills lime (the stepper column is `.theme-ink`).
  - The rail segment above it fills (`scaleY 0→1`, 320ms).
  - The log line reveals with the same `--ch` clip trick, as a CSS transition of 18ms per character, capped at 600ms.
- Steps must complete in order: if step 4 enters before step 3, mark 1–3 done first.
- The result line enters after step 5 is done.
- **Reduced motion or no JS:** all `done` (the server renders `data-state="done"`; JS resets it to `idle` only when motion is allowed and the IO is attached).

### 7.6 Checklist tick-in
- IO (once, threshold .3) on the grid adds `.is-ticked`.
- Each tick's path animates `stroke-dashoffset 100 → 0` over 400ms `--ease-out`, with `transition-delay: calc(var(--i) * 80ms)`, in DOM order (8 items, last at 560ms).
- The box border goes `--line-strong → --accent-text` at the same moment.
- Reduced motion or no JS: drawn.

### 7.7 Case-card counters
- They exist only for real numeric values. Markup gets `data-count="<number>"` **only** when the value is a number and the field is not a TODO.
- Effect: a rAF tween from 0 over 1.2s ease-out (about 0.3 KB, no GSAP), tabular numerals, `aria-label` with the final value on the element, and the counting text `aria-hidden`.
- With today's data, **no counter runs anywhere.** TODO slots and the Lead Drift status pill are static.
- Reduced motion: final value.

### 7.8 Theme toggle transition
- If `document.startViewTransition` exists and reduced motion is not requested: start a view transition. In it, set `data-theme`, and animate `::view-transition-new(root)` with `clip-path: circle(0 at X Y) → circle(hypot(vw, vh) at X Y)`, where X and Y are the toggle's centre. 420ms `--ease-in-out`. The old root is not animated.
- Otherwise: instant swap. Do not use a global `transition: color, background` on `*`, because it janks and repaints everything.
- The toggle glyph rotates 180° in 200ms (none under reduced motion).

### 7.9 Page and route feel
- Use **cross-document view transitions in CSS only** (no ClientRouter JS):
  ```css
  @media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }
  ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 200ms; }
  ```
  Case card h3 → case h1 share `view-transition-name: case-<slug>` for a title morph. Browsers without support do a normal navigation.
- After navigation the motion chunk (desktop) re-inits per page; case pages only need the CSS draw-in, so they don't register a pin.
- Focus: on a normal page load the browser handles focus. In-page jumps follow §7.10.

### 7.10 Lenis with anchors, focus and keyboard
- **Config:** `new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false })`. Anchors are handled by our own code so focus is correct.
- **Anchor clicks:** one delegated listener on `a[href^="#"]`. If Lenis is running:
  1. `preventDefault()`.
  2. `lenis.scrollTo(target, { offset: -(navH + 16), duration: 1.0 })`.
  3. In `onComplete`, `target.focus({ preventScroll: true })`. Sections and h2s get `tabindex="-1"`, so a screen reader announces the new location.
  4. `history.pushState(null, '', hash)`.

  Without Lenis: the native jump plus `scroll-padding-top` (§3.5), and CSS `scroll-behavior: smooth` only under `prefers-reduced-motion: no-preference`.
- **Keyboard and focus scrolling:** Lenis doesn't intercept Space, PageDown, arrows or Tab focus scrolling. Those stay native, and Lenis syncs from the native scroll event. Verify that tabbing into the runner below a pin does not jump into the pin spacer, and add `scroll-margin-top` on the runner.
- **Menu open:** `lenis.stop()`; close: `lenis.start()`.
- **Fonts:** `document.fonts.ready.then(() => ScrollTrigger.refresh())`, because a font swap changes heights and the pin positions depend on them.

### 7.11 Required changes to `src/lib/motion.ts` and `Motion.astro`
1. **Make it lazy.** `Motion.astro` currently imports `initMotion` statically, so about 51 KB gz downloads and runs on every page load and device. Replace it with a tiny loader: a media-query gate (§7.1), then `requestIdleCallback` (fallback `setTimeout(…, 1200)`) or first-interaction `import('../../lib/motion')`. Also listen for the gate query to start matching later (resize, or reduced motion turned off) and load then.
2. **Teardown must revert animations, not only Lenis.** `destroy()` kills Lenis but leaves ScrollTriggers, pin spacers and inline styles. Wrap all section setups in one `gsap.matchMedia()` (or `gsap.context`) owned by `motion.ts`, and call `mm.revert()` in `destroy()`.
3. **Add a registration API** so sections don't import GSAP eagerly: for example, `onMotion((m) => { /* setup */ return cleanup; })`. It queues callbacks until the chunk loads, or dispatches a `motion:ready` event.
4. **Add** `ScrollTrigger.config({ ignoreMobileResize: true })` and the fonts-ready refresh.
5. **Add** the anchor/focus helper from §7.10 (exported `scrollToTarget(el)`), plus `stop()`/`start()` passthroughs for the menu.
6. Keep `lagSmoothing(0)` and the GSAP-ticker-driven Lenis; both are correct. `lenis/dist/lenis.css` stays (513 B), loaded with the chunk.

---

## 8. SEO and OG visual spec

### 8.1 OG image (1200×630, PNG, generated at build)
**Home variant** (`/og/home.png`)
- Background `#111110` (ink, both themes).
- 12-col hairline grid at 1px `#2c2c2a`, with 80px outer margins and "+" crosshairs at 4 intersections.
- Top-left, mono 22px `#8f8d85`: `ai.farazahmad.dev`.
- Headline in Clash Display 600, 84px, `#f2f1ec`, tracking −0.03em, max 3 lines, cols 1–8: "AI automations that survive production."
- Right side (cols 8–12): a 5-node schematic with 1px `#787670` nodes and mono labels. The last node has a lime `#D4FF3A` 10px dot plus "running". One lime packet sits on the last edge. **Lime appears only there**, under 3% of the image.
- Bottom-left: "Faraz Ahmad" in Clash 600, 40px, with mono `#b8b6ad` 22px beside it: "Book a scoping call".
- Safe zone: keep text 80px from every edge (platform crops).

**Case variant** (`/og/<slug>.png`)
- Same frame. Eyebrow `CASE STUDY · 0n`. Headline = the case name in Clash 96px. The angle line (from §5.5) in Geist 32px `#b8b6ad`, max 2 lines.
- Bottom-right: a metric only if it is real. Otherwise show the case's schematic. **Never print "TODO" on an OG image**, because social networks cache it. For Lead Drift, print the `● In production` pill.

**Generation:** `src/pages/og/[slug].png.ts` using `satori` + `@resvg/resvg-js` at build time, so nothing ships to the client. Satori needs TTF, OTF or WOFF (not woff2), so keep build-only TTF copies of Clash Display 600, Geist 400/600 and JetBrains Mono 400 outside `public/`. Pass `image` to `<SEO>` (the prop already exists).

### 8.2 Favicon
- 32×32 SVG: an ink `#111110` square with radius 6, two 6px nodes joined by a 2px bone wire on a 45° step, and the right node lime. It reads as "signal" at 16px.
- Also: `apple-touch-icon` 180×180 PNG (same mark, 24px padding) and a `theme-color` meta per theme.
- **Issue:** `public/favicon.svg` is shared by every niche (the layout links `/favicon.svg`). Use a niche-specific path such as `/ai/favicon.svg`, served correctly per subdomain, or an imported asset in `src/assets/ai/`. See Open questions.

### 8.3 Titles and descriptions (counted)

| Page | Title (≤ 60) | Chars | Description (≤ 155) | Chars |
|---|---|---|---|---|
| Home | AI Automation Developer: n8n, Make, Zapier \| Faraz Ahmad | 56 | AI automation developer for n8n, Make, Zapier and custom AI agents. I build new systems and fix broken automations. Fixed scope, monitored, yours. | 146 |
| `/work/lead-drift/` | Lead Drift: AI Lead Automation in Production \| Faraz Ahmad | 58 | Case study: Lead Drift, Indepth Solution's own growth engine, running in production. Outreach and lead automation, built end to end. | 132 |
| `/work/yard-terminal/` | Yard Terminal: AI Multi-Marketplace Selling \| Faraz Ahmad | 57 | Case study: Yard Terminal, AI that runs selling across eBay, Shopify, Amazon, Google and Facebook. Custom code where no-code hits its limits. | 141 |
| `/work/solidmake/` | SolidMake: AI Agent Turns Text into CAD \| Faraz Ahmad | 53 | Case study: SolidMake, custom AI that turns a text description into a CAD model (STEP file). AI agent development beyond no-code tools. | 135 |
| `/work/ai-seo-automator/` | AI SEO Automator: AI Content Pipeline \| Faraz Ahmad | 51 | Case study: AI SEO Automator, an AI content and SEO pipeline built as custom automation. The baseline, the build, the stack and the result. | 139 |

Counts are JS `.length` with the separator as written (`|`, single spaces).

**Intent coverage**
- "AI automation developer": home title and description.
- "n8n / Make / Zapier": home title.
- "fix broken automation": home description.
- "AI agent development": SolidMake and the home description ("custom AI agents").

Add `Person` + `ProfessionalService` JSON-LD on home, `FAQPage` on home, and `Article` + `BreadcrumbList` on case pages. Leave `noindex: true` in `src/niches.ts` until launch, and flip it per the global decision "go live as each niche is ready".

---

## 9. QA checklist (design acceptance)
- **Widths:** 360 / 390 / 768 / 1024 / 1440 / 1920. No horizontal scroll (test with `document.documentElement.scrollWidth === innerWidth`), including long mono log lines and stack rows.
- **Touch targets:** all ≥ 44×44, with ≥ 8px gaps between targets. Every hover has a focus-visible twin, and touch has press states.
- **Both themes:** check each section in light and in dark. Consoles stay ink. No lime on bone (grep CSS for `--accent` used outside `.theme-ink` or the button rules).
- **Reduced motion:** the live workflow is complete and readable, the checklist is ticked, the hero graph is static, and there are no packets.
- **JS disabled:** all of the above is also true, the FAQ works, and the form posts.
- **Lighthouse mobile:** Performance ≥ 90; A11y, BP and SEO 100; LCP element = the h1; CLS < 0.05 (check font swap on the h1 at 360 and 390).
- **TODO list:** generated, and nothing invented anywhere (search copy for digits and verify each one).

---

## 10. Open questions and risks for the owner
1. **Real Lead Drift steps and tools.** `WORKFLOW_STEPS` is placeholder (labels follow the brief's `trigger → enrich → classify → route → notify`). I need the real anonymized step names, the tool per step, and confirmation that showing an error path (retry → human review) is fair to illustrate. The runner's error path is presented as a simulation.
2. **Clash Display licensing.** It comes from Fontshare (ITF Free Font License), not npm. Self-hosting the woff2 on the site is the normal use, but committing the file to a *public* git repo can count as redistribution. Confirm whether the repo is public; if it is, keep the font out of git and fetch it at build time, or read the FFL terms. Geist and JetBrains Mono are OFL, so there is no issue.
3. **Case numbers, baselines, client types and per-case stack.** All are TODO. Also confirm that "Indepth Solution" is the correct public name and that it may be named on the case page and the OG image.
4. **Contact fallback email mismatch.** `ContactForm.astro` falls back to `hello@farazahmad.dev` unless `PUBLIC_CONTACT_EMAIL` is set. The decision says `farazahmad31048@gmail.com`. Set the env var (or change the default) before launch.
5. **Shared favicon.** `public/favicon.svg` serves every niche. A per-niche favicon needs a per-niche path (a routing question for `gen:vercel`).
6. **OG generation.** It needs build-only dev dependencies (`satori`, `@resvg/resvg-js`) and TTF copies of the fonts. Approve, or I'll spec hand-exported static PNGs instead.
7. **Brief items I deliberately left out pending your OK:**
   - "Audit fee credited toward a build" (a policy statement, even without a price).
   - The proof-strip stat "hours saved for clients / month" (keep it only if you can measure it).
8. **FAQ #5 states provider policy** ("API data isn't used for training by default"). Re-verify OpenAI's and Anthropic's current terms at launch.
9. **About facts:** years building, location / time zone, and the headshot (4:5, plain background).
10. **Assumption:** the "Me" column wording "Weeks, with working demos along the way" and Process "Weeks, not months" come from the brief's approved vocabulary. Remove them if typical builds can run longer.

**Fallback-metric method (for re-measurement):** parse the shipped TTF's `head.unitsPerEm`, `OS/2` typo metrics (Clash sets USE_TYPO_METRICS) and `hmtx` advances for a–z plus space. Weight them by English character frequency (capsize weights), divide by Arial's weighted average (913/2048), and the result is `size-adjust`. Then `ascent-override = ascent / UPM / size-adjust` (and the same for descent and line gap). The one-off script used here is `calc.mjs` in the session scratchpad; it is not part of the repo.
