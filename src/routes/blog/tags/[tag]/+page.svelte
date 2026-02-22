<script lang="ts">
	import { BlogCard, Container, TagTabs } from '@aureuma/svelta';
	import { goto } from '$app/navigation';
	import type { BlogPost } from '$lib/types/blog';

	let { data } = $props<{
		data: {
			tag: { name: string; slug: string };
			posts: BlogPost[];
			allTags: { name: string; slug: string }[];
		};
	}>();

	function selectTag(slug: string) {
		if (!slug) {
			goto('/blog/tags');
			return;
		}
		goto(`/blog/tags/${slug}`);
	}
</script>

<Container>
	<section class="pb-24 pt-14" data-testid="blog-tag-page">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Blog tag</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">#{data.tag.name}</h1>
		<p class="mt-3 text-sm leading-6 text-text-sub">{data.posts.length} posts in this tag.</p>

		<div class="mt-8">
			<TagTabs
				categories={data.allTags.map((tag: { name: string; slug: string }) => ({ label: tag.name, slug: tag.slug }))}
				selected={data.tag.slug}
				onSelect={selectTag}
			/>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
			{#each data.posts as post (post.slug)}
				<BlogCard {post} />
			{/each}
		</div>
	</section>
</Container>
