import {
	createAppearanceController,
	type AppearanceController,
	type AppearanceMode
} from '@aureuma/svelta/appearance';

// Keep the storage key stable for this app (also used in `src/app.html`).
export const appearance: AppearanceController = createAppearanceController({
	storageKey: 'svelta-appearance'
});

export const appearanceMode = appearance.appearanceMode;
export const initAppearance = appearance.initAppearance;
export const setAppearanceMode = appearance.setAppearanceMode;

export type { AppearanceMode };
