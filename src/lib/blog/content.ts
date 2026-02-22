import type { BlogPostWithContent } from '@aureuma/svelta';
import { createRawBlog } from '@aureuma/svelta/server';
import { parse } from 'yaml';
import { blogFrontmatterSchema } from './schema';
import type { BlogFrontmatter, BlogPost, Tag } from './types';
import { slugify } from './utils';

const blogModules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>;

const authorModules = import.meta.glob('/src/content/authors/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

const splitFrontmatter = (raw: string) => {
  const match = raw.match(
    /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+([\s\S]*)$/
  );
  if (!match) {
    throw new Error('Missing or malformed frontmatter block.');
  }
  return { frontmatter: match[1], body: match[2].trim() };
};

const normalizeFrontmatterInput = (data: unknown): BlogFrontmatter => {
  if (!data || typeof data !== 'object') {
    return blogFrontmatterSchema.parse(data) as BlogFrontmatter;
  }

  const record = {
    ...(data as Record<string, unknown>)
  };

  for (const key of ['publishedAt', 'updatedAt'] as const) {
    const value = record[key];
    if (value instanceof Date) {
      record[key] = value.toISOString();
    }
  }

  return blogFrontmatterSchema.parse(record) as BlogFrontmatter;
};

const parseAuthorMap = () => {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      title: string;
      avatar: string;
    }
  >();

  for (const [path, raw] of Object.entries(authorModules)) {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { frontmatter } = splitFrontmatter(raw);
    const data = parse(frontmatter);
    if (!data || typeof data !== 'object') {
      throw new Error(`Author frontmatter must be a YAML object in ${path}.`);
    }

    const record = data as Record<string, unknown>;
    const authorSlug =
      typeof record.slug === 'string' && record.slug.length > 0
        ? record.slug
        : slug;
    const name =
      typeof record.name === 'string' && record.name.length > 0
        ? record.name
        : authorSlug;
    const title =
      typeof record.role === 'string' && record.role.length > 0
        ? record.role
        : 'Contributor';

    const avatarValue = record.avatar;
    const avatar =
      avatarValue &&
      typeof avatarValue === 'object' &&
      typeof (avatarValue as Record<string, unknown>).url === 'string'
        ? String((avatarValue as Record<string, unknown>).url)
        : '/favicon.ico';

    map.set(authorSlug, {
      id: authorSlug,
      name,
      title,
      avatar
    });
  }

  return map;
};

const authorMap = parseAuthorMap();

const fallbackAuthor = {
  id: 'unknown',
  name: 'Unknown Author',
  title: 'Contributor',
  avatar: '/favicon.ico'
};

const blog = createRawBlog({
  rawModules: blogModules,
  getAuthor: (id) => authorMap.get(id) ?? fallbackAuthor,
  mapFrontmatter: ({ data }) => {
    const parsed = normalizeFrontmatterInput(data);
    return {
      title: parsed.title,
      date: parsed.publishedAt,
      category: parsed.tags?.[0] ?? 'General',
      author: parsed.author,
      cover: parsed.ogImage.url,
      excerpt: parsed.description,
      tags: parsed.tags,
      summaryAI: undefined,
      featured: false,
      draft: parsed.draft
    };
  }
});

let cachedPosts: BlogPost[] | null = null;

const toTags = (tags: string[]): Tag[] =>
  tags.map((tag) => ({
    name: tag,
    slug: slugify(tag)
  }));

const toWordCount = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const toLegacyPost = (post: BlogPostWithContent): BlogPost => {
  const parsed = normalizeFrontmatterInput(post.frontmatter);
  return {
    slug: post.slug,
    title: post.title,
    description: parsed.description,
    excerpt: post.excerpt,
    publishedAt: new Date(parsed.publishedAt),
    updatedAt: new Date(parsed.updatedAt),
    author: parsed.author,
    tags: toTags(parsed.tags),
    canonical: parsed.canonical,
    ogImage: parsed.ogImage,
    seo: parsed.seo,
    draft: Boolean(parsed.draft),
    html: post.html,
    readingTime: post.readingTimeShort,
    wordCount: toWordCount(post.raw),
    raw: post.raw
  };
};

const getCachedPosts = async () => {
  if (!cachedPosts) {
    const posts = await blog.getAllPostsWithContent();
    cachedPosts = posts.map(toLegacyPost);
  }
  return cachedPosts;
};

export const getAllPosts = async ({
  includeDrafts = false
}: { includeDrafts?: boolean } = {}) => {
  const posts = await getCachedPosts();
  return includeDrafts ? posts : posts.filter((post) => !post.draft);
};

export const getPostBySlug = async (slug: string) => {
  const posts = await getAllPosts({ includeDrafts: true });
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getPostsByTag = async (tagSlug: string) => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
};

export const getPostsByAuthor = async (authorSlug: string) => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.author === authorSlug);
};

export const getAllTags = async () => {
  const posts = await getAllPosts();
  const map = new Map<string, Tag>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      map.set(tag.slug, tag);
    });
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const getAdjacentPosts = async (slug: string) => {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null
  };
};

export const getRelatedPosts = async (slug: string, limit = 3) => {
  const posts = await getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) {
    return [];
  }
  const tagSet = new Set(current.tags.map((tag) => tag.slug));
  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const overlap = post.tags.filter((tag) => tagSet.has(tag.slug)).length;
      return { post, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((entry) => entry.post);
};
