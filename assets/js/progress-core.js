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
    if (tier === 'Gold') return 220;
    if (tier === 'Silver') return 120;
    return 65;
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
        achievements: {
            unlocked: { ...(achievementsState?.unlocked || {}) },
            completed: { ...(achievementsState?.completed || {}) }
        },
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
