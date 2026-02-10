import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { jsshaker } from './jsshaker.ts';
import { getTestCaseNames, getTestCaseConfig } from './config.ts';

const gzipAsync = promisify(gzip);

interface AblationResult {
  [testCase: string]: {
    original: number;
    [config: string]: number;
  };
}

const configurations = [
  { constantFolding: 'enabled', propertyMangling: 'enabled' },
  { constantFolding: 'enabled', propertyMangling: 'disabled' },
  { constantFolding: 'enabled', propertyMangling: 'only' },
  { constantFolding: 'disabled', propertyMangling: 'disabled' },
] as const;

async function main() {
  const allNames = getTestCaseNames();

  const results: AblationResult = {};

  for (const name of allNames) {
    const inputPath = `./dist/${name}_rollup.js`;

    if (!existsSync(inputPath)) {
      console.log(`[${name}] Skipping - ${inputPath} does not exist`);
      continue;
    }

    console.log(`\n[${name}] Starting ablation study...`);

    const code = await readFile(inputPath, 'utf-8');
    const originalSize = Buffer.byteLength(code, 'utf-8');
    const testCaseConfig = getTestCaseConfig(name);

    console.log(`[${name}] Original size: ${originalSize} bytes`);

    results[name] = {
      original: originalSize,
    };

    // Calculate gzip size for original
    const originalGzipped = await gzipAsync(code);
    results[name]['original.gz'] = originalGzipped.length;


    for (const config of configurations) {
      const configName = `cf_${config.constantFolding}_pm_${config.propertyMangling}`;
      console.log(`[${name}] Testing configuration: ${configName}`);

      try {
        const optimized = await jsshaker(
          { name, code, env: testCaseConfig.env },
          {
            constantFolding: config.constantFolding,
            propertyMangling: config.propertyMangling,
          }
        );

        const optimizedSize = Buffer.byteLength(optimized, 'utf-8');
        results[name][configName] = optimizedSize;

        // Calculate gzip size
        const optimizedGzipped = await gzipAsync(optimized);
        results[name][`${configName}.gz`] = optimizedGzipped.length;

        const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(2);
        const gzReduction = ((1 - optimizedGzipped.length / originalGzipped.length) * 100).toFixed(2);
        console.log(`[${name}] ${configName}: ${optimizedSize} bytes (${reduction}% reduction), gz: ${optimizedGzipped.length} bytes (${gzReduction}% reduction)`);
      } catch (error) {
        console.error(`[${name}] Error with ${configName}:`, error);
        results[name][configName] = -1; // Mark as error
      }
    }
  }

  // Write results to ablation.json
  await writeFile(
    './ablation.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n✓ Ablation study complete. Results written to ablation.json');

  // Print summary
  console.log('\n=== Summary ===');
  for (const [name, data] of Object.entries(results)) {
    console.log(`\n${name}:`);
    console.log(`  Original: ${data.original} bytes, gz: ${data['original.gz']} bytes`);
    for (const [config, size] of Object.entries(data)) {
      if (config === 'original' || config === 'original.gz') continue;
      if (size === -1) {
        console.log(`  ${config}: ERROR`);
      } else {
        const isGz = config.endsWith('.gz');
        const originalSize = isGz ? data['original.gz'] : data.original;
        const reduction = ((1 - size / originalSize) * 100).toFixed(2);
        console.log(`  ${config}: ${size} bytes (${reduction}% reduction)`);
      }
    }
  }
}

main().catch(console.error);
