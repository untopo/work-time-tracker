
    const appStorage = window.WTTStorage || window.localStorage;
    const DISPLAY_LOCALE = 'en-US';
    const SESSION_TRACKER_KEY = 'sessionTrackerStateV1';
    const SESSION_HISTORY_KEY = 'sessionHistoryV1';
    const SESSION_RPG_STATS_KEY = 'wtt_session_rpg_stats_v1';

    // ============================================
    // VERSION & CHANGELOG
    // ============================================
    const APP_VERSION = '1.2.1';
    const CHANGELOG = [
        { version: '1.2.1', date: '2026-03-19', changes: ['Session Tracker now captures shift start/end time automatically with one-click Start/End flow', 'Added Session History with per-session timeline, calls count, talk/idle/utilization breakdown, earnings snapshot, and quick clear action', 'Added live Calls metric inside Session Tracker to show how many calls occurred in the active session window', 'Improved stats comparison language with supportive wording and calmer tone colors (no baseline / first active day / ahead-behind phrasing)', 'Floating Controls settings preview now reflects +/-1s adjust-button configuration inside active card samples', 'Text and encoding cleanup across release spotlights, log summaries, toasts, and separators for clearer in-app copy'] },
        { version: '1.2.0', date: '2026-03-18', changes: ['Added Session Tracker with shift start/pause/end controls and live utilization metrics', 'Added Post-Call Review strip with Undo / Quick Edit / Dismiss right after saving calls', 'Added Patterns analytics modes (Hourly / Weekly / Monthly) with improved trend readability', 'Expanded RPG progression with Daily Focus, Weekly Arc, Streak Shield, and session-linked achievements', 'Improved Call Log workflow with search, rate filter, reset, and richer results summary', 'Improved Payment Cycles with clearer current/next payout context and stronger timeline visibility', 'Improved footer and mobile navigation UX with cleaner structure and collapsible sections', 'Security hardening across desktop and Android widget flows, plus general stability fixes'] },
        { version: '1.1.88', date: '2026-03-11', changes: ['Floating Dock: You can now drag and position the in-app dock where it fits your workflow best', 'Floating Dock: Added `-1/+1s` quick-adjust buttons for active calls, with consistent sizing across full, compact, and icon dock modes', 'Call Log: Added clickable sorting by key columns so you can reorder entries faster during review', 'Payment Cycles: Added a biweekly template generator so recurring cycle ranges can be created in bulk instead of one-by-one'] },
        { version: '1.1.87', date: '2026-03-03', changes: ['UI: Replaced the footer support row with a single Donate button that opens a support modal instead of showing both provider buttons inline', 'Added: New support modal keeps both PayPal and Ko-fi options available while opening the official provider pages externally on web, desktop, and mobile'] },
        { version: '1.1.86', date: '2026-03-03', changes: ['UI: Tightened the footer support row again so Donate and Support me on Ko-fi fit side by side more reliably in narrow layouts', 'UI: Reduced support button width, height, and text size evenly so both actions stay visually identical while taking less space'] },
        { version: '1.1.85', date: '2026-03-03', changes: ['Fixed: Desktop update banner now opens the GitHub release page in the system browser instead of doing nothing inside the Tauri webview', 'Desktop: Installed builds now use a native Rust command for release links while mobile keeps using the normal browser open flow'] },
        { version: '1.1.84', date: '2026-03-03', changes: ['UI: Donate and Support me on Ko-fi now use identical fixed dimensions and stay side by side in the footer instead of wrapping unevenly on narrow screens', 'Polish: Both support buttons were slightly reduced in size so the footer support row feels tighter and more balanced on mobile and desktop'] },
        { version: '1.1.83', date: '2026-03-03', changes: ['Added: Desktop and mobile builds now check a lightweight public update manifest and show a non-blocking banner when a newer release is available', 'Added: Update notices can be dismissed per-version so users are reminded only when a truly newer release exists', 'Prep: The shared static build now includes version.json so GitHub Pages, Tauri, and Capacitor can read the same release metadata source'] },
        { version: '1.1.82', date: '2026-03-03', changes: ['Mobile: Active calls now auto-restore cleanly after background/minimized states, while explicit close attempts still keep the recovery decision flow available on next launch', 'Mobile: Removed shell overflow rules that were making vertical dashboard scrolling feel sticky or dependent on sideways gestures first', 'Stability: Active-call close intent is now tracked separately from normal background persistence so recovery behavior is less intrusive'] },
        { version: '1.1.81', date: '2026-03-03', changes: ['UI: Replaced the embedded Ko-fi widget with a fixed button so support actions stay visually consistent and no external widget stretches the footer', 'Footer: Donate and Support me on Ko-fi now sit side by side with matching pill dimensions', 'Mobile/Desktop: Unified the support button layout instead of switching between separate Ko-fi desktop/mobile treatments'] },
        { version: '1.1.80', date: '2026-03-03', changes: ['Hotfix: Restored the missing `beginLiveCallWithRate(...)` path so Start Call works again in web, desktop, and mobile builds', 'Android: The APK now reads its visible version from `package.json` instead of staying stuck at `1.0`', 'Mobile: Simplified the footer support area on small screens and removed the over-aggressive body `touch-action` rule to reduce scroll friction and horizontal overflow'] },
        { version: '1.1.79', date: '2026-03-03', changes: ['Hotfix: Removed the remaining desktop-overlay settings references and replaced the leftover overlay refresh calls with a harmless no-op so initialization can no longer fail after the overlay removal', 'Web/Desktop: Restored normal startup for GitHub Pages and the Tauri app without requiring any overlay-specific globals'] },
        { version: '1.1.78', date: '2026-03-03', changes: ['Hotfix: Removed the last broken desktop-overlay settings listener that was still throwing `openDesktopOverlaySettingsBtn is not defined` during app initialization', 'Web/Desktop: Restored normal startup so GitHub Pages and the Tauri app can boot again after the overlay removal cleanup'] },
        { version: '1.1.77', date: '2026-03-03', changes: ['Desktop: Removed the experimental always-on-top overlay controls after repeated reliability issues so the main app returns to a simpler, more dependable desktop experience', 'Desktop: Closing the Tauri main window now exits the app fully instead of leaving a lingering background process during reinstalls or updates', 'Maintenance: Cleaned the codebase and desktop packaging flow by removing overlay-specific windows, assets, and Rust commands'] },
        { version: '1.1.76', date: '2026-03-02', changes: ['Desktop: Rebuilt the always-on-top overlay to match the internal floating dock structure more closely, including the same active-call card and action stack instead of a separate mini-panel concept', 'Desktop: Overlay dragging now uses native window position commands so the user can move it freely around the screen instead of depending on the previous drag-region behavior', 'Desktop: The overlay keeps Start/End Call plus Add Call available in the same compact dock style while still supporting hide and disable controls'] },
        { version: '1.1.75', date: '2026-03-02', changes: ['Mobile: Reduced scroll-linked work by removing app-shell refreshes from visualViewport scroll events and moving Floating Call Controls visibility tracking toward IntersectionObserver-driven updates', 'Mobile: Floating controls now rely less on repeated viewport geometry checks during normal page scrolling, which should make the installed mobile app feel more responsive on touch scroll', 'Maintenance: Kept the dock visibility behavior aligned with the original Call Controls while reducing unnecessary layout reads on every scroll frame'] },
        { version: '1.1.74', date: '2026-03-02', changes: ['Desktop: Fixed the overlay to inherit the same selected rate as the main window by default, so it no longer sits in a useless \"Select Rate\" state when valid rates already exist', 'Desktop: Added a dedicated draggable title bar plus tiny hide/disable controls so the overlay can be moved reliably and dismissed without reopening Settings', 'Desktop: Start Call from the overlay now forces the rate selection back through the same main-app flow before launching the live call, keeping the mini window and main window in sync'] },
        { version: '1.1.73', date: '2026-03-02', changes: ['Desktop: Added real native persistence for the overlay position so the mini window now reopens where you last dragged it instead of only remembering placement during the current session', 'Desktop: Overlay move events are now saved in the Tauri app data directory and restored on the next app launch', 'Maintenance: Kept the desktop overlay flow compatible with the existing multi-window desktop setup without affecting the web or mobile targets'] },
        { version: '1.1.72', date: '2026-03-02', changes: ['Desktop: Reworked the global overlay to match the internal floating call controls more closely with a compact active-card layout and a single circular primary action button', 'Desktop: Removed filler overlay text and extra actions so the mini window only shows the information and action that matter for the current call state', 'Desktop: Overlay windows now keep the position where the user drags them during the session instead of snapping back to the bottom-right every time they are shown'] },
        { version: '1.1.71', date: '2026-03-02', changes: ['Mobile: Prevented horizontal sideways scrolling by hardening the app shell and card containers against viewport overflow', 'Mobile: Floating Call Controls now stay expanded instead of auto-collapsing into the mini button, and only hide when the original Call Controls are actually visible', 'Android: Increased adaptive launcher foreground size so the installed app icon fills the launcher tile more like a normal native app icon'] },
        { version: '1.1.70', date: '2026-03-02', changes: ['Desktop: Added an optional always-on-top overlay window that keeps Start/End Call, live timer, and earnings visible outside the main app window', 'Desktop: Overlay actions now route back to the main Tauri window so you can start calls, end calls, add calls, or reopen the app from the mini control window', 'Prep: Added a dedicated overlay frontend and native desktop window bridge so multi-window desktop features ship without breaking the static web target'] },
        { version: '1.1.69', date: '2026-03-02', changes: ['Mobile: Added a more app-like native shell layout with safe-area-aware spacing, sticky action toolbar, and viewport-height syncing for Capacitor/standalone installs', 'Android: Unified launcher icons with the shared desktop icon source so the mobile install now uses the same product mark', 'Android: Added activity resize handling for the on-screen keyboard so forms behave more like a native app instead of a cramped browser view'] },
        { version: '1.1.68', date: '2026-03-02', changes: ['Fixed: Floating call controls now stay available whenever the original Call Controls section is genuinely out of view on mobile, regardless of scroll direction', 'Release: Added Android APK output to the public release assets so the mobile preview can be downloaded directly'] },
        { version: '1.1.67', date: '2026-03-02', changes: ['Mobile: Added a dedicated card-based Call Log layout for narrow screens so call history no longer depends on a squeezed desktop table', 'Prep: Added Capacitor + Android project scaffolding in the same repository so the app can keep one shared codebase for web, desktop, and future mobile builds', 'Improved: Mobile form inputs and action sizing were tightened further to reduce keyboard zoom and touch friction on phones'] },
        { version: '1.1.66', date: '2026-03-02', changes: ['Improved: Quick notes now opens with a larger default textarea size for first-time use on mobile and web', 'Preserved: Notes textarea height persistence still remembers the last manual resize the user left in place'] },
        { version: '1.1.65', date: '2026-03-02', changes: ['Mobile: Tightened dashboard and modal spacing so the app fits better on phone-sized screens without feeling cramped', 'Mobile: Improved call log scrolling and modal viewport behavior on small devices to reduce clipped content and awkward overflow', 'Mobile: Floating call controls now prefer compact mode on narrow screens instead of collapsing straight to icon-only so core actions stay easier to use'] },
        { version: '1.1.64', date: '2026-03-02', changes: ['Desktop: Added native Tauri file dialogs for JSON backup import/export and CSV import/export while keeping the browser download/upload fallback unchanged', 'Desktop: Added native text-file read/write commands so the installed app can work with user-chosen files more like a real desktop tool'] },
        { version: '1.1.63', date: '2026-03-02', changes: ['Desktop: Removed the enforced Tauri minimum window size so the installed app can be resized down more like the responsive browser version'] },
        { version: '1.1.62', date: '2026-03-02', changes: ['Added: Tauri desktop builds now mirror app storage to a native JSON snapshot file through Rust commands', 'Prep: Browser users keep their existing localStorage data unchanged while the desktop app gains a native persistence bridge behind the same frontend storage API'] },
        { version: '1.1.61', date: '2026-03-02', changes: ['Refactor: Introduced a shared storage adapter so the app no longer depends directly on browser localStorage calls', 'Prep: Preserved existing browser data keys to keep GitHub Pages users compatible while preparing the codebase for future Tauri-native persistence'] },
        { version: '1.1.60', date: '2026-03-02', changes: ['Improved: Active live calls now restore automatically when reopening the app instead of forcing recovery as the primary flow', 'Added: Recovered-call banner with quick Summarize and Discard actions for easier cleanup after automatic restore'] },
        { version: '1.1.59', date: '2026-03-01', changes: ['Improved: CSV Fields in Export Options now includes an inline help tooltip to explain when exporting fewer or more columns makes sense'] },
        { version: '1.1.58', date: '2026-03-01', changes: ['Improved: Export Options now includes inline help tooltips to clarify Current Call Log View vs Custom Range without adding persistent UI clutter'] },
        { version: '1.1.57', date: '2026-03-01', changes: ['Improved: Data Hub now includes inline help tooltips to explain Backups vs Call Log CSV more clearly without adding visual clutter'] },
        { version: '1.1.56', date: '2026-03-01', changes: ['Fixed: Light-mode modal surfaces are now explicit for onboarding, changelog, confirmation, payment cycle, recovery, and data import/export panels', 'Changed: Removed the RPG level requirements table entry-point to simplify the progression UI', 'Fixed: Restart Onboarding now closes Settings first and reopens the guide cleanly from the main page'] },
        { version: '1.1.55', date: '2026-03-01', changes: ['Fixed: Achievements modal now has an explicit solid panel background in light mode instead of showing transparent bleed-through', 'Fixed: Achievement detail modal now shares the same explicit light/dark panel surface styling for visual consistency'] },
        { version: '1.1.54', date: '2026-03-01', changes: ['Fixed: Tailwind class-based dark mode config is now applied after the CDN script for more reliable theme switching', 'Improved: Theme application now also updates `data-theme` and `color-scheme` for cleaner browser-level light/dark behavior'] },
        { version: '1.1.53', date: '2026-03-01', changes: ['Fixed: Tailwind dark-mode behavior now follows the app theme toggle consistently via class-based dark mode', 'Fixed: Theme icon/state mismatch caused by mixed system-theme and app-theme styling sources', 'Polish: Apply saved theme earlier in the document to reduce mixed-theme flashes on load'] },
        { version: '1.1.52', date: '2026-03-01', changes: ['Polish: Unified dashboard surface styling for a cleaner and more consistent main layout', 'Polish: Replaced the header separator with a safer HTML entity to avoid encoding artifacts', 'Docs: Refreshed roadmap to separate core stabilization work from later ideas'] },
        { version: '1.1.51', date: '2026-03-01', changes: ['Added: Minimal Data Hub modal that separates backups from Call Log CSV actions', 'Improved: Export flow now supports custom date ranges and selectable CSV fields', 'Improved: CSV import preview now supports row selection and optional rate-required importing'] },
        { version: '1.1.50', date: '2026-03-01', changes: ['Added: Export options modal to choose all history, current view, or a specific date before exporting', 'Added: Ko-fi support button alongside PayPal in the footer', 'Improved: Backup JSON and Call Log CSV exports now share the same safer scoped export flow'] },
        { version: '1.1.49', date: '2026-03-01', changes: ['Added: Call Log CSV export from Settings for spreadsheet-friendly backups', 'Improved: CSV import preview now supports status filters and clearer row-level review', 'Improved: CSV import completion now summarizes imported, duplicate, and invalid rows before closing'] },
        { version: '1.1.48', date: '2026-02-28', changes: ['Added: CSV import preview now supports manual column mapping before merging calls', 'Changed: Backup import now merges into existing local data instead of replacing it', 'Improved: Data Management import action now supports safer call-log CSV workflows without erasing prior history'] },
        { version: '1.1.47', date: '2026-02-28', changes: ['Added: Optional RPG progression toggle in Settings', 'Changed: XP is now granted only for calls completed while RPG progression is enabled', 'Changed: Achievements remain available when RPG is off, while XP and multiplier references are hidden'] },
        { version: '1.1.46', date: '2026-02-26', changes: ['Added: New all-time achievement "Bounce Back" for returning after a 3+ day break', 'Added: Goal Mastery achievements (7 and 30 goal-hit days) with progress tracking', 'Changed: Removed Achievements shortcut from Settings (trophy button remains the single entry-point)'] },
        { version: '1.1.45', date: '2026-02-26', changes: ['Added: Daily Quests section with automatic day-based rotation and progress bars', 'Added: Daily quest XP rewards now contribute to unified total XP progression', 'Changed: Rebalanced all-time earnings milestone from $100/day to $100/week for fairer progression'] },
        { version: '1.1.44', date: '2026-02-26', changes: ['Changed: Streak multiplier now applies to call XP as well (not only achievement rewards)', 'Changed: Achievement XP reward now scales by level only for simpler/fairer understanding', 'Fixed: Achievements modal footer layout so Done button remains inside modal container'] },
        { version: '1.1.43', date: '2026-02-26', changes: ['Fixed: Tooltip speech-bubbles no longer clip in stats panel layout', 'Fixed: Achievements modal Done action now sits at the true end of scrollable content (no sticky overlap)'] },
        { version: '1.1.42', date: '2026-02-26', changes: ['Added: Contextual "?" help tooltips with hover speech-bubble explanations in RPG/Achievements UI', 'Improved: Achievement summary now includes inline explanation for streak reward multiplier logic'] },
        { version: '1.1.41', date: '2026-02-26', changes: ['Improved: Added explicit XP-gained popup on call completion (live + manual add)', 'Clarified: XP feedback now appears alongside save confirmation to make progression visible every session'] },
        { version: '1.1.40', date: '2026-02-26', changes: ['Improved: Achievement cards now show XP earned only after unlock (hidden for locked achievements)', 'Improved: Achievement unlock toasts now explicitly include achievement name + XP gained in a single lightweight popup'] },
        { version: '1.1.39', date: '2026-02-26', changes: ['Added: One-time XP rewards for achievement unlocks', 'Added: Achievement reward scaling by current level and active streak at unlock time', 'Added: Persistent bonus XP ledger to prevent duplicate reward grants and support fair long-term progression'] },
        { version: '1.1.38', date: '2026-02-26', changes: ['Changed: Replaced $150/day achievement with an all-time earnings milestone for fairer long-term progression'] },
        { version: '1.1.37', date: '2026-02-26', changes: ['Changed: Removed rate-usage achievements to better match one-rate workflows', 'Changed: Rebalanced high daily earnings milestone from $250/day to $150/day for fairer progression'] },
        { version: '1.1.36', date: '2026-02-26', changes: ['Changed: Achievements modal now opens as a standalone modal (not docked with Settings)', 'Improved: Trophy quick-access opens Achievements directly without opening Settings first', 'Improved: Settings Achievements button now transitions to standalone Achievements view'] },
        { version: '1.1.35', date: '2026-02-26', changes: ['Added: Trophy entry-point and dedicated Achievements modal docked next to Settings', 'Added: Passive badge system with mixed difficulty milestones (calls, streaks, earnings, consistency)', 'Added: Live achievement unlock detection with toast notifications and persistent collected badge state'] },
        { version: '1.1.34', date: '2026-02-26', changes: ['Added: Work RPG level progress card (Level, total XP, XP left, and progress bar)', 'Added: Fair level curve table with per-level XP requirements', 'Added: Level requirements modal for transparent progression planning'] },
        { version: '1.1.33', date: '2026-02-26', changes: ['Added: Onboarding progress tracker (0/3 to 3/3) in the welcome modal', 'Added: Step completion now follows real actions (first rate saved, first call saved, settings opened)', 'Added: Restart Onboarding action in Settings for quick testing and guided re-runs'] },
        { version: '1.1.32', date: '2026-02-26', changes: ['Improved: Onboarding now displays a single next-step cue to keep guidance simple and low-noise', 'Improved: Quick Start now executes a real first action flow (open first setup step + contextual highlight)', 'Polish: Added lightweight guided highlights and smoother cue transitions for a more interactive first-use experience'] },
        { version: '1.1.31', date: '2026-02-26', changes: ['Improved: Onboarding now shows one prioritized cue at a time for lower visual noise', 'Improved: Quick Start now launches an interactive first step (opens Add Rate and highlights target area)', 'Polish: Added smoother onboarding card motion and visual emphasis for guided actions'] },
        { version: '1.1.30', date: '2026-02-26', changes: ['Added: First-run Welcome modal with Quick Start, Customize First, and Skip actions', 'Added: Progressive onboarding cue cards for rates, call test flow, and settings customization', 'Added: Dismiss/seen onboarding persistence in localStorage to keep onboarding friction low'] },
        { version: '1.1.29', date: '2026-02-26', changes: ['Performance: Added cached call filtering with date-keyed invalidation to reduce repeated list scans', 'Performance: Added progressive chunk rendering for Call Log to prevent large-list UI blocking', 'Performance: Added batched localStorage writes with safe flush-on-unload to reduce main-thread stalls'] },
        { version: '1.1.28', date: '2026-02-26', changes: ['Changed: Removed Secure Sync feature and restored Settings to a single General flow', 'Changed: Removed Settings tab segmentation and returned Data Management/Storage to main Settings body', 'Docs: Updated README and roadmap to reflect manual JSON backup/import only'] },
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
        { version: '1.0.5', date: '2026-02-12', changes: ['Fixed: Footer version now always matches APP_VERSION', 'Fixed: Contact form email is now optional (no longer required)','Chore: Simplified dailyGoal storage to a single source of truth', 'Chore: Added legacy fallback read for old dailyGoal keys', 'Fixed: Call modal can now be closed via X and Cancel (no longer stuck)','Fixed: Saving a call no longer refreshes the page (form submit prevented)', 'Improved: Call edits/additions now update UI instantly without full page reload','Improved: Add Call now always opens in clean "Add" mode (resets editing state)'] },
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

  // Newest entries first.
  const sorted = [...CHANGELOG].sort((a, b) => {
    // Prefer release date when available; otherwise sort by version.
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

function isStandaloneDisplayMode() {
    try {
        return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true);
    } catch (error) {
        return false;
    }
}

function isNativeAppShell() {
    try {
        const protocol = String(window.location?.protocol || '');
        return Boolean(window.Capacitor) || protocol === 'capacitor:' || protocol === 'ionic:' || isStandaloneDisplayMode();
    } catch (error) {
        return isStandaloneDisplayMode();
    }
}

function applyAppShellMode() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.toggle('native-app-shell', isNativeAppShell());
    root.style.setProperty('--app-shell-vh', `${window.innerHeight * 0.01}px`);
}

const scheduleAppShellRefresh = createRafScheduler(applyAppShellMode);
const scheduleDesktopOverlayRefresh = () => {};

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

function formatLocalTimeForInput(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (!Number.isFinite(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return ss === '00' ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
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

function findMatchingRate(rawValue) {
  const raw = String(rawValue || '').trim();
  if (!raw) return null;
  const byName = rates.find((rate) => String(rate.name).trim().toLowerCase() === raw.toLowerCase());
  if (byName) return { amount: Number(byName.amount) || 0, rateName: byName.name, source: 'name' };

  const numeric = raw.replace(/[^0-9.\-]/g, '');
  const amount = Number(numeric);
  if (Number.isFinite(amount) && amount > 0) {
    const byAmount = rates.find((rate) => Math.abs((Number(rate.amount) || 0) - amount) < 0.0001);
    return {
      amount,
      rateName: byAmount ? byAmount.name : '',
      source: byAmount ? 'matched_amount' : 'numeric'
    };
  }
  return null;
}

function getCallDuplicateKey(call) {
  const startIso = call?.startTime ? new Date(call.startTime).toISOString() : '';
  const endIso = call?.endTime ? new Date(call.endTime).toISOString() : '';
  return `${startIso}|${endIso}`;
}

function formatPreviewDate(dateObj) {
  if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) return '--';
  return formatDateForInput(dateObj);
}

function formatPreviewTime(dateObj) {
  if (!(dateObj instanceof Date) || !Number.isFinite(dateObj.getTime())) return '--';
  return formatLocalTimeForInput(dateObj.toISOString());
}

function escapeCsvCell(value) {
  const raw = value == null ? '' : String(value);
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function formatCallDateTimeForExport(isoString, timeZone) {
  const date = new Date(isoString);
  if (!Number.isFinite(date.getTime())) return { date: '', time: '' };
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || '';
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}:${get('second')}`
  };
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

const tauriInvoke = window.WTTEnv?.isTauri && typeof window.__TAURI_INTERNALS__?.invoke === 'function'
    ? window.__TAURI_INTERNALS__.invoke
    : null;
const tauriTransformCallback = window.WTTEnv?.isTauri && typeof window.__TAURI_INTERNALS__?.transformCallback === 'function'
    ? window.__TAURI_INTERNALS__.transformCallback
    : null;
const isDesktopTauri = !!(window.WTTEnv?.isTauri && !window.Capacitor);
const UPDATE_MANIFEST_URLS = [
    'https://untopo.github.io/work-time-tracker/version.json',
    './version.json'
];
const UPDATE_DISMISSED_VERSION_KEY = 'dismissedUpdateVersion';
const RELEASE_SPOTLIGHT_SEEN_PREFIX = 'releaseSpotlightSeen:';
const GOATCOUNTER_SITE_CODE_KEY = 'wtt_goatcounter_site_code';
const GOATCOUNTER_SCRIPT_ID = 'wtt-goatcounter-script';
const GOATCOUNTER_DEFAULT_SITE_CODE = 'untopo';
const updateAvailableBanner = document.getElementById('update-available-banner');
const updateCurrentVersionLabel = document.getElementById('update-current-version');
const updateLatestVersionLabel = document.getElementById('update-latest-version');
const updateNotesLabel = document.getElementById('update-notes');
const openUpdateReleaseBtn = document.getElementById('open-update-release-btn');
const laterUpdateBannerBtn = document.getElementById('later-update-banner-btn');
const dismissUpdateBannerBtn = document.getElementById('dismiss-update-banner-btn');
let pendingUpdateManifest = null;
let releaseSpotlightBannerEl = null;
let androidWidgetBridgeTimerId = null;
const NATIVE_WIDGET_CALLS_KEY = '__wtt_native_widget_calls';
const NATIVE_WIDGET_ACTIVE_SESSION_KEY = '__wtt_native_widget_active_session';
let lastAndroidWidgetDefaultRateSnapshot = null;
let lastAndroidWidgetActiveSessionSnapshot = null;
let androidWidgetBridgeInFlight = false;

function createTauriEventTarget(label) {
    return typeof label === 'string' && label
        ? { kind: 'AnyLabel', label }
        : { kind: 'Any' };
}

async function tauriEmitTo(label, event, payload) {
    if (!tauriInvoke) return;
    await tauriInvoke('plugin:event|emit_to', {
        target: createTauriEventTarget(label),
        event,
        payload
    });
}

async function tauriListen(event, handler, targetLabel) {
    if (!tauriInvoke || !tauriTransformCallback) return null;
    return tauriInvoke('plugin:event|listen', {
        event,
        target: createTauriEventTarget(targetLabel),
        handler: tauriTransformCallback(handler)
    });
}

function getFileNameFromPath(filePath) {
    const parts = String(filePath || '').split(/[\\/]/);
    return parts[parts.length - 1] || '';
}

function shouldCheckForInstalledAppUpdates() {
    return isDesktopTauri || Boolean(window.Capacitor);
}

function isAndroidCapacitorApp() {
    try {
        return Boolean(window.Capacitor)
            && typeof window.Capacitor.getPlatform === 'function'
            && window.Capacitor.getPlatform() === 'android';
    } catch (error) {
        return false;
    }
}

function getLiveCallWidgetPlugin() {
    if (!isAndroidCapacitorApp()) return null;
    return window.Capacitor?.Plugins?.LiveCallWidget || null;
}

function resolvePreferredAndroidWidgetRate() {
    if (!Array.isArray(rates) || rates.length === 0) return null;
    const selectedRateName = String(rateSelect?.value || '').trim();
    const selectedRate = rates.find((rate) => String(rate.name || '').trim() === selectedRateName);
    if (selectedRate) return selectedRate;

    const storedRateName = String(lastSelectedRate || '').trim();
    const storedRate = rates.find((rate) => String(rate.name || '').trim() === storedRateName);
    if (storedRate) return storedRate;

    return rates[0] || null;
}

function buildAndroidWidgetDefaultRateSnapshot(preferredRate = resolvePreferredAndroidWidgetRate()) {
    return JSON.stringify({
        rateName: preferredRate?.name || '',
        rateAmount: Number(preferredRate?.amount) || 0
    });
}

function buildAndroidWidgetActiveSessionSnapshot(session = LiveCallSession.getState()) {
    if (!session) return JSON.stringify({ active: false });
    return JSON.stringify({
        active: true,
        start: Number(session.start) || 0,
        rateName: String(session.rateName || rateSelect?.value || '').trim(),
        rateAmount: Number(session.rate) || 0
    });
}

async function syncAndroidWidgetDefaultRate() {
    const plugin = getLiveCallWidgetPlugin();
    if (!plugin?.setDefaultRate) return;
    try {
        const preferredRate = resolvePreferredAndroidWidgetRate();
        const nextSnapshot = buildAndroidWidgetDefaultRateSnapshot(preferredRate);
        if (nextSnapshot === lastAndroidWidgetDefaultRateSnapshot) return;
        await plugin.setDefaultRate({
            rateName: preferredRate?.name || '',
            rateAmount: Number(preferredRate?.amount) || 0
        });
        lastAndroidWidgetDefaultRateSnapshot = nextSnapshot;
    } catch (error) {
        console.warn('Failed to sync Android widget default rate.', error);
    }
}

async function syncAndroidWidgetActiveSession() {
    const plugin = getLiveCallWidgetPlugin();
    if (!plugin?.syncActiveSession) return;
    try {
        const session = LiveCallSession.getState();
        if (!session) {
            const inactiveSnapshot = buildAndroidWidgetActiveSessionSnapshot(null);
            if (inactiveSnapshot === lastAndroidWidgetActiveSessionSnapshot) return;
            await plugin.syncActiveSession({ active: false });
            lastAndroidWidgetActiveSessionSnapshot = inactiveSnapshot;
            return;
        }

        const rateName = String(session.rateName || rateSelect?.value || '').trim();
        const rateAmount = Number(session.rate) || 0;
        if (!rateName || rateAmount <= 0) {
            const inactiveSnapshot = buildAndroidWidgetActiveSessionSnapshot(null);
            if (inactiveSnapshot === lastAndroidWidgetActiveSessionSnapshot) return;
            await plugin.syncActiveSession({ active: false });
            lastAndroidWidgetActiveSessionSnapshot = inactiveSnapshot;
            return;
        }

        const nextSnapshot = buildAndroidWidgetActiveSessionSnapshot({
            ...session,
            rateName,
            rate: rateAmount
        });
        if (nextSnapshot === lastAndroidWidgetActiveSessionSnapshot) return;
        await plugin.syncActiveSession({
            active: true,
            start: session.start,
            rateName,
            rateAmount
        });
        lastAndroidWidgetActiveSessionSnapshot = nextSnapshot;
    } catch (error) {
        console.warn('Failed to sync Android widget active session.', error);
    }
}

async function consumeAndroidWidgetCompletedCalls() {
    const plugin = getLiveCallWidgetPlugin();
    if (!plugin?.consumeCompletedCalls) return;
    try {
        const result = await plugin.consumeCompletedCalls();
        const rawCalls = String(result?.callsJson || '').trim();
        if (!rawCalls) return;

        let parsedCalls = [];
        try {
            parsedCalls = JSON.parse(rawCalls);
        } catch (parseError) {
            console.warn('Failed to parse Android widget completed calls.', parseError);
            return;
        }

        if (!Array.isArray(parsedCalls) || parsedCalls.length === 0) return;

        const importedCalls = parsedCalls.map(normalizeCall);
        const existingCalls = readCallsFromStorage();
        const mergeResult = mergeCallsWithExisting(existingCalls, importedCalls);
        if (mergeResult.addedCount === 0) return;

        // The widget has already stopped this session natively. If the app restored
        // the same session while it was open, clear the local runtime state so it
        // does not keep ticking or get re-synced back to Android.
        LiveCallSession.clear();
        clearActiveCallState();
        clearActiveCallClosedExplicitly();
        resetLiveCallUiToIdle();

        calls = mergeResult.merged;
        saveCalls();
        showToast(`Imported ${mergeResult.addedCount} widget call${mergeResult.addedCount === 1 ? '' : 's'}.`);
    } catch (error) {
        console.warn('Failed to import completed calls from Android widget.', error);
    }
}

async function processNativeAndroidWidgetSyncPayload() {
    if (!isAndroidCapacitorApp()) return false;

    const rawCalls = String(window.localStorage.getItem(NATIVE_WIDGET_CALLS_KEY) || '').trim();
    const rawSession = String(window.localStorage.getItem(NATIVE_WIDGET_ACTIVE_SESSION_KEY) || '').trim();
    if (!rawCalls && !rawSession) return false;

    let importedAny = false;

    if (rawCalls) {
        try {
            const parsedCalls = JSON.parse(rawCalls);
            if (Array.isArray(parsedCalls) && parsedCalls.length > 0) {
                const importedCalls = parsedCalls.map(normalizeCall);
                const existingCalls = readCallsFromStorage();
                const mergeResult = mergeCallsWithExisting(existingCalls, importedCalls);
                if (mergeResult.addedCount > 0) {
                    calls = mergeResult.merged;
                    saveCalls();
                    LiveCallSession.clear();
                    clearActiveCallState();
                    clearActiveCallClosedExplicitly();
                    resetLiveCallUiToIdle();
                    showToast(`Imported ${mergeResult.addedCount} widget call${mergeResult.addedCount === 1 ? '' : 's'}.`);
                    importedAny = true;
                }
            }
        } catch (error) {
            console.warn('Failed to process native Android widget calls payload.', error);
        }
    }

    if (rawSession) {
        try {
            const parsedSession = JSON.parse(rawSession);
            const normalizedSession = normalizeActiveCallSession(parsedSession);
            if (normalizedSession && !LiveCallSession.isActive() && !readActiveCallState()) {
                autoRestoreRecoveredActiveCall(normalizedSession);
                importedAny = true;
            }
        } catch (error) {
            console.warn('Failed to process native Android widget session payload.', error);
        }
    }

    window.localStorage.removeItem(NATIVE_WIDGET_CALLS_KEY);
    window.localStorage.removeItem(NATIVE_WIDGET_ACTIVE_SESSION_KEY);

    try {
        await consumeAndroidWidgetCompletedCalls();
    } catch (error) {
        console.warn('Failed to clear consumed Android widget payload.', error);
    }

    return importedAny;
}

async function reconcileAndroidWidgetSession() {
    const plugin = getLiveCallWidgetPlugin();
    if (!plugin?.getWidgetState) return;
    try {
        if (LiveCallSession.isActive()) {
            await syncAndroidWidgetActiveSession();
            return;
        }

        const currentStoredState = readActiveCallState();
        if (currentStoredState) return;

        const result = await plugin.getWidgetState();
        const rawSession = String(result?.activeSessionJson || '').trim();
        if (!rawSession) return;

        let parsedSession = null;
        try {
            parsedSession = JSON.parse(rawSession);
        } catch (parseError) {
            console.warn('Failed to parse Android widget active session.', parseError);
            return;
        }

        const normalizedSession = normalizeActiveCallSession(parsedSession);
        if (!normalizedSession) return;

        autoRestoreRecoveredActiveCall(normalizedSession);
    } catch (error) {
        console.warn('Failed to reconcile Android widget session.', error);
    }
}

async function initializeAndroidWidgetBridge() {
    if (!isAndroidCapacitorApp()) return;
    if (androidWidgetBridgeInFlight) return;
    androidWidgetBridgeInFlight = true;
    try {
    await processNativeAndroidWidgetSyncPayload();
    await consumeAndroidWidgetCompletedCalls();
    await reconcileAndroidWidgetSession();
    await syncAndroidWidgetDefaultRate();
    if (LiveCallSession.isActive()) {
        await syncAndroidWidgetActiveSession();
    }
    } finally {
        androidWidgetBridgeInFlight = false;
    }
}

function scheduleAndroidWidgetBridgeRefresh(delayMs = 0) {
    if (!isAndroidCapacitorApp()) return;
    const normalizedDelay = Math.max(0, Number(delayMs) || 0);
    window.setTimeout(() => {
        void initializeAndroidWidgetBridge();
    }, normalizedDelay);
}

window.addEventListener('wtt-live-call-widget-sync', () => {
    void processNativeAndroidWidgetSyncPayload();
});

function normalizeVersionString(version) {
    return String(version || '')
        .trim()
        .replace(/^v/i, '');
}

function parseVersionParts(version) {
    return normalizeVersionString(version)
        .split('.')
        .map((part) => Number.parseInt(part, 10) || 0);
}

function isRemoteVersionNewer(remoteVersion, localVersion) {
    const remoteParts = parseVersionParts(remoteVersion);
    const localParts = parseVersionParts(localVersion);
    const total = Math.max(remoteParts.length, localParts.length, 3);
    for (let i = 0; i < total; i += 1) {
        const remote = remoteParts[i] || 0;
        const local = localParts[i] || 0;
        if (remote !== local) return remote > local;
    }
    return false;
}

function hideUpdateAvailableBanner() {
    if (!updateAvailableBanner) return;
    updateAvailableBanner.classList.add('hidden');
}

async function openExternalUrl(url) {
    const safeUrl = String(url || '').trim();
    if (!/^https?:\/\//i.test(safeUrl)) return;
    if (isDesktopTauri && tauriInvoke) {
        try {
            await tauriInvoke('open_external_url', { url: safeUrl });
            return;
        } catch (error) {
            console.error('Failed to open external URL via Tauri:', error);
        }
    }
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
}

async function fetchUpdateManifest() {
    for (const baseUrl of UPDATE_MANIFEST_URLS) {
        try {
            const separator = baseUrl.includes('?') ? '&' : '?';
            const response = await fetch(`${baseUrl}${separator}t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) continue;
            const payload = await response.json();
            if (payload && typeof payload === 'object' && payload.latestVersion) {
                return payload;
            }
        } catch (error) {
            console.debug('Update manifest fetch failed for', baseUrl, error);
        }
    }
    return null;
}

function renderUpdateAvailableBanner(manifest) {
    if (!updateAvailableBanner || !manifest) return;
    pendingUpdateManifest = manifest;
    if (updateCurrentVersionLabel) updateCurrentVersionLabel.textContent = `v${normalizeVersionString(APP_VERSION)}`;
    if (updateLatestVersionLabel) updateLatestVersionLabel.textContent = `v${normalizeVersionString(manifest.latestVersion)}`;
    if (updateNotesLabel) {
        updateNotesLabel.textContent = String(manifest.notes || 'A newer installer is available for download.');
    }
    updateAvailableBanner.classList.remove('hidden');
}

function dismissUpdateAvailableBannerForVersion(version) {
    const normalized = normalizeVersionString(version);
    if (normalized) appStorage.setItem(UPDATE_DISMISSED_VERSION_KEY, normalized);
    hideUpdateAvailableBanner();
}

async function checkForInstalledAppUpdates() {
    if (!shouldCheckForInstalledAppUpdates()) return;
    const manifest = await fetchUpdateManifest();
    if (!manifest?.latestVersion) return;
    if (!isRemoteVersionNewer(manifest.latestVersion, APP_VERSION)) return;
    const dismissedVersion = normalizeVersionString(appStorage.getItem(UPDATE_DISMISSED_VERSION_KEY));
    const latestVersion = normalizeVersionString(manifest.latestVersion);
    if (dismissedVersion && dismissedVersion === latestVersion) return;
    renderUpdateAvailableBanner(manifest);
}

function sanitizeGoatCounterSiteCode(value) {
    const code = String(value || '').trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(code)) return '';
    return code;
}

function readGoatCounterSiteCode() {
    const stored = sanitizeGoatCounterSiteCode(appStorage.getItem(GOATCOUNTER_SITE_CODE_KEY));
    if (stored) return stored;
    return sanitizeGoatCounterSiteCode(GOATCOUNTER_DEFAULT_SITE_CODE);
}

function persistGoatCounterSiteCode(code) {
    const safeCode = sanitizeGoatCounterSiteCode(code);
    if (!safeCode) {
        appStorage.removeItem(GOATCOUNTER_SITE_CODE_KEY);
        return '';
    }
    appStorage.setItem(GOATCOUNTER_SITE_CODE_KEY, safeCode);
    return safeCode;
}

function applyGoatCounterUrlOverrides() {
    let changed = false;
    try {
        const params = new URLSearchParams(window.location.search);
        const setSite = params.get('wtt_gc_site');

        if (setSite !== null) {
            persistGoatCounterSiteCode(setSite);
            changed = true;
        }
    } catch (error) {
        console.warn('Could not parse GoatCounter URL overrides', error);
    }
    return changed;
}

function loadGoatCounterScript(siteCode) {
    if (!siteCode) return false;
    if (document.getElementById(GOATCOUNTER_SCRIPT_ID)) return true;

    const script = document.createElement('script');
    script.id = GOATCOUNTER_SCRIPT_ID;
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = `https://${siteCode}.goatcounter.com/count`;
    script.onerror = () => {
        console.warn('GoatCounter script failed to load.');
    };
    document.head.appendChild(script);
    return true;
}

function setupGoatCounterAnalytics() {
    if (isDesktopTauri || Boolean(window.Capacitor)) return;
    applyGoatCounterUrlOverrides();
    const siteCode = readGoatCounterSiteCode();
    if (!siteCode) return;
    loadGoatCounterScript(siteCode);
}

function registerGoatCounterDebugApi() {
    if (window.WTTGoatCounter) return;
    window.WTTGoatCounter = {
        setSiteCode(siteCode) {
            const safeCode = persistGoatCounterSiteCode(siteCode);
            if (!safeCode) {
                throw new Error('Invalid GoatCounter site code. Example: "untopo"');
            }
            loadGoatCounterScript(safeCode);
            return this.status();
        },
        status() {
            return {
                siteCode: readGoatCounterSiteCode(),
                activeInPage: !!document.getElementById(GOATCOUNTER_SCRIPT_ID)
            };
        }
    };
}

function getReleaseSpotlightSeenKey(version = APP_VERSION) {
    return `${RELEASE_SPOTLIGHT_SEEN_PREFIX}${normalizeVersionString(version)}`;
}

function hasSeenReleaseSpotlight(version = APP_VERSION) {
    try {
        return appStorage.getItem(getReleaseSpotlightSeenKey(version)) === '1';
    } catch {
        return false;
    }
}

function markReleaseSpotlightSeen(version = APP_VERSION) {
    try {
        appStorage.setItem(getReleaseSpotlightSeenKey(version), '1');
    } catch (error) {
        console.warn('Could not persist release spotlight state', error);
    }
}

function hideReleaseSpotlightBanner({ markSeen = true } = {}) {
    if (releaseSpotlightBannerEl && releaseSpotlightBannerEl.parentNode) {
        releaseSpotlightBannerEl.parentNode.removeChild(releaseSpotlightBannerEl);
    }
    releaseSpotlightBannerEl = null;
    if (markSeen) markReleaseSpotlightSeen(APP_VERSION);
}

function getCurrentReleaseEntry() {
    const currentVersion = normalizeVersionString(APP_VERSION);
    return CHANGELOG.find((entry) => normalizeVersionString(entry?.version) === currentVersion) || null;
}

function shouldShowReleaseSpotlightBanner() {
    if (isDesktopTauri || Boolean(window.Capacitor)) return false;
    if (isNativeAppShell()) return false;
    if (hasSeenReleaseSpotlight(APP_VERSION)) return false;
    const releaseEntry = getCurrentReleaseEntry();
    return !!releaseEntry;
}

function renderReleaseSpotlightBanner() {
    if (releaseSpotlightBannerEl || !shouldShowReleaseSpotlightBanner()) return;
    const releaseEntry = getCurrentReleaseEntry();
    if (!releaseEntry) return;

    const topChanges = Array.isArray(releaseEntry.changes) ? releaseEntry.changes.slice(0, 2) : [];
    const summary = topChanges.length
        ? topChanges.join(' ')
        : 'This release includes improvements and fixes.';

    const wrapper = document.createElement('div');
    wrapper.className = 'release-spotlight-banner';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-live', 'polite');
    wrapper.innerHTML = `
        <div class="release-spotlight-content">
            <div>
                <div class="release-spotlight-title">What's New in v${escapeHTML(normalizeVersionString(APP_VERSION))}</div>
                <p class="release-spotlight-text">${escapeHTML(summary)}</p>
                <div class="release-spotlight-actions">
                    <button type="button" class="release-spotlight-btn release-spotlight-btn-primary" data-release-action="details">View details</button>
                    <button type="button" class="release-spotlight-btn release-spotlight-btn-muted" data-release-action="dismiss">Got it</button>
                </div>
            </div>
            <button type="button" class="release-spotlight-close" aria-label="Close release notice" data-release-action="close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    const handleAction = (action) => {
        if (action === 'details') {
            hideReleaseSpotlightBanner({ markSeen: true });
            openChangelogModal();
            return;
        }
        hideReleaseSpotlightBanner({ markSeen: true });
    };

    wrapper.querySelectorAll('[data-release-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
            handleAction(btn.getAttribute('data-release-action'));
        });
    });

    document.body.appendChild(wrapper);
    releaseSpotlightBannerEl = wrapper;
}

function scheduleReleaseSpotlightBanner() {
    if (!shouldShowReleaseSpotlightBanner()) return;
    window.setTimeout(() => {
        if (onboardingModal && ModalManager.isOpen(onboardingModal)) {
            window.setTimeout(() => renderReleaseSpotlightBanner(), 1400);
            return;
        }
        renderReleaseSpotlightBanner();
    }, 650);
}

async function pickNativeImportFile(mode) {
    if (!tauriInvoke) return null;
    const path = await tauriInvoke('pick_import_file', { fileKind: mode === 'csv' ? 'csv' : 'json' });
    if (!path) return null;
    const text = await tauriInvoke('read_text_file', { path });
    return {
        path,
        name: getFileNameFromPath(path),
        text: String(text || '')
    };
}

async function saveTextWithNativeDialog(fileKind, suggestedFileName, text) {
    if (!tauriInvoke) return false;
    const path = await tauriInvoke('pick_export_file', {
        defaultName: suggestedFileName,
        fileKind: fileKind === 'csv' ? 'csv' : 'json'
    });
    if (!path) return false;
    await tauriInvoke('write_text_file', { path, content: text });
    return true;
}

function getCurrentExportScope() {
    if (exportScopeRangeInput?.checked) return 'range';
    if (exportScopeDateInput?.checked) return 'date';
    if (exportScopeCurrentInput?.checked) return 'current';
    return 'all';
}

function getCurrentCallLogViewLabel() {
    if (callLogFilter === 'today') return 'Today';
    if (callLogFilter === 'week') return 'Week';
    if (callLogFilter === 'month') return 'Month';
    if (callLogFilter === 'date') {
        const selectedDate = statsDatePicker?.value || getTodayDateString();
        return `Date (${selectedDate})`;
    }
    return 'Current View';
}

function getCallsForExportScope(scope, specificDateValue = '') {
    const storedCalls = readCallsFromStorage();
    if (scope === 'current') {
        return getFilteredCallsCached().map(normalizeCall);
    }
    if (scope === 'date') {
        const selectedDate = parseDateInput(specificDateValue);
        if (!selectedDate) return [];
        const startMs = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
        const endMs = startMs + (24 * 60 * 60 * 1000);
        return storedCalls.filter((call) => {
            const callStartMs = getCallStartMs(call);
            return callStartMs >= startMs && callStartMs < endMs;
        });
    }
    if (scope === 'range') {
        const startDate = parseDateInput(exportRangeStartInput?.value || '');
        const endDate = parseDateInput(exportRangeEndInput?.value || '');
        if (!startDate || !endDate) return [];
        const startMs = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
        const endMs = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1).getTime();
        return storedCalls.filter((call) => {
            const callStartMs = getCallStartMs(call);
            return callStartMs >= startMs && callStartMs < endMs;
        });
    }
    return storedCalls;
}

function getExportFileDateSuffix() {
    return new Date().toISOString().slice(0, 10);
}

function getSelectedExportCsvFields() {
    return [
        { key: 'date', label: 'Call Date', enabled: !!exportFieldDate?.checked },
        { key: 'start', label: 'Start Time', enabled: !!exportFieldStart?.checked },
        { key: 'end', label: 'End Time', enabled: !!exportFieldEnd?.checked },
        { key: 'duration', label: 'Duration', enabled: !!exportFieldDuration?.checked },
        { key: 'rateName', label: 'Rate Name', enabled: !!exportFieldRateName?.checked },
        { key: 'rateAmount', label: 'Rate Amount', enabled: !!exportFieldRateAmount?.checked },
        { key: 'earnings', label: 'Earnings', enabled: !!exportFieldEarnings?.checked }
    ];
}

async function exportCallsAsCsv(exportCalls) {
    const userTimeZone = getUserTimeZone();
    const selectedFields = getSelectedExportCsvFields().filter((field) => field.enabled);
    const csvRows = [
        selectedFields.map((field) => field.label)
    ];

    exportCalls
        .slice()
        .sort((a, b) => getCallStartMs(a) - getCallStartMs(b))
        .forEach((call) => {
            const start = formatCallDateTimeForExport(call.startTime, userTimeZone);
            const end = formatCallDateTimeForExport(call.endTime, userTimeZone);
            const valueMap = {
                date: start.date,
                start: start.time,
                end: end.time,
                duration: msToHMS(Number(call.duration) || 0),
                rateName: call.rateName || '',
                rateAmount: Number(call.rate || 0).toFixed(2),
                earnings: Number(getCallEarnings(call) || 0).toFixed(2)
            };
            csvRows.push(selectedFields.map((field) => valueMap[field.key] ?? ''));
        });

    const csvText = csvRows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
    const fileName = `work-time-tracker-call-log-${getExportFileDateSuffix()}.csv`;
    if (tauriInvoke) {
        return saveTextWithNativeDialog('csv', fileName, csvText);
    }
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, fileName);
    return true;
}

async function exportCallsAsJson(exportCalls) {
    const exportCallsClone = exportCalls.map((call) => ({ ...call }));
    try {
        const flags = loadFeatureFlags();
        if (!flags.notes) {
            exportCallsClone.forEach((call) => { delete call.notes; });
        }
    } catch (e) {}

    const data = {
        calls: exportCallsClone,
        rates: rates,
        dailyGoal: dailyGoal,
        paymentCyclesEnabled: paymentCyclesEnabled,
        paymentCycles: paymentCycles
    };
    const jsonText = JSON.stringify(data, null, 2);
    const fileName = `work-time-tracker-data-${getExportFileDateSuffix()}.json`;
    if (tauriInvoke) {
        return saveTextWithNativeDialog('json', fileName, jsonText);
    }
    const blob = new Blob([jsonText], { type: 'application/json' });
    downloadBlob(blob, fileName);
    return true;
}

function openDataHubModal() {
    ModalManager.open(dataHubModal, { focusSelector: '#data-hub-export-json-btn' });
}

function closeDataHubModal() {
    if (dataHubModal) ModalManager.close(dataHubModal);
}

async function processImportedText(fileName, text) {
    const lowerName = String(fileName || '').toLowerCase();
    try {
        const expectedMode = pendingImportMode;
        const isCsv = lowerName.endsWith('.csv');
        const isJson = lowerName.endsWith('.json');
        if (expectedMode === 'csv' && !isCsv) {
            throw new Error('Please choose a CSV call log file.');
        }
        if (expectedMode === 'json' && !isJson) {
            throw new Error('Please choose a JSON backup file.');
        }
        if (isCsv) {
            const csvImportData = parseCsvImportFile(text);
            closeDataHubModal();
            openCsvImportPreviewModal(csvImportData);
        } else {
            closeDataHubModal();
            const importedData = JSON.parse(String(text || ''));
            importJsonBackup(importedData);
        }
    } catch (error) {
        showAlertModal('Import Failed', String(error?.message || '').includes('choose a')
            ? String(error.message)
            : lowerName.endsWith('.csv')
                ? 'Failed to parse the CSV file. Please check the file format and required columns.'
                : 'Failed to import file. Please ensure it is a valid JSON file from this app.');
        console.error('Import error:', error);
    } finally {
        pendingImportMode = null;
        if (importFile) importFile.value = '';
    }
}

async function openImportFilePicker(mode) {
    pendingImportMode = mode;
    if (tauriInvoke) {
        const nativeFile = await pickNativeImportFile(mode);
        if (!nativeFile) {
            pendingImportMode = null;
            return;
        }
        await processImportedText(nativeFile.name, nativeFile.text);
        return;
    }
    if (!importFile) return;
    if (mode === 'json') {
        importFile.accept = '.json,application/json';
    } else {
        importFile.accept = '.csv,text/csv';
    }
    importFile.value = '';
    importFile.click();
}

function refreshExportOptionsModalState() {
    if (!exportSpecificDateInput) return;
    const scope = getCurrentExportScope();
    exportSpecificDateInput.disabled = scope !== 'date';
    if (exportRangeStartInput) exportRangeStartInput.disabled = scope !== 'range';
    if (exportRangeEndInput) exportRangeEndInput.disabled = scope !== 'range';
    if (scope === 'date' && !exportSpecificDateInput.value) {
        exportSpecificDateInput.value = statsDatePicker?.value || getTodayDateString();
    }
    if (scope === 'range') {
        if (exportRangeStartInput && !exportRangeStartInput.value) exportRangeStartInput.value = statsDatePicker?.value || getTodayDateString();
        if (exportRangeEndInput && !exportRangeEndInput.value) exportRangeEndInput.value = statsDatePicker?.value || getTodayDateString();
    }
    if (exportCurrentViewLabel) {
        exportCurrentViewLabel.textContent = `Use the same calls shown by your current ${getCurrentCallLogViewLabel()} filter.`;
    }
    if (exportFieldsCard) {
        exportFieldsCard.style.display = pendingExportFormat === 'csv' ? '' : 'none';
    }
    if (exportOptionsWarning) {
        exportOptionsWarning.style.display = 'none';
        exportOptionsWarning.textContent = '';
    }
}

function openExportOptionsModal(format) {
    pendingExportFormat = format === 'csv' ? 'csv' : 'json';
    closeDataHubModal();
    if (exportOptionsTitle) {
        exportOptionsTitle.innerHTML = pendingExportFormat === 'csv'
            ? '<i class="fas fa-file-csv text-emerald-500 mr-2"></i>Export Call Log CSV'
            : '<i class="fas fa-download text-green-500 mr-2"></i>Export Backup JSON';
    }
    if (exportOptionsDescription) {
        exportOptionsDescription.textContent = pendingExportFormat === 'csv'
            ? 'Choose how much call history you want to export into a spreadsheet-friendly CSV.'
            : 'Choose how much call history you want to include in the backup JSON. Rates and settings are still included.';
    }
    if (confirmExportOptionsBtn) {
        confirmExportOptionsBtn.textContent = pendingExportFormat === 'csv' ? 'Export CSV' : 'Export JSON';
    }
    if (exportScopeAllInput) exportScopeAllInput.checked = true;
    if (exportScopeCurrentInput) exportScopeCurrentInput.checked = false;
    if (exportScopeDateInput) exportScopeDateInput.checked = false;
    if (exportScopeRangeInput) exportScopeRangeInput.checked = false;
    if (exportSpecificDateInput) {
        exportSpecificDateInput.max = getTodayDateString();
        exportSpecificDateInput.value = statsDatePicker?.value || getTodayDateString();
    }
    if (exportRangeStartInput) {
        exportRangeStartInput.max = getTodayDateString();
        exportRangeStartInput.value = statsDatePicker?.value || getTodayDateString();
    }
    if (exportRangeEndInput) {
        exportRangeEndInput.max = getTodayDateString();
        exportRangeEndInput.value = statsDatePicker?.value || getTodayDateString();
    }
    [exportFieldDate, exportFieldStart, exportFieldEnd, exportFieldDuration, exportFieldRateName, exportFieldRateAmount, exportFieldEarnings]
        .filter(Boolean)
        .forEach((checkbox) => { checkbox.checked = true; });
    refreshExportOptionsModalState();
    ModalManager.open(exportOptionsModal, { focusSelector: '#confirm-export-options-btn' });
}

function closeExportOptionsModal() {
    if (exportOptionsModal) ModalManager.close(exportOptionsModal);
    pendingExportFormat = null;
    if (exportOptionsWarning) {
        exportOptionsWarning.style.display = 'none';
        exportOptionsWarning.textContent = '';
    }
}

async function confirmExportOptions() {
    const scope = getCurrentExportScope();
    const specificDateValue = exportSpecificDateInput?.value || '';
    const exportCalls = getCallsForExportScope(scope, specificDateValue);
    const selectedCsvFields = getSelectedExportCsvFields().filter((field) => field.enabled);

    if (scope === 'date' && !parseDateInput(specificDateValue)) {
        if (exportOptionsWarning) {
            exportOptionsWarning.style.display = '';
            exportOptionsWarning.textContent = 'Choose a valid specific date before exporting.';
        }
        return;
    }
    if (scope === 'range') {
        const startDate = parseDateInput(exportRangeStartInput?.value || '');
        const endDate = parseDateInput(exportRangeEndInput?.value || '');
        if (!startDate || !endDate) {
            if (exportOptionsWarning) {
                exportOptionsWarning.style.display = '';
                exportOptionsWarning.textContent = 'Choose a valid start and end date for the custom range.';
            }
            return;
        }
        if (endDate < startDate) {
            if (exportOptionsWarning) {
                exportOptionsWarning.style.display = '';
                exportOptionsWarning.textContent = 'Custom range end date cannot be before the start date.';
            }
            return;
        }
    }

    if (pendingExportFormat === 'csv' && exportCalls.length === 0) {
        if (exportOptionsWarning) {
            exportOptionsWarning.style.display = '';
            exportOptionsWarning.textContent = 'There are no calls in the selected scope to export as CSV.';
        }
        return;
    }
    if (pendingExportFormat === 'csv' && selectedCsvFields.length === 0) {
        if (exportOptionsWarning) {
            exportOptionsWarning.style.display = '';
            exportOptionsWarning.textContent = 'Choose at least one CSV field to export.';
        }
        return;
    }

    if (pendingExportFormat === 'csv') {
        const didExport = await exportCallsAsCsv(exportCalls);
        if (!didExport) return;
        showToast(`Call Log CSV exported with ${exportCalls.length} call${exportCalls.length === 1 ? '' : 's'}.`);
    } else {
        const didExport = await exportCallsAsJson(exportCalls);
        if (!didExport) return;
        showToast(`Backup JSON exported with ${exportCalls.length} call${exportCalls.length === 1 ? '' : 's'} in scope.`);
    }

    closeExportOptionsModal();
}

    // Global variables
    const startCallBtn = document.getElementById('start-call-btn');
    const endCallBtn = document.getElementById('end-call-btn');
    const floatingCallControls = document.getElementById('floating-call-controls');
    const floatingCallDock = document.getElementById('floating-call-dock');
    const floatingDockDragHandle = document.getElementById('floating-dock-drag-handle');
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
    const floatingActiveAdjustControls = document.getElementById('floating-active-adjust-controls');
    const floatingMinusSecondBtn = document.getElementById('floating-minus-second-btn');
    const floatingPlusSecondBtn = document.getElementById('floating-plus-second-btn');
    const callControlsCard = document.getElementById('call-controls-card');
    const liveCallInfo = document.getElementById('live-call-info');
    const liveCallTimerDisplay = document.getElementById('live-call-timer');
    const liveCallEarningsDisplay = document.getElementById('live-call-earnings');
    const liveCallNotesInput = document.getElementById('live-call-notes');
    const focusWorkstrip = document.getElementById('focus-workstrip');
    const focusWorkstripStatus = document.getElementById('focus-workstrip-status');
    const focusWorkstripRate = document.getElementById('focus-workstrip-rate');
    const focusWorkstripTimer = document.getElementById('focus-workstrip-timer');
    const focusWorkstripEarnings = document.getElementById('focus-workstrip-earnings');
    const focusWorkstripReminder = document.getElementById('focus-workstrip-reminder');
    const workstripAddCallBtn = document.getElementById('workstrip-add-call-btn');
    const workstripStartCallBtn = document.getElementById('workstrip-start-call-btn');
    const workstripEndCallBtn = document.getElementById('workstrip-end-call-btn');
    const postCallReviewStrip = document.getElementById('post-call-review-strip');
    const postCallReviewSummary = document.getElementById('post-call-review-summary');
    const postCallUndoBtn = document.getElementById('post-call-undo-btn');
    const postCallEditBtn = document.getElementById('post-call-edit-btn');
    const postCallDismissBtn = document.getElementById('post-call-dismiss-btn');
    const liveCallMinusSecondBtn = document.getElementById('live-call-minus-second-btn');
    const liveCallPlusSecondBtn = document.getElementById('live-call-plus-second-btn');
    const callLogTableBody = document.getElementById('call-log');
    const callLogMobileList = document.getElementById('call-log-mobile');
    const callLogSortableHeaders = Array.from(document.querySelectorAll('.call-log-sortable[data-sort-key]'));
    const callLogScrollContainer = callLogTableBody?.closest('.scrollable-table') || null;
    const callLogSearchInput = document.getElementById('call-log-search');
    const callLogRateFilterSelect = document.getElementById('call-log-rate-filter');
    const callLogResetViewBtn = document.getElementById('call-log-reset-view');
    const callLogResultsSummary = document.getElementById('call-log-results-summary');
    let floatingVisibilityObserver = null;
    let observedFloatingPrimaryButton = null;
    let callControlsVisibleInViewport = false;
    let activeCallButtonVisibleInViewport = false;
    const totalMinutesDisplay = document.getElementById('total-minutes');
    const totalEarningsDisplay = document.getElementById('total-earnings');
    const rateSelect = document.getElementById('select-call-rate');
    const ratesList = document.getElementById('rates-list');
    const addCallBtn = document.getElementById('add-call-btn');
    const callModal = document.getElementById('call-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const callForm = document.getElementById('call-form');
    const cancelCallBtn = document.getElementById('cancel-call');
    const callDateInput = document.getElementById('call-date');
    const callStartTimeInput = document.getElementById('call-start-time');
    const callEndTimeInput = document.getElementById('call-end-time');
    const callRateSelect = document.getElementById('call-rate');
    const callDurationInput = document.getElementById('call-duration');
    const callNotesInput = document.getElementById('call-notes');
    const darkToggleBtn = document.getElementById('dark-toggle');
    const showRateAddBtn = document.getElementById('show-rate-add');
    const rateForm = document.getElementById('rate-form');
    const cancelRateAddBtn = document.getElementById('cancel-rate-add');
    const achievementsToggleBtn = document.getElementById('achievements-toggle');
    const settingsToggleBtn = document.getElementById('settings-toggle');
    const footerOpenSettingsBtn = document.getElementById('footer-open-settings-btn');
    const footerCollapsiblePanels = Array.from(document.querySelectorAll('.app-footer-collapsible[data-footer-collapsible]'));
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal');
    const openDataHubBtn = document.getElementById('open-data-hub-btn');
    const exportDataBtn = document.getElementById('export-data');
    const exportCallLogCsvBtn = document.getElementById('export-call-log-csv');
    const dataHubModal = document.getElementById('data-hub-modal');
    const closeDataHubModalBtn = document.getElementById('close-data-hub-modal');
    const doneDataHubBtn = document.getElementById('done-data-hub-btn');
    const dataHubExportJsonBtn = document.getElementById('data-hub-export-json-btn');
    const dataHubImportJsonBtn = document.getElementById('data-hub-import-json-btn');
    const dataHubExportCsvBtn = document.getElementById('data-hub-export-csv-btn');
    const dataHubImportCsvBtn = document.getElementById('data-hub-import-csv-btn');
    const exportOptionsModal = document.getElementById('export-options-modal');
    const closeExportOptionsModalBtn = document.getElementById('close-export-options-modal');
    const cancelExportOptionsBtn = document.getElementById('cancel-export-options-btn');
    const confirmExportOptionsBtn = document.getElementById('confirm-export-options-btn');
    const exportOptionsTitle = document.getElementById('export-options-title');
    const exportOptionsDescription = document.getElementById('export-options-description');
    const exportOptionsWarning = document.getElementById('export-options-warning');
    const exportCurrentViewLabel = document.getElementById('export-current-view-label');
    const exportSpecificDateInput = document.getElementById('export-specific-date');
    const exportRangeStartInput = document.getElementById('export-range-start');
    const exportRangeEndInput = document.getElementById('export-range-end');
    const exportScopeAllInput = document.getElementById('export-scope-all');
    const exportScopeCurrentInput = document.getElementById('export-scope-current');
    const exportScopeDateInput = document.getElementById('export-scope-date');
    const exportScopeRangeInput = document.getElementById('export-scope-range');
    const exportFieldsCard = document.getElementById('export-fields-card');
    const exportFieldDate = document.getElementById('export-field-date');
    const exportFieldStart = document.getElementById('export-field-start');
    const exportFieldEnd = document.getElementById('export-field-end');
    const exportFieldDuration = document.getElementById('export-field-duration');
    const exportFieldRateName = document.getElementById('export-field-rate-name');
    const exportFieldRateAmount = document.getElementById('export-field-rate-amount');
    const exportFieldEarnings = document.getElementById('export-field-earnings');
    const importFile = document.getElementById('import-file');
    const csvImportPreviewModal = document.getElementById('csv-import-preview-modal');
    const closeCsvImportPreviewModalBtn = document.getElementById('close-csv-import-preview-modal');
    const cancelCsvImportPreviewBtn = document.getElementById('cancel-csv-import-preview-btn');
    const confirmCsvImportBtn = document.getElementById('confirm-csv-import-btn');
    const csvImportSummary = document.getElementById('csv-import-summary');
    const csvImportPreviewBody = document.getElementById('csv-import-preview-body');
    const csvImportDateColumnSelect = document.getElementById('csv-import-date-column');
    const csvImportStartColumnSelect = document.getElementById('csv-import-start-column');
    const csvImportEndColumnSelect = document.getElementById('csv-import-end-column');
    const csvImportDurationColumnSelect = document.getElementById('csv-import-duration-column');
    const csvImportRateColumnSelect = document.getElementById('csv-import-rate-column');
    const csvImportMappingWarning = document.getElementById('csv-import-mapping-warning');
    const csvImportPreviewMeta = document.getElementById('csv-import-preview-meta');
    const csvFilterAllBtn = document.getElementById('csv-filter-all');
    const csvFilterReadyBtn = document.getElementById('csv-filter-ready');
    const csvFilterDuplicateBtn = document.getElementById('csv-filter-duplicate');
    const csvFilterInvalidBtn = document.getElementById('csv-filter-invalid');
    const csvSelectReadyBtn = document.getElementById('csv-select-ready');
    const csvClearSelectedBtn = document.getElementById('csv-clear-selected');
    const csvImportRateSelect = document.getElementById('csv-import-rate-select');
    const csvImportOverrideRateToggle = document.getElementById('csv-import-override-rate');
    const csvImportRequireRateToggle = document.getElementById('csv-import-require-rate');
    const csvImportWarning = document.getElementById('csv-import-warning');
    const resetCallsBtn = document.getElementById('reset-calls');
    const resetAllBtn = document.getElementById('reset-all');
    const statsDatePicker = document.getElementById('stats-date-picker');
    const statsPrevDayBtn = document.getElementById('stats-prev-day-btn');
    const statsNextDayBtn = document.getElementById('stats-next-day-btn');
    const currentDateBtn = document.getElementById('current-date-btn');
    const statsSnapshotHeading = document.getElementById('stats-snapshot-heading');
    const avgDurationDisplay = document.getElementById('avg-duration');
    const avgDurationDeltaDisplay = document.getElementById('avg-duration-delta');
    const todayEarningsTitleDisplay = document.getElementById('today-earnings-title');
    const todayEarningsDisplay = document.getElementById('today-earnings');
    const todayEarningsDeltaDisplay = document.getElementById('today-earnings-delta');
    const goalEstimateDisplay = document.getElementById('goal-estimate');
    const goalEstimateDeltaDisplay = document.getElementById('goal-estimate-delta');
    const rhythmAvgGapDisplay = document.getElementById('rhythm-avg-gap');
    const rhythmFastestGapDisplay = document.getElementById('rhythm-fastest-gap');
    const rhythmVsPreviousDayDisplay = document.getElementById('rhythm-vs-previous-day');
    const hourlyHeatmapGrid = document.getElementById('hourly-heatmap-grid');
    const hourlyHeatmapSummary = document.getElementById('hourly-heatmap-summary');
    const hourlyHeatmapTopHours = document.getElementById('hourly-heatmap-top-hours');
    const trendAnalyticsGrid = document.getElementById('trend-analytics-grid');
    const patternsPanelSummary = document.getElementById('patterns-panel-summary');
    const hourlyHeatmapCard = document.getElementById('hourly-heatmap-card');
    const trendCard = document.getElementById('trend-card');
    const patternsModeHourlyBtn = document.getElementById('patterns-mode-hourly-btn');
    const weeklyTrendBars = document.getElementById('weekly-trend-bars');
    const weeklyTrendSummary = document.getElementById('weekly-trend-summary');
    const weeklyTrendBestDay = document.getElementById('weekly-trend-best-day');
    const monthlyTrendCanvas = document.getElementById('monthly-trend-canvas');
    const monthlyTrendWeekdays = document.getElementById('monthly-trend-weekdays');
    const monthlyTrendHeatmap = document.getElementById('monthly-trend-heatmap');
    const trendModeWeeklyBtn = document.getElementById('trend-mode-weekly-btn');
    const trendModeMonthlyBtn = document.getElementById('trend-mode-monthly-btn');
    const trendPrevBtn = document.getElementById('trend-prev-btn');
    const trendNextBtn = document.getElementById('trend-next-btn');
    const trendRangeLabel = document.getElementById('trend-range-label');
    const trendSummaryInline = document.getElementById('trend-summary-inline');
    let heatmapHoverTooltipEl = null;
    let heatmapHoverActiveTarget = null;
    let heatmapHoverPinned = false;
    let heatmapTooltipGlobalsBound = false;
    const firstHalfEarningsDisplay = document.getElementById('first-half-earnings');
    const secondHalfEarningsDisplay = document.getElementById('second-half-earnings');
    const monthlyTotalEarningsDisplay = document.getElementById('monthly-total-earnings');
    const rpgLevelSummary = document.getElementById('rpg-level-summary');
    const rpgLevelProgressBar = document.getElementById('rpg-level-progress-bar');
    const rpgLevelProgressText = document.getElementById('rpg-level-progress-text');
    const rpgLevelNextText = document.getElementById('rpg-level-next-text');
    const rpgBreakdownToggleBtn = document.getElementById('rpg-breakdown-toggle');
    const rpgXpBreakdownWrap = document.getElementById('rpg-xp-breakdown-wrap');
    const rpgCallXpDisplay = document.getElementById('rpg-call-xp');
    const rpgAchievementXpDisplay = document.getElementById('rpg-achievement-xp');
    const rpgDailyQuestXpDisplay = document.getElementById('rpg-daily-quest-xp');
    const rpgWeeklyArcXpDisplay = document.getElementById('rpg-weekly-arc-xp');
    const rpgStreakMultiplierDisplay = document.getElementById('rpg-streak-multiplier');
    const rpgStreakShieldsDisplay = document.getElementById('rpg-streak-shields');
    const rpgDailyFocusMeta = document.getElementById('rpg-daily-focus-meta');
    const rpgDailyFocusDesc = document.getElementById('rpg-daily-focus-desc');
    const rpgDailyFocusBar = document.getElementById('rpg-daily-focus-bar');
    const rpgWeeklyArcCard = document.getElementById('rpg-weekly-arc-card');
    const rpgWeeklyArcRange = document.getElementById('rpg-weekly-arc-range');
    const rpgWeeklyArcSteps = document.getElementById('rpg-weekly-arc-steps');
    const rpgWeeklyArcStatus = document.getElementById('rpg-weekly-arc-status');
    const rpgStreakShieldRow = document.getElementById('rpg-streak-shield-row');
    const rpgStreakShieldHint = document.getElementById('rpg-streak-shield-hint');
    const rpgUseShieldBtn = document.getElementById('rpg-use-shield-btn');
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
    const cycleEarningsMetaDisplay = document.getElementById('cycle-earnings-meta');
    const cycleEarningsTrendDisplay = document.getElementById('cycle-earnings-trend');
    const cycleStateChipDisplay = document.getElementById('cycle-state-chip');
    const cycleProgressBarDisplay = document.getElementById('cycle-progress-bar');
    const cycleProgressMetaDisplay = document.getElementById('cycle-progress-meta');
    const cycleStartDateDisplay = document.getElementById('cycle-start-date');
    const cycleEndDateDisplay = document.getElementById('cycle-end-date');
    const daysUntilEndDisplay = document.getElementById('days-until-end');
    const payDateDisplay = document.getElementById('pay-date');
    const daysUntilPayDisplay = document.getElementById('days-until-pay');
    const payCountdownHeadlineDisplay = document.getElementById('pay-countdown-headline');
    const nextPayCycleContextDisplay = document.getElementById('next-pay-cycle-context');
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
    const paymentCycleTemplateStartDateInput = document.getElementById('payment-cycle-template-start-date');
    const paymentCycleTemplateCountInput = document.getElementById('payment-cycle-template-count');
    const paymentCycleTemplatePayOffsetInput = document.getElementById('payment-cycle-template-pay-offset');
    const paymentCycleTemplateReplaceToggle = document.getElementById('payment-cycle-template-replace');
    const generatePaymentCyclesBtn = document.getElementById('generate-payment-cycles-btn');
    const paymentCyclesCurrentSummary = document.getElementById('payment-cycles-current-summary');
    const paymentCyclesCurrentRange = document.getElementById('payment-cycles-current-range');
    const paymentCyclesCurrentPay = document.getElementById('payment-cycles-current-pay');
    const paymentCyclesCurrentDays = document.getElementById('payment-cycles-current-days');
    const paymentCyclesToggleAllBtn = document.getElementById('payment-cycles-toggle-all-btn');
    const paymentCyclesAllListWrap = document.getElementById('payment-cycles-all-list-wrap');
    const viewAllPaymentCyclesBtn = document.getElementById('view-all-payment-cycles-btn');
    const sessionStartTimeInput = document.getElementById('session-start-time');
    const sessionEndTimeInput = document.getElementById('session-end-time');
    const sessionStartBtn = document.getElementById('session-start-btn');
    const sessionPauseBtn = document.getElementById('session-pause-btn');
    const sessionEndBtn = document.getElementById('session-end-btn');
    const sessionLivePanel = document.getElementById('session-live-panel');
    const sessionLiveState = document.getElementById('session-live-state');
    const sessionLiveElapsed = document.getElementById('session-live-elapsed');
    const sessionLiveTalk = document.getElementById('session-live-talk');
    const sessionLiveCallCount = document.getElementById('session-live-call-count');
    const sessionLiveIdle = document.getElementById('session-live-idle');
    const sessionLiveUtilization = document.getElementById('session-live-utilization');
    const sessionLiveUtilizationBar = document.getElementById('session-live-utilization-bar');
    const sessionLiveUtilizationHint = document.getElementById('session-live-utilization-hint');
    const sessionHistoryList = document.getElementById('session-history-list');
    const sessionHistoryClearBtn = document.getElementById('session-history-clear-btn');
    
    
    const filterTodayBtn = document.getElementById('filter-today');
    const filterWeekBtn = document.getElementById('filter-week');
    const filterMonthBtn = document.getElementById('filter-month');

// Feature toggles (optional features section)
const featureNotesToggle = document.getElementById('feature-notes-toggle');
const featurePaymentCyclesToggle = document.getElementById('feature-payment-cycles-toggle');
const featureFloatingControlsToggle = document.getElementById('feature-floating-controls-toggle');
const featureRpgToggle = document.getElementById('feature-rpg-toggle');
const openFloatingControlsSettingsBtn = document.getElementById('open-floating-controls-settings-btn');
const openPaymentCyclesSettingsBtn = document.getElementById('open-payment-cycles-settings-btn');
const floatingControlsSettingsModal = document.getElementById('floating-controls-settings-modal');
const closeFloatingControlsSettingsBtn = document.getElementById('close-floating-controls-settings-modal');
const doneFloatingControlsSettingsBtn = document.getElementById('done-floating-controls-settings-btn');
const paymentCyclesSettingsModal = document.getElementById('payment-cycles-settings-modal');
const closePaymentCyclesSettingsModalBtn = document.getElementById('close-payment-cycles-settings-modal');
const donePaymentCyclesSettingsBtn = document.getElementById('done-payment-cycles-settings-btn');
const achievementsSettingsModal = document.getElementById('achievements-settings-modal');
const closeAchievementsSettingsModalBtn = document.getElementById('close-achievements-settings-modal');
const doneAchievementsSettingsBtn = document.getElementById('done-achievements-settings-btn');
const achievementsSummary = document.getElementById('achievements-summary');
const achievementsGrid = document.getElementById('achievements-grid');
const dailyQuestsSection = document.getElementById('daily-quests-section');
const dailyQuestsDate = document.getElementById('daily-quests-date');
const dailyQuestsSummary = document.getElementById('daily-quests-summary');
const dailyQuestsGrid = document.getElementById('daily-quests-grid');
const achievementDetailModal = document.getElementById('achievement-detail-modal');
const closeAchievementDetailModalBtn = document.getElementById('close-achievement-detail-modal');
const doneAchievementDetailBtn = document.getElementById('done-achievement-detail-btn');
const achievementDetailTitle = document.getElementById('achievement-detail-title');
const achievementDetailTier = document.getElementById('achievement-detail-tier');
const achievementDetailDescription = document.getElementById('achievement-detail-description');
const achievementDetailProgressLabel = document.getElementById('achievement-detail-progress-label');
const achievementDetailProgressText = document.getElementById('achievement-detail-progress-text');
const achievementDetailProgressBar = document.getElementById('achievement-detail-progress-bar');
const achievementDetailEarnedRow = document.getElementById('achievement-detail-earned-row');
const achievementDetailEarnedAt = document.getElementById('achievement-detail-earned-at');
const rpgProgressCard = document.getElementById('rpg-progress-card');
const floatingControlsCustomization = document.getElementById('floating-controls-customization');
const floatingControlsSizeModeSelect = document.getElementById('floating-controls-size-mode');
const floatingControlsSideSelect = document.getElementById('floating-controls-side');
const floatingSecondaryActionSelect = document.getElementById('floating-secondary-action-select');
const floatingShowActiveCardToggle = document.getElementById('floating-show-active-card-toggle');
const floatingActiveCardCustomization = document.getElementById('floating-active-card-customization');
const floatingActiveShowTimerToggle = document.getElementById('floating-active-show-timer-toggle');
const floatingActiveShowEarningsToggle = document.getElementById('floating-active-show-earnings-toggle');
const floatingActiveShowRateToggle = document.getElementById('floating-active-show-rate-toggle');
const floatingActiveShowAdjustToggle = document.getElementById('floating-active-show-adjust-toggle');
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
let selectedAchievementId = null;
let pendingCsvImport = null;
const ACTIVE_CALL_IDLE_REMINDER_MS = 10 * 60 * 1000;
const ACTIVE_CALL_REMINDER_COOLDOWN_MS = 8 * 60 * 1000;
let lastUserActivityAt = Date.now();
let lastActiveCallReminderAt = 0;
let workstripSyncQueued = false;
let postCallReviewState = null;

function markUserActivity() {
    lastUserActivityAt = Date.now();
    if (focusWorkstripReminder) {
        focusWorkstripReminder.style.display = 'none';
    }
}

function isUiRefreshEnabled(flags) {
    return true;
}

function queueWorkstripSync() {
    if (workstripSyncQueued) return;
    workstripSyncQueued = true;
    requestAnimationFrame(() => {
        workstripSyncQueued = false;
        syncWorkstripSummary();
    });
}

function hidePostCallReview(clearState = false) {
    if (postCallReviewStrip) postCallReviewStrip.style.display = 'none';
    if (clearState) postCallReviewState = null;
}

function showPostCallReview(callData, elapsedMs, earnedAmount) {
    if (!postCallReviewStrip || !isUiRefreshEnabled(featureFlags) || !callData?.id) return;
    const safeRateName = String(callData.rateName || 'Rate removed');
    if (postCallReviewSummary) {
        postCallReviewSummary.textContent = `Duration ${formatTime(elapsedMs)} | Earnings ${formatEarnings(earnedAmount)} | ${safeRateName}`;
    }
    postCallReviewState = {
        callId: callData.id,
        shownAt: Date.now()
    };
    postCallReviewStrip.style.display = '';
}

function getLatestCallId() {
    if (!Array.isArray(calls) || !calls.length) return null;
    let latest = null;
    let latestMs = -Infinity;
    for (let i = 0; i < calls.length; i += 1) {
        const endMs = getCallEndMs(calls[i]);
        if (!Number.isFinite(endMs)) continue;
        if (endMs > latestMs) {
            latestMs = endMs;
            latest = calls[i];
        }
    }
    return latest?.id || null;
}

function editLatestCallEntry(triggerEl = null) {
    calls = readCallsFromStorage();
    const callId = getLatestCallId();
    if (!callId) {
        showToast('No calls available to edit.', { variant: 'warning' });
        return;
    }
    editCall(callId);
    openCallModal(triggerEl);
}

function undoPostCallReviewEntry() {
    const targetId = postCallReviewState?.callId;
    if (!targetId) return;
    calls = readCallsFromStorage();
    const idx = calls.findIndex((call) => call.id === targetId);
    if (idx < 0) {
        hidePostCallReview(true);
        showToast('That call was already changed.', { variant: 'warning' });
        return;
    }
    calls.splice(idx, 1);
    saveCalls();
    hidePostCallReview(true);
    showToast('Last saved call removed.');
}

function checkActiveCallIdleReminder(nowTs = Date.now()) {
    if (!LiveCallSession.isActive()) {
        lastActiveCallReminderAt = 0;
        if (focusWorkstripReminder) focusWorkstripReminder.style.display = 'none';
        return;
    }

    const idleFor = Math.max(0, nowTs - (lastUserActivityAt || nowTs));
    const canNotifyAgain = (nowTs - lastActiveCallReminderAt) >= ACTIVE_CALL_REMINDER_COOLDOWN_MS;
    if (idleFor >= ACTIVE_CALL_IDLE_REMINDER_MS && canNotifyAgain) {
        lastActiveCallReminderAt = nowTs;
        if (focusWorkstripReminder && isUiRefreshEnabled(featureFlags)) {
            focusWorkstripReminder.style.display = '';
        }
        showToast('Active call is still running. Review before ending.', { variant: 'warning', durationMs: 5000 });
    }
}

function syncWorkstripSummary() {
    if (!focusWorkstrip) return;
    const uiRefresh = isUiRefreshEnabled(featureFlags);
    focusWorkstrip.style.display = uiRefresh ? '' : 'none';
    if (!uiRefresh) {
        hidePostCallReview(false);
        return;
    }

    const currentRateName = String(rateSelect?.value || '').trim();
    const selectedRate = rates.find((rate) => rate.name === currentRateName);
    if (focusWorkstripRate) {
        focusWorkstripRate.textContent = selectedRate
            ? `${selectedRate.name} - $${Number(selectedRate.amount).toFixed(2)}/min`
            : (currentRateName || 'No rate selected');
    }

    const activeState = LiveCallSession.getState(Date.now());
    const isActive = !!activeState;
    if (focusWorkstripStatus) {
        focusWorkstripStatus.textContent = isActive ? 'Call Running' : 'Idle';
        focusWorkstripStatus.classList.toggle('is-active', isActive);
    }
    if (focusWorkstripTimer) {
        focusWorkstripTimer.textContent = isActive ? String(activeState.elapsedLabel || '00:00:00') : '00:00:00';
    }
    if (focusWorkstripEarnings) {
        if (isActive) {
            focusWorkstripEarnings.textContent = String(activeState.earningsLabel || '$0.00');
        } else if (todayEarningsDisplay) {
            focusWorkstripEarnings.textContent = todayEarningsDisplay.textContent || '$0.00';
        } else {
            focusWorkstripEarnings.textContent = '$0.00';
        }
    }
    if (workstripStartCallBtn) workstripStartCallBtn.style.display = isActive ? 'none' : '';
    if (workstripEndCallBtn) workstripEndCallBtn.style.display = isActive ? '' : 'none';

    checkActiveCallIdleReminder(Date.now());
}

function isEditableShortcutTarget(target) {
    if (!target) return false;
    if (target.isContentEditable) return true;
    const tagName = String(target.tagName || '').toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

function handleGlobalProductivityShortcuts(event) {
    if (!isUiRefreshEnabled(featureFlags)) return;
    if (event.defaultPrevented) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (isEditableShortcutTarget(event.target)) return;
    if (isAnyAppModalOpen()) return;

    const key = String(event.key || '').toLowerCase();
    if (key === 'n') {
        event.preventDefault();
        addCallBtn?.click();
        return;
    }
    if (key === 's') {
        event.preventDefault();
        if (LiveCallSession.isActive()) {
            endLiveCall();
        } else {
            startLiveCall();
        }
        return;
    }
    if (key === 'e') {
        event.preventDefault();
        editLatestCallEntry();
    }
}

function loadFeatureFlags() {
    try {
        const raw = appStorage.getItem('featureFlags');
        if (!raw) return {
            notes: true,
            paymentCycles: paymentCyclesEnabled,
            floatingCallControls: true,
            rpg: true,
            uiRefresh: true,
            floatingControlsSizeMode: 'auto',
            floatingControlsSide: 'right',
            floatingSecondaryAction: 'add',
            floatingShowActiveCard: true,
            floatingActiveShowTimer: true,
            floatingActiveShowEarnings: true,
            floatingActiveShowRate: false,
            floatingActiveShowAdjust: false,
            floatingOneHanded: false,
            floatingPreviewEnabled: true
        };
        const parsed = JSON.parse(raw);
        return {
            notes: typeof parsed.notes === 'boolean' ? parsed.notes : true,
            paymentCycles: typeof parsed.paymentCycles === 'boolean' ? parsed.paymentCycles : paymentCyclesEnabled,
            floatingCallControls: typeof parsed.floatingCallControls === 'boolean' ? parsed.floatingCallControls : true,
            rpg: typeof parsed.rpg === 'boolean' ? parsed.rpg : true,
            uiRefresh: true,
            floatingControlsSizeMode: ['auto', 'full', 'compact', 'icon'].includes(parsed.floatingControlsSizeMode) ? parsed.floatingControlsSizeMode : 'auto',
            floatingControlsSide: parsed.floatingControlsSide === 'left' ? 'left' : 'right',
            floatingSecondaryAction: ['add', 'goto', 'none'].includes(parsed.floatingSecondaryAction) ? parsed.floatingSecondaryAction : 'add',
            floatingShowActiveCard: typeof parsed.floatingShowActiveCard === 'boolean' ? parsed.floatingShowActiveCard : true,
            floatingActiveShowTimer: typeof parsed.floatingActiveShowTimer === 'boolean' ? parsed.floatingActiveShowTimer : true,
            floatingActiveShowEarnings: typeof parsed.floatingActiveShowEarnings === 'boolean' ? parsed.floatingActiveShowEarnings : true,
            floatingActiveShowRate: typeof parsed.floatingActiveShowRate === 'boolean' ? parsed.floatingActiveShowRate : false,
            floatingActiveShowAdjust: typeof parsed.floatingActiveShowAdjust === 'boolean' ? parsed.floatingActiveShowAdjust : false,
            floatingOneHanded: typeof parsed.floatingOneHanded === 'boolean' ? parsed.floatingOneHanded : false,
            floatingPreviewEnabled: typeof parsed.floatingPreviewEnabled === 'boolean' ? parsed.floatingPreviewEnabled : true
        };
    } catch (e) {
        return {
            notes: true,
            paymentCycles: paymentCyclesEnabled,
            floatingCallControls: true,
            rpg: true,
            uiRefresh: true,
            floatingControlsSizeMode: 'auto',
            floatingControlsSide: 'right',
            floatingSecondaryAction: 'add',
            floatingShowActiveCard: true,
            floatingActiveShowTimer: true,
            floatingActiveShowEarnings: true,
            floatingActiveShowRate: false,
            floatingActiveShowAdjust: false,
            floatingOneHanded: false,
            floatingPreviewEnabled: true
        };
    }
}

function saveFeatureFlags(flags) {
    try {
        queueStorageWrite('featureFlags', JSON.stringify(flags));
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
    const activeAdjust = dockEl.querySelector('.floating-active-adjust-controls');
    if (activeAdjust) activeAdjust.style.display = flags.floatingActiveShowAdjust ? '' : 'none';

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
        if (flags.floatingActiveShowAdjust) visibleFields.push('adjust');
        const fieldsText = visibleFields.length ? visibleFields.join(', ') : 'none';
        const secondaryText = (flags.floatingSecondaryAction || 'add') === 'none' ? 'hidden' : (flags.floatingSecondaryAction || 'add');
        floatingPreviewHint.textContent = `Preview: size ${mode} | secondary ${secondaryText} | active fields ${fieldsText}`;
    }
}

async function showMainWindowNative() {
    if (!isDesktopTauri || !tauriInvoke) return;
    try {
        await tauriInvoke('show_main_window');
    } catch (error) {
        console.error('Failed to focus the main desktop window:', error);
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

    const rpgEnabled = !!flags.rpg;
    if (rpgProgressCard) {
        rpgProgressCard.style.display = rpgEnabled ? '' : 'none';
    }
    if (dailyQuestsSection) {
        dailyQuestsSection.style.display = rpgEnabled ? '' : 'none';
    }
    if (featureRpgToggle) {
        featureRpgToggle.checked = rpgEnabled;
    }
    if (!rpgEnabled && achievementDetailModal && ModalManager.isOpen(achievementDetailModal) && selectedAchievementId) {
        const selectedAchievement = getAchievementById(selectedAchievementId);
        if (selectedAchievement?.rpgOnly) {
            closeAchievementDetailModal();
        }
    }

    flags.uiRefresh = true;
    document.body.classList.add('ui-refresh-v1');
    if (focusWorkstrip) {
        focusWorkstrip.style.display = '';
    }

    // Floating call controls feature
    if (openFloatingControlsSettingsBtn) {
        openFloatingControlsSettingsBtn.style.display = flags.floatingCallControls ? '' : 'none';
        openFloatingControlsSettingsBtn.setAttribute('aria-expanded', (floatingControlsSettingsModal && ModalManager.isOpen(floatingControlsSettingsModal)) ? 'true' : 'false');
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
    if (floatingActiveShowAdjustToggle) {
        floatingActiveShowAdjustToggle.checked = !!flags.floatingActiveShowAdjust;
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
    renderAchievementsModal();
    updateRpgProgress();
    queueWorkstripSync();
}

// initialize feature flags (will be applied on DOMContentLoaded too)
// don't call loadFeatureFlags() at module-eval time because it may
// reference `paymentCyclesEnabled` which is initialized later.
let featureFlags = {
    notes: true,
    paymentCycles: false,
    floatingCallControls: true,
    rpg: true,
    uiRefresh: true,
    floatingControlsSizeMode: 'auto',
    floatingControlsSide: 'right',
    floatingSecondaryAction: 'add',
    floatingShowActiveCard: true,
    floatingActiveShowTimer: true,
    floatingActiveShowEarnings: true,
    floatingActiveShowRate: false,
    floatingActiveShowAdjust: false,
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
const activeCallRecoveryBanner = document.getElementById('active-call-recovery-banner');
const activeCallRecoveryMessage = document.getElementById('active-call-recovery-message');
const activeCallSummarizeBtn = document.getElementById('active-call-summarize-btn');
const activeCallDiscardBtn = document.getElementById('active-call-discard-btn');
let recoveredActiveCallState = null;

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

function clampFloatingDockManualPosition(pos) {
    const fallback = { x: 16, y: 16 };
    const candidateX = Number(pos?.x);
    const candidateY = Number(pos?.y);
    if (!Number.isFinite(candidateX) || !Number.isFinite(candidateY)) return fallback;
    if (!floatingCallControls) return { x: candidateX, y: candidateY };

    const viewportW = Math.max(window.innerWidth || 0, 320);
    const viewportH = Math.max(window.innerHeight || 0, 320);
    const rect = floatingCallControls.getBoundingClientRect();
    const width = Math.max(rect.width || 0, 56);
    const height = Math.max(rect.height || 0, 56);
    const maxX = Math.max(8, viewportW - width - 8);
    const maxY = Math.max(8, viewportH - height - 8);
    return {
        x: Math.min(maxX, Math.max(8, candidateX)),
        y: Math.min(maxY, Math.max(8, candidateY))
    };
}

function saveFloatingDockManualPosition(pos) {
    try {
        if (!pos) {
            pendingStorageWrites.delete(FLOATING_DOCK_POSITION_KEY);
            appStorage.removeItem(FLOATING_DOCK_POSITION_KEY);
            return;
        }
        queueStorageWrite(FLOATING_DOCK_POSITION_KEY, JSON.stringify(pos));
    } catch (error) {
        console.warn('Could not save floating dock position', error);
    }
}

function loadFloatingDockManualPosition() {
    try {
        const raw = appStorage.getItem(FLOATING_DOCK_POSITION_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const clamped = clampFloatingDockManualPosition(parsed);
        return Number.isFinite(clamped.x) && Number.isFinite(clamped.y) ? clamped : null;
    } catch {
        return null;
    }
}

function applyFloatingDockManualPosition(pos) {
    if (!floatingCallControls || !pos) return;
    const clamped = clampFloatingDockManualPosition(pos);
    floatingDockManualPosition = clamped;
    floatingCallControls.style.left = `${Math.round(clamped.x)}px`;
    floatingCallControls.style.top = `${Math.round(clamped.y)}px`;
    floatingCallControls.style.right = 'auto';
    floatingCallControls.style.bottom = 'auto';
}

function startFloatingDockDrag(event) {
    if (!floatingCallControls || !event) return;
    const pointerId = Number(event.pointerId);
    if (!Number.isFinite(pointerId)) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (!isDockActuallyVisible()) return;

    const rect = floatingCallControls.getBoundingClientRect();
    floatingDockManualPosition = clampFloatingDockManualPosition({ x: rect.left, y: rect.top });
    applyFloatingDockManualPosition(floatingDockManualPosition);

    floatingDockDragState = {
        pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: floatingDockManualPosition.x,
        originY: floatingDockManualPosition.y
    };

    floatingCallControls.classList.add('dragging');
    try {
        event.currentTarget?.setPointerCapture?.(pointerId);
    } catch {}
    event.preventDefault();
}

function handleFloatingDockPointerMove(event) {
    if (!floatingDockDragState || !floatingCallControls) return;
    if (event.pointerId !== floatingDockDragState.pointerId) return;
    const deltaX = event.clientX - floatingDockDragState.startX;
    const deltaY = event.clientY - floatingDockDragState.startY;
    const nextPos = clampFloatingDockManualPosition({
        x: floatingDockDragState.originX + deltaX,
        y: floatingDockDragState.originY + deltaY
    });
    applyFloatingDockManualPosition(nextPos);
}

function endFloatingDockDrag(event) {
    if (!floatingDockDragState) return;
    if (event && event.pointerId !== floatingDockDragState.pointerId) return;
    floatingDockDragState = null;
    if (floatingCallControls) floatingCallControls.classList.remove('dragging');
    if (floatingDockManualPosition) {
        const clamped = clampFloatingDockManualPosition(floatingDockManualPosition);
        applyFloatingDockManualPosition(clamped);
        saveFloatingDockManualPosition(clamped);
    }
}

function clampFloatingDockPositionToViewport() {
    if (!floatingDockManualPosition || !floatingCallControls) return;
    const clamped = clampFloatingDockManualPosition(floatingDockManualPosition);
    applyFloatingDockManualPosition(clamped);
    saveFloatingDockManualPosition(clamped);
}

function shouldAutoCollapseFloatingDock() {
    return window.innerWidth > 768 && !isStandaloneDisplayMode();
}

function setFloatingDockCollapsed(collapsed) {
    floatingDockCollapsed = shouldAutoCollapseFloatingDock() ? !!collapsed : false;
    if (!floatingCallControls) return;
    floatingCallControls.classList.toggle('dock-collapsed', floatingDockCollapsed);
    if (floatingDockMiniBtn) floatingDockMiniBtn.style.display = floatingDockCollapsed ? 'inline-flex' : 'none';
}

function scheduleFloatingDockAutoHide() {
    if (floatingDockIdleTimer) clearTimeout(floatingDockIdleTimer);
    if (!isDockActuallyVisible()) return;
    if (!shouldAutoCollapseFloatingDock()) {
        setFloatingDockCollapsed(false);
        return;
    }
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
    if (shouldAutoCollapseFloatingDock()) {
        scheduleFloatingDockAutoHide();
    }
}

function resolveDockMode(modePreference) {
    if (modePreference !== 'auto') return modePreference;
    if (window.innerWidth <= 700) return 'compact';
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
    if (floatingActiveAdjustControls) {
        const inIconMode = !!floatingCallControls?.classList.contains('floating-icon');
        floatingActiveAdjustControls.style.display = (flags.floatingActiveShowAdjust && !inIconMode) ? '' : 'none';
    }
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

function isElementVisibleInViewport(el, minVisibleRatio = 0.2) {
    if (!el || !(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;

    if (rect.width <= 0 || rect.height <= 0) return false;
    if (rect.bottom <= 0 || rect.top >= viewportHeight) return false;
    if (rect.right <= 0 || rect.left >= viewportWidth) return false;

    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
    if (visibleHeight <= 0 || visibleWidth <= 0) return false;

    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.width * rect.height;
    if (totalArea <= 0) return false;

    return (visibleArea / totalArea) >= minVisibleRatio;
}

function refreshFloatingVisibilityObservers() {
    if (!('IntersectionObserver' in window)) return;
    if (!floatingVisibilityObserver || !callControlsCard) return;

    const activeMainButton = endCallBtn.style.display === 'none' ? startCallBtn : endCallBtn;
    if (observedFloatingPrimaryButton === activeMainButton) return;

    if (observedFloatingPrimaryButton) {
        floatingVisibilityObserver.unobserve(observedFloatingPrimaryButton);
    }

    observedFloatingPrimaryButton = activeMainButton || null;
    activeCallButtonVisibleInViewport = false;

    if (observedFloatingPrimaryButton) {
        floatingVisibilityObserver.observe(observedFloatingPrimaryButton);
    }
}

function setupFloatingVisibilityObservers() {
    if (!('IntersectionObserver' in window)) return;
    if (!callControlsCard || floatingVisibilityObserver) return;

    floatingVisibilityObserver = new IntersectionObserver((entries) => {
        let shouldRefresh = false;
        entries.forEach((entry) => {
            const ratio = Number(entry.intersectionRatio || 0);
            if (entry.target === callControlsCard) {
                const nextVisible = entry.isIntersecting && ratio >= 0.18;
                if (nextVisible !== callControlsVisibleInViewport) {
                    callControlsVisibleInViewport = nextVisible;
                    shouldRefresh = true;
                }
                return;
            }

            if (entry.target === observedFloatingPrimaryButton) {
                const nextVisible = entry.isIntersecting && ratio >= 0.45;
                if (nextVisible !== activeCallButtonVisibleInViewport) {
                    activeCallButtonVisibleInViewport = nextVisible;
                    shouldRefresh = true;
                }
            }
        });

        if (shouldRefresh) {
            scheduleFloatingControlsRefresh();
        }
    }, {
        threshold: [0, 0.18, 0.45, 1]
    });

    floatingVisibilityObserver.observe(callControlsCard);
    refreshFloatingVisibilityObservers();
}

function updateFloatingCallControls(flags = featureFlags) {
    queueWorkstripSync();
    flushPendingLiveCallInfoVisibilityIfVisible();
    if (!floatingCallControls || !floatingStartCallBtn || !floatingEndCallBtn || !callControlsCard) return;

    refreshFloatingVisibilityObservers();

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

    const activeMainButton = endCallBtn.style.display === 'none' ? startCallBtn : endCallBtn;
    const controlsCardVisible = floatingVisibilityObserver
        ? callControlsVisibleInViewport
        : isElementVisibleInViewport(callControlsCard, 0.18);
    const mainButtonVisible = floatingVisibilityObserver
        ? activeCallButtonVisibleInViewport
        : isElementVisibleInViewport(activeMainButton, 0.45);

    if (controlsCardVisible || mainButtonVisible) {
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

    if (floatingDockManualPosition) {
        applyFloatingDockManualPosition(floatingDockManualPosition);
    } else {
        const preferredSide = flags?.floatingControlsSide === 'left' ? 'left' : 'right';
        const side = avoidFocusedInputOverlap({ ...flags, floatingControlsSide: preferredSide });
        const bottomOffset = computeFloatingDockOffset();
        floatingCallControls.style.top = 'auto';
        floatingCallControls.style.bottom = `${bottomOffset}px`;
        if (side === 'left') {
            floatingCallControls.style.left = '1rem';
            floatingCallControls.style.right = 'auto';
        } else {
            floatingCallControls.style.right = '1rem';
            floatingCallControls.style.left = 'auto';
        }
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
    if (!shouldAutoCollapseFloatingDock()) {
        setFloatingDockCollapsed(false);
        return;
    }
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
    
    // Load from appStorage
    let rates, calls, dailyGoal, paymentCyclesEnabled, paymentCycles, lastSelectedRate;
    try {
        rates = JSON.parse(appStorage.getItem('rates')) || [];
        calls = JSON.parse(appStorage.getItem('calls')) || [];
        // Daily goal: primary source is 'dailyGoal'. Fallback to legacy keys if needed.
const storedDailyGoal = appStorage.getItem('dailyGoal');
if (storedDailyGoal) {
  dailyGoal = JSON.parse(storedDailyGoal);
} else {
  const legacyAmount = Number(appStorage.getItem('dailyGoalUSD')) || 0;
  const legacyMinutes = Number(appStorage.getItem('dailyGoalMinutes')) || 0;
  dailyGoal = { amount: legacyAmount, minutes: legacyMinutes };
}
        paymentCyclesEnabled = JSON.parse(appStorage.getItem('paymentCyclesEnabled')) || false;
        // Load payment cycles safely, prefer primary key but fallback to backup if primary is missing or corrupt
        (function() {
            try {
                const raw = appStorage.getItem('paymentCycles');
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
                const bak = appStorage.getItem('paymentCycles_backup');
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
        lastSelectedRate = appStorage.getItem('lastSelectedRate') || null;

        // Migration: Add IDs to existing calls that don't have them
        calls = calls.map(call => ({
            ...call,
            id: call.id || generateUUID()
        }));
    } catch (e) {
        console.error('Failed to parse local storage data. Resetting app data.', e);
        appStorage.clear();
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
    let sessionTrackerTimerId = null;
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
    let floatingDockManualPosition = null;
    let floatingDockDragState = null;
    let lastActiveCallPersistAt = 0;
    let cachedTimeZoneFormatters = { tz: null, date: null, time: null };
    let callsDatasetVersion = 0;
    let filteredCallsCache = { key: '', rows: [] };
    let callLogSort = { key: 'startTime', direction: 'desc' };
    let callLogSearchQuery = '';
    let callLogRateFilter = '';
    let callLogSearchDebounceTimer = null;
    let openCallLogActionsMenu = null;
    let callLogRenderTicket = 0;
    let callLogRenderState = null;
    let pendingStorageWrites = new Map();
    let storageWriteTimer = null;
    let pendingCsvImportFilter = 'all';
    let pendingExportFormat = null;
    let pendingImportMode = null;
    let paymentCyclesListExpanded = false;
    let trendMode = normalizeTrendMode(appStorage.getItem('trendMode'));
    let patternsMode = normalizePatternsMode(appStorage.getItem('patternsMode') || trendMode || 'hourly');
    let trendAnchorDate = getTrendAnchorStorageDate();
    let rpgXpBreakdownExpanded = appStorage.getItem('rpgXpBreakdownExpanded') === '1';
    if (trendMode === 'weekly') {
        trendAnchorDate = clampTrendAnchorToToday(new Date());
    }
    let sessionTrackerState = loadSessionTrackerState();
    let sessionHistoryEntries = loadSessionHistoryState();
    const CALL_LOG_RENDER_CHUNK_SIZE = 120;
    const CALL_LOG_RENDER_AHEAD_PX = 180;
    const RPG_CALL_ELIGIBILITY_MIGRATION_KEY = 'wtt_rpg_call_eligibility_migrated_v1';
    const FLOATING_DOCK_POSITION_KEY = 'floatingDockManualPosition';

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

    function normalizeTrendMode(mode) {
        return mode === 'monthly' ? 'monthly' : 'weekly';
    }

    function normalizePatternsMode(mode) {
        return ['hourly', 'weekly', 'monthly'].includes(mode) ? mode : 'hourly';
    }

    function clampTrendAnchorToToday(dateObj) {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const candidate = dateObj instanceof Date && Number.isFinite(dateObj.getTime())
            ? new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
            : todayStart;
        return candidate.getTime() > todayStart.getTime() ? todayStart : candidate;
    }

    function getTrendAnchorStorageDate() {
        const raw = parseDateInput(appStorage.getItem('trendAnchorDate') || '');
        return clampTrendAnchorToToday(raw || new Date());
    }

    function saveTrendPreferences() {
        queueStorageWrite('trendMode', trendMode);
        queueStorageWrite('trendAnchorDate', formatDateForInput(trendAnchorDate));
    }

    function savePatternsPreference() {
        queueStorageWrite('patternsMode', patternsMode);
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

    function loadSessionTrackerState() {
        try {
            const raw = JSON.parse(appStorage.getItem(SESSION_TRACKER_KEY) || '{}');
            return normalizeSessionTrackerState(raw);
        } catch (error) {
            return getSessionDefaultState();
        }
    }

    function saveSessionTrackerState() {
        const normalized = normalizeSessionTrackerState(sessionTrackerState);
        sessionTrackerState = normalized;
        queueStorageWrite(SESSION_TRACKER_KEY, JSON.stringify(normalized));
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

    function loadSessionHistoryState() {
        try {
            const raw = JSON.parse(appStorage.getItem(SESSION_HISTORY_KEY) || '[]');
            return normalizeSessionHistoryEntries(raw);
        } catch {
            return [];
        }
    }

    function saveSessionHistoryState() {
        sessionHistoryEntries = normalizeSessionHistoryEntries(sessionHistoryEntries);
        queueStorageWrite(SESSION_HISTORY_KEY, JSON.stringify(sessionHistoryEntries));
    }

    function clearSessionHistoryState() {
        sessionHistoryEntries = [];
        saveSessionHistoryState();
    }

    function getSessionEarningsBetween(startMs, endMs) {
        if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return 0;
        let total = 0;
        for (const call of calls) {
            const callStartMs = getCallStartMs(call);
            const callEndMs = getCallEndMs(call);
            if (!Number.isFinite(callStartMs) || !Number.isFinite(callEndMs) || callEndMs <= callStartMs) continue;
            if (callEndMs > startMs && callStartMs < endMs) {
                total += Number(call?.earned) || 0;
            }
        }
        return Math.max(0, total);
    }

    function buildCompletedSessionHistoryEntry(metrics, endedAtMs = Date.now(), pauseCount = 0) {
        const startedFromState = Number(sessionTrackerState?.startMs);
        const fallbackStart = endedAtMs - Math.max(0, Number(metrics?.elapsedMs) || 0);
        const startedAtMs = Number.isFinite(startedFromState) && startedFromState > 0
            ? startedFromState
            : Math.max(0, fallbackStart);
        const safeEndedAtMs = Math.max(startedAtMs, endedAtMs);
        const earned = getSessionEarningsBetween(startedAtMs, safeEndedAtMs);
        return {
            id: `${safeEndedAtMs}-${Math.random().toString(16).slice(2, 8)}`,
            startedAtMs,
            endedAtMs: safeEndedAtMs,
            talkMs: Math.max(0, Number(metrics?.talkMs) || 0),
            idleMs: Math.max(0, Number(metrics?.idleMs) || 0),
            availableMs: Math.max(0, Number(metrics?.availableMs) || 0),
            utilization: Math.max(0, Math.min(100, Number(metrics?.utilization) || 0)),
            callCount: Math.max(0, Math.round(Number(metrics?.callCount) || 0)),
            pauseCount: Math.max(0, Math.round(Number(pauseCount) || 0)),
            earned
        };
    }

    function appendSessionHistoryEntry(entry) {
        if (!entry || typeof entry !== 'object') return;
        sessionHistoryEntries = [entry, ...(Array.isArray(sessionHistoryEntries) ? sessionHistoryEntries : [])];
        saveSessionHistoryState();
    }

    function renderSessionHistory() {
        if (!sessionHistoryList) return;
        const entries = normalizeSessionHistoryEntries(sessionHistoryEntries);
        sessionHistoryEntries = entries;
        if (sessionHistoryClearBtn) {
            sessionHistoryClearBtn.disabled = entries.length === 0;
            sessionHistoryClearBtn.classList.toggle('opacity-60', entries.length === 0);
            sessionHistoryClearBtn.classList.toggle('cursor-not-allowed', entries.length === 0);
        }

        if (entries.length === 0) {
            sessionHistoryList.innerHTML = '<p class="session-history-empty">No completed sessions yet.</p>';
            return;
        }

        const rows = entries.slice(0, 12).map((entry) => {
            const started = new Date(entry.startedAtMs);
            const ended = new Date(entry.endedAtMs);
            const dateLabel = started.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'short', month: 'short', day: 'numeric' });
            const startTime = started.toLocaleTimeString(DISPLAY_LOCALE, { hour: '2-digit', minute: '2-digit' });
            const endTime = ended.toLocaleTimeString(DISPLAY_LOCALE, { hour: '2-digit', minute: '2-digit' });
            const sessionLength = Math.max(0, entry.endedAtMs - entry.startedAtMs);
            return `
                <div class="session-history-item">
                    <div class="session-history-row">
                        <span class="session-history-date">${escapeHTML(dateLabel)}</span>
                        <span class="session-history-range">${escapeHTML(startTime)} - ${escapeHTML(endTime)}</span>
                    </div>
                    <div class="session-history-row">
                        <span class="session-history-chip">Len ${formatTime(sessionLength)}</span>
                        <span class="session-history-chip">Calls ${entry.callCount}</span>
                        <span class="session-history-chip">Talk ${formatTime(entry.talkMs)}</span>
                        <span class="session-history-chip">Idle ${formatTime(entry.idleMs)}</span>
                        <span class="session-history-chip">Util ${formatSessionPercent(entry.utilization)}</span>
                        <span class="session-history-chip">Earned ${formatEarnings(entry.earned)}</span>
                    </div>
                </div>
            `;
        });
        sessionHistoryList.innerHTML = rows.join('');
    }

    function clearSessionTrackerTimer() {
        if (!sessionTrackerTimerId) return;
        clearInterval(sessionTrackerTimerId);
        activeTimers.delete(sessionTrackerTimerId);
        sessionTrackerTimerId = null;
    }

    function ensureSessionTrackerTimer() {
        if (!sessionTrackerState?.active) {
            clearSessionTrackerTimer();
            return;
        }
        if (sessionTrackerTimerId) return;
        sessionTrackerTimerId = setInterval(() => {
            renderSessionTracker();
        }, 1000);
        activeTimers.add(sessionTrackerTimerId);
    }

    function formatSessionPercent(value) {
        const n = Number(value);
        if (!Number.isFinite(n) || n <= 0) return '0.0%';
        return `${Math.min(100, n).toFixed(1)}%`;
    }

    function getSessionCallCount(state, now = Date.now()) {
        if (!state?.active || !Number.isFinite(state.startMs) || state.startMs <= 0) return 0;
        const windowStart = state.startMs;
        const windowEnd = Math.max(windowStart, now);
        let count = 0;

        for (const call of calls) {
            const callStartMs = getCallStartMs(call);
            const callEndMs = getCallEndMs(call);
            if (!Number.isFinite(callStartMs) || !Number.isFinite(callEndMs) || callEndMs <= callStartMs) continue;
            if (callEndMs > windowStart && callStartMs < windowEnd) {
                count += 1;
            }
        }

        const activeCallState = LiveCallSession.getState(now);
        if (activeCallState && Number.isFinite(activeCallState.start) && activeCallState.start > 0) {
            if (now > windowStart && activeCallState.start < windowEnd) {
                count += 1;
            }
        }

        return Math.max(0, count);
    }

    function getSessionTalkTimeMs(state, now = Date.now()) {
        if (!state?.active || !Number.isFinite(state.startMs) || state.startMs <= 0) return 0;
        const windowStart = state.startMs;
        const windowEnd = Math.max(windowStart, now);
        let talkMs = 0;

        for (const call of calls) {
            const callStartMs = getCallStartMs(call);
            const callEndMs = getCallEndMs(call);
            if (!Number.isFinite(callStartMs) || !Number.isFinite(callEndMs) || callEndMs <= callStartMs) continue;
            const overlapStart = Math.max(windowStart, callStartMs);
            const overlapEnd = Math.min(windowEnd, callEndMs);
            if (overlapEnd > overlapStart) {
                talkMs += overlapEnd - overlapStart;
            }
        }

        const activeCallState = LiveCallSession.getState(now);
        if (activeCallState && Number.isFinite(activeCallState.start) && activeCallState.start > 0) {
            const overlapStart = Math.max(windowStart, activeCallState.start);
            const overlapEnd = windowEnd;
            if (overlapEnd > overlapStart) {
                talkMs += overlapEnd - overlapStart;
            }
        }

        return Math.max(0, talkMs);
    }

    function getSessionComputedMetrics(now = Date.now()) {
        const state = normalizeSessionTrackerState(sessionTrackerState);
        if (!state.active) {
            return {
                state,
                status: 'idle',
                elapsedMs: 0,
                pausedMs: 0,
                availableMs: 0,
                talkMs: 0,
                callCount: 0,
                idleMs: 0,
                utilization: 0
            };
        }

        const elapsedMs = Math.max(0, now - state.startMs);
        const pausedMs = Math.max(0, state.pausedTotalMs + (state.paused && state.pauseStartedMs > 0 ? (now - state.pauseStartedMs) : 0));
        const availableMs = Math.max(0, elapsedMs - pausedMs);
        const rawTalkMs = getSessionTalkTimeMs(state, now);
        const callCount = getSessionCallCount(state, now);
        const talkMs = Math.max(0, Math.min(rawTalkMs, availableMs));
        const idleMs = Math.max(0, availableMs - talkMs);
        const utilization = availableMs > 0 ? (talkMs / availableMs) * 100 : 0;

        return {
            state,
            status: state.paused ? 'paused' : 'active',
            elapsedMs,
            pausedMs,
            availableMs,
            talkMs,
            callCount,
            idleMs,
            utilization
        };
    }

    function renderSessionTracker(now = Date.now()) {
        if (!sessionLivePanel) return;
        if (!sessionTrackerState) sessionTrackerState = loadSessionTrackerState();

        if (sessionStartTimeInput && document.activeElement !== sessionStartTimeInput) {
            sessionStartTimeInput.value = sessionTrackerState.scheduleStart || '';
        }
        if (sessionEndTimeInput && document.activeElement !== sessionEndTimeInput) {
            sessionEndTimeInput.value = sessionTrackerState.scheduleEnd || '';
        }

        const metrics = getSessionComputedMetrics(now);
        const isActive = metrics.status === 'active';
        const isPaused = metrics.status === 'paused';
        const statusLabel = isActive ? 'Active' : (isPaused ? 'Paused' : 'Idle');

        sessionLivePanel.classList.remove('is-idle', 'is-active', 'is-paused');
        sessionLivePanel.classList.add(isActive ? 'is-active' : (isPaused ? 'is-paused' : 'is-idle'));

        if (sessionLiveState) {
            sessionLiveState.classList.remove('is-idle', 'is-active', 'is-paused');
            sessionLiveState.classList.add(isActive ? 'is-active' : (isPaused ? 'is-paused' : 'is-idle'));
            const stateLabel = sessionLiveState.querySelector('.session-state-label');
            if (stateLabel) stateLabel.textContent = statusLabel;
        }

        if (sessionLiveElapsed) sessionLiveElapsed.textContent = formatTime(metrics.elapsedMs);
        if (sessionLiveTalk) sessionLiveTalk.textContent = formatTime(metrics.talkMs);
        if (sessionLiveCallCount) sessionLiveCallCount.textContent = `${metrics.callCount}`;
        if (sessionLiveIdle) sessionLiveIdle.textContent = formatTime(metrics.idleMs);
        if (sessionLiveUtilization) sessionLiveUtilization.textContent = formatSessionPercent(metrics.utilization);
        if (sessionLiveUtilizationBar) {
            const width = Math.max(0, Math.min(100, metrics.utilization));
            sessionLiveUtilizationBar.style.width = `${width}%`;
        }
        if (sessionLiveUtilizationHint) {
            sessionLiveUtilizationHint.textContent = `Available ${formatTime(metrics.availableMs)} | Paused ${formatTime(metrics.pausedMs)}`;
        }

        if (sessionStartBtn) sessionStartBtn.disabled = metrics.state.active;
        if (sessionPauseBtn) {
            sessionPauseBtn.disabled = !metrics.state.active;
            sessionPauseBtn.innerHTML = metrics.state.paused
                ? '<i class="fas fa-play mr-1"></i> Resume'
                : '<i class="fas fa-pause mr-1"></i> Pause';
        }
        if (sessionEndBtn) sessionEndBtn.disabled = !metrics.state.active;
        if (sessionStartTimeInput) {
            sessionStartTimeInput.disabled = false;
            sessionStartTimeInput.readOnly = true;
        }
        if (sessionEndTimeInput) {
            sessionEndTimeInput.disabled = false;
            sessionEndTimeInput.readOnly = true;
        }
    }

    function startWorkSession() {
        if (!sessionTrackerState) sessionTrackerState = getSessionDefaultState();
        if (sessionTrackerState.active) return;
        const autoStart = getCurrentSessionClockTime();
        sessionTrackerState.scheduleStart = autoStart;
        sessionTrackerState.scheduleEnd = '';
        if (sessionStartTimeInput) sessionStartTimeInput.value = autoStart;
        if (sessionEndTimeInput) sessionEndTimeInput.value = '';
        sessionTrackerState.active = true;
        sessionTrackerState.paused = false;
        sessionTrackerState.startMs = Date.now();
        sessionTrackerState.pausedTotalMs = 0;
        sessionTrackerState.pauseStartedMs = 0;
        sessionTrackerState.pauseCount = 0;
        saveSessionTrackerState();
        ensureSessionTrackerTimer();
        renderSessionTracker();
        showToast('Session started.');
    }

    function toggleWorkSessionPause() {
        if (!sessionTrackerState?.active) return;
        const now = Date.now();
        if (!sessionTrackerState.paused && LiveCallSession.isActive()) {
            showToast('End the active call before pausing your session.');
            return;
        }

        if (sessionTrackerState.paused) {
            if (sessionTrackerState.pauseStartedMs > 0) {
                sessionTrackerState.pausedTotalMs += Math.max(0, now - sessionTrackerState.pauseStartedMs);
            }
            sessionTrackerState.paused = false;
            sessionTrackerState.pauseStartedMs = 0;
            showToast('Session resumed.');
        } else {
            sessionTrackerState.paused = true;
            sessionTrackerState.pauseStartedMs = now;
            sessionTrackerState.pauseCount = Math.max(0, Number(sessionTrackerState.pauseCount) || 0) + 1;
            showToast('Session paused.');
        }

        saveSessionTrackerState();
        ensureSessionTrackerTimer();
        renderSessionTracker();
    }

    function endWorkSession() {
        if (!sessionTrackerState?.active) return;
        if (LiveCallSession.isActive()) {
            showToast('End the active call before ending your session.');
            return;
        }

        const autoEnd = getCurrentSessionClockTime();
        sessionTrackerState.scheduleEnd = autoEnd;
        if (sessionEndTimeInput) sessionEndTimeInput.value = autoEnd;

        const now = Date.now();
        const metrics = getSessionComputedMetrics(now);
        const pauseCount = Number(sessionTrackerState.pauseCount) || 0;
        const historyEntry = buildCompletedSessionHistoryEntry(metrics, now, pauseCount);
        recordCompletedSessionForRpg(metrics, now, pauseCount);
        appendSessionHistoryEntry(historyEntry);
        const scheduleStart = sessionTrackerState.scheduleStart;
        const scheduleEnd = sessionTrackerState.scheduleEnd;
        sessionTrackerState = getSessionDefaultState();
        sessionTrackerState.scheduleStart = scheduleStart;
        sessionTrackerState.scheduleEnd = scheduleEnd;
        saveSessionTrackerState();
        clearSessionTrackerTimer();
        renderSessionTracker();
        renderSessionHistory();
        showToast(`Session ended. Talk ${formatTime(metrics.talkMs)} | Idle ${formatTime(metrics.idleMs)} | Utilization ${formatSessionPercent(metrics.utilization)}.`);
        evaluateAchievements({ notify: true });
    }

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

    function getSessionRpgStatsState() {
        try {
            const raw = JSON.parse(appStorage.getItem(SESSION_RPG_STATS_KEY) || '{}');
            return normalizeSessionRpgStatsState(raw);
        } catch {
            return getDefaultSessionRpgStatsState();
        }
    }

    function saveSessionRpgStatsState(state) {
        const normalized = normalizeSessionRpgStatsState(state);
        queueStorageWrite(SESSION_RPG_STATS_KEY, JSON.stringify(normalized));
    }

    function clearSessionRpgStatsState() {
        pendingStorageWrites.delete(SESSION_RPG_STATS_KEY);
        appStorage.removeItem(SESSION_RPG_STATS_KEY);
    }

    function recordCompletedSessionForRpg(metrics, endedAtMs = Date.now(), pauseCount = 0) {
        if (!metrics || !Number.isFinite(metrics.availableMs) || metrics.availableMs <= 0) return;
        const state = getSessionRpgStatsState();
        state.sessionsCompleted += 1;
        state.totalTalkMs += Math.max(0, Number(metrics.talkMs) || 0);
        state.totalIdleMs += Math.max(0, Number(metrics.idleMs) || 0);
        state.totalAvailableMs += Math.max(0, Number(metrics.availableMs) || 0);
        if ((Number(metrics.utilization) || 0) >= 70) state.highUtilSessions += 1;
        if ((Number(metrics.availableMs) || 0) >= 30 * 60 * 1000 && (Number(metrics.idleMs) || 0) <= 5 * 60 * 1000) {
            state.focusedSessions += 1;
        }
        if ((Number(metrics.availableMs) || 0) >= 4 * 60 * 60 * 1000) state.longSessions4h += 1;
        if ((Number(pauseCount) || 0) > 0) state.pauseAwareSessions += 1;
        if (!state.daysWorked || typeof state.daysWorked !== 'object') state.daysWorked = {};
        const dayKey = formatDateForInput(new Date(endedAtMs));
        state.daysWorked[dayKey] = true;
        saveSessionRpgStatsState(state);
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

    const LEVEL_CURVE = buildLevelCurve(100);

    function isRpgEnabled() {
        return !!featureFlags.rpg;
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

    function getCallXpForDurationWithStreak(durationMs, currentStreak = 0) {
        if (!isRpgEnabled()) return 0;
        const base = getBaseXpForCallDuration(durationMs);
        return Math.max(0, Math.round(base * getStreakRewardMultiplier(currentStreak)));
    }

    const RPG_PROGRESS_STATE_KEY = 'wtt_rpg_progress_state_v1';
    const STREAK_SHIELD_MAX = 2;
    const WEEKLY_ARC_REWARD_XP = 90;
    const WEEKLY_ARC_STEPS = [
        {
            id: 'calls',
            label: 'Calls',
            metric: 'calls',
            target: 12,
            format: (v) => `${Math.round(v)}`
        },
        {
            id: 'minutes',
            label: 'Minutes',
            metric: 'minutes',
            target: 180,
            format: (v) => `${Math.round(v)} min`
        },
        {
            id: 'earnings',
            label: 'Earnings',
            metric: 'earnings',
            target: 60,
            format: (v) => `$${Number(v).toFixed(2)}`
        }
    ];

    function getRpgProgressState() {
        try {
            const raw = JSON.parse(appStorage.getItem(RPG_PROGRESS_STATE_KEY) || '{}');
            const legacyBonus = Math.max(0, Number(raw.bonusXp) || 0);
            return {
                achievementXp: Math.max(0, Number(raw.achievementXp) || legacyBonus),
                dailyQuestXp: Math.max(0, Number(raw.dailyQuestXp) || 0),
                weeklyArcXp: Math.max(0, Number(raw.weeklyArcXp) || 0),
                streakShields: Math.max(0, Math.min(STREAK_SHIELD_MAX, Number(raw.streakShields) || 0)),
                achievementRewards: raw.achievementRewards && typeof raw.achievementRewards === 'object' ? raw.achievementRewards : {},
                dailyQuestRewards: raw.dailyQuestRewards && typeof raw.dailyQuestRewards === 'object' ? raw.dailyQuestRewards : {},
                weeklyArcRewards: raw.weeklyArcRewards && typeof raw.weeklyArcRewards === 'object' ? raw.weeklyArcRewards : {},
                streakShieldUses: raw.streakShieldUses && typeof raw.streakShieldUses === 'object' ? raw.streakShieldUses : {}
            };
        } catch {
            return {
                achievementXp: 0,
                dailyQuestXp: 0,
                weeklyArcXp: 0,
                streakShields: 0,
                achievementRewards: {},
                dailyQuestRewards: {},
                weeklyArcRewards: {},
                streakShieldUses: {}
            };
        }
    }

    function saveRpgProgressState(state) {
        try {
            queueStorageWrite(RPG_PROGRESS_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save RPG progress state', e);
        }
    }

    function clearRpgProgressState() {
        pendingStorageWrites.delete(RPG_PROGRESS_STATE_KEY);
        appStorage.removeItem(RPG_PROGRESS_STATE_KEY);
    }

    function computeCallXpTotal(callRows, currentStreak = 0) {
        if (!isRpgEnabled()) return 0;
        const baseXp = computeBaseXpFromCalls(getRpgEligibleCalls(callRows));
        const streakMult = getStreakRewardMultiplier(currentStreak);
        return Math.max(0, Math.round(baseXp * streakMult));
    }

    function computeTotalXp(callRows, currentStreak = 0) {
        if (!isRpgEnabled()) {
            return {
                callXp: 0,
                achievementXp: 0,
                dailyQuestXp: 0,
                weeklyArcXp: 0,
                totalXp: 0
            };
        }
        const callXp = computeCallXpTotal(callRows, currentStreak);
        const progressState = getRpgProgressState();
        const rewardXp = progressState.achievementXp + progressState.dailyQuestXp + progressState.weeklyArcXp;
        return {
            callXp,
            achievementXp: progressState.achievementXp,
            dailyQuestXp: progressState.dailyQuestXp,
            weeklyArcXp: progressState.weeklyArcXp,
            totalXp: callXp + rewardXp
        };
    }

    function getLevelState(totalXp) {
        let levelState = LEVEL_CURVE[0];
        for (let i = 0; i < LEVEL_CURVE.length; i += 1) {
            if (totalXp >= LEVEL_CURVE[i].xpToReach) levelState = LEVEL_CURVE[i];
            else break;
        }
        const currentLevel = levelState.level;
        const maxLevel = LEVEL_CURVE.length;
        const isMaxLevel = currentLevel >= maxLevel;
        const currentBaseXp = levelState.xpToReach;
        const xpToNext = isMaxLevel ? 0 : levelState.xpToNext;
        const currentIntoLevel = Math.max(0, totalXp - currentBaseXp);
        const progressPct = isMaxLevel ? 100 : (xpToNext > 0 ? Math.min((currentIntoLevel / xpToNext) * 100, 100) : 100);
        const nextLevel = isMaxLevel ? currentLevel : currentLevel + 1;
        const remaining = isMaxLevel ? 0 : Math.max(0, xpToNext - currentIntoLevel);
        return {
            currentLevel,
            maxLevel,
            isMaxLevel,
            totalXp,
            currentIntoLevel,
            xpToNext,
            nextLevel,
            remaining,
            progressPct
        };
    }

    function getWeekRangeLabelFromStartStamp(weekStartStamp) {
        if (!Number.isFinite(weekStartStamp)) return 'This week';
        const startDate = new Date(weekStartStamp);
        const endDate = new Date(weekStartStamp + (6 * 24 * 60 * 60 * 1000));
        const startLabel = startDate.toLocaleDateString(DISPLAY_LOCALE, { month: 'short', day: 'numeric' });
        const endLabel = endDate.toLocaleDateString(DISPLAY_LOCALE, { month: 'short', day: 'numeric' });
        return `${startLabel} - ${endLabel}`;
    }

    function getCurrentWeekRpgProgress(now = new Date()) {
        if (!isRpgEnabled()) return null;
        const weekStartStamp = getWeekStartStampFromDate(now);
        const weekEndStamp = weekStartStamp + (6 * 24 * 60 * 60 * 1000);
        const weekKey = formatDateForInput(new Date(weekStartStamp));

        let callsCount = 0;
        let minutesTotal = 0;
        let earningsTotal = 0;
        const eligibleCalls = getRpgEligibleCalls(calls);
        eligibleCalls.forEach((call) => {
            const stamp = getCallLocalDayStamp(call);
            if (!Number.isFinite(stamp) || stamp < weekStartStamp || stamp > weekEndStamp) return;
            callsCount += 1;
            minutesTotal += Math.max(0, (Number(call.duration) || 0) / (1000 * 60));
            earningsTotal += Number(call.earned) || Number(call.earnings) || 0;
        });

        const values = {
            calls: callsCount,
            minutes: minutesTotal,
            earnings: earningsTotal
        };

        const steps = WEEKLY_ARC_STEPS.map((step) => {
            const current = Math.max(0, Number(values[step.metric]) || 0);
            const target = Math.max(1, Number(step.target) || 1);
            const pct = Math.max(0, Math.min(100, (Math.min(current, target) / target) * 100));
            return {
                ...step,
                current,
                target,
                pct,
                done: current >= target
            };
        });

        return {
            weekKey,
            weekStartStamp,
            weekEndStamp,
            rangeLabel: getWeekRangeLabelFromStartStamp(weekStartStamp),
            steps,
            completedCount: steps.filter((s) => s.done).length
        };
    }

    function getShieldProtectedDayStamps() {
        if (!isRpgEnabled()) return [];
        const state = getRpgProgressState();
        const uses = state.streakShieldUses && typeof state.streakShieldUses === 'object' ? state.streakShieldUses : {};
        const todayStamp = parseDateInput(getCurrentLocalDayKey())?.getTime() || Date.now();
        return Object.keys(uses)
            .map((dayKey) => parseDateInput(dayKey))
            .filter((dateObj) => dateObj instanceof Date && Number.isFinite(dateObj.getTime()))
            .map((dateObj) => new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime())
            .filter((stamp) => stamp <= todayStamp);
    }

    function getStreakShieldState(statsInput = null, stateInput = null) {
        const stats = statsInput || computeAchievementStats();
        const state = stateInput || getRpgProgressState();
        const shields = Math.max(0, Number(state.streakShields) || 0);
        const todayKey = getCurrentLocalDayKey();
        const todayStamp = parseDateInput(todayKey)?.getTime();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const yesterdayStamp = Number.isFinite(todayStamp) ? todayStamp - oneDayMs : NaN;
        let hasTodayCall = false;
        let hasYesterdayCall = false;
        const eligibleCalls = getRpgEligibleCalls(calls);
        eligibleCalls.forEach((call) => {
            const stamp = getCallLocalDayStamp(call);
            if (!Number.isFinite(stamp)) return;
            if (stamp === todayStamp) hasTodayCall = true;
            if (stamp === yesterdayStamp) hasYesterdayCall = true;
        });
        const alreadyProtectedToday = !!(state.streakShieldUses && state.streakShieldUses[todayKey]);
        const canUse = shields > 0 && !hasTodayCall && !alreadyProtectedToday && hasYesterdayCall;

        let reason = 'Protect one no-call day to keep continuity.';
        if (shields <= 0) reason = 'No shields available yet.';
        else if (hasTodayCall) reason = 'You already have calls today.';
        else if (alreadyProtectedToday) reason = 'Today is already protected.';
        else if (!hasYesterdayCall) reason = 'Need at least one call yesterday to bridge continuity.';

        return {
            shields,
            canUse,
            reason,
            todayKey
        };
    }

    function renderWeeklyArcCard(arcInput = null, stateInput = null, statsInput = null) {
        if (!rpgWeeklyArcSteps || !rpgWeeklyArcStatus || !rpgWeeklyArcRange) return;
        const arc = arcInput || getCurrentWeekRpgProgress();
        const state = stateInput || getRpgProgressState();
        const stats = statsInput || computeAchievementStats();
        if (!arc) return;

        rpgWeeklyArcRange.textContent = arc.rangeLabel;
        rpgWeeklyArcSteps.innerHTML = arc.steps.map((step) => {
            const currentLabel = typeof step.format === 'function' ? step.format(step.current) : `${Math.round(step.current)}`;
            const targetLabel = typeof step.format === 'function' ? step.format(step.target) : `${Math.round(step.target)}`;
            return `
                <div>
                    <div class="flex items-center justify-between gap-2 text-[11px] mb-1">
                        <span class="font-semibold text-indigo-700 dark:text-indigo-200">${step.label}</span>
                        <span class="text-indigo-600 dark:text-indigo-300">${currentLabel} / ${targetLabel}</span>
                    </div>
                    <div class="w-full bg-indigo-200 dark:bg-indigo-900 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-indigo-500 h-1.5 rounded-full transition-all duration-300 ease-out" style="width:${step.pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        const completed = arc.completedCount;
        const total = arc.steps.length;
        const hasReward = !!(state.weeklyArcRewards && state.weeklyArcRewards[arc.weekKey]);
        if (hasReward) {
            rpgWeeklyArcStatus.textContent = `${completed}/${total} milestones completed | Reward claimed`;
        } else {
            rpgWeeklyArcStatus.textContent = `${completed}/${total} milestones completed`;
        }

        if (rpgStreakShieldsDisplay) {
            rpgStreakShieldsDisplay.textContent = `${Math.max(0, Number(state.streakShields) || 0)}`;
        }
        const shieldState = getStreakShieldState(stats, state);
        if (rpgStreakShieldHint) {
            rpgStreakShieldHint.textContent = shieldState.reason;
        }
        if (rpgUseShieldBtn) {
            rpgUseShieldBtn.disabled = !shieldState.canUse;
            rpgUseShieldBtn.classList.toggle('opacity-60', !shieldState.canUse);
            rpgUseShieldBtn.classList.toggle('cursor-not-allowed', !shieldState.canUse);
        }
    }

    function grantWeeklyArcRewardIfEligible(arcInput = null, stateInput = null, { notify = true } = {}) {
        const arc = arcInput || getCurrentWeekRpgProgress();
        const state = stateInput || getRpgProgressState();
        if (!arc || !state) return false;
        if (!state.weeklyArcRewards || typeof state.weeklyArcRewards !== 'object') state.weeklyArcRewards = {};
        if (!Number.isFinite(state.weeklyArcXp)) state.weeklyArcXp = 0;
        if (!Number.isFinite(state.streakShields)) state.streakShields = 0;
        if (!state.streakShieldUses || typeof state.streakShieldUses !== 'object') state.streakShieldUses = {};
        if (arc.completedCount < arc.steps.length) return false;
        if (state.weeklyArcRewards[arc.weekKey]) return false;

        state.weeklyArcRewards[arc.weekKey] = {
            xp: WEEKLY_ARC_REWARD_XP,
            awardedAt: new Date().toISOString()
        };
        state.weeklyArcXp += WEEKLY_ARC_REWARD_XP;
        state.streakShields = Math.min(STREAK_SHIELD_MAX, state.streakShields + 1);
        if (notify) {
            showToast(`Weekly arc completed | XP gained: +${WEEKLY_ARC_REWARD_XP}`);
            showToast('Streak shield earned (+1)');
        }
        return true;
    }

    function evaluateWeeklyArc({ notify = true } = {}) {
        if (!isRpgEnabled()) return;
        const arc = getCurrentWeekRpgProgress();
        const state = getRpgProgressState();
        const changed = grantWeeklyArcRewardIfEligible(arc, state, { notify });
        if (changed) {
            saveRpgProgressState(state);
        }
        renderWeeklyArcCard(arc, state, computeAchievementStats());
        if (changed) {
            updateRpgProgress();
        }
    }

    function applyStreakShieldForToday() {
        if (!isRpgEnabled()) return;
        const state = getRpgProgressState();
        const stats = computeAchievementStats();
        const shieldState = getStreakShieldState(stats, state);
        if (!shieldState.canUse) {
            showToast(shieldState.reason);
            return;
        }
        if (!state.streakShieldUses || typeof state.streakShieldUses !== 'object') {
            state.streakShieldUses = {};
        }
        state.streakShields = Math.max(0, (Number(state.streakShields) || 0) - 1);
        state.streakShieldUses[shieldState.todayKey] = new Date().toISOString();
        saveRpgProgressState(state);
        showToast('Streak shield applied for today.');
        evaluateAchievements({ notify: false });
        updateRpgProgress();
    }

    function getDailyFocusQuest(statsInput = null) {
        if (!isRpgEnabled()) return null;
        const stats = statsInput || computeDailyQuestStats();
        const dailyState = ensureDailyQuestRotation();
        const dayKey = dailyState.activeDayKey || getCurrentLocalDayKey();
        const activeQuests = getActiveDailyQuests();
        const completedToday = dailyState.completedByDay?.[dayKey] || {};

        const pending = activeQuests
            .filter((q) => !completedToday[q.id])
            .map((q) => {
                const current = Math.max(0, Number(q.getCurrent(stats)) || 0);
                const target = Math.max(1, Number(q.target) || 1);
                const remaining = Math.max(0, target - current);
                const pct = Math.max(0, Math.min(100, (Math.min(current, target) / target) * 100));
                return { ...q, current, target, remaining, pct };
            });

        if (!pending.length) {
            return {
                dayKey,
                done: true,
                completedCount: activeQuests.length,
                activeCount: activeQuests.length
            };
        }

        pending.sort((a, b) => {
            if (b.pct !== a.pct) return b.pct - a.pct;
            if (a.remaining !== b.remaining) return a.remaining - b.remaining;
            return (Number(b.rewardXp) || 0) - (Number(a.rewardXp) || 0);
        });

        return {
            dayKey,
            done: false,
            completedCount: activeQuests.length - pending.length,
            activeCount: activeQuests.length,
            quest: pending[0]
        };
    }

    function updateRpgProgress() {
        if (!rpgLevelSummary || !rpgLevelProgressBar || !rpgLevelProgressText || !rpgLevelNextText) return;
        if (!isRpgEnabled()) return;
        const stats = computeAchievementStats();
        const progressState = getRpgProgressState();
        const arc = getCurrentWeekRpgProgress();
        const arcChanged = grantWeeklyArcRewardIfEligible(arc, progressState, { notify: false });
        if (arcChanged) {
            saveRpgProgressState(progressState);
        }
        const callXp = computeCallXpTotal(calls, stats.currentStreak);
        const xpTotals = {
            callXp,
            achievementXp: Math.max(0, Number(progressState.achievementXp) || 0),
            dailyQuestXp: Math.max(0, Number(progressState.dailyQuestXp) || 0),
            weeklyArcXp: Math.max(0, Number(progressState.weeklyArcXp) || 0),
            totalXp: 0
        };
        xpTotals.totalXp = xpTotals.callXp + xpTotals.achievementXp + xpTotals.dailyQuestXp + xpTotals.weeklyArcXp;
        const streakMult = getStreakRewardMultiplier(stats.currentStreak);
        const level = getLevelState(xpTotals.totalXp);
        rpgLevelSummary.textContent = `Level ${level.currentLevel} - ${level.totalXp.toLocaleString(DISPLAY_LOCALE)} XP total`;
        rpgLevelProgressBar.style.width = `${level.progressPct}%`;
        if (level.isMaxLevel) {
            rpgLevelProgressText.textContent = 'Max level reached';
            rpgLevelNextText.textContent = `Level cap: ${level.maxLevel}`;
        } else {
            rpgLevelProgressText.textContent = `${level.currentIntoLevel.toLocaleString(DISPLAY_LOCALE)} / ${level.xpToNext.toLocaleString(DISPLAY_LOCALE)} XP`;
            rpgLevelNextText.textContent = `${level.remaining.toLocaleString(DISPLAY_LOCALE)} XP to level ${level.nextLevel}`;
        }

        if (rpgCallXpDisplay) {
            rpgCallXpDisplay.textContent = xpTotals.callXp.toLocaleString(DISPLAY_LOCALE);
        }
        if (rpgAchievementXpDisplay) {
            rpgAchievementXpDisplay.textContent = xpTotals.achievementXp.toLocaleString(DISPLAY_LOCALE);
        }
        if (rpgDailyQuestXpDisplay) {
            rpgDailyQuestXpDisplay.textContent = xpTotals.dailyQuestXp.toLocaleString(DISPLAY_LOCALE);
        }
        if (rpgWeeklyArcXpDisplay) {
            rpgWeeklyArcXpDisplay.textContent = xpTotals.weeklyArcXp.toLocaleString(DISPLAY_LOCALE);
        }
        if (rpgStreakMultiplierDisplay) {
            const bonusPct = Math.round(Math.max(0, (streakMult - 1) * 100));
            rpgStreakMultiplierDisplay.textContent = `x${streakMult.toFixed(2)} (+${bonusPct}%)`;
        }
        if (rpgStreakShieldsDisplay) {
            rpgStreakShieldsDisplay.textContent = `${Math.max(0, Number(progressState.streakShields) || 0)}`;
        }

        const focus = getDailyFocusQuest(computeDailyQuestStats());
        if (focus && rpgDailyFocusMeta && rpgDailyFocusDesc && rpgDailyFocusBar) {
            if (focus.done) {
                rpgDailyFocusMeta.textContent = `${focus.completedCount}/${focus.activeCount} completed`;
                rpgDailyFocusDesc.textContent = 'All daily quests completed. Great consistency today.';
                rpgDailyFocusBar.style.width = '100%';
            } else if (focus.quest) {
                const quest = focus.quest;
                const formattedCurrent = typeof quest.format === 'function' ? quest.format(quest.current) : `${Math.round(quest.current)}`;
                const formattedTarget = typeof quest.format === 'function' ? quest.format(quest.target) : `${Math.round(quest.target)}`;
                rpgDailyFocusMeta.textContent = `${quest.label}: ${formattedCurrent} / ${formattedTarget}`;
                rpgDailyFocusDesc.textContent = `${quest.name}: ${quest.description}`;
                rpgDailyFocusBar.style.width = `${quest.pct}%`;
            }
        }
        renderWeeklyArcCard(arc, progressState, stats);
    }

    // Achievements (passive)
    const ACHIEVEMENTS_STATE_KEY = 'wtt_achievements_state_v1';
    const DAILY_QUESTS_STATE_KEY = 'wtt_daily_quests_state_v1';
    const ACHIEVEMENTS = [
        { id: 'first_call', name: 'First Contact', icon: 'fa-phone', tier: 'Bronze', description: 'Complete your first call.', check: (s) => s.totalCalls >= 1 },
        { id: 'ten_calls', name: 'Busy Hands', icon: 'fa-list-check', tier: 'Bronze', description: 'Complete 10 calls.', check: (s) => s.totalCalls >= 10 },
        { id: 'fifty_calls', name: 'Flow Builder', icon: 'fa-stream', tier: 'Silver', description: 'Complete 50 calls.', check: (s) => s.totalCalls >= 50 },
        { id: 'two_hundred_calls', name: 'Call Veteran', icon: 'fa-headset', tier: 'Gold', description: 'Complete 200 calls.', check: (s) => s.totalCalls >= 200 },
        { id: 'one_hour', name: 'One Focused Hour', icon: 'fa-hourglass-half', tier: 'Bronze', description: 'Log 60 total minutes.', check: (s) => s.totalMinutes >= 60 },
        { id: 'ten_hours', name: 'Deep Work', icon: 'fa-business-time', tier: 'Silver', description: 'Log 10 total hours.', check: (s) => s.totalMinutes >= 600 },
        { id: 'hundred_hours', name: 'Marathon Mindset', icon: 'fa-mountain', tier: 'Gold', description: 'Log 100 total hours.', check: (s) => s.totalMinutes >= 6000 },
        { id: 'week_100', name: 'Century Week', icon: 'fa-dollar-sign', tier: 'Silver', description: 'Reach $100 in a single week.', check: (s) => s.maxWeekEarnings >= 100 },
        { id: 'total_5000_earned', name: 'Money Milestone', icon: 'fa-gem', tier: 'Gold', description: 'Earn $5,000 total.', check: (s) => s.totalEarnings >= 5000 },
        { id: 'total_1000_earned', name: 'Four Digits', icon: 'fa-sack-dollar', tier: 'Gold', description: 'Earn $1,000 total.', check: (s) => s.totalEarnings >= 1000 },
        { id: 'streak_3', name: 'On a Roll', icon: 'fa-fire', tier: 'Bronze', description: 'Work 3 days in a row.', check: (s) => s.longestStreak >= 3 },
        { id: 'streak_7', name: 'Week Warrior', icon: 'fa-calendar-week', tier: 'Silver', description: 'Work 7 days in a row.', check: (s) => s.longestStreak >= 7 },
        { id: 'streak_14', name: 'Habit Architect', icon: 'fa-layer-group', tier: 'Gold', description: 'Work 14 days in a row.', check: (s) => s.longestStreak >= 14 },
        { id: 'recovery_habit', name: 'Bounce Back', icon: 'fa-person-walking-arrow-loop-left', tier: 'Silver', description: 'Return and complete a call after a 3+ day break.', check: (s) => s.recoveryAfterBreak3Count >= 1 },
        { id: 'thirty_work_days', name: 'Consistency Club', icon: 'fa-calendar-check', tier: 'Silver', description: 'Work on 30 unique days.', check: (s) => s.uniqueDaysWorked >= 30 },
        { id: 'sixty_work_days', name: 'Ritual Master', icon: 'fa-crown', tier: 'Gold', description: 'Work on 60 unique days.', check: (s) => s.uniqueDaysWorked >= 60 },
        { id: 'goal_mastery_7', name: 'Goal Chaser', icon: 'fa-bullseye', tier: 'Silver', description: 'Hit your daily goal on 7 different days.', check: (s) => s.goalHitDays >= 7 },
        { id: 'goal_mastery_30', name: 'Goal Master', icon: 'fa-trophy', tier: 'Gold', description: 'Hit your daily goal on 30 different days.', check: (s) => s.goalHitDays >= 30 },
        { id: 'session_first', name: 'First Shift', icon: 'fa-business-time', tier: 'Bronze', description: 'Complete your first session in Session Tracker.', check: (s) => s.sessionsCompleted >= 1 },
        { id: 'session_five', name: 'Shift Builder', icon: 'fa-calendar-check', tier: 'Silver', description: 'Complete 5 tracked sessions.', check: (s) => s.sessionsCompleted >= 5 },
        { id: 'session_focus', name: 'Flow Lock', icon: 'fa-crosshairs', tier: 'Silver', description: 'Complete a focused session (30+ min available with <=5 min idle).', check: (s) => s.focusedSessions >= 1 },
        { id: 'session_util_high', name: 'High Utilization', icon: 'fa-gauge-high', tier: 'Gold', description: 'Complete 3 sessions with 70%+ utilization.', check: (s) => s.highUtilSessions >= 3 },
        { id: 'session_long_4h', name: 'Full Block', icon: 'fa-hourglass-end', tier: 'Gold', description: 'Complete one 4+ hour tracked session.', check: (s) => s.longSessions4h >= 1 },
        { id: 'session_pause_discipline', name: 'Break Discipline', icon: 'fa-pause-circle', tier: 'Silver', description: 'Complete 5 sessions where you used pause/resume.', check: (s) => s.pauseAwareSessions >= 5 },
        { id: 'session_days_20', name: 'Shift Habit', icon: 'fa-calendar-days', tier: 'Gold', description: 'Track sessions on 20 different days.', check: (s) => s.sessionDaysWorked >= 20 },
        { id: 'level_10', name: 'Rookie Adventurer', icon: 'fa-hat-wizard', tier: 'Bronze', rpgOnly: true, description: 'Reach level 10 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 10 },
        { id: 'level_20', name: 'Seasoned Grinder', icon: 'fa-shield-halved', tier: 'Silver', rpgOnly: true, description: 'Reach level 20 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 20 },
        { id: 'level_30', name: 'Elite Specialist', icon: 'fa-dragon', tier: 'Gold', rpgOnly: true, description: 'Reach level 30 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 30 },
        { id: 'level_40', name: 'Legend in Progress', icon: 'fa-crown', tier: 'Gold', rpgOnly: true, description: 'Reach level 40 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 40 },
        { id: 'level_50', name: 'Max Momentum', icon: 'fa-star', tier: 'Gold', rpgOnly: true, description: 'Reach level 50 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 50 },
        { id: 'level_60', name: 'Mythic Routine', icon: 'fa-hat-wizard', tier: 'Gold', rpgOnly: true, description: 'Reach level 60 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 60 },
        { id: 'level_75', name: 'Grandmaster Grind', icon: 'fa-dragon', tier: 'Gold', rpgOnly: true, description: 'Reach level 75 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 75 },
        { id: 'level_100', name: 'Legendary Cap', icon: 'fa-crown', tier: 'Gold', rpgOnly: true, description: 'Reach level 100 in RPG Mode.', check: (s) => getCurrentRpgLevel(s.currentStreak) >= 100 },
        { id: 'long_call_30', name: 'Steady Session', icon: 'fa-stopwatch', tier: 'Bronze', description: 'Complete a 30+ minute call.', check: (s) => s.longestCallMinutes >= 30 },
        { id: 'long_call_120', name: 'Iron Focus', icon: 'fa-medal', tier: 'Gold', description: 'Complete a 2+ hour call.', check: (s) => s.longestCallMinutes >= 120 }
    ];

    const DAILY_QUEST_POOL = [
        { id: 'dq_calls_2', name: 'Quick Start', icon: 'fa-phone', tier: 'Bronze', weight: 1.0, rewardXp: 30, description: 'Complete 2 calls today.', label: 'Calls today', target: 2, getCurrent: (s) => s.todayCalls, format: (v) => `${Math.round(v)}` },
        { id: 'dq_calls_4', name: 'Steady Flow', icon: 'fa-list-check', tier: 'Silver', weight: 0.8, rewardXp: 55, description: 'Complete 4 calls today.', label: 'Calls today', target: 4, getCurrent: (s) => s.todayCalls, format: (v) => `${Math.round(v)}` },
        { id: 'dq_calls_6', name: 'Busy Hour', icon: 'fa-headset', tier: 'Gold', weight: 0.45, rewardXp: 80, description: 'Complete 6 calls today.', label: 'Calls today', target: 6, getCurrent: (s) => s.todayCalls, format: (v) => `${Math.round(v)}` },
        { id: 'dq_earn_20', name: 'Pocket Win', icon: 'fa-sack-dollar', tier: 'Bronze', weight: 1.0, rewardXp: 35, description: 'Earn $20 today.', label: 'Earnings today', target: 20, getCurrent: (s) => s.todayEarnings, format: (v) => `$${Number(v).toFixed(2)}` },
        { id: 'dq_earn_35', name: 'Good Shift', icon: 'fa-coins', tier: 'Silver', weight: 0.75, rewardXp: 60, description: 'Earn $35 today.', label: 'Earnings today', target: 35, getCurrent: (s) => s.todayEarnings, format: (v) => `$${Number(v).toFixed(2)}` },
        { id: 'dq_minutes_30', name: '30-Min Sprint', icon: 'fa-stopwatch', tier: 'Bronze', weight: 1.0, rewardXp: 30, description: 'Work 30 total minutes today.', label: 'Minutes today', target: 30, getCurrent: (s) => s.todayMinutes, format: (v) => `${Math.round(v)} min` },
        { id: 'dq_minutes_60', name: 'One-Hour Push', icon: 'fa-hourglass-half', tier: 'Silver', weight: 0.8, rewardXp: 55, description: 'Work 60 total minutes today.', label: 'Minutes today', target: 60, getCurrent: (s) => s.todayMinutes, format: (v) => `${Math.round(v)} min` },
        { id: 'dq_long_call_15', name: 'Deep Focus', icon: 'fa-clock', tier: 'Bronze', weight: 0.9, rewardXp: 35, description: 'Complete a 15+ minute call today.', label: 'Longest call today', target: 15, getCurrent: (s) => s.todayLongestCallMinutes, format: (v) => `${Math.round(v)} min` }
    ];

    function getAchievementState() {
        try {
            const raw = JSON.parse(appStorage.getItem(ACHIEVEMENTS_STATE_KEY) || '{}');
            const unlocked = raw?.unlocked && typeof raw.unlocked === 'object' ? raw.unlocked : {};
            if (unlocked.max_100_day && !unlocked.week_100) {
                unlocked.week_100 = unlocked.max_100_day;
                delete unlocked.max_100_day;
            }
            return { unlocked };
        } catch {
            return { unlocked: {} };
        }
    }

    function saveAchievementState(state) {
        try {
            queueStorageWrite(ACHIEVEMENTS_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save achievements state', e);
        }
    }

    function clearAchievementState() {
        pendingStorageWrites.delete(ACHIEVEMENTS_STATE_KEY);
        appStorage.removeItem(ACHIEVEMENTS_STATE_KEY);
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

    function getDailyQuestState() {
        try {
            const raw = JSON.parse(appStorage.getItem(DAILY_QUESTS_STATE_KEY) || '{}');
            return {
                activeDayKey: typeof raw.activeDayKey === 'string' ? raw.activeDayKey : '',
                activeQuestIds: Array.isArray(raw.activeQuestIds) ? raw.activeQuestIds : [],
                completedByDay: raw.completedByDay && typeof raw.completedByDay === 'object' ? raw.completedByDay : {}
            };
        } catch {
            return { activeDayKey: '', activeQuestIds: [], completedByDay: {} };
        }
    }

    function saveDailyQuestState(state) {
        try {
            queueStorageWrite(DAILY_QUESTS_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save daily quest state', e);
        }
    }

    function clearDailyQuestState() {
        pendingStorageWrites.delete(DAILY_QUESTS_STATE_KEY);
        appStorage.removeItem(DAILY_QUESTS_STATE_KEY);
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

    function pickDailyQuestIds(dayKey, count = 4) {
        const rng = mulberry32(seededHashFromString(`wtt-dq-${dayKey}`));
        const workingPool = [...DAILY_QUEST_POOL];
        const picks = [];
        const maxPicks = Math.min(count, workingPool.length);

        while (picks.length < maxPicks && workingPool.length > 0) {
            const idx = pickWeightedQuest(workingPool, rng);
            const chosen = workingPool.splice(idx, 1)[0];
            picks.push(chosen.id);
        }

        return picks;
    }

    function ensureDailyQuestRotation() {
        const state = getDailyQuestState();
        const dayKey = getCurrentLocalDayKey();
        const needsRefresh = state.activeDayKey !== dayKey || !Array.isArray(state.activeQuestIds) || state.activeQuestIds.length === 0;
        if (needsRefresh) {
            state.activeDayKey = dayKey;
            state.activeQuestIds = pickDailyQuestIds(dayKey, 4);
            if (!state.completedByDay || typeof state.completedByDay !== 'object') state.completedByDay = {};
            if (!state.completedByDay[dayKey] || typeof state.completedByDay[dayKey] !== 'object') {
                state.completedByDay[dayKey] = {};
            }
            saveDailyQuestState(state);
        }
        return state;
    }

    function getActiveDailyQuests() {
        const state = ensureDailyQuestRotation();
        const selected = state.activeQuestIds
            .map((id) => DAILY_QUEST_POOL.find((q) => q.id === id))
            .filter(Boolean);
        if (selected.length > 0) return selected;
        return DAILY_QUEST_POOL.slice(0, 4);
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

    function computeAchievementStats() {
        const dayEarnings = new Map();
        const dayMinutes = new Map();
        const weekEarnings = new Map();
        const uniqueDayStamps = new Set();
        const now = new Date();
        const todayStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        let totalCalls = 0;
        let totalMinutes = 0;
        let totalEarnings = 0;
        let longestCallMinutes = 0;
        let todayCalls = 0;
        let todayMinutes = 0;
        let todayLongestCallMinutes = 0;

        calls.forEach((call) => {
            totalCalls += 1;
            const durationMin = Math.max(0, (Number(call.duration) || 0) / (1000 * 60));
            const earned = Number(call.earned) || Number(call.earnings) || 0;
            totalMinutes += durationMin;
            totalEarnings += earned;
            longestCallMinutes = Math.max(longestCallMinutes, durationMin);

            const dayStamp = getCallLocalDayStamp(call);
            if (Number.isFinite(dayStamp)) {
                uniqueDayStamps.add(dayStamp);
                dayEarnings.set(dayStamp, (dayEarnings.get(dayStamp) || 0) + earned);
                dayMinutes.set(dayStamp, (dayMinutes.get(dayStamp) || 0) + durationMin);
                const startDate = new Date(call.startTime);
                const weekStamp = getWeekStartStampFromDate(startDate);
                if (Number.isFinite(weekStamp)) {
                    weekEarnings.set(weekStamp, (weekEarnings.get(weekStamp) || 0) + earned);
                }
                if (dayStamp === todayStamp) {
                    todayCalls += 1;
                    todayMinutes += durationMin;
                    todayLongestCallMinutes = Math.max(todayLongestCallMinutes, durationMin);
                }
            }

        });

        const sortedDays = Array.from(uniqueDayStamps).sort((a, b) => a - b);
        const streakDayStamps = Array.from(new Set([
            ...sortedDays,
            ...getShieldProtectedDayStamps()
        ])).sort((a, b) => a - b);
        const sessionStats = getSessionRpgStatsState();
        const sessionDaysWorked = Object.keys(sessionStats.daysWorked || {}).length;
        const maxDayEarnings = dayEarnings.size ? Math.max(...Array.from(dayEarnings.values())) : 0;
        const maxWeekEarnings = weekEarnings.size ? Math.max(...Array.from(weekEarnings.values())) : 0;
        const todayEarnings = dayEarnings.get(todayStamp) || 0;
        let recoveryAfterBreak3Count = 0;
        for (let i = 1; i < sortedDays.length; i += 1) {
            const diffDays = Math.round((sortedDays[i] - sortedDays[i - 1]) / (24 * 60 * 60 * 1000));
            if (diffDays >= 4) recoveryAfterBreak3Count += 1;
        }
        const hasGoalConfigured = (Number(dailyGoal?.amount) || 0) > 0 || (Number(dailyGoal?.minutes) || 0) > 0;
        let goalHitDays = 0;
        if (hasGoalConfigured) {
            const goalAmount = Math.max(0, Number(dailyGoal?.amount) || 0);
            const goalMinutes = Math.max(0, Number(dailyGoal?.minutes) || 0);
            sortedDays.forEach((stamp) => {
                const earned = dayEarnings.get(stamp) || 0;
                const minutes = dayMinutes.get(stamp) || 0;
                const hitByAmount = goalAmount > 0 ? earned >= goalAmount : false;
                const hitByMinutes = goalMinutes > 0 ? minutes >= goalMinutes : false;
                if (hitByAmount || (!goalAmount && hitByMinutes)) {
                    goalHitDays += 1;
                }
            });
        }

        return {
            totalCalls,
            totalMinutes,
            totalEarnings,
            maxDayEarnings,
            maxWeekEarnings,
            todayEarnings,
            todayCalls,
            todayMinutes,
            todayLongestCallMinutes,
            recoveryAfterBreak3Count,
            goalHitDays,
            hasGoalConfigured,
            uniqueDaysWorked: uniqueDayStamps.size,
            sessionsCompleted: Math.max(0, Number(sessionStats.sessionsCompleted) || 0),
            sessionDaysWorked,
            highUtilSessions: Math.max(0, Number(sessionStats.highUtilSessions) || 0),
            focusedSessions: Math.max(0, Number(sessionStats.focusedSessions) || 0),
            longSessions4h: Math.max(0, Number(sessionStats.longSessions4h) || 0),
            pauseAwareSessions: Math.max(0, Number(sessionStats.pauseAwareSessions) || 0),
            longestStreak: computeLongestStreak(streakDayStamps),
            currentStreak: computeCurrentStreak(streakDayStamps),
            longestCallMinutes
        };
    }

    function computeDailyQuestStats() {
        const now = new Date();
        const todayStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const eligibleCalls = getRpgEligibleCalls(calls);
        let todayCalls = 0;
        let todayMinutes = 0;
        let todayEarnings = 0;
        let todayLongestCallMinutes = 0;

        eligibleCalls.forEach((call) => {
            const dayStamp = getCallLocalDayStamp(call);
            if (dayStamp !== todayStamp) return;
            const durationMin = Math.max(0, (Number(call.duration) || 0) / (1000 * 60));
            const earned = Number(call.earned) || Number(call.earnings) || 0;
            todayCalls += 1;
            todayMinutes += durationMin;
            todayEarnings += earned;
            todayLongestCallMinutes = Math.max(todayLongestCallMinutes, durationMin);
        });

        return {
            todayCalls,
            todayMinutes,
            todayEarnings,
            todayLongestCallMinutes
        };
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
            card: 'border-gray-200 dark:border-gray-700'
        };
        if (tier === 'Gold') return {
            badge: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
            card: 'border-amber-300 dark:border-amber-700'
        };
        if (tier === 'Silver') return {
            badge: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
            card: 'border-slate-300 dark:border-slate-600'
        };
        return {
            badge: 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
            card: 'border-orange-300 dark:border-orange-700'
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

    function getAchievementById(id) {
        return ACHIEVEMENTS.find((a) => a.id === id) || null;
    }

    function getVisibleAchievements() {
        return isRpgEnabled() ? ACHIEVEMENTS : ACHIEVEMENTS.filter((a) => !a.rpgOnly);
    }

    function getCurrentRpgLevel(currentStreak = 0) {
        if (!isRpgEnabled()) return 0;
        return getLevelState(computeTotalXp(calls, currentStreak).totalXp).currentLevel;
    }

    function getAchievementProgress(achievement, stats, unlocked) {
        const meta = {
            label: 'Progress',
            current: 0,
            target: 1,
            formatter: (v) => `${Math.round(v).toLocaleString(DISPLAY_LOCALE)}`
        };

        switch (achievement.id) {
            case 'first_call':
                meta.current = stats.totalCalls;
                meta.target = 1;
                meta.label = 'Calls completed';
                break;
            case 'ten_calls':
                meta.current = stats.totalCalls;
                meta.target = 10;
                meta.label = 'Calls completed';
                break;
            case 'fifty_calls':
                meta.current = stats.totalCalls;
                meta.target = 50;
                meta.label = 'Calls completed';
                break;
            case 'two_hundred_calls':
                meta.current = stats.totalCalls;
                meta.target = 200;
                meta.label = 'Calls completed';
                break;
            case 'one_hour':
                meta.current = stats.totalMinutes;
                meta.target = 60;
                meta.label = 'Total minutes';
                break;
            case 'ten_hours':
                meta.current = stats.totalMinutes;
                meta.target = 600;
                meta.label = 'Total minutes';
                break;
            case 'hundred_hours':
                meta.current = stats.totalMinutes;
                meta.target = 6000;
                meta.label = 'Total minutes';
                break;
            case 'week_100':
                meta.current = stats.maxWeekEarnings;
                meta.target = 100;
                meta.label = 'Best week earnings';
                meta.formatter = (v) => `$${Number(v).toFixed(2)}`;
                break;
            case 'total_1000_earned':
                meta.current = stats.totalEarnings;
                meta.target = 1000;
                meta.label = 'All-time earnings';
                meta.formatter = (v) => `$${Number(v).toFixed(2)}`;
                break;
            case 'total_5000_earned':
                meta.current = stats.totalEarnings;
                meta.target = 5000;
                meta.label = 'All-time earnings';
                meta.formatter = (v) => `$${Number(v).toFixed(2)}`;
                break;
            case 'streak_3':
                meta.current = stats.longestStreak;
                meta.target = 3;
                meta.label = 'Longest streak (days)';
                break;
            case 'streak_7':
                meta.current = stats.longestStreak;
                meta.target = 7;
                meta.label = 'Longest streak (days)';
                break;
            case 'streak_14':
                meta.current = stats.longestStreak;
                meta.target = 14;
                meta.label = 'Longest streak (days)';
                break;
            case 'recovery_habit':
                meta.current = stats.recoveryAfterBreak3Count;
                meta.target = 1;
                meta.label = 'Returns after 3+ day breaks';
                break;
            case 'thirty_work_days':
                meta.current = stats.uniqueDaysWorked;
                meta.target = 30;
                meta.label = 'Unique days worked';
                break;
            case 'sixty_work_days':
                meta.current = stats.uniqueDaysWorked;
                meta.target = 60;
                meta.label = 'Unique days worked';
                break;
            case 'goal_mastery_7':
                meta.current = stats.goalHitDays;
                meta.target = 7;
                meta.label = stats.hasGoalConfigured ? 'Days with goal reached' : 'Set a daily goal to track';
                break;
            case 'goal_mastery_30':
                meta.current = stats.goalHitDays;
                meta.target = 30;
                meta.label = stats.hasGoalConfigured ? 'Days with goal reached' : 'Set a daily goal to track';
                break;
            case 'session_first':
                meta.current = stats.sessionsCompleted;
                meta.target = 1;
                meta.label = 'Completed sessions';
                break;
            case 'session_five':
                meta.current = stats.sessionsCompleted;
                meta.target = 5;
                meta.label = 'Completed sessions';
                break;
            case 'session_focus':
                meta.current = stats.focusedSessions;
                meta.target = 1;
                meta.label = 'Focused sessions';
                break;
            case 'session_util_high':
                meta.current = stats.highUtilSessions;
                meta.target = 3;
                meta.label = '70%+ utilization sessions';
                break;
            case 'session_long_4h':
                meta.current = stats.longSessions4h;
                meta.target = 1;
                meta.label = '4+ hour sessions';
                break;
            case 'session_pause_discipline':
                meta.current = stats.pauseAwareSessions;
                meta.target = 5;
                meta.label = 'Pause/resume sessions';
                break;
            case 'session_days_20':
                meta.current = stats.sessionDaysWorked;
                meta.target = 20;
                meta.label = 'Session days tracked';
                break;
            case 'level_10':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 10;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_20':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 20;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_30':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 30;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_40':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 40;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_50':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 50;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_60':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 60;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_75':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 75;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'level_100':
                meta.current = getCurrentRpgLevel(stats.currentStreak);
                meta.target = 100;
                meta.label = 'Current level';
                meta.formatter = (v) => `Lv ${Math.round(v)}`;
                break;
            case 'long_call_30':
                meta.current = stats.longestCallMinutes;
                meta.target = 30;
                meta.label = 'Longest call (minutes)';
                break;
            case 'long_call_120':
                meta.current = stats.longestCallMinutes;
                meta.target = 120;
                meta.label = 'Longest call (minutes)';
                break;
            default:
                meta.current = unlocked ? 1 : 0;
                meta.target = 1;
                break;
        }

        const cappedCurrent = unlocked ? meta.target : Math.min(meta.current, meta.target);
        const pct = meta.target > 0 ? Math.max(0, Math.min(100, (cappedCurrent / meta.target) * 100)) : 0;
        return {
            ...meta,
            current: cappedCurrent,
            pct
        };
    }

    function formatAchievementDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (!Number.isFinite(d.getTime())) return '';
        return d.toLocaleDateString(DISPLAY_LOCALE, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function renderAchievementsModal() {
        if (!achievementsGrid || !achievementsSummary) return;
        const state = getAchievementState();
        const rpgState = getRpgProgressState();
        const stats = computeAchievementStats();
        const streakMult = getStreakRewardMultiplier(stats.currentStreak);
        const rpgEnabled = isRpgEnabled();
        const visibleAchievements = getVisibleAchievements();
        if (rpgWeeklyArcCard) rpgWeeklyArcCard.style.display = rpgEnabled ? '' : 'none';
        if (rpgStreakShieldRow) rpgStreakShieldRow.style.display = rpgEnabled ? '' : 'none';
        renderDailyQuestsSection(computeDailyQuestStats());
        const unlockedCount = visibleAchievements.filter((a) => !!state.unlocked[a.id]).length;
        achievementsSummary.innerHTML = rpgEnabled
            ? `
            <span>${unlockedCount} / ${visibleAchievements.length} unlocked | Current streak: ${stats.currentStreak} day(s) | Call XP multiplier: x${streakMult.toFixed(2)}</span>
            <span class="hint-tooltip hint-tooltip-right ml-1" data-tooltip="Streak multiplier starts at 3 days (+5%), then +2% per extra day, capped at +35%. It boosts call XP. Achievement rewards scale by level only.">?</span>
        `
            : `<span>${unlockedCount} / ${visibleAchievements.length} unlocked | Current streak: ${stats.currentStreak} day(s)</span>`;

        achievementsGrid.innerHTML = visibleAchievements.map((a) => {
            const unlocked = !!state.unlocked[a.id];
            const tierStyles = getTierClasses(a.tier, unlocked);
            const earnedXp = Number(rpgState.achievementRewards?.[a.id]?.xp) || 0;
            const statusLabel = unlocked ? 'Unlocked' : 'Locked';
            const unlockedAt = unlocked ? formatAchievementDate(state.unlocked[a.id]) : '';
            const progress = getAchievementProgress(a, stats, unlocked);
            const progressText = `${progress.formatter(progress.current)} / ${progress.formatter(progress.target)}`;
            return `
                <button type="button" class="achievement-card-btn settings-section-card border ${tierStyles.card} ${unlocked ? 'opacity-100' : 'opacity-80'}" data-achievement-id="${a.id}">
                    <div class="flex items-start justify-between gap-3 mb-1">
                        <div class="font-semibold text-gray-800 dark:text-gray-100">
                            <i class="fas ${a.icon} mr-2 ${unlocked ? 'text-amber-500' : 'text-gray-400'}"></i>${a.name}
                        </div>
                        <span class="text-xs px-2 py-1 rounded-full ${tierStyles.badge}">${a.tier}</span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">${a.description}</p>
                    <div class="mb-2">
                        <div class="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                            <span>${progress.label}</span>
                            <span>${progressText}</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div class="achievement-progress-fill bg-amber-500 h-1.5 rounded-full transition-all duration-500 ease-out" style="width:${progress.pct}%"></div>
                        </div>
                    </div>
                    ${rpgEnabled
                        ? (unlocked
                            ? `<div class="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-semibold">XP earned: +${earnedXp.toLocaleString(DISPLAY_LOCALE)} XP</div>
                               <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Earned on ${unlockedAt}</div>`
                            : `<div class="text-xs text-gray-500 dark:text-gray-400 mb-1">XP reward hidden until unlocked</div>`)
                        : (unlocked
                            ? `<div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Earned on ${unlockedAt}</div>`
                            : '')
                    }
                    <div class="text-xs font-semibold ${unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}">${statusLabel}</div>
                </button>
            `;
        }).join('');
    }

    function renderDailyQuestsSection(statsInput = null) {
        if (!dailyQuestsGrid || !dailyQuestsSummary) return;
        if (!isRpgEnabled()) {
            if (dailyQuestsSection) dailyQuestsSection.style.display = 'none';
            dailyQuestsGrid.innerHTML = '';
            dailyQuestsSummary.textContent = '';
            if (dailyQuestsDate) dailyQuestsDate.textContent = '';
            return;
        }
        const stats = statsInput || computeDailyQuestStats();
        const dailyState = ensureDailyQuestRotation();
        const dayKey = dailyState.activeDayKey || getCurrentLocalDayKey();
        const activeQuests = getActiveDailyQuests();
        const completedToday = dailyState.completedByDay?.[dayKey] || {};
        const completedCount = activeQuests.filter((q) => !!completedToday[q.id]).length;

        if (dailyQuestsSection) dailyQuestsSection.style.display = '';
        if (dailyQuestsDate) {
            dailyQuestsDate.textContent = dayKey;
        }
        dailyQuestsSummary.textContent = `${completedCount} / ${activeQuests.length} completed today`;

        dailyQuestsGrid.innerHTML = activeQuests.map((q) => {
            const completedAt = completedToday[q.id] || null;
            const unlocked = !!completedAt;
            const tierStyles = getTierClasses(q.tier, unlocked);
            const rawCurrent = Number(q.getCurrent(stats)) || 0;
            const current = unlocked ? q.target : Math.min(rawCurrent, q.target);
            const pct = Math.max(0, Math.min(100, (current / q.target) * 100));
            const progressText = `${q.format(current)} / ${q.format(q.target)}`;
            const doneText = unlocked ? `Completed on ${formatAchievementDate(completedAt)}` : 'In progress';
            return `
                <div class="settings-section-card border ${tierStyles.card} ${unlocked ? 'opacity-100' : 'opacity-90'}">
                    <div class="flex items-start justify-between gap-3 mb-1">
                        <div class="font-semibold text-gray-800 dark:text-gray-100">
                            <i class="fas ${q.icon} mr-2 ${unlocked ? 'text-emerald-500' : 'text-gray-400'}"></i>${q.name}
                        </div>
                        <span class="text-xs px-2 py-1 rounded-full ${tierStyles.badge}">+${q.rewardXp} XP</span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">${q.description}</p>
                    <div class="mb-2">
                        <div class="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                            <span>${q.label}</span>
                            <span>${progressText}</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div class="achievement-progress-fill bg-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out" style="width:${pct}%"></div>
                        </div>
                    </div>
                    <div class="text-xs font-semibold ${unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}">${doneText}</div>
                </div>
            `;
        }).join('');
    }

    function evaluateDailyQuests({ notify = true } = {}) {
        if (!isRpgEnabled()) {
            renderDailyQuestsSection();
            return;
        }
        const stats = computeDailyQuestStats();
        const dailyState = ensureDailyQuestRotation();
        const dayKey = dailyState.activeDayKey || getCurrentLocalDayKey();
        if (!dailyState.completedByDay || typeof dailyState.completedByDay !== 'object') {
            dailyState.completedByDay = {};
        }
        if (!dailyState.completedByDay[dayKey] || typeof dailyState.completedByDay[dayKey] !== 'object') {
            dailyState.completedByDay[dayKey] = {};
        }

        const activeQuests = getActiveDailyQuests();
        const rpgState = getRpgProgressState();
        if (!rpgState.dailyQuestRewards || typeof rpgState.dailyQuestRewards !== 'object') {
            rpgState.dailyQuestRewards = {};
        }
        if (!Number.isFinite(rpgState.dailyQuestXp)) {
            rpgState.dailyQuestXp = 0;
        }
        const rewards = [];
        let changed = false;

        activeQuests.forEach((q) => {
            if (dailyState.completedByDay[dayKey][q.id]) return;
            const current = Number(q.getCurrent(stats)) || 0;
            if (current < q.target) return;
            const rewardId = `${dayKey}:${q.id}`;
            if (!rpgState.dailyQuestRewards[rewardId]) {
                rpgState.dailyQuestRewards[rewardId] = {
                    xp: q.rewardXp,
                    dayKey,
                    completedAt: new Date().toISOString(),
                    questId: q.id
                };
                rpgState.dailyQuestXp += q.rewardXp;
                rewards.push({ name: q.name, xp: q.rewardXp });
            }
            dailyState.completedByDay[dayKey][q.id] = new Date().toISOString();
            changed = true;
        });

        if (changed) {
            saveDailyQuestState(dailyState);
            saveRpgProgressState(rpgState);
            updateRpgProgress();
            if (notify) {
                rewards.forEach((r) => showToast(`Daily quest completed: ${r.name} | XP gained: +${r.xp}`));
            }
        }

        renderDailyQuestsSection(stats);
        evaluateWeeklyArc({ notify });
    }

    function renderAchievementDetailModal(achievementId) {
        if (!achievementDetailModal) return;
        const achievement = getAchievementById(achievementId);
        if (!achievement) return;

        const state = getAchievementState();
        const stats = computeAchievementStats();
        const unlocked = !!state.unlocked[achievement.id];
        const progress = getAchievementProgress(achievement, stats, unlocked);
        const tierStyles = getTierClasses(achievement.tier, unlocked);
        const unlockedAt = unlocked ? formatAchievementDate(state.unlocked[achievement.id]) : '';

        if (achievementDetailTitle) {
            achievementDetailTitle.innerHTML = `<i class="fas ${achievement.icon} mr-2 ${unlocked ? 'text-amber-500' : 'text-gray-400'}"></i>${achievement.name}`;
        }
        if (achievementDetailTier) {
            achievementDetailTier.className = `text-xs inline-block px-2 py-1 rounded-full mb-3 ${tierStyles.badge}`;
            achievementDetailTier.textContent = achievement.tier;
        }
        if (achievementDetailDescription) {
            achievementDetailDescription.textContent = achievement.description;
        }
        if (achievementDetailProgressLabel) {
            achievementDetailProgressLabel.textContent = progress.label;
        }
        if (achievementDetailProgressText) {
            achievementDetailProgressText.textContent = `${progress.formatter(progress.current)} / ${progress.formatter(progress.target)} (${Math.round(progress.pct)}%)`;
        }
        if (achievementDetailProgressBar) {
            achievementDetailProgressBar.style.width = `${progress.pct}%`;
        }
        if (achievementDetailEarnedRow && achievementDetailEarnedAt) {
            if (unlocked) {
                achievementDetailEarnedRow.style.display = '';
                achievementDetailEarnedAt.textContent = `Earned on ${unlockedAt}`;
            } else {
                achievementDetailEarnedRow.style.display = 'none';
                achievementDetailEarnedAt.textContent = '';
            }
        }
    }

    function evaluateAchievements({ notify = true } = {}) {
        const state = getAchievementState();
        const rpgState = getRpgProgressState();
        const stats = computeAchievementStats();
        const newlyUnlocked = [];
        const nowIso = new Date().toISOString();
        const rewardEvents = [];

        ACHIEVEMENTS.forEach((a) => {
            if (state.unlocked[a.id]) return;
            if (a.check(stats)) {
                state.unlocked[a.id] = nowIso;
                newlyUnlocked.push(a);
                if (isRpgEnabled()) {
                    const currentXpBeforeReward = computeTotalXp(calls, stats.currentStreak).totalXp;
                    const levelState = getLevelState(currentXpBeforeReward);
                    const levelMult = getLevelRewardMultiplier(levelState.currentLevel);
                    const baseXp = getAchievementBaseXp(a.tier);
                    const rewardXp = Math.max(1, Math.round(baseXp * levelMult));

                    rpgState.achievementRewards[a.id] = {
                        xp: rewardXp,
                        baseXp,
                        levelAtUnlock: levelState.currentLevel,
                        streakAtUnlock: stats.currentStreak,
                        unlockedAt: nowIso
                    };
                    rpgState.achievementXp += rewardXp;
                    rewardEvents.push({ name: a.name, xp: rewardXp });
                }
            }
        });

        if (newlyUnlocked.length > 0) {
            saveAchievementState(state);
            if (isRpgEnabled()) {
                saveRpgProgressState(rpgState);
                updateRpgProgress();
            }
            if (notify && isRpgEnabled()) {
                rewardEvents.forEach((r) => {
                    showToast(`Achievement unlocked: ${r.name} | XP gained: +${r.xp}`);
                });
            }
        }

        renderAchievementsModal();
        if (achievementDetailModal && ModalManager.isOpen(achievementDetailModal) && selectedAchievementId) {
            renderAchievementDetailModal(selectedAchievementId);
        }
        evaluateDailyQuests({ notify });
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

function parseCsvImportRows(csvImportData, columnMap = csvImportData?.columnMap || {}) {
    const headers = Array.isArray(csvImportData?.headers) ? csvImportData.headers : [];
    const dataRows = Array.isArray(csvImportData?.rows) ? csvImportData.rows : [];
    if (dataRows.length === 0) {
        throw new Error('The CSV file is empty or does not contain any call rows.');
    }

    const resolvedMap = {
        date: Number.isInteger(columnMap.date) ? columnMap.date : -1,
        start: Number.isInteger(columnMap.start) ? columnMap.start : -1,
        end: Number.isInteger(columnMap.end) ? columnMap.end : -1,
        duration: Number.isInteger(columnMap.duration) ? columnMap.duration : -1,
        rate: Number.isInteger(columnMap.rate) ? columnMap.rate : -1
    };

    return dataRows.map((cells, rowIndex) => {
        const getCell = (idx) => idx >= 0 ? String(cells[idx] || '').trim() : '';
        const callDate = parseFlexibleDate(getCell(resolvedMap.date));
        const startTime = parseFlexibleTime(getCell(resolvedMap.start));
        const endTime = parseFlexibleTime(getCell(resolvedMap.end));
        const durationRaw = getCell(resolvedMap.duration);
        const durationMs = minutesToMs(durationRaw);
        const hasDuration = durationRaw.length > 0;
        const matchedRate = findMatchingRate(getCell(resolvedMap.rate));
        const issues = [];

        if (resolvedMap.date === -1) {
            issues.push('Select a Call Date column');
        } else if (!callDate) {
            issues.push('Invalid or missing date');
        }
        if (resolvedMap.start === -1 && resolvedMap.end === -1 && resolvedMap.duration === -1) {
            issues.push('Select Start Time, End Time, or Duration');
        }
        if (hasDuration && !Number.isFinite(durationMs)) issues.push('Invalid duration');

        let finalStart = combineCallDateAndParsedTime(callDate, startTime);
        let finalEnd = combineCallDateAndParsedTime(callDate, endTime);

        if (finalStart && finalEnd && finalEnd <= finalStart) {
            finalEnd = new Date(finalEnd.getTime() + (24 * 60 * 60 * 1000));
        }

        if (Number.isFinite(durationMs) && durationMs > 0) {
            if (finalStart && !finalEnd) {
                finalEnd = new Date(finalStart.getTime() + durationMs);
            } else if (!finalStart && finalEnd) {
                finalStart = new Date(finalEnd.getTime() - durationMs);
            } else if (!finalStart && !finalEnd && callDate) {
                finalStart = new Date(callDate.getFullYear(), callDate.getMonth(), callDate.getDate(), 12, 0, 0, 0);
                finalEnd = new Date(finalStart.getTime() + durationMs);
            }
        }

        if (!finalStart || !finalEnd || finalEnd <= finalStart) {
            issues.push('Not enough valid time information');
        }

        return {
            rowNumber: rowIndex + 2,
            headers,
            callDate,
            startTime: finalStart,
            endTime: finalEnd,
            durationMs: finalStart && finalEnd ? Math.max(0, finalEnd.getTime() - finalStart.getTime()) : 0,
            importedRate: matchedRate,
            rawRate: getCell(columnMap.rate),
            issues
        };
    });
}

function getCsvColumnSelectValue(selectEl) {
    if (!selectEl) return -1;
    const value = Number(selectEl.value);
    return Number.isInteger(value) ? value : -1;
}

function getCsvImportColumnMapFromUi() {
    return {
        date: getCsvColumnSelectValue(csvImportDateColumnSelect),
        start: getCsvColumnSelectValue(csvImportStartColumnSelect),
        end: getCsvColumnSelectValue(csvImportEndColumnSelect),
        duration: getCsvColumnSelectValue(csvImportDurationColumnSelect),
        rate: getCsvColumnSelectValue(csvImportRateColumnSelect)
    };
}

function populateCsvImportColumnMapping(headers, columnMap) {
    const selectConfigs = [
        { element: csvImportDateColumnSelect, value: columnMap?.date ?? -1, includeIgnore: false },
        { element: csvImportStartColumnSelect, value: columnMap?.start ?? -1, includeIgnore: true },
        { element: csvImportEndColumnSelect, value: columnMap?.end ?? -1, includeIgnore: true },
        { element: csvImportDurationColumnSelect, value: columnMap?.duration ?? -1, includeIgnore: true },
        { element: csvImportRateColumnSelect, value: columnMap?.rate ?? -1, includeIgnore: true }
    ];

    const options = headers.map((header, index) => ({
        value: String(index),
        label: header || `Column ${index + 1}`
    }));

    selectConfigs.forEach(({ element, value, includeIgnore }) => {
        if (!element) return;
        const optionHtml = [
            includeIgnore ? '<option value="-1">Ignore this column</option>' : '<option value="-1">Select a column</option>',
            ...options.map((option) => `<option value="${option.value}">${escapeHTML(option.label)}</option>`)
        ].join('');
        element.innerHTML = optionHtml;
        const normalizedValue = Number.isInteger(value) && value >= 0 && value < headers.length ? String(value) : '-1';
        element.value = normalizedValue;
    });
}

function getCsvImportMappingIssues(columnMap) {
    const issues = [];
    if (columnMap.date === -1) issues.push('Select which CSV column contains the call date.');
    if (columnMap.start === -1 && columnMap.end === -1 && columnMap.duration === -1) {
        issues.push('Select at least one time field: Start Time, End Time, or Duration.');
    }
    return issues;
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

function getSelectedCsvImportRate() {
    if (!csvImportRateSelect || !csvImportRateSelect.value) return null;
    const selected = rates.find((rate) => rate.name === csvImportRateSelect.value);
    return selected ? { amount: Number(selected.amount) || 0, rateName: selected.name } : null;
}

function getResolvedCsvImportRate(row) {
    const selected = getSelectedCsvImportRate();
    const override = !!csvImportOverrideRateToggle?.checked;
    if (selected && (override || !row.importedRate)) return selected;
    if (row.importedRate) return { amount: Number(row.importedRate.amount) || 0, rateName: row.importedRate.rateName || '' };
    return { amount: 0, rateName: '' };
}

function buildCsvPreviewRows(parsedRows) {
    const existingKeys = new Set(readCallsFromStorage().map(getCallDuplicateKey));
    const fileKeys = new Set();
    const selectedRows = pendingCsvImport?.selectedRows || new Set();
    const selectionMode = pendingCsvImport?.selectionMode || 'default';
    const requireRate = !!csvImportRequireRateToggle?.checked;

    return parsedRows.map((row) => {
        const resolvedRate = getResolvedCsvImportRate(row);
        const normalizedCall = (row.issues.length === 0 && row.startTime && row.endTime)
            ? normalizeCall({
                id: generateUUID(),
                startTime: row.startTime.toISOString(),
                endTime: row.endTime.toISOString(),
                duration: row.durationMs,
                rate: resolvedRate.amount,
                rateName: resolvedRate.rateName,
                rpgEligible: isRpgEnabled()
            })
            : null;
        const duplicateKey = normalizedCall ? getCallDuplicateKey(normalizedCall) : '';
        let status = 'ready';
        let reason = '';

        if (row.issues.length > 0) {
            status = 'invalid';
            reason = row.issues.join(', ');
        } else if (existingKeys.has(duplicateKey)) {
            status = 'duplicate';
            reason = 'Already exists in Call Log';
        } else if (fileKeys.has(duplicateKey)) {
            status = 'duplicate';
            reason = 'Duplicate inside this CSV';
        } else {
            fileKeys.add(duplicateKey);
            if (requireRate && !(resolvedRate.amount > 0)) {
                status = 'invalid';
                reason = 'Rate required for import';
            } else if (!(resolvedRate.amount > 0)) {
                reason = 'Will import without rate';
            }
        }

        const defaultSelected = status === 'ready';
        const isSelected = selectionMode === 'custom'
            ? selectedRows.has(row.rowNumber)
            : defaultSelected;

        return {
            ...row,
            normalizedCall,
            resolvedRate,
            status,
            reason,
            selected: status === 'ready' ? isSelected : false
        };
    });
}

function syncPendingCsvSelections(previewRows) {
    if (!pendingCsvImport) return;
    const next = new Set();
    previewRows.forEach((row) => {
        if (row.status === 'ready' && row.selected) next.add(row.rowNumber);
    });
    pendingCsvImport.selectedRows = next;
}

function setCsvImportFilter(filter) {
    pendingCsvImportFilter = ['ready', 'duplicate', 'invalid'].includes(filter) ? filter : 'all';
    updateCsvImportFilterButtons();
    renderCsvImportPreview();
}

function updateCsvImportFilterButtons() {
    const filterButtons = [
        { button: csvFilterAllBtn, value: 'all' },
        { button: csvFilterReadyBtn, value: 'ready' },
        { button: csvFilterDuplicateBtn, value: 'duplicate' },
        { button: csvFilterInvalidBtn, value: 'invalid' }
    ];
    filterButtons.forEach(({ button, value }) => {
        if (!button) return;
        const isActive = pendingCsvImportFilter === value;
        button.classList.toggle('bg-blue-500', isActive);
        button.classList.toggle('text-white', isActive);
        button.classList.toggle('bg-gray-200', !isActive);
        button.classList.toggle('text-gray-700', !isActive);
        button.classList.toggle('dark:bg-gray-700', !isActive);
        button.classList.toggle('dark:text-gray-200', !isActive);
    });
}

function renderCsvImportPreview() {
    if (!pendingCsvImport || !csvImportSummary || !csvImportPreviewBody) return;
    const columnMap = getCsvImportColumnMapFromUi();
    pendingCsvImport.columnMap = columnMap;
    const mappingIssues = getCsvImportMappingIssues(columnMap);
    const parsedRows = parseCsvImportRows(pendingCsvImport.csvData, columnMap);
    const previewRows = buildCsvPreviewRows(parsedRows);
    pendingCsvImport.previewRows = previewRows;
    syncPendingCsvSelections(previewRows);
    const readyCount = previewRows.filter((row) => row.status === 'ready').length;
    const duplicateCount = previewRows.filter((row) => row.status === 'duplicate').length;
    const invalidCount = previewRows.filter((row) => row.status === 'invalid').length;
    const selectedCount = previewRows.filter((row) => row.status === 'ready' && row.selected).length;
    const missingRateCount = previewRows.filter((row) => row.status === 'ready' && !(row.resolvedRate.amount > 0)).length;

    csvImportSummary.innerHTML = [
        { label: 'Rows', value: previewRows.length, tone: 'text-gray-900 dark:text-gray-100' },
        { label: 'Ready', value: readyCount, tone: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Duplicates', value: duplicateCount, tone: 'text-amber-600 dark:text-amber-300' },
        { label: 'Invalid', value: invalidCount, tone: 'text-red-600 dark:text-red-400' },
        { label: 'Selected', value: selectedCount, tone: 'text-blue-600 dark:text-blue-300' }
    ].map((item) => `
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
            <div class="text-xs text-gray-500 dark:text-gray-400">${item.label}</div>
            <div class="text-lg font-semibold ${item.tone}">${item.value}</div>
        </div>
    `).join('');

    const filteredRows = pendingCsvImportFilter === 'all'
        ? previewRows
        : previewRows.filter((row) => row.status === pendingCsvImportFilter);
    const visibleRows = filteredRows.slice(0, 150);

    csvImportPreviewBody.innerHTML = visibleRows.map((row) => {
        const statusTone = row.status === 'ready'
            ? 'text-emerald-600 dark:text-emerald-400'
            : row.status === 'duplicate'
                ? 'text-amber-600 dark:text-amber-300'
                : 'text-red-600 dark:text-red-400';
        const durationText = row.durationMs > 0 ? msToHMS(row.durationMs) : '--';
        const rateText = row.resolvedRate.amount > 0
            ? `${row.resolvedRate.rateName ? `${row.resolvedRate.rateName} - ` : ''}$${row.resolvedRate.amount.toFixed(2)}/min`
            : '--';
        return `
            <tr class="border-b border-gray-100 dark:border-gray-800 align-top">
                <td class="py-2 pr-3">
                    <input type="checkbox" class="csv-row-select" data-row-number="${row.rowNumber}" ${row.status === 'ready' ? '' : 'disabled'} ${row.selected ? 'checked' : ''}>
                </td>
                <td class="py-2 pr-3 font-medium text-gray-500 dark:text-gray-400">#${row.rowNumber}</td>
                <td class="py-2 pr-3">${formatPreviewDate(row.callDate)}</td>
                <td class="py-2 pr-3">${formatPreviewTime(row.startTime)}</td>
                <td class="py-2 pr-3">${formatPreviewTime(row.endTime)}</td>
                <td class="py-2 pr-3">${durationText}</td>
                <td class="py-2 pr-3">${rateText}</td>
                <td class="py-2">
                    <div class="${statusTone} font-semibold capitalize">${row.status}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${row.reason || '--'}</div>
                </td>
            </tr>
        `;
    }).join('');

    if (!csvImportPreviewBody.innerHTML) {
        csvImportPreviewBody.innerHTML = `
            <tr>
                <td colspan="8" class="py-4 text-center text-gray-500 dark:text-gray-400">
                    No rows match the current filter.
                </td>
            </tr>
        `;
    }

    if (csvImportPreviewMeta) {
        const filterLabelMap = {
            all: 'all detected rows',
            ready: 'ready rows',
            duplicate: 'duplicate rows',
            invalid: 'invalid rows'
        };
        csvImportPreviewMeta.textContent = `Showing ${Math.min(visibleRows.length, filteredRows.length)} of ${filteredRows.length} ${filterLabelMap[pendingCsvImportFilter] || 'rows'}${filteredRows.length > visibleRows.length ? ' (first 150)' : ''}. ${selectedCount} ready row${selectedCount === 1 ? '' : 's'} selected.`;
    }

    if (csvImportMappingWarning) {
        csvImportMappingWarning.style.display = mappingIssues.length > 0 ? '' : 'none';
        csvImportMappingWarning.textContent = mappingIssues.join(' ');
    }

    if (csvImportWarning) {
        csvImportWarning.style.display = missingRateCount > 0 ? '' : 'none';
        csvImportWarning.textContent = missingRateCount > 0
            ? `${missingRateCount} ready call(s) currently have no rate and will import as $0.00 unless you assign one.`
            : '';
    }
    if (confirmCsvImportBtn) {
        confirmCsvImportBtn.disabled = selectedCount === 0 || mappingIssues.length > 0;
        confirmCsvImportBtn.textContent = selectedCount > 0 ? `Import ${selectedCount} Call${selectedCount === 1 ? '' : 's'}` : 'Nothing to Import';
    }
}

function populateCsvImportRateSelect() {
    if (!csvImportRateSelect) return;
    const selectedValue = csvImportRateSelect.value;
    csvImportRateSelect.innerHTML = '<option value="">Use imported rate when possible</option>' +
        rates.map((rate) => `<option value="${escapeHTML(rate.name)}">${escapeHTML(rate.name)} - $${Number(rate.amount).toFixed(2)}/min</option>`).join('');
    if (selectedValue && rates.some((rate) => rate.name === selectedValue)) {
        csvImportRateSelect.value = selectedValue;
    }
}

function openCsvImportPreviewModal(csvImportData) {
    pendingCsvImport = { csvData: csvImportData, columnMap: csvImportData.columnMap, selectedRows: new Set(), selectionMode: 'default' };
    pendingCsvImportFilter = 'all';
    populateCsvImportColumnMapping(csvImportData.headers, csvImportData.columnMap);
    populateCsvImportRateSelect();
    if (csvImportOverrideRateToggle) csvImportOverrideRateToggle.checked = false;
    updateCsvImportFilterButtons();
    renderCsvImportPreview();
    ModalManager.open(csvImportPreviewModal, { focusSelector: '#confirm-csv-import-btn' });
    const scrollEl = csvImportPreviewModal?.querySelector('.settings-modal-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;
}

function closeCsvImportPreviewModal() {
    if (csvImportPreviewModal) ModalManager.close(csvImportPreviewModal);
    pendingCsvImport = null;
    pendingCsvImportFilter = 'all';
    if (csvImportPreviewBody) csvImportPreviewBody.innerHTML = '';
    if (csvImportSummary) csvImportSummary.innerHTML = '';
    if (csvImportPreviewMeta) {
        csvImportPreviewMeta.textContent = 'Showing all detected rows.';
    }
    if (csvImportMappingWarning) {
        csvImportMappingWarning.style.display = 'none';
        csvImportMappingWarning.textContent = '';
    }
    if (csvImportWarning) {
        csvImportWarning.style.display = 'none';
        csvImportWarning.textContent = '';
    }
}

function confirmCsvImport() {
    if (!pendingCsvImport?.previewRows) return;
    const previewRows = pendingCsvImport.previewRows;
    const readyRows = previewRows.filter((row) => row.status === 'ready' && row.selected && row.normalizedCall);
    const duplicateCount = previewRows.filter((row) => row.status === 'duplicate').length;
    const invalidCount = previewRows.filter((row) => row.status === 'invalid').length;
    if (readyRows.length === 0) {
        showAlertModal('No Calls To Import', 'This CSV does not contain any new valid calls to add.');
        return;
    }
    calls = readCallsFromStorage();
    readyRows.forEach((row) => {
        calls.push(row.normalizedCall);
    });
    saveCalls();
    closeCsvImportPreviewModal();
    closeSettingsModal();
    showAlertModal(
        'CSV Import Complete',
        `${readyRows.length} call${readyRows.length === 1 ? '' : 's'} imported. ${duplicateCount} duplicate row${duplicateCount === 1 ? '' : 's'} skipped. ${invalidCount} invalid row${invalidCount === 1 ? '' : 's'} not imported.`,
        { severity: 'info', buttonText: 'Done' }
    );
    showToast(`${readyRows.length} call${readyRows.length === 1 ? '' : 's'} imported from CSV.`);
}

function exportCallLogCsv() {
    openExportOptionsModal('csv');
}

function importJsonBackup(importedData) {
    const importedCalls = Array.isArray(importedData?.calls) ? importedData.calls : [];
    const importedRates = Array.isArray(importedData?.rates) ? importedData.rates : [];
    const importedGoal = normalizeDailyGoal(importedData?.dailyGoal);
    const importedCycles = Array.isArray(importedData?.paymentCycles) ? importedData.paymentCycles : [];
    const existingCalls = readCallsFromStorage();
    const callMerge = mergeCallsWithExisting(existingCalls, importedCalls);
    const rateMerge = mergeRatesWithExisting(rates, importedRates);
    const cycleMerge = mergePaymentCyclesWithExisting(paymentCycles, importedCycles);
    const currentGoal = normalizeDailyGoal(dailyGoal);
    const shouldApplyImportedGoal = currentGoal.amount <= 0 && currentGoal.minutes <= 0
        && (importedGoal.amount > 0 || importedGoal.minutes > 0);

    if (callMerge.addedCount === 0 && rateMerge.addedCount === 0 && cycleMerge.addedCount === 0 && !shouldApplyImportedGoal) {
        showAlertModal('Nothing New To Import', 'This backup does not contain any new calls, rates, payment cycles, or goal data to merge.');
        return;
    }

    const summaryParts = [
        `${callMerge.addedCount} new call${callMerge.addedCount === 1 ? '' : 's'}`,
        `${rateMerge.addedCount} new rate${rateMerge.addedCount === 1 ? '' : 's'}`,
        `${cycleMerge.addedCount} new payment cycle${cycleMerge.addedCount === 1 ? '' : 's'}`
    ];
    const skippedParts = [
        callMerge.skippedCount > 0 ? `${callMerge.skippedCount} duplicate call${callMerge.skippedCount === 1 ? '' : 's'} skipped` : '',
        rateMerge.skippedCount > 0 ? `${rateMerge.skippedCount} duplicate/invalid rate${rateMerge.skippedCount === 1 ? '' : 's'} skipped` : '',
        cycleMerge.skippedCount > 0 ? `${cycleMerge.skippedCount} duplicate cycle${cycleMerge.skippedCount === 1 ? '' : 's'} skipped` : ''
    ].filter(Boolean);
    if (shouldApplyImportedGoal) summaryParts.push('daily goal applied');

    showConfirmation(
        'Merge Backup Data',
        `This backup will be merged into your current local data. Existing calls and settings stay in place. New items detected: ${summaryParts.join(', ')}.${skippedParts.length ? ` ${skippedParts.join(', ')}.` : ''}`,
        'Merge',
        () => {
            calls = callMerge.merged;
            rates = rateMerge.merged;
            if (shouldApplyImportedGoal) {
                dailyGoal = importedGoal;
            }
            paymentCyclesEnabled = paymentCyclesEnabled || !!importedData?.paymentCyclesEnabled;
            paymentCycles = cycleMerge.merged;
            saveRates();
            saveCalls();
            saveDailyGoal();
            savePaymentCycles();
            syncDailyGoalInputs();
            populateRateSelects();
            showToast(`Backup merged: ${callMerge.addedCount} calls, ${rateMerge.addedCount} rates, ${cycleMerge.addedCount} cycles added.`);
            closeSettingsModal();
        },
        {
            icon: 'fa-upload',
            iconColor: 'text-blue-500',
            tone: 'primary',
            loadingText: 'Merging backup...',
            successText: 'Backup merged successfully.'
        }
    );
}

// v1.0.5 Active live call state (for crash/close recovery)
const ACTIVE_CALL_KEY = 'activeLiveCallState';
const ACTIVE_CALL_CLOSE_INTENT_KEY = 'activeLiveCallClosedExplicitly';

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

function buildCurrentActiveCallSession(now = Date.now()) {
  if (!liveCallStart) return null;
  return normalizeActiveCallSession({
    start: liveCallStart,
    rate: currentCallRate,
    rateName: rateSelect?.value || null,
    lastPing: now
  });
}

function setLiveCallRuntimeState(session) {
  const normalized = normalizeActiveCallSession(session);
  if (!normalized) return null;
  liveCallStart = normalized.start;
  currentCallRate = normalized.rate > 0 ? normalized.rate : null;
  return normalized;
}

function clearLiveCallRuntimeState() {
  if (liveCallTimerId) {
    clearInterval(liveCallTimerId);
    liveCallTimerId = null;
  }
  liveCallStart = null;
  currentCallRate = null;
}

function saveActiveCallState(force = false) {
  const now = Date.now();
  if (!force && now - lastActiveCallPersistAt < 5000) return;
  const state = buildCurrentActiveCallSession(now);
  if (!state) return;
  queueStorageWrite(ACTIVE_CALL_KEY, JSON.stringify(state));
  lastActiveCallPersistAt = now;
}

function readActiveCallState() {
  try {
    return normalizeActiveCallSession(JSON.parse(appStorage.getItem(ACTIVE_CALL_KEY)));
  } catch {
    return null;
  }
}

function clearActiveCallState() {
  pendingStorageWrites.delete(ACTIVE_CALL_KEY);
  appStorage.removeItem(ACTIVE_CALL_KEY);
}

function markActiveCallClosedExplicitly() {
  if (!liveCallStart) return;
  queueStorageWrite(ACTIVE_CALL_CLOSE_INTENT_KEY, String(Date.now()));
}

function readActiveCallClosedExplicitly() {
  const raw = Number(appStorage.getItem(ACTIVE_CALL_CLOSE_INTENT_KEY));
  if (!Number.isFinite(raw) || raw <= 0) return false;
  return true;
}

function clearActiveCallClosedExplicitly() {
  pendingStorageWrites.delete(ACTIVE_CALL_CLOSE_INTENT_KEY);
  appStorage.removeItem(ACTIVE_CALL_CLOSE_INTENT_KEY);
}

function setLiveCallInfoVisibility(shouldShow) {
  if (!liveCallInfo) return;
  if (callControlsCard) {
    const cardRect = callControlsCard.getBoundingClientRect();
    const isFullyAboveViewport = cardRect.bottom <= 0;
    if (isFullyAboveViewport) {
      liveCallInfo.dataset.pendingVisibility = shouldShow ? 'show' : 'hide';
      return;
    }
  }

  if (liveCallInfo.dataset.pendingVisibility) {
    delete liveCallInfo.dataset.pendingVisibility;
  }

  const shouldCompensate = !!callControlsCard && callControlsCard.getBoundingClientRect().top < 0;
  let trackedCardHeight = shouldCompensate ? callControlsCard.getBoundingClientRect().height : 0;
  liveCallInfo.style.display = shouldShow ? 'block' : 'none';
  if (!shouldCompensate) return;

  const adjustViewport = () => {
    const currentCardHeight = callControlsCard.getBoundingClientRect().height;
    const delta = currentCardHeight - trackedCardHeight;
    trackedCardHeight = currentCardHeight;
    if (Math.abs(delta) < 0.5) return;
    const currentScroll = window.scrollY || window.pageYOffset || 0;
    window.scrollTo({ top: Math.max(0, currentScroll + delta), behavior: 'auto' });
  };

  adjustViewport();
  requestAnimationFrame(adjustViewport);
}

function flushPendingLiveCallInfoVisibilityIfVisible() {
  if (!liveCallInfo || !callControlsCard) return;
  const pending = liveCallInfo.dataset.pendingVisibility;
  if (!pending) return;
  const cardRect = callControlsCard.getBoundingClientRect();
  const isFullyAboveViewport = cardRect.bottom <= 0;
  if (isFullyAboveViewport) return;
  liveCallInfo.style.display = pending === 'show' ? 'block' : 'none';
  delete liveCallInfo.dataset.pendingVisibility;
}

function runWithViewportLock(actionFn, rafPasses = 6) {
  if (typeof actionFn !== 'function') return;
  const lockedX = window.scrollX || window.pageXOffset || 0;
  const lockedY = window.scrollY || window.pageYOffset || 0;
  actionFn();

  let remainingPasses = Math.max(1, Number(rafPasses) || 1);
  const restore = () => {
    window.scrollTo({ left: lockedX, top: lockedY, behavior: 'auto' });
    remainingPasses -= 1;
    if (remainingPasses > 0) {
      requestAnimationFrame(restore);
    }
  };
  restore();
}

function resetLiveCallUiToIdle() {
  setLiveCallInfoVisibility(false);
  startCallBtn.style.display = 'block';
  endCallBtn.style.display = 'none';
  liveCallInfo.classList.remove('active-call-pulse');
  liveCallTimerDisplay.textContent = '00:00:00';
  liveCallEarningsDisplay.textContent = '$0.00';
  if (liveCallNotesInput) liveCallNotesInput.value = '';
  recoveredActiveCallState = null;
  hideActiveCallRecoveryBanner();
  lastActiveCallReminderAt = 0;
  if (focusWorkstripReminder) focusWorkstripReminder.style.display = 'none';
  updateFloatingCallControls(featureFlags);
  scheduleDesktopOverlayRefresh();
  animateFloatingPrimaryTransition();
  queueWorkstripSync();
}

function showActiveCallRecoveryBanner(message) {
  if (!activeCallRecoveryBanner) return;
  if (activeCallRecoveryMessage && message) {
    activeCallRecoveryMessage.textContent = message;
  }
  activeCallRecoveryBanner.style.display = '';
}

function hideActiveCallRecoveryBanner() {
  if (!activeCallRecoveryBanner) return;
  activeCallRecoveryBanner.style.display = 'none';
}

function getRecoveredCallRate(state) {
  const directRate = Number(state?.rate);
  if (Number.isFinite(directRate) && directRate > 0) return directRate;
  const rateName = String(state?.rateName || '').trim();
  if (!rateName) return 0;
  return Number(rates.find((rate) => rate.name === rateName)?.amount) || 0;
}

function getActiveCallComputedState(now = Date.now()) {
  const session = buildCurrentActiveCallSession(now);
  if (!session) return null;
  const elapsedMs = Math.max(0, now - session.start);
  const earnings = calculateEarnings(elapsedMs, session.rate);
  return {
    ...session,
    elapsedMs,
    elapsedLabel: formatTime(elapsedMs),
    earnings,
    earningsLabel: formatEarnings(earnings),
    isActive: true
  };
}

function finalizeActiveCallSession(session, endTime = Date.now()) {
  const normalized = normalizeActiveCallSession(session);
  if (!normalized) return null;
  const elapsed = Math.max(0, endTime - normalized.start);
  const earned = calculateEarnings(elapsed, normalized.rate);
  return normalizeCall({
    id: generateUUID(),
    startTime: new Date(normalized.start).toISOString(),
    endTime: new Date(endTime).toISOString(),
    duration: elapsed,
    rate: normalized.rate,
    rpgEligible: isRpgEnabled(),
    rateName: normalized.rateName,
    earnings: Number(earned.toFixed(2))
  });
}

const LiveCallSession = {
  isActive() {
    return Boolean(buildCurrentActiveCallSession());
  },
  getState(now = Date.now()) {
    return getActiveCallComputedState(now);
  },
  start(rateName, rateAmount) {
    const normalizedRateName = String(rateName || '').trim();
    const normalizedRateAmount = Number(rateAmount) || 0;

    if (!normalizedRateName || normalizedRateAmount <= 0) {
      return { ok: false, reason: 'invalid_rate' };
    }

    clearLiveCallRuntimeState();

    if (rateSelect && rateSelect.value !== normalizedRateName) {
      rateSelect.value = normalizedRateName;
    }

    saveLastSelectedRate();
    const session = setLiveCallRuntimeState({
      start: Date.now(),
      rateName: normalizedRateName,
      rate: normalizedRateAmount,
      lastPing: Date.now()
    });

    return session
      ? { ok: true, session }
      : { ok: false, reason: 'session_init_failed' };
  },
  stop(endTime = Date.now()) {
    const session = buildCurrentActiveCallSession(endTime);
    if (!session) return { ok: false, reason: 'no_active_call' };
    const callData = finalizeActiveCallSession(session, endTime);
    if (!callData) return { ok: false, reason: 'finalize_failed' };
    return {
      ok: true,
      session,
      callData,
      endTime,
      elapsedMs: Math.max(0, endTime - session.start),
      earnings: Number(callData.earnings) || 0
    };
  },
  restore(state) {
    const recoveredSession = normalizeActiveCallSession(state);
    if (!recoveredSession) return { ok: false, reason: 'invalid_state' };
    const rate = getRecoveredCallRate(recoveredSession);
    if (rate <= 0) return { ok: false, reason: 'invalid_rate' };
    const session = setLiveCallRuntimeState({ ...recoveredSession, rate });
    if (!session) return { ok: false, reason: 'session_init_failed' };
    return { ok: true, session };
  },
  clear() {
    clearLiveCallRuntimeState();
  }
};

function restoreLiveCallUi() {
  if (!liveCallStart) return;
  setLiveCallInfoVisibility(true);
  startCallBtn.style.display = 'none';
  endCallBtn.style.display = 'block';
  liveCallInfo.classList.add('active-call-pulse');

  const initialElapsed = Math.max(0, Date.now() - liveCallStart);
  liveCallTimerDisplay.textContent = formatTime(initialElapsed);
  liveCallEarningsDisplay.textContent = formatEarnings(calculateEarnings(initialElapsed, currentCallRate));

  if (liveCallTimerId) clearInterval(liveCallTimerId);
  liveCallTimerId = setInterval(() => {
    const elapsedNow = Date.now() - liveCallStart;
    liveCallTimerDisplay.textContent = formatTime(elapsedNow);
    const earned = calculateEarnings(elapsedNow, currentCallRate);
    liveCallEarningsDisplay.textContent = formatEarnings(earned);
    updateFloatingActiveCard(featureFlags, true);
    saveActiveCallState();
    scheduleDesktopOverlayRefresh();
    if (sessionTrackerState?.active) {
      renderSessionTracker();
    }
    queueWorkstripSync();
  }, 1000);

  saveActiveCallState(true);
  clearActiveCallClosedExplicitly();
  updateFloatingCallControls(featureFlags);
  scheduleDesktopOverlayRefresh();
  animateFloatingPrimaryTransition();
  queueWorkstripSync();
  void syncAndroidWidgetActiveSession();
}

function beginLiveCallWithRate(rateName, rateAmount) {
  hidePostCallReview(true);
  markUserActivity();
  const result = LiveCallSession.start(rateName, rateAmount);
  if (!result.ok) {
    showAlertModal('Select Rate', 'Please select a valid rate before starting a call.');
    return;
  }
  recoveredActiveCallState = null;
  clearActiveCallClosedExplicitly();
  hideActiveCallRecoveryBanner();
  if (liveCallNotesInput) liveCallNotesInput.value = '';
  restoreLiveCallUi();
  if (sessionTrackerState?.active) {
    renderSessionTracker();
  }
  markOnboardingStepComplete('call');
  queueWorkstripSync();
}

function summarizeRecoveredActiveCall(state = recoveredActiveCallState) {
  const recoveredSession = normalizeActiveCallSession(state);
  if (!recoveredSession) return;
  const endTime = Date.now();
  const elapsedMs = Math.max(0, endTime - recoveredSession.start);
  const rateName = recoveredSession.rateName || rateSelect.value || null;
  const ratePerMin = getRecoveredCallRate(recoveredSession);
  const earned = calculateEarnings(elapsedMs, ratePerMin);

  const callData = normalizeCall({
    id: generateUUID(),
    startTime: new Date(recoveredSession.start).toISOString(),
    endTime: new Date(endTime).toISOString(),
    duration: elapsedMs,
    rate: ratePerMin,
    rpgEligible: isRpgEnabled(),
    rateName,
    earnings: Number(earned.toFixed(2))
  });

  calls = readCallsFromStorage();
  calls.push(callData);
  hidePostCallReview(true);
  saveCalls();
  showPostCallReview(callData, elapsedMs, earned);

  clearLiveCallRuntimeState();
  clearActiveCallState();
  clearActiveCallClosedExplicitly();
  resetLiveCallUiToIdle();
  void syncAndroidWidgetActiveSession();
  showToast('Recovered live call summarized and saved.');
}

function discardRecoveredActiveCall() {
  clearLiveCallRuntimeState();
  clearActiveCallState();
  clearActiveCallClosedExplicitly();
  hidePostCallReview(true);
  resetLiveCallUiToIdle();
  void syncAndroidWidgetActiveSession();
  showToast('Recovered live call discarded.');
}

function autoRestoreRecoveredActiveCall(state) {
  const recoveredSession = normalizeActiveCallSession(state);
  const restoreResult = LiveCallSession.restore(state);
  if (!recoveredSession || !restoreResult.ok) return false;

  if (recoveredSession.rateName && rates.some((entry) => entry.name === recoveredSession.rateName)) {
    rateSelect.value = recoveredSession.rateName;
    saveLastSelectedRate();
  }

  recoveredActiveCallState = {
    ...recoveredSession,
    rate: restoreResult.session.rate
  };
  restoreLiveCallUi();

  const elapsedHours = Math.floor(Math.max(0, Date.now() - recoveredSession.start) / 3600000);
  const message = elapsedHours >= 2
    ? 'Your live call resumed automatically. It has been active for a while, so review it before ending if needed.'
    : 'Your live call resumed automatically based on the saved start time.';
  showActiveCallRecoveryBanner(message);
  clearActiveCallClosedExplicitly();
  scheduleDesktopOverlayRefresh();
  showToast('Active call restored.');
  return true;
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

function readCallsFromStorage() {
    try {
        const raw = JSON.parse(appStorage.getItem('calls')) || [];
        if (!Array.isArray(raw)) return [];
        return raw.map(normalizeCall);
    } catch {
        return [];
    }
}

function migrateLegacyRpgCallEligibility() {
    try {
        if (appStorage.getItem(RPG_CALL_ELIGIBILITY_MIGRATION_KEY) === '1') return;
        const storedCalls = readCallsFromStorage();
        let changed = false;
        const migrated = storedCalls.map((call) => {
            if (typeof call.rpgEligible === 'boolean') return call;
            changed = true;
            return { ...call, rpgEligible: true };
        });
        if (changed) {
            calls = migrated.map(normalizeCall);
            queueStorageWrite('calls', JSON.stringify(calls));
            markCallsDatasetDirty();
        }
        appStorage.setItem(RPG_CALL_ELIGIBILITY_MIGRATION_KEY, '1');
    } catch (e) {
        console.warn('Could not migrate RPG call eligibility', e);
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

    function markCallsDatasetDirty() {
        callsDatasetVersion += 1;
        filteredCallsCache.key = '';
        filteredCallsCache.rows = [];
    }

    function queueStorageWrite(key, value) {
        pendingStorageWrites.set(key, value);
        if (storageWriteTimer) return;
        storageWriteTimer = setTimeout(() => {
            flushPendingStorageWrites();
        }, 180);
    }

    function flushPendingStorageWrites() {
        if (storageWriteTimer) {
            clearTimeout(storageWriteTimer);
            storageWriteTimer = null;
        }
        if (!pendingStorageWrites.size) return;
        pendingStorageWrites.forEach((value, key) => {
            try {
                appStorage.setItem(key, value);
            } catch (err) {
                console.warn(`Could not persist key ${key}`, err);
            }
        });
        pendingStorageWrites.clear();
    }

    function getFilterCacheKey() {
        const dateKey = callLogFilter === 'date' ? (statsDatePicker?.value || getTodayDateString()) : '';
        return `${callsDatasetVersion}|${callLogFilter}|${dateKey}|q:${callLogSearchQuery}|r:${callLogRateFilter}`;
    }

    function getFilteredCallsCached() {
        const cacheKey = getFilterCacheKey();
        if (filteredCallsCache.key === cacheKey) return filteredCallsCache.rows;

        const now = new Date();
        let startMs = null;
        let endMs = null;
        if (callLogFilter === 'today') {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            startMs = start.getTime();
            endMs = end.getTime();
        } else if (callLogFilter === 'week') {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            const end = new Date(start);
            end.setDate(end.getDate() + 7);
            startMs = start.getTime();
            endMs = end.getTime();
        } else if (callLogFilter === 'month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            startMs = start.getTime();
            endMs = end.getTime();
        } else if (callLogFilter === 'date') {
            const selectedDate = parseDateInput(statsDatePicker?.value) || new Date();
            const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            startMs = start.getTime();
            endMs = end.getTime();
        }

        let rows = (startMs === null)
            ? calls.slice()
            : calls.filter((call) => {
                const t = getCallStartMs(call);
                return t >= startMs && t < endMs;
            });

        if (callLogRateFilter) {
            rows = rows.filter((call) => String(call?.rateName || '') === callLogRateFilter);
        }

        if (callLogSearchQuery) {
            const q = callLogSearchQuery.toLowerCase();
            rows = rows.filter((call) => {
                const notes = String(call?.notes || '').toLowerCase();
                const rateName = String(call?.rateName || '').toLowerCase();
                const start = new Date(call?.startTime || '').toLocaleString(DISPLAY_LOCALE).toLowerCase();
                const end = new Date(call?.endTime || '').toLocaleString(DISPLAY_LOCALE).toLowerCase();
                const earned = formatEarnings(Number(call?.earned) || 0).toLowerCase();
                return notes.includes(q)
                    || rateName.includes(q)
                    || start.includes(q)
                    || end.includes(q)
                    || earned.includes(q);
            });
        }

        filteredCallsCache = { key: cacheKey, rows };
        return rows;
    }

    function getCallNoteCellHtml(rawNote) {
        const normalized = String(rawNote || '').trim();
        if (!normalized) return '<span class="text-gray-400">-</span>';
        const safe = escapeHTML(normalized);
        return `<span class="call-note-text" title="${safe}">${safe}</span>`;
    }

    function populateCallLogRateFilterOptions() {
        if (!callLogRateFilterSelect) return;
        const previousValue = String(callLogRateFilterSelect.value || callLogRateFilter || '');
        const uniqueRates = Array.from(new Set((Array.isArray(rates) ? rates : []).map((rate) => String(rate?.name || '').trim()).filter(Boolean)));
        callLogRateFilterSelect.innerHTML = '<option value="">All rates</option>' + uniqueRates.map((name) => `<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join('');

        if (previousValue && uniqueRates.includes(previousValue)) {
            callLogRateFilterSelect.value = previousValue;
            callLogRateFilter = previousValue;
        } else {
            callLogRateFilterSelect.value = '';
            callLogRateFilter = '';
        }
    }

    function updateCallLogResultsSummary(totalCount) {
        if (!callLogResultsSummary) return;
        const count = Math.max(0, Number(totalCount) || 0);
        const filterLabel = getCurrentCallLogViewLabel();
        const extras = [];
        if (callLogRateFilter) extras.push(`rate: ${callLogRateFilter}`);
        if (callLogSearchQuery) extras.push(`search: "${callLogSearchQuery}"`);
        const suffix = extras.length > 0 ? ` | ${extras.join(' | ')}` : '';
        callLogResultsSummary.textContent = `Showing ${count} call${count === 1 ? '' : 's'} | ${filterLabel}${suffix}`;
    }

    function setCallLogSearchQuery(nextValue) {
        callLogSearchQuery = String(nextValue || '').trim();
        displayCalls();
    }

    function setCallLogRateFilter(nextValue) {
        callLogRateFilter = String(nextValue || '').trim();
        displayCalls();
    }

    function resetCallLogView() {
        callLogFilter = 'today';
        callLogSort = { key: 'startTime', direction: 'desc' };
        callLogSearchQuery = '';
        callLogRateFilter = '';
        if (callLogSearchInput) callLogSearchInput.value = '';
        if (callLogRateFilterSelect) callLogRateFilterSelect.value = '';
        updateCallLogSortUi();
        updateCallLogFilterButtons();
        displayCalls();
    }

    function closeCallLogActionsMenu(force = false) {
        if (!openCallLogActionsMenu) return;
        openCallLogActionsMenu.classList.remove('is-open');
        openCallLogActionsMenu.setAttribute('aria-hidden', 'true');
        const ownerWrap = openCallLogActionsMenu.closest('.call-log-actions-wrap');
        const ownerBtn = ownerWrap?.querySelector('.call-log-actions-menu-btn');
        if (ownerBtn) ownerBtn.setAttribute('aria-expanded', 'false');
        if (force || !ownerWrap) {
            openCallLogActionsMenu = null;
            return;
        }
        openCallLogActionsMenu = null;
    }

    function toggleCallLogActionsMenu(menuBtn) {
        const wrap = menuBtn?.closest('.call-log-actions-wrap');
        const menuEl = wrap?.querySelector('.call-log-actions-menu');
        if (!menuEl) return;

        const willOpen = !menuEl.classList.contains('is-open');
        if (openCallLogActionsMenu && openCallLogActionsMenu !== menuEl) {
            closeCallLogActionsMenu(true);
        }

        if (!willOpen) {
            menuEl.classList.remove('is-open');
            menuEl.setAttribute('aria-hidden', 'true');
            menuBtn.setAttribute('aria-expanded', 'false');
            openCallLogActionsMenu = null;
            return;
        }

        menuEl.classList.add('is-open');
        menuEl.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        openCallLogActionsMenu = menuEl;
    }

    function buildCallRow(call, userTz, rateNameSet) {
        const startDate = new Date(call.startTime);
        const endDate = new Date(call.endTime);
        const startDisplay = startDate.toLocaleString(DISPLAY_LOCALE, { timeZone: userTz });
        const endDisplay = endDate.toLocaleString(DISPLAY_LOCALE, { timeZone: userTz });
        const durationStr = formatTime(call.duration);
        const earningsStr = formatEarnings(call.earned);
        const noteCellHtml = getCallNoteCellHtml(call.notes);

        let safeRateName = escapeHTML(call.rateName || '');
        if (!safeRateName) {
            safeRateName = '<span class="text-gray-400 italic">Rate removed</span>';
        } else if (!rateNameSet.has(call.rateName)) {
            safeRateName = `<span title="Original rate: ${escapeHTML(call.rateName)}" class="text-yellow-600 dark:text-yellow-400 line-through">${escapeHTML(call.rateName)}</span>`;
        }

        const safeId = escapeHTML(call.id || '');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHTML(startDisplay)}</td>
            <td>${escapeHTML(endDisplay)}</td>
            <td>${durationStr}</td>
            <td>${safeRateName}</td>
            <td class="notes-column">${noteCellHtml}</td>
            <td>${earningsStr}</td>
            <td>
                <div class="call-log-actions-wrap">
                    <button type="button" class="edit-call-btn" data-call-id="${safeId}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button type="button" class="call-log-actions-menu-btn" aria-label="More call actions" aria-haspopup="menu" aria-expanded="false">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <div class="call-log-actions-menu" role="menu" aria-hidden="true">
                        <button type="button" class="delete-call-btn text-red-500 hover:text-red-700" data-call-id="${safeId}" role="menuitem">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </td>
        `;
        return row;
    }

    function buildCallMobileCard(call, userTz, rateNameSet) {
        const startDate = new Date(call.startTime);
        const endDate = new Date(call.endTime);
        const callDate = startDate.toLocaleDateString(DISPLAY_LOCALE, { timeZone: userTz, year: 'numeric', month: 'short', day: 'numeric' });
        const startTime = startDate.toLocaleTimeString(DISPLAY_LOCALE, { timeZone: userTz, hour: '2-digit', minute: '2-digit' });
        const endTime = endDate.toLocaleTimeString(DISPLAY_LOCALE, { timeZone: userTz, hour: '2-digit', minute: '2-digit' });
        const durationStr = formatTime(call.duration);
        const earningsStr = formatEarnings(call.earned);
        const noteText = String(call.notes || '').trim();
        const safeNotes = escapeHTML(noteText);

        let safeRateName = escapeHTML(call.rateName || '');
        if (!safeRateName) {
            safeRateName = '<span class="text-gray-400 italic">Rate removed</span>';
        } else if (!rateNameSet.has(call.rateName)) {
            safeRateName = `<span title="Original rate: ${escapeHTML(call.rateName)}" class="text-yellow-600 dark:text-yellow-400 line-through">${escapeHTML(call.rateName)}</span>`;
        }

        const safeId = escapeHTML(call.id || '');
        const card = document.createElement('article');
        card.className = 'call-log-mobile-card';
        card.innerHTML = `
            <div class="call-log-mobile-top">
                <div>
                    <div class="call-log-mobile-date">${escapeHTML(callDate)}</div>
                    <div class="call-log-mobile-time">${escapeHTML(startTime)} - ${escapeHTML(endTime)}</div>
                </div>
                <div class="call-log-mobile-earnings-block">
                    <div class="call-log-mobile-earnings">${earningsStr}</div>
                    <div class="call-log-mobile-actions">
                        <button type="button" class="edit-call-btn" data-call-id="${safeId}" aria-label="Edit call">
                            <i class="fas fa-edit"></i>
                        </button>
                        <div class="call-log-actions-wrap call-log-actions-wrap-mobile">
                            <button type="button" class="call-log-actions-menu-btn" aria-label="More call actions" aria-haspopup="menu" aria-expanded="false">
                                <i class="fas fa-ellipsis-h"></i>
                            </button>
                            <div class="call-log-actions-menu call-log-actions-menu-mobile" role="menu" aria-hidden="true">
                                <button type="button" class="delete-call-btn text-red-500 hover:text-red-700" data-call-id="${safeId}" role="menuitem">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="call-log-mobile-meta">
                <span class="call-log-mobile-chip"><strong>Duration:</strong> ${durationStr}</span>
                <span class="call-log-mobile-chip"><strong>Rate:</strong> ${safeRateName}</span>
                ${safeNotes ? `<span class="call-log-mobile-chip" title="${safeNotes}"><strong>Notes:</strong> <span class="call-note-text">${safeNotes}</span></span>` : ''}
            </div>
        `;
        return card;
    }
    
    // Storage functions
    function saveRates() {
        queueStorageWrite('rates', JSON.stringify(rates));
        displayRates();
        populateRateSelects();
        updateStatistics();
        void syncAndroidWidgetDefaultRate();
        if (rates.length > 0) markOnboardingStepComplete('rate');
        updateOnboardingCues();
    }

function saveCalls() {
  calls = calls.map(normalizeCall);
  markCallsDatasetDirty();
  queueStorageWrite('calls', JSON.stringify(calls));
  displayCalls();
  updateStatistics();
  renderSessionTracker();
  evaluateAchievements({ notify: true });
  if (calls.length > 0) markOnboardingStepComplete('call');
  updateOnboardingCues();
  queueWorkstripSync();
}

    function saveDailyGoal() {
  dailyGoal = normalizeDailyGoal(dailyGoal);
  queueStorageWrite('dailyGoal', JSON.stringify(dailyGoal));
  updateStatistics();
}

    function savePaymentCycles() {
        appStorage.setItem('paymentCyclesEnabled', JSON.stringify(paymentCyclesEnabled));
        try {
            const prevRaw = appStorage.getItem('paymentCycles');
            if (prevRaw !== null) {
                // keep a backup before overwriting
                appStorage.setItem('paymentCycles_backup', prevRaw);
            }
            let prevParsed = null;
            try { prevParsed = prevRaw ? JSON.parse(prevRaw) : null; } catch {}
            // If we're about to save an empty array but a non-empty array exists in storage,
            // avoid overwriting it unintentionally. This preserves existing user data.
            if (Array.isArray(prevParsed) && prevParsed.length > 0 && (!Array.isArray(paymentCycles) || paymentCycles.length === 0)) {
                console.info('Preserving existing stored paymentCycles (not overwriting with empty).');
            } else {
                appStorage.setItem('paymentCycles', JSON.stringify(paymentCycles));
            }
        } catch (e) {
            console.warn('Failed to safely save paymentCycles, attempting direct write.', e);
            try { appStorage.setItem('paymentCycles', JSON.stringify(paymentCycles)); } catch (e2) { console.error(e2); }
        }
        renderPaymentCycles();
        updateStatistics();
    }

    function saveLastSelectedRate() {
        lastSelectedRate = rateSelect.value;
        queueStorageWrite('lastSelectedRate', lastSelectedRate);
        syncDailyGoalInputs();
        queueWorkstripSync();
        updateStatistics();
        void syncAndroidWidgetDefaultRate();
    }

    function updateStorageInfo() {
        const data = {
            rates,
            calls,
            dailyGoal,
            paymentCyclesEnabled,
            paymentCycles,
            sessionHistoryEntries,
            theme: appStorage.getItem('theme'),
            timeZone: appStorage.getItem('timeZone')
        };
        const dataStr = JSON.stringify(data);
        const bytes = new Blob([dataStr]).size;
        const kb = (bytes / 1024).toFixed(2);
        const maxKb = 5120;
        const percentage = Math.min((bytes / (maxKb * 1024)) * 100, 100);
        
        storageUsedDisplay.textContent = `${kb} KB / ${(maxKb / 1024).toFixed(1)} MB`;
        storageBar.style.width = `${percentage}%`;
    }

    const scheduleStorageInfoRefresh = createRafScheduler(() => updateStorageInfo());

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

    function applyDeltaTone(element, deltaValue) {
        if (!element) return;
        element.classList.remove('stat-delta-positive', 'stat-delta-negative', 'stat-delta-neutral');
        if (!Number.isFinite(deltaValue) || Math.abs(deltaValue) < 0.0001) {
            element.classList.add('stat-delta-neutral');
            return;
        }
        element.classList.add(deltaValue > 0 ? 'stat-delta-positive' : 'stat-delta-negative');
    }

    function applyRpgBreakdownVisibility() {
        if (!rpgXpBreakdownWrap || !rpgBreakdownToggleBtn) return;
        rpgXpBreakdownWrap.style.display = rpgXpBreakdownExpanded ? '' : 'none';
        rpgBreakdownToggleBtn.innerHTML = rpgXpBreakdownExpanded
            ? '<i class="fas fa-chevron-up mr-1"></i> Hide XP breakdown'
            : '<i class="fas fa-chevron-down mr-1"></i> Show XP breakdown';
        rpgBreakdownToggleBtn.setAttribute('aria-expanded', rpgXpBreakdownExpanded ? 'true' : 'false');
    }

    function getDayStartMs(dateObj) {
        const date = dateObj instanceof Date && Number.isFinite(dateObj.getTime()) ? dateObj : new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    function getPaymentCyclesTimelineContext(nowMs = Date.now()) {
        const normalized = (Array.isArray(paymentCycles) ? paymentCycles : [])
            .map((cycle, originalIndex) => {
                const startMs = Number(Date.parse(cycle?.startDate || ''));
                const endMs = Number(Date.parse(cycle?.endDate || ''));
                const payMs = Number(Date.parse(cycle?.payDate || ''));
                if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
                return {
                    ...cycle,
                    _startMs: startMs,
                    _endMs: endMs,
                    _payMs: Number.isFinite(payMs) ? payMs : 0,
                    _originalIndex: originalIndex
                };
            })
            .filter(Boolean)
            .sort((a, b) => a._startMs - b._startMs);

        const todayStartMs = getDayStartMs(new Date(nowMs));
        let current = null;
        let next = null;
        let closestUpcomingPayCycle = null;

        for (let i = 0; i < normalized.length; i += 1) {
            const cycle = normalized[i];
            if (!current && nowMs >= cycle._startMs && nowMs <= cycle._endMs) {
                current = cycle;
            }
            if (!next && cycle._startMs > nowMs) {
                next = cycle;
            }
            if (Number.isFinite(cycle._payMs) && cycle._payMs >= todayStartMs) {
                if (!closestUpcomingPayCycle || cycle._payMs < closestUpcomingPayCycle._payMs) {
                    closestUpcomingPayCycle = cycle;
                }
            }
        }

        if (!current && !next && normalized.length && nowMs < normalized[0]._startMs) {
            next = normalized[0];
        }

        return { normalized, current, next, closestUpcomingPayCycle };
    }

    function setPaymentCyclesListExpanded(shouldExpand, totalCycles = null) {
        paymentCyclesListExpanded = !!shouldExpand;
        if (paymentCyclesAllListWrap) {
            paymentCyclesAllListWrap.style.display = paymentCyclesListExpanded ? '' : 'none';
        }
        if (paymentCyclesToggleAllBtn) {
            const count = Number.isFinite(totalCycles) ? totalCycles : (Array.isArray(paymentCycles) ? paymentCycles.length : 0);
            const safeCount = Math.max(0, count);
            paymentCyclesToggleAllBtn.innerHTML = paymentCyclesListExpanded
                ? `<i class="fas fa-eye-slash mr-1"></i>Hide full list (${safeCount})`
                : `<i class="fas fa-table mr-1"></i>View all cycles (${safeCount})`;
            paymentCyclesToggleAllBtn.disabled = safeCount === 0;
            paymentCyclesToggleAllBtn.classList.toggle('opacity-60', safeCount === 0);
            paymentCyclesToggleAllBtn.classList.toggle('cursor-not-allowed', safeCount === 0);
        }
    }

    function renderPaymentCyclesCurrentSummary(nowMs = Date.now()) {
        const context = getPaymentCyclesTimelineContext(nowMs);
        const hasAnyCycles = context.normalized.length > 0;
        const nextPayCycle = context.closestUpcomingPayCycle || context.next || null;

        if (paymentCyclesCurrentSummary) {
            paymentCyclesCurrentSummary.style.display = paymentCyclesEnabled ? '' : 'none';
        }

        if (viewAllPaymentCyclesBtn) {
            viewAllPaymentCyclesBtn.style.display = paymentCyclesEnabled && hasAnyCycles ? '' : 'none';
        }

        if (!paymentCyclesCurrentRange || !paymentCyclesCurrentPay || !paymentCyclesCurrentDays) {
            setPaymentCyclesListExpanded(paymentCyclesListExpanded, context.normalized.length);
            return context;
        }

        if (!paymentCyclesEnabled || !hasAnyCycles) {
            paymentCyclesCurrentRange.textContent = 'Range: --';
            paymentCyclesCurrentPay.textContent = 'Next Pay Date: --';
            paymentCyclesCurrentDays.textContent = 'Countdown: --';
            setPaymentCyclesListExpanded(false, context.normalized.length);
            return context;
        }

        if (context.current) {
            const daysUntilEnd = Math.max(0, Math.ceil((context.current._endMs - nowMs) / (1000 * 60 * 60 * 24)));
            const daysUntilPay = nextPayCycle && Number.isFinite(nextPayCycle._payMs)
                ? Math.max(0, Math.ceil((nextPayCycle._payMs - nowMs) / (1000 * 60 * 60 * 24)))
                : null;
            paymentCyclesCurrentRange.textContent = `Current: ${formatDate(context.current.startDate)} -> ${formatDate(context.current.endDate)}`;
            paymentCyclesCurrentPay.textContent = nextPayCycle
                ? `Next Pay Date: ${formatDate(nextPayCycle.payDate)}`
                : 'Next Pay Date: --';
            paymentCyclesCurrentDays.textContent = daysUntilPay === null
                ? `Ends in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'}`
                : `Ends in ${daysUntilEnd} day${daysUntilEnd === 1 ? '' : 's'} | Next pay in ${daysUntilPay} day${daysUntilPay === 1 ? '' : 's'}`;
        } else if (context.next || nextPayCycle) {
            const upcomingCycle = context.next || nextPayCycle;
            const daysUntilStart = Math.max(0, Math.ceil((upcomingCycle._startMs - nowMs) / (1000 * 60 * 60 * 24)));
            const daysUntilPay = Number.isFinite(upcomingCycle._payMs)
                ? Math.max(0, Math.ceil((upcomingCycle._payMs - nowMs) / (1000 * 60 * 60 * 24)))
                : null;
            paymentCyclesCurrentRange.textContent = `Next: ${formatDate(upcomingCycle.startDate)} -> ${formatDate(upcomingCycle.endDate)}`;
            paymentCyclesCurrentPay.textContent = `Next Pay Date: ${formatDate(upcomingCycle.payDate)}`;
            paymentCyclesCurrentDays.textContent = daysUntilPay === null
                ? `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}`
                : `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'} | Pay in ${daysUntilPay} day${daysUntilPay === 1 ? '' : 's'}`;
        } else {
            paymentCyclesCurrentRange.textContent = 'No current cycle for today.';
            paymentCyclesCurrentPay.textContent = 'Next Pay Date: --';
            paymentCyclesCurrentDays.textContent = 'Countdown: --';
        }

        setPaymentCyclesListExpanded(paymentCyclesListExpanded, context.normalized.length);
        return context;
    }
    function updateWorkRhythmInsights(nowMs = Date.now()) {
        if (!rhythmAvgGapDisplay || !rhythmFastestGapDisplay || !rhythmVsPreviousDayDisplay) return;
        const selectedDate = parseDateInput(statsDatePicker?.value) || new Date(nowMs);
        const dayStartMs = getDayStartMs(selectedDate);
        const dayEndMs = dayStartMs + (24 * 60 * 60 * 1000);
        const previousDayStartMs = dayStartMs - (24 * 60 * 60 * 1000);
        const previousDayEndMs = dayStartMs;
        const todayStartMs = getDayStartMs(new Date(nowMs));
        const comparisonLabel = dayStartMs === todayStartMs ? 'yesterday' : 'the prior day';

        const dayCalls = calls
            .filter((call) => {
                const start = getCallStartMs(call);
                return start >= dayStartMs && start < dayEndMs;
            })
            .slice()
            .sort((a, b) => getCallStartMs(a) - getCallStartMs(b));

        const gapsMs = [];
        for (let i = 1; i < dayCalls.length; i += 1) {
            const prevEnd = Number(Date.parse(dayCalls[i - 1]?.endTime || ''));
            const nextStart = getCallStartMs(dayCalls[i]);
            if (!Number.isFinite(prevEnd) || !Number.isFinite(nextStart)) continue;
            const gap = Math.max(0, nextStart - prevEnd);
            gapsMs.push(gap);
        }

        if (gapsMs.length > 0) {
            const avgGapMinutes = (gapsMs.reduce((sum, value) => sum + value, 0) / gapsMs.length) / (1000 * 60);
            const fastestGapMinutes = Math.min(...gapsMs) / (1000 * 60);
            rhythmAvgGapDisplay.textContent = `Avg gap: ${formatMinutesLabel(avgGapMinutes)}`;
            rhythmFastestGapDisplay.textContent = `Fastest turn: ${formatMinutesLabel(fastestGapMinutes)}`;
        } else {
            rhythmAvgGapDisplay.textContent = 'Avg gap: --';
            rhythmFastestGapDisplay.textContent = dayCalls.length > 0 ? 'Fastest turn: Back-to-back ready' : 'Fastest turn: --';
        }

        const selectedDayEarnings = calls.reduce((sum, call) => {
            const start = getCallStartMs(call);
            if (start < dayStartMs || start >= dayEndMs) return sum;
            return sum + (Number(call.earned) || 0);
        }, 0);
        const previousDayEarnings = calls.reduce((sum, call) => {
            const start = getCallStartMs(call);
            if (start < previousDayStartMs || start >= previousDayEndMs) return sum;
            return sum + (Number(call.earned) || 0);
        }, 0);

        if (selectedDayEarnings === 0 && previousDayEarnings === 0) {
            rhythmVsPreviousDayDisplay.textContent = `Compared with ${comparisonLabel}: no baseline yet`;
            applyDeltaTone(rhythmVsPreviousDayDisplay, 0);
        } else if (previousDayEarnings === 0) {
            rhythmVsPreviousDayDisplay.textContent = `Compared with ${comparisonLabel}: first active day (+${formatEarnings(selectedDayEarnings)})`;
            applyDeltaTone(rhythmVsPreviousDayDisplay, selectedDayEarnings);
        } else {
            const diff = selectedDayEarnings - previousDayEarnings;
            rhythmVsPreviousDayDisplay.textContent = `Compared with ${comparisonLabel}: ${formatSupportiveCurrencyDelta(diff)}`;
            applyDeltaTone(rhythmVsPreviousDayDisplay, diff);
        }
    }

    function ensureHeatmapHoverTooltip() {
        if (heatmapHoverTooltipEl && document.body.contains(heatmapHoverTooltipEl)) return heatmapHoverTooltipEl;
        const tooltip = document.createElement('div');
        tooltip.className = 'heatmap-hover-tooltip hidden';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tooltip);
        heatmapHoverTooltipEl = tooltip;
        return tooltip;
    }

    function isTouchLikePointer() {
        return !!window.matchMedia?.('(hover: none), (pointer: coarse)').matches;
    }

    function positionHeatmapHoverTooltip(anchorX, anchorY) {
        if (!heatmapHoverTooltipEl || heatmapHoverTooltipEl.classList.contains('hidden')) return;
        const margin = 10;
        const offset = 14;
        const tipRect = heatmapHoverTooltipEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

        let left = anchorX - (tipRect.width / 2);
        left = Math.max(margin, Math.min(left, viewportWidth - tipRect.width - margin));

        let top = anchorY - tipRect.height - offset;
        if (top < margin) {
            top = Math.min(viewportHeight - tipRect.height - margin, anchorY + offset);
        }
        top = Math.max(margin, top);

        heatmapHoverTooltipEl.style.left = `${left}px`;
        heatmapHoverTooltipEl.style.top = `${top}px`;
    }

    function showHeatmapHoverTooltip(text, options = {}) {
        const tooltipText = String(text || '').trim();
        if (!tooltipText) return;
        const {
            target = null,
            pointerX = null,
            pointerY = null,
            pin = false
        } = options;

        const tooltip = ensureHeatmapHoverTooltip();
        tooltip.textContent = tooltipText;
        tooltip.classList.remove('hidden');
        tooltip.setAttribute('aria-hidden', 'false');
        heatmapHoverPinned = !!pin;
        heatmapHoverActiveTarget = target || null;

        if (Number.isFinite(pointerX) && Number.isFinite(pointerY)) {
            positionHeatmapHoverTooltip(pointerX, pointerY);
            return;
        }
        if (target) {
            const rect = target.getBoundingClientRect();
            positionHeatmapHoverTooltip(rect.left + (rect.width / 2), rect.top);
        }
    }

    function hideHeatmapHoverTooltip(force = false) {
        if (!heatmapHoverTooltipEl) return;
        if (!force && heatmapHoverPinned) return;
        heatmapHoverTooltipEl.classList.add('hidden');
        heatmapHoverTooltipEl.setAttribute('aria-hidden', 'true');
        heatmapHoverActiveTarget = null;
        heatmapHoverPinned = false;
    }

    function bindHeatmapTooltipDelegation(containerEl) {
        if (!containerEl || containerEl.dataset.heatmapTooltipBound === '1') return;
        containerEl.dataset.heatmapTooltipBound = '1';

        containerEl.addEventListener('pointerover', (event) => {
            if (heatmapHoverPinned) return;
            if (!event.pointerType || event.pointerType === 'touch') return;
            const target = event.target instanceof Element ? event.target.closest('[data-heatmap-tooltip]') : null;
            if (!target || !containerEl.contains(target)) return;
            showHeatmapHoverTooltip(target.dataset.heatmapTooltip, {
                target,
                pointerX: event.clientX,
                pointerY: event.clientY
            });
        });

        containerEl.addEventListener('pointermove', (event) => {
            if (heatmapHoverPinned || !heatmapHoverTooltipEl || heatmapHoverTooltipEl.classList.contains('hidden')) return;
            if (!event.pointerType || event.pointerType === 'touch') return;
            positionHeatmapHoverTooltip(event.clientX, event.clientY);
        });

        containerEl.addEventListener('pointerout', (event) => {
            if (heatmapHoverPinned) return;
            const target = event.target instanceof Element ? event.target.closest('[data-heatmap-tooltip]') : null;
            if (!target || !containerEl.contains(target)) return;
            const nextTarget = event.relatedTarget instanceof Element ? event.relatedTarget.closest('[data-heatmap-tooltip]') : null;
            if (nextTarget && containerEl.contains(nextTarget)) return;
            hideHeatmapHoverTooltip(true);
        });

        containerEl.addEventListener('click', (event) => {
            if (!isTouchLikePointer()) return;
            const target = event.target instanceof Element ? event.target.closest('[data-heatmap-tooltip]') : null;
            if (!target || !containerEl.contains(target)) return;
            const isSameTarget = heatmapHoverPinned && heatmapHoverActiveTarget === target;
            if (isSameTarget) {
                hideHeatmapHoverTooltip(true);
                return;
            }
            showHeatmapHoverTooltip(target.dataset.heatmapTooltip, { target, pin: true });
        });
    }

    function setupHeatmapTooltipGlobalBindings() {
        if (heatmapTooltipGlobalsBound) return;
        heatmapTooltipGlobalsBound = true;

        document.addEventListener('click', (event) => {
            if (!heatmapHoverPinned) return;
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            if (target.closest('[data-heatmap-tooltip]')) return;
            if (heatmapHoverTooltipEl && target.closest('.heatmap-hover-tooltip')) return;
            hideHeatmapHoverTooltip(true);
        }, true);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') hideHeatmapHoverTooltip(true);
        });

        window.addEventListener('resize', () => hideHeatmapHoverTooltip(true));
        window.addEventListener('scroll', () => hideHeatmapHoverTooltip(true), { passive: true });
    }

    function updateHourlyHeatmap(nowMs = Date.now()) {
        if (!hourlyHeatmapGrid || !hourlyHeatmapTopHours || !hourlyHeatmapSummary) return;
        const currentDate = new Date(nowMs);
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const startMs = monthStart.getTime();
        const endMs = nextMonthStart.getTime();
        const hourlyCounts = Array.from({ length: 24 }, () => 0);
        const hourlyEarnings = Array.from({ length: 24 }, () => 0);
        const hourlyDurationMs = Array.from({ length: 24 }, () => 0);

        for (let i = 0; i < calls.length; i += 1) {
            const start = getCallStartMs(calls[i]);
            if (start < startMs || start >= endMs) continue;
            const hour = new Date(start).getHours();
            hourlyCounts[hour] += 1;
            hourlyEarnings[hour] += Number(calls[i].earned) || 0;
            hourlyDurationMs[hour] += Math.max(0, Number(calls[i].duration) || 0);
        }

        const maxCount = Math.max(1, ...hourlyCounts);
        hideHeatmapHoverTooltip(true);
        hourlyHeatmapGrid.innerHTML = '';
        for (let hour = 0; hour < 24; hour += 1) {
            const count = hourlyCounts[hour];
            const intensity = count > 0 ? (count / maxCount) : 0;
            const alpha = count > 0 ? (0.12 + (0.58 * intensity)) : 0.06;
            const cell = document.createElement('div');
            cell.className = 'hourly-heatmap-cell';
            cell.style.background = `rgba(16, 185, 129, ${alpha.toFixed(3)})`;
            cell.innerHTML = `
                <span class="hourly-heatmap-hour">${String(hour).padStart(2, '0')}h</span>
            `;
            const tooltip = `${String(hour).padStart(2, '0')}:00 | ${count} call${count === 1 ? '' : 's'} | ${formatEarnings(hourlyEarnings[hour])} | ${formatTime(hourlyDurationMs[hour])}`;
            cell.dataset.heatmapTooltip = tooltip;
            cell.setAttribute('aria-label', tooltip);
            cell.removeAttribute('title');
            hourlyHeatmapGrid.appendChild(cell);
        }
        bindHeatmapTooltipDelegation(hourlyHeatmapGrid);

        const topHours = hourlyCounts
            .map((count, hour) => ({ hour, count }))
            .filter((entry) => entry.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
        if (topHours.length > 0) {
            hourlyHeatmapTopHours.innerHTML = topHours
                .map((entry) => `<span class="trend-insight-chip">${String(entry.hour).padStart(2, '0')}:00 - ${entry.count}</span>`)
                .join('');
        } else {
            hourlyHeatmapTopHours.innerHTML = '<span class="trend-insight-chip trend-insight-chip-empty">No peak hour yet</span>';
        }

        const totalCallsInWindow = hourlyCounts.reduce((sum, value) => sum + value, 0);
        const monthLabel = monthStart.toLocaleDateString(DISPLAY_LOCALE, { month: 'long', year: 'numeric' });
        hourlyHeatmapSummary.textContent = `${monthLabel} activity by start hour - ${totalCallsInWindow} call${totalCallsInWindow === 1 ? '' : 's'}.`;
    }
    function getLocalDateKey(dateObj) {
        const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function getEarningsByLocalDayMap() {
        const byDay = new Map();
        for (let i = 0; i < calls.length; i += 1) {
            const startMs = getCallStartMs(calls[i]);
            if (!Number.isFinite(startMs) || startMs <= 0) continue;
            const key = getLocalDateKey(new Date(startMs));
            const earned = Number(calls[i].earned) || 0;
            byDay.set(key, (byDay.get(key) || 0) + earned);
        }
        return byDay;
    }

    function getCallStatsByLocalDayMap() {
        const byDay = new Map();
        for (let i = 0; i < calls.length; i += 1) {
            const call = calls[i];
            const startMs = getCallStartMs(call);
            if (!Number.isFinite(startMs) || startMs <= 0) continue;
            const key = getLocalDateKey(new Date(startMs));
            const current = byDay.get(key) || { calls: 0, earnings: 0, durationMs: 0 };
            current.calls += 1;
            current.earnings += Number(call.earned) || 0;
            current.durationMs += Math.max(0, Number(call.duration) || 0);
            byDay.set(key, current);
        }
        return byDay;
    }

    function shiftTrendWindow(direction) {
        const step = Number(direction) || 0;
        if (!step) return;
        const today = clampTrendAnchorToToday(new Date());
        if (trendMode === 'monthly') {
            const monthStart = new Date(trendAnchorDate.getFullYear(), trendAnchorDate.getMonth(), 1);
            const shiftedMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + step, 1);
            const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            trendAnchorDate = shiftedMonth.getTime() > currentMonthStart.getTime() ? currentMonthStart : shiftedMonth;
        } else {
            trendAnchorDate = clampTrendAnchorToToday(addDays(trendAnchorDate, step * 7));
        }
        saveTrendPreferences();
        updateWeeklyTrendVisualization();
    }

    function updatePatternsPanelUi() {
        patternsMode = normalizePatternsMode(patternsMode);
        const isHourly = patternsMode === 'hourly';
        const isWeekly = patternsMode === 'weekly';
        const isMonthly = patternsMode === 'monthly';

        if (patternsModeHourlyBtn) patternsModeHourlyBtn.classList.toggle('is-active', isHourly);
        if (trendModeWeeklyBtn) trendModeWeeklyBtn.classList.toggle('is-active', isWeekly);
        if (trendModeMonthlyBtn) trendModeMonthlyBtn.classList.toggle('is-active', isMonthly);

        if (hourlyHeatmapCard) hourlyHeatmapCard.classList.toggle('hidden', !isHourly);
        if (trendCard) trendCard.classList.toggle('hidden', isHourly);
        if (trendAnalyticsGrid) trendAnalyticsGrid.classList.toggle('patterns-hourly-active', isHourly);

        if (patternsPanelSummary) {
            if (isHourly) {
                patternsPanelSummary.textContent = 'Current month call starts by hour.';
            } else if (isWeekly) {
                patternsPanelSummary.textContent = '7-day earnings pattern for the current week window.';
            } else {
                patternsPanelSummary.textContent = 'Month-wide earnings distribution by day.';
            }
        }
    }

    function setPatternsMode(mode) {
        const normalized = normalizePatternsMode(mode);
        if (normalized === 'hourly') {
            patternsMode = 'hourly';
            savePatternsPreference();
            updatePatternsPanelUi();
            return;
        }
        setTrendMode(normalized);
    }

    function setTrendMode(mode) {
        const normalized = normalizeTrendMode(mode);
        if (trendMode === normalized && patternsMode === normalized) {
            if (normalized === 'weekly') {
                trendAnchorDate = clampTrendAnchorToToday(new Date());
                saveTrendPreferences();
                updateWeeklyTrendVisualization();
            }
            return;
        }
        trendMode = normalized;
        patternsMode = normalized;
        if (trendMode === 'monthly') {
            trendAnchorDate = new Date(trendAnchorDate.getFullYear(), trendAnchorDate.getMonth(), 1);
        } else {
            trendAnchorDate = clampTrendAnchorToToday(new Date());
        }
        trendAnchorDate = clampTrendAnchorToToday(trendAnchorDate);
        saveTrendPreferences();
        savePatternsPreference();
        updatePatternsPanelUi();
        updateWeeklyTrendVisualization();
    }

    function syncTrendCardHeightToHourlyCard() {
        if (!trendCard || !hourlyHeatmapCard) return;
        if (trendCard.classList.contains('hidden') || hourlyHeatmapCard.classList.contains('hidden')) {
            trendCard.style.height = '';
            trendCard.style.minHeight = '';
            return;
        }
        const baseHeight = hourlyHeatmapCard.getBoundingClientRect().height;
        if (!Number.isFinite(baseHeight) || baseHeight <= 0) {
            trendCard.style.height = '';
            trendCard.style.minHeight = '';
            return;
        }
        const extraTrendHeight = window.matchMedia('(min-width: 900px)').matches ? 48 : 32;
        const targetHeight = Math.round(baseHeight + extraTrendHeight);
        if (!Number.isFinite(targetHeight) || targetHeight <= 0) return;
        trendCard.style.height = `${targetHeight}px`;
        trendCard.style.minHeight = `${targetHeight}px`;
    }

    function applyTrendLayoutMode(mode) {
        const normalized = normalizeTrendMode(mode);
        if (trendAnalyticsGrid) {
            trendAnalyticsGrid.classList.toggle('trend-layout-weekly', normalized === 'weekly');
            trendAnalyticsGrid.classList.toggle('trend-layout-monthly', normalized === 'monthly');
        }
        if (hourlyHeatmapCard) {
            hourlyHeatmapCard.classList.toggle('trend-heatmap-card-muted', normalized === 'monthly');
        }
        if (trendCard) {
            trendCard.classList.toggle('is-weekly', normalized === 'weekly');
            trendCard.classList.toggle('is-monthly', normalized === 'monthly');
        }
    }

    function updateWeeklyTrendVisualization(nowMs = Date.now()) {
        if (!weeklyTrendBars || !weeklyTrendSummary || !weeklyTrendBestDay || !trendRangeLabel) return;

        trendMode = normalizeTrendMode(trendMode);
        patternsMode = normalizePatternsMode(patternsMode);
        trendAnchorDate = clampTrendAnchorToToday(trendAnchorDate || new Date(nowMs));
        updatePatternsPanelUi();
        applyTrendLayoutMode(trendMode);
        syncTrendCardHeightToHourlyCard();

        const dayEarningsMap = getEarningsByLocalDayMap();
        const dayStatsMap = getCallStatsByLocalDayMap();
        const today = clampTrendAnchorToToday(new Date(nowMs));

        if (trendMode === 'monthly') {
            weeklyTrendBars.classList.add('hidden');
            if (monthlyTrendCanvas) monthlyTrendCanvas.classList.remove('hidden');

            const monthYear = trendAnchorDate.getFullYear();
            const monthIndex = trendAnchorDate.getMonth();
            const monthStart = new Date(monthYear, monthIndex, 1);
            const daysInMonth = new Date(monthYear, monthIndex + 1, 0).getDate();
            const firstWeekday = (monthStart.getDay() + 6) % 7;
            const dailyRows = [];
            let total = 0;
            let activeDays = 0;
            let bestDayValue = 0;
            let bestDayDate = null;

            for (let day = 1; day <= daysInMonth; day += 1) {
                const dateObj = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
                const key = getLocalDateKey(dateObj);
                const earnings = dayEarningsMap.get(key) || 0;
                const stats = dayStatsMap.get(key) || { calls: 0, earnings: 0, durationMs: 0 };
                total += earnings;
                if (earnings > 0) activeDays += 1;
                if (earnings > bestDayValue) {
                    bestDayValue = earnings;
                    bestDayDate = dateObj;
                }
                dailyRows.push({
                    day,
                    dateObj,
                    earnings,
                    callCount: stats.calls || 0,
                    durationMs: Math.max(0, Number(stats.durationMs) || 0)
                });
            }

            const maxDayEarnings = Math.max(1, ...dailyRows.map((entry) => entry.earnings));
            if (monthlyTrendWeekdays) {
                monthlyTrendWeekdays.innerHTML = '';
                const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                weekdayLabels.forEach((label) => {
                    const el = document.createElement('div');
                    el.className = 'monthly-trend-weekday';
                    el.textContent = label;
                    monthlyTrendWeekdays.appendChild(el);
                });
            }
            if (monthlyTrendHeatmap) {
                hideHeatmapHoverTooltip(true);
                monthlyTrendHeatmap.innerHTML = '';
                for (let i = 0; i < firstWeekday; i += 1) {
                    const empty = document.createElement('div');
                    empty.className = 'monthly-trend-cell is-empty';
                    empty.setAttribute('aria-hidden', 'true');
                    monthlyTrendHeatmap.appendChild(empty);
                }

                dailyRows.forEach((entry) => {
                    const intensity = entry.earnings > 0 ? (entry.earnings / maxDayEarnings) : 0;
                    const alpha = entry.earnings > 0 ? (0.12 + (0.58 * intensity)) : 0.06;
                    const cell = document.createElement('div');
                    cell.className = 'monthly-trend-cell';
                    cell.style.background = `rgba(244, 63, 94, ${alpha.toFixed(3)})`;
                    cell.innerHTML = `
                        <span class="monthly-trend-day">${entry.day}</span>
                        <span class="monthly-trend-amount">${formatEarnings(entry.earnings)}</span>
                    `;
                    const tooltip = `${entry.dateObj.toLocaleDateString(DISPLAY_LOCALE)} | ${formatEarnings(entry.earnings)} | ${entry.callCount} call${entry.callCount === 1 ? '' : 's'} | ${formatTime(entry.durationMs)}`;
                    cell.dataset.heatmapTooltip = tooltip;
                    cell.setAttribute('aria-label', tooltip);
                    monthlyTrendHeatmap.appendChild(cell);
                });
                const usedSlots = firstWeekday + dailyRows.length;
                const trailingEmptySlots = Math.max(0, 42 - usedSlots);
                for (let i = 0; i < trailingEmptySlots; i += 1) {
                    const emptyTail = document.createElement('div');
                    emptyTail.className = 'monthly-trend-cell is-empty';
                    emptyTail.setAttribute('aria-hidden', 'true');
                    monthlyTrendHeatmap.appendChild(emptyTail);
                }
                bindHeatmapTooltipDelegation(monthlyTrendHeatmap);
            }

            const monthLabel = monthStart.toLocaleDateString(DISPLAY_LOCALE, { month: 'long', year: 'numeric' });
            trendRangeLabel.textContent = monthLabel;
            weeklyTrendSummary.textContent = `Monthly earnings in ${monthLabel} | Total ${formatEarnings(total)} across ${activeDays} active day${activeDays === 1 ? '' : 's'}.`;
            if (trendSummaryInline) {
                trendSummaryInline.textContent = `Total ${formatEarnings(total)} | ${activeDays} active day${activeDays === 1 ? '' : 's'}`;
            }
            if (bestDayDate) {
                weeklyTrendBestDay.innerHTML = `<span class="trend-insight-chip trend-insight-chip-best">${bestDayDate.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'short', month: 'short', day: 'numeric' })} - ${formatEarnings(bestDayValue)}</span>`;
            } else {
                weeklyTrendBestDay.innerHTML = '<span class="trend-insight-chip trend-insight-chip-empty">No best day yet</span>';
            }

            if (trendPrevBtn) trendPrevBtn.disabled = false;
            if (trendNextBtn) {
                const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                trendNextBtn.disabled = monthStart.getTime() >= currentMonthStart.getTime();
            }
            return;
        }

        weeklyTrendBars.classList.remove('hidden');
        if (monthlyTrendCanvas) monthlyTrendCanvas.classList.add('hidden');

        const dayMs = 24 * 60 * 60 * 1000;
        const referenceDayStartMs = getDayStartMs(trendAnchorDate);
        const referenceDate = new Date(referenceDayStartMs);
        const mondayOffsetDays = (referenceDate.getDay() + 6) % 7;
        const weekStartMs = referenceDayStartMs - (mondayOffsetDays * dayMs);
        const dayWindow = Array.from({ length: 7 }, (_, index) => {
            const dayStartMs = weekStartMs + (index * dayMs);
            const dayDate = new Date(dayStartMs);
            const key = getLocalDateKey(dayDate);
            return {
                dayStartMs,
                dayDate,
                earnings: dayEarningsMap.get(key) || 0
            };
        });

        const maxEarnings = Math.max(1, ...dayWindow.map((entry) => entry.earnings));
        hideHeatmapHoverTooltip(true);
        weeklyTrendBars.innerHTML = '';
        dayWindow.forEach((entry) => {
            const intensity = entry.earnings > 0 ? (entry.earnings / maxEarnings) : 0;
            const alpha = entry.earnings > 0 ? (0.12 + (0.58 * intensity)) : 0.06;
            const dayLabel = entry.dayDate.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'short' }).toUpperCase();
            const tooltip = `${entry.dayDate.toLocaleDateString(DISPLAY_LOCALE)} | ${formatEarnings(entry.earnings)}`;
            const wrapper = document.createElement('div');
            wrapper.className = 'weekly-trend-day';
            wrapper.innerHTML = `
                <div class="weekly-trend-bar" style="background: rgba(244, 63, 94, ${alpha.toFixed(3)})">
                    <span class="weekly-trend-bar-day">${escapeHTML(dayLabel)}</span>
                </div>
                <div class="weekly-trend-day-value">${formatEarnings(entry.earnings)}</div>
            `;
            wrapper.dataset.heatmapTooltip = tooltip;
            wrapper.setAttribute('aria-label', tooltip);
            weeklyTrendBars.appendChild(wrapper);
        });
        bindHeatmapTooltipDelegation(weeklyTrendBars);

        const bestDay = dayWindow.reduce((best, entry) => (entry.earnings > best.earnings ? entry : best), dayWindow[0] || { earnings: 0, dayDate: trendAnchorDate });
        const bestDayLabel = bestDay.dayDate.toLocaleDateString(DISPLAY_LOCALE, { weekday: 'long', month: 'short', day: 'numeric' });
        weeklyTrendBestDay.innerHTML = `<span class="trend-insight-chip trend-insight-chip-best">${bestDayLabel} - ${formatEarnings(bestDay.earnings)}</span>`;
        const weekTotal = dayWindow.reduce((sum, entry) => sum + entry.earnings, 0);
        weeklyTrendSummary.textContent = `Earnings over this 7-day window | Total ${formatEarnings(weekTotal)}`;
        if (trendSummaryInline) trendSummaryInline.textContent = `7-day total ${formatEarnings(weekTotal)}`;

        const rangeStart = dayWindow[0]?.dayDate || trendAnchorDate;
        const rangeEnd = dayWindow[6]?.dayDate || trendAnchorDate;
        trendRangeLabel.textContent = `${rangeStart.toLocaleDateString(DISPLAY_LOCALE, { month: 'short', day: 'numeric' })} - ${rangeEnd.toLocaleDateString(DISPLAY_LOCALE, { month: 'short', day: 'numeric', year: 'numeric' })}`;
        if (trendPrevBtn) trendPrevBtn.disabled = false;
        if (trendNextBtn) {
            const todayStartMs = getDayStartMs(today);
            const todayDate = new Date(todayStartMs);
            const currentWeekStartMs = todayStartMs - (((todayDate.getDay() + 6) % 7) * dayMs);
            trendNextBtn.disabled = weekStartMs >= currentWeekStartMs;
        }
    }
    function updateStatistics() {
        const now = new Date();
        const nowMs = now.getTime();
        const dayMs = 24 * 60 * 60 * 1000;
        const selectedDate = parseDateInput(statsDatePicker?.value) || new Date(nowMs);
        const selectedDayStartMs = getDayStartMs(selectedDate);
        const selectedDayEndMs = selectedDayStartMs + dayMs;
        const priorDayStartMs = selectedDayStartMs - dayMs;
        const currentDayStartMs = getDayStartMs(now);
        const isViewingToday = selectedDayStartMs === currentDayStartMs;
        const comparisonLabel = isViewingToday ? 'yesterday' : 'the prior day';
        const monthStartMs = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getTime();
        const nextMonthStartMs = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1).getTime();

        if (statsSnapshotHeading) {
            statsSnapshotHeading.textContent = isViewingToday
                ? 'Today Snapshot'
                : `${selectedDate.toLocaleDateString(DISPLAY_LOCALE, { month: 'short', day: 'numeric', year: 'numeric' })} Snapshot`;
        }
        if (todayEarningsTitleDisplay) {
            const earningsTitle = isViewingToday ? "Today's Earnings" : 'Selected Day Earnings';
            todayEarningsTitleDisplay.innerHTML = `<i class="fas fa-chart-line mr-2"></i>${earningsTitle}`;
        }

        let todaysEarnings = 0;
        let todaysDuration = 0;
        let todaysCount = 0;

        let yesterdaysEarnings = 0;
        let yesterdaysDuration = 0;
        let yesterdaysCount = 0;

        let firstHalfEarnings = 0;
        let secondHalfEarnings = 0;

        let currentCycle = null;
        let cycleStartMs = 0;
        let cycleEndMs = 0;
        let cycleEarnings = 0;
        let cycleCallCount = 0;

        const cycleContext = getPaymentCyclesTimelineContext(nowMs);
        if (paymentCyclesEnabled && cycleContext.normalized.length > 0) {
            currentCycle = cycleContext.current;
            if (currentCycle) {
                cycleStartMs = currentCycle._startMs;
                cycleEndMs = currentCycle._endMs;
            }
        }

        for (let i = 0; i < calls.length; i += 1) {
            const call = calls[i];
            const startMs = getCallStartMs(call);
            const earned = Number(call.earned) || 0;
            const duration = Number(call.duration) || 0;

            if (startMs >= selectedDayStartMs && startMs < selectedDayEndMs) {
                todaysEarnings += earned;
                todaysDuration += duration;
                todaysCount += 1;
            } else if (startMs >= priorDayStartMs && startMs < selectedDayStartMs) {
                yesterdaysEarnings += earned;
                yesterdaysDuration += duration;
                yesterdaysCount += 1;
            }

            if (startMs >= monthStartMs && startMs < nextMonthStartMs) {
                const day = new Date(startMs).getDate();
                if (day <= 15) firstHalfEarnings += earned;
                else secondHalfEarnings += earned;
            }

            if (currentCycle && startMs >= cycleStartMs && startMs <= cycleEndMs) {
                cycleEarnings += earned;
                cycleCallCount += 1;
            }
        }

        const sumCycleEarnings = (cycle, endMsOverride = null) => {
            if (!cycle) return 0;
            const windowEndMs = Number.isFinite(endMsOverride)
                ? Math.min(endMsOverride, cycle._endMs)
                : cycle._endMs;
            let total = 0;
            for (let i = 0; i < calls.length; i += 1) {
                const callStartMs = getCallStartMs(calls[i]);
                if (callStartMs >= cycle._startMs && callStartMs <= windowEndMs) {
                    total += Number(calls[i].earned) || 0;
                }
            }
            return total;
        };

        const todaysMinutes = todaysDuration / (1000 * 60);
        const yesterdaysMinutes = yesterdaysDuration / (1000 * 60);

        todayEarningsDisplay.textContent = formatEarnings(todaysEarnings);

        const todaysAvgDuration = todaysCount > 0 ? (todaysDuration / todaysCount) : 0;
        const yesterdaysAvgDuration = yesterdaysCount > 0 ? (yesterdaysDuration / yesterdaysCount) : 0;

        if (todaysCount > 0) {
            avgDurationDisplay.textContent = formatTime(todaysAvgDuration);
        } else {
            avgDurationDisplay.textContent = '00:00:00';
        }

        if (avgDurationDeltaDisplay) {
            if (todaysCount === 0 && yesterdaysCount === 0) {
                avgDurationDeltaDisplay.textContent = `Compared with ${comparisonLabel}: no baseline yet`;
                applyDeltaTone(avgDurationDeltaDisplay, 0);
            } else {
                const avgDurationDelta = todaysAvgDuration - yesterdaysAvgDuration;
                avgDurationDeltaDisplay.textContent = `Compared with ${comparisonLabel}: ${formatSupportiveDurationDelta(avgDurationDelta)}`;
                applyDeltaTone(avgDurationDeltaDisplay, avgDurationDelta);
            }
        }

        if (todayEarningsDeltaDisplay) {
            const earningsDelta = todaysEarnings - yesterdaysEarnings;
            if (todaysEarnings === 0 && yesterdaysEarnings === 0) {
                todayEarningsDeltaDisplay.textContent = `Compared with ${comparisonLabel}: no baseline yet`;
                applyDeltaTone(todayEarningsDeltaDisplay, 0);
            } else if (yesterdaysEarnings === 0 && todaysEarnings > 0) {
                todayEarningsDeltaDisplay.textContent = `Compared with ${comparisonLabel}: first active day (+${formatEarnings(todaysEarnings)})`;
                applyDeltaTone(todayEarningsDeltaDisplay, todaysEarnings);
            } else {
                todayEarningsDeltaDisplay.textContent = `Compared with ${comparisonLabel}: ${formatSupportiveCurrencyDelta(earningsDelta)}`;
                applyDeltaTone(todayEarningsDeltaDisplay, earningsDelta);
            }
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

        if (goalEstimateDeltaDisplay) {
            if (hasAmountGoal || hasMinutesGoal) {
                const goalTarget = hasAmountGoal ? dailyGoal.amount : derivedGoalMinutes;
                if (goalTarget > 0) {
                    const todayProgressValue = hasAmountGoal ? todaysEarnings : todaysMinutes;
                    const yesterdayProgressValue = hasAmountGoal ? yesterdaysEarnings : yesterdaysMinutes;
                    const todayPct = Math.min((todayProgressValue / goalTarget) * 100, 100);
                    const yesterdayPct = Math.min((yesterdayProgressValue / goalTarget) * 100, 100);
                    const paceDeltaPct = todayPct - yesterdayPct;
                    goalEstimateDeltaDisplay.textContent = `Pace compared with ${comparisonLabel}: ${formatSupportivePercentDelta(paceDeltaPct)}`;
                    applyDeltaTone(goalEstimateDeltaDisplay, paceDeltaPct);
                } else {
                    goalEstimateDeltaDisplay.textContent = `Pace compared with ${comparisonLabel}: no baseline yet`;
                    applyDeltaTone(goalEstimateDeltaDisplay, 0);
                }
            } else {
                goalEstimateDeltaDisplay.textContent = `Pace compared with ${comparisonLabel}: no baseline yet`;
                applyDeltaTone(goalEstimateDeltaDisplay, 0);
            }
        }

        const monthlyEarnings = firstHalfEarnings + secondHalfEarnings;

        firstHalfEarningsDisplay.textContent = formatEarnings(firstHalfEarnings);
        secondHalfEarningsDisplay.textContent = formatEarnings(secondHalfEarnings);
        monthlyTotalEarningsDisplay.textContent = formatEarnings(monthlyEarnings);

        const nearestPayCycle = cycleContext.closestUpcomingPayCycle || cycleContext.next || null;
        const hasUpcomingPay = !!(nearestPayCycle && Number.isFinite(nearestPayCycle._payMs));
        const daysUntilNearestPay = hasUpcomingPay
            ? Math.max(0, Math.ceil((nearestPayCycle._payMs - nowMs) / dayMs))
            : null;

        const endedCycles = cycleContext.normalized.filter((cycle) => cycle._endMs < nowMs);
        const lastClosedCycle = endedCycles.length ? endedCycles[endedCycles.length - 1] : null;
        const lastClosedCycleEarnings = sumCycleEarnings(lastClosedCycle);

        let previousCycle = null;
        if (currentCycle) {
            const currentIndex = cycleContext.normalized.findIndex((cycle) => (
                cycle._startMs === currentCycle._startMs
                && cycle._endMs === currentCycle._endMs
                && cycle._payMs === currentCycle._payMs
            ));
            if (currentIndex > 0) {
                previousCycle = cycleContext.normalized[currentIndex - 1];
            }
        }
        const previousCycleEarnings = sumCycleEarnings(previousCycle);

        if (currentCycle) {
            cycleEarningsDisplay.textContent = formatEarnings(cycleEarnings);
            cycleStartDateDisplay.textContent = formatDate(currentCycle.startDate);
            cycleEndDateDisplay.textContent = formatDate(currentCycle.endDate);

            const daysLeft = Math.max(0, Math.ceil((currentCycle._endMs - nowMs) / dayMs));
            daysUntilEndDisplay.textContent = `${daysLeft} day${daysLeft === 1 ? '' : 's'}`;

            const cycleDurationMs = Math.max(dayMs, (currentCycle._endMs - currentCycle._startMs) + dayMs);
            const elapsedMs = Math.max(0, Math.min(cycleDurationMs, nowMs - currentCycle._startMs));
            const cycleProgressPct = (elapsedMs / cycleDurationMs) * 100;

            if (cycleStateChipDisplay) cycleStateChipDisplay.textContent = 'Active';
            if (cycleProgressBarDisplay) cycleProgressBarDisplay.style.width = `${cycleProgressPct.toFixed(1)}%`;
            if (cycleProgressMetaDisplay) {
                cycleProgressMetaDisplay.textContent = `${cycleProgressPct.toFixed(0)}% elapsed | ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
            }
            if (cycleEarningsMetaDisplay) {
                cycleEarningsMetaDisplay.textContent = `${cycleCallCount} call${cycleCallCount === 1 ? '' : 's'} in current cycle`;
            }
            if (cycleEarningsTrendDisplay) {
                if (previousCycle) {
                    const cycleDelta = cycleEarnings - previousCycleEarnings;
                    cycleEarningsTrendDisplay.textContent = `Compared with previous cycle: ${formatSupportiveCurrencyDelta(cycleDelta)}`;
                    applyDeltaTone(cycleEarningsTrendDisplay, cycleDelta);
                } else {
                    cycleEarningsTrendDisplay.textContent = 'No previous cycle to compare yet.';
                    applyDeltaTone(cycleEarningsTrendDisplay, 0);
                }
            }
        } else if (paymentCyclesEnabled) {
            cycleEarningsDisplay.textContent = '$0.00';
            cycleStartDateDisplay.textContent = '--';
            cycleEndDateDisplay.textContent = '--';
            daysUntilEndDisplay.textContent = '--';

            if (cycleStateChipDisplay) {
                cycleStateChipDisplay.textContent = cycleContext.next ? 'Upcoming' : 'No cycle';
            }
            if (cycleProgressBarDisplay) cycleProgressBarDisplay.style.width = '0%';
            if (cycleProgressMetaDisplay) {
                if (cycleContext.next) {
                    const daysUntilNextStart = Math.max(0, Math.ceil((cycleContext.next._startMs - nowMs) / dayMs));
                    cycleProgressMetaDisplay.textContent = `Starts in ${daysUntilNextStart} day${daysUntilNextStart === 1 ? '' : 's'}`;
                } else {
                    cycleProgressMetaDisplay.textContent = 'No active cycle.';
                }
            }
            if (cycleEarningsMetaDisplay) {
                cycleEarningsMetaDisplay.textContent = 'No active cycle yet.';
            }
            if (cycleEarningsTrendDisplay) {
                if (lastClosedCycle) {
                    cycleEarningsTrendDisplay.textContent = `Last closed cycle: ${formatEarnings(lastClosedCycleEarnings)}`;
                } else {
                    cycleEarningsTrendDisplay.textContent = '--';
                }
                applyDeltaTone(cycleEarningsTrendDisplay, 0);
            }
        }

        if (!paymentCyclesEnabled) {
            if (cycleStateChipDisplay) cycleStateChipDisplay.textContent = '--';
            if (cycleProgressBarDisplay) cycleProgressBarDisplay.style.width = '0%';
            if (cycleProgressMetaDisplay) cycleProgressMetaDisplay.textContent = '--';
            if (cycleEarningsMetaDisplay) cycleEarningsMetaDisplay.textContent = '--';
            if (cycleEarningsTrendDisplay) {
                cycleEarningsTrendDisplay.textContent = '--';
                applyDeltaTone(cycleEarningsTrendDisplay, 0);
            }
            payDateDisplay.textContent = '--';
            daysUntilPayDisplay.textContent = '--';
            if (payCountdownHeadlineDisplay) payCountdownHeadlineDisplay.textContent = 'Pay in --';
            if (nextPayCycleContextDisplay) nextPayCycleContextDisplay.textContent = '--';
        } else {
            payDateDisplay.textContent = hasUpcomingPay ? formatDate(nearestPayCycle.payDate) : '--';
            daysUntilPayDisplay.textContent = daysUntilNearestPay === null
                ? '--'
                : `${daysUntilNearestPay} day${daysUntilNearestPay === 1 ? '' : 's'}`;

            if (payCountdownHeadlineDisplay) {
                if (daysUntilNearestPay === null) {
                    payCountdownHeadlineDisplay.textContent = 'Pay in --';
                } else if (daysUntilNearestPay === 0) {
                    payCountdownHeadlineDisplay.textContent = 'Pay today';
                } else {
                    payCountdownHeadlineDisplay.textContent = `Pay in ${daysUntilNearestPay} day${daysUntilNearestPay === 1 ? '' : 's'}`;
                }
            }

            if (nextPayCycleContextDisplay) {
                if (!hasUpcomingPay) {
                    nextPayCycleContextDisplay.textContent = 'No upcoming pay date.';
                } else {
                    const isCurrentCyclePay = currentCycle
                        && nearestPayCycle._startMs === currentCycle._startMs
                        && nearestPayCycle._endMs === currentCycle._endMs;
                    nextPayCycleContextDisplay.textContent = isCurrentCyclePay
                        ? 'Current cycle payout'
                        : 'Upcoming cycle payout';
                }
            }
        }

        renderPaymentCyclesCurrentSummary(nowMs);
        updateWorkRhythmInsights(nowMs);
        updateHourlyHeatmap(nowMs);
        updateWeeklyTrendVisualization(nowMs);
        updateRpgProgress();
        queueWorkstripSync();
        scheduleStorageInfoRefresh();
    }
    // Time zone helpers
    function getUserTimeZone() {
        const tz = appStorage.getItem('timeZone');
        if (tz && tz.length > 0) return tz;
        // Explicit fallback to the browser time zone to avoid passing undefined to Intl
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    function setUserTimeZone(tz) {
        if (!tz) {
            pendingStorageWrites.delete('timeZone');
            appStorage.removeItem('timeZone');
        } else {
            queueStorageWrite('timeZone', tz);
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
        return date.toLocaleDateString(DISPLAY_LOCALE);
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
        } else if (rates.length > 0) {
            rateSelect.value = rates[0].name;
            lastSelectedRate = rates[0].name;
            queueStorageWrite('lastSelectedRate', lastSelectedRate);
        }

        if (callRateSelect && callRateSelect.options.length > 0 && !callRateSelect.value) {
            callRateSelect.value = rateSelect.value;
        }

        populateCallLogRateFilterOptions();
        scheduleDesktopOverlayRefresh();
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

    function getCallSortValue(call, sortKey) {
        if (sortKey === 'startTime') return getCallStartMs(call);
        if (sortKey === 'endTime') return Number(Date.parse(call?.endTime || '')) || 0;
        if (sortKey === 'duration') return Number(call?.duration) || 0;
        if (sortKey === 'earned') return Number(call?.earned) || 0;
        if (sortKey === 'rateName') return String(call?.rateName || '').toLowerCase();
        if (sortKey === 'notes') return String(call?.notes || '').toLowerCase();
        return getCallStartMs(call);
    }

    function sortCallsForView(rows) {
        if (!Array.isArray(rows) || rows.length <= 1) return Array.isArray(rows) ? rows.slice() : [];
        const key = callLogSort?.key || 'startTime';
        const direction = callLogSort?.direction === 'asc' ? 1 : -1;
        return rows.slice().sort((a, b) => {
            const av = getCallSortValue(a, key);
            const bv = getCallSortValue(b, key);
            if (av === bv) {
                return getCallStartMs(b) - getCallStartMs(a);
            }
            if (typeof av === 'string' || typeof bv === 'string') {
                return String(av).localeCompare(String(bv), undefined, { numeric: true }) * direction;
            }
            return ((Number(av) || 0) - (Number(bv) || 0)) * direction;
        });
    }

    function updateCallLogSortUi() {
        if (!callLogSortableHeaders.length) return;
        callLogSortableHeaders.forEach((headerEl) => {
            const key = headerEl.getAttribute('data-sort-key');
            const isActive = key === callLogSort.key;
            headerEl.classList.toggle('sort-active', isActive);
            headerEl.classList.toggle('sort-asc', isActive && callLogSort.direction === 'asc');
            headerEl.classList.toggle('sort-desc', isActive && callLogSort.direction === 'desc');
            headerEl.setAttribute('aria-sort', isActive ? (callLogSort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
        });
    }

    function setCallLogSort(nextKey) {
        const normalizedKey = String(nextKey || '').trim();
        if (!normalizedKey) return;
        if (callLogSort.key === normalizedKey) {
            callLogSort.direction = callLogSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            callLogSort.key = normalizedKey;
            callLogSort.direction = ['duration', 'earned', 'startTime', 'endTime'].includes(normalizedKey) ? 'desc' : 'asc';
        }
        updateCallLogSortUi();
        displayCalls();
    }

    function displayCalls() {
        closeCallLogActionsMenu(true);
        callLogRenderTicket += 1;
        const renderTicket = callLogRenderTicket;
        const filteredCalls = sortCallsForView(getFilteredCallsCached());
        callLogTableBody.innerHTML = '';
        if (callLogMobileList) callLogMobileList.innerHTML = '';
        if (callLogScrollContainer) callLogScrollContainer.scrollTop = 0;

        if (filteredCalls.length === 0) {
            callLogRenderState = null;
            callLogTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500 dark:text-gray-400">No calls recorded.</td></tr>`;
            if (callLogMobileList) {
                callLogMobileList.innerHTML = `<div class="call-log-mobile-empty text-center py-4 text-gray-500 dark:text-gray-400">No calls recorded.</div>`;
            }
            totalMinutesDisplay.textContent = '0 min';
            totalEarningsDisplay.textContent = '$0.00';
            updateCallLogResultsSummary(0);
            return;
        }

        const totalDuration = filteredCalls.reduce((sum, call) => sum + call.duration, 0);
        const totalMinutes = totalDuration / (1000 * 60);
        const totalEarnings = filteredCalls.reduce((sum, call) => sum + call.earned, 0);
        totalMinutesDisplay.textContent = `${Math.round(totalMinutes)} min`;
        totalEarningsDisplay.textContent = formatEarnings(totalEarnings);
        updateCallLogResultsSummary(filteredCalls.length);

        const userTz = getUserTimeZone();
        const rateNameSet = new Set(rates.map((r) => r.name));
        callLogRenderState = {
            ticket: renderTicket,
            rows: filteredCalls,
            cursor: 0,
            userTz,
            rateNameSet,
            done: false
        };

        renderNextCallLogChunk();
    }

    function renderNextCallLogChunk() {
        const state = callLogRenderState;
        if (!state || state.done) return;
        if (state.ticket !== callLogRenderTicket) return;

        const fragment = document.createDocumentFragment();
        const mobileFragment = document.createDocumentFragment();
        const end = Math.min(state.cursor + CALL_LOG_RENDER_CHUNK_SIZE, state.rows.length);
        for (let i = state.cursor; i < end; i += 1) {
            const call = state.rows[i];
            fragment.appendChild(buildCallRow(call, state.userTz, state.rateNameSet));
            if (callLogMobileList) {
                mobileFragment.appendChild(buildCallMobileCard(call, state.userTz, state.rateNameSet));
            }
        }
        callLogTableBody.appendChild(fragment);
        if (callLogMobileList) callLogMobileList.appendChild(mobileFragment);
        state.cursor = end;
        state.done = state.cursor >= state.rows.length;

        if (!state.done) {
            requestAnimationFrame(() => {
                if (state.ticket !== callLogRenderTicket) return;
                if (callLogScrollContainer) {
                    const nearBottom = callLogScrollContainer.scrollTop + callLogScrollContainer.clientHeight >= (callLogScrollContainer.scrollHeight - CALL_LOG_RENDER_AHEAD_PX);
                    if (nearBottom) renderNextCallLogChunk();
                } else {
                    renderNextCallLogChunk();
                }
            });
        }
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

  const callDate = parseDateInput(callDateInput?.value || '') || parseDateInput(getTodayDateString());
  let start = combineCallDateAndTime(callDate, callStartTimeInput.value);
  let end = combineCallDateAndTime(callDate, callEndTimeInput.value);
  const durationMsFromMinutes = minutesToMs(callDurationInput.value);
  const hasDurationInput = String(callDurationInput.value || '').trim().length > 0;

  if (hasDurationInput && !Number.isFinite(durationMsFromMinutes)) {
    showAlertModal('Invalid Duration', 'Use minutes like 15 or a time format like 00:15:30.');
    return;
  }

  // Minimum validation: either start+end, or duration input.
  if ((!start || !end) && !durationMsFromMinutes) {
    showAlertModal('Invalid Call Data', 'Please enter Start & End time, or a valid Duration.');
    return;
  }

  if (start && end && end <= start) {
    end = new Date(end.getTime() + (24 * 60 * 60 * 1000));
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
      const baseDate = callDate || new Date();
      finalStart = callDate
        ? new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0, 0)
        : new Date();
      finalEnd = new Date(finalStart.getTime() + durationMsFromMinutes);
    }
  }

  // If we still do not have both start and end, input is invalid.
  if (!finalStart || !finalEnd || finalEnd <= finalStart) {
    showAlertModal('Invalid Call Data', 'Please enter valid values (End must be after Start).');
    return;
  }

  const selectedRateName = callRateSelect.value;
  const selectedRate = rates.find(r => r.name === selectedRateName);
  const ratePerMin = selectedRate ? selectedRate.amount : 0;
  const manualNotes = String(callNotesInput?.value || '').trim();

  const durationMs = finalEnd - finalStart;
  const earnings = Number(((durationMs / (1000 * 60)) * ratePerMin).toFixed(2));
  const wasEditing = isEditingCall;
  const rpgEligible = isRpgEnabled();

  if (isEditingCall) {
    const idx = calls.findIndex(c => c.id === editingCallId);
    if (idx === -1) return;

    const updated = normalizeCall({
      ...calls[idx],
      startTime: finalStart.toISOString(),
      endTime: finalEnd.toISOString(),
      duration: durationMs,
      rate: ratePerMin,
      rpgEligible: typeof calls[idx].rpgEligible === 'boolean' ? calls[idx].rpgEligible : rpgEligible,
      rateName: selectedRateName,
            earnings,
      notes: manualNotes
    });

    calls[idx] = updated;
  } else {
    calls.push(normalizeCall({
      id: generateUUID(),
      startTime: finalStart.toISOString(),
      endTime: finalEnd.toISOString(),
      duration: durationMs,
      rate: ratePerMin,
      rpgEligible,
      rateName: selectedRateName,
            earnings,
      notes: manualNotes
    }));
  }

  saveCalls();
  closeCallModal();
  if (wasEditing) {
    showToast('Call updated.');
  } else {
    if (rpgEligible) {
      const statsAfterSave = computeAchievementStats();
      const earnedXp = getCallXpForDurationWithStreak(durationMs, statsAfterSave.currentStreak);
      showToast(`Call saved! XP gained: +${earnedXp}`);
    } else {
      showToast('Call saved!');
    }
  }
}

    function editCall(callId) {
  calls = readCallsFromStorage();
  const callToEdit = calls.find(call => call.id === callId);
  if (!callToEdit) return;

  isEditingCall = true;
  editingCallId = callId;

  // Llenar inputs del modal con los valores guardados
  callDateInput.value = formatDateForInput(new Date(callToEdit.startTime));
  callStartTimeInput.value = formatLocalTimeForInput(callToEdit.startTime);
  callEndTimeInput.value = formatLocalTimeForInput(callToEdit.endTime);
  const durationMs = new Date(callToEdit.endTime) - new Date(callToEdit.startTime);
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
    callDurationInput.value = totalSeconds > 0 ? `${hours}:${minutes}:${seconds}` : '';
    if (callNotesInput) callNotesInput.value = String(callToEdit.notes || '');

  // Seleccionar la rate correcta
  if (callToEdit.rateName) {
    callRateSelect.value = callToEdit.rateName;
  } else {
    // fallback si no guardaste rateName antes
    callRateSelect.value = rateSelect.value || callRateSelect.value;
  }

  // Update modal title.
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
                if (postCallReviewState?.callId === callId) {
                    hidePostCallReview(true);
                }
            }
        );
    }

    // Call modal functions
    function openCallModal(triggerEl = null) {
        ModalManager.open(callModal, { focusSelector: '#call-date', sourceEl: triggerEl });
    }

    function closeCallModal() {
        ModalManager.close(callModal);
        isEditingCall = false;
        editingCallId = null;
        callForm.reset();
        callDurationInput.value = '';
    }

    // Live call functions
    function startLiveCall() {
        markUserActivity();
        if (sessionTrackerState?.active && sessionTrackerState.paused) {
            const now = Date.now();
            if (sessionTrackerState.pauseStartedMs > 0) {
                sessionTrackerState.pausedTotalMs += Math.max(0, now - sessionTrackerState.pauseStartedMs);
            }
            sessionTrackerState.paused = false;
            sessionTrackerState.pauseStartedMs = 0;
            saveSessionTrackerState();
            ensureSessionTrackerTimer();
            renderSessionTracker();
            showToast('Session resumed automatically.');
        }
        const selectedRate = rates.find(rate => rate.name === rateSelect.value);
        beginLiveCallWithRate(rateSelect.value, selectedRate ? Number(selectedRate.amount) || 0 : 0);
    }

    function adjustLiveCallElapsedByMs(deltaMs) {
        markUserActivity();
        if (!LiveCallSession.isActive()) return;
        const currentSession = buildCurrentActiveCallSession();
        if (!currentSession) return;
        const now = Date.now();
        const requestedStart = Math.round((currentSession.start || now) - Number(deltaMs || 0));
        const clampedStart = Math.min(now, Math.max(1, requestedStart));
        const updated = setLiveCallRuntimeState({
            ...currentSession,
            start: clampedStart,
            lastPing: now
        });
        if (!updated) return;
        saveActiveCallState(true);
        const elapsedMs = Math.max(0, now - updated.start);
        liveCallTimerDisplay.textContent = formatTime(elapsedMs);
        liveCallEarningsDisplay.textContent = formatEarnings(calculateEarnings(elapsedMs, currentCallRate || getSelectedRateAmount()));
        updateFloatingActiveCard(featureFlags, true);
        queueWorkstripSync();
        void syncAndroidWidgetActiveSession();
    }

    function endLiveCall() {
        markUserActivity();
        const stopResult = LiveCallSession.stop();
        if (!stopResult.ok) return;
        if (liveCallTimerId) {
            clearInterval(liveCallTimerId);
            liveCallTimerId = null;
        }
        calls.push(stopResult.callData);
        saveCalls();
        setLiveCallInfoVisibility(false);
        startCallBtn.style.display = 'block';
        endCallBtn.style.display = 'none';
        liveCallInfo.classList.remove('active-call-pulse');
        liveCallTimerDisplay.textContent = '00:00:00';
        liveCallEarningsDisplay.textContent = '$0.00';
        if (liveCallNotesInput) liveCallNotesInput.value = '';
        LiveCallSession.clear();
        if (isRpgEnabled()) {
            const statsAfterSave = computeAchievementStats();
            const earnedXp = getCallXpForDurationWithStreak(stopResult.elapsedMs, statsAfterSave.currentStreak);
            showToast(`Live call saved! XP gained: +${earnedXp}`);
        } else {
            showToast('Live call saved!');
        }
        showPostCallReview(stopResult.callData, stopResult.elapsedMs, stopResult.earnings);
        clearActiveCallState();
        void syncAndroidWidgetActiveSession();
        updateFloatingCallControls(featureFlags);
        scheduleDesktopOverlayRefresh();
        animateFloatingPrimaryTransition();
        hideActiveCallRecoveryBanner();
        recoveredActiveCallState = null;
        if (sessionTrackerState?.active) {
            renderSessionTracker();
        }
        queueWorkstripSync();
    }

    // Settings modal functions
    function openSettingsModal(triggerEl = null) {
        ModalManager.open(settingsModal, { focusSelector: '#feature-notes-toggle', sourceEl: triggerEl });
        const state = loadOnboardingState();
        state.dismissed.settings = true;
        state.seen = true;
        if (!state.completed || typeof state.completed !== 'object') {
            state.completed = { rate: false, call: false, settings: false };
        }
        state.completed.settings = true;
        saveOnboardingState(state);
        updateOnboardingCues();
        updateSettingsSplitState();
        updateStorageInfo();
    }

    function closeSettingsModal() {
        closeOtherDetailModals(null);
        detailModals().forEach((modalEl) => clearDetailModalPresentation(modalEl));
        stopFloatingPreviewAutoRefresh();
        ModalManager.close(settingsModal);
    }

    function openPaymentCyclesSettingsModal(triggerEl = null, options = {}) {
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
        paymentCyclesListExpanded = !!options?.expandList;
        renderPaymentCycles();
    }

    function openPaymentCyclesManagerFromDashboard(triggerEl = null) {
        if (!featureFlags.paymentCycles) {
            showToast('Enable Payment Cycles in Settings first.');
            return;
        }
        if (settingsModal && !ModalManager.isOpen(settingsModal)) {
            openSettingsModal(settingsToggleBtn || triggerEl);
        }
        openPaymentCyclesSettingsModal(triggerEl || openPaymentCyclesSettingsBtn, { expandList: true });
    }

    function openAchievementsSettingsModal(triggerEl = null) {
        if (settingsModal && ModalManager.isOpen(settingsModal)) {
            closeSettingsModal();
        }
        clearDetailModalPresentation(achievementsSettingsModal);
        renderAchievementsModal();
        ModalManager.open(achievementsSettingsModal, { focusSelector: '#done-achievements-settings-btn', sourceEl: triggerEl });
        const scrollEl = achievementsSettingsModal?.querySelector('.settings-modal-scroll');
        if (scrollEl) {
            scrollEl.scrollTop = 0;
            requestAnimationFrame(() => {
                scrollEl.scrollTop = 0;
            });
        }
    }

    function openAchievementDetailModal(achievementId, triggerEl = null) {
        if (!achievementDetailModal) return;
        selectedAchievementId = achievementId;
        renderAchievementDetailModal(achievementId);
        ModalManager.open(achievementDetailModal, { focusSelector: '#done-achievement-detail-btn', sourceEl: triggerEl });
    }

    function closeAchievementDetailModal() {
        ModalManager.close(achievementDetailModal);
    }

    function closeAchievementsSettingsModal() {
        closeAchievementDetailModal();
        ModalManager.close(achievementsSettingsModal);
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
    function toLocalMidnightIso(dateObj) {
        const localDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
        return localDate.toISOString();
    }

    function getBiweeklyTemplateAnchorDate(baseDate = parseDateInput(getTodayDateString())) {
        const anchor = new Date(2025, 11, 13); // 2025-12-13 from the provided interpreter sheet
        const safeBaseDate = baseDate instanceof Date && Number.isFinite(baseDate.getTime()) ? baseDate : new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const deltaDays = Math.floor((safeBaseDate.getTime() - anchor.getTime()) / oneDayMs);
        const periods = Math.floor(deltaDays / 14);
        return addDays(anchor, periods * 14);
    }

    function ensurePaymentCycleTemplateDefaults(force = false) {
        if (paymentCycleTemplateStartDateInput && (force || !paymentCycleTemplateStartDateInput.value)) {
            const cycleStarts = (Array.isArray(paymentCycles) ? paymentCycles : [])
                .map((cycle) => parseOptionalDate(cycle?.startDate))
                .filter((date) => date instanceof Date && Number.isFinite(date.getTime()))
                .sort((a, b) => a.getTime() - b.getTime());
            const seedDate = cycleStarts.length > 0 ? cycleStarts[0] : getBiweeklyTemplateAnchorDate();
            paymentCycleTemplateStartDateInput.value = formatDateForInput(seedDate);
        }
        if (paymentCycleTemplateCountInput && (force || !paymentCycleTemplateCountInput.value)) {
            paymentCycleTemplateCountInput.value = '26';
        }
        if (paymentCycleTemplatePayOffsetInput && (force || !paymentCycleTemplatePayOffsetInput.value)) {
            paymentCycleTemplatePayOffsetInput.value = '7';
        }
    }

    function buildBiweeklyCyclesFromTemplate(startDate, count, payOffsetDays) {
        const safeStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const safeCount = Math.max(1, Math.min(120, Number(count) || 26));
        const safePayOffset = Math.max(0, Math.min(30, Number(payOffsetDays) || 7));
        const cycles = [];

        for (let i = 0; i < safeCount; i += 1) {
            const cycleStart = addDays(safeStart, i * 14);
            const cycleEnd = addDays(cycleStart, 13);
            const payDate = addDays(cycleEnd, safePayOffset);
            cycles.push({
                startDate: toLocalMidnightIso(cycleStart),
                endDate: toLocalMidnightIso(cycleEnd),
                payDate: toLocalMidnightIso(payDate)
            });
        }

        return cycles;
    }

    function handleGeneratePaymentCyclesFromTemplate() {
        const startDate = parseDateInput(paymentCycleTemplateStartDateInput?.value || '');
        const count = Number(paymentCycleTemplateCountInput?.value || 26);
        const payOffsetDays = Number(paymentCycleTemplatePayOffsetInput?.value || 7);
        const replaceExisting = !!paymentCycleTemplateReplaceToggle?.checked;

        if (!startDate) {
            showAlertModal('Missing Start Date', 'Choose the first cycle start date before generating payment cycles.');
            return;
        }
        if (!Number.isFinite(count) || count < 1) {
            showAlertModal('Invalid Count', 'Choose a valid number of cycles (minimum 1).');
            return;
        }
        if (!Number.isFinite(payOffsetDays) || payOffsetDays < 0) {
            showAlertModal('Invalid Pay Offset', 'Pay offset must be 0 or higher.');
            return;
        }

        const generated = buildBiweeklyCyclesFromTemplate(startDate, count, payOffsetDays);
        if (!generated.length) {
            showAlertModal('Nothing Generated', 'No payment cycles were generated. Check your template values.');
            return;
        }

        const existing = Array.isArray(paymentCycles) ? paymentCycles.map((cycle) => ({ ...cycle })) : [];
        if (replaceExisting) {
            paymentCycles = generated;
            savePaymentCycles();
            showToast(`Generated ${generated.length} biweekly payment cycle${generated.length === 1 ? '' : 's'}.`);
            return;
        }

        const seen = new Set(existing.map((cycle) => getPaymentCycleDuplicateKey(cycle)).filter(Boolean));
        let added = 0;
        generated.forEach((cycle) => {
            const key = getPaymentCycleDuplicateKey(cycle);
            if (!key || seen.has(key)) return;
            seen.add(key);
            existing.push(cycle);
            added += 1;
        });

        paymentCycles = existing;
        savePaymentCycles();
        showToast(`Generated ${added} new cycle${added === 1 ? '' : 's'} (${generated.length - added} duplicate${generated.length - added === 1 ? '' : 's'} skipped).`);
    }

    function renderPaymentCycles() {
        ensurePaymentCycleTemplateDefaults();
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
            const hasBackup = !!appStorage.getItem('paymentCycles_backup');
            restoreBackupBtn.style.display = hasBackup ? 'block' : 'none';
        }

        if (!paymentCyclesList) return;
        paymentCyclesList.innerHTML = '';
        // If paymentCycles array is empty in memory, try to read stored value (in case it wasn't loaded into memory)
        if ((!Array.isArray(paymentCycles) || paymentCycles.length === 0)) {
            try {
                const raw = appStorage.getItem('paymentCycles');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) paymentCycles = parsed;
                }
            } catch (e) {
                // ignore
            }
        }

        renderPaymentCyclesCurrentSummary();

        if (!paymentCyclesEnabled) {
            monthlyEarningsCards.classList.remove('hidden');
            paymentCycleEarningsCards.classList.add('hidden');
            setPaymentCyclesListExpanded(false, 0);
            return;
        }

        if (!Array.isArray(paymentCycles) || paymentCycles.length === 0) {
            paymentCyclesList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500 dark:text-gray-400">No cycles configured.</td></tr>`;
            setPaymentCyclesListExpanded(false, 0);
            monthlyEarningsCards.classList.add('hidden');
            paymentCycleEarningsCards.classList.remove('hidden');
            return;
        }
        
        const sortedCycles = [...paymentCycles].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setPaymentCyclesListExpanded(paymentCyclesListExpanded, sortedCycles.length);

        sortedCycles.forEach((cycle, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
            const originalIndex = paymentCycles.findIndex(c => c.startDate === cycle.startDate && c.endDate === cycle.endDate);
            
            const startDisplay = new Date(cycle.startDate).toLocaleDateString(DISPLAY_LOCALE);
            const endDisplay = new Date(cycle.endDate).toLocaleDateString(DISPLAY_LOCALE);
            const payDisplay = new Date(cycle.payDate).toLocaleDateString(DISPLAY_LOCALE);

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

        monthlyEarningsCards.classList.add('hidden');
        paymentCycleEarningsCards.classList.remove('hidden');
    }

    function addPaymentCycle() {
        isEditingCycle = false;
        document.getElementById('edit-cycle-modal-title').textContent = 'Add Payment Cycle';
        openEditCycleModal();
    }

    // Restore payment cycles from backup (v1.0.9)
    function restorePaymentCyclesFromBackup() {
        const backup = appStorage.getItem('paymentCycles_backup');
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
                        appStorage.setItem('paymentCycles', JSON.stringify(paymentCycles));
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

    function getOrCreateToastStack() {
        let stack = document.getElementById('app-toast-stack');
        if (stack) return stack;
        stack = document.createElement('div');
        stack.id = 'app-toast-stack';
        stack.className = 'app-toast-stack';
        stack.setAttribute('aria-live', 'polite');
        stack.setAttribute('aria-atomic', 'false');
        document.body.appendChild(stack);
        return stack;
    }

    function inferToastVariant(message) {
        const msg = String(message || '').toLowerCase();
        if (msg.includes('error') || msg.includes('invalid') || msg.includes('could not') || msg.includes('failed')) return 'error';
        if (msg.includes('warning') || msg.includes('enable') || msg.includes('missing')) return 'warning';
        if (msg.includes('saved') || msg.includes('completed') || msg.includes('imported') || msg.includes('restored') || msg.includes('generated') || msg.includes('started') || msg.includes('resumed') || msg.includes('reached') || msg.includes('unlocked')) return 'success';
        return 'info';
    }

    function showToast(message, options = {}) {
        const text = String(message ?? '').trim();
        if (!text) return;

        const stack = getOrCreateToastStack();
        const variant = ['success', 'error', 'warning', 'info'].includes(options.variant)
            ? options.variant
            : inferToastVariant(text);
        const durationMs = Number.isFinite(options.durationMs) ? Math.max(1200, options.durationMs) : 3200;
        const iconByVariant = {
            success: 'fa-check-circle',
            error: 'fa-triangle-exclamation',
            warning: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `app-toast app-toast-${variant}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <span class="app-toast-icon"><i class="fas ${iconByVariant[variant] || iconByVariant.info}"></i></span>
            <span class="app-toast-message"></span>
            <button type="button" class="app-toast-close" aria-label="Dismiss notification">&times;</button>
        `;
        const messageEl = toast.querySelector('.app-toast-message');
        if (messageEl) messageEl.textContent = text;

        const closeToast = () => {
            if (!toast.parentNode || toast.dataset.closing === '1') return;
            toast.dataset.closing = '1';
            if (toast._closeTimer) clearTimeout(toast._closeTimer);
            toast.classList.remove('is-visible');
            toast.classList.add('is-exiting');
            window.setTimeout(() => {
                toast.remove();
                if (!stack.childElementCount) stack.remove();
            }, 220);
        };

        const closeBtn = toast.querySelector('.app-toast-close');
        if (closeBtn) closeBtn.addEventListener('click', closeToast);

        stack.prepend(toast);
        while (stack.childElementCount > 4) {
            const oldest = stack.lastElementChild;
            if (!oldest) break;
            oldest.remove();
        }

        requestAnimationFrame(() => toast.classList.add('is-visible'));
        toast._closeTimer = window.setTimeout(closeToast, durationMs);
    }

    // Feedback Modal Functions
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedbackModalBtn = document.getElementById('close-feedback-modal');
    const cancelFeedbackBtn = document.getElementById('cancel-feedback');
    const feedbackForm = document.getElementById('feedback-form');
    const contactUsBtn = document.getElementById('contact-us-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportModalBtn = document.getElementById('close-support-modal');
    const cancelSupportModalBtn = document.getElementById('cancel-support-modal');
    const supportDonateBtn = document.getElementById('support-donate-btn');
    const supportKofiBtn = document.getElementById('support-kofi-btn');
    const supportModalPaypalBtn = document.getElementById('support-modal-paypal-btn');
    const supportModalKofiBtn = document.getElementById('support-modal-kofi-btn');
    const onboardingModal = document.getElementById('onboarding-modal');
    const closeOnboardingModalBtn = document.getElementById('close-onboarding-modal');
    const onboardingDontShowToggle = document.getElementById('onboarding-dont-show-toggle');
    const onboardingQuickStartBtn = document.getElementById('onboarding-quick-start-btn');
    const onboardingCustomizeFirstBtn = document.getElementById('onboarding-customize-first-btn');
    const onboardingSkipBtn = document.getElementById('onboarding-skip-btn');
    const onboardingCues = document.getElementById('onboarding-cues');
    const cueAddRateCard = document.getElementById('cue-add-rate');
    const cueStartCallCard = document.getElementById('cue-start-call');
    const cueOpenSettingsCard = document.getElementById('cue-open-settings');
    const cueAddRateBtn = document.getElementById('cue-add-rate-btn');
    const cueStartCallBtn = document.getElementById('cue-start-call-btn');
    const cueOpenSettingsBtn = document.getElementById('cue-open-settings-btn');
    const onboardingProgressText = document.getElementById('onboarding-progress-text');
    const onboardingStepRate = document.getElementById('onboarding-step-rate');
    const onboardingStepCall = document.getElementById('onboarding-step-call');
    const onboardingStepSettings = document.getElementById('onboarding-step-settings');
    const restartOnboardingBtn = document.getElementById('restart-onboarding-btn');
    const ONBOARDING_STATE_KEY = 'wtt_onboarding_state_v1';
    const ratesCard = document.getElementById('rates-card');
    let onboardingHighlightTimer = null;

    function openFeedbackModal() {
        ModalManager.open(feedbackModal, { focusSelector: '#feedback-name' });
    }

    function closeFeedbackModal() {
        ModalManager.close(feedbackModal);
        feedbackForm.reset();
    }

    const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=3YPGH7MTRMFTJ';
    const KOFI_SUPPORT_URL = 'https://ko-fi.com/C1C718BOD';
    const FOOTER_COLLAPSIBLE_MOBILE_MEDIA_QUERY = '(max-width: 768px)';
    let footerCollapsibleIsMobile = null;

    function isFooterInMobileViewport() {
        return window.matchMedia(FOOTER_COLLAPSIBLE_MOBILE_MEDIA_QUERY).matches;
    }

    function setFooterPanelExpanded(panelEl, expanded) {
        if (!panelEl) return;
        panelEl.classList.toggle('is-open', !!expanded);
        const toggleBtn = panelEl.querySelector('.app-footer-collapsible-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
    }

    function syncFooterCollapsiblePanelsForViewport() {
        if (!footerCollapsiblePanels.length) return;
        const isMobile = isFooterInMobileViewport();
        if (footerCollapsibleIsMobile === isMobile) return;
        footerCollapsibleIsMobile = isMobile;

        footerCollapsiblePanels.forEach((panelEl) => {
            setFooterPanelExpanded(panelEl, !isMobile);
        });
    }

    function initializeFooterCollapsiblePanels() {
        if (!footerCollapsiblePanels.length) return;
        footerCollapsiblePanels.forEach((panelEl) => {
            const toggleBtn = panelEl.querySelector('.app-footer-collapsible-toggle');
            if (!toggleBtn) return;
            toggleBtn.addEventListener('click', () => {
                if (!isFooterInMobileViewport()) return;
                const isOpen = panelEl.classList.contains('is-open');
                setFooterPanelExpanded(panelEl, !isOpen);
            });
        });

        syncFooterCollapsiblePanelsForViewport();
        window.addEventListener('resize', syncFooterCollapsiblePanelsForViewport, { passive: true });
    }

    function openSupportModal() {
        ModalManager.open(supportModal, { focusSelector: '#support-modal-paypal-btn' });
    }

    function closeSupportModal() {
        ModalManager.close(supportModal);
    }

    async function openSupportDestination(url) {
        await openExternalUrl(url);
        closeSupportModal();
    }

    function createDefaultOnboardingState() {
        return {
            seen: false,
            dismissAll: false,
            dismissed: { rate: false, call: false, settings: false },
            completed: { rate: false, call: false, settings: false }
        };
    }

    function loadOnboardingState() {
        try {
            const parsed = JSON.parse(appStorage.getItem(ONBOARDING_STATE_KEY) || '{}');
            const dismissed = parsed?.dismissed && typeof parsed.dismissed === 'object' ? parsed.dismissed : {};
            const completed = parsed?.completed && typeof parsed.completed === 'object' ? parsed.completed : {};
            return {
                seen: !!parsed.seen,
                dismissAll: !!parsed.dismissAll,
                dismissed: {
                    rate: !!dismissed.rate,
                    call: !!dismissed.call,
                    settings: !!dismissed.settings
                },
                completed: {
                    rate: !!completed.rate,
                    call: !!completed.call,
                    settings: !!completed.settings
                }
            };
        } catch (e) {
            return createDefaultOnboardingState();
        }
    }

    function saveOnboardingState(state) {
        try {
            appStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save onboarding state', e);
        }
    }

    function closeOnboardingModal() {
        if (!onboardingModal) return;
        ModalManager.close(onboardingModal);
    }

    function getOnboardingCompletionState() {
        const state = loadOnboardingState();
        return {
            rate: rates.length > 0 || !!state.completed?.rate,
            call: calls.length > 0 || !!state.completed?.call,
            settings: !!state.completed?.settings
        };
    }

    function updateOnboardingProgressUI() {
        const completion = getOnboardingCompletionState();
        const doneCount = [completion.rate, completion.call, completion.settings].filter(Boolean).length;

        if (onboardingProgressText) onboardingProgressText.textContent = `Progress: ${doneCount}/3`;
        if (onboardingStepRate) onboardingStepRate.classList.toggle('done', completion.rate);
        if (onboardingStepCall) onboardingStepCall.classList.toggle('done', completion.call);
        if (onboardingStepSettings) onboardingStepSettings.classList.toggle('done', completion.settings);
    }

    function highlightOnboardingTarget(targetEl) {
        if (!targetEl) return;
        if (onboardingHighlightTimer) clearTimeout(onboardingHighlightTimer);
        targetEl.classList.remove('onboarding-highlight-target');
        requestAnimationFrame(() => {
            targetEl.classList.add('onboarding-highlight-target');
            onboardingHighlightTimer = setTimeout(() => {
                targetEl.classList.remove('onboarding-highlight-target');
            }, 1800);
        });
    }

    function runQuickStartFlow() {
        if (rates.length === 0) {
            ratesCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showRateAddBtn?.click();
            highlightOnboardingTarget(ratesCard || showRateAddBtn);
            return;
        }
        if (calls.length === 0) {
            callControlsCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            highlightOnboardingTarget(callControlsCard || startCallBtn);
            highlightOnboardingTarget(startCallBtn);
            return;
        }
        openSettingsModal(settingsToggleBtn);
    }

    function updateOnboardingCues() {
        if (!onboardingCues) return;
        const state = loadOnboardingState();
        const completion = getOnboardingCompletionState();
        updateOnboardingProgressUI();
        if (state.dismissAll || !state.seen) {
            onboardingCues.style.display = 'none';
            return;
        }

        const showRateCue = !completion.rate && !state.dismissed.rate;
        const showCallCue = completion.rate && !completion.call && !state.dismissed.call;
        const showSettingsCue = completion.rate && completion.call && !completion.settings && !state.dismissed.settings;
        const activeCue = showRateCue ? 'rate' : (showCallCue ? 'call' : (showSettingsCue ? 'settings' : 'none'));

        if (cueAddRateCard) {
            cueAddRateCard.style.display = activeCue === 'rate' ? '' : 'none';
        }
        if (cueStartCallCard) {
            cueStartCallCard.style.display = activeCue === 'call' ? '' : 'none';
        }
        if (cueOpenSettingsCard) {
            cueOpenSettingsCard.style.display = activeCue === 'settings' ? '' : 'none';
        }

        onboardingCues.style.display = activeCue !== 'none' ? '' : 'none';
    }

    function markOnboardingCueDismissed(key) {
        const state = loadOnboardingState();
        state.dismissed[key] = true;
        state.seen = true;
        saveOnboardingState(state);
        updateOnboardingCues();
    }

    function markOnboardingStepComplete(key) {
        const state = loadOnboardingState();
        if (!state.completed || typeof state.completed !== 'object') {
            state.completed = { rate: false, call: false, settings: false };
        }
        state.completed[key] = true;
        saveOnboardingState(state);
        updateOnboardingCues();
    }

    function resetOnboardingFlow() {
        const state = createDefaultOnboardingState();
        saveOnboardingState(state);
        if (onboardingDontShowToggle) onboardingDontShowToggle.checked = false;
        updateOnboardingProgressUI();
        updateOnboardingCues();
        closePaymentCyclesSettingsModal();
        closeFloatingControlsSettingsModal();
        closeDataHubModal();
        closeSettingsModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(() => {
            openOnboardingModalIfNeeded(true);
        }, 180);
    }

    function openOnboardingModalIfNeeded(force = false) {
        if (!onboardingModal) return;
        const state = loadOnboardingState();
        const hasExistingData = rates.length > 0 || calls.length > 0;
        updateOnboardingProgressUI();
        if (!force && (state.seen || state.dismissAll || hasExistingData)) {
            updateOnboardingCues();
            return;
        }
        ModalManager.open(onboardingModal, { focusSelector: '#onboarding-quick-start-btn' });
    }

    if (contactUsBtn) {
        contactUsBtn.addEventListener('click', openFeedbackModal);
    }
    if (supportDonateBtn) {
        supportDonateBtn.addEventListener('click', openSupportModal);
    }
    if (supportKofiBtn) {
        supportKofiBtn.addEventListener('click', openSupportModal);
    }
    initializeFooterCollapsiblePanels();
    if (footerOpenSettingsBtn) {
        footerOpenSettingsBtn.addEventListener('click', () => {
            openSettingsModal(footerOpenSettingsBtn);
        });
    }
    if (achievementsToggleBtn) {
        achievementsToggleBtn.addEventListener('click', (e) => openAchievementsSettingsModal(e.currentTarget));
    }
    if (closeCsvImportPreviewModalBtn) {
        closeCsvImportPreviewModalBtn.addEventListener('click', closeCsvImportPreviewModal);
    }
    if (cancelCsvImportPreviewBtn) {
        cancelCsvImportPreviewBtn.addEventListener('click', closeCsvImportPreviewModal);
    }
    if (confirmCsvImportBtn) {
        confirmCsvImportBtn.addEventListener('click', confirmCsvImport);
    }
    if (csvImportRateSelect) {
        csvImportRateSelect.addEventListener('change', renderCsvImportPreview);
    }
    if (csvImportOverrideRateToggle) {
        csvImportOverrideRateToggle.addEventListener('change', renderCsvImportPreview);
    }
    [csvImportDateColumnSelect, csvImportStartColumnSelect, csvImportEndColumnSelect, csvImportDurationColumnSelect, csvImportRateColumnSelect]
        .filter(Boolean)
        .forEach((selectEl) => {
            selectEl.addEventListener('change', renderCsvImportPreview);
        });
    [
        { button: csvFilterAllBtn, filter: 'all' },
        { button: csvFilterReadyBtn, filter: 'ready' },
        { button: csvFilterDuplicateBtn, filter: 'duplicate' },
        { button: csvFilterInvalidBtn, filter: 'invalid' }
    ].forEach(({ button, filter }) => {
        if (!button) return;
        button.addEventListener('click', () => setCsvImportFilter(filter));
    });

    if (closeFeedbackModalBtn) {
        closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
    }

    if (cancelFeedbackBtn) {
        cancelFeedbackBtn.addEventListener('click', closeFeedbackModal);
    }
    if (closeSupportModalBtn) {
        closeSupportModalBtn.addEventListener('click', closeSupportModal);
    }
    if (cancelSupportModalBtn) {
        cancelSupportModalBtn.addEventListener('click', closeSupportModal);
    }
    if (supportModalPaypalBtn) {
        supportModalPaypalBtn.addEventListener('click', async () => {
            await openSupportDestination(PAYPAL_DONATE_URL);
        });
    }
    if (supportModalKofiBtn) {
        supportModalKofiBtn.addEventListener('click', async () => {
            await openSupportDestination(KOFI_SUPPORT_URL);
        });
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
        applyAppShellMode();
        ModalManager.setupGlobalKeyboard();
        setupHeatmapTooltipGlobalBindings();
        window.WTTModalQA = {
            report: getModalQaSnapshot
        };
        ModalManager.register(callModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#call-date' });
        ModalManager.register(settingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#feature-notes-toggle' });
        ModalManager.register(dataHubModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#data-hub-export-json-btn' });
        ModalManager.register(editCycleModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#cycle-start-date-input' });
        ModalManager.register(feedbackModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#feedback-name' });
        ModalManager.register(supportModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#support-modal-paypal-btn' });
        ModalManager.register(changelogModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#close-changelog-modal' });
        ModalManager.register(exportOptionsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#confirm-export-options-btn' });
        ModalManager.register(csvImportPreviewModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#confirm-csv-import-btn' });
        ModalManager.register(achievementsSettingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#done-achievements-settings-btn' });
        ModalManager.register(achievementDetailModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#done-achievement-detail-btn' });
        ModalManager.register(floatingControlsSettingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#floating-controls-size-mode' });
        ModalManager.register(paymentCyclesSettingsModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#show-add-cycle-btn' });
        ModalManager.register(confirmationModal, { dismissOnOverlay: false, escClosable: true, focusSelector: '#confirmation-confirm-btn' });
        ModalManager.register(recoveryModal, { dismissOnOverlay: false, escClosable: true, focusSelector: '#recovery-resume-btn' });
        ModalManager.register(onboardingModal, { dismissOnOverlay: true, escClosable: true, focusSelector: '#onboarding-quick-start-btn' });

        if (closeOnboardingModalBtn) {
            closeOnboardingModalBtn.addEventListener('click', () => {
                const state = loadOnboardingState();
                state.seen = true;
                state.dismissAll = !!onboardingDontShowToggle?.checked;
                saveOnboardingState(state);
                closeOnboardingModal();
                updateOnboardingCues();
            });
        }
        if (onboardingSkipBtn) {
            onboardingSkipBtn.addEventListener('click', () => {
                const state = loadOnboardingState();
                state.seen = true;
                state.dismissAll = !!onboardingDontShowToggle?.checked;
                saveOnboardingState(state);
                closeOnboardingModal();
                updateOnboardingCues();
            });
        }
        if (onboardingQuickStartBtn) {
            onboardingQuickStartBtn.addEventListener('click', () => {
                const state = loadOnboardingState();
                state.seen = true;
                state.dismissAll = !!onboardingDontShowToggle?.checked;
                saveOnboardingState(state);
                closeOnboardingModal();
                updateOnboardingCues();
                runQuickStartFlow();
                showToast('Quick start: follow the next guided step.');
            });
        }
        if (onboardingCustomizeFirstBtn) {
            onboardingCustomizeFirstBtn.addEventListener('click', () => {
                const state = loadOnboardingState();
                state.seen = true;
                state.dismissAll = !!onboardingDontShowToggle?.checked;
                saveOnboardingState(state);
                closeOnboardingModal();
                openSettingsModal(onboardingCustomizeFirstBtn);
            });
        }

        document.querySelectorAll('[data-cue-dismiss]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = String(btn.getAttribute('data-cue-dismiss') || '').trim();
                if (!key) return;
                markOnboardingCueDismissed(key);
            });
        });
        if (cueAddRateBtn) {
            cueAddRateBtn.addEventListener('click', () => {
                ratesCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showRateAddBtn?.click();
                highlightOnboardingTarget(ratesCard || showRateAddBtn);
                markOnboardingCueDismissed('rate');
            });
        }
        if (cueStartCallBtn) {
            cueStartCallBtn.addEventListener('click', () => {
                callControlsCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightOnboardingTarget(callControlsCard || startCallBtn);
                highlightOnboardingTarget(startCallBtn);
                markOnboardingCueDismissed('call');
            });
        }
        if (cueOpenSettingsBtn) {
            cueOpenSettingsBtn.addEventListener('click', () => {
                highlightOnboardingTarget(settingsToggleBtn);
                openSettingsModal(cueOpenSettingsBtn);
                markOnboardingCueDismissed('settings');
            });
        }
        if (restartOnboardingBtn) {
            restartOnboardingBtn.addEventListener('click', () => {
                showConfirmation(
                    'Restart Onboarding',
                    'This will reopen the first-time guide and reset onboarding progress to 0/3.',
                    'Restart',
                    () => {
                        resetOnboardingFlow();
                        showToast('Onboarding restarted.');
                    },
                    {
                        icon: 'fa-rotate-left',
                        iconColor: 'text-indigo-500',
                        tone: 'primary',
                        loadingText: 'Restarting onboarding...',
                        successText: 'Onboarding restarted.'
                    }
                );
            });
        }

        startCallBtn.addEventListener('click', startLiveCall);
        endCallBtn.addEventListener('click', endLiveCall);
        if (workstripStartCallBtn) {
            workstripStartCallBtn.addEventListener('click', () => {
                runWithViewportLock(startLiveCall);
            });
        }
        if (workstripEndCallBtn) {
            workstripEndCallBtn.addEventListener('click', () => {
                runWithViewportLock(endLiveCall);
            });
        }
        if (workstripAddCallBtn) {
            workstripAddCallBtn.addEventListener('click', () => {
                addCallBtn?.click();
            });
        }
        if (postCallUndoBtn) {
            postCallUndoBtn.addEventListener('click', undoPostCallReviewEntry);
        }
        if (postCallEditBtn) {
            postCallEditBtn.addEventListener('click', () => {
                const targetId = postCallReviewState?.callId;
                if (!targetId) {
                    editLatestCallEntry(postCallEditBtn);
                    return;
                }
                calls = readCallsFromStorage();
                const found = calls.some((call) => call.id === targetId);
                if (!found) {
                    showToast('That call is no longer available to edit.', { variant: 'warning' });
                    hidePostCallReview(true);
                    return;
                }
                editCall(targetId);
                hidePostCallReview(true);
                openCallModal(postCallEditBtn);
            });
        }
        if (postCallDismissBtn) {
            postCallDismissBtn.addEventListener('click', () => hidePostCallReview(true));
        }
        document.addEventListener('keydown', handleGlobalProductivityShortcuts);
        document.addEventListener('pointerdown', markUserActivity, true);
        document.addEventListener('focusin', markUserActivity, true);
        document.addEventListener('keydown', markUserActivity, true);
        window.addEventListener('focus', markUserActivity);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) markUserActivity();
        });
        if (sessionStartBtn) {
            sessionStartBtn.addEventListener('click', startWorkSession);
        }
        if (sessionPauseBtn) {
            sessionPauseBtn.addEventListener('click', toggleWorkSessionPause);
        }
        if (sessionEndBtn) {
            sessionEndBtn.addEventListener('click', endWorkSession);
        }
        if (sessionHistoryClearBtn) {
            sessionHistoryClearBtn.addEventListener('click', () => {
                if (!Array.isArray(sessionHistoryEntries) || sessionHistoryEntries.length === 0) return;
                showConfirmation(
                    'Clear Session History',
                    'This will remove all completed session entries.',
                    'Clear',
                    () => {
                        clearSessionHistoryState();
                        renderSessionHistory();
                        showToast('Session history cleared.');
                    },
                    {
                        loadingText: 'Clearing session history...',
                        successText: 'Session history cleared.'
                    }
                );
            });
        }
        if (liveCallMinusSecondBtn) {
            liveCallMinusSecondBtn.addEventListener('click', () => adjustLiveCallElapsedByMs(-1000));
        }
        if (liveCallPlusSecondBtn) {
            liveCallPlusSecondBtn.addEventListener('click', () => adjustLiveCallElapsedByMs(1000));
        }
        if (floatingMinusSecondBtn) {
            floatingMinusSecondBtn.addEventListener('click', () => adjustLiveCallElapsedByMs(-1000));
        }
        if (floatingPlusSecondBtn) {
            floatingPlusSecondBtn.addEventListener('click', () => adjustLiveCallElapsedByMs(1000));
        }
        if (floatingStartCallBtn) {
            floatingStartCallBtn.addEventListener('click', () => {
                runWithViewportLock(startLiveCall);
            });
        }
        if (floatingEndCallBtn) {
            floatingEndCallBtn.addEventListener('click', () => {
                runWithViewportLock(endLiveCall);
            });
        }
        if (floatingDockDragHandle) {
            floatingDockDragHandle.addEventListener('pointerdown', startFloatingDockDrag);
        }
        window.addEventListener('pointermove', handleFloatingDockPointerMove);
        window.addEventListener('pointerup', endFloatingDockDrag);
        window.addEventListener('pointercancel', endFloatingDockDrag);
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

        const handleCallLogActionClick = (e) => {
            const menuBtn = e.target.closest('.call-log-actions-menu-btn');
            if (menuBtn) {
                e.preventDefault();
                e.stopPropagation();
                toggleCallLogActionsMenu(menuBtn);
                return;
            }
            const editBtn = e.target.closest('.edit-call-btn');
            if (editBtn) {
                closeCallLogActionsMenu(true);
                const callId = String(editBtn.dataset.callId || '');
                if (callId) {
                    editCall(callId);
                    openCallModal(editBtn);
                }
                return;
            }
            const deleteBtn = e.target.closest('.delete-call-btn');
            if (deleteBtn) {
                closeCallLogActionsMenu(true);
                const callId = String(deleteBtn.dataset.callId || '');
                if (callId) deleteCall(callId);
            }
        };

        if (callLogTableBody) {
            callLogTableBody.addEventListener('click', handleCallLogActionClick);
        }

        if (callLogMobileList) {
            callLogMobileList.addEventListener('click', handleCallLogActionClick);
        }

        document.addEventListener('click', (event) => {
            if (!openCallLogActionsMenu) return;
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            if (target.closest('.call-log-actions-wrap')) return;
            closeCallLogActionsMenu(true);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (!openCallLogActionsMenu) return;
            closeCallLogActionsMenu(true);
        });

        if (callLogSortableHeaders.length) {
            callLogSortableHeaders.forEach((headerEl) => {
                headerEl.addEventListener('click', () => {
                    const sortKey = headerEl.getAttribute('data-sort-key');
                    if (sortKey) setCallLogSort(sortKey);
                });
            });
            updateCallLogSortUi();
        }

        if (callLogScrollContainer) {
            callLogScrollContainer.addEventListener('scroll', () => {
                const state = callLogRenderState;
                if (!state || state.done) return;
                const nearBottom = callLogScrollContainer.scrollTop + callLogScrollContainer.clientHeight >= (callLogScrollContainer.scrollHeight - CALL_LOG_RENDER_AHEAD_PX);
                if (nearBottom) renderNextCallLogChunk();
            }, { passive: true });
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
        if (callDateInput) callDateInput.value = getTodayDateString();

        document.getElementById('modal-title').innerHTML =
            `<i class="fas fa-plus text-blue-500 mr-2"></i>Add Call`;

        openCallModal(addCallBtn);
});

// X button (close)
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeCallModal();
        });

// Cancel button (close)
        cancelCallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeCallModal();
        });

// Save button (no page refresh; handleCallFormSubmit handles persistence)
        callForm.addEventListener('submit', handleCallFormSubmit);

        // Restore saved textarea heights for notes (persist across refreshes)
        try {
            const savedHeightLive = appStorage.getItem('liveCallNotesHeight');
            if (savedHeightLive && liveCallNotesInput) {
                liveCallNotesInput.style.height = savedHeightLive;
            } else if (liveCallNotesInput) {
                liveCallNotesInput.style.height = '112px';
            }

            const savedHeightModal = appStorage.getItem('callNotesHeight');
            if (savedHeightModal && callNotesInput) {
                callNotesInput.style.height = savedHeightModal;
            } else if (callNotesInput) {
                callNotesInput.style.height = '88px';
            }

            // Use ResizeObserver when available to detect manual resize and persist
            if (window.ResizeObserver) {
                const ro = new ResizeObserver(entries => {
                    for (const entry of entries) {
                        if (!entry.target) continue;
                        const el = entry.target;
                        try {
                            if (el.id === 'live-call-notes') appStorage.setItem('liveCallNotesHeight', el.style.height || (el.clientHeight + 'px'));
                            if (el.id === 'call-notes') appStorage.setItem('callNotesHeight', el.style.height || (el.clientHeight + 'px'));
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
                    try { appStorage.setItem('liveCallNotesHeight', liveCallNotesInput.style.height || (liveCallNotesInput.clientHeight + 'px')); } catch {}
                });
                if (callNotesInput) callNotesInput.addEventListener('blur', () => {
                    try { appStorage.setItem('callNotesHeight', callNotesInput.style.height || (callNotesInput.clientHeight + 'px')); } catch {}
                });
            }
        } catch (e) {
            // ignore textarea height restoration
        }

        // Apply feature flags to show/hide optional UI
        featureFlags = loadFeatureFlags();
            floatingDockManualPosition = loadFloatingDockManualPosition();
            migrateLegacyRpgCallEligibility();
            // set toggle states in settings modal if present
            if (featureNotesToggle) featureNotesToggle.checked = !!featureFlags.notes;
            if (featurePaymentCyclesToggle) featurePaymentCyclesToggle.checked = !!featureFlags.paymentCycles;
            if (featureFloatingControlsToggle) featureFloatingControlsToggle.checked = !!featureFlags.floatingCallControls;
            if (featureRpgToggle) featureRpgToggle.checked = !!featureFlags.rpg;
            if (floatingShowActiveCardToggle) floatingShowActiveCardToggle.checked = !!featureFlags.floatingShowActiveCard;
            if (floatingActiveShowTimerToggle) floatingActiveShowTimerToggle.checked = !!featureFlags.floatingActiveShowTimer;
            if (floatingActiveShowEarningsToggle) floatingActiveShowEarningsToggle.checked = !!featureFlags.floatingActiveShowEarnings;
            if (floatingActiveShowRateToggle) floatingActiveShowRateToggle.checked = !!featureFlags.floatingActiveShowRate;
            if (floatingActiveShowAdjustToggle) floatingActiveShowAdjustToggle.checked = !!featureFlags.floatingActiveShowAdjust;
            if (floatingOneHandedToggle) floatingOneHandedToggle.checked = !!featureFlags.floatingOneHanded;
            if (floatingSecondaryActionSelect) floatingSecondaryActionSelect.value = featureFlags.floatingSecondaryAction || 'add';
            if (floatingPreviewEnabledToggle) floatingPreviewEnabledToggle.checked = ENABLE_FLOATING_PREVIEW_TESTING && !!featureFlags.floatingPreviewEnabled;
            // apply the flags immediately
            applyFeatureFlags(featureFlags);
            queueWorkstripSync();

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
                            const stored = JSON.parse(appStorage.getItem('paymentCycles'));
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

            if (featureRpgToggle) {
                featureRpgToggle.addEventListener('change', (e) => {
                    featureFlags.rpg = !!e.target.checked;
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
            if (viewAllPaymentCyclesBtn) {
                viewAllPaymentCyclesBtn.addEventListener('click', (e) => openPaymentCyclesManagerFromDashboard(e.currentTarget));
            }
            if (paymentCyclesToggleAllBtn) {
                paymentCyclesToggleAllBtn.addEventListener('click', () => {
                    if (!Array.isArray(paymentCycles) || paymentCycles.length === 0) return;
                    setPaymentCyclesListExpanded(!paymentCyclesListExpanded, paymentCycles.length);
                });
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
            if (closeAchievementsSettingsModalBtn) {
                closeAchievementsSettingsModalBtn.addEventListener('click', closeAchievementsSettingsModal);
            }
            if (doneAchievementsSettingsBtn) {
                doneAchievementsSettingsBtn.addEventListener('click', closeAchievementsSettingsModal);
            }
            if (closeAchievementDetailModalBtn) {
                closeAchievementDetailModalBtn.addEventListener('click', closeAchievementDetailModal);
            }
            if (doneAchievementDetailBtn) {
                doneAchievementDetailBtn.addEventListener('click', closeAchievementDetailModal);
            }
            if (achievementsGrid) {
                achievementsGrid.addEventListener('click', (e) => {
                    const target = e.target?.closest?.('[data-achievement-id]');
                    if (!target) return;
                    const achievementId = target.getAttribute('data-achievement-id');
                    if (!achievementId) return;
                    openAchievementDetailModal(achievementId, target);
                });
            }
            if (rpgUseShieldBtn) {
                rpgUseShieldBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    applyStreakShieldForToday();
                });
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
                    floatingDockManualPosition = null;
                    saveFloatingDockManualPosition(null);
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
            if (floatingActiveShowAdjustToggle) {
                floatingActiveShowAdjustToggle.addEventListener('change', (e) => {
                    featureFlags.floatingActiveShowAdjust = !!e.target.checked;
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
            flushPendingStorageWrites();
            if (liveCallStart) {
                saveActiveCallState(true);
                markActiveCallClosedExplicitly();
                e.preventDefault();
                e.returnValue = '';
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                if (liveCallStart) {
                    saveActiveCallState(true);
                    flushPendingStorageWrites();
                }
                return;
            }
            if (liveCallStart && !readActiveCallState()) {
                saveActiveCallState(true);
            }
            scheduleAndroidWidgetBridgeRefresh(120);
            scheduleAndroidWidgetBridgeRefresh(1200);
        });

        // v1.0.5: Recover unfinished live call (if any)
        (function handleActiveCallRecovery() {
  const state = readActiveCallState();
  if (!state) return;

  const elapsed = Math.max(0, Date.now() - state.start);

  recoveryRateName.textContent = state.rateName || '(unknown)';
  recoveryElapsed.textContent = msToHMS(elapsed);
    if (typeof recoveryNotes !== 'undefined' && recoveryNotes) recoveryNotes.value = '';

  if (!readActiveCallClosedExplicitly() && autoRestoreRecoveredActiveCall(state)) {
    scheduleFloatingControlsRefresh();
    return;
  }

  ModalManager.open(recoveryModal, { focusSelector: '#recovery-resume-btn' });
  scheduleFloatingControlsRefresh();

  recoveryResumeBtn.onclick = () => {
        if (autoRestoreRecoveredActiveCall(state)) {
            closeRecoveryModal();
            scheduleFloatingControlsRefresh();
            return;
        }
        showToast('Could not restore the active call automatically.');
  };

  recoverySummarizeBtn.onclick = () => {
    summarizeRecoveredActiveCall(state);
    closeRecoveryModal();
    scheduleFloatingControlsRefresh();
  };

  recoveryDiscardBtn.onclick = () => {
    discardRecoveredActiveCall();
    closeRecoveryModal();
    scheduleFloatingControlsRefresh();
  };
})();

        function syncTimesFromMinutes() {
  const minsMs = minutesToMs(callDurationInput.value);
  if (!Number.isFinite(minsMs) || !minsMs) return;

  const callDate = parseDateInput(callDateInput?.value || '') || parseDateInput(getTodayDateString());
  const start = combineCallDateAndTime(callDate, callStartTimeInput.value);
  const end = combineCallDateAndTime(callDate, callEndTimeInput.value);

  if (start && !end) {
    const computedEnd = new Date(start.getTime() + minsMs);
    callEndTimeInput.value = formatLocalTimeForInput(computedEnd.toISOString());
  } else if (!start && end) {
    const computedStart = new Date(end.getTime() - minsMs);
    callStartTimeInput.value = formatLocalTimeForInput(computedStart.toISOString());
  }
}

function syncCallDateFromDateTime() {
  if (!callDateInput || callDateInput.value) return;
  if (String(callStartTimeInput.value || '').trim() || String(callEndTimeInput.value || '').trim()) {
    callDateInput.value = getTodayDateString();
  }
}

callDurationInput.addEventListener('input', syncTimesFromMinutes);
callStartTimeInput.addEventListener('input', syncTimesFromMinutes);
callEndTimeInput.addEventListener('input', syncTimesFromMinutes);
callStartTimeInput.addEventListener('input', syncCallDateFromDateTime);
callEndTimeInput.addEventListener('input', syncCallDateFromDateTime);
        
        showAddCycleBtn.addEventListener('click', addPaymentCycle);
        if (generatePaymentCyclesBtn) {
            generatePaymentCyclesBtn.addEventListener('click', handleGeneratePaymentCyclesFromTemplate);
        }
        const restoreBackupBtn = document.getElementById('restore-backup-cycles-btn');
        if (restoreBackupBtn) {
            restoreBackupBtn.addEventListener('click', restorePaymentCyclesFromBackup);
        }
        closeEditCycleModalBtn.addEventListener('click', closeEditCycleModal);
        cancelEditCycleBtn.addEventListener('click', closeEditCycleModal);
        editCycleForm.addEventListener('submit', handleEditCycleFormSubmit);

        function applyTheme(theme) {
            const isDark = theme === 'dark';
            document.documentElement.classList.toggle('dark', isDark);
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            appStorage.setItem('theme', isDark ? 'dark' : 'light');
            scheduleDesktopOverlayRefresh();
            if (darkToggleBtn) {
                darkToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
                darkToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            }
        }

        darkToggleBtn.addEventListener('click', () => {
            const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
        const savedTheme = appStorage.getItem('theme');
        const initialTheme = (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches))
            ? 'dark'
            : 'light';
        applyTheme(initialTheme);

        rateSelect.addEventListener('change', () => {
            saveLastSelectedRate();
            scheduleDesktopOverlayRefresh();
        });
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
        if (patternsModeHourlyBtn) {
            patternsModeHourlyBtn.addEventListener('click', () => setPatternsMode('hourly'));
        }
        if (trendModeWeeklyBtn) {
            trendModeWeeklyBtn.addEventListener('click', () => setPatternsMode('weekly'));
        }
        if (trendModeMonthlyBtn) {
            trendModeMonthlyBtn.addEventListener('click', () => setPatternsMode('monthly'));
        }
        if (rpgBreakdownToggleBtn) {
            rpgBreakdownToggleBtn.addEventListener('click', () => {
                rpgXpBreakdownExpanded = !rpgXpBreakdownExpanded;
                queueStorageWrite('rpgXpBreakdownExpanded', rpgXpBreakdownExpanded ? '1' : '0');
                applyRpgBreakdownVisibility();
            });
        }
        if (trendPrevBtn) {
            trendPrevBtn.addEventListener('click', () => shiftTrendWindow(-1));
        }
        if (trendNextBtn) {
            trendNextBtn.addEventListener('click', () => {
                if (trendNextBtn.disabled) return;
                shiftTrendWindow(1);
            });
        }
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

        if (openDataHubBtn) {
            openDataHubBtn.addEventListener('click', openDataHubModal);
        }
        if (closeDataHubModalBtn) {
            closeDataHubModalBtn.addEventListener('click', closeDataHubModal);
        }
        if (doneDataHubBtn) {
            doneDataHubBtn.addEventListener('click', closeDataHubModal);
        }
        if (dataHubExportJsonBtn) {
            dataHubExportJsonBtn.addEventListener('click', () => openExportOptionsModal('json'));
        }
        if (dataHubExportCsvBtn) {
            dataHubExportCsvBtn.addEventListener('click', exportCallLogCsv);
        }
        if (dataHubImportJsonBtn) {
            dataHubImportJsonBtn.addEventListener('click', () => openImportFilePicker('json'));
        }
        if (dataHubImportCsvBtn) {
            dataHubImportCsvBtn.addEventListener('click', () => openImportFilePicker('csv'));
        }
        [exportScopeAllInput, exportScopeCurrentInput, exportScopeDateInput, exportScopeRangeInput].filter(Boolean).forEach((inputEl) => {
            inputEl.addEventListener('change', refreshExportOptionsModalState);
        });
        [exportSpecificDateInput, exportRangeStartInput, exportRangeEndInput].filter(Boolean).forEach((inputEl) => {
            inputEl.addEventListener('input', refreshExportOptionsModalState);
        });
        [exportFieldDate, exportFieldStart, exportFieldEnd, exportFieldDuration, exportFieldRateName, exportFieldRateAmount, exportFieldEarnings]
            .filter(Boolean)
            .forEach((inputEl) => {
                inputEl.addEventListener('change', refreshExportOptionsModalState);
            });
        if (confirmExportOptionsBtn) {
            confirmExportOptionsBtn.addEventListener('click', confirmExportOptions);
        }
        if (closeExportOptionsModalBtn) {
            closeExportOptionsModalBtn.addEventListener('click', closeExportOptionsModal);
        }
        if (cancelExportOptionsBtn) {
            cancelExportOptionsBtn.addEventListener('click', closeExportOptionsModal);
        }
        
        if (activeCallSummarizeBtn) {
            activeCallSummarizeBtn.addEventListener('click', () => summarizeRecoveredActiveCall());
        }
        if (activeCallDiscardBtn) {
            activeCallDiscardBtn.addEventListener('click', () => discardRecoveredActiveCall());
        }

        importFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = String(event.target.result || '');
                await processImportedText(file.name || '', text);
            };
            reader.readAsText(file);
        });

        if (csvImportRequireRateToggle) {
            csvImportRequireRateToggle.addEventListener('change', renderCsvImportPreview);
        }
        if (csvSelectReadyBtn) {
            csvSelectReadyBtn.addEventListener('click', () => {
                if (!pendingCsvImport?.previewRows) return;
                pendingCsvImport.selectedRows = new Set(
                    pendingCsvImport.previewRows
                        .filter((row) => row.status === 'ready')
                        .map((row) => row.rowNumber)
                );
                pendingCsvImport.selectionMode = 'custom';
                renderCsvImportPreview();
            });
        }
        if (csvClearSelectedBtn) {
            csvClearSelectedBtn.addEventListener('click', () => {
                if (!pendingCsvImport) return;
                pendingCsvImport.selectedRows = new Set();
                pendingCsvImport.selectionMode = 'custom';
                renderCsvImportPreview();
            });
        }
        if (csvImportPreviewBody) {
            csvImportPreviewBody.addEventListener('change', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement) || !target.classList.contains('csv-row-select') || !pendingCsvImport) return;
                const rowNumber = Number(target.dataset.rowNumber);
                if (!Number.isInteger(rowNumber)) return;
                const next = new Set(pendingCsvImport.selectedRows || []);
                if (target.checked) next.add(rowNumber); else next.delete(rowNumber);
                pendingCsvImport.selectedRows = next;
                pendingCsvImport.selectionMode = 'custom';
                renderCsvImportPreview();
            });
        }

        resetCallsBtn.addEventListener('click', () => {
            showConfirmation(
                'Reset Calls',
                'This will permanently delete all call history. Rates and settings will be kept.',
                'Erase',
                () => {
                calls = [];
                clearAchievementState();
                clearDailyQuestState();
                clearRpgProgressState();
                clearSessionRpgStatsState();
                clearSessionHistoryState();
                saveCalls();
                renderSessionHistory();
                renderAchievementsModal();
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
                appStorage.clear();
                calls = [];
                rates = [];
                dailyGoal = { amount: 0, minutes: 0 };
                paymentCyclesEnabled = false;
                paymentCycles = [];
                sessionTrackerState = getSessionDefaultState();
                clearSessionRpgStatsState();
                clearSessionHistoryState();
                saveRates();
                saveCalls();
                saveDailyGoal();
                savePaymentCycles();
                saveSessionTrackerState();
                clearSessionTrackerTimer();
                renderSessionTracker();
                renderSessionHistory();
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
        if (openUpdateReleaseBtn) {
            openUpdateReleaseBtn.addEventListener('click', async () => {
                const targetUrl = pendingUpdateManifest?.releaseUrl || pendingUpdateManifest?.downloadsUrl;
                if (targetUrl) await openExternalUrl(targetUrl);
            });
        }
        if (laterUpdateBannerBtn) {
            laterUpdateBannerBtn.addEventListener('click', () => {
                dismissUpdateAvailableBannerForVersion(pendingUpdateManifest?.latestVersion);
            });
        }
        if (dismissUpdateBannerBtn) {
            dismissUpdateBannerBtn.addEventListener('click', () => {
                dismissUpdateAvailableBannerForVersion(pendingUpdateManifest?.latestVersion);
            });
        }
        displayRates();
        populateRateSelects();
        applyRpgBreakdownVisibility();
        populateTimeZones();
        updateLocalTime();
        displayCalls();
        syncDailyGoalInputs();
        updateStatistics();
        renderSessionTracker();
        renderSessionHistory();
        ensureSessionTrackerTimer();
        evaluateAchievements({ notify: false });
        updateStorageInfo();
        renderPaymentCycles();
        updateOnboardingCues();
        openOnboardingModalIfNeeded();
        setupFloatingVisibilityObservers();
        scheduleAndroidWidgetBridgeRefresh(150);
        scheduleAndroidWidgetBridgeRefresh(1800);
        if (isAndroidCapacitorApp() && !androidWidgetBridgeTimerId) {
            androidWidgetBridgeTimerId = window.setInterval(() => {
                if (document.visibilityState === 'hidden') return;
                void initializeAndroidWidgetBridge();
            }, 10000);
        }
        registerGoatCounterDebugApi();
        setupGoatCounterAnalytics();
        void checkForInstalledAppUpdates();
        scheduleReleaseSpotlightBanner();
        setInterval(updateLocalTime, 1000);
        window.addEventListener('scroll', () => {
            flushPendingLiveCallInfoVisibilityIfVisible();
            scheduleFloatingControlsRefresh();
        }, { passive: true });
        window.addEventListener('resize', () => {
            scheduleAppShellRefresh();
            flushPendingLiveCallInfoVisibilityIfVisible();
            scheduleModalLayoutRefresh();
            scheduleFloatingControlsRefresh();
            scheduleDetailPanelsReflow();
            clampFloatingDockPositionToViewport();
            scheduleDesktopOverlayRefresh();
        });
        window.addEventListener('orientationchange', () => {
            scheduleAppShellRefresh();
            flushPendingLiveCallInfoVisibilityIfVisible();
            clampFloatingDockPositionToViewport();
            scheduleFloatingControlsRefresh();
        });
        window.visualViewport?.addEventListener('resize', scheduleAppShellRefresh);

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
        if (callLogSearchInput) {
            callLogSearchInput.addEventListener('input', (e) => {
                const nextValue = String(e?.target?.value || '');
                if (callLogSearchDebounceTimer) clearTimeout(callLogSearchDebounceTimer);
                callLogSearchDebounceTimer = setTimeout(() => {
                    setCallLogSearchQuery(nextValue);
                }, 140);
            });
        }
        if (callLogRateFilterSelect) {
            callLogRateFilterSelect.addEventListener('change', (e) => {
                const nextValue = String(e?.target?.value || '');
                setCallLogRateFilter(nextValue);
            });
        }
        if (callLogResetViewBtn) {
            callLogResetViewBtn.addEventListener('click', () => {
                resetCallLogView();
            });
        }
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



