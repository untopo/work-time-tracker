# Work Time Tracker

![Version](https://img.shields.io/badge/version-1.1.80-blue)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)
![Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow)

A lightweight, privacy-first time tracker for interpreters and freelancers.

Track live calls, earnings, rates, goals, achievements, and payment cycles directly in your browser.

## Table of Contents
- [Live Demo](#live-demo)
- [Who This Is For](#who-this-is-for)
- [Key Workflows](#key-workflows)
- [Screenshots](#screenshots)
- [Core Features](#core-features)
- [Data \& Privacy](#data--privacy)
- [Security Notes](#security-notes)
- [Backup \& Restore](#backup--restore)
- [Desktop App Prep](#desktop-app-prep)
- [Mobile App Prep](#mobile-app-prep)
- [Limitations](#limitations)
- [Browser Support](#browser-support)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Release Notes](#release-notes)
- [Feedback](#feedback)
- [Credits](#credits)

## Live Demo
- https://untopo.github.io/work-time-tracker/

## Who This Is For
- Interpreters who bill by call duration.
- Freelancers tracking time-based income without spreadsheets.
- Users who prefer a fast, local-only tool with no account setup.

## Key Workflows
1. Select a rate and start a live call.
2. End the call and automatically save duration + earnings.
3. Add manual calls with flexible date, time, and duration inputs when needed.
4. Review totals in stats, achievements, and call log filters.
5. Export backups or import JSON / CSV call logs from Settings.

## Screenshots
### Dashboard Top
![Dashboard Top Screenshot](assets/images/dashboard-top.png)

### Dashboard Stats
![Dashboard Stats Screenshot](assets/images/dashboard-stats.png)

### Data Hub
![Data Hub Screenshot](assets/images/data-hub.png)

### CSV Import Preview
![CSV Import Preview Screenshot](assets/images/csv-import-preview.png)

### Achievements
![Achievements Screenshot](assets/images/achievements.png)

## Core Features
- Live call timer with real-time earnings
- Manual call entry + call editing
- Flexible Add Call modal with separate `Call Date`, `Start Time`, `End Time`, and `Duration`
- Duration input supports minutes (`15`) or time formats like `00:15:30`
- Multiple billing rates
- Call filters: Today / Week / Month / Custom date
- Daily goal tracking (USD and minutes sync)
- Monthly stats + optional payment cycle tracking
- Achievements system with milestone tracking
- Optional RPG Mode with XP, levels, and daily quests
- CSV call log import with preview, dedupe, and rate assignment
- Call Log CSV export for spreadsheet-friendly records
- Export scope selector for all history, current filtered view, a specific date, or a custom range
- Minimal Data Hub that separates backups from Call Log CSV actions
- Automatic restore of active live calls when reopening the app
- Safe backup merge import that preserves existing local data
- Dark mode / light mode toggle
- Floating call controls (optional)
- Optional volatile notes (never persisted/exported)
- Built-in changelog modal
- Mobile-friendly Call Log cards on narrow screens

## Data & Privacy
- 100% local `localStorage`
- No accounts
- No tracking
- No analytics
- No backend
- No automatic cloud sync
- Notes are volatile by design

## Security Notes
- Data stays in your browser only.
- If browser storage is cleared, your data is permanently removed.
- Use export backups if your tracking data is important.

## Backup & Restore
- Open Data Hub: `Settings -> Data Management -> Open Data Hub`
- Export Backup JSON: `Settings -> Data Management -> Open Data Hub -> Export Backup JSON`
- Export Call Log CSV: `Settings -> Data Management -> Open Data Hub -> Export Call Log CSV`
- Import backup / CSV: `Settings -> Data Management -> Open Data Hub -> Import Backup JSON / Import Call Log CSV`
- Reset calls only: `Settings -> Data Management -> Reset Calls Only`
- Full reset: `Settings -> Data Management -> Reset All Data`

### Import Behavior
- JSON backups are merged into your current local data instead of replacing it.
- CSV imports are reviewed before saving.
- CSV preview supports filters for `Ready`, `Duplicates`, and `Invalid` rows.
- Exact duplicate calls are skipped automatically during CSV and backup merges.
- CSV preview lets you map columns for:
  - `Call Date`
  - `Start Time`
  - `End Time`
  - `Duration`
  - `Rate` (optional)
- If a CSV has no usable rate column, you can apply a rate before confirming the import.

### Export Behavior
- Both export actions now let you choose the call scope before downloading:
  - `All History`
  - `Current Call Log View`
  - `Specific Date`
  - `Custom Range`
- `Export Backup JSON` still includes rates, goals, and payment cycle settings.
- `Export Call Log CSV` exports just the selected call rows in spreadsheet format.
- CSV export also lets you choose which columns to include.

## Desktop App Prep
The project is now scaffolded to support a future Tauri desktop build from the same codebase used by GitHub Pages.

Current setup:
- Web version still runs directly from the project root
- Desktop packaging uses a generated `dist/` folder
- Tauri config lives in `src-tauri/`
- App persistence now goes through a shared storage adapter so the same frontend can target browser storage today and Tauri-native storage later
- Tauri builds now mirror app storage to a native JSON snapshot file in the app data directory while keeping the browser flow unchanged
- Tauri desktop builds now use native open/save dialogs for JSON backup import/export and CSV import/export while the browser version keeps its current download/upload flow
Important:
- Existing GitHub Pages users keep using the same browser `localStorage` keys as before, so this refactor does not wipe or rename their saved data
- The browser version and the future desktop app will not automatically share the same `localStorage`
- To move data between them safely, use `Export Backup JSON` from one side and `Import Backup JSON` on the other

What you need to install on Windows:
- Rust / Cargo
- Microsoft Visual Studio Build Tools with:
  - MSVC
  - Windows 10/11 SDK
  - Desktop development with C++

Project commands:
```bash
npm run build:web
npm run tauri:dev
npm run tauri:build
```

Notes:
- `npm run build:web` prepares the static `dist/` folder used by Tauri
- `npm run tauri:dev` launches the desktop app against the same frontend
- `npm run tauri:build` creates the installable desktop bundle once the Windows build tools are installed

## Mobile App Prep
The same repository now also includes the first Capacitor-based mobile scaffold so web, desktop, and future mobile builds can keep sharing one frontend.

Current setup:
- Capacitor config lives in `capacitor.config.json`
- Android scaffold lives in `android/`
- Mobile sync still uses the generated `dist/` frontend output
- Narrow screens now use a dedicated card-based `Call Log` layout instead of relying only on the desktop table view
- Phone-sized inputs now use safer sizing to reduce browser zoom and touch friction

Project commands:
```bash
npm run build:web
npm run cap:sync
npm run cap:sync:android
npm run cap:open:android
```

Notes:
- `npm run cap:sync` refreshes Capacitor platforms from the current shared web app
- `npm run cap:sync:android` updates the Android project specifically
- `npm run cap:open:android` opens the Android project in Android Studio once your Android toolchain is installed
- The Android scaffold is a prep step, not a published mobile release yet

## Limitations
- No multi-device sync (single browser profile only).
- No cloud recovery.
- localStorage capacity depends on browser/device limits.
- Clearing site data or using private/incognito sessions may remove data.

## Browser Support
Tested and recommended on latest:
- Chrome
- Edge
- Firefox

Safari generally works, but always verify export/import behavior on your environment.

## Quick Start
```bash
git clone https://github.com/untopo/work-time-tracker.git
```
Open `index.html` in your browser.

No build step required.

## Tech Stack
- Vanilla JavaScript (ES6)
- HTML + CSS
- GitHub Pages compatible
- Feature flags for progressive rollout

## Project Structure
```text
/
|-- index.html
|-- package.json
|-- capacitor.config.json
|-- scripts/
|   |-- prepare-dist.mjs
|   `-- tauri-win.mjs
|-- android/
|-- src-tauri/
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- js/
|   |   |-- app.js
|   |   `-- storage.js
|   `-- images/
|-- README.md
`-- .nojekyll
```

## Contributing
1. Fork and create a branch.
2. Keep changes focused and small.
3. Preserve user data behavior and modal UX consistency.
4. Open a PR with:
- What changed
- Why it changed
- Manual test notes (especially for settings/modals)

## FAQ
### Where is my data stored?
In your browser `localStorage` for this site.

### Are notes saved?
No. Notes are volatile and intentionally not persisted/exported.

### Can I sync data across devices?
Not currently. Use JSON export/import manually.

### Can I import a company call history CSV?
Yes. The app can import CSV files when they include the same core fields used by the Call Log:
- `Call Date`
- `Start Time`
- `End Time`
- `Duration`
- `Rate` (optional)

Before importing, the app shows a preview so you can:
- confirm detected rows
- map columns manually if needed
- assign a rate to imported calls
- skip accidental duplicates automatically

### Why did my data disappear?
Most likely browser/site storage was cleared or a private session ended.

### How do I back up safely?
Export JSON regularly from `Settings -> Data Management -> Open Data Hub`.

## Release Notes
- Current Version: `v1.1.80`
- Full history is available in-app via the footer version button (`What's New` modal).

### Highlights in `v1.1.80`

- Hotfix: restored the missing `beginLiveCallWithRate(...)` path so `Start Call` works again across web, desktop, and mobile builds
- Android: the APK version now follows the real project version instead of staying stuck at `1.0`
- Mobile: simplified the footer support section on narrow screens and removed the over-aggressive body touch rule that was contributing to scroll friction

### Highlights in `v1.1.79`

- Hotfix: removed the remaining desktop-overlay settings references and replaced leftover overlay refresh calls with a harmless no-op so initialization can no longer fail after the overlay cleanup
- Restored normal startup for both GitHub Pages and the desktop app without requiring any removed overlay globals

### Highlights in `v1.1.78`

- Hotfix: removed the last broken desktop-overlay settings listener that was still throwing `openDesktopOverlaySettingsBtn is not defined` during initialization
- Restored normal startup for both the web app and the desktop app after the overlay removal cleanup

### Highlights in `v1.1.77`
- Removed the experimental desktop overlay controls after repeated reliability issues so the desktop app stays simpler and more dependable
- Desktop closing now exits the app fully instead of lingering in the background during reinstalls or updates
- Cleaned desktop packaging by removing overlay-specific windows, assets, and native commands

### Highlights in 1.1.75
- Reduced scroll-linked work on mobile by removing app-shell refreshes from isualViewport scroll events
- Moved Floating Call Controls visibility tracking toward IntersectionObserver updates instead of repeated viewport geometry checks during every touch scroll
- Kept the floating dock behavior aligned with the original Call Controls while reducing layout work during mobile scrolling

### Highlights in `v1.1.74`
- Fixed the desktop overlay so it inherits the same selected rate as the main window by default instead of getting stuck on `Select Rate`
- Added a dedicated draggable title bar plus tiny hide/disable buttons so the overlay can be moved reliably and dismissed without reopening Settings
- Regenerated desktop and Android app icons from the new shared high-quality icon source

### Highlights in `v1.1.73`
- Added real native persistence for the desktop overlay position so it now reopens where you last dragged it
- Saved overlay move events in the Tauri app data directory and restored them on the next app launch

### Highlights in `v1.1.72`
- Reworked the desktop always-on-top overlay so it matches the internal floating call controls more closely with a compact active-card layout and one primary circular action
- Removed filler overlay copy and extra secondary buttons so the desktop mini-window only shows the current call state and the main action
- Stopped re-docking the desktop overlay every time it is shown, so you can drag it to another part of the screen and keep using it there during the session

### Highlights in `v1.1.71`
- Prevented horizontal sideways scrolling on mobile by hardening the app shell and main card containers against viewport overflow
- Changed mobile Floating Call Controls so they stay expanded and only hide when the original Call Controls section is actually visible
- Increased the Android adaptive launcher icon foreground size so the installed app icon fills the launcher tile better

### Highlights in `v1.1.70`
- Added an optional desktop always-on-top overlay window that keeps Start/End Call, live timer, and earnings visible outside the main app window
- Routed overlay actions back into the main Tauri window so the mini control can start calls, end calls, add calls, or reopen the app
- Added a dedicated overlay frontend and desktop build support for the Tauri API runtime required by the new multi-window desktop flow

### Highlights in `v1.1.69`
- Added a more app-like mobile shell for installed/standalone usage with safe-area-aware spacing, sticky top actions, and viewport-height syncing
- Unified Android launcher icons with the same shared icon source used by the desktop build
- Improved Android keyboard resize behavior so forms and modals feel less like a cramped browser view

### Highlights in `v1.1.68`
- Fixed floating call controls on mobile so they now depend on real `Call Controls` visibility instead of disappearing incorrectly when scrolling upward
- Added Android APK output as a release asset so the mobile preview can be downloaded directly from GitHub Releases

### Highlights in `v1.1.63`
- Removed the enforced minimum Tauri window size so the desktop app can be resized down more like the responsive browser version

### Highlights in `v1.1.62`
- Added a Tauri native storage bridge that mirrors desktop app data to a JSON snapshot file through Rust commands
- Kept GitHub Pages/browser users on the same existing `localStorage` keys and behavior while preparing the project for deeper desktop persistence later

### Highlights in `v1.1.61`
- Added a shared storage adapter so the app no longer depends directly on raw browser `localStorage` calls
- Preserved existing browser storage keys so GitHub Pages users keep their current saved data while the codebase moves toward future Tauri-native persistence

### Highlights in `v1.1.60`
- Active live calls now restore automatically when reopening the app
- Added a recovered-call banner with quick `Summarize` and `Discard` actions

### Highlights in `v1.1.59`
- Added an inline `?` help tooltip in `CSV Fields` to explain when exporting fewer or more columns makes sense

### Highlights in `v1.1.58`
- Added inline `?` help tooltips in Export Options to clarify `Current Call Log View` vs `Custom Range`

### Highlights in `v1.1.57`
- Added inline `?` help tooltips in Data Hub to explain Backups vs Call Log CSV without adding more visual noise

### Highlights in `v1.1.56`
- Fixed additional light-mode modal bleed-through in onboarding, changelog, confirmation, payment cycle, recovery, and data import/export panels
- Removed the RPG `Level Table` entry-point to simplify the progression UI
- Restarting onboarding now closes Settings first and reopens the guide cleanly from the main page

### Highlights in `v1.1.55`
- Fixed transparent bleed-through in the Achievements modal on light mode
- Unified Achievement detail modal panel styling across light and dark modes

### Highlights in `v1.1.54`
- Fixed Tailwind theme config ordering for more reliable light/dark switching
- Improved theme application with explicit `data-theme` and `color-scheme` updates

### Highlights in `v1.1.53`
- Fixed mixed light/dark styling caused by inconsistent theme sources
- Fixed theme toggle icon/state mismatches
- Applied saved theme earlier during page load for cleaner visual transitions

### Highlights in `v1.1.52`
- Polished dashboard card styling for a more consistent main layout
- Refreshed roadmap into `Core`, `Later`, and `Maybe Never`
- Kept focus on stabilization and data integrity before larger feature growth

### Highlights in `v1.1.51`
- Added a minimal `Data Hub` to separate backups from Call Log CSV tools
- Added `Custom Range` and field selection for Call Log CSV exports
- Added row selection and an optional `require rate` rule in CSV import preview

### Highlights in `v1.1.50`
- Added an export options modal for `All History`, `Current View`, or `Specific Date`
- Added a Ko-fi support button next to PayPal in the footer
- Unified backup JSON and CSV exports under the same scoped export flow

### Highlights in `v1.1.49`
- Added `Export Call Log CSV` in Settings
- Added `Ready / Duplicates / Invalid` filters in the CSV import preview
- Added a clearer import-complete summary after CSV merges

### Highlights in `v1.1.48`
- Added optional RPG Mode toggle with hidden XP UI when disabled
- Added RPG-only level achievements for levels 10, 20, 30, 40, and 50
- Improved Achievements modal behavior and icon styling
- Improved theme toggle behavior for dark / light mode
- Reworked Add Call modal for date-only, time-only, or duration-only manual entries
- Added safer CSV call log import with preview, manual column mapping, dedupe, and optional rate assignment
- Changed backup import to merge safely with existing local data instead of replacing it

## Feedback
Use the in-app `Contact Us` modal for:
- Bug reports
- Feature requests
- General feedback

Direct contact reference: `worktimetrackertool@gmail.com`

## Credits
Built for interpreters by interpreters.

Made by [Topo](https://www.instagram.com/otpo/)


