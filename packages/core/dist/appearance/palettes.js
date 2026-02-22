export const APPEARANCE_PALETTES = [
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
export const DEFAULT_APPEARANCE_PALETTE = 'argon';
export function isAppearancePalette(value) {
    return APPEARANCE_PALETTES.some((palette) => palette.id === value);
}
