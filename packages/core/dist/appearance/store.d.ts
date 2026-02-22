import { type Writable } from 'svelte/store';
export type AppearanceMode = 'system' | 'light' | 'dark';
export type AppearanceController = {
    storageKey: string;
    appearanceMode: Writable<AppearanceMode>;
    initAppearance: () => void | (() => void);
    setAppearanceMode: (mode: AppearanceMode) => void;
};
export declare function createAppearanceController(opts?: {
    storageKey?: string;
    defaultMode?: AppearanceMode;
}): AppearanceController;
