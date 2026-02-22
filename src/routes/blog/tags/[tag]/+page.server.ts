import { getAllTags, getPostsByTag } from '$lib/server/blog';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [tags, posts] = await Promise.all([getAllTags(), getPostsByTag(params.tag)]);
	const tag = tags.find((t) => t.slug === params.tag);
	if (!tag || posts.length === 0) throw error(404, 'Tag not found');

	return {
		tag,
		posts,
		allTags: tags
	};
};
