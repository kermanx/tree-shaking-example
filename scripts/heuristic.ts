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

    // Create a minimal package.json with npm test configured
    // npm test will be called by JavaScriptHeuristicOptimizer's CommandTester
    // Use absolute path to test script (must be calculated before any chdir)
    const projectRoot = path.resolve(process.cwd());
    const testScriptPath = path.join(projectRoot, 'test', `${name}.js`);
    const testFilePath = path.join(libDir, 'index.js');

    const packageJson = {
      name: name,
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        // Use test directory test script instead of directly running index.js
        test: `node "${testScriptPath}" "${testFilePath}"`
        // ORIGINAL VERSION (commented out):
        // npm test will directly run index.js
        // test: 'node index.js'
      }
    };

    console.log(`[${name}] Test script: ${testScriptPath}`);
    console.log(`[${name}] Test command: node "${testScriptPath}" "${testFilePath}"`);

    await fs.writeFile(path.join(libDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');


    // No need to create test.js - npm test will directly run index.js
    // JavaScriptHeuristicOptimizer will call: cd ${libDir} && npm test
    // which executes: node index.js
    // The code's console.log output will be captured and verified

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
      "clientTimeout": code.length > 600000 ? 300 : 120,  // 300s for >600KB, 120s for smaller
      "clientsTotal": 1,
      "copyFileTimeout": code.length > 600000 ? 300 : 120,  // Increase copy timeout too
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
            "individuals": code.length > 600000 ? 10 : (code.length > 500000 ? 15 : 30),  // 10 for >600KB, 15 for 500-600KB, 30 for smaller
            "generations": code.length > 600000 ? 5 : (code.length > 500000 ? 10 : 15),  // 5 for >600KB, 10 for 500-600KB, 15 for smaller
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
    const { execSync } = await import('node:child_process');
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
      // Only monitor the main library file, which is updated by the optimizer
      // with VALIDATED solutions (not scratch directories with unvalidated mutations)
      let bestSize = code.length;
      const monitorInterval = setInterval(async () => {
        try {
          // Monitor the main library file - optimizer only updates this with validated solutions
          const mainFileCode = await fs.readFile(mainFile, 'utf8');
          if (mainFileCode && mainFileCode.length > 50 && mainFileCode.length < bestSize) {
            // Found a better validated solution, save it
            bestSize = mainFileCode.length;
            await fs.writeFile(bestSolutionFile, mainFileCode, 'utf8');
            console.log(`[${name}] Found better validated solution: ${bestSize}B`);
          }
        } catch (e) {
          // File might not exist yet or be in use
        }
      }, 2000); // Check every 2 seconds (less frequent since we're only checking one file)

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