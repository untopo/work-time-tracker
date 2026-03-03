import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(process.cwd());
const distDir = resolve(rootDir, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const entry of ['index.html', 'assets', 'version.json']) {
  const source = resolve(rootDir, entry);
  const target = resolve(distDir, entry);
  if (!existsSync(source)) {
    throw new Error(`Missing required build asset: ${entry}`);
  }
  cpSync(source, target, { recursive: true });
}

console.log('Prepared dist/ for desktop packaging.');
