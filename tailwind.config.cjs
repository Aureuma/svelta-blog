/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts,md}',
		'./src/content/**/*.{md}',
		'./packages/core/src/**/*.{svelte,ts}',
		'./packages/core/dist/**/*.{js,ts,svelte}'
	],
	theme: {
		extend: {
			colors: {
				background: {
					main: 'rgb(var(--c-background-main) / <alpha-value>)',
					soft: 'rgb(var(--c-background-soft) / <alpha-value>)',
					invert: 'rgb(var(--c-background-invert) / <alpha-value>)'
				},
				text: {
					main: 'rgb(var(--c-text-main) / <alpha-value>)',
					sub: 'rgb(var(--c-text-sub) / <alpha-value>)',
					muted: 'rgb(var(--c-text-muted) / <alpha-value>)',
					invert: 'rgb(var(--c-text-invert) / <alpha-value>)'
				},
				border: {
					soft: 'rgb(var(--c-border-soft) / <alpha-value>)'
				},
				brand: {
					DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
					soft: 'rgb(var(--c-brand-soft) / <alpha-value>)'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Roboto',
					'Helvetica',
					'Arial',
					'Apple Color Emoji',
					'Segoe UI Emoji'
				],
				mono: [
					'Geist Mono',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace'
				]
			},
			boxShadow: {
				'drop-md': '0 18px 60px rgba(15, 23, 42, 0.16)'
			},
			typography: () => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': 'rgb(var(--c-text-main))',
						'--tw-prose-headings': 'rgb(var(--c-text-main))',
						'--tw-prose-lead': 'rgb(var(--c-text-sub))',
						'--tw-prose-links': 'rgb(var(--c-text-main))',
						'--tw-prose-bold': 'rgb(var(--c-text-main))',
						'--tw-prose-counters': 'rgb(var(--c-text-muted))',
						'--tw-prose-bullets': 'rgb(var(--c-border-soft) / 0.35)',
						'--tw-prose-hr': 'rgb(var(--c-border-soft) / 0.12)',
						'--tw-prose-quotes': 'rgb(var(--c-text-main))',
						'--tw-prose-quote-borders': 'rgb(var(--c-border-soft) / 0.2)',
						'--tw-prose-captions': 'rgb(var(--c-text-muted))',
						'--tw-prose-code': 'rgb(var(--c-text-main))',
						'--tw-prose-pre-code': 'rgb(var(--c-text-main))',
						'--tw-prose-pre-bg': 'transparent',
						'--tw-prose-th-borders': 'rgb(var(--c-border-soft) / 0.12)',
						'--tw-prose-td-borders': 'rgb(var(--c-border-soft) / 0.12)',
						maxWidth: 'none',
						fontSize: '16px',
						lineHeight: '24px',
						letterSpacing: '-0.01em',
						a: {
							textDecoration: 'underline',
							textDecorationColor: 'rgb(var(--c-border-soft) / 0.35)',
							textUnderlineOffset: '3px'
						},
						'a:hover': {
							textDecorationColor: 'rgb(var(--c-brand) / 0.85)'
						},
						h2: {
							fontWeight: '500',
							fontSize: '24px',
							lineHeight: '31.2px',
							letterSpacing: '-0.24px',
							scrollMarginTop: '96px'
						},
						h3: {
							fontWeight: '500',
							fontSize: '20px',
							lineHeight: '26px',
							letterSpacing: '-0.24px',
							scrollMarginTop: '96px'
						},
						code: {
							fontWeight: '500',
							backgroundColor: 'rgb(var(--c-background-soft))',
							padding: '0.2em 0.35em',
							borderRadius: '6px'
						},
						'code::before': { content: '""' },
						'code::after': { content: '""' },
						pre: {
							background: 'transparent',
							padding: '0',
							margin: '0'
						},
						blockquote: {
							borderLeftColor: 'rgb(var(--c-border-soft) / 0.35)'
						},
						'blockquote p:first-of-type::before': { content: '""' },
						'blockquote p:last-of-type::after': { content: '""' },
						img: {
							borderRadius: '10px',
							border: '1px solid rgb(var(--c-border-soft) / 0.07)'
						}
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
