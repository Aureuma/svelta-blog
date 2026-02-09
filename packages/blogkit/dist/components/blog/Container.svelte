<script lang="ts">
	export let size: '4xl' | '5xl' = '5xl';
	$: max = size === '4xl' ? 'max-w-4xl' : 'max-w-5xl';
</script>

<div class="mx-auto w-full {max} px-6">
	<slot />
</div>
