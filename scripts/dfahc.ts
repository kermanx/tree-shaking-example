import type { OptimizeOptions } from './optimizer.ts';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function transformToEs5(code: string) {
  const { transformSync } = await import('@babel/core');
  try {
    const result = transformSync(code, {
      configFile: false,
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            // 强制转换所有 ES6+ 语法为 ES5
            targets: {
              ie: "11"
            },
            // 确保模块语法也被转换（如果输入包含 import/export）
            modules: "commonjs"
          }
        ]
      ],
      minified: false,
      comments: false
    });

    return result!.code!;
  } catch (err) {
    console.error("Babel 转换失败:", err);
    throw err;
  }
}

export async function dfahc({ name, code }: OptimizeOptions) {
  code = await transformToEs5(code);
  // code = shakeSingleModule(code, { preset: "disabled", minify: false }).output.code;
  // await fs.writeFile('./temp.js', code, 'utf8'); // Write the transformed code to a temporary file for inspection

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
    // Use absolute path to test script
    const projectRoot = path.resolve(process.cwd());
    const testScriptPath = path.join(projectRoot, 'test', `${name}.js`);

    const packageJson = {
      name: name,
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        // Use relative path "./index.js" so the test runs against whichever
        // directory npm test is invoked from (the scratch copy with the mutant),
        // NOT the original libDir which never changes.
        test: `node "${testScriptPath}" "./index.js"`
      }
    };

    console.log(`[${name}] Test script: ${testScriptPath}`);
    console.log(`[${name}] Test command: node "${testScriptPath}" "./index.js"`);

    await fs.writeFile(path.join(libDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');

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
      "heuristics": ["HC"],
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
            "neighborsToProcess": 5,
            "trials": 5000,
            "restartAtEnd": true,
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
            "individuals": 100, // code.length > 600000 ? 10 : (code.length > 500000 ? 15 : 30),  // 10 for >600KB, 15 for 500-600KB, 30 for smaller
            "generations": 50, // code.length > 600000 ? 5 : (code.length > 500000 ? 10 : 15),  // 5 for >600KB, 10 for 500-600KB, 15 for smaller
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

    // Get the heuristic name from config (e.g., "GA", "HC", "RD")
    const heuristicName = config.heuristics[0];
    await fs.mkdir(path.join(absoluteResultsDir, name, heuristicName), { recursive: true });

    // Pre-create the Results.csv file to avoid path issues
    const resultsFile = path.join(absoluteResultsDir, name, heuristicName, "Results.csv");
    const csvHeader = "sep=,\ntrial,originalIndividualAvgTime,originalIndividualLOC,originalIndividualCharacters,bestIndividualAvgTime,bestIndividualLOC,bestIndividualCharacters,time,better\n";
    await fs.writeFile(resultsFile, csvHeader, 'utf8');

    console.log(`[${name}] Running JavaScriptHeuristicOptmizer...`);
    console.log(`[${name}] Library directory: ${libDir}`);
    console.log(`[${name}] Config: ${configPath}`);

    // Run the optimizer
    const { execSync } = await import('node:child_process');

    // Run the optimizer with the config filename (relative to optimizer directory)
    const configFilename = path.basename(configPath);
    // Adjust memory based on file size
    const memory = code.length > 500000 ? 8192 : 4048;  // 8GB for >500KB, 4GB for smaller
    const command = `node --max-old-space-size=${memory} build/src/index.js ${configFilename}`;
    console.log(`[${name}] Executing: ${command}`);

    const startTime = performance.now();
    execSync(command, {
      cwd: optimizerPath,
      stdio: 'inherit',
      // timeout: 1200000, // 20 minutes timeout (15 generations * ~1min/gen)
      // maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    // Record elapsed time
    const elapsedTime = performance.now() - startTime;
    console.log(`[${name}] DFAHC optimization time: ${elapsedTime.toFixed(2)}ms`);
    const timeJsonPath = path.resolve(import.meta.dirname, '../time.json');
    const timeData = JSON.parse(await fs.readFile(timeJsonPath, 'utf-8'));
    if (!timeData.dfahc) {
      timeData.dfahc = {};
    }
    timeData.dfahc[name] = elapsedTime;
    // @ts-expect-error
    timeData.dfahc = Object.fromEntries(Object.entries(timeData.dfahc).sort((a, b) => a[1] - b[1]));
    await fs.writeFile(timeJsonPath, JSON.stringify(timeData, null, 2));

    // Read the optimized code back
    // First try to read from best-solution.js (which tracks the best solution found)
    console.log(absoluteResultsDir)
    let optimizedCode = await fs.readFile(path.resolve(absoluteResultsDir, name, heuristicName, "0.js"), 'utf8');
    if (code.startsWith('"use strict";') || code.startsWith("'use strict';")) {
      if (!optimizedCode.startsWith('"use strict";') && !optimizedCode.startsWith("'use strict';")) {
        optimizedCode = '"use strict";\n' + optimizedCode;
      }
    }

    console.log(`[${name}] Optimization complete. Original: ${code.length}B, Optimized: ${optimizedCode.length}B`);

    // Clean up config file
    await fs.unlink(configPath).catch(() => { });

    // Clean up temporary directory - do it here after reading results
    // For large files (>100KB), wait longer to ensure all async child processes complete
    const cleanupDelay = code.length > 100000 ? 10000 : 1000; // 10s for large files, 1s for small
    console.log(`[${name}] Waiting ${cleanupDelay / 1000}s for all processes to complete before cleanup...`);
    await new Promise(resolve => setTimeout(resolve, cleanupDelay));
    return optimizedCode;
  } catch (error) {
    console.error(`[${name}] [heuristic] Optimization failed:`, error);
    // Clean up config file on error
    await fs.unlink(configPath).catch(() => { });
    return '';
  } finally {
    setTimeout(async () => {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true })
      } catch (e) {
      }
    }, 1000);
  }
}