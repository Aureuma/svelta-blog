<script lang="ts">
	let { src, alt, size = 48 } = $props<{
		src: string;
		alt: string;
		size?: number;
	}>();
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

