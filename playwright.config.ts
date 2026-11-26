import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "https://portfolio.test",
    browserName: "chromium",
    channel: "chrome",
    trace: "retain-on-failure",
  },
});
