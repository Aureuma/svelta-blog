<script lang="ts">
	import { BROWSER } from 'esm-env';

	let { title, url, label = 'Share this article', testId } = $props<{
		title: string;
		url: string;
		label?: string;
		testId?: string;
	}>();

	let copied = $state(false);

	function openShare(href: string) {
		if (!BROWSER) return;
		window.open(href, '_blank', 'noopener,noreferrer');
	}

	async function copyLink() {
		if (!BROWSER) return;
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			window.setTimeout(() => (copied = false), 1200);
		} catch {
			// Fallback for older browsers.
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

	let encodedUrl = $derived(encodeURIComponent(url));
	let encodedTitle = $derived(encodeURIComponent(title));
</script>

<div data-testid={testId}>
	<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">{label}</p>
	<div class="mt-3 flex flex-wrap gap-2">
		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft text-text-sub transition hover:bg-background-main/60 hover:text-text-main"
			onclick={() =>
				openShare(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`)}
			aria-label="Share on X"
		>
			<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
				<path
					fill="currentColor"
					d="M18.9 2H22l-6.8 7.8L23 22h-6.8l-5.3-6.9L4.9 22H2l7.4-8.6L1.5 2h7l4.8 6.2L18.9 2Zm-1.2 18h1.7L7.8 3.9H6.1L17.7 20Z"
				/>
			</svg>
		</button>

		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft text-text-sub transition hover:bg-background-main/60 hover:text-text-main"
			onclick={() =>
				openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
			aria-label="Share on LinkedIn"
		>
			<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
				<path
					fill="currentColor"
					d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM0.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.84v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.78 2.65 4.78 6.1v9.42h-4v-8.36c0-1.99-.03-4.55-2.77-4.55-2.77 0-3.2 2.16-3.2 4.4v8.5H8V7.98Z"
				/>
			</svg>
		</button>

		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft text-text-sub transition hover:bg-background-main/60 hover:text-text-main"
			onclick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
			aria-label="Share on Facebook"
		>
			<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
				<path
					fill="currentColor"
					d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.6v8h3.9Z"
				/>
			</svg>
		</button>

		<button
			type="button"
			class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft text-text-sub transition hover:bg-background-main/60 hover:text-text-main"
			onclick={copyLink}
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
