<script lang="ts">
  import Badge from '$components/ui/badge.svelte';
  import Button from '$components/ui/button.svelte';
  import Card from '$components/ui/card.svelte';

  const prices = {
    month: 50,
    year: 40
  };
  let interval: 'month' | 'year' = 'month';
</script>

<section class="space-y-12">
  <header class="mx-auto max-w-3xl space-y-4 text-center">
    <Badge variant="outline">Pricing</Badge>
    <h1 class="text-4xl font-semibold sm:text-5xl">Simple pricing for busy teams</h1>
    <p class="text-sm text-muted-foreground">
      $50 monthly, or save 20% annually. Always shown per month.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <div class="flex items-center gap-2 rounded-full border-2 border-border bg-background p-1 text-xs font-semibold uppercase tracking-[0.3em]">
        <button
          type="button"
          class={`rounded-full px-4 py-2 ${interval === 'month' ? 'bg-primary text-primary-foreground' : ''}`}
          on:click={() => (interval = 'month')}
        >
          Monthly
        </button>
        <button
          type="button"
          class={`rounded-full px-4 py-2 ${interval === 'year' ? 'bg-primary text-primary-foreground' : ''}`}
          on:click={() => (interval = 'year')}
        >
          Annual
        </button>
      </div>
      <span class="text-xs text-muted-foreground">20% off yearly</span>
    </div>
  </header>

  <div class="grid gap-6 lg:grid-cols-2">
    <Card className="cv-grid-bg">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Convelt Core
        </p>
        <p class="text-5xl font-semibold">
          ${prices[interval]}<span class="text-base text-muted-foreground">/mo</span>
        </p>
        {#if interval === 'year'}
          <p class="text-xs text-muted-foreground">
            Billed annually at $480. Save $120 per year.
          </p>
        {/if}
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>• Unlimited drafts + edits</li>
          <li>• Drafting help + voice control</li>
          <li>• Industry templates</li>
          <li>• Launch checklist + SEO basics</li>
        </ul>
        <Button className="w-full" href="/login">Start with Convelt</Button>
      </div>
    </Card>

    <Card className="cv-panel">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Convelt Business
        </p>
        <p class="text-4xl font-semibold">Custom</p>
        <p class="text-sm text-muted-foreground">
          For teams with multiple locations, SSO, and custom workflows.
        </p>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>• Multi-location rollouts</li>
          <li>• Custom domain orchestration</li>
          <li>• Dedicated launch support</li>
          <li>• Advanced compliance options</li>
        </ul>
        <Button variant="outline" className="w-full">Book a demo</Button>
      </div>
    </Card>
  </div>

  <section class="space-y-6">
    <h2 class="text-2xl font-semibold">Frequently asked</h2>
    <div class="grid gap-6 md:grid-cols-2">
      {#each [
        {
          q: 'What does the monthly plan include?',
          a: 'Unlimited drafts, templates, and publishing support.'
        },
        {
          q: 'Can I switch to annual later?',
          a: 'Yes. Move to annual billing anytime and keep the per-month price visible.'
        },
        {
          q: 'Do you handle custom domains?',
          a: 'Yes, custom domains are included in Core and expanded for Business.'
        },
        {
          q: 'Is there a free trial?',
          a: 'Alpha teams can request early access through the beta program.'
        }
      ] as item}
        <div class="cv-panel rounded-xl p-5">
          <p class="font-semibold">{item.q}</p>
          <p class="mt-2 text-sm text-muted-foreground">{item.a}</p>
        </div>
      {/each}
    </div>
  </section>
</section>
