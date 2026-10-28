// The optional sync survey: it asks once, sends only fixed anonymous names, never touches saved data,
// and follows the app theme. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

let server;
let baseUrl;
let browser;
const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const DAY = 86400000;
const STATE_KEY = 'wtt_sync_survey_state';

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
});
after(async () => {
  await browser?.close();
  server?.close();
});

async function openApp(overrides = {}, calls = 5) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  const posts = [];
  // Stand in for the real counter script, and for the message service, so nothing leaves the test.
  await page.addInitScript(() => {
    window.__sent = [];
    window.goatcounter = { count: (options) => window.__sent.push(options.path) };
  });
  await page.route('https://formspree.io/**', (route) => {
    posts.push({ url: route.request().url(), body: route.request().postData() || '' });
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  const seed = { ...makeSeed(calls), ...overrides, [`releaseSpotlightSeen:${VERSION}`]: '1' };
  await seedStorage(page, baseUrl, seed);
  return { context, page, problems, posts, seed };
}
const surveyPaths = (page) => page.evaluate(() => window.__sent.filter((p) => p.startsWith('event/survey/')));
const banner = (page, timeout = 12000) => page.waitForSelector('#sync-survey-banner', { state: 'visible', timeout });
const pick = (page, text) => page.click(`#sync-survey-dialog >> text=${text}`);

test('the banner appears for someone with saved calls, and never for a new user or when counts are off', async () => {
  const a = await openApp();
  try {
    await banner(a.page);
    assert.match(await a.page.innerText('#sync-survey-banner'), /Help decide a future feature/);
    assert.deepEqual(a.problems, []);
  } finally { await a.context.close(); }

  const empty = await openApp({}, 0);
  try {
    await empty.page.waitForTimeout(6500);
    assert.equal(await empty.page.locator('#sync-survey-banner').count(), 0, 'no calls yet, no survey');
  } finally { await empty.context.close(); }

  const off = await openApp({ wtt_analytics_enabled: '0' });
  try {
    await off.page.waitForTimeout(6500);
    assert.equal(await off.page.locator('#sync-survey-banner').count(), 0, 'counts off, no survey');
  } finally { await off.context.close(); }
});

test('answering sends only the two fixed names, the comment goes to the message service, and it never asks again', async () => {
  const { context, page, problems, posts, seed } = await openApp();
  try {
    const before = await readStorage(page);
    await banner(page);
    await page.click('[data-survey-action="take"]');
    await page.waitForSelector('#sync-survey-dialog', { state: 'visible' });
    await page.click('#survey-next');
    assert.equal(await page.isDisabled('#survey-next'), true, 'needs an answer first');
    await pick(page, 'Two devices');
    await page.click('#survey-next');
    await pick(page, 'Both, and I choose');
    await page.click('#survey-next');
    await page.fill('#survey-comment', 'I would worry about my data.');
    await page.click('#survey-send');
    await page.waitForSelector('#survey-finish');
    assert.match(await page.innerText('#sync-survey-dialog'), /Thank you/);
    assert.deepEqual(await surveyPaths(page), ['event/survey/devices/two', 'event/survey/sync/both']);
    assert.equal(posts.length, 1);
    assert.match(posts[0].body, /I would worry about my data\./);
    assert.match(posts[0].body, /Sync survey comment/);
    assert.ok(!/email/i.test(posts[0].body.replace(/Sync survey \(anonymous\)/, '')), 'no email field is sent');
    await page.click('#survey-finish');
    await page.waitForTimeout(300);
    const after = await readStorage(page);
    assert.equal(after.calls, before.calls);
    assert.equal(after.rates, before.rates);
    assert.equal(after.dailyGoal, before.dailyGoal);
    assert.equal(JSON.parse(after[STATE_KEY]).status, 'done');
    await page.reload();
    await page.waitForTimeout(6500);
    assert.equal(await page.locator('#sync-survey-banner').count(), 0, 'never asks again once answered');
    assert.deepEqual(problems, []);
    assert.ok(seed);
  } finally { await context.close(); }
});

test('without a written comment nothing is posted, and answers can be changed with Back', async () => {
  const { context, page, posts } = await openApp();
  try {
    await banner(page);
    await page.click('[data-survey-action="take"]');
    await page.click('#survey-next');
    await pick(page, 'Just one device');
    await page.click('#survey-next');
    await pick(page, 'Keep it as it is');
    await page.click('#survey-back');
    await pick(page, 'Three or more');
    await page.click('#survey-next');
    await page.click('#survey-next');
    await page.click('#survey-send');
    await page.waitForSelector('#survey-finish');
    assert.deepEqual(await surveyPaths(page), ['event/survey/devices/three-plus', 'event/survey/sync/as-is']);
    assert.equal(posts.length, 0);
  } finally { await context.close(); }
});

test('"Maybe later" waits a week, "No thanks" is forever, closing the window does not nag', async () => {
  const later = await openApp();
  try {
    await banner(later.page);
    await later.page.click('.release-spotlight-btn-muted[data-survey-action="later"]');
    assert.equal(await later.page.locator('#sync-survey-banner').count(), 0);
    assert.equal(JSON.parse((await readStorage(later.page))[STATE_KEY]).status, 'later');
    await later.page.reload();
    await later.page.waitForTimeout(6500);
    assert.equal(await later.page.locator('#sync-survey-banner').count(), 0, 'not again so soon');
  } finally { await later.context.close(); }

  const week = await openApp({ [STATE_KEY]: JSON.stringify({ status: 'later', at: Date.now() - 8 * DAY }) });
  try {
    await banner(week.page);
  } finally { await week.context.close(); }

  const never = await openApp();
  try {
    await banner(never.page);
    await never.page.click('[data-survey-action="never"]');
    await never.page.reload();
    await never.page.waitForTimeout(6500);
    assert.equal(await never.page.locator('#sync-survey-banner').count(), 0);
    assert.equal(JSON.parse((await readStorage(never.page))[STATE_KEY]).status, 'never');
  } finally { await never.context.close(); }

  const closed = await openApp();
  try {
    await banner(closed.page);
    await closed.page.click('[data-survey-action="take"]');
    await closed.page.keyboard.press('Escape');
    await closed.page.waitForTimeout(300);
    await closed.page.reload();
    await closed.page.waitForTimeout(6500);
    assert.equal(await closed.page.locator('#sync-survey-banner').count(), 0, 'closing it counts as later');
    assert.deepEqual(await surveyPaths(closed.page), [], 'nothing counted when nothing was answered');
  } finally { await closed.context.close(); }
});

test('the survey follows the app theme, light and dark', async () => {
  const colorOf = async (theme) => {
    const { context, page } = await openApp({ theme });
    try {
      await banner(page);
      await page.click('[data-survey-action="take"]');
      await page.waitForSelector('#sync-survey-dialog', { state: 'visible' });
      return await page.evaluate(() => getComputedStyle(document.getElementById('sync-survey-title')).color);
    } finally { await context.close(); }
  };
  const lum = (css) => css.match(/\d+/g).slice(0, 3).map(Number).reduce((a, b) => a + b, 0) / 3;
  const dark = lum(await colorOf('dark'));
  const light = lum(await colorOf('light'));
  // the title text is light on the dark theme and dark on the light theme
  assert.ok(dark > 200 && light < 90, `dark ${dark} light ${light}`);
});
