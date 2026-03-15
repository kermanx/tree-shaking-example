import * as fs from 'fs';
import { resolve } from 'path';

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
  const content = fs.readFileSync(resolve(import.meta.dirname, '../data/fnSummary.json'), 'utf-8');
  return JSON.parse(content);
}

function loadGccMangling(): GccManglingData {
  const content = fs.readFileSync(resolve(import.meta.dirname, '../data/gccMangling.json'), 'utf-8');
  return JSON.parse(content);
}

function generateLatexTable(rows: ManglingRow[], jsAvg: number, gccAvg: number): string {
  const avgCombinedTotal = rows.reduce((sum, r) => sum + (r.gccTotal + r.jsShakerStaticAll) / 2, 0) / rows.length;
  let latex = '';
  latex += '  \\begin{tabular}{lrrrr}\n';
  latex += '    \\toprule\n';
  latex += '    Program & Total & \\makecell[r]{CC\\textsubscript{Adv.} \\\\ (\\%)} & \\makecell[r]{JsShaker \\\\ (\\%)} & \\makecell[r]{JsShaker/ \\\\ CC (\\%)} \\\\';
  latex += '    \\midrule\n';

  for (const row of rows) {
    const escapedName = row.name.replace(/_/g, '\\_');
    const combinedTotal = (row.gccTotal + row.jsShakerStaticAll) / 2;
    const ratio = row.gccRate === 0 ? 0 : (row.jsShakerRate / row.gccRate) * 100;
    latex += `    ${escapedName} & ${combinedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })} & ${(row.gccRate * 100).toFixed(2)} & ${(row.jsShakerRate * 100).toFixed(2)} & ${ratio.toFixed(2)} \\\\\n`;
  }

  latex += '    \\midrule\n';
  latex += `    \\textbf{Average} & \\textbf{${avgCombinedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}} & \\textbf{${(gccAvg * 100).toFixed(2)}} & \\textbf{${(jsAvg * 100).toFixed(2)}} & \\textbf{${((jsAvg / gccAvg) * 100).toFixed(2)}} \\\\\n`;
  latex += '    \\bottomrule\n';
  latex += '  \\end{tabular}\n';

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
