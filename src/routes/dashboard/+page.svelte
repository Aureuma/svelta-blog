<script lang="ts">
  import {
    LayoutGrid,
    Search,
    Sparkles,
    FolderKanban,
    Star,
    Share2,
    Layers,
    Globe2,
    Settings,
    Plus
  } from 'lucide-svelte';
  import Button from '$components/ui/button.svelte';
  import Input from '$components/ui/input.svelte';

  export let data: {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    };
  };

  let prompt = '';
</script>

<div class="grid min-h-[80vh] grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
  <aside class="cv-panel cv-noise rounded-2xl p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
        <LayoutGrid class="h-4 w-4" />
        Workspace
      </div>
      <Button size="icon" variant="outline">
        <Plus class="h-4 w-4" />
      </Button>
    </div>

    <button class="mt-6 flex w-full items-center justify-between rounded-md border-2 border-border bg-background px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
      <span class="flex items-center gap-2"><Search class="h-4 w-4" /> Search</span>
      <span class="text-muted-foreground">⌘K</span>
    </button>

    <div class="mt-8 space-y-6 text-sm">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Projects
        </p>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#recent">
          <FolderKanban class="h-4 w-4" /> Recent
        </a>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#starred">
          <Star class="h-4 w-4" /> Starred
        </a>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#shared">
          <Share2 class="h-4 w-4" /> Shared with me
        </a>
      </div>
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Resources
        </p>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#templates">
          <Layers class="h-4 w-4" /> Templates
        </a>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#discover">
          <Globe2 class="h-4 w-4" /> Discover
        </a>
      </div>
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Settings
        </p>
        <a class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted" href="/dashboard#account">
          <Settings class="h-4 w-4" /> Account
        </a>
      </div>
    </div>
  </aside>

  <section class="space-y-8">
    <div class="cv-panel cv-grid-bg rounded-2xl p-10">
      <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        <Sparkles class="h-4 w-4 text-cv-neon" />
        {data.user.name || 'Builder'} workspace
      </div>
      <h1 class="mt-4 text-3xl font-semibold sm:text-4xl">
        Let’s build your next business site
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
        Describe the business, what makes it special, and the calls-to-action you
        need. Convelt will draft a site you can tweak fast.
      </p>
      <div class="mt-6 flex flex-col gap-3 rounded-xl border-2 border-border bg-background p-4 shadow-[6px_6px_0_hsl(var(--foreground))]">
        <Input
          bind:value={prompt}
          placeholder="Dental site for Dr. Solgado. New-patient CTA + booking."
          className="border-0 bg-transparent focus:ring-0"
        />
        <div class="flex flex-wrap items-center gap-3">
          <Button>Draft site</Button>
          <Button variant="outline">Attach brief (soon)</Button>
          <span class="text-xs text-muted-foreground">Beta build mode</span>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="cv-panel rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Drafts</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Your drafts will appear here once we generate them.
        </p>
        <div class="mt-6 rounded-lg border-2 border-dashed border-border p-6 text-xs text-muted-foreground">
          Draft workspace coming soon
        </div>
      </div>
      <div class="cv-panel rounded-2xl p-6">
        <h2 class="text-lg font-semibold">Launch checklist</h2>
        <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>• Confirm hours and service areas</li>
          <li>• Add 3 client testimonials</li>
          <li>• Review mobile layout</li>
          <li>• Publish to your custom domain</li>
        </ul>
        <Button variant="outline" className="mt-6">
          Download checklist
        </Button>
      </div>
    </div>
  </section>
</div>
