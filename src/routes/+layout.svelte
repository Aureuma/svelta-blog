<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import Navbar from '$components/layout/Navbar.svelte';
  import Footer from '$components/layout/Footer.svelte';

  export let data: {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    } | null;
  };

  $: path = $page.url.pathname;
  $: isDashboard = path.startsWith('/dashboard');
  $: hideChrome = path.startsWith('/login');
</script>

<svelte:head>
  <title>Convelt — Websites For Busy Owners</title>
  <meta
    name="description"
    content="Convelt builds modern websites for busy SMB owners. Describe your business, get a draft site, and launch fast." />
</svelte:head>

<div class="min-h-screen text-cv-text flex flex-col">
  {#if !hideChrome}
    <Navbar user={data.user} />
  {/if}
  <main
    class={`mx-auto w-full ${
      isDashboard ? 'max-w-none' : 'max-w-7xl'
    } flex-1 px-4 pb-20 pt-6 sm:px-6 lg:px-10`}
  >
    <slot />
  </main>
  {#if !hideChrome}
    <Footer />
  {/if}
</div>
