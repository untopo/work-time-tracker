// End-to-end safety net. Opens the real app in Chromium and checks the things that
// must never break: saved data survives, calls are recorded, every screen opens.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const NAV_VIEWS = ['work', 'call-log', 'analytics', 'progress', 'resources'];
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

async function withPage(fn, seed) {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    if (seed) await seedStorage(page, baseUrl, seed);
    await fn(page, problems);
  } finally {
    await context.close();
  }
}

const parse = (value) => JSON.parse(value);
const idsOf = (calls) => calls.map((call) => call.id).sort();

test('a brand-new user (empty storage) loads without errors', async () => {
  await withPage(async (page, problems) => {
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1500);
    assert.ok(await page.locator('#start-call-btn').isVisible(), 'Start call button should be visible');
    assert.deepEqual(problems, []);
  });
});

test('existing saved data loads and every screen opens without errors', async () => {
  const seed = makeSeed();
  await withPage(async (page, problems) => {
    const rows = await page.locator('.call-log-table tbody tr').count();
    assert.ok(rows > 0, 'Call log should list the saved calls');
    for (const view of NAV_VIEWS) {
      await page.click(`.app-nav-link[data-app-nav="${view}"]`);
      await page.waitForTimeout(400);
      assert.ok(await page.locator(`#view-${view}`).isVisible(), `View "${view}" should be visible`);
    }
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    assert.ok(await page.locator('#view-settings').isVisible(), 'Settings should be visible');
    assert.deepEqual(problems, []);
  }, seed);
});

test('saved calls, rates and goals are identical after reloading', async () => {
  const seed = makeSeed();
  await withPage(async (page) => {
    const before = await readStorage(page);
    await page.reload();
    await page.waitForTimeout(1500);
    const after = await readStorage(page);

    assert.deepEqual(idsOf(parse(after.calls)), idsOf(parse(seed.calls)), 'same calls, none lost');
    const original = Object.fromEntries(parse(seed.calls).map((call) => [call.id, call]));
    for (const call of parse(after.calls)) {
      const saved = original[call.id];
      assert.equal(call.notes, saved.notes, `notes of ${call.id}`);
      assert.equal(call.rateName, saved.rateName, `rate name of ${call.id}`);
      assert.ok(Math.abs(call.earnings - saved.earnings) < 0.011, `earnings of ${call.id}`);
      assert.ok(Math.abs(call.duration - saved.duration) < 1000, `duration of ${call.id}`);
    }
    assert.deepEqual(parse(after.rates), parse(seed.rates), 'rates');
    assert.deepEqual(parse(after.dailyGoal), parse(seed.dailyGoal), 'daily goal');
    assert.equal(after.theme, seed.theme, 'theme');
    assert.equal(before.lastSelectedRate, after.lastSelectedRate, 'last selected rate');
  }, seed);
});

test('a live call is saved with its duration and never overwrites old calls', async () => {
  const seed = makeSeed();
  await withPage(async (page, problems) => {
    await page.click('#start-call-btn');
    await page.waitForTimeout(2300);
    assert.notEqual((await page.innerText('#live-call-timer')).trim(), '00:00:00', 'timer should be running');
    await page.click('#end-call-btn');
    await page.waitForTimeout(1500);

    const calls = parse((await readStorage(page)).calls);
    const oldIds = idsOf(parse(seed.calls));
    assert.equal(calls.length, oldIds.length + 1, 'exactly one new call');
    assert.deepEqual(idsOf(calls.filter((call) => oldIds.includes(call.id))), oldIds, 'old calls untouched');
    const fresh = calls.find((call) => !oldIds.includes(call.id));
    assert.ok(fresh.duration >= 2000, `new call lasted at least 2s (got ${fresh.duration} ms)`);
    assert.ok(fresh.earnings >= 0, 'earnings is a number');

    await page.reload();
    await page.waitForTimeout(1500);
    assert.equal(parse((await readStorage(page)).calls).length, oldIds.length + 1, 'still saved after reload');
    assert.deepEqual(problems, []);
  }, seed);
});

test('a running work session comes back after closing and reopening the page', async () => {
  await withPage(async (page) => {
    await page.click('[data-work-panel-toggle="session-tracker-card"]'); // panels are folded by default
    await page.click('#session-start-btn');
    await page.waitForTimeout(2200);
    const state = await readStorage(page);
    assert.ok(state.sessionTrackerStateV1, 'session state is saved while running');
    assert.equal(parse(state.sessionTrackerStateV1).active, true);

    await page.reload();
    await page.waitForTimeout(2000);
    const after = await readStorage(page);
    assert.equal(parse(after.sessionTrackerStateV1).active, true, 'session still active');
    assert.notEqual((await page.innerText('#session-live-elapsed')).trim(), '00:00:00', 'elapsed time kept');
  }, makeSeed(20));
});

test('changing settings never touches saved calls', async () => {
  const seed = makeSeed();
  await withPage(async (page, problems) => {
    await page.click('#settings-toggle');
    await page.waitForTimeout(400);
    await page.locator('label:has(#feature-notes-toggle)').click();
    await page.locator('label:has(#feature-focus-mode-toggle)').click();
    await page.locator('label:has(#feature-analytics-toggle)').click();
    await page.waitForTimeout(500);

    const stored = await readStorage(page);
    assert.deepEqual(idsOf(parse(stored.calls)), idsOf(parse(seed.calls)), 'calls untouched by settings');
    assert.equal(stored.wtt_analytics_enabled, '0', 'analytics opt-out is remembered');
    assert.deepEqual(problems, []);

    await page.reload();
    await page.waitForTimeout(1500);
    assert.equal((await readStorage(page)).wtt_analytics_enabled, '0', 'opt-out survives reload');
  }, seed);
});
