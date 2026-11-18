// Work Time Tracker - anonymous usage metrics (pure logic).
//
// Turns what happened into COARSE RANGES such as "5-7m" or "2.5-3h", never exact values.
// These strings are the only thing the web version ever sends, and only when "Share
// anonymous usage counts" is on (Settings -> Features). No call, earnings, rate, note or
// history is included, and nothing here identifies a person.
//
// Plain functions with no app state and no screen elements, tested in Node (tests/unit).
// Loaded before app.js; app.js sends the events with trackEvent().

// One finished call -> the length range it falls in. Finer where most calls are (5-15 min).
function bucketCallLength(durationMs) {
    const minutes = Math.max(0, Number(durationMs) || 0) / 60000;
    const edges = [[1, 'under-1m'], [2, '1-2m'], [3, '2-3m'], [5, '3-5m'], [7, '5-7m'], [10, '7-10m'],
        [15, '10-15m'], [20, '15-20m'], [30, '20-30m'], [45, '30-45m'], [60, '45-60m']];
    for (const [limit, label] of edges) {
        if (minutes < limit) return label;
    }
    return '60m-plus';
}

// A whole day -> how many calls that day.
function bucketDayCalls(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    const edges = [[3, '1-3'], [6, '4-6'], [10, '7-10'], [15, '11-15'], [20, '16-20'],
        [25, '21-25'], [30, '26-30'], [40, '31-40'], [50, '41-50']];
    for (const [limit, label] of edges) {
        if (n <= limit) return label;
    }
    return '51-plus';
}

// A whole day -> how many hours on calls that day, in half-hour steps up to 10 hours.
function bucketDayHours(totalMs) {
    const hours = Math.max(0, Number(totalMs) || 0) / 3600000;
    if (hours >= 10) return '10h-plus';
    const step = Math.floor(hours * 2); // 0 .. 19
    return `${step / 2}-${(step + 1) / 2}h`;
}

// Picks the most recent COMPLETED day (before today, after the last one already reported)
// that had calls, and returns its two range events. Returns null when there is nothing new.
// `dayKeyOf(call)` must return a "YYYY-MM-DD" key; keys compare as text.
function buildDailyUsageSummary(callRows, lastReportedDayKey, todayKey, dayKeyOf) {
    if (!Array.isArray(callRows) || typeof dayKeyOf !== 'function') return null;
    const perDay = new Map();
    for (const row of callRows) {
        const key = dayKeyOf(row);
        if (!key || key >= todayKey || (lastReportedDayKey && key <= lastReportedDayKey)) continue;
        const entry = perDay.get(key) || { count: 0, ms: 0 };
        entry.count += 1;
        entry.ms += Math.max(0, Number(row?.duration) || 0);
        perDay.set(key, entry);
    }
    if (perDay.size === 0) return null;
    const dayKey = [...perDay.keys()].sort().pop();
    const day = perDay.get(dayKey);
    return {
        dayKey,
        events: [`day-calls/${bucketDayCalls(day.count)}`, `day-hours/${bucketDayHours(day.ms)}`]
    };
}

// Which optional features are switched on (names only, no settings values).
function buildFeatureUsageEvents(featuresOn) {
    const source = featuresOn && typeof featuresOn === 'object' ? featuresOn : {};
    return Object.keys(source).filter((name) => source[name] === true).sort().map((name) => `feature-on/${name}`);
}

// How long this browser has been used, as a range (a rough stand-in for "do people come back").
function bucketDaysUsing(days) {
    const n = Math.max(1, Math.floor(Number(days) || 1));
    const edges = [[1, '1'], [7, '2-7'], [30, '8-30'], [90, '31-90']];
    for (const [limit, label] of edges) {
        if (n <= limit) return label;
    }
    return '91-plus';
}

// How many rates are set up, as a range.
function bucketRateCount(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    if (n === 0) return '0';
    if (n === 1) return '1';
    if (n <= 3) return '2-3';
    return '4-plus';
}

// Whole days between two "YYYY-MM-DD" keys, counting the first day as day 1.
function daysSinceKey(firstKey, todayKey) {
    const a = Date.parse(`${firstKey}T12:00:00Z`);
    const b = Date.parse(`${todayKey}T12:00:00Z`);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return 1;
    return Math.round((b - a) / 86400000) + 1;
}

// Once a day per browser: app version, days of use, how many rates, light or dark.
// Only coarse labels. The version is sent only when it looks like 1.2.3.
function buildProfileEvents({ version, daysUsing, rateCount, theme } = {}) {
    const events = [];
    if (/^\d+\.\d+\.\d+$/.test(String(version || ''))) events.push(`app-version/${version}`);
    events.push(`days-using/${bucketDaysUsing(daysUsing)}`);
    events.push(`rates/${bucketRateCount(rateCount)}`);
    events.push(`theme/${theme === 'dark' ? 'dark' : 'light'}`);
    return events;
}

// Error names are a fixed list, so nothing unexpected is ever sent.
const ERROR_EVENT_NAMES = ['storage-write-failed', 'data-reset', 'import-json', 'import-csv'];
function buildErrorEvent(kind) {
    return ERROR_EVENT_NAMES.includes(kind) ? `error/${kind}` : null;
}
