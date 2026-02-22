import { BROWSER } from 'esm-env';
import { writable, type Writable } from 'svelte/store';
import {
	APPEARANCE_PALETTES,
	DEFAULT_APPEARANCE_PALETTE,
	isAppearancePalette,
	type AppearancePalette,
	type AppearancePaletteId
} from './palettes';

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

function resolve(mode: AppearanceMode): 'light' | 'dark' {
	if (mode === 'light' || mode === 'dark') return mode;
	const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
	return prefersDark ? 'dark' : 'light';
}

function apply(mode: AppearanceMode) {
	const resolved = resolve(mode);
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(resolved);
	document.documentElement.dataset.appearance = mode;
}

function applyPalette(palette: AppearancePaletteId) {
	document.documentElement.dataset.palette = palette;
}

export function createAppearanceController(opts?: {
	storageKey?: string;
	paletteStorageKey?: string;
	defaultMode?: AppearanceMode;
	defaultPalette?: AppearancePaletteId;
	palettes?: readonly AppearancePalette[];
}): AppearanceController {
	const storageKey = opts?.storageKey ?? 'svelta-appearance';
	const paletteStorageKey = opts?.paletteStorageKey ?? 'svelta-appearance-palette';
	const defaultMode = opts?.defaultMode ?? 'system';
	const palettes = opts?.palettes ?? APPEARANCE_PALETTES;
	const defaultPalette = opts?.defaultPalette ?? DEFAULT_APPEARANCE_PALETTE;
	const appearanceMode = writable<AppearanceMode>(defaultMode);
	const appearancePalette = writable<AppearancePaletteId>(defaultPalette);

	function readStored(): AppearanceMode {
		const v = localStorage.getItem(storageKey);
		if (v === 'light' || v === 'dark' || v === 'system') return v;
		return defaultMode;
	}

	function readStoredPalette(): AppearancePaletteId {
		const stored = localStorage.getItem(paletteStorageKey);
		if (isAppearancePalette(stored) && palettes.some((palette) => palette.id === stored)) return stored;
		if (palettes.some((palette) => palette.id === defaultPalette)) return defaultPalette;
		return palettes[0]?.id ?? DEFAULT_APPEARANCE_PALETTE;
	}

	function initAppearance() {
		if (!BROWSER) return;

		const mode = readStored();
		const palette = readStoredPalette();
		appearanceMode.set(mode);
		appearancePalette.set(palette);
		apply(mode);
		applyPalette(palette);

		const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
		const onChange = () => {
			let current: AppearanceMode = mode;
			const unsub = appearanceMode.subscribe((v) => (current = v));
			unsub();
			if (current === 'system') apply('system');
		};

		mq?.addEventListener?.('change', onChange);
		return () => mq?.removeEventListener?.('change', onChange);
	}

	function setAppearanceMode(mode: AppearanceMode) {
		appearanceMode.set(mode);
		if (!BROWSER) return;
		localStorage.setItem(storageKey, mode);
		apply(mode);
	}

	function setAppearancePalette(palette: AppearancePaletteId) {
		if (!palettes.some((item) => item.id === palette)) return;
		appearancePalette.set(palette);
		if (!BROWSER) return;
		localStorage.setItem(paletteStorageKey, palette);
		applyPalette(palette);
	}

	return {
		storageKey,
		paletteStorageKey,
		palettes,
		appearanceMode,
		appearancePalette,
		initAppearance,
		setAppearanceMode,
		setAppearancePalette
	};
}
