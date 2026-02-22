<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    BlogCard,
    BlogHeroCard,
    Container,
    TagTabs,
    type BlogPost
  } from '@aureuma/svelta';
  import { collectTagCategories, toSveltaPosts } from '$lib/blog/svelta-adapter';

  export let data: {
    meta: {
      title: string;
      description: string;
      canonical: string;
      keywords: string[];
    };
    search: {
      query: string;
      total: number;
      category?: string;
    };
    showPagination: boolean;
    pagination: {
      page: number;
      pageCount: number;
      total: number;
    };
    posts: unknown[];
  };

  $: normalizedPosts = toSveltaPosts(data.posts);
  $: hero = normalizedPosts[0] ?? null;
  $: cards = hero
    ? normalizedPosts.filter((post) => post.slug !== hero.slug)
    : normalizedPosts;
  $: categories = collectTagCategories(normalizedPosts);

  function selectTag(slug: string) {
    if (!slug) {
      goto('/blog');
      return;
    }
    goto(`/blog/tag/${slug}`);
  }

  const buildPageHref = (pageNo: number) => {
    const params = new URLSearchParams();
    if (data.search.query) params.set('q', data.search.query);
    if (data.search.category) params.set('category', data.search.category);
    if (pageNo > 1) params.set('page', String(pageNo));
    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
  };

  $: selectedTag = $page.url.searchParams.get('tag') ?? '';
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.keywords.join(', ')} />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content={data.meta.canonical} />
</svelte:head>

<Container>
  <section class="pb-24 pt-14">
    <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
      Journal
    </p>
    <h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
      {data.meta.title}
    </h1>
    <p class="mt-3 max-w-2xl text-sm leading-6 text-text-sub">
      {data.meta.description}
    </p>

    <form class="mt-8 flex flex-col gap-3 md:max-w-md" method="get" action="/blog">
      <label class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted" for="blog-search">
        Search articles
      </label>
      <input
        id="blog-search"
        type="search"
        name="q"
        value={data.search.query}
        placeholder="Search by topic, title, or author"
        class="h-10 rounded-full border border-border-soft/10 bg-background-soft px-4 text-sm text-text-main outline-none transition focus:border-border-soft/20"
      />
    </form>

    {#if hero}
      <BlogHeroCard post={hero} />
    {/if}

    <TagTabs categories={categories} selected={selectedTag} onSelect={selectTag} />

    <div class="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
      {#if cards.length === 0}
        <p class="text-sm leading-6 text-text-sub">No posts found for that query.</p>
      {:else}
        {#each cards as post (post.slug)}
          <BlogCard {post} />
        {/each}
      {/if}
    </div>

    {#if data.showPagination}
      <nav class="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft/10 pt-6 text-sm">
        <span class="text-text-muted">
          Page {data.pagination.page} of {data.pagination.pageCount} · {data.pagination.total}
          posts
        </span>
        <div class="flex items-center gap-3">
          {#if data.pagination.page > 1}
            <a
              class="rounded-full border border-border-soft/10 bg-background-soft px-4 py-2 text-text-main transition hover:bg-background-main/60"
              href={buildPageHref(data.pagination.page - 1)}
            >
              Newer posts
            </a>
          {/if}
          {#if data.pagination.page < data.pagination.pageCount}
            <a
              class="rounded-full border border-border-soft/10 bg-background-soft px-4 py-2 text-text-main transition hover:bg-background-main/60"
              href={buildPageHref(data.pagination.page + 1)}
            >
              Older posts
            </a>
          {/if}
        </div>
      </nav>
    {/if}
  </section>
</Container>
