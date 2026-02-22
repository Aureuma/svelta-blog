import type { ExperienceCatalog, ExperienceDefinition, ExperienceKind } from '../types/experience';

export type { ExperienceCatalog, ExperienceDefinition, ExperienceKind } from '../types/experience';

const DEFAULTS: Record<ExperienceKind, ExperienceDefinition> = {
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

export function parseExperienceKind(
	input: string | null | undefined,
	fallback: ExperienceKind = 'docs'
): ExperienceKind {
	if (input === 'docs' || input === 'blog') return input;
	return fallback;
}

export function createExperienceCatalog(opts?: {
	defaultKind?: ExperienceKind;
	overrides?: Partial<Record<ExperienceKind, Partial<ExperienceDefinition>>>;
}): ExperienceCatalog {
	const defaultKind = opts?.defaultKind ?? 'docs';
	const docs = {
		...DEFAULTS.docs,
		...(opts?.overrides?.docs ?? {}),
		kind: 'docs'
	} satisfies ExperienceDefinition;
	const blog = {
		...DEFAULTS.blog,
		...(opts?.overrides?.blog ?? {}),
		kind: 'blog'
	} satisfies ExperienceDefinition;

	const byKind: Record<ExperienceKind, ExperienceDefinition> = { docs, blog };
	const items: ExperienceDefinition[] = [docs, blog];

	return {
		defaultKind,
		items,
		byKind,
		resolve(kind?: string | null) {
			const parsed = parseExperienceKind(kind, defaultKind);
			return byKind[parsed];
		}
	};
}
