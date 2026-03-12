export const DEFAULT_DOCS_PATTERN_CONFIG = {
    kind: 'docs',
    brandName: 'svelta',
    productName: 'Documentation',
    title: 'Structured docs with first-class markdown ergonomics.',
    description: 'Ship Mintlify-style docs UX with sectioned navigation, command-palette search, right-rail table of contents, and content feedback loops.',
    defaultSectionLabel: 'Guides',
    sectionOrder: ['overview', 'getting-started', 'guides', 'api', 'reference'],
    navigation: {
        header: [
            { label: 'Docs', href: '/docs' },
            { label: 'Blog', href: '/blog' }
        ],
        footer: [
            { label: 'Overview', href: '/docs/overview' },
            { label: 'Getting Started', href: '/docs/getting-started' }
        ]
    },
    search: {
        enabled: true,
        placeholder: 'Search documentation...',
        shortcut: 'Ctrl K'
    },
    toc: {
        enabled: true,
        title: 'On This Page'
    },
    feedback: {
        enabled: true,
        prompt: 'Was this page helpful?'
    },
    editLinkTemplate: 'https://github.com/Aureuma/svelta/blob/main/src/content/docs/:slug.md'
};
export const DEFAULT_BLOG_PATTERN_CONFIG = {
    kind: 'blog',
    brandName: 'svelta',
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
export function createDocsPatternConfig(overrides) {
    return {
        ...DEFAULT_DOCS_PATTERN_CONFIG,
        ...overrides,
        kind: 'docs',
        navigation: {
            ...DEFAULT_DOCS_PATTERN_CONFIG.navigation,
            ...(overrides?.navigation ?? {})
        },
        search: {
            ...DEFAULT_DOCS_PATTERN_CONFIG.search,
            ...(overrides?.search ?? {})
        },
        toc: {
            ...DEFAULT_DOCS_PATTERN_CONFIG.toc,
            ...(overrides?.toc ?? {})
        },
        feedback: {
            ...DEFAULT_DOCS_PATTERN_CONFIG.feedback,
            ...(overrides?.feedback ?? {})
        }
    };
}
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
export function createSveltaPatternConfig(overrides) {
    return {
        docs: createDocsPatternConfig(overrides?.docs),
        blog: createBlogPatternConfig(overrides?.blog)
    };
}
export function resolveDocsEditUrl(config, slug) {
    return config.editLinkTemplate.replaceAll(':slug', slug);
}
