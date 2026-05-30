<script lang="ts">
	import { onMount, tick } from 'svelte';

	type TagTab = { label: string; slug: string };
	export let categories: TagTab[];
	export let selected: string; // "" means all
	export let onSelect: (slug: string) => void;
	$: items = [{ label: 'All articles', slug: '' }, ...categories];

	let railEl: HTMLDivElement | null = null;
	let buttonEls: HTMLButtonElement[] = [];
	let indicatorLeft = 0;
	let indicatorWidth = 0;
	let indicatorReady = false;

	async function syncIndicator(scroll = false) {
		await tick();
		const index = Math.max(
			0,
			items.findIndex((item) => item.slug === selected)
		);
		const button = buttonEls[index];
		if (!button) {
			indicatorReady = false;
			return;
		}

		indicatorLeft = button.offsetLeft;
		indicatorWidth = button.offsetWidth;
		indicatorReady = true;

		if (scroll) {
			button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	}

	$: {
		void selected;
		void items;
		syncIndicator(true);
	}

	onMount(() => {
		syncIndicator(false);
		const ro = new ResizeObserver(() => syncIndicator(false));
		if (railEl) ro.observe(railEl);
		return () => ro.disconnect();
	});
</script>

<div class="relative" data-testid="blog-tags">
	<div
		class="fade-mask-x no-scrollbar overflow-x-auto py-2"
		role="tablist"
		aria-label="Blog categories"
	>
		<div bind:this={railEl} class="relative inline-flex min-w-max items-center gap-1 whitespace-nowrap pr-3">
			{#if indicatorReady}
				<span
					class="pointer-events-none absolute bottom-[2px] top-[2px] z-[0] rounded-full border border-border-soft/15 bg-background-soft/90 shadow-[0_10px_20px_-14px_rgba(8,14,24,0.75)] transition-[left,width] duration-500 [transition-timing-function:cubic-bezier(0.2,0.9,0.2,1)]"
					style={`left:${indicatorLeft}px;width:${indicatorWidth}px;`}
				></span>
				<span
					class="pointer-events-none absolute bottom-[3px] top-[3px] z-[0] rounded-full bg-background-main/60 blur-[7px] transition-[left,width] duration-500 [transition-timing-function:cubic-bezier(0.2,0.9,0.2,1)]"
					style={`left:${indicatorLeft}px;width:${indicatorWidth}px;`}
				></span>
			{/if}

			{#each items as item, index (item.slug)}
				<button
					bind:this={buttonEls[index]}
					type="button"
					role="tab"
					aria-selected={selected === item.slug}
					class="relative z-[2] h-[30px] whitespace-nowrap px-3 text-xs font-mono uppercase tracking-[0.7px] transition-colors duration-200
						hover:text-text-main
						{selected === item.slug ? 'text-text-main' : 'text-text-sub'}"
					on:click={() => onSelect(item.slug)}
				>
					{item.label}
				</button>
			{/each}
		</div>
	</div>
</div>
