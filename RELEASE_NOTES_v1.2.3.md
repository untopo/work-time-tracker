# Work Time Tracker v1.2.3

Release date: 2026-03-19

## Summary
v1.2.3 improves Android UI consistency and typography parity while keeping web, desktop, and mobile releases fully aligned.

## What's New
- Embedded core app font locally (`assets/fonts`) so all platforms render the same typography.
- Removed runtime dependency on Google Fonts for the primary UI font.
- Added stronger text-fit safety rules (`overflow-wrap`, stable text-size adjustment) to reduce clipping/overflow on Android.
- Kept package parity so web, desktop, and Android artifacts are built from the same version state.

## Platform Artifacts
- Windows installer (.exe)
- Windows installer (.msi)
- Android APK (installable debug build)
- Android APK (unsigned release build for signing workflows)

## Stability
- General UI polish and packaging consistency improvements.
