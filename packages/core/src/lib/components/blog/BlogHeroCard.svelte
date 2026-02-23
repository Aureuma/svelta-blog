<script lang="ts">
	import type { BlogPost } from '../../types/blog';
	import Avatar from './Avatar.svelte';

	export let post: BlogPost;
	$: primaryTag = post.tags[0] ?? post.category.label;
</script>

<a
	href={`/blog/${post.slug}`}
	data-testid="blog-hero"
	class="group relative my-10 block overflow-hidden rounded-[22px]"
>
	<img
		src={post.cover}
		alt={post.title}
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
		loading="eager"
	/>

	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-black/0 transition-opacity duration-300 group-hover:opacity-95"
	></div>

	<div class="relative aspect-[16/9] min-h-[320px] w-full md:min-h-[420px]">
		<div class="relative flex h-full flex-col justify-end p-6 md:p-8">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-brand">{primaryTag}</p>
			<h2
				class="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.8px] text-white md:text-4xl"
			>
				{post.title}
			</h2>
			<p class="mt-3 max-w-2xl text-sm leading-6 text-white/82 md:text-base">{post.excerpt}</p>

			<div
				class="mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-white/70"
			>
				<span>{post.dateShort}</span>
				<span class="text-white/35" aria-hidden="true">•</span>
				<span>{post.readingTimeShort}</span>
			</div>

			<div class="mt-4 flex items-center gap-3">
				<Avatar src={post.author.avatar} alt={post.author.name} size={26} />
				<div class="leading-tight">
					<div class="text-sm font-medium tracking-tight text-white">{post.author.name}</div>
					<div class="text-xs text-white/70">{post.author.title}</div>
				</div>
			</div>
		</div>
	</div>
</a>
