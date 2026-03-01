<script lang="ts">
	import { AppearanceSwitcher } from '@aureuma/svelta/appearance';
	import { blogPattern, docsPattern } from '$lib/config/patterns';
	import { appearance } from '$lib/stores/appearance';
</script>

<footer class="border-t border-border-soft/10">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
		<div class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
			© {new Date().getFullYear()} {docsPattern.brandName}
		</div>

		<div class="flex items-center justify-between gap-6 md:justify-end">
			{#if blogPattern.showRss}
				<a
					href="/feed.xml"
					class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-text-sub transition hover:text-text-main"
				>
					<span>RSS</span>
					<span class="inline-block size-1.5 rounded-full bg-brand" aria-hidden="true"></span>
				</a>
			{/if}

			{#if docsPattern.navigation.footer.length > 0}
				<a
					href={docsPattern.navigation.footer[0].href}
					class="text-xs font-mono uppercase tracking-[0.6px] text-text-sub transition hover:text-text-main"
				>
					{docsPattern.navigation.footer[0].label}
				</a>
			{/if}

			<AppearanceSwitcher controller={appearance} />
		</div>
	</div>
</footer>
