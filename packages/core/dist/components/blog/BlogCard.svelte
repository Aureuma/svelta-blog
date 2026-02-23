<script lang="ts">
	import type { BlogPost } from '../../types/blog';
	import Avatar from './Avatar.svelte';

	export let post: BlogPost;
	export let variant: 'default' | 'suggestion' = 'default';
	$: thumbHeight = variant === 'suggestion' ? 'h-[170px]' : 'h-[236px]';
	$: primaryTag = post.tags[0] ?? post.category.label;
	$: showAuthor = variant === 'default';
</script>

<a href={`/blog/${post.slug}`} class="group block" data-testid="blog-card">
	<div class="relative overflow-hidden rounded-2xl {thumbHeight}">
		<img
			src={post.cover}
			alt={post.title}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
			loading="lazy"
		/>

		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-black/58 via-black/22 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>
	</div>

	<div class="mt-4">
		<p class="text-[10px] font-mono uppercase tracking-[0.7px] text-brand">{primaryTag}</p>
		<h3
			class="mt-1 text-[19px] font-medium leading-7 tracking-tight underline-offset-[6px] decoration-border-soft/30 group-hover:underline"
		>
			{post.title}
		</h3>
		<p class="mt-2 text-sm leading-6 text-text-sub">{post.excerpt}</p>
		<p class="mt-3 text-[11px] font-mono uppercase tracking-[0.65px] text-text-muted">
			{post.dateShort}
			<span class="mx-2 text-text-muted/50" aria-hidden="true">|</span>
			{post.readingTimeShort}
		</p>

		{#if showAuthor}
			<div class="mt-4 flex items-center gap-3">
				<Avatar src={post.author.avatar} alt={post.author.name} size={24} />
				<div class="leading-tight">
					<div class="text-sm font-medium tracking-tight text-text-main">{post.author.name}</div>
					<div class="text-xs text-text-muted">{post.author.title}</div>
				</div>
			</div>
		{/if}
	</div>
</a>
