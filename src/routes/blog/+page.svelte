<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { BlogCard, BlogHeroCard, Container, TagTabs } from '@aureuma/svelta';
	import type { BlogPost } from '$lib/types/blog';
	import { onMount } from 'svelte';

	let { data } = $props<{
		data: {
			hero: BlogPost;
			categories: { label: string; slug: string }[];
			selectedCategory: string;
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

	function selectCategory(slug: string) {
		const u = new URL($page.url);
		if (!slug) u.searchParams.delete('category');
		else u.searchParams.set('category', slug);
		goto(`${u.pathname}${u.searchParams.toString() ? `?${u.searchParams.toString()}` : ''}`);
	}

	async function loadMore() {
		if (!hasMore || loading) return;
		loading = true;

		const u = new URL('/blog/posts.json', $page.url.origin);
		u.searchParams.set('offset', String(offset));
		u.searchParams.set('limit', String(data.pageSize));
		if (data.selectedCategory) u.searchParams.set('category', data.selectedCategory);

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
				if (entries.some((e) => e.isIntersecting)) loadMore();
			},
			{ rootMargin: '800px 0px' }
		);
		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<Container>
	<BlogHeroCard post={data.hero} />

	<div class="flex items-center justify-between gap-4">
		<div class="min-w-0 flex-1">
			<TagTabs
				categories={data.categories}
				selected={data.selectedCategory}
				onSelect={selectCategory}
			/>
		</div>

		<a
			href="/feed.xml"
			class="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border-soft/10 bg-background-soft text-text-sub transition hover:bg-background-main/60 hover:text-text-main"
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
		<div class="mb-8 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
			<a href="/blog/tags" class="rounded-full border border-border-soft/10 bg-background-soft px-3 py-1 transition hover:bg-background-main/60">Tags</a>
			<a href="/blog/archive" class="rounded-full border border-border-soft/10 bg-background-soft px-3 py-1 transition hover:bg-background-main/60">Archive</a>
			<a href="/blog/authors" class="rounded-full border border-border-soft/10 bg-background-soft px-3 py-1 transition hover:bg-background-main/60">Authors</a>
		</div>

		<div class="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
			{#if posts.length === 0}
				<p class="text-sm leading-6 text-text-sub">No posts in this category yet.</p>
			{:else}
				{#each posts as post (post.slug)}
					<BlogCard post={post} />
				{/each}
			{/if}
		</div>

		<div class="mt-16 flex items-center justify-center">
			<div bind:this={sentinel} class="h-10 w-full" aria-hidden="true"></div>
		</div>

		{#if loading}
			<p class="mt-6 text-center text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
				Loading…
			</p>
		{/if}
	</section>
</Container>
