# Work Time Tracker


![Version](https://img.shields.io/badge/version-1.1.26-blue)
![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Vanilla JS](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow)


A lightweight, privacy-first time tracking tool built for interpreters and freelancers.


Track live calls, monitor earnings, manage billing rates, set daily goals, and organize payment cycles — all directly in your browser.


---


## 🚀 Live Demo


👉 https://untopo.github.io/work-time-tracker/


---


## 📸 Screenshots



### Dashboard
![Dashboard Screenshot](assets/images/dashboard.png)


### Call Log
![Call Log Screenshot](assets/images/call-log.png)


### What's New Modal
![Changelog Screenshot](assets/images/changelog.png)


---


## ✨ Features


### 🕒 Call Tracking
- Live Call Timer with real-time earnings
- Manual call entry
- Editable call log
- Multiple billing rates
- Smart filtering (Today / Week / Month / Custom)
- Optional call notes (volatile, never stored)


### 📊 Earnings & Stats
- Daily earnings overview
- Average call duration
- Monthly split (1st / 2nd half)
- Optional Payment Cycles with cycle tracking


### 🎯 Goal System
- Set daily earnings target
- Sync between USD and minutes
- Real-time progress bar


### 💾 Data Management
- 100% localStorage-based
- JSON export/import
- Storage monitoring
- Full reset options


### ⚙️ Customization & Settings
- Dark / Light mode
- Time zone selection
- Feature toggles (Notes, Payment Cycles, Floating Call Controls)
- Fully responsive design


### 🆕 Versioning & Updates
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Built-in **What's New (Changelog)** modal
- Recovery for unfinished live calls
- Unified internal modal UX for confirmations, warnings, and validation errors (no browser popups in core flows)

### v1.0.10 Notes
- Replaced browser `alert()`/`confirm()` with the internal confirmation modal style across add/edit/delete/import/reset flows
- Added reusable modal helper behavior for severity/icon/tone consistency
- Kept a single `alert()` only as last-resort fallback for catastrophic initialization failure

### v1.1.5 Notes
- Fixed Settings modal overflow/scroll behavior for split-screen and short-height windows
- Added dedicated centered modal for Floating Controls customization to reduce Settings clutter
- Fixed floating mini button deformation by isolating icon-size styles to primary Start/End controls only
- Improved dock behavior in `Icon` mode by simplifying actions (hides secondary action + active mini card)
- Improved settings readability for floating customization with internal scroll area

### v1.1.6 Notes
- Reorganized `Settings` into cleaner section cards to reduce visual overload
- Expanded and centered `Settings` modal (`max-w-3xl`) for split-screen usability
- Removed forced auto-scroll to Time Zone when opening settings (prevents jumpy behavior)
- Improved internal modal scrolling so content remains accessible in compact window layouts

### v1.1.7 Notes
- Added `Settings Control Center` navigation with tabs (`General`, `Floating`, `Data`, `Time`) and inline search
- Added Floating density presets: `Minimal`, `Balanced`, `Data-rich`, and `Custom`
- Added testing-focused mini live preview in Floating Controls modal with idle/on-call simulation
- Added explicit preview toggle so preview lab can be disabled independently during evaluation
- Preserved all existing user settings storage keys while extending feature flags safely

### v1.1.8 Notes
- Fixed layout regression where footer information appeared merged with modal viewport
- Moved footer information into a dedicated centered floating modal (`Footer Info`) while preserving existing content/style
- Simplified Settings flow back to `General-first` (no tabs) for current scope
- Added per-feature customization entry buttons from General:
  - `Notes Settings`
  - `Payment Cycles Settings`
  - `Floating Controls Settings`
- Grouped `Payment Cycles + Data Management + Storage` into a dedicated Payment Cycles settings modal

### v1.1.9 Notes
- Restored classic footer as always-visible content at the bottom of the main page
- Removed temporary footer-info floating modal
- Kept footer visual style and content unchanged from original layout intent

### v1.1.4 Notes
- Added Smart Floating Dock with contextual primary actions (`Start`/`End`) and configurable secondary action (`Add Call` / `Go to Controls`)
- Added idle auto-collapse to mini dock plus animated re-expand on user activity
- Added customizable Active Call mini card (timer/earnings/rate visibility toggles)
- Added one-handed mode option for larger touch targets on mobile
- Added overlap-avoidance behavior for footer, toasts, and focused form fields
- Added smooth `Go to Controls` action aligned with current app aesthetics

### v1.1.3 Notes
- Added floating-controls customization panel in Settings (visible only when Floating Call Controls is enabled)
- Added floating size modes: `Auto`, `Full`, `Compact`, `Icon Only`
- Added floating position options: `Left` or `Right`
- Improved `Auto` mode behavior for split-screen windows, including icon-only mode in ultra-compact widths

### v1.1.2 Notes
- Added optional floating `Start Call` / `End Call` controls when the main Call Controls card is out of view
- Added `Enable Floating Call Controls` toggle in Settings > Features
- Floating controls now follow live-call state and hide automatically while modals are open
- Floating controls use the same visual style/colors as the primary Start/End buttons

### v1.1.1 Notes
- Added typed confirmation guard for destructive actions (e.g. requires typing `RESET` in Reset All)
- Added confirmation modal status flow (`loading` and `success`) with explicit action lock
- Added body scroll lock while any modal is open (better mobile interaction)
- Improved destructive-action microcopy for clarity on what data is affected
- Added 1.1.x manual modal QA checklist guidance in roadmap

### v1.1.0 Notes
- Added a centralized `ModalManager` for consistent modal lifecycle behavior
- Added keyboard accessibility improvements: focus trap, Escape handling, focus restore, and Enter-to-confirm for confirmation dialogs
- Added ARIA dialog semantics wiring for all app modals
- Added click-outside policy by modal type (enabled for non-destructive, blocked for destructive confirms)
- Added confirmation action lock to prevent accidental double-submit on destructive actions
- Added consistent modal animations and focus-visible styling

### v1.0.11 Notes
- Fixed `Add Rate` opening in stale edit mode after editing/canceling an existing rate
- Added explicit rate-form mode reset so add/cancel flows always clear `editingIndex`
- Prevented accidental overwrite of existing rates when user intended to create a new rate


---


## 🏁 Quick Start


### Run Locally


Clone the repository:


```bash
git clone https://github.com/untopo/work-time-tracker.git
```
Open index.html in your browser.

No build process required.

```
📦 Project Structure
/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── images/
├── README.md
└── .nojekyll
```

🔁 Backup & Restore

Export:
Settings → Data Management → Export Data

Import:
Settings → Data Management → Import Data

All data stays in your browser.

🔒 Privacy

✅ No accounts
✅ No tracking
✅ No analytics
✅ No cloud storage
✅ No external database
✅ Call notes are volatile (never persisted)

Data is stored locally using browser localStorage.

🧠 Technical Overview

Vanilla JavaScript (ES6)

No frameworks

No build tools

GitHub Pages compatible

Modular structure ready for scaling

Feature flags system for progressive feature rollout

💡 Pro Tips

Use emojis in rate names for quick visual grouping

Backup weekly if income tracking is critical

Use payment cycles if paid bi-weekly/monthly

Enable call notes from Settings → Features for quick reference (notes are not saved)

Click the version badge in the footer to see patch notes

📬 Feedback

Use the Contact Us modal inside the app to send:

Bug reports

Feature suggestions

General feedback

Email is optional.

❤️ Credits

Built for interpreters by interpreters.

Made by [Topo](https://www.instagram.com/otpo/)

Current Version: v1.1.26
Last Updated: February 2026
