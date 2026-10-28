// Loads the plain-script "core" files into one VM context, the way the browser loads them
// (global functions, in the same order as index.html).
import fs from 'node:fs';
import vm from 'node:vm';

const FILES = ['data-core.js', 'session-core.js', 'progress-core.js', 'metrics-core.js', 'report-core.js', 'survey-core.js'];

export function loadCore() {
  const sandbox = vm.createContext({ console });
  for (const file of FILES) {
    vm.runInContext(fs.readFileSync(new URL(`../../assets/js/${file}`, import.meta.url), 'utf8'), sandbox, { filename: file });
  }
  return { core: sandbox, run: (code) => vm.runInContext(code, sandbox) };
}

export const plain = (value) => JSON.parse(JSON.stringify(value)); // drop VM prototypes for deepEqual

// Every label the app can ever send, found by sweeping all plausible values.
export function allLabels(core) {
  const MIN = 60000;
  const HOUR = 3600000;
  const labels = { length: new Set(), calls: new Set(), hours: new Set() };
  for (let ms = 0; ms < 3 * HOUR; ms += 5000) labels.length.add(core.bucketCallLength(ms));
  for (let n = 0; n < 300; n += 1) labels.calls.add(core.bucketDayCalls(n));
  for (let ms = 0; ms < 14 * HOUR; ms += 60000) labels.hours.add(core.bucketDayHours(ms));
  return labels;
}
