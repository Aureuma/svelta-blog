<section class="mx-auto w-full max-w-5xl px-6 py-20">
  <div class="max-w-3xl">
    <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">svelta-blog</p>
    <h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
      A dedicated publishing system for markdown-first product blogs.
    </h1>
    <p class="mt-4 text-base leading-6 text-text-sub">
      Build a durable editorial surface with tag filters, author pages, archives, related posts,
      and a reusable package export for SvelteKit apps.
    </p>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="/blog"
        class="inline-flex items-center justify-center rounded-full bg-text-main px-5 py-2 text-sm font-medium text-text-invert transition hover:opacity-90"
      >
        Open Blog
      </a>
      <a
        href="/blog/archive"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        Browse Archive
      </a>
      <a
        href="/feed.xml"
        class="inline-flex items-center justify-center rounded-full border border-border-soft/15 bg-background-soft px-5 py-2 text-sm font-medium text-text-main transition hover:bg-background-main/60"
      >
        RSS Feed
      </a>
    </div>
  </div>

  <div class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Index</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Infinite feed</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Tag-aware discovery with search by title, topic, or author.</p>
    </section>

    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Post pages</p>
      <p class="mt-2 text-lg font-medium tracking-tight">Rich reading surface</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Summaries, syntax highlighting, lightbox media, and related posts.</p>
    </section>

    <section class="rounded-3xl border border-border-soft/10 bg-background-soft p-8">
      <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Distribution</p>
      <p class="mt-2 text-lg font-medium tracking-tight">RSS included</p>
      <p class="mt-2 text-sm leading-6 text-text-sub">Ship a feed alongside author pages and archive browsing without extra wiring.</p>
    </section>
  </div>
</section>
