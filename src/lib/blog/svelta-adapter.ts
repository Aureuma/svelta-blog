import type { BlogAuthor, BlogCategory, BlogPost } from '@aureuma/svelta';

type MaybeRecord = Record<string, unknown>;

function isRecord(value: unknown): value is MaybeRecord {
  return typeof value === 'object' && value !== null;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const asDate = new Date(value);
    if (!Number.isNaN(asDate.getTime())) {
      return asDate.toISOString().slice(0, 10);
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

function fmtDateLong(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
}

function fmtDateShort(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(d);
}

function normalizeTags(tagsValue: unknown): string[] {
  if (!Array.isArray(tagsValue)) return [];

  return tagsValue
    .map((tag) => {
      if (typeof tag === 'string') return tag;
      if (isRecord(tag) && typeof tag.name === 'string') return tag.name;
      return '';
    })
    .filter((tag) => tag.length > 0);
}

function parseReading(readingValue: unknown): { minutes: number; short: string; long: string } {
  const fallbackMinutes = 5;

  if (typeof readingValue === 'string') {
    const match = readingValue.match(/(\d+)/);
    if (match) {
      const minutes = Math.max(1, Number.parseInt(match[1], 10));
      return {
        minutes,
        short: `${minutes} min read`,
        long: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} read`
      };
    }
  }

  if (typeof readingValue === 'number' && Number.isFinite(readingValue)) {
    const minutes = Math.max(1, Math.round(readingValue));
    return {
      minutes,
      short: `${minutes} min read`,
      long: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} read`
    };
  }

  return {
    minutes: fallbackMinutes,
    short: `${fallbackMinutes} min read`,
    long: `${fallbackMinutes} minutes read`
  };
}

function normalizeAuthor(
  authorValue: unknown,
  fallbackAuthor?: Partial<BlogAuthor>
): BlogAuthor {
  const record = isRecord(authorValue) ? authorValue : {};

  let avatar = '/favicon.ico';
  if (typeof record.avatar === 'string') {
    avatar = record.avatar;
  } else if (isRecord(record.avatar) && typeof record.avatar.url === 'string') {
    avatar = record.avatar.url;
  } else if (fallbackAuthor?.avatar) {
    avatar = fallbackAuthor.avatar;
  }

  return {
    id:
      (typeof record.slug === 'string' && record.slug) ||
      (typeof record.id === 'string' && record.id) ||
      fallbackAuthor?.id ||
      'unknown',
    name:
      (typeof record.name === 'string' && record.name) ||
      fallbackAuthor?.name ||
      'Unknown Author',
    title:
      (typeof record.role === 'string' && record.role) ||
      (typeof record.title === 'string' && record.title) ||
      fallbackAuthor?.title ||
      'Contributor',
    avatar
  };
}

function normalizeCategory(source: MaybeRecord, tags: string[]): BlogCategory {
  if (isRecord(source.category)) {
    const labelValue = source.category.label;
    const slugValue = source.category.slug;
    if (typeof labelValue === 'string' && typeof slugValue === 'string') {
      return { label: labelValue, slug: slugValue };
    }
  }

  const label = tags[0] ?? 'General';
  return { label, slug: toSlug(label) || 'general' };
}

function coverFromSource(source: MaybeRecord): string {
  if (typeof source.cover === 'string' && source.cover.length > 0) {
    return source.cover;
  }

  if (isRecord(source.ogImage) && typeof source.ogImage.url === 'string') {
    return source.ogImage.url;
  }

  return '/favicon.ico';
}

export function toSveltaPost(
  source: MaybeRecord,
  fallbackAuthor?: Partial<BlogAuthor>
): BlogPost {
  const tags = normalizeTags(source.tags);
  const isoDate = toIsoDate(
    source.publishedAtIso ?? source.publishedAt ?? source.date
  );

  const readingInput =
    source.readingTime ?? source.readingTimeShort ?? source.readingMinutes;
  const reading = parseReading(readingInput);

  const description =
    (typeof source.description === 'string' && source.description) ||
    (typeof source.excerpt === 'string' && source.excerpt) ||
    '';

  return {
    slug:
      (typeof source.slug === 'string' && source.slug) ||
      `post-${Math.random().toString(36).slice(2, 8)}`,
    title:
      (typeof source.title === 'string' && source.title) ||
      'Untitled post',
    excerpt: description,
    category: normalizeCategory(source, tags),
    tags,
    author: normalizeAuthor(source.author, fallbackAuthor),
    date: isoDate,
    dateLong:
      (typeof source.publishedLabel === 'string' && source.publishedLabel) ||
      (typeof source.dateLong === 'string' && source.dateLong) ||
      fmtDateLong(isoDate),
    dateShort:
      (typeof source.dateShort === 'string' && source.dateShort) ||
      fmtDateShort(isoDate),
    readingMinutes: reading.minutes,
    readingTimeShort:
      (typeof source.readingTimeShort === 'string' && source.readingTimeShort) ||
      reading.short,
    readingTimeLong:
      (typeof source.readingTimeLong === 'string' && source.readingTimeLong) ||
      reading.long,
    cover: coverFromSource(source),
    summaryAI:
      typeof source.summaryAI === 'string' ? source.summaryAI : undefined,
    featured: Boolean(source.featured)
  };
}

export function toSveltaPosts(
  posts: unknown[],
  fallbackAuthor?: Partial<BlogAuthor>
): BlogPost[] {
  return posts
    .filter(isRecord)
    .map((post) => toSveltaPost(post, fallbackAuthor));
}

export function collectTagCategories(posts: BlogPost[]): BlogCategory[] {
  const map = new Map<string, BlogCategory>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = toSlug(tag);
      if (!slug) continue;
      map.set(slug, { label: tag, slug });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}
