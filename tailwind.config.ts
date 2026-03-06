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
      },
      fontFamily: {
        butler: ['"Butler Font"', "serif"],
        moontime: ["Moontime", "cursive"],
        roboto: ["Roboto", "sans-serif"],
        "roboto-slab": ['"Roboto Slab"', "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
