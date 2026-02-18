<script lang="ts">
  import Button from '$components/ui/button.svelte';
  import Input from '$components/ui/input.svelte';
  import Badge from '$components/ui/badge.svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import { CV_PUBLIC_SITE_URL } from '$lib/public-env';

  let email = '';
  let status: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  let errorMessage = '';
  $: nextPath = $page.url.searchParams.get('next') || '/dashboard';

  const sendLink = async () => {
    if (!email) return;
    status = 'sending';
    errorMessage = '';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${CV_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });

    if (error) {
      status = 'error';
      errorMessage = error.message;
      return;
    }

    status = 'sent';
  };
</script>

<div class="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center">
  <div class="grid w-full gap-10 lg:grid-cols-[1.1fr,0.9fr]">
    <div class="space-y-6">
      <Badge variant="outline">Login</Badge>
      <h1 class="text-4xl font-semibold sm:text-5xl">
        Welcome back to Convelt
      </h1>
      <p class="text-sm text-muted-foreground">
        Use a magic link to access your workspace. We keep it simple and fast.
      </p>
      <div class="space-y-4">
        <label class="text-xs font-semibold uppercase tracking-[0.3em]" for="login-email">
          Email
        </label>
        <Input
          id="login-email"
          bind:value={email}
          type="email"
          placeholder="you@business.com"
        />
        <Button className="w-full" on:click={sendLink}>
          {#if status === 'sending'}Sending…{:else}Send magic link{/if}
        </Button>
        {#if status === 'sent'}
          <p class="text-sm text-muted-foreground">
            Check your inbox for a login link.
          </p>
        {/if}
        {#if status === 'error'}
          <p class="text-sm text-red-500">{errorMessage}</p>
        {/if}
      </div>
    </div>
    <div class="cv-panel cv-noise cv-grid-bg rounded-2xl p-8">
      <h2 class="text-xl font-semibold">What’s inside</h2>
      <ul class="mt-6 space-y-4 text-sm text-muted-foreground">
        <li>• Live site drafts and instant edits</li>
        <li>• SMB-specific templates (dentists, salons, clinics)</li>
        <li>• Draft assistant for copy and layout</li>
        <li>• Publish-ready layouts in minutes</li>
      </ul>
      <Badge variant="accent" className="mt-6">Beta access</Badge>
    </div>
  </div>
</div>
