import { expect, test } from "./fixture";

const routes = [
  ["/", "Andrey Vinícius de Souza Silva"],
  ["/incidents/", "Incident Explorer"],
  ["/infrastructure/", "Infrastructure Lab"],
  ["/terminal/", "Interactive Terminal"],
  ["/projects/", "Engineering Projects"],
  ["/profile/", "Professional Profile"],
] as const;

for (const width of [
  320, 375, 390, 700, 768, 959, 1024, 1099, 1100, 1280, 1440, 1920,
]) {
  test(`all six workspace pages fit ${width}px and hydrate without errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    for (const [path, title] of routes) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      const overflow = await page.evaluate(() =>
        Array.from(document.querySelectorAll("body *"))
          .filter((element) => {
            const r = element.getBoundingClientRect();
            return r.width > 1 && (r.right > innerWidth + 1 || r.left < -1);
          })
          .map((element) => ({
            tag: element.tagName,
            class: element.className,
          })),
      );
      expect(overflow, path).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation handles keyboard, focus trap, Escape and breakpoint changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Pular para o conteúdo")).toBeFocused();
  const toggle = page.getByRole("button", {
    name: "Abrir navegação",
    exact: true,
  });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const sidebar = page.getByRole("complementary", {
    name: "Áreas do workspace",
  });
  await expect(
    sidebar.getByRole("link", { name: "Overview", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".workspace-body")).toHaveAttribute("inert", "");
  await page
    .getByRole("button", { name: "Fechar navegação lateral", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await expect(
    sidebar.getByRole("link", { name: "Andrey IT Operations — Overview" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Fechar navegação lateral", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.locator(".workspace-body")).not.toHaveAttribute(
    "inert",
    "",
  );
  await toggle.click();
  await sidebar.getByRole("link", { name: "Engineering Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Engineering Projects",
  );
  await page
    .getByRole("button", { name: "Abrir navegação", exact: true })
    .click();
  await expect(sidebar.locator('[aria-current="page"]')).toHaveText(
    "Engineering Projects",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(sidebar).toBeVisible();
  await expect(page.locator(".workspace-body")).not.toHaveAttribute(
    "inert",
    "",
  );
});

test("all routes support direct access, reload and active navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [path, title] of routes) {
    await page.goto(path);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(
      page
        .getByRole("navigation", { name: "Navegação principal" })
        .locator('[aria-current="page"]'),
    ).toHaveAttribute("href", path);
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }),
    ).toContainText(path === "/" ? "Overview" : title);
  }
});

test("project list and detail work by keyboard and anchors resolve", async ({
  page,
}) => {
  await page.goto("/projects/#project-2");
  const second = page.locator("#project-2");
  await second.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("open", "");
  await expect(
    second.getByRole("link", { name: /Abrir repositório/ }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(second).not.toHaveAttribute("open", "");
  await page.goto("/profile/");
  await page
    .getByRole("navigation", { name: "Seções do perfil" })
    .getByRole("link", { name: "Contato" })
    .click();
  await expect(page).toHaveURL(/#contato$/);
  await expect(
    page.getByRole("heading", { name: "Contato profissional" }),
  ).toBeInViewport();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("essential content, six navigation routes and native project details remain available", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    for (const [path, title] of routes) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(
        page
          .getByRole("navigation", { name: "Navegação principal" })
          .getByRole("link", { name: "Professional Profile" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
    await expect(
      page.getByText("Souza Indústria e Comércio de Peças", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Previsão de conclusão: 2027")).toBeVisible();
    await page.goto("/projects/");
    await page.locator("#project-2 summary").click();
    await expect(
      page
        .locator("#project-2")
        .getByRole("link", { name: /Abrir repositório/ }),
    ).toBeVisible();
  });
});

test("terminal is integrated into workspace navigation and labelled as demonstrative", async ({
  page,
}) => {
  await page.goto("/terminal/");
  await expect(
    page.getByRole("heading", { name: "Interactive Terminal" }),
  ).toBeVisible();
  await expect(
    page.getByText("Ambiente demonstrativo", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Comando do terminal" }),
  ).toBeVisible();
});

test("unknown routes retain 404 content; screenshots cover desktop and mobile", async ({
  page,
}) => {
  expect((await page.goto("/missing-page/"))?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Este caminho não existe.",
  );
  for (const [path, filename] of [
    ["/", "overview"],
    ["/infrastructure/", "infrastructure"],
    ["/terminal/", "terminal"],
    ["/projects/", "projects"],
    ["/profile/", "profile"],
  ]) {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `docs/screenshots/${filename}-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `docs/screenshots/${filename}-mobile.png`,
      fullPage: true,
    });
  }
  await page.goto("/");
  await page
    .getByRole("button", { name: "Abrir navegação", exact: true })
    .click();
  await page.screenshot({ path: "docs/screenshots/navigation-mobile.png" });
});

test("reduced motion and text at 200% work throughout the workspace", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route("https://portfolio.test/zoom-test.css", (route) =>
    route.fulfill({
      contentType: "text/css",
      body: "html { font-size: 200%; }",
    }),
  );
  for (const [path] of routes) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
    await page.addStyleTag({ url: "https://portfolio.test/zoom-test.css" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBeTruthy();
  }
});

test("visible text meets WCAG AA contrast on every page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  for (const [path] of routes) {
    await page.goto(path);
    const failures = await page.evaluate(() => {
      type RGB = [number, number, number];
      const color = (value: string) =>
        value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
      const luminance = (rgb: RGB) =>
        rgb
          .map((value) => {
            const c = value / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce(
            (total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i],
            0,
          );
      const background = (element: Element | null): RGB => {
        if (!element) return [16, 22, 25];
        const rgba = color(getComputedStyle(element).backgroundColor);
        const alpha = rgba[3] ?? 1;
        const underneath =
          alpha < 1 ? background(element.parentElement) : [0, 0, 0];
        return rgba
          .slice(0, 3)
          .map(
            (value, i) => value * alpha + underneath[i] * (1 - alpha),
          ) as RGB;
      };
      return Array.from(document.querySelectorAll("body *")).flatMap(
        (element) => {
          if (
            !Array.from(element.childNodes).some(
              (node) =>
                node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
            )
          )
            return [];
          const rect = element.getBoundingClientRect();
          if (rect.width <= 1 || rect.height <= 1 || !element.checkVisibility())
            return [];
          const style = getComputedStyle(element);
          const foreground = luminance(color(style.color).slice(0, 3) as RGB);
          const bg = luminance(background(element));
          const ratio =
            (Math.max(foreground, bg) + 0.05) /
            (Math.min(foreground, bg) + 0.05);
          const large =
            parseFloat(style.fontSize) >= 24 ||
            (parseFloat(style.fontSize) >= 18.66 &&
              parseInt(style.fontWeight) >= 700);
          return ratio + 0.01 < (large ? 3 : 4.5)
            ? [{ text: element.textContent?.slice(0, 70), ratio }]
            : [];
        },
      );
    });
    expect(failures, path).toEqual([]);
  }
});

test("mobile skip link moves focus below the sticky header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/terminal/");
  const header = page.locator(".workspace-header");
  const heading = page.getByRole("heading", {
    name: "Interactive Terminal",
    exact: true,
  });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("#conteudo")).toBeFocused();
  await expect(page).toHaveURL(/#conteudo$/);
  const headingBox = await heading.boundingBox();
  const headerBox = await header.boundingBox();
  expect(headingBox?.y ?? -1).toBeGreaterThanOrEqual(
    (headerBox?.y ?? 0) + (headerBox?.height ?? 0),
  );
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect.poll(async () => (await header.boundingBox())?.y).toBe(0);
  await expect(
    page.getByRole("button", { name: "Abrir navegação", exact: true }),
  ).toBeInViewport();
});
