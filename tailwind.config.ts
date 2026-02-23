import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rosePrimary: "#F472B6",
        roseSoft: "#FBCFE8",
        roseLight: "#FFF1F5",
        cream: "#FFF7ED",
        accentRed: "#BE123C",
      },
      fontFamily: {
        heading: ["var(--font-sour-gummy)", "sans-serif"],
        body: ["var(--font-sour-gummy)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
