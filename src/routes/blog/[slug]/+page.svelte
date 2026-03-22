<script lang="ts">
	import { Avatar, BackLink, Container, ImageLightbox, MorePosts, ShareButtons, SummaryCard } from '@aureuma/svelta-blog';
	import { attachCodeCopyButtons } from '$lib/client/code-copy';
	import { blogSetup } from '$lib/config/blog';
	import type { BlogPost } from '$lib/types/blog';
	import type { BlogHeading } from '$lib/server/blog-headings';
	import type { BlogSeries } from '$lib/server/blog-intelligence';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let { data } = $props<{
		data: {
			post: BlogPost;
			contentHtml: string;
			morePosts: BlogPost[];
			series: BlogSeries | null;
			moreFromAuthor: BlogPost[];
			toc: BlogHeading[];
			adjacent: { previous: BlogPost | null; next: BlogPost | null };
			canonicalUrl: string;
			seo: {
				title: string;
				description: string;
				canonicalUrl: string;
				keywords: string[];
				og: {
					title: string;
					description: string;
					type: 'article';
					url: string;
					image: string;
				};
				twitter: {
					card: 'summary_large_image';
					title: string;
					description: string;
					image: string;
				};
				article: {
					publishedTime: string;
					modifiedTime: string;
					author: string;
					section: string;
					tags: string[];
				};
				jsonLd: string;
			};
		};
	}>();

	let lightbox = $state<{ src: string; alt: string } | null>(null);
	let articleEl = $state<HTMLElement | null>(null);
	let activeHeadingId = $state('');
	let readingProgress = $state(0);
	const safeJsonLd = $derived(
		data.seo.jsonLd.replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script')
	);

	$effect(() => {
		const _ = data.contentHtml;
		if (!articleEl) return;

		const imgs = Array.from(articleEl.querySelectorAll('img'));
		const onClick = (event: Event) => {
			const img = event.currentTarget as HTMLImageElement;
			lightbox = { src: img.currentSrc || img.src, alt: img.alt || data.post.title };
		};
		const cleanupCodeCopy = attachCodeCopyButtons(articleEl);

		for (const img of imgs) img.addEventListener('click', onClick);
		return () => {
			for (const img of imgs) img.removeEventListener('click', onClick);
			cleanupCodeCopy();
		};
	});

	$effect(() => {
		const _ = data.contentHtml;
		activeHeadingId = data.toc[0]?.id ?? '';
		readingProgress = 0;
		if (!articleEl || data.toc.length === 0 || typeof window === 'undefined') return;
		const article = articleEl;

		const headings = data.toc
			.map((heading: BlogHeading) => document.getElementById(heading.id))
			.filter((heading: HTMLElement | null): heading is HTMLElement => Boolean(heading));
		if (headings.length === 0) return;

		const updateReadingState = () => {
			const articleRect = article.getBoundingClientRect();
			const articleTop = window.scrollY + articleRect.top;
			const articleHeight = Math.max(article.offsetHeight, 1);
			const rawProgress = (window.scrollY - articleTop + 140) / Math.max(articleHeight - window.innerHeight * 0.55, 1);
			readingProgress = Math.max(0, Math.min(1, rawProgress));

			const current = headings
				.filter((heading: HTMLElement) => heading.getBoundingClientRect().top <= 168)
				.at(-1);
			activeHeadingId = current?.id ?? headings[0]?.id ?? '';
		};

		updateReadingState();
		window.addEventListener('scroll', updateReadingState, { passive: true });
		window.addEventListener('resize', updateReadingState);
		return () => {
			window.removeEventListener('scroll', updateReadingState);
			window.removeEventListener('resize', updateReadingState);
		};
	});
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	<meta name="keywords" content={data.seo.keywords.join(', ')} />
	<link rel="canonical" href={data.seo.canonicalUrl} />
	<meta property="og:title" content={data.seo.og.title} />
	<meta property="og:description" content={data.seo.og.description} />
	<meta property="og:type" content={data.seo.og.type} />
	<meta property="og:url" content={data.seo.og.url} />
	<meta property="og:image" content={data.seo.og.image} />
	<meta name="twitter:card" content={data.seo.twitter.card} />
	<meta name="twitter:title" content={data.seo.twitter.title} />
	<meta name="twitter:description" content={data.seo.twitter.description} />
	<meta name="twitter:image" content={data.seo.twitter.image} />
	<meta property="article:published_time" content={data.seo.article.publishedTime} />
	<meta property="article:modified_time" content={data.seo.article.modifiedTime} />
	<meta property="article:author" content={data.seo.article.author} />
	<meta property="article:section" content={data.seo.article.section} />
	{#each data.seo.article.tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}
	<svelte:element this={'script'} type="application/ld+json">{safeJsonLd}</svelte:element>
</svelte:head>

<div class="reading-progress-shell" aria-hidden="true">
	<div class="reading-progress-bar" style={`transform: scaleX(${readingProgress})`}></div>
</div>

<Container size="4xl">
	<div class="mt-[4.5rem] pb-[7.5rem]">
		<BackLink />

		<header class="mt-8 border-b border-border-soft/10 pb-8">
			<div class="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.6px]">
				<span class="text-brand">{data.post.category.label}</span>
				<span class="text-text-muted" aria-hidden="true">/</span>
				<span class="text-text-muted">{data.post.readingTimeLong}</span>
			</div>

			<h1 class="mt-4 text-4xl font-semibold leading-[44px] tracking-[-0.8px] text-text-main">
				{data.post.title}
			</h1>

			<p class="mt-4 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
				{data.post.dateLong}
			</p>

			{#if data.post.tags.length > 0}
				<div class="mt-5 flex flex-wrap gap-2">
					{#each data.post.tags as tag}
						<a
							href={`/blog?tag=${encodeURIComponent(tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))}`}
							class="inline-flex rounded-full border border-border-soft/10 bg-background-soft px-3 py-1 text-xs font-medium text-text-sub transition hover:text-text-main"
						>
							{tag}
						</a>
					{/each}
				</div>
			{/if}
		</header>

		<div class="mt-10 grid grid-cols-1 gap-x-16 xl:grid-cols-[minmax(0,628px)_220px]">
			<div class="min-w-0">
				<div class="overflow-hidden rounded-3xl border border-border-soft/10 bg-background-soft">
					<img src={data.post.cover} alt={data.post.title} class="h-[360px] w-full object-cover" />
				</div>

				{#if data.post.summaryAI}
					<div class="mt-6">
						<SummaryCard summary={data.post.summaryAI} />
					</div>
				{/if}

				<div class="mt-8 flex flex-col gap-6 xl:hidden">
					<div class="flex items-center gap-3">
						<Avatar src={data.post.author.avatar} alt={data.post.author.name} size={48} />
						<div class="leading-tight">
							<div class="text-sm font-medium tracking-tight text-text-main">{data.post.author.name}</div>
							<div class="text-xs text-text-muted">{data.post.author.title}</div>
							<a href={`/blog/authors/${data.post.author.id}`} class="mt-1 inline-flex text-[11px] font-mono uppercase tracking-[0.14em] text-text-sub underline underline-offset-4">
								View author page
							</a>
						</div>
					</div>
					<ShareButtons
						title={data.post.title}
						url={data.canonicalUrl}
						platforms={blogSetup.sharePlatforms}
						testId="blog-share-mobile"
					/>
					{#if data.toc.length > 0}
						<details class="overflow-hidden rounded-3xl border border-border-soft/10 bg-background-soft/60">
							<summary class="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-text-main">
								On this page
							</summary>
							<nav class="border-t border-border-soft/10 px-3 py-3" aria-label="Table of contents">
								<ul class="space-y-1.5">
									{#each data.toc as heading (heading.id)}
										<li>
											<a
												href={`#${heading.id}`}
												class={`block rounded-2xl px-3 py-2 text-sm transition ${activeHeadingId === heading.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : heading.level === 3 ? 'pl-6 text-text-muted hover:bg-background-main/60 hover:text-text-main' : 'text-text-sub hover:bg-background-main/60 hover:text-text-main'}`}
											>
												{heading.text}
											</a>
										</li>
									{/each}
								</ul>
							</nav>
						</details>
					{/if}
				</div>

				<article bind:this={articleEl} class="blog-prose prose mt-10">
					{@html data.contentHtml}
				</article>

				<div class="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
					<a
						href={data.adjacent.previous ? `/blog/${data.adjacent.previous.slug}` : '#'}
						class={`group rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 transition ${data.adjacent.previous ? 'hover:border-emerald-500/25 hover:bg-background-soft' : 'pointer-events-none opacity-40'}`}
					>
						<div class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
							<ChevronLeftIcon class="size-4" />
							Previous article
						</div>
						<p class="mt-3 text-sm font-medium text-text-main">{data.adjacent.previous?.title || 'None'}</p>
					</a>

					<a
						href={data.adjacent.next ? `/blog/${data.adjacent.next.slug}` : '#'}
						class={`group rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5 text-left transition ${data.adjacent.next ? 'hover:border-emerald-500/25 hover:bg-background-soft' : 'pointer-events-none opacity-40'}`}
					>
						<div class="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
							Next article
							<ChevronRightIcon class="size-4" />
						</div>
						<p class="mt-3 text-sm font-medium text-text-main">{data.adjacent.next?.title || 'None'}</p>
					</a>
				</div>

				{#if data.series}
					<section class="mt-10 rounded-3xl border border-border-soft/10 bg-background-soft/55 p-6" data-testid="blog-series-card">
						<div class="flex flex-wrap items-center gap-2">
							<span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
								Series
							</span>
							<h2 class="text-lg font-semibold tracking-tight text-text-main">{data.series.title}</h2>
						</div>
						{#if data.series.description}
							<p class="mt-3 text-sm leading-6 text-text-sub">{data.series.description}</p>
						{/if}
						<div class="mt-5 grid grid-cols-1 gap-3">
							{#each data.series.posts as seriesPost, index (seriesPost.slug)}
								<a
									href={`/blog/${seriesPost.slug}`}
									class={`rounded-2xl border border-border-soft/10 px-4 py-3 text-sm transition ${seriesPost.slug === data.post.slug ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-background-main/40 text-text-sub hover:bg-background-main/70 hover:text-text-main'}`}
								>
									Part {index + 1}: {seriesPost.title}
								</a>
							{/each}
						</div>
						<a href={`/blog/series/${data.series.id}`} class="mt-5 inline-flex text-xs font-mono uppercase tracking-[0.14em] text-text-sub underline underline-offset-4">
							View series page
						</a>
					</section>
				{/if}

				{#if data.moreFromAuthor.length > 0}
					<section class="mt-10 rounded-3xl border border-border-soft/10 bg-background-soft/55 p-6" data-testid="blog-author-recirc">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p class="text-xs font-mono uppercase tracking-[0.14em] text-text-muted">More from this author</p>
								<h2 class="mt-2 text-lg font-semibold tracking-tight text-text-main">{data.post.author.name}</h2>
							</div>
							<a href={`/blog/authors/${data.post.author.id}`} class="text-xs font-mono uppercase tracking-[0.14em] text-text-sub underline underline-offset-4">
								Author page
							</a>
						</div>
						<div class="mt-5 grid grid-cols-1 gap-3">
							{#each data.moreFromAuthor as authorPost (authorPost.slug)}
								<a
									href={`/blog/${authorPost.slug}`}
									class="rounded-2xl border border-border-soft/10 bg-background-main/40 px-4 py-3 text-sm text-text-sub transition hover:bg-background-main/70 hover:text-text-main"
								>
									{authorPost.title}
								</a>
							{/each}
						</div>
					</section>
				{/if}

				<MorePosts posts={data.morePosts} />
			</div>

			<aside class="hidden xl:flex xl:flex-col xl:gap-6">
				<div class="sticky top-24 space-y-6">
					<div class="rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5">
						<div class="flex items-center gap-3">
							<Avatar src={data.post.author.avatar} alt={data.post.author.name} size={48} />
							<div class="leading-tight">
								<div class="text-sm font-medium tracking-tight text-text-main">{data.post.author.name}</div>
								<div class="text-xs text-text-muted">{data.post.author.title}</div>
								<a href={`/blog/authors/${data.post.author.id}`} class="mt-1 inline-flex text-[11px] font-mono uppercase tracking-[0.14em] text-text-sub underline underline-offset-4">
									View author page
								</a>
							</div>
						</div>

						<div class="mt-5">
							<ShareButtons
								title={data.post.title}
								url={data.canonicalUrl}
								platforms={blogSetup.sharePlatforms}
								testId="blog-share-desktop"
							/>
						</div>
					</div>

					{#if data.toc.length > 0}
						<nav class="rounded-3xl border border-border-soft/10 bg-background-soft/55 p-5" aria-label="Table of contents">
							<p class="text-sm font-semibold text-text-main">On this page</p>
							<ul class="mt-4 space-y-1.5">
								{#each data.toc as heading (heading.id)}
									<li>
										<a
											href={`#${heading.id}`}
											class={`block rounded-2xl px-3 py-2 text-sm transition ${activeHeadingId === heading.id ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : heading.level === 3 ? 'pl-6 text-text-muted hover:bg-background-main/60 hover:text-text-main' : 'text-text-sub hover:bg-background-main/60 hover:text-text-main'}`}
										>
											{heading.text}
										</a>
									</li>
								{/each}
							</ul>
						</nav>
					{/if}
				</div>
			</aside>
		</div>
	</div>
</Container>

<ImageLightbox image={lightbox} onClose={() => (lightbox = null)} />

<style>
	.reading-progress-shell {
		position: fixed;
		top: 4rem;
		left: 0;
		right: 0;
		height: 3px;
		background: color-mix(in srgb, var(--color-border, #d8dde4) 28%, transparent);
		z-index: 45;
		pointer-events: none;
	}

	.reading-progress-bar {
		height: 100%;
		background: linear-gradient(90deg, rgb(16 185 129), rgb(52 211 153));
		transform-origin: left center;
		transition: transform 120ms ease-out;
	}
</style>
