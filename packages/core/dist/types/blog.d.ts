import type { ComponentType } from 'svelte';
export type BlogCategory = {
    label: string;
    slug: string;
};
export type BlogAuthor = {
    id: string;
    name: string;
    title: string;
    avatar: string;
};
export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    category: BlogCategory;
    tags: string[];
    author: BlogAuthor;
    date: string;
    dateLong: string;
    dateShort: string;
    readingMinutes: number;
    readingTimeShort: string;
    readingTimeLong: string;
    cover: string;
    summaryAI?: string;
    featured: boolean;
};
export type BlogPostFull = BlogPost & {
    component: ComponentType;
};
export type BlogTag = {
    name: string;
    slug: string;
};
export type SharePlatform = 'x' | 'linkedin' | 'facebook' | 'reddit' | 'hackernews' | 'copy';
export type BlogArchiveGroup = {
    id: string;
    year: number;
    month: number;
    label: string;
    count: number;
    posts: BlogPost[];
};
export type BlogAuthorSummary = {
    author: BlogAuthor;
    postCount: number;
    latestPostDate: string;
};
export type BlogPostWithContent = BlogPost & {
    html: string;
    raw: string;
    authorId: string;
    frontmatter: Record<string, unknown>;
};
