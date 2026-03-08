import * as fs from 'fs';

interface TimeData {
  jsshaker: Record<string, number>;
  jsshakerNoCache: Record<string, number>;
  [key: string]: Record<string, number>;
}

interface BenchmarkResult {
  benchmark: string;
  withSummary: number;
  withoutSummary: number;
  speedup: number;
}

function loadTimeData(): TimeData {
  const content = fs.readFileSync('time.json', 'utf-8');
  return JSON.parse(content);
}

function generateLatexTable(results: BenchmarkResult[], geometricMean: number): string {
  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Performance comparison of JsShaker with and without function summary cache. Time measured in milliseconds. Speedup calculated as ratio of without/with summary time.}\n';
  latex += '  \\label{tab:function-summary-perf}\n';
  latex += '  \\begin{tabular}{lrrr}\n';
  latex += '    \\toprule\n';
  latex += '    Program & With Summary (ms) & Without Summary (ms) & Speedup \\\\\n';
  latex += '    \\midrule\n';

  for (const r of results) {
    const escapedBenchmark = r.benchmark.replace(/_/g, '\\_');
    latex += `    ${escapedBenchmark} & ${r.withSummary.toFixed(2)} & ${r.withoutSummary.toFixed(2)} & ${r.speedup.toFixed(2)}$\\times$ \\\\\n`;
  }

  latex += '    \\midrule\n';
  latex += `    \\textbf{Geomean} & & & \\textbf{${geometricMean.toFixed(2)}$\\times$} \\\\\n`;
  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';
  latex += '\\end{table}\n';

  return latex;
}

function main() {
  // Load time data
  const data = loadTimeData();

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

    return {
      benchmark: bench,
      withSummary,
      withoutSummary,
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
