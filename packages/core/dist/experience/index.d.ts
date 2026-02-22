import type { ExperienceCatalog, ExperienceDefinition, ExperienceKind } from '../types/experience';
export type { ExperienceCatalog, ExperienceDefinition, ExperienceKind } from '../types/experience';
export declare function parseExperienceKind(input: string | null | undefined, fallback?: ExperienceKind): ExperienceKind;
export declare function createExperienceCatalog(opts?: {
    defaultKind?: ExperienceKind;
    overrides?: Partial<Record<ExperienceKind, Partial<ExperienceDefinition>>>;
}): ExperienceCatalog;
