// Call Log > Sessions has a month calendar; a day lists its sessions; Details shows pauses.
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
const entry = (id, endedAtMs, extra = {}) => ({
  id, startedAtMs: endedAtMs - 3 * HOUR, endedAtMs, talkMs: HOUR, idleMs: 2 * HOUR, availableMs: 3 * HOUR, utilization: 33.3,
  callCount: 3, pauseCount: 0, pauses: [], startedBy: 'manual', endedBy: 'manual', earned: 7, ...extra
});
const todayNoon = () => { const d = new Date(); d.setHours(15, 0, 0, 0); return d.getTime(); };
const key = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

for (const theme of ['light', 'dark']) {
  test(`calendar picks a day, shows details, and moves between months (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      const end = todayNoon();
      const pauses = [{ startMs: end - 2 * HOUR, endMs: end - HOUR, by: 'auto' }];
      const history = [entry('today-1', end, { pauseCount: 1, pauses, endedBy: 'auto' }), entry('old', end - 45 * 24 * HOUR)];
      await seedStorage(page, baseUrl, { ...makeSeed(2), theme, sessionHistoryV1: JSON.stringify(history), [`releaseSpotlightSeen:${VERSION}`]: '1' });
      await page.click('.app-nav-link[data-app-nav="call-log"]');
      await page.click('#call-log-tab-sessions');
      assert.equal(await page.locator('.session-cal-day').count() >= 28, true);
      assert.equal(await page.locator('#session-history-list .session-history-item').count(), 2, 'recent sessions by default');

      await page.click(`[data-session-cal-day="${key(end)}"]`);
      assert.equal(await page.locator('#session-history-list .session-history-item').count(), 1);
      assert.match(await page.textContent('#session-history-heading'), /Sessions on/);

      await page.click('[data-session-history-details="today-1"]');
      const details = await page.innerText('[data-session-history-details-for="today-1"]');
      assert.match(details, /ended automatically/);
      assert.match(details, /automatic/);

      await page.click('[data-session-cal-nav="-1"]');
      await page.click(`[data-session-cal-day="${key(end - 45 * 24 * HOUR)}"]`).catch(() => {});
      await page.click('[data-session-cal-nav="1"]');
      await page.click(`[data-session-cal-day="${key(end)}"]`); // unselect
      assert.equal(await page.locator('#session-history-list .session-history-item').count(), 2);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('a day without sessions says so', async () => {
  const { context, page } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, { ...makeSeed(2), sessionHistoryV1: JSON.stringify([entry('a', todayNoon())]), [`releaseSpotlightSeen:${VERSION}`]: '1' });
    await page.click('.app-nav-link[data-app-nav="call-log"]');
    await page.click('#call-log-tab-sessions');
    await page.click('.session-cal-day.level-0');
    assert.match(await page.innerText('#session-history-list'), /No sessions on this day/);
  } finally { await context.close(); }
});
