export {
	createAppearanceController,
	type AppearanceController,
	type AppearanceMode
} from './store';
export { default as AppearanceSwitcher } from './AppearanceSwitcher.svelte';
export {
	APPEARANCE_PALETTES,
	DEFAULT_APPEARANCE_PALETTE,
	isAppearancePalette,
	type AppearancePalette,
	type AppearancePaletteId
} from './palettes';
