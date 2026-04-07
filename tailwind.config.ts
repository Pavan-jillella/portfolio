import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        white: "rgb(var(--color-white) / <alpha-value>)",
        charcoal: {
          950: "rgb(var(--charcoal-950) / <alpha-value>)",
          900: "rgb(var(--charcoal-900) / <alpha-value>)",
          800: "rgb(var(--charcoal-800) / <alpha-value>)",
          700: "rgb(var(--charcoal-700) / <alpha-value>)",
        },
        glass: {
          white: "var(--glass-bg)",
          border: "var(--glass-border)",
          hover: "var(--glass-hover)",
        },
        gold: {
          DEFAULT: "#c9a96e",
          light: "#d4bc8a",
          dark: "#a68b4f",
          glow: "rgba(201, 169, 110, 0.15)",
        },
        taupe: {
          DEFAULT: "#8b7355",
          light: "#a08b6d",
          dark: "#6b5a42",
        },
        sage: {
          DEFAULT: "#7a9e7a",
          light: "#96b496",
          dark: "#5e7e5e",
        },
        cream: {
          DEFAULT: "#f8f5f0",
          warm: "#f5f0e8",
          light: "#fdfcfa",
        },
        section: {
          education: "#c9a96e",
          finance: "#7a9e7a",
          projects: "#8b7355",
          blog: "#c9a96e",
        },
        border: "var(--glass-border)",
        input: "var(--glass-border)",
        ring: "#c9a96e",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#c9a96e",
          foreground: "#1a1a18",
        },
        secondary: {
          DEFAULT: "var(--glass-bg)",
          foreground: "var(--foreground)",
        },
        destructive: {
          DEFAULT: "#c45b5b",
          foreground: "#fdfcfa",
        },
        muted: {
          DEFAULT: "var(--glass-bg)",
          foreground: "#8b7355",
        },
        accent: {
          DEFAULT: "#c9a96e",
          foreground: "#1a1a18",
        },
        popover: {
          DEFAULT: "rgb(var(--charcoal-900) / <alpha-value>)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--glass-bg)",
          foreground: "var(--foreground)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite 1s",
        "float-fast": "float 4s ease-in-out infinite 0.5s",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        grain: "grain 0.5s steps(1) infinite",
        flame: "flame 0.5s ease-in-out infinite alternate",
        shine: "shine 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) rotate(3deg)" },
          "66%": { transform: "translateY(10px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(2%, 1%)" },
          "30%": { transform: "translate(-1%, 2%)" },
          "40%": { transform: "translate(3%, -1%)" },
          "50%": { transform: "translate(-2%, 2%)" },
          "60%": { transform: "translate(1%, -2%)" },
          "70%": { transform: "translate(-3%, 1%)" },
          "80%": { transform: "translate(2%, 3%)" },
          "90%": { transform: "translate(-1%, -1%)" },
        },
        flame: {
          "0%": { transform: "scale(1) rotate(-2deg)" },
          "100%": { transform: "scale(1.1) rotate(2deg)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "50%, 100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
