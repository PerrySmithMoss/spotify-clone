import { useEffect, useState } from "react";
import { useAppStore } from "../store/AppStore";
import { useSpotify } from "./useSpotify";

export function useSongInfo() {
  const spotifyApi = useSpotify();
  const { currentTrackId, setCurrentTrackId } = useAppStore();
  const [songInfo, setSongInfo] = useState<null | any>(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        const res = await trackInfo.json();
        setSongInfo(res);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}
