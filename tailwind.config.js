/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'inputGray': '#E2E2E2',
        'textGray': '#4C4C4C',
        "hoverGray": "#969696",
        "grayBG": "#FAFAFA",
        "lineBG": "#BFBFBF",
        "gearBlue": '#F6F6F6'
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
      },
    },
  },
  plugins: [],
};
