<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { BlogCard, BlogHeroCard, Container, TagTabs } from '@aureuma/svelta';
	import type { BlogPost } from '$lib/types/blog';
	import { onMount } from 'svelte';

	let { data } = $props<{
		data: {
			hero: BlogPost;
			tags: { label: string; slug: string }[];
			selectedTag: string;
			initialPosts: BlogPost[];
			pageSize: number;
			hasMore: boolean;
			total: number;
		};
	}>();

	let posts = $state<BlogPost[]>([]);
	let offset = $state(0);
	let hasMore = $state(false);
	let loading = $state(false);
	let sentinel: HTMLDivElement | null = $state(null);

	$effect(() => {
		posts = data.initialPosts;
		offset = data.initialPosts.length;
		hasMore = data.hasMore;
		loading = false;
	});

	function selectTag(slug: string) {
		const u = new URL($page.url);
		if (!slug) u.searchParams.delete('tag');
		else u.searchParams.set('tag', slug);
		goto(`${u.pathname}${u.searchParams.toString() ? `?${u.searchParams.toString()}` : ''}`, {
			keepFocus: true,
			noScroll: true
		});
	}

	async function loadMore() {
		if (!hasMore || loading) return;
		loading = true;

		const u = new URL('/blog/posts.json', $page.url.origin);
		u.searchParams.set('offset', String(offset));
		u.searchParams.set('limit', String(data.pageSize));
		if (data.selectedTag) u.searchParams.set('tag', data.selectedTag);

		const res = await fetch(u);
		if (!res.ok) {
			loading = false;
			return;
		}

		const payload = (await res.json()) as { posts: BlogPost[]; hasMore: boolean };
		posts = [...posts, ...payload.posts];
		offset += payload.posts.length;
		hasMore = payload.hasMore;
		loading = false;
	}

	onMount(() => {
		if (!sentinel) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) loadMore();
			},
			{ rootMargin: '1000px 0px' }
		);
		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<Container>
	<BlogHeroCard post={data.hero} />

	<div class="flex items-center justify-between gap-4">
		<div class="min-w-0 flex-1">
			<TagTabs categories={data.tags} selected={data.selectedTag} onSelect={selectTag} />
		</div>

		<a
			href="/feed.xml"
			class="inline-flex size-7 shrink-0 items-center justify-center text-text-muted transition hover:text-text-main"
			aria-label="RSS feed"
		>
			<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true">
				<path
					fill="currentColor"
					d="M6.18 17.82a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36ZM2 8.5v3.1c5.7 0 10.4 4.7 10.4 10.4h3.1C15.5 14.6 9.4 8.5 2 8.5Zm0-6v3.1c9.1 0 16.4 7.3 16.4 16.4H22C22 11.2 12.8 2 2 2Z"
				/>
			</svg>
		</a>
	</div>

	<section class="pb-32 pt-8">
		<div class="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
			{#if posts.length === 0}
				<p class="text-sm leading-6 text-text-sub">No posts in this tag yet.</p>
			{:else}
				{#each posts as post, index (post.slug)}
					<div class="blog-feed-item" style={`--entry-delay:${Math.min(index, 12) * 36}ms`}>
						<BlogCard post={post} />
					</div>
				{/each}
			{/if}
		</div>

		<div class="mt-14 flex items-center justify-center">
			<div bind:this={sentinel} class="h-10 w-full" aria-hidden="true"></div>
		</div>

		{#if loading}
			<p class="mt-6 text-center text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
				Loading…
			</p>
		{/if}
	</section>
</Container>

<style>
	.blog-feed-item {
		animation: blog-feed-item-in 460ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: var(--entry-delay, 0ms);
		will-change: opacity, transform;
	}

	@keyframes blog-feed-item-in {
		from {
			opacity: 0;
			transform: translate3d(0, 18px, 0);
		}
		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blog-feed-item {
			animation: none;
		}
	}
</style>

