# Release Guide

This project ships the same version across web, desktop, and Android.

## Before You Release

Run:

```bash
npm run verify:version-sync
npm run verify:release-ready
node --check assets/js/app.js
```

Confirm:

- `package.json`, `version.json`, `assets/js/app.js`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` all match
- `version.json.releaseUrl` points to the current GitHub tag
- `index.html` includes the current JS modules used by the app shell

## Web

Build:

```bash
npm run build:web
```

Verify:

- `dist/` was generated
- `version.json` is present in `dist/`

## Desktop

Build:

```bash
npm run tauri:build
```

Expected assets:

- Windows installer `.exe`
- Windows installer `.msi`

## Android

Prepare:

- copy `android/keystore.properties.example` to `android/keystore.properties`
- fill in the real keystore path and credentials

Build:

```bash
cd android
gradlew assembleRelease
```

Expected asset:

- `android/app/build/outputs/apk/release/Work.Time.Tracker_<version>_signed.apk`

If signing is not configured, the build will fall back to an `unsigned` APK. Do not publish that as the primary Android installer when a signed channel already exists.

## GitHub Release

Release assets should normally include:

- `Work.Time.Tracker_<version>_x64-setup.exe`
- `Work.Time.Tracker_<version>_x64_en-US.msi`
- `Work.Time.Tracker_<version>_signed.apk`

For Android, prefer the signed APK over debug or unsigned artifacts.

## Secrets

Never commit:

- `android/keystore.properties`
- any `.jks` or `.keystore` file

Back up your Android release keystore and its credentials outside the repo.
