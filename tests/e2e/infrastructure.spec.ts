import { expect, test } from "./fixture";

const path = "/infrastructure/";

test("keyboard selects components and switches between isolated access paths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.reload();
  const topology = page.getByRole("region", { name: "Interactive Topology" });
  const detail = page.getByRole("complementary", {
    name: "Detalhes do componente",
  });
  await expect(detail.getByRole("heading")).toHaveText("HP ProLiant ML30 Gen");
  const docker = topology.getByRole("button", { name: "Docker", exact: true });
  await docker.focus();
  await page.keyboard.press("Enter");
  await expect(docker).toHaveAttribute("aria-pressed", "true");
  await expect(detail.getByRole("heading")).toHaveText("Docker");
  await expect(detail).toContainText("não atribui containers");
  await expect(
    topology.getByRole("button", { name: "Tailscale" }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "docs/screenshots/infrastructure-lab-desktop.png",
    fullPage: true,
  });

  await topology.getByRole("radio", { name: "Visão geral" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    topology.getByRole("radio", { name: "Acesso externo" }),
  ).toBeChecked();
  await expect(detail.getByRole("heading")).toHaveText("Cloudflare Tunnel");
  await expect(detail).toContainText(
    "Usuário externo → Domínio configurado → Cloudflare Tunnel",
  );
  await expect(
    topology.getByRole("button", { name: "Automação de Boletos" }),
  ).toHaveCount(0);
  await page.keyboard.press("ArrowRight");
  await expect(
    topology.getByRole("radio", { name: "Acesso interno" }),
  ).toBeChecked();
  await expect(detail.getByRole("heading")).toHaveText("Rede local (LAN)");
  await expect(detail).toContainText(
    "Rede local (LAN) → IP privado do HP ML30 → Automação de Boletos",
  );
  await expect(
    topology.getByRole("button", { name: "Cloudflare Tunnel" }),
  ).toHaveCount(0);
  await expect(topology.getByRole("button", { name: "Tailscale" })).toHaveCount(
    0,
  );
});

test("topology fits the requested widths and mobile can inspect the private path", async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    for (const label of ["Visão geral", "Acesso externo", "Acesso interno"]) {
      await page.getByRole("radio", { name: label }).check();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const topology = page.getByRole("region", { name: "Interactive Topology" });
  const pathStep = topology
    .locator(".lab-path")
    .getByRole("button", { name: "Automação de Boletos" });
  await pathStep.click();
  await expect(
    page
      .getByRole("complementary", { name: "Detalhes do componente" })
      .getByRole("heading"),
  ).toHaveText("Automação de Boletos");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "docs/screenshots/infrastructure-lab-mobile.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: /Ver estudo de caso CASE-004/ }).click();
  await expect(page).toHaveURL("/incidents/automacao-boletos/");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("default topology, hosted applications and inventory are rendered", async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page).toHaveTitle("Infrastructure Lab | Andrey IT Operations");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://andreyportifolio.netlify.app/infrastructure/",
    );
    await expect(
      page.getByRole("region", { name: "Interactive Topology" }),
    ).toContainText("IP privado do HP ML30");
    await expect(
      page.getByRole("region", { name: "Component Inventory" }),
    ).toContainText("Ubuntu Server 26.04.1 LTS");
    await expect(
      page.getByRole("region", { name: "Hosted Applications" }),
    ).toContainText("Barbearia Studio L");
  });
});

test("hosted scheduling test link is keyboard reachable and bills remains internal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto(path);
  const apps = page.getByRole("region", { name: "Hosted Applications" });
  const link = apps.getByRole("link", {
    name: "Acessar ambiente de testes (abre em nova aba)",
  });
  const bills = apps.getByRole("link", { name: /Ver estudo de caso CASE-004/ });
  await expect(link).toHaveAttribute("href", "https://studiol.andreylab.site/");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(apps.getByText("Em desenvolvimento e testes")).toBeVisible();
  await expect(apps.locator('a[href^="https://"]')).toHaveCount(1);
  await expect(bills).toHaveAttribute("href", "/incidents/automacao-boletos/");
  await bills.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(link).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
