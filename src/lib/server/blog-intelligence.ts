import matter from 'gray-matter';
import { getAllPosts } from '$lib/server/blog';
import type { BlogPost } from '$lib/types/blog';

export type BlogSeries = {
	id: string;
	title: string;
	description: string;
	posts: BlogPost[];
};

const rawModules = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

function slugFromModulePath(path: string): string | null {
	const normalized = path.replace(/\\/g, '/');
	const match = normalized.match(/\/src\/content\/blog\/(.+?)\.md$/i);
	return match?.[1] ?? null;
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function parseSeries(value: unknown): { id: string; title: string; description: string } | null {
	if (typeof value === 'string' && value.trim()) {
		return {
			id: slugify(value),
			title: value.trim(),
			description: ''
		};
	}

	if (value && typeof value === 'object') {
		const entry = value as Record<string, unknown>;
		const title = typeof entry.title === 'string' && entry.title.trim() ? entry.title.trim() : '';
		const id =
			typeof entry.id === 'string' && entry.id.trim()
				? slugify(entry.id)
				: title
					? slugify(title)
					: '';
		if (!id || !title) return null;
		return {
			id,
			title,
			description: typeof entry.description === 'string' && entry.description.trim() ? entry.description.trim() : ''
		};
	}

	return null;
}

async function getSeriesMetaBySlug(): Promise<Map<string, { id: string; title: string; description: string }>> {
	const entries = await Promise.all(
		Object.entries(rawModules).map(async ([path, load]) => {
			const slug = slugFromModulePath(path);
			if (!slug) return null;
			const raw = await load();
			const parsed = matter(raw);
			const series = parseSeries(parsed.data.series);
			return series ? ([slug, series] as const) : null;
		})
	);

	return new Map(entries.filter((entry): entry is readonly [string, { id: string; title: string; description: string }] => Boolean(entry)));
}

export async function getAllSeries(): Promise<BlogSeries[]> {
	const [posts, metaBySlug] = await Promise.all([getAllPosts(), getSeriesMetaBySlug()]);
	const grouped = new Map<string, { title: string; description: string; posts: BlogPost[] }>();

	for (const post of posts) {
		const meta = metaBySlug.get(post.slug);
		if (!meta) continue;
		const current = grouped.get(meta.id) ?? { title: meta.title, description: meta.description, posts: [] };
		current.posts.push(post);
		grouped.set(meta.id, current);
	}

	return Array.from(grouped.entries())
		.map(([id, group]) => ({
			id,
			title: group.title,
			description: group.description,
			posts: [...group.posts].sort((a, b) => a.date.localeCompare(b.date))
		}))
		.filter((series) => series.posts.length > 1);
}

export async function getSeriesById(id: string): Promise<BlogSeries | null> {
	const series = await getAllSeries();
	return series.find((entry) => entry.id === id) ?? null;
}

export async function getSeriesForSlug(slug: string): Promise<BlogSeries | null> {
	const series = await getAllSeries();
	return series.find((entry) => entry.posts.some((post) => post.slug === slug)) ?? null;
}

export async function getEnhancedRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
	const [posts, series] = await Promise.all([getAllPosts(), getSeriesForSlug(slug)]);
	const current = posts.find((post) => post.slug === slug);
	if (!current) return [];

	const seriesPostSlugs = new Set(series?.posts.map((post) => post.slug) ?? []);

	return posts
		.filter((post) => post.slug !== slug)
		.map((post) => {
			const sharedTags = post.tags.filter((tag) => current.tags.includes(tag)).length;
			const score =
				(post.category.slug === current.category.slug ? 40 : 0) +
				(post.author.id === current.author.id ? 12 : 0) +
				sharedTags * 14 +
				(seriesPostSlugs.has(post.slug) ? 120 : 0) +
				(post.featured ? 2 : 0);
			return { post, score };
		})
		.sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
		.slice(0, limit)
		.map((entry) => entry.post);
}
