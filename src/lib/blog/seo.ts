import { SITE_NAME, SITE_URL } from './site';

type BlogPostingJsonLdInput = {
  title: string;
  description: string;
  publishedAt: string | Date;
  updatedAt: string | Date;
  seo: { keywords: string[] };
  ogImage: { url: string };
  canonical: string;
};

type AuthorJsonLdInput = {
  name: string;
  slug: string;
  bio: string;
  avatar: { url: string };
  canonical?: string;
};

export const absoluteUrl = (path: string) =>
  path.startsWith('http')
    ? path
    : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

export const buildBlogPostingJsonLd = (
  post: BlogPostingJsonLdInput,
  author: AuthorJsonLdInput
) => {
  // Dates may arrive as serialized strings during SSR; normalize defensively.
  const publishedAt =
    typeof post.publishedAt === 'string'
      ? new Date(post.publishedAt)
      : post.publishedAt;
  const updatedAt =
    typeof post.updatedAt === 'string'
      ? new Date(post.updatedAt)
      : post.updatedAt;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    keywords: post.seo.keywords.join(', '),
    author: {
      '@type': 'Person',
      name: author.name,
      url: absoluteUrl(`/blog/author/${author.slug}`)
    },
    image: absoluteUrl(post.ogImage.url),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonical
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL
    }
  };
};

export const buildPersonJsonLd = (author: AuthorJsonLdInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: author.name,
  description: author.bio,
  image: absoluteUrl(author.avatar.url),
  url: author.canonical ?? absoluteUrl(`/blog/author/${author.slug}`)
});

export const buildBlogIndexJsonLd = (
  posts: { slug: string; title: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: absoluteUrl(`/blog/${post.slug}`),
    name: post.title
  }))
});
