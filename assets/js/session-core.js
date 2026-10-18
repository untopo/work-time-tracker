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
        scheduleStart: '',
        scheduleEnd: ''
    };
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
            const safePauseCount = Math.max(0, Math.round(Number(entry?.pauseCount) || 0));
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
                earned: Math.max(0, Number(entry?.earned) || 0)
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.endedAtMs - a.endedAtMs)
        .slice(0, 60);
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
