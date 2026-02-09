import { parseArgs } from 'node:util';
import { run } from './run.ts';
import { existsSync, } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';

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
    },
  });

  const [name] = args.positionals;
  const { bundler, optimizers, zip, cjs } = args.values;

  const allNames = (await readdir('./src'))
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  const names = !name ? allNames : [name];

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
    })));

    const oldSizes = existsSync('./sizes.json') ? JSON.parse(await readFile('./sizes.json', 'utf-8')) : {};
    await writeFile('./sizes.json', JSON.stringify(
      Object.fromEntries(Object.entries({ ...oldSizes, ...sizes }).sort((a, b) => a[0].localeCompare(b[0]))),
      null, 2));
    console.log('Updated sizes.json');

    if (!name && optimizers.length === 1 && optimizers[0] === 'jsshaker') {
      await writeFile('./sizes_jsshaker.json', JSON.stringify(
        Object.fromEntries(Object.entries(sizes).sort((a, b) => a[0].localeCompare(b[0]))),
        null, 2));
      console.log('Updated sizes_jsshaker.json');
    }
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
    const newRes: string[][] = [];
    if (optional) {
      newRes.push(...res);
    }
    for (const o of input.split('/')) {
      for (const r of res) {
        newRes.push([...r, o]);
      }
    }
    res = newRes;
  }
  console.log('Resolved optimizers:', res);
  return res;
}
