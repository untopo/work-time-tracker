import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCore } from './load-core.mjs';

const { core } = loadCore();
const plain = (v) => JSON.parse(JSON.stringify(v));
const call = (n) => ({ id: `c${n}`, rate: 'Propio', duration: 60000 * n, earnings: 0.12 * n });

test('a valid list is read as is', () => {
  const r = core.salvageList(JSON.stringify([call(1), call(2)]));
  assert.equal(r.status, 'ok');
  assert.equal(r.value.length, 2);
});

test('missing or empty text is just empty, not damaged', () => {
  assert.equal(core.salvageList(null).status, 'empty');
  assert.equal(core.salvageList('').status, 'empty');
  assert.deepEqual(plain(core.salvageList(undefined).value), []);
});

test('a list cut off while saving keeps every complete call', () => {
  const full = JSON.stringify([call(1), call(2), call(3), call(4)]);
  const cut = full.slice(0, full.length - 25); // the last call is cut in the middle
  const r = core.salvageList(cut);
  assert.equal(r.status, 'salvaged');
  assert.equal(r.recovered, 3);
  assert.equal(r.dropped, 1);
  assert.deepEqual(plain(r.value.map((c) => c.id)), ['c1', 'c2', 'c3']);
});

test('text inside notes (braces, quotes, escapes) does not confuse the scan', () => {
  const tricky = [{ id: 'a', notes: 'has } and { and "quotes" and \\ slash' }, { id: 'b', notes: '[x]' }];
  const full = JSON.stringify(tricky);
  const r = core.salvageList(full.slice(0, full.length - 3));
  assert.equal(r.status, 'salvaged');
  assert.equal(r.recovered, 1);
  assert.equal(r.value[0].notes, tricky[0].notes);
});

test('text that is not a list at all is unreadable, never turned into data', () => {
  assert.equal(core.salvageList('hello').status, 'unreadable');
  assert.equal(core.salvageList('{"a":1}').status, 'unreadable');
});

test('loading reads each key on its own: damaged calls do not touch rates or goal', () => {
  const store = {
    rates: JSON.stringify([{ name: 'Propio', rate: 0.12 }]),
    calls: '[{"id":"a","duration":1000},{"id":"b","dura',
    dailyGoal: JSON.stringify({ amount: 50, minutes: 120 }),
    paymentCyclesEnabled: 'true'
  };
  const out = core.loadCoreStoredData((key) => (key in store ? store[key] : null));
  assert.equal(out.rates.length, 1);
  assert.equal(out.calls.length, 1);
  assert.deepEqual(plain(out.dailyGoal), { amount: 50, minutes: 120 });
  assert.equal(out.paymentCyclesEnabled, true);
  assert.deepEqual(Object.keys(out.damaged), ['calls']);
  assert.equal(out.damaged.calls.raw, store.calls, 'the original text is kept');
  assert.equal(out.summary.calls.recovered, 1);
});

test('an unreadable goal is flagged and falls back to null so the app can use its defaults', () => {
  const out = core.loadCoreStoredData((key) => (key === 'dailyGoal' ? '{amount:' : null));
  assert.equal(out.dailyGoal, null);
  assert.ok(out.damaged.dailyGoal);
});

test('healthy data reports nothing damaged', () => {
  const out = core.loadCoreStoredData(() => null);
  assert.deepEqual(plain(out.damaged), {});
  assert.deepEqual(plain(out.calls), []);
});

test('the recovery file reads like a normal backup and carries the original text', () => {
  const raw = { calls: '[{"id":"a","duration":1000},{"id":"b","du', rates: '[{"name":"X","rate":0.1}]', dailyGoal: '{"amount":10,"minutes":0}', paymentCyclesEnabled: 'false' };
  const snap = core.buildRecoverySnapshot({ reason: 'damaged-data', rawByKey: raw, createdAt: '2026-11-18T10:00:00.000Z', appVersion: '1.8.4', summary: { calls: { status: 'salvaged', recovered: 1, dropped: 1 } } });
  assert.equal(core.isRecoverySnapshot(snap), true);
  const file = core.buildRecoveryFile(snap);
  assert.equal(file.calls.length, 1);
  assert.equal(file.rates.length, 1);
  assert.deepEqual(plain(file.dailyGoal), { amount: 10, minutes: 0 });
  assert.equal(file.rawData.calls, raw.calls);
  assert.equal(file.recovery.appVersion, '1.8.4');
  assert.equal(core.buildRecoveryFile({ nope: true }), null);
});

test('payment cycles fall back to their own backup key in the recovery file', () => {
  const snap = core.buildRecoverySnapshot({ rawByKey: { paymentCycles: 'broken', paymentCycles_backup: '[{"id":1}]' } });
  assert.equal(core.buildRecoveryFile(snap).paymentCycles.length, 1);
});

test('plain-language descriptions', () => {
  const dmg = core.buildRecoverySnapshot({ reason: 'damaged-data', summary: { calls: { status: 'salvaged', recovered: 120, dropped: 1 } } });
  assert.match(core.describeRecovery(dmg), /120 calls recovered, 1 could not be read/);
  const reset = core.buildRecoverySnapshot({ reason: 'reset-all' });
  assert.match(core.describeRecovery(reset), /restore it/);
  assert.equal(core.describeRecovery(null), '');
});

test('delete-calls snapshots are restorable and described', () => {
  const snap = core.buildRecoverySnapshot({ reason: 'delete-calls', rawByKey: { calls: '[]' }, appVersion: '1.8.4' });
  assert.equal(snap.reason, 'delete-calls');
  assert.equal(core.isRestorableSnapshot(snap), true);
  assert.match(core.describeRecovery(snap), /erased your call history/);
});

test('damaged-data snapshots are not restorable and unknown reasons fall back to damaged-data', () => {
  const snap = core.buildRecoverySnapshot({ reason: 'whatever', rawByKey: { calls: '[{' } });
  assert.equal(snap.reason, 'damaged-data');
  assert.equal(core.isRestorableSnapshot(snap), false);
  assert.equal(core.isRestorableSnapshot(null), false);
});

test('recovery file includes older copies when present', () => {
  const older = core.buildRecoverySnapshot({ reason: 'reset-all', rawByKey: { calls: '[{"id":"a"}]' } });
  const snap = core.buildRecoverySnapshot({ reason: 'damaged-data', rawByKey: { calls: '[{"id":"b"}]' } });
  snap.older = [older, { junk: true }];
  const file = core.buildRecoveryFile(snap);
  assert.equal(file.olderCopies.length, 1);
  assert.equal(file.olderCopies[0].rawData.calls, '[{"id":"a"}]');
  assert.equal(core.buildRecoveryFile({}), null);
});
