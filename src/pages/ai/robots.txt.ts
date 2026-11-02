import type { APIRoute } from 'astro';
import { robotsResponse } from '../../lib/seo-files';

export const GET: APIRoute = () => robotsResponse('ai');
