/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,cjs,mjs,ts,cts,mts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Montserrat"', ...defaultTheme.fontFamily.sans],
      },
      colors:{
        "gris-claro": "#EAEAEC",
        "gris-claro-azul": "#F2F2F2",
        "azul-claro": "#0079F2",
        "azul-presionado": "#A3CEFA"
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3'
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0F3F9E",
          secondary: "#312B6B",
          accent: "#DBF22D",
          neutral: "#B8B8B8",
          info: "#17FDE2",
          success: "#DBF22E",
          warning: "#3BDBA1",
          error: "#F1273F",
          "header .btn:hover": {
            "background-color": "#F2F2F233"
          }
        },
      },
    ],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
}

