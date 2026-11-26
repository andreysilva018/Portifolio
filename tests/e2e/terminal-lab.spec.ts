import { expect, test } from './fixture';

test('investigates every scenario, rejects premature and incorrect diagnoses, and resets locally', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/terminal/');
  const field = page.getByRole('textbox', { name: 'Comando do terminal' });
  const output = page.getByRole('region', { name: 'Histórico e respostas' });
  const last = output.locator('ol > li').last();

  async function run(command: string, expected: string) {
    await field.fill(command);
    await field.press('Enter');
    await expect(last).toContainText(expected);
  }

  await run('scenario help', 'scenario start <id>');
  await run('scenario list', 'remote');
  await field.fill('scenario start ext');
  await field.press('Tab');
  await expect(field).toHaveValue('scenario start external');
  await field.press('Enter');

  for (const scenario of [
    { id: 'external', checks: ['nslookup example.com', 'scenario check tunnel', 'scenario check route', 'systemctl status'], wrong: 'dns', right: 'origin' },
    { id: 'lan', checks: ['ping 192.0.2.10', 'systemctl status'], wrong: 'network', right: 'service' },
    { id: 'remote', checks: ['ping 192.0.2.10', 'systemctl status', 'scenario check access'], wrong: 'ssh', right: 'access' },
  ]) {
    await run('scenario start ' + scenario.id, 'Digite scenario status');
    await run('scenario status', 'Evidências coletadas: nenhuma');
    await run('scenario diagnose', 'scenario diagnose ' + scenario.right);
    await run('scenario diagnose ' + scenario.right, 'Evidências insuficientes');
    await expect(page.locator('.terminal-lab-state')).toContainText('Investigação em andamento');
    for (const command of scenario.checks) await run(command, 'Evidência simulada');
    const observation = await last.locator('pre').innerText();
    await run(scenario.checks[scenario.checks.length - 1], observation);
    await run('scenario status', 'Evidências coletadas: ' + scenario.checks.join(', '));
    await run('scenario diagnose ' + scenario.wrong, 'Revise a hipótese');
    await expect(page.locator('.terminal-lab-state')).toContainText('Investigação em andamento');
    await run('scenario diagnose ' + scenario.right, 'Diagnóstico confirmado na simulação');
    await expect(page.locator('.terminal-lab-state')).toContainText('Diagnóstico confirmado');
    await run('scenario status', 'Estado: diagnóstico confirmado');
    await expect(output.getByText(/Estado: em investigação/).first()).toBeAttached();
    if (scenario.id === 'remote') {
      const console = page.getByRole('region', { name: 'Console local' });
      await console.screenshot({ path: 'docs/screenshots/terminal-lab-desktop.png' });
      await page.setViewportSize({ width: 375, height: 850 });
      await console.screenshot({ path: 'docs/screenshots/terminal-lab-mobile.png', style: '.workspace-header, .skip-link { visibility: hidden !important; }' });
    }
    await run('scenario reset', 'Nenhuma evidência coletada');
    await run('scenario status', 'Evidências coletadas: nenhuma');
  }
  await run('scenario check arbitrary', 'Comando de investigação não disponível');
  await run('scenario exit', 'voltou ao modo demonstrativo padrão');
  await run('systemctl status', 'servico-demo.service');
  await field.press('ArrowUp');
  await expect(field).toHaveValue('systemctl status');
});

test('scenario picker remains usable at the requested widths', async ({ page }) => {
  await page.goto('/terminal/');
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.getByLabel('Cenário de investigação').selectOption('lan');
    await page.getByRole('button', { name: 'Iniciar cenário' }).click();
    await expect(page.getByText(/Cenário ativo: Aplicação interna pela LAN/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('selection follows the session and suggestions only fill the prompt', async ({ page }) => {
  await page.goto('/terminal/');
  const picker = page.getByLabel('Cenário de investigação');
  const input = page.getByRole('textbox', { name: 'Comando do terminal' });
  const status = page.locator('.terminal-lab-state');
  const history = page.getByRole('region', { name: 'Histórico e respostas' });
  await expect(status).toContainText('Nenhum cenário ativo');
  await picker.selectOption('lan');
  await page.getByRole('button', { name: 'Iniciar cenário' }).click();
  await expect(status).toContainText('Aplicação interna pela LAN');
  await picker.selectOption('external');
  await expect(status).toContainText('Aplicação interna pela LAN');
  await expect(page.locator('#terminal-selected-scenario')).toContainText('Seleção pendente: Acesso externo por domínio');

  const count = await history.locator('ol > li').count();
  await page.getByRole('button', { name: 'Preencher ip addr' }).press('Enter');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('ip addr');
  await expect(history.locator('ol > li')).toHaveCount(count);
  await expect(page.getByRole('button', { name: 'Preencher scenario check tunnel' })).toHaveCount(0);

  await input.fill('  SCENARIO   START remote');
  await input.press('Enter');
  await expect(picker).toHaveValue('remote');
  await expect(status).toContainText('Administração remota conceitual');
  await picker.selectOption('external');
  await input.fill('scenario reset');
  await input.press('Enter');
  await expect(picker).toHaveValue('remote');
  await expect(status).toContainText('Investigação em andamento');
  await input.fill('scenario exit');
  await input.press('Enter');
  await expect(status).toContainText('Nenhum cenário ativo');
  await expect(page.getByRole('button', { name: 'Preencher scenario list' })).toBeVisible();
  await expect(history).toContainText('Aplicação interna pela LAN');
});
