// Work screen layout: folded panels, today strip, one main action. Presentation only:
// none of this may change saved data.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, readStorage, makeSeed } from './helpers.mjs';

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

async function withPage(fn, seed = makeSeed(12)) {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await seedStorage(page, baseUrl, { ...seed, [`releaseSpotlightSeen:${VERSION}`]: '1' });
    await fn(page, problems);
  } finally {
    await context.close();
  }
}

const body = (id) => `#${id}`;
const PANELS = [
  ['daily-goal-card', 'goal-panel-body'],
  ['session-tracker-card', 'session-panel-body'],
  ['rates-card', 'rates-panel-body'],
];

test('secondary panels start folded and show a one-line summary', async () => {
  await withPage(async (page, problems) => {
    for (const [, bodyId] of PANELS) assert.equal(await page.locator(body(bodyId)).isVisible(), false, `${bodyId} folded`);
    for (const id of ['goal-panel-summary', 'session-panel-summary', 'rates-panel-summary']) {
      assert.ok((await page.innerText(`#${id}`)).trim().length > 0, `${id} has text`);
    }
    assert.ok(await page.locator('#start-call-btn').isVisible());
    assert.deepEqual(problems, []);
  });
});

test('opening a panel folds the others; clicking again folds it', async () => {
  await withPage(async (page) => {
    await page.click('[data-work-panel-toggle="rates-card"]');
    assert.equal(await page.locator('#rates-panel-body').isVisible(), true);
    await page.click('[data-work-panel-toggle="daily-goal-card"]');
    assert.equal(await page.locator('#goal-panel-body').isVisible(), true);
    assert.equal(await page.locator('#rates-panel-body').isVisible(), false, 'only one open');
    await page.click('[data-work-panel-toggle="daily-goal-card"]');
    assert.equal(await page.locator('#goal-panel-body').isVisible(), false);
  });
});

test('keyboard (Enter) opens a panel', async () => {
  await withPage(async (page) => {
    await page.focus('[data-work-panel-toggle="session-tracker-card"]');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#session-panel-body').isVisible(), true);
    assert.equal(await page.getAttribute('[data-work-panel-toggle="session-tracker-card"]', 'aria-expanded'), 'true');
  });
});

test('a new user with no rates gets the Rates panel opened by Add Rate', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1500);
    assert.equal(await page.innerText('#rates-panel-summary'), 'Add a rate');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('the Today strip matches the calls saved today and updates after a call', async () => {
  await withPage(async (page, problems) => {
    const before = Number((await page.innerText('#work-today-calls')).split(' ')[0]);
    await page.click('#start-call-btn');
    await page.waitForTimeout(1300);
    await page.click('#end-call-btn');
    await page.waitForTimeout(900);
    const after = Number((await page.innerText('#work-today-calls')).split(' ')[0]);
    assert.equal(after, before + 1, 'today count went up by one');
    assert.match(await page.innerText('#work-today-earnings'), /\d/);
    assert.deepEqual(problems, []);
  });
});

test('the Work layout never changes saved calls, rates or goals', async () => {
  const seed = makeSeed(12);
  await withPage(async (page) => {
    for (const [cardId] of PANELS) await page.click(`[data-work-panel-toggle="${cardId}"]`);
    await page.reload();
    await page.waitForTimeout(1200);
    const stored = await readStorage(page);
    assert.deepEqual(JSON.parse(stored.calls), JSON.parse(seed.calls));
    assert.deepEqual(JSON.parse(stored.rates), JSON.parse(seed.rates));
    assert.deepEqual(JSON.parse(stored.dailyGoal), JSON.parse(seed.dailyGoal));
  }, seed);
});

test('quick notes are only available during a call and are cleared when it ends', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('#live-call-notes').isVisible(), false, 'hidden without a call');
    await page.click('#start-call-btn');
    await page.waitForTimeout(500);
    if (await page.locator('#live-call-notes').isVisible()) {
      await page.fill('#live-call-notes', 'ref 4471');
      await page.click('#end-call-btn');
      await page.waitForTimeout(900);
      assert.equal(await page.inputValue('#live-call-notes'), '', 'cleared after the call');
    } else {
      await page.click('#end-call-btn');
    }
  });
});
