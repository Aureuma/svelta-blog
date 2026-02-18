<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cn } from '$utils/cn';

  export let className = '';
  export let type: string = 'text';
  export let value: string | number | undefined = undefined;

  const dispatch = createEventDispatcher<{
    input: InputEvent;
    change: Event;
    value: string;
  }>();

  const handleInput = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement | null;
    value = target?.value ?? '';
    dispatch('input', event as InputEvent);
    dispatch('value', String(value ?? ''));
  };

  const handleChange = (event: Event) => {
    dispatch('change', event);
  };
</script>

<input
  {type}
  value={value ?? ''}
  class={cn(
    'h-11 w-full rounded-md border-2 border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30',
    className
  )}
  on:input={handleInput}
  on:change={handleChange}
  {...$$restProps}
/>
