import type { APIRoute } from 'astro';
import { sitemapResponse } from '../../lib/seo-files';
import { CASE_SLUGS } from '../../data/seo/cases';

// Static pages come from the folder; the case pages are a dynamic route, so they are listed
// explicitly from the same slug list that generates them.
const pages = import.meta.glob('./**/*.astro');
const casePaths = CASE_SLUGS.map((slug) => `/work/${slug}/`);

export const GET: APIRoute = () => sitemapResponse('seo', Object.keys(pages), casePaths);