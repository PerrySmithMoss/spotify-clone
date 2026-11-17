This is a redesign of the Spotify web app using Next.js, React, NextAuth, and the Spotify Web API.

## Local development

Use Node **v26.13.0** from `.nvmrc` and Yarn **1.22.22**. The `26.x` engine range allows Vercel's managed Node 26 patch releases.

```bash
nvm install
nvm use
npm install --global yarn@1.22.22
yarn install --frozen-lockfile
cp .env.example .env.local
```

Set these values in `.env.local`:

| Variable                | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | Spotify application client ID                                             |
| `SPOTIFY_CLIENT_SECRET` | Server-only Spotify client secret                                         |
| `NEXTAUTH_SECRET`       | Session encryption secret; generate with `openssl rand -base64 32`        |
| `NEXTAUTH_URL`          | `http://127.0.0.1:3000` locally; the canonical HTTPS origin in production |

Register `http://127.0.0.1:3000/api/auth/callback/spotify` in your Spotify developer application's redirect URIs. Spotify requires a loopback IP address rather than `localhost` for local OAuth callbacks.

```bash
yarn dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). There is no database, Redis, or Docker Compose service to start.

Never commit `.env.local`. Spotify secrets and refresh tokens remain on the server; the browser receives a short-lived access token for Spotify API requests. Production also needs `https://YOUR_DOMAIN/api/auth/callback/spotify` registered with Spotify. Rotate any client secret that was exposed by an earlier deployment.

## Validation

```bash
yarn verify             # ESLint, strict type checks, unit tests, production build
yarn playwright install chromium
yarn test:e2e           # Desktop and mobile browser regression tests
yarn audit              # All dependency severities, including development dependencies
```

Tests cover login rendering, protected routes, malformed credentials, token refresh failures, credential isolation, and debounced-control cleanup. Browser fixtures do not require a real Spotify account; live OAuth consent and playback require your account and an active Spotify device.

The TypeScript 7 compiler is installed alongside the TypeScript 6 compatibility API using the official alias approach, so Next.js and ESLint can still use the compiler API.

GitHub Actions runs these checks and CodeQL's security and quality queries. Dependabot groups dependency updates into weekly pull requests.
