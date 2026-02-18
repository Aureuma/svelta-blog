<script lang="ts">
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';
  import Input from '$components/ui/input.svelte';
  import { buildBlogIndexJsonLd } from '$lib/blog/seo';

  export let data: {
    meta: {
      title: string;
      description: string;
      canonical: string;
      keywords: string[];
    };
    search: {
      query: string;
      category: string;
      total: number;
    };
    showPagination: boolean;
    pagination: {
      page: number;
      pageCount: number;
      total: number;
    };
    posts: {
      slug: string;
      title: string;
      description: string;
      readingTime: string;
      publishedLabel: string;
      publishedAtIso: string;
      tags: { name: string; slug: string }[];
      ogImage: { url: string; alt: string; width: number; height: number };
      author: {
        slug: string;
        name: string;
        avatar: { url: string; alt: string; width: number; height: number };
      };
    }[];
  };

  const ogImage = data.posts[0]?.ogImage?.url;
  const ogImageAlt = data.posts[0]?.ogImage?.alt;
  const jsonLdScript = JSON.stringify(buildBlogIndexJsonLd(data.posts)).replace(
    /</g,
    '\\u003c'
  );

  const categories = [
    'Latest',
    'Announcements',
    'Inside Convelt',
    'Guides',
    'Reports',
    'Stories'
  ];

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (data.search.query) {
      params.set('q', data.search.query);
    }
    if (data.search.category) {
      params.set('category', data.search.category);
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
  };
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
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    {#if ogImageAlt}
      <meta property="og:image:alt" content={ogImageAlt} />
    {/if}
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
    {#if ogImageAlt}
      <meta name="twitter:image:alt" content={ogImageAlt} />
    {/if}
  {/if}
  <script type="application/ld+json">{jsonLdScript}</script>
</svelte:head>

<section class="space-y-10">
  <header class="space-y-4">
    <Badge variant="outline">Blog</Badge>
    <h1 class="text-4xl font-semibold">Convelt field notes</h1>
    <p class="max-w-2xl text-base text-muted-foreground">
      Launch stories, SMB playbooks, and the fastest path to a credible site.
    </p>
    <nav class="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
      {#each categories as category}
        <a
          class="rounded-full border-2 border-border px-4 py-2 hover:bg-primary hover:text-primary-foreground"
          href={category === 'Latest'
            ? '/blog'
            : `/blog?category=${encodeURIComponent(category)}`}
        >
          {category}
        </a>
      {/each}
    </nav>
  </header>

  <form
    class="cv-panel flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between"
    method="get"
    action="/blog"
  >
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Search the journal
      </p>
      <p class="text-sm text-muted-foreground">
        Find a story, launch guide, or template note.
      </p>
    </div>
    <div class="flex w-full flex-col gap-2 md:max-w-md">
      <label class="sr-only" for="blog-search">Search blog posts</label>
      <Input
        id="blog-search"
        type="search"
        name="q"
        placeholder="Search topics, tags, industries"
        value={data.search.query}
      />
      <p class="text-xs text-muted-foreground">
        {#if data.search.query}
          {data.search.total} result{data.search.total === 1 ? '' : 's'}
        {:else}
          {data.pagination.total} total posts
        {/if}
      </p>
    </div>
  </form>

  {#if data.posts.length === 0}
    <div class="cv-panel rounded-2xl p-6 text-sm text-muted-foreground">
      No posts match that search. Try another keyword or browse the latest.
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2">
      {#each data.posts as post}
        <article class="cv-panel group rounded-2xl p-6 transition hover:-translate-y-1">
          <div class="space-y-4">
            <img
              src={post.ogImage.url}
              alt={post.ogImage.alt}
              class="h-48 w-full rounded-xl object-cover"
              loading="lazy"
            />
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <span>{post.tags[0]?.name}</span>
              <time datetime={post.publishedAtIso}>{post.publishedLabel}</time>
            </div>
            <h2 class="text-2xl font-semibold">{post.title}</h2>
            <p class="text-sm text-muted-foreground">{post.description}</p>
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <img
                src={post.author.avatar.url}
                alt={post.author.avatar.alt}
                class="h-6 w-6 rounded-full border-2 border-border"
                loading="lazy"
              />
              {post.author.name} · {post.readingTime}
            </div>
            <Button size="sm" variant="outline" href={`/blog/${post.slug}`}>
              Read more
            </Button>
          </div>
        </article>
      {/each}
    </div>
  {/if}

  {#if data.showPagination}
    <div class="flex items-center justify-center gap-3">
      {#each Array(data.pagination.pageCount) as _, index}
        {@const pageNumber = index + 1}
        <a
          class={`rounded-full border-2 border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
            pageNumber === data.pagination.page
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          }`}
          href={buildPageHref(pageNumber)}
        >
          {pageNumber}
        </a>
      {/each}
    </div>
  {/if}
</section>
