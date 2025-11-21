import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c5a47e",
          dark: "#a68a69",
          light: "#e0cbb3"
        },
        dark: "#1a1a1a",
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
        sans: ['var(--font-sans)', 'Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
