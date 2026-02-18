<script lang="ts">
  import {
    ArrowRight,
    Sparkles,
    Globe,
    ShieldCheck,
    Timer,
    MessageSquareText,
    Palette,
    BadgeCheck,
    TerminalSquare,
    Bot
  } from 'lucide-svelte';
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';
  import Card from '$components/ui/card.svelte';
  import Input from '$components/ui/input.svelte';

  export let data: {
    latestPosts: Array<{
      slug: string;
      title: string;
      description: string;
      tag: string;
      image: {
        url: string;
        alt: string;
        width: number;
        height: number;
        credit: string;
        source: string;
      };
      author: string;
      date: string;
    }>;
    templates: Array<{
      id: string;
      title: string;
      description: string;
      image: {
        url: string;
        alt: string;
        width: number;
        height: number;
        credit: string;
        source: string;
      } | null;
    }>;
    heroImage: {
      url: string;
      alt: string;
      width: number;
      height: number;
      credit: string;
      source: string;
    } | null;
  };

  let prompt = '';
  let response = '';
  let isLoading = false;
  let errorMessage = '';

  const billingPlans = {
    month: 50,
    year: 40
  };
  let billingInterval: 'month' | 'year' = 'month';

  const showcases = [
    {
      name: 'Dr. Solgado Dental',
      description: 'Implant dentistry in Austin, TX',
      status: 'Live'
    },
    {
      name: 'Luna Hair Studio',
      description: 'Boutique color and styling in Miami',
      status: 'Draft'
    },
    {
      name: 'Northfield Physical Therapy',
      description: 'Recovery-focused clinic in Denver',
      status: 'Live'
    },
    {
      name: 'Peakline Pilates',
      description: 'Small-group classes in Seattle',
      status: 'Draft'
    }
  ];

  const submitPrompt = async () => {
    if (!prompt.trim()) return;
    isLoading = true;
    errorMessage = '';
    response = '';

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        throw new Error('We could not generate a draft right now.');
      }
      const data = await res.json();
      response = data?.summary || data?.message || '';
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Try again.';
    } finally {
      isLoading = false;
    }
  };
</script>

<section class="cv-noise cv-grid-bg rounded-[32px] border-2 border-border bg-[var(--cv-hero-bg)] px-6 py-16 sm:px-10 lg:px-16">
  <div class="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
    <div class="space-y-6">
      <Badge variant="outline">New • Convelt Alpha</Badge>
      <h1 class="text-4xl font-semibold sm:text-6xl">
        A website that keeps up with your business
      </h1>
      <p class="text-lg font-semibold">Launch a credible site in days</p>
      <p class="text-base text-muted-foreground">
        Launch fast, look credible, and cut the back-and-forth.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <Button size="lg" className="cv-shadow" href="/login">
          Start a site
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" href="#templates">
          Browse templates
        </Button>
      </div>
      <div class="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span class="cv-chip">Dentists</span>
        <span class="cv-chip">Salons</span>
        <span class="cv-chip">Clinics</span>
        <span class="cv-chip">Studios</span>
      </div>
    </div>
    <div class="space-y-4">
      <div class="cv-panel rounded-2xl p-6">
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles class="h-4 w-4 text-cv-neon" />
          Quick brief
        </div>
        <div class="mt-4 flex flex-col gap-3">
          <Input
            bind:value={prompt}
            placeholder="Dental site for Dr. Solgado. New-patient CTA + online booking."
            className="text-sm"
          />
          <Button on:click={submitPrompt} disabled={isLoading}>
            {isLoading ? 'Drafting…' : 'Generate draft'}
          </Button>
          {#if response}
            <div class="rounded-lg border-2 border-border bg-background px-4 py-3 text-sm">
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Draft preview
              </span>
              <p class="mt-2">{response}</p>
            </div>
          {/if}
          {#if errorMessage}
            <p class="text-xs text-red-500">{errorMessage}</p>
          {/if}
        </div>
      </div>
      {#if data.heroImage}
        <div class="cv-panel overflow-hidden rounded-2xl">
          <img
            src={data.heroImage.url}
            alt={data.heroImage.alt}
            class="h-56 w-full object-cover"
            loading="lazy"
          />
          <div class="px-4 py-3 text-xs text-muted-foreground">
            Photo by {data.heroImage.credit} · {data.heroImage.source}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<section class="mt-20 grid gap-6 md:grid-cols-3">
  {#each [
    {
      label: 'Avg launch time',
      value: '2 days',
      note: 'From brief to live site'
    },
    {
      label: 'Edits per month',
      value: 'Unlimited',
      note: 'AI or human tweaks anytime'
    },
    {
      label: 'Conversion-ready',
      value: 'Built-in',
      note: 'CTAs and booking flows'
    }
  ] as stat}
    <Card className="cv-grid-bg">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        {stat.label}
      </p>
      <p class="mt-4 text-3xl font-semibold">{stat.value}</p>
      <p class="mt-2 text-sm text-muted-foreground">{stat.note}</p>
    </Card>
  {/each}
</section>

<section id="templates" class="mt-24 space-y-10">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="space-y-3">
      <Badge variant="outline">Templates</Badge>
      <h2 class="text-3xl font-semibold sm:text-4xl">
        Start with a template built for your industry
      </h2>
      <p class="text-sm text-muted-foreground">
        Pick a starting point. Convelt tailors the copy and sections.
      </p>
    </div>
    <Button variant="outline">View all templates</Button>
  </div>
  <div class="grid gap-6 md:grid-cols-2">
    {#each data.templates as template}
      <Card className="overflow-hidden">
        {#if template.image}
          <img
            src={template.image.url}
            alt={template.title}
            class="h-52 w-full object-cover"
            loading="lazy"
          />
        {/if}
        <div class="mt-4 space-y-2">
          <p class="text-lg font-semibold">{template.title}</p>
          <p class="text-sm text-muted-foreground">{template.description}</p>
          <Button size="sm" variant="outline">Preview template</Button>
        </div>
      </Card>
    {/each}
  </div>
</section>

<section class="mt-24 space-y-10">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="space-y-3">
      <Badge variant="outline">Discover</Badge>
      <h2 class="text-3xl font-semibold sm:text-4xl">
        See what owners are launching
      </h2>
      <p class="text-sm text-muted-foreground">
        Real small-business sites, from draft to live.
      </p>
    </div>
    <Button variant="outline">View all</Button>
  </div>
  <div class="grid gap-6 md:grid-cols-2">
    {#each showcases as site}
      <Card className="flex flex-col gap-3">
        <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          <span>{site.status}</span>
          <span>Convelt build</span>
        </div>
        <h3 class="text-xl font-semibold">{site.name}</h3>
        <p class="text-sm text-muted-foreground">{site.description}</p>
        <Button size="sm" variant="outline">Open preview</Button>
      </Card>
    {/each}
  </div>
</section>

<section class="mt-24 grid gap-10 lg:grid-cols-[1fr,1fr] lg:items-center">
  <div class="space-y-5">
    <Badge variant="outline">Why Convelt</Badge>
    <h2 class="text-3xl font-semibold sm:text-4xl">
      For teams that can’t babysit a website
    </h2>
    <p class="text-sm text-muted-foreground">
      Convelt combines industry templates with guided drafting and simple
      publishing. It feels bespoke without the agency wait.
    </p>
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="cv-panel flex items-start gap-3 rounded-xl p-4">
        <MessageSquareText class="h-5 w-5 text-cv-neon" />
        <div>
          <p class="font-semibold">Conversational intake</p>
          <p class="text-sm text-muted-foreground">
            12 questions that feel human, not a form.
          </p>
        </div>
      </div>
      <div class="cv-panel flex items-start gap-3 rounded-xl p-4">
        <Palette class="h-5 w-5 text-cv-neon" />
        <div>
          <p class="font-semibold">Brand voice locked</p>
          <p class="text-sm text-muted-foreground">
            Tone, palette, and imagery stay consistent.
          </p>
        </div>
      </div>
      <div class="cv-panel flex items-start gap-3 rounded-xl p-4">
        <BadgeCheck class="h-5 w-5 text-cv-neon" />
        <div>
          <p class="font-semibold">Local trust signals</p>
          <p class="text-sm text-muted-foreground">
            Reviews, certifications, and awards built in.
          </p>
        </div>
      </div>
      <div class="cv-panel flex items-start gap-3 rounded-xl p-4">
        <ShieldCheck class="h-5 w-5 text-cv-neon" />
        <div>
          <p class="font-semibold">Secure publish</p>
          <p class="text-sm text-muted-foreground">
            Hosted with SSL and backup-friendly exports.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="cv-panel cv-grid-bg rounded-2xl p-8">
    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
      <Bot class="h-4 w-4 text-cv-neon" />
      Draft assistant
    </div>
    <h3 class="mt-4 text-2xl font-semibold">Draft-assisted, not auto-pilot</h3>
    <p class="mt-2 text-sm text-muted-foreground">
      Convelt keeps it human: drafts first, you approve, and the site ships in a
      format customers can trust.
    </p>
    <div class="mt-6 space-y-4 text-sm">
      <div class="flex items-center gap-3">
        <TerminalSquare class="h-4 w-4 text-cv-electric" />
        <span>Prompt → layout → publish in minutes</span>
      </div>
      <div class="flex items-center gap-3">
        <Timer class="h-4 w-4 text-cv-electric" />
        <span>Fast iterations without redesigns</span>
      </div>
      <div class="flex items-center gap-3">
        <Globe class="h-4 w-4 text-cv-electric" />
        <span>Local SEO and conversion tweaks baked in</span>
      </div>
    </div>
  </div>
</section>

<section class="mt-24" id="pricing">
  <div class="text-center">
    <Badge variant="outline">Pricing</Badge>
    <h2 class="mt-4 text-4xl font-semibold">
      One plan for every location
    </h2>
    <p class="mt-3 text-sm text-muted-foreground">
      $50/month or save 20% annually — always shown per month.
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <div
        class="flex items-center gap-2 rounded-full border-2 border-border bg-background p-1 text-xs font-semibold uppercase tracking-[0.3em]"
        role="tablist"
      >
        <button
          type="button"
          class={`rounded-full px-4 py-2 ${
            billingInterval === 'month' ? 'bg-primary text-primary-foreground' : ''
          }`}
          on:click={() => (billingInterval = 'month')}
        >
          Monthly
        </button>
        <button
          type="button"
          class={`rounded-full px-4 py-2 ${
            billingInterval === 'year' ? 'bg-primary text-primary-foreground' : ''
          }`}
          on:click={() => (billingInterval = 'year')}
        >
          Annual
        </button>
      </div>
      <span class="text-xs text-muted-foreground">20% off yearly</span>
    </div>
  </div>
  <Card className="mt-10 max-w-4xl mx-auto">
    <div class="grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-center">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {billingInterval === 'year' ? 'Annual billing' : 'Monthly billing'}
        </p>
        <p class="text-5xl font-semibold">
          ${billingPlans[billingInterval]}
          <span class="text-base text-muted-foreground">/mo</span>
        </p>
        {#if billingInterval === 'year'}
          <p class="text-xs text-muted-foreground">
            Billed annually at $480. Save $120 per year.
          </p>
        {/if}
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>• Unlimited drafts + edits</li>
          <li>• Drafting + brand tone control</li>
          <li>• Templates for SMB verticals</li>
          <li>• Priority support</li>
        </ul>
      </div>
      <div class="space-y-4 rounded-xl border-2 border-border bg-background p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Convelt Core
        </p>
        <p class="text-2xl font-semibold">Launch plan</p>
        <Button className="w-full" href="/login">Start with Convelt</Button>
        <p class="text-xs text-muted-foreground">
          Beta: usage caps may apply.
        </p>
      </div>
    </div>
  </Card>
</section>

<section class="mt-24">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <Badge variant="outline">Blog</Badge>
      <h2 class="mt-3 text-3xl font-semibold sm:text-4xl">
        Field notes from busy businesses
      </h2>
    </div>
    <Button variant="outline" href="/blog">View all</Button>
  </div>
  <div class="mt-8 grid gap-6 md:grid-cols-3">
    {#each data.latestPosts as post}
      <Card className="overflow-hidden">
        <img
          src={post.image.url}
          alt={post.image.alt}
          class="h-44 w-full object-cover"
          loading="lazy"
        />
        <div class="mt-4 space-y-3">
          <Badge variant="outline">{post.tag}</Badge>
          <h3 class="text-lg font-semibold">{post.title}</h3>
          <p class="text-sm text-muted-foreground">{post.description}</p>
          <p class="text-xs text-muted-foreground">{post.author} · {post.date}</p>
          <Button size="sm" variant="outline" href={`/blog/${post.slug}`}>
            Read
          </Button>
        </div>
      </Card>
    {/each}
  </div>
</section>

<section class="mt-24 cv-panel cv-noise rounded-2xl p-10 text-center">
  <h2 class="text-3xl font-semibold sm:text-4xl">
    Launch a modern website
  </h2>
  <p class="mt-3 text-sm text-muted-foreground">
    Convelt keeps the workflow simple: brief, refine, publish.
  </p>
  <div class="mt-6 flex flex-wrap justify-center gap-3">
    <Button href="/login" size="lg">Start your site</Button>
    <Button href="/pricing" size="lg" variant="outline">See pricing</Button>
  </div>
</section>
