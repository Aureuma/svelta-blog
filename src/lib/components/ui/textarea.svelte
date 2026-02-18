<script lang="ts">
  import { cn } from '$utils/cn';

  export let className = '';
  export let value = '';
</script>

<textarea
  class={cn(
    'min-h-[120px] w-full rounded-md border-2 border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30',
    className
  )}
  bind:value
  {...$$restProps}
></textarea>
