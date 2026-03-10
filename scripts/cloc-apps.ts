import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import type { ClocResult } from './cloc.ts';

interface AppConfig {
  name: string;
  /** absolute path to the app's monorepo root */
  cwd: string;
  /** pnpm args after "pnpm", e.g. ['run', 'build', '--filter=@vben/web-ele'] */
  pnpmArgs: string[];
}

const VENDOR = resolve(import.meta.dirname, '../vendor');

const APPS: AppConfig[] = [
  {
    name: 'web-ele',
    cwd: `${VENDOR}/vue-vben-admin`,
    pnpmArgs: ['run', 'build', '--filter=@vben/web-ele'],
  },
  {
    name: 'immich-web',
    cwd: `${VENDOR}/immich`,
    pnpmArgs: ['--filter', 'immich-web', 'build'],
  },
  {
    name: 'slidev-demo',
    cwd: `${VENDOR}/slidev-demo`,
    pnpmArgs: ['run', 'build'],
  },
];

async function clocApp(app: AppConfig): Promise<ClocResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', app.pnpmArgs, {
      cwd: app.cwd,
      env: { ...process.env, CLOC: '1' },
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d: Buffer) => (stdout += d));
    child.stderr.on('data', (d: Buffer) => (stderr += d));

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`build failed (exit ${code})\n${stderr}\n${stdout}`));
      }
      // turbo prefixes each line with "<pkg>:build: "; strip it
      const cleaned = stdout.replace(/^[^\n]*?:build: /gm, '');
      // SvelteKit runs vite twice (client + server); take the first match (browser build)
      const match = cleaned.match(/CLOC_JSON_BEGIN\n([\s\S]*?)\nCLOC_JSON_END/);
      if (!match) {
        return reject(new Error(`CLOC_JSON_BEGIN marker not found\nstdout: ${stdout.slice(-2000)}`));
      }
      try {
        resolve(JSON.parse(match[1]) as ClocResult);
      } catch (e) {
        reject(new Error(`Failed to parse cloc JSON: ${(e as Error).message}`));
      }
    });

    child.on('error', reject);
  });
}

function printResult(name: string, result: ClocResult) {
  console.log(`\n=== ${name} ===`);
  const rows: string[][] = [];
  for (const [lang, stats] of Object.entries(result)) {
    if (lang === 'header') continue;
    const s = stats as any;
    rows.push([lang, String(s.nFiles), String(s.code), String(s.comment), String(s.blank)]);
  }
  // sort by code desc, SUM last
  rows.sort((a, b) => {
    if (a[0] === 'SUM') return 1;
    if (b[0] === 'SUM') return -1;
    return Number(b[2]) - Number(a[2]);
  });
  const header = ['Language', 'Files', 'Code', 'Comment', 'Blank'];
  const cols = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const fmt = (row: string[]) => row.map((v, i) => v.padStart(cols[i])).join('  ');
  console.log(fmt(header));
  console.log(cols.map((w) => '-'.repeat(w)).join('  '));
  for (const row of rows) console.log(fmt(row));
}

for (const app of APPS) {
  console.log(`Building ${app.name} with CLOC=1 ...`);
  const result = await clocApp(app);
  printResult(app.name, result);
}
