// Data recovery: damaged saved data never wipes everything, a copy of the original is kept,
// and Reset All / Reset Calls can be undone. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

let server;
let baseUrl;
let browser;
const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const SNAPSHOT_KEY = 'wtt_recovery_snapshot_v1';

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
});
after(async () => {
  await browser?.close();
  server?.close();
});

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
  return { context, page, problems };
}

function truncatedCalls(count, keep) {
  const seed = makeSeed(count);
  const all = JSON.parse(seed.calls);
  const text = JSON.stringify(all);
  // cut in the middle of item number `keep + 1`
  const cutAt = JSON.stringify(all.slice(0, keep)).length + 25;
  return { seed, all, text: text.slice(0, cutAt) };
}

test('truncated calls: app opens, other data kept, calls salvaged, original copy kept', async () => {
  const { seed, all, text } = truncatedCalls(30, 20);
  const { context, page, problems } = await openApp({ ...seed, calls: text });
  try {
    const stored = await readStorage(page);
    assert.equal(stored.rates, seed.rates, 'rates untouched');
    assert.equal(stored.dailyGoal, seed.dailyGoal, 'daily goal untouched');
    assert.equal(stored.theme, 'dark', 'settings untouched');
    const saved = JSON.parse(stored.calls);
    assert.equal(saved.length, 20, 'the complete calls were kept');
    assert.deepEqual(saved.map((c) => c.id), all.slice(0, 20).map((c) => c.id));
    const snapshot = JSON.parse(stored[SNAPSHOT_KEY]);
    assert.equal(snapshot.reason, 'damaged-data');
    assert.equal(snapshot.raw.calls, text, 'original damaged text is kept as is');
    assert.equal(await page.locator('#data-recovery-banner').isVisible(), true);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('damaged daily goal only: calls are untouched', async () => {
  const seed = makeSeed(15);
  const { context, page } = await openApp({ ...seed, dailyGoal: '{"amount":40,"minu' });
  try {
    const stored = await readStorage(page);
    assert.equal(JSON.parse(stored.calls).length, 15);
    assert.equal(stored.rates, seed.rates);
    const snapshot = JSON.parse(stored[SNAPSHOT_KEY]);
    assert.equal(snapshot.raw.dailyGoal, '{"amount":40,"minu');
    assert.equal(snapshot.raw.calls, seed.calls, 'the copy also holds the healthy values');
  } finally {
    await context.close();
  }
});

test('healthy data creates no copy and no banner', async () => {
  const { context, page } = await openApp(makeSeed(10));
  try {
    const stored = await readStorage(page);
    assert.equal(stored[SNAPSHOT_KEY], undefined);
    assert.equal(await page.locator('#data-recovery-banner').isVisible(), false);
  } finally {
    await context.close();
  }
});

test('download recovery file is a valid backup with calls and the original text', async () => {
  const { seed, text } = truncatedCalls(30, 20);
  const { context, page } = await openApp({ ...seed, calls: text });
  try {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#data-recovery-download-btn')
    ]);
    const file = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    assert.equal(file.calls.length, 20);
    assert.equal(file.rates.length, 2);
    assert.equal(file.rawData.calls, text);
    assert.equal(file.recovery.reason, 'damaged-data');
    assert.match(download.suggestedFilename(), /^wtt-recovery-\d{4}-\d{2}-\d{2}\.json$/);
    const stored = await readStorage(page);
    assert.equal(JSON.parse(stored[SNAPSHOT_KEY]).downloaded, true);
    assert.equal(await page.locator('#data-recovery-remove-btn').isVisible(), true);
  } finally {
    await context.close();
  }
});

test('importing the recovery file merges the calls without duplicates', async () => {
  const { seed, all, text } = truncatedCalls(30, 20);
  const { context, page } = await openApp({ ...seed, calls: text });
  try {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#data-recovery-download-btn')
    ]);
    const file = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
    // Same file imported again: the app already has these calls, so nothing new is added.
    await page.evaluate((data) => importJsonBackup(data), file);
    await page.waitForTimeout(300);
    const body = await page.locator('body').innerText();
    assert.match(body, /Nothing New To Import/);
    // A file with extra calls adds only the new ones.
    const extra = { ...file, calls: all };
    await page.evaluate((data) => importJsonBackup(data), extra);
    await page.getByRole('button', { name: 'Merge', exact: true }).click();
    await page.waitForTimeout(800);
    const stored = await readStorage(page);
    const ids = JSON.parse(stored.calls).map((c) => c.id);
    assert.equal(ids.length, 30);
    assert.equal(new Set(ids).size, 30, 'no duplicates');
  } finally {
    await context.close();
  }
});

async function confirmReset(page, buttonId, confirmLabel, typeText) {
  
  await page.evaluate((id) => document.getElementById(id).click(), buttonId);
  if (typeText) await page.fill('input[type="text"]:visible', typeText);
  await page.getByRole('button', { name: confirmLabel, exact: true }).click();
  await page.waitForTimeout(1200);
}

test('Reset All keeps a copy and "Restore my data" brings everything back', async () => {
  const seed = makeSeed(25);
  const { context, page } = await openApp(seed);
  try {
    await confirmReset(page, 'reset-all', 'Reset All', 'RESET');
    let stored = await readStorage(page);
    assert.equal(JSON.parse(stored.calls || '[]').length, 0, 'calls were erased');
    const snapshot = JSON.parse(stored[SNAPSHOT_KEY]);
    assert.equal(snapshot.reason, 'reset-all');
    assert.equal(snapshot.raw.calls, seed.calls);
    assert.equal(await page.locator('#data-recovery-restore-btn').isVisible(), true);
    await Promise.all([page.waitForNavigation(), page.click('#data-recovery-restore-btn')]);
    await page.waitForSelector('.call-log-table', { state: 'attached' });
    stored = await readStorage(page);
    assert.equal(stored.calls, seed.calls, 'calls restored exactly');
    assert.equal(stored.rates, seed.rates);
    assert.equal(stored[SNAPSHOT_KEY], undefined, 'copy removed after restoring');
  } finally {
    await context.close();
  }
});

test('Reset Calls keeps a copy and restore brings the calls back', async () => {
  const seed = makeSeed(25);
  const { context, page } = await openApp(seed);
  try {
    await confirmReset(page, 'reset-calls', 'Erase', null);
    let stored = await readStorage(page);
    assert.equal(JSON.parse(stored.calls || '[]').length, 0);
    assert.equal(stored.rates, seed.rates, 'rates kept');
    assert.equal(JSON.parse(stored[SNAPSHOT_KEY]).reason, 'delete-calls');
    await Promise.all([page.waitForNavigation(), page.click('#data-recovery-restore-btn')]);
    await page.waitForSelector('.call-log-table', { state: 'attached' });
    stored = await readStorage(page);
    assert.equal(stored.calls, seed.calls);
  } finally {
    await context.close();
  }
});
