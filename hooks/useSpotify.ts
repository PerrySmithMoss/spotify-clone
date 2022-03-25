import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { spotifyAPI } from "../lib/spotify";

export function useSpotify() {
  {
    const { data: session } = useSession();

    useEffect(() => {
      if (session) {
        // If access token attempt fails, redirect them to login page
        if (session.error === "RefreshAccessTokenError") {
          signIn();
        }

        spotifyAPI.setAccessToken(session.user.accessToken);
      }
    }, [session]);
    return spotifyAPI;
  }
}
