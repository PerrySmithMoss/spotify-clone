import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken } from "./refresh-token";

const scope = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
].join(" ");

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      authorization: { params: { scope } },
      checks: ["pkce", "state"],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires:
            (account.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
        };
      }
      if (Date.now() < (token.accessTokenExpires ?? 0)) return token;
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? token.username ?? "";
      session.user.username = token.username ?? "";
      session.user.accessToken = token.error ? undefined : token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
