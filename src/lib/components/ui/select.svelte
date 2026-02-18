<script lang="ts">
  import { cn } from '$utils/cn';

  export let className = '';
  export let value: string | undefined = undefined;
</script>

<select
  class={cn(
    'h-11 w-full rounded-md border-2 border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30',
    className
  )}
  bind:value
  {...$$restProps}
>
  <slot />
</select>
