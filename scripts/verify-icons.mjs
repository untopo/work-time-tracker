import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Font Awesome is shipped trimmed to the icons the app uses (see
// scripts/build-fontawesome-subset.py). This check fails when the code uses an
// icon that is not in the shipped files, so a missing icon never reaches users.

const root = resolve(process.cwd());

// Icons referenced by the code that do not exist in Font Awesome Free (Pro-only).
// They render nothing today; allowed here so this check does not fail on them.
const KNOWN_MISSING = new Set(['fa-octagon-exclamation']);

const cssPath = 'assets/vendor/fontawesome/css/all.min.css';
const css = readFileSync(resolve(root, cssPath), 'utf8');
const shipped = new Set([...css.matchAll(/\.(fa-[a-z0-9-]+)/g)].map((match) => match[1]));

// Every webfont the CSS points to must exist.
for (const match of css.matchAll(/url\(\.\.\/webfonts\/([^)]+)\)/g)) {
  const fontPath = `assets/vendor/fontawesome/webfonts/${match[1]}`;
  if (!existsSync(resolve(root, fontPath))) {
    throw new Error(`Icon check failed: ${cssPath} references a missing font file: ${fontPath}`);
  }
}

const files = [
  'index.html',
  ...readdirSync(resolve(root, 'assets/js'))
    .filter((name) => name.endsWith('.js'))
    .map((name) => `assets/js/${name}`)
];

const used = new Map();
for (const file of files) {
  const text = readFileSync(resolve(root, file), 'utf8');
  for (const match of text.matchAll(/["'`]([^"'`<>]*\bfa[a-z-]*\b[^"'`<>]*)["'`]/g)) {
    for (const word of match[1].split(/\s+/)) {
      if (/^fa-[a-z0-9-]+$/.test(word) && !used.has(word)) used.set(word, file);
    }
  }
}

const missing = [...used].filter(([token]) => !shipped.has(token) && !KNOWN_MISSING.has(token));
if (missing.length > 0) {
  const detail = missing.map(([token, file]) => `- ${token} (used in ${file})`).join('\n');
  throw new Error(
    `Icon check failed: these icons are used but are not in the shipped Font Awesome files:\n${detail}\n` +
    'Regenerate the trimmed files: see the instructions at the top of scripts/build-fontawesome-subset.py'
  );
}

console.log(`Icon check OK: ${used.size} fa-* classes used, all present in the shipped Font Awesome files.`);
