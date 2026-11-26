import { expect, test } from "./fixture";

const route = "/infrastructure/";

test("walks all three connectivity paths and exposes each step by keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await page.reload();
  const explorer = page.getByRole("region", { name: "Connectivity Explorer" });
  const picker = explorer.getByRole("combobox");
  const detail = explorer.locator("#connectivity-detail");
  await expect(detail.getByRole("heading")).toHaveText("Usuário externo");
  const tunnel = explorer.getByRole("button", { name: "Túnel cloudflared" });
  await tunnel.focus();
  await page.keyboard.press("Enter");
  await expect(tunnel).toHaveAttribute("aria-pressed", "true");
  await expect(detail).toContainText(
    "aplicação disponível são verificações distintas",
  );
  await expect(detail).toContainText("Verificação recomendada");
  await explorer.screenshot({
    path: "docs/screenshots/connectivity-desktop.png",
  });

  await picker.focus();
  await page.keyboard.press("ArrowDown");
  await expect(picker).toHaveValue("internal");
  await expect(detail.getByRole("heading")).toHaveText("Usuário interno");
  await explorer.getByRole("button", { name: "IP privado do HP ML30" }).click();
  await expect(detail).toContainText(
    "host acessível pode ter uma aplicação indisponível",
  );
  await picker.selectOption("remote");
  await expect(explorer).toContainText(
    "Fluxo conceitual de administração remota",
  );
  await explorer.getByRole("button", { name: "OpenSSH" }).click();
  await expect(detail).toContainText("combinação exata não foi confirmada");
});

test("scenarios require consistent evidence and reset independently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(route);
  const simulator = page.getByRole("region", {
    name: "Troubleshooting Simulator",
  });
  const picker = simulator.getByRole("combobox");
  const log = simulator.getByRole("log");
  const conclude = simulator.getByRole("button", {
    name: "Consultar diagnóstico",
  });
  const cases = [
    {
      id: "public",
      first: "Conectividade do túnel",
      second: "Disponibilidade do serviço de origem",
      conclusion: "Serviço de origem indisponível neste cenário.",
    },
    {
      id: "lan",
      first: "Acesso ao IP privado do servidor",
      second: "Serviço da aplicação",
      conclusion: "Aplicação interna inativa neste cenário.",
    },
    {
      id: "admin",
      first: "Estado da conexão privada",
      second: "Disponibilidade do serviço SSH",
      conclusion: "Serviço SSH indisponível neste cenário.",
    },
  ];

  for (const item of cases) {
    await picker.selectOption(item.id);
    await expect(log).toContainText("Escolha uma verificação");
    await conclude.click();
    await expect(simulator).toContainText(
      "Para concluir, compare as observações",
    );
    const first = simulator.getByRole("button", {
      name: item.first,
      exact: true,
    });
    await first.focus();
    await page.keyboard.press("Enter");
    await first.click();
    await expect(log.getByRole("listitem")).toHaveCount(1);
    await conclude.click();
    await expect(
      simulator.getByRole("heading", { name: item.conclusion }),
    ).toHaveCount(0);
    await simulator
      .getByRole("button", { name: item.second, exact: true })
      .click();
    await conclude.click();
    await expect(
      simulator.getByRole("heading", { name: item.conclusion }),
    ).toBeVisible();
    if (item.id === "admin")
      await simulator.screenshot({
        path: "docs/screenshots/troubleshooting-mobile.png",
        style:
          ".workspace-header, .skip-link { visibility: hidden !important; }",
      });
  }

  await simulator.getByRole("button", { name: "Reiniciar simulação" }).click();
  await expect(picker).toHaveValue("admin");
  await expect(log).toContainText("Escolha uma verificação");
  await expect(simulator.getByRole("heading", { level: 4 })).toHaveCount(0);
});

test("all path and scenario selections fit the required viewports", async ({
  page,
}) => {
  await page.goto(route);
  const explorer = page.getByRole("region", { name: "Connectivity Explorer" });
  const simulator = page.getByRole("region", {
    name: "Troubleshooting Simulator",
  });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    for (const [path, scenario] of [
      ["external", "public"],
      ["internal", "lan"],
      ["remote", "admin"],
    ]) {
      await explorer.getByRole("combobox").selectOption(path);
      await simulator.getByRole("combobox").selectOption(scenario);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("essential paths and educational conclusions remain readable", async ({
    page,
  }) => {
    await page.goto(route);
    const explorer = page.getByRole("region", {
      name: "Connectivity Explorer",
    });
    await explorer
      .getByText("Remote Administration — Tailscale / SSH", { exact: true })
      .filter({ visible: true })
      .click();
    await expect(
      explorer.getByText(/A combinação exata não foi confirmada/),
    ).toBeVisible();
    const simulator = page.getByRole("region", {
      name: "Troubleshooting Simulator",
    });
    await simulator
      .getByText("Aplicação interna indisponível", { exact: true })
      .filter({ visible: true })
      .click();
    await expect(
      simulator.getByText(/Aplicação interna inativa neste cenário/),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Acessar ambiente de testes/ }),
    ).toHaveAttribute("href", "https://studiol.andreylab.site/");
  });
});
