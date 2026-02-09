<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { image, onClose } = $props<{
		image: { src: string; alt: string } | null;
		onClose: () => void;
	}>();

	let dialogEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!browser) return;
		if (image) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
	});

	$effect(() => {
		if (!browser) return;
		if (image && dialogEl) dialogEl.focus();
	});

	onMount(() => {
		if (!browser) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
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
			onclick={onClose}
			aria-label="Close image"
		></button>
		<img
			src={image.src}
			alt={image.alt}
			class="relative max-h-[90vh] max-w-[92vw] rounded-2xl border border-white/10 bg-black/10 object-contain"
		/>
	</div>
{/if}
