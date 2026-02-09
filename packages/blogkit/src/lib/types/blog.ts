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

