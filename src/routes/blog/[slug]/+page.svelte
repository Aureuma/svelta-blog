<script lang="ts">
	import { Avatar, BackLink, Container, ImageLightbox, MorePosts, ShareButtons, SummaryCard } from '@aureuma/svelta';
	import { attachCodeCopyButtons } from '$lib/client/code-copy';
	import type { BlogPost } from '$lib/types/blog';

	let { data } = $props<{
		data: {
			post: BlogPost;
			contentHtml: string;
			morePosts: BlogPost[];
			adjacent: { previous: BlogPost | null; next: BlogPost | null };
			canonicalUrl: string;
			seo: {
				title: string;
				description: string;
				canonicalUrl: string;
				og: { title: string; description: string; type: 'article'; url: string };
			};
		};
	}>();

	let lightbox = $state<{ src: string; alt: string } | null>(null);
	let articleEl = $state<HTMLElement | null>(null);

	$effect(() => {
		// Re-bind image zoom handlers when content changes (e.g. client-side navigation).
		const _ = data.contentHtml;
		if (!articleEl) return;

		const imgs = Array.from(articleEl.querySelectorAll('img'));
		const onClick = (e: Event) => {
			const img = e.currentTarget as HTMLImageElement;
			lightbox = { src: img.currentSrc || img.src, alt: img.alt || data.post.title };
		};
		const cleanupCodeCopy = attachCodeCopyButtons(articleEl);

		for (const img of imgs) img.addEventListener('click', onClick);
		return () => {
			for (const img of imgs) img.removeEventListener('click', onClick);
			cleanupCodeCopy();
		};
	});
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	<link rel="canonical" href={data.seo.canonicalUrl} />
	<meta property="og:title" content={data.seo.og.title} />
	<meta property="og:description" content={data.seo.og.description} />
	<meta property="og:type" content={data.seo.og.type} />
	<meta property="og:url" content={data.seo.og.url} />
</svelte:head>

<Container size="4xl">
	<div class="mt-[4.5rem] pb-[7.5rem]">
		<BackLink />

		<header class="mt-8 border-b border-border-soft/10 pb-8">
			<div class="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px]">
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
		</header>

		<div class="mt-10 grid grid-cols-1 gap-x-16 md:grid-cols-[minmax(0,628px)_160px]">
			<div class="min-w-0">
				<div class="overflow-hidden rounded-3xl border border-border-soft/10 bg-background-soft">
					<img src={data.post.cover} alt={data.post.title} class="h-[360px] w-full object-cover" />
				</div>

				{#if data.post.summaryAI}
					<div class="mt-6">
						<SummaryCard summary={data.post.summaryAI} />
					</div>
				{/if}

				<div class="mt-8 flex flex-col gap-6 md:hidden">
					<div class="flex items-center gap-3">
						<Avatar src={data.post.author.avatar} alt={data.post.author.name} size={48} />
						<div class="leading-tight">
							<a
								href={`/blog/authors/${data.post.author.id}`}
								class="text-sm font-medium tracking-tight text-text-main underline-offset-4 hover:underline"
							>
								{data.post.author.name}
							</a>
							<div class="text-xs text-text-muted">{data.post.author.title}</div>
						</div>
					</div>
					<ShareButtons title={data.post.title} url={data.canonicalUrl} testId="blog-share-mobile" />
				</div>

				<article bind:this={articleEl} class="blog-prose prose mt-10">
					{@html data.contentHtml}
				</article>

				<div class="mt-10 grid grid-cols-1 gap-3 border-y border-border-soft/10 py-6 md:grid-cols-2" data-testid="blog-adjacent-nav">
					<a
						href={data.adjacent.previous ? `/blog/${data.adjacent.previous.slug}` : '#'}
						class="rounded-2xl border border-border-soft/10 bg-background-soft p-4 transition hover:bg-background-main/60 {data.adjacent.previous ? '' : 'pointer-events-none opacity-45'}"
					>
						<p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Previous</p>
						<p class="mt-1 text-sm font-medium text-text-main">
							{data.adjacent.previous?.title || 'None'}
						</p>
					</a>
					<a
						href={data.adjacent.next ? `/blog/${data.adjacent.next.slug}` : '#'}
						class="rounded-2xl border border-border-soft/10 bg-background-soft p-4 transition hover:bg-background-main/60 {data.adjacent.next ? '' : 'pointer-events-none opacity-45'}"
					>
						<p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Next</p>
						<p class="mt-1 text-sm font-medium text-text-main">{data.adjacent.next?.title || 'None'}</p>
					</a>
				</div>

				<MorePosts posts={data.morePosts} />
			</div>

			<aside class="sticky top-20 hidden self-start md:flex md:flex-col md:gap-8">
				<div class="flex items-center gap-3">
					<Avatar src={data.post.author.avatar} alt={data.post.author.name} size={48} />
					<div class="leading-tight">
						<a
							href={`/blog/authors/${data.post.author.id}`}
							class="text-sm font-medium tracking-tight text-text-main underline-offset-4 hover:underline"
						>
							{data.post.author.name}
						</a>
						<div class="text-xs text-text-muted">{data.post.author.title}</div>
					</div>
				</div>

				<ShareButtons title={data.post.title} url={data.canonicalUrl} testId="blog-share-desktop" />
			</aside>
		</div>
	</div>
</Container>

<ImageLightbox image={lightbox} onClose={() => (lightbox = null)} />
