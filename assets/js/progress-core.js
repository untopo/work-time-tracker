// Work Time Tracker - progress core.
//
// Plain functions for the Work RPG (XP, levels, quests) and day/week streaks. They use
// no app state or screen element, so they are tested directly in Node (tests/unit).
// Loaded before app.js. Moved verbatim from app.js: no change to the logic.

function getDefaultSessionRpgStatsState() {
    return {
        sessionsCompleted: 0,
        totalTalkMs: 0,
        totalIdleMs: 0,
        totalAvailableMs: 0,
        highUtilSessions: 0,
        focusedSessions: 0,
        longSessions4h: 0,
        pauseAwareSessions: 0,
        daysWorked: {}
    };
}

function normalizeSessionRpgStatsState(input) {
    const base = getDefaultSessionRpgStatsState();
    const source = input && typeof input === 'object' ? input : {};
    const daysWorked = source.daysWorked && typeof source.daysWorked === 'object' ? source.daysWorked : {};
    return {
        sessionsCompleted: Math.max(0, Number(source.sessionsCompleted) || 0),
        totalTalkMs: Math.max(0, Number(source.totalTalkMs) || 0),
        totalIdleMs: Math.max(0, Number(source.totalIdleMs) || 0),
        totalAvailableMs: Math.max(0, Number(source.totalAvailableMs) || 0),
        highUtilSessions: Math.max(0, Number(source.highUtilSessions) || 0),
        focusedSessions: Math.max(0, Number(source.focusedSessions) || 0),
        longSessions4h: Math.max(0, Number(source.longSessions4h) || 0),
        pauseAwareSessions: Math.max(0, Number(source.pauseAwareSessions) || 0),
        daysWorked: { ...daysWorked, ...base.daysWorked }
    };
}

// Work RPG leveling (foundation)
function getXpToNextLevel(level) {
    if (level < 5) return 100 + ((level - 1) * 25);       // 100, 125, 150, 175
    if (level < 10) return 200 + ((level - 5) * 35);      // 200..340
    if (level < 20) return 380 + ((level - 10) * 45);     // 380..785
    if (level <= 50) return 850 + ((level - 20) * 60);    // keep legacy pacing through 50
    if (level <= 75) return 2710 + ((level - 51) * 70);   // mid-game extension
    return 4460 + ((level - 76) * 85);                    // late-game extension to 100
}

function buildLevelCurve(maxLevel = 100) {
    const curve = [];
    let cumulative = 0;
    for (let level = 1; level <= maxLevel; level += 1) {
        const xpToNext = getXpToNextLevel(level);
        curve.push({
            level,
            xpToReach: cumulative,
            xpToNext
        });
        cumulative += xpToNext;
    }
    return curve;
}

function isCallRpgEligible(call) {
    return !!call?.rpgEligible;
}

function getRpgEligibleCalls(callRows) {
    return Array.isArray(callRows) ? callRows.filter(isCallRpgEligible) : [];
}

function computeBaseXpFromCalls(callRows) {
    // Fair, non-grindy baseline:
    // - 10 XP per completed call (consistency reward)
    // - 2 XP per minute worked (time reward)
    return Math.max(0, Math.round(callRows.reduce((acc, call) => {
        const minutes = Math.max(0, (Number(call.duration) || 0) / (1000 * 60));
        return acc + 10 + (minutes * 2);
    }, 0)));
}

function getBaseXpForCallDuration(durationMs) {
    const minutes = Math.max(0, Number(durationMs) || 0) / (1000 * 60);
    return Math.max(0, Math.round(10 + (minutes * 2)));
}

function getCurrentLocalDayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function seededHashFromString(input) {
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    return function rand() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function pickWeightedQuest(pool, rng) {
    const totalWeight = pool.reduce((sum, q) => sum + Math.max(0.01, Number(q.weight) || 0.01), 0);
    let roll = rng() * totalWeight;
    for (let i = 0; i < pool.length; i += 1) {
        roll -= Math.max(0.01, Number(pool[i].weight) || 0.01);
        if (roll <= 0) return i;
    }
    return pool.length - 1;
}

function getCallLocalDayStamp(call) {
    const d = new Date(call.startTime);
    if (!Number.isFinite(d.getTime())) return NaN;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function getWeekStartStampFromDate(dateObj) {
    if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) return NaN;
    const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const day = d.getDay(); // 0 Sunday ... 6 Saturday
    const diffToMonday = day === 0 ? -6 : (1 - day);
    d.setDate(d.getDate() + diffToMonday);
    return d.getTime();
}

function computeLongestStreak(dayStamps) {
    if (!dayStamps.length) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < dayStamps.length; i += 1) {
        if (dayStamps[i] - dayStamps[i - 1] === 24 * 60 * 60 * 1000) {
            current += 1;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }
    return longest;
}

function computeCurrentStreak(dayStamps) {
    if (!dayStamps.length) return 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const daySet = new Set(dayStamps);
    const now = new Date();
    const todayStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStamp = todayStamp - oneDayMs;

    let cursor = daySet.has(todayStamp) ? todayStamp : (daySet.has(yesterdayStamp) ? yesterdayStamp : null);
    if (cursor === null) return 0;

    let streak = 0;
    while (daySet.has(cursor)) {
        streak += 1;
        cursor -= oneDayMs;
    }
    return streak;
}

function getTierClasses(tier, unlocked) {
    if (!unlocked) return {
        badge: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        card: 'border-gray-200 dark:border-gray-700',
        progress: 'achievement-progress-fill-locked'
    };
    if (tier === 'Obsidian') return {
        badge: 'bg-violet-200 text-violet-950 dark:bg-violet-900 dark:text-violet-100',
        card: 'border-violet-300 dark:border-violet-700',
        progress: 'achievement-progress-fill-diamond'
    };
    if (tier === 'Diamond') return {
        badge: 'bg-cyan-200 text-cyan-950 dark:bg-cyan-900 dark:text-cyan-100',
        card: 'border-cyan-300 dark:border-cyan-700',
        progress: 'achievement-progress-fill-diamond'
    };
    if (tier === 'Platinum') return {
        badge: 'bg-sky-100 text-sky-950 dark:bg-sky-900 dark:text-sky-100',
        card: 'border-sky-300 dark:border-sky-700',
        progress: 'achievement-progress-fill-silver'
    };
    if (tier === 'Gold') return {
        badge: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
        card: 'border-amber-300 dark:border-amber-700',
        progress: 'achievement-progress-fill-gold'
    };
    if (tier === 'Silver') return {
        badge: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
        card: 'border-slate-300 dark:border-slate-600',
        progress: 'achievement-progress-fill-silver'
    };
    return {
        badge: 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
        card: 'border-orange-300 dark:border-orange-700',
        progress: 'achievement-progress-fill-bronze'
    };
}

function getAchievementBaseXp(tier) {
    return ACHIEVEMENT_RANK_BASE_XP[tier] || 65;
}

function getLevelRewardMultiplier(level) {
    // Small but meaningful: +2% every 3 levels, capped at +40%
    const bumps = Math.floor(Math.max(0, level - 1) / 3);
    return 1 + Math.min(0.40, bumps * 0.02);
}

function getStreakRewardMultiplier(streak) {
    // Starts at 3-day streak and scales gently up to +35%
    if (streak < 3) return 1;
    const extra = 0.05 + (Math.max(0, streak - 3) * 0.02);
    return 1 + Math.min(0.35, extra);
}

// ---- Progress v2 (v1.8.0) ----

function getPreviousLocalDayStamp(stamp) {
    const d = new Date(stamp);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).getTime();
}

// Call XP where each call is boosted by the streak it belonged to on ITS day, not by today's
// streak. A broken streak therefore never lowers XP that was already earned.
// protectedDayStamps: local-midnight stamps that keep a streak alive (streak shields).
function computeCallXpByDay(callRows, protectedDayStamps = []) {
    const eligible = getRpgEligibleCalls(callRows);
    const baseByDay = new Map();
    eligible.forEach((call) => {
        const stamp = getCallLocalDayStamp(call);
        if (!Number.isFinite(stamp)) return;
        const minutes = Math.max(0, (Number(call.duration) || 0) / 60000);
        baseByDay.set(stamp, (baseByDay.get(stamp) || 0) + 10 + (minutes * 2));
    });
    const activeDays = new Set([...baseByDay.keys(), ...protectedDayStamps.filter(Number.isFinite)]);
    const streakAt = new Map();
    const ordered = Array.from(activeDays).sort((a, b) => a - b);
    ordered.forEach((stamp) => {
        const prev = getPreviousLocalDayStamp(stamp);
        streakAt.set(stamp, activeDays.has(prev) ? (streakAt.get(prev) || 0) + 1 : 1);
    });
    let total = 0;
    baseByDay.forEach((base, stamp) => {
        total += base * getStreakRewardMultiplier(streakAt.get(stamp) || 1);
    });
    return Math.max(0, Math.round(total));
}

// Backup of RPG progress. Only values that cannot be rebuilt from calls are stored.
function buildBackupProgress(rpgState, achievementsState, sessionStats) {
    const rpg = rpgState && typeof rpgState === 'object' ? rpgState : {};
    return {
        version: 1,
        rpg: {
            achievementXp: Math.max(0, Number(rpg.achievementXp) || 0),
            dailyQuestXp: Math.max(0, Number(rpg.dailyQuestXp) || 0),
            weeklyArcXp: Math.max(0, Number(rpg.weeklyArcXp) || 0),
            streakShields: Math.max(0, Number(rpg.streakShields) || 0),
            peakXp: Math.max(0, Number(rpg.peakXp) || 0),
            xpModelMigrated: !!rpg.xpModelMigrated,
            achievementRewards: { ...(rpg.achievementRewards || {}) },
            dailyQuestRewards: { ...(rpg.dailyQuestRewards || {}) },
            weeklyArcRewards: { ...(rpg.weeklyArcRewards || {}) },
            streakShieldUses: { ...(rpg.streakShieldUses || {}) }
        },
        achievements: migrateAchievementState(achievementsState),
        sessionStats: normalizeSessionRpgStatsState(sessionStats)
    };
}

function mergeRecordMaps(a, b) {
    return { ...(b || {}), ...(a || {}) };
}

// Merges backup progress into what is already on the device without ever lowering anything:
// numbers take the larger value, reward/use records are unioned, achievements keep the
// earliest "completed/claimed" dates.
function mergeBackupProgress(current, incoming) {
    const cur = buildBackupProgress(current?.rpg, current?.achievements, current?.sessionStats);
    const inc = incoming && typeof incoming === 'object'
        ? buildBackupProgress(incoming.rpg, incoming.achievements, incoming.sessionStats)
        : cur;
    const rpg = {};
    ['achievementXp', 'dailyQuestXp', 'weeklyArcXp', 'peakXp'].forEach((k) => { rpg[k] = Math.max(cur.rpg[k], inc.rpg[k]); });
    rpg.xpModelMigrated = cur.rpg.xpModelMigrated || inc.rpg.xpModelMigrated;
    rpg.streakShields = Math.min(2, Math.max(cur.rpg.streakShields, inc.rpg.streakShields));
    ['achievementRewards', 'dailyQuestRewards', 'weeklyArcRewards', 'streakShieldUses'].forEach((k) => {
        rpg[k] = mergeRecordMaps(cur.rpg[k], inc.rpg[k]);
    });
    // Rewards are unioned per id, so the XP they paid out is re-summed instead of just taking the larger total.
    [['achievementXp', 'achievementRewards'], ['dailyQuestXp', 'dailyQuestRewards'], ['weeklyArcXp', 'weeklyArcRewards']].forEach(([xpKey, mapKey]) => {
        const summed = Object.values(rpg[mapKey]).reduce((acc, r) => acc + Math.max(0, Number(r?.xp) || 0), 0);
        rpg[xpKey] = Math.max(rpg[xpKey], summed);
    });
    const achievements = { unlocked: {}, completed: {} };
    ['unlocked', 'completed'].forEach((field) => {
        const x = cur.achievements[field] || {};
        const y = inc.achievements[field] || {};
        new Set([...Object.keys(x), ...Object.keys(y)]).forEach((id) => {
            const times = [x[id], y[id]].filter(Boolean).map((v) => ({ v, t: Date.parse(v) }));
            const valid = times.filter((e) => Number.isFinite(e.t)).sort((p, q) => p.t - q.t);
            achievements[field][id] = (valid[0] || times[0]).v;
        });
    });
    // Anything claimed is also completed.
    Object.keys(achievements.unlocked).forEach((id) => {
        if (!achievements.completed[id]) achievements.completed[id] = achievements.unlocked[id];
    });
    const sa = cur.sessionStats;
    const sb = inc.sessionStats;
    const sessionStats = { ...sa, daysWorked: { ...sb.daysWorked, ...sa.daysWorked } };
    ['sessionsCompleted', 'totalTalkMs', 'totalIdleMs', 'totalAvailableMs', 'highUtilSessions', 'focusedSessions', 'longSessions4h', 'pauseAwareSessions'].forEach((k) => {
        sessionStats[k] = Math.max(sa[k], sb[k]);
    });
    return { version: 1, rpg, achievements, sessionStats };
}

function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

function hasBackupProgressChange(before, after) {
    return stableStringify(before) !== stableStringify(after);
}

// ---- Achievement families (v1.9.0) ----

const ACHIEVEMENT_RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Obsidian'];
const ACHIEVEMENT_RANK_BASE_XP = { Bronze: 65, Silver: 120, Gold: 220, Platinum: 400, Diamond: 700, Obsidian: 1100 };

// One family = one card that climbs six ranks. `stat` is a key of computeAchievementStats();
// `unit` only decides how numbers are written.
const ACHIEVEMENT_FAMILIES = [
    { id: 'calls', name: 'Calls', sub: 'Calls completed', icon: 'fa-phone-volume', stat: 'totalCalls', unit: 'count', thresholds: [10, 50, 200, 1000, 2500, 5000], what: 'Complete {n} calls.' },
    { id: 'hours', name: 'Hours', sub: 'Time on calls', icon: 'fa-clock', stat: 'totalHours', unit: 'hours', thresholds: [1, 10, 100, 250, 500, 1000], what: 'Log {n} total hours on calls.' },
    { id: 'earnings', name: 'Earnings', sub: 'All-time earnings', icon: 'fa-sack-dollar', stat: 'totalEarnings', unit: 'money', thresholds: [250, 1000, 3000, 7500, 15000, 30000], what: 'Earn {n} in total.' },
    { id: 'bestweek', name: 'Best week', sub: 'Earnings in your best week', icon: 'fa-dollar-sign', stat: 'maxWeekEarnings', unit: 'money', thresholds: [100, 150, 200, 250, 300, 400], what: 'Reach {n} in a single week.' },
    { id: 'busiestday', name: 'Busiest day', sub: 'Calls in your busiest day', icon: 'fa-bolt', stat: 'maxDayCalls', unit: 'count', thresholds: [10, 20, 35, 45, 55, 70], what: 'Complete {n} calls in a single day.' },
    { id: 'longestday', name: 'Longest day', sub: 'Hours on calls in one day', icon: 'fa-hourglass-half', stat: 'maxDayHours', unit: 'hours', thresholds: [2, 4, 6, 7, 8, 10], what: 'Spend {n} on calls in a single day.' },
    { id: 'longestcall', name: 'Longest call', sub: 'Your longest call', icon: 'fa-stopwatch', stat: 'longestCallMinutes', unit: 'minutes', thresholds: [30, 45, 60, 90, 120, 180], what: 'Complete a {n} call.' },
    { id: 'streak', name: 'Streak', sub: 'Days in a row', icon: 'fa-fire', stat: 'longestStreak', unit: 'days', thresholds: [3, 7, 14, 30, 60, 100], what: 'Work {n} in a row.' },
    { id: 'weeklystreak', name: 'Weekly streak', sub: 'Weeks in a row with 4+ days worked', icon: 'fa-calendar-week', stat: 'weeklyStreak', unit: 'weeks', thresholds: [2, 4, 8, 12, 26, 52], what: 'Work 4 or more days for {n} in a row.' },
    { id: 'daysworked', name: 'Days worked', sub: 'Unique days with calls', icon: 'fa-calendar-check', stat: 'uniqueDaysWorked', unit: 'days', thresholds: [10, 30, 60, 100, 250, 365], what: 'Work on {n} different days.' },
    { id: 'dailygoal', name: 'Daily goal', sub: 'Days you hit your goal', icon: 'fa-bullseye', stat: 'goalHitDays', unit: 'days', thresholds: [7, 30, 75, 150, 300, 500], what: 'Hit your daily goal on {n} different days.' },
    { id: 'tenure', name: 'Tenure', sub: 'Since your first call', icon: 'fa-user-clock', stat: 'tenureDays', unit: 'days', thresholds: [30, 90, 180, 365, 730, 1095], what: 'Keep tracking for {n} since your first call.' },
    { id: 'sessions', name: 'Sessions', sub: 'Tracked sessions', icon: 'fa-business-time', stat: 'sessionsCompleted', unit: 'count', thresholds: [5, 25, 100, 250, 500, 1000], what: 'Complete {n} sessions in Session Tracker.' },
    { id: 'shiftdays', name: 'Shift days', sub: 'Days with a tracked session', icon: 'fa-calendar-days', stat: 'sessionDaysWorked', unit: 'days', thresholds: [5, 20, 50, 100, 200, 365], what: 'Track sessions on {n} different days.' },
    { id: 'trackedtime', name: 'Tracked time', sub: 'Hours in Session Tracker', icon: 'fa-hourglass-end', stat: 'trackedHours', unit: 'hours', thresholds: [10, 50, 150, 400, 800, 1500], what: 'Track {n} of work time in Session Tracker.' },
    { id: 'focus', name: 'Focus', sub: 'Focused sessions', icon: 'fa-crosshairs', stat: 'focusedSessions', unit: 'count', thresholds: [1, 5, 20, 50, 100, 250], what: 'Complete {n} focused sessions (30+ min available, 5 min idle or less).' },
    { id: 'utilization', name: 'Utilization', sub: 'Sessions with 70%+ utilization', icon: 'fa-gauge-high', stat: 'highUtilSessions', unit: 'count', thresholds: [3, 10, 25, 50, 100, 250], what: 'Complete {n} sessions with 70% utilization or more.' },
    { id: 'paymentcycles', name: 'Payment cycles', sub: 'Completed cycles', icon: 'fa-money-check-dollar', stat: 'paymentCyclesCompleted', unit: 'count', thresholds: [1, 3, 6, 12, 24, 36], what: 'Complete {n} payment cycles.', feature: 'paymentCycles' },
    { id: 'level', name: 'Level', sub: 'RPG level', icon: 'fa-hat-wizard', stat: 'level', unit: 'level', thresholds: [10, 20, 40, 60, 80, 100], what: 'Reach level {n} in RPG Mode.', rpgOnly: true }
];

function getFamilyRankId(familyId, rankIndex) {
    return `${familyId}_${String(ACHIEVEMENT_RANKS[rankIndex]).toLowerCase()}`;
}

function formatFamilyValue(unit, value, { short = false } = {}) {
    const v = Number(value) || 0;
    const n = (x, d = 0) => x.toLocaleString('en-US', { maximumFractionDigits: d });
    switch (unit) {
        case 'money': return `$${n(v)}`;
        case 'hours': return `${n(v, v < 10 && v % 1 ? 1 : 0)} h`;
        case 'minutes': return v >= 120 && v % 60 === 0 ? `${n(v / 60)} h` : `${n(v)} min`;
        case 'days': return short ? n(v) : `${n(v)} day${v === 1 ? '' : 's'}`;
        case 'weeks': return short ? n(v) : `${n(v)} week${v === 1 ? '' : 's'}`;
        case 'level': return short ? n(v) : `level ${n(v)}`;
        default: return n(v);
    }
}

// Old achievement ids -> the rank that replaces them. Every old threshold is at or above the rank it maps to,
// so anything that was unlocked is still a valid, earned rank.
const LEGACY_ACHIEVEMENT_MAP = {
    ten_calls: 'calls_bronze', fifty_calls: 'calls_silver', two_hundred_calls: 'calls_gold', calls_500: 'calls_gold', calls_1000: 'calls_platinum', calls_2500: 'calls_diamond',
    one_hour: 'hours_bronze', ten_hours: 'hours_silver', hundred_hours: 'hours_gold', hours_250: 'hours_platinum', hours_500: 'hours_diamond',
    total_1000_earned: 'earnings_silver', total_5000_earned: 'earnings_gold', total_10000_earned: 'earnings_platinum', total_25000_earned: 'earnings_diamond',
    week_100: 'bestweek_bronze',
    hidden_busy_day: 'busiestday_gold',
    streak_3: 'streak_bronze', streak_7: 'streak_silver', streak_14: 'streak_gold', streak_30: 'streak_platinum',
    thirty_work_days: 'daysworked_silver', sixty_work_days: 'daysworked_gold', work_days_100: 'daysworked_platinum', work_days_250: 'daysworked_diamond',
    goal_mastery_7: 'dailygoal_bronze', goal_mastery_30: 'dailygoal_silver',
    session_five: 'sessions_bronze', session_days_20: 'shiftdays_silver', session_focus: 'focus_bronze', session_util_high: 'utilization_bronze',
    long_call_30: 'longestcall_bronze', long_call_120: 'longestcall_diamond',
    level_10: 'level_bronze', level_20: 'level_silver', level_30: 'level_silver', level_40: 'level_gold', level_50: 'level_gold',
    level_60: 'level_platinum', level_75: 'level_platinum', level_100: 'level_obsidian'
};

function earliestIso(a, b) {
    if (!a) return b;
    if (!b) return a;
    const ta = Date.parse(a);
    const tb = Date.parse(b);
    if (!Number.isFinite(ta)) return b;
    if (!Number.isFinite(tb)) return a;
    return ta <= tb ? a : b;
}

// Moves legacy ids into the rank that replaces them. Legacy keys stay in the maps (nothing is deleted),
// the earliest date wins, and running it again changes nothing.
function migrateAchievementState(state) {
    const unlocked = { ...(state?.unlocked || {}) };
    const completed = { ...(state?.completed || {}) };
    Object.entries(LEGACY_ACHIEVEMENT_MAP).forEach(([oldId, newId]) => {
        if (unlocked[oldId]) unlocked[newId] = earliestIso(unlocked[newId], unlocked[oldId]);
        if (completed[oldId] || unlocked[oldId]) completed[newId] = earliestIso(completed[newId], completed[oldId] || unlocked[oldId]);
    });
    Object.keys(unlocked).forEach((id) => { if (!completed[id]) completed[id] = unlocked[id]; });
    return { unlocked, completed };
}

// XP that was paid for an achievement id, including what its legacy ids paid before they became ranks.
function getAchievementRewardXp(rewards, id) {
    const map = rewards || {};
    let xp = Math.max(0, Number(map[id]?.xp) || 0);
    Object.entries(LEGACY_ACHIEVEMENT_MAP).forEach(([oldId, newId]) => {
        if (newId === id && oldId !== id) xp += Math.max(0, Number(map[oldId]?.xp) || 0);
    });
    return xp;
}

function computeWeeklyStreak(dayStamps, minDays = 4) {
    const byWeek = new Map();
    (dayStamps || []).forEach((stamp) => {
        const d = new Date(stamp);
        const mondayOffset = (d.getDay() + 6) % 7;
        const weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() - mondayOffset).getTime();
        byWeek.set(weekStart, (byWeek.get(weekStart) || new Set()).add(stamp));
    });
    const weeks = Array.from(byWeek.entries()).filter(([, set]) => set.size >= minDays).map(([w]) => w).sort((a, b) => a - b);
    let best = 0;
    let run = 0;
    let prev = null;
    weeks.forEach((w) => {
        const expected = prev === null ? null : new Date(new Date(prev).getFullYear(), new Date(prev).getMonth(), new Date(prev).getDate() + 7).getTime();
        run = expected === w ? run + 1 : 1;
        best = Math.max(best, run);
        prev = w;
    });
    return best;
}
