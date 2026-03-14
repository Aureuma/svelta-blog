<script lang="ts">
	import { Avatar, BlogCard, Container } from '@aureuma/svelta-blog';
	import type { BlogAuthorSummary, BlogPost } from '$lib/types/blog';

	let { data } = $props<{
		data: {
			authorSummary: BlogAuthorSummary;
			posts: BlogPost[];
		};
	}>();
</script>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-author-page">
		<div class="flex items-center gap-3">
			<Avatar src={data.authorSummary.author.avatar} alt={data.authorSummary.author.name} size={52} />
			<div>
				<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Author</p>
				<h1 class="text-3xl font-semibold tracking-tight text-text-main">{data.authorSummary.author.name}</h1>
				<p class="text-sm text-text-sub">{data.authorSummary.author.title}</p>
			</div>
		</div>

		<p class="mt-5 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
			{data.authorSummary.postCount} posts
		</p>

		<div class="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
			{#each data.posts as post (post.slug)}
				<BlogCard {post} />
			{/each}
		</div>
	</section>
</Container>
