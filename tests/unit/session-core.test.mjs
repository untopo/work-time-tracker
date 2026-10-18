// Saved sessions and the unfinished live call must be repaired, never crash the app on load.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core } = loadCore();

test('a session state with junk values is repaired to a safe idle session', () => {
  const idle = plain(core.getSessionDefaultState());
  assert.deepEqual(plain(core.normalizeSessionTrackerState(null)), idle);
  assert.deepEqual(plain(core.normalizeSessionTrackerState('garbage')), idle);
  const broken = plain(core.normalizeSessionTrackerState({ active: true, startMs: 'abc', paused: true }));
  assert.equal(broken.active, false, 'a session without a valid start cannot be active');
  assert.equal(broken.paused, false);
  assert.equal(broken.startMs, 0);
});

test('a valid running session is kept as saved', () => {
  const state = plain(core.normalizeSessionTrackerState({ active: true, paused: false, startMs: 1760000000000, pausedTotalMs: 5000, pauseCount: 2 }));
  assert.equal(state.active, true);
  assert.equal(state.startMs, 1760000000000);
  assert.equal(state.pausedTotalMs, 5000);
  assert.equal(state.pauseCount, 2);
});

test('only a running session can be paused', () => {
  assert.equal(plain(core.normalizeSessionTrackerState({ active: false, paused: true, startMs: 5 })).paused, false);
});

test('session history drops invalid entries, caps numbers, sorts newest first and keeps 60', () => {
  const entries = [
    { id: 'old', startedAtMs: 1000, endedAtMs: 2000, utilization: 250, callCount: 2.6, talkMs: -5 },
    { id: 'new', startedAtMs: 5000, endedAtMs: 9000, utilization: 40 },
    { id: 'backwards', startedAtMs: 9000, endedAtMs: 1000 },
    { id: 'nan', startedAtMs: 'x', endedAtMs: 10 },
  ];
  const result = plain(core.normalizeSessionHistoryEntries(entries));
  assert.deepEqual(result.map((entry) => entry.id), ['new', 'old']);
  assert.equal(result[1].utilization, 100, 'utilization capped at 100');
  assert.equal(result[1].callCount, 3, 'call count rounded');
  assert.equal(result[1].talkMs, 0, 'negative time floored at 0');

  const many = Array.from({ length: 80 }, (_, i) => ({ startedAtMs: i, endedAtMs: i + 1 }));
  assert.equal(core.normalizeSessionHistoryEntries(many).length, 60);
  assert.deepEqual(plain(core.normalizeSessionHistoryEntries('nope')), []);
});

test('the unfinished-call record needs a valid start, and fills safe defaults for the rest', () => {
  assert.equal(core.normalizeActiveCallSession(null), null);
  assert.equal(core.normalizeActiveCallSession({ start: 0 }), null);
  assert.equal(core.normalizeActiveCallSession({ start: 'x' }), null);
  const saved = plain(core.normalizeActiveCallSession({ start: 1760000000000, rate: 0.12, rateName: ' Propio ', lastPing: 1760000005000 }));
  assert.deepEqual(saved, { start: 1760000000000, rate: 0.12, rateName: 'Propio', lastPing: 1760000005000 });
  const minimal = plain(core.normalizeActiveCallSession({ start: 1760000000000, rate: -1 }));
  assert.equal(minimal.rate, 0);
  assert.equal(minimal.rateName, null);
  assert.equal(minimal.lastPing, 1760000000000, 'last ping defaults to the start');
});
