import { json } from '@sveltejs/kit';
import { getAllTags, getAuthorSummaries } from '$lib/server/blog';
import { getAllSeries } from '$lib/server/blog-intelligence';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const [tags, authors, series] = await Promise.all([getAllTags(), getAuthorSummaries(), getAllSeries()]);

	return json(
		{
			primary: [
				{ label: 'Blog', href: new URL('/blog', url).toString() },
				{ label: 'Search', href: new URL('/blog/search', url).toString() },
				{ label: 'Tags', href: new URL('/blog/tags', url).toString() },
				{ label: 'Archive', href: new URL('/blog/archive', url).toString() },
				{ label: 'Authors', href: new URL('/blog/authors', url).toString() },
				{ label: 'Series', href: new URL('/blog/series', url).toString() }
			],
			tags: tags.map((tag) => ({
				...tag,
				href: new URL(`/blog/tags/${tag.slug}`, url).toString()
			})),
			authors: authors.map((item) => ({
				...item,
				href: new URL(`/blog/authors/${item.author.id}`, url).toString()
			})),
			series: series.map((item) => ({
				id: item.id,
				title: item.title,
				description: item.description,
				postCount: item.posts.length,
				href: new URL(`/blog/series/${item.id}`, url).toString()
			}))
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
