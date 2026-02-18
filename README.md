## Convelt (SvelteKit)

Landing + blog + auth shell for Convelt. Built alongside the ReleaseMind stack
(SvelteKit + Supabase) with shared infra conventions.

### Development

From repo root:

```bash
si vault run --file .env.dev -- pnpm -C app/cv dev
```

### Build

```bash
si vault run --file .env.dev -- pnpm -C app/cv build
```

### Quality checks

```bash
pnpm -C app/cv lint
pnpm -C app/cv check
```
