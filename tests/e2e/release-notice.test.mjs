// The "What's New" notice after an update is short; the full text stays behind "View details".
// Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

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

const APP_VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;

test('the What\'s New notice is a few short lines, not the whole changelog', async () => {
  const { context, page } = await newPage(browser, baseUrl);
  const seed = makeSeed(5);
  delete seed[`releaseSpotlightSeen:${APP_VERSION}`];
  await seedStorage(page, baseUrl, seed);
  await page.waitForSelector('.release-spotlight-text', { state: 'visible' });
  const text = (await page.textContent('.release-spotlight-text')).trim();
  assert.ok(text.length > 10 && text.length < 360, `notice should be short, got ${text.length} characters`);
  assert.ok(!/…\s·|…$/.test(text) || text.length > 60, 'lines must not be cut down to a few letters');
  assert.match(text, /survey/i);
  assert.match(text, /Settings/);
  await context.close();
});
