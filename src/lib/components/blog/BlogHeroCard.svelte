<script lang="ts">
	import type { BlogPost } from '$lib/types/blog';

	let { post } = $props<{ post: BlogPost }>();
</script>

<a
	href={`/blog/${post.slug}`}
	data-testid="blog-hero"
	class="group relative my-12 block h-[480px] overflow-hidden rounded-3xl shadow-drop-md"
>
	<img
		src={post.cover}
		alt={post.title}
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
		loading="eager"
	/>

	<div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/0"></div>

	<div class="relative flex h-full flex-col justify-end p-8">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-brand">{post.category.label}</p>
		<h2
			class="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.8px] text-white md:text-4xl"
		>
			{post.title}
		</h2>
		<p class="mt-3 max-w-2xl text-base leading-6 text-white/80">{post.excerpt}</p>

		<div class="mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-white/70">
			<span>{post.dateShort}</span>
			<span class="text-white/35" aria-hidden="true">•</span>
			<span>{post.readingTimeShort}</span>
		</div>
	</div>
</a>
