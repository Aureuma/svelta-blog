<script lang="ts">
	import { page } from '$app/stores';
	import { initialExperience } from '$lib/config/experience';

	function isActive(path: string) {
		if (path === '/') return $page.url.pathname === '/';
		return $page.url.pathname === path || $page.url.pathname.startsWith(`${path}/`);
	}

	$: experienceLabel = initialExperience === 'docs' ? 'Docs' : 'Blog';
</script>

<header
	data-testid="site-header"
	class="sticky top-0 z-50 border-b border-border-soft/10 bg-background-main/75 backdrop-blur supports-[backdrop-filter]:bg-background-main/55"
>
	<div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
		<a href="/" class="group inline-flex items-center gap-2">
			<span class="text-sm font-semibold tracking-tight">svelta</span>
			<span
				class="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-mono uppercase tracking-[0.6px] text-brand"
			>
				{experienceLabel} experience
			</span>
		</a>

		<nav class="flex items-center gap-6 text-sm">
			<a
				href="/"
				class="transition hover:text-text-main {isActive('/') ? 'text-text-main' : 'text-text-sub'}"
				>Home</a
			>
			<a
				href="/docs"
				class="transition hover:text-text-main {isActive('/docs') ? 'text-text-main' : 'text-text-sub'}"
				>Docs</a
			>
			<a
				href="/blog"
				class="transition hover:text-text-main {isActive('/blog') ? 'text-text-main' : 'text-text-sub'}"
				>Blog</a
			>
		</nav>
	</div>
</header>
