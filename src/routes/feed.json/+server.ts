import { getAllPosts } from '$lib/server/blog';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const posts = await getAllPosts();
	const feedUrl = new URL('/feed.json', url).toString();
	const homePageUrl = new URL('/blog', url).toString();

	return json(
		{
			version: 'https://jsonfeed.org/version/1.1',
			title: 'svelta Blog',
			home_page_url: homePageUrl,
			feed_url: feedUrl,
			description: 'Editorial publishing for Svelte teams.',
			items: posts.map((post) => ({
				id: new URL(`/blog/${post.slug}`, url).toString(),
				url: new URL(`/blog/${post.slug}`, url).toString(),
				title: post.title,
				summary: post.excerpt,
				image: new URL(post.cover, url).toString(),
				date_published: /^\d{4}-\d{2}-\d{2}$/.test(post.date)
					? `${post.date}T00:00:00.000Z`
					: new Date(post.date).toISOString(),
				tags: [post.category.label, ...post.tags],
				authors: [
					{
						name: post.author.name,
						url: new URL(`/blog/authors/${post.author.id}`, url).toString(),
						avatar: new URL(post.author.avatar, url).toString()
					}
				]
			}))
		},
		{
			headers: {
				'cache-control': 'public, max-age=3600'
			}
		}
	);
};
