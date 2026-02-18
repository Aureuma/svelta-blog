import { parse } from 'yaml';
import { blogFrontmatterSchema } from './schema';
import { renderMarkdown } from './markdown';
import type { BlogPost, BlogFrontmatter, Tag } from './types';
import { calculateReadingTime, slugify } from './utils';

const modules = import.meta.glob('/src/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

let cachedPosts: BlogPost[] | null = null;

const splitFrontmatter = (raw: string) => {
  const match = raw.match(
    /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+([\s\S]*)$/
  );
  if (!match) {
    // Fail loudly so content issues stop builds instead of shipping silently.
    throw new Error('Missing or malformed frontmatter block.');
  }
  return { frontmatter: match[1], body: match[2].trim() };
};

const parseFrontmatter = (
  frontmatter: string,
  path: string
): BlogFrontmatter => {
  const data = parse(frontmatter);
  if (!data || typeof data !== 'object') {
    throw new Error(`Frontmatter must be a YAML object in ${path}.`);
  }
  return blogFrontmatterSchema.parse(data) as BlogFrontmatter;
};

const toTags = (tags: string[]): Tag[] =>
  tags.map((tag) => ({
    name: tag,
    slug: slugify(tag)
  }));

const parsePost = async (path: string, raw: string): Promise<BlogPost> => {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const { frontmatter, body } = splitFrontmatter(raw);
  const parsed = parseFrontmatter(frontmatter, path);

  if (parsed.slug !== slug) {
    throw new Error(
      `Frontmatter slug mismatch in ${path}. Expected "${slug}" but got "${parsed.slug}".`
    );
  }

  if (!parsed.ogImage.url.startsWith('/images/blog/')) {
    throw new Error(
      `ogImage.url must point to a local blog asset in ${path}.`
    );
  }

  const publishedAt = new Date(parsed.publishedAt);
  const updatedAt = new Date(parsed.updatedAt);
  if (updatedAt < publishedAt) {
    throw new Error(`updatedAt must be >= publishedAt in ${path}.`);
  }

  const html = await renderMarkdown(body);
  const { label, wordCount } = calculateReadingTime(body);

  return {
    slug,
    title: parsed.title,
    description: parsed.description,
    excerpt: parsed.description,
    publishedAt,
    updatedAt,
    author: parsed.author,
    tags: toTags(parsed.tags),
    canonical: parsed.canonical,
    ogImage: parsed.ogImage,
    seo: parsed.seo,
    draft: parsed.draft,
    html,
    readingTime: label,
    wordCount,
    raw: body
  };
};

export const getAllPosts = async ({
  includeDrafts = false
}: { includeDrafts?: boolean } = {}) => {
  if (!cachedPosts) {
    const entries = await Promise.all(
      Object.entries(modules).map(([path, raw]) =>
        parsePost(path, raw as string)
      )
    );
    cachedPosts = entries.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  return includeDrafts
    ? cachedPosts
    : cachedPosts.filter((post) => !post.draft);
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
