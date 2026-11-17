import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import {
  ArrowUturnLeftIcon,
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSongInfo } from "../../hooks/useSongInfo";
import { usePlayback } from "../../hooks/usePlayback";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { debounce } from "../../utils/debounce";
import playerStyles from "./player.module.css";
interface PlayerProps {}

export const Player: React.FC<PlayerProps> = ({}) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [volume, setVolume] = useState(50);
  const {
    currentTrackId,
    setCurrentTrackId,
    isPlaying,
    setIsPlaying,
    playbackError,
    isPlaybackPending,
  } = useAppStore();
  const songInfo = useSongInfo();
  const { togglePlayback } = usePlayback();

  useEffect(() => {
    if (!session?.user.accessToken || currentTrackId) return;
    let active = true;
    void Promise.all([
      spotifyApi.getMyCurrentPlayingTrack(),
      spotifyApi.getMyCurrentPlaybackState(),
    ])
      .then(([track, playback]) => {
        if (!active) return;
        if (track.body?.item?.id) setCurrentTrackId(track.body.item.id);
        setIsPlaying(playback.body?.is_playing ?? false);
      })
      .catch(() => {
        /* No active Spotify device is a normal playback state. */
      });
    return () => {
      active = false;
    };
  }, [
    currentTrackId,
    spotifyApi,
    session?.user.accessToken,
    setCurrentTrackId,
    setIsPlaying,
  ]);

  const debouncedAdjustVolume = useMemo(
    () =>
      debounce((value: number) => {
        if (spotifyApi.getAccessToken()) {
          void spotifyApi.setVolume(value).catch(() => {
            /* Playback can be unavailable. */
          });
        }
      }, 300),
    [spotifyApi],
  );

  useEffect(
    () => () => debouncedAdjustVolume.cancel(),
    [debouncedAdjustVolume],
  );

  const adjustVolume = (value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    setVolume(clamped);
    debouncedAdjustVolume(clamped);
  };

  return (
    <div
      className={`relative h-20 bg-linear-to-b ${playerStyles.player} text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8`}
    >
      {playbackError && (
        <p
          role="alert"
          className="absolute bottom-full inset-x-0 bg-[#282828] px-4 py-3 text-sm text-white"
        >
          {playbackError}
        </p>
      )}
      <div className="flex items-center space-x-4">
        <Image
          width={300}
          height={300}
          sizes="(max-width: 768px) 50vw, 240px"
          className="hidden md:inline h-12 w-12"
          src={
            songInfo?.album?.images?.[0].url || "/assets/images/placeholder.svg"
          }
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
        <ArrowsRightLeftIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <BackwardIcon className="w-7 h-7 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <button
          type="button"
          aria-label={isPlaying ? "Pause playback" : "Resume playback"}
          disabled={isPlaybackPending}
          onClick={() => void togglePlayback()}
          className="disabled:opacity-50"
        >
          {isPlaying ? (
            <PauseIcon className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100 ease-out text-[#18D860]" />
          ) : (
            <PlayIcon className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
          )}
        </button>
        <ForwardIcon className="w-7 h-7 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
        <ArrowUturnLeftIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5">
        <SpeakerWaveIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => adjustVolume(volume - 10)}
        />
        <input
          type="range"
          aria-label="Volume"
          value={volume}
          onChange={(e) => adjustVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="w-14 md:w-36 "
        />
      </div>
    </div>
  );
};
