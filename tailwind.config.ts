import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@aureuma/svelta/packages/core/dist/**/*.{js,ts,svelte}'
  ],
  theme: {
    extend: {
      colors: {
        'background-main': 'rgb(var(--c-background-main) / <alpha-value>)',
        'background-soft': 'rgb(var(--c-background-soft) / <alpha-value>)',
        'background-invert': 'rgb(var(--c-background-invert) / <alpha-value>)',
        'text-main': 'rgb(var(--c-text-main) / <alpha-value>)',
        'text-sub': 'rgb(var(--c-text-sub) / <alpha-value>)',
        'text-muted': 'rgb(var(--c-text-muted) / <alpha-value>)',
        'text-invert': 'rgb(var(--c-text-invert) / <alpha-value>)',
        'border-soft': 'rgb(var(--c-border-soft) / <alpha-value>)',
        brand: 'rgb(var(--c-brand) / <alpha-value>)',
        'brand-soft': 'rgb(var(--c-brand-soft) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        cv: {
          ink: 'var(--cv-ink)',
          neon: 'var(--cv-neon)',
          electric: 'var(--cv-electric)',
          surface: 'var(--cv-surface)',
          border: 'var(--cv-border)',
          text: 'var(--cv-text-strong)',
          muted: 'var(--cv-text-muted)'
        }
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        serif: ['Chakra Petch', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 6px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
};

export default config;
