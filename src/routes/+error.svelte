<script lang="ts">
	let { status } = $props<{ status: number }>();

	const title = $derived(status === 404 ? 'Page not found' : 'Something went wrong');
	const description = $derived(
		status === 404
			? 'The page you requested is not part of the blog surface anymore or the URL is wrong.'
			: 'The blog hit an unexpected error while rendering this request.'
	);
</script>

<svelte:head>
	<title>{title} | svelta-blog</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="pb-24 pt-16" data-testid="blog-error-page">
	<div class="mx-auto max-w-3xl px-6">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Status {status}</p>
		<h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-main">{title}</h1>
		<p class="mt-4 max-w-2xl text-base leading-7 text-text-sub">{description}</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a href="/blog" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Back to blog</a>
			<a href="/blog/search" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Search posts</a>
			<a href="/blog/archive" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">Browse archive</a>
			<a href="/feed.xml" class="rounded-full border border-border-soft/15 bg-background-soft px-4 py-2 text-sm font-medium text-text-main transition hover:border-emerald-500/30 hover:bg-background-soft/80">RSS feed</a>
		</div>
	</div>
</section>
