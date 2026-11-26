import { expect, test } from "./fixture";

const path = "/incidents/falha-conectividade-rede-corporativa/";

test("switches topology by keyboard and expands the selected node", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  const topology = page.getByRole("region", { name: "Topologia da rede" });
  const before = topology.getByRole("radio", { name: "Antes" });
  const after = topology.getByRole("radio", { name: "Depois" });
  await expect(before).toBeChecked();
  await expect(
    topology.getByText("Switches administrativos intermediários", {
      exact: true,
    }),
  ).toBeVisible();
  await before.focus();
  await page.keyboard.press("ArrowRight");
  await expect(after).toBeChecked();
  await expect(
    topology.getByText("Switches administrativos intermediários", {
      exact: true,
    }),
  ).toBeHidden();
  const mainSwitch = topology
    .locator(".topology-after summary")
    .filter({ hasText: "Switch principal" });
  await mainSwitch.focus();
  await page.keyboard.press("Enter");
  await expect(
    topology.getByText("Recebe diretamente as conexões administrativas", {
      exact: false,
    }),
  ).toBeVisible();
  await topology.screenshot({ path: "docs/screenshots/case-002-desktop.png" });
});

test.describe("without JavaScript", () => {
  test.use({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("mobile topology and essential case content remain available", async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("article")).toContainText(
      "Conectividade do almoxarifado restabelecida",
    );
    await expect(
      page.getByRole("heading", { name: "Melhoria estrutural" }),
    ).toBeVisible();
    await expect(page.locator(".incident-timeline > li")).toHaveCount(6);
    const topology = page.getByRole("region", { name: "Topologia da rede" });
    await topology
      .getByText("Ponto do almoxarifado", { exact: true })
      .filter({ visible: true })
      .tap();
    await expect(
      topology
        .getByText("A conexão deste ponto foi confirmada", { exact: false })
        .filter({ visible: true }),
    ).toBeVisible();
    await topology.getByRole("radio", { name: "Depois" }).tap();
    await expect(
      topology.getByText("Cabos e pontos rastreados foram identificados", {
        exact: false,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await topology.getByRole("radio", { name: "Antes" }).tap();
    await topology.screenshot({ path: "docs/screenshots/case-002-mobile.png" });
  });
});
