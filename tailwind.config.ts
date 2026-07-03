import type { Config } from "tailwindcss";

// Design tokens mirror the CSS variables in src/app/globals.css.
// See the Boston Mattress® UI/UX Guide v2.0 §2–§3.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Literal hex (not var()) so Tailwind opacity modifiers like
      // `text-cream/80` work. The same values live as CSS variables in
      // globals.css for the hand-written component classes.
      colors: {
        charcoal: "#1C1412",
        deep: "#2A2520",
        gold: "#B8864E",
        "gold-light": "#D4A56A",
        "gold-dark": "#8A6035",
        cream: "#FDFAF6",
        linen: "#F5EDE0",
        "border-subtle": "#E8DDD0",
        "text-dark": "#1C1412",
        "text-muted": "#78716C",
        whatsapp: "#25D366",
        success: "#15803D",
        error: "#DC2626",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      animation: {
        "wa-pulse": "wa-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
