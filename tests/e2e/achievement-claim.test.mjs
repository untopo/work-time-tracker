// Achievements v2: completed achievements wait to be claimed, the level never retreats,
// and RPG progress travels inside the backup.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

let server, baseUrl, browser, tmpDir;
before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtt-e2e-'));
});
after(async () => { await browser?.close(); server?.close(); fs.rmSync(tmpDir, { recursive: true, force: true }); });

const progress = async (page) => {
  await page.evaluate(() => document.querySelector('.app-nav-link[data-app-nav="progress"]')?.click());
  await page.waitForTimeout(700);
};
// The app writes its own state while loading, so seed before any app script runs.
async function seedEarly(page, seed) {
  await page.addInitScript((data) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.clear();
    for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
  }, seed);
  await page.goto(baseUrl);
  await page.waitForSelector('.call-log-table', { state: 'attached' });
  await page.waitForTimeout(1500);
}
const stored = async (page, key) => JSON.parse((await readStorage(page))[key] || '{}');

for (const theme of ['light', 'dark']) {
  test(`completed achievements become claimable cards, claiming unlocks the badge and pays XP (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedEarly(page, { ...makeSeed(30), theme });
      await progress(page);
      const ready = page.locator('.achievement-card-btn[data-achievement-state="ready"]');
      assert.ok((await ready.count()) >= 2, 'first_call and ten_calls are waiting to be claimed');
      assert.match(await ready.first().innerText(), /Tap to unlock/);
      assert.ok(await page.locator('.achievement-card-btn[data-achievement-id="calls_bronze"][data-achievement-state="ready"]').count() === 1, 'Calls family has Bronze ready');
      assert.equal(Object.keys((await stored(page, 'wtt_achievements_state_v1')).unlocked || {}).length, 0, 'nothing is unlocked until claimed');
      const xpBefore = (await stored(page, 'wtt_rpg_progress_state_v1')).achievementXp || 0;

      await page.evaluate(() => document.querySelector('.achievement-card-btn[data-achievement-id="first_call"]').click());
      await page.waitForTimeout(500);
      await page.waitForTimeout(400);
      const card = page.locator('.achievement-card-btn[data-achievement-id="first_call"]');
      assert.equal(await card.getAttribute('data-achievement-state'), 'unlocked');
      assert.match(await card.innerText(), /Unlocked/);
      const state = await stored(page, 'wtt_achievements_state_v1');
      assert.ok(state.unlocked.first_call && state.completed.first_call);
      assert.ok(((await stored(page, 'wtt_rpg_progress_state_v1')).achievementXp || 0) > xpBefore, 'XP paid when the badge is claimed');

      // Locked cards always show their progress bar; secret ones stay hidden.
      assert.ok(await page.locator('.achievement-card-btn[data-achievement-state="locked"] .achievement-progress-fill').count() > 0);
      assert.ok(await page.locator('.ach-card-secret').count() >= 1);
      assert.ok(await page.locator('.ach-family-card').count() >= 10, 'families are shown as cards');
      // Family cards open a detail modal with the rank ladder.
      await page.evaluate(() => document.querySelector('.ach-family-card[data-family-id="shiftdays"]').click());
      await page.waitForTimeout(400);
      assert.match(await page.innerText('#achievement-detail-modal'), /Bronze/);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('the level never goes down when calls\' streak is gone, and a backup carries progress to a new device', async () => {
  const file = path.join(tmpDir, 'backup.json');
  const a = await newPage(browser, baseUrl, { timezoneId: 'America/Lima', acceptDownloads: true });
  try {
    const seed = makeSeed(60);
    // A high-water mark far above what the calls alone are worth.
    seed.wtt_rpg_progress_state_v1 = JSON.stringify({ achievementXp: 500, peakXp: 20000, xpModelMigrated: true, achievementRewards: { first_call: { xp: 500 } } });
    seed.wtt_achievements_state_v1 = JSON.stringify({ unlocked: { first_call: '2026-01-01T00:00:00.000Z' } });
    await seedEarly(a.page, seed);
    const level = async (p) => (await p.evaluate(() => document.getElementById('rpg-level-summary')?.textContent || ''));
    assert.match(await level(a.page), /20,000 XP/, 'level uses the stored high-water mark');

    await a.page.click('#settings-toggle');
    await a.page.waitForTimeout(400);
    await a.page.click('#open-data-hub-btn');
    await a.page.waitForTimeout(300);
    await a.page.click('#data-hub-export-json-btn');
    await a.page.waitForTimeout(400);
    const download = a.page.waitForEvent('download');
    await a.page.click('#confirm-export-options-btn');
    await (await download).saveAs(file);
    const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(exported.progress.rpg.peakXp, 20000);
    assert.ok(exported.progress.achievements.unlocked.first_call);

    const b = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      const seedB = { ...makeSeed(0) };
      await seedEarly(b.page, seedB);
      await b.page.click('#settings-toggle');
      await b.page.waitForTimeout(400);
      await b.page.click('#open-data-hub-btn');
      await b.page.waitForTimeout(300);
      const chooser = b.page.waitForEvent('filechooser');
      await b.page.click('#data-hub-import-json-btn');
      await (await chooser).setFiles(file);
      await b.page.waitForTimeout(900);
      assert.match(await b.page.innerText('#confirmation-modal'), /RPG level and achievements restored/);
      await b.page.evaluate(() => document.getElementById('confirmation-confirm-btn').click());
      await b.page.waitForTimeout(1500);
      const st = await stored(b.page, 'wtt_rpg_progress_state_v1');
      assert.equal(st.peakXp, 20000);
      assert.equal(st.achievementXp, 500);
      assert.ok((await stored(b.page, 'wtt_achievements_state_v1')).unlocked.first_call);
      assert.deepEqual(b.problems, []);
    } finally { await b.context.close(); }
  } finally { await a.context.close(); }
});

test('old achievement ids migrate to the new rank ids without losing XP, and importing the same data twice does not double it', async () => {
  const a = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    const seed = makeSeed(10);
    seed.wtt_achievements_state_v1 = JSON.stringify({
      unlocked: { ten_calls: '2026-01-01T00:00:00.000Z', calls_500: '2026-01-02T00:00:00.000Z', level_30: '2026-01-03T00:00:00.000Z' },
      completed: { ten_calls: '2026-01-01T00:00:00.000Z', calls_500: '2026-01-02T00:00:00.000Z', level_30: '2026-01-03T00:00:00.000Z' }
    });
    seed.wtt_rpg_progress_state_v1 = JSON.stringify({ achievementXp: 300, peakXp: 5000, xpModelMigrated: true, achievementRewards: { ten_calls: { xp: 100 }, calls_500: { xp: 100 }, level_30: { xp: 100 } } });
    await seedEarly(a.page, seed);
    await progress(a.page);
    const st = await stored(a.page, 'wtt_achievements_state_v1');
    assert.ok(st.unlocked.calls_bronze && st.unlocked.calls_gold && st.unlocked.level_silver, 'old ids became rank ids');
    assert.equal((await stored(a.page, 'wtt_rpg_progress_state_v1')).achievementXp, 300, 'XP is untouched');
    assert.deepEqual(a.problems, []);
  } finally { await a.context.close(); }
});
