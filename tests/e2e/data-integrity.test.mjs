// What the screens SHOW must match what is SAVED, and backups must round-trip.
// These checks catch silent problems: rows missing from the Call Log, wrong totals,
// a backup that drops calls, an import that duplicates them.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const TZ = 'America/Lima';
const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server;
let baseUrl;
let browser;
let tmpDir;

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtt-e2e-'));
});
after(async () => {
  await browser?.close();
  server?.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const seen = (seed) => ({ ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });

async function openApp(seed, view) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: TZ, acceptDownloads: true });
  await seedStorage(page, baseUrl, seen(seed));
  if (view) {
    await page.click(`.app-nav-link[data-app-nav="${view}"]`);
    await page.waitForTimeout(500);
  }
  return { context, page, problems };
}

// ---- Calendar helpers in Lima time (independent from the app's own code) ----
const dayKey = (ms) => new Date(ms).toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
const todayKey = () => dayKey(Date.now());
function weekKeys() { // Sunday .. Saturday containing today
  const [y, m, d] = todayKey().split('-').map(Number);
  const noon = Date.UTC(y, m - 1, d, 12);
  const dow = new Date(noon).getUTCDay();
  return Array.from({ length: 7 }, (_, i) => dayKey(noon + (i - dow) * 86400000));
}
const callsWhere = (seed, test) => JSON.parse(seed.calls).filter((call) => test(dayKey(Date.parse(call.startTime))));
const money = (value) => `$${Number(value).toFixed(2)}`;
const sortedMoney = (list) => [...list].sort();

async function rowEarnings(page) {
  return page.$$eval('#call-log tr', (rows) =>
    rows.map((row) => (row.innerText.match(/\$\d+\.\d\d/g) || []).pop()));
}

test('Call Log shows exactly the saved calls for Today, Week and Month', async () => {
  const seed = makeSeed(120);
  const { context, page, problems } = await openApp(seed, 'call-log');
  try {
    const month = todayKey().slice(0, 7);
    const cases = [
      ['today', (key) => key === todayKey()],
      ['week', (key) => weekKeys().includes(key)],
      ['month', (key) => key.startsWith(month)],
    ];
    for (const [filter, belongs] of cases) {
      await page.click(`#filter-${filter}`);
      await page.waitForTimeout(400);
      const expected = callsWhere(seed, belongs);
      // An empty list shows one "no calls" placeholder row, so count only rows that hold an amount.
      const shown = (await rowEarnings(page)).filter(Boolean);
      assert.equal(shown.length, expected.length, `${filter}: number of rows`);
      assert.deepEqual(sortedMoney(shown), sortedMoney(expected.map((call) => money(call.earned))), `${filter}: earnings of every row`);
      if (expected.length > 0) {
        assert.match(await page.innerText('#call-log-results-summary'), new RegExp(`Showing ${expected.length} call`), `${filter}: summary count`);
      }
    }
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('Analytics totals for today and for the month equal the sum of the saved calls', async () => {
  const seed = makeSeed(120);
  const { context, page, problems } = await openApp(seed, 'analytics');
  try {
    const sum = (list) => list.reduce((total, call) => total + call.earned, 0);
    const today = sum(callsWhere(seed, (key) => key === todayKey()));
    const month = sum(callsWhere(seed, (key) => key.startsWith(todayKey().slice(0, 7))));
    assert.equal((await page.innerText('#today-earnings')).trim(), money(today), 'today earnings');
    assert.equal((await page.innerText('#monthly-total-earnings')).trim(), money(month), 'month total');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

async function exportBackup(page, fileName) {
  await page.click('#settings-toggle');
  await page.waitForTimeout(400);
  await page.click('#open-data-hub-btn');
  await page.waitForTimeout(400);
  await page.click('#data-hub-export-json-btn');
  await page.waitForTimeout(400);
  const download = page.waitForEvent('download');
  await page.click('#confirm-export-options-btn');
  const file = path.join(tmpDir, fileName);
  await (await download).saveAs(file);
  return file;
}

test('the exported backup contains every saved call, rate and goal, unchanged', async () => {
  const seed = makeSeed(120);
  const { context, page, problems } = await openApp(seed);
  try {
    const file = await exportBackup(page, 'backup-all.json');
    const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
    const saved = JSON.parse((await readStorage(page)).calls);
    assert.equal(backup.calls.length, 120, 'all calls exported');
    assert.deepEqual(backup.calls.map((call) => call.id).sort(), saved.map((call) => call.id).sort());
    const byId = Object.fromEntries(saved.map((call) => [call.id, call]));
    for (const call of backup.calls) {
      const original = byId[call.id];
      assert.equal(call.startTime, original.startTime, `start of ${call.id}`);
      assert.equal(call.duration, original.duration, `duration of ${call.id}`);
      assert.equal(call.rate, original.rate, `rate of ${call.id}`);
      assert.equal(call.notes, original.notes, `notes of ${call.id}`);
    }
    assert.deepEqual(backup.rates, JSON.parse(seed.rates), 'rates exported');
    assert.deepEqual(backup.dailyGoal, JSON.parse(seed.dailyGoal), 'goal exported');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

async function importBackup(page, file) {
  await page.click('#open-data-hub-btn');
  await page.waitForTimeout(300);
  const chooser = page.waitForEvent('filechooser');
  await page.click('#data-hub-import-json-btn');
  await (await chooser).setFiles(file);
  await page.waitForTimeout(800);
}

test('importing a backup restores every call once, and importing it again adds nothing', async () => {
  const original = makeSeed(120);
  const first = await openApp(original);
  let file;
  try {
    file = await exportBackup(first.page, 'backup-roundtrip.json');
  } finally {
    await first.context.close();
  }

  const empty = makeSeed(0);
  const { context, page, problems } = await openApp(empty);
  try {
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, file);
    await page.click('#confirmation-confirm-btn'); // "Merge"
    await page.waitForTimeout(1500);

    let calls = JSON.parse((await readStorage(page)).calls);
    assert.equal(calls.length, 120, 'all calls restored');
    assert.deepEqual(calls.map((call) => call.id).sort(), JSON.parse(original.calls).map((call) => call.id).sort());
    const originalById = Object.fromEntries(JSON.parse(original.calls).map((call) => [call.id, call]));
    for (const call of calls) {
      assert.equal(call.startTime, originalById[call.id].startTime, `start of ${call.id}`);
      assert.equal(call.duration, originalById[call.id].duration, `duration of ${call.id}`);
    }

    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, file);
    assert.match(await page.innerText('#confirmation-modal'), /Nothing New To Import/, 'second import is recognised as duplicate');
    calls = JSON.parse((await readStorage(page)).calls);
    assert.equal(calls.length, 120, 'no duplicates after importing twice');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

async function openRowMenuAndDelete(page) {
  const row = page.locator('#call-log tr').first();
  await row.locator('.call-log-actions-menu-btn').click();
  await row.locator('.delete-call-btn').click();
  await page.waitForTimeout(300);
}

test('deleting a call removes only that call; cancelling the confirmation removes nothing', async () => {
  const seed = makeSeed(120);
  const { context, page, problems } = await openApp(seed, 'call-log');
  try {
    await page.click('#filter-month');
    await page.waitForTimeout(400);
    const before = JSON.parse((await readStorage(page)).calls);
    const shownBefore = await page.locator('#call-log tr').count();

    await openRowMenuAndDelete(page);
    await page.click('#confirmation-cancel-btn');
    await page.waitForTimeout(600);
    assert.equal(JSON.parse((await readStorage(page)).calls).length, before.length, 'cancel keeps every call');

    await openRowMenuAndDelete(page);
    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(1200);
    const after = JSON.parse((await readStorage(page)).calls);
    assert.equal(after.length, before.length - 1, 'exactly one call removed');
    assert.equal(await page.locator('#call-log tr').count(), shownBefore - 1, 'one row fewer on screen');
    const afterIds = new Set(after.map((call) => call.id));
    const missing = before.filter((call) => !afterIds.has(call.id));
    assert.equal(missing.length, 1, 'only one id is gone');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
