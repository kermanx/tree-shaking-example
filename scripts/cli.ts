import { parseArgs } from 'node:util';
import { run } from './index.ts';
import { existsSync, readdir, readdirSync, readFileSync, writeFileSync } from 'node:fs';

async function main() {
  const args = parseArgs({
    allowPositionals: true,
    // Define the expected command-line arguments
    options: {
      bundler: { type: 'string', short: 'b' },
      shaker: { type: 'string', short: 's' },
      minifier: { type: 'string', short: 'm' },
    },
  });

  const [name] = args.positionals;
  const { bundler, shaker, minifier } = args.values;

  if (!name || !bundler) {
    console.error('Missing required arguments.');
    process.exit(1);
  }

  const allNames = readdirSync('./src')
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));

  const names = name === 'all' ? allNames : [name];

  const sizes: Record<string, number> = {};
  await Promise.all(names.map(n => run({
    entry: `./src/${n}.js`,
    env: 'node',
    bundler,
    shaker,
    minifier,
    sizes,
  })));

  const oldSizes = existsSync('./sizes.json') ? JSON.parse(readFileSync('./sizes.json', 'utf-8')) : {};
  writeFileSync('./sizes.json', JSON.stringify(
    Object.fromEntries(Object.entries({ ...oldSizes, ...sizes }).sort((a, b) => a[0].localeCompare(b[0]))),
    null, 2));
  console.log('Updated sizes.json');
}

main();
