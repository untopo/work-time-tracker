// +/- one second on the live call timer, including press-and-hold.
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

// Elapsed milliseconds of the running call, according to what is saved to storage.
const savedElapsed = async (page) => {
  const state = JSON.parse((await readStorage(page)).activeLiveCallState || 'null');
  return state ? Date.now() - state.start : null;
};
const shownSeconds = async (page) => {
  const [h, m, s] = (await page.innerText('#live-call-timer')).trim().split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

async function withRunningCall(fn) {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await seedStorage(page, baseUrl, makeSeed(20));
    await page.click('#start-call-btn');
    await page.waitForTimeout(1200);
    await fn(page, problems);
  } finally {
    await context.close();
  }
}

async function hold(page, selector, ms) {
  const box = await page.locator(selector).boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

test('one tap adds or removes exactly one second', async () => {
  await withRunningCall(async (page, problems) => {
    const before = await shownSeconds(page);
    await page.click('#live-call-plus-second-btn');
    const afterPlus = await shownSeconds(page);
    assert.ok(afterPlus - before >= 1 && afterPlus - before <= 2, `+1s (was ${before}, now ${afterPlus})`);
    await page.click('#live-call-minus-second-btn');
    const afterMinus = await shownSeconds(page);
    assert.ok(afterPlus - afterMinus >= 1 && afterPlus - afterMinus <= 2, `-1s (was ${afterPlus}, now ${afterMinus})`);
    assert.deepEqual(problems, []);
  });
});

test('keyboard activation (Enter) adds exactly one second, once', async () => {
  await withRunningCall(async (page) => {
    const before = await savedElapsed(page);
    await page.focus('#live-call-plus-second-btn');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const gained = (await savedElapsed(page)) - before;
    assert.ok(gained > 1000 && gained < 2000, `Enter should add ~1s once (got ${gained} ms incl. elapsed time)`);
  });
});

test('holding + keeps adding smoothly, stops on release, and the saved time matches', async () => {
  await withRunningCall(async (page, problems) => {
    // Record every change of the timer text with its timestamp.
    await page.evaluate(() => {
      window.__ticks = [];
      new MutationObserver(() => window.__ticks.push([performance.now(), document.getElementById('live-call-timer').textContent]))
        .observe(document.getElementById('live-call-timer'), { childList: true, characterData: true, subtree: true });
    });
    const before = await shownSeconds(page);
    await hold(page, '#live-call-plus-second-btn', 2500);
    const afterRelease = await shownSeconds(page);
    const gained = afterRelease - before;
    assert.ok(gained >= 8 && gained <= 60, `holding 2.5s should add a lot of seconds (got ${gained})`);

    // Stops on release: nothing keeps moving afterwards (only the real clock, +1s per second).
    await page.waitForTimeout(900);
    const later = await shownSeconds(page);
    assert.ok(later - afterRelease <= 2, `no more jumps after release (${afterRelease} -> ${later})`);

    // Smooth: the displayed seconds never jump by more than 2 between consecutive updates.
    const ticks = await page.evaluate(() => window.__ticks);
    const secs = ticks.map(([, text]) => text.split(':').map(Number).reduce((a, n) => a * 60 + n, 0));
    let biggestJump = 0;
    for (let i = 1; i < secs.length; i += 1) biggestJump = Math.max(biggestJump, secs[i] - secs[i - 1]);
    assert.ok(secs.length >= 8, `timer updates many times while held (got ${secs.length})`);
    assert.ok(biggestJump <= 2, `no big jumps while holding (biggest ${biggestJump}s)`);

    // The time saved to storage equals the time on screen (so a refresh keeps it).
    const saved = Math.floor((await savedElapsed(page)) / 1000);
    assert.ok(Math.abs(saved - (await shownSeconds(page))) <= 1, 'saved time matches displayed time');
    // After a refresh the app offers to recover the unfinished call; the saved
    // start time must still include every adjusted second.
    const shownBeforeReload = await shownSeconds(page);
    await page.reload();
    await page.waitForTimeout(1800);
    const recovered = Math.floor((await savedElapsed(page)) / 1000);
    assert.ok(recovered >= shownBeforeReload - 1, `adjusted time kept after reload (${recovered}s vs ${shownBeforeReload}s)`);
    assert.deepEqual(problems, []);
  });
});

test('holding - never goes below 00:00:00 and stops by itself', async () => {
  await withRunningCall(async (page, problems) => {
    await hold(page, '#live-call-minus-second-btn', 3000);
    const shown = await shownSeconds(page);
    assert.ok(shown >= 0 && shown <= 2, `timer floors at zero (shows ${shown}s)`);
    const saved = await savedElapsed(page);
    assert.ok(saved >= 0 && saved < 4000, `saved start is never in the future (elapsed ${saved} ms)`);
    await page.waitForTimeout(800);
    assert.ok((await shownSeconds(page)) <= 3, 'timer keeps running normally after hitting zero');
    assert.deepEqual(problems, []);
  });
});

test('ending a call after adjusting saves the adjusted duration', async () => {
  await withRunningCall(async (page) => {
    await hold(page, '#live-call-plus-second-btn', 1500);
    const shown = await shownSeconds(page);
    await page.click('#end-call-btn');
    await page.waitForTimeout(1200);
    const calls = JSON.parse((await readStorage(page)).calls);
    const saved = calls.find((call) => !String(call.id).startsWith('seed-'));
    assert.ok(saved, 'the new call was saved');
    assert.ok(Math.abs(saved.duration / 1000 - shown) <= 3, `saved ${saved.duration / 1000}s vs shown ${shown}s`);
    assert.equal(calls.length, 21, 'old calls untouched');
  });
});

test('Focus Mode big timer follows the +/- buttons right away, including hold', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    const seed = makeSeed(20);
    seed.featureFlags = JSON.stringify({ ...JSON.parse(seed.featureFlags), focusMode: true });
    await seedStorage(page, baseUrl, seed);
    await page.click('#start-call-btn');
    await page.waitForTimeout(1500);
    await page.click('#live-call-focus-btn');
    await page.waitForTimeout(800);
    const focusSeconds = async () =>
      (await page.innerText('#wtt-focus-timer')).trim().split(':').map(Number).reduce((a, n) => a * 60 + n, 0);

    const start = await focusSeconds();
    await page.click('#wtt-focus-plus-btn');
    await page.waitForTimeout(120); // well under one second: no waiting for the normal tick
    assert.equal(await focusSeconds(), start + 1, 'tap + shows +1s immediately in Focus Mode');
    await page.click('#wtt-focus-minus-btn');
    await page.waitForTimeout(120);
    assert.equal(await focusSeconds(), start, 'tap - shows -1s immediately in Focus Mode');

    await hold(page, '#wtt-focus-plus-btn', 1500);
    await page.waitForTimeout(150);
    const mainSeconds = (await page.innerText('#live-call-timer')).trim().split(':').map(Number).reduce((a, n) => a * 60 + n, 0);
    assert.ok(Math.abs((await focusSeconds()) - mainSeconds) <= 1, 'Focus timer and call timer agree after holding');
    assert.ok((await focusSeconds()) - start >= 5, 'holding in Focus Mode adds many seconds');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
