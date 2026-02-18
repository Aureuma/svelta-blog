import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuthorBySlug } from '$lib/blog/authors';
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts
} from '$lib/blog/content';
import { formatDate } from '$lib/blog/utils';

export const prerender = true;

export const entries = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const post = await getPostBySlug(params.slug);
  if (!post || post.draft) {
    throw error(404, 'Post not found');
  }

  const author = await getAuthorBySlug(post.author);
  if (!author) {
    throw error(500, `Author ${post.author} not found`);
  }

  const [related, adjacent] = await Promise.all([
    getRelatedPosts(post.slug, 3),
    getAdjacentPosts(post.slug)
  ]);

  return {
    post: {
      ...post,
      publishedLabel: formatDate(post.publishedAt),
      updatedLabel: formatDate(post.updatedAt),
      publishedAtIso: post.publishedAt.toISOString(),
      updatedAtIso: post.updatedAt.toISOString()
    },
    author,
    related,
    adjacent
  };
};
