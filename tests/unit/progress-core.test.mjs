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

// ---- Progress v2 ----
const localDay = (y, m, d, h = 10) => new Date(y, m - 1, d, h).toISOString();
const rpgCall = (iso, minutes = 5) => ({ startTime: iso, duration: minutes * 60000, rpgEligible: true });

test('call XP uses the streak of each call\'s own day, so a broken streak never lowers it', () => {
  const streak = [1, 2, 3, 4, 5].map((d) => rpgCall(localDay(2026, 3, d)));
  const withStreak = core.computeCallXpByDay(streak);
  // Same calls, then a long gap and a new day: earlier XP must not change.
  const later = core.computeCallXpByDay([...streak, rpgCall(localDay(2026, 4, 20))]);
  const one = core.computeCallXpByDay([rpgCall(localDay(2026, 4, 20))]);
  assert.equal(later, withStreak + one);
  // Streak days 3-5 earn a bonus; days 1-2 do not.
  const flat = 5 * 20;
  assert.ok(withStreak > flat);
  assert.equal(core.computeCallXpByDay([rpgCall(localDay(2026, 3, 1)), rpgCall(localDay(2026, 3, 2))]), 40);
});

test('shield-protected days keep the streak alive for call XP', () => {
  const calls = [rpgCall(localDay(2026, 3, 1)), rpgCall(localDay(2026, 3, 2)), rpgCall(localDay(2026, 3, 4))];
  const noShield = core.computeCallXpByDay(calls);
  const shield = core.computeCallXpByDay(calls, [new Date(2026, 2, 3).getTime()]);
  assert.ok(shield > noShield);
});

test('backup progress merge never lowers anything and unions rewards', () => {
  const a = { rpg: { achievementXp: 65, peakXp: 900, achievementRewards: { x: { xp: 65 } } }, achievements: { unlocked: { x: '2026-02-01T00:00:00.000Z' }, completed: {} }, sessionStats: { sessionsCompleted: 4 } };
  const b = { rpg: { achievementXp: 120, peakXp: 500, achievementRewards: { y: { xp: 120 } } }, achievements: { unlocked: { x: '2026-01-01T00:00:00.000Z' }, completed: { z: '2026-03-01T00:00:00.000Z' } }, sessionStats: { sessionsCompleted: 9 } };
  const m = plain(core.mergeBackupProgress(a, b));
  assert.equal(m.rpg.peakXp, 900);
  assert.equal(m.rpg.achievementXp, 185, 'rewards from both devices add up');
  assert.equal(m.achievements.unlocked.x, '2026-01-01T00:00:00.000Z', 'earliest date wins');
  assert.ok(m.achievements.completed.x && m.achievements.completed.z, 'claimed implies completed');
  assert.equal(m.sessionStats.sessionsCompleted, 9);
  assert.equal(core.hasBackupProgressChange(core.mergeBackupProgress(m, b), m), false, 'merging again changes nothing');
});

// ---- Achievement families (v1.9.0) ----
test('every family has six increasing ranks and unique rank ids', () => {
  const families = plain(run('ACHIEVEMENT_FAMILIES'));
  const ids = new Set();
  families.forEach((f) => {
    assert.equal(f.thresholds.length, 6, f.id);
    for (let i = 1; i < 6; i += 1) assert.ok(f.thresholds[i] > f.thresholds[i - 1], `${f.id} thresholds increase`);
    for (let i = 0; i < 6; i += 1) { const id = core.getFamilyRankId(f.id, i); assert.ok(!ids.has(id)); ids.add(id); }
  });
  assert.equal(families.length, 19);
});

test('every legacy achievement id maps to a rank that exists and whose threshold the old goal already covered', () => {
  const rankIds = new Set();
  plain(run('ACHIEVEMENT_FAMILIES')).forEach((f) => f.thresholds.forEach((_, i) => rankIds.add(core.getFamilyRankId(f.id, i))));
  Object.entries(plain(run('LEGACY_ACHIEVEMENT_MAP'))).forEach(([oldId, newId]) => assert.ok(rankIds.has(newId), `${oldId} -> ${newId}`));
  // Old goals vs the thresholds of the ranks that replace them.
  const oldGoal = { ten_calls: 10, fifty_calls: 50, two_hundred_calls: 200, calls_500: 500, calls_1000: 1000, calls_2500: 2500, one_hour: 1, ten_hours: 10, hundred_hours: 100, hours_250: 250, hours_500: 500,
    total_1000_earned: 1000, total_5000_earned: 5000, total_10000_earned: 10000, total_25000_earned: 25000, week_100: 100, hidden_busy_day: 40, streak_3: 3, streak_7: 7, streak_14: 14, streak_30: 30,
    thirty_work_days: 30, sixty_work_days: 60, work_days_100: 100, work_days_250: 250, goal_mastery_7: 7, goal_mastery_30: 30, session_days_20: 20, long_call_30: 30, long_call_120: 120,
    level_10: 10, level_20: 20, level_30: 30, level_40: 40, level_50: 50, level_60: 60, level_75: 75, level_100: 100 };
  const byId = Object.fromEntries(plain(run('ACHIEVEMENT_FAMILIES')).flatMap((f) => f.thresholds.map((t, i) => [core.getFamilyRankId(f.id, i), t])));
  Object.entries(oldGoal).forEach(([oldId, goal]) => {
    const newId = run('LEGACY_ACHIEVEMENT_MAP')[oldId];
    assert.ok(byId[newId] <= goal, `${oldId} (${goal}) must be at or above ${newId} (${byId[newId]})`);
  });
});

test('migrating achievement state keeps dates, never deletes, and is idempotent', () => {
  const before = { unlocked: { ten_calls: '2026-02-01T00:00:00.000Z', level_30: '2026-05-01T00:00:00.000Z', level_20: '2026-04-01T00:00:00.000Z', first_call: '2026-01-01T00:00:00.000Z' }, completed: {} };
  const after = plain(core.migrateAchievementState(before));
  assert.equal(after.unlocked.calls_bronze, '2026-02-01T00:00:00.000Z');
  assert.equal(after.unlocked.level_silver, '2026-04-01T00:00:00.000Z', 'earliest date wins when two old ids share a rank');
  assert.ok(after.unlocked.ten_calls && after.unlocked.first_call, 'old keys are kept');
  assert.ok(after.completed.calls_bronze && after.completed.level_silver);
  assert.deepEqual(plain(core.migrateAchievementState(after)), after);
});

test('XP paid under legacy ids is still shown on the rank that replaced them', () => {
  const rewards = { level_20: { xp: 120 }, level_30: { xp: 220 }, level_silver: { xp: 5 }, calls_gold: { xp: 0 } };
  assert.equal(core.getAchievementRewardXp(rewards, 'level_silver'), 345);
  assert.equal(core.getAchievementRewardXp(rewards, 'level_gold'), 0);
});

test('backup progress from any version converges: old ids are migrated before merging', () => {
  const oldDevice = { rpg: { achievementXp: 120, achievementRewards: { fifty_calls: { xp: 120 } } }, achievements: { unlocked: { fifty_calls: '2026-03-01T00:00:00.000Z' } } };
  const newDevice = { rpg: { achievementXp: 65 }, achievements: { unlocked: { calls_bronze: '2026-02-01T00:00:00.000Z' } } };
  const a = plain(core.mergeBackupProgress(newDevice, oldDevice));
  const b = plain(core.mergeBackupProgress(oldDevice, newDevice));
  assert.deepEqual(a.achievements, b.achievements);
  assert.ok(a.achievements.unlocked.calls_silver && a.achievements.unlocked.calls_bronze);
  assert.equal(a.rpg.achievementXp, 120, 'XP is never lowered or double counted');
});

test('weekly streak counts consecutive weeks with at least four days worked', () => {
  const day = (y, m, d) => new Date(y, m - 1, d).getTime();
  const week = (startDay) => [0, 1, 2, 3].map((i) => day(2026, 3, startDay + i)); // Mon-Thu
  assert.equal(core.computeWeeklyStreak([...week(2), ...week(9), ...week(16)]), 3);
  assert.equal(core.computeWeeklyStreak([...week(2), ...week(16)]), 1, 'a missing week breaks the streak');
  assert.equal(core.computeWeeklyStreak([day(2026, 3, 2), day(2026, 3, 3), day(2026, 3, 4)]), 0, 'three days is not enough');
});
