<script lang="ts">
	import { DocsSectionGrid } from '@aureuma/svelta';
	import type { DocsPage, DocsSidebarSection } from '$lib/types/docs';

	let { data } = $props<{
		data: {
			sidebar: DocsSidebarSection[];
			landing: DocsPage | null;
		};
	}>();
</script>

<section class="mx-auto w-full max-w-5xl px-6 pb-20 pt-16">
	<div class="max-w-3xl">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">documentation</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">Build docs with svelta.</h1>
		<p class="mt-4 text-base leading-6 text-text-sub">
			Sectioned navigation, markdown content, and next/previous flow are all provided from the package.
		</p>
		{#if data.landing}
			<a
				href={`/docs/${data.landing.slug}`}
				class="mt-8 inline-flex items-center justify-center rounded-full bg-text-main px-5 py-2 text-sm font-medium text-text-invert transition hover:opacity-90"
			>
				Start with {data.landing.navTitle}
			</a>
		{/if}
	</div>

	<div class="mt-12">
		<DocsSectionGrid sections={data.sidebar} />
	</div>
</section>
