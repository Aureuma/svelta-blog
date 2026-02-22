import { BROWSER } from 'esm-env';
import { writable } from 'svelte/store';
function resolve(mode) {
    if (mode === 'light' || mode === 'dark')
        return mode;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    return prefersDark ? 'dark' : 'light';
}
function apply(mode) {
    const resolved = resolve(mode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.dataset.theme = mode;
}
export function createThemeController(opts) {
    const storageKey = opts?.storageKey ?? 'blogkit-theme';
    const defaultMode = opts?.defaultMode ?? 'system';
    const themeMode = writable(defaultMode);
    function readStored() {
        const v = localStorage.getItem(storageKey);
        if (v === 'light' || v === 'dark' || v === 'system')
            return v;
        return defaultMode;
    }
    function initTheme() {
        if (!BROWSER)
            return;
        const mode = readStored();
        themeMode.set(mode);
        apply(mode);
        const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
        const onChange = () => {
            let current = mode;
            const unsub = themeMode.subscribe((v) => (current = v));
            unsub();
            if (current === 'system')
                apply('system');
        };
        mq?.addEventListener?.('change', onChange);
        return () => mq?.removeEventListener?.('change', onChange);
    }
    function setThemeMode(mode) {
        themeMode.set(mode);
        if (!BROWSER)
            return;
        localStorage.setItem(storageKey, mode);
        apply(mode);
    }
    return { storageKey, themeMode, initTheme, setThemeMode };
}
