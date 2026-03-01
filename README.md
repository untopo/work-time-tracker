# Work Time Tracker

![Version](https://img.shields.io/badge/version-1.1.51-blue)
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
### Dashboard
![Dashboard Screenshot](assets/images/dashboard.png)

### Call Log
![Call Log Screenshot](assets/images/call-log.png)

### What's New
![Changelog Screenshot](assets/images/changelog.png)

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
- Safe backup merge import that preserves existing local data
- Dark mode / light mode toggle
- Floating call controls (optional)
- Optional volatile notes (never persisted/exported)
- Built-in changelog modal

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
- Export Backup JSON: `Settings -> Data Management -> Export Backup JSON`
- Export Call Log CSV: `Settings -> Data Management -> Export Call Log CSV`
- Import backup / CSV: `Settings -> Data Management -> Import Backup / CSV Call Log`
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
-  `Custom Range`
- `Export Backup JSON` still includes rates, goals, and payment cycle settings.
- `Export Call Log CSV` exports just the selected call rows in spreadsheet format.
- CSV export also lets you choose which columns to include.

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
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- js/
|   |   `-- app.js
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
Export JSON regularly from `Settings -> Data Management`.

## Release Notes
- Current Version: `v1.1.51`
- Full history is available in-app via the footer version button (`What's New` modal).

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
