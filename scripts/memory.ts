/**
 * Peak memory benchmark for all optimizers.
 *
 * Usage:
 *   node --experimental-strip-types scripts/memory.ts [optimizer]
 *
 * optimizer:
 *   jsshaker | terser | rollup | gcc | gccAdv | lacuna2 | lacuna3 | esbuild | rolldown
 *   (omit to run all)
 *
 * Results → memory.json
 *
 * ── Measurement design ──────────────────────────────────────────────────────
 *
 * For each (optimizer, test-case, trial) a fresh subprocess is spawned with
 * --expose-gc.  The subprocess (memory-worker.ts) runs one warmup call, forces
 * triple GC, then emits "READY" to stdout.
 *
 * On "READY" this parent process:
 *   1. Reads /proc/<pid>/statm to record baselineRss (warm baseline: Node.js
 *      runtime + all loaded modules + Rust/NAPI warm allocation pool).
 *   2. Starts polling /proc/<pid>/statm at 1 ms intervals.
 *
 * 15 ms later the child runs the measured optimizer call.  The parent's poll
 * loop captures the true peak RSS regardless of whether the call is:
 *   • Async (rollup, esbuild, lacuna…) — event loop is free, poll fires normally.
 *   • Synchronous NAPI (jsshaker)       — event loop blocked; parent polls from
 *                                          its own process, completely unaffected.
 *
 * After the child writes the JSON result line the parent takes a final /proc
 * read and stops polling.
 *
 * ── Why /proc from the parent, not process.memoryUsage() in the child ────────
 *
 * Rust-based NAPI tools (jsshaker, rolldown) use jemalloc/mimalloc allocators
 * that do NOT return memory to the OS after use.  After the warmup run, the
 * Rust pool stays resident and appears in the child's RSS baseline.  Any
 * subsequent run that fits inside the pre-allocated pool shows peakRssDelta=0
 * when measured from inside.  Reading from /proc in the parent is unaffected
 * by this: the parent simply sees the child's total resident pages at every
 * poll tick and reports the real maximum.
 *
 * ── Reported metrics ────────────────────────────────────────────────────────
 *
 *  baselineRssMB   — RSS at READY time: module load + warmup pool overhead.
 *  peakRssDeltaMB  — max RSS growth beyond baseline during the measured run.
 *                    (from parent /proc polling — authoritative for all tools)
 *  totalPeakRssMB  — baselineRssMB + peakRssDeltaMB = absolute RSS peak.
 *                    Use this for cross-tool comparisons.
 *  peakHeapMB      — peak V8 heapUsed delta (from child; pure-JS tool detail).
 *  peakExternalMB  — peak NAPI external delta (from child).
 *  finalRssMB      — RSS delta after child's post-run GC (leak indicator).
 *  finalHeapMB     — heap delta after post-run GC.
 *
 *  gcc / lacuna note: these tools spawn a child JVM / Puppeteer process whose
 *  address space is separate from the Node.js wrapper.  Only the wrapper
 *  overhead is captured; JVM heap is not visible here.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

// ── constants ────────────────────────────────────────────────────────────────

const MEMORY_RUNS = 3;
/** Linux page size (bytes).  4096 on all practical x86-64 and ARM64 systems. */
const PAGE_SIZE = 4096;

type OptimizerType =
  | 'jsshaker'
  | 'terser' | 'rollup' | 'gcc' | 'gccAdv'
  | 'lacuna2' | 'lacuna3' | 'esbuild' | 'rolldown';

// ── types ────────────────────────────────────────────────────────────────────

interface MemoryResult {
  /** RSS at the moment the child signals READY (bytes). */
  baselineRss: number;
  /** Max RSS growth beyond baseline during the measured run (bytes, from /proc). */
  peakRssDelta: number;
  /** Peak V8 heapUsed increase during measured run (bytes, from child). */
  peakHeapDelta: number;
  /** Peak NAPI external memory increase during measured run (bytes, from child). */
  peakExternalDelta: number;
  /** RSS delta after post-run GC vs baseline (bytes, from /proc). */
  finalRssDelta: number;
  /** V8 heap delta after post-run GC vs baseline (bytes, from child). */
  finalHeapDelta: number;
}

interface FileSummary {
  /** RSS at measurement start — module load + Rust warm pool (MB). */
  baselineRssMB: number;
  /** Max RSS growth beyond baseline during run (MB). */
  peakRssDeltaMB: number;
  /** baselineRssMB + peakRssDeltaMB = absolute peak RSS (MB). */
  totalPeakRssMB: number;
  /** Peak V8 heap increase (MB). */
  peakHeapMB: number;
  /** Peak NAPI external increase (MB). */
  peakExternalMB: number;
  /** Retained RSS after GC (MB). */
  finalRssMB: number;
  /** Retained heap after GC (MB). */
  finalHeapMB: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function fmt(mb: number): string {
  return mb.toFixed(2).padStart(7);
}

/**
 * Read the resident set size of a process from /proc/<pid>/statm.
 * Returns bytes, or 0 if the file cannot be read (process exited, etc.).
 */
function readProcRss(pid: number): number {
  try {
    // statm format: size resident shared text lib data dirty  (all in pages)
    const statm = readFileSync(`/proc/${pid}/statm`, 'utf-8');
    const residentPages = parseInt(statm.split(' ')[1], 10);
    return isNaN(residentPages) ? 0 : residentPages * PAGE_SIZE;
  } catch {
    return 0;
  }
}

// ── subprocess driver ────────────────────────────────────────────────────────

/**
 * Spawn one isolated measurement subprocess for a single (optimizer, file) pair
 * and return the combined MemoryResult (RSS from parent /proc, heap from child).
 */
async function spawnMemoryWorker(
  optimizerName: string,
  inputPath: string,
  name: string,
  inputType: 'code' | 'entry',
): Promise<MemoryResult | null> {
  const workerPath = join(import.meta.dirname, 'memory-worker.ts');

  return new Promise(resolve => {
    let resolved = false;
    const done = (v: MemoryResult | null) => {
      if (!resolved) { resolved = true; resolve(v); }
    };

    const child = spawn(
      process.execPath,
      [
        '--experimental-strip-types',
        '--expose-gc',
        workerPath,
        optimizerName,
        inputPath,
        name,
        inputType,
      ],
      { stdio: ['ignore', 'pipe', 'inherit'] },
    );

    if (!child.pid) {
      done(null);
      return;
    }

    const pid = child.pid;
    let baselineRss = 0;
    let peakRssDelta = 0;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let monitoring = false;

    function stopMonitoring(): number {
      monitoring = false;
      if (pollTimer !== null) { clearInterval(pollTimer); pollTimer = null; }
      return readProcRss(pid);
    }

    // Line-buffer stdout so we can parse "READY" and the JSON line separately.
    let stdoutBuf = '';

    function handleLine(line: string): void {
      const trimmed = line.trim();

      if (trimmed === 'READY') {
        // Record baseline RSS immediately — this is the warm-state footprint
        // (Node.js runtime + all loaded modules + Rust allocator warm pool).
        baselineRss = readProcRss(pid);
        peakRssDelta = 0;
        monitoring = true;

        // Poll the child's RSS from the parent at 1 ms.  Because we are a
        // separate process, this works even when the child is blocked in a
        // synchronous NAPI call (e.g. jsshaker's shakeSingleModule).
        pollTimer = setInterval(() => {
          if (!monitoring) return;
          const rss = readProcRss(pid);
          const delta = rss - baselineRss;
          if (delta > peakRssDelta) peakRssDelta = delta;
        }, 1);

      } else if (trimmed.startsWith('{')) {
        // Child has finished the measured run and post-run GC.
        // Take a final /proc read before the child exits.
        const finalRss = stopMonitoring();
        try {
          const childResult = JSON.parse(trimmed) as {
            peakHeapDelta: number;
            peakExternalDelta: number;
            finalHeapDelta: number;
          };
          done({
            baselineRss,
            peakRssDelta: Math.max(0, peakRssDelta),
            peakHeapDelta: childResult.peakHeapDelta,
            peakExternalDelta: childResult.peakExternalDelta,
            finalRssDelta: Math.max(0, finalRss - baselineRss),
            finalHeapDelta: childResult.finalHeapDelta,
          });
        } catch {
          console.error(`  [memory-worker] could not parse: ${trimmed.slice(0, 200)}`);
          done(null);
        }
      }
    }

    child.stdout.on('data', (chunk: Buffer) => {
      stdoutBuf += chunk.toString();
      let nl: number;
      while ((nl = stdoutBuf.indexOf('\n')) !== -1) {
        const line = stdoutBuf.slice(0, nl);
        stdoutBuf = stdoutBuf.slice(nl + 1);
        handleLine(line);
      }
    });

    child.on('close', (code: number | null) => {
      stopMonitoring();
      if (code !== 0) {
        console.error(`  [memory-worker] exited with code ${code}`);
        done(null);
      } else {
        // If the child exited cleanly but we never parsed a JSON line
        // (e.g. warmup failed with exit 2), resolve null.
        done(null);
      }
    });

    child.on('error', (err: Error) => {
      stopMonitoring();
      console.error(`  [memory-worker] spawn error: ${err.message}`);
      done(null);
    });
  });
}

// ── per-optimizer benchmark ──────────────────────────────────────────────────

async function benchmarkMemory(optimizer: OptimizerType): Promise<void> {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));

  function getInputPath(name: string): string {
    switch (optimizer) {
      case 'rollup':
      case 'rolldown':
        return join(srcFolder, `${name}.js`);
      case 'terser':
        return join(distFolder, `${name}_rollup_jsshaker.js`);
      default:
        return join(distFolder, `${name}_rollup.js`);
    }
  }

  const inputType: 'code' | 'entry' =
    optimizer === 'rollup' || optimizer === 'rolldown' ? 'entry' : 'code';

  const results: Record<string, FileSummary> = {};

  console.log(`\n${'─'.repeat(72)}`);
  console.log(`Memory benchmark: ${optimizer}`);
  console.log(`${'─'.repeat(72)}`);
  console.log(
    `  ${'file'.padEnd(14)} run  baseline  +delta  =total   heap   ext   finalRSS`,
  );

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const inputPath = getInputPath(name);

    if (!existsSync(inputPath)) {
      console.log(`  [${name}] input not found — skipping`);
      continue;
    }

    const runs: MemoryResult[] = [];

    for (let i = 0; i < MEMORY_RUNS; i++) {
      process.stdout.write(
        `  ${name.padEnd(14)} ${i + 1}/${MEMORY_RUNS}  `,
      );
      const result = await spawnMemoryWorker(optimizer, inputPath, name, inputType);
      if (result) {
        runs.push(result);
        const b = result.baselineRss / 1024 / 1024;
        const d = result.peakRssDelta / 1024 / 1024;
        process.stdout.write(
          `${fmt(b)} MB  +${fmt(d)} MB  =${fmt(b + d)} MB` +
          `  heap+${fmt(result.peakHeapDelta / 1024 / 1024)} MB\n`,
        );
      } else {
        process.stdout.write('FAILED\n');
      }
    }

    if (runs.length === 0) {
      console.log(`  [${name}] all runs failed — skipping`);
      continue;
    }

    const baselineRssMB = median(runs.map(r => r.baselineRss)) / 1024 / 1024;
    const peakRssDeltaMB = median(runs.map(r => r.peakRssDelta)) / 1024 / 1024;
    const peakHeapMB = median(runs.map(r => r.peakHeapDelta)) / 1024 / 1024;
    const peakExternalMB = median(runs.map(r => r.peakExternalDelta)) / 1024 / 1024;
    const finalRssMB = median(runs.map(r => r.finalRssDelta)) / 1024 / 1024;
    const finalHeapMB = median(runs.map(r => r.finalHeapDelta)) / 1024 / 1024;

    results[name] = {
      baselineRssMB,
      peakRssDeltaMB,
      totalPeakRssMB: baselineRssMB + peakRssDeltaMB,
      peakHeapMB,
      peakExternalMB,
      finalRssMB,
      finalHeapMB,
    };

    console.log(
      `  ${name.padEnd(14)} med  ${fmt(baselineRssMB)} MB` +
      `  +${fmt(peakRssDeltaMB)} MB  =${fmt(baselineRssMB + peakRssDeltaMB)} MB` +
      `  heap+${fmt(peakHeapMB)} MB` +
      `  ext+${fmt(peakExternalMB)} MB` +
      `  finalRSS+${fmt(finalRssMB)} MB`,
    );
  }

  // Compute average across all test cases (exclude any existing _average entry).
  const dataEntries = Object.entries(results).filter(([k]) => k !== '_average');
  if (dataEntries.length > 0) {
    const avg = (key: keyof FileSummary): number =>
      dataEntries.reduce((sum, [, v]) => sum + v[key], 0) / dataEntries.length;
    results['_average'] = {
      baselineRssMB: avg('baselineRssMB'),
      peakRssDeltaMB: avg('peakRssDeltaMB'),
      totalPeakRssMB: avg('totalPeakRssMB'),
      peakHeapMB: avg('peakHeapMB'),
      peakExternalMB: avg('peakExternalMB'),
      finalRssMB: avg('finalRssMB'),
      finalHeapMB: avg('finalHeapMB'),
    };
  }

  const memoryPath = join(import.meta.dirname, '../data/memory.json');
  const memoryData = JSON.parse(await readFile(memoryPath, 'utf-8').catch(() => '{}'));
  memoryData[optimizer] = results;

  // Maintain top-level _average: { [optimizer]: number } — one representative
  // number per tool.  totalPeakRssMB (baseline + delta = absolute RSS peak) is
  // the best single metric; it is always present for new-format entries.
  memoryData['_average'] ??= {};
  const repVal =
    dataEntries.reduce((s, [, v]) => s + v.totalPeakRssMB, 0) / dataEntries.length;
  memoryData['_average'][optimizer] = repVal;

  await writeFile(memoryPath, JSON.stringify(memoryData, null, 2));
  console.log(`\nResults saved to data/memory.json`);
}

// ── special jsshaker variants ────────────────────────────────────────────────

async function benchmarkJsshakerNoCache(): Promise<void> {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));

  const results: Record<string, FileSummary> = {};

  console.log(`\n${'─'.repeat(72)}`);
  console.log(`Memory benchmark: jsshakerNoCache`);
  console.log(`${'─'.repeat(72)}`);
  console.log(
    `  ${'file'.padEnd(14)} run  baseline  +delta  =total   heap   ext   finalRSS`,
  );

  for (const file of srcFiles) {
    const name = file.replace('.js', '');
    const inputPath = join(distFolder, `${name}_rollup.js`);

    if (!existsSync(inputPath)) {
      console.log(`  [${name}] input not found — skipping`);
      continue;
    }

    const runs: MemoryResult[] = [];

    for (let i = 0; i < MEMORY_RUNS; i++) {
      process.stdout.write(
        `  ${name.padEnd(14)} ${i + 1}/${MEMORY_RUNS}  `,
      );
      // Pass enableFnCache:false via environment to memory-worker
      process.env.JSSHAKER_NO_CACHE = '1';
      const result = await spawnMemoryWorker('jsshaker', inputPath, name, 'code');
      delete process.env.JSSHAKER_NO_CACHE;
      
      if (result) {
        runs.push(result);
        const b = result.baselineRss / 1024 / 1024;
        const d = result.peakRssDelta / 1024 / 1024;
        process.stdout.write(
          `${fmt(b)} MB  +${fmt(d)} MB  =${fmt(b + d)} MB` +
          `  heap+${fmt(result.peakHeapDelta / 1024 / 1024)} MB\n`,
        );
      } else {
        process.stdout.write('FAILED\n');
      }
    }

    if (runs.length === 0) {
      console.log(`  [${name}] all runs failed — skipping`);
      continue;
    }

    const baselineRssMB = median(runs.map(r => r.baselineRss)) / 1024 / 1024;
    const peakRssDeltaMB = median(runs.map(r => r.peakRssDelta)) / 1024 / 1024;
    const peakHeapMB = median(runs.map(r => r.peakHeapDelta)) / 1024 / 1024;
    const peakExternalMB = median(runs.map(r => r.peakExternalDelta)) / 1024 / 1024;
    const finalRssMB = median(runs.map(r => r.finalRssDelta)) / 1024 / 1024;
    const finalHeapMB = median(runs.map(r => r.finalHeapDelta)) / 1024 / 1024;

    results[name] = {
      baselineRssMB,
      peakRssDeltaMB,
      totalPeakRssMB: baselineRssMB + peakRssDeltaMB,
      peakHeapMB,
      peakExternalMB,
      finalRssMB,
      finalHeapMB,
    };

    console.log(
      `  ${name.padEnd(14)} med  ${fmt(baselineRssMB)} MB` +
      `  +${fmt(peakRssDeltaMB)} MB  =${fmt(baselineRssMB + peakRssDeltaMB)} MB` +
      `  heap+${fmt(peakHeapMB)} MB` +
      `  ext+${fmt(peakExternalMB)} MB` +
      `  finalRSS+${fmt(finalRssMB)} MB`,
    );
  }

  // Compute average
  const dataEntries = Object.entries(results).filter(([k]) => k !== '_average');
  if (dataEntries.length > 0) {
    const avg = (key: keyof FileSummary): number =>
      dataEntries.reduce((sum, [, v]) => sum + v[key], 0) / dataEntries.length;
    results['_average'] = {
      baselineRssMB: avg('baselineRssMB'),
      peakRssDeltaMB: avg('peakRssDeltaMB'),
      totalPeakRssMB: avg('totalPeakRssMB'),
      peakHeapMB: avg('peakHeapMB'),
      peakExternalMB: avg('peakExternalMB'),
      finalRssMB: avg('finalRssMB'),
      finalHeapMB: avg('finalHeapMB'),
    };
  }

  const memoryPath = join(import.meta.dirname, '../data/memory.json');
  const memoryData = JSON.parse(await readFile(memoryPath, 'utf-8').catch(() => '{}'));
  memoryData['jsshakerNoCache'] = results;

  memoryData['_average'] ??= {};
  const repVal =
    dataEntries.reduce((s, [, v]) => s + v.totalPeakRssMB, 0) / dataEntries.length;
  memoryData['_average']['jsshakerNoCache'] = repVal;

  await writeFile(memoryPath, JSON.stringify(memoryData, null, 2));
  console.log(`\nResults saved to data/memory.json`);
}

async function benchmarkJsshakerDepths(): Promise<void> {
  const distFolder = join(import.meta.dirname, '../dist');
  const srcFolder = join(import.meta.dirname, '../src');
  const srcFiles = (await readdir(srcFolder)).filter(f => f.endsWith('.js'));
  const depths = [1, 2, 3, 4, 5];

  const memoryPath = join(import.meta.dirname, '../data/memory.json');
  const memoryData = JSON.parse(await readFile(memoryPath, 'utf-8').catch(() => '{}'));

  for (const depth of depths) {
    const optimizerName = `jsshakerDepth${depth}`;
    const results: Record<string, FileSummary> = {};

    console.log(`\n${'─'.repeat(72)}`);
    console.log(`Memory benchmark: ${optimizerName}`);
    console.log(`${'─'.repeat(72)}`);
    console.log(
      `  ${'file'.padEnd(14)} run  baseline  +delta  =total   heap   ext   finalRSS`,
    );

    for (const file of srcFiles) {
      const name = file.replace('.js', '');
      const inputPath = join(distFolder, `${name}_rollup.js`);

      if (!existsSync(inputPath)) {
        console.log(`  [${name}] input not found — skipping`);
        continue;
      }

      const runs: MemoryResult[] = [];

      for (let i = 0; i < MEMORY_RUNS; i++) {
        process.stdout.write(
          `  ${name.padEnd(14)} ${i + 1}/${MEMORY_RUNS}  `,
        );
        // Pass maxRecursionDepth via environment to memory-worker
        process.env.JSSHAKER_DEPTH = depth.toString();
        const result = await spawnMemoryWorker('jsshaker', inputPath, name, 'code');
        delete process.env.JSSHAKER_DEPTH;
        
        if (result) {
          runs.push(result);
          const b = result.baselineRss / 1024 / 1024;
          const d = result.peakRssDelta / 1024 / 1024;
          process.stdout.write(
            `${fmt(b)} MB  +${fmt(d)} MB  =${fmt(b + d)} MB` +
            `  heap+${fmt(result.peakHeapDelta / 1024 / 1024)} MB\n`,
          );
        } else {
          process.stdout.write('FAILED\n');
        }
      }

      if (runs.length === 0) {
        console.log(`  [${name}] all runs failed — skipping`);
        continue;
      }

      const baselineRssMB = median(runs.map(r => r.baselineRss)) / 1024 / 1024;
      const peakRssDeltaMB = median(runs.map(r => r.peakRssDelta)) / 1024 / 1024;
      const peakHeapMB = median(runs.map(r => r.peakHeapDelta)) / 1024 / 1024;
      const peakExternalMB = median(runs.map(r => r.peakExternalDelta)) / 1024 / 1024;
      const finalRssMB = median(runs.map(r => r.finalRssDelta)) / 1024 / 1024;
      const finalHeapMB = median(runs.map(r => r.finalHeapDelta)) / 1024 / 1024;

      results[name] = {
        baselineRssMB,
        peakRssDeltaMB,
        totalPeakRssMB: baselineRssMB + peakRssDeltaMB,
        peakHeapMB,
        peakExternalMB,
        finalRssMB,
        finalHeapMB,
      };

      console.log(
        `  ${name.padEnd(14)} med  ${fmt(baselineRssMB)} MB` +
        `  +${fmt(peakRssDeltaMB)} MB  =${fmt(baselineRssMB + peakRssDeltaMB)} MB` +
        `  heap+${fmt(peakHeapMB)} MB` +
        `  ext+${fmt(peakExternalMB)} MB` +
        `  finalRSS+${fmt(finalRssMB)} MB`,
      );
    }

    // Compute average
    const dataEntries = Object.entries(results).filter(([k]) => k !== '_average');
    if (dataEntries.length > 0) {
      const avg = (key: keyof FileSummary): number =>
        dataEntries.reduce((sum, [, v]) => sum + v[key], 0) / dataEntries.length;
      results['_average'] = {
        baselineRssMB: avg('baselineRssMB'),
        peakRssDeltaMB: avg('peakRssDeltaMB'),
        totalPeakRssMB: avg('totalPeakRssMB'),
        peakHeapMB: avg('peakHeapMB'),
        peakExternalMB: avg('peakExternalMB'),
        finalRssMB: avg('finalRssMB'),
        finalHeapMB: avg('finalHeapMB'),
      };
    }

    memoryData[optimizerName] = results;

    memoryData['_average'] ??= {};
    const repVal =
      dataEntries.reduce((s, [, v]) => s + v.totalPeakRssMB, 0) / dataEntries.length;
    memoryData['_average'][optimizerName] = repVal;
  }

  await writeFile(memoryPath, JSON.stringify(memoryData, null, 2));
  console.log(`\nResults for all depths saved to data/memory.json`);
}

async function benchmarkAllMemory(): Promise<void> {
  const optimizers: OptimizerType[] = [
    'jsshaker',
    'terser', 'rollup', 'gcc', 'gccAdv',
    'lacuna2', 'lacuna3', 'esbuild', 'rolldown',
  ];
  for (const optimizer of optimizers) {
    await benchmarkMemory(optimizer);
  }
  
  // Special jsshaker variants
  await benchmarkJsshakerNoCache();
  await benchmarkJsshakerDepths();
  
  console.log('\nAll memory benchmarks completed!');
}

// ── entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg) {
    console.log('No optimizer specified — running all memory benchmarks...');
    await benchmarkAllMemory();
    return;
  }

  // Special cases for jsshaker variants
  if (arg === 'jsshakerNoCache') {
    await benchmarkJsshakerNoCache();
    return;
  }

  if (arg === 'jsshakerDepths') {
    await benchmarkJsshakerDepths();
    return;
  }

  const valid: OptimizerType[] = [
    'jsshaker',
    'terser', 'rollup', 'gcc', 'gccAdv',
    'lacuna2', 'lacuna3', 'esbuild', 'rolldown',
  ];

  if (!valid.includes(arg as OptimizerType)) {
    console.error(`Unknown optimizer: ${arg}`);
    console.error(`Available: ${valid.join(', ')}, jsshakerNoCache, jsshakerDepths`);
    process.exit(1);
  }

  await benchmarkMemory(arg as OptimizerType);
}

main().catch(console.error);
