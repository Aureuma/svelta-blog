<script lang="ts">
  import { absoluteUrl, buildBlogPostingJsonLd } from '$lib/blog/seo';
  import { BLOG_NAME } from '$lib/blog/site';
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';

  export let data: {
    post: {
      title: string;
      description: string;
      slug: string;
      publishedLabel: string;
      updatedLabel: string;
      readingTime: string;
      publishedAt: string | Date;
      updatedAt: string | Date;
      publishedAtIso: string;
      updatedAtIso: string;
      html: string;
      tags: { name: string; slug: string }[];
      canonical: string;
      ogImage: {
        url: string;
        alt: string;
        width: number;
        height: number;
        credit: string;
        source: string;
      };
      seo: { title: string; description: string; keywords: string[] };
    };
    author: {
      slug: string;
      name: string;
      role: string;
      bio: string;
      avatar: { url: string; alt: string; width: number; height: number };
    };
    related: { slug: string; title: string; description: string }[];
    adjacent: {
      previous: { slug: string; title: string } | null;
      next: { slug: string; title: string } | null;
    };
  };

  const ogImage = absoluteUrl(data.post.ogImage.url);
  const seoTitle = data.post.seo.title || data.post.title;
  const seoDescription = data.post.seo.description || data.post.description;
  const jsonLdScript = JSON.stringify(
    buildBlogPostingJsonLd(data.post, data.author)
  ).replace(/</g, '\\u003c');
</script>

<svelte:head>
  <title>{seoTitle} — {BLOG_NAME}</title>
  <meta name="description" content={seoDescription} />
  <meta name="keywords" content={data.post.seo.keywords.join(', ')} />
  <meta name="author" content={data.author.name} />
  <link rel="canonical" href={data.post.canonical} />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:url" content={data.post.canonical} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:alt" content={data.post.ogImage.alt} />
  <meta property="og:image:width" content={String(data.post.ogImage.width)} />
  <meta property="og:image:height" content={String(data.post.ogImage.height)} />
  <meta property="article:published_time" content={data.post.publishedAtIso} />
  <meta property="article:modified_time" content={data.post.updatedAtIso} />
  <meta property="article:author" content={data.author.name} />
  {#each data.post.tags as tag}
    <meta property="article:tag" content={tag.name} />
  {/each}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={data.post.ogImage.alt} />

  <script type="application/ld+json">{jsonLdScript}</script>
</svelte:head>

<article class="mx-auto max-w-3xl space-y-8">
  <header class="space-y-4">
    <Badge variant="outline">Field note</Badge>
    <h1 class="text-4xl font-semibold">{data.post.title}</h1>
    <p class="text-base text-muted-foreground">{data.post.description}</p>
    <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div class="flex items-center gap-3">
        <img
          src={data.author.avatar.url}
          alt={data.author.avatar.alt}
          width={data.author.avatar.width}
          height={data.author.avatar.height}
          loading="lazy"
          class="h-9 w-9 rounded-full object-cover border-2 border-border"
        />
        <span>by {data.author.name}</span>
      </div>
      <span>{data.post.publishedLabel}</span>
      <span>{data.post.readingTime}</span>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each data.post.tags as tag}
        <a
          href={`/blog/tag/${tag.slug}`}
          class="rounded-full border-2 border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          {tag.name}
        </a>
      {/each}
    </div>
  </header>

  <figure class="space-y-3">
    <img
      src={data.post.ogImage.url}
      alt={data.post.ogImage.alt}
      width={data.post.ogImage.width}
      height={data.post.ogImage.height}
      loading="eager"
      decoding="async"
      fetchpriority="high"
      class="rounded-2xl border-2 border-border object-cover"
    />
    <figcaption class="text-xs text-muted-foreground">
      Photo by {data.post.ogImage.credit} · {data.post.ogImage.source}
    </figcaption>
  </figure>

  <div class="prose max-w-none prose-headings:font-semibold prose-a:text-cv-neon prose-a:no-underline">
    {@html data.post.html}
  </div>

  <section class="cv-panel rounded-2xl p-6">
    <a href={`/blog/author/${data.author.slug}`} class="flex flex-col gap-4 sm:flex-row sm:items-center">
      <img
        src={data.author.avatar.url}
        alt={data.author.avatar.alt}
        width={data.author.avatar.width}
        height={data.author.avatar.height}
        loading="lazy"
        class="h-16 w-16 rounded-full object-cover border-2 border-border"
      />
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Written by {data.author.name}
        </p>
        <p class="mt-2 text-lg font-semibold">{data.author.role}</p>
        <p class="mt-2 text-sm text-muted-foreground">{data.author.bio}</p>
      </div>
    </a>
  </section>

  {#if data.related.length > 0}
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Related notes</h2>
      <div class="grid gap-4 md:grid-cols-3">
        {#each data.related as post}
          <a
            href={`/blog/${post.slug}`}
            class="cv-panel rounded-xl p-4 text-sm transition hover:-translate-y-1"
          >
            <p class="font-semibold">{post.title}</p>
            <p class="mt-2 text-xs text-muted-foreground">{post.description}</p>
          </a>
        {/each}
      </div>
    </section>
  {/if}

  <nav class="flex flex-col gap-3 border-t-2 border-border pt-6 text-sm">
    {#if data.adjacent.next}
      <a href={`/blog/${data.adjacent.next.slug}`} class="cv-panel rounded-xl p-4">
        <span class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Next</span>
        <p class="mt-2 font-semibold">{data.adjacent.next.title}</p>
      </a>
    {/if}
    {#if data.adjacent.previous}
      <a href={`/blog/${data.adjacent.previous.slug}`} class="cv-panel rounded-xl p-4">
        <span class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Previous</span>
        <p class="mt-2 font-semibold">{data.adjacent.previous.title}</p>
      </a>
    {/if}
  </nav>

  <div class="flex justify-center">
    <Button variant="outline" href="/blog">Back to blog</Button>
  </div>
</article>
