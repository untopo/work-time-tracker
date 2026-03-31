# Work Time Tracker

![Version](https://img.shields.io/badge/version-1.4.0-blue)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)
![Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow)

A local-first call, earnings, and workflow tracker built for interpreters.

Work Time Tracker helps you run live calls, log manual work, track rates and goals, review patterns, manage sessions, and use interpreter support tools without depending on accounts or cloud sync.

## Live Demo
- https://untopo.github.io/work-time-tracker/

## Why It Exists
- Track paid calls and earnings without spreadsheets
- Keep work data local and simple
- Stay fast during live interpreting work
- Combine tracking and support tools in one workspace

## Who It Is For
- Interpreters who bill by duration
- Freelancers tracking time-based income
- Users who want a private tool with no account setup

## Product Areas
### Work
- Start and end live calls
- See real-time timer and earnings
- Manage rates and daily goals
- Run work sessions with pause/resume

### Call Log
- Review saved calls
- Filter by date ranges
- Search and edit entries
- Import/export call history

### Analytics
- Review daily earnings and average call duration
- See hourly, weekly, and monthly patterns
- Track payment-cycle snapshots

### Progress
- View achievements, XP, streaks, and quests
- Keep consistency visible over time

### Resources
- `US ZIP / Address Lookup`
- `Interpreter Language Assistant`

### Settings
- Toggle optional features
- Manage time zone, storage, and backups
- Access data tools and support actions

## Core Features
- Live call timer with real-time earnings
- Manual call entry and editing
- Multiple billing rates
- Daily goal tracking in USD and minutes
- Session tracking with utilization metrics
- Call Log filtering and CSV import/export
- JSON backup export/import
- Payment cycle tracking
- Floating call controls
- Dark/light mode
- In-app changelog
- Responsive layouts for desktop, tablet, and mobile

## Interpreter Support Tools
### US ZIP / Address Lookup
- One-bar search for ZIPs, cities, states, and partial addresses
- Fast suggestions and ranked address matches
- Recent lookups stored locally

### Interpreter Language Assistant
- Multilingual term lookup
- Ranked translation candidates
- Quick meaning support when available
- Related terms and frequent searches

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

## Data and Privacy
- 100% local storage by default
- No accounts
- No tracking
- No analytics
- No backend dependency for the core app
- No automatic cloud sync
- Volatile notes are intentionally not persisted/exported

## Backup and Restore
- Backup and restore live in `Settings -> Data Management`
- `Export Backup JSON` includes app data such as calls, rates, goals, and payment cycles
- `Export Call Log CSV` exports call rows only
- Imports are reviewed before saving
- Exact duplicates are skipped during merge/import flows

## Platforms
### Web
- Runs directly from the project root
- Compatible with GitHub Pages

### Desktop
- Built with Tauri from the same shared frontend
- Uses generated `dist/` output
- Supports native file dialogs for import/export
- Shares release-version syncing with web and Android

### Android
- Built with Capacitor from the same shared frontend
- Uses generated `dist/` output
- Includes responsive mobile/tablet layouts and update awareness

## Quick Start
```bash
git clone https://github.com/untopo/work-time-tracker.git
cd work-time-tracker
```

Open `index.html` directly for the web version, or use the build commands below for packaged targets.

## Build Commands
### Web
```bash
npm run build:web
```

### Desktop
```bash
npm run tauri:dev
npm run tauri:build
```

### Android
```bash
npm run cap:sync
npm run cap:sync:android
npm run cap:open:android
```

To produce a signed Android release, copy `android/keystore.properties.example` to `android/keystore.properties` and fill in your keystore values, or provide the same values through these environment variables:

- `WTT_ANDROID_KEYSTORE_FILE`
- `WTT_ANDROID_KEYSTORE_PASSWORD`
- `WTT_ANDROID_KEY_ALIAS`
- `WTT_ANDROID_KEY_PASSWORD`

Then build from Android Studio or run:

```bash
cd android
gradlew assembleRelease
```

## Tech Stack
- Vanilla JavaScript
- HTML and CSS
- Tauri for desktop packaging
- Capacitor for Android packaging

## Project Structure
```text
/
|-- index.html
|-- package.json
|-- capacitor.config.json
|-- scripts/
|-- android/
|-- src-tauri/
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- js/
|   |   |-- app.js
|   |   |-- resources-data.js
|   |   |-- resources-helpers.js
|   |   |-- settings-manager.js
|   |   |-- storage.js
|   |   |-- update-utils.js
|   |   `-- update-manager.js
|   `-- images/
|-- README.md
`-- .nojekyll
```

## FAQ
### Where is my data stored?
In local app/browser storage for this project.

### Can I sync data across devices?
Not automatically. Use JSON export/import manually.

### What is the Resources section for?
It is an in-app workspace for interpreter support tools that stay available alongside the rest of the app.

### Can I import a company call history CSV?
Yes. The app supports preview, column mapping, dedupe, and optional rate handling before import.

### Why did my data disappear?
Most likely the underlying browser/site/app storage was cleared.

## Limitations
- No automatic multi-device sync
- No cloud recovery
- Local storage capacity depends on the environment
- Clearing site/app storage can remove saved data

## Browser Support
Recommended on current:
- Chrome
- Edge
- Firefox

Safari generally works, but import/export behavior should always be verified in your environment.

## Contributing
1. Fork the repo and create a branch.
2. Keep changes focused.
3. Preserve local-first behavior and data integrity.
4. Include manual test notes in your PR.

## Releases
- Current Version: `v1.4.0`
- In-app history: `What's New` modal
- GitHub Releases: https://github.com/untopo/work-time-tracker/releases
- Full markdown changelog: [`CHANGELOG.md`](CHANGELOG.md)
- Release workflow: [`RELEASE.md`](RELEASE.md)

## Feedback
Use the in-app `Contact Us` modal for:
- bug reports
- feature requests
- general feedback

Direct contact reference: `worktimetrackertool@gmail.com`

## Credits
Built for interpreters by interpreters.

Made by [Topo](https://www.instagram.com/otpo/)
