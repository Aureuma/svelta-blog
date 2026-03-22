import { getAllPosts, getPostBySlug, getPostsByAuthor } from '$lib/server/blog';
import { extractBlogHeadings } from '$lib/server/blog-headings';
import { getEnhancedRelatedPosts, getSeriesForSlug } from '$lib/server/blog-intelligence';
import { buildPostSeo } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const found = await getPostBySlug(params.slug);
	if (!found) throw error(404, 'Post not found');

	const { component, ...post } = found;
	const rendered = render(component);
	const contentHtml = rendered.html;
	const [morePosts, allPosts, series, authorPosts] = await Promise.all([
		getEnhancedRelatedPosts(post.slug, 3),
		getAllPosts(),
		getSeriesForSlug(post.slug),
		getPostsByAuthor(post.author.id)
	]);
	const index = allPosts.findIndex((entry) => entry.slug === post.slug);
	const canonicalUrl = new URL(`/blog/${post.slug}`, url).toString();

	return {
		post,
		contentHtml,
		morePosts,
		series,
		moreFromAuthor: authorPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3),
		toc: extractBlogHeadings(contentHtml),
		adjacent: {
			previous: index === -1 ? null : (allPosts[index + 1] ?? null),
			next: index <= 0 ? null : (allPosts[index - 1] ?? null)
		},
		canonicalUrl,
		seo: buildPostSeo(post, canonicalUrl)
	};
};
