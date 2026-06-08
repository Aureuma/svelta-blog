import { slugify } from '$lib/server/slugify';
import { getAllPosts, getAllTags } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [tags, posts] = await Promise.all([getAllTags(), getAllPosts()]);
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tagName of post.tags) {
			const tagSlug = slugify(tagName);
			counts.set(tagSlug, (counts.get(tagSlug) ?? 0) + 1);
		}
	}

	return {
		tags: tags.map((tag) => ({
			...tag,
			count: counts.get(tag.slug) ?? 0
		}))
	};
};
