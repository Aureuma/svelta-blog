export const DEFAULT_BLOG_PATTERN_CONFIG = {
    kind: 'blog',
    brandName: 'svelta-blog',
    title: 'Editorial publishing with modern feed ergonomics.',
    description: 'Publish markdown-driven updates with in-feed tag filtering, continuous infinite loading, author attribution, and RSS delivery.',
    pageSize: 8,
    maxPageSize: 24,
    showRss: true,
    navigation: {
        header: [
            { label: 'Blog', href: '/blog' },
            { label: 'Archive', href: '/blog/archive' }
        ],
        footer: [
            { label: 'All posts', href: '/blog' },
            { label: 'Authors', href: '/blog/authors' },
            { label: 'RSS', href: '/feed.xml' }
        ]
    }
};
export function createBlogPatternConfig(overrides) {
    return {
        ...DEFAULT_BLOG_PATTERN_CONFIG,
        ...overrides,
        kind: 'blog',
        navigation: {
            ...DEFAULT_BLOG_PATTERN_CONFIG.navigation,
            ...(overrides?.navigation ?? {})
        }
    };
}
