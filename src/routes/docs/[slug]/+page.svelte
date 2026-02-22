<script lang="ts">
	import { BackLink, DocsPager, DocsShell } from '@aureuma/svelta';
	import type { DocsPage, DocsSidebarSection } from '$lib/types/docs';

	let { data } = $props<{
		data: {
			page: DocsPage;
			contentHtml: string;
			sidebar: DocsSidebarSection[];
			adjacent: { previous: DocsPage | null; next: DocsPage | null };
			canonicalUrl: string;
		};
	}>();
</script>

<svelte:head>
	<title>{data.page.title} | svelta docs</title>
	<meta name="description" content={data.page.description || data.page.title} />
	<link rel="canonical" href={data.canonicalUrl} />
</svelte:head>

<DocsShell sections={data.sidebar} currentSlug={data.page.slug}>
	<div class="max-w-3xl">
		<BackLink href="/docs" label="Back to docs" />

		<header class="mt-6 border-b border-border-soft/10 pb-6">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-brand">{data.page.section.label}</p>
			<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">{data.page.title}</h1>
			{#if data.page.description}
				<p class="mt-3 text-sm leading-6 text-text-sub">{data.page.description}</p>
			{/if}
			{#if data.page.updatedAtLong}
				<p class="mt-4 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
					Updated {data.page.updatedAtLong}
				</p>
			{/if}
		</header>

		<article class="blog-prose prose mt-8">
			{@html data.contentHtml}
		</article>

		<DocsPager previous={data.adjacent.previous} next={data.adjacent.next} />
	</div>
</DocsShell>
