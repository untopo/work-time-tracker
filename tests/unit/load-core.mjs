// Loads the plain-script "core" files into one VM context, the way the browser loads them
// (global functions, in the same order as index.html).
import fs from 'node:fs';
import vm from 'node:vm';

const FILES = ['data-core.js', 'session-core.js', 'progress-core.js'];

export function loadCore() {
  const sandbox = vm.createContext({ console });
  for (const file of FILES) {
    vm.runInContext(fs.readFileSync(new URL(`../../assets/js/${file}`, import.meta.url), 'utf8'), sandbox, { filename: file });
  }
  return { core: sandbox, run: (code) => vm.runInContext(code, sandbox) };
}

export const plain = (value) => JSON.parse(JSON.stringify(value)); // drop VM prototypes for deepEqual
