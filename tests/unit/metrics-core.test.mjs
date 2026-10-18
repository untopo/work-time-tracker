// The anonymous usage metrics may only ever produce coarse ranges, never exact values.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core } = loadCore();
const MIN = 60000;
const HOUR = 3600000;

test('call length falls into the right range, at every edge', () => {
  const cases = [[0, 'under-1m'], [59 * 1000, 'under-1m'], [MIN, '1-5m'], [5 * MIN - 1, '1-5m'], [5 * MIN, '5-10m'],
    [10 * MIN, '10-20m'], [20 * MIN, '20-40m'], [40 * MIN, '40m-plus'], [5 * HOUR, '40m-plus'], ['junk', 'under-1m'], [-5, 'under-1m']];
  for (const [ms, expected] of cases) assert.equal(core.bucketCallLength(ms), expected, String(ms));
});

test('calls per day and hours per day fall into the right range', () => {
  const calls = [[0, '1-5'], [5, '1-5'], [6, '6-10'], [10, '6-10'], [11, '11-20'], [20, '11-20'], [21, '21-40'], [40, '21-40'], [41, '41-plus'], [500, '41-plus']];
  for (const [n, expected] of calls) assert.equal(core.bucketDayCalls(n), expected, `calls ${n}`);
  const hours = [[0, 'under-1h'], [HOUR - 1, 'under-1h'], [HOUR, '1-2h'], [2 * HOUR, '2-4h'], [4 * HOUR, '4-6h'], [6 * HOUR, '6-8h'], [8 * HOUR, '8h-plus'], [20 * HOUR, '8h-plus']];
  for (const [ms, expected] of hours) assert.equal(core.bucketDayHours(ms), expected, `hours ${ms}`);
});

test('every range is a fixed label, so no exact value can leak through it', () => {
  const labels = new Set();
  for (let ms = 0; ms < 6 * HOUR; ms += 7000) labels.add(core.bucketCallLength(ms));
  for (let n = 0; n < 300; n += 1) labels.add(core.bucketDayCalls(n));
  for (let ms = 0; ms < 12 * HOUR; ms += 60000) labels.add(core.bucketDayHours(ms));
  assert.ok(labels.size <= 18, `only a handful of distinct labels exist (found ${labels.size})`);
  for (const label of labels) assert.match(label, /^[a-z0-9-]+$/);
});

const dayOf = (call) => call.day;

test('the daily summary reports only the latest finished day that has not been reported yet', () => {
  const rows = [
    { day: '2026-10-14', duration: 30 * MIN },
    { day: '2026-10-15', duration: 90 * MIN }, { day: '2026-10-15', duration: 60 * MIN },
    { day: '2026-10-16', duration: 10 * MIN }, // "today": never reported while it is still going
  ];
  const summary = plain(core.buildDailyUsageSummary(rows, '', '2026-10-16', dayOf));
  assert.equal(summary.dayKey, '2026-10-15');
  assert.deepEqual(summary.events, ['day-calls/1-5', 'day-hours/2-4h']);
  assert.equal(core.buildDailyUsageSummary(rows, '2026-10-15', '2026-10-16', dayOf), null, 'already reported');
});

test('the daily summary is quiet when there is nothing new or the input is junk', () => {
  assert.equal(core.buildDailyUsageSummary([], '', '2026-10-16', dayOf), null);
  assert.equal(core.buildDailyUsageSummary(null, '', '2026-10-16', dayOf), null);
  assert.equal(core.buildDailyUsageSummary([{ day: '2026-10-15', duration: 1 }], '', '2026-10-16', null), null);
  assert.equal(core.buildDailyUsageSummary([{ day: '2026-10-16', duration: 1 }], '', '2026-10-16', dayOf), null, 'today only');
});

test('feature events list only the features that are on, by name, never their settings', () => {
  assert.deepEqual(plain(core.buildFeatureUsageEvents({ rpg: true, notes: false, 'focus-mode': true, goal: 'yes' })), ['feature-on/focus-mode', 'feature-on/rpg']);
  assert.deepEqual(plain(core.buildFeatureUsageEvents(null)), []);
});
