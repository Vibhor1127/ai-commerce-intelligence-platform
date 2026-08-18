/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050816',
        panel: '#0B1020',
        cyan: '#00F5FF',
        violet: '#8B5CF6',
        emerald: '#10B981',
        amber: '#F59E0B',
        ivory: '#F4EFE6',
        bone: '#C8D1DC',
        mute: '#64748B',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
