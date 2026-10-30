// The daily goal moves while a call is running (not only when it ends), and goes back if the call is undone.
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

// A rate of $60/min earns $1 every second, so the changes are easy to see.
function seedFastRate() {
  const seed = makeSeed(0);
  seed.calls = '[]';
  seed.rates = JSON.stringify([{ name: 'Fast', amount: 60 }]);
  seed.lastSelectedRate = 'Fast';
  seed.dailyGoal = JSON.stringify({ amount: 1000, minutes: 0 });
  return seed;
}

const earnedInGoal = async (page) => {
  const text = (await page.textContent('#goal-amount-display')).trim();
  const match = text.match(/^\$([\d.]+)\s*\/\s*\$/);
  assert.ok(match, `unexpected goal text: ${text}`);
  return Number(match[1]);
};

test('the goal grows during a call, matches the saved call after it ends, and reverts on undo', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await seedStorage(page, baseUrl, seedFastRate());
    assert.equal(await earnedInGoal(page), 0);
    await page.click('#start-call-btn');
    await page.waitForTimeout(3500);
    const during = await earnedInGoal(page);
    assert.ok(during >= 2, `goal should already include the running call, got ${during}`);
    await page.waitForTimeout(2000);
    assert.ok((await earnedInGoal(page)) > during, 'goal keeps growing while the call runs');

    await page.click('#end-call-btn');
    await page.waitForTimeout(800);
    const saved = JSON.parse((await readStorage(page)).calls);
    assert.equal(saved.length, 1);
    const savedEarnings = Number(saved[0].earnings ?? saved[0].earned);
    assert.ok(Math.abs((await earnedInGoal(page)) - savedEarnings) < 0.015, 'after the call ends the goal equals the saved call (not counted twice)');

    await page.click('#post-call-undo-btn');
    await page.waitForTimeout(800);
    assert.equal(JSON.parse((await readStorage(page)).calls).length, 0);
    assert.equal(await earnedInGoal(page), 0, 'undo takes the call out of the goal');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

for (const [name, viewport] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  test(`Focus Mode timer sits centered inside the ring (${name})`, async () => {
    const { context, page } = await newPage(browser, baseUrl, { viewport });
    try {
      const seed = seedFastRate();
      seed.featureFlags = JSON.stringify({ ...JSON.parse(seed.featureFlags), focusMode: true });
      await seedStorage(page, baseUrl, seed);
      await page.click('#start-call-btn', { force: true });
      await page.waitForTimeout(1200);
      await page.click('#live-call-focus-btn');
      await page.waitForSelector('#wtt-focus-timer', { state: 'visible' });
      const t = await page.locator('#wtt-focus-timer').boundingBox();
      const ring = await page.locator('.wtt-focus-ringwrap svg').boundingBox();
      const cx = ring.x + ring.width / 2;
      const inner = ring.width * (300 - 16) / 360; // inside the stroke of the ring (radius 150, stroke 16 on a 360 canvas)
      assert.ok(t.width < inner * 0.8, `timer (${t.width}px) must leave room inside the ring (${inner}px)`);
      assert.ok(Math.abs(t.x + t.width / 2 - cx) < 3, 'timer is horizontally centered in the ring');
    } finally {
      await context.close();
    }
  });
}
