import { BROWSER } from 'esm-env';
import { writable } from 'svelte/store';
function resolve(mode) {
    var _a, _b, _c;
    if (mode === 'light' || mode === 'dark')
        return mode;
    var prefersDark = (_c = (_b = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-color-scheme: dark)')) === null || _b === void 0 ? void 0 : _b.matches) !== null && _c !== void 0 ? _c : false;
    return prefersDark ? 'dark' : 'light';
}
function apply(mode) {
    var resolved = resolve(mode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.dataset.theme = mode;
}
export function createThemeController(opts) {
    var _a, _b;
    var storageKey = (_a = opts === null || opts === void 0 ? void 0 : opts.storageKey) !== null && _a !== void 0 ? _a : 'blogkit-theme';
    var defaultMode = (_b = opts === null || opts === void 0 ? void 0 : opts.defaultMode) !== null && _b !== void 0 ? _b : 'system';
    var themeMode = writable(defaultMode);
    function readStored() {
        var v = localStorage.getItem(storageKey);
        if (v === 'light' || v === 'dark' || v === 'system')
            return v;
        return defaultMode;
    }
    function initTheme() {
        var _a, _b;
        if (!BROWSER)
            return;
        var mode = readStored();
        themeMode.set(mode);
        apply(mode);
        var mq = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-color-scheme: dark)');
        var onChange = function () {
            var current = mode;
            var unsub = themeMode.subscribe(function (v) { return (current = v); });
            unsub();
            if (current === 'system')
                apply('system');
        };
        (_b = mq === null || mq === void 0 ? void 0 : mq.addEventListener) === null || _b === void 0 ? void 0 : _b.call(mq, 'change', onChange);
        return function () { var _a; return (_a = mq === null || mq === void 0 ? void 0 : mq.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(mq, 'change', onChange); };
    }
    function setThemeMode(mode) {
        themeMode.set(mode);
        if (!BROWSER)
            return;
        localStorage.setItem(storageKey, mode);
        apply(mode);
    }
    return { storageKey: storageKey, themeMode: themeMode, initTheme: initTheme, setThemeMode: setThemeMode };
}
