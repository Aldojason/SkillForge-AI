/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#E7E1D6",      // warm putty desk mat — page background
        surface: "#F2ECDF",     // raised clay card surface
        surfaceDeep: "#DED6C6", // recessed / inset clay surface
        ink: "#3A342B",         // primary text — charcoal clay
        muted: "#8F8574",       // secondary text
        primary: {
          DEFAULT: "#5B4B8A",   // study violet — pressed clay indigo
          light: "#7768A6",
          dark: "#453770",
        },
        sprout: {
          DEFAULT: "#6E8B3D",   // growth / success clay
          light: "#89A85B",
        },
        ember: {
          DEFAULT: "#C1793F",   // streaks / accent clay
          light: "#D89A6B",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        clay: "28px",
        "clay-sm": "18px",
        "clay-lg": "36px",
      },
    },
  },
  plugins: [],
};
