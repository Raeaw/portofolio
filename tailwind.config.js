/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12161C',
        surface: '#1A2029',
        surface2: '#212934',
        line: '#2B3440',
        text: '#E8E6E1',
        muted: '#8B95A3',
        signal: '#F0B429',
        route: '#5EEAD4',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
