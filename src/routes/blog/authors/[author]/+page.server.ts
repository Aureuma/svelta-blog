import { getAuthorSummaries, getPostsByAuthor } from '$lib/server/blog';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [authors, posts] = await Promise.all([getAuthorSummaries(), getPostsByAuthor(params.author)]);
	const authorSummary = authors.find((item) => item.author.id === params.author);
	if (!authorSummary || posts.length === 0) throw error(404, 'Author not found');

	return {
		authorSummary,
		posts
	};
};
