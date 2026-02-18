<script lang="ts">
  import { cn } from '$utils/cn';

  export let className = '';
</script>

<div
  class={cn('cv-panel rounded-xl p-6', className)}
  {...$$restProps}
>
  <slot />
</div>
