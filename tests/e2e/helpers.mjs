// Shared helpers for the end-to-end tests: a tiny static server, a browser that
// never touches the real internet (so analytics are never counted), and seed data.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const APP_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

export function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}/` });
    });
  });
}

export async function launchBrowser() {
  // CI installs Chromium with `npx playwright-core install chromium`.
  // Locally you can point WTT_CHROME at any Chromium/Chrome binary.
  const executablePath = process.env.WTT_CHROME || undefined;
  return chromium.launch({ executablePath, args: ['--no-sandbox'] });
}

// A fresh page that only talks to the local server. Anything else (GoatCounter,
// fonts, etc.) is blocked, so tests can never send analytics or depend on the network.
export async function newPage(browser, baseUrl, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
  await context.route('**/*', (route) =>
    route.request().url().startsWith(baseUrl.replace(/\/$/, '')) ? route.continue() : route.abort());
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(msg.text())) {
      problems.push(`console.error: ${msg.text()}`);
    }
  });
  return { context, page, problems };
}

export async function seedStorage(page, baseUrl, seed) {
  await page.goto(baseUrl);
  await page.evaluate((data) => {
    localStorage.clear();
    for (const [key, value] of Object.entries(data)) localStorage.setItem(key, value);
  }, seed);
  await page.reload();
  await page.waitForSelector('.call-log-table', { state: 'attached' });
  await page.waitForTimeout(1500);
}

export function readStorage(page) {
  return page.evaluate(() => {
    const out = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      out[key] = localStorage.getItem(key);
    }
    return out;
  });
}

// Deterministic fake data (same every run) shaped like what real users have saved.
export function makeSeed(callCount = 120) {
  let n = 7;
  const rand = () => { n = (n * 1103515245 + 12345) % 2147483648; return n / 2147483648; };
  const now = Date.now();
  const notes = ['', 'Cita médica – cardiología', 'Ñandú & café ☕', 'Llamada "larga" de seguimiento', '<b>no html</b>', ''];
  const calls = [];
  for (let i = 0; i < callCount; i += 1) {
    const durationSeconds = 60 + Math.floor(rand() * 2340);
    const rate = rand() < 0.5 ? 0.12 : 0.10;
    const start = new Date(now - Math.floor(rand() * 40) * 86400000 - Math.floor(rand() * 36000000));
    const end = new Date(start.getTime() + durationSeconds * 1000);
    calls.push({
      id: `seed-${String(i).padStart(3, '0')}`,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: durationSeconds * 1000,
      rate,
      rateName: rate === 0.12 ? 'Propio' : 'Voyce',
      earnings: Math.round((durationSeconds / 60) * rate * 100) / 100,
      earned: Math.round((durationSeconds / 60) * rate * 100) / 100,
      notes: notes[Math.floor(rand() * notes.length)],
      rpgEligible: true,
    });
  }
  return {
    calls: JSON.stringify(calls),
    rates: JSON.stringify([{ name: 'Propio', amount: 0.12 }, { name: 'Voyce', amount: 0.10 }]),
    lastSelectedRate: 'Propio',
    dailyGoal: JSON.stringify({ amount: 40, minutes: 240 }),
    theme: 'dark',
    timeZone: 'America/Lima',
    featureFlags: JSON.stringify({ notes: true, paymentCycles: false, floatingCallControls: true, focusMode: false, rpg: true, uiRefresh: true }),
    paymentCyclesEnabled: 'false',
    // The "What's New" banner of the current version would otherwise cover the buttons.
    [`releaseSpotlightSeen:${APP_VERSION}`]: '1',
  };
}
