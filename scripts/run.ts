
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { bundlers } from './bundle.ts';
import { Optimizers } from './optimizer.ts';

export async function run({
  name,
  entry,
  env,
  bundler,
  optimizers,
  sizes,
  zip,
  cjs,
}: {
  name: string;
  entry: string;
  env: 'browser' | 'node';
  bundler: string;
  optimizers: string[];
  zip?: boolean;
  sizes: Record<string, number>;
  cjs: boolean;
}) {
  let filename = [name, bundler, ...optimizers].join('_');
  let code = await bundlers[bundler]({ name, entry, env: env as 'browser' | 'node', cjs });
  console.log(`Bundled: ${code.length}B`);

  for (const optimizer of optimizers) {
    code = await Optimizers[optimizer]({ name, code, env: env as 'browser' | 'node' });
    console.log(`Optimized (${optimizer}): ${code.length}B`);
  }

  // if (zip) 
  {
    const { gzip } = await import('node:zlib');
    const { promisify } = await import('node:util');
    const gzipAsync = promisify(gzip);
    const zipped = await gzipAsync(code);
    sizes[filename + '.gz'] = zipped.length;
  }

  sizes[filename] = code.length;

  mkdirSync(`./dist`, { recursive: true })
  writeFileSync(`./dist/${filename}.js`, code);
  console.log(`Wrote ./dist/${filename}.js`);
}