
    // ============================================
    // VERSION & CHANGELOG
    // ============================================
    const APP_VERSION = '1.1.26';
    const CHANGELOG = [
        { version: '1.1.26', date: '2026-02-26', changes: ['Added: Modal stack/layer manager with deterministic z-index ordering and front-of-stack resolution', 'Added: Viewport-fit constraints for open modals to reduce clipping on small/short windows', 'Improved: Interaction stability via rapid open/close guards and deduplicated keyboard handling', 'Improved: Accessibility/status feedback (toast live region + confirmation busy/aria-live handling)', 'Improved: Floating settings UX consistency (detail entry guard + auto-close when feature disabled)'] },
        { version: '1.1.25', date: '2026-02-26', changes: ['Fixed: Feature detail panels now open directly next to General Settings using deterministic split geometry', 'Fixed: Floating Controls Settings button now hides when Floating Call Controls feature toggle is off', 'Improved: Split-panel positioning no longer depends on transition-timing-sensitive measurements'] },
        { version: '1.1.24', date: '2026-02-26', changes: ['Changed: Removed Notes Settings sub-modal to simplify Settings UX (Notes keeps a single feature toggle)', 'Refactor: Cleaned Notes Settings modal/event wiring from split-settings flow', 'Roadmap: Added advanced Notes customization ideas to future backlog'] },
        { version: '1.1.23', date: '2026-02-26', changes: ['Fixed: Side settings panels now align vertically with the General Settings panel instead of using a fixed top offset', 'Improved: Detail panel layout now derives left/top/width from the actual General panel geometry for more stable split positioning', 'Improved: Split modal positioning fallback remains safe on small/edge layouts'] },
        { version: '1.1.22', date: '2026-02-26', changes: ['Fixed: Side feature modals now anchor to viewport top with max-height so they never open cut off at the bottom', 'Fixed: Side modal content remains scrollable within viewport in split settings mode', 'Improved: Side modal open animation updated to match top-anchored layout without vertical jump'] },
        { version: '1.1.21', date: '2026-02-26', changes: ['Polish: Modals now open from the click origin for smoother visual context', 'Polish: Side settings panels are pre-positioned before opening to remove first-open overlap/jump', 'Polish: Unified motion easing/timings for modal and floating-dock interactions to feel less abrupt'] },
        { version: '1.1.20', date: '2026-02-26', changes: ['Performance: Reduced UI jitter by scheduling floating-dock/side-panel updates with requestAnimationFrame', 'Performance: Replaced repeated per-row click bindings with delegated handlers for calls/rates/payment cycles', 'Performance: Cached local-time formatters and throttled live-call persistence writes to reduce main-thread pressure'] },
        { version: '1.1.19', date: '2026-02-26', changes: ['Fixed: First-open detail panel overlap by switching to deterministic split geometry (no animation-dependent placement)', 'Improved: Detail settings now animate from the clicked trigger area for smoother context-aware opening', 'Improved: Split mode now pre-activates before opening detail panels to prevent center-jump behavior'] },
        { version: '1.1.18', date: '2026-02-26', changes: ['Fixed: Split-state activation now happens after detail modal opens, so General panel consistently shifts out of center', 'Fixed: Side detail modals no longer apply blur over the General Settings panel', 'Improved: Split-state detection now accepts opening transition state for smoother panel handoff'] },
        { version: '1.1.17', date: '2026-02-26', changes: ['Fixed: Settings split-view now uses geometry-based anchoring so detail panel opens exactly to the right of General', 'Improved: Right-panel placement recalculates after open and on resize for stable side-by-side visibility', 'Improved: Split-view class handling now relies on active anchored detail panels for consistency'] },
        { version: '1.1.16', date: '2026-02-26', changes: ['Fixed: Split settings now uses strict left/right docking instead of overlap-style positioning', 'Improved: Detail settings panels open adjacent to General Settings with consistent centered vertical alignment', 'Fixed: Side-panel animation now preserves vertical centering while sliding in'] },
        { version: '1.1.15', date: '2026-02-26', changes: ['Fixed: Preview in icon mode now mirrors the real dock detail-card behavior (when active fields are enabled)', 'Fixed: Removed old preview meta-row rendering so preview matches actual layout exactly', 'Improved: Split-view positioning now anchors detail panels directly to the right of General Settings'] },
        { version: '1.1.14', date: '2026-02-26', changes: ['Fixed: In icon mode, real floating dock can now display active-call details (rate/timer/earnings) when enabled', 'Improved: General Settings now shifts left and keeps visible while detail settings open on the right (split-view layout)', 'Improved: Split-view spacing and panel sizing to reduce overlap and improve readability'] },
        { version: '1.1.13', date: '2026-02-26', changes: ['Fixed: Preview now always shows live-call sample values (rate/timer/earnings) even in icon mode via sample info rows', 'Improved: Floating preview now auto-randomizes while open, no manual click required', 'Improved: Opening feature settings from General now supports smooth split-view (General shifts left, selected panel on right) on large screens', 'Improved: Floating Controls panel open feels faster with deferred preview rendering'] },
        { version: '1.1.12', date: '2026-02-26', changes: ['Changed: Removed Floating density preset control to keep customization fully manual', 'Improved: Floating mini preview now randomizes realistic live-call sample data (rate/timer/earnings)', 'Improved: Preview alignment and icon-mode button centering for closer visual parity with real dock', 'Improved: Floating settings labels now include clearer helper text for easier understanding'] },
        { version: '1.1.11', date: '2026-02-26', changes: ['Fixed: Floating Controls Settings modal now opens above the main Settings modal', 'Improved: Floating Controls Settings layout is more compact and visually refined', 'Improved: Mini preview now renders Idle and On-Call states together with preference-aware detail hints', 'Changed: User-facing text in Settings was standardized to English'] },
        { version: '1.1.10', date: '2026-02-25', changes: ['Changed: Data Management + Storage Usage moved to main Settings under Time Zone', 'Fixed: Floating Controls Settings button now opens reliably (even if feature is currently off)', 'Improved: Floating dock now scales correctly in compact/icon modes', 'Improved: Floating preview now shows both idle and active-call states with detailed rate/timer/earnings visibility'] },
        { version: '1.1.9', date: '2026-02-25', changes: ['Changed: Restored classic always-visible footer on main page (removed footer info floating modal)', 'Fixed: Footer content is now permanently visible at page bottom as requested', 'Refactor: Removed temporary footer-modal wiring from settings flow'] },
        { version: '1.1.8', date: '2026-02-24', changes: ['Fixed: Restored main-page layout by correcting modal/footer structure boundaries', 'Changed: Footer content moved into centered floating info modal while preserving existing style/content', 'Changed: Settings simplified to General-first flow (no tab segmentation for current scope)', 'Added: Per-feature customization entry points from General (Notes, Payment Cycles, Floating)', 'Improved: Payment Cycles modal now groups cycles + data management + storage in one dedicated place'] },
        { version: '1.1.7', date: '2026-02-23', changes: ['Added: Settings Control Center tabs + quick search for lower-clutter navigation', 'Added: Floating density presets (Minimal, Balanced, Data-rich, Custom)', 'Added: Testing-focused mini live preview inside Floating Controls modal (easy to disable/remove independently)', 'Improved: Sticky modal header/footer behavior for frictionless split-screen usage'] },
        { version: '1.1.6', date: '2026-02-22', changes: ['Improved: Settings modal reorganized into clearer section cards with wider centered layout', 'Fixed: Removed forced auto-scroll to Time Zone that caused jumpy/cluttered behavior in compact windows', 'Improved: Settings and floating-customization modals now use cleaner internal scrolling with sticky action area'] },
        { version: '1.1.5', date: '2026-02-20', changes: ['Fixed: Settings modal now supports reliable internal scrolling on constrained/split-screen layouts', 'Added: Floating controls customization moved into a dedicated centered modal for better organization', 'Fixed: Floating mini button no longer inherits icon-mode sizing rules incorrectly (prevents deformed mini state)', 'Improved: Floating dock now adapts action density by size mode (icon mode hides secondary/active card automatically)', 'Improved: Settings customization section spacing/readability for dense feature controls'] },
        { version: '1.1.4', date: '2026-02-20', changes: ['Added: Smart floating dock with contextual primary/secondary actions', 'Added: Auto-hide idle dock with mini-button reactivation animation', 'Added: Mini active-call card with per-field customization (timer/earnings/rate)', 'Added: One-handed mode option for larger mobile touch targets', 'Added: Go to Controls secondary action with smooth scroll', 'Improved: Dock overlap-avoidance engine (footer/toasts/focused input) and adaptive split-screen behavior'] },
        { version: '1.1.3', date: '2026-02-20', changes: ['Added: Floating controls customization panel in Settings (visible only when feature is enabled)', 'Added: Floating controls size modes (Auto, Full, Compact, Icon Only)', 'Added: Floating controls side positioning (Left/Right)', 'Improved: Auto mode now adapts to split-screen widths and switches to icon-only in ultra-compact windows'] },
        { version: '1.1.2', date: '2026-02-20', changes: ['Added: Optional floating Start/End Call controls that appear when Call Controls section is out of view', 'Added: Settings feature toggle for Floating Call Controls', 'Improved: Floating controls follow active call state and hide when modals are open', 'Improved: Floating controls share the same visual style and behavior as primary Start/End buttons'] },
        { version: '1.1.1', date: '2026-02-20', changes: ['Added: Confirmation modal optional typed guard (e.g., requires typing RESET for destructive actions)', 'Added: Confirmation modal loading/success status states with action lock to prevent accidental double submits', 'Added: Body scroll lock while modals are open for better mobile UX', 'Improved: Confirmation copy clarity and status feedback for keyboard/screen-reader users', 'Docs: Added 1.1.x modal QA checklist and progress updates in roadmap/readme'] },
        { version: '1.1.0', date: '2026-02-20', changes: ['Added: ModalManager for consistent open/close behavior across all app modals', 'Added: Focus trap + focus restore for keyboard accessibility in modals', 'Added: Click-outside policy by modal type (non-destructive only)', 'Added: ARIA dialog semantics wiring for modal accessibility', 'Added: Severity-based confirmation/alert presentation templates (info/warning/error/danger)', 'Added: Confirm-action lock to prevent accidental double submits', 'Added: Consistent modal transition animations and focus-visible states'] },
        { version: '1.0.11', date: '2026-02-20', changes: ['Fixed: Add Rate now always opens in clean create mode (no stale edit state)', 'Fixed: Cancel/Add flow now clears rate form editingIndex to prevent accidental overwrites', 'Improved: Rate save path now checks explicit edit-mode state before updating existing rates'] },
        { version: '1.0.10', date: '2026-02-20', changes: ['Added: Unified in-app modal UX for confirmations and validation/errors (replaces browser alert/confirm in core flows)', 'Improved: Add/Edit Call validation now uses internal modal messaging', 'Improved: Import/Reset/Delete actions now use the same confirmation modal style'] },
        { version: '1.0.9', date: '2026-02-19', changes: ['Added: Confirmation modal for deleting calls instead of browser confirm()', 'Added: ESC key closes any open modal', 'Added: Fallback display when rate no longer exists (shows "Rate removed")', 'Added: Privacy notice next to Notes toggle ("never saved or exported")', 'Added: Restore Payment Cycles from backup button in Settings', 'Improved: Data integrity when deleting calls with confirmation'] },
        { version: '1.0.8', date: '2026-02-19', changes: ['Fix: Initialization ordering and DOM null-checks to prevent startup errors', 'Fix: Preserve and backup Payment Cycles to avoid accidental data loss', 'Fix: Prevent overwriting stored payment cycles with empty arrays', 'Fix: Various syntax and runtime errors found during debugging', 'Privacy: Notes UI is now volatile (not persisted) and removed from exports by default'] },
        { version: '1.0.7', date: '2026-02-19', changes: ['Added: Notes UI when starting a live call and in call form (no persistent storage)', 'Added: Notes column to Call Log (UI-only)', 'Improved: Date filtering ranges now use explicit end bounds'] },
        { version: '1.0.6', date: '2026-02-12', changes: ['Added: Previous/Next day arrows next to stats date picker', 'Added: Arrow navigation now switches to Custom Date view automatically', 'Added: Next-day navigation is blocked for future dates'] },
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
  ModalManager.open(changelogModal);
}

function createRafScheduler(fn) {
  let rafId = null;
  return () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      fn();
    });
  };
}

function closeChangelogModal() {
  ModalManager.close(changelogModal);
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
    const floatingCallControls = document.getElementById('floating-call-controls');
    const floatingCallDock = document.getElementById('floating-call-dock');
    const floatingDockMiniBtn = document.getElementById('floating-dock-mini-btn');
    const floatingDockMiniIcon = document.getElementById('floating-dock-mini-icon');
    const floatingStartCallBtn = document.getElementById('floating-start-call-btn');
    const floatingEndCallBtn = document.getElementById('floating-end-call-btn');
    const floatingSecondaryActionBtn = document.getElementById('floating-secondary-action-btn');
    const floatingSecondaryActionIcon = document.getElementById('floating-secondary-action-icon');
    const floatingSecondaryActionLabel = document.getElementById('floating-secondary-action-label');
    const floatingActiveCard = document.getElementById('floating-active-card');
    const floatingActiveRate = document.getElementById('floating-active-rate');
    const floatingActiveTimer = document.getElementById('floating-active-timer');
    const floatingActiveEarnings = document.getElementById('floating-active-earnings');
    const callControlsCard = document.getElementById('call-controls-card');
    const liveCallInfo = document.getElementById('live-call-info');
    const liveCallTimerDisplay = document.getElementById('live-call-timer');
    const liveCallEarningsDisplay = document.getElementById('live-call-earnings');
    const liveCallNotesInput = document.getElementById('live-call-notes');
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
    const callNotesInput = document.getElementById('call-notes');
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
    const statsPrevDayBtn = document.getElementById('stats-prev-day-btn');
    const statsNextDayBtn = document.getElementById('stats-next-day-btn');
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
    const paymentCyclesSection = document.getElementById('payment-cycles-section');
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

// Feature toggles (optional features section)
const featureNotesToggle = document.getElementById('feature-notes-toggle');
const featurePaymentCyclesToggle = document.getElementById('feature-payment-cycles-toggle');
const featureFloatingControlsToggle = document.getElementById('feature-floating-controls-toggle');
const openFloatingControlsSettingsBtn = document.getElementById('open-floating-controls-settings-btn');
const openPaymentCyclesSettingsBtn = document.getElementById('open-payment-cycles-settings-btn');
const floatingControlsSettingsModal = document.getElementById('floating-controls-settings-modal');
const closeFloatingControlsSettingsBtn = document.getElementById('close-floating-controls-settings-modal');
const doneFloatingControlsSettingsBtn = document.getElementById('done-floating-controls-settings-btn');
const paymentCyclesSettingsModal = document.getElementById('payment-cycles-settings-modal');
const closePaymentCyclesSettingsModalBtn = document.getElementById('close-payment-cycles-settings-modal');
const donePaymentCyclesSettingsBtn = document.getElementById('done-payment-cycles-settings-btn');
const floatingControlsCustomization = document.getElementById('floating-controls-customization');
const floatingControlsSizeModeSelect = document.getElementById('floating-controls-size-mode');
const floatingControlsSideSelect = document.getElementById('floating-controls-side');
const floatingSecondaryActionSelect = document.getElementById('floating-secondary-action-select');
const floatingShowActiveCardToggle = document.getElementById('floating-show-active-card-toggle');
const floatingActiveCardCustomization = document.getElementById('floating-active-card-customization');
const floatingActiveShowTimerToggle = document.getElementById('floating-active-show-timer-toggle');
const floatingActiveShowEarningsToggle = document.getElementById('floating-active-show-earnings-toggle');
const floatingActiveShowRateToggle = document.getElementById('floating-active-show-rate-toggle');
const floatingOneHandedToggle = document.getElementById('floating-one-handed-toggle');
const floatingPreviewEnabledToggle = document.getElementById('floating-preview-enabled-toggle');
const floatingPreviewRandomizeBtn = document.getElementById('floating-preview-randomize-btn');
const floatingPreviewContainer = document.getElementById('floating-preview-lab');
const floatingPreviewHint = document.getElementById('floating-preview-hint');
const floatingFeatureStateNote = document.getElementById('floating-feature-state-note');
const previewFloatingDocks = Array.from(document.querySelectorAll('[data-preview-state]'));

const ENABLE_FLOATING_PREVIEW_TESTING = true;
let floatingPreviewSample = null;
let floatingPreviewAutoRefreshTimer = null;

function loadFeatureFlags() {
    try {
        const raw = localStorage.getItem('featureFlags');
        if (!raw) return {
            notes: true,
            paymentCycles: paymentCyclesEnabled,
            floatingCallControls: true,
            floatingControlsSizeMode: 'auto',
            floatingControlsSide: 'right',
            floatingSecondaryAction: 'add',
            floatingShowActiveCard: true,
            floatingActiveShowTimer: true,
            floatingActiveShowEarnings: true,
            floatingActiveShowRate: false,
            floatingOneHanded: false,
            floatingPreviewEnabled: true
        };
        const parsed = JSON.parse(raw);
        return {
            notes: typeof parsed.notes === 'boolean' ? parsed.notes : true,
            paymentCycles: typeof parsed.paymentCycles === 'boolean' ? parsed.paymentCycles : paymentCyclesEnabled,
            floatingCallControls: typeof parsed.floatingCallControls === 'boolean' ? parsed.floatingCallControls : true,
            floatingControlsSizeMode: ['auto', 'full', 'compact', 'icon'].includes(parsed.floatingControlsSizeMode) ? parsed.floatingControlsSizeMode : 'auto',
            floatingControlsSide: parsed.floatingControlsSide === 'left' ? 'left' : 'right',
            floatingSecondaryAction: ['add', 'goto', 'none'].includes(parsed.floatingSecondaryAction) ? parsed.floatingSecondaryAction : 'add',
            floatingShowActiveCard: typeof parsed.floatingShowActiveCard === 'boolean' ? parsed.floatingShowActiveCard : true,
            floatingActiveShowTimer: typeof parsed.floatingActiveShowTimer === 'boolean' ? parsed.floatingActiveShowTimer : true,
            floatingActiveShowEarnings: typeof parsed.floatingActiveShowEarnings === 'boolean' ? parsed.floatingActiveShowEarnings : true,
            floatingActiveShowRate: typeof parsed.floatingActiveShowRate === 'boolean' ? parsed.floatingActiveShowRate : false,
            floatingOneHanded: typeof parsed.floatingOneHanded === 'boolean' ? parsed.floatingOneHanded : false,
            floatingPreviewEnabled: typeof parsed.floatingPreviewEnabled === 'boolean' ? parsed.floatingPreviewEnabled : true
        };
    } catch (e) {
        return {
            notes: true,
            paymentCycles: paymentCyclesEnabled,
            floatingCallControls: true,
            floatingControlsSizeMode: 'auto',
            floatingControlsSide: 'right',
            floatingSecondaryAction: 'add',
            floatingShowActiveCard: true,
            floatingActiveShowTimer: true,
            floatingActiveShowEarnings: true,
            floatingActiveShowRate: false,
            floatingOneHanded: false,
            floatingPreviewEnabled: true
        };
    }
}

function saveFeatureFlags(flags) {
    try {
        localStorage.setItem('featureFlags', JSON.stringify(flags));
    } catch (e) {
        console.warn('Could not save feature flags', e);
    }
}

function getFloatingPreviewSecondaryMeta(action) {
    if (action === 'goto') return { icon: 'fas fa-arrow-up', label: 'Go to Controls' };
    if (action === 'none') return { icon: 'fas fa-minus', label: 'Disabled' };
    return { icon: 'fas fa-plus', label: 'Add Call' };
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

function formatPreviewElapsed(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

function generateFloatingPreviewSample() {
    const labelPool = ['Medical EN-ES', 'Legal EN-PT', 'Insurance EN-ES', 'Support EN-FR', 'Telehealth EN-ES'];
    const rate = Number((Math.random() * 0.22 + 0.06).toFixed(2));
    const seconds = randomInt(95, 4400);
    const earnings = Number((((seconds / 60) * rate) + Math.random() * 0.22).toFixed(2));
    return {
        rateLabel: randomChoice(labelPool),
        ratePerMin: rate,
        elapsedSeconds: seconds,
        earnings
    };
}

function updatePreviewDockElement(dockEl, flags, mode) {
    if (!dockEl) return;

    const state = dockEl.dataset.previewState === 'active' ? 'active' : 'idle';
    const onCall = state === 'active';

    dockEl.classList.remove('preview-mode-full', 'preview-mode-compact', 'preview-mode-icon');
    dockEl.classList.add(mode === 'icon' ? 'preview-mode-icon' : mode === 'compact' ? 'preview-mode-compact' : 'preview-mode-full');
    dockEl.classList.toggle('preview-left', (flags.floatingControlsSide || 'right') === 'left');
    dockEl.classList.toggle('preview-right', (flags.floatingControlsSide || 'right') !== 'left');
    dockEl.classList.toggle('preview-one-handed', !!flags.floatingOneHanded);

    const primaryBtn = dockEl.querySelector('.preview-primary-btn');
    const primaryIcon = dockEl.querySelector('.preview-primary-icon');
    const primaryLabel = dockEl.querySelector('.preview-primary-label');
    if (primaryIcon) primaryIcon.className = onCall ? 'preview-primary-icon fas fa-stop' : 'preview-primary-icon fas fa-play';
    if (primaryLabel) primaryLabel.textContent = onCall ? 'End Call' : 'Start Call';
    if (primaryBtn) {
        primaryBtn.classList.toggle('bg-green-500', !onCall);
        primaryBtn.classList.toggle('hover:bg-green-600', !onCall);
        primaryBtn.classList.toggle('bg-red-500', onCall);
        primaryBtn.classList.toggle('hover:bg-red-600', onCall);
    }

    const secondaryAction = flags.floatingSecondaryAction || 'add';
    const secondaryMeta = getFloatingPreviewSecondaryMeta(secondaryAction);
    const secondaryBtn = dockEl.querySelector('.preview-secondary-btn');
    const secondaryIcon = dockEl.querySelector('.preview-secondary-icon');
    const secondaryLabel = dockEl.querySelector('.preview-secondary-label');
    const showSecondary = secondaryAction !== 'none' && mode !== 'icon';
    if (secondaryBtn) secondaryBtn.style.display = showSecondary ? 'flex' : 'none';
    if (secondaryIcon) secondaryIcon.className = `preview-secondary-icon ${secondaryMeta.icon}`;
    if (secondaryLabel) secondaryLabel.textContent = secondaryMeta.label;

    const activeCard = dockEl.querySelector('.preview-active-card');
    const iconDetailsEnabled = mode === 'icon'
        && onCall
        && !!flags.floatingShowActiveCard
        && (!!flags.floatingActiveShowTimer || !!flags.floatingActiveShowEarnings || !!flags.floatingActiveShowRate);
    dockEl.classList.toggle('preview-show-icon-details', iconDetailsEnabled);
    const showCard = !!flags.floatingShowActiveCard && onCall && mode !== 'icon';
    if (activeCard) activeCard.style.display = (showCard || iconDetailsEnabled) ? '' : 'none';

    const activeTimer = dockEl.querySelector('.preview-active-timer');
    const activeEarnings = dockEl.querySelector('.preview-active-earnings');
    const activeRate = dockEl.querySelector('.preview-active-rate');
    if (activeTimer) activeTimer.style.display = flags.floatingActiveShowTimer ? '' : 'none';
    if (activeEarnings) activeEarnings.style.display = flags.floatingActiveShowEarnings ? '' : 'none';
    if (activeRate) activeRate.style.display = flags.floatingActiveShowRate ? '' : 'none';

    const sample = floatingPreviewSample || generateFloatingPreviewSample();
    if (activeRate) activeRate.textContent = `Rate: ${sample.rateLabel} - $${sample.ratePerMin.toFixed(2)}/min`;
    if (activeTimer) activeTimer.textContent = onCall ? formatPreviewElapsed(sample.elapsedSeconds) : '00:00:00';
    if (activeEarnings) activeEarnings.textContent = onCall ? `$${sample.earnings.toFixed(2)}` : '$0.00';
}

function updateFloatingPreview(flags = featureFlags, options = {}) {
    if (!ENABLE_FLOATING_PREVIEW_TESTING || !floatingPreviewContainer || !previewFloatingDocks.length) return;
    const shouldRandomize = options.randomize !== false;

    const previewEnabled = !!flags.floatingPreviewEnabled;
    floatingPreviewContainer.style.display = previewEnabled ? '' : 'none';
    if (!previewEnabled) return;

    if (shouldRandomize || !floatingPreviewSample) {
        floatingPreviewSample = generateFloatingPreviewSample();
    }

    const mode = resolveDockMode(flags.floatingControlsSizeMode || 'auto');
    previewFloatingDocks.forEach((dockEl) => updatePreviewDockElement(dockEl, flags, mode));

    if (floatingPreviewHint) {
        const visibleFields = [];
        if (flags.floatingActiveShowRate) visibleFields.push('rate');
        if (flags.floatingActiveShowTimer) visibleFields.push('timer');
        if (flags.floatingActiveShowEarnings) visibleFields.push('earnings');
        const fieldsText = visibleFields.length ? visibleFields.join(', ') : 'none';
        const secondaryText = (flags.floatingSecondaryAction || 'add') === 'none' ? 'hidden' : (flags.floatingSecondaryAction || 'add');
        floatingPreviewHint.textContent = `Preview: size ${mode} | secondary ${secondaryText} | active fields ${fieldsText}`;
    }
}

function stopFloatingPreviewAutoRefresh() {
    if (floatingPreviewAutoRefreshTimer) {
        clearInterval(floatingPreviewAutoRefreshTimer);
        floatingPreviewAutoRefreshTimer = null;
    }
}

function startFloatingPreviewAutoRefresh(flags = featureFlags) {
    stopFloatingPreviewAutoRefresh();
    if (!ENABLE_FLOATING_PREVIEW_TESTING || !flags.floatingPreviewEnabled) return;
    floatingPreviewAutoRefreshTimer = setInterval(() => {
        if (!floatingControlsSettingsModal || !ModalManager.isOpen(floatingControlsSettingsModal)) {
            stopFloatingPreviewAutoRefresh();
            return;
        }
        updateFloatingPreview(flags, { randomize: true });
    }, 5000);
}

function detailModals() {
    return [floatingControlsSettingsModal, paymentCyclesSettingsModal].filter(Boolean);
}

function getSettingsMainPanel() {
    return settingsModal?.querySelector('.settings-main-modal-panel') || null;
}

function computeDetailPanelLayout() {
    const gap = 16;
    const margin = 16;
    const minWidth = 360;
    const maxWidth = 860;
    const leftPanelWidth = Math.min(window.innerWidth * 0.40, 560);
    const left = Math.max(margin, Math.round(margin + leftPanelWidth + gap));
    const width = Math.max(minWidth, Math.min(maxWidth, window.innerWidth - left - margin));

    const mainPanel = getSettingsMainPanel();
    const mainRect = mainPanel ? mainPanel.getBoundingClientRect() : null;
    const top = (mainRect && Number.isFinite(mainRect.top))
        ? Math.max(margin, Math.round(mainRect.top))
        : margin;

    return { left, top, width };
}

function positionDetailModal(modalEl) {
    if (!modalEl) return;
    const layout = computeDetailPanelLayout();
    if (!layout) return;
    modalEl.style.setProperty('--settings-detail-left', `${layout.left}px`);
    modalEl.style.setProperty('--settings-detail-top', `${layout.top}px`);
    modalEl.style.setProperty('--settings-detail-width', `${layout.width}px`);
}

function setDetailPanelOrigin(modalEl, triggerEl) {
    if (!modalEl || !triggerEl) return;
    const panel = modalEl.querySelector('.modal');
    if (!panel) return;
    const panelRect = panel.getBoundingClientRect();
    const triggerRect = triggerEl.getBoundingClientRect();
    const originX = Math.max(20, Math.min(panelRect.width - 20, (triggerRect.left + triggerRect.width / 2) - panelRect.left));
    const originY = Math.max(20, Math.min(panelRect.height - 20, (triggerRect.top + triggerRect.height / 2) - panelRect.top));
    panel.style.setProperty('--settings-origin-x', `${originX}px`);
    panel.style.setProperty('--settings-origin-y', `${originY}px`);
}

function closeOtherDetailModals(exceptModal = null) {
    detailModals().forEach((modalEl) => {
        if (!modalEl || modalEl === exceptModal) return;
        if (ModalManager.isOpen(modalEl)) {
            ModalManager.close(modalEl);
            if (modalEl === floatingControlsSettingsModal && openFloatingControlsSettingsBtn) {
                openFloatingControlsSettingsBtn.setAttribute('aria-expanded', 'false');
            }
            if (modalEl === paymentCyclesSettingsModal && openPaymentCyclesSettingsBtn) {
                openPaymentCyclesSettingsBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

function updateSettingsSplitState() {
    if (!settingsModal) return;
    const anySideOpen = detailModals().some((modalEl) => modalEl
        && modalEl.classList.contains('settings-side-modal-anchored')
        && (ModalManager.isOpen(modalEl) || modalEl.classList.contains('is-open')));
    settingsModal.classList.toggle('settings-split-active', anySideOpen);
}

function applyDetailModalPresentation(modalEl) {
    if (!modalEl || !settingsModal) return;
    const canSplit = ModalManager.isOpen(settingsModal) && window.innerWidth > 1100;
    modalEl.classList.toggle('settings-side-modal', canSplit);
    modalEl.classList.toggle('settings-side-modal-anchored', canSplit);
    if (!canSplit) {
        modalEl.style.removeProperty('--settings-detail-left');
        modalEl.style.removeProperty('--settings-detail-top');
        modalEl.style.removeProperty('--settings-detail-width');
    }
    updateSettingsSplitState();
}

function clearDetailModalPresentation(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('settings-side-modal');
    modalEl.classList.remove('settings-side-modal-anchored');
    modalEl.style.removeProperty('--settings-detail-left');
    modalEl.style.removeProperty('--settings-detail-top');
    modalEl.style.removeProperty('--settings-detail-width');
    const panel = modalEl.querySelector('.modal');
    if (panel) {
        panel.style.removeProperty('--settings-origin-x');
        panel.style.removeProperty('--settings-origin-y');
    }
    updateSettingsSplitState();
}

function applyFeatureFlags(flags) {
    // Notes feature
    const notesEnabled = !!flags.notes;
    if (liveCallNotesInput) liveCallNotesInput.style.display = notesEnabled ? '' : 'none';
    if (callNotesInput) callNotesInput.style.display = notesEnabled ? '' : 'none';
    // hide associated label for modal notes
    const callNotesLabel = document.querySelector('label[for="call-notes"]');
    if (callNotesLabel) callNotesLabel.style.display = notesEnabled ? '' : 'none';
    // toggle notes column cells and header
    document.querySelectorAll('.notes-column').forEach(el => el.style.display = notesEnabled ? '' : 'none');

    // Payment cycles feature
    const pcEnabled = !!flags.paymentCycles;
    // update runtime flag
    paymentCyclesEnabled = pcEnabled;
    // show/hide entire section (header + config)
    if (paymentCyclesSection) {
        paymentCyclesSection.style.display = pcEnabled ? '' : 'none';
    }
    // show/hide config (kept for backward compatibility)
    if (paymentCyclesConfig) {
        if (pcEnabled) paymentCyclesConfig.classList.remove('hidden'); else paymentCyclesConfig.classList.add('hidden');
    }
    // keep main paymentCyclesToggle in sync if it exists
    if (typeof paymentCyclesToggle !== 'undefined' && paymentCyclesToggle) {
        paymentCyclesToggle.checked = pcEnabled;
    }

    // Floating call controls feature
    if (openFloatingControlsSettingsBtn) {
        openFloatingControlsSettingsBtn.style.display = flags.floatingCallControls ? '' : 'none';
        openFloatingControlsSettingsBtn.setAttribute('aria-expanded', (floatingControlsSettingsModal && ModalManager.isOpen(floatingControlsSettingsModal)) ? 'true' : 'false');
    }
    if (openPaymentCyclesSettingsBtn) {
        openPaymentCyclesSettingsBtn.style.display = flags.paymentCycles ? '' : 'none';
        openPaymentCyclesSettingsBtn.setAttribute('aria-expanded', (paymentCyclesSettingsModal && ModalManager.isOpen(paymentCyclesSettingsModal)) ? 'true' : 'false');
    }
    if (!flags.paymentCycles && paymentCyclesSettingsModal && ModalManager.isOpen(paymentCyclesSettingsModal)) {
        ModalManager.close(paymentCyclesSettingsModal);
        clearDetailModalPresentation(paymentCyclesSettingsModal);
    }
    if (!flags.floatingCallControls && floatingControlsSettingsModal && ModalManager.isOpen(floatingControlsSettingsModal)) {
        closeFloatingControlsSettingsModal();
    }
    if (floatingActiveCardCustomization) {
        floatingActiveCardCustomization.style.display = flags.floatingShowActiveCard ? '' : 'none';
    }
    if (floatingControlsSizeModeSelect) {
        floatingControlsSizeModeSelect.value = flags.floatingControlsSizeMode || 'auto';
    }
    if (floatingControlsSideSelect) {
        floatingControlsSideSelect.value = flags.floatingControlsSide || 'right';
    }
    if (floatingSecondaryActionSelect) {
        floatingSecondaryActionSelect.value = flags.floatingSecondaryAction || 'add';
    }
    if (floatingShowActiveCardToggle) {
        floatingShowActiveCardToggle.checked = !!flags.floatingShowActiveCard;
    }
    if (floatingActiveShowTimerToggle) {
        floatingActiveShowTimerToggle.checked = !!flags.floatingActiveShowTimer;
    }
    if (floatingActiveShowEarningsToggle) {
        floatingActiveShowEarningsToggle.checked = !!flags.floatingActiveShowEarnings;
    }
    if (floatingActiveShowRateToggle) {
        floatingActiveShowRateToggle.checked = !!flags.floatingActiveShowRate;
    }
    if (floatingOneHandedToggle) {
        floatingOneHandedToggle.checked = !!flags.floatingOneHanded;
    }
    if (floatingPreviewEnabledToggle) {
        floatingPreviewEnabledToggle.checked = ENABLE_FLOATING_PREVIEW_TESTING && !!flags.floatingPreviewEnabled;
        floatingPreviewEnabledToggle.disabled = !ENABLE_FLOATING_PREVIEW_TESTING;
    }
    if (floatingFeatureStateNote) {
        floatingFeatureStateNote.style.display = flags.floatingCallControls ? 'none' : '';
    }
    if (!ENABLE_FLOATING_PREVIEW_TESTING && floatingPreviewContainer) {
        floatingPreviewContainer.style.display = 'none';
    }
    updateFloatingPreview(flags);
    updateFloatingCallControls(flags);
}

// initialize feature flags (will be applied on DOMContentLoaded too)
// don't call loadFeatureFlags() at module-eval time because it may
// reference `paymentCyclesEnabled` which is initialized later.
let featureFlags = {
    notes: true,
    paymentCycles: false,
    floatingCallControls: true,
    floatingControlsSizeMode: 'auto',
    floatingControlsSide: 'right',
    floatingSecondaryAction: 'add',
    floatingShowActiveCard: true,
    floatingActiveShowTimer: true,
    floatingActiveShowEarnings: true,
    floatingActiveShowRate: false,
    floatingOneHanded: false,
    floatingPreviewEnabled: true
};

    // Recovery modal (v1.0.5)
const recoveryModal = document.getElementById('recovery-modal');
const recoveryRateName = document.getElementById('recovery-rate-name');
const recoveryElapsed = document.getElementById('recovery-elapsed');
const recoveryNotes = document.getElementById('recovery-notes');
const recoveryResumeBtn = document.getElementById('recovery-resume-btn');
const recoverySummarizeBtn = document.getElementById('recovery-summarize-btn');
const recoveryDiscardBtn = document.getElementById('recovery-discard-btn');

function closeRecoveryModal() {
    ModalManager.close(recoveryModal);
}
    
    // Confirmation modal (v1.1.x)
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationModalTitle = document.getElementById('confirmation-modal-title');
const confirmationModalMessage = document.getElementById('confirmation-modal-message');
const confirmationConfirmBtn = document.getElementById('confirmation-confirm-btn');
const confirmationCancelBtn = document.getElementById('confirmation-cancel-btn');
const confirmationCloseBtn = document.getElementById('confirmation-close-btn');
const confirmationVerifyGroup = document.getElementById('confirmation-verify-group');
const confirmationVerifyLabel = document.getElementById('confirmation-verify-label');
const confirmationVerifyInput = document.getElementById('confirmation-verify-input');
const confirmationModalStatus = document.getElementById('confirmation-modal-status');
let pendingConfirmAction = null; // callback to execute if user confirms
let isConfirmActionRunning = false;
let pendingConfirmOptions = {};

    // Season 1.1.x: centralized modal behavior manager
    const ModalManager = (() => {
        const modalConfigs = new Map();
        const focusState = new Map();
        const modalStack = [];
        const transitionGuard = new Map();
        let keydownBound = false;
        let lastBodyPaddingRight = '';

        function isOpen(modalEl) {
            return !!modalEl && modalEl.style.display === 'flex';
        }

        function getOpenModals() {
            return Array.from(modalConfigs.keys())
                .map(id => document.getElementById(id))
                .filter(el => isOpen(el));
        }

        function applyBodyScrollLock() {
            const hasOpen = getOpenModals().length > 0;
            if (hasOpen) {
                const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
                if (document.body.style.overflow !== 'hidden') {
                    lastBodyPaddingRight = document.body.style.paddingRight || '';
                }
                document.body.style.overflow = 'hidden';
                if (scrollbarWidth > 0) {
                    document.body.style.paddingRight = `${scrollbarWidth}px`;
                }
            } else {
                document.body.style.overflow = '';
                document.body.style.paddingRight = lastBodyPaddingRight;
            }
        }

        function getFocusableElements(modalEl) {
            if (!modalEl) return [];
            const selector = [
                'button:not([disabled])',
                '[href]',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ].join(', ');

            return Array.from(modalEl.querySelectorAll(selector))
                .filter(el => !el.hasAttribute('hidden') && getComputedStyle(el).display !== 'none');
        }

        function inferAria(modalEl) {
            const dialogPanel = modalEl.querySelector('.modal');
            const heading = dialogPanel?.querySelector('h1, h2, h3');
            const desc = dialogPanel?.querySelector('p');
            if (!dialogPanel) return;

            dialogPanel.setAttribute('role', 'dialog');
            dialogPanel.setAttribute('aria-modal', 'true');

            if (heading) {
                if (!heading.id) heading.id = `${modalEl.id}-title`;
                dialogPanel.setAttribute('aria-labelledby', heading.id);
            }

            if (desc) {
                if (!desc.id) desc.id = `${modalEl.id}-description`;
                dialogPanel.setAttribute('aria-describedby', desc.id);
            }

            dialogPanel.setAttribute('tabindex', '-1');
        }

        function syncModalStack() {
            const openIds = new Set(getOpenModals().map(m => m.id));
            for (let i = modalStack.length - 1; i >= 0; i -= 1) {
                if (!openIds.has(modalStack[i])) modalStack.splice(i, 1);
            }

            const baseZ = 60;
            modalStack.forEach((id, idx) => {
                const modalEl = document.getElementById(id);
                if (!modalEl) return;
                modalEl.style.zIndex = String(baseZ + (idx * 2));
                const panel = modalEl.querySelector('.modal');
                if (panel) panel.style.zIndex = String(baseZ + (idx * 2) + 1);
            });
        }

        function bringToFront(modalEl) {
            const idx = modalStack.indexOf(modalEl.id);
            if (idx >= 0) {
                modalStack.splice(idx, 1);
                modalStack.push(modalEl.id);
                syncModalStack();
            }
        }

        function markTransition(modalEl) {
            transitionGuard.set(modalEl.id, performance.now());
        }

        function isTransitionGuarded(modalEl) {
            const at = transitionGuard.get(modalEl.id);
            return Number.isFinite(at) && (performance.now() - at) < 120;
        }

        function fitModalToViewport(modalEl) {
            if (!modalEl) return;
            const panel = modalEl.querySelector('.modal');
            if (!panel) return;
            const safeMargin = 16;
            const maxHeight = Math.max(220, window.innerHeight - (safeMargin * 2));
            panel.style.maxHeight = `${maxHeight}px`;
            if (modalEl.classList.contains('settings-side-modal-anchored')) return;

            const rect = panel.getBoundingClientRect();
            if (rect.top < safeMargin) {
                panel.style.marginTop = `${safeMargin - rect.top}px`;
            } else {
                panel.style.marginTop = '';
            }
        }

        function register(modalEl, config = {}) {
            if (!modalEl || !modalEl.id) return;
            modalEl.classList.add('app-modal');
            modalEl.setAttribute('aria-hidden', isOpen(modalEl) ? 'false' : 'true');
            inferAria(modalEl);

            const mergedConfig = {
                dismissOnOverlay: true,
                escClosable: true,
                focusSelector: null,
                ...config
            };

            modalConfigs.set(modalEl.id, mergedConfig);

            modalEl.addEventListener('click', (e) => {
                const modalConfig = modalConfigs.get(modalEl.id);
                if (!modalConfig?.dismissOnOverlay) return;
                if (e.target !== modalEl) return;
                close(modalEl);
            });
        }

        function updateConfig(modalEl, partialConfig = {}) {
            if (!modalEl || !modalEl.id) return;
            const existing = modalConfigs.get(modalEl.id) || {};
            modalConfigs.set(modalEl.id, { ...existing, ...partialConfig });
        }

        function open(modalEl, options = {}) {
            if (!modalEl || !modalEl.id) return;
            if (isTransitionGuarded(modalEl)) return;
            const alreadyOpen = isOpen(modalEl);
            const config = modalConfigs.get(modalEl.id) || {};
            const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            focusState.set(modalEl.id, previousFocus);

            if (!alreadyOpen) {
                modalEl.style.display = 'flex';
                modalEl.setAttribute('aria-hidden', 'false');
            } else {
                bringToFront(modalEl);
            }

            const panel = modalEl.querySelector('.modal');
            const sourceEl = options.sourceEl instanceof HTMLElement ? options.sourceEl : null;
            if (panel && sourceEl) {
                const panelRect = panel.getBoundingClientRect();
                const triggerRect = sourceEl.getBoundingClientRect();
                const originX = Math.max(20, Math.min(panelRect.width - 20, (triggerRect.left + triggerRect.width / 2) - panelRect.left));
                const originY = Math.max(20, Math.min(panelRect.height - 20, (triggerRect.top + triggerRect.height / 2) - panelRect.top));
                panel.style.setProperty('--modal-origin-x', `${originX}px`);
                panel.style.setProperty('--modal-origin-y', `${originY}px`);
            } else if (panel) {
                panel.style.removeProperty('--modal-origin-x');
                panel.style.removeProperty('--modal-origin-y');
            }

            if (!modalStack.includes(modalEl.id)) modalStack.push(modalEl.id);
            syncModalStack();
            fitModalToViewport(modalEl);
            markTransition(modalEl);

            requestAnimationFrame(() => {
                if (modalEl.style.display === 'flex') {
                    modalEl.classList.add('is-open');
                }
            });

            const targetSelector = options.focusSelector || config.focusSelector;
            const explicitTarget = targetSelector ? modalEl.querySelector(targetSelector) : null;
            const focusables = getFocusableElements(modalEl);
            const fallbackTarget = modalEl.querySelector('.modal') || modalEl;
            const target = explicitTarget || focusables[0] || fallbackTarget;
            if (target && typeof target.focus === 'function') target.focus();

            applyBodyScrollLock();
            scheduleFloatingControlsRefresh();
        }

        function close(modalEl, options = {}) {
            if (!modalEl || !modalEl.id || !isOpen(modalEl)) return;
            if (isTransitionGuarded(modalEl)) return;
            markTransition(modalEl);

            modalEl.style.display = 'none';
            modalEl.setAttribute('aria-hidden', 'true');
            modalEl.classList.remove('is-open');
            modalEl.style.removeProperty('z-index');
            const panel = modalEl.querySelector('.modal');
            if (panel) {
                panel.style.removeProperty('--modal-origin-x');
                panel.style.removeProperty('--modal-origin-y');
                panel.style.removeProperty('z-index');
                panel.style.marginTop = '';
            }

            const idx = modalStack.indexOf(modalEl.id);
            if (idx >= 0) modalStack.splice(idx, 1);
            syncModalStack();
            applyBodyScrollLock();

            if (options.restoreFocus === false) return;
            const previousFocus = focusState.get(modalEl.id);
            if (previousFocus && document.contains(previousFocus) && typeof previousFocus.focus === 'function') {
                previousFocus.focus();
            }
            scheduleFloatingControlsRefresh();
        }

        function getActiveModal() {
            if (modalStack.length) {
                const id = modalStack[modalStack.length - 1];
                const top = document.getElementById(id);
                if (isOpen(top)) return top;
            }
            const openModals = getOpenModals();
            return openModals[openModals.length - 1] || null;
        }

        function refreshLayout() {
            getOpenModals().forEach((modalEl) => fitModalToViewport(modalEl));
            syncModalStack();
        }

        function setupGlobalKeyboard() {
            if (keydownBound) return;
            keydownBound = true;
            document.addEventListener('keydown', (e) => {
                const activeModal = getActiveModal();
                if (!activeModal) return;
                const config = modalConfigs.get(activeModal.id) || {};

                if (e.key === 'Escape' && config.escClosable !== false) {
                    e.preventDefault();
                    close(activeModal);
                    return;
                }

                if (e.key === 'Enter' && activeModal.id === 'confirmation-modal') {
                    const activeElement = document.activeElement;
                    const tagName = activeElement?.tagName?.toLowerCase?.() || '';
                    if (tagName !== 'textarea') {
                        const confirm = document.getElementById('confirmation-confirm-btn');
                        if (confirm && !confirm.disabled) {
                            e.preventDefault();
                            confirm.click();
                            return;
                        }
                    }
                }

                if (e.key === 'Tab') {
                    const focusables = getFocusableElements(activeModal);
                    if (!focusables.length) {
                        e.preventDefault();
                        const panel = activeModal.querySelector('.modal');
                        if (panel) panel.focus();
                        return;
                    }

                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];
                    const current = document.activeElement;

                    if (e.shiftKey && current === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && current === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            });
        }

        return {
            register,
            updateConfig,
            open,
            close,
            isOpen,
            setupGlobalKeyboard,
            refreshLayout
        };
    })();

function isAnyAppModalOpen() {
    return Array.from(document.querySelectorAll('.app-modal')).some(el => el.style.display === 'flex');
}

function getModalQaSnapshot() {
    const modals = Array.from(document.querySelectorAll('.app-modal'));
    return modals.map((modalEl) => {
        const panel = modalEl.querySelector('.modal');
        const titleId = panel?.getAttribute('aria-labelledby') || '';
        const descId = panel?.getAttribute('aria-describedby') || '';
        return {
            id: modalEl.id,
            open: modalEl.style.display === 'flex',
            ariaHidden: modalEl.getAttribute('aria-hidden'),
            hasDialogRole: panel?.getAttribute('role') === 'dialog',
            hasAriaModal: panel?.getAttribute('aria-modal') === 'true',
            hasTitleRef: !!titleId,
            hasDescRef: !!descId
        };
    });
}

function isDockActuallyVisible() {
    return !!floatingCallControls && floatingCallControls.style.display === 'flex';
}

function setFloatingDockCollapsed(collapsed) {
    floatingDockCollapsed = !!collapsed;
    if (!floatingCallControls) return;
    floatingCallControls.classList.toggle('dock-collapsed', floatingDockCollapsed);
    if (floatingDockMiniBtn) floatingDockMiniBtn.style.display = floatingDockCollapsed ? 'inline-flex' : 'none';
}

function scheduleFloatingDockAutoHide() {
    if (floatingDockIdleTimer) clearTimeout(floatingDockIdleTimer);
    if (!isDockActuallyVisible()) return;
    floatingDockIdleTimer = setTimeout(() => {
        if (isDockActuallyVisible() && !isAnyAppModalOpen()) {
            setFloatingDockCollapsed(true);
        }
    }, 4500);
}

function expandFloatingDockWithAnimation() {
    if (!floatingCallControls) return;
    if (floatingDockExpandTimer) clearTimeout(floatingDockExpandTimer);
    setFloatingDockCollapsed(false);
    floatingCallControls.classList.add('dock-animate-expand');
    floatingDockExpandTimer = setTimeout(() => {
        floatingCallControls.classList.remove('dock-animate-expand');
    }, 220);
    scheduleFloatingDockAutoHide();
}

function resolveDockMode(modePreference) {
    if (modePreference !== 'auto') return modePreference;
    if (window.innerWidth <= 700) return 'icon';
    if (window.innerWidth <= 1150) return 'compact';
    return 'full';
}

function updateFloatingActiveCard(flags, liveCallActive) {
    if (!floatingActiveCard || !floatingActiveTimer || !floatingActiveEarnings || !floatingActiveRate) return;
    const showCard = !!flags.floatingShowActiveCard && liveCallActive;
    floatingActiveCard.style.display = showCard ? '' : 'none';
    if (!showCard) return;

    const elapsed = liveCallStart ? Math.max(0, Date.now() - liveCallStart) : 0;
    floatingActiveTimer.textContent = formatTime(elapsed);
    floatingActiveEarnings.textContent = formatEarnings(calculateEarnings(elapsed, currentCallRate || getSelectedRateAmount()));
    floatingActiveRate.textContent = `Rate: ${rateSelect.value || '--'}`;

    floatingActiveTimer.style.display = flags.floatingActiveShowTimer ? '' : 'none';
    floatingActiveEarnings.style.display = flags.floatingActiveShowEarnings ? '' : 'none';
    floatingActiveRate.style.display = flags.floatingActiveShowRate ? '' : 'none';
}

function animateFloatingPrimaryTransition() {
    if (!floatingCallControls) return;
    floatingCallControls.classList.add('dock-animate-expand');
    if (floatingDockExpandTimer) clearTimeout(floatingDockExpandTimer);
    floatingDockExpandTimer = setTimeout(() => {
        floatingCallControls.classList.remove('dock-animate-expand');
    }, 220);
}

function updateFloatingSecondaryAction(flags) {
    if (!floatingSecondaryActionBtn || !floatingSecondaryActionIcon || !floatingSecondaryActionLabel) return;
    const action = flags.floatingSecondaryAction || 'add';
    if (action === 'none') {
        floatingSecondaryActionBtn.style.display = 'none';
        return;
    }
    floatingSecondaryActionBtn.style.display = 'flex';
    if (action === 'goto') {
        floatingSecondaryActionIcon.className = 'fas fa-arrow-up';
        floatingSecondaryActionLabel.textContent = 'Go to Controls';
        floatingSecondaryActionBtn.setAttribute('aria-label', 'Go to Call Controls');
    } else {
        floatingSecondaryActionIcon.className = 'fas fa-plus';
        floatingSecondaryActionLabel.textContent = 'Add Call';
        floatingSecondaryActionBtn.setAttribute('aria-label', 'Add Call');
    }
}

function computeFloatingDockOffset() {
    let bottomOffset = window.innerWidth <= 640 ? 12 : 16;

    const footer = document.querySelector('footer');
    if (footer) {
        const r = footer.getBoundingClientRect();
        if (r.top < window.innerHeight) {
            bottomOffset += Math.max(0, window.innerHeight - r.top) + 8;
        }
    }

    const toast = document.querySelector('.app-toast');
    if (toast && getComputedStyle(toast).opacity !== '0') {
        const r = toast.getBoundingClientRect();
        if (r.top < window.innerHeight) {
            bottomOffset += Math.max(0, window.innerHeight - r.top) + 8;
        }
    }

    return bottomOffset;
}

function avoidFocusedInputOverlap(flags) {
    const activeEl = document.activeElement;
    if (!activeEl || !(activeEl instanceof HTMLElement)) return flags.floatingControlsSide;
    const tag = activeEl.tagName.toLowerCase();
    if (!['input', 'textarea', 'select'].includes(tag)) return flags.floatingControlsSide;
    const rect = activeEl.getBoundingClientRect();
    const nearRight = rect.right > window.innerWidth * 0.62;
    const nearLeft = rect.left < window.innerWidth * 0.38;
    if (flags.floatingControlsSide === 'right' && nearRight) return 'left';
    if (flags.floatingControlsSide === 'left' && nearLeft) return 'right';
    return flags.floatingControlsSide;
}

function updateFloatingCallControls(flags = featureFlags) {
    if (!floatingCallControls || !floatingStartCallBtn || !floatingEndCallBtn || !callControlsCard) return;

    const enabled = !!flags?.floatingCallControls;
    if (!enabled) {
        floatingCallControls.style.display = 'none';
        floatingCallControls.classList.remove('dock-visible');
        floatingCallControls.classList.remove('show-icon-details');
        return;
    }

    if (isAnyAppModalOpen()) {
        floatingCallControls.style.display = 'none';
        floatingCallControls.classList.remove('dock-visible');
        floatingCallControls.classList.remove('show-icon-details');
        return;
    }

    const cardRect = callControlsCard.getBoundingClientRect();
    const passedControls = cardRect.bottom < 0;

    const activeMainButton = endCallBtn.style.display === 'none' ? startCallBtn : endCallBtn;
    const btnRect = activeMainButton.getBoundingClientRect();
    const mainButtonVisible = btnRect.bottom > 0 && btnRect.top < window.innerHeight;

    if (!passedControls || mainButtonVisible) {
        floatingCallControls.style.display = 'none';
        floatingCallControls.classList.remove('dock-visible');
        floatingCallControls.classList.remove('show-icon-details');
        return;
    }

    const effectiveMode = resolveDockMode(flags?.floatingControlsSizeMode || 'auto');

    floatingCallControls.classList.remove('floating-compact', 'floating-icon');
    if (effectiveMode === 'compact') floatingCallControls.classList.add('floating-compact');
    if (effectiveMode === 'icon') floatingCallControls.classList.add('floating-icon');
    floatingCallControls.classList.toggle('one-handed', !!flags.floatingOneHanded && window.innerWidth <= 900);

    const preferredSide = flags?.floatingControlsSide === 'left' ? 'left' : 'right';
    const side = avoidFocusedInputOverlap({ ...flags, floatingControlsSide: preferredSide });
    const bottomOffset = computeFloatingDockOffset();
    floatingCallControls.style.bottom = `${bottomOffset}px`;
    if (side === 'left') {
        floatingCallControls.style.left = '1rem';
        floatingCallControls.style.right = 'auto';
    } else {
        floatingCallControls.style.right = '1rem';
        floatingCallControls.style.left = 'auto';
    }

    const liveCallActive = !!liveCallStart || endCallBtn.style.display !== 'none';
    floatingStartCallBtn.style.display = liveCallActive ? 'none' : 'flex';
    floatingEndCallBtn.style.display = liveCallActive ? 'flex' : 'none';
    if (floatingDockMiniIcon) {
        floatingDockMiniIcon.className = liveCallActive ? 'fas fa-stop' : 'fas fa-play';
    }

    const showDenseExtras = effectiveMode !== 'icon';
    const iconDetailsEnabled = effectiveMode === 'icon'
        && liveCallActive
        && !!flags.floatingShowActiveCard
        && (!!flags.floatingActiveShowTimer || !!flags.floatingActiveShowEarnings || !!flags.floatingActiveShowRate);
    if (floatingSecondaryActionBtn) {
        floatingSecondaryActionBtn.style.display = showDenseExtras ? '' : 'none';
    }
    if (showDenseExtras) {
        updateFloatingSecondaryAction(flags);
    }
    updateFloatingActiveCard(flags, liveCallActive);

    if (floatingCallControls) {
        floatingCallControls.classList.toggle('show-icon-details', iconDetailsEnabled);
    }
    if (!showDenseExtras && !iconDetailsEnabled && floatingActiveCard) {
        floatingActiveCard.style.display = 'none';
    }

    const firstShow = floatingCallControls.style.display !== 'flex';
    floatingCallControls.style.display = 'flex';
    floatingCallControls.classList.add('dock-visible');
    if (firstShow) {
        setFloatingDockCollapsed(false);
        scheduleFloatingDockAutoHide();
    }
}

const scheduleFloatingControlsRefresh = createRafScheduler(() => {
    updateFloatingCallControls(featureFlags);
});

const scheduleDetailPanelsReflow = createRafScheduler(() => {
    detailModals().forEach((modalEl) => {
        if (modalEl && ModalManager.isOpen(modalEl)) {
            applyDetailModalPresentation(modalEl);
            positionDetailModal(modalEl);
        } else if (modalEl) {
            clearDetailModalPresentation(modalEl);
        }
    });
    ModalManager.refreshLayout();
});

const scheduleModalLayoutRefresh = createRafScheduler(() => {
    ModalManager.refreshLayout();
});
    
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
        // Load payment cycles safely, prefer primary key but fallback to backup if primary is missing or corrupt
        (function() {
            try {
                const raw = localStorage.getItem('paymentCycles');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        paymentCycles = parsed;
                        return;
                    }
                }
            } catch (e) {
                console.warn('Failed to parse paymentCycles from storage, will try backup.', e);
            }
            // try backup key
            try {
                const bak = localStorage.getItem('paymentCycles_backup');
                if (bak) {
                    const parsedBak = JSON.parse(bak);
                    if (Array.isArray(parsedBak)) {
                        paymentCycles = parsedBak;
                        console.info('Restored paymentCycles from backup.');
                        return;
                    }
                }
            } catch (e2) {
                console.warn('Failed to parse paymentCycles backup.', e2);
            }
            paymentCycles = [];
        })();
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
    let floatingDockCollapsed = false;
    let floatingDockIdleTimer = null;
    let floatingDockExpandTimer = null;
    let lastActiveCallPersistAt = 0;
    let cachedTimeZoneFormatters = { tz: null, date: null, time: null };

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

function saveActiveCallState(force = false) {
  if (!liveCallStart) return;
  const now = Date.now();
  if (!force && now - lastActiveCallPersistAt < 5000) return;
  const state = {
    start: liveCallStart,
    rate: currentCallRate,
    rateName: rateSelect.value || null,
    lastPing: now
  };
  localStorage.setItem(ACTIVE_CALL_KEY, JSON.stringify(state));
  lastActiveCallPersistAt = now;
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

  // Si duration viene de usuario puede ser segundos (menor a 24h) o milisegundos.
  // Tratamos cualquier número finito; asumimos que valores menores a un día están en segundos,
  // los demás ya están en ms. Esta heurística evita resultados incorrectos cuando
  // alguien guarda una sesión muy larga (>24h).
  const rawDuration = Number(call.duration ?? 0);
  let durationMs = 0;
  if (Number.isFinite(rawDuration) && rawDuration > 0) {
    const oneDaySeconds = 24 * 60 * 60;
    // si es menor que un día en segundos, lo convertimos a ms
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
        try {
            const prevRaw = localStorage.getItem('paymentCycles');
            if (prevRaw !== null) {
                // keep a backup before overwriting
                localStorage.setItem('paymentCycles_backup', prevRaw);
            }
            let prevParsed = null;
            try { prevParsed = prevRaw ? JSON.parse(prevRaw) : null; } catch {}
            // If we're about to save an empty array but a non-empty array exists in storage,
            // avoid overwriting it unintentionally. This preserves existing user data.
            if (Array.isArray(prevParsed) && prevParsed.length > 0 && (!Array.isArray(paymentCycles) || paymentCycles.length === 0)) {
                console.info('Preserving existing stored paymentCycles (not overwriting with empty).');
            } else {
                localStorage.setItem('paymentCycles', JSON.stringify(paymentCycles));
            }
        } catch (e) {
            console.warn('Failed to safely save paymentCycles, attempting direct write.', e);
            try { localStorage.setItem('paymentCycles', JSON.stringify(paymentCycles)); } catch (e2) { console.error(e2); }
        }
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
        if (tz && tz.length > 0) return tz;
        // fallback explícito al valor del navegador para evitar pasar undefined a Intl
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        if (cachedTimeZoneFormatters.tz !== tz) {
            cachedTimeZoneFormatters = {
                tz,
                time: new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: tz
                }),
                date: new Intl.DateTimeFormat('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: tz
                })
            };
        }
        const now = new Date();
        const timeString = cachedTimeZoneFormatters.time.format(now);
        const dateString = cachedTimeZoneFormatters.date.format(now);
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

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseDateInput(dateString) {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }

    function getTodayDateString() {
        const now = new Date();
        return formatDateForInput(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    function addDays(baseDate, days) {
        const nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate;
    }

    function updateDatePickerBounds() {
        const today = getTodayDateString();
        statsDatePicker.max = today;
        if (statsDatePicker.value && statsDatePicker.value > today) {
            statsDatePicker.value = today;
        }
    }

    function updateDateNavigationButtons() {
        const today = parseDateInput(getTodayDateString());
        const selectedDate = parseDateInput(statsDatePicker.value) || today;
        const disableNext = selectedDate.getTime() >= today.getTime();

        statsNextDayBtn.disabled = disableNext;
        statsNextDayBtn.classList.toggle('opacity-50', disableNext);
        statsNextDayBtn.classList.toggle('cursor-not-allowed', disableNext);
    }

    function shiftStatsDate(days) {
        updateDatePickerBounds();
        const today = parseDateInput(getTodayDateString());
        const currentDate = callLogFilter === 'date'
            ? (parseDateInput(statsDatePicker.value) || today)
            : today;
        const shiftedDate = addDays(currentDate, days);
        const targetDate = shiftedDate > today ? today : shiftedDate;

        statsDatePicker.value = formatDateForInput(targetDate);
        callLogFilter = 'date';
        updateStatistics();
        displayCalls();
        updateCallLogFilterButtons();
    }

    function displayCalls() {
        callLogTableBody.innerHTML = '';
        let filteredCalls = [];
        const now = new Date();

        if (callLogFilter === 'today') {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrowStart = new Date(todayStart);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);
            filteredCalls = calls.filter(call => {
                const t = new Date(call.startTime);
                return t >= todayStart && t < tomorrowStart;
            });
        } else if (callLogFilter === 'week') {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const nextWeek = new Date(weekStart);
            nextWeek.setDate(nextWeek.getDate() + 7);
            filteredCalls = calls.filter(call => {
                const t = new Date(call.startTime);
                return t >= weekStart && t < nextWeek;
            });
        } else if (callLogFilter === 'month') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const nextMonth = new Date(monthStart);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            filteredCalls = calls.filter(call => {
                const t = new Date(call.startTime);
                return t >= monthStart && t < nextMonth;
            });
        } else if (callLogFilter === 'date') {
            // Use parseDateInput to build a local-midnight Date (avoids UTC parsing issues)
            const selectedDate = parseDateInput(statsDatePicker.value) || new Date(statsDatePicker.value);
            const dateStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const dateEnd = new Date(dateStart);
            dateEnd.setDate(dateEnd.getDate() + 1);
            filteredCalls = calls.filter(call => {
                const t = new Date(call.startTime);
                return t >= dateStart && t < dateEnd;
            });
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

            // Fallback: if rate doesn't exist, show "Rate removed" (v1.0.9)
            let safeRateName = escapeHTML(call.rateName || '');
            if (!safeRateName) {
                safeRateName = '<span class="text-gray-400 italic">Rate removed</span>';
            } else {
                const rateExists = rates.some(r => r.name === call.rateName);
                if (!rateExists) {
                    safeRateName = `<span title="Original rate: ${escapeHTML(call.rateName)}" class="text-yellow-600 dark:text-yellow-400 line-through">${escapeHTML(call.rateName)}</span>`;
                }
            }

            const safeId = escapeHTML(call.id || '');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHTML(startDisplay)}</td>
                <td>${escapeHTML(endDisplay)}</td>
                <td>${durationStr}</td>
                <td>${safeRateName}</td>
                <td class="notes-column"></td>
                <td>${earningsStr}</td>
                <td>
                    <button class="edit-call-btn" data-call-id="${safeId}">
  <i class="fas fa-edit"></i> Edit
</button>
                    <button class="delete-call-btn text-red-500 hover:text-red-700" data-call-id="${safeId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            callLogTableBody.appendChild(row);
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

    function resetRateFormMode() {
        rateForm.reset();
        delete rateForm.dataset.editingIndex;
    }

    function deleteRate(index) {
        showConfirmation(
            'Delete Rate',
            'Are you sure you want to delete this rate?',
            'Delete',
            () => {
                rates.splice(index, 1);
                saveRates();
            }
        );
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
    showAlertModal('Invalid Call Data', 'Please enter Start & End time, or a Duration in minutes.');
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
    showAlertModal('Invalid Call Data', 'Please enter valid values (End must be after Start).');
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
    // For privacy, saved calls do not contain notes. Clear notes input when editing.
    if (callNotesInput) callNotesInput.value = '';

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

    function setConfirmationConfirmTone(tone = 'danger') {
        if (!confirmationConfirmBtn) return;
        confirmationConfirmBtn.classList.remove(
            'bg-red-500', 'hover:bg-red-600',
            'bg-yellow-500', 'hover:bg-yellow-600',
            'bg-blue-500', 'hover:bg-blue-600',
            'bg-green-600', 'hover:bg-green-700'
        );

        if (tone === 'primary') {
            confirmationConfirmBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
            return;
        }

        if (tone === 'warning') {
            confirmationConfirmBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
            return;
        }

        if (tone === 'success') {
            confirmationConfirmBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            return;
        }

        confirmationConfirmBtn.classList.add('bg-red-500', 'hover:bg-red-600');
    }

    function setConfirmationStatus(text = '', isError = false) {
        if (!confirmationModalStatus) return;
        confirmationModalStatus.setAttribute('aria-live', isError ? 'assertive' : 'polite');
        confirmationModalStatus.textContent = text;
        confirmationModalStatus.classList.remove('text-red-600', 'dark:text-red-400');
        confirmationModalStatus.classList.add('text-gray-600', 'dark:text-gray-300');
        if (isError) {
            confirmationModalStatus.classList.remove('text-gray-600', 'dark:text-gray-300');
            confirmationModalStatus.classList.add('text-red-600', 'dark:text-red-400');
        }
    }

    function setConfirmationActionEnabled(enabled) {
        if (!confirmationConfirmBtn) return;
        confirmationConfirmBtn.disabled = !enabled;
        confirmationConfirmBtn.classList.toggle('opacity-60', !enabled);
        confirmationConfirmBtn.classList.toggle('cursor-not-allowed', !enabled);
    }

    // Confirmation modal function (v1.1.0)
    function showConfirmation(title, message, confirmText = 'Delete', callback, options = {}) {
        const {
            icon = 'fa-exclamation-triangle',
            iconColor = 'text-yellow-500',
            tone = 'danger',
            showCancel = true,
            cancelText = 'Cancel',
            showClose = tone !== 'danger',
            requireText = '',
            requireTextLabel = '',
            loadingText = 'Working...',
            successText = 'Done.'
        } = options;

        confirmationModalTitle.innerHTML = `<i class="fas ${icon} ${iconColor} mr-2"></i>${title}`;
        confirmationModalMessage.textContent = message;
        confirmationConfirmBtn.textContent = confirmText;
        confirmationConfirmBtn.setAttribute('aria-busy', 'false');
        setConfirmationConfirmTone(tone);
        confirmationCancelBtn.textContent = cancelText;
        confirmationCancelBtn.style.display = showCancel ? '' : 'none';
        setConfirmationActionEnabled(true);
        setConfirmationStatus('');

        const normalizedRequire = String(requireText || '').trim();
        if (confirmationVerifyGroup && confirmationVerifyInput && confirmationVerifyLabel) {
            if (normalizedRequire) {
                confirmationVerifyGroup.style.display = '';
                confirmationVerifyInput.value = '';
                confirmationVerifyInput.placeholder = normalizedRequire;
                confirmationVerifyInput.setAttribute('data-required', normalizedRequire);
                confirmationVerifyLabel.textContent = requireTextLabel || `Type "${normalizedRequire}" to confirm`;
                setConfirmationActionEnabled(false);
                setConfirmationStatus(`Type "${normalizedRequire}" to enable confirmation.`);
            } else {
                confirmationVerifyGroup.style.display = 'none';
                confirmationVerifyInput.value = '';
                confirmationVerifyInput.removeAttribute('data-required');
                confirmationVerifyLabel.textContent = 'Type value to confirm';
            }
        }

        if (confirmationCloseBtn) {
            confirmationCloseBtn.style.display = showClose ? '' : 'none';
        }
        const isDestructive = tone === 'danger' && showCancel;
        ModalManager.updateConfig(confirmationModal, { dismissOnOverlay: !isDestructive });
        pendingConfirmAction = callback;
        pendingConfirmOptions = { loadingText, successText, requireText: normalizedRequire };
        ModalManager.open(confirmationModal, {
            focusSelector: normalizedRequire ? '#confirmation-verify-input' : '#confirmation-confirm-btn'
        });
    }

    function closeConfirmationModal() {
        ModalManager.close(confirmationModal);
        pendingConfirmAction = null;
        confirmationCancelBtn.style.display = '';
        confirmationCancelBtn.textContent = 'Cancel';
        if (confirmationCloseBtn) {
            confirmationCloseBtn.style.display = 'none';
        }
        setConfirmationConfirmTone('danger');
        setConfirmationActionEnabled(true);
        if (confirmationConfirmBtn) confirmationConfirmBtn.setAttribute('aria-busy', 'false');
        if (confirmationVerifyGroup && confirmationVerifyInput) {
            confirmationVerifyGroup.style.display = 'none';
            confirmationVerifyInput.value = '';
            confirmationVerifyInput.removeAttribute('data-required');
        }
        setConfirmationStatus('');
        isConfirmActionRunning = false;
        pendingConfirmOptions = {};
    }

    function showAlertModal(title, message, options = {}) {
        const {
            severity = 'error',
            buttonText = 'OK'
        } = options;

        const severityTemplates = {
            info: { icon: 'fa-circle-info', iconColor: 'text-blue-500', tone: 'primary' },
            warning: { icon: 'fa-triangle-exclamation', iconColor: 'text-yellow-500', tone: 'warning' },
            error: { icon: 'fa-circle-exclamation', iconColor: 'text-red-500', tone: 'danger' },
            danger: { icon: 'fa-octagon-exclamation', iconColor: 'text-red-500', tone: 'danger' }
        };

        const template = severityTemplates[severity] || severityTemplates.error;

        showConfirmation(title, message, buttonText, null, {
            ...template,
            showCancel: false,
            showClose: true
        });
    }

    function deleteCall(callId) {
        showConfirmation(
            'Delete Call',
            'Are you sure you want to delete this call entry? This action cannot be undone.',
            'Delete',
            () => {
                calls = readCallsFromStorage();
                calls = calls.filter(call => call.id !== callId);
                saveCalls();
            }
        );
    }

    // Call modal functions
    function openCallModal(triggerEl = null) {
        ModalManager.open(callModal, { focusSelector: '#call-start-time', sourceEl: triggerEl });
    }

    function closeCallModal() {
        ModalManager.close(callModal);
        isEditingCall = false;
        editingCallId = null;
        callForm.reset();
        callDurationMinutesInput.value = '';
    }

    // Live call functions
    function startLiveCall() {
        if (!rateSelect.value) {
            showAlertModal('Rate Required', 'Please select a rate before starting the call.', {
                severity: 'warning'
            });
            return;
        }
        if (liveCallTimerId) {
            clearInterval(liveCallTimerId);
        }
        liveCallStart = Date.now();
        if (liveCallNotesInput) liveCallNotesInput.value = '';
        const selectedRate = rates.find(rate => rate.name === rateSelect.value);
        currentCallRate = selectedRate ? selectedRate.amount : 0;
        liveCallInfo.style.display = 'block';
        startCallBtn.style.display = 'none';
        endCallBtn.style.display = 'block';
        liveCallInfo.classList.add('active-call-pulse');

        saveActiveCallState(true);

        liveCallTimerId = setInterval(() => {
            const elapsed = Date.now() - liveCallStart;
            liveCallTimerDisplay.textContent = formatTime(elapsed);
            const earned = calculateEarnings(elapsed, currentCallRate);
            liveCallEarningsDisplay.textContent = formatEarnings(earned);
            updateFloatingActiveCard(featureFlags, true);
            saveActiveCallState();
        }, 1000);

        saveActiveCallState(true);
        updateFloatingCallControls(featureFlags);
        animateFloatingPrimaryTransition();
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
        if (liveCallNotesInput) liveCallNotesInput.value = '';
        liveCallStart = null;
        currentCallRate = null;
        showToast('Live call saved!');
        clearActiveCallState();
        updateFloatingCallControls(featureFlags);
        animateFloatingPrimaryTransition();
    }

    // Settings modal functions
    function openSettingsModal(triggerEl = null) {
        ModalManager.open(settingsModal, { focusSelector: '#feature-notes-toggle', sourceEl: triggerEl });
        updateSettingsSplitState();
        updateStorageInfo();
    }

    function closeSettingsModal() {
        closeOtherDetailModals(null);
        detailModals().forEach((modalEl) => clearDetailModalPresentation(modalEl));
        stopFloatingPreviewAutoRefresh();
        ModalManager.close(settingsModal);
    }

    function openPaymentCyclesSettingsModal(triggerEl = null) {
        if (!featureFlags.paymentCycles) return;
        closeOtherDetailModals(paymentCyclesSettingsModal);
        settingsModal?.classList.add('settings-split-active');
        applyDetailModalPresentation(paymentCyclesSettingsModal);
        positionDetailModal(paymentCyclesSettingsModal);
        ModalManager.open(paymentCyclesSettingsModal, { focusSelector: '#show-add-cycle-btn', sourceEl: triggerEl });
        if (openPaymentCyclesSettingsBtn) openPaymentCyclesSettingsBtn.setAttribute('aria-expanded', 'true');
        setDetailPanelOrigin(paymentCyclesSettingsModal, triggerEl);
        updateSettingsSplitState();
        updateStorageInfo();
        renderPaymentCycles();
    }

    function closePaymentCyclesSettingsModal() {
        ModalManager.close(paymentCyclesSettingsModal);
        clearDetailModalPresentation(paymentCyclesSettingsModal);
        if (openPaymentCyclesSettingsBtn) openPaymentCyclesSettingsBtn.setAttribute('aria-expanded', 'false');
    }

    function openFloatingControlsSettingsModal(triggerEl = null) {
        if (!featureFlags.floatingCallControls) return;
        closeOtherDetailModals(floatingControlsSettingsModal);
        settingsModal?.classList.add('settings-split-active');
        applyDetailModalPresentation(floatingControlsSettingsModal);
        positionDetailModal(floatingControlsSettingsModal);
        ModalManager.open(floatingControlsSettingsModal, { focusSelector: '#floating-controls-size-mode', sourceEl: triggerEl });
        if (openFloatingControlsSettingsBtn) openFloatingControlsSettingsBtn.setAttribute('aria-expanded', 'true');
        setDetailPanelOrigin(floatingControlsSettingsModal, triggerEl);
        updateSettingsSplitState();
        requestAnimationFrame(() => {
            updateFloatingPreview(featureFlags, { randomize: true });
            startFloatingPreviewAutoRefresh(featureFlags);
        });
    }

    function closeFloatingControlsSettingsModal() {
        stopFloatingPreviewAutoRefresh();
        ModalManager.close(floatingControlsSettingsModal);
        clearDetailModalPresentation(floatingControlsSettingsModal);
        if (openFloatingControlsSettingsBtn) openFloatingControlsSettingsBtn.setAttribute('aria-expanded', 'false');
    }

    function openEditCycleModal() {
        ModalManager.open(editCycleModal, { focusSelector: '#cycle-start-date-input' });
    }

    function closeEditCycleModal() {
        ModalManager.close(editCycleModal);
        isEditingCycle = false;
        editingCycleIndex = null;
        editCycleForm.reset();
    }

    // Payment Cycle Management
    function renderPaymentCycles() {
        if (typeof paymentCyclesToggle !== 'undefined' && paymentCyclesToggle) {
            try { paymentCyclesToggle.checked = paymentCyclesEnabled; } catch (e) { /* ignore */ }
        }
        if (paymentCyclesConfig) {
            if (paymentCyclesEnabled) {
                paymentCyclesConfig.classList.remove('hidden');
            } else {
                paymentCyclesConfig.classList.add('hidden');
            }
        }

        // Show restore backup button only if backup exists (v1.0.9)
        const restoreBackupBtn = document.getElementById('restore-backup-cycles-btn');
        if (restoreBackupBtn) {
            const hasBackup = !!localStorage.getItem('paymentCycles_backup');
            restoreBackupBtn.style.display = hasBackup ? 'block' : 'none';
        }

        if (!paymentCyclesList) return;
        paymentCyclesList.innerHTML = '';
        // If paymentCycles array is empty in memory, try to read stored value (in case it wasn't loaded into memory)
        if ((!Array.isArray(paymentCycles) || paymentCycles.length === 0)) {
            try {
                const raw = localStorage.getItem('paymentCycles');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) paymentCycles = parsed;
                }
            } catch (e) {
                // ignore
            }
        }

        if (!Array.isArray(paymentCycles) || paymentCycles.length === 0) {
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

    // Restore payment cycles from backup (v1.0.9)
    function restorePaymentCyclesFromBackup() {
        const backup = localStorage.getItem('paymentCycles_backup');
        if (!backup) {
            showToast('No backup available to restore.');
            return;
        }

        showConfirmation(
            'Restore Payment Cycles',
            'Restore payment cycles from backup? This will overwrite current cycles.',
            'Restore',
            () => {
                try {
                    const restored = JSON.parse(backup);
                    if (Array.isArray(restored)) {
                        paymentCycles = restored;
                        localStorage.setItem('paymentCycles', JSON.stringify(paymentCycles));
                        renderPaymentCycles();
                        showToast('Payment cycles restored from backup.');
                    } else {
                        showToast('Backup data is invalid.');
                    }
                } catch (e) {
                    console.error('Error restoring backup:', e);
                    showToast('Error restoring backup. See console for details.');
                }
            }
        );
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
            showAlertModal('Missing Dates', 'Please fill in all dates.');
            return;
        }

        const start = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        const end = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
        const pay = new Date(payDate.getUTCFullYear(), payDate.getUTCMonth(), payDate.getUTCDate());

        if (end < start) {
            showAlertModal('Invalid Date Range', 'End date cannot be before start date.');
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

        updateDateNavigationButtons();
    }

    function showToast(message) {
        const existing = document.querySelector('.app-toast');
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.textContent = message;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('aria-atomic', 'true');
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
        ModalManager.open(feedbackModal, { focusSelector: '#feedback-name' });
    }

    function closeFeedbackModal() {
        ModalManager.close(feedbackModal);
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
        try {
        ModalManager.setupGlobalKeyboard();
        window.WTTModalQA = {
            report: getModalQaSnapshot
        };
        ModalManager.register(callModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#call-start-time' });
        ModalManager.register(settingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#feature-notes-toggle' });
        ModalManager.register(editCycleModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#cycle-start-date-input' });
        ModalManager.register(feedbackModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#feedback-name' });
        ModalManager.register(changelogModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#close-changelog-modal' });
        ModalManager.register(floatingControlsSettingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#floating-controls-size-mode' });
        ModalManager.register(paymentCyclesSettingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#show-add-cycle-btn' });
        ModalManager.register(confirmationModal, { dismissOnOverlay: false, escClosable: true, focusSelector: '#confirmation-confirm-btn' });
        ModalManager.register(recoveryModal, { dismissOnOverlay: false, escClosable: true, focusSelector: '#recovery-resume-btn' });

        startCallBtn.addEventListener('click', startLiveCall);
        endCallBtn.addEventListener('click', endLiveCall);
        if (floatingStartCallBtn) {
            floatingStartCallBtn.addEventListener('click', startLiveCall);
        }
        if (floatingEndCallBtn) {
            floatingEndCallBtn.addEventListener('click', endLiveCall);
        }
        if (floatingDockMiniBtn) {
            floatingDockMiniBtn.addEventListener('click', expandFloatingDockWithAnimation);
        }
        if (floatingSecondaryActionBtn) {
            floatingSecondaryActionBtn.addEventListener('click', () => {
                const action = featureFlags.floatingSecondaryAction || 'add';
                if (action === 'goto') {
                    callControlsCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (action === 'add') {
                    addCallBtn?.click();
                }
            });
        }

        if (ratesList) {
            ratesList.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-rate-btn');
                if (editBtn) {
                    const index = Number(editBtn.dataset.index);
                    if (Number.isInteger(index)) editRate(index);
                    return;
                }
                const deleteBtn = e.target.closest('.delete-rate-btn');
                if (deleteBtn) {
                    const index = Number(deleteBtn.dataset.index);
                    if (Number.isInteger(index)) deleteRate(index);
                }
            });
        }

        if (callLogTableBody) {
            callLogTableBody.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-call-btn');
                if (editBtn) {
                    const callId = String(editBtn.dataset.callId || '');
                    if (callId) {
                        editCall(callId);
                        openCallModal(editBtn);
                    }
                    return;
                }
                const deleteBtn = e.target.closest('.delete-call-btn');
                if (deleteBtn) {
                    const callId = String(deleteBtn.dataset.callId || '');
                    if (callId) deleteCall(callId);
                }
            });
        }

        if (paymentCyclesList) {
            paymentCyclesList.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-cycle-btn');
                if (editBtn) {
                    const index = Number(editBtn.dataset.index);
                    if (Number.isInteger(index)) editPaymentCycle(index);
                    return;
                }
                const deleteBtn = e.target.closest('.delete-cycle-btn');
                if (deleteBtn) {
                    const index = Number(deleteBtn.dataset.index);
                    if (!Number.isInteger(index)) return;
                    showConfirmation(
                        'Delete Payment Cycle',
                        'Are you sure you want to delete this payment cycle?',
                        'Delete',
                        () => {
                            paymentCycles.splice(index, 1);
                            savePaymentCycles();
                        }
                    );
                }
            });
        }

        const dockActivityEvents = ['scroll', 'mousemove', 'touchstart', 'keydown'];
        let lastDockActivityAt = 0;
        const onDockActivity = () => {
            const nowTs = performance.now();
            if (nowTs - lastDockActivityAt < 120) return;
            lastDockActivityAt = nowTs;
            if (isDockActuallyVisible() && floatingDockCollapsed) {
                expandFloatingDockWithAnimation();
            } else if (isDockActuallyVisible()) {
                scheduleFloatingDockAutoHide();
            }
        };
        dockActivityEvents.forEach(evt => {
            window.addEventListener(evt, onDockActivity, { passive: evt !== 'keydown' });
        });
        addCallBtn.addEventListener('click', () => {
        // mode: Add
        isEditingCall = false;
        editingCallId = null;

        document.getElementById('modal-title').innerHTML =
            `<i class="fas fa-plus text-blue-500 mr-2"></i>Add Call`;

        openCallModal(addCallBtn);
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

        // Restore saved textarea heights for notes (persist across refreshes)
        try {
            const savedHeightLive = localStorage.getItem('liveCallNotesHeight');
            if (savedHeightLive && liveCallNotesInput) {
                liveCallNotesInput.style.height = savedHeightLive;
            }

            const savedHeightModal = localStorage.getItem('callNotesHeight');
            if (savedHeightModal && callNotesInput) {
                callNotesInput.style.height = savedHeightModal;
            }

            // Use ResizeObserver when available to detect manual resize and persist
            if (window.ResizeObserver) {
                const ro = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        if (!entry.target) continue;
                        const el = entry.target;
                        try {
                            if (el.id === 'live-call-notes') localStorage.setItem('liveCallNotesHeight', el.style.height || (el.clientHeight + 'px'));
                            if (el.id === 'call-notes') localStorage.setItem('callNotesHeight', el.style.height || (el.clientHeight + 'px'));
                        } catch (e) {
                            // ignore storage errors
                        }
                    }
                });
                if (liveCallNotesInput) ro.observe(liveCallNotesInput);
                if (callNotesInput) ro.observe(callNotesInput);
            } else {
                // Fallback: save height on blur
                if (liveCallNotesInput) liveCallNotesInput.addEventListener('blur', () => {
                    try { localStorage.setItem('liveCallNotesHeight', liveCallNotesInput.style.height || (liveCallNotesInput.clientHeight + 'px')); } catch {}
                });
                if (callNotesInput) callNotesInput.addEventListener('blur', () => {
                    try { localStorage.setItem('callNotesHeight', callNotesInput.style.height || (callNotesInput.clientHeight + 'px')); } catch {}
                });
            }
        } catch (e) {
            // ignore textarea height restoration
        }

        // Apply feature flags to show/hide optional UI
        featureFlags = loadFeatureFlags();
            // set toggle states in settings modal if present
            if (featureNotesToggle) featureNotesToggle.checked = !!featureFlags.notes;
            if (featurePaymentCyclesToggle) featurePaymentCyclesToggle.checked = !!featureFlags.paymentCycles;
            if (featureFloatingControlsToggle) featureFloatingControlsToggle.checked = !!featureFlags.floatingCallControls;
            if (floatingShowActiveCardToggle) floatingShowActiveCardToggle.checked = !!featureFlags.floatingShowActiveCard;
            if (floatingActiveShowTimerToggle) floatingActiveShowTimerToggle.checked = !!featureFlags.floatingActiveShowTimer;
            if (floatingActiveShowEarningsToggle) floatingActiveShowEarningsToggle.checked = !!featureFlags.floatingActiveShowEarnings;
            if (floatingActiveShowRateToggle) floatingActiveShowRateToggle.checked = !!featureFlags.floatingActiveShowRate;
            if (floatingOneHandedToggle) floatingOneHandedToggle.checked = !!featureFlags.floatingOneHanded;
            if (floatingSecondaryActionSelect) floatingSecondaryActionSelect.value = featureFlags.floatingSecondaryAction || 'add';
            if (floatingPreviewEnabledToggle) floatingPreviewEnabledToggle.checked = ENABLE_FLOATING_PREVIEW_TESTING && !!featureFlags.floatingPreviewEnabled;
            // apply the flags immediately
            applyFeatureFlags(featureFlags);

            // Wire toggle changes
            if (featureNotesToggle) {
                featureNotesToggle.addEventListener('change', (e) => {
                    featureFlags.notes = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (featurePaymentCyclesToggle) {
                featurePaymentCyclesToggle.addEventListener('change', (e) => {
                    featureFlags.paymentCycles = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    // ensure the runtime flag follows this feature toggle
                    paymentCyclesEnabled = !!e.target.checked;
                    // Make sure we don't accidentally overwrite existing cycles data
                    if (!Array.isArray(paymentCycles)) {
                        try {
                            const stored = JSON.parse(localStorage.getItem('paymentCycles'));
                            paymentCycles = Array.isArray(stored) ? stored : [];
                        } catch (ex) {
                            paymentCycles = [];
                        }
                    }
                    try { savePaymentCycles(); } catch (e2) {}
                    // if the original paymentCyclesToggle exists keep it in sync and trigger its handler
                    if (typeof paymentCyclesToggle !== 'undefined' && paymentCyclesToggle) {
                        paymentCyclesToggle.checked = !!e.target.checked;
                        paymentCyclesToggle.dispatchEvent(new Event('change'));
                    }
                    applyFeatureFlags(featureFlags);
                });
            }

            if (featureFloatingControlsToggle) {
                featureFloatingControlsToggle.addEventListener('change', (e) => {
                    featureFlags.floatingCallControls = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (openFloatingControlsSettingsBtn) {
                openFloatingControlsSettingsBtn.addEventListener('click', (e) => openFloatingControlsSettingsModal(e.currentTarget));
            }
            if (openPaymentCyclesSettingsBtn) {
                openPaymentCyclesSettingsBtn.addEventListener('click', (e) => openPaymentCyclesSettingsModal(e.currentTarget));
            }
            if (closeFloatingControlsSettingsBtn) {
                closeFloatingControlsSettingsBtn.addEventListener('click', closeFloatingControlsSettingsModal);
            }
            if (doneFloatingControlsSettingsBtn) {
                doneFloatingControlsSettingsBtn.addEventListener('click', closeFloatingControlsSettingsModal);
            }
            if (closePaymentCyclesSettingsModalBtn) {
                closePaymentCyclesSettingsModalBtn.addEventListener('click', closePaymentCyclesSettingsModal);
            }
            if (donePaymentCyclesSettingsBtn) {
                donePaymentCyclesSettingsBtn.addEventListener('click', closePaymentCyclesSettingsModal);
            }
            if (floatingControlsSizeModeSelect) {
                floatingControlsSizeModeSelect.addEventListener('change', (e) => {
                    featureFlags.floatingControlsSizeMode = e.target.value;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingControlsSideSelect) {
                floatingControlsSideSelect.addEventListener('change', (e) => {
                    featureFlags.floatingControlsSide = e.target.value === 'left' ? 'left' : 'right';
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingSecondaryActionSelect) {
                floatingSecondaryActionSelect.addEventListener('change', (e) => {
                    featureFlags.floatingSecondaryAction = ['add', 'goto', 'none'].includes(e.target.value) ? e.target.value : 'add';
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingShowActiveCardToggle) {
                floatingShowActiveCardToggle.addEventListener('change', (e) => {
                    featureFlags.floatingShowActiveCard = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingActiveShowTimerToggle) {
                floatingActiveShowTimerToggle.addEventListener('change', (e) => {
                    featureFlags.floatingActiveShowTimer = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingActiveShowEarningsToggle) {
                floatingActiveShowEarningsToggle.addEventListener('change', (e) => {
                    featureFlags.floatingActiveShowEarnings = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingActiveShowRateToggle) {
                floatingActiveShowRateToggle.addEventListener('change', (e) => {
                    featureFlags.floatingActiveShowRate = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingOneHandedToggle) {
                floatingOneHandedToggle.addEventListener('change', (e) => {
                    featureFlags.floatingOneHanded = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingPreviewEnabledToggle) {
                floatingPreviewEnabledToggle.addEventListener('change', (e) => {
                    featureFlags.floatingPreviewEnabled = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    applyFeatureFlags(featureFlags);
                });
            }

            if (floatingPreviewRandomizeBtn) {
                floatingPreviewRandomizeBtn.addEventListener('click', () => {
                    updateFloatingPreview(featureFlags, { randomize: true });
                });
            }

            // Keep feature flag in sync when user toggles the original paymentCyclesToggle
            if (typeof paymentCyclesToggle !== 'undefined' && paymentCyclesToggle) {
                paymentCyclesToggle.addEventListener('change', (e) => {
                    featureFlags.paymentCycles = !!e.target.checked;
                    saveFeatureFlags(featureFlags);
                    if (featurePaymentCyclesToggle) featurePaymentCyclesToggle.checked = !!e.target.checked;
                });
            }

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

        // v1.0.5 Prevent accidental close when a live call is active
        window.addEventListener('beforeunload', (e) => {
            if (liveCallStart) {
                saveActiveCallState(true);
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
    if (typeof recoveryNotes !== 'undefined' && recoveryNotes) recoveryNotes.value = '';

  ModalManager.open(recoveryModal, { focusSelector: '#recovery-resume-btn' });
  scheduleFloatingControlsRefresh();

  recoveryResumeBtn.onclick = () => {
        // restore selected rate if available
        if (state.rateName && rates.some(r => r.name === state.rateName)) {
            rateSelect.value = state.rateName;
            saveLastSelectedRate();
        }

        // restore runtime state
        liveCallStart = state.start;
        // restore notes: only use text entered in the recovery modal (do not persist previous notes)
        const restoredNotes = (typeof recoveryNotes !== 'undefined' && recoveryNotes && recoveryNotes.value) ? recoveryNotes.value : '';
        if (liveCallNotesInput) liveCallNotesInput.value = restoredNotes;
        currentCallRate = Number(state.rate) || getSelectedRateAmount();

        // show live UI immediately
        liveCallInfo.style.display = 'block';
        startCallBtn.style.display = 'none';
        endCallBtn.style.display = 'block';
        liveCallInfo.classList.add('active-call-pulse');

        // update displays immediately (don't wait 1s)
        const initialElapsed = Math.max(0, Date.now() - liveCallStart);
        liveCallTimerDisplay.textContent = formatTime(initialElapsed);
        liveCallEarningsDisplay.textContent = formatEarnings(calculateEarnings(initialElapsed, currentCallRate));

        if (liveCallTimerId) clearInterval(liveCallTimerId);
        liveCallTimerId = setInterval(() => {
            const elapsedNow = Date.now() - liveCallStart;
            liveCallTimerDisplay.textContent = formatTime(elapsedNow);
            const earned = calculateEarnings(elapsedNow, currentCallRate);
            liveCallEarningsDisplay.textContent = formatEarnings(earned);
            saveActiveCallState();
        }, 1000);

        saveActiveCallState(true);
        closeRecoveryModal();
        showToast('Live call resumed.');
        scheduleFloatingControlsRefresh();
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
    closeRecoveryModal();
    showToast('Unfinished call summarized and saved.');
    scheduleFloatingControlsRefresh();
  };

  recoveryDiscardBtn.onclick = () => {
    clearActiveCallState();
    closeRecoveryModal();
    showToast('Unfinished call discarded.');
    scheduleFloatingControlsRefresh();
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
        const restoreBackupBtn = document.getElementById('restore-backup-cycles-btn');
        if (restoreBackupBtn) {
            restoreBackupBtn.addEventListener('click', restorePaymentCyclesFromBackup);
        }
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
            resetRateFormMode();
            rateForm.style.display = 'block';
            showRateAddBtn.style.display = 'none';
            document.getElementById('rate-name').focus();
        });
        cancelRateAddBtn.addEventListener('click', () => {
            resetRateFormMode();
            rateForm.style.display = 'none';
            showRateAddBtn.style.display = 'block';
        });
        rateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rate-name').value;
            const amount = parseFloat(document.getElementById('rate-amount').value);

            if (!name || isNaN(amount) || amount <= 0) {
                showAlertModal('Invalid Rate', 'Please enter a valid rate name and amount.');
                return;
            }

            if (typeof rateForm.dataset.editingIndex !== 'undefined') {
                const index = parseInt(rateForm.dataset.editingIndex);
                rates[index] = { name, amount };
                delete rateForm.dataset.editingIndex;
            } else {
                rates.push({ name, amount });
            }

            saveRates();
            resetRateFormMode();
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
            updateDatePickerBounds();
            callLogFilter = 'date';
            updateStatistics();
            displayCalls();
            updateCallLogFilterButtons();
        });
        statsPrevDayBtn.addEventListener('click', () => {
            shiftStatsDate(-1);
        });
        statsNextDayBtn.addEventListener('click', () => {
            if (statsNextDayBtn.disabled) return;
            shiftStatsDate(1);
        });
        currentDateBtn.addEventListener('click', () => {
            const today = getTodayDateString();
            statsDatePicker.value = today;
            callLogFilter = 'today';
            updateStatistics();
            displayCalls();
            updateCallLogFilterButtons();
        });
        
        settingsToggleBtn.addEventListener('click', (e) => openSettingsModal(e.currentTarget));
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
            // Respect feature flags when exporting (e.g. strip notes if feature disabled)
            const exportCalls = calls.map(c => ({ ...c }));
            try {
                const flags = loadFeatureFlags();
                if (!flags.notes) {
                    exportCalls.forEach(ec => { delete ec.notes; });
                }
                if (!flags.paymentCycles) {
                    // hide payment cycle details when feature disabled
                    // we'll still include the keys but mark disabled
                }
            } catch (e) {}

            const data = {
                calls: exportCalls,
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
                    showConfirmation(
                        'Import Data',
                        'This will replace your current local data with the selected backup file.',
                        'Import',
                        () => {
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
                        },
                        {
                            icon: 'fa-upload',
                            iconColor: 'text-blue-500',
                            tone: 'primary',
                            loadingText: 'Importing backup...',
                            successText: 'Backup imported successfully.'
                        }
                    );
                } catch (error) {
                    showAlertModal('Import Failed', 'Failed to import file. Please ensure it is a valid JSON file from this app.');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        });

        resetCallsBtn.addEventListener('click', () => {
            showConfirmation(
                'Reset Calls',
                'This will permanently delete all call history. Rates and settings will be kept.',
                'Erase',
                () => {
                calls = [];
                saveCalls();
                showToast('All call history erased.');
                },
                {
                    loadingText: 'Erasing call history...',
                    successText: 'Call history erased.'
                }
            );
        });
        
        resetAllBtn.addEventListener('click', () => {
            showConfirmation(
                'Reset All Data',
                'This will permanently delete all local data (calls, rates, goals, and settings).',
                'Reset All',
                () => {
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
                },
                {
                    requireText: 'RESET',
                    requireTextLabel: 'Type "RESET" to confirm permanent deletion',
                    loadingText: 'Resetting all local data...',
                    successText: 'All data reset.'
                }
            );
        });
        
        if (typeof paymentCyclesToggle !== 'undefined' && paymentCyclesToggle) {
            paymentCyclesToggle.addEventListener('change', (e) => {
                paymentCyclesEnabled = e.target.checked;
                savePaymentCycles();
            });
        }

        window.addEventListener('beforeunload', () => {
            activeTimers.forEach(timerId => clearInterval(timerId));
            activeTimers.clear();
        });

        document.getElementById('privacy-policy')?.addEventListener('click', () => {
            showAlertModal('Privacy Policy', 'This app stores all data locally in your browser. No data is sent to external servers.', {
                severity: 'info'
            });
        });

        document.getElementById('terms-of-service')?.addEventListener('click', () => {
            showAlertModal('Terms of Service', 'This app is provided "as is" without any warranties. Use at your own discretion.', {
                severity: 'info'
            });
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
        window.addEventListener('scroll', scheduleFloatingControlsRefresh, { passive: true });
        window.addEventListener('resize', () => {
            scheduleModalLayoutRefresh();
            scheduleFloatingControlsRefresh();
            scheduleDetailPanelsReflow();
        });

        const today = getTodayDateString();
        statsDatePicker.value = today;
        updateDatePickerBounds();
        
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
        scheduleFloatingControlsRefresh();

        // Confirmation modal listeners (v1.1.0)
        if (confirmationConfirmBtn) {
            confirmationConfirmBtn.addEventListener('click', async () => {
                if (isConfirmActionRunning) return;
                const requiredText = String(pendingConfirmOptions?.requireText || '');
                if (requiredText && confirmationVerifyInput) {
                    const typed = String(confirmationVerifyInput.value || '').trim();
                    if (typed !== requiredText) {
                        setConfirmationStatus(`Please type "${requiredText}" exactly to continue.`, true);
                        confirmationVerifyInput.focus();
                        return;
                    }
                }
                isConfirmActionRunning = true;
                setConfirmationActionEnabled(false);
                if (confirmationConfirmBtn) confirmationConfirmBtn.setAttribute('aria-busy', 'true');
                setConfirmationStatus(pendingConfirmOptions?.loadingText || 'Working...');
                try {
                    if (typeof pendingConfirmAction === 'function') {
                        await Promise.resolve(pendingConfirmAction());
                    }
                    setConfirmationStatus(pendingConfirmOptions?.successText || 'Done.');
                    await new Promise(resolve => setTimeout(resolve, 220));
                } finally {
                    closeConfirmationModal();
                }
            });
        }
        if (confirmationCancelBtn) {
            confirmationCancelBtn.addEventListener('click', closeConfirmationModal);
        }
        if (confirmationCloseBtn) {
            confirmationCloseBtn.addEventListener('click', closeConfirmationModal);
        }
        if (confirmationVerifyInput) {
            confirmationVerifyInput.addEventListener('input', () => {
                const requiredText = String(pendingConfirmOptions?.requireText || '');
                if (!requiredText) return;
                const typed = String(confirmationVerifyInput.value || '').trim();
                const matches = typed === requiredText;
                setConfirmationActionEnabled(matches && !isConfirmActionRunning);
                if (matches) {
                    setConfirmationStatus('');
                }
            });
        }

        } catch (err) {
            console.error('Initialization error', err);
            try {
                // show a visible alert in the page so it's obvious
                const div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.left = '8px';
                div.style.right = '8px';
                div.style.top = '8px';
                div.style.zIndex = 99999;
                div.style.background = '#fee2e2';
                div.style.color = '#7f1d1d';
                div.style.padding = '12px';
                div.style.border = '1px solid #fca5a5';
                div.style.borderRadius = '6px';
                div.textContent = 'App initialization error: ' + (err && err.message ? err.message : String(err));
                document.body.appendChild(div);
            } catch (e2) {
                // fallback to alert if DOM update fails
                alert('App initialization error: ' + (err && err.message ? err.message : String(err)));
            }
        }
    });

