import { expect, test } from './fixture';

const catalogue = '/incidents/';
const corporateNetwork = catalogue + 'falha-conectividade-rede-corporativa/';
const network = catalogue + 'conectividade-de-rede/';
const erp = catalogue + 'inconsistencia-erp/';

test('search normalizes accents and combines filters with an empty state and reset', async ({ page }) => {
  await page.goto(catalogue);
  const search = page.getByRole('searchbox', { name: 'Pesquisar casos' });
  const results = page.locator('.incident-list a');
  await expect(results).toHaveCount(4);
  await expect(results.first()).toHaveAttribute('href', erp);
  await expect(results.nth(1)).toHaveAttribute('href', corporateNetwork);
  await page.getByLabel('Tipo de caso').selectOption('Experiência profissional');
  await page.getByLabel('Categoria', { exact: true }).selectOption('Sistemas ERP / Controle de Estoque');
  await page.getByLabel('Tecnologia', { exact: true }).selectOption('ERP');
  await expect(results).toHaveCount(1);
  await search.fill('rastreabilidade');
  await expect(results).toHaveCount(1);
  await expect(results.first()).toHaveAttribute('href', erp);
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await search.fill('Diagnostico WinBox');
  await expect(results).toHaveCount(1);
  await expect(results.first()).toHaveAttribute('href', corporateNetwork);
  await page.getByLabel('Tecnologia', { exact: true }).selectOption('WinBox');
  await page.getByLabel('Tipo de caso').selectOption('Experiência profissional');
  await expect(results).toHaveCount(1);
  await page.getByLabel('Categoria', { exact: true }).selectOption('Sistemas ERP / Controle de Estoque');
  await expect(page.getByRole('status')).toHaveText('0 casos');
  await expect(page.getByText('Nenhum caso corresponde à pesquisa.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(search).toHaveValue('');
  await expect(results).toHaveCount(4);
});

test('select by keyboard, refresh, share and copy a planned snippet', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (value: string) => sessionStorage.setItem('test-clipboard', value) },
    });
  });
  await page.goto(catalogue);
  const entry = page.locator('.incident-list').getByRole('link', { name: /CASE-002/ });
  await entry.focus();
  expect(await entry.evaluate(link => getComputedStyle(link).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(corporateNetwork);
  await page.reload();
  await expect(page.locator('.incident-list [aria-current="page"]')).toHaveAttribute('href', corporateNetwork);
  await page.getByRole('button', { name: 'Copiar link' }).click();
  expect(await page.evaluate(() => sessionStorage.getItem('test-clipboard'))).toBe('https://portfolio.test' + corporateNetwork);
  await expect(page.getByText('Copiado.', { exact: true })).toHaveCount(1);
  await page.goto(network);
  await page.getByRole('button', { name: /Copiar trecho: Conferir/ }).click();
  expect(await page.evaluate(() => sessionStorage.getItem('test-clipboard'))).toBe('route print -4');
  await expect(page.getByText('Copiado.', { exact: true })).toHaveCount(1);
  await page.goto(erp);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/screenshots/incidents-desktop.png', fullPage: true });
});

test('mobile reads a case as its own view and returns to the catalogue', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(catalogue);
  await page.locator('.incident-list').getByRole('link', { name: /CASE-001/ }).click();
  await expect(page).toHaveURL(erp);
  await expect(page.getByRole('article')).toContainText('Relato anonimizado');
  await expect(page.getByRole('searchbox')).toBeHidden();
  await page.screenshot({ path: 'docs/screenshots/incidents-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'Voltar ao catálogo' }).click();
  await expect(page.getByRole('searchbox')).toBeVisible();
});

test('case pages fit supported widths and have distinct canonical URLs', async ({ page }) => {
  for (const width of [320, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [corporateNetwork, erp]) {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://andreyportifolio.netlify.app' + path);
      await expect(page.getByRole('heading', { name: path === corporateNetwork ? 'Diagnóstico do incidente' : path === erp ? 'Linha do tempo da metodologia' : 'Linha do tempo planejada' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
  const response = await page.goto(catalogue + 'caso-inexistente/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Abrir catálogo de incidentes' })).toBeVisible();
});

test.describe('static case content', () => {
  test.use({ javaScriptEnabled: false });
  test('native links and technical procedures work without JavaScript', async ({ page }) => {
    await page.goto(catalogue);
    await page.locator('.incident-list').getByRole('link', { name: /CASE-001/ }).click();
    await expect(page).toHaveURL(erp);
    const timeline = page.locator('.incident-timeline');
    await expect(timeline.getByRole('heading')).toHaveText([
      'Identificação da divergência',
      'Análise de movimentações',
      'Localização de possíveis gaps',
      'Avaliação de inventário',
      'Treinamento dos responsáveis',
      'Acompanhamento operacional',
    ]);
    await expect(timeline.getByText('Medida avaliada', { exact: true })).toBeVisible();
    await expect(timeline).toContainText('Acompanhava a operação ao longo da semana');
    await expect(page.getByRole('heading', { name: 'Competências aplicadas' })).toBeVisible();
    await expect(page.getByRole('article')).toContainText('O relato não inclui evidências publicadas');
    await expect(page.locator('.incident-detail pre')).toHaveCount(0);
    await expect(page).toHaveTitle(/CASE-001.*divergência/);
  });
});
