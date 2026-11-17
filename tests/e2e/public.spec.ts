import { expect, test } from "@playwright/test";

test("login renders and fits the viewport without exposing server credentials", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/auth/login");
  await expect(
    page.getByRole("button", { name: "Continue with Spotify" }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Login | Spotify Clone");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const session = await page.request.get("/api/auth/session");
  expect(await session.json()).toEqual({});
  expect(errors).toEqual([]);
});

test("all protected pages reject anonymous and malformed credentials", async ({
  request,
}) => {
  for (const route of [
    "/",
    "/search",
    "/album/fixture",
    "/artist/fixture",
    "/playlist/fixture",
    "/podcast/fixture",
    "/collections/tracks",
  ]) {
    const response = await request.get(route, {
      maxRedirects: 0,
      headers: {
        authorization: "Bearer %",
        "x-middleware-subrequest": "proxy:proxy:proxy:proxy:proxy",
      },
    });
    expect(response.status()).toBe(307);
    expect(
      new URL(response.headers().location, "http://localhost:3000").pathname,
    ).toBe("/auth/login");
  }
});

test("public assets and auth endpoints remain available with security headers", async ({
  request,
}) => {
  const login = await request.get("/auth/login");
  expect(login.headers()["x-content-type-options"]).toBe("nosniff");
  expect(login.headers()["x-frame-options"]).toBe("DENY");
  expect((await request.get("/assets/images/logo2.png")).status()).toBe(200);
  expect((await request.get("/api/auth/providers")).status()).toBe(200);
  const result = await request.post("/api/auth/signin/spotify", {
    maxRedirects: 0,
    form: { callbackUrl: "https://attacker.example" },
  });
  expect(result.headers().location ?? "").not.toContain("accounts.spotify.com");
});

test("Spotify authorization starts with state and PKCE without contacting Spotify", async ({
  request,
}) => {
  const csrf = await (await request.get("/api/auth/csrf")).json();
  const response = await request.post("/api/auth/signin/spotify", {
    form: { csrfToken: csrf.csrfToken, callbackUrl: "/", json: "true" },
  });
  const { url } = await response.json();
  const authorization = new URL(url);
  expect(authorization.origin).toBe("https://accounts.spotify.com");
  expect(authorization.searchParams.get("code_challenge_method")).toBe("S256");
  expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
  expect(authorization.searchParams.get("state")).toBeTruthy();
  expect(authorization.searchParams.has("client_secret")).toBe(false);
});
