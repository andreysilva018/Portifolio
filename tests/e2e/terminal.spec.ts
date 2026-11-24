import { expect, test } from './fixture';
import type { Page } from '@playwright/test';

const path = '/terminal/';
const field = (page: Page) => page.getByRole('textbox', { name: 'Comando do terminal' });
const output = (page: Page) => page.getByRole('region', { name: 'Histórico e respostas' });

async function run(page: Page, command: string) {
  await field(page).fill(command);
  await field(page).press('Enter');
}

test('professional commands reuse the portfolio and link to existing pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  await page.reload();
  await page.getByRole('button', { name: 'Ajuda' }).click();
  await expect(output(page)).toContainText('nslookup example.com');
  for (const [command, text] of [
    ['about', 'Suporte N1/N2'], ['skills', 'Service Desk'], ['experience', 'Doctus Tecnologia'],
    ['projects', 'Task Manager Java'], ['lab', 'HP ProLiant ML30 Gen'], ['cases', 'CASE-004'],
  ]) {
    await run(page, command);
    await expect(output(page)).toContainText(text);
  }
  await expect(output(page).getByRole('link', { name: /Task Manager Java/ })).toHaveAttribute('href', '/projects/#project-2');
  await expect(output(page).getByRole('link', { name: /CASE-004/ })).toHaveAttribute('href', '/incidents/automacao-boletos/');
  await expect(output(page).getByRole('link', { name: /topologia e inventário/ })).toHaveAttribute('href', '/infrastructure/');
  await page.getByRole('region', { name: 'Console local' }).screenshot({ path: 'docs/screenshots/terminal-console-desktop.png' });
});

test('all Linux and network responses are local simulations and invalid input stays inert', async ({ page }) => {
  await page.goto(path);
  for (const [command, text] of [
    ['uname -a', 'Linux host-demo'], ['pwd', '/home/visitante/workspace-demo'],
    ['ls', 'README-demo.txt'], ['whoami', 'visitante-demo'], ['df -h', 'demo-fs'],
    ['systemctl status', 'servico-demo.service'], ['docker ps', 'container-demo'],
    ['ip addr', '192.0.2.10/24'], ['ping', 'Nenhuma medição feita'],
    ['ping example.com', 'Destino de exemplo: example.com'], ['nslookup example.com', 'Resposta DNS ilustrativa'],
    ['traceroute 192.0.2.10', '198.51.100.1'], ['nslookup', 'Nome de exemplo: example.com'],
    ['traceroute', 'Saltos fictícios'],
  ]) {
    await run(page, command);
    await expect(output(page).locator('ol > li').last()).toContainText('Resposta simulada');
    await expect(output(page).locator('ol > li').last()).toContainText(text);
  }
  for (const line of ['ping https://example.com', 'nslookup 192.0.2.10', 'traceroute example.com extra', 'docker ps -a', 'ls | whoami']) {
    await run(page, line);
    await expect(output(page).locator('ol > li').last()).toContainText(/fora da demonstração|Argumentos não suportados/);
  }
  await run(page, '<img src=x onerror=alert(1)>');
  await expect(output(page)).toContainText('Comando desconhecido');
  await expect(output(page).locator('img')).toHaveCount(0);
  await expect(output(page)).toContainText('<img src=x onerror=alert(1)>');
});

test('completion, focus, draft history, clear and reset follow keyboard semantics', async ({ page }) => {
  await page.goto(path);
  await field(page).fill('dock');
  await field(page).press('Tab');
  await expect(field(page)).toHaveValue('docker ps');
  await expect(field(page)).toBeFocused();
  await field(page).press('Tab');
  await expect(page.getByRole('button', { name: 'Enviar' })).toBeFocused();
  await field(page).press('Enter');
  await run(page, 'about');
  await field(page).fill('lab');
  await field(page).press('ArrowUp');
  await expect(field(page)).toHaveValue('about');
  await field(page).press('ArrowUp');
  await expect(field(page)).toHaveValue('docker ps');
  await field(page).press('ArrowDown');
  await field(page).press('ArrowDown');
  await expect(field(page)).toHaveValue('lab');
  await run(page, 'clear');
  await expect(output(page)).not.toContainText('container-demo');
  await field(page).press('ArrowUp');
  await expect(field(page)).toHaveValue('clear');
  await field(page).press('ArrowUp');
  await expect(field(page)).toHaveValue('about');
  await run(page, 'reset');
  await expect(output(page)).toContainText('Sessão reiniciada');
  await field(page).press('ArrowUp');
  await expect(field(page)).toHaveValue('');
  await run(page, 'pwd');
  await page.getByRole('button', { name: 'Reiniciar sessão' }).click();
  await expect(output(page)).not.toContainText('/home/visitante');
  await expect(field(page)).toBeFocused();
});

test('mobile controls and long simulated output fit requested viewports', async ({ page }) => {
  await page.goto(path);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await field(page).fill('traceroute example.com');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(output(page)).toContainText('Saltos fictícios');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole('button', { name: 'Reiniciar sessão' }).click();
  await run(page, 'traceroute example.com');
  await page.getByRole('region', { name: 'Console local' }).screenshot({
    path: 'docs/screenshots/terminal-console-mobile.png',
    style: '.workspace-header, .skip-link { visibility: hidden !important; }',
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the terminal description and command reference remain readable', async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(/A sessão interativa requer JavaScript/)).toBeVisible();
    await page.getByText('Referência de comandos', { exact: true }).click();
    await expect(page.getByText('uname -a', { exact: true })).toBeVisible();
    await expect(field(page)).toHaveCount(0);
  });
});
