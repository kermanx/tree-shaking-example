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
    },
  });

  const [name] = args.positionals;
  const { bundler, optimizers, zip, cjs } = args.values;

  const allNames = readdirSync('./src')
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  const names = !name ? allNames : [name];

  const sizes: Record<string, number> = {};
  await Promise.all(names.map(name => run({
    name,
    entry: `./src/${name}.js`,
    env: 'browser',
    bundler: bundler || 'rolldown',
    optimizers: optimizers ? optimizers.split(',') : [],
    zip,
    sizes,
    cjs: cjs || false,
  })));

  const oldSizes = existsSync('./sizes.json') ? JSON.parse(readFileSync('./sizes.json', 'utf-8')) : {};
  writeFileSync('./sizes.json', JSON.stringify(
    Object.fromEntries(Object.entries({ ...oldSizes, ...sizes }).sort((a, b) => a[0].localeCompare(b[0]))),
    null, 2));
  console.log('Updated sizes.json');

  if (Object.keys(summary).length !== 0)
    console.log(Object.fromEntries(Object.entries(summary).sort((a, b) => a[0].localeCompare(b[0]))));
}

main();
