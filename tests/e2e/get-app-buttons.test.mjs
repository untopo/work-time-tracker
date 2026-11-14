// The web version shows Windows and Android download buttons; the installed apps hide them.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const RELEASES = 'https://github.com/untopo/work-time-tracker/releases/latest';
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

const seed = (theme) => ({ ...makeSeed(0), theme, [`releaseSpotlightSeen:${VERSION}`]: '1' });

for (const theme of ['light', 'dark']) {
  test(`web sidebar shows Windows and Android download links (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl);
    try {
      await seedStorage(page, baseUrl, seed(theme));
      for (const id of ['sidebar-download-windows', 'sidebar-download-android']) {
        const link = page.locator(`#${id}`);
        assert.equal(await link.isVisible(), true, id);
        assert.equal(await link.getAttribute('href'), RELEASES);
        assert.equal(await link.getAttribute('target'), '_blank');
        assert.match(await link.getAttribute('rel'), /noopener/);
      }
      // Sits between the social icons and the version.
      const order = await page.evaluate(() => {
        const y = (sel) => document.querySelector(sel).getBoundingClientRect().top;
        return [y('.app-sidebar-meta-socials'), y('#sidebar-get-app'), y('.app-sidebar-version')];
      });
      assert.ok(order[0] < order[1] && order[1] < order[2], order.join(' < '));
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('installed app shell hides the download buttons', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await page.addInitScript(() => { window.Capacitor = { getPlatform: () => 'android', isNativePlatform: () => true }; });
    await seedStorage(page, baseUrl, seed('light'));
    assert.equal(await page.locator('#sidebar-get-app').isVisible(), false);
    assert.equal(await page.locator('#mobile-get-app').isVisible(), false);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('mobile Info & Support shows the download buttons', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl, { viewport: { width: 390, height: 844 } });
  try {
    await seedStorage(page, baseUrl, seed('dark'));
    const card = page.locator('#mobile-get-app');
    await card.scrollIntoViewIfNeeded();
    assert.equal(await card.isVisible(), true);
    assert.equal(await page.locator('#mobile-download-android').getAttribute('href'), RELEASES);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
