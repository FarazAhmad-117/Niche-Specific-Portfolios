import type { APIRoute } from 'astro';
import { faviconSvg } from '../../lib/ai/brand-mark';

// Served at /icon.svg on the ai subdomain. the root /favicon.svg, src/pages/favicon.svg.ts, is shared by every
// niche and Vercel serves real files before rewrites, so this one has its own path.
export const GET: APIRoute = () =>
  new Response(faviconSvg(), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
