// Payment cycles can apply to one rate; each rate shows its own cycle and calls are never counted twice.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

const DAY = 86400000;
const LIMA_OFFSET_H = 5; // America/Lima is UTC-5 all year
const midnight = (offsetDays) => {
  const lima = new Date(Date.now() - LIMA_OFFSET_H * 3600000);
  return new Date(Date.UTC(lima.getUTCFullYear(), lima.getUTCMonth(), lima.getUTCDate() + offsetDays, LIMA_OFFSET_H)).toISOString();
};
// The app recomputes earnings from duration x rate, so use $1 per minute: `dollars` minutes long.
const call = (id, rateName, minutesAgo, dollars) => {
  const start = Date.now() - minutesAgo * 60000;
  return { id, startTime: new Date(start).toISOString(), endTime: new Date(start + dollars * 60000).toISOString(), duration: dollars * 60000,
    rate: 1, rateName, earnings: dollars, earned: dollars, notes: '', rpgEligible: true };
};
function seed(theme) {
  const s = makeSeed(0);
  s.theme = theme;
  s.featureFlags = JSON.stringify({ ...JSON.parse(s.featureFlags), paymentCycles: true });
  s.paymentCyclesEnabled = 'true';
  s.paymentCycles = JSON.stringify([
    { startDate: midnight(-5), endDate: midnight(8), payDate: midnight(15) },
    { startDate: midnight(-2), endDate: midnight(11), payDate: midnight(14), rate: 'Propio' }
  ]);
  s.calls = JSON.stringify([call('v1', 'Voyce', 60, 2), call('p1', 'Propio', 30, 3), call('p2', 'Propio', 4 * 24 * 60, 5)]);
  s[`releaseSpotlightSeen:${VERSION}`] = '1';
  return s;
}

for (const theme of ['light', 'dark']) {
  test(`each rate shows its own cycle and no call is counted twice (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, seed(theme));
      await page.click('.app-nav-link[data-app-nav="analytics"]');
      assert.equal((await page.innerText('#cycle-earnings')).trim(), '$2.00', 'general cycle leaves out Propio, which has its own');
      assert.equal(await page.locator('#rate-cycle-cards .rate-cycle-card').count(), 1);
      const card = await page.innerText('#rate-cycle-cards .rate-cycle-card');
      assert.match(card, /Propio/);
      assert.match(card, /\$3\.00/, 'only Propio calls inside the Propio cycle');
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('without rate cycles nothing changes: one general cycle counts every call', async () => {
  const s = seed('dark');
  s.paymentCycles = JSON.stringify([{ startDate: midnight(-5), endDate: midnight(8), payDate: midnight(15) }]);
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, s);
    await page.click('.app-nav-link[data-app-nav="analytics"]');
    assert.equal((await page.innerText('#cycle-earnings')).trim(), '$10.00');
    assert.equal(await page.isVisible('#rate-cycle-cards'), false);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('the cycle editor offers "Applies to" and saves the rate', async () => {
  const s = seed('dark');
  s.paymentCycles = '[]';
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, s);
    await page.click('#settings-toggle');
    await page.waitForSelector('#st-features', { state: 'visible' });
    await page.$eval('#show-add-cycle-btn', (el) => el.click());
    await page.waitForSelector('#cycle-rate-input', { state: 'visible' });
    const options = await page.$$eval('#cycle-rate-input option', (els) => els.map((el) => el.textContent));
    assert.deepEqual(options, ['All other rates', 'Propio', 'Voyce']);
    await page.fill('#cycle-start-date-input', '2026-11-01');
    await page.fill('#cycle-end-date-input', '2026-11-14');
    await page.fill('#cycle-pay-date-input', '2026-11-21');
    await page.selectOption('#cycle-rate-input', 'Voyce');
    await page.click('#edit-cycle-form button[type="submit"]');
    await page.waitForTimeout(500);
    const cycles = JSON.parse(await page.evaluate(() => localStorage.getItem('paymentCycles')));
    assert.equal(cycles.length, 1);
    assert.equal(cycles[0].rate, 'Voyce');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
