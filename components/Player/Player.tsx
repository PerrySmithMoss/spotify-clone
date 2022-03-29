import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { VolumeUpIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useSongInfo } from "../../hooks/useSongInfo";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { debounce } from "../../utils/debounce";
import playerStyles from "./player.module.css"
interface PlayerProps {}

export const Player: React.FC<PlayerProps> = ({}) => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [volume, setVolume] = useState(50);
  const { currentTrackId, setCurrentTrackId, isPlaying, setIsPlaying } =
    useAppStore();
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id as string);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const debouncedAdjustVolume: (volume: number) => void = useCallback(
    debounce((volume: number) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 300),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);


  return (
    <div className={`h-20 bg-gradient-to-b ${playerStyles.player} text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8`}>
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-12 w-12"
          src={songInfo?.album?.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-sm text-gray-500">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-5">
        <SwitchHorizontalIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <RewindIcon className="w-7 h-7 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        {isPlaying ? (
          <PauseIcon
            className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100 ease-out text-[#18D860]"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={handlePlayPause}
          />
        )}
        <FastForwardIcon className="w-7 h-7 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <ReplyIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5">
        <VolumeDownIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="w-14 md:w-36 "
        />
      </div>
    </div>
  );
};
