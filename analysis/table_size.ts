import * as fs from 'fs';

// Configuration: which toolchains to display (ordered mapping from field name to display name)
const TOOLCHAINS: Record<string, string> = {
  "rollup_terser": "Rollup + Terser",
  "rollup_jsshaker_terser": "JsShaker",
  "rollup_gcc_terser": "CC\\textsubscript{Simp.}",
  "rollup_gccAdv_terser": "CC\\textsubscript{Adv.}",
  "rollup_lacuna2_terser": "Lacuna\\textsubscript{O2}",
  "rollup_lacuna3_terser": "Lacuna\\textsubscript{O3}",
  // "rollup_dfahc2_terser": "DFAHC",
};

const DEFAULT_BASELINE = "rollup_terser";
const BASELINE_MAPPINGS: Record<string, string> = {
  "rollup_dfahc2_terser": "rollup_dfahcBaseline_terser"
};

const WITH_EXTRA_DATA: Record<string, { cases: string[]; toolchain: string; name: string }> = {
  "rollup_jsshaker_terser": {
    cases: ["antd", "material-ui", "react-icons"],
    toolchain: "rollup_jsshaker2_terser",
    name: "React-aware"
  }
}

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

  // Collect all toolchain keys including baselines from BASELINE_MAPPINGS and extra toolchains from WITH_EXTRA_DATA
  const allToolchains = new Set([
    ...Object.keys(toolchains),
    ...Object.values(BASELINE_MAPPINGS),
    ...Object.values(WITH_EXTRA_DATA).map(v => v.toolchain)
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
  // Count extra columns for toolchains with WITH_EXTRA_DATA
  let extraColumns = 0;
  for (let i = 1; i < toolchainKeys.length; i++) {
    if (WITH_EXTRA_DATA[toolchainKeys[i]]) {
      extraColumns++;
    }
  }
  
  // Build column spec: l for program name, r for baseline, then for each toolchain:
  // - if has extra data: r@{\hspace{2pt}}l (two columns)
  // - otherwise: r (one column)
  let columnSpec = 'lr';
  for (let i = 1; i < toolchainKeys.length; i++) {
    const toolchain = toolchainKeys[i];
    if (WITH_EXTRA_DATA[toolchain]) {
      columnSpec += 'r@{\\hspace{2pt}}l';
    } else {
      columnSpec += 'r';
    }
  }

  let latex = '';
  latex += `  \\begin{tabular}{${columnSpec}}\n`;
  latex += '    \\toprule\n';

  // Header row
  latex += '    Program & Baseline (KB)';
  for (let i = 1; i < toolchainKeys.length; i++) {
    const toolchain = toolchainKeys[i];
    const displayName = toolchains[toolchain];
    // Escape special LaTeX characters
    const escapedName = displayName.replace(/&/g, '\\&');
    
    if (WITH_EXTRA_DATA[toolchain]) {
      // Two columns: main name and extra name in small font with parentheses
      const extraName = WITH_EXTRA_DATA[toolchain].name.replace(/&/g, '\\&');
      latex += ` & ${escapedName} & {\\tiny (${extraName})}`;
    } else {
      latex += ` & ${escapedName}`;
    }
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
        let cellValue = formattedValue;
        if (reductionIdx === bestIndex && !reduction.allFail) {
          cellValue = `\\textbf{${formattedValue}}`;
        }
        
        // Check if there's extra data for this toolchain and testcase
        const extraConfig = WITH_EXTRA_DATA[toolchain];
        
        if (extraConfig) {
          // This toolchain has extra data config, output two columns
          latex += ` & ${cellValue}`;
          
          if (extraConfig.cases.includes(testcase)) {
            const extraToolchain = extraConfig.toolchain;
            const extraToolchainData = testcaseData[extraToolchain];
            
            if (extraToolchainData && extraToolchainData.size > 20) {
              const baselineKey = BASELINE_MAPPINGS[toolchain] || DEFAULT_BASELINE;
              const toolchainBaselineGzSize = testcaseData[baselineKey]?.gz_size || 0;
              const extraGzSize = extraToolchainData.gz_size;
              
              if (toolchainBaselineGzSize > 0) {
                const extraReductionPercent = ((toolchainBaselineGzSize - extraGzSize) / toolchainBaselineGzSize) * 100;
                const extraValueStr = `${extraReductionPercent.toFixed(1)}\\%`;
                latex += ` & {\\tiny (${extraValueStr})}`;
              } else {
                latex += ' &';
              }
            } else {
              latex += ' &';
            }
          } else {
            // No extra data for this testcase, empty second column
            latex += ' &';
          }
        } else {
          // No extra data config, output single column
          latex += ` & ${cellValue}`;
        }
      } else {
        latex += ' & ---';
      }
    }

    latex += ' \\\\\n';
  }

  // Add average row
  latex += '    \\midrule\n';
  latex += '    \\textbf{Geomean}';
  
  // Baseline column shows N/A
  latex += ' & ';

  // Calculate geometric mean for each optimizer column
  for (let i = 1; i < toolchainKeys.length; i++) {
    const toolchain = toolchainKeys[i];
    
    // Check if this toolchain has extra data configuration
    const extraConfig = WITH_EXTRA_DATA[toolchain];
    
    // Calculate original average (without replacement)
    let originalLogSum = 0;
    let originalCount = 0;
    
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
        // Calculate size ratio for geometric mean
        const sizeRatio = gzSize / toolchainBaselineGzSize;
        originalLogSum += Math.log(sizeRatio);
        originalCount++;
      }
    }
    
    let avgStr = '';
    
    // If there's extra config, also calculate the average with replacement
    if (extraConfig) {
      let extraLogSum = 0;
      let extraCount = 0;
      
      for (const testcase of testcases) {
        const testcaseData = data[testcase];
        
        // Determine the baseline for this toolchain
        const baselineKey = BASELINE_MAPPINGS[toolchain] || DEFAULT_BASELINE;
        const toolchainBaselineGzSize = testcaseData[baselineKey]?.gz_size || 0;
        
        // Determine which toolchain data to use first:
        // If this testcase is in the extra cases list, use extra toolchain
        // Otherwise use the regular toolchain
        let actualToolchainData: ToolchainData | undefined;
        let shouldSkip = false;
        
        if (extraConfig.cases.includes(testcase)) {
          // For extra cases, check the extra toolchain
          const extraToolchainData = testcaseData[extraConfig.toolchain];
          if (!extraToolchainData || extraToolchainData.size <= 20) {
            shouldSkip = true;
          } else {
            actualToolchainData = extraToolchainData;
          }
        } else {
          // For regular cases, check the main toolchain
          const isAllFail = failedTests[toolchain]?.includes(testcase) || false;
          if (!testcaseData[toolchain] || isAllFail || testcaseData[toolchain].size <= 20) {
            shouldSkip = true;
          } else {
            actualToolchainData = testcaseData[toolchain];
          }
        }
        
        if (shouldSkip || !actualToolchainData) {
          continue;
        }
        
        const gzSize = actualToolchainData.gz_size;
        
        if (toolchainBaselineGzSize > 0) {
          // Calculate size ratio for geometric mean
          const sizeRatio = gzSize / toolchainBaselineGzSize;
          extraLogSum += Math.log(sizeRatio);
          extraCount++;
        }
      }
      
      // Build output for average row
      // Two columns: original average, then extra average in parentheses
      let originalAvgStr = '';
      let extraAvgStr = '';
      
      if (originalCount > 0) {
        const originalGeomeanRatio = Math.exp(originalLogSum / originalCount);
        const originalAvgReduction = (1 - originalGeomeanRatio) * 100;
        originalAvgStr = `${originalAvgReduction.toFixed(1)}\\%`;
      } else {
        originalAvgStr = 'N/A';
      }
      
      if (extraCount > 0) {
        const extraGeomeanRatio = Math.exp(extraLogSum / extraCount);
        const extraAvgReduction = (1 - extraGeomeanRatio) * 100;
        extraAvgStr = `${extraAvgReduction.toFixed(1)}\\%`;
      } else {
        extraAvgStr = 'N/A';
      }
      
      latex += ` & \\textbf{${originalAvgStr}} & {\\tiny \\textbf{(${extraAvgStr})}}`;
    } else {
      // No extra config, single column: just original average
      if (originalCount > 0) {
        const originalGeomeanRatio = Math.exp(originalLogSum / originalCount);
        const originalAvgReduction = (1 - originalGeomeanRatio) * 100;
        avgStr = `${originalAvgReduction.toFixed(1)}\\%`;
      } else {
        avgStr = 'N/A';
      }
      
      latex += ` & \\textbf{${avgStr}}`;
    }
  }
  
  latex += ' \\\\\n';

  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';

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
