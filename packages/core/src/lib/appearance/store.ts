import { BROWSER } from 'esm-env';
import { writable, type Writable } from 'svelte/store';

export type AppearanceMode = 'system' | 'light' | 'dark';

export type AppearanceController = {
	storageKey: string;
	appearanceMode: Writable<AppearanceMode>;
	initAppearance: () => void | (() => void);
	setAppearanceMode: (mode: AppearanceMode) => void;
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

export function createAppearanceController(opts?: {
	storageKey?: string;
	defaultMode?: AppearanceMode;
}): AppearanceController {
	const storageKey = opts?.storageKey ?? 'svelta-appearance';
	const defaultMode = opts?.defaultMode ?? 'system';
	const appearanceMode = writable<AppearanceMode>(defaultMode);

	function readStored(): AppearanceMode {
		const v = localStorage.getItem(storageKey);
		if (v === 'light' || v === 'dark' || v === 'system') return v;
		return defaultMode;
	}

	function initAppearance() {
		if (!BROWSER) return;

		const mode = readStored();
		appearanceMode.set(mode);
		apply(mode);

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

	return { storageKey, appearanceMode, initAppearance, setAppearanceMode };
}
