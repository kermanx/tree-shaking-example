import { bundlers } from './bundle.ts';
import { Optimizers } from './optimizer.ts';
import { shakeSingleModule } from 'jsshaker';
import { readdirSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gccWithTiming } from './cc.ts';

const WARMUP_RUNS = 1;
const BENCHMARK_RUNS = 3;

type OptimizerType = 'jsshaker' | 'terser' | 'rollup' | 'gcc' | 'lacuna';

async function benchmarkJsshaker() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = readdirSync(srcFolder).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = readFileSync(bundledPath, 'utf-8');
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

      const env = name === 'glob' ? 'node' : 'browser';
      const minified = await Optimizers.terser({ name, code: finalCode, env });
      const size = minified.length;

      console.log(`  [${name}] Time: ${avgTime.toFixed(2)}ms, Size: ${size}B`);
    }
  }

  await writeFile(join(import.meta.dirname, '../maxRecursionDepth.json'), JSON.stringify(results, null, 2));
  console.log('\nResults saved to maxRecursionDepth.json');
}

async function benchmarkTerser() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = readdirSync(srcFolder).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup_jsshaker.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = readFileSync(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    const env = name === 'glob' ? 'node' : 'browser';

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await Optimizers.terser({ name, code, env });
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await Optimizers.terser({ name, code, env });
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
  const srcFiles = readdirSync(srcFolder).filter(f => f.endsWith('.js'));

  const results: Record<string, number> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const entry = join(srcFolder, file);
    const env = name === 'glob' ? 'node' : 'browser';

    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await bundlers.rollup({ name, entry, env, cjs: false });
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await bundlers.rollup({ name, entry, env, cjs: false });
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
  const srcFiles = readdirSync(srcFolder).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = readFileSync(bundledPath, 'utf-8');
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
  timeData.gcc = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkLacuna() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = readdirSync(srcFolder).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    console.log(`[${name}] Loading ${bundledPath}...`);
    bundled[name] = readFileSync(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);

    const env = name === 'glob' ? 'node' : 'browser';

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        await Optimizers.lacuna({ name, code, env });
      } catch (e) {
        console.log(`[${name}] Warmup failed, skipping...`);
        continue;
      }
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      try {
        const start = performance.now();
        await Optimizers.lacuna({ name, code, env });
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

async function readFile(path: string, encoding: BufferEncoding): Promise<string> {
  const fs = await import('node:fs/promises');
  return fs.readFile(path, encoding);
}

async function main() {
  const optimizer = process.argv[2] as OptimizerType;

  if (!optimizer) {
    console.log('No optimizer specified, running all benchmarks...\n');
    await benchmarkJsshaker();
    await benchmarkTerser();
    await benchmarkRollup();
    await benchmarkGcc();
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
    case 'lacuna':
      await benchmarkLacuna();
      break;
    default:
      console.error(`Unknown optimizer: ${optimizer}`);
      console.error('Available: jsshaker, terser, rollup, gcc, lacuna');
      console.error('Or run without arguments to test all optimizers');
      process.exit(1);
  }
}

main().catch(console.error);
