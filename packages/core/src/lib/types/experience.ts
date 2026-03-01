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

export type SveltaNavItem = {
	label: string;
	href: string;
	external?: boolean;
};

export type SveltaDocsPatternConfig = {
	kind: 'docs';
	brandName: string;
	productName: string;
	title: string;
	description: string;
	defaultSectionLabel: string;
	sectionOrder: string[];
	navigation: {
		header: SveltaNavItem[];
		footer: SveltaNavItem[];
	};
	search: {
		enabled: boolean;
		placeholder: string;
		shortcut: string;
	};
	toc: {
		enabled: boolean;
		title: string;
	};
	feedback: {
		enabled: boolean;
		prompt: string;
	};
	editLinkTemplate: string;
};

export type SveltaBlogPatternConfig = {
	kind: 'blog';
	brandName: string;
	title: string;
	description: string;
	pageSize: number;
	maxPageSize: number;
	infiniteScroll: boolean;
	showRss: boolean;
	navigation: {
		header: SveltaNavItem[];
		footer: SveltaNavItem[];
	};
};

export type SveltaPatternConfig = {
	docs: SveltaDocsPatternConfig;
	blog: SveltaBlogPatternConfig;
};
