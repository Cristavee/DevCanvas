import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary:    { DEFAULT: "hsl(var(--primary))",    foreground: "hsl(var(--primary-foreground))" },
        secondary:  { DEFAULT: "hsl(var(--secondary))",  foreground: "hsl(var(--secondary-foreground))" },
        destructive:{ DEFAULT: "hsl(var(--destructive))",foreground: "hsl(var(--destructive-foreground))" },
        muted:      { DEFAULT: "hsl(var(--muted))",      foreground: "hsl(var(--muted-foreground))" },
        accent:     { DEFAULT: "hsl(var(--accent))",     foreground: "hsl(var(--accent-foreground))" },
        card:       { DEFAULT: "hsl(var(--card))",       foreground: "hsl(var(--card-foreground))" },
        popover:    { DEFAULT: "hsl(var(--popover))",    foreground: "hsl(var(--popover-foreground))" },
        sidebar:    { DEFAULT: "hsl(var(--sidebar-bg))", border: "hsl(var(--sidebar-border))" },
        neon:  "#00FFB3",
        "e-blue": "#4DABFF",
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xl:  "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Geist Mono", "Fira Code", "JetBrains Mono", "monospace"],
      },
      screens: {
        xs: "375px",   // iPhone SE, small Android
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to:   { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up":   { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in":  { from: { opacity: "0", transform: "scale(0.94)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer:     { "100%": { transform: "translateX(100%)" } },
        "neon-pulse":{ "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        spin:        { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":    "fade-up 0.3s ease-out forwards",
        "scale-in":   "scale-in 0.2s ease-out forwards",
        shimmer:      "shimmer 1.4s infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        spin:         "spin 0.7s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add scrollbar-hide utility
    function({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
      });
    },
  ],
};

export default config;
