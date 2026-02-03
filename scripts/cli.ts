import { parseArgs } from 'node:util';
import { run } from './run.ts';
import { existsSync, readdir, readdirSync, readFileSync, writeFileSync } from 'node:fs';

export const summary: any = {};

async function main() {
  const args = parseArgs({
    allowPositionals: true,
    // Define the expected command-line arguments
    options: {
      bundler: { type: 'string', short: 'b' },
      optimizers: { type: 'string', short: 'o' },
      zip: { type: 'boolean', short: 'z' },
      cjs: { type: 'boolean' },

      // Lacuna-specific options
      lacunaAnalyzer: { type: 'string' },  // e.g., "static:0.6,acg:0.5"
      lacunaLevel: { type: 'string' },     // e.g., "2"
    },
  });

  const [name] = args.positionals;
  const { bundler, optimizers, zip, cjs, lacunaAnalyzer, lacunaLevel } = args.values;

  const allNames = readdirSync('./src')
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  const names = !name ? allNames : [name];

  // Parse Lacuna analyzer configuration
  let lacunaAnalyzers: Record<string, number> | undefined;
  if (lacunaAnalyzer) {
    lacunaAnalyzers = {};
    const analyzerPairs = lacunaAnalyzer.split(',');
    for (const pair of analyzerPairs) {
      const [analyzer, threshold] = pair.split(':');
      lacunaAnalyzers[analyzer.trim()] = parseFloat(threshold || '0.5');
    }
  }

  const lacunaOLevel = lacunaLevel ? parseInt(lacunaLevel) : undefined;

  const resolvedOptimizers = resolveOptimizers(optimizers);
  for (const optimizers of resolvedOptimizers) {
    const sizes: Record<string, number> = {};
    await Promise.all(names.map(name => run({
      name,
      entry: `./src/${name}.js`,
      env: ['glob'].includes(name) ? 'node' : 'browser',
      bundler: bundler || 'rollup',
      optimizers,
      zip,
      sizes,
      cjs: cjs || false,
      lacunaAnalyzers,
      lacunaOLevel,
    })));

    const oldSizes = existsSync('./sizes.json') ? JSON.parse(readFileSync('./sizes.json', 'utf-8')) : {};
    writeFileSync('./sizes.json', JSON.stringify(
      Object.fromEntries(Object.entries({ ...oldSizes, ...sizes }).sort((a, b) => a[0].localeCompare(b[0]))),
      null, 2));
    console.log('Updated sizes.json');
  }

  if (Object.keys(summary).length !== 0)
    console.log(Object.fromEntries(Object.entries(summary).sort((a, b) => a[0].localeCompare(b[0]))));
}

main();

function resolveOptimizers(raw: string | undefined): string[][] {
  if (!raw) return [[]];
  const inputs = raw.split(',');
  let res: string[][] = [[]];
  for (let input of inputs) {
    const optional = input.endsWith('?');
    if (optional) input = input.slice(0, -1);
    for (const r of res) {
      r.push(input);
    }
    if (optional) {
      res.push(...res.map(r => r.slice(0, -1)));
    }
  }
  res.reverse();
  console.log('Resolved optimizers:', res);
  return res;
}
