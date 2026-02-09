<script lang="ts">
	export let src: string;
	export let alt: string;
	export let size: number = 48;
</script>

<img
	src={src}
	alt={alt}
	width={size}
	height={size}
	class="shrink-0 rounded-full border border-border-soft/10 bg-background-soft object-cover"
	style="width: {size}px; height: {size}px;"
	loading="lazy"
/>
