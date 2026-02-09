import { createThemeController, type ThemeController, type ThemeMode } from '@convelt/blogkit/theme';

// Keep the storage key stable for this app (also used in `src/app.html`).
export const theme: ThemeController = createThemeController({ storageKey: 'convelt-theme' });

export const themeMode = theme.themeMode;
export const initTheme = theme.initTheme;
export const setThemeMode = theme.setThemeMode;

export type { ThemeMode };

