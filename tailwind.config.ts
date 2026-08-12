import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f3ede3",
        "paper-light": "#faf7f0",
        cream: "#fffdf8",
        brown: "#4c3c2e",
        "brown-soft": "#766555",
        gold: "#a18a69",
        line: "#d8cbb8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
