# Architecture

## Current shape

Work Time Tracker shares one frontend across GitHub Pages, the Tauri desktop app, and the Capacitor Android app. The frontend is built with plain HTML, CSS, and classic JavaScript scripts. It is not currently a fully bundled ES-module application.

`assets/js/app.js` is the application coordinator. It currently contains the main application state, DOM references, event wiring, navigation, rendering orchestration, and integration between features. The file is large, so it is the main architectural pressure point; however, replacing it wholesale would create unnecessary risk for a mature app with three runtime targets.

## Existing module boundaries

| File | Responsibility |
|---|---|
| `data-core.js` | Pure data normalization, date/time parsing, CSV parsing, import mapping, and merge helpers |
| `session-core.js` | Work-session calculations and active-session recovery helpers |
| `progress-core.js` | Progression, achievements, streaks, and related calculations |
| `metrics-core.js` | Converts usage activity into coarse, allow-listed analytics labels |
| `report-core.js` | Monthly report calculations and presentation data |
| `survey-core.js` | Optional sync-survey questions, labels, and eligibility logic |
| `resources-data.js` | Static data for interpreter support resources |
| `resources-helpers.js` | Resource lookup and formatting helpers |
| `storage.js` | Shared storage adapter; browser storage and the Tauri native snapshot bridge |
| `settings-manager.js` | Settings view and settings-related UI coordination |
| `update-utils.js` | Pure update/version helpers |
| `update-manager.js` | Update notice and update-related UI coordination |

The classic scripts are loaded in a deliberate order from `index.html`. When adding a script, update that order and the release-readiness checks as appropriate.

## Refactoring principles

1. **Extract by responsibility, not by line count.** Move a cohesive feature only when its inputs, outputs, and side effects can be made clear.
2. **Keep pure logic pure.** Calculation, parsing, normalization, and formatting helpers should not read global app state or manipulate the DOM.
3. **Keep the application shell as the integration layer.** DOM events, navigation, rendering orchestration, and cross-feature coordination can remain in `app.js` until a feature boundary is genuinely stable.
4. **Preserve storage compatibility.** Do not casually rename storage keys, alter serialized record shapes, or change import/export semantics. Add migrations and compatibility tests when a data change is necessary.
5. **Preserve all three targets.** Every extraction must be checked in the web, Tauri, and Android loading/build paths.
6. **Test before and after moving code.** Add unit tests for pure logic and E2E tests for user-visible flows, persistence, import/export, and recovery.
7. **Avoid broad rewrites.** Prefer small, reviewable changes that can be reverted independently.

## Suggested extraction order

The next candidates should be selected after profiling the current `app.js` responsibilities and their dependencies. A sensible sequence is:

1. Identify one self-contained feature with limited shared state.
2. Define a small module API and list the globals/DOM elements it currently touches.
3. Move the logic without changing behavior or storage formats.
4. Load the new script before `app.js` and expose only the smallest required interface.
5. Add or update unit and E2E tests.
6. Run version-sync, release-readiness, syntax, unit, and E2E checks.
7. Repeat only after the previous extraction is stable.

Do not split code solely to make files smaller. A smaller, well-defined module is an improvement only if it reduces coupling and makes behavior easier to test and maintain.
