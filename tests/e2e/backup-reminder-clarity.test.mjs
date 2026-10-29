// Backup reminder: it says how many calls are at stake, counts what people do with it
// (action names only), and the Data Hub shows when the last full backup was.
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

const APP_VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const seeded = (seed) => ({ ...seed, [`releaseSpotlightSeen:${APP_VERSION}`]: '1' });
const settle = (page) => page.waitForTimeout(3200);

async function openApp(seed, { analytics = true } = {}) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  await page.addInitScript(() => {
    window.__sent = [];
    window.goatcounter = { count: (vars) => window.__sent.push(vars.path) };
  });
  await seedStorage(page, baseUrl, seeded(analytics ? seed : { ...seed, wtt_analytics_enabled: '0' }));
  return { context, page, problems };
}
// Only the reminder's own counts (the daily feature counts are covered in usage-metrics).
const sent = (page) => page.evaluate(() => window.__sent.filter((p) => p.startsWith('event/backup-reminder/')));

test('the reminder says how many calls are saved only in this browser', async () => {
  const { context, page, problems } = await openApp(makeSeed(37));
  try {
    await settle(page);
    assert.equal(await page.locator('#backup-reminder-banner').isVisible(), true);
    assert.equal((await page.locator('#backup-reminder-count').innerText()).trim(), '37');
    assert.match(await page.locator('#backup-reminder-banner').innerText(), /clear your browser data or switch computers/);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('showing the reminder and each button counts only a fixed action name', async () => {
  for (const [button, name] of [['now', 'now'], ['later', 'later'], ['off', 'off']]) {
    const { context, page } = await openApp(makeSeed(12));
    try {
      await settle(page);
      assert.deepEqual(await sent(page), ['event/backup-reminder/shown']);
      await page.click(`#backup-reminder-${button}-btn`);
      await page.waitForTimeout(300);
      assert.deepEqual(await sent(page), ['event/backup-reminder/shown', `event/backup-reminder/${name}`]);
    } finally {
      await context.close();
    }
  }
});

test('nothing is counted when anonymous counts are off, and the reminder still works', async () => {
  const { context, page } = await openApp(makeSeed(12), { analytics: false });
  try {
    await settle(page);
    assert.equal(await page.locator('#backup-reminder-banner').isVisible(), true);
    await page.click('#backup-reminder-later-btn');
    assert.deepEqual(await sent(page), []);
  } finally {
    await context.close();
  }
});

test('the Data Hub shows when the last full backup was, and updates after a backup', async () => {
  const { context, page, problems } = await openApp(makeSeed(12));
  try {
    await settle(page);
    await page.click('#backup-reminder-later-btn');
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await page.click('#open-data-hub-btn');
    await page.waitForTimeout(300);
    assert.equal((await page.locator('#data-hub-last-backup').innerText()).trim(), 'Last full backup: No backup yet');

    const before = await readStorage(page);
    await page.click('#data-hub-export-json-btn');
    await page.waitForTimeout(300);
    const download = page.waitForEvent('download');
    await page.click('#confirm-export-options-btn');
    await download;
    await page.waitForTimeout(400);
    const line = (await page.locator('#data-hub-last-backup').evaluate((el) => el.textContent)).trim();
    assert.equal(line, 'Last full backup: Today');
    const after = await readStorage(page);
    assert.equal(after.calls, before.calls, 'saved calls are untouched');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
