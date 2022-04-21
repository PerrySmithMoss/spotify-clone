module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1ed760",
        "spotify-black": "#000",
        "spotify-gray": "#121212",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        llg: "1050px",
        // => @media (min-width: 1050px) { ... }

        lllg: "1180px",
        // => @media (min-width: 1180px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      extend: {
        screens: {
          xxxs: "290px",
          // => @media (min-width: 290px) { ... }

          xxs: "375px",
          // => @media (min-width: 375px) { ... }

          xss: "424px",
          // => @media (min-width: 424px) { ... }

          xs: "475px",
          // => @media (min-width: 475px) { ... }

          xsm: "530px",
          // => @media (min-width: 530px) { ... }

          largeSmall: "700px",
          // => @media (min-width: 768px) { ... }

          largeMd: "810px",
          // => @media (min-width: 912px) { ... }

          largeTablet: "912px",
          // => @media (min-width: 912px) { ... }

          "1xl": "1251px",
          // => @media (min-width: 1251px) { ... }
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/line-clamp"),
  ],
};
