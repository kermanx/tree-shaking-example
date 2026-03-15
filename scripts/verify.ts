import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { getTestCaseNames } from './config.ts';

const MANUAL_FAILED: [RegExp,RegExp][] = [
  [/novnc/, /gccAdv/], // Cannot type
  [/vuetify/, /gccAdv/], // TypeError: Invalid color: [object Object] Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number
  [/vben-ele/, /gccAdv/], // Cannot load
  [/slidev-demo/, /gccAdv/], // Many errors
]

interface FailedTests {
  [optimizer: string]: string[];
}

function isManuallyFailed(testName: string, toolchainKey: string): boolean {
  return MANUAL_FAILED.some(([testPattern, optimizerPattern]) => 
    testPattern.test(testName) && optimizerPattern.test(toolchainKey)
  );
}

function loadFailedTests(): FailedTests {
  const failedPath = path.join(process.cwd(), 'failed.json');
  if (existsSync(failedPath)) {
    const content = readFileSync(failedPath, 'utf-8');
    return JSON.parse(content);
  }
  return {};
}

function saveFailedTests(failed: FailedTests): void {
  const failedPath = path.join(process.cwd(), 'failed.json');
  writeFileSync(failedPath, JSON.stringify(failed, null, 2));
}

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

  // Load existing failed tests
  const failedTests = loadFailedTests();

  for (const optimizers of resolvedOptimizers) {
    const optimizerStr = optimizers.join('_');
    const bundlerName = bundler || 'rollup';
    const toolchainKey = `${bundlerName}${optimizerStr ? '_' + optimizerStr : ''}`;

    // Initialize or clear the failed list for this optimizer
    failedTests[toolchainKey] = [];

    for (const testName of names) {
      // Check if this combination is manually marked as failed
      if (isManuallyFailed(testName, toolchainKey)) {
        console.log(`⚠️  ${testName}_${toolchainKey}.js (manually skipped)`);
        failedTests[toolchainKey].push(testName);
        continue;
      }

      const bundledPath = path.join(
        process.cwd(),
        'dist',
        `${testName}_${toolchainKey}.js`
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
        failedTests[toolchainKey].push(testName);
        if (error.stdout) {
          console.log('   ' + error.stdout.trim().replace(/\n/g, '\n   '));
        }
        if (error.stderr) {
          console.log('   ' + error.stderr.trim().replace(/\n/g, '\n   '));
        }
      }
    }
  }

  // Save updated failed tests
  if (!name) {
    saveFailedTests(failedTests);
    console.log('\nFailed tests saved to failed.json');
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
