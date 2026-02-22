<script lang="ts">
	export let href: string = '/blog';
	export let label: string = 'Back to blog';
</script>

<a
	href={href}
	class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-text-sub transition hover:text-text-main"
>
	<svg
		class="size-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M15 18l-6-6 6-6" />
	</svg>
	<span>{label}</span>
</a>
