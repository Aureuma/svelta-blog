<script lang="ts">
	import type { ThemeController, ThemeMode } from './store';

	export let controller: ThemeController;

	const options: { id: ThemeMode; label: string }[] = [
		{ id: 'system', label: 'System' },
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' }
	];

	// Store auto-subscriptions only work on identifiers, so alias it.
	const themeMode = controller.themeMode;
	$: currentMode = $themeMode;
</script>

<div class="flex items-center gap-2">
	<span class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Theme</span>
	<div class="inline-flex rounded-full border border-border-soft/10 bg-background-soft p-1">
		{#each options as opt (opt.id)}
			<button
				type="button"
				class="rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.6px] transition
					hover:bg-background-main/60
					{(currentMode === opt.id && 'bg-background-main shadow-sm') || 'text-text-sub'}"
				onclick={() => controller.setThemeMode(opt.id)}
				aria-pressed={currentMode === opt.id}
			>
				{opt.label}
			</button>
		{/each}
	</div>
</div>

