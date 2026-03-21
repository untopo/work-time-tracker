import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function readText(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function extractMatch(text, regex, label) {
  const match = text.match(regex);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return String(match[1]).trim();
}

const pkgVersion = String(readJson('package.json').version || '').trim();
if (!pkgVersion) {
  throw new Error('package.json version is empty');
}

const versionManifest = readJson('version.json');
const versionManifestValue = String(versionManifest.latestVersion || '').trim();

const tauriConf = readJson('src-tauri/tauri.conf.json');
const tauriVersion = String(tauriConf.version || '').trim();

const cargoToml = readText('src-tauri/Cargo.toml');
const cargoVersion = extractMatch(
  cargoToml,
  /^\[package\][\s\S]*?^version\s*=\s*"([^"]+)"/m,
  'src-tauri/Cargo.toml [package].version'
);

const appJs = readText('assets/js/app.js');
const appVersion = extractMatch(
  appJs,
  /const\s+APP_VERSION\s*=\s*'([^']+)'/,
  'assets/js/app.js APP_VERSION'
);
const appChangelogHeadVersion = extractMatch(
  appJs,
  /const\s+CHANGELOG\s*=\s*\[\s*\{\s*version:\s*'([^']+)'/m,
  'assets/js/app.js CHANGELOG head version'
);

const checks = [
  ['package.json', pkgVersion],
  ['version.json latestVersion', versionManifestValue],
  ['src-tauri/tauri.conf.json version', tauriVersion],
  ['src-tauri/Cargo.toml package.version', cargoVersion],
  ['assets/js/app.js APP_VERSION', appVersion],
  ['assets/js/app.js CHANGELOG head version', appChangelogHeadVersion]
];

const mismatches = checks.filter(([, value]) => value !== pkgVersion);

if (mismatches.length > 0) {
  const detail = mismatches
    .map(([label, value]) => `- ${label}: ${value} (expected ${pkgVersion})`)
    .join('\n');
  throw new Error(`Version sync check failed.\n${detail}`);
}

console.log(`Version sync OK: ${pkgVersion}`);

