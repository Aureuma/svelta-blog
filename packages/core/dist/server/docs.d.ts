import { z } from 'zod';
import type { DocsPage, DocsPageFull, DocsSidebarSection, DocsSection } from '../types/docs';
declare const docsFrontmatterSchema: z.ZodObject<{
    title: z.ZodString;
    navTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    section: z.ZodOptional<z.ZodString>;
    sectionLabel: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodNumber>;
    sectionOrder: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodString>;
    draft: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type DocsFrontmatter = z.infer<typeof docsFrontmatterSchema>;
export type DocsFrontmatterAdapter = (args: {
    data: unknown;
    content: string;
    slug: string;
    path: string;
}) => DocsFrontmatter;
type CompiledModule = {
    default: DocsPageFull['component'];
};
export type DocsCreateConfig = {
    compiledModules: Record<string, () => Promise<CompiledModule>>;
    rawModules: Record<string, () => Promise<string>>;
    defaultSectionLabel?: string;
    sectionOrder?: string[];
    mapFrontmatter?: DocsFrontmatterAdapter;
};
export declare function createDocs(config: DocsCreateConfig): {
    getAllPages: () => Promise<DocsPage[]>;
    getAllPagesFull: () => Promise<DocsPageFull[]>;
    getPageBySlug: (slug: string) => Promise<DocsPageFull | null>;
    getSections: () => Promise<DocsSection[]>;
    getSidebar: () => Promise<DocsSidebarSection[]>;
    getAdjacentPages: (slug: string) => Promise<{
        previous: DocsPage | null;
        next: DocsPage | null;
    }>;
    pickLandingPage: () => Promise<DocsPage | null>;
};
export {};
