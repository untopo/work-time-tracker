// Work RPG levels and streaks: the numbers users see must stay stable.
// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCore, plain } from './load-core.mjs';

const { core, run } = loadCore();
const DAY = 24 * 60 * 60 * 1000;

test('XP needed per level follows the published curve and never decreases', () => {
  assert.equal(core.getXpToNextLevel(1), 100);
  assert.equal(core.getXpToNextLevel(4), 175);
  assert.equal(core.getXpToNextLevel(5), 200);
  assert.equal(core.getXpToNextLevel(10), 380);
  assert.equal(core.getXpToNextLevel(20), 850);
  assert.equal(core.getXpToNextLevel(51), 2710);
  assert.equal(core.getXpToNextLevel(76), 4460);
  for (let level = 2; level <= 100; level += 1) {
    assert.ok(core.getXpToNextLevel(level) >= core.getXpToNextLevel(level - 1), `level ${level}`);
  }
});

test('the level curve is cumulative and has one entry per level', () => {
  const curve = plain(core.buildLevelCurve(100));
  assert.equal(curve.length, 100);
  assert.equal(curve[0].xpToReach, 0);
  assert.equal(curve[1].xpToReach, 100);
  for (let i = 1; i < curve.length; i += 1) {
    assert.equal(curve[i].xpToReach, curve[i - 1].xpToReach + curve[i - 1].xpToNext);
  }
});

test('only calls flagged as RPG-eligible count, and junk input is safe', () => {
  const rows = [{ rpgEligible: true }, { rpgEligible: false }, {}, null];
  assert.equal(core.getRpgEligibleCalls(rows).length, 1);
  assert.deepEqual(plain(core.getRpgEligibleCalls('nope')), []);
});

test('saved RPG stats are repaired: negatives and junk become zero', () => {
  const stats = plain(core.normalizeSessionRpgStatsState({ sessionsCompleted: -3, totalTalkMs: 'abc', longSessions4h: 2, daysWorked: { '2026-10-01': true } }));
  assert.equal(stats.sessionsCompleted, 0);
  assert.equal(stats.totalTalkMs, 0);
  assert.equal(stats.longSessions4h, 2);
  assert.deepEqual(stats.daysWorked, { '2026-10-01': true });
  assert.deepEqual(plain(core.normalizeSessionRpgStatsState(null)), plain(core.getDefaultSessionRpgStatsState()));
});

test('longest streak counts consecutive days only', () => {
  const base = 1760000000000;
  assert.equal(core.computeLongestStreak([]), 0);
  assert.equal(core.computeLongestStreak([base]), 1);
  assert.equal(core.computeLongestStreak([base, base + DAY, base + 2 * DAY, base + 5 * DAY, base + 6 * DAY]), 3);
});

test('current streak is alive if you worked today or yesterday, and counts back from there', () => {
  const todayStamp = run('new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()');
  assert.equal(core.computeCurrentStreak([]), 0);
  assert.equal(core.computeCurrentStreak([todayStamp, todayStamp - DAY, todayStamp - 2 * DAY]), 3);
  assert.equal(core.computeCurrentStreak([todayStamp - DAY, todayStamp - 2 * DAY]), 2, 'yesterday still counts');
  assert.equal(core.computeCurrentStreak([todayStamp - 2 * DAY, todayStamp - 3 * DAY]), 0, 'a gap of a full day breaks it');
});
