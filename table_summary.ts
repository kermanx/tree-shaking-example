import * as fs from 'fs';

interface TimeData {
  jsshaker: Record<string, number>;
  jsshakerNoCache: Record<string, number>;
  [key: string]: Record<string, number>;
}

interface FnSummaryData {
  [benchmark: string]: {
    fnCache: {
      totalCalls: number;
      functionDeclarations: number;
      functionInstances: number;

      hitRate: number;
      cacheHits: number,
      cacheAttempts: number,
      cacheUpdates: number,

      missConfigDisabled: number,
      missNonCopyableThis: number,
      missNonCopyableArgs: number,
      missRestParams: number,
      missNonCopyableReturn: number,
      missStateUntrackable: number,
      missReadDepIncompatible: number,
      missCacheEmpty: number
    };
    [key: string]: any;
  };
}

interface BenchmarkResult {
  benchmark: string;
  withSummary: number;
  withoutSummary: number;
  totalCalls: number;
  defs: number;
  instances: number;
  speedup: number;
  hitRate: number;
  cacheAttempts: number;
  cacheHits: number;
  missNonCopyableReturn: number;
  missStateUntrackable: number;
  missReadDepIncompatible: number;
  missCacheEmpty: number;
  cacheUpdates: number;
}

function loadTimeData(): TimeData {
  const content = fs.readFileSync('time.json', 'utf-8');
  return JSON.parse(content);
}

function loadFnSummaryData(): FnSummaryData {
  const content = fs.readFileSync('fnSummary.json', 'utf-8');
  return JSON.parse(content);
}

function generateMarkdownMissTable(results: BenchmarkResult[]): string {
  // Prepare all data first
  const rows: Array<{
    benchmark: string;
    col0: string;  // totalCalls
    col1: string;  // cacheAttempts/totalCalls*100%
    col2: string;  // missCacheEmpty/cacheAttempts*100%
    col3: string;  // missReadDepIncompatible/cacheAttempts*100%
    col4: string;  // Y = missNonCopyableReturn + missStateUntrackable + cacheUpdates
    col5: string;  // missNonCopyableReturn/Y*100%
    col6: string;  // missStateUntrackable/Y*100%
    col7: string;  // cacheUpdates/Y*100%
  }> = [];

  for (const r of results) {
    const attemptRate = r.totalCalls > 0 ? (r.cacheAttempts / r.totalCalls * 100).toFixed(2) : '0.00';
    const emptyRate = r.cacheAttempts > 0 ? (r.missCacheEmpty / r.cacheAttempts * 100).toFixed(2) : '0.00';
    const depIncompatRate = r.cacheAttempts > 0 ? (r.missReadDepIncompatible / r.cacheAttempts * 100).toFixed(2) : '0.00';
    
    const Y = r.missNonCopyableReturn + r.missStateUntrackable + r.cacheUpdates;
    const nonCpyRetRate = Y > 0 ? (r.missNonCopyableReturn / Y * 100).toFixed(2) : '0.00';
    const stateUntrackableRate = Y > 0 ? (r.missStateUntrackable / Y * 100).toFixed(2) : '0.00';
    const updatesRate = Y > 0 ? (r.cacheUpdates / Y * 100).toFixed(2) : '0.00';
    
    rows.push({
      benchmark: r.benchmark,
      col0: r.totalCalls.toLocaleString('en-US'),
      col1: `${attemptRate}%`,
      col2: `${emptyRate}%`,
      col3: `${depIncompatRate}%`,
      col4: Y.toLocaleString('en-US'),
      col5: `${nonCpyRetRate}%`,
      col6: `${stateUntrackableRate}%`,
      col7: `${updatesRate}%`
    });
  }

  // Calculate totals (not averages)
  const totalTotalCalls = results.reduce((sum, r) => sum + r.totalCalls, 0);
  const totalAttempts = results.reduce((sum, r) => sum + r.cacheAttempts, 0);
  const totalAttemptRate = totalTotalCalls > 0 ? (totalAttempts / totalTotalCalls * 100).toFixed(2) : '0.00';
  
  const totalEmpty = results.reduce((sum, r) => sum + r.missCacheEmpty, 0);
  const totalDepIncompat = results.reduce((sum, r) => sum + r.missReadDepIncompatible, 0);
  const totalEmptyRate = totalAttempts > 0 ? (totalEmpty / totalAttempts * 100).toFixed(2) : '0.00';
  const totalDepIncompatRate = totalAttempts > 0 ? (totalDepIncompat / totalAttempts * 100).toFixed(2) : '0.00';
  
  const totalNonCpyRet = results.reduce((sum, r) => sum + r.missNonCopyableReturn, 0);
  const totalStateUntrack = results.reduce((sum, r) => sum + r.missStateUntrackable, 0);
  const totalUpdates = results.reduce((sum, r) => sum + r.cacheUpdates, 0);
  const totalY = totalNonCpyRet + totalStateUntrack + totalUpdates;
  
  const totalNonCpyRetRate = totalY > 0 ? (totalNonCpyRet / totalY * 100).toFixed(2) : '0.00';
  const totalStateUntrackRate = totalY > 0 ? (totalStateUntrack / totalY * 100).toFixed(2) : '0.00';
  const totalUpdatesRate = totalY > 0 ? (totalUpdates / totalY * 100).toFixed(2) : '0.00';

  rows.push({
    benchmark: '**Average**',
    col0: `**${totalTotalCalls.toLocaleString('en-US')}**`,
    col1: `**${totalAttemptRate}%**`,
    col2: `**${totalEmptyRate}%**`,
    col3: `**${totalDepIncompatRate}%**`,
    col4: `**${totalY.toLocaleString('en-US')}**`,
    col5: `**${totalNonCpyRetRate}%**`,
    col6: `**${totalStateUntrackRate}%**`,
    col7: `**${totalUpdatesRate}%**`
  });

  // Calculate column widths
  const headers = ['Benchmark', '#Calls', 'Attempt(%)', 'Empty(%)', 'DepIncompat(%)', 'OtherMiss', 'NonCpyRet(%)', 'StateUntrk(%)', 'Updates(%)'];
  const colWidths = [
    Math.max(headers[0].length, ...rows.map(r => r.benchmark.replace(/\*\*/g, '').length)),
    Math.max(headers[1].length, ...rows.map(r => r.col0.replace(/\*\*/g, '').length)),
    Math.max(headers[2].length, ...rows.map(r => r.col1.replace(/\*\*/g, '').length)),
    Math.max(headers[3].length, ...rows.map(r => r.col2.replace(/\*\*/g, '').length)),
    Math.max(headers[4].length, ...rows.map(r => r.col3.replace(/\*\*/g, '').length)),
    Math.max(headers[5].length, ...rows.map(r => r.col4.replace(/\*\*/g, '').length)),
    Math.max(headers[6].length, ...rows.map(r => r.col5.replace(/\*\*/g, '').length)),
    Math.max(headers[7].length, ...rows.map(r => r.col6.replace(/\*\*/g, '').length)),
    Math.max(headers[8].length, ...rows.map(r => r.col7.replace(/\*\*/g, '').length))
  ];

  // Build table
  let md = '';
  md += `| ${headers[0].padEnd(colWidths[0])} | ${headers[1].padStart(colWidths[1])} | ${headers[2].padStart(colWidths[2])} | ${headers[3].padStart(colWidths[3])} | ${headers[4].padStart(colWidths[4])} | ${headers[5].padStart(colWidths[5])} | ${headers[6].padStart(colWidths[6])} | ${headers[7].padStart(colWidths[7])} | ${headers[8].padStart(colWidths[8])} |\n`;
  md += `|${'-'.repeat(colWidths[0] + 2)}|${'-'.repeat(colWidths[1] + 2)}:|${'-'.repeat(colWidths[2] + 2)}:|${'-'.repeat(colWidths[3] + 2)}:|${'-'.repeat(colWidths[4] + 2)}:|${'-'.repeat(colWidths[5] + 2)}:|${'-'.repeat(colWidths[6] + 2)}:|${'-'.repeat(colWidths[7] + 2)}:|${'-'.repeat(colWidths[8] + 2)}:|\n`;

  for (const row of rows) {
    const texts = [
      row.benchmark.replace(/\*\*/g, ''),
      row.col0.replace(/\*\*/g, ''),
      row.col1.replace(/\*\*/g, ''),
      row.col2.replace(/\*\*/g, ''),
      row.col3.replace(/\*\*/g, ''),
      row.col4.replace(/\*\*/g, ''),
      row.col5.replace(/\*\*/g, ''),
      row.col6.replace(/\*\*/g, ''),
      row.col7.replace(/\*\*/g, '')
    ];
    const values = [row.benchmark, row.col0, row.col1, row.col2, row.col3, row.col4, row.col5, row.col6, row.col7];
    
    md += `| ${values[0]}${' '.repeat(colWidths[0] - texts[0].length)} | ${' '.repeat(colWidths[1] - texts[1].length)}${values[1]} | ${' '.repeat(colWidths[2] - texts[2].length)}${values[2]} | ${' '.repeat(colWidths[3] - texts[3].length)}${values[3]} | ${' '.repeat(colWidths[4] - texts[4].length)}${values[4]} | ${' '.repeat(colWidths[5] - texts[5].length)}${values[5]} | ${' '.repeat(colWidths[6] - texts[6].length)}${values[6]} | ${' '.repeat(colWidths[7] - texts[7].length)}${values[7]} | ${' '.repeat(colWidths[8] - texts[8].length)}${values[8]} |\n`;
  }

  return md;
}

function generateLatexTable(results: BenchmarkResult[], geometricMean: number): string {
  let latex = '';
  latex += '\\begin{tabular}{lrrrrrrrrrrrrr}\n';
  latex += '\\toprule\n';
  latex += '\\multirow{2}{*}[-0.5ex]{Project} & \\multirow{2}{*}[-0.5ex]{\\#Def} & \\multirow{2}{*}[-0.5ex]{\\#Inst} & \\multirow{2}{*}[-0.5ex]{\\#Calls} & \\multicolumn{3}{c}{Retrival (\\%)} & \\multicolumn{3}{c}{Generation (\\%)} & \\multicolumn{2}{c}{Time (ms)} & \\multirow{2}{*}[-1ex]{\\makecell[r]{Speedup\\\\($\\times$)}} \\\\\n';
  latex += '\\cmidrule(lr){5-7} \\cmidrule(lr){8-10} \\cmidrule(lr){11-12}\n';
  latex += ' & & & & ArgMiss & EnvMiss & Hit & PropRW & ObjRet & Updated & w/o Sum. & w/ Sum. & \\\\\n';
  latex += '\\midrule\n';

  // Calculate totals for percentages
  const totalAttempts = results.reduce((sum, r) => sum + r.cacheAttempts, 0);
  const totalEmpty = results.reduce((sum, r) => sum + r.missCacheEmpty, 0);
  const totalReadDepIncompat = results.reduce((sum, r) => sum + r.missReadDepIncompatible, 0);
  const totalHits = results.reduce((sum, r) => sum + r.cacheHits, 0);
  
  const totalNonCpyRet = results.reduce((sum, r) => sum + r.missNonCopyableReturn, 0);
  const totalStateUntrack = results.reduce((sum, r) => sum + r.missStateUntrackable, 0);
  const totalUpdates = results.reduce((sum, r) => sum + r.cacheUpdates, 0);
  const totalY = totalNonCpyRet + totalStateUntrack + totalUpdates;
  
  const avgArgMiss = totalAttempts > 0 ? (totalEmpty / totalAttempts * 100).toFixed(2) : '0.00';
  const avgEnvMiss = totalAttempts > 0 ? (totalReadDepIncompat / totalAttempts * 100).toFixed(2) : '0.00';
  const avgHit = totalAttempts > 0 ? (totalHits / totalAttempts * 100).toFixed(2) : '0.00';
  const avgPropRW = totalY > 0 ? (totalStateUntrack / totalY * 100).toFixed(2) : '0.00';
  const avgObjRet = totalY > 0 ? (totalNonCpyRet / totalY * 100).toFixed(2) : '0.00';
  const avgUpdated = totalY > 0 ? (totalUpdates / totalY * 100).toFixed(2) : '0.00';
  
  const avgWithoutSummary = results.reduce((sum, r) => sum + r.withoutSummary, 0) / results.length;
  const avgWithSummary = results.reduce((sum, r) => sum + r.withSummary, 0) / results.length;

  for (const r of results) {
    const escapedBenchmark = r.benchmark.replace(/_/g, '\\_');
    const argMiss = r.cacheAttempts > 0 ? (r.missCacheEmpty / r.cacheAttempts * 100).toFixed(2) : '0.00';
    const envMiss = r.cacheAttempts > 0 ? (r.missReadDepIncompatible / r.cacheAttempts * 100).toFixed(2) : '0.00';
    const hit = r.cacheAttempts > 0 ? (r.cacheHits / r.cacheAttempts * 100).toFixed(2) : '0.00';
    
    const Y = r.missNonCopyableReturn + r.missStateUntrackable + r.cacheUpdates;
    const stateUntrk = Y > 0 ? (r.missStateUntrackable / Y * 100).toFixed(2) : '0.00';
    const nonCpyRet = Y > 0 ? (r.missNonCopyableReturn / Y * 100).toFixed(2) : '0.00';
    const updated = Y > 0 ? (r.cacheUpdates / Y * 100).toFixed(2) : '0.00';
    
    latex += `${escapedBenchmark} & ${r.defs.toLocaleString('en-US')} & ${r.instances.toLocaleString('en-US')} & ${r.totalCalls.toLocaleString('en-US')} & ${argMiss} & ${envMiss} & ${hit} & ${stateUntrk} & ${nonCpyRet} & ${updated} & ${r.withoutSummary.toFixed(2)} & ${r.withSummary.toFixed(2)} & ${r.speedup.toFixed(2)} \\\\\n`;
  }

  latex += '\\midrule\n';
  latex += `\\textbf{Average} & & & & \\textbf{${avgArgMiss}} & \\textbf{${avgEnvMiss}} & \\textbf{${avgHit}} & \\textbf{${avgPropRW}} & \\textbf{${avgObjRet}} & \\textbf{${avgUpdated}} & \\textbf{${avgWithoutSummary.toFixed(2)}} & \\textbf{${avgWithSummary.toFixed(2)}} & \\textbf{${geometricMean.toFixed(2)}} \\\\\n`;
  latex += '\\bottomrule\n';
  latex += '\\end{tabular}\n';

  return latex;
}

function main() {
  // Load time data
  const data = loadTimeData();
  const fnSummary = loadFnSummaryData();

  const jsshakerWithSummary = data.jsshaker;
  const jsshakerWithoutSummary = data.jsshakerNoCache;

  // Find common benchmarks
  const commonBenchmarks = Object.keys(jsshakerWithSummary)
    .filter(key => key in jsshakerWithoutSummary)
    .sort();

  // Prepare table data
  const results: BenchmarkResult[] = commonBenchmarks.map(bench => {
    const withSummary = jsshakerWithSummary[bench];
    const withoutSummary = jsshakerWithoutSummary[bench];
    const speedup = withSummary > 0 ? withoutSummary / withSummary : 0;
    const fnCache = fnSummary[bench]?.fnCache;
    const totalCalls = fnCache?.totalCalls || 0;
    const defs = fnCache?.functionDeclarations || 0;
    const instances = fnCache?.functionInstances || 0;
    const hitRate = fnCache?.hitRate || 0;

    return {
      benchmark: bench,
      withSummary,
      withoutSummary,
      totalCalls,
      defs,
      instances,
      speedup,
      hitRate: hitRate * 100, // Convert to percentage
      cacheAttempts: fnCache?.cacheAttempts || 0,
      cacheHits: fnCache?.cacheHits || 0,
      missNonCopyableReturn: fnCache?.missNonCopyableReturn || 0,
      missStateUntrackable: fnCache?.missStateUntrackable || 0,
      missReadDepIncompatible: fnCache?.missReadDepIncompatible || 0,
      missCacheEmpty: fnCache?.missCacheEmpty || 0,
      cacheUpdates: fnCache?.cacheUpdates || 0
    };
  });

  // Calculate geometric mean for speedup (more appropriate for ratios)
  const geometricMeanSpeedup = Math.exp(
    results.reduce((sum, r) => sum + Math.log(r.speedup), 0) / results.length
  );

  // Generate LaTeX table
  const latexTable = generateLatexTable(results, geometricMeanSpeedup);

  // Generate Markdown miss table
  const markdownMissTable = generateMarkdownMissTable(results);

  // Output to console
  console.log(latexTable);
  console.log('\n\n=== Miss Statistics (Markdown) ===\n');
  console.log(markdownMissTable);
}

main();
