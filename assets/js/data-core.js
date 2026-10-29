// Work Time Tracker - data core.
//
// Plain functions that read and shape call, rate, goal and payment-cycle data
// (normalizing a call, merging imports without duplicates, CSV parsing, date and
// money formatting). They do NOT use any app state or screen element, so they can be
// tested directly in Node (tests/unit) and are safe to reuse.
//
// Loaded before app.js (see index.html). Everything here is a global function, exactly as
// it was when it lived inside app.js; moving it did not change a single line of logic.
// Rule for new code here: no access to app variables (calls, rates, ...) or the DOM.

function escapeHTML(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function parseOptionalDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function parseOptionalTime(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return { hours, minutes, seconds };
}

function combineCallDateAndTime(dateObj, timeValue) {
  const time = parseOptionalTime(timeValue);
  return combineCallDateAndParsedTime(dateObj, time);
}

function combineCallDateAndParsedTime(dateObj, time) {
  if (!time) return null;
  const base = dateObj instanceof Date && Number.isFinite(dateObj.getTime()) ? dateObj : new Date();
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    time.hours,
    time.minutes,
    time.seconds,
    0
  );
}

function minutesToMs(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return 0;

  if (/^\d+(\.\d+)?$/.test(raw)) {
    const mins = Number(raw);
    if (!Number.isFinite(mins) || mins <= 0) return NaN;
    return Math.round(mins * 60 * 1000);
  }

  if (!/^\d{1,3}:\d{1,2}(:\d{1,2})?$/.test(raw)) return NaN;

  const parts = raw.split(':').map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return NaN;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
    if (minutes >= 60 || seconds >= 60) return NaN;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
    if (seconds >= 60) return NaN;
  } else {
    return NaN;
  }

  const totalMs = (((hours * 60) + minutes) * 60 + seconds) * 1000;
  return totalMs > 0 ? totalMs : NaN;
}

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }
    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cellValue) => String(cellValue || '').trim().length > 0));
}

function normalizeCsvHeader(value) {
  return String(value || '').replace(/^\ufeff/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function findCsvColumnIndex(headers, aliases) {
  const normalized = headers.map(normalizeCsvHeader);
  const aliasSet = new Set(aliases.map(normalizeCsvHeader));
  return normalized.findIndex((header) => aliasSet.has(header));
}

function parseFlexibleDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return parseDateInput(raw);

  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    let month = Number(slash[1]);
    let day = Number(slash[2]);
    let year = Number(slash[3]);
    if (year < 100) year += 2000;
    if (month > 12 && day <= 12) {
      const swap = month;
      month = day;
      day = swap;
    }
    const parsed = new Date(year, month - 1, day);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }

  const parsed = new Date(raw);
  if (!Number.isFinite(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function parseFlexibleTime(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const direct = parseOptionalTime(raw);
  if (direct) return direct;

  const meridiemMatch = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (meridiemMatch) {
    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const seconds = Number(meridiemMatch[3] || 0);
    const meridiem = meridiemMatch[4].toUpperCase();
    if (hours === 12) hours = 0;
    if (meridiem === 'PM') hours += 12;
    return { hours, minutes, seconds };
  }

  const dateMatch = raw.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i);
  return dateMatch ? parseFlexibleTime(dateMatch[1]) : null;
}

function getCallDuplicateKey(call) {
  const startIso = call?.startTime ? new Date(call.startTime).toISOString() : '';
  const endIso = call?.endTime ? new Date(call.endTime).toISOString() : '';
  return `${startIso}|${endIso}`;
}

function escapeCsvCell(value) {
  const raw = value == null ? '' : String(value);
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

// Helper Functions
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatEarnings(amount) {
    const value = Number(amount);
    return `$${(Number.isFinite(value) ? value : 0).toFixed(2)}`;
}

function normalizeDailyGoal(goal) {
    const normalizedGoal = goal && typeof goal === 'object' ? goal : {};
    return {
        amount: Math.max(Number(normalizedGoal.amount) || 0, 0),
        minutes: Math.max(Number(normalizedGoal.minutes) || 0, 0)
    };
}

function getCallDurationSeconds(call) {
    const raw = Number(call.duration ?? 0);
    if (!Number.isFinite(raw) || raw <= 0) return 0;
    return raw > 24 * 60 * 60 ? Math.round(raw / 1000) : Math.round(raw);
}

function getCallEarnings(call) {
    const fromEarnings = Number(call.earnings);
    if (Number.isFinite(fromEarnings)) return fromEarnings;

    const fromEarned = Number(call.earned);
    if (Number.isFinite(fromEarned)) return fromEarned;

    const rate = Number(call.rate) || 0;
    return (getCallDurationSeconds(call) / 60) * rate;
}

function getCsvImportColumnMap(headers) {
    return {
        date: findCsvColumnIndex(headers, ['date', 'call date', 'calldate', 'day']),
        start: findCsvColumnIndex(headers, ['start', 'start time', 'starttime', 'call start', 'time start']),
        end: findCsvColumnIndex(headers, ['end', 'end time', 'endtime', 'call end', 'time end', 'finish']),
        duration: findCsvColumnIndex(headers, ['duration', 'call duration', 'durationminutes', 'length', 'elapsed', 'talk time', 'talktime']),
        rate: findCsvColumnIndex(headers, ['rate', 'pay rate', 'rate per min', 'ratepermin', 'amount'])
    };
}

function parseCsvImportFile(text) {
    const rows = parseCsvText(text);
    if (rows.length < 2) {
        throw new Error('The CSV file is empty or does not contain any call rows.');
    }

    return {
        headers: rows[0].map((cell) => String(cell || '').trim()),
        rows: rows.slice(1),
        columnMap: getCsvImportColumnMap(rows[0].map((cell) => String(cell || '').trim()))
    };
}

function mergeCallsWithExisting(existingCalls, importedCalls) {
    const merged = existingCalls.map(normalizeCall);
    const existingKeys = new Set(merged.map(getCallDuplicateKey));
    let addedCount = 0;
    let skippedCount = 0;

    importedCalls.forEach((call) => {
        const normalizedCall = normalizeCall({
            ...call,
            id: call.id || generateUUID(),
            rpgEligible: typeof call.rpgEligible === 'boolean' ? call.rpgEligible : true
        });
        const duplicateKey = getCallDuplicateKey(normalizedCall);
        if (existingKeys.has(duplicateKey)) {
            skippedCount += 1;
            return;
        }
        existingKeys.add(duplicateKey);
        merged.push(normalizedCall);
        addedCount += 1;
    });

    return { merged, addedCount, skippedCount };
}

function normalizeImportedRate(rate) {
    const safeRate = rate && typeof rate === 'object' ? rate : {};
    const name = String(safeRate.name || '').trim();
    const amount = Number(safeRate.amount);
    if (!name || !Number.isFinite(amount) || amount < 0) return null;
    return { name, amount };
}

function getRateDuplicateKey(rate) {
    return `${String(rate.name || '').trim().toLowerCase()}|${Number(rate.amount || 0).toFixed(6)}`;
}

function mergeRatesWithExisting(existingRates, importedRates) {
    const merged = Array.isArray(existingRates) ? existingRates.map((rate) => ({ ...rate })) : [];
    const existingKeys = new Set(merged.map(getRateDuplicateKey));
    const existingNames = new Set(merged.map((rate) => String(rate.name || '').trim().toLowerCase()));
    let addedCount = 0;
    let skippedCount = 0;

    (Array.isArray(importedRates) ? importedRates : []).forEach((rate) => {
        const normalizedRate = normalizeImportedRate(rate);
        if (!normalizedRate) {
            skippedCount += 1;
            return;
        }
        const duplicateKey = getRateDuplicateKey(normalizedRate);
        const normalizedName = normalizedRate.name.toLowerCase();
        if (existingKeys.has(duplicateKey) || existingNames.has(normalizedName)) {
            skippedCount += 1;
            return;
        }
        existingKeys.add(duplicateKey);
        existingNames.add(normalizedName);
        merged.push(normalizedRate);
        addedCount += 1;
    });

    return { merged, addedCount, skippedCount };
}

function getPaymentCycleDuplicateKey(cycle) {
    if (!cycle || typeof cycle !== 'object') return '';
    return `${cycle.startDate || ''}|${cycle.endDate || ''}|${cycle.payDate || ''}`;
}

function mergePaymentCyclesWithExisting(existingCycles, importedCycles) {
    const merged = Array.isArray(existingCycles) ? existingCycles.map((cycle) => ({ ...cycle })) : [];
    const existingKeys = new Set(merged.map(getPaymentCycleDuplicateKey));
    let addedCount = 0;
    let skippedCount = 0;

    (Array.isArray(importedCycles) ? importedCycles : []).forEach((cycle) => {
        const duplicateKey = getPaymentCycleDuplicateKey(cycle);
        if (!duplicateKey || existingKeys.has(duplicateKey)) {
            skippedCount += 1;
            return;
        }
        existingKeys.add(duplicateKey);
        merged.push({ ...cycle });
        addedCount += 1;
    });

    return { merged, addedCount, skippedCount };
}

function msToHMS(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function normalizeCall(call) {
  const start = call.startTime ? new Date(call.startTime) : new Date();

  // `duration` can be in seconds (<24h) or milliseconds.
  // For finite values, treat anything under one day as seconds and larger values as milliseconds.
  // This avoids incorrect totals for long sessions.
  const rawDuration = Number(call.duration ?? 0);
  let durationMs = 0;
  if (Number.isFinite(rawDuration) && rawDuration > 0) {
    const oneDaySeconds = 24 * 60 * 60;
    // If under one day in seconds, convert to ms.
    if (rawDuration < oneDaySeconds) {
      durationMs = Math.round(rawDuration * 1000);
    } else {
      // de lo contrario asumimos que ya viene en ms
      durationMs = Math.round(rawDuration);
    }
  }

  const end = call.endTime
    ? new Date(call.endTime)
    : new Date(start.getTime() + durationMs);

  const rate = Number(call.rate) || 0;
  const earnings = Number((((end - start) / (1000 * 60)) * rate).toFixed(2));

  const normalized = {
    ...call,
    id: call.id || generateUUID(),
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    duration: Math.max(0, end - start), // ms
    rate,
    earnings,
    notes: String(call.notes ?? call.note ?? '').trim()
  };

  normalized.earned = normalized.earnings; // compat
  Object.defineProperty(normalized, '_startMs', {
    value: start.getTime(),
    writable: true,
    enumerable: false,
    configurable: true
  });
  return normalized;
}

function getCallStartMs(call) {
    if (call && Number.isFinite(call._startMs)) return call._startMs;
    const value = Date.parse(call?.startTime || '');
    return Number.isFinite(value) ? value : 0;
}

function getCallEndMs(call) {
    const endValue = Date.parse(call?.endTime || '');
    if (Number.isFinite(endValue)) return endValue;
    const startValue = getCallStartMs(call);
    const durationValue = Number(call?.duration);
    if (Number.isFinite(startValue) && startValue > 0 && Number.isFinite(durationValue) && durationValue > 0) {
        return startValue + durationValue;
    }
    return 0;
}

function getDayStartMs(dateObj) {
    const date = dateObj instanceof Date && Number.isFinite(dateObj.getTime()) ? dateObj : new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getLocalDateKey(dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDateInput(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

// Plain-words age of the last full backup, for the Data Hub ("Today", "Yesterday", "12 days ago").
function describeBackupAge(lastBackupMs, nowMs) {
    const last = Number(lastBackupMs);
    if (!Number.isFinite(last) || last <= 0) return 'No backup yet';
    const now = Number.isFinite(Number(nowMs)) ? Number(nowMs) : Date.now();
    const days = Math.round((getDayStartMs(new Date(now)) - getDayStartMs(new Date(last))) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
}
