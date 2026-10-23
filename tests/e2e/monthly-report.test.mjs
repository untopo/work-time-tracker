// The monthly report only reads saved data: it must show the right numbers and never change storage.
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

// $1 per minute, so `dollars` is also the number of minutes.
function call(id, startMs, dollars) {
  const duration = dollars * 60000;
  return {
    id, startTime: new Date(startMs).toISOString(), endTime: new Date(startMs + duration).toISOString(),
    duration, rate: 1, rateName: 'Propio', earnings: dollars, earned: dollars, notes: '', rpgEligible: true,
  };
}

async function openReport(calls) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  const seed = makeSeed(0);
  seed.calls = JSON.stringify(calls);
  seed[`releaseSpotlightSeen:${VERSION}`] = '1';
  await seedStorage(page, baseUrl, seed);
  await page.click('.app-nav-link[data-app-nav="analytics"]');
  await page.waitForTimeout(400);
  const before = await readStorage(page);
  await page.click('#open-report-btn');
  await page.waitForSelector('#report-modal .wtt-report-page, #report-modal .wtt-report-empty');
  return { context, page, problems, before };
}

test('the report shows the month totals and leaves saved data untouched', async () => {
  const now = Date.now();
  const { context, page, problems, before } = await openReport([
    call('a', now - 3600000, 7),
    call('b', now - 2 * 3600000, 5),
  ]);
  try {
    assert.equal(await page.locator('#report-modal .wtt-report-page').count(), 2);
    const text = await page.innerText('#report-body');
    assert.match(text, /\$12\.00/);
    assert.match(text, /Monthly report/);
    assert.match(text, /Your data is never uploaded/);
    assert.equal(await page.getAttribute('#report-body .wtt-report', 'data-theme'), 'dark');
    await page.click('#report-theme-light-btn');
    assert.equal(await page.getAttribute('#report-body .wtt-report', 'data-theme'), 'light');
    await page.click('#close-report-modal');
    await page.waitForTimeout(200);
    assert.equal(await page.isVisible('#report-modal'), false);
    const after = await readStorage(page);
    assert.equal(after.calls, before.calls, 'calls must not change');
    assert.equal(after.dailyGoal, before.dailyGoal);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('with no calls the report explains it instead of showing an empty sheet', async () => {
  const { context, page, problems } = await openReport([]);
  try {
    assert.match(await page.innerText('#report-body'), /No calls saved in/);
    assert.equal(await page.isDisabled('#report-print-btn'), true);
    assert.equal(await page.isDisabled('#report-next-btn'), true, 'cannot go past the current month');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('previous month works, and an older call never leaks into this month', async () => {
  const now = new Date();
  const lastMonthMid = new Date(now.getFullYear(), now.getMonth() - 1, 15, 12).getTime();
  const { context, page, problems } = await openReport([call('old', lastMonthMid, 9)]);
  try {
    // opens on the latest month that has calls, which is last month
    assert.match(await page.innerText('#report-body'), /\$9\.00/);
    await page.click('#report-next-btn');
    assert.match(await page.innerText('#report-body'), /No calls saved in/);
    await page.click('#report-prev-btn');
    assert.match(await page.innerText('#report-body'), /\$9\.00/);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('printing produces exactly two A4 pages of the report', async () => {
  const { context, page, problems } = await openReport([call('a', Date.now() - 3600000, 7)]);
  try {
    await page.evaluate(() => {
      const root = document.createElement('div');
      root.id = 'report-print-root';
      root.innerHTML = document.getElementById('report-body').innerHTML;
      document.body.appendChild(root);
      document.body.classList.add('is-printing-report');
    });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    assert.equal(pages, 2);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
