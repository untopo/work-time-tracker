// The update notice is a short summary; View details opens the complete release notes.
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

test('the What\'s New notice stays concise and View details opens the full changelog of the current version', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    const seed = makeSeed(5);
    delete seed[`releaseSpotlightSeen:${APP_VERSION}`];
    await seedStorage(page, baseUrl, seed);
    await page.waitForSelector('.release-spotlight-text', { state: 'visible' });
    const summary = (await page.textContent('.release-spotlight-text')).trim();
    assert.ok(summary.length > 10 && summary.length < 360, `notice should be short, got ${summary.length} characters`);
    assert.ok(!/survey/i.test(summary), 'the summary must describe the current release, not an older one');
    assert.match(summary, /download buttons/i);

    await page.click('[data-release-action="details"]');
    await page.waitForSelector('#changelog-modal', { state: 'visible' });
    const details = (await page.textContent('#changelog-content')).trim();
    assert.ok(details.includes(APP_VERSION), 'details name the current version');
    assert.match(details, /Windows and Android/i);
    assert.match(details, /do not sync/i);
    assert.deepEqual(problems, []);
  } finally {
    await context.close();
  }
});
