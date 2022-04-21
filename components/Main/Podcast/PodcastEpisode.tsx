import React from "react";
import { useSpotify } from "../../../hooks/useSpotify";
import { useAppStore } from "../../../store/AppStore";
import {
  convertMsToHM,
  milliSecondsToHoursMinutesAndSeconds,
  milliSecondsToMinutesAndSeconds,
} from "../../../utils/time";
import podcastStyles from "./podcast.module.css";

interface PodcastEpisodeProps {
  episode: any;
}

export const PodcastEpisode: React.FC<PodcastEpisodeProps> = ({ episode }) => {
  const spotifyApi = useSpotify();
  const { currentTrackId, setCurrentTrackId, isPlaying, setIsPlaying } =
    useAppStore();
  const playEpisode = () => {
    // console.log(song)
    setCurrentTrackId(episode.id);
    setIsPlaying(true);
    spotifyApi
      .play({
        uris: [episode.uri],
      })
      .catch((err) => {
        console.error(
          "Something went wrong when trying to play song/episode: ",
          err
        );
      });
  };
//   console.log(episode);
  return (
    <>
      <hr className={`${podcastStyles.border} mt-4 mb-4`} />
      <div
        onClick={playEpisode}
        className={`text-[#b3b3b3] hover:text-white  hover:bg-gray-600 rounded-md mt-1 cursor-pointer`}
      >
        <div className="flex items-center space-x-4 p-1 w-full">
          <img
            className="h-[112px] w-[112px] group-hover:opacity-30"
            src={episode?.images[0]?.url}
            alt={episode?.name}
          />
          <div>
            <p className="truncate text-white">{episode?.name}</p>
            <p className="text-sm ">{episode?.description}</p>
            <div className="flex content-center items-center mt-4">
              {episode.explicit === true && (
                <div
                  className={`items-center pr-2 inline-flex gap-2 justify-center`}
                >
                  <span
                    aria-label="Explicit"
                    className={`${podcastStyles.explict}`}
                    title="Explicit"
                  >
                    E
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm tracking-widest">
                  {convertMsToHM(episode?.duration_ms)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
