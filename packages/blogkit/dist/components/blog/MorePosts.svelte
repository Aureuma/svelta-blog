<script lang="ts">
	import type { BlogPost } from '../../types/blog';
	import BlogCard from './BlogCard.svelte';

	export let posts: BlogPost[];
</script>

<section class="mt-16" data-testid="blog-more-posts">
	<h2 class="text-lg font-medium tracking-tight text-text-main">More blog posts to read</h2>
	<div class="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
		{#each posts as post (post.slug)}
			<BlogCard post={post} variant="suggestion" />
		{/each}
	</div>
</section>
