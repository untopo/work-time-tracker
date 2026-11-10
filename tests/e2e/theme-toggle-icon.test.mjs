// The theme switch shows a moon in light mode and a sun in dark mode. Run with: npm run test:e2e
import { test, before, after } from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { startServer, launchBrowser, newPage, seedStorage, makeSeed } from './helpers.mjs';

const VERSION = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
let server, baseUrl, browser;
before(async () => { ({ server, url: baseUrl } = await startServer()); browser = await launchBrowser(); });
after(async () => { await browser?.close(); server?.close(); });

test('moon turns into a sun when the theme changes, and back', async () => {
  const { context, page, problems } = await newPage(browser, baseUrl);
  try {
    await seedStorage(page, baseUrl, { ...makeSeed(2), theme: 'light', [`releaseSpotlightSeen:${VERSION}`]: '1' });
    const opacity = (sel) => page.$eval(sel, (el) => Number(getComputedStyle(el).opacity));
    assert.equal(await opacity('#dark-toggle .wtt-theme-moon'), 1);
    assert.equal(await opacity('#dark-toggle .wtt-theme-sun'), 0);
    await page.click('#dark-toggle');
    await page.waitForTimeout(700);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
    assert.equal(await opacity('#dark-toggle .wtt-theme-moon'), 0);
    assert.equal(await opacity('#dark-toggle .wtt-theme-sun'), 1);
    assert.equal((await page.textContent('#theme-toggle-label')).trim(), 'Light Mode');
    await page.click('#dark-toggle');
    await page.waitForTimeout(700);
    assert.equal(await opacity('#dark-toggle .wtt-theme-moon'), 1);
    assert.deepEqual(problems, []);
  } finally { await context.close(); }
});
