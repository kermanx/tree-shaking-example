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
  // Columns: Program + Baseline (Total) + Rolldown (×) + Other stages (%)
  const numColumns = 1 + 1 + 1 + otherStageKeys.length; // Program + Baseline + Rolldown (×) + (%) × other stages
  const columnSpec = 'lrr' + 'r'.repeat(otherStageKeys.length);

  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Time overhead of different optimizers}\n';
  latex += '  \\label{tab:time}\n';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Header row
  latex += '    Program & Baseline (ms) & Rolldown ($\\times$)';
  for (const stageKey of otherStageKeys) {
    const displayName = otherStages[stageKey];
    latex += ` & ${displayName} ($\\times$)`;
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
      let rolldownMultiplierStr: string;
      if (rolldownRatio < 0.005) {
        rolldownMultiplierStr = '<0.01';
      } else if (rolldownRatio < 10) {
        rolldownMultiplierStr = rolldownRatio.toFixed(2);
      } else {
        rolldownMultiplierStr = rolldownRatio.toFixed(1);
      }
      latex += ` & ${rolldownMultiplierStr}`;
    }

    // Output time and percentage for each other stage
    for (const stageKey of otherStageKeys) {
      const time = data[stageKey]?.[testcase];

      if (time === undefined) {
        latex += ' & ---';
      } else {
        const ratio = baselineTotal > 0 ? (time / baselineTotal) : 0;
        let multiplierStr: string;
        if (ratio < 0.005) {
          multiplierStr = '<0.01';
        } else if (ratio < 10) {
          // Small overhead: keep 2 decimal places
          multiplierStr = ratio.toFixed(2);
        } else {
          // Large overhead: use 1 decimal place
          multiplierStr = ratio.toFixed(1);
        }
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
  let rolldownGeomeanStr: string;
  if (rolldownGeomean < 0.005) {
    rolldownGeomeanStr = '<0.01';
  } else if (rolldownGeomean < 10) {
    rolldownGeomeanStr = rolldownGeomean.toFixed(2);
  } else {
    rolldownGeomeanStr = rolldownGeomean.toFixed(1);
  }
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
    let geomeanStr: string;
    if (geomean < 0.005) {
      geomeanStr = '<0.01';
    } else if (geomean < 10) {
      // Small overhead: keep 2 decimal places
      geomeanStr = geomean.toFixed(2);
    } else {
      // Large overhead: use 1 decimal place
      geomeanStr = geomean.toFixed(1);
    }
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
