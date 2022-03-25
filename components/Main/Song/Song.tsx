import React from "react";
import { milliSecondsToMinutesAndSeconds } from "../../../lib/time";

interface SongProps {
  song: any;
  order: any;
}

export const Song: React.FC<SongProps> = ({ song, order }) => {
  return (
    <div className="grid grid-cols-2 text-[#929292] hover:text-white hover:bg-spotify-black rounded-md mt-5 cursor-pointer">
      <div className="flex items-center pl-3 space-x-4 py-1 w-full">
        <p>{order + 1}</p>
        <div className="relative">
        <img
          className="h-auto w-10"
          src={song.track.album.images[0].url}
          alt={song.track.album.name}
        />
        </div>
        <div>
          <p className="w-36 laptop:w-[20rem] truncate text-white">
            {song.track.name}
          </p>
          <p className="w-40">{song.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto tablet:ml-0 pr-10">
        <p className="hidden tablet:inline w-40 laptop:w-96 truncate">
          {song.track.album.name}
        </p>
        <p>{milliSecondsToMinutesAndSeconds(song.track.duration_ms)}</p>
      </div>
    </div>
  );
};
