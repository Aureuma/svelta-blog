import type { ExperienceCatalog, ExperienceDefinition, ExperienceKind } from '../types/experience';
import { createBlogPatternConfig, createDocsPatternConfig, createSveltaPatternConfig, DEFAULT_BLOG_PATTERN_CONFIG, DEFAULT_DOCS_PATTERN_CONFIG, resolveDocsEditUrl } from './patterns';
export type { ExperienceCatalog, ExperienceDefinition, ExperienceKind, SveltaBlogPatternConfig, SveltaDocsPatternConfig, SveltaNavItem, SveltaPatternConfig } from '../types/experience';
export { createBlogPatternConfig, createDocsPatternConfig, createSveltaPatternConfig, DEFAULT_BLOG_PATTERN_CONFIG, DEFAULT_DOCS_PATTERN_CONFIG, resolveDocsEditUrl };
export declare function parseExperienceKind(input: string | null | undefined, fallback?: ExperienceKind): ExperienceKind;
export declare function createExperienceCatalog(opts?: {
    defaultKind?: ExperienceKind;
    overrides?: Partial<Record<ExperienceKind, Partial<ExperienceDefinition>>>;
}): ExperienceCatalog;
