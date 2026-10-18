// The anonymous usage metrics may only ever produce coarse ranges, never exact values.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain, allLabels } from './load-core.mjs';

const { core } = loadCore();
const MIN = 60000;
const HOUR = 3600000;

test('call length falls into the right range, at every edge', () => {
  const cases = [[0, 'under-1m'], [59 * 1000, 'under-1m'], [MIN, '1-2m'], [2 * MIN, '2-3m'], [3 * MIN, '3-5m'], [5 * MIN - 1, '3-5m'],
    [5 * MIN, '5-7m'], [7 * MIN, '7-10m'], [10 * MIN, '10-15m'], [15 * MIN, '15-20m'], [20 * MIN, '20-30m'], [30 * MIN, '30-45m'],
    [45 * MIN, '45-60m'], [60 * MIN, '60m-plus'], [5 * HOUR, '60m-plus'], ['junk', 'under-1m'], [-5, 'under-1m']];
  for (const [ms, expected] of cases) assert.equal(core.bucketCallLength(ms), expected, String(ms));
});

test('calls per day and hours per day fall into the right range', () => {
  const calls = [[0, '1-3'], [3, '1-3'], [4, '4-6'], [6, '4-6'], [7, '7-10'], [10, '7-10'], [11, '11-15'], [15, '11-15'], [16, '16-20'],
    [21, '21-25'], [26, '26-30'], [31, '31-40'], [41, '41-50'], [50, '41-50'], [51, '51-plus'], [500, '51-plus']];
  for (const [n, expected] of calls) assert.equal(core.bucketDayCalls(n), expected, `calls ${n}`);
  const hours = [[0, '0-0.5h'], [HOUR / 2 - 1, '0-0.5h'], [HOUR / 2, '0.5-1h'], [HOUR, '1-1.5h'], [1.5 * HOUR, '1.5-2h'], [2 * HOUR, '2-2.5h'],
    [4.25 * HOUR, '4-4.5h'], [7.9 * HOUR, '7.5-8h'], [8 * HOUR, '8-8.5h'], [9.99 * HOUR, '9.5-10h'], [10 * HOUR, '10h-plus'], [20 * HOUR, '10h-plus'], ['junk', '0-0.5h']];
  for (const [ms, expected] of hours) assert.equal(core.bucketDayHours(ms), expected, `hours ${ms}`);
});

test('every range is a fixed label, so no exact value can leak through it', () => {
  const labels = allLabels(core);
  assert.equal(labels.length.size, 12);
  assert.equal(labels.calls.size, 10);
  assert.equal(labels.hours.size, 21);
  for (const label of [...labels.length, ...labels.calls, ...labels.hours]) assert.match(label, /^[a-z0-9.-]+$/);
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
  assert.deepEqual(summary.events, ['day-calls/1-3', 'day-hours/2.5-3h']);
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
