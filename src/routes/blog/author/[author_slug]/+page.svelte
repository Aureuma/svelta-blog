<script lang="ts">
  import { Avatar, BlogCard, Container } from '@aureuma/svelta';
  import { toSveltaPosts } from '$lib/blog/svelta-adapter';

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
    posts: unknown[];
    meta: {
      title: string;
      description: string;
      canonical: string;
    };
  };

  $: normalizedPosts = toSveltaPosts(data.posts, {
    id: data.author.slug,
    name: data.author.name,
    title: data.author.role,
    avatar: data.author.avatar.url
  });
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
</svelte:head>

<Container>
  <section class="pb-24 pt-14">
    <div class="flex items-center gap-3">
      <Avatar src={data.author.avatar.url} alt={data.author.avatar.alt} size={52} />
      <div>
        <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Author</p>
        <h1 class="text-3xl font-semibold tracking-tight text-text-main">{data.author.name}</h1>
        <p class="text-sm text-text-sub">{data.author.role}</p>
      </div>
    </div>

    <p class="mt-5 max-w-2xl text-sm leading-6 text-text-sub">{data.author.bio}</p>

    {#if data.author.interests.length > 0}
      <div class="mt-5 flex flex-wrap gap-2">
        {#each data.author.interests as interest}
          <span class="rounded-full border border-border-soft/10 bg-background-soft px-3 py-1 text-xs font-mono uppercase tracking-[0.6px] text-text-muted">
            {interest}
          </span>
        {/each}
      </div>
    {/if}

    <div class="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
      {#each normalizedPosts as post (post.slug)}
        <BlogCard {post} />
      {/each}
    </div>
  </section>
</Container>
