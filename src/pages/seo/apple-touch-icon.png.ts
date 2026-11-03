import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { touchIconSvg } from '../../lib/seo/brand-mark';

export const GET: APIRoute = () => {
  const png = new Resvg(touchIconSvg(180, 28), { fitTo: { mode: 'width', value: 180 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};