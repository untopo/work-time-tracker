// Session automation: a pure decision function checked against a fake clock.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core, run } = loadCore();
const MIN = 60000;
const T0 = 1760000000000; // any fixed moment
const ON = { enabled: true, pauseAfterMin: 30, endAfterMin: 90 };

const running = (extra = {}) => plain(core.normalizeSessionTrackerState({ active: true, startMs: T0, lastActivityMs: T0, ...extra }));
const plan = (state, settings, atMin, activeCall = false) => plain(core.planSessionAutomation(state, settings, T0 + atMin * MIN, activeCall));

test('automation is off by default and bad saved values fall back to safe ones', () => {
  assert.deepEqual(plain(core.getSessionAutomationDefaults()), { enabled: false, pauseAfterMin: 30, endAfterMin: 90 });
  assert.deepEqual(plain(core.normalizeSessionAutomationSettings(undefined)), { enabled: false, pauseAfterMin: 30, endAfterMin: 90 });
  assert.deepEqual(plain(core.normalizeSessionAutomationSettings({ enabled: 'yes', pauseAfterMin: 7, endAfterMin: 'x' })), { enabled: false, pauseAfterMin: 30, endAfterMin: 90 });
  assert.deepEqual(plain(core.normalizeSessionAutomationSettings({ enabled: true, pauseAfterMin: 45, endAfterMin: 180 })), { enabled: true, pauseAfterMin: 45, endAfterMin: 180 });
  assert.deepEqual(plain(core.normalizeSessionAutomationSettings([1, 2])), { enabled: false, pauseAfterMin: 30, endAfterMin: 90 });
});

test('with automation off nothing ever happens', () => {
  assert.equal(plan(running(), { enabled: false }, 10000), null);
  assert.equal(plan(running(), undefined, 10000), null);
});

test('no session, or a live call in progress, means no action', () => {
  assert.equal(plan(plain(core.normalizeSessionTrackerState({})), ON, 500), null);
  assert.equal(plan(running(), ON, 500, true), null, 'never pauses or ends during an active call');
});

test('a running session pauses once quiet time reaches the limit, stamped at that moment', () => {
  assert.equal(plan(running(), ON, 29), null);
  assert.deepEqual(plan(running(), ON, 30), { action: 'pause', atMs: T0 + 30 * MIN });
  assert.deepEqual(plan(running(), ON, 45), { action: 'pause', atMs: T0 + 30 * MIN }, 'noticing late does not move the time');
});

test('quiet time is counted from the last real activity, not from the start', () => {
  const state = running({ lastActivityMs: T0 + 50 * MIN });
  assert.equal(plan(state, ON, 79), null);
  assert.deepEqual(plan(state, ON, 80), { action: 'pause', atMs: T0 + 80 * MIN });
  assert.deepEqual(plan(state, { ...ON, pauseAfterMin: 15 }, 65), { action: 'pause', atMs: T0 + 65 * MIN });
});

test('markSessionActivity moves the clock forward and never back', () => {
  let state = running();
  state = plain(core.markSessionActivity(state, T0 + 20 * MIN));
  assert.equal(state.lastActivityMs, T0 + 20 * MIN);
  state = plain(core.markSessionActivity(state, T0 + 5 * MIN));
  assert.equal(state.lastActivityMs, T0 + 20 * MIN);
  assert.equal(plain(core.markSessionActivity(plain(core.normalizeSessionTrackerState({})), T0)).active, false, 'an idle session stays untouched');
});

test('a paused session ends where its pause began, once the end time has passed', () => {
  const paused = plain(core.startSessionPause(running(), T0 + 30 * MIN, 'auto'));
  assert.equal(plan(paused, ON, 30 + 89), null);
  assert.deepEqual(plan(paused, ON, 30 + 90), { action: 'end', atMs: T0 + 30 * MIN });
  assert.deepEqual(plan(paused, ON, 24 * 60), { action: 'end', atMs: T0 + 30 * MIN });
});

test('a pause you made yourself also counts toward ending the session', () => {
  const manual = plain(core.startSessionPause(running({ lastActivityMs: T0 + 100 * MIN }), T0 + 100 * MIN, 'manual'));
  assert.equal(plan(manual, ON, 100 + 89), null);
  assert.deepEqual(plan(manual, ON, 100 + 90), { action: 'end', atMs: T0 + 100 * MIN });
  assert.equal(plan(manual, { enabled: false }, 100 + 900), null, 'and never when automation is off');
});

test('after a long absence the session ends at the moment it would have paused', () => {
  assert.deepEqual(plan(running(), ON, 30 + 90), { action: 'end', atMs: T0 + 30 * MIN });
  assert.deepEqual(plan(running(), ON, 600), { action: 'end', atMs: T0 + 30 * MIN });
  assert.deepEqual(plan(running(), { enabled: true, pauseAfterMin: 60, endAfterMin: 30 }, 90), { action: 'end', atMs: T0 + 60 * MIN });
});

test('resuming restarts the quiet-time count', () => {
  let state = plain(core.startSessionPause(running(), T0 + 30 * MIN, 'auto'));
  state = plain(core.endSessionPause(state, T0 + 60 * MIN));
  state = plain(core.markSessionActivity(state, T0 + 60 * MIN));
  assert.equal(plan(state, ON, 89), null);
  assert.deepEqual(plan(state, ON, 90), { action: 'pause', atMs: T0 + 90 * MIN });
});

test('applying the plan once leaves nothing more to do: no duplicate actions', () => {
  let state = running();
  const first = plan(state, ON, 45);
  assert.equal(first.action, 'pause');
  state = plain(core.startSessionPause(state, first.atMs, 'auto'));
  assert.equal(plan(state, ON, 45), null, 'same moment, nothing left');
  assert.equal(plan(state, ON, 46), null);
  assert.equal(state.pauseCount, 1);
});

test('a session saved without an activity time falls back to its start', () => {
  const legacy = plain(core.normalizeSessionTrackerState({ active: true, startMs: T0 }));
  assert.equal(legacy.lastActivityMs, 0);
  assert.deepEqual(plan(legacy, ON, 30), { action: 'pause', atMs: T0 + 30 * MIN });
});

test('the allowed choices match what the settings screen offers', () => {
  assert.deepEqual(plain(run('SESSION_AUTOMATION_PAUSE_OPTIONS_MIN')), [15, 20, 30, 45, 60]);
  assert.deepEqual(plain(run('SESSION_AUTOMATION_END_OPTIONS_MIN')), [30, 60, 90, 120, 180]);
  assert.equal(run('SESSION_AUTOMATION_KEY'), 'sessionAutomationV1');
});

test('the automation settings travel in the backup and are cleaned on the way back', () => {
  const out = plain(core.buildBackupSettings((key) => (key === 'sessionAutomationV1' ? JSON.stringify({ enabled: true, pauseAfterMin: 45, endAfterMin: 5 }) : null)));
  assert.deepEqual(out.sessionAutomationV1, { enabled: true, pauseAfterMin: 45, endAfterMin: 90 });
  const picked = plain(core.pickSettingsToRestore({ sessionAutomationV1: { enabled: true } }, () => false));
  assert.deepEqual(picked.sessionAutomationV1, { enabled: true, pauseAfterMin: 30, endAfterMin: 90 });
  assert.deepEqual(plain(core.pickSettingsToRestore({ sessionAutomationV1: { enabled: true } }, (key) => key === 'sessionAutomationV1')), {}, 'a device that already chose keeps its choice');
});
