const DEFAULTS = {
    docs: {
        kind: 'docs',
        label: 'Documentation',
        description: 'Structured guides with sections, side navigation, and next/previous links.',
        href: '/docs'
    },
    blog: {
        kind: 'blog',
        label: 'Blog',
        description: 'Editorial posts with categories, summaries, and RSS distribution.',
        href: '/blog'
    }
};
export function parseExperienceKind(input, fallback = 'docs') {
    if (input === 'docs' || input === 'blog')
        return input;
    return fallback;
}
export function createExperienceCatalog(opts) {
    const defaultKind = opts?.defaultKind ?? 'docs';
    const docs = {
        ...DEFAULTS.docs,
        ...(opts?.overrides?.docs ?? {}),
        kind: 'docs'
    };
    const blog = {
        ...DEFAULTS.blog,
        ...(opts?.overrides?.blog ?? {}),
        kind: 'blog'
    };
    const byKind = { docs, blog };
    const items = [docs, blog];
    return {
        defaultKind,
        items,
        byKind,
        resolve(kind) {
            const parsed = parseExperienceKind(kind, defaultKind);
            return byKind[parsed];
        }
    };
}
