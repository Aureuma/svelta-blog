import { getAllPosts, getCategories, pickHero } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 8;

export const load: PageServerLoad = async ({ url }) => {
	const [all, categories] = await Promise.all([getAllPosts(), getCategories()]);
	const hero = await pickHero(all);

	const selected = url.searchParams.get('category') ?? '';
	const validSelected = selected && categories.some((c) => c.slug === selected) ? selected : '';

	const rest = all.filter((p) => p.slug !== hero.slug);
	const filtered = validSelected ? rest.filter((p) => p.category.slug === validSelected) : rest;

	const initialPosts = filtered.slice(0, PAGE_SIZE);

	return {
		hero,
		categories,
		selectedCategory: validSelected,
		initialPosts,
		pageSize: PAGE_SIZE,
		hasMore: filtered.length > initialPosts.length,
		total: filtered.length
	};
};

