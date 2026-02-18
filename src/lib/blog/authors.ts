import { parse } from 'yaml';
import { authorFrontmatterSchema } from './schema';
import { renderMarkdown } from './markdown';
import type { AuthorFrontmatter, AuthorProfile } from './types';

const modules = import.meta.glob('/src/content/authors/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

let cachedAuthors: AuthorProfile[] | null = null;

const splitFrontmatter = (raw: string) => {
  const match = raw.match(
    /^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+([\s\S]*)$/
  );
  if (!match) {
    throw new Error('Missing or malformed frontmatter block.');
  }
  return { frontmatter: match[1], body: match[2].trim() };
};

const parseFrontmatter = (
  frontmatter: string,
  path: string
): AuthorFrontmatter => {
  const data = parse(frontmatter);
  if (!data || typeof data !== 'object') {
    throw new Error(`Author frontmatter must be a YAML object in ${path}.`);
  }
  return authorFrontmatterSchema.parse(data) as AuthorFrontmatter;
};

const parseAuthor = async (
  path: string,
  raw: string
): Promise<AuthorProfile> => {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const { frontmatter, body } = splitFrontmatter(raw);
  const parsed = parseFrontmatter(frontmatter, path);

  if (parsed.slug !== slug) {
    throw new Error(
      `Author frontmatter slug mismatch in ${path}. Expected "${slug}" but got "${parsed.slug}".`
    );
  }

  const html = await renderMarkdown(body);

  return {
    slug,
    name: parsed.name,
    role: parsed.role,
    bio: parsed.bio,
    interests: parsed.interests,
    canonical: parsed.canonical,
    avatar: parsed.avatar,
    seo: parsed.seo,
    html,
    raw: body
  };
};

export const getAllAuthors = async () => {
  if (!cachedAuthors) {
    const entries = await Promise.all(
      Object.entries(modules).map(([path, raw]) =>
        parseAuthor(path, raw as string)
      )
    );
    cachedAuthors = entries.sort((a, b) => a.name.localeCompare(b.name));
  }
  return cachedAuthors;
};

export const getAuthorBySlug = async (slug: string) => {
  const authors = await getAllAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
};
