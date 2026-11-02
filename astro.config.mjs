// @ts-check
import { defineConfig } from 'astro/config';

// Static output. Every niche lives under /<slug>/ in the build; on production
// Vercel rewrites <slug>.farazahmad.dev/* to /<slug>/* (see vercel.json,
// generated from src/niches.ts).
export default defineConfig({
  output: 'static',
  // Keep in sync with "trailingSlash" in the generated vercel.json.
  trailingSlash: 'always',
  build: { format: 'directory' },
});
