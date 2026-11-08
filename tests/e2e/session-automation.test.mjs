// Optional session automation: off by default, starts/pauses/ends sessions from real call times.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
  return { context, page, problems };
}
const saved = async (page, key) => JSON.parse((await readStorage(page))[key] || 'null');
const MIN = 60000;
const activeSession = (startAgo, extra = {}) => JSON.stringify({
  active: true, paused: false, startMs: Date.now() - startAgo, lastActivityMs: Date.now() - startAgo,
  pausedTotalMs: 0, pauseStartedMs: 0, pauseCount: 0, pauseLog: [], origin: 'manual', ...extra
});
function withCallInSession(startAgo) {
  const seed = makeSeed(0);
  const start = Date.now() - startAgo + 5 * MIN;
  seed.calls = JSON.stringify([{
    id: 'in-session', startTime: new Date(start).toISOString(), endTime: new Date(start + 10 * MIN).toISOString(),
    duration: 10 * MIN, rate: 0.12, rateName: 'Propio', earnings: 1.2, earned: 1.2, notes: '', rpgEligible: true
  }]);
  return seed;
}
const ON = JSON.stringify({ enabled: true, pauseAfterMin: 30, endAfterMin: 90 });

test('off by default: an old session is left alone and the settings show it off', async () => {
  const { context, page, problems } = await openApp({ ...makeSeed(5), sessionTrackerStateV1: activeSession(5 * 60 * MIN) });
  try {
    await page.waitForTimeout(1500);
    const state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.active, true);
    assert.equal(state.paused, false);
    assert.equal(await page.$eval('#session-automation-toggle', (el) => el.checked), false);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('on: a session quiet for 40 minutes is paused at minute 30, marked auto', async () => {
  const { context, page, problems } = await openApp({
    ...makeSeed(5), sessionAutomationV1: ON, sessionTrackerStateV1: activeSession(40 * MIN)
  });
  try {
    await page.waitForTimeout(1500);
    const state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.paused, true);
    assert.equal(state.pauseBy, 'auto');
    const quiet = state.pauseStartedMs - state.startMs;
    assert.ok(Math.abs(quiet - 30 * MIN) < 2000, 'stamped at the 30 minute mark, not at reopen time');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('on: a long absence ends the session at the pause start and saves it when it had calls', async () => {
  const { context, page, problems } = await openApp({
    ...withCallInSession(5 * 60 * MIN), sessionAutomationV1: ON, sessionTrackerStateV1: activeSession(5 * 60 * MIN)
  });
  try {
    await page.waitForTimeout(1500);
    const state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.active, false);
    const history = await saved(page, 'sessionHistoryV1');
    assert.equal(history.length, 1);
    assert.equal(history[0].endedBy, 'auto');
    assert.ok(Math.abs(history[0].endedAtMs - (history[0].startedAtMs + 30 * MIN)) < 2000, 'ends where the pause began');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('on: a long absence with no calls closes the session without saving it', async () => {
  const { context, page, problems } = await openApp({
    ...makeSeed(0), sessionAutomationV1: ON, sessionTrackerStateV1: activeSession(5 * 60 * MIN)
  });
  try {
    await page.waitForTimeout(1500);
    const state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.active, false);
    const history = (await saved(page, 'sessionHistoryV1')) || [];
    assert.equal(history.length, 0);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('settings: turning it on persists, shows the options and stays in the backup list', async () => {
  const { context, page, problems } = await openApp(makeSeed(2));
  try {
    await page.click('#settings-toggle');
    await page.waitForSelector('#st-features', { state: 'visible' });
    await page.$eval('#session-automation-toggle', (el) => el.click());
    await page.waitForTimeout(300);
    assert.equal(await page.$eval('#session-automation-options', (el) => el.classList.contains('hidden')), false);
    await page.selectOption('#session-automation-pause-select', '45');
    await page.waitForTimeout(300);
    const settings = await saved(page, 'sessionAutomationV1');
    assert.equal(settings.enabled, true);
    assert.equal(settings.pauseAfterMin, 45);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
