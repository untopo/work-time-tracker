// Pause intervals and "who did it" for work sessions (data only: nothing here changes how
// a session behaves on screen). Older saved sessions have none of these fields and must still load.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core, run } = loadCore();
const MIN = 60000;
const T0 = 1760000000000;

test('the session history is no longer cut at 60 sessions', () => {
  const many = Array.from({ length: 200 }, (_, i) => ({ startedAtMs: i, endedAtMs: i + 1 }));
  assert.equal(core.normalizeSessionHistoryEntries(many).length, 200);
  assert.equal(run('SESSION_HISTORY_MAX_ENTRIES'), 5000, 'there is still a very high safety limit');
  const huge = Array.from({ length: 5200 }, (_, i) => ({ startedAtMs: i, endedAtMs: i + 1 }));
  const kept = plain(core.normalizeSessionHistoryEntries(huge));
  assert.equal(kept.length, 5000);
  assert.equal(kept[0].endedAtMs, 5200, 'the newest ones are kept');
});

test('normalizeSessionPauses cuts to the window, sorts, merges overlaps and drops empty ones', () => {
  const out = plain(core.normalizeSessionPauses([
    { startMs: 500, endMs: 900, by: 'auto' },
    { startMs: 100, endMs: 300 },
    { startMs: 250, endMs: 400, by: 'auto' },
    { startMs: 700, endMs: 700 },
    { startMs: 'x', endMs: 5 },
    { startMs: 2000, endMs: 3000 }
  ], 200, 1000));
  assert.deepEqual(out, [
    { startMs: 200, endMs: 400, by: 'manual' },
    { startMs: 500, endMs: 900, by: 'auto' }
  ]);
  assert.deepEqual(plain(core.normalizeSessionPauses(undefined, 0, 10)), []);
  assert.deepEqual(plain(core.normalizeSessionPauses('nope', 0, 10)), []);
});

test('getSessionPausedMsBetween counts only the paused time inside the window', () => {
  const pauses = [{ startMs: 100, endMs: 300 }, { startMs: 600, endMs: 800 }];
  assert.equal(core.getSessionPausedMsBetween(pauses, 0, 1000), 400);
  assert.equal(core.getSessionPausedMsBetween(pauses, 200, 700), 200, 'half of each pause');
  assert.equal(core.getSessionPausedMsBetween(pauses, 300, 600), 0);
  assert.equal(core.getSessionPausedMsBetween(undefined, 0, 1000), 0);
});

test('pausing and resuming records the interval, who did it, and the totals the screen already used', () => {
  let state = plain(core.normalizeSessionTrackerState({ active: true, startMs: T0 }));
  state = plain(core.startSessionPause(state, T0 + 30 * MIN, 'manual'));
  assert.equal(state.paused, true);
  assert.equal(state.pauseStartedMs, T0 + 30 * MIN);
  assert.equal(state.pauseCount, 1);
  assert.equal(state.pauseBy, 'manual');
  state = plain(core.endSessionPause(state, T0 + 45 * MIN));
  assert.equal(state.paused, false);
  assert.equal(state.pauseStartedMs, 0);
  assert.equal(state.pausedTotalMs, 15 * MIN, 'same paused total as before');
  assert.deepEqual(state.pauseLog, [{ startMs: T0 + 30 * MIN, endMs: T0 + 45 * MIN, by: 'manual' }]);

  state = plain(core.startSessionPause(state, T0 + 60 * MIN, 'auto'));
  state = plain(core.endSessionPause(state, T0 + 100 * MIN));
  assert.equal(state.pauseCount, 2);
  assert.equal(state.pausedTotalMs, 55 * MIN);
  assert.deepEqual(state.pauseLog.map((pause) => pause.by), ['manual', 'auto']);
});

test('resuming something that is not paused changes nothing', () => {
  const state = plain(core.normalizeSessionTrackerState({ active: true, startMs: T0, pausedTotalMs: 5 * MIN }));
  const after = plain(core.endSessionPause(state, T0 + 10 * MIN));
  assert.equal(after.pausedTotalMs, 5 * MIN);
  assert.deepEqual(after.pauseLog, []);
});

test('a pause that is still open when the session ends is saved up to the end', () => {
  let state = plain(core.normalizeSessionTrackerState({ active: true, startMs: T0 }));
  state = plain(core.startSessionPause(state, T0 + 10 * MIN, 'manual'));
  state = plain(core.endSessionPause(state, T0 + 20 * MIN));
  state = plain(core.startSessionPause(state, T0 + 50 * MIN, 'auto'));
  const pauses = plain(core.getSessionPausesForHistory(state, T0 + 80 * MIN));
  assert.deepEqual(pauses, [
    { startMs: T0 + 10 * MIN, endMs: T0 + 20 * MIN, by: 'manual' },
    { startMs: T0 + 50 * MIN, endMs: T0 + 80 * MIN, by: 'auto' }
  ]);
});

test('a saved session state with the new fields is kept, and an old one still loads', () => {
  const saved = plain(core.normalizeSessionTrackerState({
    active: true, paused: true, startMs: T0, pausedTotalMs: 10 * MIN, pauseStartedMs: T0 + 40 * MIN, pauseCount: 2,
    pauseBy: 'auto', origin: 'auto', pauseLog: [{ startMs: T0 + 5 * MIN, endMs: T0 + 15 * MIN, by: 'manual' }]
  }));
  assert.equal(saved.origin, 'auto');
  assert.equal(saved.pauseBy, 'auto');
  assert.equal(saved.pauseLog.length, 1);

  const old = plain(core.normalizeSessionTrackerState({ active: true, paused: false, startMs: T0, pausedTotalMs: 5000, pauseCount: 1 }));
  assert.equal(old.origin, 'manual');
  assert.deepEqual(old.pauseLog, []);
  assert.equal(old.pausedTotalMs, 5000);

  const idle = plain(core.normalizeSessionTrackerState({ active: false, origin: 'auto', pauseLog: [{ startMs: 1, endMs: 2 }] }));
  assert.deepEqual(idle.pauseLog, [], 'an idle session keeps no pauses');
});

test('a finished session keeps its pauses and who started and ended it; old ones get safe defaults', () => {
  const [kept] = plain(core.normalizeSessionHistoryEntries([{
    id: 'a', startedAtMs: T0, endedAtMs: T0 + 120 * MIN, pauseCount: 0,
    pauses: [{ startMs: T0 + 30 * MIN, endMs: T0 + 60 * MIN, by: 'auto' }, { startMs: T0 + 500 * MIN, endMs: T0 + 600 * MIN }],
    startedBy: 'auto', endedBy: 'auto'
  }]));
  assert.equal(kept.pauses.length, 1, 'a pause outside the session is dropped');
  assert.equal(kept.pauseCount, 1, 'the count is never lower than the known pauses');
  assert.equal(kept.startedBy, 'auto');
  assert.equal(kept.endedBy, 'auto');

  const [legacy] = plain(core.normalizeSessionHistoryEntries([{ id: 'old', startedAtMs: T0, endedAtMs: T0 + MIN, pauseCount: 3 }]));
  assert.deepEqual(legacy.pauses, [], 'nothing is invented for older sessions');
  assert.equal(legacy.pauseCount, 3, 'their pause count is kept');
  assert.equal(legacy.startedBy, 'manual');
  assert.equal(legacy.endedBy, 'manual');
});
