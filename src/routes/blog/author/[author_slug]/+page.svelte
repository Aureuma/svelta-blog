<script lang="ts">
  import { buildPersonJsonLd } from '$lib/blog/seo';
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';

  export let data: {
    author: {
      slug: string;
      name: string;
      role: string;
      bio: string;
      interests: string[];
      canonical: string;
      avatar: { url: string; alt: string; width: number; height: number };
      html: string;
      seo: { title: string; description: string; keywords: string[] };
    };
    posts: {
      slug: string;
      title: string;
      description: string;
      publishedLabel: string;
      publishedAtIso: string;
      readingTime: string;
      tags: { name: string; slug: string }[];
    }[];
    meta: {
      title: string;
      description: string;
      canonical: string;
    };
  };

  const jsonLdScript = JSON.stringify(buildPersonJsonLd(data.author)).replace(
    /</g,
    '\\u003c'
  );
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.author.seo.keywords.join(', ')} />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:image" content={data.author.avatar.url} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.author.avatar.url} />
  <script type="application/ld+json">{jsonLdScript}</script>
</svelte:head>

<section class="space-y-10">
  <header class="cv-panel rounded-2xl p-8">
    <div class="flex items-center gap-3">
      <Badge variant="outline">Author</Badge>
      <span class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Profile
      </span>
    </div>
    <div class="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
      <img
        src={data.author.avatar.url}
        alt={data.author.avatar.alt}
        width={data.author.avatar.width}
        height={data.author.avatar.height}
        loading="lazy"
        class="h-24 w-24 rounded-full object-cover border-2 border-border"
      />
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          {data.author.name}
        </p>
        <h1 class="text-3xl font-semibold">{data.author.role}</h1>
        <p class="text-sm text-muted-foreground">{data.author.bio}</p>
      </div>
    </div>
    <div class="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
      <div class="prose max-w-none text-sm leading-6">
        {@html data.author.html}
      </div>
      <div class="rounded-xl border-2 border-border bg-background p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Interests
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          {#each data.author.interests as interest}
            <li>• {interest}</li>
          {/each}
        </ul>
      </div>
    </div>
  </header>

  <section class="space-y-4">
    <h2 class="text-2xl font-semibold">Written by {data.author.name}</h2>
    {#if data.posts.length === 0}
      <div class="cv-panel rounded-2xl p-6 text-sm text-muted-foreground">
        No posts yet. Check back soon for new notes.
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2">
        {#each data.posts as post}
          <article class="cv-panel rounded-2xl p-6">
            <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <time datetime={post.publishedAtIso}>{post.publishedLabel}</time>
              <span>{post.readingTime}</span>
            </div>
            <h3 class="mt-3 text-xl font-semibold">{post.title}</h3>
            <p class="mt-3 text-sm text-muted-foreground">{post.description}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              {#each post.tags as tag}
                <a
                  href={`/blog/tag/${tag.slug}`}
                  class="rounded-full border-2 border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  {tag.name}
                </a>
              {/each}
            </div>
            <Button size="sm" variant="outline" className="mt-4" href={`/blog/${post.slug}`}>
              Read
            </Button>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</section>
