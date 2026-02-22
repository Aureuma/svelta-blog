<script lang="ts">
	import type { DocsSidebarSection } from '../../types/docs';

	export let sections: DocsSidebarSection[] = [];
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="docs-section-grid">
	{#each sections as section (section.id)}
		<section class="rounded-3xl border border-border-soft/10 bg-background-soft p-6">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">{section.label}</p>
			<ul class="mt-4 space-y-2">
				{#each section.pages as page (page.slug)}
					<li>
						<a
							href={`/docs/${page.slug}`}
							class="inline-flex items-center gap-2 text-sm text-text-sub transition hover:text-text-main"
						>
							<span class="inline-block size-1.5 rounded-full bg-brand"></span>
							{page.navTitle}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
