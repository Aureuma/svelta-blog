import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';

/** @type {import('unified').Plugin} */
function rehypeStripPreTabindex() {
	/** @param {any} node */
	function walk(node) {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'element' && node.tagName === 'pre' && node.properties) {
			delete node.properties.tabindex;
			delete node.properties.tabIndex;
		}
		if (Array.isArray(node.children)) node.children.forEach(walk);
	}

	return (tree) => walk(tree);
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.md'],
	frontmatter: {
		marker: '-',
		type: 'yaml',
		parse: () => undefined
	},
	highlight: false,
	remarkPlugins: [remarkGfm],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'wrap',
				properties: {
					className: ['heading-anchor']
				}
			}
		],
		[
			rehypeShiki,
			{
				themes: {
					light: 'one-light',
					dark: 'github-dark-default'
				}
			}
		],
		rehypeStripPreTabindex
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
