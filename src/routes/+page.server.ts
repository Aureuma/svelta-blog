import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/blog/content';
import { getAllAuthors } from '$lib/blog/authors';
import { formatDate } from '$lib/blog/utils';
import { getStockImage } from '$lib/data/stock-images';

export const load: PageServerLoad = async () => {
  const [posts, authors] = await Promise.all([getAllPosts(), getAllAuthors()]);
  const authorMap = new Map(authors.map((author) => [author.slug, author]));

  const latestPosts = posts.slice(0, 3).map((post) => {
    const author = authorMap.get(post.author);
    if (!author) {
      throw new Error(`Author "${post.author}" not found for ${post.slug}.`);
    }
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      tag: post.tags[0]?.name || 'Stories',
      image: post.ogImage,
      author: author.name,
      date: formatDate(post.publishedAt)
    };
  });

  const templateIds = [
    'template-dentist',
    'template-salon',
    'template-cafe',
    'template-fitness'
  ];
  const templates = templateIds.map((id) => {
    const image = getStockImage(id);
    return {
      id,
      title:
        id === 'template-dentist'
          ? 'Dental Practice'
          : id === 'template-salon'
            ? 'Salon & Spa'
            : id === 'template-cafe'
              ? 'Neighborhood Cafe'
              : 'Boutique Fitness',
      description:
        id === 'template-dentist'
          ? 'Patient-first booking, insurance highlights.'
          : id === 'template-salon'
            ? 'Service tiers with stylist profiles.'
            : id === 'template-cafe'
              ? 'Menu highlights, local story, and hours.'
              : 'Class schedules with trainer highlights.',
      image: image
        ? {
            url: `/images/templates/${image.filename}`,
            alt: image.id,
            width: image.width,
            height: image.height,
            credit: image.photographer,
            source: image.source
          }
        : null
    };
  });

  const heroImage = getStockImage('hero-smb');

  return {
    latestPosts,
    templates,
    heroImage: heroImage
      ? {
          url: `/images/hero/${heroImage.filename}`,
          alt: 'Small business owner working',
          width: heroImage.width,
          height: heroImage.height,
          credit: heroImage.photographer,
          source: heroImage.source
        }
      : null
  };
};
