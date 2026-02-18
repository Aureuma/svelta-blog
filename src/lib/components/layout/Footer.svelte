<script lang="ts">
  import Logo from '$components/Logo.svelte';
</script>

<footer class="border-t-2 border-border bg-background">
  <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr,2fr] lg:px-10">
    <div class="space-y-4">
      <Logo size="lg" />
      <p class="max-w-xs text-sm text-muted-foreground">
        AI-enhanced websites for busy businesses. Ship a credible brand presence
        in days, not weeks.
      </p>
      <div class="cv-chip">Build for a Busy Business, Like Yours</div>
    </div>
    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Company
        </p>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="hover:text-cv-neon">About</a></li>
          <li><a href="/careers" class="hover:text-cv-neon">Careers</a></li>
          <li><a href="/press" class="hover:text-cv-neon">Press & media</a></li>
          <li><a href="/security" class="hover:text-cv-neon">Security</a></li>
        </ul>
      </div>
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Product
        </p>
        <ul class="space-y-2 text-sm">
          <li><a href="/pricing" class="hover:text-cv-neon">Pricing</a></li>
          <li><a href="/templates" class="hover:text-cv-neon">Templates</a></li>
          <li><a href="/dashboard" class="hover:text-cv-neon">Dashboard</a></li>
          <li>
            <a href="/beta" class="hover:text-cv-neon">
              Beta access
            </a>
          </li>
        </ul>
      </div>
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Resources
        </p>
        <ul class="space-y-2 text-sm">
          <li><a href="/blog" class="hover:text-cv-neon">Blog</a></li>
          <li><a href="/guides" class="hover:text-cv-neon">Guides</a></li>
          <li><a href="/support" class="hover:text-cv-neon">Support</a></li>
          <li><a href="/changelog" class="hover:text-cv-neon">Changelog</a></li>
        </ul>
      </div>
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Legal
        </p>
        <ul class="space-y-2 text-sm">
          <li><a href="/privacy" class="hover:text-cv-neon">Privacy</a></li>
          <li><a href="/terms" class="hover:text-cv-neon">Terms</a></li>
          <li><a href="/platform-rules" class="hover:text-cv-neon">Platform rules</a></li>
          <li><a href="/abuse" class="hover:text-cv-neon">Report abuse</a></li>
        </ul>
      </div>
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Community
        </p>
        <ul class="space-y-2 text-sm">
          <li><a href="https://discord.com" class="hover:text-cv-neon">Discord</a></li>
          <li><a href="https://reddit.com" class="hover:text-cv-neon">Reddit</a></li>
          <li><a href="https://x.com" class="hover:text-cv-neon">X / Twitter</a></li>
          <li><a href="https://www.linkedin.com" class="hover:text-cv-neon">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="border-t-2 border-border py-6 text-center text-xs text-muted-foreground">
    © 2026 Convelt. All rights reserved.
  </div>
</footer>
