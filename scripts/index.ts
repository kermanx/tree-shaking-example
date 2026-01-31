
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { bundlers } from './bundle.ts';
import { minifiers } from './minify.ts';
import { shakers } from './shake.ts';

export async function run({
  name,
  entry,
  env,
  bundler,
  shaker,
  minifier,
  sizes,
  zip,
}: {
  name: string;
  entry: string;
  env: 'browser' | 'node';
  bundler: string;
  shaker?: string;
  minifier?: string;
  zip?: boolean;
  sizes: Record<string, number>;
}) {
  let filename = [basename(entry).split('.')[0], bundler, shaker || 'none', minifier || 'none'].join('_');
  let code = await bundlers[bundler]({ name, entry, env: env as 'browser' | 'node' });
  console.log(`Bundled: ${code.length}B`);

  if (shaker) {
    code = await shakers[shaker]({ code });
    console.log(`Shaken: ${code.length}B`);
  }

  if (minifier) {
    code = await minifiers[minifier]({ code });
    console.log(`Minified: ${code.length}B`);
  }

  if (zip) {
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