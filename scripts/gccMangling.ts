import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import binaryPath from 'google-closure-compiler-linux';
import { parseModule, parseScript } from 'meriyah';
import { walk } from 'estree-walker';
import { getTestCaseNames, getTestCaseConfig } from './config.ts';

const distFolder = join(import.meta.dirname, '../dist');

// Replicate cc.ts preprocessing exactly
function preprocess(code: string): string {
  if (
    code.includes('const Text = ') ||
    code.includes('var Symbol = root$1.Symbol') ||
    code.includes('var escape = (function (str) {') ||
    code.includes('var Selection = selection.prototype.constructor') ||
    code.includes('class Keyframe {') ||
    code.includes('const Map = getNative(root,') ||
    code.includes('var dump  ')
  ) {
    code = `(function(){${code}})()`;
  }
  if (code.includes('supportsWebCodecsH264Decode = await _checkWebCodecsH264DecodeSupport')) {
    code = `(async function(){${code}})()`;
  }
  return code;
}

// Run GCC (same options as gccAdv) with an extra property_renaming_report flag.
// Returns compiled output code; report is written to reportPath.
function runGcc(jsSource: string, env: string, reportPath: string): Promise<string> {
  const nodeBuiltinStub = join(import.meta.dirname, 'cc-node-builtins.js');
  const prefixReplacements = env !== 'browser'
    ? ['node:stream', 'node:url', 'node:path', 'fs', 'node:fs/promises',
       'node:events', 'node:string_decoder', 'node:fs']
        .flatMap(name => ['--browser_resolver_prefix_replacements', `${name}=${nodeBuiltinStub}`])
    : [];

  const args = [
    '--compilation_level=ADVANCED',
    '--language_in=ECMASCRIPT_NEXT',
    '--language_out=ECMASCRIPT_NEXT',
    '--chunk_output_type=ES_MODULES',
    `--module_resolution=${env === 'browser' ? 'BROWSER' : 'BROWSER_WITH_TRANSFORMED_PREFIXES'}`,
    `--externs=${join(import.meta.dirname, `cc-${env}-externs.js`)}`,
    `--property_renaming_report=${reportPath}`,
    ...prefixReplacements,
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(binaryPath, args, { stdio: 'pipe' });
    let output = '';
    let stderr = '';
    child.stdout.on('data', (c: Buffer) => { output += c.toString(); });
    child.stderr.on('data', (c: Buffer) => { stderr += c.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`GCC failed (exit ${code}):\n${stderr.slice(-500)}`));
    });
    child.stdin.write(jsSource);
    child.stdin.end();
  });
}

// Parse the renaming report (format: originalName:newName per line).
// Returns the set of new (mangled) names.
function parseReport(report: string): Set<string> {
  const newNames = new Set<string>();
  for (const line of report.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const newName = trimmed.slice(idx + 1).trim();
    if (newName) newNames.add(newName);
  }
  return newNames;
}

// Extract property name → occurrence count from compiled output via AST traversal.
// Covers: obj.prop, {prop: v}, {prop}, class { method(){} }, class { field = v }.
function extractProperties(code: string): Map<string, number> {
  const counts = new Map<string, number>();
  const add = (name: string) => counts.set(name, (counts.get(name) ?? 0) + 1);

  let ast: any;
  try {
    ast = parseModule(code, { next: true });
  } catch {
    try {
      ast = parseScript(code, { next: true });
    } catch {
      return counts;
    }
  }

  walk(ast, {
    enter(node: any) {
      // obj.prop  (MemberExpression, non-computed)
      if (node.type === 'MemberExpression' && !node.computed && node.property?.type === 'Identifier') {
        add(node.property.name);
      }
      // { prop: value }  or  { prop }  (ObjectExpression / ObjectPattern)
      if (node.type === 'Property' && !node.computed && node.key?.type === 'Identifier') {
        add(node.key.name);
      }
      // class { method() {} }  and  class { field = v }
      if ((node.type === 'MethodDefinition' || node.type === 'PropertyDefinition') &&
          !node.computed && node.key?.type === 'Identifier') {
        add(node.key.name);
      }
    },
  });

  return counts;
}

interface Stats {
  mangled: number;
  notMangled: number;
  total: number;
  rate: number;
}

interface CaseResult {
  name: string;
  byName: Stats;    // Mode 1: unique property names
  weighted: Stats;  // Mode 2: weighted by occurrence count
}

function calcStats(propCounts: Map<string, number>, newNames: Set<string>): Pick<CaseResult, 'byName' | 'weighted'> {
  let mangledNames = 0, notMangledNames = 0;
  let mangledCount = 0, notMangledCount = 0;

  for (const [prop, count] of propCounts) {
    if (newNames.has(prop)) {
      mangledNames++;
      mangledCount += count;
    } else {
      notMangledNames++;
      notMangledCount += count;
    }
  }

  const toStats = (mangled: number, notMangled: number): Stats => {
    const total = mangled + notMangled;
    return { mangled, notMangled, total, rate: total === 0 ? 0 : mangled / total };
  };

  return {
    byName: toStats(mangledNames, notMangledNames),
    weighted: toStats(mangledCount, notMangledCount),
  };
}

function pct(r: number) { return (r * 100).toFixed(2) + '%'; }
function avg(vals: number[]) { return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; }
function round(n: number) { return Math.round(n).toString(); }

function printTable(
  title: string,
  headers: string[],
  rows: string[][],
  avgRow: string[],
) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => (r[i] ?? '').length), (avgRow[i] ?? '').length)
  );
  const sep = '-'.repeat(colWidths.reduce((s, w) => s + w + 2, 0) - 2);
  const fmt = (cells: string[]) =>
    cells.map((c, i) => i === 0 ? c.padEnd(colWidths[i]) : c.padStart(colWidths[i])).join('  ');

  console.log(`\n=== ${title} ===`);
  console.log(sep);
  console.log(fmt(headers));
  console.log(sep);
  for (const row of rows) console.log(fmt(row));
  console.log(sep);
  console.log(fmt(avgRow));
  console.log(sep);
}

async function main() {
  const names = getTestCaseNames();
  const results: CaseResult[] = [];

  for (const name of names) {
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    let code: string;
    try {
      code = await readFile(bundledPath, 'utf-8');
    } catch {
      console.warn(`[${name}] Bundled file not found, skipping.`);
      continue;
    }

    const env = getTestCaseConfig(name).env;
    code = preprocess(code);

    const tmpDir = await mkdtemp(join(tmpdir(), `gcc-mangling-${name}-`));
    const reportPath = join(tmpDir, 'props.report');

    let gccOutput: string;
    let reportContent: string;
    try {
      console.log(`[${name}] Running GCC...`);
      gccOutput = await runGcc(code, env, reportPath);
      reportContent = await readFile(reportPath, 'utf-8').catch(() => '');
    } catch (e) {
      console.warn(`[${name}] GCC failed:`, (e as Error).message.split('\n')[0]);
      await rm(tmpDir, { recursive: true });
      continue;
    }

    await rm(tmpDir, { recursive: true });

    const newNames = parseReport(reportContent);
    const propCounts = extractProperties(gccOutput);
    const { byName, weighted } = calcStats(propCounts, newNames);

    console.log(`[${name}] report entries: ${newNames.size}, output props: ${propCounts.size}`);
    results.push({ name, byName, weighted });
  }

  if (results.length === 0) {
    console.error('No results collected.');
    return;
  }

  // --- Table 1: by unique property name ---
  printTable(
    'Property Mangling — By Unique Name',
    ['Name', 'Mangle Rate', 'Mangled', 'Not Mangled', 'Total'],
    results.map(r => [
      r.name,
      pct(r.byName.rate),
      r.byName.mangled.toString(),
      r.byName.notMangled.toString(),
      r.byName.total.toString(),
    ]),
    [
      'Average',
      pct(avg(results.map(r => r.byName.rate))),
      round(avg(results.map(r => r.byName.mangled))),
      round(avg(results.map(r => r.byName.notMangled))),
      round(avg(results.map(r => r.byName.total))),
    ],
  );

  // --- Table 2: weighted by occurrence count ---
  printTable(
    'Property Mangling — Weighted by Occurrence (Post-DCE Output)',
    ['Name', 'Mangle Rate', 'Mangled', 'Not Mangled', 'Total'],
    results.map(r => [
      r.name,
      pct(r.weighted.rate),
      r.weighted.mangled.toString(),
      r.weighted.notMangled.toString(),
      r.weighted.total.toString(),
    ]),
    [
      'Average',
      pct(avg(results.map(r => r.weighted.rate))),
      round(avg(results.map(r => r.weighted.mangled))),
      round(avg(results.map(r => r.weighted.notMangled))),
      round(avg(results.map(r => r.weighted.total))),
    ],
  );

  // --- JSON output ---
  const jsonOutput: Record<string, any> = {};
  for (const r of results) {
    jsonOutput[r.name] = {
      byName: { ...r.byName, ratePct: pct(r.byName.rate) },
      weighted: { ...r.weighted, ratePct: pct(r.weighted.rate) },
    };
  }
  jsonOutput['__average'] = {
    byName: {
      rate: avg(results.map(r => r.byName.rate)),
      ratePct: pct(avg(results.map(r => r.byName.rate))),
    },
    weighted: {
      rate: avg(results.map(r => r.weighted.rate)),
      ratePct: pct(avg(results.map(r => r.weighted.rate))),
    },
  };

  const outPath = join(import.meta.dirname, '../data/gccMangling.json');
  await writeFile(outPath, JSON.stringify(jsonOutput, null, 2));
  console.log(`\nResults written to data/gccMangling.json`);
}

main().catch(console.error);
