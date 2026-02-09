import { createBlog } from '@aureuma/blogkit/server';
import { getAuthor } from '$lib/content/authors';
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
	getAuthor
});

export const { getAllPosts, getAllPostsFull, getPostBySlug, getCategories, pickHero } = blog;
