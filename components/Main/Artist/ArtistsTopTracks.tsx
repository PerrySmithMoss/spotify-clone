import Image from "next/image";
import React from "react";
import { usePlayback } from "../../../hooks/usePlayback";
import { milliSecondsToMinutesAndSeconds } from "../../../utils/time";
import artistStyles from "./artist.module.css";

interface SongProps {
  song: SpotifyApi.TrackObjectFull;
  order: number;
}

export const ArtistsTopTracks: React.FC<SongProps> = ({ song, order }) => {
  const { playTrack } = usePlayback();

  return (
    <button
      type="button"
      aria-label={`Play ${song.name}`}
      onClick={() => void playTrack(song)}
      className={`${artistStyles.searchSongIndividual} group grid w-full text-left grid-cols-2 text-[#b3b3b3] hover:text-white  hover:bg-[#282828] rounded-md mt-1 cursor-pointer`}
    >
      <div className="flex items-center pl-3 space-x-4 py-1 w-full">
        <p>{order + 1}</p>
        <div className="relative">
          <Image
            width={300}
            height={300}
            sizes="(max-width: 768px) 50vw, 240px"
            className="h-auto w-10 group-hover:opacity-30"
            src={
              song?.album?.images[0]?.url || "/assets/images/placeholder.svg"
            }
            alt={song.album?.name ?? ""}
          />
          <div className={`${artistStyles.searchPlayButtton} `}>
            <svg height={22} width={22} viewBox="0 0 24 24" fill="white">
              <polygon
                fill="white"
                points="21.57 12 5.98 3 5.98 21 21.57 12"
              ></polygon>
            </svg>
          </div>
        </div>
        <div>
          <p className="w-36 lg:w-[20rem] truncate text-white">{song?.name}</p>
          <p className="w-40 text-sm">{song?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto text-sm md:ml-0 pr-10">
        <p className="hidden md:inline w-40 lg:w-96 truncate">
          {song?.album.name}
        </p>
        <p>{milliSecondsToMinutesAndSeconds(song?.duration_ms)}</p>
      </div>
    </button>
  );
};
