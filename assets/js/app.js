
    // ============================================
    // VERSION & CHANGELOG
    // ============================================
    const APP_VERSION = '1.0.5';
    const CHANGELOG = [
        { version: '1.0.5', date: '2026-02-12', changes: ['Fixed: Footer version now always matches APP_VERSION', 'Fixed: Contact form email is now optional (no longer required)','Chore: Simplified dailyGoal storage to a single source of truth', 'Chore: Added legacy fallback read for old dailyGoal keys', 'Fixed: Call modal can now be closed via X and Cancel (no longer stuck)','Fixed: Saving a call no longer refreshes the page (form submit prevented)', 'Improved: Call edits/additions now update UI instantly without full page reload','Improved: Add Call now always opens in clean “Add” mode (resets editing state)'] },
        { version: '1.0.4', date: '2026-02-12', changes: [ 'Fixed: Daily Goal now syncs bidirectionally between USD and Minutes', 'Fixed: Daily Goal persistence stores both USD and Minutes correctly', 'Improved: Goal calculation now updates instantly on input change' ] },
        { version: '1.0.3', date: '2026-02-11', changes: ['Fixed: Call edit form now displays exact stored startTime and endTime', 'Fixed: Call Log displays Start Time and End Time columns', 'Fixed: Daily Goal minutes now correctly calculates and updates equivalent earnings', 'Changed: Duration is now calculated from startTime and endTime instead of manual entry'] },
        { version: '1.0.2', date: '2026-02-11', changes: ['Fixed: Call editing now always edits the correct call regardless of filter view', 'Fixed: Edit form no longer creates duplicate calls', 'Added: Unique ID to each call for reliable tracking', 'Added: Version tracking in footer'] },
        { version: '1.0.1', date: '2026-01-15', changes: ['Added timezone selector', 'Added Contact Us button', 'Added donate button', 'Performance optimizations'] },
        { version: '1.0.0', date: '2026-01-01', changes: ['Initial release'] }
    ];

// ============================================
// WHAT'S NEW (CHANGELOG) MODAL
// ============================================
const changelogModal = document.getElementById('changelog-modal');
const changelogContent = document.getElementById('changelog-content');
const closeChangelogModalBtn = document.getElementById('close-changelog-modal');
const closeChangelogBtn = document.getElementById('close-changelog-btn');

function escapeHTML(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderChangelog() {
  if (!Array.isArray(CHANGELOG) || CHANGELOG.length === 0) {
    changelogContent.innerHTML = `<p class="text-sm text-gray-600 dark:text-gray-300">No changelog available.</p>`;
    return;
  }

  // Más nuevo arriba (ya lo tienes así, pero lo reforzamos)
  const sorted = [...CHANGELOG].sort((a, b) => {
    // Si hay fecha válida, ordena por fecha, si no por versión
    const da = Date.parse(a.date || '');
    const db = Date.parse(b.date || '');
    if (Number.isFinite(da) && Number.isFinite(db)) return db - da;
    return String(b.version).localeCompare(String(a.version), undefined, { numeric: true });
  });

  changelogContent.innerHTML = sorted.map(entry => {
    const version = escapeHTML(entry.version || '');
    const date = escapeHTML(entry.date || '');
    const changes = Array.isArray(entry.changes) ? entry.changes : [];

    const changesHTML = changes.length
      ? `<ul class="list-disc pl-6 mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
          ${changes.map(c => `<li>${escapeHTML(c)}</li>`).join('')}
        </ul>`
      : `<p class="text-sm text-gray-600 dark:text-gray-300 mt-2">No notes.</p>`;

    return `
      <div class="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-baseline justify-between gap-3 flex-wrap">
          <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            v${version}
            ${version === APP_VERSION ? `<span class="ml-2 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Current</span>` : ''}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${date}</div>
        </div>
        ${changesHTML}
      </div>
    `;
  }).join('');
}

function openChangelogModal() {
  renderChangelog();
  changelogModal.style.display = 'flex';
}

function closeChangelogModal() {
  changelogModal.style.display = 'none';
}

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
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

function minutesToMs(mins) {
  const n = Number(mins);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 60 * 1000);
}

    // Global variables
    const startCallBtn = document.getElementById('start-call-btn');
    const endCallBtn = document.getElementById('end-call-btn');
    const liveCallInfo = document.getElementById('live-call-info');
    const liveCallTimerDisplay = document.getElementById('live-call-timer');
    const liveCallEarningsDisplay = document.getElementById('live-call-earnings');
    const callLogTableBody = document.getElementById('call-log');
    const totalMinutesDisplay = document.getElementById('total-minutes');
    const totalEarningsDisplay = document.getElementById('total-earnings');
    const rateSelect = document.getElementById('select-call-rate');
    const ratesList = document.getElementById('rates-list');
    const addCallBtn = document.getElementById('add-call-btn');
    const callModal = document.getElementById('call-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const callForm = document.getElementById('call-form');
    const cancelCallBtn = document.getElementById('cancel-call');
    const callStartTimeInput = document.getElementById('call-start-time');
    const callEndTimeInput = document.getElementById('call-end-time');
    const callRateSelect = document.getElementById('call-rate');
    const callDurationMinutesInput = document.getElementById('call-duration-minutes');
    const darkToggleBtn = document.getElementById('dark-toggle');
    const showRateAddBtn = document.getElementById('show-rate-add');
    const rateForm = document.getElementById('rate-form');
    const cancelRateAddBtn = document.getElementById('cancel-rate-add');
    const settingsToggleBtn = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal');
    const exportDataBtn = document.getElementById('export-data');
    const importFile = document.getElementById('import-file');
    const resetCallsBtn = document.getElementById('reset-calls');
    const resetAllBtn = document.getElementById('reset-all');
    const statsDatePicker = document.getElementById('stats-date-picker');
    const currentDateBtn = document.getElementById('current-date-btn');
    const avgDurationDisplay = document.getElementById('avg-duration');
    const todayEarningsDisplay = document.getElementById('today-earnings');
    const goalEstimateDisplay = document.getElementById('goal-estimate');
    const firstHalfEarningsDisplay = document.getElementById('first-half-earnings');
    const secondHalfEarningsDisplay = document.getElementById('second-half-earnings');
    const monthlyTotalEarningsDisplay = document.getElementById('monthly-total-earnings');
    const goalForm = document.getElementById('goal-form');
    const goalAmountInput = document.getElementById('goal-amount');
    const goalMinutesInput = document.getElementById('goal-minutes');
    const goalProgressText = document.getElementById('goal-progress-text');
    const goalAmountDisplay = document.getElementById('goal-amount-display');
    const goalMinutesDisplay = document.getElementById('goal-minutes-display');
    const goalProgressBar = document.getElementById('goal-progress-bar');
    const paymentCyclesToggle = document.getElementById('payment-cycles-toggle');
    const paymentCyclesConfig = document.getElementById('payment-cycles-config');
    const paymentCyclesList = document.getElementById('payment-cycles-list');
    const showAddCycleBtn = document.getElementById('show-add-cycle-btn');
    const cycleEarningsDisplay = document.getElementById('cycle-earnings');
    const cycleStartDateDisplay = document.getElementById('cycle-start-date');
    const cycleEndDateDisplay = document.getElementById('cycle-end-date');
    const daysUntilEndDisplay = document.getElementById('days-until-end');
    const payDateDisplay = document.getElementById('pay-date');
    const daysUntilPayDisplay = document.getElementById('days-until-pay');
    const monthlyEarningsCards = document.getElementById('monthly-earnings-cards');
    const paymentCycleEarningsCards = document.getElementById('payment-cycle-earnings-cards');
    const storageUsedDisplay = document.getElementById('storage-used');
    const storageBar = document.getElementById('storage-bar');
    const localTimeDisplay = document.getElementById('local-time');
    const userTimeZoneDisplay = document.getElementById('user-time-zone');
    const tzSelect = document.getElementById('timezone-select');
    const resetTzBtn = document.getElementById('reset-timezone');
    const editCycleModal = document.getElementById('edit-cycle-modal');
    const closeEditCycleModalBtn = document.getElementById('close-edit-cycle-modal');
    const cancelEditCycleBtn = document.getElementById('cancel-edit-cycle');
    const editCycleForm = document.getElementById('edit-cycle-form');
    const cycleStartDateInput = document.getElementById('cycle-start-date-input');
    const cycleEndDateInput = document.getElementById('cycle-end-date-input');
    const cyclePayDateInput = document.getElementById('cycle-pay-date-input');
    
    
    const filterTodayBtn = document.getElementById('filter-today');
    const filterWeekBtn = document.getElementById('filter-week');
    const filterMonthBtn = document.getElementById('filter-month');

    // Recovery modal (v1.0.5)
const recoveryModal = document.getElementById('recovery-modal');
const recoveryRateName = document.getElementById('recovery-rate-name');
const recoveryElapsed = document.getElementById('recovery-elapsed');
const recoveryResumeBtn = document.getElementById('recovery-resume-btn');
const recoverySummarizeBtn = document.getElementById('recovery-summarize-btn');
const recoveryDiscardBtn = document.getElementById('recovery-discard-btn');
    
    // Load from localStorage
    let rates, calls, dailyGoal, paymentCyclesEnabled, paymentCycles, lastSelectedRate;
    try {
        rates = JSON.parse(localStorage.getItem('rates')) || [];
        calls = JSON.parse(localStorage.getItem('calls')) || [];
        // Daily goal: primary source is 'dailyGoal'. Fallback to legacy keys if needed.
const storedDailyGoal = localStorage.getItem('dailyGoal');
if (storedDailyGoal) {
  dailyGoal = JSON.parse(storedDailyGoal);
} else {
  const legacyAmount = Number(localStorage.getItem('dailyGoalUSD')) || 0;
  const legacyMinutes = Number(localStorage.getItem('dailyGoalMinutes')) || 0;
  dailyGoal = { amount: legacyAmount, minutes: legacyMinutes };
}
        paymentCyclesEnabled = JSON.parse(localStorage.getItem('paymentCyclesEnabled')) || false;
        paymentCycles = JSON.parse(localStorage.getItem('paymentCycles')) || [];
        lastSelectedRate = localStorage.getItem('lastSelectedRate') || null;

        // Migration: Add IDs to existing calls that don't have them
        calls = calls.map(call => ({
            ...call,
            id: call.id || generateUUID()
        }));
    } catch (e) {
        console.error('Failed to parse local storage data. Resetting app data.', e);
        localStorage.clear();
        rates = [];
        calls = [];
        dailyGoal = { amount: 0, minutes: 0 };
        paymentCyclesEnabled = false;
        paymentCycles = [];
        lastSelectedRate = null;
    }
    dailyGoal = normalizeDailyGoal(dailyGoal);

    let activeTimers = new Set();
    let liveCallTimerId = null;
    let liveCallStart = null;
    let currentCallRate = null;
    let isEditingCall = false;
    let editingCallId = null;
    let isEditingCycle = false;
    let editingCycleIndex = null;
    let callLogFilter = 'today';

    // Helper Functions
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function formatEarnings(amount) {
        return `$${amount.toFixed(2)}`;
    }

    function getSelectedRateAmount() {
        const selectedName = rateSelect.value;
        const selectedRate = rates.find(rate => rate.name === selectedName);
        return selectedRate ? selectedRate.amount : 0;
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

// v1.0.5 Active live call state (for crash/close recovery)
const ACTIVE_CALL_KEY = 'activeLiveCallState';

function saveActiveCallState() {
  if (!liveCallStart) return;
  const state = {
    start: liveCallStart,
    rate: currentCallRate,
    rateName: rateSelect.value || null,
    lastPing: Date.now()
  };
  localStorage.setItem(ACTIVE_CALL_KEY, JSON.stringify(state));
}

function readActiveCallState() {
  try {
    const raw = JSON.parse(localStorage.getItem(ACTIVE_CALL_KEY));
    if (!raw || !raw.start) return null;
    return raw;
  } catch {
    return null;
  }
}

function clearActiveCallState() {
  localStorage.removeItem(ACTIVE_CALL_KEY);
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

  

  // Si duration viene en ms (común) o en segundos, lo normalizamos a ms
  const rawDuration = Number(call.duration ?? 0);
  const durationMs = Number.isFinite(rawDuration)
    ? (rawDuration > 24 * 60 * 60 ? Math.round(rawDuration) : Math.round(rawDuration * 1000))
    : 0;

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
    earnings
  };

  normalized.earned = normalized.earnings; // compat
  return normalized;
}

function readCallsFromStorage() {
    try {
        const raw = JSON.parse(localStorage.getItem('calls')) || [];
        if (!Array.isArray(raw)) return [];
        return raw.map(normalizeCall);
    } catch {
        return [];
    }
}

    function syncDailyGoalInputs() {
        const selectedRateAmount = getSelectedRateAmount();
        const derivedMinutes = dailyGoal.amount > 0 && selectedRateAmount > 0
            ? Math.ceil(dailyGoal.amount / selectedRateAmount)
            : dailyGoal.minutes;
        goalAmountInput.value = dailyGoal.amount > 0 ? dailyGoal.amount : '';
        goalMinutesInput.value = derivedMinutes > 0 ? derivedMinutes : '';
    }
    
    // Storage functions
    function saveRates() {
        localStorage.setItem('rates', JSON.stringify(rates));
        displayRates();
        populateRateSelects();
        updateStatistics();
    }

    function saveCalls() {
  calls = calls.map(normalizeCall);
  localStorage.setItem('calls', JSON.stringify(calls));
  displayCalls();
  updateStatistics();
}

    function saveDailyGoal() {
  dailyGoal = normalizeDailyGoal(dailyGoal);
  localStorage.setItem('dailyGoal', JSON.stringify(dailyGoal));
  updateStatistics();
}

    function savePaymentCycles() {
        localStorage.setItem('paymentCyclesEnabled', JSON.stringify(paymentCyclesEnabled));
        localStorage.setItem('paymentCycles', JSON.stringify(paymentCycles));
        renderPaymentCycles();
        updateStatistics();
    }

    function saveLastSelectedRate() {
        lastSelectedRate = rateSelect.value;
        localStorage.setItem('lastSelectedRate', lastSelectedRate);
        syncDailyGoalInputs();
        updateStatistics();
    }

    function updateStorageInfo() {
        const data = {
            rates,
            calls,
            dailyGoal,
            paymentCyclesEnabled,
            paymentCycles,
            theme: localStorage.getItem('theme'),
            timeZone: localStorage.getItem('timeZone')
        };
        const dataStr = JSON.stringify(data);
        const bytes = new Blob([dataStr]).size;
        const kb = (bytes / 1024).toFixed(2);
        const maxKb = 5120;
        const percentage = Math.min((bytes / (maxKb * 1024)) * 100, 100);
        
        storageUsedDisplay.textContent = `${kb} KB / ${(maxKb / 1024).toFixed(1)} MB`;
        storageBar.style.width = `${percentage}%`;
    }

    function updateStatistics() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const todaysCalls = calls.filter(call => new Date(call.startTime) >= todayStart);
        const todaysEarnings = todaysCalls.reduce((sum, call) => sum + call.earned, 0);
        const todaysDuration = todaysCalls.reduce((sum, call) => sum + call.duration, 0);
        const todaysMinutes = todaysDuration / (1000 * 60);
        
        todayEarningsDisplay.textContent = formatEarnings(todaysEarnings);
        
        if (todaysCalls.length > 0) {
            const avgDuration = todaysDuration / todaysCalls.length;
            avgDurationDisplay.textContent = formatTime(avgDuration);
        } else {
            avgDurationDisplay.textContent = '00:00:00';
        }
        
        const hasAmountGoal = dailyGoal.amount > 0;
        const hasMinutesGoal = dailyGoal.minutes > 0;
        const selectedRateAmount = getSelectedRateAmount();
        const derivedGoalMinutes = hasAmountGoal && selectedRateAmount > 0
            ? Math.ceil(dailyGoal.amount / selectedRateAmount)
            : dailyGoal.minutes;
        
        if (hasAmountGoal || hasMinutesGoal) {
            const goalSummary = [];
            const ratePerMinute = todaysMinutes > 0 ? todaysEarnings / todaysMinutes : 0;
            const targetMinutes = derivedGoalMinutes;

            if (hasAmountGoal) {
                const remainingAmount = dailyGoal.amount - todaysEarnings;
                if (remainingAmount <= 0) {
                    goalEstimateDisplay.textContent = 'Goal reached!';
                } else {
                    const minutesNeeded = ratePerMinute > 0 ? (remainingAmount / ratePerMinute).toFixed(0) : '--';
                    goalEstimateDisplay.textContent = `${minutesNeeded} mins to goal`;
                }
                goalSummary.push(`$${todaysEarnings.toFixed(2)} / $${dailyGoal.amount.toFixed(2)}`);
            } else {
                const remainingMinutes = targetMinutes - todaysMinutes;
                if (remainingMinutes <= 0) {
                    goalEstimateDisplay.textContent = 'Goal reached!';
                } else {
                    goalEstimateDisplay.textContent = `${Math.ceil(remainingMinutes)} mins to goal`;
                }
            }

            if (hasMinutesGoal || targetMinutes > 0) {
                goalSummary.push(`${Math.round(todaysMinutes)} / ${targetMinutes} Min`);
            }

            const primaryGoal = hasAmountGoal ? {
                earned: todaysEarnings,
                target: dailyGoal.amount
            } : {
                earned: todaysMinutes,
                target: derivedGoalMinutes
            };
            const progress = primaryGoal.target > 0
                ? Math.min((primaryGoal.earned / primaryGoal.target) * 100, 100)
                : 0;

            goalAmountDisplay.textContent = goalSummary[0] || '$0.00 / $0.00';
            goalMinutesDisplay.textContent = goalSummary[1] || '0 / 0 Min';
            goalProgressBar.style.width = `${progress}%`;
            goalProgressText.textContent = `${progress.toFixed(0)}%`;
        } else {
            goalEstimateDisplay.textContent = 'No goal set';
            goalProgressBar.style.width = '0%';
            goalProgressText.textContent = '0%';
            goalAmountDisplay.textContent = '$0.00 / $0.00';
            goalMinutesDisplay.textContent = '0 / 0 Min';
        }
        
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthCalls = calls.filter(call => new Date(call.startTime) >= monthStart);
        
        const firstHalfCalls = monthCalls.filter(call => new Date(call.startTime).getDate() <= 15);
        const secondHalfCalls = monthCalls.filter(call => new Date(call.startTime).getDate() > 15);
        
        const firstHalfEarnings = firstHalfCalls.reduce((sum, call) => sum + call.earned, 0);
        const secondHalfEarnings = secondHalfCalls.reduce((sum, call) => sum + call.earned, 0);
        const monthlyEarnings = firstHalfEarnings + secondHalfEarnings;
        
        firstHalfEarningsDisplay.textContent = formatEarnings(firstHalfEarnings);
        secondHalfEarningsDisplay.textContent = formatEarnings(secondHalfEarnings);
        monthlyTotalEarningsDisplay.textContent = formatEarnings(monthlyEarnings);
        
        if (paymentCyclesEnabled && paymentCycles.length > 0) {
            const currentCycle = paymentCycles.find(cycle => {
                const start = new Date(cycle.startDate);
                const end = new Date(cycle.endDate);
                return now >= start && now <= end;
            });
            
            if (currentCycle) {
                const cycleStart = new Date(currentCycle.startDate);
                const cycleEnd = new Date(currentCycle.endDate);
                const cycleCalls = calls.filter(call => {
                    const callDate = new Date(call.startTime);
                    return callDate >= cycleStart && callDate <= cycleEnd;
                });
                
                const cycleEarnings = cycleCalls.reduce((sum, call) => sum + call.earned, 0);
                cycleEarningsDisplay.textContent = formatEarnings(cycleEarnings);
                
                cycleStartDateDisplay.textContent = formatDate(currentCycle.startDate);
                cycleEndDateDisplay.textContent = formatDate(currentCycle.endDate);
                
                const daysLeft = Math.ceil((cycleEnd - now) / (1000 * 60 * 60 * 24));
                daysUntilEndDisplay.textContent = `${daysLeft} days`;
                
                const payDate = new Date(currentCycle.payDate);
                payDateDisplay.textContent = formatDate(currentCycle.payDate);
                
                const daysUntilPay = Math.ceil((payDate - now) / (1000 * 60 * 60 * 24));
                daysUntilPayDisplay.textContent = `${daysUntilPay} days`;
            }
        }
        
        updateStorageInfo();
    }
    
    // Time zone helpers
    function getUserTimeZone() {
        const tz = localStorage.getItem('timeZone');
        return tz && tz.length > 0 ? tz : undefined;
    }

    function setUserTimeZone(tz) {
        if (!tz) {
            localStorage.removeItem('timeZone');
        } else {
            localStorage.setItem('timeZone', tz);
        }
    }

    function populateTimeZones() {
        if (!tzSelect) return;
        tzSelect.innerHTML = '';
        const userTz = getUserTimeZone();
        const options = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [];
        options.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = tz;
            if (tz === userTz) option.selected = true;
            tzSelect.appendChild(option);
        });
        if (!userTz && tzSelect.options.length > 0) {
            const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const match = [...tzSelect.options].find(opt => opt.value === browserTz);
            if (match) match.selected = true;
        }
    }

    function updateLocalTime() {
        const tz = getUserTimeZone();
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: tz
        };
        const dateOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: tz
        };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
        localTimeDisplay.textContent = `${dateString} ${timeString}`;
        userTimeZoneDisplay.textContent = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    }

    function calculateEarnings(durationMs, ratePerMin) {
        const minutes = durationMs / (1000 * 60);
        return minutes * ratePerMin;
    }

    // Display functions
    function displayRates() {
        ratesList.innerHTML = '';
        if (rates.length === 0) {
            ratesList.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400">No rates added yet.</p>`;
            return;
        }
        rates.forEach((rate, index) => {
            const rateItem = document.createElement('div');
            rateItem.className = 'rates-list-item';
            rateItem.innerHTML = `
                <div class="flex-1">
                    <p class="font-semibold">${rate.name}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">$${rate.amount.toFixed(2)}/min</p>
                </div>
                <div class="flex items-center">
                    <button class="edit-rate-btn" data-index="${index}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-rate-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            ratesList.appendChild(rateItem);
        });

        document.querySelectorAll('.edit-rate-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                editRate(index);
            });
        });

        document.querySelectorAll('.delete-rate-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                deleteRate(index);
            });
        });
    }

    function populateRateSelects() {
        const rateOptions = rates.map(rate => `<option value="${rate.name}">${rate.name} - $${rate.amount.toFixed(2)}/min</option>`).join('');
        rateSelect.innerHTML = rateOptions;
        callRateSelect.innerHTML = rateOptions;
        
        if (lastSelectedRate && rates.some(rate => rate.name === lastSelectedRate)) {
            rateSelect.value = lastSelectedRate;
        }
    }

    function formatLocalDateTime(isoString) {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function displayCalls() {
        callLogTableBody.innerHTML = '';
        let filteredCalls = [];
        const now = new Date();

        if (callLogFilter === 'today') {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filteredCalls = calls.filter(call => new Date(call.startTime) >= todayStart);
        } else if (callLogFilter === 'week') {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            filteredCalls = calls.filter(call => new Date(call.startTime) >= weekStart);
        } else if (callLogFilter === 'month') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            filteredCalls = calls.filter(call => new Date(call.startTime) >= monthStart);
        } else if (callLogFilter === 'date') {
            const selectedDate = new Date(statsDatePicker.value);
            const dateStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const dateEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
            filteredCalls = calls.filter(call => new Date(call.startTime) >= dateStart && new Date(call.startTime) < dateEnd);
        }

        if (filteredCalls.length === 0) {
            callLogTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500 dark:text-gray-400">No calls recorded.</td></tr>`;
            totalMinutesDisplay.textContent = '0 min';
            totalEarningsDisplay.textContent = '$0.00';
            return;
        }

        filteredCalls.forEach((call) => {
            const startDate = new Date(call.startTime);
            const endDate = new Date(call.endTime);
            
            const startDisplay = startDate.toLocaleString(undefined, { timeZone: getUserTimeZone() });
            const endDisplay = endDate.toLocaleString(undefined, { timeZone: getUserTimeZone() });
            
            const durationStr = formatTime(call.duration);
            const earningsStr = formatEarnings(call.earned);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startDisplay}</td>
                <td>${endDisplay}</td>
                <td>${durationStr}</td>
                <td>${call.rateName}</td>
                <td>${earningsStr}</td>
                <td>
                    <button class="edit-call-btn" data-call-id="${call.id}">
  <i class="fas fa-edit"></i> Edit
</button>
                    <button class="delete-call-btn text-red-500 hover:text-red-700" data-call-id="${call.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            callLogTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-call-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const callId = e.currentTarget.dataset.callId;
    editCall(callId);
    openCallModal();
  });
});

document.querySelectorAll('.delete-call-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const callId = e.currentTarget.dataset.callId;
    deleteCall(callId);
  });
});

        const totalDuration = filteredCalls.reduce((sum, call) => sum + call.duration, 0);
        const totalMinutes = totalDuration / (1000 * 60);
        const totalEarnings = filteredCalls.reduce((sum, call) => sum + call.earned, 0);

        totalMinutesDisplay.textContent = `${Math.round(totalMinutes)} min`;
        totalEarningsDisplay.textContent = formatEarnings(totalEarnings);
    }

    // Rate functions
    function editRate(index) {
        const rate = rates[index];
        rateForm.style.display = 'block';
        showRateAddBtn.style.display = 'none';
        document.getElementById('rate-name').value = rate.name;
        document.getElementById('rate-amount').value = rate.amount;
        rateForm.dataset.editingIndex = index;
    }

    function deleteRate(index) {
        if (confirm('Are you sure you want to delete this rate?')) {
            rates.splice(index, 1);
            saveRates();
        }
    }

    // Call functions
    function handleCallFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  calls = readCallsFromStorage();

  const start = parseOptionalDate(callStartTimeInput.value);
  const end = parseOptionalDate(callEndTimeInput.value);
  const durationMsFromMinutes = minutesToMs(callDurationMinutesInput.value);

  // Validación mínima: al menos (start+end) o minutes
  if ((!start || !end) && !durationMsFromMinutes) {
    alert('Please enter Start & End time, or a Duration in minutes.');
    return;
  }

  let finalStart = start;
  let finalEnd = end;

  // Completar lo que falte usando minutes
  if (durationMsFromMinutes) {
    if (finalStart && !finalEnd) {
      finalEnd = new Date(finalStart.getTime() + durationMsFromMinutes);
    } else if (!finalStart && finalEnd) {
      finalStart = new Date(finalEnd.getTime() - durationMsFromMinutes);
    } else if (!finalStart && !finalEnd) {
      // minutes-only: anclamos a "ahora" para mantener consistencia interna
      finalStart = new Date();
      finalEnd = new Date(finalStart.getTime() + durationMsFromMinutes);
    }
  }

  // Si al final no hay ambos, algo falló
  if (!finalStart || !finalEnd || finalEnd <= finalStart) {
    alert('Please enter valid values (End must be after Start).');
    return;
  }

  const selectedRateName = callRateSelect.value;
  const selectedRate = rates.find(r => r.name === selectedRateName);
  const ratePerMin = selectedRate ? selectedRate.amount : 0;

  const durationMs = finalEnd - finalStart;
  const earnings = Number(((durationMs / (1000 * 60)) * ratePerMin).toFixed(2));

  if (isEditingCall) {
    const idx = calls.findIndex(c => c.id === editingCallId);
    if (idx === -1) return;

    const updated = normalizeCall({
      ...calls[idx],
      startTime: finalStart.toISOString(),
      endTime: finalEnd.toISOString(),
      duration: durationMs,
      rate: ratePerMin,
      rateName: selectedRateName,
      earnings
    });

    calls[idx] = updated;
  } else {
    calls.push(normalizeCall({
      id: generateUUID(),
      startTime: finalStart.toISOString(),
      endTime: finalEnd.toISOString(),
      duration: durationMs,
      rate: ratePerMin,
      rateName: selectedRateName,
      earnings
    }));
  }

  saveCalls();
  closeCallModal();
}

    function editCall(callId) {
  calls = readCallsFromStorage();
  const callToEdit = calls.find(call => call.id === callId);
  if (!callToEdit) return;

  isEditingCall = true;
  editingCallId = callId;

  // Llenar inputs del modal con los valores guardados
  callStartTimeInput.value = formatLocalDateTime(callToEdit.startTime);
  callEndTimeInput.value = formatLocalDateTime(callToEdit.endTime);
  const mins = Math.ceil((new Date(callToEdit.endTime) - new Date(callToEdit.startTime)) / (1000 * 60));
callDurationMinutesInput.value = mins > 0 ? mins : '';

  // Seleccionar la rate correcta
  if (callToEdit.rateName) {
    callRateSelect.value = callToEdit.rateName;
  } else {
    // fallback si no guardaste rateName antes
    callRateSelect.value = rateSelect.value || callRateSelect.value;
  }

  // Cambiar título del modal (opcional)
  document.getElementById('modal-title').innerHTML =
    `<i class="fas fa-edit text-blue-500 mr-2"></i>Edit Call`;
}

    function deleteCall(callId) {
    if (confirm("Are you sure you want to delete this call entry?")) {
        calls = readCallsFromStorage();
        calls = calls.filter(call => call.id !== callId);
        saveCalls();
    }
}

    // Call modal functions
    function openCallModal() {
        callModal.style.display = 'flex';
    }

    function closeCallModal() {
        callModal.style.display = 'none';
        isEditingCall = false;
        editingCallId = null;
        callForm.reset();
        callDurationMinutesInput.value = '';
    }

    // Live call functions
    function startLiveCall() {
        if (!rateSelect.value) {
            alert('Please select a rate before starting the call.');
            return;
        }
        if (liveCallTimerId) {
            clearInterval(liveCallTimerId);
        }
        liveCallStart = Date.now();
        const selectedRate = rates.find(rate => rate.name === rateSelect.value);
        currentCallRate = selectedRate ? selectedRate.amount : 0;
        liveCallInfo.style.display = 'block';
        startCallBtn.style.display = 'none';
        endCallBtn.style.display = 'block';
        liveCallInfo.classList.add('active-call-pulse');

        saveActiveCallState();

        liveCallTimerId = setInterval(() => {
            const elapsed = Date.now() - liveCallStart;
            liveCallTimerDisplay.textContent = formatTime(elapsed);
            const earned = calculateEarnings(elapsed, currentCallRate);
            liveCallEarningsDisplay.textContent = formatEarnings(earned);
        }, 1000);

        saveActiveCallState();
    }

    function endLiveCall() {
        if (liveCallTimerId) {
            clearInterval(liveCallTimerId);
        }
        const endTime = Date.now();
        const elapsed = endTime - liveCallStart;
        const earned = calculateEarnings(elapsed, currentCallRate);
        const callData = normalizeCall({
  id: generateUUID(),
  startTime: new Date(liveCallStart).toISOString(),
  endTime: new Date(endTime).toISOString(),
  duration: elapsed,
  rate: currentCallRate,
  rateName: rateSelect.value,
  earnings: Number(earned.toFixed(2))
});
calls.push(callData);
        saveCalls();
        liveCallInfo.style.display = 'none';
        startCallBtn.style.display = 'block';
        endCallBtn.style.display = 'none';
        liveCallInfo.classList.remove('active-call-pulse');
        liveCallTimerDisplay.textContent = '00:00:00';
        liveCallEarningsDisplay.textContent = '$0.00';
        liveCallStart = null;
        currentCallRate = null;
        showToast('Live call saved!');
        clearActiveCallState();
    }

    // Settings modal functions
    function openSettingsModal() {
        settingsModal.style.display = 'flex';
        updateStorageInfo();
        setTimeout(() => document.getElementById('timezone-select').scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }

    function closeSettingsModal() {
        settingsModal.style.display = 'none';
    }

    function openEditCycleModal() {
        editCycleModal.style.display = 'flex';
    }

    function closeEditCycleModal() {
        editCycleModal.style.display = 'none';
        isEditingCycle = false;
        editingCycleIndex = null;
        editCycleForm.reset();
    }

    // Payment Cycle Management
    function renderPaymentCycles() {
        paymentCyclesToggle.checked = paymentCyclesEnabled;
        if (paymentCyclesEnabled) {
            paymentCyclesConfig.classList.remove('hidden');
        } else {
            paymentCyclesConfig.classList.add('hidden');
        }

        paymentCyclesList.innerHTML = '';
        if (paymentCycles.length === 0) {
            paymentCyclesList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500 dark:text-gray-400">No cycles configured.</td></tr>`;
            return;
        }
        
        const sortedCycles = [...paymentCycles].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        sortedCycles.forEach((cycle, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
            const originalIndex = paymentCycles.findIndex(c => c.startDate === cycle.startDate && c.endDate === cycle.endDate);
            
            const startDisplay = new Date(cycle.startDate).toLocaleDateString();
            const endDisplay = new Date(cycle.endDate).toLocaleDateString();
            const payDisplay = new Date(cycle.payDate).toLocaleDateString();

            row.innerHTML = `
                <td class="px-2 py-2">${startDisplay}</td>
                <td class="px-2 py-2">${endDisplay}</td>
                <td class="px-2 py-2">${payDisplay}</td>
                <td class="px-2 py-2 text-right">
                    <button class="edit-cycle-btn text-blue-500 hover:text-blue-700 mr-2" data-index="${originalIndex}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-cycle-btn text-red-500 hover:text-red-700" data-index="${originalIndex}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            paymentCyclesList.appendChild(row);
        });

        document.querySelectorAll('.edit-cycle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                editPaymentCycle(index);
            });
        });

        document.querySelectorAll('.delete-cycle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                if (confirm('Are you sure you want to delete this payment cycle?')) {
                    paymentCycles.splice(index, 1);
                    savePaymentCycles();
                }
            });
        });

        if (paymentCyclesEnabled) {
            monthlyEarningsCards.classList.add('hidden');
            paymentCycleEarningsCards.classList.remove('hidden');
        } else {
            monthlyEarningsCards.classList.remove('hidden');
            paymentCycleEarningsCards.classList.add('hidden');
        }
    }

    function addPaymentCycle() {
        isEditingCycle = false;
        document.getElementById('edit-cycle-modal-title').textContent = 'Add Payment Cycle';
        openEditCycleModal();
    }

    function editPaymentCycle(index) {
        const cycleToEdit = paymentCycles[index];
        isEditingCycle = true;
        editingCycleIndex = index;
        document.getElementById('edit-cycle-modal-title').textContent = 'Edit Payment Cycle';

        cycleStartDateInput.value = cycleToEdit.startDate.split('T')[0];
        cycleEndDateInput.value = cycleToEdit.endDate.split('T')[0];
        cyclePayDateInput.value = cycleToEdit.payDate.split('T')[0];
        openEditCycleModal();
    }

    function handleEditCycleFormSubmit(e) {
        e.preventDefault();

        const startDate = new Date(cycleStartDateInput.value);
        const endDate = new Date(cycleEndDateInput.value);
        const payDate = new Date(cyclePayDateInput.value);

        if (!startDate || !endDate || !payDate) {
            alert('Please fill in all dates.');
            return;
        }

        const start = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        const end = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
        const pay = new Date(payDate.getUTCFullYear(), payDate.getUTCMonth(), payDate.getUTCDate());

        if (end < start) {
            alert('End date cannot be before start date.');
            return;
        }

        const newCycle = {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            payDate: pay.toISOString()
        };

        if (isEditingCycle) {
            paymentCycles[editingCycleIndex] = newCycle;
        } else {
            paymentCycles.push(newCycle);
        }

        savePaymentCycles();
        closeEditCycleModal();
        showToast('Payment cycle saved!');
    }
    
    function updateCallLogFilterButtons() {
        const buttons = [filterTodayBtn, filterWeekBtn, filterMonthBtn];
        buttons.forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white', 'dark:bg-blue-600', 'dark:text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
        });

        const activeBtn = document.getElementById(`filter-${callLogFilter}`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
            activeBtn.classList.add('bg-blue-500', 'text-white', 'dark:bg-blue-600', 'dark:text-white');
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s, transform 0.5s;
            font-family: sans-serif;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -10px)';
        }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 0)';
        }, 2500);
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    // Feedback Modal Functions
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedbackModalBtn = document.getElementById('close-feedback-modal');
    const cancelFeedbackBtn = document.getElementById('cancel-feedback');
    const feedbackForm = document.getElementById('feedback-form');
    const contactUsBtn = document.getElementById('contact-us-btn');

    function openFeedbackModal() {
        feedbackModal.style.display = 'flex';
    }

    function closeFeedbackModal() {
        feedbackModal.style.display = 'none';
        feedbackForm.reset();
    }

    if (contactUsBtn) {
        contactUsBtn.addEventListener('click', openFeedbackModal);
    }

    if (closeFeedbackModalBtn) {
        closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
    }

    if (cancelFeedbackBtn) {
        cancelFeedbackBtn.addEventListener('click', closeFeedbackModal);
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(feedbackForm);
            try {
                const response = await fetch(feedbackForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    showToast('Thank you for contacting us!');
                    closeFeedbackModal();
                } else {
                    showToast('Error sending message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error sending message. Please try again.');
            }
        });
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        startCallBtn.addEventListener('click', startLiveCall);
        endCallBtn.addEventListener('click', endLiveCall);
        addCallBtn.addEventListener('click', () => {
        callModal.addEventListener('click', (e) => {
  if (e.target === callModal) closeCallModal();
});
  // modo "Add"
  isEditingCall = false;
  editingCallId = null;

  document.getElementById('modal-title').innerHTML =
    `<i class="fas fa-plus text-blue-500 mr-2"></i>Add Call`;

  openCallModal();
});

// ✅ X (cerrar)
closeModalBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeCallModal();
});

// ✅ Cancel (cerrar)
cancelCallBtn.addEventListener('click', (e) => {
  e.preventDefault();
  closeCallModal();
});

// ✅ Save (evita refresh + actualiza en vivo porque tu handleCallFormSubmit ya llama saveCalls())
callForm.addEventListener('submit', handleCallFormSubmit);

// Open/Close What's New (Changelog)
const openChangelogBtn = document.getElementById('open-changelog');

if (openChangelogBtn) {
  openChangelogBtn.addEventListener('click', openChangelogModal);
}

if (closeChangelogModalBtn) {
  closeChangelogModalBtn.addEventListener('click', closeChangelogModal);
}

if (closeChangelogBtn) {
  closeChangelogBtn.addEventListener('click', closeChangelogModal);
}

// Click outside to close
window.addEventListener('click', (e) => {
  if (e.target === changelogModal) closeChangelogModal();
});

        // v1.0.5 Prevent accidental close when a live call is active
window.addEventListener('beforeunload', (e) => {
  if (liveCallStart) {
    saveActiveCallState();
    e.preventDefault();
    e.returnValue = '';
  }
});
// v1.0.5: Recover unfinished live call (if any)
(function handleActiveCallRecovery() {
  const state = readActiveCallState();
  if (!state) return;

  const elapsed = Math.max(0, Date.now() - state.start);

  recoveryRateName.textContent = state.rateName || '(unknown)';
  recoveryElapsed.textContent = msToHMS(elapsed);

  recoveryModal.style.display = 'flex';

  function closeRecovery() {
    recoveryModal.style.display = 'none';
  }

  recoveryResumeBtn.onclick = () => {
    if (state.rateName && rates.some(r => r.name === state.rateName)) {
      rateSelect.value = state.rateName;
      saveLastSelectedRate();
    }

    liveCallStart = state.start;
    currentCallRate = Number(state.rate) || getSelectedRateAmount();

    liveCallInfo.style.display = 'block';
    startCallBtn.style.display = 'none';
    endCallBtn.style.display = 'block';
    liveCallInfo.classList.add('active-call-pulse');

    if (liveCallTimerId) clearInterval(liveCallTimerId);

    liveCallTimerId = setInterval(() => {
      const elapsedNow = Date.now() - liveCallStart;
      liveCallTimerDisplay.textContent = formatTime(elapsedNow);
      const earned = calculateEarnings(elapsedNow, currentCallRate);
      liveCallEarningsDisplay.textContent = formatEarnings(earned);
      saveActiveCallState();
    }, 1000);

    saveActiveCallState();
    closeRecovery();
    showToast('Live call resumed.');
  };

  recoverySummarizeBtn.onclick = () => {
    const endTime = Date.now();
    const elapsedMs = Math.max(0, endTime - state.start);

    const rateName = state.rateName || rateSelect.value || null;
    const ratePerMin = Number(state.rate) ||
      (rateName ? (rates.find(r => r.name === rateName)?.amount || 0) : 0);

    const earned = calculateEarnings(elapsedMs, ratePerMin);

    const callData = normalizeCall({
      id: generateUUID(),
      startTime: new Date(state.start).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: elapsedMs,
      rate: ratePerMin,
      rateName: rateName,
      earnings: Number(earned.toFixed(2))
    });

    calls = readCallsFromStorage();
    calls.push(callData);
    saveCalls();

    clearActiveCallState();
    closeRecovery();
    showToast('Unfinished call summarized and saved.');
  };

  recoveryDiscardBtn.onclick = () => {
    clearActiveCallState();
    closeRecovery();
    showToast('Unfinished call discarded.');
  };
})();

        function syncTimesFromMinutes() {
  const minsMs = minutesToMs(callDurationMinutesInput.value);
  if (!minsMs) return;

  const start = parseOptionalDate(callStartTimeInput.value);
  const end = parseOptionalDate(callEndTimeInput.value);

  if (start && !end) {
    const computedEnd = new Date(start.getTime() + minsMs);
    callEndTimeInput.value = formatLocalDateTime(computedEnd.toISOString());
  } else if (!start && end) {
    const computedStart = new Date(end.getTime() - minsMs);
    callStartTimeInput.value = formatLocalDateTime(computedStart.toISOString());
  }
}

callDurationMinutesInput.addEventListener('input', syncTimesFromMinutes);
callStartTimeInput.addEventListener('input', syncTimesFromMinutes);
callEndTimeInput.addEventListener('input', syncTimesFromMinutes);
        
        showAddCycleBtn.addEventListener('click', addPaymentCycle);
        closeEditCycleModalBtn.addEventListener('click', closeEditCycleModal);
        cancelEditCycleBtn.addEventListener('click', closeEditCycleModal);
        editCycleForm.addEventListener('submit', handleEditCycleFormSubmit);

        darkToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }

        rateSelect.addEventListener('change', saveLastSelectedRate);
        showRateAddBtn.addEventListener('click', () => {
            rateForm.style.display = 'block';
            showRateAddBtn.style.display = 'none';
            document.getElementById('rate-name').focus();
        });
        cancelRateAddBtn.addEventListener('click', () => {
            rateForm.style.display = 'none';
            showRateAddBtn.style.display = 'block';
        });
        rateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rate-name').value;
            const amount = parseFloat(document.getElementById('rate-amount').value);

            if (!name || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid rate name and amount.');
                return;
            }

            if (rateForm.dataset.editingIndex) {
                const index = parseInt(rateForm.dataset.editingIndex);
                rates[index] = { name, amount };
                delete rateForm.dataset.editingIndex;
            } else {
                rates.push({ name, amount });
            }

            saveRates();
            rateForm.reset();
            rateForm.style.display = 'none';
            showRateAddBtn.style.display = 'block';
        });

        goalForm.addEventListener('submit', (e) => {

    e.preventDefault();

    syncGoalFields(lastGoalEditedField);

    saveDailyGoal();

    syncDailyGoalInputs();

    showToast('Daily goal saved!');

});

function syncGoalFields(fromField) {
  const selectedRateAmount = getSelectedRateAmount();

  let amount = parseFloat(goalAmountInput.value) || 0;
  let minutes = parseInt(goalMinutesInput.value, 10) || 0;

  if (selectedRateAmount > 0) {
    if (fromField === 'amount' && amount > 0) {
      minutes = Math.ceil(amount / selectedRateAmount);
      goalMinutesInput.value = minutes;
    } else if (fromField === 'minutes' && minutes > 0) {
      amount = Number((minutes * selectedRateAmount).toFixed(2));
      goalAmountInput.value = amount;
    }
  }

  dailyGoal.amount = amount;
  dailyGoal.minutes = minutes;
}

let lastGoalEditedField = 'amount';

goalAmountInput.addEventListener('input', () => {

    lastGoalEditedField = 'amount';

    syncGoalFields('amount');

    saveDailyGoal();

    syncDailyGoalInputs();

});

goalMinutesInput.addEventListener('input', () => {

    lastGoalEditedField = 'minutes';

    syncGoalFields('minutes');

    saveDailyGoal();

    syncDailyGoalInputs();

});
        
        statsDatePicker.addEventListener('change', () => {
            callLogFilter = 'date';
            updateStatistics();
            displayCalls();
            updateCallLogFilterButtons();
        });
        currentDateBtn.addEventListener('click', () => {
            const today = new Date().toISOString().split('T')[0];
            statsDatePicker.value = today;
            callLogFilter = 'today';
            updateStatistics();
            displayCalls();
            updateCallLogFilterButtons();
        });
        
        settingsToggleBtn.addEventListener('click', openSettingsModal);
        closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
        
        if (tzSelect) {
            tzSelect.addEventListener('change', () => {
                const tz = tzSelect.value;
                setUserTimeZone(tz);
                updateStatistics();
                displayCalls();
                updateLocalTime();
            });
        }

        if (resetTzBtn) {
            resetTzBtn.addEventListener('click', () => {
                if (tzSelect) tzSelect.value = '';
                setUserTimeZone('');
                updateStatistics();
                displayCalls();
                updateLocalTime();
            });
        }
        
        exportDataBtn.addEventListener('click', () => {
            const data = {
                calls: calls,
                rates: rates,
                dailyGoal: dailyGoal,
                paymentCyclesEnabled: paymentCyclesEnabled,
                paymentCycles: paymentCycles
            };
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `work-time-tracker-data-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Data exported successfully!');
        });
        
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (confirm('Importing data will overwrite your current data. Are you sure?')) {
                        calls = importedData.calls || [];
                        calls = calls.map(call => ({
  ...call,
  id: call.id || generateUUID()
}));
                        rates = importedData.rates || [];
                        dailyGoal = normalizeDailyGoal(importedData.dailyGoal);
                        paymentCyclesEnabled = importedData.paymentCyclesEnabled || false;
                        paymentCycles = importedData.paymentCycles || [];
                        saveRates();
                        saveCalls();
                        saveDailyGoal();
                        savePaymentCycles();
                        syncDailyGoalInputs();
                        populateRateSelects();
                        showToast('Data imported successfully!');
                        closeSettingsModal();
                    }
                } catch (error) {
                    alert('Failed to import file. Please ensure it is a valid JSON file from this app.');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        });

        resetCallsBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to erase all call history? This cannot be undone.")) {
                calls = [];
                saveCalls();
                showToast('All call history erased.');
            }
        });
        
        resetAllBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset all data, including rates, goals, and call history? This cannot be undone.")) {
                localStorage.clear();
                calls = [];
                rates = [];
                dailyGoal = { amount: 0, minutes: 0 };
                paymentCyclesEnabled = false;
                paymentCycles = [];
                saveRates();
                saveCalls();
                saveDailyGoal();
                savePaymentCycles();
                syncDailyGoalInputs();
                populateRateSelects();
                showToast('All data reset.');
                closeSettingsModal();
            }
        });
        
        paymentCyclesToggle.addEventListener('change', (e) => {
            paymentCyclesEnabled = e.target.checked;
            savePaymentCycles();
        });

        function handleModalKeyboard(e) {
            if (e.key === 'Escape') {
                if (callModal.style.display === 'flex') {
                    closeCallModal();
                }
                if (settingsModal.style.display === 'flex') {
                    closeSettingsModal();
                }
                if (editCycleModal.style.display === 'flex') {
                    closeEditCycleModal();
                }
                if (feedbackModal.style.display === 'flex') {
                    closeFeedbackModal();
                }
                if (changelogModal && changelogModal.style.display === 'flex') {
  closeChangelogModal();
}
            }
        }
        
        document.addEventListener('keydown', handleModalKeyboard);
        
        window.addEventListener('beforeunload', () => {
            activeTimers.forEach(timerId => clearInterval(timerId));
            activeTimers.clear();
        });

        document.getElementById('privacy-policy')?.addEventListener('click', () => {
            alert('Privacy Policy: This app stores all data locally in your browser. No data is sent to external servers.');
        });

        document.getElementById('terms-of-service')?.addEventListener('click', () => {
            alert('Terms of Service: This app is provided "as is" without any warranties. Use at your own discretion.');
        });
        
        document.getElementById('app-version').textContent = APP_VERSION;
        displayRates();
        populateRateSelects();
        populateTimeZones();
        updateLocalTime();
        displayCalls();
        syncDailyGoalInputs();
        updateStatistics();
        updateStorageInfo();
        renderPaymentCycles();
        setInterval(updateLocalTime, 1000);

        const today = new Date().toISOString().split('T')[0];
        statsDatePicker.value = today;
        
        filterTodayBtn.addEventListener('click', () => {
            callLogFilter = 'today';
            displayCalls();
            updateCallLogFilterButtons();
        });
        filterWeekBtn.addEventListener('click', () => {
            callLogFilter = 'week';
            displayCalls();
            updateCallLogFilterButtons();
        });
        filterMonthBtn.addEventListener('click', () => {
            callLogFilter = 'month';
            displayCalls();
            updateCallLogFilterButtons();
        });
        updateCallLogFilterButtons();
    });
