<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import XIcon from '@lucide/svelte/icons/x';

	let { data } = $props<{
		data: {
			initialQuery: string;
			searchProvider: {
				mode: string;
				label: string;
				endpoint: string;
			};
			items: Array<{
				id: string;
				slug: string;
				href: string;
				title: string;
				excerpt: string;
				category: string;
				tags: string[];
				author: string;
				date: string;
				readingTime: string;
				kind: string;
			}>;
		};
	}>();

	const getInitialQuery = () => data.initialQuery;
	let query = $state(getInitialQuery());
	let remoteItems = $state<(typeof data.items) | null>(null);
	let isLoading = $state(false);
	const normalizedQuery = $derived(query.trim().toLowerCase());
	const filteredItems = $derived.by(() => {
		if (remoteItems) return remoteItems;
		if (!normalizedQuery) return data.items;
		return data.items.filter((item: (typeof data.items)[number]) =>
			[
				item.title,
				item.excerpt,
				item.category,
				item.author,
				item.date,
				item.readingTime,
				...item.tags
			]
				.join(' ')
				.toLowerCase()
				.includes(normalizedQuery)
		);
	});
	const resultLabel = $derived(
		`${filteredItems.length} result${filteredItems.length === 1 ? '' : 's'}${normalizedQuery ? ` for “${query.trim()}”` : ''}`
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const next = query.trim();
		const current = $page.url.searchParams.get('q') ?? '';
		if (next === current) return;

		const url = new URL($page.url);
		if (next) url.searchParams.set('q', next);
		else url.searchParams.delete('q');

		goto(`${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
			invalidateAll: false
			});
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const next = query.trim();
		remoteItems = null;
		if (!next) {
			isLoading = false;
			return;
		}

		let cancelled = false;
		isLoading = true;

		fetch(`${data.searchProvider.endpoint}?q=${encodeURIComponent(next)}`)
			.then((response) => (response.ok ? response.json() : Promise.reject(new Error('Search request failed'))))
			.then((payload: { items?: (typeof data.items) }) => {
				if (cancelled) return;
				remoteItems = Array.isArray(payload.items) ? payload.items : [];
			})
			.catch(() => {
				if (cancelled) return;
				remoteItems = null;
			})
			.finally(() => {
				if (cancelled) return;
				isLoading = false;
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Blog Search</title>
	<meta
		name="description"
		content="Search blog titles, excerpts, authors, tags, and categories from a dedicated index."
	/>
</svelte:head>

<section class="mx-auto max-w-5xl px-6 py-12">
	<div class="rounded-[2rem] border border-border-soft/10 bg-background-soft/55 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
		<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">Blog search</p>
		<h1 class="mt-3 text-4xl font-semibold tracking-[-0.045em] text-text-main">Search the blog index</h1>
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">
			Query titles, excerpts, categories, authors, and tags from the same machine-readable search index exposed at <a href="/blog/search.json" class="underline underline-offset-4">/blog/search.json</a>.
			The index also includes utility pages for archive, tags, authors, and series.
		</p>

		<div class="mt-6">
			<div class="flex items-center gap-3 rounded-2xl border border-border-soft/10 bg-background-main px-4 py-3">
				<input
					bind:value={query}
					type="search"
					placeholder="Search blog posts, topics, tags, and authors"
					class="min-w-0 flex-1 bg-transparent text-sm text-text-main outline-none"
					aria-label="Search blog posts, topics, tags, and authors"
				/>
				{#if query.trim()}
					<button
						type="button"
						class="inline-flex size-8 items-center justify-center rounded-full border border-border-soft/10 text-text-sub transition hover:text-text-main"
						aria-label="Clear blog search"
						onclick={() => (query = '')}
					>
						<XIcon class="size-4" />
					</button>
				{/if}
			</div>
		</div>

		<div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft/10 pt-4">
			<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">
				{resultLabel}
			</p>
			<div class="flex flex-wrap items-center gap-3">
				<p class="text-xs font-mono uppercase tracking-[0.16em] text-text-muted">
					Provider: {data.searchProvider.label}
				</p>
				<a href="/blog/search.json" class="text-xs font-mono uppercase tracking-[0.16em] text-text-sub underline underline-offset-4">
					Open JSON index
				</a>
			</div>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-4">
		{#if isLoading}
			<p class="rounded-3xl border border-border-soft/10 bg-background-soft/55 px-5 py-4 text-sm text-text-sub">
				Loading search results...
			</p>
		{/if}
		{#if filteredItems.length === 0}
			<p class="rounded-3xl border border-border-soft/10 bg-background-soft/55 px-5 py-4 text-sm text-text-sub">
				No posts match that query.
			</p>
		{:else}
			{#each filteredItems as item (item.id)}
				<a
					href={item.href}
					class="block rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 transition hover:border-emerald-500/25 hover:bg-background-soft"
				>
					<div class="flex flex-wrap items-center gap-2">
						<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
							{item.category}
						</span>
						{#if item.readingTime}
							<span class="rounded-full border border-border-soft/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-sub">
								{item.readingTime}
							</span>
						{/if}
					</div>
					<h2 class="mt-3 text-lg font-semibold tracking-tight text-text-main">{item.title}</h2>
					<p class="mt-2 text-sm leading-6 text-text-sub">{item.excerpt}</p>
					<div class="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
						{#if item.author}
							<span>{item.author}</span>
						{/if}
						{#if item.date}
							<span>{item.date}</span>
						{/if}
						{#if item.tags.length > 0}
							<span>{item.tags.slice(0, 3).join(' • ')}</span>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
	</div>
</section>
