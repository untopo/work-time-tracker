// Different calls can share the same start and end (company reports round to the minute).
// Importing a backup or a CSV must keep them all, and importing again must still add nothing.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser, tmpDir;
before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtt-e2e-'));
});
after(async () => { await browser?.close(); server?.close(); fs.rmSync(tmpDir, { recursive: true, force: true }); });

const seen = (seed) => ({ ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
const call = (id, startIso, minutes, rate = 0.15) => {
  const end = new Date(Date.parse(startIso) + minutes * 60000).toISOString();
  return { id, startTime: startIso, endTime: end, duration: minutes * 60000, rate, rateName: 'GG', earnings: minutes * rate, earned: minutes * rate, rpgEligible: true };
};
// 5 distinct calls, plus 3 calls at the exact same minute and 2 more at another shared minute.
const SAME = '2026-10-05T14:46:00.000Z';
const OTHER = '2026-10-06T09:10:00.000Z';
const manyCalls = () => [
  call('c1', '2026-10-01T10:00:00.000Z', 4), call('c2', '2026-10-02T10:00:00.000Z', 6), call('c3', '2026-10-03T10:00:00.000Z', 2),
  call('c4', SAME, 3), call('c5', SAME, 3), call('c6', SAME, 3), call('c7', OTHER, 5), call('c8', OTHER, 5),
];

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima', acceptDownloads: true });
  await seedStorage(page, baseUrl, seen(seed));
  return { context, page, problems };
}
async function chooseFile(page, file, button = '#data-hub-import-json-btn') {
  await page.click('#settings-toggle');
  await page.waitForTimeout(400);
  await page.click('#open-data-hub-btn');
  await page.waitForTimeout(300);
  const chooser = page.waitForEvent('filechooser');
  await page.click(button);
  await (await chooser).setFiles(file);
  await page.waitForTimeout(900);
}
const savedCalls = async (page) => JSON.parse((await readStorage(page)).calls);

test('a backup with identical-time calls restores every call, and again adds nothing', async () => {
  const file = path.join(tmpDir, 'backup.json');
  fs.writeFileSync(file, JSON.stringify({ calls: manyCalls(), rates: [{ name: 'GG', amount: 0.15 }], dailyGoal: { amount: 40, minutes: 240 }, backupVersion: 2, exportedAt: new Date().toISOString(), settings: {} }));
  const { context, page, problems } = await openApp(makeSeed(0));
  try {
    await chooseFile(page, file);
    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(1500);
    assert.equal((await savedCalls(page)).length, 8, 'all 8 calls restored, none dropped as duplicates');
    await chooseFile(page, file);
    assert.match(await page.innerText('#confirmation-modal'), /Nothing New To Import/);
    assert.equal((await savedCalls(page)).length, 8, 'no duplicates after importing twice');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('a CSV with identical-time rows keeps them all, and importing the same CSV again adds nothing', async () => {
  const csv = ['Date,Start Time,End Time,Rate',
    '2026-10-01,10:00,10:04,0.15', '2026-10-05,14:46,14:49,0.15', '2026-10-05,14:46,14:49,0.15', '2026-10-05,14:46,14:49,0.15',
    '2026-10-06,09:10,09:15,0.15', '2026-10-06,09:10,09:15,0.15'].join('\n');
  const file = path.join(tmpDir, 'report.csv');
  fs.writeFileSync(file, csv);
  const { context, page, problems } = await openApp(makeSeed(0));
  try {
    await chooseFile(page, file, '#data-hub-import-csv-btn');
    await page.waitForSelector('#csv-import-preview-body tr');
    const preview = await page.innerText('#csv-import-preview-modal');
    assert.match(preview, /Same time as another row \(kept\)/);
    assert.doesNotMatch(preview, /Duplicate inside this CSV/);
    await page.evaluate(() => document.getElementById('confirm-csv-import-btn').click());
    await page.waitForTimeout(1200);
    assert.equal((await savedCalls(page)).length, 6, 'all six rows imported');
    assert.match(await page.innerText('#confirmation-modal'), /3 rows had the same time as another row and were kept/);
    await page.evaluate(() => document.getElementById('confirmation-confirm-btn')?.click());
    await page.waitForTimeout(400);

    await chooseFile(page, file, '#data-hub-import-csv-btn');
    await page.waitForSelector('#csv-import-preview-body tr');
    assert.match(await page.innerText('#csv-import-preview-modal'), /Already exists in Call Log/);
    assert.match(await page.innerText('#csv-import-summary'), /Ready\s*0/i);
    await page.waitForTimeout(800);
    assert.equal((await savedCalls(page)).length, 6, 'second import of the same CSV adds nothing');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('a CSV exported by WTT carries a Call ID, so the same call is recognized even if its time was edited', async () => {
  const seed = makeSeed(0);
  seed.calls = JSON.stringify([call('keep-1', '2026-10-01T10:00:00.000Z', 4)]);
  const csv = ['Call Date,Start Time,End Time,Rate Amount,Call ID',
    '2026-10-01,15:10,15:14,0.15,keep-1', // same call as keep-1 (its time was changed since): recognized by id
    '2026-10-02,10:00,10:03,0.15,new-1',
    '2026-10-02,10:00,10:03,0.15,new-2'].join('\n');
  const file = path.join(tmpDir, 'with-ids.csv');
  fs.writeFileSync(file, csv);
  const { context, page, problems } = await openApp(seed);
  try {
    await chooseFile(page, file, '#data-hub-import-csv-btn');
    await page.waitForSelector('#csv-import-preview-body tr');
    assert.match(await page.innerText('#csv-import-summary'), /Ready\s*2/i);
    await page.evaluate(() => document.getElementById('confirm-csv-import-btn').click());
    await page.waitForTimeout(1200);
    const calls = await savedCalls(page);
    assert.deepEqual(calls.map((item) => item.id).sort(), ['keep-1', 'new-1', 'new-2']);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('the Call Log CSV export includes the Call ID column', async () => {
  const { context, page, problems } = await openApp(makeSeed(5));
  try {
    await page.click('.app-nav-link[data-app-nav="call-log"]');
    await page.waitForTimeout(500);
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await page.click('#open-data-hub-btn');
    await page.waitForTimeout(300);
    await page.evaluate(() => document.getElementById('data-hub-export-csv-btn')?.click());
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#export-field-call-id').isChecked(), true, 'Call ID is on by default');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
