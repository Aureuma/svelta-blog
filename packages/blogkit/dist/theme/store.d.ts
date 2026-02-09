import { type Writable } from 'svelte/store';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeController = {
    storageKey: string;
    themeMode: Writable<ThemeMode>;
    initTheme: () => void | (() => void);
    setThemeMode: (mode: ThemeMode) => void;
};
export declare function createThemeController(opts?: {
    storageKey?: string;
    defaultMode?: ThemeMode;
}): ThemeController;
