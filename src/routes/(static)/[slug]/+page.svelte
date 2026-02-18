<script lang="ts">
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';

  export let data: {
    slug: string;
    title: string;
    description: string;
    status?: string;
  };
</script>

<section class="mx-auto max-w-3xl space-y-6">
  <Badge variant="outline">{data.status || 'Info'}</Badge>
  <h1 class="text-4xl font-semibold">{data.title}</h1>
  <p class="text-base text-muted-foreground">{data.description}</p>
  <div class="cv-panel rounded-2xl p-6 text-sm text-muted-foreground">
    This page is in progress. If you need something immediately, reach out at
    hello@convelt.com.
  </div>
  <div class="flex flex-wrap gap-3">
    <Button href="/" variant="outline">Back home</Button>
    <Button href="/login">Get started</Button>
  </div>
</section>
