import * as fs from 'fs';

interface FnSummaryData {
  [benchmark: string]: {
    mangling: {
      manglingRate: number;
      staticAll: number;
    };
  };
}

interface GccManglingData {
  [benchmark: string]: {
    weighted: {
      total: number;
      rate: number;
    };
  };
}

interface ManglingRow {
  name: string;
  jsShakerStaticAll: number;
  jsShakerRate: number;
  gccTotal: number;
  gccRate: number;
}

function loadFnSummary(): FnSummaryData {
  const content = fs.readFileSync('fnSummary.json', 'utf-8');
  return JSON.parse(content);
}

function loadGccMangling(): GccManglingData {
  const content = fs.readFileSync('gccMangling.json', 'utf-8');
  return JSON.parse(content);
}

function generateLatexTable(rows: ManglingRow[], jsAvg: number, gccAvg: number): string {
  let latex = '\\begin{table}[t]\n';
  latex += '  \\scriptsize\n';
  latex += '  \\centering\n';
  latex += '  \\caption{Identifier mangling comparison between JsShaker and Google Closure Compiler. For JsShaker, staticAll shows the total number of static identifiers analyzed; for CC, total shows the weighted occurrence count. Mangling rates indicate the proportion of identifiers successfully shortened.}\n';
  latex += '  \\label{tab:mangling-comparison}\n';
  latex += '  \\begin{tabular}{lrrrr}\n';
  latex += '    \\toprule\n';
  latex += '    Program & CC\\textsubscript{Adv.} Total & CC\\textsubscript{Adv.} Rate (\\%) & JsShaker Total & JsShaker Rate (\\%) \\\\\n';
  latex += '    \\midrule\n';

  for (const row of rows) {
    const escapedName = row.name.replace(/_/g, '\\_');
    latex += `    ${escapedName} & ${row.gccTotal.toLocaleString('en-US')} & ${(row.gccRate * 100).toFixed(2)} & ${row.jsShakerStaticAll.toLocaleString('en-US')} & ${(row.jsShakerRate * 100).toFixed(2)} \\\\\n`;
  }

  latex += '    \\midrule\n';
  latex += `    \\textbf{Average} & & \\textbf{${(gccAvg * 100).toFixed(2)}} & & \\textbf{${(jsAvg * 100).toFixed(2)}} \\\\\n`;
  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';
  latex += '\\end{table}\n';

  return latex;
}

function main() {
  const fnSummary = loadFnSummary();
  const gccMangling = loadGccMangling();

  // Get all benchmarks (exclude __average)
  const benchmarks = Object.keys(fnSummary)
    .filter(key => !key.startsWith('__'))
    .sort();

  const rows: ManglingRow[] = [];

  for (const name of benchmarks) {
    const jsData = fnSummary[name];
    const gccData = gccMangling[name];

    if (jsData && gccData) {
      rows.push({
        name,
        jsShakerStaticAll: jsData.mangling.staticAll,
        jsShakerRate: jsData.mangling.manglingRate,
        gccTotal: gccData.weighted.total,
        gccRate: gccData.weighted.rate,
      });
    }
  }

  // Calculate averages
  const jsAvg = rows.reduce((sum, r) => sum + r.jsShakerRate, 0) / rows.length;
  const gccAvg = rows.reduce((sum, r) => sum + r.gccRate, 0) / rows.length;

  // Generate LaTeX table
  const latexTable = generateLatexTable(rows, jsAvg, gccAvg);

  // Output to console
  console.log(latexTable);
  
  // Output comparison ratio
  const ratio = (jsAvg / gccAvg) * 100;
  console.log(`\nJsShaker mangling rate is ${ratio.toFixed(2)}% of CC mangling rate (${(jsAvg * 100).toFixed(2)}% / ${(gccAvg * 100).toFixed(2)}%)`);
}

main();
