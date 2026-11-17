import { encode } from "next-auth/jwt";
import { NextRequest } from "next/server";
import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { authOptions } from "../lib/auth";
import { refreshAccessToken } from "../lib/refresh-token";
import { proxy } from "../proxy";

afterEach(() => mock.restoreAll());

test("refresh preserves identity and rotates credentials only in the server token", async () => {
  const fetchMock = mock.method(
    globalThis,
    "fetch",
    async (_url: string | URL | Request, init?: RequestInit) => {
      assert.equal(init?.method, "POST");
      assert.equal(init?.cache, "no-store");
      assert.equal(
        new URLSearchParams(String(init?.body)).get("refresh_token"),
        "old-refresh",
      );
      return Response.json({
        access_token: "new-access",
        refresh_token: "new-refresh",
        expires_in: 3600,
      });
    },
  );
  const before = Date.now();
  const result = await refreshAccessToken({
    sub: "user",
    refreshToken: "old-refresh",
  });
  assert.equal(result.sub, "user");
  assert.equal(result.accessToken, "new-access");
  assert.equal(result.refreshToken, "new-refresh");
  assert.ok(result.accessTokenExpires! >= before + 3_600_000);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("refresh retains the previous refresh token when Spotify omits a replacement", async () => {
  mock.method(globalThis, "fetch", async () =>
    Response.json({ access_token: "access", expires_in: 3600 }),
  );
  assert.equal(
    (await refreshAccessToken({ refreshToken: "retained" })).refreshToken,
    "retained",
  );
});

test("failed, timed out, and malformed refresh responses require reauthentication", async () => {
  for (const response of [
    async () => new Response("Unauthorized", { status: 401 }),
    async () => Response.json({ access_token: "bad", expires_in: "3600" }),
    async () => Response.json({ access_token: "bad", expires_in: -1 }),
    async () => {
      throw new DOMException("timeout", "TimeoutError");
    },
  ]) {
    mock.method(globalThis, "fetch", response);
    assert.equal(
      (await refreshAccessToken({ refreshToken: "private" })).error,
      "RefreshAccessTokenError",
    );
    mock.restoreAll();
  }
});

test("missing refresh tokens do not make a network request", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => {
    throw new Error("unexpected fetch");
  });
  assert.equal((await refreshAccessToken({})).error, "RefreshAccessTokenError");
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("browser sessions exclude refresh tokens and withhold expired access tokens", async () => {
  const callback = authOptions.callbacks?.session;
  assert.ok(callback);
  for (const error of [undefined, "RefreshAccessTokenError"] as const) {
    const result = await callback({
      session: {
        user: { id: "", username: "", name: "Display name" },
        expires: "2099-01-01",
      },
      token: {
        sub: "stable-id",
        username: "spotify-id",
        accessToken: "short-lived",
        refreshToken: "private-refresh",
        error,
      },
      user: {
        id: "stable-id",
        email: "fixture@example.test",
        emailVerified: null,
      },
      newSession: undefined,
      trigger: "update",
    });
    assert.ok(result.user);
    assert.equal(Object.hasOwn(result.user, "refreshToken"), false);
    assert.equal(JSON.stringify(result).includes("private-refresh"), false);
    assert.equal(
      "accessToken" in result.user ? result.user.accessToken : undefined,
      error ? undefined : "short-lived",
    );
  }
});

test("protected routes reject forged tokens, malformed authorization, and failed refreshes", async () => {
  process.env.NEXTAUTH_SECRET =
    "test-only-auth-secret-with-at-least-32-characters";
  process.env.NEXTAUTH_URL = "http://localhost:3000";
  const invalid: Record<string, string>[] = [
    {},
    { authorization: "Bearer %" },
    { cookie: "next-auth.session-token=forged.token.value" },
    {
      cookie: `next-auth.session-token=${await encode({ secret: process.env.NEXTAUTH_SECRET, token: { error: "RefreshAccessTokenError" } })}`,
    },
  ];
  for (const headers of invalid) {
    const response = await proxy(
      new NextRequest("http://localhost:3000/search", { headers }),
    );
    assert.equal(response.status, 307);
    assert.equal(
      new URL(response.headers.get("location")!).pathname,
      "/auth/login",
    );
  }
  const valid = await encode({
    secret: process.env.NEXTAUTH_SECRET,
    token: { sub: "user" },
  });
  const response = await proxy(
    new NextRequest("http://localhost:3000/search", {
      headers: { cookie: `next-auth.session-token=${valid}` },
    }),
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
});
