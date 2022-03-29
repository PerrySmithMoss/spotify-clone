import React from "react";
import { useSpotify } from "../../hooks/useSpotify";
import { milliSecondsToMinutesAndSeconds } from "../../lib/time";
import { useAppStore } from "../../store/AppStore";

interface SongProps {
  song: any;
  order: any;
}

export const Song: React.FC<SongProps> = ({ song, order }) => {
  const spotifyApi = useSpotify();
  const { currentTrackId, setCurrentTrackId, isPlaying, setIsPlaying } =
    useAppStore();
  const playSong = () => {
    console.log(song)
    setCurrentTrackId(song.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.track.uri],
    });
  };

  return (
    <div
      onClick={playSong}
      className="grid grid-cols-2 text-[#b3b3b3] hover:text-white  hover:bg-spotify-black rounded-md mt-5 cursor-pointer"
    >
      <div className="flex items-center pl-3 space-x-4 py-1 w-full">
        <p>{order + 1}</p>
        <div className="relative">
          <img
            className="h-auto w-10"
            src={song?.track?.album?.images[0]?.url}
            alt={song?.track?.album?.name}
          />
        </div>
        <div>
          <p className="w-36 lg:w-[20rem] truncate text-white">
            {song?.track.name}
          </p>
          <p className="w-40 text-sm">{song?.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto text-sm md:ml-0 pr-10">
        <p className="hidden md:inline w-40 lg:w-96 truncate">
          {song?.track.album.name}
        </p>
        <p>{milliSecondsToMinutesAndSeconds(song?.track.duration_ms)}</p>
      </div>
    </div>
  );
};
