import { getAllPosts, getCategories, pickHero } from '$lib/server/blog';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 24;

export const GET: RequestHandler = async ({ url }) => {
	const offset = Math.max(0, Number.parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);
	const limitRaw =
		Number.parseInt(url.searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
	const limit = Math.min(MAX_LIMIT, Math.max(1, limitRaw));

	const [all, categories] = await Promise.all([getAllPosts(), getCategories()]);
	const hero = await pickHero(all);

	const requestedCategory = url.searchParams.get('category') ?? '';
	const category =
		requestedCategory && categories.some((c) => c.slug === requestedCategory)
			? requestedCategory
			: '';

	const rest = all.filter((p) => p.slug !== hero.slug);
	const filtered = category ? rest.filter((p) => p.category.slug === category) : rest;
	const posts = filtered.slice(offset, offset + limit);

	return json({
		posts,
		hasMore: filtered.length > offset + posts.length
	});
};

