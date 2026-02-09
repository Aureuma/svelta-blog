import { getAllPosts } from '$lib/server/blog';
import type { RequestHandler } from './$types';

function escapeXml(input: string) {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function toPubDate(iso: string) {
	const d = /^\\d{4}-\\d{2}-\\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
	return d.toUTCString();
}

export const GET: RequestHandler = async ({ url }) => {
	const posts = await getAllPosts();

	const siteTitle = 'Convelt Blog';
	const siteLink = new URL('/blog', url).toString();
	const selfLink = new URL('/feed.xml', url).toString();
	const description = 'Engineering, design, and product notes from Convelt.';

	const items = posts
		.slice(0, 50)
		.map((post) => {
			const link = new URL(`/blog/${post.slug}`, url).toString();
			return [
				'<item>',
				`<title>${escapeXml(post.title)}</title>`,
				`<description>${escapeXml(post.excerpt)}</description>`,
				`<link>${escapeXml(link)}</link>`,
				`<guid isPermaLink="true">${escapeXml(link)}</guid>`,
				`<pubDate>${escapeXml(toPubDate(post.date))}</pubDate>`,
				`<category>${escapeXml(post.category.label)}</category>`,
				`<author>${escapeXml(post.author.name)}</author>`,
				'</item>'
			].join('');
		})
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(siteLink)}</link>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': 'max-age=0, s-maxage=3600'
		}
	});
};

