// Settings page: grouped sections, every control still works, nothing saved is touched.
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

function seedWithoutDock() {
  const seed = makeSeed(20);
  seed.featureFlags = JSON.stringify({ ...JSON.parse(seed.featureFlags), floatingCallControls: false });
  return seed;
}

async function openSettings(seed = seedWithoutDock()) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${APP_VERSION}`]: '1', wtt_analytics_enabled: '0' });
  await page.click('#settings-toggle');
  await page.waitForSelector('#st-features', { state: 'visible' });
  return { context, page, problems };
}

test('Settings shows the five sections in order and the controls are in the right place', async () => {
  const { context, page, problems } = await openSettings();
  const ids = await page.$$eval('#view-settings .st-section', (els) => els.map((e) => e.id));
  assert.deepEqual(ids, ['st-features', 'st-data', 'st-privacy', 'st-time', 'st-danger']);
  const where = (sel) => page.$eval(sel, (el) => el.closest('.st-section').id);
  assert.equal(await where('#feature-focus-mode-toggle'), 'st-features');
  assert.equal(await where('#feature-analytics-toggle'), 'st-privacy');
  assert.equal(await where('#open-data-hub-btn'), 'st-data');
  assert.equal(await where('#timezone-select'), 'st-time');
  assert.equal(await where('#reset-calls'), 'st-danger');
  assert.equal(await where('#reset-all'), 'st-danger');
  assert.match(await page.textContent('#settings-last-backup'), /No backup yet/);
  assert.deepEqual(problems, []);
  await context.close();
});

test('toggling a feature still saves it, and Delete calls only deletes after confirming', async () => {
  const { context, page, problems } = await openSettings();
  await page.evaluate(() => document.getElementById('feature-focus-mode-toggle').click());
  await page.waitForTimeout(300);
  const flags = JSON.parse((await readStorage(page)).featureFlags);
  assert.equal(flags.focusMode, true);
  const before = JSON.parse((await readStorage(page)).calls).length;
  await page.click('#reset-calls');
  await page.waitForTimeout(400);
  const stillThere = JSON.parse((await readStorage(page)).calls).length;
  assert.equal(stillThere, before, 'calls must not be deleted before the confirmation');
  assert.deepEqual(problems, []);
  await context.close();
});

test('Open Data Hub and the side menu work', async () => {
  const { context, page } = await openSettings();
  await page.click('[data-st-link="st-danger"]');
  await page.waitForTimeout(500);
  assert.ok(await page.$eval('[data-st-link="st-danger"]', (a) => a.classList.contains('active')));
  await page.click('#open-data-hub-btn');
  await page.waitForSelector('#data-hub-last-backup', { state: 'visible' });
  await context.close();
});
