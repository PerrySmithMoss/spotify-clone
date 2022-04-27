import React from "react";
import { useSpotify } from "../../../hooks/useSpotify";
import { milliSecondsToMinutesAndSeconds } from "../../../utils/time";
import { useAppStore } from "../../../store/AppStore";
import albumStyles from "./album.module.css";

interface SongProps {
  song: any;
  order: any;
}

export const AlbumTracks: React.FC<SongProps> = ({ song, order }) => {
  const spotifyApi = useSpotify();
  const { currentTrackId, setCurrentTrackId, isPlaying, setIsPlaying } =
    useAppStore();
  const playSong = () => {
    // console.log(song)
    setCurrentTrackId(song.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.track.uri],
    });
  };

  return (
    <div
      onClick={playSong}
      className={`${albumStyles.searchSongIndividual} group grid grid-cols-2 text-[#b3b3b3] hover:text-white  hover:bg-[#282828] rounded-md mt-1 cursor-pointer`}
    >
      <div className="flex items-center pl-3 py-1 w-full">
        <p>{order + 1}</p>
        <div className="relative">
          <img
            className="h-auto w-10 group-hover:opacity-30"
            src={song?.album?.images[0]?.url}
            alt={song?.album?.name}
          />
          <div className={`${albumStyles.searchPlayButtton} `}>
            <svg height={22} width={22} viewBox="0 0 24 24" fill="white">
              <polygon
                fill="white"
                points="21.57 12 5.98 3 5.98 21 21.57 12"
              ></polygon>
            </svg>
          </div>
        </div>
        <div>
          <p className="w-36 lg:w-[20rem] truncate text-white">
            {song?.name}
          </p>
          <p className="w-40 text-sm">{song?.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto text-sm md:ml-0 pr-10">
        <p className="hidden md:inline w-40 lg:w-96 truncate">
          {song?.name}
        </p>
        <p>{milliSecondsToMinutesAndSeconds(song?.duration_ms)}</p>
      </div>
    </div>
  );
};
