import { defineMiddleware } from 'astro:middleware';

// Every link to another site (any absolute http(s) URL, the project docs sites under this host included) opens in a
// new tab. Done once here, at build time, rather than on each link: new links get it without anyone remembering to.
// Links that set their own target are skipped (the résumé download uses target="_self").
// In-page (#…) and root (/) links, and the mailto: link the email button builds in the browser, are left alone.
const EXTERNAL_LINK = /<a\b(?=[^>]*\shref="https?:\/\/)(?![^>]*\starget=)[^>]*>/g;

const openInNewTab = (tag: string) => {
  const withTarget = tag.replace(/^<a\b/, '<a target="_blank"');
  return /\srel="/.test(withTarget)
    ? withTarget.replace(/\srel="([^"]*)"/, (_, rel: string) => ` rel="${rel} noopener"`)
    : withTarget.replace(/^<a\b/, '<a rel="noopener"');
};

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.startsWith('text/html')) return response;
  const html = (await response.text()).replace(EXTERNAL_LINK, openInNewTab);
  return new Response(html, { status: response.status, headers: response.headers });
});
