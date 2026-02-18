import type { RequestHandler } from './$types';
import { getAllAuthors } from '$lib/blog/authors';
import { getAllPosts, getAllTags } from '$lib/blog/content';
import { SITE_URL } from '$lib/blog/site';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const prerender = false;

export const GET: RequestHandler = async () => {
  const baseUrl = SITE_URL;
  const [posts, authors, tags] = await Promise.all([
    getAllPosts(),
    getAllAuthors(),
    getAllTags()
  ]);

  const urls: Array<{ loc: string; lastmod: string | null }> = [
    { loc: `${baseUrl}/`, lastmod: null },
    { loc: `${baseUrl}/pricing`, lastmod: null },
    { loc: `${baseUrl}/blog`, lastmod: null }
  ];

  posts.forEach((post) => {
    urls.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString()
    });
  });

  authors.forEach((author) => {
    urls.push({ loc: `${baseUrl}/blog/author/${author.slug}`, lastmod: null });
  });

  tags.forEach((tag) => {
    urls.push({ loc: `${baseUrl}/blog/tag/${tag.slug}`, lastmod: null });
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${entry.lastmod}</lastmod>`
        : '';
      return `\n  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join('')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
