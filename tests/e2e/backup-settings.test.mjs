// A backup carries finished sessions and portable settings, and restoring one never
// overrides what a device already has. Old backups (calls only) keep working.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server;
let baseUrl;
let browser;
let tmpDir;

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtt-e2e-backup-'));
});
after(async () => {
  await browser?.close();
  server?.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const HOUR = 3600000;
const sessions = () => {
  const base = Date.now() - 3 * 24 * HOUR;
  return [0, 1, 2].map((i) => ({
    id: `sess-${i}`, startedAtMs: base + i * 24 * HOUR, endedAtMs: base + i * 24 * HOUR + 4 * HOUR,
    talkMs: 2 * HOUR, idleMs: HOUR, availableMs: 3 * HOUR, utilization: 66.7, callCount: 6, pauseCount: 1, earned: 14.4
  }));
};

// A device that was set up by the user: light theme, notes off, weekly patterns, three sessions.
function configuredSeed() {
  return {
    ...makeSeed(20),
    theme: 'light',
    timeZone: 'America/Lima',
    featureFlags: JSON.stringify({ notes: false, paymentCycles: false, floatingCallControls: true, focusMode: false, rpg: true, uiRefresh: true }),
    patternsMode: 'weekly',
    hourlyHeatmapMetric: 'calls',
    sessionHistoryV1: JSON.stringify(sessions()),
    liveCallNotesHeight: '333'
  };
}

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima', acceptDownloads: true });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
  return { context, page, problems };
}

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

async function importBackup(page, file) {
  await page.click('#open-data-hub-btn');
  await page.waitForTimeout(300);
  const chooser = page.waitForEvent('filechooser');
  await page.click('#data-hub-import-json-btn');
  await (await chooser).setFiles(file);
  await page.waitForTimeout(800);
}

test('the exported backup includes sessions and portable settings, but no device-only values', async () => {
  const { context, page, problems } = await openApp(configuredSeed());
  try {
    const backup = JSON.parse(fs.readFileSync(await exportBackup(page, 'full.json'), 'utf8'));
    assert.equal(backup.backupVersion, 2);
    assert.ok(Date.parse(backup.exportedAt) > 0, 'has an export time');
    assert.deepEqual(backup.sessionHistory.map((entry) => entry.id).sort(), ['sess-0', 'sess-1', 'sess-2']);
    assert.equal(backup.settings.theme, 'light');
    assert.equal(backup.settings.timeZone, 'America/Lima');
    assert.equal(backup.settings.featureFlags.notes, false);
    assert.equal(backup.settings.patternsMode, 'weekly');
    assert.equal(backup.settings.hourlyHeatmapMetric, 'calls');
    assert.equal(backup.settings.liveCallNotesHeight, undefined, 'panel sizes stay on the device');
    assert.equal(backup.settings.wtt_last_backup_at, undefined, 'the last backup time stays on the device');
    assert.equal(backup.calls.length, 20, 'calls are exported as before');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('restoring on a new device brings back sessions and settings', async () => {
  const source = await openApp(configuredSeed());
  let file;
  try {
    file = await exportBackup(source.page, 'roundtrip.json');
  } finally {
    await source.context.close();
  }

  // A fresh device: calls are empty and no preference has been chosen yet.
  const fresh = makeSeed(0);
  delete fresh.theme;
  delete fresh.timeZone;
  delete fresh.featureFlags;
  const { context, page } = await openApp(fresh);
  try {
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, file);
    assert.match(await page.innerText('#confirmation-modal'), /3 new sessions/, 'the summary mentions the sessions');
    assert.match(await page.innerText('#confirmation-modal'), /settings restored/, 'the summary mentions the settings');
    await page.click('#confirmation-confirm-btn');
    await page.waitForLoadState('load');
    await page.waitForSelector('.call-log-table', { state: 'attached' });
    await page.waitForTimeout(1500);

    const stored = await readStorage(page);
    assert.equal(stored.theme, 'light');
    assert.equal(JSON.parse(stored.featureFlags).notes, false);
    assert.equal(stored.patternsMode, 'weekly');
    assert.equal(stored.hourlyHeatmapMetric, 'calls');
    assert.deepEqual(JSON.parse(stored.sessionHistoryV1).map((entry) => entry.id).sort(), ['sess-0', 'sess-1', 'sess-2']);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-theme')), 'light', 'the restored theme is applied');
    assert.equal(JSON.parse(stored.calls).length, 20, 'calls came back too');
  } finally {
    await context.close();
  }
});

test('importing on a device that is already set up never overrides its choices', async () => {
  const source = await openApp(configuredSeed());
  let file;
  try {
    file = await exportBackup(source.page, 'no-override.json');
  } finally {
    await source.context.close();
  }

  const local = { ...makeSeed(0), theme: 'dark', hourlyHeatmapMetric: 'minutes', patternsMode: 'monthly', sessionHistoryV1: JSON.stringify([{ ...sessions()[0], id: 'mine-0', startedAtMs: 1700000000000, endedAtMs: 1700003600000 }]) };
  const { context, page } = await openApp(local);
  try {
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, file);
    assert.doesNotMatch(await page.innerText('#confirmation-modal'), /settings restored/, 'nothing is said about settings that are not touched');
    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(1800);

    const stored = await readStorage(page);
    assert.equal(stored.theme, 'dark', 'theme kept');
    assert.equal(stored.hourlyHeatmapMetric, 'minutes', 'heatmap choice kept');
    assert.equal(stored.patternsMode, 'monthly', 'patterns choice kept');
    const ids = JSON.parse(stored.sessionHistoryV1).map((entry) => entry.id).sort();
    assert.deepEqual(ids, ['mine-0', 'sess-0', 'sess-1', 'sess-2'], 'own session kept, new ones added');
  } finally {
    await context.close();
  }
});

test('an older backup with only calls still imports, and a second import adds nothing', async () => {
  const oldBackup = path.join(tmpDir, 'old-format.json');
  const seed = makeSeed(15);
  fs.writeFileSync(oldBackup, JSON.stringify({
    calls: JSON.parse(seed.calls), rates: JSON.parse(seed.rates), dailyGoal: JSON.parse(seed.dailyGoal),
    paymentCyclesEnabled: false, paymentCycles: []
  }));
  const { context, page, problems } = await openApp(makeSeed(0));
  try {
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, oldBackup);
    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(1500);
    assert.equal(JSON.parse((await readStorage(page)).calls).length, 15);

    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await importBackup(page, oldBackup);
    assert.match(await page.innerText('#confirmation-modal'), /Nothing New To Import/);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
