import { useEffect, useState } from "react";
import { useAppStore } from "../store/AppStore";
import { useSpotify } from "./useSpotify";

export function useSongInfo() {
  const spotifyApi = useSpotify();
  const { currentTrackId } = useAppStore();
  const [songInfo, setSongInfo] =
    useState<SpotifyApi.SingleTrackResponse | null>(null);

  useEffect(() => {
    const accessToken = spotifyApi.getAccessToken();
    if (!currentTrackId || !accessToken) return;
    const controller = new AbortController();
    void fetch(
      `https://api.spotify.com/v1/tracks/${encodeURIComponent(currentTrackId)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Track unavailable");
        const track: SpotifyApi.SingleTrackResponse = await response.json();
        if (!controller.signal.aborted) setSongInfo(track);
      })
      .catch(() => {
        if (!controller.signal.aborted) setSongInfo(null);
      });
    return () => controller.abort();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}
