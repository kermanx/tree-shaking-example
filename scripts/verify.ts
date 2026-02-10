import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { getTestCaseNames } from './config.ts';

async function main() {
  const args = parseArgs({
    allowPositionals: true,
    options: {
      bundler: { type: 'string', short: 'b' },
      optimizers: { type: 'string', short: 'o' },
    },
  });

  const [name] = args.positionals;
  const { bundler, optimizers } = args.values;

  const allNames = getTestCaseNames();
  const names = !name ? allNames : [name];
  const resolvedOptimizers = resolveOptimizers(optimizers);

  for (const optimizers of resolvedOptimizers) {
    const optimizerStr = optimizers.join('_');
    const bundlerName = bundler || 'rollup';

    for (const testName of names) {
      const bundledPath = path.join(
        process.cwd(),
        'dist',
        `${testName}_${bundlerName}${optimizerStr ? '_' + optimizerStr : ''}.js`
      );

      const testPath = path.join(process.cwd(), 'test', `${testName}.js`);

      try {
        execSync(`node "${testPath}" "${bundledPath}"`, {
          stdio: 'pipe',
          encoding: 'utf-8',
        });
        console.log(`✅ ${bundledPath}`);
      } catch (error: any) {
        console.log(`❌ ${bundledPath}`);
        if (error.stdout) {
          console.log('   ' + error.stdout.trim().replace(/\n/g, '\n   '));
        }
        if (error.stderr) {
          console.log('   ' + error.stderr.trim().replace(/\n/g, '\n   '));
        }
      }
    }
  }
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
  return res;
}
