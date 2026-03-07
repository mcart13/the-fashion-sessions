import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F3ED",
        tan: "#E6DDD9",
        "text-dark": "#282828",
        "heading-dark": "#282828",
        "accent-gold": "#BA9D95",
        "btn-cta": "#EADFD2",
        "script-brown": "#936740",
        divider: "#B98F67",
        "footer-text": "#E6DDD9",
        "footer-hover": "#D4C5BA",
      },
      fontFamily: {
        butler: ['"Butler Font"', "serif"],
        moontime: ["Moontime", "cursive"],
        roboto: ["Roboto", "sans-serif"],
        "roboto-slab": ['"Roboto Slab"', "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      zIndex: {
        header: "40",
        overlay: "45",
        popup: "50",
        toast: "60",
      },
    },
  },
  plugins: [],
};
export default config;
