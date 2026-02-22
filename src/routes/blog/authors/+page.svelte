<script lang="ts">
	import { Avatar, Container } from '@aureuma/svelta';
	import type { BlogAuthorSummary } from '$lib/types/blog';

	let { data } = $props<{
		data: {
			authors: BlogAuthorSummary[];
		};
	}>();
</script>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-authors-page">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog authors</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">Authors</h1>
		<p class="mt-3 max-w-2xl text-sm leading-6 text-text-sub">
			Dedicated author listings aligned with mature docs/blog platforms.
		</p>

		<div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.authors as item (item.author.id)}
				<a
					href={`/blog/authors/${item.author.id}`}
					class="rounded-2xl border border-border-soft/10 bg-background-soft p-5 transition hover:bg-background-main/60"
				>
					<div class="flex items-center gap-3">
						<Avatar src={item.author.avatar} alt={item.author.name} size={42} />
						<div>
							<p class="text-sm font-medium tracking-tight text-text-main">{item.author.name}</p>
							<p class="text-xs text-text-muted">{item.author.title}</p>
						</div>
					</div>
					<p class="mt-4 text-xs font-mono uppercase tracking-[0.6px] text-text-sub">
						{item.postCount} posts
					</p>
				</a>
			{/each}
		</div>
	</section>
</Container>
