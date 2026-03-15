import type { OptimizeOptions } from './optimizer.ts';
import { shakeSingleModule, type Options } from 'jsshaker';


export async function jsshaker({ name, code }: OptimizeOptions, options: Partial<Options> = {}) {
  options = Object.assign({
    preset: "smallest",
    jsx: "react",
    // maxRecursionDepth: 2,
    // rememberExhaustedVariables: false,
    // eagerExhaustiveCallbacks: true,
    // enableFnCache: false,

    // constantFolding: 'enabled',
    // propertyMangling: 'enabled',
  }, options);

  if (process.env.REC_DEPTH) {
    options.maxRecursionDepth = parseInt(process.env.REC_DEPTH);
    console.log(`[${name}] Using maxRecursionDepth: ${options.maxRecursionDepth}`);
  }

  console.log(`[${name}] Running jsshaker...`);

  const startTime = performance.now();
  const result = shakeSingleModule(code, options);
  const endTime = performance.now();
  console.log(`[${name}] jsshaker completed in ${(endTime - startTime).toFixed(2)} ms`);

  for (const msg of result.diagnostics) {
    console.log(`[${name}] [jsshaker]`, msg);
  }
  return result.output.code;
}
