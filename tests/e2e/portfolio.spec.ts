import { expect, test } from './fixture';

for (const width of [320, 375, 390, 700, 768, 959, 960, 1024, 1440, 1920]) {
  test(`home fits ${width}px without overflow or hydration errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Andrey');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBeTruthy();
    expect(errors).toEqual([]);
  });
}

test('mobile menu supports keyboard, focus cycling, Escape and anchor navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Pular para o conteúdo')).toBeFocused();
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Perfil', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Fechar' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('navigation').getByRole('link', { name: /Currículo PDF/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Experiência', exact: true }).click();
  await expect(page.locator('#experiencia')).toBeFocused();
  await expect(page).toHaveURL(/#experiencia$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('each future module survives direct navigation and reload', async ({ page }) => {
  for (const [path, title] of [['/incidents/', 'Incident Explorer'], ['/infrastructure/', 'Infrastructure Lab'], ['/terminal/', 'Interactive Terminal']]) {
    await page.goto(path);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.getByText('Em desenvolvimento', { exact: true })).toBeVisible();
  }
});

test.describe('without JavaScript', () => {
 test.use({ javaScriptEnabled: false });
 test('professional content remains visible without JavaScript', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Experiência na operação.' })).toBeVisible();
  await expect(page.getByText('Souza Indústria e Comércio de Peças')).toBeVisible();
  await expect(page.getByRole('link', { name: /Ver currículo PDF/ })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Perfil', exact: true })).toBeVisible();
 });
});

test('unknown paths return a genuine 404 and snapshots document the design', async ({ page }) => {
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Este caminho');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});

test('reduced motion disables smooth scrolling and enlarged text fits mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.route('https://portfolio.test/zoom-test.css', route => route.fulfill({ contentType: 'text/css', body: 'html { font-size: 200%; }' }));
  await page.addStyleTag({ url: 'https://portfolio.test/zoom-test.css' });
  const overflow = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(element => { const r = element.getBoundingClientRect(); return r.width > 1 && (r.right > innerWidth + 1 || r.left < -1); }).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 50), width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right })));
  expect(overflow).toEqual([]);
});

test('visible text meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/');
  const failures = await page.evaluate(() => {
    type RGB = [number, number, number];
    const color = (value: string) => value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0];
    const luminance = (rgb: RGB) => rgb.map(value => { const c = value / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((total, value, i) => total + value * [.2126, .7152, .0722][i], 0);
    const background = (element: Element | null): RGB => {
      if (!element) return [16, 22, 25];
      const rgba = color(getComputedStyle(element).backgroundColor);
      const alpha = rgba[3] ?? 1;
      const underneath = alpha < 1 ? background(element.parentElement) : [0, 0, 0];
      return rgba.slice(0, 3).map((value, i) => value * alpha + underneath[i] * (1 - alpha)) as RGB;
    };
    return Array.from(document.querySelectorAll('body *')).flatMap(element => {
      if (!Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) return [];
      const rect = element.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) return [];
      const style = getComputedStyle(element);
      if (style.visibility === 'hidden') return [];
      const foreground = luminance(color(style.color).slice(0, 3) as RGB);
      const bg = luminance(background(element));
      const ratio = (Math.max(foreground, bg) + .05) / (Math.min(foreground, bg) + .05);
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
      return ratio + .01 < (large ? 3 : 4.5) ? [{ text: element.textContent?.slice(0, 70), ratio }] : [];
    });
  });
  expect(failures).toEqual([]);
});
