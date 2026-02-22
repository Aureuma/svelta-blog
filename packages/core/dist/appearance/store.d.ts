import { type Writable } from 'svelte/store';
import { type AppearancePalette, type AppearancePaletteId } from './palettes';
export type AppearanceMode = 'system' | 'light' | 'dark';
export type AppearanceController = {
    storageKey: string;
    paletteStorageKey: string;
    palettes: readonly AppearancePalette[];
    appearanceMode: Writable<AppearanceMode>;
    appearancePalette: Writable<AppearancePaletteId>;
    initAppearance: () => void | (() => void);
    setAppearanceMode: (mode: AppearanceMode) => void;
    setAppearancePalette: (palette: AppearancePaletteId) => void;
};
export declare function createAppearanceController(opts?: {
    storageKey?: string;
    paletteStorageKey?: string;
    defaultMode?: AppearanceMode;
    defaultPalette?: AppearancePaletteId;
    palettes?: readonly AppearancePalette[];
}): AppearanceController;
