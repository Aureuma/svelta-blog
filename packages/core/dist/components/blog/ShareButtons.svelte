<script lang="ts">
	import { BROWSER } from 'esm-env';
	import type { SharePlatform } from '../../types/blog';

	type ShareLinkPlatform = Exclude<SharePlatform, 'copy'>;

	export let title: string;
	export let url: string;
	export let label: string = 'Share this article';
	export let testId: string | undefined = undefined;
	export let platforms: SharePlatform[] = ['x', 'linkedin', 'facebook'];

	let copied = false;

	const shareBuilders: Record<ShareLinkPlatform, (pageUrl: string, pageTitle: string) => string> = {
		x: (pageUrl, pageTitle) =>
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`,
		linkedin: (pageUrl) =>
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
		facebook: (pageUrl) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
		reddit: (pageUrl, pageTitle) =>
			`https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`,
		hackernews: (pageUrl, pageTitle) =>
			`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(pageUrl)}&t=${encodeURIComponent(pageTitle)}`
	};

	const shareLabels: Record<ShareLinkPlatform, string> = {
		x: 'Share on X',
		linkedin: 'Share on LinkedIn',
		facebook: 'Share on Facebook',
		reddit: 'Share on Reddit',
		hackernews: 'Share on Hacker News'
	};

	function openShare(href: string) {
		if (!BROWSER) return;
		window.open(href, '_blank', 'noopener,noreferrer');
	}

	function isShareLinkPlatform(platform: SharePlatform): platform is ShareLinkPlatform {
		return platform in shareBuilders;
	}

	function uniquePlatforms(input: SharePlatform[]): SharePlatform[] {
		const deduped = new Set<SharePlatform>();
		for (const platform of input) deduped.add(platform);
		return Array.from(deduped);
	}

	async function copyLink() {
		if (!BROWSER) return;
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			window.setTimeout(() => (copied = false), 1200);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = url;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
			copied = true;
			window.setTimeout(() => (copied = false), 1200);
		}
	}

	$: normalizedPlatforms = uniquePlatforms(platforms);
	$: linkPlatforms = normalizedPlatforms.filter(isShareLinkPlatform);
</script>

<div data-testid={testId}>
	<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">{label}</p>
	<div class="mt-3 flex flex-wrap gap-2">
		{#each linkPlatforms as platform (platform)}
			<button
				type="button"
				class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft/45 text-text-sub/65 transition-all duration-200 hover:bg-background-main/75 hover:text-text-main"
				on:click={() => openShare(shareBuilders[platform](url, title))}
				aria-label={shareLabels[platform]}
			>
				{#if platform === 'x'}
					<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
						<path
							fill="currentColor"
							d="M18.9 2H22l-6.8 7.8L23 22h-6.8l-5.3-6.9L4.9 22H2l7.4-8.6L1.5 2h7l4.8 6.2L18.9 2Zm-1.2 18h1.7L7.8 3.9H6.1L17.7 20Z"
						/>
					</svg>
				{:else if platform === 'linkedin'}
					<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
						<path
							fill="currentColor"
							d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM0.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.84v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.78 2.65 4.78 6.1v9.42h-4v-8.36c0-1.99-.03-4.55-2.77-4.55-2.77 0-3.2 2.16-3.2 4.4v8.5H8V7.98Z"
						/>
					</svg>
				{:else if platform === 'facebook'}
					<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
						<path
							fill="currentColor"
							d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.6v8h3.9Z"
						/>
					</svg>
				{:else if platform === 'reddit'}
					<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
						<path
							fill="currentColor"
							d="M14.8 14.4a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2Zm-5.6 0a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2ZM12 21c3.9 0 7-2.2 7-4.9a3 3 0 0 0-.9-2.1 2 2 0 1 0-3.2-2.2 10.6 10.6 0 0 0-5.8 0 2 2 0 1 0-3.2 2.2A3 3 0 0 0 5 16.1C5 18.8 8.1 21 12 21Zm0-1.6c-3 0-5.4-1.5-5.4-3.3s2.4-3.3 5.4-3.3 5.4 1.5 5.4 3.3-2.4 3.3-5.4 3.3Zm2.6-2.3a.8.8 0 1 1 0 1.6h-5.2a.8.8 0 1 1 0-1.6h5.2Z"
						/>
					</svg>
				{:else if platform === 'hackernews'}
					<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
						<path fill="currentColor" d="M3 3h18v18H3V3Zm6.8 4.2 2.2 4 2.2-4h2l-3.1 5.4V17h-2v-4.4L7.8 7.2h2Z" />
					</svg>
				{/if}
			</button>
		{/each}

		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft/45 text-text-sub/65 transition-all duration-200 hover:bg-background-main/75 hover:text-text-main"
			on:click={copyLink}
			aria-label="Copy link"
		>
			<svg
				viewBox="0 0 24 24"
				class="size-4"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
				<path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
			</svg>
		</button>
	</div>

	{#if copied}
		<p class="mt-2 text-xs font-mono uppercase tracking-[0.6px] text-brand">Copied</p>
	{/if}
</div>

