import { parseArgs } from 'node:util';
import { run } from './index.ts';
import { existsSync, readdir, readdirSync, readFileSync, writeFileSync } from 'node:fs';

export const summary: any = {};

async function main() {
  const args = parseArgs({
    allowPositionals: true,
    // Define the expected command-line arguments
    options: {
      bundler: { type: 'string', short: 'b' },
      shaker: { type: 'string', short: 's' },
      minifier: { type: 'string', short: 'm' },
      zip: { type: 'boolean', short: 'z' },
    },
  });

  const [name] = args.positionals;
  const { bundler, shaker, minifier, zip } = args.values;

  const allNames = readdirSync('./src')
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  const names = !name ? allNames : [name];

  const sizes: Record<string, number> = {};
  await Promise.all(names.map(name => run({
    name,
    entry: `./src/${name}.js`,
    env: 'node',
    bundler: bundler || 'rolldown',
    shaker,
    minifier,
    zip,
    sizes,
  })));

  const oldSizes = existsSync('./sizes.json') ? JSON.parse(readFileSync('./sizes.json', 'utf-8')) : {};
  writeFileSync('./sizes.json', JSON.stringify(
    Object.fromEntries(Object.entries({ ...oldSizes, ...sizes }).sort((a, b) => a[0].localeCompare(b[0]))),
    null, 2));
  console.log('Updated sizes.json');

  if (Object.keys(summary).length !== 0)
    console.log(summary);
}

main();
