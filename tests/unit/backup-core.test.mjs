// Backup format 2: finished sessions and portable settings travel with a backup file.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core, run } = loadCore();

const store = (obj) => (key) => (Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : null);
const session = (id, start, end) => ({ id, startedAtMs: start, endedAtMs: end, talkMs: 0, idleMs: 0, availableMs: 0, utilization: 0, callCount: 0, pauseCount: 0, earned: 0 });

test('buildBackupSettings keeps portable settings and leaves device-only ones out', () => {
  const out = plain(core.buildBackupSettings(store({
    theme: 'light',
    timeZone: 'America/Lima',
    featureFlags: JSON.stringify({ notes: false, rpg: true }),
    patternsMode: 'weekly',
    trendMode: 'monthly',
    hourlyHeatmapMetric: 'calls',
    liveCallNotesHeight: '240',
    floatingDockManualPosition: '{"x":1}',
    wtt_last_backup_at: '123',
    wtt_backup_reminder_off: '1'
  })));
  assert.deepEqual(out, {
    theme: 'light',
    timeZone: 'America/Lima',
    featureFlags: { notes: false, rpg: true },
    patternsMode: 'weekly',
    trendMode: 'monthly',
    hourlyHeatmapMetric: 'calls'
  });
});

test('buildBackupSettings skips missing, broken and invalid values without throwing', () => {
  assert.deepEqual(plain(core.buildBackupSettings(store({}))), {});
  const out = plain(core.buildBackupSettings(store({ theme: 'purple', timeZone: 'Not/AZone', featureFlags: '{oops', patternsMode: 'yearly' })));
  assert.deepEqual(out, {});
  assert.deepEqual(plain(core.buildBackupSettings(() => { throw new Error('storage blocked'); })), {});
});

test('pickSettingsToRestore only fills what this device has not set yet', () => {
  const imported = { theme: 'light', timeZone: 'America/Lima', patternsMode: 'weekly', hourlyHeatmapMetric: 'calls' };
  const local = { theme: 'dark', hourlyHeatmapMetric: 'minutes' };
  const picked = plain(core.pickSettingsToRestore(imported, (key) => key in local));
  assert.deepEqual(picked, { timeZone: 'America/Lima', patternsMode: 'weekly' }, 'theme and metric already set here stay as they are');
});

test('pickSettingsToRestore ignores unknown keys, junk values and missing settings', () => {
  assert.deepEqual(plain(core.pickSettingsToRestore(undefined, () => false)), {});
  assert.deepEqual(plain(core.pickSettingsToRestore('text', () => false)), {});
  const picked = plain(core.pickSettingsToRestore({ theme: 'blue', wtt_last_backup_at: 9, liveCallNotesHeight: 300, featureFlags: [1] }, () => false));
  assert.deepEqual(picked, {});
});

test('the list of portable settings is fixed on purpose', () => {
  assert.deepEqual(plain(run('BACKUP_PORTABLE_SETTINGS')), ['theme', 'timeZone', 'featureFlags', 'patternsMode', 'trendMode', 'hourlyHeatmapMetric', 'sessionAutomationV1']);
  assert.equal(run('BACKUP_FORMAT_VERSION'), 2);
});

test('mergeSessionHistoryWithExisting adds new sessions and skips ones already here', () => {
  const existing = [session('a', 1000, 2000), session('b', 3000, 4000)];
  const imported = [session('a', 1000, 2000), session('c', 5000, 6000), session('z', 3000, 4000)];
  const result = plain(core.mergeSessionHistoryWithExisting(existing, imported));
  assert.equal(result.addedCount, 1);
  assert.equal(result.skippedCount, 2, 'same id, or same start and end, counts as the same session');
  assert.deepEqual(result.merged.map((entry) => entry.id), ['c', 'b', 'a'], 'newest first');
});

test('mergeSessionHistoryWithExisting never changes the sessions already saved and handles empty input', () => {
  const existing = [session('a', 1000, 2000)];
  const result = plain(core.mergeSessionHistoryWithExisting(existing, undefined));
  assert.deepEqual(result.merged, plain(existing));
  assert.equal(result.addedCount, 0);
  const fromEmpty = plain(core.mergeSessionHistoryWithExisting(undefined, [session('x', 1, 2)]));
  assert.equal(fromEmpty.addedCount, 1);
});
