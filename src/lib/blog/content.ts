import type { BlogPostWithContent } from '@aureuma/svelta';
import {
  createRawBlog,
  parseMarkdownAuthorMap,
  parseVivaAuthorProfiles,
  parseVivaBlogFrontmatter,
  type VivaAuthorProfile
} from '@aureuma/svelta/server';
import type { AuthorProfile, BlogPost, Tag } from './types';
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

const authorMap = parseMarkdownAuthorMap(authorModules);

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
    const parsed = parseVivaBlogFrontmatter(data);
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
let cachedAuthors: AuthorProfile[] | null = null;

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

const toLegacyAuthor = (author: VivaAuthorProfile): AuthorProfile => ({
  slug: author.slug,
  name: author.name,
  role: author.role,
  bio: author.bio,
  interests: author.interests,
  canonical: author.canonical,
  avatar: author.avatar,
  seo: author.seo,
  html: author.html,
  raw: author.raw
});

const toLegacyPost = (post: BlogPostWithContent): BlogPost => {
  const parsed = parseVivaBlogFrontmatter(post.frontmatter);
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

const getCachedAuthors = async () => {
  if (!cachedAuthors) {
    const profiles = await parseVivaAuthorProfiles(authorModules);
    cachedAuthors = profiles.map(toLegacyAuthor);
  }
  return cachedAuthors;
};

export const getAllAuthors = async () => getCachedAuthors();

export const getAuthorBySlug = async (slug: string) => {
  const authors = await getCachedAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
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
