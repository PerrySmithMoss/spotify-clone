import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL, spotifyAPI } from "../../../lib/spotify";

async function refreshAccessToken(token: any) {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    const { body: refreshedAccessToken } =
      await spotifyAPI.refreshAccessToken();
    // console.log("Refreshed token is: ", refreshedAccessToken);

    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      accessTokenExpires: Date.now() + refreshedAccessToken.expires_in * 1000, // handling expiry time in milliseconds
      // Replace if new refresh token res, else use the old refresh token
      refreshToken: refreshedAccessToken.refresh_token ?? token.refreshToken,
    };
  } catch (err) {
    console.error("Error while refreshing token: ", err);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          user: user,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account?.expires_at! * 1000, // handling expiry time in milliseconds
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as any)) {
        console.log("Existing token is valid");
        return token;
      }

      // Access token has expired, need to refresh it...
      console.log("Access token has expired, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.username = token.username as string;
      session.user.id = (token as any).user.name;
      session.user.name = (token as any).user.name as string;
      session.user.image = (token as any).user.image as string;
      session.user.email = (token as any).user.email as string;

      return session;
    },
  },
});
