import { bundlers } from './bundle.ts';
import { Optimizers } from './optimizer.ts';
import { type Options, shakeSingleModule } from 'jsshaker';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gccWithTiming } from './cc.ts';
import { getTestCaseConfig } from './config.ts';
import { jsshaker } from './jsshaker.ts';
import { gzipSize } from './gzip.ts';
import { exec } from 'node:child_process';

const WARMUP_RUNS = 3;
const BENCHMARK_RUNS = 3;
const DEFAULT_DEPTH = 2;

async function benchmarkJsshaker(depths = [1, 2, 3, 4, 5]) {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<number, Record<string, { time: number; input: number; inputGz: number; optimized: number; optimizedGz: number; minified: number; minifiedGz: number }>> = {};

  for (const depth of depths) {
    console.log(`\nTesting maxRecursionDepth=${depth}`);
    results[depth] = {};

    for (const [name, code] of Object.entries(bundled)) {
      console.log(`  [${name}] Warming up...`);
      const env = getTestCaseConfig(name).env;

      for (let i = 0; i < WARMUP_RUNS; i++) {
        await jsshaker({ name, code, env }, {
          maxRecursionDepth: depth,
        });
      }

      const times: number[] = [];
      let finalCode = '';

      for (let i = 0; i < BENCHMARK_RUNS; i++) {
        const start = performance.now();
        finalCode = await jsshaker({ name, code, env }, {
          maxRecursionDepth: depth,
        });
        times.push(performance.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

      const config = getTestCaseConfig(name);
      const minified = await Optimizers.terser({ name, code: finalCode, env: config.env });

      // Calculate all sizes
      const input = code.length;
      const inputGz = await gzipSize(code);
      const optimized = finalCode.length;
      const optimizedGz = await gzipSize(finalCode);
      const minifiedSize = minified.length;
      const minifiedGz = await gzipSize(minified);

      results[depth][name] = {
        time: avgTime,
        input,
        inputGz,
        optimized,
        optimizedGz,
        minified: minifiedSize,
        minifiedGz,
      };

      console.log(`  [${name}] Time: ${avgTime.toFixed(2)}ms, Input: ${input}B, Optimized: ${optimized}B, Minified: ${minifiedSize}B`);
    }
  }

  // Save only time data to maxRecDepthTime.json
  const timeResults: Record<number, Record<string, number>> = {};
  for (const [depth, depthResults] of Object.entries(results)) {
    timeResults[Number(depth)] = Object.fromEntries(
      Object.entries(depthResults).map(([name, data]) => [name, data.time])
    );
  }
  await writeFile(join(import.meta.dirname, '../data/maxRecDepthTime.json'), JSON.stringify(timeResults, null, 2));
  console.log('\nTime results saved to data/maxRecDepthTime.json');

  // Also save depth=DEFAULT_DEPTH results to time.json
  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.jsshaker = Object.fromEntries(
    Object.entries(results[DEFAULT_DEPTH]).map(([name, data]) => [name, data.time])
  );
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log(`Results for depth=${DEFAULT_DEPTH} saved to data/time.json`);
}

async function benchmarkJsshakerNoCache() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  const results: Record<string, number> = {};

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`[${name}] Warming up...`);
    const env = getTestCaseConfig(name).env;

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await jsshaker({ name, code, env }, {
        enableFnCache: false,
      });
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await jsshaker({ name, code, env }, {
        enableFnCache: false,
      });
      times.push(performance.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.jsshakerNoCache = results;
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to data/time.json');
}


async function benchmarkJsshakerConfigs(options: Partial<Options>) {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const bundled: Record<string, string> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const bundledPath = join(distFolder, `${name}_rollup.js`);
    bundled[name] = await readFile(bundledPath, 'utf-8');
  }

  let totalTime = 0;

  for (const [name, code] of Object.entries(bundled)) {
    console.log(`  [${name}] Warming up...`);
    for (let i = 0; i < WARMUP_RUNS; i++) {
      shakeSingleModule(code, {
        preset: "smallest",
        jsx: "react",
        ...options,
      });
    }

    const times: number[] = [];
    let finalCode = '';

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      const result = shakeSingleModule(code, {
        preset: "smallest",
        jsx: "react",
        ...options,
      });
      times.push(performance.now() - start);
      finalCode = result.output.code;
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    totalTime += avgTime;

    console.log(`  [${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  console.log(`\nTotal Time: ${totalTime.toFixed(2)}ms for config:`, options);
}


async function benchmarkTerser() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
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

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.terser = results;
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to data/time.json');
}

async function benchmarkRollup() {
  const srcFolder = join(import.meta.dirname, '../benchmarks');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));

  const results: Record<string, number> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const entry = join(srcFolder, file);

    const config = getTestCaseConfig(name);

    let runner = async () => { await bundlers.rollup({ name, entry, env: config.env, cjs: false, excludeReact: false }) };
    if (name === 'slidev-demo') {
      runner = async () => {
        // Execute `pnpm build`
        await new Promise((resolve, reject) => {
          const proc = exec('pnpm build', { cwd: join(import.meta.dirname, '../vendor/slidev-demo') }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing pnpm build: ${error}`);
              reject(error);
              return;
            }
            resolve(stdout);
          });

          proc.stdout?.pipe(process.stdout);
          proc.stderr?.pipe(process.stderr);
        });
      }
    }


    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await runner();
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await runner();
      times.push(performance.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.rollup = results;
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to data/time.json');
}

async function benchmarkGcc() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
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

    const env = getTestCaseConfig(name).env;

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        await gccWithTiming(code, env, {
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
        const result = await gccWithTiming(code, env, {
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

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.gcc = results;
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to data/time.json');
}

async function benchmarkGccAdv() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
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

    const env = getTestCaseConfig(name).env;

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        await gccWithTiming(code, env, {
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
        const result = await gccWithTiming(code, env, {
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

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../data/time.json'), 'utf-8').catch(() => '{}'));
  timeData.gccAdv = results;
  await writeFile(join(import.meta.dirname, '../data/time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to data/time.json');
}

async function benchmarkLacuna(ol: number) {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
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
    if (name === 'slidev-demo') {
      console.log(`[${name}] Skipping lacuna${ol} benchmark due to OOM..`);
      continue;
    }

    console.log(`[${name}] Warming up...`);

    const config = getTestCaseConfig(name);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      try {
        const r = await Optimizers[`lacuna${ol}`]({ name, code, env: config.env });
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
        await Optimizers[`lacuna${ol}`]({ name, code, env: config.env });
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
  timeData[`lacuna${ol}`] = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkEsbuild() {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../benchmarks');
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
        await Optimizers.esbuild({ name, code, env: 'browser' });
      } catch (e) {
        console.log(`[${name}] Warmup failed, skipping...`);
        continue;
      }
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      try {
        const start = performance.now();
        await Optimizers.esbuild({ name, code, env: 'browser' });
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
  timeData.esbuild = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}

async function benchmarkRolldown() {
  const srcFolder = join(import.meta.dirname, '../benchmarks');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));

  const results: Record<string, number> = {};

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const entry = join(srcFolder, file);
    const config = getTestCaseConfig(name);

    console.log(`[${name}] Warming up...`);

    for (let i = 0; i < WARMUP_RUNS; i++) {
      await bundlers.rolldown({ name, entry, env: config.env, cjs: false, excludeReact: false },
        // @ts-expect-error
        true
      );
    }

    const times: number[] = [];

    for (let i = 0; i < BENCHMARK_RUNS; i++) {
      const start = performance.now();
      await bundlers.rolldown({ name, entry, env: config.env, cjs: false, excludeReact: false },
        // @ts-expect-error
        true
      );
      times.push(performance.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[name] = avgTime;

    console.log(`[${name}] Time: ${avgTime.toFixed(2)}ms`);
  }

  const timeData = JSON.parse(await readFile(join(import.meta.dirname, '../time.json'), 'utf-8').catch(() => '{}'));
  timeData.rolldown = results;
  await writeFile(join(import.meta.dirname, '../time.json'), JSON.stringify(timeData, null, 2));
  console.log('\nResults saved to time.json');
}


async function main() {
  const optimizer = process.argv[2];


  if (!optimizer) {
    console.log('No optimizer specified, running all benchmarks...\n');
    await benchmarkJsshaker();
    await benchmarkJsshakerNoCache();
    await benchmarkTerser();
    await benchmarkRollup();
    await benchmarkGcc();
    await benchmarkGccAdv();
    await benchmarkLacuna(2);
    await benchmarkLacuna(3);
    await benchmarkEsbuild();
    await benchmarkRolldown();
    console.log('\nAll benchmarks completed!');
    return;
  }

  if (optimizer.startsWith('{')) {
    const options: Partial<Options> = JSON.parse(optimizer);
    console.log('Running jsshaker benchmark with options:', options);
    await benchmarkJsshakerConfigs(options);
    return;
  }

  for (const o of optimizer.split(',').map(s => s.trim())) {
    switch (o) {
      case 'jsshaker':
        await benchmarkJsshaker([DEFAULT_DEPTH]);
        break;
      case 'jsshakerDepths':
        await benchmarkJsshaker();
        break;
      case 'jsshakerNoCache':
        await benchmarkJsshakerNoCache();
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
      case 'lacuna2':
        await benchmarkLacuna(2);
        break;
      case 'lacuna3':
        await benchmarkLacuna(3);
        break;
      case 'esbuild':
        await benchmarkEsbuild();
        break;
      case 'rolldown':
        await benchmarkRolldown();
        break;
      default:
        console.error(`Unknown optimizer: ${o}`);
        console.error('Available: jsshaker, jsshakerDepths, jsshakerNoCache, terser, rollup, gcc, gccAdv, lacuna2, lacuna3, esbuild, rolldown');
        console.error('Or run without arguments to test all optimizers');
        process.exit(1);
    }
  }
}

main().catch(console.error);
