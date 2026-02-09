import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Allow local workspace packages to be served in dev.
			strict: false,
			allow: [path.resolve('./packages'), path.resolve('./src'), path.resolve('./node_modules')]
		}
	}
});
