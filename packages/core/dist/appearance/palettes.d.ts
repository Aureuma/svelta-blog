export type AppearancePaletteId = 'argon' | 'copper' | 'cobalt' | 'selenium' | 'neon';
export type AppearancePalette = {
    id: AppearancePaletteId;
    label: string;
    element: string;
    note: string;
};
export declare const APPEARANCE_PALETTES: readonly AppearancePalette[];
export declare const DEFAULT_APPEARANCE_PALETTE: AppearancePaletteId;
export declare function isAppearancePalette(value: string | null | undefined): value is AppearancePaletteId;
