<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';

	export let sections: DocsSidebarSection[] = [];
	export let currentSlug = '';
</script>

<nav aria-label="Documentation" class="space-y-8" data-testid="docs-sidebar">
	{#each sections as section (section.id)}
		<section>
			<h2 class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">
				{section.label}
			</h2>
			<ul class="mt-3 space-y-1">
				{#each section.pages as page (page.slug)}
					<li>
						<a
							href={`/docs/${page.slug}`}
							class="block rounded-lg px-3 py-2 text-sm transition hover:bg-background-soft hover:text-text-main
								{currentSlug === page.slug
									? 'bg-background-soft text-text-main'
									: 'text-text-sub'}"
						>
							{page.navTitle}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</nav>
