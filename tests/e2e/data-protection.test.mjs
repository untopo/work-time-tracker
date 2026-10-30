// Data protection for the web version: persistent storage request and backup reminder.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

let server;
let baseUrl;
let browser;

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
});

after(async () => {
  await browser?.close();
  server?.close();
});

const parse = (value) => JSON.parse(value);

// Starts a page, optionally pretending the browser has (or lacks) persistent storage,
// and counting how many times the app asks for it.
// The "What's New" notice shares the top of the screen with the reminder; mark it as already seen.
const APP_VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const withSeenNews = (seed) => ({ ...seed, [`releaseSpotlightSeen:${APP_VERSION}`]: '1' });

async function withPage(fn, { seed = makeSeed(12), persisted = false } = {}) {
  seed = withSeenNews(seed);
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await page.addInitScript((alreadyPersisted) => {
      window.__persistCalls = 0;
      const fake = {
        persisted: async () => alreadyPersisted,
        persist: async () => { window.__persistCalls += 1; return true; },
        estimate: async () => ({ usage: 0, quota: 1e9 }),
      };
      Object.defineProperty(navigator, 'storage', { configurable: true, get: () => fake });
    }, persisted);
    await seedStorage(page, baseUrl, seed);
    await fn(page, problems);
  } finally {
    await context.close();
  }
}

async function callOnce(page) {
  await page.click('#start-call-btn');
  await page.waitForTimeout(1300);
  await page.click('#end-call-btn');
  await page.waitForTimeout(900);
}

const bannerVisible = (page) => page.locator('#backup-reminder-banner').isVisible();

test('the app asks the browser for persistent storage after a call is saved, not on load', async () => {
  await withPage(async (page, problems) => {
    assert.equal(await page.evaluate(() => window.__persistCalls), 0, 'no request while just opening the app');
    await callOnce(page);
    assert.equal(await page.evaluate(() => window.__persistCalls), 1, 'one request after saving a call');
    await callOnce(page);
    assert.equal(await page.evaluate(() => window.__persistCalls), 1, 'only once per visit');
    assert.deepEqual(problems, []);
  });
});

test('it does not ask again when storage is already persistent or after 3 earlier tries', async () => {
  await withPage(async (page) => {
    await callOnce(page);
    assert.equal(await page.evaluate(() => window.__persistCalls), 0, 'already persistent: nothing to ask');
  }, { persisted: true });

  const seed = { ...makeSeed(12), wtt_persist_attempts: '3' };
  await withPage(async (page) => {
    await callOnce(page);
    assert.equal(await page.evaluate(() => window.__persistCalls), 0, 'stops asking after 3 attempts');
  }, { seed });
});

// The reminder shows a moment after the app opens (not right after a call, so it never
// covers the "Call saved / Undo" strip).
const settle = (page) => page.waitForTimeout(3200);

test('the backup reminder appears when the app opens, if the user has many calls and never backed up', async () => {
  await withPage(async (page, problems) => {
    await settle(page);
    assert.equal(await bannerVisible(page), true, 'shown after opening the app');
    assert.deepEqual(problems, []);
  });
});

test('no reminder right after a call, so it never covers the Call saved / Undo strip', async () => {
  await withPage(async (page) => {
    await settle(page);
    await page.click('#backup-reminder-later-btn');
    await callOnce(page);
    assert.equal(await bannerVisible(page), false);
  });
});

test('no reminder for new users, recent backups, or when switched off', async () => {
  await withPage(async (page) => {
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'fewer than 10 calls');
  }, { seed: makeSeed(5) });

  const recent = { ...makeSeed(12), wtt_last_backup_at: String(Date.now() - 24 * 3600 * 1000) };
  await withPage(async (page) => {
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'backed up yesterday');
  }, { seed: recent });

  const off = { ...makeSeed(12), wtt_backup_reminder_off: '1' };
  await withPage(async (page) => {
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'reminders switched off');
  }, { seed: off });
});

test('"Later" hides the reminder and snoozes it for days', async () => {
  await withPage(async (page) => {
    await settle(page);
    await page.click('#backup-reminder-later-btn');
    assert.equal(await bannerVisible(page), false, 'hidden right away');
    const snooze = Number((await readStorage(page)).wtt_backup_reminder_snooze_until);
    assert.ok(snooze > Date.now() + 6 * 24 * 3600 * 1000, 'snoozed for about a week');
    await page.reload();
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'not shown again after reopening');
  });
});

test('"Don\'t remind me again" is remembered', async () => {
  await withPage(async (page) => {
    await settle(page);
    await page.click('#backup-reminder-off-btn');
    assert.equal(await bannerVisible(page), false);
    assert.equal((await readStorage(page)).wtt_backup_reminder_off, '1');
    await page.reload();
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'stays off after a reload');
  });
});

test('"Back up now" opens the export dialog, and exporting every call records the backup', async () => {
  const seed = makeSeed(12);
  await withPage(async (page, problems) => {
    await settle(page);
    await page.click('#backup-reminder-now-btn');
    await page.waitForTimeout(400);
    assert.ok(await page.locator('#export-options-modal').isVisible(), 'export dialog is open');
    assert.equal(await bannerVisible(page), false, 'banner closes');

    const download = page.waitForEvent('download');
    await page.click('#confirm-export-options-btn');
    const file = await download;
    assert.match(file.suggestedFilename(), /^work-time-tracker-data-.*\.json$/);

    const stored = await readStorage(page);
    assert.ok(Date.now() - Number(stored.wtt_last_backup_at) < 15000, 'last backup time recorded');
    assert.equal(parse(stored.calls).length, parse(seed.calls).length, 'no call was lost or duplicated');
    assert.deepEqual(problems, []);
  }, { seed });
});

test('none of this changes saved calls, rates, or goals', async () => {
  const seed = makeSeed(12);
  await withPage(async (page) => {
    await settle(page);
    await page.click('#backup-reminder-later-btn');
    await callOnce(page);
    const stored = await readStorage(page);
    const oldIds = parse(seed.calls).map((call) => call.id).sort();
    const keptIds = parse(stored.calls).map((call) => call.id).filter((id) => oldIds.includes(id)).sort();
    assert.deepEqual(keptIds, oldIds, 'all previous calls still there');
    assert.deepEqual(parse(stored.rates), parse(seed.rates), 'rates unchanged');
    assert.deepEqual(parse(stored.dailyGoal), parse(seed.dailyGoal), 'goal unchanged');
  }, { seed });
});

test('the reminder waits while the What\'s New notice is open, so they never overlap', async () => {
  const { context, page } = await newPage(browser, baseUrl);
  try {
    const seed = makeSeed(12);
    delete seed[`releaseSpotlightSeen:${APP_VERSION}`]; // this test needs the What's New notice open
    await seedStorage(page, baseUrl, seed);
    await settle(page);
    assert.equal(await bannerVisible(page), false, 'no reminder on top of What\'s New');
  } finally {
    await context.close();
  }
});

test('no reminder appears over a live call', async () => {
  await withPage(async (page) => {
    await page.click('#start-call-btn');
    await settle(page);
    assert.equal(await bannerVisible(page), false);
    await page.click('#end-call-btn');
  });
});
