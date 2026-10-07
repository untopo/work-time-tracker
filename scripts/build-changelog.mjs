// Single-source-of-truth changelog generator.
//
// CHANGELOG.md is the only file humans edit. This script turns it into
// assets/js/changelog-data.js, the data file the in-app "What's New"
// modal reads. Run it after every CHANGELOG.md edit:
//
//     npm run changelog
//
// verify-release-ready.mjs fails if the generated file is out of sync.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const MD_PATH = 'CHANGELOG.md';
const DATA_PATH = 'assets/js/changelog-data.js';

const VERSION_RE = /^\d+\.\d+\.\d+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Strip markdown decorations for plain-text app rendering. */
function plainBullet(text) {
    let t = String(text).trim();
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); // [text](url) -> text
    t = t.replace(/\*\*([^*]+)\*\*/g, '$1');          // **bold** -> bold
    t = t.replace(/`([^`]+)`/g, '$1');                // `code` -> code
    t = t.replace(/\.$/, '');                          // drop one trailing period
    return t.trim();
}

/** Parse CHANGELOG.md into { header, entries }. Newest first, flat bullets. */
export function parseChangelogMd(mdText) {
    const text = String(mdText).replace(/\r\n/g, '\n');
    const firstSection = text.search(/^## /m);
    const header = firstSection === -1 ? text : text.slice(0, firstSection);
    const entries = [];
    let current = null;

    const lines = (firstSection === -1 ? '' : text.slice(firstSection)).split('\n');
    for (const line of lines) {
        const head = line.match(/^## v([\d.]+)\s+-\s+(\d{4}-\d{2}-\d{2})\s*$/);
        if (head) {
            current = { version: head[1], date: head[2], changes: [] };
            entries.push(current);
            continue;
        }
        if (/^##\s/.test(line)) { current = null; continue; } // unrelated '##' section
        const bullet = line.match(/^-\s+(.*)$/);
        if (bullet && current) {
            const plain = plainBullet(bullet[1]);
            if (plain) current.changes.push(plain);
        }
    }
    return { header, entries };
}

/** Render the browser data file content for the parsed entries. */
export function generateDataJs(entries) {
    const blocks = entries.map((e) => {
        const changes = e.changes.map((c) => '        ' + JSON.stringify(c)).join(',\n');
        return [
            '    {',
            `        version: ${JSON.stringify(e.version)},`,
            `        date: ${JSON.stringify(e.date)},`,
            '        changes: [',
            changes,
            '        ]',
            '    }'
        ].join('\n');
    });
    return [
        '// GENERATED FILE - DO NOT EDIT BY HAND.',
        '// Source of truth: CHANGELOG.md.',
        '// Regenerate with: npm run changelog',
        'window.WTT_CHANGELOG = [',
        blocks.join(',\n'),
        '];',
        ''
    ].join('\n');
}

function compareVersionsDesc(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
    return 0;
}

/** Structural validation so bad edits fail loudly instead of silently. */
export function validateEntries(entries) {
    if (!Array.isArray(entries) || entries.length === 0) {
        throw new Error('CHANGELOG.md contains no version sections.');
    }
    const seen = new Set();
    entries.forEach((e, i) => {
        if (!VERSION_RE.test(e.version)) throw new Error(`Bad version format: "${e.version}"`);
        if (seen.has(e.version)) throw new Error(`Duplicate version in CHANGELOG.md: ${e.version}`);
        seen.add(e.version);
        if (!DATE_RE.test(e.date)) throw new Error(`Bad date for v${e.version}: "${e.date}"`);
        if (!Array.isArray(e.changes) || e.changes.length === 0) {
            throw new Error(`Version v${e.version} has no bullet points.`);
        }
        if (i > 0 && compareVersionsDesc(entries[i - 1].version, e.version) >= 0) {
            throw new Error(`CHANGELOG.md must be newest-first: v${e.version} appears after v${entries[i - 1].version}.`);
        }
    });
    return true;
}

function main() {
    const md = readFileSync(resolve(ROOT, MD_PATH), 'utf8');
    const { entries } = parseChangelogMd(md);
    validateEntries(entries);
    writeFileSync(resolve(ROOT, DATA_PATH), generateDataJs(entries));
    console.log(`Changelog data OK: ${entries.length} versions (newest v${entries[0].version}) -> ${DATA_PATH}`);
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isDirectRun) main();
