import { expect, test } from './fixture';

const catalogues = '/incidents/catalogos-tecnicos/';
const payments = '/incidents/automacao-boletos/';

test('catalogue demo supports keyboard selection, accent-insensitive search and empty results', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(catalogues);
  await expect(page).toHaveTitle(/CASE-003.*catálogos/);
  const demo = page.getByRole('region', { name: 'Demonstração de consulta ao catálogo' });
  const item = demo.getByRole('button', { name: /Suporte em L/ });
  await item.focus();
  await page.keyboard.press('Enter');
  await expect(item).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.getByText('60 × 35 × 4 mm')).toBeVisible();
  const search = demo.getByRole('searchbox');
  await search.fill('cilindrica');
  await expect(demo.getByRole('status')).toHaveText('1 produto encontrado');
  await expect(demo.getByRole('heading', { name: 'Bucha cilíndrica' })).toBeVisible();
  await search.fill('sem resultado');
  await expect(demo.getByRole('status')).toHaveText('0 produtos encontrados');
  await expect(demo.getByText(/Nenhum produto fictício/)).toBeVisible();
  await search.clear();
  await demo.screenshot({ path: 'docs/screenshots/case-003-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await demo.screenshot({ path: 'docs/screenshots/case-003-mobile.png' });
});

test('payments demo exposes all scenarios and the supplied permissions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(payments);
  await expect(page).toHaveTitle(/CASE-004.*boletos/);
  const demo = page.getByRole('region', { name: 'Demonstração do processamento de boletos' });
  const counts = demo.locator('dd');
  await expect(counts).toHaveText(['3', '3', '0', '0']);
  const select = demo.getByRole('combobox');
  await select.focus();
  await page.keyboard.press('ArrowDown');
  await expect(counts).toHaveText(['3', '1', '2', '0']);
  await page.keyboard.press('ArrowDown');
  await expect(counts).toHaveText(['3', '1', '0', '2']);
  const table = demo.getByRole('table', { name: 'Matriz de permissões por perfil' });
  await expect(table.getByRole('row', { name: /^Importar/ }).getByRole('cell')).toHaveText(['Sim', 'Não', 'Sim']);
  await expect(table.getByRole('row', { name: /^Auditoria/ }).getByRole('cell')).toHaveText(['Não', 'Não', 'Sim']);
  await demo.screenshot({ path: 'docs/screenshots/case-004-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await demo.screenshot({ path: 'docs/screenshots/case-004-desktop.png' });
});

test('new cases have public links and fit the supported widths', async ({ page }) => {
  await page.goto('/incidents/');
  await page.getByLabel('Categoria', { exact: true }).selectOption('Automação / Python');
  await expect(page.locator('.incident-list a')).toHaveCount(2);
  for (const path of [catalogues, payments]) {
    await page.locator('.incident-list a[href="' + path + '"]').click();
    await expect(page).toHaveURL(path);
    for (const width of [320, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.goBack();
  }
});
