import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (
      warning.code === 'unused-export-let' &&
      warning.message.includes("'params'")
    ) {
      return;
    }
    handler(warning);
  },
  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/lib/components',
      $content: 'src/content',
      $server: 'src/lib/server',
      $styles: 'src/lib/styles',
      $utils: 'src/lib/utils'
    },
    env: {
      publicPrefix: 'CV_PUBLIC_'
    }
  }
};

export default config;
