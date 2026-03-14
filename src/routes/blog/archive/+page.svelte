<script lang="ts">
	import { BlogCard, Container } from '@aureuma/svelta-blog';
	import type { BlogArchiveGroup } from '$lib/types/blog';

	let { data } = $props<{
		data: {
			groups: BlogArchiveGroup[];
		};
	}>();
</script>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-archive-page">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog archive</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">Archive</h1>
		<p class="mt-3 max-w-2xl text-sm leading-6 text-text-sub">
			Chronological grouping by month, aligned with long-standing docs/blog systems.
		</p>

		<div class="mt-10 space-y-14">
			{#each data.groups as group (group.id)}
				<section data-testid="blog-archive-group">
					<div class="mb-6 flex items-center justify-between border-b border-border-soft/10 pb-3">
						<h2 class="text-2xl font-medium tracking-tight">{group.label}</h2>
						<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
							{group.count} posts
						</p>
					</div>
					<div class="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2">
						{#each group.posts as post (post.slug)}
							<BlogCard {post} variant="suggestion" />
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</section>
</Container>
