import { expect, test } from "@playwright/test";
import { encode } from "next-auth/jwt";

const image = {
  url: "/assets/images/placeholder.svg",
  width: 300,
  height: 300,
};
const artist = {
  id: "artist",
  name: "Fixture Artist",
  images: [image],
  genres: ["pop"],
  followers: { total: 100 },
  popularity: 50,
};
const album = {
  id: "album",
  name: "Fixture Album",
  images: [image],
  artists: [artist],
  release_date: "2026-01-01",
  copyrights: [],
  total_tracks: 1,
};
const track = {
  id: "track",
  name: "Fixture Song",
  uri: "spotify:track:track",
  duration_ms: 180000,
  artists: [artist],
  album,
  track_number: 1,
  explicit: false,
};
const playlist = {
  id: "playlist",
  name: "Fixture Playlist",
  images: [image],
  owner: { display_name: "Fixture User" },
  description: "Fixture playlist",
  tracks: { items: [{ track, added_at: "2026-01-01T00:00:00Z" }], total: 1 },
  followers: { total: 1 },
};

test("authenticated dashboard, search, library and deep links work with Spotify fixtures", async ({
  page,
  context,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const token = await encode({
    secret: "e2e-only-secret-32-characters-minimum",
    token: {
      sub: "fixture-user",
      name: "Fixture User",
      picture: image.url,
      username: "fixture-user",
      accessToken: "fixture-access",
      refreshToken: "fixture-private-refresh",
      accessTokenExpires: Date.now() + 3_600_000,
    },
  });
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.route("https://api.spotify.com/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace("/v1", "");
    let data: unknown = { items: [] };
    if (path === "/me/playlists") data = { items: [playlist] };
    else if (path === "/me/top/artists") data = { items: [artist] };
    else if (path === "/me/top/tracks") data = { items: [track] };
    else if (path === "/me/player/currently-playing")
      data = { item: track, is_playing: false };
    else if (path === "/me/player")
      data = { item: track, is_playing: false, device: { volume_percent: 50 } };
    else if (path === "/me/albums") data = { items: [{ album }] };
    else if (path === "/me/following") data = { artists: { items: [artist] } };
    else if (path === "/playlists/playlist") data = playlist;
    else if (path === "/albums/album")
      data = { ...album, tracks: { items: [track], total: 1 } };
    else if (path === "/artists/artist") data = artist;
    else if (path === "/artists/artist/albums") data = { items: [album] };
    else if (path === "/artists/artist/top-tracks") data = { tracks: [track] };
    else if (path === "/artists/artist/related-artists")
      data = { artists: [artist] };
    else if (path === "/tracks/track") data = track;
    else if (path === "/search" && url.searchParams.get("q") === "no-results")
      data = {
        tracks: { items: [] },
        artists: { items: [] },
        albums: { items: [] },
        playlists: { items: [] },
        shows: { items: [] },
      };
    else if (path === "/search")
      data = {
        tracks: { items: [track] },
        artists: { items: [artist] },
        albums: { items: [album] },
        playlists: { items: [playlist] },
        shows: { items: [] },
      };
    await route.fulfill({
      json: data,
      headers: { "access-control-allow-origin": "*" },
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Fixture User" }),
  ).toBeVisible();
  await expect(
    page.getByText("Fixture Playlist").filter({ visible: true }).first(),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("dashboard.png"),
    fullPage: true,
  });
  const session = await (await page.request.get("/api/auth/session")).text();
  expect(session).not.toContain("fixture-private-refresh");

  if (testInfo.project.name === "mobile") await page.goto("/search");
  else await page.getByRole("link", { name: "Search", exact: true }).click();
  await page.getByRole("textbox", { name: "Search songs" }).fill("fixture");
  await expect(page.getByText("Fixture Artist").first()).toBeVisible();
  await page.getByRole("textbox", { name: "Search songs" }).fill("no-results");
  await expect(page.getByRole("status")).toHaveText("No results found.");

  await page.goto("/album/album");
  await expect(
    page.getByText("Fixture Album", { exact: true }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Fixture Album", { exact: true }).first(),
  ).toBeVisible();
  await page.goto("/playlist/playlist");
  await expect(
    page
      .getByText("Fixture Playlist", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await page.goto("/collections/artists");
  await expect(
    page.getByText("Fixture Artist", { exact: true }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
