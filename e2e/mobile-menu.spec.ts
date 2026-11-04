import { expect, test, type Page } from '@playwright/test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const menu = '#site-navigation';
const sizes = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 568, height: 320 },
  { width: 844, height: 390 },
];

async function openMenu(page: Page) {
  const opener = page.getByRole('button', { name: 'Ouvrir le menu', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(menu)).toHaveJSProperty('popover', 'auto');
  await expect(page.locator(`${menu}:popover-open`)).toBeVisible();
  await expect(page.locator(`${menu} .close`)).toBeFocused();
  // Keep the original entrance animation, then measure its final layout.
  await page.waitForTimeout(550);
}

async function visibleInsidePanel(page: Page, selector: string) {
  const bounds = await page.locator(selector).boundingBox();
  const close = await page.locator(`${menu} .close`).boundingBox();
  expect(bounds).not.toBeNull();
  expect(close).not.toBeNull();
  expect(bounds!.y).toBeGreaterThanOrEqual(close!.y + close!.height);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
  expect(close!.y).toBeGreaterThanOrEqual(0);
  expect(close!.height).toBe(40);
}

async function capture(page: Page, name: string, project: string) {
  const file = path.resolve('tmp/mobile-menu', `${project}-${name}.png`);
  await mkdir(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file });
  await test.info().attach(name, { path: file, contentType: 'image/png' });
}

for (const size of sizes) {
  test(`${size.width}x${size.height}: all ten links by keyboard, internal scroll and Escape`, async ({ page }, info) => {
    await page.setViewportSize(size);
    await page.goto('/');
    await openMenu(page);
    const links = page.locator(`${menu} a`);
    await expect(links).toHaveCount(10);
    await capture(page, `${size.width}x${size.height}-top`, info.project.name);
    for (let index = 0; index < 10; index++) {
      await page.keyboard.press('Tab');
      await expect(links.nth(index)).toBeFocused();
      await visibleInsidePanel(page, `${menu} li:nth-child(${index + 1}) a`);
    }
    await capture(page, `${size.width}x${size.height}-bottom`, info.project.name);
    if (size.height < 400) {
      expect(await page.locator('.menu-links').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    }
    for (let index = 0; index < 10; index++) {
      await page.keyboard.press('Shift+Tab');
    }
    await expect(page.locator(`${menu} .close`)).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator(menu)).toBeHidden();
    await expect(page.getByRole('button', { name: 'Ouvrir le menu', exact: true })).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)).not.toBe('hidden');
  });
}

test('wheel, scroll containment, close button, backdrop and restored page position', async ({ page }) => {
  await page.setViewportSize(sizes[2]);
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 400));
  await openMenu(page);
  const original = await page.evaluate(() => scrollY);
  for (const selector of ['html', 'body']) {
    expect(await page.locator(selector).evaluate(el => getComputedStyle(el).overflowY)).toBe('hidden');
  }
  await page.mouse.move(500, 200);
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.locator('.menu-links').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await visibleInsidePanel(page, `${menu} li:last-child a`);
  await page.mouse.wheel(0, 1000);
  await page.mouse.move(30, 200);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => scrollY)).toBe(original);
  await page.locator(`${menu} .close`).click();
  await expect(page.locator(menu)).toBeHidden();
  expect(await page.evaluate(() => scrollY)).toBe(original);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(original);
  await openMenu(page);
  await page.mouse.click(30, 200);
  await expect(page.locator(menu)).toBeHidden();
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).overflowY)).not.toBe('hidden');
});

test('all ten routes close the popover and release scrolling, including the current route', async ({ page }) => {
  await page.setViewportSize(sizes[2]);
  await page.goto('/');
  for (let index = 0; index < 10; index++) {
    await openMenu(page);
    const link = page.locator(`${menu} a`).nth(index);
    const href = await link.getAttribute('href');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(menu)).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${href || '/'}$`));
    expect(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY)).not.toBe('hidden');
  }
  await openMenu(page);
  await page.locator(`${menu} a`).last().click();
  await expect(page.locator(menu)).toBeHidden();
  await page.goBack();
  await expect(page).toHaveURL(/\/partenaires$/);
  await openMenu(page);
  await page.keyboard.press('Escape');
});

test('rotation while open and reduced motion', async ({ page }, info) => {
  await page.setViewportSize(sizes[1]);
  await page.goto('/');
  await openMenu(page);
  expect(await page.locator('.menu').evaluate(el => getComputedStyle(el).animationName)).toMatch(/slide-fade$/);
  expect(await page.locator('.modal').evaluate(el => getComputedStyle(el).animationName)).toMatch(/modal-fade$/);
  for (const selector of ['.menu', '.modal']) {
    expect(await page.locator(selector).evaluate(el => getComputedStyle(el).animationDuration)).toBe('0.5s');
  }
  await page.setViewportSize(sizes[3]);
  await page.locator(`${menu} a`).last().focus();
  await visibleInsidePanel(page, `${menu} li:last-child a`);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openMenu(page);
  expect(await page.locator('.menu').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  expect(await page.locator('.modal').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await capture(page, 'rotation-reduced-motion', info.project.name);
});

test('desktop navigation and scrolling', async ({ page }, info) => {
  for (const width of [950, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Ouvrir le menu', exact: true })).toBeHidden();
    await expect(page.locator('.navbar-items-container a')).toHaveCount(10);
    for (const link of await page.locator('.navbar-items-container a').all()) {
      await expect(link).toBeInViewport({ ratio: 1 });
    }
    await expect(page.locator(menu)).toBeHidden();
    expect(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY)).not.toBe('hidden');
    if (width === 1440) await capture(page, 'desktop-1440x900', info.project.name);
    await page.locator('.navbar-items-container a').last().click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  }
});

test('native browser zoom 200% at 390x844 and 568x320', async ({ playwright, baseURL }, info) => {
  test.skip(info.project.name === 'webkit', 'Chrome/Edge profile preference sets actual browser zoom.');
  const profile = await mkdtemp(path.resolve('tmp/mobile-menu/zoom-profile-'));
  await mkdir(path.join(profile, 'Default'));
  await writeFile(path.join(profile, 'Default/Preferences'), JSON.stringify({
    partition: { per_host_zoom_levels: { x: {
      '127.0.0.1': { zoom_level: Math.log(2) / Math.log(1.2) },
    } } },
  }));
  const context = await playwright.chromium.launchPersistentContext(profile, {
    channel: info.project.name === 'edge' ? 'msedge' : 'chrome', headless: true,
  });
  try {
    const page = context.pages()[0];
    for (const size of [sizes[1], sizes[2]]) {
      await page.setViewportSize(size);
      await page.goto(baseURL!);
      await expect.poll(() => page.evaluate(() => innerWidth)).toBe(Math.round(size.width / 2));
      await openMenu(page);
      for (let index = 0; index < 10; index++) {
        await page.keyboard.press('Tab');
        await expect(page.locator(`${menu} a`).nth(index)).toBeFocused();
      }
      const close = await page.locator('.close').boundingBox();
      const last = await page.locator(`${menu} a`).last().boundingBox();
      expect(close!.y).toBeGreaterThanOrEqual(0);
      // Include room for the native focus outline, not just the link's text box.
      expect(last!.y + last!.height + 6).toBeLessThanOrEqual(await page.evaluate(() => innerHeight + 1));
      await capture(page, `zoom200-${size.width}x${size.height}`, info.project.name);
      await page.keyboard.press('Escape');
    }
  } finally {
    await context.close();
    const evidenceRoot = path.resolve('tmp/mobile-menu') + path.sep;
    if (!profile.startsWith(evidenceRoot)) throw new Error('Unexpected zoom profile path');
    await rm(profile, { recursive: true, force: true });
  }
});

test('safe area insets protect close and last link', async ({ page, context }, info) => {
  test.skip(info.project.name === 'webkit', 'Safe-area override uses the Chromium DevTools protocol.');
  await page.setViewportSize(sizes[2]);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 20, bottom: 20, left: 16, right: 16 } });
  await page.goto('/');
  await openMenu(page);
  const padding = await page.locator('.menu').evaluate(el => {
    const s = getComputedStyle(el);
    return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft];
  });
  expect(padding).toEqual(['20px', '16px', '20px', '16px']);
  await page.locator(`${menu} a`).last().focus();
  const last = await page.locator(`${menu} a`).last().boundingBox();
  expect(last!.y + last!.height).toBeLessThanOrEqual(301);
  await capture(page, 'safe-areas-568x320', info.project.name);
});

test('keyboard opens and closes the menu without a pointer', async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Ouvrir le menu', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator(`${menu} .close`)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator(menu)).toBeHidden();
  await expect(opener).toBeFocused();
});

test('mobile touch pans the list and leaves the background stationary', async ({ browser, baseURL }, info) => {
  test.skip(info.project.name === 'webkit', 'Touch drag uses the Chromium DevTools protocol.');
  const context = await browser.newContext({ viewport: sizes[2], isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await page.goto(baseURL!);
    await page.evaluate(() => scrollTo(0, 400));
    await page.getByRole('button', { name: 'Ouvrir le menu', exact: true }).tap();
    await expect(page.locator(`${menu}:popover-open`)).toBeVisible();
    await page.waitForTimeout(550);
    const initialY = await page.evaluate(() => scrollY);
    async function swipe(x: number) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: 280 }] });
      for (let y = 260; y >= 80; y -= 20) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await swipe(480);
    await expect.poll(() => page.locator('.menu-links').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await swipe(30);
    expect(await page.evaluate(() => scrollY)).toBe(initialY);
    await page.locator(`${menu} .close`).tap();
    await expect(page.locator(menu)).toBeHidden();
  } finally {
    await context.close();
  }
});
