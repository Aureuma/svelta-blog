import { createExperienceCatalog, parseExperienceKind, type ExperienceKind } from '@aureuma/svelta/experience';

const configured = parseExperienceKind(import.meta.env.PUBLIC_SVELTA_EXPERIENCE, 'docs');

export const experienceCatalog = createExperienceCatalog({
	defaultKind: configured,
	overrides: {
		docs: {
			description: 'Reference-quality documentation with structured navigation and progressive guides.'
		},
		blog: {
			description: 'Narrative long-form updates, product notes, and engineering stories.'
		}
	}
});

export const initialExperience: ExperienceKind = experienceCatalog.defaultKind;
