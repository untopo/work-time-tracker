// Analytics has a Calls | Time switch; Time shows stats from finished work sessions.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

const HOUR = 3600000;
function history() {
  const end = Date.now() - 2 * HOUR;
  const mk = (id, endedAtMs, talk, avail, by) => ({
    id, startedAtMs: endedAtMs - 3 * HOUR, endedAtMs, talkMs: talk, idleMs: avail - talk, availableMs: avail,
    utilization: (talk / avail) * 100, callCount: 4, pauseCount: 1, pauses: [], startedBy: by, endedBy: by, earned: 10
  });
  return JSON.stringify([mk('a', end, HOUR, 2 * HOUR, 'auto'), mk('b', end - 30 * 24 * HOUR - HOUR, HOUR, HOUR, 'manual')]);
}

for (const theme of ['light', 'dark']) {
  test(`Time tab shows only the last 30 days of sessions (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, {
        ...makeSeed(3), sessionHistoryV1: history(), [`releaseSpotlightSeen:${VERSION}`]: '1',
        ...(theme === 'dark' ? { theme: 'dark' } : { theme: 'light' })
      });
      await page.click('[data-app-nav="analytics"]');
      assert.equal(await page.isVisible('#analytics-calls-panel'), true, 'Calls is the default');
      assert.equal(await page.isVisible('#analytics-time-panel'), false);
      await page.click('#analytics-tab-time');
      assert.equal(await page.isVisible('#analytics-time-panel'), true);
      assert.equal(await page.isVisible('#analytics-calls-panel'), false);
      assert.equal(await page.textContent('#time-stat-sessions'), '1', 'the 31-day-old session is left out');
      assert.equal(await page.textContent('#time-stat-utilization'), '50.0%');
      assert.match(await page.textContent('#time-stat-automation'), /1 started and 1 ended automatically/);
      assert.equal(await page.locator('.analytics-time-day').count(), 7);
      await page.click('#analytics-tab-calls');
      assert.equal(await page.isVisible('#analytics-calls-panel'), true);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('Time tab explains itself when there are no sessions', async () => {
  const { context, page } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, { ...makeSeed(2), [`releaseSpotlightSeen:${VERSION}`]: '1' });
    await page.click('[data-app-nav="analytics"]');
    await page.click('#analytics-tab-time');
    assert.equal(await page.isVisible('#analytics-time-empty'), true);
  } finally { await context.close(); }
});
