import * as fs from 'fs';

// Configuration: which toolchains to display (ordered mapping from field name to display name)
const TOOLCHAINS: Record<string, string> = {
  "rollup_terser": "Rollup + Terser",
  "rollup_jsshaker_terser": "JsShaker",
  "rollup_gcc_terser": "CC\\textsubscript{Simp.}",
  "rollup_gccAdv_terser": "CC\\textsubscript{Adv.}",
  "rollup_lacuna2_terser": "Lacuna\\textsubscript{O2}",
  "rollup_lacuna3_terser": "Lacuna\\textsubscript{O3}",
  "rollup_dfahc2_terser": "DFAHC",
};

const DEFAULT_BASELINE = "rollup_terser";
const BASELINE_MAPPINGS: Record<string, string> = {
  "rollup_dfahc_terser": "rollup_dfahcBaseline_terser"
};

const SHOW_GZ = true;

interface ToolchainData {
  size: number;
  gz_size: number;
}

interface TestCaseData {
  [toolchain: string]: ToolchainData;
}

interface ParsedData {
  [testcase: string]: TestCaseData;
}

interface FailedTests {
  [optimizer: string]: string[];
}

function loadSizes(filename: string = "sizes.json"): Record<string, number> {
  const content = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(content);
}

function loadFailedTests(filename: string = "failed.json"): FailedTests {
  try {
    const content = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

function parseData(sizes: Record<string, number>, toolchains: Record<string, string>): ParsedData {
  const data: ParsedData = {};

  // Collect all toolchain keys including baselines from BASELINE_MAPPINGS
  const allToolchains = new Set([
    ...Object.keys(toolchains),
    ...Object.values(BASELINE_MAPPINGS)
  ]);

  for (const [key, value] of Object.entries(sizes)) {
    // Skip .gz entries, we'll handle them separately
    if (key.endsWith('.gz')) {
      continue;
    }

    // Parse the key: {testcase}_{toolchain}
    // Find where the toolchain starts by checking against all known toolchains
    for (const toolchain of allToolchains) {
      if (key.endsWith('_' + toolchain)) {
        const testcase = key.slice(0, -toolchain.length - 1);

        if (!data[testcase]) {
          data[testcase] = {};
        }

        data[testcase][toolchain] = {
          size: value,
          gz_size: sizes[SHOW_GZ ? `${key}.gz` : key] || 0
        };
        break;
      }
    }
  }

  return data;
}

function generateLatexTable(data: ParsedData, toolchains: Record<string, string>, failedTests: FailedTests): string {
  const testcases = Object.keys(data).sort();
  const toolchainKeys = Object.keys(toolchains);

  // Build table header
  const numColumns = 1 + 1 + (toolchainKeys.length - 1); // Program + Baseline + Other toolchains
  const columnSpec = 'l' + 'r'.repeat(numColumns - 1);

  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Size improvement for target programs}\n';
  latex += '  \\label{tab:size-reduction}\n';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Header row
  latex += '    Program & Baseline (KB)';
  for (let i = 1; i < toolchainKeys.length; i++) {
    const displayName = toolchains[toolchainKeys[i]];
    // Escape special LaTeX characters
    const escapedName = displayName.replace(/&/g, '\\&');
    latex += ` & ${escapedName}`;
  }
  latex += ' \\\\\n';
  latex += '    \\midrule\n';

  // Calculate max widths for alignment
  const maxTestcaseWidth = Math.max(...testcases.map(t => t.replace(/_/g, '\\_').length));
  const maxBaselineWidth = Math.max(...testcases.map(t => {
    const baselineGzSize = data[t][DEFAULT_BASELINE]?.gz_size || 0;
    return (baselineGzSize / 1024).toFixed(2).length;
  }));

  // Data rows
  for (const testcase of testcases) {
    const testcaseData = data[testcase];
    const baselineGzSize = testcaseData[DEFAULT_BASELINE]?.gz_size || 0;

    // First pass: calculate all reduction percentages to find the best
    const reductions: Array<{ index: number; value: number; failed: boolean; allFail: boolean }> = [];
    for (let i = 1; i < toolchainKeys.length; i++) {
      const toolchain = toolchainKeys[i];

      // Check if this toolchain has been tested
      if (failedTests[toolchain] === undefined) {
        throw new Error(`Toolchain "${toolchain}" not found in failed.json. Please run verify for this toolchain first.`);
      }

      const isAllFail = failedTests[toolchain].includes(testcase);

      if (!testcaseData[toolchain]) {
        reductions.push({ index: i, value: -Infinity, failed: false, allFail: isAllFail });
        continue;
      }

      const toolchainData = testcaseData[toolchain];
      const gzSize = toolchainData.gz_size;
      const size = toolchainData.size;

      // Determine the baseline for this toolchain
      const baselineKey = BASELINE_MAPPINGS[toolchain] || DEFAULT_BASELINE;
      const toolchainBaselineGzSize = testcaseData[baselineKey]?.gz_size || 0;

      if (size <= 20) {
        reductions.push({ index: i, value: -Infinity, failed: true, allFail: isAllFail });
      } else if (toolchainBaselineGzSize > 0) {
        const reductionPercent = ((toolchainBaselineGzSize - gzSize) / toolchainBaselineGzSize) * 100;
        reductions.push({ index: i, value: reductionPercent, failed: false, allFail: isAllFail });
      } else {
        reductions.push({ index: i, value: -Infinity, failed: false, allFail: isAllFail });
      }
    }

    // Find the best (maximum) reduction, excluding ALL_FAIL toolchains
    const eligibleReductions = reductions.filter(r => !r.allFail);
    const maxReduction = eligibleReductions.length > 0
      ? Math.max(...eligibleReductions.map(r => r.value))
      : -Infinity;
    const bestIndex = reductions.findIndex(r => !r.allFail && r.value === maxReduction && r.value > -Infinity);

    // Escape underscores in testcase name for LaTeX
    const escapedTestcase = testcase.replace(/_/g, '\\_');
    const baselineStr = (baselineGzSize / 1024).toFixed(2);
    latex += `    ${escapedTestcase.padEnd(maxTestcaseWidth)} & ${baselineStr.padStart(maxBaselineWidth)}`;

    // Second pass: output with formatting
    for (let i = 1; i < toolchainKeys.length; i++) {
      const toolchain = toolchainKeys[i];
      const reductionIdx = i - 1;
      const reduction = reductions[reductionIdx];

      if (!testcaseData[toolchain]) {
        latex += ' & ---';
        continue;
      }

      // Check if optimization failed
      if (reduction.failed) {
        latex += ' & \\textit{Failed}';
      } else if (reduction.value > -Infinity) {
        const valueStr = `${reduction.value.toFixed(1)}\\%`;
        // Apply strikethrough if ALL_FAIL
        const formattedValue = reduction.allFail ? `\\sout{${valueStr}}` : valueStr;
        // Mark the best result with bold (only if not ALL_FAIL)
        if (reductionIdx === bestIndex && !reduction.allFail) {
          latex += ` & \\textbf{${formattedValue}}`;
        } else {
          latex += ` & ${formattedValue}`;
        }
      } else {
        latex += ' & ---';
      }
    }

    latex += ' \\\\\n';
  }

  // Add average row
  latex += '    \\midrule\n';
  latex += '    \\textbf{Average}';
  
  // Baseline column shows N/A
  latex += ' & ';

  // Calculate geometric mean for each optimizer column
  for (let i = 1; i < toolchainKeys.length; i++) {
    const toolchain = toolchainKeys[i];
    
    let product = 1;
    let count = 0;
    
    for (const testcase of testcases) {
      const testcaseData = data[testcase];
      
      // Determine the baseline for this toolchain
      const baselineKey = BASELINE_MAPPINGS[toolchain] || DEFAULT_BASELINE;
      const toolchainBaselineGzSize = testcaseData[baselineKey]?.gz_size || 0;
      
      // Check if this test case is in the ALL_FAIL list
      const isAllFail = failedTests[toolchain]?.includes(testcase) || false;
      
      if (!testcaseData[toolchain] || isAllFail) {
        continue;
      }
      
      const toolchainData = testcaseData[toolchain];
      const gzSize = toolchainData.gz_size;
      const size = toolchainData.size;
      
      // Skip failed results (size <= 20)
      if (size <= 20) {
        continue;
      }
      
      if (toolchainBaselineGzSize > 0) {
        const reductionPercent = ((toolchainBaselineGzSize - gzSize) / toolchainBaselineGzSize) * 100;
        // For geometric mean of percentages, we use (1 + reduction/100)
        product *= (1 + reductionPercent / 100);
        count++;
      }
    }
    
    if (count > 0) {
      const geomean = Math.pow(product, 1 / count);
      // Convert back to percentage: (geomean - 1) * 100
      const avgReduction = (geomean - 1) * 100;
      const avgStr = `${avgReduction.toFixed(1)}\\%`;
      latex += ` & \\textbf{${avgStr}}`;
    } else {
      latex += ' & \\textbf{N/A}';
    }
  }
  
  latex += ' \\\\\n';

  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';
  latex += '\\end{table}\n';

  return latex;
}

function main() {
  // Load data
  const sizes = loadSizes();
  const failedTests = loadFailedTests();

  // Parse data
  const data = parseData(sizes, TOOLCHAINS);

  // Generate LaTeX table
  const latexTable = generateLatexTable(data, TOOLCHAINS, failedTests);

  // Output to console
  console.log(latexTable);
}

main();
