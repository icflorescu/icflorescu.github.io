import type { APIRoute } from 'astro';
import { PROJECT_SITEMAPS, SITE_URL } from '../data/site';

// Crawlers only read robots.txt from the root of a host, so this file also covers every project docs site
// under icflorescu.github.io/<project>/: allow everything, and announce their sitemaps alongside this one.
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${SITE_URL}sitemap.xml`,
      ...PROJECT_SITEMAPS.map((url) => `Sitemap: ${url}`),
      '',
    ].join('\n'),
    { headers: { 'content-type': 'text/plain; charset=utf-8' } }
  );
