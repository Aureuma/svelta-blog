<script lang="ts">
  import {
    Avatar,
    BackLink,
    Container,
    MorePosts,
    ShareButtons,
    SummaryCard
  } from '@aureuma/svelta';
  import { toSveltaPost, toSveltaPosts } from '$lib/blog/svelta-adapter';

  export let data: {
    post: Record<string, unknown> & {
      title: string;
      slug: string;
      html: string;
      canonical?: string;
      summaryAI?: string;
      seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
      };
      tags?: { name: string; slug: string }[];
    };
    author: {
      slug: string;
      name: string;
      role: string;
      bio: string;
      avatar: { url: string; alt: string; width: number; height: number };
    };
    related?: unknown[];
    adjacent?: {
      previous?: unknown | null;
      next?: unknown | null;
    };
    meta?: {
      title?: string;
      description?: string;
      canonical?: string;
    };
  };

  const fallbackAuthor = {
    id: data.author.slug,
    name: data.author.name,
    title: data.author.role,
    avatar: data.author.avatar.url
  };

  $: post = toSveltaPost(data.post, fallbackAuthor);
  $: canonicalUrl =
    (typeof data.meta?.canonical === 'string' && data.meta.canonical) ||
    (typeof data.post.canonical === 'string' && data.post.canonical) ||
    `/blog/${post.slug}`;

  $: relatedPosts = toSveltaPosts(data.related ?? [], fallbackAuthor);
  $: previous = data.adjacent?.previous
    ? toSveltaPost(data.adjacent.previous as Record<string, unknown>, fallbackAuthor)
    : null;
  $: next = data.adjacent?.next
    ? toSveltaPost(data.adjacent.next as Record<string, unknown>, fallbackAuthor)
    : null;

  $: seoTitle =
    (typeof data.meta?.title === 'string' && data.meta.title) ||
    (typeof data.post.seo?.title === 'string' && data.post.seo.title) ||
    post.title;
  $: seoDescription =
    (typeof data.meta?.description === 'string' && data.meta.description) ||
    (typeof data.post.seo?.description === 'string' && data.post.seo.description) ||
    post.excerpt;
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />
  {#if data.post.seo?.keywords}
    <meta name="keywords" content={data.post.seo.keywords.join(', ')} />
  {/if}
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={post.cover} />
</svelte:head>

<Container size="4xl">
  <section class="pb-24 pt-14">
    <BackLink href="/blog" label="Back to blog" />

    <header class="mt-8 border-b border-border-soft/10 pb-8">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.6px]">
        <span class="text-brand">{post.category.label}</span>
        <span class="text-text-muted" aria-hidden="true">/</span>
        <span class="text-text-muted">{post.readingTimeLong}</span>
      </div>

      <h1 class="mt-4 text-4xl font-semibold leading-[44px] tracking-[-0.8px] text-text-main">
        {post.title}
      </h1>

      <p class="mt-4 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
        {post.dateLong}
      </p>
    </header>

    <div class="mt-10 grid grid-cols-1 gap-x-16 md:grid-cols-[minmax(0,628px)_160px]">
      <div class="min-w-0">
        <div class="overflow-hidden rounded-3xl border border-border-soft/10 bg-background-soft">
          <img src={post.cover} alt={post.title} class="h-[360px] w-full object-cover" />
        </div>

        {#if post.summaryAI}
          <div class="mt-6">
            <SummaryCard summary={post.summaryAI} />
          </div>
        {/if}

        <div class="mt-8 flex flex-col gap-6 md:hidden">
          <div class="flex items-center gap-3">
            <Avatar src={data.author.avatar.url} alt={data.author.name} size={48} />
            <div class="leading-tight">
              <a
                href={`/blog/author/${data.author.slug}`}
                class="text-sm font-medium tracking-tight text-text-main underline-offset-4 hover:underline"
              >
                {data.author.name}
              </a>
              <div class="text-xs text-text-muted">{data.author.role}</div>
            </div>
          </div>
          <ShareButtons title={post.title} url={canonicalUrl} />
        </div>

        <article class="blog-prose prose mt-10">
          {@html data.post.html}
        </article>

        <div class="mt-10 grid grid-cols-1 gap-3 border-y border-border-soft/10 py-6">
          <a
            href={next ? `/blog/${next.slug}` : '#'}
            class="rounded-2xl border border-border-soft/10 bg-background-soft p-4 transition hover:bg-background-main/60 {next ? '' : 'pointer-events-none opacity-45'}"
          >
            <p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Next</p>
            <p class="mt-1 text-sm font-medium text-text-main">{next?.title || 'None'}</p>
          </a>
          <a
            href={previous ? `/blog/${previous.slug}` : '#'}
            class="rounded-2xl border border-border-soft/10 bg-background-soft p-4 transition hover:bg-background-main/60 {previous ? '' : 'pointer-events-none opacity-45'}"
          >
            <p class="text-[11px] font-mono uppercase tracking-[0.6px] text-text-muted">Previous</p>
            <p class="mt-1 text-sm font-medium text-text-main">{previous?.title || 'None'}</p>
          </a>
        </div>

        {#if relatedPosts.length > 0}
          <MorePosts posts={relatedPosts} />
        {/if}
      </div>

      <aside class="sticky top-20 hidden self-start md:flex md:flex-col md:gap-8">
        <div class="flex items-center gap-3">
          <Avatar src={data.author.avatar.url} alt={data.author.name} size={48} />
          <div class="leading-tight">
            <a
              href={`/blog/author/${data.author.slug}`}
              class="text-sm font-medium tracking-tight text-text-main underline-offset-4 hover:underline"
            >
              {data.author.name}
            </a>
            <div class="text-xs text-text-muted">{data.author.role}</div>
          </div>
        </div>

        <ShareButtons title={post.title} url={canonicalUrl} />
      </aside>
    </div>
  </section>
</Container>
