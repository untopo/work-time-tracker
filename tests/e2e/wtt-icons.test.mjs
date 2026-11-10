// The Work cards and the main menu use the WTT icon set (inline SVG sprite). Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

for (const theme of ['light', 'dark']) {
  test(`cards and menu show the new icons with their own colors (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl);
    try {
      await seedStorage(page, baseUrl, { ...makeSeed(2), theme, [`releaseSpotlightSeen:${VERSION}`]: '1' });
      const ids = await page.$$eval('svg.wtt-icon use', (els) => els.map((el) => el.getAttribute('href')));
      for (const id of ['#wtt-i-call', '#wtt-i-goal', '#wtt-i-rates', '#wtt-i-session', '#wtt-i-work', '#wtt-i-callLog', '#wtt-i-analytics', '#wtt-i-progress', '#wtt-i-resources']) {
        assert.ok(ids.includes(id), `${id} is used`);
        assert.equal(await page.locator(id).count(), 1, `${id} is defined in the sprite`);
      }
      const main = await page.$eval('.wtt-icon-green', (el) => getComputedStyle(el).getPropertyValue('--wtt-icon-main').trim());
      assert.equal(main, theme === 'dark' ? '#86efac' : '#16a34a');
      assert.equal(await page.locator('#call-controls-card i.fa-phone-volume').count(), 0, 'old Font Awesome icon is gone');
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}
