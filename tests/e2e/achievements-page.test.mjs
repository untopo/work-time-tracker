// Achievements is one page: header, quick links, Today, This week, then badges. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

for (const theme of ['light', 'dark']) {
  test(`Achievements shows everything on one page (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, { ...makeSeed(10), theme, [`releaseSpotlightSeen:${VERSION}`]: '1' });
      assert.match(await page.innerText('[data-app-nav="progress"]'), /Achievements/);
      await page.click('[data-app-nav="progress"]');
      for (const id of ['#rpg-progress-card', '#achievements-summary', '#daily-quests-section', '#rpg-weekly-arc-card', '#ach-records-section', '#ach-families-section', '#ach-singles-section', '#ach-secrets-section']) {
        assert.equal(await page.locator(id).count(), 1, `${id} exists`);
      }
      assert.equal(await page.locator('#progress-tabs').count(), 0, 'old tabs are gone');
      assert.match(await page.innerText('#rpg-level-summary'), /^Level \d+ · \S+/);
      assert.match(await page.innerText('#rpg-level-badge'), /^\d+$/);
      assert.match(await page.innerText('#achievements-streak-text'), /Current streak/);
      // Quick link scrolls to its section without errors.
      await page.click('[data-ach-anchor="ach-secrets-section"]');
      await page.waitForTimeout(500);
      assert.equal(await page.isVisible('#ach-secrets-section'), true);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}
