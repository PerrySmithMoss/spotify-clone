import type { JWT } from "next-auth/jwt";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken)
    return { ...token, error: "RefreshAccessTokenError" };

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Token refresh failed");
    const refreshed = await response.json();
    if (
      typeof refreshed.access_token !== "string" ||
      !refreshed.access_token ||
      typeof refreshed.expires_in !== "number" ||
      !Number.isFinite(refreshed.expires_in) ||
      refreshed.expires_in <= 0
    ) {
      throw new Error("Invalid token response");
    }
    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken:
        typeof refreshed.refresh_token === "string" && refreshed.refresh_token
          ? refreshed.refresh_token
          : token.refreshToken,
      error: undefined,
    };
  } catch {
    // Never log the response or token: either can contain credentials.
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
