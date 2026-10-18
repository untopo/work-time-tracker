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
