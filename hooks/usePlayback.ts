import { useCallback } from "react";
import { useAppStore } from "../store/AppStore";
import { useSpotify } from "./useSpotify";

function playbackErrorMessage(error: unknown): string {
  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? error.statusCode
      : undefined;
  if (status === 404)
    return "Open Spotify on a device and start a song, then try again.";
  if (status === 403)
    return "Spotify could not play this item. Check your Premium subscription and playback device.";
  if (status === 401)
    return "Your Spotify session has expired. Sign in again to control playback.";
  return "Spotify playback failed. Please try again.";
}

export function usePlayback() {
  const spotifyApi = useSpotify();
  const {
    setCurrentTrackId,
    setIsPlaying,
    setPlaybackError,
    setPlaybackPending,
  } = useAppStore();

  const runCommand = useCallback(
    async (command: () => Promise<void>) => {
      if (useAppStore.getState().isPlaybackPending) return;
      setPlaybackPending(true);
      setPlaybackError(undefined);
      try {
        await command();
      } catch (error) {
        setPlaybackError(playbackErrorMessage(error));
      } finally {
        setPlaybackPending(false);
      }
    },
    [setPlaybackError, setPlaybackPending],
  );

  const playTrack = useCallback(
    (track: { id: string; uri: string }) =>
      runCommand(async () => {
        await spotifyApi.play({ uris: [track.uri] });
        setCurrentTrackId(track.id);
        setIsPlaying(true);
      }),
    [runCommand, setCurrentTrackId, setIsPlaying, spotifyApi],
  );

  const togglePlayback = useCallback(
    () =>
      runCommand(async () => {
        const { body } = await spotifyApi.getMyCurrentPlaybackState();
        if (body?.is_playing) {
          await spotifyApi.pause();
          setIsPlaying(false);
        } else {
          await spotifyApi.play();
          setIsPlaying(true);
        }
      }),
    [runCommand, setIsPlaying, spotifyApi],
  );

  return { playTrack, togglePlayback };
}
