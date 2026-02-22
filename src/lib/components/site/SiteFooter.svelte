<script lang="ts">
	import { ThemeSwitcher } from '@aureuma/svelta/theme';
	import { theme } from '$lib/stores/theme';
</script>

<footer class="border-t border-border-soft/10">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
		<div class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
			© {new Date().getFullYear()} svelta
		</div>

		<div class="flex items-center justify-between gap-6 md:justify-end">
			<a
				href="/feed.xml"
				class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px] text-text-sub transition hover:text-text-main"
			>
				<span>RSS</span>
				<span class="inline-block size-1.5 rounded-full bg-brand" aria-hidden="true"></span>
			</a>

			<ThemeSwitcher controller={theme} />
		</div>
	</div>
</footer>
