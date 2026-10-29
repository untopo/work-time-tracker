// Direct tests of the data logic in assets/js/data-core.js (no browser needed, runs in a blink).
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Load the script the same way a browser would: plain script, global functions.
const sandbox = vm.createContext({ console });
vm.runInContext(fs.readFileSync(new URL('../../assets/js/data-core.js', import.meta.url), 'utf8'), sandbox);
const core = sandbox;
const plain = (value) => JSON.parse(JSON.stringify(value)); // drop vm prototypes for deepEqual

const call = (id, startIso, minutes, rate = 0.12) => ({
  id, startTime: startIso, endTime: new Date(Date.parse(startIso) + minutes * 60000).toISOString(), rate,
});

test('normalizeCall fills in duration and earnings from start, end and rate', () => {
  const result = core.normalizeCall(call('a', '2026-10-01T10:00:00.000Z', 10, 0.12));
  assert.equal(result.id, 'a');
  assert.equal(result.duration, 600000);
  assert.equal(result.earnings, 1.2);
  assert.equal(result.earned, 1.2, 'legacy "earned" field is kept in sync');
});

test('normalizeCall trims notes, keeps unknown fields, and never throws on junk', () => {
  const kept = core.normalizeCall({ ...call('a', '2026-10-01T10:00:00.000Z', 5), notes: '  hello  ', rateName: 'Propio', custom: 7 });
  assert.equal(kept.notes, 'hello');
  assert.equal(kept.rateName, 'Propio');
  assert.equal(kept.custom, 7);
  const empty = core.normalizeCall({});
  assert.equal(empty.duration, 0);
  assert.equal(empty.earnings, 0);
  assert.ok(empty.id, 'gets an id');
});

test('normalizeCall can rebuild the end time from a duration', () => {
  const result = core.normalizeCall({ startTime: '2026-10-01T10:00:00.000Z', duration: 600000, rate: 0.1 });
  assert.equal(result.endTime, '2026-10-01T10:10:00.000Z');
  assert.equal(result.earnings, 1);
});

test('mergeCallsWithExisting adds new calls and skips ones already there, even with a different id', () => {
  const existing = [call('a', '2026-10-01T10:00:00.000Z', 10)];
  const incoming = [
    call('b', '2026-10-01T10:00:00.000Z', 10), // same moment and length as "a" -> duplicate
    call('c', '2026-10-02T10:00:00.000Z', 5),
  ];
  const result = core.mergeCallsWithExisting(existing, incoming);
  assert.equal(result.addedCount, 1);
  assert.equal(result.skippedCount, 1);
  assert.deepEqual(plain(result.merged).map((item) => item.id), ['a', 'c']);
});

test('mergeCallsWithExisting never loses the calls you already have', () => {
  const existing = [call('a', '2026-10-01T10:00:00.000Z', 10), call('b', '2026-10-02T10:00:00.000Z', 3)];
  const result = core.mergeCallsWithExisting(existing, []);
  assert.equal(result.addedCount, 0);
  assert.deepEqual(plain(result.merged).map((item) => item.id), ['a', 'b']);
  const twice = core.mergeCallsWithExisting(result.merged, existing);
  assert.equal(twice.addedCount, 0, 'importing the same calls again adds nothing');
  assert.equal(twice.merged.length, 2);
});

test('mergeRatesWithExisting ignores duplicates (any capitalization), blank names and negative amounts', () => {
  const result = core.mergeRatesWithExisting(
    [{ name: 'A', amount: 0.1 }],
    [{ name: 'a', amount: 0.1 }, { name: 'B', amount: 0.2 }, { name: '', amount: 1 }, { name: 'C', amount: -1 }],
  );
  assert.deepEqual(plain(result.merged), [{ name: 'A', amount: 0.1 }, { name: 'B', amount: 0.2 }]);
  assert.equal(result.addedCount, 1);
  assert.equal(result.skippedCount, 3);
});

test('mergePaymentCyclesWithExisting does not duplicate a cycle with the same dates', () => {
  const cycle = { startDate: '2026-10-03T05:00:00.000Z', endDate: '2026-10-16T05:00:00.000Z', payDate: '2026-10-21T05:00:00.000Z' };
  const result = core.mergePaymentCyclesWithExisting([cycle], [cycle, { ...cycle, startDate: '2026-10-17T05:00:00.000Z' }]);
  assert.equal(result.addedCount, 1);
  assert.equal(result.merged.length, 2);
});

test('parseCsvText handles quotes, commas inside quotes, doubled quotes and line breaks', () => {
  const rows = plain(core.parseCsvText('a,b\r\n"x,1","he said ""hi"""\n"two\nlines",z\n'));
  assert.deepEqual(rows[0], ['a', 'b']);
  assert.deepEqual(rows[1], ['x,1', 'he said "hi"']);
  assert.deepEqual(rows[2], ['two\nlines', 'z']);
});

test('escapeCsvCell quotes only when needed and doubles inner quotes', () => {
  assert.equal(core.escapeCsvCell('plain'), 'plain');
  assert.equal(core.escapeCsvCell('a,b'), '"a,b"');
  assert.equal(core.escapeCsvCell('say "hi"'), '"say ""hi"""');
});

test('escapeHTML neutralizes markup so notes can never inject HTML', () => {
  assert.equal(core.escapeHTML('<b onclick="x">&</b>'), '&lt;b onclick=&quot;x&quot;&gt;&amp;&lt;/b&gt;');
});

test('formatTime and formatEarnings give the formats shown on screen', () => {
  assert.equal(core.formatTime(3725000), '01:02:05');
  assert.equal(core.formatTime(0), '00:00:00');
  assert.equal(core.formatEarnings(12.3), '$12.30');
  assert.equal(core.formatEarnings('not a number'), '$0.00');
});

test('normalizeDailyGoal repairs bad stored values instead of breaking', () => {
  assert.deepEqual(plain(core.normalizeDailyGoal({ amount: '40', minutes: 240 })), { amount: 40, minutes: 240 });
  const broken = plain(core.normalizeDailyGoal(null));
  assert.equal(broken.amount, 0);
  assert.equal(broken.minutes, 0);
  const negative = plain(core.normalizeDailyGoal({ amount: -5, minutes: 'x' }));
  assert.ok(negative.amount >= 0 && negative.minutes >= 0);
});

test('getDayStartMs returns local midnight of the given day', () => {
  // Build the date inside the same VM realm, because the function checks `instanceof Date`.
  const noon = vm.runInContext('new Date(2026, 9, 16, 12, 34, 56)', sandbox);
  assert.equal(core.getDayStartMs(noon), new Date(2026, 9, 16).getTime());
});

test('describeBackupAge says "No backup yet", "Today", "Yesterday" or how many days ago', () => {
  const now = new Date(2026, 9, 28, 15, 0).getTime();
  const at = (days, hour = 9) => new Date(2026, 9, 28 - days, hour, 0).getTime();
  assert.equal(core.describeBackupAge(0, now), 'No backup yet');
  assert.equal(core.describeBackupAge(undefined, now), 'No backup yet');
  assert.equal(core.describeBackupAge('junk', now), 'No backup yet');
  assert.equal(core.describeBackupAge(at(0), now), 'Today');
  assert.equal(core.describeBackupAge(at(1, 23), now), 'Yesterday');
  assert.equal(core.describeBackupAge(at(12), now), '12 days ago');
  assert.equal(core.describeBackupAge(now + 5 * 3600000, now), 'Today', 'a clock set in the future never shows a negative age');
});
