<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	type FeedbackVote = 'yes' | 'no' | null;

	let { pageSlug } = $props<{ pageSlug: string }>();

	let vote = $state<FeedbackVote>(null);

	const storageKey = $derived(`svelta-docs-feedback:${pageSlug}`);

	onMount(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved === 'yes' || saved === 'no') vote = saved;
		} catch {
			// no-op in locked-down environments
		}
	});

	function setVote(next: Exclude<FeedbackVote, null>) {
		vote = next;
		try {
			localStorage.setItem(storageKey, next);
		} catch {
			// ignore storage failures
		}
	}
</script>

<section class="mt-10 rounded-2xl border border-border-soft/10 bg-background-soft p-4" data-testid="docs-feedback">
	<p class="text-sm font-medium text-text-main">Was this page helpful?</p>

	<div class="mt-3 flex items-center gap-2">
		<Button
			variant={vote === 'yes' ? 'default' : 'outline'}
			size="sm"
			onclick={() => setVote('yes')}
			data-testid="docs-feedback-yes"
		>
			Yes
		</Button>
		<Button
			variant={vote === 'no' ? 'default' : 'outline'}
			size="sm"
			onclick={() => setVote('no')}
			data-testid="docs-feedback-no"
		>
			No
		</Button>
	</div>

	{#if vote}
		<p class="mt-3 text-xs text-text-muted">Thanks for the feedback.</p>
	{/if}
</section>
