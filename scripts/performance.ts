import { bundlers } from './bundle.ts';
import { Optimizers } from './optimizer.ts';
import { shakeSingleModule } from 'jsshaker';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gccWithTiming } from './cc.ts';
import { getTestCaseConfig } from './config.ts';

const WARMUP_RUNS = 1;
const BENCHMARK_RUNS = 3;
const DEFAULT_DEPTH = 2;

type OptimizerType = 'jsshaker' | 'terser' | 'rollup' | 'gcc' | 'gccAdv' | 'lacuna';

async function benchmarkJsshaker() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<number, Record<string, number>> = {};

  for (let depth = 1; depth <= 5; depth++) {
    console.log(`\nTesting maxRecursionDepth=${depth}`);
    results[depth] = {};

    for (const [name, code] of Object.entries(bundled)) {
      console.log(`  [${name}] Warming up...`);

      for (let i = 0; i < WARMUP_RUNS; i++) {
        shakeSingleModule(code, {
          preset: "smallest",
          jsx: "react",
          maxRecursionDepth: depth,
        });
      }

      const times: number[] = [];
      let finalCode = '';

      for (let i = 0; i < BENCHMARK_RUNS; i++) {
        const start = performance.now();
        const result = shakeSingleModule(code, {
          preset: "smallest",
          jsx: "react",
          maxRecursionDepth: depth,
        });
        times.push(performance.now() - start);
        finalCode = result.output.code;
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      results[depth][name] = avgTime;

      const config = getTestCaseConfig(name);
      const minified = await Optimizers.terser({ name, code: finalCode, env: config.env });
      const size = minified.length;

      console.log(`  [${name}] Time: ${avgTime.toFixed(2)}ms, Size: ${size}B`);
    }
  }

  await writeFile(join(import.meta.dirname, '../maxRecursionDepth.json'), JSON.stringify(results, null, 2));
  console.log('\nResults saved to maxRecursionDepth.json');

  // Also save depth=DEFAULT_DEPTH results to time.json
  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.jsshaker = results[DEFAULT_DEPTH];
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log(`Results for depth=${DEFAULT_DEPTH} saved to time.json`);
}

async function benchmarkTerser() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup_jsshaker.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    const config = getTestCaseConfig(name);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await Optimizers.terser({ name, code, env: config.env });
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await Optimizers.terser({ name, code, env: config.env });
      times.push(performance.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.terser = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkRollup() {
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));

  const results: Record<string, number> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const entry = join(srcFolder, file);
    const config = getTestCaseConfig(name);

    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await bundlers.rollup({ name, entry, env: config.env, cjs: false, excludeReact: false });
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await bundlers.rollup({ name, entry, env: config.env, cjs: false, excludeReact: false });
      times.push(performance.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.rollup = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkGcc() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        await gccWithTiming(code, {
          compilationLevel: 'SIMPLE',
          languageIn: 'ECMASCRIPT_NEXT',
          languageOut: 'ECMASCRIPT_NEXT',
          chunk_output_type: 'ES_MODULES',
        });
      } catch (e) {
        console.log(`[${name}] Warmup failed, skipping...`);
        continue;
      }
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      try {
        const result = await gccWithTiming(code, {
          compilationLevel: 'SIMPLE',
          languageIn: 'ECMASCRIPT_NEXT',
          languageOut: 'ECMASCRIPT_NEXT',
          chunk_output_type: 'ES_MODULES',
        });
        times.push(result.time);
      } catch (e) {
        console.log(`[${name}] Benchmark failed, skipping...`, e);
        break;
      }
    }

    if (times.length === 0) continue;

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.gcc = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkGccAdv() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        await gccWithTiming(code, {
          compilationLevel: 'ADVANCED',
          languageIn: 'ECMASCRIPT_NEXT',
          languageOut: 'ECMASCRIPT_NEXT',
          chunk_output_type: 'ES_MODULES',
        });
      } catch (e) {
        console.log(`[${name}] Warmup failed, skipping...`);
        continue;
      }
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      try {
        const result = await gccWithTiming(code, {
          compilationLevel: 'ADVANCED',
          languageIn: 'ECMASCRIPT_NEXT',
          languageOut: 'ECMASCRIPT_NEXT',
          chunk_output_type: 'ES_MODULES',
        });
        times.push(result.time);
      } catch (e) {
        console.log(`[${name}] Benchmark failed, skipping...`);
        break;
      }
    }

    if (times.length === 0) continue;

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.gccAdv = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkLacuna() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  loop: for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    const config = getTestCaseConfig(name);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        const r = await Optimizers.lacuna({ name, code, env: config.env });
        if (!r) {
          console.log(`[${name}] Warmup returned no result, skipping...`);
          continue loop;
        }
      } catch (e) {
        console.log(`[${name}] Warmup failed, skipping...`);
        continue loop;
      }
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      try {
        const start = performance.now();
        await Optimizers.lacuna({ name, code, env: config.env });
        times.push(performance.now() - start);
      } catch (e) {
        console.log(`[${name}] Benchmark failed, skipping...`);
        break;
      }
    }

    if (times.length === 0) continue;

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.lacuna = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}


async function main() {
  const optimizer = process.argv[2] as OptimizerType;

  if (!optimizer) {
    console.log('No optimizer specified, running all benchmarks...\n');
    await benchmarkJsshaker();
    await benchmarkTerser();
    await benchmarkRollup();
    await benchmarkGcc();
    await benchmarkGccAdv();
    await benchmarkLacuna();
    console.log('\nAll benchmarks completed!');
    return;
  }

  switch (optimizer) {
    case 'jsshaker':
      await benchmarkJsshaker();
      break;
    case 'terser':
      await benchmarkTerser();
      break;
    case 'rollup':
      await benchmarkRollup();
      break;
    case 'gcc':
      await benchmarkGcc();
      break;
    case 'gccAdv':
      await benchmarkGccAdv();
      break;
    case 'lacuna':
      await benchmarkLacuna();
      break;
    default:
      console.error(`Unknown optimizer: ${optimizer}`);
      console.error('Available: jsshaker, terser, rollup, gcc, gccAdv, lacuna');
      console.error('Or run without arguments to test all optimizers');
      process.exit(1);
  }
}

main().catch(console.error);
