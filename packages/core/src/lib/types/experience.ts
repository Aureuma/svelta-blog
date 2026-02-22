export type ExperienceKind = 'docs' | 'blog';

export type ExperienceDefinition = {
	kind: ExperienceKind;
	label: string;
	description: string;
	href: string;
};

export type ExperienceCatalog = {
	defaultKind: ExperienceKind;
	items: ExperienceDefinition[];
	byKind: Record<ExperienceKind, ExperienceDefinition>;
	resolve: (kind?: string | null) => ExperienceDefinition;
};
