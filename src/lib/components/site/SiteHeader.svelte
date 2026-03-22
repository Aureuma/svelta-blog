<script lang="ts">
  import { page } from '$app/stores';
  import { blogPattern } from '$lib/config/patterns';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Search', href: '/blog/search' },
    { label: 'Tags', href: '/blog/tags' },
    { label: 'Archive', href: '/blog/archive' },
    { label: 'Authors', href: '/blog/authors' },
    { label: 'Series', href: '/blog/series' }
  ];

  function isActive(path: string) {
    if (path === '/') return $page.url.pathname === '/';
    return $page.url.pathname === path || $page.url.pathname.startsWith(`${path}/`);
  }
</script>

<header
  data-testid="site-header"
  class="sticky top-0 z-50 border-b border-border-soft/10 bg-background-main/75 backdrop-blur supports-[backdrop-filter]:bg-background-main/55"
>
  <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
    <a href="/" class="group inline-flex items-center gap-2">
      <span class="text-sm font-semibold tracking-tight">{blogPattern.brandName}</span>
      <span class="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-mono uppercase tracking-[0.6px] text-brand">
        Blog system
      </span>
    </a>

    <nav class="flex items-center gap-1 rounded-full border border-border-soft/10 bg-background-soft/70 p-1 text-sm shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      {#each navItems as item (item.href)}
        <a
          href={item.href}
          class="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition {isActive(item.href) ? 'bg-background-main text-text-main' : 'text-text-sub hover:bg-background-main/60 hover:text-text-main'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
