import { DEV } from 'esm-env';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';
const frontmatterSchema = z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    author: z.string(),
    cover: z.string(),
    excerpt: z.string().optional(),
    summaryAI: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional()
});
const DEFAULT_CATEGORY_ORDER = [
    'all',
    'ai-trends',
    'announcements',
    'for-founders',
    'engineering',
    'design',
    'best-practices'
];
function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function normalizeCategory(label) {
    const slug = slugify(label);
    return { label, slug };
}
function parseISODate(date) {
    // Prefer stable UTC parsing for YYYY-MM-DD.
    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
        const d = new Date(`${date}T00:00:00Z`);
        if (!Number.isNaN(d.getTime()))
            return d;
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime()))
        throw new Error(`Invalid date: ${date}`);
    return d;
}
const fmtLong = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
});
const fmtShort = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
});
function stripForExcerpt(markdown) {
    return (markdown
        // remove fenced code blocks
        .replace(/```[\s\S]*?```/g, '')
        // remove images
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        // remove links but keep text
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        // remove headings markers
        .replace(/^#{1,6}\s+/gm, '')
        // remove blockquote markers
        .replace(/^>\s+/gm, '')
        // remove emphasis markers
        .replace(/[*_`]/g, '')
        // collapse whitespace
        .replace(/\s+/g, ' ')
        .trim());
}
function excerptFromContent(content) {
    const text = stripForExcerpt(content);
    if (!text)
        return '';
    return text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text;
}
function minutesToLabels(minutes) {
    const m = Math.max(1, Math.round(minutes));
    const unit = m === 1 ? 'minute' : 'minutes';
    return {
        minutes: m,
        short: `${m} min read`,
        long: `${m} ${unit} read`
    };
}
export function createBlog(config) {
    const categoryOrder = config.categoryOrder ?? DEFAULT_CATEGORY_ORDER;
    let cachedMetaIndex = null;
    let cachedFullIndex = null;
    let cachedSlugToPath = null;
    function getSlugToPath() {
        if (!DEV && cachedSlugToPath)
            return cachedSlugToPath;
        const m = new Map();
        const paths = Object.keys(config.rawModules).sort();
        for (const path of paths) {
            const file = path.split('/').pop();
            const slug = file?.replace(/\.md(?:\?.*)?$/, '');
            if (!slug)
                continue;
            m.set(slug, path);
        }
        if (!DEV)
            cachedSlugToPath = m;
        return m;
    }
    async function buildMetaIndex() {
        if (!DEV && cachedMetaIndex)
            return cachedMetaIndex;
        const posts = [];
        const paths = Object.keys(config.rawModules).sort();
        for (const path of paths) {
            const file = path.split('/').pop();
            // Glob keys can include query strings depending on bundler usage; normalize aggressively.
            const slug = file?.replace(/\.md(?:\?.*)?$/, '');
            if (!slug)
                continue;
            const rawFn = config.rawModules[path];
            if (!rawFn)
                continue;
            const raw = await rawFn();
            const { data, content } = matter(raw);
            const metadata = config.mapFrontmatter
                ? config.mapFrontmatter({ data, content, slug, path })
                : frontmatterSchema.parse(data);
            if (metadata.draft)
                continue;
            const dateObj = parseISODate(metadata.date);
            const rt = minutesToLabels(readingTime(content).minutes);
            const category = normalizeCategory(metadata.category);
            const excerpt = metadata.excerpt?.trim() || excerptFromContent(content);
            posts.push({
                slug,
                title: metadata.title.trim(),
                excerpt,
                category,
                tags: metadata.tags ?? [],
                author: config.getAuthor(metadata.author),
                date: metadata.date,
                dateLong: fmtLong.format(dateObj),
                dateShort: fmtShort.format(dateObj),
                readingMinutes: rt.minutes,
                readingTimeShort: rt.short,
                readingTimeLong: rt.long,
                cover: metadata.cover,
                summaryAI: metadata.summaryAI,
                featured: Boolean(metadata.featured)
            });
        }
        posts.sort((a, b) => parseISODate(b.date).getTime() - parseISODate(a.date).getTime());
        if (!DEV)
            cachedMetaIndex = posts;
        return posts;
    }
    async function getAllPosts() {
        return buildMetaIndex();
    }
    async function getAllPostsFull() {
        if (!DEV && cachedFullIndex)
            return cachedFullIndex;
        const meta = await buildMetaIndex();
        const slugToPath = getSlugToPath();
        const full = [];
        for (const post of meta) {
            const path = slugToPath.get(post.slug);
            const compiledFn = path ? config.compiledModules[path] : undefined;
            if (!compiledFn)
                continue;
            const compiled = await compiledFn();
            full.push({ ...post, component: compiled.default });
        }
        if (!DEV)
            cachedFullIndex = full;
        return full;
    }
    async function getPostBySlug(slug) {
        const meta = await buildMetaIndex();
        const post = meta.find((p) => p.slug === slug) ?? null;
        if (!post)
            return null;
        const path = getSlugToPath().get(slug);
        const compiledFn = path ? config.compiledModules[path] : undefined;
        if (!compiledFn)
            return null;
        const compiled = await compiledFn();
        return { ...post, component: compiled.default };
    }
    async function getCategories() {
        const posts = await getAllPosts();
        const map = new Map();
        for (const p of posts)
            map.set(p.category.slug, p.category.label);
        return Array.from(map.entries())
            .map(([slug, label]) => ({ slug, label }))
            .sort((a, b) => {
            const ai = categoryOrder.indexOf(a.slug);
            const bi = categoryOrder.indexOf(b.slug);
            if (ai === -1 && bi === -1)
                return a.label.localeCompare(b.label);
            if (ai === -1)
                return 1;
            if (bi === -1)
                return -1;
            return ai - bi;
        });
    }
    async function pickHero(posts) {
        const list = posts ?? (await getAllPosts());
        const featured = list.filter((p) => p.featured);
        return (featured[0] ?? list[0]);
    }
    return { getAllPosts, getAllPostsFull, getPostBySlug, getCategories, pickHero };
}
