# Changelog

All notable changes to this project are documented here.

For downloadable installers/APKs and release metadata, use:
- https://github.com/untopo/work-time-tracker/releases

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

## Older Versions

For older release history (including pre-v1.2.0), see:
- In-app `What's New`
- GitHub Releases page

