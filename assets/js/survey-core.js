/* Optional sync survey: the questions, the anonymous event names, and when to ask.
 *
 * Plain script (no modules), loaded before app.js. Pure logic only: it never reads or
 * writes storage, never touches the page and never sends anything. app.js does that
 * after checking the same "Share anonymous usage counts" switch as every other count.
 */

const SYNC_SURVEY_DEVICES = [
    { value: 'one', label: 'Just one device', hint: 'I only use the app in one place.' },
    { value: 'two', label: 'Two devices', hint: 'For example my phone and my computer.' },
    { value: 'three-plus', label: 'Three or more', hint: 'Several computers, phones or tablets.' }
];

const SYNC_SURVEY_OPTIONS = [
    { value: 'as-is', label: 'Keep it as it is', hint: 'Everything stays on my device. I move data with backups.', tags: ['Total privacy', 'No live sync'] },
    { value: 'direct', label: 'Direct connection between my devices', hint: 'I link them once with a QR code. They pass data straight to each other, no server in between.', tags: ['No account', 'Both devices must be open to sync'] },
    { value: 'account', label: 'An optional account', hint: 'My data is also stored online so every device stays up to date, even when one is off.', tags: ['Always in sync', 'Needs an email and an online service'] },
    { value: 'both', label: 'Both, and I choose', hint: 'Direct connection for free with no account, or an account if I want sync even when a device is off.', tags: ['Most flexible', 'More to build and maintain'] }
];

const SYNC_SURVEY_LATER_MS = 7 * 24 * 60 * 60 * 1000;

// Only the name of the chosen option is ever sent. Anything not on the lists is dropped.
function buildSyncSurveyEvents(answers) {
    const a = answers && typeof answers === 'object' ? answers : {};
    const events = [];
    if (SYNC_SURVEY_DEVICES.some((o) => o.value === a.devices)) events.push(`survey/devices/${a.devices}`);
    if (SYNC_SURVEY_OPTIONS.some((o) => o.value === a.sync)) events.push(`survey/sync/${a.sync}`);
    return events;
}

function normalizeSyncSurveyState(raw) {
    let parsed = raw;
    if (typeof raw === 'string') {
        try { parsed = JSON.parse(raw); } catch (error) { parsed = null; }
    }
    if (!parsed || typeof parsed !== 'object') return { status: 'new', at: 0 };
    const status = ['later', 'never', 'done'].includes(parsed.status) ? parsed.status : 'new';
    const at = Number.isFinite(Number(parsed.at)) ? Number(parsed.at) : 0;
    return { status, at };
}

function nextSyncSurveyState(action, nowMs) {
    const at = Number.isFinite(nowMs) ? nowMs : Date.now();
    if (action === 'later') return { status: 'later', at };
    if (action === 'never') return { status: 'never', at };
    if (action === 'done') return { status: 'done', at };
    return { status: 'new', at: 0 };
}

// The banner is only for people already using the app on the web with the counts switch on.
function shouldShowSyncSurvey(input) {
    const i = input && typeof input === 'object' ? input : {};
    if (i.isNative || !i.analyticsOn || i.callActive || i.modalOpen || i.otherBannerOpen) return false;
    if (!(Number(i.callCount) >= 1)) return false;
    const state = normalizeSyncSurveyState(i.state);
    if (state.status === 'never' || state.status === 'done') return false;
    if (state.status === 'later') {
        const now = Number.isFinite(i.nowMs) ? i.nowMs : Date.now();
        return now - state.at >= SYNC_SURVEY_LATER_MS;
    }
    return true;
}
