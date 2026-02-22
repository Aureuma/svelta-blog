import type { ComponentType } from 'svelte';

export type BlogCategory = {
	label: string;
	slug: string; // "engineering"
};

export type BlogAuthor = {
	id: string;
	name: string;
	title: string;
	avatar: string; // public path under /static
};

export type BlogPost = {
	slug: string;
	title: string;
	excerpt: string;
	category: BlogCategory;
	tags: string[];
	author: BlogAuthor;
	date: string; // ISO (YYYY-MM-DD)
	dateLong: string; // "February 8, 2026"
	dateShort: string; // "Feb 8, 2026"
	readingMinutes: number;
	readingTimeShort: string; // "5 min read"
	readingTimeLong: string; // "5 minutes read"
	cover: string; // public path under /static
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

export type BlogArchiveGroup = {
	id: string; // "2026-02"
	year: number;
	month: number; // 1-12
	label: string; // "February 2026"
	count: number;
	posts: BlogPost[];
};

export type BlogAuthorSummary = {
	author: BlogAuthor;
	postCount: number;
	latestPostDate: string; // ISO
};

export type BlogPostWithContent = BlogPost & {
	html: string;
	raw: string;
	authorId: string;
	frontmatter: Record<string, unknown>;
};
