import type { APIRoute, GetStaticPaths } from 'astro';
import { OG_TARGETS, renderOg, type OgTarget } from '../../../lib/cloud/og';

// /og/home.png and /og/<case-slug>.png on the cloud subdomain.
export const getStaticPaths = (() => OG_TARGETS.map((slug) => ({ params: { slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const png = await renderOg(params.slug as OgTarget);
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
};
