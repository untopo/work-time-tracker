# Changelog

All notable changes to this project are documented here.

For downloadable installers/APKs and release metadata, use:
- https://github.com/untopo/work-time-tracker/releases

## v1.5.1 - 2026-10-06

### Highlights
- Desktop and Android now include every improvement already live on the web.

### Reliability & Privacy
- Imported rate names are safely escaped before rendering.
- A clear, non-blocking warning appears when saving data locally fails.

### Other
- The support button now points to the updated Ko-fi page.
- Lighter app package after repository cleanup; the project is now under the MIT license.

## v1.5.0 - 2026-04-15

### Highlights
- Session Tracker history now supports adding manual sessions directly from the log.
- Completed sessions can now be edited after the fact, making it easier to correct sessions that ran too long or ended late.
- Individual completed sessions can now be deleted when they should be removed entirely.

### Reliability
- Manual and edited sessions rebuild calls, talk time, idle time, utilization, and earnings automatically from the calls inside the selected time window.

## v1.4.2 - 2026-04-01

### Fixes
- Fixed Call Log date picker initialization so the selector starts with a valid date and responds more reliably when choosing a specific day.
- Improved Call Log date navigation stability across web, desktop, and Android by wiring the picker earlier and handling both input and change events.

## v1.4.1 - 2026-04-01

### Highlights
- Restored the Call Log date picker with previous/next period navigation for day, week, and month views.
- Call Log period navigation now moves in the same unit as the active filter instead of forcing a separate analytics date flow.

### UX Polish
- Contact Us now includes a direct support email so users can reach out without the form if needed.

## v1.4.0 - 2026-03-30

### Highlights
- Added a new Resources workspace with built-in interpreter tools available directly inside the app.
- Introduced a native US ZIP / Address Lookup with one-bar search for ZIP codes, cities, states, and partial addresses.
- Added a native Interpreter Language Assistant for multilingual term lookup, translation candidates, related terms, and quick meaning support.

### Performance
- Faster resource suggestions with caching, smoother loading behavior, and better handling of rapid consecutive searches.
- Stronger ranking for both address and language lookups, with cleaner output and fewer low-value matches.

### UX Polish
- Resources layout now organizes active tools more cleanly, including full-width presentation when only one resource is open.
- Added a Discord community link for interpreters who want to connect, share resources, and support each other.

## v1.3.0 - 2026-03-25

### Highlights
- Major UI refresh across web and desktop with a cleaner app shell, smoother motion, and a more polished workspace flow.
- Reworked the Live Workspace into a denser action hub with integrated call/session controls and compact timer adjustments.
- Upgraded modal behavior with more consistent overlays, improved positioning, and draggable support for larger panels.

### Responsive
- Significantly improved mobile and tablet layouts, including a stronger Settings composition and tablet-specific workstrip tuning.
- Restored sidebar-equivalent mobile and tablet utilities through a dedicated Info & Support section with local time, version, quick actions, social links, theme toggle, and donate access.

### UX Polish
- Redesigned Floating Controls Settings into a more compact customization panel, removed redundant dock-position controls, and added reset actions for layout recovery.

## v1.2.7 - 2026-03-21

### Highlights
- Test release to validate the new in-app updater flow end to end.
- Synced release metadata and in-app version surfaces to `v1.2.7` across web, desktop, and Android packaging.
- Kept fallback behavior to the GitHub release page when direct in-app update install is unavailable.

## v1.2.6 - 2026-03-21

### Highlights
- Added in-app updater flow for Windows desktop (Tauri): the update banner now downloads and launches the installer directly without leaving the app.
- Added in-app updater flow for Android app shell: the update banner now downloads the APK and opens the Android installer directly.
- Added safe fallback behavior to open the release URL when in-app installation cannot proceed.

### Platform Integration
- Desktop: introduced native command for secure release-asset download + installer launch.
- Android: introduced native `InAppUpdater` plugin, installer intent bridge, and provider path updates for APK handoff.

## v1.2.5 - 2026-03-21

### Highlights
- Fixed version alignment so in-app `Current Version` and `What's New` now match the published release version across web, desktop, and Android.
- Kept the Patterns detail modal feature set (hourly/weekly/monthly drill-down + left/right navigation + header spacing polish).

### Reliability
- Added a release guard in the build pipeline that blocks packaging when version values are out of sync across:
  - `package.json`
  - `version.json`
  - `src-tauri/tauri.conf.json`
  - `src-tauri/Cargo.toml`
  - `assets/js/app.js` (`APP_VERSION` and changelog head entry)

## v1.2.4 - 2026-03-21

### Highlights
- Added detailed drill-down modal for Patterns cells (hourly, weekly, and monthly) with per-slot calls and session context.
- Added in-modal left/right navigation to move between adjacent hours/days without leaving the detail view.
- Heatmap/trend cells now open details directly on click, keeping hover tooltip behavior intact.

### UX Polish
- Refined patterns detail modal header spacing so navigation buttons no longer conflict with the close icon.

### Stability
- General cross-platform polish and release packaging alignment for web, desktop, and Android.

## v1.2.3 - 2026-03-19

### Highlights
- Improved cross-platform typography and text fitting behavior for web, desktop, and Android layouts.
- Strengthened mobile text-wrap and scaling consistency to reduce clipping in constrained cards.
- Kept web/desktop/android packaging aligned under the same release version.

### Stability
- General polish and packaging consistency improvements.

## v1.2.2 - 2026-03-19

### Highlights
- Synced release packaging flow so web, desktop, and Android channels ship from the same code state.
- Moved Session History access next to live status to keep Session Tracker more compact.
- Kept full Session History details in a dedicated modal.

### Stability
- Release pipeline and packaging consistency improvements.

## v1.2.1 - 2026-03-19

### Highlights
- Session Tracker now auto-captures start/end times with one-click Start/End flow.
- Added Session History with per-session timeline, call count, talk time, idle time, utilization, and earnings snapshot.
- Added live in-session call counter.
- Updated statistics comparison language to a more supportive style.
- Floating Controls preview now reflects the `Show +/-1s Buttons` setting.
- Cleaned text encoding/separator issues in key summaries and toasts.

### Stability
- General bug fixes and rendering polish in Session Tracker and statistics flows.

## v1.2.0 - 2026-03-18

### Highlights
- Added Session Tracker with shift Start/Pause/End and live utilization metrics.
- Added post-call action strip (Undo / Quick Edit / Dismiss).
- Added patterns analytics switching (Hourly / Weekly / Monthly).
- Expanded RPG progression with Daily Focus, Weekly Arc, and Streak Shield.
- Upgraded Call Log workflow with search, rate filter, reset controls, and better results summaries.
- Improved Payment Cycle insights and payout context.
- Refined footer/mobile navigation structure.

### Security and Platform Hardening
- Desktop: stricter external URL validation and CSP hardening.
- Android Widget: stronger action validation and safer defaults for local-first data behavior.

### Stability
- General bug fixes and UI consistency improvements.

## v1.1.88 - 2026-03-11

- Floating Dock: You can now drag and position the in-app dock where it fits your workflow best.
- Floating Dock: Added `-1/+1s` quick-adjust buttons for active calls, with consistent sizing across full, compact, and icon dock modes.
- Call Log: Added clickable sorting by key columns so you can reorder entries faster during review.
- Payment Cycles: Added a biweekly template generator so recurring cycle ranges can be created in bulk instead of one-by-one.

## v1.1.87 - 2026-03-03

- UI: Replaced the footer support row with a single Donate button that opens a support modal instead of showing both provider buttons inline.
- Added: New support modal keeps both PayPal and Ko-fi options available while opening the official provider pages externally on web, desktop, and mobile.

## v1.1.86 - 2026-03-03

- UI: Tightened the footer support row again so Donate and Support me on Ko-fi fit side by side more reliably in narrow layouts.
- UI: Reduced support button width, height, and text size evenly so both actions stay visually identical while taking less space.

## v1.1.85 - 2026-03-03

- Fixed: Desktop update banner now opens the GitHub release page in the system browser instead of doing nothing inside the Tauri webview.
- Desktop: Installed builds now use a native Rust command for release links while mobile keeps using the normal browser open flow.

## v1.1.84 - 2026-03-03

- UI: Donate and Support me on Ko-fi now use identical fixed dimensions and stay side by side in the footer instead of wrapping unevenly on narrow screens.
- Polish: Both support buttons were slightly reduced in size so the footer support row feels tighter and more balanced on mobile and desktop.

## v1.1.83 - 2026-03-03

- Added: Desktop and mobile builds now check a lightweight public update manifest and show a non-blocking banner when a newer release is available.
- Added: Update notices can be dismissed per-version so users are reminded only when a truly newer release exists.
- Prep: The shared static build now includes version.json so GitHub Pages, Tauri, and Capacitor can read the same release metadata source.

## v1.1.82 - 2026-03-03

- Mobile: Active calls now auto-restore cleanly after background/minimized states, while explicit close attempts still keep the recovery decision flow available on next launch.
- Mobile: Removed shell overflow rules that were making vertical dashboard scrolling feel sticky or dependent on sideways gestures first.
- Stability: Active-call close intent is now tracked separately from normal background persistence so recovery behavior is less intrusive.

## v1.1.81 - 2026-03-03

- UI: Replaced the embedded Ko-fi widget with a fixed button so support actions stay visually consistent and no external widget stretches the footer.
- Footer: Donate and Support me on Ko-fi now sit side by side with matching pill dimensions.
- Mobile/Desktop: Unified the support button layout instead of switching between separate Ko-fi desktop/mobile treatments.

## v1.1.80 - 2026-03-03

- Hotfix: Restored the missing `beginLiveCallWithRate(...)` path so Start Call works again in web, desktop, and mobile builds.
- Android: The APK now reads its visible version from `package.json` instead of staying stuck at `1.0`.
- Mobile: Simplified the footer support area on small screens and removed the over-aggressive body `touch-action` rule to reduce scroll friction and horizontal overflow.

## v1.1.79 - 2026-03-03

- Hotfix: Removed the remaining desktop-overlay settings references and replaced the leftover overlay refresh calls with a harmless no-op so initialization can no longer fail after the overlay removal.
- Web/Desktop: Restored normal startup for GitHub Pages and the Tauri app without requiring any overlay-specific globals.

## v1.1.78 - 2026-03-03

- Hotfix: Removed the last broken desktop-overlay settings listener that was still throwing `openDesktopOverlaySettingsBtn is not defined` during app initialization.
- Web/Desktop: Restored normal startup so GitHub Pages and the Tauri app can boot again after the overlay removal cleanup.

## v1.1.77 - 2026-03-03

- Desktop: Removed the experimental always-on-top overlay controls after repeated reliability issues so the main app returns to a simpler, more dependable desktop experience.
- Desktop: Closing the Tauri main window now exits the app fully instead of leaving a lingering background process during reinstalls or updates.
- Maintenance: Cleaned the codebase and desktop packaging flow by removing overlay-specific windows, assets, and Rust commands.

## v1.1.76 - 2026-03-02

- Desktop: Rebuilt the always-on-top overlay to match the internal floating dock structure more closely, including the same active-call card and action stack instead of a separate mini-panel concept.
- Desktop: Overlay dragging now uses native window position commands so the user can move it freely around the screen instead of depending on the previous drag-region behavior.
- Desktop: The overlay keeps Start/End Call plus Add Call available in the same compact dock style while still supporting hide and disable controls.

## v1.1.75 - 2026-03-02

- Mobile: Reduced scroll-linked work by removing app-shell refreshes from visualViewport scroll events and moving Floating Call Controls visibility tracking toward IntersectionObserver-driven updates.
- Mobile: Floating controls now rely less on repeated viewport geometry checks during normal page scrolling, which should make the installed mobile app feel more responsive on touch scroll.
- Maintenance: Kept the dock visibility behavior aligned with the original Call Controls while reducing unnecessary layout reads on every scroll frame.

## v1.1.74 - 2026-03-02

- Desktop: Fixed the overlay to inherit the same selected rate as the main window by default, so it no longer sits in a useless "Select Rate" state when valid rates already exist.
- Desktop: Added a dedicated draggable title bar plus tiny hide/disable controls so the overlay can be moved reliably and dismissed without reopening Settings.
- Desktop: Start Call from the overlay now forces the rate selection back through the same main-app flow before launching the live call, keeping the mini window and main window in sync.

## v1.1.73 - 2026-03-02

- Desktop: Added real native persistence for the overlay position so the mini window now reopens where you last dragged it instead of only remembering placement during the current session.
- Desktop: Overlay move events are now saved in the Tauri app data directory and restored on the next app launch.
- Maintenance: Kept the desktop overlay flow compatible with the existing multi-window desktop setup without affecting the web or mobile targets.

## v1.1.72 - 2026-03-02

- Desktop: Reworked the global overlay to match the internal floating call controls more closely with a compact active-card layout and a single circular primary action button.
- Desktop: Removed filler overlay text and extra actions so the mini window only shows the information and action that matter for the current call state.
- Desktop: Overlay windows now keep the position where the user drags them during the session instead of snapping back to the bottom-right every time they are shown.

## v1.1.71 - 2026-03-02

- Mobile: Prevented horizontal sideways scrolling by hardening the app shell and card containers against viewport overflow.
- Mobile: Floating Call Controls now stay expanded instead of auto-collapsing into the mini button, and only hide when the original Call Controls are actually visible.
- Android: Increased adaptive launcher foreground size so the installed app icon fills the launcher tile more like a normal native app icon.

## v1.1.70 - 2026-03-02

- Desktop: Added an optional always-on-top overlay window that keeps Start/End Call, live timer, and earnings visible outside the main app window.
- Desktop: Overlay actions now route back to the main Tauri window so you can start calls, end calls, add calls, or reopen the app from the mini control window.
- Prep: Added a dedicated overlay frontend and native desktop window bridge so multi-window desktop features ship without breaking the static web target.

## v1.1.69 - 2026-03-02

- Mobile: Added a more app-like native shell layout with safe-area-aware spacing, sticky action toolbar, and viewport-height syncing for Capacitor/standalone installs.
- Android: Unified launcher icons with the shared desktop icon source so the mobile install now uses the same product mark.
- Android: Added activity resize handling for the on-screen keyboard so forms behave more like a native app instead of a cramped browser view.

## v1.1.68 - 2026-03-02

- Fixed: Floating call controls now stay available whenever the original Call Controls section is genuinely out of view on mobile, regardless of scroll direction.
- Release: Added Android APK output to the public release assets so the mobile preview can be downloaded directly.

## v1.1.67 - 2026-03-02

- Mobile: Added a dedicated card-based Call Log layout for narrow screens so call history no longer depends on a squeezed desktop table.
- Prep: Added Capacitor + Android project scaffolding in the same repository so the app can keep one shared codebase for web, desktop, and future mobile builds.
- Improved: Mobile form inputs and action sizing were tightened further to reduce keyboard zoom and touch friction on phones.

## v1.1.66 - 2026-03-02

- Improved: Quick notes now opens with a larger default textarea size for first-time use on mobile and web.
- Preserved: Notes textarea height persistence still remembers the last manual resize the user left in place.

## v1.1.65 - 2026-03-02

- Mobile: Tightened dashboard and modal spacing so the app fits better on phone-sized screens without feeling cramped.
- Mobile: Improved call log scrolling and modal viewport behavior on small devices to reduce clipped content and awkward overflow.
- Mobile: Floating call controls now prefer compact mode on narrow screens instead of collapsing straight to icon-only so core actions stay easier to use.

## v1.1.64 - 2026-03-02

- Desktop: Added native Tauri file dialogs for JSON backup import/export and CSV import/export while keeping the browser download/upload fallback unchanged.
- Desktop: Added native text-file read/write commands so the installed app can work with user-chosen files more like a real desktop tool.

## v1.1.63 - 2026-03-02

- Desktop: Removed the enforced Tauri minimum window size so the installed app can be resized down more like the responsive browser version.

## v1.1.62 - 2026-03-02

- Added: Tauri desktop builds now mirror app storage to a native JSON snapshot file through Rust commands.
- Prep: Browser users keep their existing localStorage data unchanged while the desktop app gains a native persistence bridge behind the same frontend storage API.

## v1.1.61 - 2026-03-02

- Refactor: Introduced a shared storage adapter so the app no longer depends directly on browser localStorage calls.
- Prep: Preserved existing browser data keys to keep GitHub Pages users compatible while preparing the codebase for future Tauri-native persistence.

## v1.1.60 - 2026-03-02

- Improved: Active live calls now restore automatically when reopening the app instead of forcing recovery as the primary flow.
- Added: Recovered-call banner with quick Summarize and Discard actions for easier cleanup after automatic restore.

## v1.1.59 - 2026-03-01

- Improved: CSV Fields in Export Options now includes an inline help tooltip to explain when exporting fewer or more columns makes sense.

## v1.1.58 - 2026-03-01

- Improved: Export Options now includes inline help tooltips to clarify Current Call Log View vs Custom Range without adding persistent UI clutter.

## v1.1.57 - 2026-03-01

- Improved: Data Hub now includes inline help tooltips to explain Backups vs Call Log CSV more clearly without adding visual clutter.

## v1.1.56 - 2026-03-01

- Fixed: Light-mode modal surfaces are now explicit for onboarding, changelog, confirmation, payment cycle, recovery, and data import/export panels.
- Changed: Removed the RPG level requirements table entry-point to simplify the progression UI.
- Fixed: Restart Onboarding now closes Settings first and reopens the guide cleanly from the main page.

## v1.1.55 - 2026-03-01

- Fixed: Achievements modal now has an explicit solid panel background in light mode instead of showing transparent bleed-through.
- Fixed: Achievement detail modal now shares the same explicit light/dark panel surface styling for visual consistency.

## v1.1.54 - 2026-03-01

- Fixed: Tailwind class-based dark mode config is now applied after the CDN script for more reliable theme switching.
- Improved: Theme application now also updates `data-theme` and `color-scheme` for cleaner browser-level light/dark behavior.

## v1.1.53 - 2026-03-01

- Fixed: Tailwind dark-mode behavior now follows the app theme toggle consistently via class-based dark mode.
- Fixed: Theme icon/state mismatch caused by mixed system-theme and app-theme styling sources.
- Polish: Apply saved theme earlier in the document to reduce mixed-theme flashes on load.

## v1.1.52 - 2026-03-01

- Polish: Unified dashboard surface styling for a cleaner and more consistent main layout.
- Polish: Replaced the header separator with a safer HTML entity to avoid encoding artifacts.
- Docs: Refreshed roadmap to separate core stabilization work from later ideas.

## v1.1.51 - 2026-03-01

- Added: Minimal Data Hub modal that separates backups from Call Log CSV actions.
- Improved: Export flow now supports custom date ranges and selectable CSV fields.
- Improved: CSV import preview now supports row selection and optional rate-required importing.

## v1.1.50 - 2026-03-01

- Added: Export options modal to choose all history, current view, or a specific date before exporting.
- Added: Ko-fi support button alongside PayPal in the footer.
- Improved: Backup JSON and Call Log CSV exports now share the same safer scoped export flow.

## v1.1.49 - 2026-03-01

- Added: Call Log CSV export from Settings for spreadsheet-friendly backups.
- Improved: CSV import preview now supports status filters and clearer row-level review.
- Improved: CSV import completion now summarizes imported, duplicate, and invalid rows before closing.

## v1.1.48 - 2026-02-28

- Added: CSV import preview now supports manual column mapping before merging calls.
- Changed: Backup import now merges into existing local data instead of replacing it.
- Improved: Data Management import action now supports safer call-log CSV workflows without erasing prior history.

## v1.1.47 - 2026-02-28

- Added: Optional RPG progression toggle in Settings.
- Changed: XP is now granted only for calls completed while RPG progression is enabled.
- Changed: Achievements remain available when RPG is off, while XP and multiplier references are hidden.

## v1.1.46 - 2026-02-26

- Added: New all-time achievement "Bounce Back" for returning after a 3+ day break.
- Added: Goal Mastery achievements (7 and 30 goal-hit days) with progress tracking.
- Changed: Removed Achievements shortcut from Settings (trophy button remains the single entry-point).

## v1.1.45 - 2026-02-26

- Added: Daily Quests section with automatic day-based rotation and progress bars.
- Added: Daily quest XP rewards now contribute to unified total XP progression.
- Changed: Rebalanced all-time earnings milestone from $100/day to $100/week for fairer progression.

## v1.1.44 - 2026-02-26

- Changed: Streak multiplier now applies to call XP as well (not only achievement rewards).
- Changed: Achievement XP reward now scales by level only for simpler/fairer understanding.
- Fixed: Achievements modal footer layout so Done button remains inside modal container.

## v1.1.43 - 2026-02-26

- Fixed: Tooltip speech-bubbles no longer clip in stats panel layout.
- Fixed: Achievements modal Done action now sits at the true end of scrollable content (no sticky overlap).

## v1.1.42 - 2026-02-26

- Added: Contextual "?" help tooltips with hover speech-bubble explanations in RPG/Achievements UI.
- Improved: Achievement summary now includes inline explanation for streak reward multiplier logic.

## v1.1.41 - 2026-02-26

- Improved: Added explicit XP-gained popup on call completion (live + manual add).
- Clarified: XP feedback now appears alongside save confirmation to make progression visible every session.

## v1.1.40 - 2026-02-26

- Improved: Achievement cards now show XP earned only after unlock (hidden for locked achievements).
- Improved: Achievement unlock toasts now explicitly include achievement name + XP gained in a single lightweight popup.

## v1.1.39 - 2026-02-26

- Added: One-time XP rewards for achievement unlocks.
- Added: Achievement reward scaling by current level and active streak at unlock time.
- Added: Persistent bonus XP ledger to prevent duplicate reward grants and support fair long-term progression.

## v1.1.38 - 2026-02-26

- Changed: Replaced $150/day achievement with an all-time earnings milestone for fairer long-term progression.

## v1.1.37 - 2026-02-26

- Changed: Removed rate-usage achievements to better match one-rate workflows.
- Changed: Rebalanced high daily earnings milestone from $250/day to $150/day for fairer progression.

## v1.1.36 - 2026-02-26

- Changed: Achievements modal now opens as a standalone modal (not docked with Settings).
- Improved: Trophy quick-access opens Achievements directly without opening Settings first.
- Improved: Settings Achievements button now transitions to standalone Achievements view.

## v1.1.35 - 2026-02-26

- Added: Trophy entry-point and dedicated Achievements modal docked next to Settings.
- Added: Passive badge system with mixed difficulty milestones (calls, streaks, earnings, consistency).
- Added: Live achievement unlock detection with toast notifications and persistent collected badge state.

## v1.1.34 - 2026-02-26

- Added: Work RPG level progress card (Level, total XP, XP left, and progress bar).
- Added: Fair level curve table with per-level XP requirements.
- Added: Level requirements modal for transparent progression planning.

## v1.1.33 - 2026-02-26

- Added: Onboarding progress tracker (0/3 to 3/3) in the welcome modal.
- Added: Step completion now follows real actions (first rate saved, first call saved, settings opened).
- Added: Restart Onboarding action in Settings for quick testing and guided re-runs.

## v1.1.32 - 2026-02-26

- Improved: Onboarding now displays a single next-step cue to keep guidance simple and low-noise.
- Improved: Quick Start now executes a real first action flow (open first setup step + contextual highlight).
- Polish: Added lightweight guided highlights and smoother cue transitions for a more interactive first-use experience.

## v1.1.31 - 2026-02-26

- Improved: Onboarding now shows one prioritized cue at a time for lower visual noise.
- Improved: Quick Start now launches an interactive first step (opens Add Rate and highlights target area).
- Polish: Added smoother onboarding card motion and visual emphasis for guided actions.

## v1.1.30 - 2026-02-26

- Added: First-run Welcome modal with Quick Start, Customize First, and Skip actions.
- Added: Progressive onboarding cue cards for rates, call test flow, and settings customization.
- Added: Dismiss/seen onboarding persistence in localStorage to keep onboarding friction low.

## v1.1.29 - 2026-02-26

- Performance: Added cached call filtering with date-keyed invalidation to reduce repeated list scans.
- Performance: Added progressive chunk rendering for Call Log to prevent large-list UI blocking.
- Performance: Added batched localStorage writes with safe flush-on-unload to reduce main-thread stalls.

## v1.1.28 - 2026-02-26

- Changed: Removed Secure Sync feature and restored Settings to a single General flow.
- Changed: Removed Settings tab segmentation and returned Data Management/Storage to main Settings body.
- Docs: Updated README and roadmap to reflect manual JSON backup/import only.

## v1.1.26 - 2026-02-26

- Added: Modal stack/layer manager with deterministic z-index ordering and front-of-stack resolution.
- Added: Viewport-fit constraints for open modals to reduce clipping on small/short windows.
- Improved: Interaction stability via rapid open/close guards and deduplicated keyboard handling.
- Improved: Accessibility/status feedback (toast live region + confirmation busy/aria-live handling).
- Improved: Floating settings UX consistency (detail entry guard + auto-close when feature disabled).

## v1.1.25 - 2026-02-26

- Fixed: Feature detail panels now open directly next to General Settings using deterministic split geometry.
- Fixed: Floating Controls Settings button now hides when Floating Call Controls feature toggle is off.
- Improved: Split-panel positioning no longer depends on transition-timing-sensitive measurements.

## v1.1.24 - 2026-02-26

- Changed: Removed Notes Settings sub-modal to simplify Settings UX (Notes keeps a single feature toggle).
- Refactor: Cleaned Notes Settings modal/event wiring from split-settings flow.
- Roadmap: Added advanced Notes customization ideas to future backlog.

## v1.1.23 - 2026-02-26

- Fixed: Side settings panels now align vertically with the General Settings panel instead of using a fixed top offset.
- Improved: Detail panel layout now derives left/top/width from the actual General panel geometry for more stable split positioning.
- Improved: Split modal positioning fallback remains safe on small/edge layouts.

## v1.1.22 - 2026-02-26

- Fixed: Side feature modals now anchor to viewport top with max-height so they never open cut off at the bottom.
- Fixed: Side modal content remains scrollable within viewport in split settings mode.
- Improved: Side modal open animation updated to match top-anchored layout without vertical jump.

## v1.1.21 - 2026-02-26

- Polish: Modals now open from the click origin for smoother visual context.
- Polish: Side settings panels are pre-positioned before opening to remove first-open overlap/jump.
- Polish: Unified motion easing/timings for modal and floating-dock interactions to feel less abrupt.

## v1.1.20 - 2026-02-26

- Performance: Reduced UI jitter by scheduling floating-dock/side-panel updates with requestAnimationFrame.
- Performance: Replaced repeated per-row click bindings with delegated handlers for calls/rates/payment cycles.
- Performance: Cached local-time formatters and throttled live-call persistence writes to reduce main-thread pressure.

## v1.1.19 - 2026-02-26

- Fixed: First-open detail panel overlap by switching to deterministic split geometry (no animation-dependent placement).
- Improved: Detail settings now animate from the clicked trigger area for smoother context-aware opening.
- Improved: Split mode now pre-activates before opening detail panels to prevent center-jump behavior.

## v1.1.18 - 2026-02-26

- Fixed: Split-state activation now happens after detail modal opens, so General panel consistently shifts out of center.
- Fixed: Side detail modals no longer apply blur over the General Settings panel.
- Improved: Split-state detection now accepts opening transition state for smoother panel handoff.

## v1.1.17 - 2026-02-26

- Fixed: Settings split-view now uses geometry-based anchoring so detail panel opens exactly to the right of General.
- Improved: Right-panel placement recalculates after open and on resize for stable side-by-side visibility.
- Improved: Split-view class handling now relies on active anchored detail panels for consistency.

## v1.1.16 - 2026-02-26

- Fixed: Split settings now uses strict left/right docking instead of overlap-style positioning.
- Improved: Detail settings panels open adjacent to General Settings with consistent centered vertical alignment.
- Fixed: Side-panel animation now preserves vertical centering while sliding in.

## v1.1.15 - 2026-02-26

- Fixed: Preview in icon mode now mirrors the real dock detail-card behavior (when active fields are enabled).
- Fixed: Removed old preview meta-row rendering so preview matches actual layout exactly.
- Improved: Split-view positioning now anchors detail panels directly to the right of General Settings.

## v1.1.14 - 2026-02-26

- Fixed: In icon mode, real floating dock can now display active-call details (rate/timer/earnings) when enabled.
- Improved: General Settings now shifts left and keeps visible while detail settings open on the right (split-view layout).
- Improved: Split-view spacing and panel sizing to reduce overlap and improve readability.

## v1.1.13 - 2026-02-26

- Fixed: Preview now always shows live-call sample values (rate/timer/earnings) even in icon mode via sample info rows.
- Improved: Floating preview now auto-randomizes while open, no manual click required.
- Improved: Opening feature settings from General now supports smooth split-view (General shifts left, selected panel on right) on large screens.
- Improved: Floating Controls panel open feels faster with deferred preview rendering.

## v1.1.12 - 2026-02-26

- Changed: Removed Floating density preset control to keep customization fully manual.
- Improved: Floating mini preview now randomizes realistic live-call sample data (rate/timer/earnings).
- Improved: Preview alignment and icon-mode button centering for closer visual parity with real dock.
- Improved: Floating settings labels now include clearer helper text for easier understanding.

## v1.1.11 - 2026-02-26

- Fixed: Floating Controls Settings modal now opens above the main Settings modal.
- Improved: Floating Controls Settings layout is more compact and visually refined.
- Improved: Mini preview now renders Idle and On-Call states together with preference-aware detail hints.
- Changed: User-facing text in Settings was standardized to English.

## v1.1.10 - 2026-02-25

- Changed: Data Management + Storage Usage moved to main Settings under Time Zone.
- Fixed: Floating Controls Settings button now opens reliably (even if feature is currently off).
- Improved: Floating dock now scales correctly in compact/icon modes.
- Improved: Floating preview now shows both idle and active-call states with detailed rate/timer/earnings visibility.

## v1.1.9 - 2026-02-25

- Changed: Restored classic always-visible footer on main page (removed footer info floating modal).
- Fixed: Footer content is now permanently visible at page bottom as requested.
- Refactor: Removed temporary footer-modal wiring from settings flow.

## v1.1.8 - 2026-02-24

- Fixed: Restored main-page layout by correcting modal/footer structure boundaries.
- Changed: Footer content moved into centered floating info modal while preserving existing style/content.
- Changed: Settings simplified to General-first flow (no tab segmentation for current scope).
- Added: Per-feature customization entry points from General (Notes, Payment Cycles, Floating).
- Improved: Payment Cycles modal now groups cycles + data management + storage in one dedicated place.

## v1.1.7 - 2026-02-23

- Added: Settings Control Center tabs + quick search for lower-clutter navigation.
- Added: Floating density presets (Minimal, Balanced, Data-rich, Custom).
- Added: Testing-focused mini live preview inside Floating Controls modal (easy to disable/remove independently).
- Improved: Sticky modal header/footer behavior for frictionless split-screen usage.

## v1.1.6 - 2026-02-22

- Improved: Settings modal reorganized into clearer section cards with wider centered layout.
- Fixed: Removed forced auto-scroll to Time Zone that caused jumpy/cluttered behavior in compact windows.
- Improved: Settings and floating-customization modals now use cleaner internal scrolling with sticky action area.

## v1.1.5 - 2026-02-20

- Fixed: Settings modal now supports reliable internal scrolling on constrained/split-screen layouts.
- Added: Floating controls customization moved into a dedicated centered modal for better organization.
- Fixed: Floating mini button no longer inherits icon-mode sizing rules incorrectly (prevents deformed mini state).
- Improved: Floating dock now adapts action density by size mode (icon mode hides secondary/active card automatically).
- Improved: Settings customization section spacing/readability for dense feature controls.

## v1.1.4 - 2026-02-20

- Added: Smart floating dock with contextual primary/secondary actions.
- Added: Auto-hide idle dock with mini-button reactivation animation.
- Added: Mini active-call card with per-field customization (timer/earnings/rate).
- Added: One-handed mode option for larger mobile touch targets.
- Added: Go to Controls secondary action with smooth scroll.
- Improved: Dock overlap-avoidance engine (footer/toasts/focused input) and adaptive split-screen behavior.

## v1.1.3 - 2026-02-20

- Added: Floating controls customization panel in Settings (visible only when feature is enabled).
- Added: Floating controls size modes (Auto, Full, Compact, Icon Only).
- Added: Floating controls side positioning (Left/Right).
- Improved: Auto mode now adapts to split-screen widths and switches to icon-only in ultra-compact windows.

## v1.1.2 - 2026-02-20

- Added: Optional floating Start/End Call controls that appear when Call Controls section is out of view.
- Added: Settings feature toggle for Floating Call Controls.
- Improved: Floating controls follow active call state and hide when modals are open.
- Improved: Floating controls share the same visual style and behavior as primary Start/End buttons.

## v1.1.1 - 2026-02-20

- Added: Confirmation modal optional typed guard (e.g., requires typing RESET for destructive actions).
- Added: Confirmation modal loading/success status states with action lock to prevent accidental double submits.
- Added: Body scroll lock while modals are open for better mobile UX.
- Improved: Confirmation copy clarity and status feedback for keyboard/screen-reader users.
- Docs: Added 1.1.x modal QA checklist and progress updates in roadmap/readme.

## v1.1.0 - 2026-02-20

- Added: ModalManager for consistent open/close behavior across all app modals.
- Added: Focus trap + focus restore for keyboard accessibility in modals.
- Added: Click-outside policy by modal type (non-destructive only).
- Added: ARIA dialog semantics wiring for modal accessibility.
- Added: Severity-based confirmation/alert presentation templates (info/warning/error/danger).
- Added: Confirm-action lock to prevent accidental double submits.
- Added: Consistent modal transition animations and focus-visible states.

## v1.0.11 - 2026-02-20

- Fixed: Add Rate now always opens in clean create mode (no stale edit state).
- Fixed: Cancel/Add flow now clears rate form editingIndex to prevent accidental overwrites.
- Improved: Rate save path now checks explicit edit-mode state before updating existing rates.

## v1.0.10 - 2026-02-20

- Added: Unified in-app modal UX for confirmations and validation/errors (replaces browser alert/confirm in core flows).
- Improved: Add/Edit Call validation now uses internal modal messaging.
- Improved: Import/Reset/Delete actions now use the same confirmation modal style.

## v1.0.9 - 2026-02-19

- Added: Confirmation modal for deleting calls instead of browser confirm().
- Added: ESC key closes any open modal.
- Added: Fallback display when rate no longer exists (shows "Rate removed").
- Added: Privacy notice next to Notes toggle ("never saved or exported").
- Added: Restore Payment Cycles from backup button in Settings.
- Improved: Data integrity when deleting calls with confirmation.

## v1.0.8 - 2026-02-19

- Fix: Initialization ordering and DOM null-checks to prevent startup errors.
- Fix: Preserve and backup Payment Cycles to avoid accidental data loss.
- Fix: Prevent overwriting stored payment cycles with empty arrays.
- Fix: Various syntax and runtime errors found during debugging.
- Privacy: Notes UI is now volatile (not persisted) and removed from exports by default.

## v1.0.7 - 2026-02-19

- Added: Notes UI when starting a live call and in call form (no persistent storage).
- Added: Notes column to Call Log (UI-only).
- Improved: Date filtering ranges now use explicit end bounds.

## v1.0.6 - 2026-02-12

- Added: Previous/Next day arrows next to stats date picker.
- Added: Arrow navigation now switches to Custom Date view automatically.
- Added: Next-day navigation is blocked for future dates.

## v1.0.5 - 2026-02-12

- Fixed: Footer version now always matches APP_VERSION.
- Fixed: Contact form email is now optional (no longer required).
- Chore: Simplified dailyGoal storage to a single source of truth.
- Chore: Added legacy fallback read for old dailyGoal keys.
- Fixed: Call modal can now be closed via X and Cancel (no longer stuck).
- Fixed: Saving a call no longer refreshes the page (form submit prevented).
- Improved: Call edits/additions now update UI instantly without full page reload.
- Improved: Add Call now always opens in clean "Add" mode (resets editing state).

## v1.0.4 - 2026-02-12

- Fixed: Daily Goal now syncs bidirectionally between USD and Minutes.
- Fixed: Daily Goal persistence stores both USD and Minutes correctly.
- Improved: Goal calculation now updates instantly on input change.

## v1.0.3 - 2026-02-11

- Fixed: Call edit form now displays exact stored startTime and endTime.
- Fixed: Call Log displays Start Time and End Time columns.
- Fixed: Daily Goal minutes now correctly calculates and updates equivalent earnings.
- Changed: Duration is now calculated from startTime and endTime instead of manual entry.

## v1.0.2 - 2026-02-11

- Fixed: Call editing now always edits the correct call regardless of filter view.
- Fixed: Edit form no longer creates duplicate calls.
- Added: Unique ID to each call for reliable tracking.
- Added: Version tracking in footer.

## v1.0.1 - 2026-01-15

- Added timezone selector.
- Added Contact Us button.
- Added donate button.
- Performance optimizations.

## v1.0.0 - 2026-01-01

- Initial release.

