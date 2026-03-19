# Work Time Tracker v1.2.0

Release date: 2026-03-18

## Summary
v1.2.0 is a major UX and productivity update across web, desktop, and Android.  
It adds a new Session Tracker flow, richer post-call actions, expanded analytics patterns, deeper RPG progression systems, stronger call-log productivity tools, and platform hardening improvements.

## New Features

### Session Tracker
- Added shift start/pause/end controls.
- Added live shift metrics: on-calls time, idle time, utilization, available/paused totals.
- Added schedule-aware session flow for better daily pacing visibility.

### Post-Call Review Strip
- Added a dedicated post-save action strip with:
  - Undo
  - Quick Edit
  - Dismiss
- Makes correction workflows significantly faster without reopening multiple dialogs.

### Patterns Analytics
- Added mode switching between:
  - Hourly
  - Weekly
  - Monthly
- Improved data-density balance and readability in the Call Statistics visualization area.

### RPG Progression Expansion
- Added Daily Focus progression block.
- Added Weekly Arc progression block.
- Added Streak Shield flow.
- Added session-linked RPG progression hooks and related achievement paths.

### Call Log Workflow Upgrades
- Added search in Call Log.
- Added rate-based filtering.
- Added quick reset for active filters/search.
- Added richer results summary behavior for filtered views.

## Improvements

### Payment Cycles
- Improved current/next payout context and timeline visibility.
- Improved cycle summary clarity for near-term payout planning.

### Footer and Navigation UX
- Refined footer structure for cleaner information hierarchy.
- Improved mobile usability with collapsible footer sections and clearer quick-link flow.

## Security and Platform Hardening

### Desktop (Tauri)
- Hardened external URL opening with stricter URL validation.
- Replaced risky Windows open path with safer behavior.
- Added explicit CSP policy in desktop runtime config.

### Android Widget
- Hardened widget action handling against unintended external broadcast triggers.
- Added token validation for widget action broadcasts.
- Disabled Android backup by default to align better with local-first behavior.

## Stability
- Multiple general bug fixes and quality improvements across web, desktop, and mobile.
- Cleanup and consistency pass across UI refresh and text handling paths.
