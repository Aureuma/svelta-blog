import { createBlog } from '@aureuma/svelta/server';
import { getAuthor } from '$lib/content/authors';
import { blogSetup } from '$lib/config/blog';
import type { BlogPostFull } from '$lib/types/blog';

type CompiledModule = { default: BlogPostFull['component'] };

const compiledModules = import.meta.glob('/src/content/blog/*.md') as Record<
	string,
	() => Promise<CompiledModule>
>;
const rawModules = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

export const blog = createBlog({
	compiledModules,
	rawModules,
	getAuthor,
	allowMultipleTags: blogSetup.allowMultipleTags
});

export const {
	getAllPosts,
	getAllPostsFull,
	getPostBySlug,
	getCategories,
	pickHero,
	getAllTags,
	getPostsByTag,
	getPostsByAuthor,
	getAllAuthors,
	getAuthorSummaries,
	getArchiveGroups,
	getAdjacentPosts,
	getRelatedPosts
} = blog;
