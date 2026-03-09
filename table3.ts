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
      [key: string]: any;
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
}

function loadTimeData(): TimeData {
  const content = fs.readFileSync('time.json', 'utf-8');
  return JSON.parse(content);
}

function loadFnSummaryData(): FnSummaryData {
  const content = fs.readFileSync('fnSummary.json', 'utf-8');
  return JSON.parse(content);
}

function generateLatexTable(results: BenchmarkResult[], geometricMean: number): string {
  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Ablation study of function summaries. The summarization mechanism prevents exponential analysis blowup in heavily structured programs, yielding a 1.65$\\times$ geometric mean speedup overall. Slight performance regressions occur when the caching overhead outweighs the cost of directly evaluating structurally trivial functions.}\n';
  latex += '  \\label{tab:function-summary-speedup}\n';
  latex += '  \\begin{tabular}{lrrrrrr}\n';
  latex += '    \\toprule\n';
  latex += '    Program & Defs & Instances & Total Calls & w/o Sum. (ms) & w/ Sum. (ms) & Speedup ($\\times$) \\\\\n';
  latex += '    \\midrule\n';

  for (const r of results) {
    const escapedBenchmark = r.benchmark.replace(/_/g, '\\_');
    latex += `    ${escapedBenchmark} & ${r.defs.toLocaleString('en-US')} & ${r.instances.toLocaleString('en-US')} & ${r.totalCalls.toLocaleString('en-US')} & ${r.withoutSummary.toFixed(2)} & ${r.withSummary.toFixed(2)} & ${r.speedup.toFixed(2)} \\\\\n`;
  }

  latex += '    \\midrule\n';
  latex += `    \\textbf{Geomean} & & & & & & \\textbf{${geometricMean.toFixed(2)}} \\\\\n`;
  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';
  latex += '\\end{table}\n';

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
    const totalCalls = fnSummary[bench]?.fnCache?.totalCalls || 0;
    const defs = fnSummary[bench]?.fnCache?.functionDeclarations || 0;
    const instances = fnSummary[bench]?.fnCache?.functionInstances || 0;

    return {
      benchmark: bench,
      withSummary,
      withoutSummary,
      totalCalls,
      defs,
      instances,
      speedup
    };
  });

  // Calculate geometric mean for speedup (more appropriate for ratios)
  const geometricMeanSpeedup = Math.exp(
    results.reduce((sum, r) => sum + Math.log(r.speedup), 0) / results.length
  );

  // Generate LaTeX table
  const latexTable = generateLatexTable(results, geometricMeanSpeedup);

  // Output to console
  console.log(latexTable);
}

main();
