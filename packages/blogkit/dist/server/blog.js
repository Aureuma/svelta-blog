var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DEV } from 'esm-env';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';
var frontmatterSchema = z.object({
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
var DEFAULT_CATEGORY_ORDER = [
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
    var slug = slugify(label);
    return { label: label, slug: slug };
}
function parseISODate(date) {
    // Prefer stable UTC parsing for YYYY-MM-DD.
    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
        var d_1 = new Date("".concat(date, "T00:00:00Z"));
        if (!Number.isNaN(d_1.getTime()))
            return d_1;
    }
    var d = new Date(date);
    if (Number.isNaN(d.getTime()))
        throw new Error("Invalid date: ".concat(date));
    return d;
}
var fmtLong = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
});
var fmtShort = new Intl.DateTimeFormat('en-US', {
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
    var text = stripForExcerpt(content);
    if (!text)
        return '';
    return text.length > 180 ? "".concat(text.slice(0, 177).trimEnd(), "...") : text;
}
function minutesToLabels(minutes) {
    var m = Math.max(1, Math.round(minutes));
    var unit = m === 1 ? 'minute' : 'minutes';
    return {
        minutes: m,
        short: "".concat(m, " min read"),
        long: "".concat(m, " ").concat(unit, " read")
    };
}
export function createBlog(config) {
    var _a;
    var categoryOrder = (_a = config.categoryOrder) !== null && _a !== void 0 ? _a : DEFAULT_CATEGORY_ORDER;
    var cachedMetaIndex = null;
    var cachedFullIndex = null;
    var cachedSlugToPath = null;
    function getSlugToPath() {
        if (!DEV && cachedSlugToPath)
            return cachedSlugToPath;
        var m = new Map();
        var paths = Object.keys(config.rawModules).sort();
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            var file = path.split('/').pop();
            var slug = file === null || file === void 0 ? void 0 : file.replace(/\.md(?:\?.*)?$/, '');
            if (!slug)
                continue;
            m.set(slug, path);
        }
        if (!DEV)
            cachedSlugToPath = m;
        return m;
    }
    function buildMetaIndex() {
        return __awaiter(this, void 0, Promise, function () {
            var posts, paths, _i, paths_2, path, file, slug, rawFn, raw, _a, data, content, metadata, dateObj, rt, category, excerpt;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!DEV && cachedMetaIndex)
                            return [2 /*return*/, cachedMetaIndex];
                        posts = [];
                        paths = Object.keys(config.rawModules).sort();
                        _i = 0, paths_2 = paths;
                        _d.label = 1;
                    case 1:
                        if (!(_i < paths_2.length)) return [3 /*break*/, 4];
                        path = paths_2[_i];
                        file = path.split('/').pop();
                        slug = file === null || file === void 0 ? void 0 : file.replace(/\.md(?:\?.*)?$/, '');
                        if (!slug)
                            return [3 /*break*/, 3];
                        rawFn = config.rawModules[path];
                        if (!rawFn)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, rawFn()];
                    case 2:
                        raw = _d.sent();
                        _a = matter(raw), data = _a.data, content = _a.content;
                        metadata = config.mapFrontmatter
                            ? config.mapFrontmatter({ data: data, content: content, slug: slug, path: path })
                            : frontmatterSchema.parse(data);
                        if (metadata.draft)
                            return [3 /*break*/, 3];
                        dateObj = parseISODate(metadata.date);
                        rt = minutesToLabels(readingTime(content).minutes);
                        category = normalizeCategory(metadata.category);
                        excerpt = ((_b = metadata.excerpt) === null || _b === void 0 ? void 0 : _b.trim()) || excerptFromContent(content);
                        posts.push({
                            slug: slug,
                            title: metadata.title.trim(),
                            excerpt: excerpt,
                            category: category,
                            tags: (_c = metadata.tags) !== null && _c !== void 0 ? _c : [],
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
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        posts.sort(function (a, b) { return parseISODate(b.date).getTime() - parseISODate(a.date).getTime(); });
                        if (!DEV)
                            cachedMetaIndex = posts;
                        return [2 /*return*/, posts];
                }
            });
        });
    }
    function getAllPosts() {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, buildMetaIndex()];
            });
        });
    }
    function getAllPostsFull() {
        return __awaiter(this, void 0, Promise, function () {
            var meta, slugToPath, full, _i, meta_1, post, path, compiledFn, compiled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!DEV && cachedFullIndex)
                            return [2 /*return*/, cachedFullIndex];
                        return [4 /*yield*/, buildMetaIndex()];
                    case 1:
                        meta = _a.sent();
                        slugToPath = getSlugToPath();
                        full = [];
                        _i = 0, meta_1 = meta;
                        _a.label = 2;
                    case 2:
                        if (!(_i < meta_1.length)) return [3 /*break*/, 5];
                        post = meta_1[_i];
                        path = slugToPath.get(post.slug);
                        compiledFn = path ? config.compiledModules[path] : undefined;
                        if (!compiledFn)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, compiledFn()];
                    case 3:
                        compiled = _a.sent();
                        full.push(__assign(__assign({}, post), { component: compiled.default }));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!DEV)
                            cachedFullIndex = full;
                        return [2 /*return*/, full];
                }
            });
        });
    }
    function getPostBySlug(slug) {
        return __awaiter(this, void 0, Promise, function () {
            var meta, post, path, compiledFn, compiled;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, buildMetaIndex()];
                    case 1:
                        meta = _b.sent();
                        post = (_a = meta.find(function (p) { return p.slug === slug; })) !== null && _a !== void 0 ? _a : null;
                        if (!post)
                            return [2 /*return*/, null];
                        path = getSlugToPath().get(slug);
                        compiledFn = path ? config.compiledModules[path] : undefined;
                        if (!compiledFn)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, compiledFn()];
                    case 2:
                        compiled = _b.sent();
                        return [2 /*return*/, __assign(__assign({}, post), { component: compiled.default })];
                }
            });
        });
    }
    function getCategories() {
        return __awaiter(this, void 0, Promise, function () {
            var posts, map, _i, posts_1, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getAllPosts()];
                    case 1:
                        posts = _a.sent();
                        map = new Map();
                        for (_i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
                            p = posts_1[_i];
                            map.set(p.category.slug, p.category.label);
                        }
                        return [2 /*return*/, Array.from(map.entries())
                                .map(function (_a) {
                                var slug = _a[0], label = _a[1];
                                return ({ slug: slug, label: label });
                            })
                                .sort(function (a, b) {
                                var ai = categoryOrder.indexOf(a.slug);
                                var bi = categoryOrder.indexOf(b.slug);
                                if (ai === -1 && bi === -1)
                                    return a.label.localeCompare(b.label);
                                if (ai === -1)
                                    return 1;
                                if (bi === -1)
                                    return -1;
                                return ai - bi;
                            })];
                }
            });
        });
    }
    function pickHero(posts) {
        return __awaiter(this, void 0, Promise, function () {
            var list, _a, featured;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(posts !== null && posts !== void 0)) return [3 /*break*/, 1];
                        _a = posts;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, getAllPosts()];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        list = _a;
                        featured = list.filter(function (p) { return p.featured; });
                        return [2 /*return*/, ((_b = featured[0]) !== null && _b !== void 0 ? _b : list[0])];
                }
            });
        });
    }
    return { getAllPosts: getAllPosts, getAllPostsFull: getAllPostsFull, getPostBySlug: getPostBySlug, getCategories: getCategories, pickHero: pickHero };
}
