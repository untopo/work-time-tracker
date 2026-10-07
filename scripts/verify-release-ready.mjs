import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function readText(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pkg = readJson('package.json');
const version = String(pkg.version || '').trim();
assert(version, 'package.json version is empty');

const versionManifest = readJson('version.json');
assert(
  String(versionManifest.latestVersion || '').trim() === version,
  `version.json latestVersion must match package.json (${version})`
);
assert(
  String(versionManifest.releaseUrl || '').includes(`/tag/v${version}`),
  `version.json releaseUrl must point to /tag/v${version}`
);

const indexHtml = readText('index.html');
[
  'assets/js/resources-data.js',
  'assets/js/resources-helpers.js',
  'assets/js/update-utils.js',
  'assets/js/update-manager.js',
  'assets/js/changelog-data.js',
  'assets/js/app.js'
].forEach((scriptPath) => {
  assert(indexHtml.includes(scriptPath), `index.html must include ${scriptPath}`);
});

[
  'assets/js/resources-data.js',
  'assets/js/resources-helpers.js',
  'assets/js/update-utils.js',
  'assets/js/update-manager.js',
  'android/keystore.properties.example',
  'RELEASE.md'
].forEach((filePath) => {
  assert(existsSync(resolve(root, filePath)), `Missing required file: ${filePath}`);
});

const appJs = readText('assets/js/app.js');
assert(
  appJs.includes(`const APP_VERSION = '${version}'`),
  'assets/js/app.js APP_VERSION must match the package version'
);
assert(
  appJs.includes('const updateUtils = window.WTTUpdateUtils || {};'),
  'assets/js/app.js must consume WTTUpdateUtils'
);
assert(
  appJs.includes('const CHANGELOG = Array.isArray(window.WTT_CHANGELOG)'),
  'assets/js/app.js must consume the generated changelog data (window.WTT_CHANGELOG)'
);

// Changelog single source of truth: CHANGELOG.md -> generated data file.
// Fails when someone edits CHANGELOG.md (or the data file) without
// running `npm run changelog`.
const { parseChangelogMd, generateDataJs, validateEntries } = await import('./build-changelog.mjs');
const changelogMd = readText('CHANGELOG.md');
const { entries: changelogEntries } = parseChangelogMd(changelogMd);
validateEntries(changelogEntries);
assert(
  String(changelogEntries[0].version) === version,
  `CHANGELOG.md head version must be ${version} (found v${changelogEntries[0].version})`
);
const changelogDataFile = readText('assets/js/changelog-data.js');
assert(
  changelogDataFile === generateDataJs(changelogEntries),
  'assets/js/changelog-data.js is out of sync with CHANGELOG.md - run: npm run changelog'
);

console.log(`Release readiness OK for v${version}`);
