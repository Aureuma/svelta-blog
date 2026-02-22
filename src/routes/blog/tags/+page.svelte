<script lang="ts">
	import { Container } from '@aureuma/svelta';

	let { data } = $props<{
		data: {
			items: { name: string; slug: string; count: number }[];
		};
	}>();
</script>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-tags-page">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">Browse by tag</h1>
		<p class="mt-3 max-w-2xl text-sm leading-6 text-text-sub">
			A complete tag index similar to mature blog systems: each tag links to a dedicated landing page.
		</p>

		<div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.items as item (item.slug)}
				<a
					href={`/blog/tags/${item.slug}`}
					class="rounded-2xl border border-border-soft/10 bg-background-soft p-5 transition hover:bg-background-main/60"
				>
					<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Tag</p>
					<p class="mt-2 text-lg font-medium tracking-tight text-text-main">{item.name}</p>
					<p class="mt-2 text-sm text-text-sub">{item.count} posts</p>
				</a>
			{/each}
		</div>
	</section>
</Container>
