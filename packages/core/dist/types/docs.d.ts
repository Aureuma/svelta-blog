import type { ComponentType } from 'svelte';
export type DocsSection = {
    id: string;
    label: string;
    order: number;
};
export type DocsPage = {
    slug: string;
    title: string;
    navTitle: string;
    description: string;
    section: DocsSection;
    order: number;
    tags: string[];
    updatedAt?: string;
    updatedAtLong?: string;
};
export type DocsPageFull = DocsPage & {
    component: ComponentType;
};
export type DocsPageWithContent = DocsPage & {
    html: string;
    raw: string;
    frontmatter: Record<string, unknown>;
};
export type DocsSidebarSection = DocsSection & {
    pages: DocsPage[];
};
