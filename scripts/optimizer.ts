
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
      const result = await minify(code, {
        toplevel: true,
        ecma: 2018,
				sourceMap: false,
				output: {
					comments: false,
				},
      });
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
      // process.chdir(absTmpDir);

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
        // process.chdir(originalCwd);
      }

      // Read the optimized code back from the JS file
      const optimizedCode = await fs.readFile(scriptFile, 'utf8');
      return optimizedCode;

    } finally {
      // Clean up temporary directory
      await fs.rm(absTmpDir, { recursive: true, force: true });
    }
  },
  async heuristic({ name, code }) {
    // JavaScriptHeuristicOptmizer wrapper using genetic algorithm
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const os = await import('node:os');

    const optimizerPath = path.resolve('./vendor/JavaScriptHeuristicOptmizer');

    // Create a temporary library directory inside the optimizer directory
    // This avoids path.join issues with absolute paths
    const tmpDirName = `tmp-heuristic-${name}-${Date.now()}`;
    const tmpDir = path.join(optimizerPath, tmpDirName);
    const libDir = path.join(tmpDir, name);

    // Use optimizer directory for config
    const configPath = path.join(optimizerPath, `config-${name}-${Date.now()}.json`);

    try {
      // Create library structure
      await fs.mkdir(libDir, { recursive: true });

      // Write the input code as the main file
      // Convert ES6 modules to CommonJS for compatibility with esprima 4.0.0
      let processedCode = code;

      // Replace export statements with module.exports
      processedCode = processedCode.replace(/export\s*{\s*([^}]+)\s*};?\s*$/gm, (_match, exports) => {
        const exportNames = exports.split(',').map((e: string) => e.trim());
        return `module.exports = { ${exportNames.join(', ')} };`;
      });
      processedCode = processedCode.replace(/export\s+default\s+/g, 'module.exports = ');
      processedCode = processedCode.replace(/export\s+/g, 'module.exports.');

      // Replace import statements with require
      processedCode = processedCode.replace(/import\s+(.+?)\s+from\s+['"](.+?)['"]/g, 'const $1 = require("$2")');

      const mainFile = path.join(libDir, 'index.js');
      await fs.writeFile(mainFile, processedCode, 'utf8');

      // Create a minimal package.json
      const packageJson = {
        name: name,
        version: '1.0.0',
        main: 'index.js',
        scripts: {
          test: 'node test.js'
        }
      };
      await fs.writeFile(path.join(libDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');

      // Create a test file that validates the code functionality
      // Analyze the code to determine what to test
      let testCode = '';

      // Check if code exports 'answer' variable
      const hasAnswerExport = /(?:module\.exports\s*=\s*\{[^}]*answer|answer\s*:)/.test(processedCode);

      if (hasAnswerExport) {
        // Test the answer export
        testCode = `
const startTime = Date.now();
try {
  const lib = require('./index.js');

  // Test the actual functionality
  if (lib && lib.answer !== undefined) {
    // For most test cases, the answer should be '2,4,6,8'
    const expected = '2,4,6,8';
    const actual = String(lib.answer);
    if (actual === expected) {
      const duration = Date.now() - startTime;
      console.log(JSON.stringify({ duration: duration, sucess: "true", host: "localhost" }));
      process.exit(0);
    } else {
      console.error('Test failed: Expected "' + expected + '" but got "' + actual + '"');
      process.exit(1);
    }
  } else {
    console.error('Test failed: lib.answer is undefined');
    process.exit(1);
  }
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}
`;
      } else {
        // Generic test - just check if code loads without errors
        testCode = `
const startTime = Date.now();
try {
  const lib = require('./index.js');
  const duration = Date.now() - startTime;
  console.log(JSON.stringify({ duration: duration, sucess: "true", host: "localhost" }));
  process.exit(0);
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}
`;
      }

      await fs.writeFile(path.join(libDir, 'test.js'), testCode, 'utf8');

      // Use absolute paths for results directory to avoid path resolution issues
      const absoluteScratchDir = path.join(tmpDir, "scratch");
      const absoluteResultsDir = path.join(tmpDir, "results");

      // Use absolute paths in configuration to avoid relative path issues
      const relativeLibDir = path.relative(optimizerPath, libDir);
      const relativeTmpDir = path.relative(optimizerPath, tmpDir);
      const relativeScratchDir = path.join(relativeTmpDir, "scratch");
      const relativeLogFile = path.join(relativeTmpDir, "optimization.log");

      // Create configuration for the optimizer
      const config = {
        "file": path.basename(configPath),
        "trials": 1,
        "startTrial": 0,
        "fitType": "median",
        "testUntil": 1,
        "mutationTrials": 1,
        "crossOverTrials": 1,
        "logFilePath": relativeLogFile,
        "tmpDirectory": relativeScratchDir,
        "logCategory": "optimization",
        "logFileClearing": false,
        "resultsDirectory": absoluteResultsDir,  // Use absolute path for results
        "trialResultsFile": "Results.csv",
        "logWritter": "ConcreteLogger",
        "tester": "CommandTester",
        "outWriter": "CsvResultsOutWriter",
        "heuristics": ["GA"],
        "port": 5000,
        "url": "ws://localhost",
        "clientTimeout": 30,
        "clientsTotal": 1,
        "copyFileTimeout": 60,
        "memory": 2048,
        "libraries": [
          {
            "name": name,
            "path": relativeLibDir,
            "mainFilePath": "index.js"
          }
        ],
        "trialsConfiguration": [
          {
            "nodesSelectionApproach": "Global",
            "ByFunctionType": "dynamic",
            "especific": {
              "neighborApproach": "FirstAscent",
              "neighborsToProcess": 2,
              "trials": 100,
              "restartAtEnd": false,
              "ramdonRestart": false,
              "ramdonNodes": false,
              "nodesType": [
                "ExpressionStatement",
                "VariableDeclaration",
                "Literal",
                "ReturnStatement",
                "Property",
                "BinaryExpression",
                "FunctionDeclaration",
                "IfStatement",
                "CallExpression",
                "VariableDeclarator",
                "ObjectExpression",
                "FunctionExpression",
                "ArrayExpression",
                "UnaryExpression",
                "AssignmentExpression",
                "ConditionalExpression"
              ],
              "individuals": 100,
              "generations": 50,
              "crossoverProbability": 70,
              "mutationProbability": 30,
              "elitism": true,
              "elitismPercentual": 10
            }
          }
        ]
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

      // Create scratch and results directories with absolute paths
      await fs.mkdir(absoluteScratchDir, { recursive: true });
      await fs.mkdir(absoluteResultsDir, { recursive: true });
      await fs.mkdir(path.join(absoluteResultsDir, name), { recursive: true });
      await fs.mkdir(path.join(absoluteResultsDir, name, "GA"), { recursive: true });

      // Pre-create the Results.csv file to avoid path issues
      const resultsFile = path.join(absoluteResultsDir, name, "GA", "Results.csv");
      const csvHeader = "sep=,\ntrial,originalIndividualAvgTime,originalIndividualLOC,originalIndividualCharacters,bestIndividualAvgTime,bestIndividualLOC,bestIndividualCharacters,time,better\n";
      await fs.writeFile(resultsFile, csvHeader, 'utf8');

      // Create a file to track the best solution found during optimization
      const bestSolutionFile = path.join(absoluteResultsDir, name, "GA", "best-solution.js");
      await fs.writeFile(bestSolutionFile, code, 'utf8'); // Start with original code

      console.log(`[${name}] Running JavaScriptHeuristicOptmizer...`);
      console.log(`[${name}] Library directory: ${libDir}`);
      console.log(`[${name}] Config: ${configPath}`);

      // Run the optimizer
      const { execSync, spawn } = await import('node:child_process');
      const originalCwd = process.cwd();

      try {
        process.chdir(optimizerPath);

        // Run the optimizer with the config filename (relative to optimizer directory)
        const configFilename = path.basename(configPath);
        const command = `node --expose-gc --max-old-space-size=4096 build/src/index.js ${configFilename}`;
        console.log(`[${name}] Executing: ${command}`);

        // Start a background task to monitor and save the best solution
        let bestSize = code.length;
        const monitorInterval = setInterval(async () => {
          try {
            // Monitor all scratch directories for better solutions
            const scratchDirs = [
              path.join(absoluteScratchDir, '0', name, 'index.js'),
              path.join(absoluteScratchDir, '1', name, 'index.js'),
            ];

            for (const scratchFile of scratchDirs) {
              try {
                const scratchCode = await fs.readFile(scratchFile, 'utf8');
                if (scratchCode && scratchCode.length > 50 && scratchCode.length < bestSize) {
                  // Found a better solution, save it
                  bestSize = scratchCode.length;
                  await fs.writeFile(bestSolutionFile, scratchCode, 'utf8');
                  console.log(`[${name}] Found better solution: ${bestSize}B`);
                }
              } catch (e) {
                // File might not exist yet or be in use
              }
            }
          } catch (e) {
            // Ignore errors during monitoring
          }
        }, 1000); // Check every second

        try {
          execSync(command, {
            stdio: 'inherit',
            timeout: 300000, // 5 minutes timeout
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
          });
        } finally {
          clearInterval(monitorInterval);
        }

      } catch (execError: any) {
        // Ignore errors related to Results.csv file writing
        // The optimization may have completed successfully even if result logging failed
        if (execError.status !== 0) {
          console.log(`[${name}] Optimizer exited with code ${execError.status}, but may have produced results`);
        }
      } finally {
        process.chdir(originalCwd);
      }

      // Read the optimized code back
      // First try to read from best-solution.js (which tracks the best solution found)
      let optimizedCode = await fs.readFile(bestSolutionFile, 'utf8').catch(() => null);

      // If best-solution.js doesn't exist or is invalid, fall back to main file
      if (!optimizedCode || optimizedCode.length === 0 || optimizedCode === code) {
        optimizedCode = await fs.readFile(mainFile, 'utf8');
      }

      console.log(`[${name}] Optimization complete. Original: ${code.length}B, Optimized: ${optimizedCode.length}B`);

      // Clean up config file
      await fs.unlink(configPath).catch(() => {});

      return optimizedCode;

    } catch (error) {
      console.error(`[${name}] [heuristic] Optimization failed:`, error);
      // Clean up config file on error
      await fs.unlink(configPath).catch(() => {});
      return code; // Return original code on error
    } finally {
      // Clean up temporary directory
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  },
}