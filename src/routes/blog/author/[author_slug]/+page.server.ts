import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuthorBySlug, getAllAuthors } from '$lib/blog/authors';
import { getPostsByAuthor } from '$lib/blog/content';
import { SITE_URL } from '$lib/blog/site';
import { formatDate } from '$lib/blog/utils';

export const prerender = true;

export const entries = async () => {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ author_slug: author.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const author = await getAuthorBySlug(params.author_slug);
  if (!author) {
    throw error(404, 'Author not found');
  }

  const posts = await getPostsByAuthor(author.slug);

  const items = posts.map((post) => ({
    ...post,
    publishedLabel: formatDate(post.publishedAt),
    publishedAtIso: post.publishedAt.toISOString()
  }));

  return {
    author,
    posts: items,
    meta: {
      title: author.seo.title,
      description: author.seo.description,
      canonical: `${SITE_URL}/blog/author/${author.slug}`
    }
  };
};
