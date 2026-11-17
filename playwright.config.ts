import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "yarn start",
    url: "http://localhost:3000/auth/login",
    reuseExistingServer: !process.env.CI,
    env: {
      NEXTAUTH_URL: "http://localhost:3000",
      NEXTAUTH_SECRET: "e2e-only-secret-32-characters-minimum",
    },
    timeout: 60_000,
  },
});
