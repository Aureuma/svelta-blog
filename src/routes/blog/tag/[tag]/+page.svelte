<script lang="ts">
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';

  export let data: {
    tag: { name: string; slug: string };
    posts: {
      slug: string;
      title: string;
      description: string;
      publishedLabel: string;
      publishedAtIso: string;
      readingTime: string;
      tags: { name: string; slug: string }[];
      author: {
        slug: string;
        name: string;
        avatar: { url: string; alt: string; width: number; height: number };
      };
    }[];
    meta: {
      title: string;
      description: string;
      canonical: string;
      keywords: string[];
    };
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
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
</svelte:head>

<section class="space-y-8">
  <header class="space-y-4">
    <Badge variant="outline">Tag archive</Badge>
    <h1 class="text-3xl font-semibold">{data.tag.name}</h1>
    <p class="text-sm text-muted-foreground">{data.posts.length} posts</p>
    <Button variant="outline" href="/blog">Back to blog</Button>
  </header>

  <div class="grid gap-6 md:grid-cols-2">
    {#each data.posts as post}
      <article class="cv-panel rounded-2xl p-6">
        <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          <time datetime={post.publishedAtIso}>{post.publishedLabel}</time>
          <span>{post.readingTime}</span>
        </div>
        <h2 class="mt-3 text-2xl font-semibold">{post.title}</h2>
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
        <div class="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <img
            src={post.author.avatar.url}
            alt={post.author.avatar.alt}
            class="h-8 w-8 rounded-full object-cover border-2 border-border"
            loading="lazy"
          />
          <a href={`/blog/author/${post.author.slug}`} class="hover:text-cv-neon">
            by {post.author.name}
          </a>
        </div>
        <Button size="sm" variant="outline" className="mt-4" href={`/blog/${post.slug}`}>
          Read
        </Button>
      </article>
    {/each}
  </div>
</section>
