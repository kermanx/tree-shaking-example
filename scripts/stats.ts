import { shakeSingleModule, type FnCacheStat, type ManglingStat } from 'jsshaker';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTestCaseNames } from './config.ts';

const distFolder = join(import.meta.dirname, '../dist');

interface CaseResult {
  name: string;
  fnCache: FnCacheStat;
  fnHitRate: number;
  mangling: ManglingStat;
  manglingRate: number;
}

function fnHitRate(stat: FnCacheStat): number {
  if (stat.cacheAttempts === 0) return 0;
  return stat.cacheHits / stat.cacheAttempts;
}

function manglingRate(stat: ManglingStat): number {
  return stat.staticMangled / stat.staticAll;
}

function pct(rate: number): string {
  return (rate * 100).toFixed(2) + '%';
}

function avg(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((s, v) => s + v, 0) / values.length;
}

function round(n: number): string {
  return Math.round(n).toString();
}

function printTable(title: string, headers: string[], rows: string[][], avgRow: string[]) {
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
      console.warn(`[${name}] Bundled file not found: ${bundledPath}, skipping.`);
      continue;
    }

    console.log(`[${name}] Running jsshaker...`);
    const result = shakeSingleModule(code, {
      preset: 'smallest',
      jsx: 'react',
      enableFnStats: true,
      enableManglingStats: true,
    });

    const fnCache = result.stat.fnCache;
    const mangling = result.stat.mangling;

    if (!fnCache) {
      console.warn(`[${name}] No fnCache stat returned, skipping.`);
      continue;
    }
    if (!mangling) {
      console.warn(`[${name}] No mangling stat returned, skipping.`);
      continue;
    }

    results.push({
      name,
      fnCache,
      fnHitRate: fnHitRate(fnCache),
      mangling,
      manglingRate: manglingRate(mangling),
    });
  }

  // --- Table 1: Fn Cache overview ---
  printTable(
    'Fn Cache Overview',
    ['Name', 'Hit Rate', 'totalCalls', 'cacheAttempts', 'cacheHits', 'cacheMisses', 'cacheUpdates'],
    results.map(r => [
      r.name,
      pct(r.fnHitRate),
      r.fnCache.totalCalls.toString(),
      r.fnCache.cacheAttempts.toString(),
      r.fnCache.cacheHits.toString(),
      r.fnCache.cacheUpdates.toString(),
    ]),
    [
      'Average',
      pct(avg(results.map(r => r.fnHitRate))),
      round(avg(results.map(r => r.fnCache.totalCalls))),
      round(avg(results.map(r => r.fnCache.cacheAttempts))),
      round(avg(results.map(r => r.fnCache.cacheHits))),
      round(avg(results.map(r => r.fnCache.cacheUpdates))),
    ],
  );

  // --- Table 2: Fn Cache miss breakdown (x% (y) format) ---
  // x% = missCount / totalCalls, y = raw count
  type MissKey = keyof Pick<FnCacheStat,
    'missConfigDisabled' | 'missNonCopyableThis' | 'missNonCopyableArgs' |
    'missRestParams' | 'missNonCopyableReturn' | 'missStateUntrackable' |
    'missReadDepIncompatible' | 'missCacheEmpty'>;

  const missKeys: MissKey[] = [
    'missConfigDisabled', 'missNonCopyableThis', 'missNonCopyableArgs',
    'missRestParams', 'missNonCopyableReturn', 'missStateUntrackable',
    'missReadDepIncompatible', 'missCacheEmpty',
  ];
  const missHeaders = [
    'configDisabled', 'nonCopyableThis', 'nonCopyableArgs',
    'restParams', 'nonCopyableReturn', 'stateUntrackable',
    'readDepIncompat', 'cacheEmpty',
  ];

  const missCell = (count: number, total: number) =>
    `${pct(total === 0 ? 0 : count / total)} (${count})`;

  printTable(
    'Fn Cache Miss Breakdown',
    ['Name', ...missHeaders],
    results.map(r => [
      r.name,
      ...missKeys.map(k => missCell(r.fnCache[k], r.fnCache.totalCalls)),
    ]),
    [
      'Average',
      ...missKeys.map(k =>
        missCell(
          Math.round(avg(results.map(r => r.fnCache[k]))),
          Math.round(avg(results.map(r => r.fnCache.totalCalls))),
        )
      ),
    ],
  );

  // --- Table 3: Mangling ---
  printTable(
    'Mangling Rate',
    ['Name', 'Mangle Rate', 'staticMangled', 'staticAll', 'dynamic'],
    results.map(r => [
      r.name,
      pct(r.manglingRate),
      r.mangling.staticMangled.toString(),
      r.mangling.staticAll.toString(),
      r.mangling.dynamic.toString(),
    ]),
    [
      'Average',
      pct(avg(results.map(r => r.manglingRate))),
      round(avg(results.map(r => r.mangling.staticMangled))),
      round(avg(results.map(r => r.mangling.staticAll))),
      round(avg(results.map(r => r.mangling.dynamic))),
    ],
  );

  // --- JSON output ---
  const jsonOutput: Record<string, any> = {};
  for (const r of results) {
    jsonOutput[r.name] = {
      fnCache: {
        hitRate: r.fnHitRate,
        hitRatePct: pct(r.fnHitRate),
        ...r.fnCache,
      },
      mangling: {
        manglingRate: r.manglingRate,
        manglingRatePct: pct(r.manglingRate),
        ...r.mangling,
      },
    };
  }
  const avgFnHitRate = avg(results.map(r => r.fnHitRate));
  const avgManglingRate = avg(results.map(r => r.manglingRate));
  jsonOutput['__average'] = {
    fnCache: { hitRate: avgFnHitRate, hitRatePct: pct(avgFnHitRate) },
    mangling: { manglingRate: avgManglingRate, manglingRatePct: pct(avgManglingRate) },
  };

  const outPath = join(import.meta.dirname, '../data/fnSummary.json');
  await writeFile(outPath, JSON.stringify(jsonOutput, null, 2));
  console.log(`\nResults written to data/fnSummary.json`);
}

main().catch(console.error);
