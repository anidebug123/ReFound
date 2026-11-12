/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#FAF8F3',
          surface: '#FFFFFF',
          card: '#F6F4ED',
          border: '#EAE7DF',
        },
        ink: {
          primary: '#242424',
          secondary: '#77756F',
          muted: '#9E9C94',
        },
        cobalt: {
          DEFAULT: '#3457D5',
          hover: '#2846B3',
          light: '#E9EDFF',
          dark: '#1C3182',
        },
        coral: {
          DEFAULT: '#F07861',
          hover: '#DB634C',
          light: '#FDECE8',
        },
        butter: {
          DEFAULT: '#F5D978',
          light: '#FEFAEC',
          dark: '#947214',
        },
        sage: {
          DEFAULT: '#DDEBDD',
          dark: '#2A5D33',
          light: '#F2F8F2',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(36, 36, 36, 0.05), 0 1px 4px -1px rgba(36, 36, 36, 0.03)',
        'card': '0 4px 20px -4px rgba(36, 36, 36, 0.06), 0 2px 6px -2px rgba(36, 36, 36, 0.03)',
        'elevated': '0 12px 32px -8px rgba(36, 36, 36, 0.1), 0 4px 12px -2px rgba(36, 36, 36, 0.04)',
      },
    },
  },
  plugins: [],
}

