import type { APIRoute } from 'astro';
import { PERSON } from '../person/person';

/**
 * The shared root favicon (/favicon.svg), used by the one 404 page every niche host serves.
 * The monogram is the owner's initials: the first letter of the first and of the last word of
 * src/person/config.ts › name ("Faraz Ahmad" → "FA"; a one-word name gives one letter).
 * Generated here instead of a file in public/ so a new owner's initials follow the config.
 */
const words = PERSON.name.trim().split(/\s+/);
const initials = [words[0], words.length > 1 ? words[words.length - 1] : '']
  .map((w) => [...w][0] ?? '')
  .join('')
  .toUpperCase()
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#111827"/>
  <text x="16" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#f9fafb">${initials}</text>
</svg>
`;

export const GET: APIRoute = () => new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
