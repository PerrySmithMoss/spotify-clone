import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { createSpotifyClient } from "../lib/spotify";

export function useSpotify() {
  const { data: session } = useSession();
  const accessToken = session?.user.accessToken;
  const error = session?.error;
  const spotifyAPI = useMemo(() => {
    const client = createSpotifyClient();
    if (accessToken && !error) client.setAccessToken(accessToken);
    return client;
  }, [accessToken, error]);

  useEffect(() => {
    if (error === "RefreshAccessTokenError") void signIn("spotify");
  }, [error]);

  return spotifyAPI;
}
