import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './demo/src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cevs: {
          bg: 'var(--cevs-bg, #ffffff)',
          fg: 'var(--cevs-fg, #0f172a)',
          accent: 'var(--cevs-accent, #2563eb)',
          muted: 'var(--cevs-muted, #64748b)',
          border: 'var(--cevs-border, #e2e8f0)',
          'bg-secondary': 'var(--cevs-bg-secondary, #f8fafc)',
        },
      },
      borderRadius: {
        cevs: 'var(--cevs-radius, 0.5rem)',
      },
      spacing: {
        cevs: 'var(--cevs-spacing, 1rem)',
      },
    },
  },
  plugins: [],
} satisfies Config;
