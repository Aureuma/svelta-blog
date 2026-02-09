<script lang="ts">
	import type { BlogCategory } from '../../types/blog';

	let { categories, selected, onSelect } = $props<{
		categories: BlogCategory[];
		selected: string; // "" means all
		onSelect: (slug: string) => void;
	}>();

	let items: BlogCategory[] = $derived([{ label: 'All articles', slug: '' }, ...categories]);
</script>

<div class="relative" data-testid="blog-tags">
	<div
		class="fade-mask-x no-scrollbar flex gap-2 overflow-x-auto py-2 md:flex-wrap md:overflow-visible md:[-webkit-mask-image:none] md:[mask-image:none]"
		role="tablist"
		aria-label="Blog categories"
	>
		{#each items as item (item.slug)}
			<button
				type="button"
				role="tab"
				aria-selected={selected === item.slug}
				class="h-[31px] whitespace-nowrap rounded-full border px-3 text-xs font-mono uppercase tracking-[0.6px] transition
					hover:bg-background-main/60
					{selected === item.slug
						? 'border-border-soft/15 bg-background-main text-text-main'
						: 'border-border-soft/10 bg-background-soft text-text-sub'}"
				onclick={() => onSelect(item.slug)}
			>
				{item.label}
			</button>
		{/each}
	</div>
</div>
