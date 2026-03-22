import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(
		{
			name: 'svelta-blog',
			search: {
				page: '/blog/search',
				index: '/blog/search.json'
			},
			feeds: {
				rss: '/feed.xml',
				json: '/feed.json'
			},
			discovery: {
				sitemap: '/sitemap.xml',
				robots: '/robots.txt',
				llms: '/llms.txt',
				opensearch: '/blog/opensearch.xml',
				manifest: '/manifest.webmanifest'
			},
			registries: {
				navigation: '/blog/navigation.json',
				tags: '/blog/tags.json',
				authors: '/blog/authors.json',
				series: '/blog/series.json'
			}
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
