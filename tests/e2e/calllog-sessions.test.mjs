// Session history now lives in Call Log > Sessions (no popup). Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

const HOUR = 3600000;
const history = JSON.stringify([{
  id: 's1', startedAtMs: Date.now() - 5 * HOUR, endedAtMs: Date.now() - 2 * HOUR, talkMs: HOUR, idleMs: 2 * HOUR,
  availableMs: 3 * HOUR, utilization: 33.3, callCount: 3, pauseCount: 0, pauses: [], startedBy: 'manual', endedBy: 'manual', earned: 7
}]);

for (const theme of ['light', 'dark']) {
  test(`Call Log switches between Calls and Sessions (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, { ...makeSeed(4), sessionHistoryV1: history, theme, [`releaseSpotlightSeen:${VERSION}`]: '1' });
      await page.click('[data-app-nav="call-log"]');
      assert.equal(await page.isVisible('#call-log-calls-panel'), true);
      assert.equal(await page.isVisible('#call-log-sessions-panel'), false);
      await page.click('#call-log-tab-sessions');
      assert.equal(await page.isVisible('#call-log-calls-panel'), false);
      assert.equal(await page.locator('#session-history-list .session-history-item').count(), 1);
      await page.click('#call-log-tab-calls');
      assert.equal(await page.isVisible('#call-log-calls-panel'), true);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('The Work screen button opens Call Log > Sessions and the editor still opens', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, { ...makeSeed(2), sessionHistoryV1: history, [`releaseSpotlightSeen:${VERSION}`]: '1' });
    await page.click('#open-session-history-btn');
    assert.equal(await page.isVisible('#call-log-sessions-panel'), true);
    await page.click('[data-session-history-edit="s1"]');
    await page.waitForSelector('#session-history-editor-modal', { state: 'visible' });
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
