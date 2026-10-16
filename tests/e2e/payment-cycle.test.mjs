// The last day of a payment cycle still belongs to that cycle.
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

let server;
let baseUrl;
let browser;
const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const DAY = 86400000;
const LIMA_OFFSET_H = 5; // America/Lima is UTC-5 all year

before(async () => {
  ({ server, url: baseUrl } = await startServer());
  browser = await launchBrowser();
});
after(async () => {
  await browser?.close();
  server?.close();
});

// Local (Lima) midnight of "today + offsetDays", as the app stores cycle dates.
function limaMidnightIso(offsetDays) {
  const lima = new Date(Date.now() - LIMA_OFFSET_H * 3600000);
  return new Date(Date.UTC(lima.getUTCFullYear(), lima.getUTCMonth(), lima.getUTCDate() + offsetDays, LIMA_OFFSET_H)).toISOString();
}

// The app recomputes earnings from duration x rate, so use $1 per minute: `dollars` minutes long.
function call(id, startIso, dollars) {
  const start = new Date(startIso);
  const duration = dollars * 60000;
  return {
    id, startTime: start.toISOString(), endTime: new Date(start.getTime() + duration).toISOString(),
    duration, rate: 1, rateName: 'Propio', earnings: dollars, earned: dollars, notes: '', rpgEligible: true,
  };
}

// cycle: from `startOffset` to `endOffset` days from today (0 = today), pay 5 days after the end.
async function openCycleCard({ startOffset, endOffset, calls }) {
  const { context, page, problems } = await newPage(browser, baseUrl, { timezoneId: 'America/Lima' });
  const seed = makeSeed(0);
  seed.calls = JSON.stringify(calls);
  seed.featureFlags = JSON.stringify({ ...JSON.parse(seed.featureFlags), paymentCycles: true });
  seed.paymentCyclesEnabled = 'true';
  seed.paymentCycles = JSON.stringify([
    { startDate: limaMidnightIso(startOffset), endDate: limaMidnightIso(endOffset), payDate: limaMidnightIso(endOffset + 5) },
  ]);
  seed[`releaseSpotlightSeen:${VERSION}`] = '1';
  await seedStorage(page, baseUrl, seed);
  await page.click('.app-nav-link[data-app-nav="analytics"]');
  await page.waitForTimeout(600);
  return { context, page, problems };
}

const text = (page, id) => page.innerText(`#${id}`).then((t) => t.trim());

test('on the LAST day of the cycle it is still the active cycle and counts today\'s calls', async () => {
  const todayCall = call('today', new Date(Date.now() - 60000).toISOString(), 7);
  const earlier = call('earlier', limaMidnightIso(-3), 5);
  const { context, page, problems } = await openCycleCard({ startOffset: -13, endOffset: 0, calls: [todayCall, earlier] });
  try {
    assert.equal(await text(page, 'cycle-state-chip'), 'Active', 'cycle is active on its last day');
    assert.equal(await text(page, 'cycle-earnings'), '$12.00', 'earnings include today\'s call');
    assert.match(await text(page, 'cycle-earnings-meta'), /^2 calls/);
    assert.equal(await text(page, 'days-until-end'), '1 day', 'today counts as the last day left');
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});

test('the day BEFORE the last day shows two days left and counts every call', async () => {
  const todayCall = call('today', new Date(Date.now() - 60000).toISOString(), 7);
  const { context, page } = await openCycleCard({ startOffset: -12, endOffset: 1, calls: [todayCall] });
  try {
    assert.equal(await text(page, 'days-until-end'), '2 days', 'today and tomorrow are still in the cycle');
    assert.equal(await text(page, 'cycle-earnings'), '$7.00');
  } finally {
    await context.close();
  }
});

test('the first day of a cycle counts, and a finished cycle is no longer active', async () => {
  const todayCall = call('today', new Date(Date.now() - 60000).toISOString(), 7);
  let opened = await openCycleCard({ startOffset: 0, endOffset: 13, calls: [todayCall] });
  try {
    assert.equal(await text(opened.page, 'cycle-state-chip'), 'Active');
    assert.equal(await text(opened.page, 'cycle-earnings'), '$7.00', 'first day counts');
  } finally {
    await opened.context.close();
  }
  opened = await openCycleCard({ startOffset: -14, endOffset: -1, calls: [todayCall] });
  try {
    assert.notEqual(await text(opened.page, 'cycle-state-chip'), 'Active', 'yesterday\'s cycle is over');
  } finally {
    await opened.context.close();
  }
});
