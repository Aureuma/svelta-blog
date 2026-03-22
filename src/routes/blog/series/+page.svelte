<script lang="ts">
	import type { BlogSeries } from '$lib/server/blog-intelligence';

	let { data } = $props<{
		data: {
			series: BlogSeries[];
		};
	}>();

	function titleList(posts: BlogSeries['posts']): string {
		return posts.map((post) => post.title).join(' • ');
	}
</script>

<svelte:head>
	<title>Blog Series</title>
	<meta name="description" content="Grouped article series for multi-part blog content." />
</svelte:head>

<section class="pb-24 pt-14" data-testid="blog-series-page">
	<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog series</p>
	<h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-main">Follow multi-part writing tracks</h1>
	<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">
		Series group articles that belong together so readers can move through a larger topic intentionally instead of relying on generic recirculation.
	</p>

	<div class="mt-10 grid grid-cols-1 gap-5">
		{#each data.series as series (series.id)}
			<a
				href={`/blog/series/${series.id}`}
				class="block rounded-3xl border border-border-soft/10 bg-background-soft/55 p-6 transition hover:border-emerald-500/25 hover:bg-background-soft"
			>
				<div class="flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
						{series.posts.length} parts
					</span>
					<h2 class="text-xl font-semibold tracking-tight text-text-main">{series.title}</h2>
				</div>
				{#if series.description}
					<p class="mt-3 text-sm leading-6 text-text-sub">{series.description}</p>
				{/if}
				<p class="mt-4 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
					{titleList(series.posts)}
				</p>
			</a>
		{/each}
	</div>
</section>
