<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { BlogCard, BlogHeroCard, Container, TagTabs } from '@aureuma/svelta-blog';
	import type { BlogPost } from '$lib/types/blog';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import KeyboardIcon from '@lucide/svelte/icons/keyboard';
	import { tick } from 'svelte';

	let { data } = $props<{
		data: {
			hero: BlogPost;
			tags: { label: string; slug: string }[];
			selectedTag: string;
			allPosts: BlogPost[];
			initialPosts: BlogPost[];
			pageSize: number;
			showRss: boolean;
			hasMore: boolean;
		};
	}>();

	const getInitialPosts = () => data.initialPosts;
	const getInitialOffset = () => data.initialPosts.length;
	const getInitialHasMore = () => data.hasMore;

	let posts = $state<BlogPost[]>(getInitialPosts());
	let offset = $state(getInitialOffset());
	let hasMore = $state(getInitialHasMore());
	let loading = $state(false);
	let sentinel: HTMLDivElement | null = $state(null);
	let searchOpen = $state(false);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement | null = $state(null);

	const normalizedQuery = $derived(searchQuery.trim().toLowerCase());
	const isSearching = $derived(normalizedQuery.length > 0);
	const visiblePosts = $derived.by(() => {
		if (!normalizedQuery) return posts;

		return data.allPosts.filter((post: BlogPost) => {
			const haystack = [
				post.title,
				post.excerpt,
				post.category.label,
				post.author.name,
				post.author.title,
				post.dateLong,
				...(post.tags ?? [])
			]
				.join(' ')
				.toLowerCase();
			return haystack.includes(normalizedQuery);
		});
	});
	const resultLabel = $derived(
		`${visiblePosts.length} result${visiblePosts.length === 1 ? '' : 's'}${isSearching ? ` for “${searchQuery.trim()}”` : ''}`
	);

	$effect(() => {
		posts = data.initialPosts;
		offset = data.initialPosts.length;
		hasMore = data.hasMore;
		loading = false;
	});

	async function openSearch() {
		searchOpen = true;
		await tick();
		searchInput?.focus();
	}

	function clearSearch() {
		searchQuery = '';
		searchOpen = false;
	}

	function collapseSearch() {
		if (searchQuery.trim()) return;
		searchOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;
		const isTypingTarget =
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target?.isContentEditable;

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			void openSearch();
			return;
		}

		if (event.key === '/' && !isTypingTarget) {
			event.preventDefault();
			void openSearch();
		}
	}

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
		if (isSearching) return;
		if (!hasMore || loading) return;
		loading = true;

		try {
			const u = new URL('/blog/posts.json', $page.url.origin);
			u.searchParams.set('offset', String(offset));
			u.searchParams.set('limit', String(data.pageSize));
			if (data.selectedTag) u.searchParams.set('tag', data.selectedTag);

			const res = await fetch(u);
			if (!res.ok) return;

			const payload = (await res.json()) as { posts: BlogPost[]; hasMore: boolean };
			posts = [...posts, ...payload.posts];
			offset += payload.posts.length;
			hasMore = payload.hasMore;
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (!sentinel) return;
		if (isSearching) return;

		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) void loadMore();
			},
			{ rootMargin: '1000px 0px' }
		);

		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>svelta Blog</title>
	<meta
		name="description"
		content="A focused markdown blog system with author pages, archive views, richer discovery, and RSS."
	/>
</svelte:head>

<Container>
	<BlogHeroCard post={data.hero} />

	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div class="min-w-0 flex-1">
			<TagTabs categories={data.tags} selected={data.selectedTag} onSelect={selectTag} />
		</div>

		<div class="flex shrink-0 items-center gap-2">
			<div class:search-shell-open={searchOpen} class="search-shell" role="search">
				<button
					type="button"
					class="search-trigger"
					aria-label="Search blog posts"
					data-testid="blog-search-trigger"
					onclick={openSearch}
				>
					<SearchIcon class="size-4" />
				</button>

				<div class="search-field-wrap">
					<input
						bind:this={searchInput}
						bind:value={searchQuery}
						type="search"
						class="search-field"
						placeholder="Search by topic, excerpt, title, or author"
						aria-label="Search by topic, excerpt, title, or author"
						onfocus={openSearch}
						onblur={collapseSearch}
						onkeydown={(event) => {
							if (event.key === 'Escape') {
								clearSearch();
								searchInput?.blur();
							}
						}}
					/>
				</div>

				<div class="search-shortcut" aria-hidden="true">
					<KeyboardIcon class="size-3.5" />
					<span>⌘K</span>
				</div>

				{#if isSearching}
					<button type="button" class="search-clear" aria-label="Clear search" onclick={clearSearch}>
						<XIcon class="size-3.5" />
					</button>
				{/if}
			</div>

			{#if data.showRss}
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
			{/if}
		</div>
	</div>

	<div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft/10 pt-4">
		<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">{resultLabel}</p>
		{#if isSearching}
			<button
				type="button"
				class="inline-flex items-center gap-2 rounded-full border border-border-soft/10 bg-background-soft px-3 py-1.5 text-xs font-medium text-text-sub transition hover:text-text-main"
				onclick={clearSearch}
			>
				<XIcon class="size-3.5" />
				Reset search
			</button>
		{/if}
	</div>

	<section class="pb-32 pt-8">
		<div class="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
			{#if visiblePosts.length === 0}
				<p class="text-sm leading-6 text-text-sub">
					{#if isSearching}
						No posts match that title, excerpt, topic, or author yet.
					{:else}
						No posts in this tag yet.
					{/if}
				</p>
			{:else}
				{#each visiblePosts as post, index (post.slug)}
					<div class="blog-feed-item" style={`--entry-delay:${Math.min(index, 12) * 36}ms`}>
						<BlogCard post={post} />
					</div>
				{/each}
			{/if}
		</div>

		{#if !isSearching}
			<div class="mt-14 flex items-center justify-center">
				<div bind:this={sentinel} class="h-10 w-full" aria-hidden="true"></div>
			</div>
		{/if}

		{#if loading && !isSearching}
			<p class="mt-6 text-center text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
				Loading…
			</p>
		{/if}
	</section>
</Container>

<style>
	.search-shell {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0.2rem;
		border: 1px solid color-mix(in srgb, var(--color-border, #d8dde4) 82%, transparent);
		border-radius: 999px;
		background:
			linear-gradient(180deg, color-mix(in srgb, white 92%, transparent), color-mix(in srgb, white 84%, transparent));
		box-shadow: 0 10px 28px -22px rgba(15, 23, 42, 0.55);
		overflow: hidden;
		transition:
			width 220ms cubic-bezier(0.2, 0.9, 0.2, 1),
			border-color 180ms ease,
			box-shadow 180ms ease,
			background 180ms ease;
	}

	.search-shell-open {
		width: min(28rem, calc(100vw - 4rem));
		border-color: color-mix(in srgb, var(--color-text-main, #0f172a) 10%, var(--color-border, #d8dde4));
		box-shadow: 0 16px 40px -26px rgba(15, 23, 42, 0.5);
	}

	.search-trigger,
	.search-clear {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 2rem;
		inline-size: 2rem;
		block-size: 2rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--color-text-sub, #5b6472);
		cursor: pointer;
		transition:
			background-color 180ms ease,
			color 180ms ease,
			transform 180ms ease;
	}

	.search-trigger:hover,
	.search-clear:hover {
		color: var(--color-text-main, #101828);
		background: color-mix(in srgb, var(--color-text-main, #101828) 6%, transparent);
		transform: translateY(-1px);
	}

	.search-field-wrap {
		min-width: 0;
		flex: 1 1 auto;
		opacity: 0;
		transform: translateX(8px);
		transition:
			opacity 160ms ease,
			transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1);
		pointer-events: none;
	}

	.search-shell-open .search-field-wrap {
		opacity: 1;
		transform: translateX(0);
		pointer-events: auto;
	}

	.search-field {
		inline-size: 100%;
		border: 0;
		background: transparent;
		padding-right: 0.2rem;
		font-size: 0.9rem;
		color: var(--color-text-main, #101828);
		outline: none;
	}

	.search-field::placeholder {
		color: var(--color-text-muted, #8b94a3);
	}

	.search-shortcut {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding-inline: 0.55rem;
		height: 1.75rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-text-main, #101828) 4%, transparent);
		color: var(--color-text-muted, #8b94a3);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

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

	@media (max-width: 640px) {
		.search-shell-open {
			width: min(100%, calc(100vw - 2rem));
		}

		.search-shortcut {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-shell,
		.search-field-wrap,
		.search-trigger,
		.search-clear,
		.blog-feed-item {
			animation: none;
			transition: none;
		}
	}
</style>
