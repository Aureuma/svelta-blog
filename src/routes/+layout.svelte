<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/600.css';
  import '@fontsource/geist-mono/400.css';
  import '@fontsource/geist-mono/500.css';
  import '../app.css';
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { blogPattern } from '$lib/config/patterns';
  import { initAppearance } from '$lib/stores/appearance';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const cleanup = initAppearance();
    return cleanup;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="sitemap" href="/sitemap.xml" />
  <link rel="alternate" type="application/feed+json" title="svelta-blog JSON Feed" href="/feed.json" />
  <link rel="search" type="application/opensearchdescription+xml" title="svelta-blog search" href="/blog/opensearch.xml" />
  <link rel="manifest" href="/manifest.webmanifest" />
  {#if blogPattern.showRss}
    <link rel="alternate" type="application/rss+xml" title="svelta-blog RSS" href="/feed.xml" />
  {/if}
</svelte:head>

<div class="min-h-dvh bg-background-main text-text-main">
  <div class="border-b border-border-soft/10 bg-brand/10 px-6 py-2 text-center text-xs font-mono uppercase tracking-[0.14em] text-text-main">
    New: search page at <a href="/blog/search" class="underline underline-offset-4">/blog/search</a>, JSON feed at <a href="/feed.json" class="underline underline-offset-4">/feed.json</a>, and machine-readable search at <a href="/blog/search.json" class="underline underline-offset-4">/blog/search.json</a>.
  </div>
  <SiteHeader />
  <main class="flex-1">{@render children()}</main>
  <SiteFooter />
</div>
