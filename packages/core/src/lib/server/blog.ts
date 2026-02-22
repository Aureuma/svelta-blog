import type {
	BlogAuthor,
	BlogCategory,
	BlogPost,
	BlogPostFull,
	BlogPostWithContent,
	BlogTag
} from '../types/blog';
import { DEV } from 'esm-env';
import matter from 'gray-matter';
import { marked } from 'marked';
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

export type BlogFrontmatter = z.infer<typeof frontmatterSchema>;

export type BlogFrontmatterAdapter = (args: {
	data: unknown;
	content: string;
	slug: string;
	path: string;
}) => BlogFrontmatter;

type CompiledModule = {
	default: BlogPostFull['component'];
};

export type BlogCreateConfig = {
	compiledModules: Record<string, () => Promise<CompiledModule>>;
	rawModules: Record<string, () => Promise<string>>;
	getAuthor: (id: string) => BlogAuthor;
	categoryOrder?: string[];
	// Optional adapter for apps with existing frontmatter schemas.
	mapFrontmatter?: BlogFrontmatterAdapter;
};

export type MarkdownRenderer = (markdown: string) => string | Promise<string>;

export type RawBlogCreateConfig = {
	rawModules: Record<string, () => Promise<string>>;
	getAuthor: (id: string) => BlogAuthor;
	categoryOrder?: string[];
	mapFrontmatter?: BlogFrontmatterAdapter;
	renderMarkdown?: MarkdownRenderer;
};

export type VivaImageAsset = {
	url: string;
	alt: string;
	width: number;
	height: number;
	credit: string;
	source: string;
};

export type VivaSeoFields = {
	title: string;
	description: string;
	keywords: string[];
};

export type VivaBlogFrontmatter = {
	title: string;
	description: string;
	slug: string;
	publishedAt: string;
	updatedAt: string;
	author: string;
	tags: string[];
	canonical: string;
	ogImage: VivaImageAsset;
	draft: boolean;
	seo: VivaSeoFields;
};

export type VivaAuthorFrontmatter = {
	name: string;
	slug: string;
	role: string;
	bio: string;
	interests: string[];
	canonical: string;
	avatar: VivaImageAsset;
	seo: VivaSeoFields;
};

export type VivaAuthorProfile = VivaAuthorFrontmatter & {
	html: string;
	raw: string;
};

const DEFAULT_CATEGORY_ORDER = [
	'all',
	'ai-trends',
	'announcements',
	'for-founders',
	'engineering',
	'design',
	'best-practices'
];

const vivaImageAssetSchema = z.object({
	url: z.string(),
	alt: z.string(),
	width: z.number(),
	height: z.number(),
	credit: z.string(),
	source: z.string()
});

const vivaSeoFieldsSchema = z.object({
	title: z.string(),
	description: z.string(),
	keywords: z.array(z.string())
});

const vivaDateField = z
	.union([z.string(), z.date()])
	.transform((value) => (value instanceof Date ? value.toISOString() : value));

const vivaBlogFrontmatterSchema = z.object({
	title: z.string(),
	description: z.string(),
	slug: z.string(),
	publishedAt: vivaDateField,
	updatedAt: vivaDateField,
	author: z.string(),
	tags: z.array(z.string()),
	canonical: z.string(),
	ogImage: vivaImageAssetSchema,
	draft: z.boolean().optional().default(false),
	seo: vivaSeoFieldsSchema
});

const vivaAuthorFrontmatterSchema = z.object({
	name: z.string(),
	slug: z.string(),
	role: z.string(),
	bio: z.string(),
	interests: z.array(z.string()),
	canonical: z.string(),
	avatar: vivaImageAssetSchema,
	seo: vivaSeoFieldsSchema
});

const frontmatterOnlySchema = /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+/;

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

export function createBlog(config: BlogCreateConfig) {
	const categoryOrder = config.categoryOrder ?? DEFAULT_CATEGORY_ORDER;

	let cachedMetaIndex: BlogPost[] | null = null;
	let cachedFullIndex: BlogPostFull[] | null = null;
	let cachedSlugToPath: Map<string, string> | null = null;

	function getSlugToPath(): Map<string, string> {
		if (!DEV && cachedSlugToPath) return cachedSlugToPath;

		const m = new Map<string, string>();
		const paths = Object.keys(config.rawModules).sort();
		for (const path of paths) {
			const file = path.split('/').pop();
			const slug = file?.replace(/\.md(?:\?.*)?$/, '');
			if (!slug) continue;
			m.set(slug, path);
		}

		if (!DEV) cachedSlugToPath = m;
		return m;
	}

	async function buildMetaIndex(): Promise<BlogPost[]> {
		if (!DEV && cachedMetaIndex) return cachedMetaIndex;

		const posts: BlogPost[] = [];
		const paths = Object.keys(config.rawModules).sort();

		for (const path of paths) {
			const file = path.split('/').pop();
			// Glob keys can include query strings depending on bundler usage; normalize aggressively.
			const slug = file?.replace(/\.md(?:\?.*)?$/, '');
			if (!slug) continue;

			const rawFn = config.rawModules[path];
			if (!rawFn) continue;

			const raw = await rawFn();

			const { data, content } = matter(raw);
			const metadata: BlogFrontmatter = config.mapFrontmatter
				? config.mapFrontmatter({ data, content, slug, path })
				: frontmatterSchema.parse(data);
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
				author: config.getAuthor(metadata.author),
				date: metadata.date,
				dateLong: fmtLong.format(dateObj),
				dateShort: fmtShort.format(dateObj),
				readingMinutes: rt.minutes,
				readingTimeShort: rt.short,
				readingTimeLong: rt.long,
				cover: metadata.cover,
				summaryAI: metadata.summaryAI,
				featured: Boolean(metadata.featured)
			});
		}

		posts.sort((a, b) => parseISODate(b.date).getTime() - parseISODate(a.date).getTime());

		if (!DEV) cachedMetaIndex = posts;
		return posts;
	}

	async function getAllPosts(): Promise<BlogPost[]> {
		return buildMetaIndex();
	}

	async function getAllPostsFull(): Promise<BlogPostFull[]> {
		if (!DEV && cachedFullIndex) return cachedFullIndex;

		const meta = await buildMetaIndex();
		const slugToPath = getSlugToPath();

		const full: BlogPostFull[] = [];
		for (const post of meta) {
			const path = slugToPath.get(post.slug);
			const compiledFn = path ? config.compiledModules[path] : undefined;
			if (!compiledFn) continue;
			const compiled = await compiledFn();
			full.push({ ...post, component: compiled.default });
		}

		if (!DEV) cachedFullIndex = full;
		return full;
	}

	async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
		const meta = await buildMetaIndex();
		const post = meta.find((p) => p.slug === slug) ?? null;
		if (!post) return null;

		const path = getSlugToPath().get(slug);
		const compiledFn = path ? config.compiledModules[path] : undefined;
		if (!compiledFn) return null;

		const compiled = await compiledFn();
		return { ...post, component: compiled.default };
	}

	async function getCategories(): Promise<BlogCategory[]> {
		const posts = await getAllPosts();
		const map = new Map<string, string>();

		for (const p of posts) map.set(p.category.slug, p.category.label);

		return Array.from(map.entries())
			.map(([slug, label]) => ({ slug, label }))
			.sort((a, b) => {
				const ai = categoryOrder.indexOf(a.slug);
				const bi = categoryOrder.indexOf(b.slug);
				if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
				if (ai === -1) return 1;
				if (bi === -1) return -1;
				return ai - bi;
			});
	}

	async function pickHero(posts?: BlogPost[]): Promise<BlogPost> {
		const list = posts ?? (await getAllPosts());
		const featured = list.filter((p) => p.featured);
		return (featured[0] ?? list[0])!;
	}

	return { getAllPosts, getAllPostsFull, getPostBySlug, getCategories, pickHero };
}

export function parseVivaBlogFrontmatter(data: unknown): VivaBlogFrontmatter {
	return vivaBlogFrontmatterSchema.parse(data);
}

export function parseVivaAuthorFrontmatter(data: unknown): VivaAuthorFrontmatter {
	return vivaAuthorFrontmatterSchema.parse(data);
}

function extractFrontmatter(raw: string): unknown {
	const match = raw.match(frontmatterOnlySchema);
	if (!match) return {};
	return matter(raw).data;
}

export function parseMarkdownAuthorMap(
	rawModules: Record<string, string>,
	fallbackAvatar = '/favicon.ico'
): Map<string, BlogAuthor> {
	const map = new Map<string, BlogAuthor>();

	for (const [path, raw] of Object.entries(rawModules)) {
		const defaultSlug = path.split('/').pop()?.replace(/\.md(?:\?.*)?$/, '') || '';
		const data = extractFrontmatter(raw);
		const record = (typeof data === 'object' && data ? data : {}) as Record<string, unknown>;

		const id =
			typeof record.slug === 'string' && record.slug.length > 0 ? record.slug : defaultSlug;
		if (!id) continue;

		const name = typeof record.name === 'string' && record.name.length > 0 ? record.name : id;
		const title =
			typeof record.role === 'string' && record.role.length > 0 ? record.role : 'Contributor';

		const avatarRecord =
			record.avatar && typeof record.avatar === 'object'
				? (record.avatar as Record<string, unknown>)
				: null;
		const avatar =
			avatarRecord && typeof avatarRecord.url === 'string' ? avatarRecord.url : fallbackAvatar;

		map.set(id, { id, name, title, avatar });
	}

	return map;
}

export async function parseVivaAuthorProfiles(
	rawModules: Record<string, string>,
	renderMarkdown: MarkdownRenderer = defaultRenderMarkdown
): Promise<VivaAuthorProfile[]> {
	const profiles: VivaAuthorProfile[] = [];

	for (const [path, raw] of Object.entries(rawModules)) {
		const { data, content } = matter(raw);
		const parsed = parseVivaAuthorFrontmatter(data);
		const html = await renderMarkdown(content);
		profiles.push({
			...parsed,
			html,
			raw: content
		});
	}

	profiles.sort((a, b) => a.name.localeCompare(b.name));
	return profiles;
}

const defaultRenderMarkdown: MarkdownRenderer = (markdown) => String(marked.parse(markdown));

function toBlogTag(name: string): BlogTag {
	return {
		name,
		slug: slugify(name)
	};
}

export function createRawBlog(config: RawBlogCreateConfig) {
	const categoryOrder = config.categoryOrder ?? DEFAULT_CATEGORY_ORDER;
	const renderMarkdown = config.renderMarkdown ?? defaultRenderMarkdown;

	let cachedContentIndex: BlogPostWithContent[] | null = null;

	async function buildContentIndex(): Promise<BlogPostWithContent[]> {
		if (!DEV && cachedContentIndex) return cachedContentIndex;

		const posts: BlogPostWithContent[] = [];
		const paths = Object.keys(config.rawModules).sort();

		for (const path of paths) {
			const file = path.split('/').pop();
			const slug = file?.replace(/\.md(?:\?.*)?$/, '');
			if (!slug) continue;

			const rawFn = config.rawModules[path];
			if (!rawFn) continue;

			const raw = await rawFn();
			const { data, content } = matter(raw);
			const metadata: BlogFrontmatter = config.mapFrontmatter
				? config.mapFrontmatter({ data, content, slug, path })
				: frontmatterSchema.parse(data);
			if (metadata.draft) continue;

			const dateObj = parseISODate(metadata.date);
			const rt = minutesToLabels(readingTime(content).minutes);
			const category = normalizeCategory(metadata.category);
			const excerpt = metadata.excerpt?.trim() || excerptFromContent(content);
			const rendered = await renderMarkdown(content);

			posts.push({
				slug,
				title: metadata.title.trim(),
				excerpt,
				category,
				tags: metadata.tags ?? [],
				author: config.getAuthor(metadata.author),
				authorId: metadata.author,
				date: metadata.date,
				dateLong: fmtLong.format(dateObj),
				dateShort: fmtShort.format(dateObj),
				readingMinutes: rt.minutes,
				readingTimeShort: rt.short,
				readingTimeLong: rt.long,
				cover: metadata.cover,
				summaryAI: metadata.summaryAI,
				featured: Boolean(metadata.featured),
				html: rendered,
				raw: content,
				frontmatter: typeof data === 'object' && data ? (data as Record<string, unknown>) : {}
			});
		}

		posts.sort((a, b) => parseISODate(b.date).getTime() - parseISODate(a.date).getTime());
		if (!DEV) cachedContentIndex = posts;
		return posts;
	}

	function stripContent(post: BlogPostWithContent): BlogPost {
		const { html: _html, raw: _raw, authorId: _authorId, frontmatter: _frontmatter, ...meta } = post;
		return meta;
	}

	async function getAllPosts(): Promise<BlogPost[]> {
		const posts = await buildContentIndex();
		return posts.map(stripContent);
	}

	async function getAllPostsWithContent(): Promise<BlogPostWithContent[]> {
		return buildContentIndex();
	}

	async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
		const posts = await buildContentIndex();
		return posts.find((p) => p.slug === slug) ?? null;
	}

	async function getCategories(): Promise<BlogCategory[]> {
		const posts = await getAllPosts();
		const map = new Map<string, string>();
		for (const p of posts) map.set(p.category.slug, p.category.label);
		return Array.from(map.entries())
			.map(([slug, label]) => ({ slug, label }))
			.sort((a, b) => {
				const ai = categoryOrder.indexOf(a.slug);
				const bi = categoryOrder.indexOf(b.slug);
				if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
				if (ai === -1) return 1;
				if (bi === -1) return -1;
				return ai - bi;
			});
	}

	async function pickHero(posts?: BlogPost[]): Promise<BlogPost> {
		const list = posts ?? (await getAllPosts());
		const featured = list.filter((p) => p.featured);
		return (featured[0] ?? list[0])!;
	}

	async function getAllTags(): Promise<BlogTag[]> {
		const posts = await buildContentIndex();
		const map = new Map<string, BlogTag>();
		for (const post of posts) {
			for (const tagName of post.tags) {
				const tag = toBlogTag(tagName);
				map.set(tag.slug, tag);
			}
		}
		return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
	}

	async function getPostsByTag(tagSlug: string): Promise<BlogPostWithContent[]> {
		const posts = await buildContentIndex();
		return posts.filter((post) => post.tags.some((tagName) => slugify(tagName) === tagSlug));
	}

	async function getPostsByAuthor(authorId: string): Promise<BlogPostWithContent[]> {
		const posts = await buildContentIndex();
		return posts.filter((post) => post.authorId === authorId);
	}

	async function getAdjacentPosts(
		slug: string
	): Promise<{ previous: BlogPostWithContent | null; next: BlogPostWithContent | null }> {
		const posts = await buildContentIndex();
		const index = posts.findIndex((post) => post.slug === slug);
		if (index === -1) return { previous: null, next: null };
		return {
			previous: posts[index + 1] ?? null,
			next: posts[index - 1] ?? null
		};
	}

	async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPostWithContent[]> {
		const posts = await buildContentIndex();
		const current = posts.find((post) => post.slug === slug);
		if (!current) return [];
		const tagSet = new Set(current.tags.map((tag) => slugify(tag)));
		return posts
			.filter((post) => post.slug !== slug)
			.map((post) => {
				const overlap = post.tags.filter((tag) => tagSet.has(slugify(tag))).length;
				return { post, overlap };
			})
			.filter((entry) => entry.overlap > 0)
			.sort((a, b) => b.overlap - a.overlap)
			.slice(0, limit)
			.map((entry) => entry.post);
	}

	return {
		getAllPosts,
		getAllPostsWithContent,
		getPostBySlug,
		getCategories,
		pickHero,
		getAllTags,
		getPostsByTag,
		getPostsByAuthor,
		getAdjacentPosts,
		getRelatedPosts
	};
}
