import type { BlogPost } from '$lib/types/blog';

function escapeXml(input: string) {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function toPubDate(iso: string) {
	const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
	return d.toUTCString();
}

export function buildRss(opts: {
	baseUrl: URL;
	posts: BlogPost[];
	siteTitle: string;
	description: string;
	maxItems?: number;
}) {
	const siteLink = new URL('/blog', opts.baseUrl).toString();
	const selfLink = new URL('/feed.xml', opts.baseUrl).toString();
	const maxItems = Math.max(1, Math.min(200, opts.maxItems ?? 50));

	const items = opts.posts
		.slice(0, maxItems)
		.map((post) => {
			const link = new URL(`/blog/${post.slug}`, opts.baseUrl).toString();
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

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(opts.siteTitle)}</title>
    <link>${escapeXml(siteLink)}</link>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(opts.description)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;
}

