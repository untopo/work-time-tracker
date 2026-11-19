// Work Time Tracker - data recovery (pure logic).
//
// Goal: a damaged or unreadable saved value must never wipe everything. Each saved key is
// read on its own, anything that can still be read is kept, and the original text of a
// damaged key is kept as a copy so it can be downloaded and recovered later.
//
// Plain functions with no app state and no screen elements, tested in Node (tests/unit).
// Loaded before app.js.

const RECOVERY_SNAPSHOT_VERSION = 1;

// Reads a saved list. Valid text is used as is. Text that was cut off (a closed tab or a crash
// while saving) is scanned for every complete item, so those are kept and only the broken tail
// is left out. Returns { value, status, recovered, dropped } where status is one of
// 'empty' | 'ok' | 'salvaged' | 'unreadable'.
function salvageList(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') {
        return { value: [], status: 'empty', recovered: 0, dropped: 0 };
    }
    const text = String(raw);
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return { value: parsed, status: 'ok', recovered: parsed.length, dropped: 0 };
        return { value: [], status: 'unreadable', recovered: 0, dropped: 0 };
    } catch (error) {
        // fall through to the scan below
    }
    const start = text.indexOf('[');
    if (start < 0) return { value: [], status: 'unreadable', recovered: 0, dropped: 0 };

    const items = [];
    let dropped = 0;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let itemStart = -1;
    for (let i = start + 1; i < text.length; i += 1) {
        const ch = text[i];
        if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
            continue;
        }
        if (ch === '"') { inString = true; continue; }
        if (ch === '{' || ch === '[') {
            if (depth === 0) itemStart = i;
            depth += 1;
        } else if (ch === '}' || ch === ']') {
            if (depth === 0) break; // the list's own closing bracket
            depth -= 1;
            if (depth === 0 && itemStart >= 0) {
                try {
                    items.push(JSON.parse(text.slice(itemStart, i + 1)));
                } catch (error) {
                    dropped += 1;
                }
                itemStart = -1;
            }
        }
    }
    if (itemStart >= 0) dropped += 1; // an item that was cut off before it closed
    if (!items.length && !dropped) return { value: [], status: 'unreadable', recovered: 0, dropped: 0 };
    return { value: items, status: 'salvaged', recovered: items.length, dropped };
}

// Reads a saved value that is not a list (an object, true/false). Returns { value, status }
// with status 'empty' | 'ok' | 'unreadable'. `value` is null when it could not be read.
function readStoredValue(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') return { value: null, status: 'empty' };
    try {
        return { value: JSON.parse(String(raw)), status: 'ok' };
    } catch (error) {
        return { value: null, status: 'unreadable' };
    }
}

// The keys the app cannot work without, and how each is read.
const RECOVERY_LIST_KEYS = ['rates', 'calls'];
const RECOVERY_VALUE_KEYS = ['dailyGoal', 'paymentCyclesEnabled'];

// Reads the core saved data one key at a time. `getRaw(key)` returns the saved text or null.
// Nothing here ever deletes or rewrites anything.
function loadCoreStoredData(getRaw) {
    const out = { rates: [], calls: [], dailyGoal: null, paymentCyclesEnabled: false, damaged: {}, summary: {} };
    RECOVERY_LIST_KEYS.forEach((key) => {
        const raw = getRaw(key);
        const result = salvageList(raw);
        out[key] = result.value;
        if (result.status === 'salvaged' || result.status === 'unreadable') {
            out.damaged[key] = { status: result.status, raw: raw === null ? '' : String(raw) };
            out.summary[key] = { status: result.status, recovered: result.recovered, dropped: result.dropped };
        }
    });
    RECOVERY_VALUE_KEYS.forEach((key) => {
        const raw = getRaw(key);
        const result = readStoredValue(raw);
        if (result.status === 'ok') {
            if (key === 'dailyGoal') out.dailyGoal = result.value;
            else out.paymentCyclesEnabled = result.value === true;
        } else if (result.status === 'unreadable') {
            out.damaged[key] = { status: 'unreadable', raw: String(raw) };
            out.summary[key] = { status: 'unreadable', recovered: 0, dropped: 0 };
        }
    });
    return out;
}

// A copy of what was found, kept in the browser until the person downloads or dismisses it.
function buildRecoverySnapshot({ reason, rawByKey, createdAt, appVersion, summary } = {}) {
    return {
        format: 'wtt-recovery-snapshot',
        v: RECOVERY_SNAPSHOT_VERSION,
        reason: ['reset-all', 'delete-calls'].includes(reason) ? reason : 'damaged-data',
        createdAt: createdAt || new Date().toISOString(),
        appVersion: String(appVersion || ''),
        summary: summary && typeof summary === 'object' ? summary : {},
        raw: rawByKey && typeof rawByKey === 'object' ? rawByKey : {}
    };
}

// Reasons for which the copy holds everything that was saved, so it can be put back as it was.
function isRestorableSnapshot(snapshot) {
    return isRecoverySnapshot(snapshot) && (snapshot.reason === 'reset-all' || snapshot.reason === 'delete-calls');
}

function isRecoverySnapshot(value) {
    return !!value && value.format === 'wtt-recovery-snapshot' && value.raw && typeof value.raw === 'object';
}

// The file the person downloads. It has the same fields as a normal backup (calls, rates,
// goal, payment cycles), so "Import" in Data Hub can read it, plus the original text of every
// saved key under `rawData` for support.
function buildRecoveryFile(snapshot) {
    if (!isRecoverySnapshot(snapshot)) return null;
    const raw = snapshot.raw;
    const calls = salvageList(raw.calls).value;
    const rates = salvageList(raw.rates).value;
    const cycles = salvageList(raw.paymentCycles).value.length
        ? salvageList(raw.paymentCycles).value
        : salvageList(raw.paymentCycles_backup).value;
    const goal = readStoredValue(raw.dailyGoal);
    const file = {
        calls,
        rates,
        paymentCycles: cycles,
        paymentCyclesEnabled: readStoredValue(raw.paymentCyclesEnabled).value === true,
        recovery: {
            reason: snapshot.reason,
            createdAt: snapshot.createdAt,
            appVersion: snapshot.appVersion,
            summary: snapshot.summary
        },
        rawData: raw
    };
    if (goal.status === 'ok' && goal.value && typeof goal.value === 'object') file.dailyGoal = goal.value;
    if (Array.isArray(snapshot.older) && snapshot.older.length) {
        file.olderCopies = snapshot.older
            .filter(isRecoverySnapshot)
            .map((older) => ({ reason: older.reason, createdAt: older.createdAt, appVersion: older.appVersion, rawData: older.raw }));
    }
    return file;
}

// Plain-language line for the notice on screen.
function describeRecovery(snapshot) {
    if (!isRecoverySnapshot(snapshot)) return '';
    if (snapshot.reason === 'reset-all') {
        return 'You reset all data. A copy of what was saved is kept here so you can restore it.';
    }
    if (snapshot.reason === 'delete-calls') {
        return 'You erased your call history. A copy of what was saved is kept here so you can restore it.';
    }
    const s = snapshot.summary || {};
    const parts = [];
    if (s.calls) {
        parts.push(s.calls.status === 'salvaged'
            ? `${s.calls.recovered} call${s.calls.recovered === 1 ? '' : 's'} recovered${s.calls.dropped ? `, ${s.calls.dropped} could not be read` : ''}`
            : 'the call list could not be read');
    }
    if (s.rates) parts.push(s.rates.status === 'salvaged' ? `${s.rates.recovered} rate${s.rates.recovered === 1 ? '' : 's'} recovered` : 'the rates could not be read');
    if (s.dailyGoal) parts.push('the daily goal could not be read');
    if (s.paymentCyclesEnabled) parts.push('a payment cycles setting could not be read');
    return `Some saved data was damaged. Everything else was kept, and a copy of the original is saved here${parts.length ? ` (${parts.join('; ')})` : ''}.`;
}
