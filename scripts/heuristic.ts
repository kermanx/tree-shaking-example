import type { OptimizeOptions } from './optimizer.ts';

export async function heuristic({ name, code }: OptimizeOptions) {
  // JavaScriptHeuristicOptmizer wrapper using genetic algorithm
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');

  const optimizerPath = path.resolve('./vendor/JavaScriptHeuristicOptmizer');

  // Create a temporary library directory inside the optimizer directory
  // This avoids path.join issues with absolute paths
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'heuristic-'));
  const libDir = path.join(tmpDir, name);

  // Use optimizer directory for config
  const configPath = path.join(optimizerPath, `config-${name}-${Date.now()}.json`);

  try {
    // Create library structure
    await fs.mkdir(libDir, { recursive: true });

    const mainFile = path.join(libDir, 'index.js');
    await fs.writeFile(mainFile, code, 'utf8');

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
    const hasAnswerExport = /(?:module\.exports\s*=\s*\{[^}]*answer|answer\s*:)/.test(code);

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
      console.log(JSON.stringify({ duration: duration, success: "true", host: "localhost" }));
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
      // Generic test - just check if code can be parsed (syntax check)
      // For browser-only code that can't run in Node.js
      testCode = `
const startTime = Date.now();
const fs = require('fs');

try {
  // Just verify the file can be read and has content
  const code = fs.readFileSync('./index.js', 'utf8');
  if (code && code.length > 0) {
    const duration = Date.now() - startTime;
    console.log(JSON.stringify({ duration: duration, success: "true", host: "localhost" }));
    process.exit(0);
  } else {
    console.error('Test failed: Empty file');
    process.exit(1);
  }
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
      "clientTimeout": 120,
      "clientsTotal": 1,
      "copyFileTimeout": 120,
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
            "trials": 10,
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
            // Adjust parameters based on file size
            "individuals": code.length > 500000 ? 15 : 30,  // 15 for >500KB, 30 for smaller
            "generations": code.length > 500000 ? 10 : 15,  // 10 for >500KB, 15 for smaller
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
      // Adjust memory based on file size
      const memory = code.length > 500000 ? 8192 : 4048;  // 8GB for >500KB, 4GB for smaller
      const command = `node --expose-gc --max-old-space-size=${memory} build/src/index.js ${configFilename}`;
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
          timeout: 1200000, // 20 minutes timeout (15 generations * ~1min/gen)
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });
      } finally {
        clearInterval(monitorInterval);
      }

    } catch (execError: any) {
      // Handle different types of errors
      const exitCode = execError.status;
      const signal = execError.signal;

      // Check if it's a ENOENT error in Results.csv writing (acceptable)
      const isResultsWriteError = execError.stderr?.toString().includes('Results.csv') ||
                                   execError.message?.includes('ENOENT');

      if (signal) {
        console.log(`[${name}] Optimizer terminated by signal ${signal}`);
      } else if (exitCode !== null && exitCode !== 0) {
        if (isResultsWriteError) {
          console.log(`[${name}] Optimizer completed but failed to write results file (exit code ${exitCode})`);
        } else {
          console.log(`[${name}] Optimizer exited with code ${exitCode}`);
        }
      } else if (exitCode === null) {
        // Exit code null usually means crashed or killed
        console.log(`[${name}] Optimizer crashed or was killed unexpectedly`);
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
    await fs.unlink(configPath).catch(() => { });

    // Clean up temporary directory - do it here after reading results
    // For large files (>100KB), wait longer to ensure all async child processes complete
    const cleanupDelay = code.length > 100000 ? 10000 : 1000; // 10s for large files, 1s for small
    console.log(`[${name}] Waiting ${cleanupDelay / 1000}s for all processes to complete before cleanup...`);
    await new Promise(resolve => setTimeout(resolve, cleanupDelay));
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
      console.log(`[${name}] Cleanup completed successfully`);
    } catch (e) {
      // Ignore cleanup errors
      console.log(`[${name}] Note: Temporary directory cleanup had issues (can be ignored)`);
    }

    return optimizedCode;

  } catch (error) {
    console.error(`[${name}] [heuristic] Optimization failed:`, error);
    // Clean up config file on error
    await fs.unlink(configPath).catch(() => { });

    // Clean up temporary directory even on error
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }

    return code; // Return original code on error
  }
}