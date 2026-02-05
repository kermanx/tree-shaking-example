import { summary } from './cli.ts';
import type { OptimizeOptions } from './optimizer.ts';
import { shakeSingleModule, type Options } from 'jsshaker';


export async function jsshaker({ name, code }: OptimizeOptions, options: Options = {
  preset: "smallest",
  jsx: "react",
  // maxRecursionDepth: 2,
  // rememberExhaustedVariables: false,
  // eagerExhaustiveCallbacks: true,
  // enableFnCache: false,
}) {
  console.log(`[${name}] Running jsshaker...`);

  const startTime = performance.now();
  const result = shakeSingleModule(code, options);
  const endTime = performance.now();
  console.log(`[${name}] jsshaker completed in ${(endTime - startTime).toFixed(2)} ms`);
  (summary.time ??= {})[name] = endTime - startTime;

  for (const msg of result.diagnostics) {
    console.log(`[${name}] [jsshaker]`, msg);
  }
  return result.output.code;
}
