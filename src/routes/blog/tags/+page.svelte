<script lang="ts">
	import type { BlogTag } from '$lib/types/blog';
	import { Container } from '@aureuma/svelta-blog';

	let { data } = $props<{
		data: {
			tags: (BlogTag & { count: number })[];
		};
	}>();
	type TagSummary = BlogTag & { count: number };

	const sortedTags = $derived(
		data.tags.toSorted((a: TagSummary, b: TagSummary) => b.count - a.count || a.name.localeCompare(b.name))
	);
</script>

<svelte:head>
	<title>Tags | svelta Blog</title>
	<meta
		name="description"
		content="Browse every tag used across the svelta blog and jump straight to related posts."
	/>
</svelte:head>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-tags-page">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog tags</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">All tags</h1>
		<p class="mt-3 max-w-2xl text-sm leading-6 text-text-sub">
			Browse every tag used across the blog and jump directly into matching posts.
		</p>

		<div class="mt-10 flex flex-wrap gap-3">
			{#each sortedTags as tag (tag.slug)}
				<a
					href={`/blog/tags/${tag.slug}`}
					class="group inline-flex min-h-9 items-center rounded-full border border-border-soft/10 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-main/80"
					aria-label={`Filter posts by ${tag.name}`}
				>
					<span>{tag.name}</span>
					<span class="ml-2 rounded-full bg-background-main px-2 py-0.5 text-xs font-mono text-text-sub">
						{tag.count}
					</span>
				</a>
			{/each}
		</div>
	</section>
</Container>
