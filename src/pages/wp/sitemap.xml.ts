import type { APIRoute } from 'astro';
import { sitemapResponse } from '../../lib/seo-files';
import { CASE_SLUGS } from '../../data/wp/cases';

// Every static page in this niche's folder ends up in the sitemap, plus the case pages.
const pages = import.meta.glob('./**/*.astro');

export const GET: APIRoute = () =>
  sitemapResponse('wp', Object.keys(pages), CASE_SLUGS.map((s) => `/work/${s}/`));
