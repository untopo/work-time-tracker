// Only rate cycles: the general cycle cards are hidden. Previous cycle shows its Pay Day and amount.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

const LIMA_OFFSET_H = 5;
const midnight = (offsetDays) => {
  const lima = new Date(Date.now() - LIMA_OFFSET_H * 3600000);
  return new Date(Date.UTC(lima.getUTCFullYear(), lima.getUTCMonth(), lima.getUTCDate() + offsetDays, LIMA_OFFSET_H)).toISOString();
};
const call = (id, rateName, minutesAgo, dollars) => {
  const start = Date.now() - minutesAgo * 60000;
  return { id, startTime: new Date(start).toISOString(), endTime: new Date(start + dollars * 60000).toISOString(), duration: dollars * 60000,
    rate: 1, rateName, earnings: dollars, earned: dollars, notes: '', rpgEligible: true };
};
function seed(theme, cycles) {
  const s = makeSeed(0);
  s.theme = theme;
  s.featureFlags = JSON.stringify({ ...JSON.parse(s.featureFlags), paymentCycles: true });
  s.paymentCyclesEnabled = 'true';
  s.paymentCycles = JSON.stringify(cycles);
  s.calls = JSON.stringify([call('a1', 'GG', 60, 4), call('a2', 'GG', 20 * 24 * 60, 7), call('l1', 'Lion', 30, 3)]);
  s[`releaseSpotlightSeen:${VERSION}`] = '1';
  return s;
}
const onlyRates = [
  { startDate: midnight(-30), endDate: midnight(-16), payDate: midnight(2), rate: 'GG' },
  { startDate: midnight(-15), endDate: midnight(-1) , payDate: midnight(14), rate: 'GG' },
  { startDate: midnight(0), endDate: midnight(14), payDate: midnight(29), rate: 'GG' },
  { startDate: midnight(-5), endDate: midnight(8), payDate: midnight(15), rate: 'Lion' }
];

for (const theme of ['light', 'dark']) {
  test(`only rate cycles: general cards hidden, rate cards stay (${theme})`, async () => {
    const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
    try {
      await seedStorage(page, baseUrl, seed(theme, onlyRates));
      await page.click('.app-nav-link[data-app-nav="analytics"]');
      assert.equal(await page.locator('#payment-cycle-earnings-cards').isVisible(), false);
      assert.equal(await page.locator('#rate-cycle-cards .rate-cycle-card').count(), 2);
      assert.deepEqual(problems, []);
    } finally { await context.close(); }
  });
}

test('previous cycle shows its Pay Day and the amount of that payday', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, seed('dark', onlyRates));
    await page.click('.app-nav-link[data-app-nav="analytics"]');
    const gg = await page.locator('#rate-cycle-cards .rate-cycle-card', { hasText: 'GG' }).innerText();
    assert.match(gg, /Previous cycle: \$/);
    assert.match(gg, /Pay Day: .*·/, 'pay date is still ahead');
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});

test('a general cycle keeps the general cards and shows the previous Pay Day there', async () => {
  const cycles = [
    { startDate: midnight(-15), endDate: midnight(-1), payDate: midnight(3) },
    { startDate: midnight(0), endDate: midnight(14), payDate: midnight(18) }
  ];
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  try {
    await seedStorage(page, baseUrl, seed('light', cycles));
    await page.click('.app-nav-link[data-app-nav="analytics"]');
    assert.equal(await page.locator('#payment-cycle-earnings-cards').isVisible(), true);
    assert.match(await page.innerText('#cycle-previous-payday'), /Pay Day: .*·/);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
