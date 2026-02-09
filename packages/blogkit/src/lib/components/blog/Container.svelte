<script lang="ts">
	let { children, size = '5xl' } = $props<{
		children: import('svelte').Snippet;
		size?: '4xl' | '5xl';
	}>();

	let max = $derived(size === '4xl' ? 'max-w-4xl' : 'max-w-5xl');
</script>

<div class="mx-auto w-full {max} px-6">
	{@render children()}
</div>
