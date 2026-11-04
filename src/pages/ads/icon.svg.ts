import type { APIRoute } from 'astro';
import { faviconSvg } from '../../lib/ads/brand-mark';

// Served at /icon.svg on the ads subdomain (the root /favicon.svg, src/pages/favicon.svg.ts, is shared by every niche).
export const GET: APIRoute = () =>
  new Response(faviconSvg(), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
