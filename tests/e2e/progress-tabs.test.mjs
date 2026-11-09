// Progress is split into Today | Week | Achievements tabs. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

for (const theme of ['light', 'dark']) {
  test(`Progress tabs show one group at a time (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, { ...makeSeed(10), theme, [`releaseSpotlightSeen:${VERSION}`]: '1' });
      await page.click('[data-app-nav="progress"]');
      const vis = async () => [await page.isVisible('#progress-panel-today'), await page.isVisible('#progress-panel-week'), await page.isVisible('#progress-panel-achievements')];
      assert.deepEqual(await vis(), [true, false, false]);
      assert.equal(await page.isVisible('#rpg-progress-card'), true);
      assert.equal(await page.isVisible('#daily-quests-section'), true);
      await page.click('#progress-tab-week');
      assert.deepEqual(await vis(), [false, true, false]);
      assert.equal(await page.isVisible('#rpg-weekly-arc-card'), true);
      await page.click('#progress-tab-achievements');
      assert.deepEqual(await vis(), [false, false, true]);
      assert.equal(await page.isVisible('#achievements-grid'), true);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}
