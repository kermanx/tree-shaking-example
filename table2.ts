import * as fs from 'fs';

// Configuration: which stages to display (ordered mapping from field name to display name)
const BASELINE_STAGES = ["rollup", "terser"];
const OTHER_STAGES: Record<string, string> = {
  "jsshaker": "JsShaker",
  "gcc": "CC\\textsubscript{Simp.}",
  "gccAdv": "CC\\textsubscript{Adv.}",
  "lacuna2": "Lacuna\\textsubscript{O2}",
  "lacuna3": "Lacuna\\textsubscript{O3}",
};

interface TimeData {
  [stage: string]: {
    [testcase: string]: number;
  };
}

function loadTimes(filename: string = "time.json"): TimeData {
  const content = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(content);
}

function generateLatexTable(data: TimeData, baselineStages: string[], otherStages: Record<string, string>): string {
  // Get all test cases (from rollup stage)
  const testcases = Object.keys(data['rollup'] || {}).sort();
  const otherStageKeys = Object.keys(otherStages);

  // Build table header
  // Columns: Program + Baseline (Time, %, Total) + Other stages (Time, %)
  const numColumns = 1 + 3 + otherStageKeys.length * 2; // Program + (Rollup, Terser, Total) + (Time, %) × other stages
  const columnSpec = 'l' + 'rrr' + 'rr'.repeat(otherStageKeys.length);

  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Time overhead of different optimiziers}\n';
  latex += '  \\label{tab:time}\n';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Header row
  latex += '    Program & Baseline';
  for (const stageKey of otherStageKeys) {
    const displayName = otherStages[stageKey];
    latex += ` & \\multicolumn{2}{c}{${displayName}}`;
  }
  latex += ' \\\\\n';

  // Sub-header row
  latex += '    ';
  latex += ' & (ms)';
  for (let i = 0; i < otherStageKeys.length; i++) {
    latex += ' & (ms) & (×)';
  }
  latex += ' \\\\\n';
  latex += '    \\midrule\n';

  // Data rows
  for (const testcase of testcases) {
    // Calculate baseline total time for this test case
    let baselineTotal = 0;
    for (const stage of baselineStages) {
      const time = data[stage]?.[testcase];
      if (time !== undefined) {
        baselineTotal += time;
      }
    }

    // Escape underscores in testcase name for LaTeX
    const escapedTestcase = testcase.replace(/_/g, '\\_');
    latex += `    ${escapedTestcase}`;

    // Output baseline times
    // const rollupTime = data['rollup']?.[testcase];
    // const terserTime = data['terser']?.[testcase];

    // const rollupStr = rollupTime !== undefined ? rollupTime.toFixed(1) : '---';
    // const terserStr = terserTime !== undefined ? terserTime.toFixed(1) : '---';
    const totalStr = baselineTotal > 0 ? baselineTotal.toFixed(1) : '---';

    // latex += ` & ${rollupStr} & ${terserStr} & ${totalStr}`;
    latex += ` & ${totalStr}`;

    // Output time and percentage for each other stage
    for (const stageKey of otherStageKeys) {
      const time = data[stageKey]?.[testcase];

      if (time === undefined) {
        latex += ' & --- & ---';
      } else {
        const timeStr = time.toFixed(1);
        const multiplier = baselineTotal > 0 ? (time / baselineTotal).toFixed(2) : '0.00';
        latex += ` & ${timeStr} & $${multiplier}\\times$`;
      }
    }

    latex += ' \\\\\n';
  }

  // Add total row
  latex += '    \\midrule\n';
  latex += '    \\textbf{Total}';

  // Calculate baseline totals
  let rollupTotal = 0;
  let terserTotal = 0;
  for (const testcase of testcases) {
    const rollupTime = data['rollup']?.[testcase];
    const terserTime = data['terser']?.[testcase];
    if (rollupTime !== undefined) rollupTotal += rollupTime;
    if (terserTime !== undefined) terserTotal += terserTime;
  }
  const baselineGrandTotal = rollupTotal + terserTotal;

  // latex += ` & \\textbf{${rollupTotal.toFixed(1)}} & \\textbf{${terserTotal.toFixed(1)}} & \\textbf{${baselineGrandTotal.toFixed(1)}}`;
  latex += ` & \\textbf{1$\\times$}`;

  // Calculate totals for other stages
  for (const stageKey of otherStageKeys) {
    let stageTotal = 0;
    let correspondingBaselineTotal = 0;
    for (const testcase of testcases) {
      const time = data[stageKey]?.[testcase];
      if (time !== undefined) {
        stageTotal += time;
        // Add baseline time for this testcase (only for successful cases)
        for (const stage of baselineStages) {
          const baselineTime = data[stage]?.[testcase];
          if (baselineTime !== undefined) {
            correspondingBaselineTotal += baselineTime;
          }
        }
      }
    }
    const timeStr = stageTotal.toFixed(1);
    const multiplier = correspondingBaselineTotal > 0 ? (stageTotal / correspondingBaselineTotal).toFixed(2) : '0.00';
    latex += ` &  & \\textbf{${multiplier}$\\times$}`;
  }

  latex += ' \\\\\n';
  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';
  latex += '\\end{table}\n';

  return latex;
}

function main() {
  // Load data
  const times = loadTimes();

  // Generate LaTeX table
  const latexTable = generateLatexTable(times, BASELINE_STAGES, OTHER_STAGES);

  // Output to console
  console.log(latexTable);
}

main();
