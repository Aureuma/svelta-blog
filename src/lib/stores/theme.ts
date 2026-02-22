import { createThemeController, type ThemeController, type ThemeMode } from '@aureuma/blogkit/theme';

// Keep the storage key stable for this app (also used in `src/app.html`).
export const theme: ThemeController = createThemeController({ storageKey: 'svelta-theme' });

export const themeMode = theme.themeMode;
export const initTheme = theme.initTheme;
export const setThemeMode = theme.setThemeMode;

export type { ThemeMode };
