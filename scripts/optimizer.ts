// @ts-ignore
import { prepackSources } from 'prepack/lib/prepack-standalone.js'
import { gcc } from './cc.ts';
import assert from 'assert';

export interface OptimizeOptions {
  name: string
  code: string
  env: 'browser' | 'node';
}

export const Optimizers: Record<string, (options: OptimizeOptions) => Promise<string>> = {
  async jsshaker({ name, code }) {
    const { shakeSingleModule } = await import('jsshaker');
    console.log(`[${name}] Running jsshaker...`);
    const result = shakeSingleModule(code, {
      preset: "smallest",
      jsx: "react",
    });
    for (const msg of result.diagnostics) {
      console.log(`[${name}] [jsshaker]`, msg);
    }
    return result.output.code;
  },
  async rollup({ code }) {
    const { rollup } = await import('rollup');
    const { default: virtual } = await import('@rollup/plugin-virtual');

    const bundle = await rollup({
      input: 'entry',
      plugins: [
        virtual({
          entry: code,
        }),
      ],
      treeshake: {
        moduleSideEffects: false,
      }
    });
    const { output } = await bundle.generate({
      format: 'esm',
    });
    return output[0].code;
  },
  async rolldown({ code, env }) {
    const { build } = await import('rolldown');
    const result = await build({
      write: false,
      platform: env,
      input: 'data:text/javascript,' + encodeURIComponent(code),
    });
    assert(result.output.length === 1, 'Expected exactly one output');
    return result.output[0].code;
  },
  async esbuild({ code }) {
    const esbuild = await import('esbuild');
    const result = await esbuild.transform(code, {
      minify: true,
      loader: 'js',
    });
    return result.code;
  },
  async terser({ name, code }) {
    code = code.replace('await _checkWebCodecsH264DecodeSupport()', 'await (_checkWebCodecsH264DecodeSupport())');

    try {
      const { minify } = await import('terser');
      const result = await minify(code);
      return result.code!;
    }
    catch (e) {
      console.error(`[${name}] [terser] Minification failed:`, e);
      return ''
    }
  },
  async swc({ code }) {
    const { transform } = await import('@swc/core');
    const result = await transform(code, {
      minify: true,
    });
    return result.code!;
  },
  async oxc({ name, code }) {
    const { minify } = await import('oxc-minify');
    const result = await minify(`${name}.mjs`, code, {
      module: true,
      compress: true,
      mangle: {
        toplevel: true,
      },
      codegen: {
        removeWhitespace: true,
      },
    });
    return result.code;
  },
  async oxcPretty({ name, code }) {
    const { minify } = await import('oxc-minify');
    const result = await minify(`${name}.mjs`, code, {
      module: true,
      compress: true,
      mangle: {
        toplevel: true,
      },
      codegen: {
        removeWhitespace: false,
      },
    });
    return result.code;
  },
  async gcc({ code }) {
    try {
      return await gcc(code, {
        compilationLevel: 'SIMPLE',
        languageIn: 'ECMASCRIPT_NEXT',
        languageOut: 'ECMASCRIPT_NEXT',
        // warningLevel: 'QUIET',
      });
    } catch (e) {
      console.error('[gcc-adv] Compilation failed:', e);
      return ''
    }
  },
  async gccAdv({ code }) {
    try {
      return await gcc(code, {
        compilationLevel: 'ADVANCED',
        languageIn: 'ECMASCRIPT_NEXT',
        languageOut: 'ECMASCRIPT_NEXT',
        // warningLevel: 'QUIET',
      });
    } catch (e) {
      console.error('[gcc-adv] Compilation failed:', e);
      return ''
    }
  },
  async prepack({ name, code }) {
    const res = prepackSources([{
      filePath: `${name}.js`,
      fileContents: code,
      sourceMapContents: ''
    }], {
    })
    return res.code;
  },
  async lacuna({ code }) {
    const lacunaAnalyzers = { jelly: 0.5 }; // e.g., { "static": 0.6, "acg": 0.5 }
    const lacunaOLevel = 2; // 0-3, optimization level

    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const os = await import('node:os');

    // Create a temporary directory for Lacuna to work with
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lacuna-'));
    // Resolve to absolute path to avoid relative path issues
    const absTmpDir = path.resolve(tmpDir);

    try {
      // Write the input code as a JS file
      const scriptFile = path.join(absTmpDir, 'input.js');
      await fs.writeFile(scriptFile, code, 'utf8');

      // Create a package.json for analyzers that need it (like jelly)
      const packageJson = {
        name: 'lacuna-temp',
        version: '1.0.0',
        type: 'module'
      };
      await fs.writeFile(path.join(absTmpDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');

      // Create an HTML entry file that references the JS file
      // Lacuna requires an HTML entry point
      const entryHtml = path.join(absTmpDir, 'index.html');
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <script src="./input.js"></script>
</head>
<body>
</body>
</html>`;
      await fs.writeFile(entryHtml, htmlContent, 'utf8');

      // Import and run Lacuna
      const { run } = await import('../vendor/Lacuna/lacuna_runner.js');

      // Prepare analyzer configuration
      const analyzerConfig: Record<string, string> = {};
      for (const [analyzer, threshold] of Object.entries(lacunaAnalyzers)) {
        analyzerConfig[analyzer] = threshold.toString();
      }

      // Change to the temp directory before running Lacuna
      // This helps Lacuna resolve paths correctly
      const originalCwd = process.cwd();
      process.chdir(absTmpDir);

      try {
        // Run Lacuna with specified options
        const runOptions = {
          directory: absTmpDir,
          entry: 'index.html', // HTML entry file
          analyzer: JSON.stringify(analyzerConfig),
          olevel: lacunaOLevel, // 0: no optimization, 1: lazy load, 2: empty body, 3: replace with null
          force: true,
          destination: null,
        };

        // Run Lacuna and wait for completion
        await new Promise((resolve, reject) => {
          try {
            run(runOptions, (log: any) => {
              if (log) {
                resolve(log);
              } else {
                reject(new Error('Lacuna optimization failed'));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      } finally {
        // Restore original working directory
        process.chdir(originalCwd);
      }

      // Read the optimized code back from the JS file
      const optimizedCode = await fs.readFile(scriptFile, 'utf8');
      return optimizedCode;

    } finally {
      // Clean up temporary directory
      await fs.rm(absTmpDir, { recursive: true, force: true });
    }
  },
}