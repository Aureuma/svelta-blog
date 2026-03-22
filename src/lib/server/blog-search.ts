import { env } from '$env/dynamic/private';
import { getAllPosts, getAllTags, getAuthorSummaries } from '$lib/server/blog';
import { getAllSeries } from '$lib/server/blog-intelligence';

export type BlogSearchEntry = {
	id: string;
	slug: string;
	href: string;
	title: string;
	excerpt: string;
	category: string;
	tags: string[];
	author: string;
	date: string;
	readingTime: string;
	kind: string;
	value: string;
};

export type BlogSearchProvider = {
	mode: 'local' | 'remote';
	label: string;
	endpoint: string;
	remoteUrl: string | null;
};

type RemoteSearchPayload =
	| BlogSearchEntry[]
	| {
			items?: unknown[];
			results?: unknown[];
	  };

function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function stringArray(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeRemoteEntry(value: unknown): BlogSearchEntry | null {
	if (!value || typeof value !== 'object') return null;
	const entry = value as Record<string, unknown>;
	const slug = stringValue(entry.slug);
	const href = stringValue(entry.href);
	const title = stringValue(entry.title);
	if (!href || !title) return null;

	const excerpt = stringValue(entry.excerpt);
	const category = stringValue(entry.category) || 'Utility';
	const tags = stringArray(entry.tags);
	const author = stringValue(entry.author);
	const date = stringValue(entry.date);
	const readingTime = stringValue(entry.readingTime);
	const kind = stringValue(entry.kind) || 'post';

	return {
		id: stringValue(entry.id) || slug || href,
		slug: slug || href.replace(/^\/blog\/?/, '') || 'blog',
		href,
		title,
		excerpt,
		category,
		tags,
		author,
		date,
		readingTime,
		kind,
		value:
			stringValue(entry.value) ||
			[title, excerpt, category, author, date, readingTime, kind, tags.join(' ')]
				.filter(Boolean)
				.join(' ')
	};
}

function normalizeRemotePayload(payload: RemoteSearchPayload): BlogSearchEntry[] {
	const items = Array.isArray(payload)
		? payload
		: Array.isArray(payload.items)
			? payload.items
			: Array.isArray(payload.results)
				? payload.results
				: [];

	return items
		.map((item) => normalizeRemoteEntry(item))
		.filter((entry): entry is BlogSearchEntry => Boolean(entry));
}

function filterLocalEntries(entries: BlogSearchEntry[], query: string): BlogSearchEntry[] {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return entries.slice(0, 24);
	return entries.filter((entry) => entry.value.toLowerCase().includes(normalizedQuery)).slice(0, 24);
}

export function getBlogSearchProvider(): BlogSearchProvider {
	const remoteUrl = env.BLOG_REMOTE_SEARCH_URL?.trim() || null;
	if (remoteUrl) {
		return {
			mode: 'remote',
			label: 'Remote search backend',
			endpoint: '/blog/search-api.json',
			remoteUrl
		};
	}

	return {
		mode: 'local',
		label: 'Local static index',
		endpoint: '/blog/search-api.json',
		remoteUrl: null
	};
}

export async function getBlogSearchEntries(baseUrl?: URL): Promise<BlogSearchEntry[]> {
	const [posts, tags, authors, series] = await Promise.all([
		getAllPosts(),
		getAllTags(),
		getAuthorSummaries(),
		getAllSeries()
	]);

	const toHref = (path: string) => (baseUrl ? new URL(path, baseUrl).toString() : path);

	return [
		{
			id: 'utility-blog',
			slug: 'blog',
			href: toHref('/blog'),
			title: 'Blog Index',
			excerpt: 'Main blog feed with search, topic filters, and featured writing.',
			category: 'Utility',
			tags: ['blog', 'index', 'feed'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'utility',
			value: 'Blog Index Main blog feed search topic filters featured writing blog index feed utility'
		},
		{
			id: 'utility-archive',
			slug: 'archive',
			href: toHref('/blog/archive'),
			title: 'Blog Archive',
			excerpt: 'Browse posts grouped by publication month.',
			category: 'Utility',
			tags: ['archive', 'history'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'utility',
			value: 'Blog Archive Browse posts grouped by publication month archive history utility'
		},
		{
			id: 'utility-authors',
			slug: 'authors',
			href: toHref('/blog/authors'),
			title: 'Blog Authors',
			excerpt: 'Browse authors and their latest posts.',
			category: 'Utility',
			tags: ['authors', 'contributors'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'utility',
			value: 'Blog Authors Browse authors and their latest posts authors contributors utility'
		},
		{
			id: 'utility-tags',
			slug: 'tags',
			href: toHref('/blog/tags'),
			title: 'Blog Tags',
			excerpt: 'Browse every tag used across the blog.',
			category: 'Utility',
			tags: ['tags', 'topics'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'utility',
			value: 'Blog Tags Browse every tag used across the blog tags topics utility'
		},
		{
			id: 'utility-series',
			slug: 'series',
			href: toHref('/blog/series'),
			title: 'Blog Series',
			excerpt: 'Follow multi-part writing tracks across the blog.',
			category: 'Utility',
			tags: ['series', 'multi-part'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'utility',
			value: 'Blog Series Follow multi-part writing tracks across the blog series multi-part utility'
		},
		...authors.map((item) => ({
			id: `author-${item.author.id}`,
			slug: `authors/${item.author.id}`,
			href: toHref(`/blog/authors/${item.author.id}`),
			title: item.author.name,
			excerpt: `${item.author.title} with ${item.postCount} posts.`,
			category: 'Author',
			tags: ['author', item.author.id],
			author: item.author.name,
			date: item.latestPostDate,
			readingTime: `${item.postCount} posts`,
			kind: 'author',
			value: `${item.author.name} ${item.author.title} ${item.postCount} posts author ${item.author.id} ${item.latestPostDate}`
		})),
		...tags.map((tag) => ({
			id: `tag-${tag.slug}`,
			slug: `tags/${tag.slug}`,
			href: toHref(`/blog/tags/${tag.slug}`),
			title: tag.name,
			excerpt: `Topic page for posts tagged ${tag.name}.`,
			category: 'Tag',
			tags: [tag.name, 'tag'],
			author: 'svelta-blog',
			date: '',
			readingTime: '',
			kind: 'tag',
			value: `${tag.name} tag topic page posts tagged ${tag.name}`
		})),
		...series.map((item) => ({
			id: `series-${item.id}`,
			slug: `series/${item.id}`,
			href: toHref(`/blog/series/${item.id}`),
			title: item.title,
			excerpt: item.description || `${item.posts.length} posts in this series.`,
			category: 'Series',
			tags: ['series', ...item.posts.map((post) => post.slug)],
			author: 'svelta-blog',
			date: item.posts.at(-1)?.dateLong ?? '',
			readingTime: `${item.posts.length} parts`,
			kind: 'series',
			value: `${item.title} ${item.description} series ${item.posts.length} parts ${item.posts.map((post) => post.title).join(' ')}`
		})),
		...posts.map((post) => ({
			id: post.slug,
			slug: post.slug,
			href: toHref(`/blog/${post.slug}`),
			title: post.title,
			excerpt: post.excerpt,
			category: post.category.label,
			tags: post.tags,
			author: post.author.name,
			date: baseUrl ? post.date : post.dateLong,
			readingTime: post.readingTimeShort,
			kind: 'post',
			value: [
				post.title,
				post.excerpt,
				post.category.label,
				post.author.name,
				post.dateLong,
				post.readingTimeShort,
				...post.tags
			]
				.join(' ')
				.toLowerCase()
		}))
	];
}

export async function queryBlogSearch(query: string): Promise<BlogSearchEntry[]> {
	const provider = getBlogSearchProvider();
	if (provider.mode === 'remote' && provider.remoteUrl) {
		try {
			const upstreamUrl = new URL(provider.remoteUrl);
			upstreamUrl.searchParams.set('q', query.trim());
			const token = env.BLOG_REMOTE_SEARCH_TOKEN?.trim();
			const response = await fetch(upstreamUrl, {
				headers: {
					accept: 'application/json',
					...(token ? { authorization: `Bearer ${token}` } : {})
				}
			});
			if (response.ok) {
				const payload = (await response.json()) as RemoteSearchPayload;
				return normalizeRemotePayload(payload);
			}
		} catch {}
	}

	return filterLocalEntries(await getBlogSearchEntries(), query);
}
