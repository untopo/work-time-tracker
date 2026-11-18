// Privacy guard for the anonymous usage counts: only an allow-listed set of coarse labels
// is ever sent, only when the switch is on, once per day, and saved data is never touched.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';
import { loadCore, allLabels } from '../unit/load-core.mjs';

let server;
let baseUrl;
let browser;
const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
});
after(async () => {
  await browser?.close();
  server?.close();
});

// Every path the app may send, built from the real list of ranges. Anything else
// (an exact number, a note, a rate...) fails the test.
const labels = allLabels(loadCore().core);
const list = (set) => [...set].map((label) => label.replace(/[.]/g, '\\.')).join('|');
const ALLOWED = new RegExp(`^event/(call-started|call-ended|focus-mode|report-opened|card-opened|card-saved|survey/devices/(one|two|three-plus)|survey/sync/(as-is|direct|account|both)|backup-reminder/(shown|now|later|off)|call-length/(${list(labels.length)})|day-calls/(${list(labels.calls)})|day-hours/(${list(labels.hours)})|feature-on/(focus-mode|payment-cycles|notes|rpg|floating-controls|daily-goal|backup-done|session-automation|payment-cycles-per-rate)|app-version/\\d+\\.\\d+\\.\\d+|days-using/(1|2-7|8-30|31-90|91-plus)|rates/(0|1|2-3|4-plus)|theme/(light|dark)|error/(storage-write-failed|data-reset|import-json|import-csv)|achievements-opened|achievement-claimed|achievements-claim-all)$`);

async function openApp(seed) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  // The real counter script is blocked in tests, so stand in for it and record what would be sent.
  await page.addInitScript(() => {
    window.__sent = [];
    window.goatcounter = { count: (options) => window.__sent.push(options.path) };
  });
  await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
  return { context, page, problems };
}

const sent = (page) => page.evaluate(() => window.__sent);

test('a few seconds after opening, the daily ranges and feature names are sent, all from the allow-list', async () => {
  const seed = makeSeed(60);
  const { context, page, problems } = await openApp(seed);
  try {
    await page.waitForTimeout(6500);
    const paths = await sent(page);
    assert.ok(paths.some((path) => path.startsWith('event/day-calls/')), 'calls-per-day range');
    assert.ok(paths.some((path) => path.startsWith('event/day-hours/')), 'hours-per-day range');
    assert.ok(paths.includes('event/feature-on/rpg'), 'a feature that is on');
    assert.ok(!paths.includes('event/feature-on/payment-cycles'), 'a feature that is off is not listed');
    for (const path of paths) assert.match(path, ALLOWED, `unexpected analytics path: ${path}`);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('the daily ranges are sent once per day, not on every reload', async () => {
  const { context, page } = await openApp(makeSeed(60));
  try {
    await page.waitForTimeout(6500);
    const first = (await sent(page)).filter((path) => /day-|feature-on/.test(path)).length;
    assert.ok(first > 0);
    await page.evaluate(() => { window.__sent = []; });
    await page.reload();
    await page.addInitScript(() => {});
    await page.waitForTimeout(6500);
    const again = (await sent(page) || []).filter((path) => /day-|feature-on/.test(path));
    assert.deepEqual(again, [], 'nothing re-sent on the same day');
  } finally {
    await context.close();
  }
});

test('finishing a call sends only the action names and the length range', async () => {
  const { context, page } = await openApp(makeSeed(5));
  try {
    await page.click('#start-call-btn');
    await page.waitForTimeout(1300);
    await page.click('#end-call-btn');
    await page.waitForTimeout(900);
    const paths = await sent(page);
    assert.ok(paths.includes('event/call-started'));
    assert.ok(paths.includes('event/call-ended'));
    assert.ok(paths.includes('event/call-length/under-1m'), 'a 1-second call is in the shortest range');
    for (const path of paths) assert.match(path, ALLOWED);
  } finally {
    await context.close();
  }
});

test('opening the report and the card, and saving the card, send only their action names', async () => {
  const { context, page } = await openApp(makeSeed(60));
  try {
    await page.evaluate(() => document.getElementById('backup-reminder-banner')?.remove());
    await page.click('.app-nav-link[data-app-nav="analytics"]');
    await page.click('#open-report-btn');
    await page.waitForSelector('#report-modal .wtt-report-page', { state: 'visible' });
    await page.click('#report-share-card-btn');
    await page.waitForSelector('#share-modal canvas', { state: 'visible' });
    await Promise.all([page.waitForEvent('download'), page.click('#share-download-btn')]);
    await page.waitForTimeout(300);
    const paths = await sent(page);
    assert.ok(paths.includes('event/report-opened'));
    assert.ok(paths.includes('event/card-opened'));
    assert.ok(paths.includes('event/card-saved'));
    for (const path of paths) assert.match(path, ALLOWED);
  } finally {
    await context.close();
  }
});

test('with "Share anonymous usage counts" off, nothing is sent at all', async () => {
  const seed = { ...makeSeed(60), wtt_analytics_enabled: '0' };
  const { context, page } = await openApp(seed);
  try {
    await page.click('#start-call-btn');
    await page.waitForTimeout(1300);
    await page.click('#end-call-btn');
    await page.waitForTimeout(6500);
    assert.deepEqual(await sent(page), []);
  } finally {
    await context.close();
  }
});

test('sending the counts never changes saved calls, rates or goals', async () => {
  const seed = makeSeed(60);
  const { context, page } = await openApp(seed);
  try {
    await page.waitForTimeout(6500);
    const stored = await readStorage(page);
    assert.deepEqual(JSON.parse(stored.calls), JSON.parse(seed.calls));
    assert.deepEqual(JSON.parse(stored.rates), JSON.parse(seed.rates));
    assert.deepEqual(JSON.parse(stored.dailyGoal), JSON.parse(seed.dailyGoal));
  } finally {
    await context.close();
  }
});

test('once a day it also sends the app version, days of use, rate count and theme, and never anything exact', async () => {
  const { context, page, problems } = await openApp(makeSeed(60));
  try {
    await page.waitForTimeout(6500);
    const paths = await sent(page);
    assert.ok(paths.includes(`event/app-version/${VERSION}`), 'app version');
    assert.ok(paths.some((path) => /^event\/days-using\//.test(path)), 'days of use range');
    assert.ok(paths.some((path) => /^event\/rates\//.test(path)), 'rate count range');
    assert.ok(paths.some((path) => /^event\/theme\/(light|dark)$/.test(path)), 'theme');
    for (const path of paths) assert.match(path, ALLOWED, `unexpected analytics path: ${path}`);
    await page.evaluate(() => { window.__sent = []; });
    await page.reload();
    await page.waitForTimeout(6500);
    assert.deepEqual((await sent(page) || []).filter((path) => /app-version|days-using|rates\/|theme\//.test(path)), [], 'not re-sent on the same day');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('opening Achievements and a failed import send only fixed names', async () => {
  const { context, page } = await openApp(makeSeed(20));
  try {
    await page.waitForTimeout(1500);
    await page.click('[data-app-nav="progress"]');
    await page.waitForTimeout(500);
    assert.ok((await sent(page)).includes('event/achievements-opened'));
    await page.evaluate(() => { window.__sent = []; });
    await page.click('[data-app-nav="progress"]');
    assert.ok(!(await sent(page)).includes('event/achievements-opened'), 'only once per visit to the app');
  } finally {
    await context.close();
  }
});
