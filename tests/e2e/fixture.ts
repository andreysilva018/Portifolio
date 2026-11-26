import { test as base, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("dist");
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// Serve the real build through Playwright's request interception. This keeps
// browser tests deterministic and works in environments that prohibit sockets.
export const test = base.extend({
  page: async ({ page }, use) => {
    const config = await readFile("netlify.toml", "utf8");
    const csp = config.match(/Content-Security-Policy = "([^"]+)"/)?.[1];
    await page.context().route("https://portfolio.test/**", async (route) => {
      const path = decodeURIComponent(new URL(route.request().url()).pathname);
      const file = resolve(
        root,
        `.${path}`,
        ...(path.endsWith("/") ? ["index.html"] : []),
      );
      if (!file.startsWith(root + sep)) {
        await route.abort();
        return;
      }
      try {
        const body = await readFile(file);
        await route.fulfill({
          status: 200,
          contentType: types[extname(file)] ?? "application/octet-stream",
          headers: csp ? { "Content-Security-Policy": csp } : {},
          body,
        });
      } catch {
        await route.fulfill({
          status: 404,
          contentType: "text/html",
          body: await readFile(resolve(root, "404.html")),
        });
      }
    });
    await use(page);
  },
});
export { expect };
