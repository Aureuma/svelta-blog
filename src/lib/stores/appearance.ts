import {
	APPEARANCE_PALETTES,
	DEFAULT_APPEARANCE_PALETTE,
	createAppearanceController,
	type AppearanceController,
	type AppearanceMode,
	type AppearancePaletteId
} from '@aureuma/svelta/appearance';

// Keep the storage key stable for this app (also used in `src/app.html`).
export const appearance: AppearanceController = createAppearanceController({
	storageKey: 'svelta-appearance',
	paletteStorageKey: 'svelta-appearance-palette',
	defaultPalette: DEFAULT_APPEARANCE_PALETTE
});

export const appearancePalettes = APPEARANCE_PALETTES;
export const appearanceMode = appearance.appearanceMode;
export const appearancePalette = appearance.appearancePalette;
export const initAppearance = appearance.initAppearance;
export const setAppearanceMode = appearance.setAppearanceMode;
export const setAppearancePalette = appearance.setAppearancePalette;

export type { AppearanceMode };
export type { AppearancePaletteId };
