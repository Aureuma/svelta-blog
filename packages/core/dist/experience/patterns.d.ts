import type { SveltaBlogPatternConfig, SveltaDocsPatternConfig, SveltaPatternConfig } from '../types/experience';
type DocsPatternOverrides = Partial<Omit<SveltaDocsPatternConfig, 'kind' | 'navigation' | 'search' | 'toc' | 'feedback'>> & {
    navigation?: Partial<SveltaDocsPatternConfig['navigation']> & {
        header?: SveltaDocsPatternConfig['navigation']['header'];
        footer?: SveltaDocsPatternConfig['navigation']['footer'];
    };
    search?: Partial<SveltaDocsPatternConfig['search']>;
    toc?: Partial<SveltaDocsPatternConfig['toc']>;
    feedback?: Partial<SveltaDocsPatternConfig['feedback']>;
};
type BlogPatternOverrides = Partial<Omit<SveltaBlogPatternConfig, 'kind' | 'navigation'>> & {
    navigation?: Partial<SveltaBlogPatternConfig['navigation']> & {
        header?: SveltaBlogPatternConfig['navigation']['header'];
        footer?: SveltaBlogPatternConfig['navigation']['footer'];
    };
};
export declare const DEFAULT_DOCS_PATTERN_CONFIG: SveltaDocsPatternConfig;
export declare const DEFAULT_BLOG_PATTERN_CONFIG: SveltaBlogPatternConfig;
export declare function createDocsPatternConfig(overrides?: DocsPatternOverrides): SveltaDocsPatternConfig;
export declare function createBlogPatternConfig(overrides?: BlogPatternOverrides): SveltaBlogPatternConfig;
export declare function createSveltaPatternConfig(overrides?: {
    docs?: DocsPatternOverrides;
    blog?: BlogPatternOverrides;
}): SveltaPatternConfig;
export declare function resolveDocsEditUrl(config: SveltaDocsPatternConfig, slug: string): string;
export {};
