<section class="mx-auto w-full max-w-5xl px-6 py-20">
	<div class="max-w-2xl">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Svelta</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
			A Mintlify-inspired blog system, built in SvelteKit.
		</h1>
		<p class="mt-4 text-base leading-6 text-text-sub">
			Markdown posts, Shiki code highlighting, tag filtering, infinite scroll, author profiles, share
			widgets, AI summary cards, and an RSS feed.
		</p>

		<div class="mt-8 flex items-center gap-3">
			<a
				href="/blog"
				class="inline-flex items-center justify-center rounded-full bg-text-main px-5 py-2 text-sm font-medium text-text-invert transition hover:opacity-90"
			>
				Go to Blog
			</a>
			<a
				href="/feed.xml"
				class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
			>
				RSS Feed
			</a>
		</div>
	</div>

	<div class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
		<div class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Design</p>
			<p class="mt-2 text-lg font-medium tracking-tight">Proportions first</p>
			<p class="mt-2 text-sm leading-6 text-text-sub">
				Containers, spacing, and typography scale tuned to match the Mintlify blog’s feel.
			</p>
		</div>
		<div class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Engineering</p>
			<p class="mt-2 text-lg font-medium tracking-tight">Fast content pipeline</p>
			<p class="mt-2 text-sm leading-6 text-text-sub">
				mdsvex + Shiki + reading-time on the server, with incremental loading on the client.
			</p>
		</div>
	</div>
</section>
