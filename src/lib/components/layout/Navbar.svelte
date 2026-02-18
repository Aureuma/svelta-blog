<script lang="ts">
  import Button from '$components/ui/button.svelte';
  import Badge from '$components/ui/badge.svelte';
  import Logo from '$components/Logo.svelte';

  export let user: {
    id: string;
    email?: string | null;
    name?: string | null;
  } | null = null;
</script>

<nav class="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur">
  <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
    <a href="/" class="flex items-center gap-3">
      <Logo />
      <Badge variant="outline" className="hidden sm:inline-flex">Beta</Badge>
    </a>
    <div class="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] md:flex">
      <a class="hover:text-cv-neon" href="/">Product</a>
      <a class="hover:text-cv-neon" href="/pricing">Pricing</a>
      <a class="hover:text-cv-neon" href="/#templates">Templates</a>
      <a class="hover:text-cv-neon" href="/blog">Blog</a>
    </div>
    <div class="flex items-center gap-3">
      {#if user}
        <Button href="/dashboard" variant="outline" size="sm">
          Dashboard
        </Button>
      {:else}
        <Button href="/login" variant="outline" size="sm">
          Log in
        </Button>
      {/if}
      <Button href="/login" size="sm" className="cv-shadow">
        Get started
      </Button>
    </div>
  </div>
</nav>
