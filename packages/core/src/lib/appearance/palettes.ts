export type AppearancePaletteId =
	| 'argon'
	| 'copper'
	| 'cobalt'
	| 'selenium'
	| 'neon';

export type AppearancePalette = {
	id: AppearancePaletteId;
	label: string;
	element: string;
	note: string;
};

export const APPEARANCE_PALETTES: readonly AppearancePalette[] = [
	{
		id: 'argon',
		label: 'Argon',
		element: 'Ar',
		note: 'Neutral blue-gray with calm emerald accents'
	},
	{
		id: 'copper',
		label: 'Copper',
		element: 'Cu',
		note: 'Warm metal palette with amber highlights'
	},
	{
		id: 'cobalt',
		label: 'Cobalt',
		element: 'Co',
		note: 'Deep technical blues with cool contrast'
	},
	{
		id: 'selenium',
		label: 'Selenium',
		element: 'Se',
		note: 'Editorial crimson spectrum with dark ink'
	},
	{
		id: 'neon',
		label: 'Neon',
		element: 'Ne',
		note: 'High-energy lime/cyan futuristic signal'
	}
];

export const DEFAULT_APPEARANCE_PALETTE: AppearancePaletteId = 'argon';

export function isAppearancePalette(value: string | null | undefined): value is AppearancePaletteId {
	return APPEARANCE_PALETTES.some((palette) => palette.id === value);
}
