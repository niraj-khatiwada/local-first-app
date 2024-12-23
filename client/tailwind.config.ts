import type { Config } from "tailwindcss"

const WIDTHS = Object.freeze({
  xs: "320px",
  sm: "576px",
  md: "768px",
  slg: "850px",
  lg: "992px",
  xl: "1280px",
  "2xl": "1440px",
  "3xl": "1660px",
})

const CUSTOM_MQ = {
  hxs: { raw: `(min-height: ${WIDTHS.xs})` },
  hsm: { raw: `(min-height: ${WIDTHS.sm})` },
  hmd: { raw: `(min-height: ${WIDTHS.md})` },
  hslg: { raw: `(min-height: ${WIDTHS.slg})` },
  hlg: { raw: `(min-height: ${WIDTHS.lg})` },
  hxl: { raw: `(min-height: ${WIDTHS.xl})` },
  h2xl: { raw: `(min-height: ${WIDTHS["2xl"]})` },
  h3xl: { raw: `(min-height: ${WIDTHS["3xl"]})` },
}

const config: Config = {
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#7f46e2",
        secondary: "#ff6ae7",
        black1: "#000000",
        gray1: "#c2c2c2",
        white1: "#ffffff",
      },
      fontFamily: {
        Montserrat: "var(--font-Montserrat)", // Make sure the key name is same as the font file name. This is necessary for mobile.
      },
      screens: { ...WIDTHS, ...CUSTOM_MQ },
      maxWidth: WIDTHS,
    },
  },
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [],
}

export default config
