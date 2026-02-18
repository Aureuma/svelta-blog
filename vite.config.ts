import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

const require = createRequire(import.meta.url);
const sveltePackagePath = require.resolve('svelte/package.json');
const sveltePackage = JSON.parse(
  readFileSync(sveltePackagePath, { encoding: 'utf-8' })
);
const sveltePackageDir = dirname(sveltePackagePath);
const svelteExports = sveltePackage.exports?.['.'] ?? {};
const svelteRuntimeEntry = svelteExports.browser?.default
  ? resolvePath(sveltePackageDir, svelteExports.browser.default)
  : require.resolve('svelte');
const svelteRuntimeSsr = svelteExports.default
  ? resolvePath(sveltePackageDir, svelteExports.default)
  : resolvePath(sveltePackageDir, 'src/runtime/ssr.js');
const svelteClientShimId = '\0virtual:svelte-client-shim';
const svelteSsrShimId = '\0virtual:svelte-ssr-shim';

const svelteSsrShimPlugin: Plugin = {
  name: 'svelte-ssr-shim',
  enforce: 'pre',
  resolveId(source, _importer, options) {
    if (source === 'svelte') {
      return options?.ssr ? svelteSsrShimId : svelteClientShimId;
    }

    return null;
  },
  load(id) {
    if (id === svelteClientShimId) {
      return [
        `export * from ${JSON.stringify(svelteRuntimeEntry)};`,
        'export const fork = undefined;',
        'export const settled = undefined;',
        'export const untrack = undefined;'
      ].join('\n');
    }

    if (id === svelteSsrShimId) {
      return [
        `export * from ${JSON.stringify(svelteRuntimeSsr)};`,
        'export const fork = undefined;',
        'export const settled = undefined;',
        'export const untrack = undefined;'
      ].join('\n');
    }

    return null;
  }
};

export default defineConfig(() => ({
  plugins: [svelteSsrShimPlugin, sveltekit()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        const message =
          typeof warning === 'string' ? warning : warning.message;
        if (
          typeof message === 'string' &&
          message.includes('is not exported') &&
          message.includes('svelte') &&
          (message.includes('"settled"') || message.includes('"untrack"'))
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    allowedHosts: ['cv-dev.convelt.com', 'convelt.com']
  }
}));
