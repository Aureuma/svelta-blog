export type SeoFields = {
  title: string;
  description: string;
  keywords: string[];
};

export type ImageAsset = {
  url: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  source: string;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  canonical: string;
  ogImage: ImageAsset;
  draft: boolean;
  seo: SeoFields;
};

export type AuthorFrontmatter = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  interests: string[];
  canonical: string;
  avatar: ImageAsset;
  seo: SeoFields;
};

export type Tag = {
  name: string;
  slug: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  author: string;
  tags: Tag[];
  canonical: string;
  ogImage: ImageAsset;
  seo: SeoFields;
  draft: boolean;
  html: string;
  readingTime: string;
  wordCount: number;
  raw: string;
};

export type AuthorProfile = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  interests: string[];
  canonical: string;
  avatar: ImageAsset;
  seo: SeoFields;
  html: string;
  raw: string;
};
