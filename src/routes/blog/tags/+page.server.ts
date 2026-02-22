import { getAllPosts, getAllTags } from '$lib/server/blog';
import { slugify } from '$lib/server/slugify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) {
			const slug = slugify(tag);
			counts.set(slug, (counts.get(slug) ?? 0) + 1);
		}
	}

	const items = tags.map((tag) => ({
		...tag,
		count: counts.get(tag.slug) ?? 0
	}));

	return { items };
};
