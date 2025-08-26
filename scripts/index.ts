
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { bundlers } from './bundle.ts';
import { minifiers } from './minify.ts';
import { shakers } from './shake.ts';

export async function run({
  entry,
  env,
  bundler,
  shaker,
  minifier,
  sizes,
}: {
  entry: string;
  env: 'browser' | 'node';
  bundler: string;
  shaker?: string;
  minifier?: string;
  sizes: Record<string, number>;
}) {
  let filename = basename(entry).split('.')[0] + '_' + bundler;
  let code = await bundlers[bundler]({ entry, env: env as 'browser' | 'node' });
  console.log(`Bundled: ${code.length}B`);

  if (shaker) {
    filename += '_' + shaker
    code = await shakers[shaker]({ code });
    console.log(`Shaken: ${code.length}B`);
  }

  if (minifier) {
    filename += '_' + minifier
    code = await minifiers[minifier]({ code });
    console.log(`Minified: ${code.length}B`);
  }

  sizes[filename] = code.length;
  mkdirSync(`./dist`, { recursive: true })
  writeFileSync(`./dist/${filename}.js`, code);
  console.log(`Wrote ./dist/${filename}.js`);
}