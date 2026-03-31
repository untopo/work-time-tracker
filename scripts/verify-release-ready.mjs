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
  appJs.includes('const APP_VERSION = \'1.4.0\'') || appJs.includes(`const APP_VERSION = '${version}'`),
  'assets/js/app.js APP_VERSION must match the package version'
);
assert(
  appJs.includes('const updateUtils = window.WTTUpdateUtils || {};'),
  'assets/js/app.js must consume WTTUpdateUtils'
);

console.log(`Release readiness OK for v${version}`);
