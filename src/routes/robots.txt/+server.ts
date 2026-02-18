import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/blog/site';

export const prerender = false;

export const GET: RequestHandler = async () => {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const body = [
    'User-agent: *',
    'Disallow: /dashboard',
    'Disallow: /login',
    'Disallow: /logout',
    `Sitemap: ${sitemapUrl}`,
    ''
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
