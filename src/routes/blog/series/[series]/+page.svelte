<script lang="ts">
	import type { BlogSeries } from '$lib/server/blog-intelligence';

	let { data } = $props<{
		data: {
			series: BlogSeries;
		};
	}>();
</script>

<svelte:head>
	<title>{data.series.title}</title>
	<meta name="description" content={data.series.description || `${data.series.posts.length} related posts in one series.`} />
</svelte:head>

<section class="pb-24 pt-14" data-testid="blog-series-detail-page">
	<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog series</p>
	<h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-main">{data.series.title}</h1>
	{#if data.series.description}
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">{data.series.description}</p>
	{/if}

	<div class="mt-10 grid grid-cols-1 gap-5">
		{#each data.series.posts as post, index (post.slug)}
			<a
				href={`/blog/${post.slug}`}
				class="block rounded-3xl border border-border-soft/10 bg-background-soft/55 p-6 transition hover:border-emerald-500/25 hover:bg-background-soft"
			>
				<div class="flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
						Part {index + 1}
					</span>
					<span class="text-xs font-mono uppercase tracking-[0.14em] text-text-muted">{post.dateLong}</span>
				</div>
				<h2 class="mt-3 text-xl font-semibold tracking-tight text-text-main">{post.title}</h2>
				<p class="mt-3 text-sm leading-6 text-text-sub">{post.excerpt}</p>
			</a>
		{/each}
	</div>
</section>
