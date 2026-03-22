import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(
		{
			id: '/',
			name: 'svelta-blog',
			short_name: 'svelta-blog',
			description:
				'A focused markdown blog with search, feeds, author pages, archive views, and durable discovery primitives.',
			start_url: '/',
			scope: '/',
			display: 'standalone',
			background_color: '#0b1513',
			theme_color: '#0f766e',
			categories: ['blog', 'developer', 'technology'],
			prefer_related_applications: false,
			shortcuts: [
				{
					name: 'Search blog',
					short_name: 'Search',
					url: '/blog/search'
				},
				{
					name: 'Browse series',
					short_name: 'Series',
					url: '/blog/series'
				},
				{
					name: 'RSS feed',
					short_name: 'Feed',
					url: '/feed.xml'
				}
			]
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
