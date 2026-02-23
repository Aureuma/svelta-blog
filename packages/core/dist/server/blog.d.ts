import type { BlogAuthor, BlogAuthorSummary, BlogArchiveGroup, BlogCategory, BlogPost, BlogPostFull, BlogPostWithContent, BlogTag } from '../types/blog';
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
    allowMultipleTags?: boolean;
    mapFrontmatter?: BlogFrontmatterAdapter;
};
export type MarkdownRenderer = (markdown: string) => string | Promise<string>;
export type RawBlogCreateConfig = {
    rawModules: Record<string, () => Promise<string>>;
    getAuthor: (id: string) => BlogAuthor;
    categoryOrder?: string[];
    allowMultipleTags?: boolean;
    mapFrontmatter?: BlogFrontmatterAdapter;
    renderMarkdown?: MarkdownRenderer;
};
export type VivaImageAsset = {
    url: string;
    alt: string;
    width: number;
    height: number;
    credit: string;
    source: string;
};
export type VivaSeoFields = {
    title: string;
    description: string;
    keywords: string[];
};
export type VivaBlogFrontmatter = {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    updatedAt: string;
    author: string;
    tags: string[];
    canonical: string;
    ogImage: VivaImageAsset;
    draft: boolean;
    seo: VivaSeoFields;
};
export type VivaAuthorFrontmatter = {
    name: string;
    slug: string;
    role: string;
    bio: string;
    interests: string[];
    canonical: string;
    avatar: VivaImageAsset;
    seo: VivaSeoFields;
};
export type VivaAuthorProfile = VivaAuthorFrontmatter & {
    html: string;
    raw: string;
};
export declare function createBlog(config: BlogCreateConfig): {
    getAllPosts: () => Promise<BlogPost[]>;
    getAllPostsFull: () => Promise<BlogPostFull[]>;
    getPostBySlug: (slug: string) => Promise<BlogPostFull | null>;
    getCategories: () => Promise<BlogCategory[]>;
    pickHero: (posts?: BlogPost[]) => Promise<BlogPost>;
    getAllTags: () => Promise<BlogTag[]>;
    getPostsByTag: (tagSlug: string) => Promise<BlogPost[]>;
    getPostsByAuthor: (authorId: string) => Promise<BlogPost[]>;
    getAllAuthors: () => Promise<BlogAuthor[]>;
    getAuthorSummaries: () => Promise<BlogAuthorSummary[]>;
    getArchiveGroups: () => Promise<BlogArchiveGroup[]>;
    getAdjacentPosts: (slug: string) => Promise<{
        previous: BlogPost | null;
        next: BlogPost | null;
    }>;
    getRelatedPosts: (slug: string, limit?: number) => Promise<BlogPost[]>;
};
export declare function parseVivaBlogFrontmatter(data: unknown): VivaBlogFrontmatter;
export declare function parseVivaAuthorFrontmatter(data: unknown): VivaAuthorFrontmatter;
export declare function parseMarkdownAuthorMap(rawModules: Record<string, string>, fallbackAvatar?: string): Map<string, BlogAuthor>;
export declare function parseVivaAuthorProfiles(rawModules: Record<string, string>, renderMarkdown?: MarkdownRenderer): Promise<VivaAuthorProfile[]>;
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
