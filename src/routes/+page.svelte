<script lang="ts">
	import { experienceCatalog, initialExperience } from '$lib/config/experience';

	$: initial = experienceCatalog.byKind[initialExperience];
	$: alternate = initialExperience === 'docs' ? experienceCatalog.byKind.blog : experienceCatalog.byKind.docs;
</script>

<section class="mx-auto w-full max-w-5xl px-6 py-20">
	<div class="max-w-3xl">
		<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">svelta</p>
		<h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
			One content system, two publishing experiences.
		</h1>
		<p class="mt-4 text-base leading-6 text-text-sub">
			Choose a primary experience at setup: documentation or blog. Both run on the same markdown
			pipeline and reusable `@aureuma/svelta` primitives.
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a
				href={initial.href}
				class="inline-flex items-center justify-center rounded-full bg-text-main px-5 py-2 text-sm font-medium text-text-invert transition hover:opacity-90"
			>
				Open {initial.label}
			</a>
			<a
				href={alternate.href}
				class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
			>
				Open {alternate.label}
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
		<section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Initial experience</p>
			<p class="mt-2 text-lg font-medium tracking-tight">{initial.label}</p>
			<p class="mt-2 text-sm leading-6 text-text-sub">{initial.description}</p>
		</section>

		<section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
			<p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Also available</p>
			<p class="mt-2 text-lg font-medium tracking-tight">{alternate.label}</p>
			<p class="mt-2 text-sm leading-6 text-text-sub">{alternate.description}</p>
		</section>
	</div>
</section>
