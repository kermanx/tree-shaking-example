/**
 * Memory measurement worker — run as an isolated child process.
 *
 * Usage:
 *   node --experimental-strip-types --expose-gc memory-worker.ts \
 *     <optimizer> <inputPath> <name> [inputType=code|entry]
 *
 * stdout protocol (two lines, in order):
 *   1. "READY"  — warmup done, baseline GC'd; parent should start RSS monitoring
 *                 now and the child will begin the measured run in ~15 ms.
 *   2. <JSON>   — heap / external peak deltas measured inside the child.
 *                 RSS is NOT included here; the parent derives it from /proc.
 *
 * stderr: all console output from the optimizer being measured.
 *
 * Design notes
 * ────────────────────────────────────────────────────────────────────────────
 * RSS is no longer tracked inside this process.  The reason: after the warmup
 * run, Rust-based NAPI tools (jsshaker, rolldown) leave their jemalloc / mimalloc
 * pool resident in the process.  V8's gc() cannot reclaim that memory, so the
 * post-warmup RSS baseline already includes the Rust footprint.  Any delta
 * measured from inside would be 0 for most inputs (pool is reused) and
 * unreliable for the rest.
 *
 * Instead, the parent process reads /proc/<pid>/statm continuously from outside
 * and derives the true peak RSS during the measured run.  It also records the
 * RSS at the moment this worker signals READY, so the caller can report both
 * the "warm baseline" (module load + warmup pool) and the "delta during run".
 *
 * Heap / external metrics remain measured inside the child because they are
 * inaccessible from /proc.
 */

import { Optimizers } from './optimizer.ts';
import { bundlers } from './bundle.ts';
import { readFile } from 'node:fs/promises';
import { getTestCaseConfig } from './config.ts';

// ── redirect console.* to stderr so stdout carries only the protocol lines ──
const toStderr = (...args: unknown[]): void => {
  process.stderr.write(args.map(String).join(' ') + '\n');
};
console.log = toStderr;
console.error = toStderr;
console.warn = toStderr;
console.info = toStderr;

// ── parse arguments ──────────────────────────────────────────────────────────
const [, , optimizerName, inputPath, nameArg, inputType = 'code'] = process.argv;

if (!optimizerName || !inputPath) {
  process.stderr.write(
    'Usage: memory-worker.ts <optimizer> <inputPath> <name> [inputType=code|entry]\n',
  );
  process.exit(1);
}

const name =
  nameArg ?? inputPath.split('/').pop()!.replace(/_rollup.*$/, '').replace(/\.js$/, '');

const config = getTestCaseConfig(name);
const env = config.env;

// ── helpers ──────────────────────────────────────────────────────────────────

function forceGC(): void {
  if (typeof (globalThis as any).gc === 'function') {
    (globalThis as any).gc();
    (globalThis as any).gc();
    (globalThis as any).gc();
  }
}

async function runOptimizer(): Promise<string> {
  if (inputType === 'entry') {
    return bundlers[optimizerName]({ name, entry: inputPath, env, cjs: false, excludeReact: false });
  }
  const code = await readFile(inputPath, 'utf-8');
  
  // Special handling for jsshaker with environment variables
  if (optimizerName === 'jsshaker') {
    const { jsshaker } = await import('./jsshaker.ts');
    const options: any = {};
    
    if (process.env.JSSHAKER_NO_CACHE === '1') {
      options.enableFnCache = false;
    }
    
    if (process.env.JSSHAKER_DEPTH) {
      options.maxRecursionDepth = parseInt(process.env.JSSHAKER_DEPTH, 10);
    }
    
    return jsshaker({ name, code, env }, options);
  }
  
  return Optimizers[optimizerName]({ name, code, env });
}

// ── warmup ───────────────────────────────────────────────────────────────────
try {
  await runOptimizer();
} catch (e) {
  process.stderr.write(`Warmup failed: ${String(e)}\n`);
  process.exit(2);
}

// ── drain transient warmup allocations (V8 heap only; Rust pool stays) ───────
forceGC();
await new Promise<void>(r => setTimeout(r, 100));
forceGC();
await new Promise<void>(r => setTimeout(r, 50));

// ── signal: warmup complete, parent may start /proc RSS monitoring ────────────
// The parent needs time to receive this line, read /proc/<pid>/statm as baseline,
// and start its polling loop before we block the event loop (e.g. synchronous
// NAPI calls).  15 ms is conservative; even a loaded event loop will process
// the pipe data well within that window.
process.stdout.write('READY\n');
await new Promise<void>(r => setTimeout(r, 15));

// ── baseline for heap / external (inside-child metrics) ─────────────────────
const baseline = process.memoryUsage();
let peakHeap = baseline.heapUsed;
let peakExternal = baseline.external;

// poll heap between event-loop ticks (useful for async optimizers)
const poll = setInterval(() => {
  const m = process.memoryUsage();
  if (m.heapUsed > peakHeap) peakHeap = m.heapUsed;
  if (m.external > peakExternal) peakExternal = m.external;
}, 1);

// ── measured run ─────────────────────────────────────────────────────────────
try {
  await runOptimizer();
} finally {
  // Immediate post-run capture handles synchronous NAPI callers (e.g. jsshaker):
  // V8 GC cannot run during a synchronous call, so heap at this point reflects
  // all allocations made during execution.
  const m = process.memoryUsage();
  if (m.heapUsed > peakHeap) peakHeap = m.heapUsed;
  if (m.external > peakExternal) peakExternal = m.external;
  clearInterval(poll);
}

forceGC();
await new Promise<void>(r => setTimeout(r, 10));
const after = process.memoryUsage();

// ── emit heap / external result ──────────────────────────────────────────────
// RSS is intentionally omitted; the parent derives it from /proc/<pid>/statm.
process.stdout.write(
  JSON.stringify({
    peakHeapDelta: peakHeap - baseline.heapUsed,
    peakExternalDelta: peakExternal - baseline.external,
    finalHeapDelta: after.heapUsed - baseline.heapUsed,
  }) + '\n',
);

// Brief pause so the parent can read the final /proc RSS before we exit.
await new Promise<void>(r => setTimeout(r, 5));
