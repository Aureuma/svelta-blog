import type { BlogAuthor, BlogCategory, BlogPost, BlogPostFull, BlogPostWithContent, BlogTag } from '../types/blog';
import { z } from 'zod';
declare const frontmatterSchema: z.ZodObject<{
    title: z.ZodString;
    date: z.ZodString;
    category: z.ZodString;
    author: z.ZodString;
    cover: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    summaryAI: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    featured: z.ZodOptional<z.ZodBoolean>;
    draft: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type BlogFrontmatter = z.infer<typeof frontmatterSchema>;
export type BlogFrontmatterAdapter = (args: {
    data: unknown;
    content: string;
    slug: string;
    path: string;
}) => BlogFrontmatter;
type CompiledModule = {
    default: BlogPostFull['component'];
};
export type BlogCreateConfig = {
    compiledModules: Record<string, () => Promise<CompiledModule>>;
    rawModules: Record<string, () => Promise<string>>;
    getAuthor: (id: string) => BlogAuthor;
    categoryOrder?: string[];
    mapFrontmatter?: BlogFrontmatterAdapter;
};
export type MarkdownRenderer = (markdown: string) => string | Promise<string>;
export type RawBlogCreateConfig = {
    rawModules: Record<string, () => Promise<string>>;
    getAuthor: (id: string) => BlogAuthor;
    categoryOrder?: string[];
    mapFrontmatter?: BlogFrontmatterAdapter;
    renderMarkdown?: MarkdownRenderer;
};
export declare function createBlog(config: BlogCreateConfig): {
    getAllPosts: () => Promise<BlogPost[]>;
    getAllPostsFull: () => Promise<BlogPostFull[]>;
    getPostBySlug: (slug: string) => Promise<BlogPostFull | null>;
    getCategories: () => Promise<BlogCategory[]>;
    pickHero: (posts?: BlogPost[]) => Promise<BlogPost>;
};
export declare function createRawBlog(config: RawBlogCreateConfig): {
    getAllPosts: () => Promise<BlogPost[]>;
    getAllPostsWithContent: () => Promise<BlogPostWithContent[]>;
    getPostBySlug: (slug: string) => Promise<BlogPostWithContent | null>;
    getCategories: () => Promise<BlogCategory[]>;
    pickHero: (posts?: BlogPost[]) => Promise<BlogPost>;
    getAllTags: () => Promise<BlogTag[]>;
    getPostsByTag: (tagSlug: string) => Promise<BlogPostWithContent[]>;
    getPostsByAuthor: (authorId: string) => Promise<BlogPostWithContent[]>;
    getAdjacentPosts: (slug: string) => Promise<{
        previous: BlogPostWithContent | null;
        next: BlogPostWithContent | null;
    }>;
    getRelatedPosts: (slug: string, limit?: number) => Promise<BlogPostWithContent[]>;
};
export {};
