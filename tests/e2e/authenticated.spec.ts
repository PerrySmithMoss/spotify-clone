import { expect, test as base } from "@playwright/test";
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

interface SpotifyFixture {
  playRequests: string[][];
  pauseRequests: number;
  failPlayback: boolean;
}

const test = base.extend<{ spotify: SpotifyFixture }>({
  spotify: [
    async ({ page, context }, use) => {
      const spotify: SpotifyFixture = {
        playRequests: [],
        pauseRequests: 0,
        failPlayback: false,
      };
      let isPlaying = false;
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
        const path = url.pathname.replace("/v1", "").replace(/\/$/, "");
        const headers = {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, PUT, OPTIONS",
          "access-control-allow-headers": "authorization, content-type",
        };
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers });
          return;
        }
        if (path === "/me/player/play" || path === "/me/player/pause") {
          if (spotify.failPlayback) {
            await route.fulfill({
              status: 404,
              json: {
                error: { status: 404, message: "No active device found" },
              },
              headers,
            });
            return;
          }
          isPlaying = path.endsWith("/play");
          if (isPlaying)
            spotify.playRequests.push(
              route.request().postDataJSON()?.uris ?? [],
            );
          else spotify.pauseRequests++;
          await route.fulfill({ status: 204, headers });
          return;
        }
        let data: unknown = { items: [] };
        if (path === "/me/playlists") data = { items: [playlist] };
        else if (path === "/me/top/artists") data = { items: [artist] };
        else if (path === "/me/top/tracks") data = { items: [track] };
        else if (path === "/me/player/currently-playing")
          data = { item: track, is_playing: isPlaying };
        else if (path === "/me/player")
          data = {
            item: track,
            is_playing: isPlaying,
            device: { volume_percent: 50 },
          };
        else if (path === "/me/albums") data = { items: [{ album }] };
        else if (path === "/me/following")
          data = { artists: { items: [artist] } };
        else if (path === "/playlists/playlist") data = playlist;
        else if (path === "/albums/album")
          data = { ...album, tracks: { items: [track], total: 1 } };
        else if (path === "/artists/artist") data = artist;
        else if (path === "/artists/artist/albums") data = { items: [album] };
        else if (path === "/artists/artist/top-tracks")
          data = { tracks: [track] };
        else if (path === "/artists/artist/related-artists")
          data = { artists: [artist] };
        else if (path === "/tracks/track") data = track;
        else if (
          path === "/search" &&
          url.searchParams.get("q") === "sparse-results"
        )
          data = {
            tracks: {
              items: [
                null,
                { ...track, album: { ...album, images: [] }, artists: [] },
              ],
            },
            artists: { items: [null, { ...artist, images: [] }] },
            albums: { items: [null, { ...album, images: [], artists: [] }] },
            playlists: {
              items: [null, { ...playlist, images: null, owner: null }],
            },
            shows: {
              items: [
                null,
                {
                  id: "show",
                  name: "Fixture Podcast",
                  images: [],
                  publisher: "Fixture Publisher",
                },
              ],
            },
          };
        else if (
          path === "/search" &&
          url.searchParams.get("q") === "null-only"
        )
          data = { tracks: { items: [null] } };
        else if (
          path === "/search" &&
          url.searchParams.get("q") === "tracks-only"
        )
          data = { tracks: { items: [track] } };
        else if (
          path === "/search" &&
          url.searchParams.get("q") === "no-results"
        )
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
          headers,
        });
      });
      await use(spotify);
    },
    { auto: true },
  ],
});

test("authenticated dashboard, search, library and deep links work with Spotify fixtures", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
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

test("album, artist and playlist tracks send valid playback commands and can pause/resume", async ({
  page,
  spotify,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/album/album", "/artist/artist", "/playlist/playlist"]) {
    await page.goto(path);
    const previousRequests = spotify.playRequests.length;
    await page
      .getByRole("button", { name: "Play Fixture Song", exact: true })
      .first()
      .click();
    await expect
      .poll(() => spotify.playRequests.length)
      .toBe(previousRequests + 1);
    await expect(
      page.getByRole("button", { name: "Pause playback", exact: true }),
    ).toBeVisible();
    expect(spotify.playRequests.at(-1)).toEqual(["spotify:track:track"]);
    await page
      .getByRole("button", { name: "Pause playback", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Resume playback", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Resume playback", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Pause playback", exact: true }),
    ).toBeVisible();
    expect(spotify.playRequests.at(-1)).toEqual([]);
  }
  expect(spotify.pauseRequests).toBe(3);
  expect(spotify.playRequests).toHaveLength(6);
  expect(errors).toEqual([]);
});

test("rejected playback commands show a device error and preserve the playback state", async ({
  page,
  spotify,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/album/album");
  spotify.failPlayback = true;
  await page
    .getByRole("button", { name: "Play Fixture Song", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Open Spotify on a device" }),
  ).toHaveText("Open Spotify on a device and start a song, then try again.");
  await expect(
    page.getByRole("button", { name: "Resume playback", exact: true }),
  ).toBeVisible();
  spotify.failPlayback = false;
  await page
    .getByRole("button", { name: "Play Fixture Song", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause playback", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({ hasText: "Open Spotify on a device" }),
  ).toHaveCount(0);
  spotify.failPlayback = true;
  await page
    .getByRole("button", { name: "Pause playback", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Open Spotify on a device" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pause playback", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("search tolerates unavailable items, missing images and omitted result categories", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/search");
  await page
    .getByRole("textbox", { name: "Search songs" })
    .fill("sparse-results");
  await expect(
    page.getByText("Fixture Podcast", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Fixture Song", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page
      .getByText("Fixture Playlist", { exact: true })
      .filter({ visible: true })
      .last(),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Search songs" }).fill("tracks-only");
  await expect(page.getByText("Fixture Podcast", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Fixture Song", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Search songs" }).fill("null-only");
  await expect(page.getByRole("status")).toHaveText("No results found.");
  expect(errors).toEqual([]);
});
