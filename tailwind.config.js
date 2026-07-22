/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        port: {
          navy: "#0F4C81",
          darkNavy: "#0B3C68",
          deepBlue: "#0B3B60",
          secondary: "#0060A8",
          sky: "#38A1F3",
          lightSky: "#EBF5FF",
          bg: "#FBF9F9",
          surface: "#FFFFFF",
          border: "#EBF0F5",
          muted: "#64748B",
          heading: "#0F172A",
        },
        status: {
          pending: {
            DEFAULT: "#F97316",
            bg: "#FFEDD5",
            text: "#C2410C",
          },
          underReview: {
            DEFAULT: "#0284C7",
            bg: "#E0F2FE",
            text: "#0369A1",
          },
          resolved: {
            DEFAULT: "#16A34A",
            bg: "#FFEDD5", // matches resolution badge pill in screenshot (soft peach background with dark text)
            text: "#9A3412",
          },
          rejected: {
            DEFAULT: "#DC2626",
            bg: "#FEE2E2",
            text: "#B91C1C",
          },
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 76, 129, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        card: "0 2px 12px 0 rgba(15, 76, 129, 0.04)",
        floating: "0 10px 25px -5px rgba(15, 76, 129, 0.3)",
      },
    },
  },
  plugins: [],
};
