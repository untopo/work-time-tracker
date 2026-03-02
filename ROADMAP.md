# ROADMAP

## Current State
- Current version: `1.1.52`
- Product direction: `local-first`, fast to open, zero account setup, reliable call tracking for interpreters/freelancers.
- Current priority: stabilize UX and data integrity before adding heavier features.

## QA Status
### Pre-release review
- No blocking static issues found in the latest pass.
- `assets/js/app.js` passes `node --check`.
- Highest-risk area remains data flows:
  - CSV import
  - CSV export
  - JSON backup merge
  - manual call editing after imports

### Remaining manual QA focus
1. Desktop: import/export with real CSV files from different providers.
2. Mobile: modal fit, scroll, and touch targets.
3. Theme: dark/light contrast consistency across Settings, Data Hub, and modals.
4. Recovery paths: cancel import, empty export scope, duplicate-heavy CSV, invalid rows, no-rate rows.

## Core
These are the areas that should be tightened before the app grows much more.

### 1. Stability and trust
- Finish a repeatable QA checklist for:
  - Add Call
  - Edit/Delete Call
  - Data Hub
  - Backup import/export
  - CSV import/export
  - RPG toggle on/off
- Add a few more explicit empty-state and edge-case messages where users may think data was lost.

### 2. Data workflows
- Keep import/export understandable and safe by default.
- Continue improving:
  - duplicate detection
  - CSV parsing resilience
  - post-import summaries
  - scoped exports

### 3. UI consistency
- Unify surface/card styling across the dashboard and modals.
- Keep Settings minimal and move complexity into guided modals.
- Avoid adding more always-visible controls to the main screen.

## Later
Good candidates once the current product feels stable.

### 1. CSV templates and smarter mapping
- Save last-used CSV column mapping.
- Add provider presets for common call-log formats.
- Support more date/time formats without manual remapping.

### 2. Better export/reporting
- Presets like:
  - `Daily Report`
  - `Payroll Review`
  - `Simple Archive`
- Optional export summaries and lightweight report headers.

### 3. Call log scale
- Progressive improvements for larger histories:
  - pagination or virtualized rendering if needed
  - better bulk actions
  - advanced date/rate filtering

### 4. RPG and achievements
- More milestone variety only if it stays optional and non-intrusive.
- Better progression explanation without cluttering the default UI.

## Maybe Never
Ideas that should stay heavily questioned unless the product direction changes.

### 1. Accounts / cloud sync
- High complexity.
- Changes the identity of the app.
- Introduces support and privacy expectations.

### 2. Heavy analytics dashboards
- Easy to bloat the product.
- Risks shifting focus away from fast logging/tracking.

### 3. Over-automation
- Examples:
  - aggressive predictions
  - auto-categorization with weak confidence
  - hidden smart behaviors that users cannot audit
- This app benefits from being explicit and trustworthy.

## Decision Rule
Before adding a new feature, ask:
1. Does it improve trust, speed, or clarity?
2. Does it keep the app simple for first-time users?
3. Can it be hidden behind a modal or optional setting instead of adding more visible clutter?
4. Does it risk confusing import/export or existing stored data?

If the answer is weak on those points, it should probably wait.
