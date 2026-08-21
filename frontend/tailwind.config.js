/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Console (admin) — dark command center
        void: '#050816',
        panel: '#0B1020',
        cyan: '#00F5FF',
        violet: '#8B5CF6',
        emerald: '#10B981',
        amber: '#F59E0B',
        ivory: '#F4EFE6',
        bone: '#C8D1DC',
        mute: '#64748B',
        // Storefront — warm product-forward
        store: {
          ink: '#1A1410',
          paper: '#F7F3EE',
          sand: '#EDE6DC',
          clay: '#C45C26',
          pine: '#2F5D50',
          mist: '#8A7F72',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        store: ['"DM Sans"', 'sans-serif'],
        storeDisplay: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
