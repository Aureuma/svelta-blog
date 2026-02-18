<script lang="ts">
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '$utils/cn';

  const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
    {
      variants: {
        variant: {
          default: 'border-border text-muted-foreground',
          accent: 'border-transparent bg-primary text-primary-foreground',
          outline: 'border-2 border-border bg-background text-foreground'
        }
      },
      defaultVariants: {
        variant: 'default'
      }
    }
  );

  type Props = VariantProps<typeof badgeVariants> & {
    className?: string;
  };

  export let variant: Props['variant'] = 'default';
  export let className: Props['className'] = '';
</script>

<span class={cn(badgeVariants({ variant }), className)}>
  <slot />
</span>
