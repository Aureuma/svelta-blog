import type { PageServerLoad } from './$types';
import { getAllAuthors } from '$lib/blog/authors';
import { getAllPosts } from '$lib/blog/content';
import {
  BLOG_KEYWORDS,
  BLOG_NAME,
  SITE_DESCRIPTION,
  SITE_URL
} from '$lib/blog/site';
import { formatDate } from '$lib/blog/utils';

const POSTS_PER_PAGE = 6;

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
  const parsedUrl = new URL(url);
  const page = Math.max(
    1,
    Number.parseInt(parsedUrl.searchParams.get('page') || '1', 10)
  );
  const query = (parsedUrl.searchParams.get('q') || '').trim();
  const category = (parsedUrl.searchParams.get('category') || '').trim();
  const tokens = query ? query.toLowerCase().split(/\s+/).filter(Boolean) : [];
  const [posts, authors] = await Promise.all([getAllPosts(), getAllAuthors()]);

  const authorMap = new Map(authors.map((author) => [author.slug, author]));
  const matchesQuery = (post: (typeof posts)[number]) => {
    if (tokens.length === 0) return true;
    const author = authorMap.get(post.author);
    if (!author) {
      throw new Error(
        `Author "${post.author}" not found for post ${post.slug}.`
      );
    }
    const text = [
      post.title,
      post.description,
      author.name,
      post.tags.map((tag) => tag.name).join(' ')
    ]
      .join(' ')
      .toLowerCase();
    return tokens.every((token) => text.includes(token));
  };

  const matchesCategory = (post: (typeof posts)[number]) => {
    if (!category) return true;
    return post.tags.some(
      (tag) => tag.name.toLowerCase() === category.toLowerCase()
    );
  };

  const filtered = posts.filter(matchesQuery).filter(matchesCategory);
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const clampedPage = Math.min(page, pageCount);
  const start = (clampedPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const mapPost = (post: (typeof posts)[number]) => {
    const author = authorMap.get(post.author);
    if (!author) {
      throw new Error(
        `Author "${post.author}" not found for post ${post.slug}.`
      );
    }
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      readingTime: post.readingTime,
      tags: post.tags,
      ogImage: post.ogImage,
      author: {
        slug: author.slug,
        name: author.name,
        avatar: author.avatar
      },
      publishedLabel: formatDate(post.publishedAt),
      publishedAtIso: post.publishedAt.toISOString()
    };
  };

  const items = filtered.slice(start, end).map(mapPost);

  const canonicalParams = new URLSearchParams();
  if (query) {
    canonicalParams.set('q', query);
  }
  if (category) {
    canonicalParams.set('category', category);
  }
  if (clampedPage > 1) {
    canonicalParams.set('page', String(clampedPage));
  }
  const canonicalBase = `${SITE_URL}/blog`;
  const canonical = canonicalParams.toString()
    ? `${canonicalBase}?${canonicalParams.toString()}`
    : canonicalBase;

  return {
    meta: {
      title: BLOG_NAME,
      description: SITE_DESCRIPTION,
      canonical,
      keywords: BLOG_KEYWORDS
    },
    search: {
      query,
      category,
      total
    },
    showPagination: pageCount > 1,
    pagination: {
      page: clampedPage,
      pageCount,
      total
    },
    posts: items
  };
};
