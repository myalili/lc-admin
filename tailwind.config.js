const colors = require('tailwindcss/colors')

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        '#F0F5F7':'var(--color-light-gray-2)',
        "gray": {
          'F0F5F7':'var(--color-light-gray-2)',
          "7F8C93":'var(--color-gray)'
        },
      },
      width:{
        "200":"200px",
        "90px":"90px"
      },
      height:{
        "400px":"400px"
      },
      flex:{
        "auto1":"0 0 auto",
      },
      backgroundColor: {
        // like `bg-base` and `bg-primary`
        system:'var(--color-bg-system)',
        base: 'var(--color-base)',
        'off-base': 'var(--color-off-base)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        muted: 'var(--color-text-muted)',
      },
      textColor: {
        //like `text-base` and `text-primary`
        base: 'var(--color-text-base)',
        muted: 'var(--color-text-muted)',
        'muted-hover': 'var(--color-text-muted-hover)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    maxWidth:{
      "96":"96px"
    },
    maxHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
   
    screens: {
      sm: "640px", //@media (min-width: 640px) { ... }
      md: "768px", 
      lg: "1024px", 
      xl: "1280px", 
      "2xl": "1536px",

      ml: "1105px",
    },
  },
  variants: {
    extend: {
      margin: ['last'],
    }
  },
  plugins: [],
};
