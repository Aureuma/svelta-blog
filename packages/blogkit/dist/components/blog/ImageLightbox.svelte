<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { onDestroy, onMount, tick } from 'svelte';

	export let image: { src: string; alt: string } | null;
	export let onClose: () => void;

	let dialogEl: HTMLDivElement | null = null;

	$: if (BROWSER) {
		// Prevent background scroll while open.
		document.body.style.overflow = image ? 'hidden' : '';
	}

	$: if (BROWSER && image) {
		// Ensure the dialog is focusable for Escape-to-close and accessibility.
		void (async () => {
			await tick();
			dialogEl?.focus();
		})();
	}

	onMount(() => {
		if (!BROWSER) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	onDestroy(() => {
		if (!BROWSER) return;
		document.body.style.overflow = '';
	});
</script>

{#if image}
	<div
		bind:this={dialogEl}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<button
			type="button"
			class="absolute inset-0 cursor-zoom-out"
			on:click={onClose}
			aria-label="Close image"
		></button>
		<img
			src={image.src}
			alt={image.alt}
			class="relative max-h-[90vh] max-w-[92vw] rounded-2xl border border-white/10 bg-black/10 object-contain"
		/>
	</div>
{/if}
