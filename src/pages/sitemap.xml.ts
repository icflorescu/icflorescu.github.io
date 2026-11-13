import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

// The date of the last commit, so the weekly scheduled rebuild doesn't claim a change that didn't happen
// (search engines learn to ignore a lastmod that always moves). Falls back to today outside a git checkout.
function lastModified() {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs'], { encoding: 'utf8' }).trim() || today();
  } catch {
    return today();
  }
}
const today = () => new Date().toISOString().slice(0, 10);

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${lastModified()}</lastmod>
  </url>
</urlset>
`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } }
  );
