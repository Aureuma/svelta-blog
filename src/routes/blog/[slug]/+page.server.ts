import { getAllPosts, getPostBySlug } from '$lib/server/blog';
import { buildPostSeo } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const found = await getPostBySlug(params.slug);
	if (!found) throw error(404, 'Post not found');

	const { component, ...post } = found;
	const rendered = render(component);

	const all = await getAllPosts();
	const candidates = all.filter((p) => p.slug !== post.slug);

	const sameCategory = candidates.filter((p) => p.category.slug === post.category.slug);
	const morePosts: typeof candidates = [];

	for (const p of sameCategory) {
		if (morePosts.length >= 2) break;
		morePosts.push(p);
	}
	for (const p of candidates) {
		if (morePosts.length >= 2) break;
		if (morePosts.some((x) => x.slug === p.slug)) continue;
		morePosts.push(p);
	}

	const canonicalUrl = new URL(`/blog/${post.slug}`, url).toString();

	return {
		post,
		contentHtml: rendered.html,
		morePosts,
		canonicalUrl,
		seo: buildPostSeo(post, canonicalUrl)
	};
};
