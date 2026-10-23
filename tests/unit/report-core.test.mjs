// Monthly report and share card: the numbers on the page must match the saved calls.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core } = loadCore();
const MIN = 60000;

// Local-time helpers so the tests give the same answer in any time zone.
const at = (y, m, d, h = 10, min = 0) => new Date(y, m - 1, d, h, min).toISOString();
const call = (iso, minutes, rate = 1, rateName = 'Medical') => ({
  startTime: iso,
  duration: minutes * MIN,
  rate,
  rateName,
  earnings: minutes * rate
});
const build = (input) => plain(core.buildMonthlyReport({ year: 2026, month: 8, ...input })); // month 8 = September

test('month range, label and weeks (Monday start, cut at month edges)', () => {
  const r = build({});
  assert.equal(r.range.label, 'September 2026');
  assert.equal(r.range.daysInMonth, 30);
  // Sept 1 2026 is a Tuesday: weeks are 1-6, 7-13, 14-20, 21-27, 28-30.
  assert.deepEqual(r.weeks.map((w) => [w.startDay, w.endDay]), [[1, 6], [7, 13], [14, 20], [21, 27], [28, 30]]);
  assert.equal(r.weeks[0].label, 'Sep 1-6');
  assert.equal(r.hasData, false);
});

test('totals only count calls that started inside the month', () => {
  const r = build({
    calls: [
      call(at(2026, 9, 1, 0, 5), 10),
      call(at(2026, 9, 30, 23, 50), 20),
      call(at(2026, 8, 31, 23, 59), 99),
      call(at(2026, 10, 1, 0, 0), 99)
    ]
  });
  assert.equal(r.totals.calls, 2);
  assert.equal(r.totals.earnings, 30);
  assert.equal(r.totals.talkMs, 30 * MIN);
  assert.equal(r.totals.avgCallMs, 15 * MIN);
});

test('weekly bars add up to the month total', () => {
  const r = build({
    calls: [call(at(2026, 9, 2), 10, 2), call(at(2026, 9, 8), 5, 2), call(at(2026, 9, 29), 7, 2)]
  });
  assert.deepEqual(r.weeks.map((w) => w.earnings), [20, 10, 0, 0, 14]);
  assert.equal(r.weeks.reduce((s, w) => s + w.earnings, 0), r.totals.earnings);
  assert.equal(r.bestWeekIndex, 0);
});

test('rates are grouped by name and per-minute value, biggest earner first', () => {
  const r = build({
    calls: [call(at(2026, 9, 2), 10, 1, 'Medical'), call(at(2026, 9, 3), 10, 1, 'medical'), call(at(2026, 9, 4), 10, 3, 'Legal')]
  });
  assert.deepEqual(r.byRate.map((x) => [x.name, x.calls, x.earned]), [['Legal', 1, 30], ['Medical', 2, 20]]);
});

test('daily goal in dollars: days reached, active days, streak and best day', () => {
  const r = build({
    dailyGoal: { amount: 50, minutes: 0 },
    calls: [
      call(at(2026, 9, 1), 60, 1), // 60  reached
      call(at(2026, 9, 2), 30, 1), // 30  no
      call(at(2026, 9, 3), 40, 1), // 40
      call(at(2026, 9, 3, 15), 20, 1), // +20 = 60 reached
      call(at(2026, 9, 10), 10, 1)
    ]
  });
  assert.equal(r.goal.type, 'amount');
  assert.equal(r.goal.reachedDays, 2);
  assert.equal(r.goal.activeDays, 4);
  assert.equal(r.goal.percent, 50);
  assert.equal(r.activeDays, 4);
  assert.equal(r.streak, 3);
  assert.equal(r.bestDay.earnings, 60);
});

test('daily goal in minutes is used when no amount is set; no goal gives null', () => {
  const calls = [call(at(2026, 9, 1), 90), call(at(2026, 9, 2), 30)];
  assert.equal(build({ calls, dailyGoal: { amount: 0, minutes: 60 } }).goal.reachedDays, 1);
  assert.equal(build({ calls, dailyGoal: { amount: 0, minutes: 0 } }).goal, null);
  assert.equal(build({ calls }).goal, null);
});

test('a call that crosses an hour is split between both hours in the heatmap', () => {
  // Wednesday Sept 2 2026, 9:50 to 10:20
  const r = build({ calls: [call(at(2026, 9, 2, 9, 50), 30)] });
  const wed = r.heat[2];
  assert.ok(Math.abs(wed[9] - 10) < 0.01);
  assert.ok(Math.abs(wed[10] - 20) < 0.01);
  assert.equal(r.heatHours.from, 6);
  assert.equal(r.heatHours.to, 21);
});

test('heatmap hours widen when there is work late at night', () => {
  const r = build({ calls: [call(at(2026, 9, 2, 23, 10), 20), call(at(2026, 9, 3, 4, 0), 10)] });
  assert.equal(r.heatHours.from, 4);
  assert.equal(r.heatHours.to, 23);
});

test('time on the platform comes from sessions that ended in the month', () => {
  const end = new Date(2026, 8, 15, 18).getTime();
  const r = build({
    sessions: [
      { endedAtMs: end, availableMs: 10 * 3600000, talkMs: 6 * 3600000, earned: 120 },
      { endedAtMs: new Date(2026, 7, 15).getTime(), availableMs: 3600000, talkMs: 3600000, earned: 999 }
    ]
  });
  assert.equal(r.time.sessions, 1);
  assert.equal(r.time.utilization, 60);
  assert.equal(r.time.perConnectedHour, 12);
  assert.equal(r.time.perTalkHour, 20);
  assert.equal(build({}).time, null);
});

test('payment cycles that touch the month are listed, with the last day included', () => {
  const r = build({
    calls: [call(at(2026, 9, 10), 10, 1), call(at(2026, 9, 15, 20), 10, 1), call(at(2026, 9, 16), 10, 1)],
    paymentCycles: [
      { startDate: new Date(2026, 8, 1).toISOString(), endDate: new Date(2026, 8, 15).toISOString() },
      { startDate: new Date(2026, 8, 16).toISOString(), endDate: new Date(2026, 8, 30).toISOString() },
      { startDate: new Date(2026, 6, 1).toISOString(), endDate: new Date(2026, 6, 15).toISOString() },
      { startDate: 'junk', endDate: 'junk' }
    ]
  });
  assert.equal(r.cycles.length, 2);
  assert.deepEqual(r.cycles.map((c) => [c.calls, c.earned]), [[2, 20], [1, 10]]);
});

test('junk input never throws and never invents data', () => {
  for (const bad of [undefined, null, 'x', 5, { calls: 'nope', sessions: 7, paymentCycles: {} }, { calls: [null, 1, {}, { startTime: 'bad' }] }]) {
    const r = plain(core.buildMonthlyReport(bad));
    assert.equal(r.hasData, false);
    assert.equal(r.totals.earnings, 0);
  }
});

test('the report page is escaped and has two pages in both themes', () => {
  const r = core.buildMonthlyReport({ year: 2026, month: 8, calls: [call(at(2026, 9, 2), 10, 1, '<img src=x onerror=alert(1)>')] });
  for (const theme of ['dark', 'light']) {
    const html = core.renderMonthlyReportHtml(r, theme, 'Oct 22, 2026');
    assert.ok(html.includes(`data-theme="${theme}"`));
    assert.equal((html.match(/wtt-report-page"/g) || []).length, 2);
    assert.ok(!html.includes('<img src=x'));
    assert.ok(html.includes('&lt;img'));
    assert.ok(html.includes('Generated on this device. Your data is never uploaded.'));
  }
});

test('share card hides earnings by default and shows them only when asked', () => {
  const r = core.buildMonthlyReport({
    year: 2026, month: 8, dailyGoal: { amount: 10, minutes: 0 },
    calls: [call(at(2026, 9, 2), 30, 2), call(at(2026, 9, 9), 15, 2)]
  });
  const hidden = JSON.stringify(plain(core.buildShareCardData(r)));
  assert.ok(!hidden.includes('$'));
  assert.ok(hidden.includes('Days on my goal'));
  const shown = plain(core.buildShareCardData(r, { showEarnings: true }));
  assert.ok(JSON.stringify(shown).includes('$90.00'));
  assert.equal(shown.showsEarnings, true);
  // bars are time, not money
  assert.equal(shown.bars.length, r.weeks.length);
});
