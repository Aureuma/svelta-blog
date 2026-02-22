import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from '$lib/server/blog';
import { buildPostSeo } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const found = await getPostBySlug(params.slug);
	if (!found) throw error(404, 'Post not found');

	const { component, ...post } = found;
	const rendered = render(component);
	const [adjacent, morePosts] = await Promise.all([
		getAdjacentPosts(post.slug),
		getRelatedPosts(post.slug, 2)
	]);

	const canonicalUrl = new URL(`/blog/${post.slug}`, url).toString();

	return {
		post,
		contentHtml: rendered.html,
		morePosts,
		adjacent,
		canonicalUrl,
		seo: buildPostSeo(post, canonicalUrl)
	};
};
