module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1ed760',
        'spotify-black': '#010206'
      }
    },
    screens: {
      phone: '375px',
      // => @media (min-width: 375px) { ... }

      largePhone: '480px',
      // => @media (min-width: 480px) { ... }

      tablet: '640px',
      // => @media (min-width: 640px) { ... }


      smallLaptop: '912px',
      // => @media (min-width: 1024px) { ... }

      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }

      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}
