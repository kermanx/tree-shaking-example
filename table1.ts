import * as fs from 'fs';

// Configuration: which toolchains to display (ordered mapping from field name to display name)
const TOOLCHAINS: Record<string, string> = {
  "rollup_terser": "Rollup + Terser",
  "rollup_jsshaker_terser": "JsShaker",
  "rollup_gcc_terser": "Closure Compiler",
  "rollup_lacuna_terser": "Lacuna",
};

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

function loadSizes(filename: string = "sizes.json"): Record<string, number> {
  const content = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(content);
}

function parseData(sizes: Record<string, number>, toolchains: Record<string, string>): ParsedData {
  const data: ParsedData = {};

  for (const [key, value] of Object.entries(sizes)) {
    // Skip .gz entries, we'll handle them separately
    if (key.endsWith('.gz')) {
      continue;
    }

    // Parse the key: {testcase}_{toolchain}
    // Find where the toolchain starts by checking against known toolchains
    for (const toolchain of Object.keys(toolchains)) {
      if (key.endsWith('_' + toolchain)) {
        const testcase = key.slice(0, -toolchain.length - 1);

        if (!data[testcase]) {
          data[testcase] = {};
        }

        const gzKey = `${key}.gz`;
        data[testcase][toolchain] = {
          size: value,
          gz_size: sizes[gzKey] || 0
        };
        break;
      }
    }
  }

  return data;
}

function generateLatexTable(data: ParsedData, toolchains: Record<string, string>): string {
  const testcases = Object.keys(data).sort();
  const toolchainKeys = Object.keys(toolchains);
  const baselineToolchain = toolchainKeys[0];

  // Build table header
  const numColumns = 1 + 1 + (toolchainKeys.length - 1); // Program + Baseline + Other toolchains
  const columnSpec = 'l' + 'r'.repeat(numColumns - 1);

  let latex = '\\begin{table}[t]\n';
  latex += '\\small\n';
  latex += '\\centering\n';
  latex += '\\caption{Size improvement for target programs}\n';
  latex += '\\label{tab:size-reduction}\n';
  latex += `\\begin{tabular}{${columnSpec}}\n`;
  latex += '\\toprule\n';

  // Header row
  latex += 'Program & Baseline (bytes)';
  for (let i = 1; i < toolchainKeys.length; i++) {
    const displayName = toolchains[toolchainKeys[i]];
    // Escape special LaTeX characters
    const escapedName = displayName.replace(/&/g, '\\&');
    latex += ` & ${escapedName}`;
  }
  latex += ' \\\\\n';
  latex += '\\midrule\n';

  // Data rows
  for (const testcase of testcases) {
    const testcaseData = data[testcase];
    const baselineGzSize = testcaseData[baselineToolchain]?.gz_size || 0;

    // First pass: calculate all reduction percentages to find the best
    const reductions: Array<{ index: number; value: number; failed: boolean }> = [];
    for (let i = 1; i < toolchainKeys.length; i++) {
      const toolchain = toolchainKeys[i];

      if (!testcaseData[toolchain]) {
        reductions.push({ index: i, value: -Infinity, failed: false });
        continue;
      }

      const toolchainData = testcaseData[toolchain];
      const gzSize = toolchainData.gz_size;
      const size = toolchainData.size;

      if (size <= 20) {
        reductions.push({ index: i, value: -Infinity, failed: true });
      } else if (baselineGzSize > 0) {
        const reductionPercent = ((baselineGzSize - gzSize) / baselineGzSize) * 100;
        reductions.push({ index: i, value: reductionPercent, failed: false });
      } else {
        reductions.push({ index: i, value: -Infinity, failed: false });
      }
    }

    // Find the best (maximum) reduction
    const maxReduction = Math.max(...reductions.map(r => r.value));
    const bestIndex = reductions.findIndex(r => r.value === maxReduction && r.value > -Infinity);

    // Escape underscores in testcase name for LaTeX
    const escapedTestcase = testcase.replace(/_/g, '\\_');
    latex += `${escapedTestcase} & ${baselineGzSize.toLocaleString()}`;

    // Second pass: output with formatting
    for (let i = 1; i < toolchainKeys.length; i++) {
      const toolchain = toolchainKeys[i];
      const reductionIdx = i - 1;
      const reduction = reductions[reductionIdx];

      if (!testcaseData[toolchain]) {
        latex += ' & ---';
        continue;
      }

      const toolchainData = testcaseData[toolchain];
      const size = toolchainData.size;

      // Check if optimization failed
      if (reduction.failed) {
        latex += ' & \\textit{Failed}';
      } else if (reduction.value > -Infinity) {
        const valueStr = `${reduction.value.toFixed(1)}\\%`;
        // Mark the best result with bold
        if (reductionIdx === bestIndex) {
          latex += ` & \\textbf{${valueStr}}`;
        } else {
          latex += ` & ${valueStr}`;
        }
      } else {
        latex += ' & ---';
      }
    }

    latex += ' \\\\\n';
  }

  latex += '\\bottomrule\n';
  latex += '\\end{tabular}\n';
  latex += '\\end{table}\n';

  return latex;
}

function main() {
  // Load data
  const sizes = loadSizes();

  // Parse data
  const data = parseData(sizes, TOOLCHAINS);

  // Generate LaTeX table
  const latexTable = generateLatexTable(data, TOOLCHAINS);

  // Output to console
  console.log(latexTable);
}

main();
