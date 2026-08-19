import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07101f',
        panel: '#0d1829',
        line: '#20314a',
        electric: '#5b8cff',
        brandTeal: '#2dd4bf',
        brandViolet: '#9b87f5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(91, 140, 255, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
