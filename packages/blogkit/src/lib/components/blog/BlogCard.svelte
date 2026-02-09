<script lang="ts">
	import type { BlogPost } from '../../types/blog';
	import Avatar from './Avatar.svelte';

	let { post, variant = 'default' } = $props<{
		post: BlogPost;
		variant?: 'default' | 'suggestion';
	}>();

	let thumbHeight = $derived(variant === 'suggestion' ? 'h-[190px]' : 'h-[280px]');
</script>

<a href={`/blog/${post.slug}`} class="group block" data-testid="blog-card">
	<div class="relative overflow-hidden rounded-2xl border border-border-soft/10 bg-background-soft {thumbHeight}">
		<img
			src={post.cover}
			alt={post.title}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
			loading="lazy"
		/>
	</div>

	<div class="mt-4">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-brand">{post.category.label}</p>
		<h3
			class="mt-1 text-xl font-medium leading-[30px] tracking-tight underline-offset-[6px] decoration-border-soft/30 group-hover:underline"
		>
			{post.title}
		</h3>
		<p class="mt-2 text-sm leading-6 text-text-sub">{post.excerpt}</p>

		<div class="mt-4 flex items-center gap-3">
			<Avatar src={post.author.avatar} alt={post.author.name} size={24} />
			<div class="leading-tight">
				<div class="text-sm font-medium tracking-tight text-text-main">{post.author.name}</div>
				<div class="text-xs text-text-muted">{post.author.title}</div>
			</div>
		</div>
	</div>
</a>
