import React from "react";
import heroStyles from "./hero.module.css";
interface HeroProps {}

export const Hero: React.FC<HeroProps> = ({}) => {
  return (
    <main className={`${heroStyles.heroBackground} relative`}>
      <div className="block text-center">
        <h1
          className={`${heroStyles.heroHeader} text-center text-spotify-green`}
        >
          Listening is everything
        </h1>
      </div>
      <div>
        <h2 className={`${heroStyles.heroSubHeader} text-spotify-green`}>
          Millions of songs and podcasts. No credit card needed.
        </h2>
      </div>
      <div className="mt-5 largePhone:mt-0">
        <button className="bg-spotify-green text-[#2941AB] uppercase rounded-full px-9 py-4 font-bold">
          Get Spotify Free
        </button>
      </div>
    </main>
  );
};
