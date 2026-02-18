<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const sizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };
</script>

<div class={`flex items-center gap-2 font-semibold uppercase tracking-[0.2em] ${sizes[size]}`}>
  <svg
    aria-hidden="true"
    viewBox="0 0 48 48"
    class="h-6 w-6 shrink-0 text-cv-neon"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
  >
    <path d="M6 10h36v28H6z" />
    <path d="M16 14l8 10 8-10" />
    <path d="M16 34l8-10 8 10" />
  </svg>
  <span class="leading-none">convelt</span>
</div>
