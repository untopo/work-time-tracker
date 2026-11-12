// Regression tests for destructive actions. These tests exercise the real Settings UI
// and verify both the cancel path and the exact data boundaries of each confirmed action.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
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

const CALL_RELATED_KEYS = [
  'calls',
  'rates',
  'dailyGoal',
  'paymentCyclesEnabled',
  'paymentCycles',
  'paymentCycles_backup',
  'theme',
  'timeZone',
  'featureFlags',
  'lastSelectedRate',
  'sessionHistoryV1',
  'wtt_session_rpg_stats_v1',
  'wtt_rpg_progress_state_v1',
  'wtt_achievements_state_v1',
  'wtt_daily_quests_state_v1',
];

function makeDestructiveActionSeed() {
  return {
    ...makeSeed(24),
    paymentCyclesEnabled: 'true',
    featureFlags: JSON.stringify({
      notes: true,
      paymentCycles: true,
      floatingCallControls: true,
      focusMode: false,
      rpg: true,
      uiRefresh: true,
    }),
    paymentCycles: JSON.stringify([{
      id: 'cycle-preserve-1',
      startDate: '2026-10-01T05:00:00.000Z',
      endDate: '2026-10-14T05:00:00.000Z',
      payDate: '2026-10-20T05:00:00.000Z',
    }]),
    paymentCycles_backup: JSON.stringify([{
      id: 'cycle-backup-1',
      startDate: '2026-09-16T05:00:00.000Z',
      endDate: '2026-09-30T05:00:00.000Z',
      payDate: '2026-10-06T05:00:00.000Z',
    }]),
    sessionHistoryV1: JSON.stringify([{
      id: 'session-history-1',
      startTime: '2026-10-20T13:00:00.000Z',
      endTime: '2026-10-20T14:00:00.000Z',
      talkMs: 45 * 60 * 1000,
      idleMs: 15 * 60 * 1000,
      availableMs: 60 * 60 * 1000,
      utilization: 75,
    }]),
    wtt_session_rpg_stats_v1: JSON.stringify({ sessionsCompleted: 4, totalTalkMs: 9000000 }),
    wtt_rpg_progress_state_v1: JSON.stringify({ achievementXp: 120, dailyQuestXp: 30, streakShields: 1 }),
    wtt_achievements_state_v1: JSON.stringify({ unlocked: { first_call: '2026-10-01' } }),
    wtt_daily_quests_state_v1: JSON.stringify({
      activeDayKey: '2026-10-20',
      activeQuestIds: ['dq_calls_2'],
      completedByDay: {},
    }),
  };
}

async function openSettingsDangerZone(page) {
  await page.click('#settings-toggle');
  await page.waitForTimeout(500);
  await page.locator('#reset-calls').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#reset-calls').isVisible(), true, 'Delete calls action is visible in Danger Zone');
}

async function openSeededApp(seed = makeDestructiveActionSeed()) {
  const { context, page, problems } = await newPage(browser, baseUrl);
  await seedStorage(page, baseUrl, seed);
  await openSettingsDangerZone(page);
  return { context, page, problems, seed };
}

async function snapshotKeys(page, keys = CALL_RELATED_KEYS) {
  const storage = await readStorage(page);
  return Object.fromEntries(keys.map((key) => [key, Object.hasOwn(storage, key) ? storage[key] : null]));
}

test('cancelling Delete calls leaves every call and preserved data unchanged', async () => {
  const { context, page, problems } = await openSeededApp();
  try {
    const before = await snapshotKeys(page);
    await page.click('#reset-calls');
    assert.equal(await page.locator('#confirmation-modal').isVisible(), true, 'confirmation is shown');
    assert.match(await page.locator('#confirmation-modal-message').innerText(), /permanently delete all call history/i);

    await page.click('#confirmation-cancel-btn');
    await page.waitForTimeout(500);

    assert.deepEqual(await snapshotKeys(page), before, 'cancel must not change calls, settings, cycles, or related history');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('confirming Delete calls removes call history and call-derived progress but preserves settings and payment cycles', async () => {
  const { context, page, problems, seed } = await openSeededApp();
  try {
    await page.click('#reset-calls');
    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(1200);

    const stored = await readStorage(page);
    assert.deepEqual(parse(stored.calls), [], 'call history is empty');
    assert.deepEqual(parse(stored.rates), parse(seed.rates), 'rates are preserved');
    assert.deepEqual(parse(stored.dailyGoal), parse(seed.dailyGoal), 'daily goal is preserved');
    assert.equal(stored.paymentCyclesEnabled, seed.paymentCyclesEnabled, 'payment cycle setting is preserved');
    assert.deepEqual(parse(stored.paymentCycles), parse(seed.paymentCycles), 'payment cycles are preserved');
    assert.deepEqual(parse(stored.paymentCycles_backup), parse(seed.paymentCycles_backup), 'payment cycle recovery copy is preserved');
    assert.equal(stored.theme, seed.theme, 'theme is preserved');
    assert.equal(stored.timeZone, seed.timeZone, 'time zone is preserved');
    assert.deepEqual(parse(stored.featureFlags), parse(seed.featureFlags), 'feature preferences are preserved');

    assert.deepEqual(parse(stored.sessionHistoryV1), [], 'session history associated with call-derived progress is cleared');
    for (const key of [
      'wtt_session_rpg_stats_v1',
      'wtt_rpg_progress_state_v1',
      'wtt_achievements_state_v1',
    ]) {
      assert.equal(Object.hasOwn(stored, key), false, `${key} is cleared`);
    }
    const freshQuestState = parse(stored.wtt_daily_quests_state_v1);
    assert.notEqual(freshQuestState.activeDayKey, '2026-10-20', 'old daily quest rotation is discarded');
    assert.deepEqual(freshQuestState.completedByDay?.['2026-10-20'] || {}, {}, 'old daily quest completions are discarded');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('cancelling Reset all data leaves the complete seeded data set unchanged', async () => {
  const { context, page, problems } = await openSeededApp();
  try {
    const before = await snapshotKeys(page);
    await page.click('#reset-all');
    assert.equal(await page.locator('#confirmation-modal').isVisible(), true, 'confirmation is shown');
    assert.match(await page.locator('#confirmation-modal-message').innerText(), /permanently delete all local data/i);
    assert.equal(await page.locator('#confirmation-confirm-btn').isDisabled(), true, 'typed confirmation is required');

    await page.click('#confirmation-cancel-btn');
    await page.waitForTimeout(500);

    assert.deepEqual(await snapshotKeys(page), before, 'cancel must not change any protected data');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('confirming Reset all data requires RESET and clears the saved calls, rates, goals, cycles, and preferences', async () => {
  const { context, page, problems } = await openSeededApp();
  try {
    await page.click('#reset-all');
    const confirm = page.locator('#confirmation-confirm-btn');
    assert.equal(await confirm.isDisabled(), true, 'cannot confirm before typing RESET');

    await page.fill('#confirmation-verify-input', 'RESET');
    assert.equal(await confirm.isDisabled(), false, 'exact RESET enables confirmation');
    await confirm.click();
    await page.waitForTimeout(1200);

    const stored = await readStorage(page);
    assert.deepEqual(parse(stored.calls), [], 'calls are cleared');
    assert.deepEqual(parse(stored.rates), [], 'rates are cleared');
    assert.deepEqual(parse(stored.dailyGoal), { amount: 0, minutes: 0 }, 'daily goal is reset');
    assert.equal(stored.paymentCyclesEnabled, 'false', 'payment cycles are disabled');
    assert.deepEqual(parse(stored.paymentCycles), [], 'payment cycles are cleared');

    for (const key of [
      'theme',
      'timeZone',
      'featureFlags',
      'lastSelectedRate',
      'wtt_session_rpg_stats_v1',
      'wtt_rpg_progress_state_v1',
      'wtt_achievements_state_v1',
    ]) {
      assert.equal(Object.hasOwn(stored, key), false, `${key} is cleared`);
    }
    assert.deepEqual(parse(stored.sessionHistoryV1), [], 'session history is empty');
    const freshQuestState = parse(stored.wtt_daily_quests_state_v1);
    assert.notEqual(freshQuestState.activeDayKey, '2026-10-20', 'old daily quest rotation is discarded');
    assert.deepEqual(freshQuestState.completedByDay?.['2026-10-20'] || {}, {}, 'old daily quest completions are discarded');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});


async function importJsonText(page, fileName, contents) {
  await page.click('#open-data-hub-btn');
  await page.waitForTimeout(300);
  const chooser = page.waitForEvent('filechooser');
  await page.click('#data-hub-import-json-btn');
  await (await chooser).setFiles({
    name: fileName,
    mimeType: 'application/json',
    buffer: Buffer.from(contents, 'utf8'),
  });
  await page.waitForSelector('#confirmation-modal', { state: 'visible' });
  await page.waitForTimeout(300);
}

test('a syntactically invalid JSON backup is rejected without changing saved data', async () => {
  const { context, page, problems } = await openSeededApp();
  try {
    const before = await snapshotKeys(page);
    await importJsonText(page, 'broken-backup.json', '{ "calls": [ ');
    assert.equal(await page.locator('#confirmation-modal-title').innerText().then((value) => value.includes('Import Failed')), true);
    assert.match(await page.locator('#confirmation-modal-message').innerText(), /valid JSON file from this app/i);

    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(500);
    assert.deepEqual(await snapshotKeys(page), before, 'rejected JSON must not change any saved data');
    assert.deepEqual(problems.filter((problem) => problem.startsWith('pageerror:')), [], 'handled parse errors must not crash the app');
  } finally {
    await context.close();
  }
});

test('valid JSON with no recognized backup data is a no-op and preserves existing records', async () => {
  const { context, page, problems } = await openSeededApp();
  try {
    const before = await snapshotKeys(page);
    await importJsonText(page, 'unrecognized-backup.json', JSON.stringify({
      backupVersion: 1,
      data: { calls: [], rates: [] },
    }));
    assert.match(await page.locator('#confirmation-modal-title').innerText(), /Nothing New To Import/i);
    assert.match(await page.locator('#confirmation-modal-message').innerText(), /does not contain any new calls/i);

    await page.click('#confirmation-confirm-btn');
    await page.waitForTimeout(500);
    assert.deepEqual(await snapshotKeys(page), before, 'an unrecognized backup must not change existing data');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
