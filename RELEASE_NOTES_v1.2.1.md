# Work Time Tracker v1.2.1

Release date: 2026-03-19

## Summary
v1.2.1 focuses on Session Tracker quality-of-life improvements, clearer analytics language, and UI consistency updates across web, desktop, and Android.

## New Features

### Session Tracker: Auto-Captured Shift Times
- `Shift Start` and `Shift End` are now auto-captured from the moment the user presses Start/End.
- Session time fields remain visible but are now read-only to preserve a clean one-click workflow.

### Session History
- Added a new Session History block under Session Tracker.
- Stores and displays completed sessions with:
  - Date and start/end range
  - Session length
  - Call count
  - Talk time
  - Idle time
  - Utilization
  - Earnings during that session window
- Includes a built-in clear action with confirmation.

### Live Session Call Counter
- Added a live `Calls` metric to show how many calls happened during the current active session.

## Improvements

### Supportive Comparison Mode
- Reworked delta messaging in Call Statistics to use supportive phrasing:
  - `no baseline yet`
  - `first active day`
  - `ahead` / `behind`
- Reduced punitive visual tone for negative deltas by switching to calmer warning-style color emphasis.

### Floating Controls Preview Parity
- Floating Controls Settings preview now reflects the `Show +/-1s Buttons` option in both idle/active preview cards.

### Copy and Text Cleanup
- Fixed several text encoding artifacts and separators in key areas (release spotlight, summaries, toasts, and status lines).
- Standardized separators for cleaner readability.

## Stability
- General bug fixes and polish across Session Tracker and statistics rendering paths.
