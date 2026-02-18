import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllAuthors } from '$lib/blog/authors';
import { getAllTags, getPostsByTag } from '$lib/blog/content';
import { SITE_URL } from '$lib/blog/site';
import { formatDate } from '$lib/blog/utils';

export const prerender = true;

export const entries = async () => {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const [tags, authors, posts] = await Promise.all([
    getAllTags(),
    getAllAuthors(),
    getPostsByTag(params.tag)
  ]);

  const tag = tags.find((item) => item.slug === params.tag);
  if (!tag) {
    throw error(404, 'Tag not found');
  }

  if (posts.length === 0) {
    throw error(404, 'No posts found for this tag');
  }

  const authorMap = new Map(authors.map((author) => [author.slug, author]));
  const items = posts.map((post) => {
    const author = authorMap.get(post.author);
    if (!author) {
      throw new Error(
        `Author "${post.author}" not found for post ${post.slug}.`
      );
    }
    return {
      ...post,
      author: {
        slug: author.slug,
        name: author.name,
        avatar: author.avatar
      },
      publishedLabel: formatDate(post.publishedAt),
      publishedAtIso: post.publishedAt.toISOString()
    };
  });

  return {
    tag,
    posts: items,
    meta: {
      title: `Posts tagged “${tag.name}”`,
      description: `Convelt posts tagged with ${tag.name}.`,
      canonical: `${SITE_URL}/blog/tag/${tag.slug}`,
      keywords: [tag.name, 'Convelt', 'SMB websites']
    }
  };
};
