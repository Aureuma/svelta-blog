import { getAllPosts, getAllTags, pickHero } from '$lib/server/blog';
import { slugify } from '$lib/server/slugify';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 24;

export const GET: RequestHandler = async ({ url }) => {
	const offset = Math.max(0, Number.parseInt(url.searchParams.get('offset') ?? '0', 10) || 0);
	const limitRaw =
		Number.parseInt(url.searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
	const limit = Math.min(MAX_LIMIT, Math.max(1, limitRaw));

	const [all, tags] = await Promise.all([getAllPosts(), getAllTags()]);
	const hero = await pickHero(all);

	const requestedTag = url.searchParams.get('tag') ?? '';
	const selectedTag = requestedTag && tags.some((tag) => tag.slug === requestedTag) ? requestedTag : '';

	const rest = all.filter((p) => p.slug !== hero.slug);
	const filtered = selectedTag
		? rest.filter((post) => post.tags.some((tagName) => slugify(tagName) === selectedTag))
		: rest;
	const posts = filtered.slice(offset, offset + limit);

	return json({
		posts,
		hasMore: filtered.length > offset + posts.length
	});
};
