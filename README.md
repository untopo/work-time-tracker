# Work Time Tracker

![Version](https://img.shields.io/badge/version-1.7.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Privacy](https://img.shields.io/badge/privacy-local--first-success)
![Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow)

A local-first call, earnings, and workflow tracker built for interpreters.

Run live calls, log manual work, track rates and goals, review your patterns, manage sessions, and use interpreter support tools — all in one workspace, with no account and no cloud sync. Your call records and work history stay on your device. A few optional web features send limited information only when you choose to use or enable them; see [Data and Privacy](#data-and-privacy).

**[/live demo on the web](https://untopo.github.io/work-time-tracker/)**

---

## Take a Tour

### Work — your control room

Start a call and watch the timer and earnings update in real time. Rates, daily goals, and your session tracker live on the same screen, so everything you need during a live call is one glance away.

![Work view with an active call: live timer and earnings running](docs/screenshots/work-active-call.png)

- Start and end live calls with real-time timer and earnings
- Manage multiple billing rates and daily goals in USD and minutes
- Run work sessions with pause/resume and utilization metrics
- Log manual calls when the call is already over

When a call ends, a quick review strip lets you double-check the entry before moving on.

![Post-call review strip after ending a call](docs/screenshots/post-call.png)

### Focus Mode — optional, one tap

During a live call, tap **Focus** to blur the workspace and center what matters: a big live timer, real-time earnings, and a ring that fills as you approach your daily goal. Exit anytime — with the button or the Esc key — without touching the call. Prefer the classic view? Turn Focus Mode off in `Settings -> Features`.

| Light | Dark |
|:---:|:---:|
| ![Focus Mode in light theme](docs/screenshots/focus-light.png) | ![Focus Mode in dark theme](docs/screenshots/focus-dark.png) |

### Call Log — your history

Every saved call in one place: filter by date range, search, and edit entries. Import a company CSV history or export your own — with preview, column mapping, and dedupe before anything is saved.

![Call Log view listing saved calls](docs/screenshots/call-log.png)

### Analytics — your patterns

Daily earnings, average call duration, and hourly, weekly, and monthly patterns, plus payment-cycle snapshots so you know what to invoice.

![Analytics view with earnings charts](docs/screenshots/analytics.png)

### Progress — your consistency

Achievements, XP, streaks, and quests keep consistency visible over time. Progress is stored locally, right next to the calls that earned it.

![Progress view with achievements and streaks](docs/screenshots/progress.png)

### Resources — your support tools

Two interpreter support tools built into the workspace:

- **US ZIP / Address Lookup** — one-bar search for ZIPs, cities, states, and partial addresses, with ranked matches and recent lookups
- **Interpreter Language Assistant** — multilingual term lookup with ranked translation candidates, related terms, and frequent searches

![Resources view with the interpreter support tools](docs/screenshots/resources.png)

### Light and dark

The whole app adapts to your theme. Same data, same tools, whatever is easier on your eyes at the end of a shift.

| Light | Dark |
|:---:|:---:|
| ![Work view in light theme](docs/screenshots/work-light.png) | ![Work view in dark theme](docs/screenshots/work-dark.png) |

### On mobile

Responsive layouts for desktop, tablet, and mobile — including floating call controls, so you can start and end calls without losing your place.

![Work view on a mobile-sized screen](docs/screenshots/mobile-work.png)

---

## Why It Exists

- Track paid calls and earnings without spreadsheets
- Keep work data local and simple
- Stay fast during live interpreting work
- Combine tracking and support tools in one workspace

It is built for interpreters who bill by duration, freelancers tracking time-based income, and anyone who wants a private tool with no account setup.

## Core Features

- Live call timer with real-time earnings
- Optional Focus Mode during live calls
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

## Data and Privacy

WTT is local-first. It does not require an account, does not run a WTT cloud account or cloud database, and does not automatically sync your work records to a server.

- Call records, rates, goals, sessions, payment cycles, settings, and progress are stored locally on the device/browser profile where you use the app
- Backups move your saved WTT records only when you explicitly export or import a file
- Temporary live-call notes are not persisted or included in backups
- Local storage is not the same as a backup: clearing browser/site data, uninstalling the app, losing the device, or storage corruption can still cause data loss

### What Leaves Your Device

The core work log is not uploaded. A small number of optional features connect to external services, and each sends only the information needed for that feature:

| Feature | Destination | What is sent | How to avoid it |
|---|---|---|---|
| Usage analytics (web only, opt-in) | GoatCounter (`gc.zgo.at`) | Fixed event names and coarse buckets for usage (such as a call-duration range, daily call-count range, daily hours range, feature toggles, and selected UI actions). No call rows, exact earnings, rates, notes, or timestamps are included in these events | Turn off `Settings -> Features -> Share anonymous usage counts` |
| Update check | `untopo.github.io`, `api.github.com` | Requests the public version/release information so the app can check for updates; no call log or work records are included | Ignore the update notice; the request itself is part of checking for updates |
| US ZIP / Address Lookup | `api.zippopotam.us`, `nominatim.openstreetmap.org` | The ZIP code, city, or address you enter | Do not use this tool, or avoid entering sensitive/private addresses |
| Interpreter Language Assistant | `api.mymemory.translated.net`, `api.dictionaryapi.dev`, `api.datamuse.com` | The term you search for | Do not use this tool for confidential terms or patient-related information |
| Contact Us form | `formspree.io` | The message and any contact details you choose to provide | Do not include patient information or confidential work details; use the published project email instead |
| Optional sync survey | Project survey endpoint | Anonymous choice counts; a written comment is sent only if you choose to write one | Skip the survey or leave the comment field blank |

Styles and icons are self-hosted. The web app does not need a third-party font or icon CDN to render.

If you work under medical, legal, or other confidentiality rules, do not enter patient-identifying information, case details, or confidential interpreting content into Resources searches, the contact form, or the optional survey comment. Those are separate services and are not part of the local call log.

### Analytics details

The web version can send optional usage events only when `Share anonymous usage counts` is enabled. It sends fixed event labels and coarse ranges rather than individual call records. Depending on the enabled features, events can include call started/ended, Focus Mode, reminder choices, report/card usage, and broad daily totals. The app does not attach your name, email, rates, notes, exact earnings, or call history to these analytics events. As with any web request, the analytics provider may process ordinary connection metadata under its own privacy policy.

- The setting is available in `Settings -> Features -> Share anonymous usage counts`
- Turning it off prevents WTT from sending these optional usage events
- Desktop (Tauri) and Android (Capacitor) builds skip this analytics feature
- The app's local work records are not changed by enabling or disabling analytics
- Self-hosted copies can remove the analytics integration from `assets/js/app.js`

## Backup and Restore

Open `Settings -> My data` and use `Export Backup JSON` to create a full backup file. Keep a copy somewhere separate from the device you use for WTT (for example, an encrypted folder or an external drive).

- A JSON backup contains your saved app data, including call records, rates, goals, sessions, payment cycles, and progress
- `Export Call Log CSV` exports call rows only; it is useful for spreadsheets, but it is not a full restore backup
- Imports are previewed/reviewed before they are saved, and duplicate call entries are skipped in supported merge flows
- WTT shows the last full-backup date and reminds you when calls exist only in the current browser/device
- Exporting a backup is manual: WTT does not silently upload it to cloud storage
- A backup is only useful if you keep the file safe and can find it later. Periodically make a fresh export and verify that it exists in your backup location

**Recommended habit:** export a full JSON backup at the end of each workweek, and before clearing browser data, changing devices, reinstalling, or resetting the app. Keep at least one additional copy outside the device.

## Onboarding

New users see a first-run welcome guide with three paths: Quick Start, Customize First, or Skip. The guide tracks three practical milestones: saving a first rate, saving a first call, and opening Settings. Contextual cue cards then guide the user through adding a rate, trying a test call, and customizing the workspace. The guide can be restarted from Settings.

The fastest setup is: add one billing rate, run a short test call, then review Settings. A test call is just a setup check; delete it afterward if you do not want it in your work history.

## Platforms

One version of the app, three ways to run it:

| Platform | Technology | Notes |
|---|---|---|
| Web | Static files | Runs from the project root; works on GitHub Pages |
| Desktop | Tauri | Native file dialogs for import/export; no analytics |
| Android | Capacitor | Responsive mobile/tablet layouts; no analytics |

All three share the same frontend and release-version syncing.

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

## Architecture

WTT uses a shared frontend across web, desktop, and Android. The application is still a plain-script JavaScript app rather than a fully bundled ES-module application. `app.js` remains the central coordinator for UI state, DOM events, navigation, and feature wiring; domain logic that can run independently has been progressively extracted into smaller files and covered by unit tests.

Current boundaries include:

- `data-core.js`: data normalization, CSV parsing/import helpers, and merge logic
- `session-core.js`: work-session and active-call recovery logic
- `progress-core.js`: progression, achievements, and streak calculations
- `metrics-core.js`: coarse usage-metric buckets
- `report-core.js`: monthly report calculations
- `survey-core.js`: survey question/configuration logic
- `resources-data.js` and `resources-helpers.js`: interpreter resource data and helper logic
- `storage.js`: shared storage adapter for browser storage and the Tauri native snapshot bridge
- `settings-manager.js` and `update-manager.js`: settings and update UI coordination

The next architectural step should be incremental: extract one self-contained feature at a time from `app.js`, preserve the existing storage keys and public globals during migration, and add unit/E2E coverage before changing behavior. Avoid a full rewrite; compatibility across web, Tauri, and Android is more important than reducing file size quickly.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module map and refactoring rules.

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
|   |   |-- data-core.js
|   |   |-- metrics-core.js
|   |   |-- progress-core.js
|   |   |-- report-core.js
|   |   |-- session-core.js
|   |   |-- survey-core.js
|   |   |-- resources-data.js
|   |   |-- resources-helpers.js
|   |   |-- settings-manager.js
|   |   |-- storage.js
|   |   |-- update-utils.js
|   |   `-- update-manager.js
|   `-- images/
|-- docs/
|   `-- screenshots/
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

- Current Version: `v1.7.0`
- In-app history: `What's New` modal
- GitHub Releases: https://github.com/untopo/work-time-tracker/releases
- Full markdown changelog: [`CHANGELOG.md`](CHANGELOG.md)
- Release workflow: [`RELEASE.md`](RELEASE.md)

## Community

Join the Discord server for interpreters using the app. It is the fastest place
to ask questions, share workflows, and hear about releases first.

- Discord: https://discord.gg/eRayqAkFWC
- X: https://x.com/worktimetracker
- LinkedIn: https://www.linkedin.com/company/work-time-tracker/
- GitHub: https://github.com/untopo/work-time-tracker

All of these are also available in the app sidebar.

## Support the Project

The app is free and has no paid tier. If it saves you time, you can help cover
development and release costs:

- PayPal: https://www.paypal.com/donate/?hosted_button_id=3YPGH7MTRMFTJ
- Ko-fi: https://ko-fi.com/untopo

## Feedback

Use the in-app `Contact Us` modal for:

- bug reports
- feature requests
- general feedback

Direct contact reference: `worktimetrackertool@gmail.com`

## Credits

Built for interpreters by interpreters.

Made by [Topo](https://www.instagram.com/otpo/)
