// Work Time Tracker - anonymous usage metrics (pure logic).
//
// Turns what happened into COARSE RANGES such as "5-10m" or "2-4h", never exact values.
// These strings are the only thing the web version ever sends, and only when "Share
// anonymous usage counts" is on (Settings -> Features). No call, earnings, rate, note or
// history is included, and nothing here identifies a person.
//
// Plain functions with no app state and no screen elements, tested in Node (tests/unit).
// Loaded before app.js; app.js sends the events with trackEvent().

// One finished call -> the length range it falls in.
function bucketCallLength(durationMs) {
    const minutes = Math.max(0, Number(durationMs) || 0) / 60000;
    if (minutes < 1) return 'under-1m';
    if (minutes < 5) return '1-5m';
    if (minutes < 10) return '5-10m';
    if (minutes < 20) return '10-20m';
    if (minutes < 40) return '20-40m';
    return '40m-plus';
}

// A whole day -> how many calls that day.
function bucketDayCalls(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    if (n <= 5) return '1-5';
    if (n <= 10) return '6-10';
    if (n <= 20) return '11-20';
    if (n <= 40) return '21-40';
    return '41-plus';
}

// A whole day -> how many hours on calls that day.
function bucketDayHours(totalMs) {
    const hours = Math.max(0, Number(totalMs) || 0) / 3600000;
    if (hours < 1) return 'under-1h';
    if (hours < 2) return '1-2h';
    if (hours < 4) return '2-4h';
    if (hours < 6) return '4-6h';
    if (hours < 8) return '6-8h';
    return '8h-plus';
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
