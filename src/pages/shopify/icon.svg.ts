import type { APIRoute } from 'astro';
import { faviconSvg } from '../../lib/shopify/brand-mark';

// Served at /icon.svg on the shopify subdomain (the root /favicon.svg, src/pages/favicon.svg.ts, is shared by every niche).
export const GET: APIRoute = () =>
  new Response(faviconSvg(), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
