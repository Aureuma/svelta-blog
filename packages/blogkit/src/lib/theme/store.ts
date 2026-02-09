import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'convelt-theme';

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

function readStored(): ThemeMode {
	const v = localStorage.getItem(STORAGE_KEY);
	if (v === 'light' || v === 'dark' || v === 'system') return v;
	return 'system';
}

export const themeMode = writable<ThemeMode>('system');

export function initTheme() {
	if (!browser) return;

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

	// Keep "system" synced when OS theme changes.
	mq?.addEventListener?.('change', onChange);
	return () => mq?.removeEventListener?.('change', onChange);
}

export function setThemeMode(mode: ThemeMode) {
	themeMode.set(mode);
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, mode);
	apply(mode);
}

