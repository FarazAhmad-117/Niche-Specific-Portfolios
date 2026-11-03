import type { APIRoute } from 'astro';
import { faviconSvg } from '../../lib/all/brand-mark';

// Served at /icon.svg on the all subdomain (public/favicon.svg is shared by every niche).
export const GET: APIRoute = () =>
  new Response(faviconSvg(), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
