import { getAuthor } from '$lib/content/authors';
import type { BlogCategory, BlogPost, BlogPostFull } from '$lib/types/blog';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';

const frontmatterSchema = z.object({
	title: z.string(),
	date: z.string(),
	category: z.string(),
	author: z.string(),
	cover: z.string(),
	excerpt: z.string().optional(),
	summaryAI: z.string().optional(),
	tags: z.array(z.string()).optional(),
	featured: z.boolean().optional(),
	draft: z.boolean().optional()
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

const CATEGORY_ORDER = [
	'all',
	'ai-trends',
	'announcements',
	'for-founders',
	'engineering',
	'design',
	'best-practices'
];

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeCategory(label: string): BlogCategory {
	const slug = slugify(label);
	return { label, slug };
}

function parseISODate(date: string): Date {
	// Prefer stable UTC parsing for YYYY-MM-DD.
	if (/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
		const d = new Date(`${date}T00:00:00Z`);
		if (!Number.isNaN(d.getTime())) return d;
	}
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
	return d;
}

const fmtLong = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});
const fmtShort = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

function stripForExcerpt(markdown: string): string {
	return (
		markdown
			// remove fenced code blocks
			.replace(/```[\s\S]*?```/g, '')
			// remove images
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
			// remove links but keep text
			.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
			// remove headings markers
			.replace(/^#{1,6}\s+/gm, '')
			// remove blockquote markers
			.replace(/^>\s+/gm, '')
			// remove emphasis markers
			.replace(/[*_`]/g, '')
			// collapse whitespace
			.replace(/\s+/g, ' ')
			.trim()
	);
}

function excerptFromContent(content: string): string {
	const text = stripForExcerpt(content);
	if (!text) return '';
	return text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text;
}

function minutesToLabels(minutes: number) {
	const m = Math.max(1, Math.round(minutes));
	const unit = m === 1 ? 'minute' : 'minutes';
	return {
		minutes: m,
		short: `${m} min read`,
		long: `${m} ${unit} read`
	};
}

const compiledModules = import.meta.glob('/src/content/blog/*.md');
const rawModules = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default'
});

type CompiledModule = {
	default: BlogPostFull['component'];
};

let cachedIndex: BlogPostFull[] | null = null;

async function buildIndex(): Promise<BlogPostFull[]> {
	if (!import.meta.env.DEV && cachedIndex) return cachedIndex;

	const posts: BlogPostFull[] = [];
	const paths = Object.keys(compiledModules).sort();

	for (const path of paths) {
		const slug = path.split('/').pop()?.replace(/\.md$/, '');
		if (!slug) continue;

		const [compiled, raw] = await Promise.all([
			(compiledModules[path] as () => Promise<CompiledModule>)(),
			(rawModules[path] as () => Promise<string>)()
		]);

		const { data, content } = matter(raw);
		const metadata = frontmatterSchema.parse(data);
		if (metadata.draft) continue;

		const dateObj = parseISODate(metadata.date);
		const rt = minutesToLabels(readingTime(content).minutes);
		const category = normalizeCategory(metadata.category);

		const excerpt = metadata.excerpt?.trim() || excerptFromContent(content);

		posts.push({
			slug,
			title: metadata.title.trim(),
			excerpt,
			category,
			tags: metadata.tags ?? [],
			author: getAuthor(metadata.author),
			date: metadata.date,
			dateLong: fmtLong.format(dateObj),
			dateShort: fmtShort.format(dateObj),
			readingMinutes: rt.minutes,
			readingTimeShort: rt.short,
			readingTimeLong: rt.long,
			cover: metadata.cover,
			summaryAI: metadata.summaryAI,
			featured: Boolean(metadata.featured),
			component: compiled.default
		});
	}

	posts.sort((a, b) => parseISODate(b.date).getTime() - parseISODate(a.date).getTime());

	if (!import.meta.env.DEV) cachedIndex = posts;
	return posts;
}

export async function getAllPosts(): Promise<BlogPost[]> {
	const full = await buildIndex();
	return full.map(({ component: _c, ...rest }) => rest);
}

export async function getAllPostsFull(): Promise<BlogPostFull[]> {
	return buildIndex();
}

export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
	const posts = await buildIndex();
	return posts.find((p) => p.slug === slug) ?? null;
}

export async function getCategories(): Promise<BlogCategory[]> {
	const posts = await getAllPosts();
	const map = new Map<string, string>();

	for (const p of posts) {
		map.set(p.category.slug, p.category.label);
	}

	const categories = Array.from(map.entries())
		.map(([slug, label]) => ({ slug, label }))
		.sort((a, b) => {
			const ai = CATEGORY_ORDER.indexOf(a.slug);
			const bi = CATEGORY_ORDER.indexOf(b.slug);
			if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
			if (ai === -1) return 1;
			if (bi === -1) return -1;
			return ai - bi;
		});

	return categories;
}

export async function pickHero(posts?: BlogPost[]): Promise<BlogPost> {
	const list = posts ?? (await getAllPosts());
	const featured = list.filter((p) => p.featured);
	return (featured[0] ?? list[0])!;
}
