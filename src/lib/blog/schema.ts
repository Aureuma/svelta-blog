import { z } from 'zod';

const isoDate = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Must be a valid ISO date string'
  });

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string().min(1)).default([])
});

export const imageAssetSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  credit: z.string().min(1),
  source: z.string().min(1)
});

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  canonical: z.string().url(),
  ogImage: imageAssetSchema,
  draft: z.boolean(),
  seo: seoSchema
});

export const authorFrontmatterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  interests: z.array(z.string().min(1)).min(1),
  canonical: z.string().url(),
  avatar: imageAssetSchema,
  seo: seoSchema
});
