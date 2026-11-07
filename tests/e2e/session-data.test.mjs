// Work sessions remember each pause and who started and ended them, and the history keeps
// every finished session. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
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

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
  return { context, page, problems };
}

const saved = async (page, key) => JSON.parse((await readStorage(page))[key] || 'null');

test('a manual pause is saved with its start, end and "manual", and ends up in the finished session', async () => {
  const { context, page, problems } = await openApp(makeSeed(5));
  try {
    await page.click('#session-start-btn');
    await page.waitForTimeout(1200);
    await page.click('#session-pause-btn');
    await page.waitForTimeout(1500);
    let state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.paused, true);
    assert.equal(state.pauseBy, 'manual');
    assert.equal(state.origin, 'manual');

    await page.click('#session-pause-btn'); // resume
    await page.waitForTimeout(600);
    state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.paused, false);
    assert.equal(state.pauseLog.length, 1);
    assert.ok(state.pauseLog[0].endMs > state.pauseLog[0].startMs, 'the pause has a length');
    assert.equal(state.pauseLog[0].by, 'manual');
    assert.equal(state.pausedTotalMs, state.pauseLog[0].endMs - state.pauseLog[0].startMs, 'same total the screen shows');

    await page.click('#session-pause-btn'); // pause again and end while paused
    await page.waitForTimeout(800);
    await page.click('#session-end-btn');
    await page.waitForTimeout(800);

    const history = await saved(page, 'sessionHistoryV1');
    assert.equal(history.length, 1);
    const entry = history[0];
    assert.equal(entry.pauses.length, 2, 'both pauses are kept, also the one open at the end');
    assert.equal(entry.pauseCount, 2);
    assert.equal(entry.startedBy, 'manual');
    assert.equal(entry.endedBy, 'manual');
    assert.ok(entry.pauses.every((pause) => pause.startMs >= entry.startedAtMs && pause.endMs <= entry.endedAtMs), 'pauses sit inside the session');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('a pause survives closing and reopening the page, and starting a call resumes and records it', async () => {
  const { context, page, problems } = await openApp(makeSeed(5));
  try {
    await page.click('#session-start-btn');
    await page.waitForTimeout(800);
    await page.click('#session-pause-btn');
    await page.waitForTimeout(1200);
    await page.reload();
    await page.waitForSelector('.call-log-table', { state: 'attached' });
    await page.waitForTimeout(1200);
    let state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.paused, true, 'still paused after reload');
    assert.ok(state.pauseStartedMs > 0);

    await page.click('#start-call-btn'); // starting a call resumes the session, as before
    await page.waitForTimeout(800);
    state = await saved(page, 'sessionTrackerStateV1');
    assert.equal(state.paused, false);
    assert.equal(state.pauseLog.length, 1, 'the pause that just ended was recorded');
    await page.click('#end-call-btn');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('the history keeps more than 60 sessions and the old ones are untouched', async () => {
  const day = 86400000;
  const base = Date.now() - 200 * day;
  const sessions = Array.from({ length: 100 }, (_, i) => ({
    id: `old-${i}`, startedAtMs: base + i * day, endedAtMs: base + i * day + 3600000,
    talkMs: 1800000, idleMs: 1800000, availableMs: 3600000, utilization: 50, callCount: 4, pauseCount: 1, earned: 5
  }));
  const { context, page, problems } = await openApp({ ...makeSeed(5), sessionHistoryV1: JSON.stringify(sessions) });
  try {
    await page.click('#session-start-btn');
    await page.waitForTimeout(800);
    await page.click('#session-end-btn');
    await page.waitForTimeout(800);
    const history = await saved(page, 'sessionHistoryV1');
    assert.equal(history.length, 101, 'nothing was dropped');
    const kept = history.filter((entry) => String(entry.id).startsWith('old-'));
    assert.equal(kept.length, 100);
    assert.deepEqual(kept.find((entry) => entry.id === 'old-7').pauses, [], 'older sessions get no invented pauses');
    assert.equal(kept.find((entry) => entry.id === 'old-7').pauseCount, 1, 'their pause count is kept');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
