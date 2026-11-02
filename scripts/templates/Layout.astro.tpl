---
import SEO from '../../components/shared/SEO.astro';
import { createLink } from '../../lib/link';
import { getNiche } from '../../niches';

interface Props {
  title: string;
  description: string;
  /** Path on the subdomain; defaults to the current page. */
  path?: string;
  noindex?: boolean;
}

const { title, description, path, noindex } = Astro.props;

const niche = '{{slug}}' as const;
const link = createLink(niche);
const { name } = getNiche(niche);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <SEO niche={niche} title={title} description={description} path={path} noindex={noindex} />
  </head>
  <body>
    <div class="shell">
      <header class="bar">
        <a class="brand" href={link('/')}>{name}</a>
      </header>
      <main>
        <slot />
      </main>
      <footer class="foot">© {new Date().getFullYear()} Faraz Ahmad</footer>
    </div>
    
  </body>
</html>

<style>
  /* Placeholder tokens: replace with the real design for this niche. */
  body {
    margin: 0;
    background: hsl({{hue}} 30% 8%);
  }
  .shell {
    --bg: hsl({{hue}} 30% 8%);
    --fg: hsl({{hue}} 20% 94%);
    --muted: hsl({{hue}} 10% 70%);
    --accent: hsl({{hue}} 85% 62%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--fg);
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }
  .shell :global(*) {
    box-sizing: border-box;
  }
  main {
    flex: 1;
  }
  .bar,
  .foot {
    padding: 1rem clamp(1rem, 4vw, 3rem);
  }
  .brand {
    color: var(--accent);
    font-weight: 700;
    text-decoration: none;
  }
  .foot {
    color: var(--muted);
    font-size: 0.875rem;
  }
</style>
