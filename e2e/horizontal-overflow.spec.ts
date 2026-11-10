import { expect, test } from '@playwright/test';

const routes = ['', 'a-propos', 'equipe', 'chevaux', 'bienfaits', 'accompagnements',
  'experiences', 'projets', 'partenaires', 'contact', 'mentions-legales',
  'politique-confidentialite', 'conditions_utilisation', 'page-inconnue'];

// Measure the final layout without waiting for each entry animation while scrolling.
const settledAnimations = '.fade-in, .fade-in-left, .fade-in-right { opacity: 1 !important; transform: none !important; transition: none !important; }';

for (const size of [{ width: 320, height: 568 }, { width: 568, height: 320 }]) {
  test(`${size.width}x${size.height}: all pages fit horizontally`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize(size);
    for (const route of routes) {
      await page.goto(`/${route}`);
      await page.addStyleTag({ content: settledAnimations });
      const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth }));
      expect(widths.document, `/${route} at ${size.width}x${size.height}`).toBeLessThanOrEqual(widths.viewport);
    }
  });
}

test('Contact fits at small widths and the map can be shown and hidden', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/contact');
  await page.addStyleTag({ content: settledAnimations });
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const bounds = await page.locator('.contact-content').boundingBox();
    for (const selector of ['.contact-info', '.facebook-card', '.map-content', '.map-toggle']) {
      const box = await page.locator(selector).boundingBox();
      expect(box, selector).not.toBeNull();
      expect(box!.x, selector).toBeGreaterThanOrEqual(bounds!.x - 1);
      expect(box!.x + box!.width, selector).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await expect(page.getByRole('link', { name: 'Visitez la page Facebook' })).toBeVisible();
  await expect(page.locator('app-cta-section')).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  await page.route('https://www.google.com/maps/embed**', route => route.fulfill({ status: 200, body: '' }));
  await page.getByRole('button', { name: 'Afficher la carte' }).click();
  await expect(page.locator('#contact-map iframe')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Masquer la carte' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('button', { name: 'Masquer la carte' }).click();
  await expect(page.locator('#contact-map img')).toBeVisible();
});
