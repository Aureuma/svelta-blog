<script lang="ts">
  import { goto } from '$app/navigation';
  import { BlogCard, Container, TagTabs } from '@aureuma/svelta';
  import { collectTagCategories, toSveltaPosts } from '$lib/blog/svelta-adapter';

  export let data: {
    tag: { name: string; slug: string };
    posts: unknown[];
    meta: {
      title: string;
      description: string;
      canonical: string;
      keywords?: string[];
    };
  };

  $: normalizedPosts = toSveltaPosts(data.posts);
  $: categories = collectTagCategories(normalizedPosts);

  function selectTag(slug: string) {
    if (!slug) {
      goto('/blog');
      return;
    }
    goto(`/blog/tag/${slug}`);
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  {#if data.meta.keywords}
    <meta name="keywords" content={data.meta.keywords.join(', ')} />
  {/if}
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content={data.meta.canonical} />
</svelte:head>

<Container>
  <section class="pb-24 pt-14">
    <p class="text-xs font-mono uppercase tracking-[0.6px] text-text-muted">Tag archive</p>
    <h1 class="mt-3 text-4xl font-semibold leading-[44px] tracking-[-0.8px]">
      #{data.tag.name}
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-sub">{normalizedPosts.length} posts in this tag.</p>

    <div class="mt-8">
      <TagTabs categories={categories} selected={data.tag.slug} onSelect={selectTag} />
    </div>

    <div class="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2">
      {#each normalizedPosts as post (post.slug)}
        <BlogCard {post} />
      {/each}
    </div>
  </section>
</Container>
