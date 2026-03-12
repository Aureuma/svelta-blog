import { getAllPosts, getAllTags, pickHero } from '$lib/server/blog';
import { blogSetup } from '$lib/config/blog';
import { slugify } from '$lib/server/slugify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const [all, tags] = await Promise.all([getAllPosts(), getAllTags()]);
	const hero = await pickHero(all);

	const selected = url.searchParams.get('tag') ?? '';
	const validSelected = selected && tags.some((tag) => tag.slug === selected) ? selected : '';
	const tabTags = tags.map((tag) => ({ label: tag.name, slug: tag.slug }));

	const rest = all.filter((p) => p.slug !== hero.slug);
	const filtered = validSelected
		? rest.filter((p) => p.tags.some((tagName) => slugify(tagName) === validSelected))
		: rest;
	const initialPosts = filtered.slice(0, blogSetup.pageSize);

	return {
		hero,
		tags: tabTags,
		selectedTag: validSelected,
		allPosts: filtered,
		initialPosts,
		pageSize: blogSetup.pageSize,
		showRss: blogSetup.showRss,
		hasMore: filtered.length > initialPosts.length
	};
};
