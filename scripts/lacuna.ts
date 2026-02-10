/**
 * Lacuna dead code elimination optimizer
 *
 * Current Configuration: Dynamic + Jelly
 * - Dynamic analyzer: Runtime analysis with Puppeteer (threshold: 0.5)
 * - Jelly analyzer: Modern static analysis supporting ES6+ (threshold: 0.5)
 * - Optimization level: 2 (replace function body with empty functions)
 *
 * Jelly advantages:
 * - Supports modern ES6+ syntax (arrow functions, classes, modules, etc.)
 * - More robust than TAJS for complex codebases
 * - No need for ES5 transpilation
 */

export interface LacunaOptions {
  code: string;
  analyzers?: Record<string, number>;
  optimizationLevel?: number;
}

export async function lacuna({
  code,
  analyzers = { dynamic: 0.5, jelly: 0.5 },
  optimizationLevel = 2
}: LacunaOptions): Promise<string> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');

  // Create a temporary directory for Lacuna to work with
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lacuna-'));
  const absTmpDir = path.resolve(tmpDir);

  try {
    // Write the code as a JS file (no transpilation needed for Jelly)
    const scriptFile = path.join(absTmpDir, 'input.js');
    await fs.writeFile(scriptFile, code, 'utf8');

    // Create a package.json for analyzers that need it
    const packageJson = {
      name: 'lacuna-temp',
      version: '1.0.0',
      type: 'module'
    };
    await fs.writeFile(
      path.join(absTmpDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );

    // Create an HTML entry file that references the JS file
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
    for (const [analyzer, threshold] of Object.entries(analyzers)) {
      analyzerConfig[analyzer] = threshold.toString();
    }

    // Run Lacuna with specified options
    const runOptions = {
      directory: absTmpDir,
      entry: 'index.html',
      analyzer: JSON.stringify(analyzerConfig),
      olevel: optimizationLevel, // 0: no optimization, 1: lazy load, 2: empty body, 3: replace with null
      force: true,
      destination: null,
    };

    console.log(`[lacuna] Running with analyzers: ${Object.keys(analyzers).join(' + ')}`);

    // Run Lacuna and wait for completion
    await new Promise((resolve, reject) => {
      run(runOptions, (log: any) => {
        if (log) {
          resolve(log);
        } else {
          reject(new Error('Lacuna optimization failed'));
        }
      });
    });

    // Read the optimized code back from the JS file
    const optimizedCode = await fs.readFile(scriptFile, 'utf8');
    return optimizedCode;

  } catch (e) {
    console.error('[lacuna] Optimization failed:', e);
    return '';
  } finally {
    // Clean up temporary directory
    try {
      await fs.rm(absTmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
  }
}

/*
 * ============================================================================
 * COMMENTED OUT: Dynamic + TAJS Version
 * ============================================================================
 *
 * This version uses TAJS analyzer which only supports ES5.
 * Requires Babel transpilation and ES modules stubbing.
 *
 * To use this version:
 * 1. Uncomment the code below
 * 2. Update the default analyzers to { dynamic: 1.0, tajs: 0.5 }
 * 3. Add transpileToES5 parameter back to LacunaOptions
 * 4. Replace the simple code writing with the transpilation logic
 *
 * Key differences from Jelly version:
 * - Requires Babel transpilation (ES6+ -> ES5)
 * - Requires ES modules stubbing (import/export -> var declarations)
 * - Requires ES6+ polyfills (Set, Map, Promise, Symbol, etc.)
 * - TAJS may crash on complex code or modern syntax
 *
 * Transpilation code (commented out):
 *
 * if (transpileToES5) {
 *   const babel = await import('@babel/core');
 *   const result = await babel.transformAsync(code, {
 *     presets: [['@babel/preset-env', {
 *       targets: { ie: '9' },
 *       modules: false,
 *       loose: true,
 *       spec: false,
 *     }]]
 *   });
 *
 *   // Stub ES modules
 *   processedCode = result.code.replace(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g, ...);
 *   // Add polyfills for Set, Map, Promise, Symbol, etc.
 * }
 *
 * ============================================================================
 */
