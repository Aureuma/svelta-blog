<script lang="ts">
	import type { AppearanceController, AppearanceMode } from './store';

	export let controller: AppearanceController;

	const options: { id: AppearanceMode; label: string }[] = [
		{ id: 'system', label: 'System' },
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' }
	];

	// Store auto-subscriptions only work on identifiers, so alias it.
	const appearanceMode = controller.appearanceMode;
	const appearancePalette = controller.appearancePalette;
	$: currentMode = $appearanceMode;
	$: currentPalette = $appearancePalette;
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-2">
		<span class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Appearance</span>
		<div class="inline-flex rounded-full border border-border-soft/10 bg-background-soft p-1">
			{#each options as opt (opt.id)}
				<button
					type="button"
					class="rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.6px] transition
						hover:bg-background-main/60
						{(currentMode === opt.id && 'bg-background-main shadow-sm') || 'text-text-sub'}"
					onclick={() => controller.setAppearanceMode(opt.id)}
					aria-pressed={currentMode === opt.id}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex items-center gap-2">
		<span class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Palette</span>
		<div class="flex flex-wrap gap-1.5">
			{#each controller.palettes as palette (palette.id)}
				<button
					type="button"
					class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.6px] transition
						{currentPalette === palette.id
							? 'border-border-soft/20 bg-background-main text-text-main'
							: 'border-border-soft/10 bg-background-soft text-text-sub hover:bg-background-main/60'}"
					onclick={() => controller.setAppearancePalette(palette.id)}
					aria-pressed={currentPalette === palette.id}
					aria-label={`Use ${palette.label} palette`}
				>
					<span>{palette.element}</span>
					<span>{palette.label}</span>
				</button>
			{/each}
		</div>
	</div>
</div>
