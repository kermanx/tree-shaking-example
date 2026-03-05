import * as fs from 'fs';

// Configuration: which stages to display (ordered mapping from field name to display name)
const BASELINE_STAGES = ["rollup", "terser"];
const OTHER_STAGES: Record<string, string> = {
  "jsshaker": "JsShaker",
  "gcc": "CC\\textsubscript{Simp.}",
  "gccAdv": "CC\\textsubscript{Adv.}",
  "lacuna2": "Lacuna\\textsubscript{O2}",
  "lacuna3": "Lacuna\\textsubscript{O3}",
  // "dfahc": "DFAHC",
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

function formatMultiplier(ratio: number): string {
  if (ratio < 0.005) {
    return '<0.01';
  } else if (ratio < 10) {
    return ratio.toFixed(2);
  } else if (ratio < 100) {
    return ratio.toFixed(1);
  } else {
    return ratio.toFixed(0);
  }
}

function generateLatexTable(data: TimeData, baselineStages: string[], otherStages: Record<string, string>): string {
  // Get all test cases (from rollup stage)
  const testcases = Object.keys(data['rollup'] || {}).sort();
  const otherStageKeys = Object.keys(otherStages);

  // Build table header with multi-level headers
  // Columns: Program + Baseline (2 cols) + Optimizer (N cols)
  const numColumns = 1 + 2 + otherStageKeys.length; // Program + (Baseline: ms + Rolldown) + other stages
  const columnSpec = 'lrr' + 'r'.repeat(otherStageKeys.length);

  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Time overhead of different optimizers}\n';
  latex += '  \\label{tab:time}\n';
  latex += '  \\setlength{\\tabcolsep}{3.5pt}\n';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Top-level header row with multirow
  latex += `    \\multirow{2}{*}[-0.5ex]{Program} & \\multicolumn{2}{c}{Baseline} & \\multicolumn{${otherStageKeys.length}}{c}{Optimizer ($\\times$)} \\\\\n`;
  latex += '    \\cmidrule(lr){2-3} \\cmidrule(lr){4-' + (3 + otherStageKeys.length) + '}\n';
  
  // Sub-header row
  latex += '    & Rollup+Terser (ms) & Rolldown ($\\times$)';
  for (const stageKey of otherStageKeys) {
    const displayName = otherStages[stageKey];
    latex += ` & ${displayName}`;
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
    const totalStr = baselineTotal > 0 ? Math.round(baselineTotal).toString() : '---';

    // latex += ` & ${rollupStr} & ${terserStr} & ${totalStr}`;
    latex += ` & ${totalStr}`;

    // Output Rolldown ratio
    const rolldownTime = data['rolldown']?.[testcase];
    if (rolldownTime === undefined || baselineTotal === 0) {
      latex += ' & ---';
    } else {
      const rolldownRatio = rolldownTime / baselineTotal;
      const rolldownMultiplierStr = formatMultiplier(rolldownRatio);
      latex += ` & ${rolldownMultiplierStr}`;
    }

    // Output time and percentage for each other stage
    for (const stageKey of otherStageKeys) {
      const time = data[stageKey]?.[testcase];

      if (time === undefined) {
        latex += ' & ---';
      } else {
        const ratio = baselineTotal > 0 ? (time / baselineTotal) : 0;
        const multiplierStr = formatMultiplier(ratio);
        // Bold if this is JsShaker (best performance)
        const isBest = stageKey === 'jsshaker';
        const formattedValue = isBest ? `\\textbf{${multiplierStr}}` : multiplierStr;
        latex += ` & ${formattedValue}`;
      }
    }

    latex += ' \\\\\n';
  }

  // Add total row
  latex += '    \\midrule\n';
  latex += '    \\textbf{Average}';

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
  latex += ` & \\textbf{---}`;

  // Calculate geometric mean for Rolldown
  let rolldownProduct = 1;
  let rolldownCount = 0;
  for (const testcase of testcases) {
    const rolldownTime = data['rolldown']?.[testcase];
    if (rolldownTime !== undefined) {
      let baselineTotal = 0;
      for (const stage of baselineStages) {
        const baselineTime = data[stage]?.[testcase];
        if (baselineTime !== undefined) {
          baselineTotal += baselineTime;
        }
      }
      if (baselineTotal > 0) {
        const ratio = rolldownTime / baselineTotal;
        rolldownProduct *= ratio;
        rolldownCount++;
      }
    }
  }
  const rolldownGeomean = rolldownCount > 0 ? Math.pow(rolldownProduct, 1 / rolldownCount) : 0;
  const rolldownGeomeanStr = formatMultiplier(rolldownGeomean);
  latex += ` & \\textbf{${rolldownGeomeanStr}}`;

  // Calculate geometric mean for other stages
  for (const stageKey of otherStageKeys) {
    let product = 1;
    let count = 0;
    for (const testcase of testcases) {
      const time = data[stageKey]?.[testcase];
      if (time !== undefined) {
        // Calculate baseline for this testcase
        let baselineTotal = 0;
        for (const stage of baselineStages) {
          const baselineTime = data[stage]?.[testcase];
          if (baselineTime !== undefined) {
            baselineTotal += baselineTime;
          }
        }
        if (baselineTotal > 0) {
          const ratio = time / baselineTotal;
          product *= ratio;
          count++;
        }
      }
    }
    const geomean = count > 0 ? Math.pow(product, 1 / count) : 0;
    const geomeanStr = formatMultiplier(geomean);
    latex += ` & \\textbf{${geomeanStr}}`;
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
