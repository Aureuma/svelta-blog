import { createExperienceCatalog, parseExperienceKind, type ExperienceKind } from '@aureuma/svelta/experience';
import { blogPattern, docsPattern } from './patterns';

const configured = parseExperienceKind(import.meta.env.PUBLIC_SVELTA_EXPERIENCE, 'docs');

export const experienceCatalog = createExperienceCatalog({
	defaultKind: configured,
	overrides: {
		docs: {
			description: docsPattern.description
		},
		blog: {
			description: blogPattern.description
		}
	}
});

export const initialExperience: ExperienceKind = experienceCatalog.defaultKind;
