# Release Guide

This project ships the same version across web, desktop, and Android.

## Automated builds (GitHub Actions)

`.github/workflows/build-release.yml` builds the installers whenever a tag starting with `v` is pushed:

- **Windows** (`.exe` + `.msi`): built with Tauri on a GitHub Windows runner.
- **Android** (signed `.apk`): built with Gradle on a GitHub Linux runner, signed with the release keystore stored in repository secrets.

Tags that look exactly like `vX.Y.Z` (for example `v1.5.1`) are official releases: once both builds succeed, the workflow creates the GitHub Release for that tag, attaches the three installers, and publishes it. Release notes are taken from the matching `## vX.Y.Z` section in `CHANGELOG.md`.

Any other `v*` tag (for example `v0.0.0-buildtest`) runs the same builds but only creates a draft release to verify the upload, then deletes it. Nothing becomes public. Use these tags for practice runs and delete them afterwards.

### Release order

The in-app update banner is driven by `version.json` on GitHub Pages, so it must never point at a tag or release that does not exist yet:

1. Open a PR that bumps the six version values in sync: `package.json`, `version.json` (`latestVersion` + `releaseUrl` with `/tag/vX.Y.Z`), `assets/js/app.js` (`APP_VERSION` + the first `CHANGELOG` entry), `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`. Android derives its version from `package.json`. Also add the `## vX.Y.Z` section to `CHANGELOG.md`.
2. Push the `vX.Y.Z` tag and wait for the workflow to publish the release with all three installers.
3. Only then merge the PR into `main`, which publishes the web through GitHub Pages.

### Android signing secrets

Official builds refuse to produce an unsigned APK. The workflow needs these repository secrets (Settings → Secrets and variables → Actions → Repository secrets):

- `WTT_ANDROID_KEYSTORE_BASE64` — the release keystore (`.jks` file) encoded as base64 text
- `WTT_ANDROID_KEYSTORE_PASSWORD` — keystore password
- `WTT_ANDROID_KEY_ALIAS` — key alias
- `WTT_ANDROID_KEY_PASSWORD` — password of the key itself

These match the `WTT_ANDROID_*` environment variables that `android/app/build.gradle` already reads, so the same secrets also work for local builds. Never commit the keystore itself or `android/keystore.properties`; back them up outside the repo.

## Before you release

Run:

```bash
npm run verify:version-sync
npm run verify:release-ready
node --check assets/js/app.js
```

`.github/workflows/checks.yml` runs the same checks on every pull request and push to `main`.

Confirm:

- `package.json`, `version.json`, `assets/js/app.js`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` all match
- `version.json.releaseUrl` points to the current GitHub tag
- `index.html` includes the current JS modules used by the app shell
- `CHANGELOG.md` has a `## vX.Y.Z` section for the version being released

## Manual builds (fallback)

The automated pipeline replaces these steps for normal releases. They remain here as a fallback if you ever need to build on your own machine.

### Web

Build:

```bash
npm run build:web
```

Verify:

- `dist/` was generated
- `version.json` is present in `dist/`

### Desktop

Build:

```bash
npm run tauri:build
```

Expected assets:

- Windows installer `.exe`
- Windows installer `.msi`

### Android

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

For Android, prefer the signed APK over debug or unsigned artifacts. The automated pipeline attaches exactly these three files.

## Secrets

Never commit:

- `android/keystore.properties`
- any `.jks` or `.keystore` file

Back up your Android release keystore and its credentials outside the repo.
