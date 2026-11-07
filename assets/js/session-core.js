// Work Time Tracker - session core.
//
// Plain functions that repair and shape the saved work-session state, the saved
// unfinished live call, and a few display formats. They use no app state or screen
// element, so they are tested directly in Node (tests/unit). Loaded before app.js.
// Moved verbatim from app.js: no change to the logic.

function normalizeTrendMode(mode) {
    return mode === 'monthly' ? 'monthly' : 'weekly';
}

function normalizePatternsMode(mode) {
    return ['hourly', 'weekly', 'monthly'].includes(mode) ? mode : 'hourly';
}

function normalizeHourlyHeatmapMetric(metric) {
    return ['calls', 'minutes', 'earnings'].includes(metric) ? metric : 'earnings';
}

function clampTrendAnchorToToday(dateObj) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const candidate = dateObj instanceof Date && Number.isFinite(dateObj.getTime())
        ? new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
        : todayStart;
    return candidate.getTime() > todayStart.getTime() ? todayStart : candidate;
}

function getSessionDefaultState() {
    return {
        active: false,
        paused: false,
        startMs: 0,
        pausedTotalMs: 0,
        pauseStartedMs: 0,
        pauseCount: 0,
        pauseBy: 'manual',
        pauseLog: [],
        origin: 'manual',
        scheduleStart: '',
        scheduleEnd: ''
    };
}

// ---- Pause intervals and who did what (manual or automatic) ----
// A session remembers each pause as {startMs, endMs, by}. These helpers are pure: they take a
// time (and, for a pause, a state) and return clean data, so they are tested directly in Node.
// Sessions saved before this existed simply have no intervals; nothing is invented for them.
const SESSION_HISTORY_MAX_ENTRIES = 5000;

function normalizeSessionActor(value) {
    return value === 'auto' ? 'auto' : 'manual';
}

// Keeps only usable pauses, cuts them to [windowStartMs, windowEndMs], puts them in order
// and merges any that overlap. Pauses of zero length are dropped.
function normalizeSessionPauses(input, windowStartMs, windowEndMs) {
    const source = Array.isArray(input) ? input : [];
    const lo = Number.isFinite(Number(windowStartMs)) ? Number(windowStartMs) : 0;
    const hi = Number.isFinite(Number(windowEndMs)) ? Number(windowEndMs) : Number.POSITIVE_INFINITY;
    const cleaned = [];
    source.forEach((item) => {
        const startMs = Math.max(lo, Number(item?.startMs));
        const endMs = Math.min(hi, Number(item?.endMs));
        if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return;
        cleaned.push({ startMs, endMs, by: normalizeSessionActor(item?.by) });
    });
    cleaned.sort((a, b) => a.startMs - b.startMs);
    const out = [];
    cleaned.forEach((pause) => {
        const last = out[out.length - 1];
        if (last && pause.startMs < last.endMs) {
            last.endMs = Math.max(last.endMs, pause.endMs);
        } else {
            out.push({ ...pause });
        }
    });
    return out;
}

// Total paused time that falls inside [startMs, endMs].
function getSessionPausedMsBetween(pauses, startMs, endMs) {
    return normalizeSessionPauses(pauses, startMs, endMs).reduce((sum, pause) => sum + (pause.endMs - pause.startMs), 0);
}

function startSessionPause(state, nowMs, by = 'manual') {
    return {
        ...state,
        paused: true,
        pauseStartedMs: nowMs,
        pauseCount: Math.max(0, Number(state?.pauseCount) || 0) + 1,
        pauseBy: normalizeSessionActor(by)
    };
}

function endSessionPause(state, nowMs) {
    const startedMs = Number(state?.pauseStartedMs);
    const wasPaused = !!state?.paused && Number.isFinite(startedMs) && startedMs > 0;
    const log = Array.isArray(state?.pauseLog) ? state.pauseLog.map((pause) => ({ ...pause })) : [];
    let pausedTotalMs = Math.max(0, Number(state?.pausedTotalMs) || 0);
    if (wasPaused) {
        pausedTotalMs += Math.max(0, nowMs - startedMs);
        if (nowMs > startedMs) log.push({ startMs: startedMs, endMs: nowMs, by: normalizeSessionActor(state?.pauseBy) });
    }
    return { ...state, paused: false, pauseStartedMs: 0, pausedTotalMs, pauseLog: log };
}

// The pauses to save with a finished session: the closed ones plus a pause still open at the end.
function getSessionPausesForHistory(state, endedAtMs) {
    const closed = Array.isArray(state?.pauseLog) ? state.pauseLog : [];
    const startedMs = Number(state?.pauseStartedMs);
    const open = state?.paused && Number.isFinite(startedMs) && startedMs > 0
        ? [{ startMs: startedMs, endMs: endedAtMs, by: state?.pauseBy }]
        : [];
    return normalizeSessionPauses([...closed, ...open], Number(state?.startMs) || 0, endedAtMs);
}

function normalizeSessionScheduleTime(value) {
    const parsed = parseOptionalTime(value);
    if (!parsed) return '';
    return `${String(parsed.hours).padStart(2, '0')}:${String(parsed.minutes).padStart(2, '0')}`;
}

function getCurrentSessionClockTime(nowMs = Date.now()) {
    const now = new Date(nowMs);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function normalizeSessionTrackerState(input) {
    const base = getSessionDefaultState();
    const source = input && typeof input === 'object' ? input : {};
    const startMs = Number(source.startMs);
    const pausedTotalMs = Number(source.pausedTotalMs);
    const pauseStartedMs = Number(source.pauseStartedMs);
    const pauseCount = Number(source.pauseCount);
    const active = !!source.active && Number.isFinite(startMs) && startMs > 0;
    const paused = active && !!source.paused;

    return {
        ...base,
        active,
        paused,
        startMs: active ? startMs : 0,
        pausedTotalMs: active ? Math.max(0, Number.isFinite(pausedTotalMs) ? pausedTotalMs : 0) : 0,
        pauseStartedMs: active && paused && Number.isFinite(pauseStartedMs) && pauseStartedMs > 0 ? pauseStartedMs : 0,
        pauseCount: active ? Math.max(0, Number.isFinite(pauseCount) ? pauseCount : 0) : 0,
        pauseBy: normalizeSessionActor(source.pauseBy),
        pauseLog: active ? normalizeSessionPauses(source.pauseLog, startMs, Number.POSITIVE_INFINITY) : [],
        origin: normalizeSessionActor(source.origin),
        scheduleStart: normalizeSessionScheduleTime(source.scheduleStart),
        scheduleEnd: normalizeSessionScheduleTime(source.scheduleEnd)
    };
}

function normalizeSessionHistoryEntries(input) {
    const source = Array.isArray(input) ? input : [];
    return source
        .map((entry, index) => {
            const startedAtMs = Number(entry?.startedAtMs);
            const endedAtMs = Number(entry?.endedAtMs);
            if (!Number.isFinite(startedAtMs) || !Number.isFinite(endedAtMs) || endedAtMs < startedAtMs) return null;
            const safeCallCount = Math.max(0, Math.round(Number(entry?.callCount) || 0));
            const pauses = normalizeSessionPauses(entry?.pauses, startedAtMs, endedAtMs);
            const safePauseCount = Math.max(pauses.length, Math.max(0, Math.round(Number(entry?.pauseCount) || 0)));
            return {
                id: String(entry?.id || `${endedAtMs}-${index}`),
                startedAtMs,
                endedAtMs,
                talkMs: Math.max(0, Number(entry?.talkMs) || 0),
                idleMs: Math.max(0, Number(entry?.idleMs) || 0),
                availableMs: Math.max(0, Number(entry?.availableMs) || 0),
                utilization: Math.max(0, Math.min(100, Number(entry?.utilization) || 0)),
                callCount: safeCallCount,
                pauseCount: safePauseCount,
                pauses,
                startedBy: normalizeSessionActor(entry?.startedBy),
                endedBy: normalizeSessionActor(entry?.endedBy),
                earned: Math.max(0, Number(entry?.earned) || 0)
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.endedAtMs - a.endedAtMs)
        .slice(0, SESSION_HISTORY_MAX_ENTRIES);
}

function formatSessionPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return '0.0%';
    return `${Math.min(100, n).toFixed(1)}%`;
}

function normalizeActiveCallSession(input) {
  const start = Number(input?.start);
  const rate = Number(input?.rate);
  const rateName = String(input?.rateName || '').trim() || null;
  const lastPing = Number(input?.lastPing);

  if (!Number.isFinite(start) || start <= 0) return null;

  return {
    start,
    rate: Number.isFinite(rate) && rate > 0 ? rate : 0,
    rateName,
    lastPing: Number.isFinite(lastPing) && lastPing > 0 ? lastPing : start
  };
}

function formatMinutesLabel(totalMinutes) {
    if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '--';
    if (totalMinutes < 1) return '<1 min';
    if (totalMinutes < 60) return `${Math.round(totalMinutes)} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatSupportiveCurrencyDelta(value) {
    if (!Number.isFinite(value)) return 'no baseline yet';
    if (Math.abs(value) < 0.005) return 'on par';
    if (value > 0) return `${formatEarnings(value)} ahead`;
    return `${formatEarnings(Math.abs(value))} behind`;
}

function formatSupportiveDurationDelta(milliseconds) {
    if (!Number.isFinite(milliseconds)) return 'no baseline yet';
    if (Math.abs(milliseconds) < 1000) return 'on par';
    const value = formatTime(Math.abs(milliseconds));
    return milliseconds > 0 ? `${value} longer` : `${value} shorter`;
}

function formatSupportivePercentDelta(value) {
    if (!Number.isFinite(value)) return 'no baseline yet';
    if (Math.abs(value) < 0.5) return 'on par';
    const rounded = Math.round(Math.abs(value));
    return value > 0 ? `${rounded}% ahead` : `${rounded}% behind`;
}


// ---- Backup of settings and session history (backup format 2) ----
// A backup file carries the user's preferences and finished sessions along with calls, rates,
// goal and payment cycles. Only choices that make sense on another device travel. Things tied
// to one screen or one device (panel sizes, dock position, reminder timers, "last backup" time)
// stay out on purpose. Older backups simply do not have these fields and still import fine.
const BACKUP_FORMAT_VERSION = 2;
const BACKUP_PORTABLE_SETTINGS = ['theme', 'timeZone', 'featureFlags', 'patternsMode', 'trendMode', 'hourlyHeatmapMetric'];

function isValidBackupTimeZone(value) {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: value });
        return true;
    } catch (error) {
        return false;
    }
}

// Returns a clean value for one setting, or undefined when it is missing or not usable.
function sanitizeBackupSetting(key, value) {
    if (value === null || value === undefined) return undefined;
    switch (key) {
        case 'theme':
            return value === 'dark' || value === 'light' ? value : undefined;
        case 'timeZone':
            return isValidBackupTimeZone(value) ? value : undefined;
        case 'featureFlags':
            return value && typeof value === 'object' && !Array.isArray(value) ? value : undefined;
        case 'patternsMode':
            return ['hourly', 'weekly', 'monthly'].includes(value) ? value : undefined;
        case 'trendMode':
            return ['weekly', 'monthly'].includes(value) ? value : undefined;
        case 'hourlyHeatmapMetric':
            return ['calls', 'minutes', 'earnings'].includes(value) ? value : undefined;
        default:
            return undefined;
    }
}

// readItem(key) returns the raw saved text (as localStorage does) or null.
function buildBackupSettings(readItem) {
    const out = {};
    BACKUP_PORTABLE_SETTINGS.forEach((key) => {
        let raw = null;
        try { raw = readItem(key); } catch (error) { raw = null; }
        if (raw === null || raw === undefined) return;
        let value = raw;
        if (key === 'featureFlags') {
            try { value = JSON.parse(raw); } catch (error) { return; }
        }
        const clean = sanitizeBackupSetting(key, value);
        if (clean !== undefined) out[key] = clean;
    });
    return out;
}

// Merge rule: a setting from a backup is applied only when this device has no value for it yet,
// so restoring on a new device brings your preferences back and importing on a device you already
// set up never overrides your choices. hasLocalValue(key) tells whether one is saved here.
function pickSettingsToRestore(importedSettings, hasLocalValue) {
    const picked = {};
    if (!importedSettings || typeof importedSettings !== 'object') return picked;
    BACKUP_PORTABLE_SETTINGS.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(importedSettings, key)) return;
        const clean = sanitizeBackupSetting(key, importedSettings[key]);
        if (clean === undefined) return;
        let local = false;
        try { local = !!hasLocalValue(key); } catch (error) { local = false; }
        if (!local) picked[key] = clean;
    });
    return picked;
}

// Both lists are expected to be already normalized. A session already here (same id, or the same
// start and end) is kept as is and the imported copy is skipped.
function mergeSessionHistoryWithExisting(existingEntries, importedEntries) {
    const merged = Array.isArray(existingEntries) ? existingEntries.map((entry) => ({ ...entry })) : [];
    const ids = new Set(merged.map((entry) => String(entry.id)));
    const spans = new Set(merged.map((entry) => `${entry.startedAtMs}-${entry.endedAtMs}`));
    let addedCount = 0;
    let skippedCount = 0;
    (Array.isArray(importedEntries) ? importedEntries : []).forEach((entry) => {
        const span = `${entry.startedAtMs}-${entry.endedAtMs}`;
        if (ids.has(String(entry.id)) || spans.has(span)) {
            skippedCount += 1;
            return;
        }
        ids.add(String(entry.id));
        spans.add(span);
        merged.push({ ...entry });
        addedCount += 1;
    });
    merged.sort((a, b) => b.endedAtMs - a.endedAtMs);
    return { merged, addedCount, skippedCount };
}
