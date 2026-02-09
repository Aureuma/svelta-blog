<script lang="ts">
	let { summary } = $props<{ summary: string }>();
</script>

<section
	class="rounded-2xl border border-border-soft/10 bg-background-soft p-4"
	data-testid="blog-summary"
>
	<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">AI SUMMARY</p>
	<p class="mt-2 text-sm leading-6 text-text-sub">{summary}</p>
</section>
