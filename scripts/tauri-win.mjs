import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const rootDir = resolve(process.cwd());
const args = process.argv.slice(2);
const cargoBin = resolve(process.env.USERPROFILE || process.env.HOME || '.', '.cargo', 'bin');
const vsDevCmd = resolve(
  process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
  'Microsoft Visual Studio',
  '2022',
  'BuildTools',
  'Common7',
  'Tools',
  'VsDevCmd.bat'
);

if (!existsSync(vsDevCmd)) {
  console.error('Could not find VsDevCmd.bat at:');
  console.error(vsDevCmd);
  process.exit(1);
}

const tempDir = mkdtempSync(join(tmpdir(), 'wtt-tauri-'));
const runnerPath = join(tempDir, 'tauri-runner.cmd');
const tauriArgs = args
  .map((arg) => `"${arg.replace(/"/g, '""')}"`)
  .join(' ');

writeFileSync(
  runnerPath,
  [
    '@echo off',
    `call "${vsDevCmd}" -arch=x64 -host_arch=x64 >nul`,
    'if errorlevel 1 exit /b %errorlevel%',
    `npx tauri ${tauriArgs}`,
    'exit /b %errorlevel%'
  ].join('\r\n'),
  'utf8'
);

const child = spawn('cmd.exe', ['/d', '/c', runnerPath], {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: existsSync(cargoBin)
      ? `${cargoBin};${process.env.PATH || ''}`
      : process.env.PATH
  }
});

child.on('exit', (code) => {
  rmSync(tempDir, { recursive: true, force: true });
  process.exit(code ?? 1);
});
