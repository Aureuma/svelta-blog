<script lang="ts">
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '$utils/cn';

  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md border-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default:
            'border-border bg-primary text-primary-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-y-0.5 hover:shadow-[10px_10px_0_hsl(var(--foreground))]',
          secondary:
            'border-border bg-secondary text-secondary-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-y-0.5 hover:shadow-[10px_10px_0_hsl(var(--foreground))]',
          ghost:
            'border-transparent bg-transparent text-foreground hover:bg-muted',
          outline:
            'border-border bg-background text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-y-0.5 hover:shadow-[10px_10px_0_hsl(var(--foreground))]'
        },
        size: {
          sm: 'h-9 px-4',
          md: 'h-10 px-5',
          lg: 'h-12 px-6 text-base',
          icon: 'h-10 w-10'
        }
      },
      defaultVariants: {
        variant: 'default',
        size: 'md'
      }
    }
  );

  type Props = VariantProps<typeof buttonVariants> & {
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  };

  export let href: Props['href'] = undefined;
  export let variant: Props['variant'] = 'default';
  export let size: Props['size'] = 'md';
  export let type: Props['type'] = 'button';
  export let className: Props['className'] = '';

  $: reloadOnNavigate =
    !!href && (href.startsWith('/start') || href.startsWith('/auth/github'));
</script>

{#if href}
  <a
    href={href}
    data-sveltekit-reload={reloadOnNavigate}
    class={cn(buttonVariants({ variant, size }), className)}
    on:click
    {...$$restProps}
  >
    <slot />
  </a>
{:else}
  <button
    {type}
    class={cn(buttonVariants({ variant, size }), className)}
    on:click
    {...$$restProps}
  >
    <slot />
  </button>
{/if}
