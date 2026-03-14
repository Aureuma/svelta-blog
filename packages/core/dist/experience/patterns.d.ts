import type { SveltaBlogPatternConfig } from '../types/experience';
type BlogPatternOverrides = Partial<Omit<SveltaBlogPatternConfig, 'kind' | 'navigation'>> & {
    navigation?: Partial<SveltaBlogPatternConfig['navigation']> & {
        header?: SveltaBlogPatternConfig['navigation']['header'];
        footer?: SveltaBlogPatternConfig['navigation']['footer'];
    };
};
export declare const DEFAULT_BLOG_PATTERN_CONFIG: SveltaBlogPatternConfig;
export declare function createBlogPatternConfig(overrides?: BlogPatternOverrides): SveltaBlogPatternConfig;
export {};
