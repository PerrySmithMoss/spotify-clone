import React, { useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import searchStyles from "./search.module.css";

interface YourTopGenresProps {}

export const YourTopGenres: React.FC<YourTopGenresProps> = ({}) => {
  return (
    <div>
      <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
        Your top genres
      </h1>
      <div>
        <div
          className={`mt-4 grid grid-flow-col gap-6 overflow-y-hidden scrollbar-hide`}
        >
          {genres.map((genre: any) => (
            <a
            key={genre.id}
              className={searchStyles.genreContainer}
              style={{ backgroundColor: genre.colour }}
            >
              <h3 className={searchStyles.genreHeading}>{genre.genre}</h3>
              <img
                loading="lazy"
                className={searchStyles.genreImage}
                src={genre.image}
                alt="Genre image"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const genres = [
  {
    id: 1,
    colour: "rgb(186, 93, 7)",
    genre: "Hip-Hop",
    image: "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c",
  },
  {
    id: 2,
    colour: "rgb(230, 30, 50)",
    genre: "Rock",
    image: "https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730",
  },
  {
    id: 3,
    colour: "rgb(141, 103, 171)",
    genre: "Pop",
    image: "https://t.scdn.co/images/0a74d96e091a495bb09c0d83210910c3",
  },
  {
    id: 4,
    colour: "rgb(96, 129, 8)",
    genre: "Indie",
    image: "https://i.scdn.co/image/ab67706f000000025f7327d3fdc71af27917adba",
  },
];
