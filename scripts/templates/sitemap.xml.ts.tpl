import type { APIRoute } from 'astro';
import { sitemapResponse } from '../../lib/seo-files';

// Every static page in this niche's folder ends up in the sitemap.
const pages = import.meta.glob('./**/*.astro');

export const GET: APIRoute = () => sitemapResponse('{{slug}}', Object.keys(pages));
