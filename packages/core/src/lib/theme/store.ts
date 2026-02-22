import { BROWSER } from 'esm-env';
import { writable, type Writable } from 'svelte/store';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeController = {
	storageKey: string;
	themeMode: Writable<ThemeMode>;
	initTheme: () => void | (() => void);
	setThemeMode: (mode: ThemeMode) => void;
};

function resolve(mode: ThemeMode): 'light' | 'dark' {
	if (mode === 'light' || mode === 'dark') return mode;
	const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
	return prefersDark ? 'dark' : 'light';
}

function apply(mode: ThemeMode) {
	const resolved = resolve(mode);
	document.documentElement.classList.remove('light', 'dark');
	document.documentElement.classList.add(resolved);
	document.documentElement.dataset.theme = mode;
}

export function createThemeController(opts?: { storageKey?: string; defaultMode?: ThemeMode }): ThemeController {
	const storageKey = opts?.storageKey ?? 'svelta-theme';
	const defaultMode = opts?.defaultMode ?? 'system';
	const themeMode = writable<ThemeMode>(defaultMode);

	function readStored(): ThemeMode {
		const v = localStorage.getItem(storageKey);
		if (v === 'light' || v === 'dark' || v === 'system') return v;
		return defaultMode;
	}

	function initTheme() {
		if (!BROWSER) return;

		const mode = readStored();
		themeMode.set(mode);
		apply(mode);

		const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
		const onChange = () => {
			let current: ThemeMode = mode;
			const unsub = themeMode.subscribe((v) => (current = v));
			unsub();
			if (current === 'system') apply('system');
		};

		mq?.addEventListener?.('change', onChange);
		return () => mq?.removeEventListener?.('change', onChange);
	}

	function setThemeMode(mode: ThemeMode) {
		themeMode.set(mode);
		if (!BROWSER) return;
		localStorage.setItem(storageKey, mode);
		apply(mode);
	}

	return { storageKey, themeMode, initTheme, setThemeMode };
}
