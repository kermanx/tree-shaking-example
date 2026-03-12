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
const EXCLUDE_TERSER = ["gcc", "gccAdv"]

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

function generateLatexTable(data: TimeData): string {
  // Get all test cases (from rollup stage)
  const testcases = Object.keys(data['rollup'] || {}).sort();
  const otherStageKeys = Object.keys(OTHER_STAGES);

  // Build table header with multi-level headers
  // Columns: Project + Baseline (2 cols) + Optimizer (N cols)
  const columnSpec = 'l@{\\hspace{-3pt}}rr' + 'r'.repeat(otherStageKeys.length);

  let latex = '';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Top-level header row with multirow
  latex += `    \\multirow{2}{*}[-0.5ex]{Project} & \\multicolumn{2}{c}{With Baseline} & \\multicolumn{${otherStageKeys.length}}{c}{Optimizer ($\\times$)} \\\\\n`;
  latex += '    \\cmidrule(lr){2-3} \\cmidrule(lr){4-' + (3 + otherStageKeys.length) + '}\n';
  
  // Sub-header row
  latex += '    & R+T (ms) & RD ($\\times$)';
  for (const stageKey of otherStageKeys) {
    const displayName = OTHER_STAGES[stageKey];
    latex += ` & ${displayName}`;
  }
  latex += ' \\\\\n';
  latex += '    \\midrule\n';

  // Data rows
  for (const testcase of testcases) {
    // Calculate baseline total time for this test case
    let baselineTotal = 0;
    for (const stage of BASELINE_STAGES) {
      const time = data[stage][testcase];
      if (time !== undefined) {
        baselineTotal += time;
      }
    }

    // Escape underscores in testcase name for LaTeX
    const escapedTestcase = testcase.replace(/_/g, '\\_');
    latex += `    ${escapedTestcase}`;

    // Output baseline times
    // const rollupTime = data['rollup'][testcase];
    // const terserTime = data['terser'][testcase];

    // const rollupStr = rollupTime !== undefined ? rollupTime.toFixed(1) : '---';
    // const terserStr = terserTime !== undefined ? terserTime.toFixed(1) : '---';
    const totalStr = baselineTotal > 0 ? Math.round(baselineTotal).toString() : '---';

    // latex += ` & ${rollupStr} & ${terserStr} & ${totalStr}`;
    latex += ` & ${totalStr}`;

    // Output Rolldown ratio
    const rolldownTime = data['rolldown'][testcase];
    if (testcase === 'slidev-demo') {
      latex += ' & ---\\textsuperscript{$\\ast$}';
    } else if (rolldownTime === undefined || baselineTotal === 0) {
      latex += ' & ---';
    } else {
      const rolldownRatio = rolldownTime / baselineTotal;
      const rolldownMultiplierStr = formatMultiplier(rolldownRatio);
      latex += ` & ${rolldownMultiplierStr}`;
    }

    // First pass: calculate all ratios to find the best (minimum)
    // Note: time.json stores only optimizer overhead time
    const ratios: Map<string, number> = new Map();
    let minRatio = Infinity;
    
    for (const stageKey of otherStageKeys) {
      const time = data[stageKey][testcase];
      if (time !== undefined && baselineTotal > 0) {
        const rollupTime = data['rollup'][testcase] || NaN;
        const terserTime = data['terser'][testcase] || NaN;
        // For gcc/gccAdv: they don't use terser, so ratio = (optimizer + rollup) / (rollup + terser)
        // For others: ratio = (optimizer + rollup + terser) / (rollup + terser)
        const numerator = EXCLUDE_TERSER.includes(stageKey) 
          ? (time + rollupTime) 
          : (time + rollupTime + terserTime);
        const ratio = numerator / baselineTotal;
        ratios.set(stageKey, ratio);
        minRatio = Math.min(minRatio, ratio);
      }
    }

    // Output time and percentage for each other stage
    for (const stageKey of otherStageKeys) {
      const time = data[stageKey][testcase];

      if (time === undefined) {
        latex += ' & ---';
      } else {
        const ratio = ratios.get(stageKey);
        if (ratio === undefined) {
          latex += ' & ---';
        } else {
          const multiplierStr = formatMultiplier(ratio);
          // Bold if this is the best (minimum ratio)
          const isBest = ratio === minRatio;
          const formattedValue = isBest ? `\\textbf{${multiplierStr}}` : multiplierStr;
          latex += ` & ${formattedValue}`;
        }
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
    const rollupTime = data['rollup'][testcase];
    const terserTime = data['terser'][testcase];
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
    const rolldownTime = data['rolldown'][testcase];
    if (rolldownTime !== undefined) {
      let baselineTotal = 0;
      for (const stage of BASELINE_STAGES) {
        const baselineTime = data[stage][testcase];
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
      const time = data[stageKey][testcase];
      if (time !== undefined) {
        // Calculate baseline for this testcase
        let baselineTotal = 0;
        for (const stage of BASELINE_STAGES) {
          const baselineTime = data[stage][testcase];
          if (baselineTime !== undefined) {
            baselineTotal += baselineTime;
          }
        }
        if (baselineTotal > 0) {
          const rollupTime = data['rollup'][testcase] || NaN;
          const terserTime = data['terser'][testcase] || NaN;
          // For gcc/gccAdv: they don't use terser, so ratio = (optimizer + rollup) / (rollup + terser)
          // For others: ratio = (optimizer + rollup + terser) / (rollup + terser)
          const numerator = EXCLUDE_TERSER.includes(stageKey) 
            ? (time + rollupTime) 
            : (time + rollupTime + terserTime);
          const ratio = numerator / baselineTotal;
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

  return latex;
}

function main() {
  // Load data
  const times = loadTimes();

  // Debug output: Calculate and print average times for rollup and terser
  const testcases = Object.keys(times['rollup'] || {});
  
  // Calculate arithmetic mean (simple average)
  let rollupTotal = 0;
  let rollupCount = 0;
  let terserTotal = 0;
  let terserCount = 0;

  for (const testcase of testcases) {
    const rollupTime = times['rollup'][testcase];
    const terserTime = times['terser'][testcase];
    
    if (rollupTime !== undefined) {
      rollupTotal += rollupTime;
      rollupCount++;
    }
    if (terserTime !== undefined) {
      terserTotal += terserTime;
      terserCount++;
    }
  }

  const rollupAvg = rollupCount > 0 ? rollupTotal / rollupCount : 0;
  const terserAvg = terserCount > 0 ? terserTotal / terserCount : 0;

  console.log('=== Debug Output (Arithmetic Mean) ===');
  console.log(`Rollup arithmetic mean: ${rollupAvg.toFixed(2)} ms`);
  console.log(`Terser arithmetic mean: ${terserAvg.toFixed(2)} ms`);
  console.log(`Total arithmetic mean (Rollup + Terser): ${(rollupAvg + terserAvg).toFixed(2)} ms`);
  console.log('');
  
  // Note: The table uses geometric mean of ratios, not arithmetic mean of times
  console.log('Note: The "Average" row in the table shows geometric mean of');
  console.log('      time ratios, which is different from the arithmetic mean above.');
  console.log('=====================================\n');

  // Generate LaTeX table
  const latexTable = generateLatexTable(times);

  // Output to console
  console.log(latexTable);
}

main();
