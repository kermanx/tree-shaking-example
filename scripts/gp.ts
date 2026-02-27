import type { OptimizeOptions } from './optimizer.ts';
import { transformToEs5 } from './dfahc.ts';

export async function gp({ name, code }: OptimizeOptions) {
  code = await transformToEs5(code);

  // JavaScriptHeuristicOptmizer wrapper using genetic algorithm (GA)
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');

  const optimizerPath = path.resolve('./vendor/JavaScriptHeuristicOptmizer');

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'heuristic-'));
  const libDir = path.join(tmpDir, name);

  const configPath = path.join(optimizerPath, `config-${name}-${Date.now()}.json`);

  try {
    await fs.mkdir(libDir, { recursive: true });

    const mainFile = path.join(libDir, 'index.js');
    await fs.writeFile(mainFile, code, 'utf8');

    const projectRoot = path.resolve(process.cwd());
    const testScriptPath = path.join(projectRoot, 'test', `${name}.js`);

    const packageJson = {
      name: name,
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        test: `node "${testScriptPath}" "./index.js"`
      }
    };

    console.log(`[${name}] Test script: ${testScriptPath}`);
    console.log(`[${name}] Test command: node "${testScriptPath}" "./index.js"`);

    await fs.writeFile(path.join(libDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');

    const absoluteScratchDir = path.join(tmpDir, "scratch");
    const absoluteResultsDir = path.join(tmpDir, "results");

    const relativeLibDir = path.relative(optimizerPath, libDir);
    const relativeTmpDir = path.relative(optimizerPath, tmpDir);
    const relativeScratchDir = path.join(relativeTmpDir, "scratch");
    const relativeLogFile = path.join(relativeTmpDir, "optimization.log");

    // GA configuration - no HC-specific params (neighborApproach, neighborsToProcess, trials, restartAtEnd, etc.)
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
      "resultsDirectory": absoluteResultsDir,
      "trialResultsFile": "Results.csv",
      "logWritter": "ConcreteLogger",
      "tester": "CommandTester",
      "outWriter": "CsvResultsOutWriter",
      "heuristics": ["GA"],
      "port": 5000,
      "url": "ws://localhost",
      "clientTimeout": code.length > 200000 ? 300 : 120,
      "clientsTotal": 1,
      "copyFileTimeout": code.length > 200000 ? 300 : 120,
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
            // GA: fewer individuals for larger files to avoid OOM
            "individuals": code.length > 600000 ? 10 : (code.length > 200000 ? 15 : 30),
            "generations": code.length > 600000 ? 5 : (code.length > 200000 ? 10 : 15),
            "crossoverProbability": 70,
            "mutationProbability": 30,
            "elitism": true,
            "elitismPercentual": 10
          }
        }
      ]
    };

    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

    await fs.mkdir(absoluteScratchDir, { recursive: true });
    await fs.mkdir(absoluteResultsDir, { recursive: true });
    await fs.mkdir(path.join(absoluteResultsDir, name), { recursive: true });

    const heuristicName = config.heuristics[0];
    await fs.mkdir(path.join(absoluteResultsDir, name, heuristicName), { recursive: true });

    const resultsFile = path.join(absoluteResultsDir, name, heuristicName, "Results.csv");
    const csvHeader = "sep=,\ntrial,originalIndividualAvgTime,originalIndividualLOC,originalIndividualCharacters,bestIndividualAvgTime,bestIndividualLOC,bestIndividualCharacters,time,better\n";
    await fs.writeFile(resultsFile, csvHeader, 'utf8');

    const bestSolutionFile = path.join(absoluteResultsDir, name, heuristicName, "best-solution.js");
    await fs.writeFile(bestSolutionFile, code, 'utf8');

    console.log(`[${name}] Running JavaScriptHeuristicOptmizer (GA)...`);
    console.log(`[${name}] Library directory: ${libDir}`);
    console.log(`[${name}] Config: ${configPath}`);

    const { execSync } = await import('node:child_process');

    const configFilename = path.basename(configPath);
    const memory = code.length > 200000 ? 8192 : 4048;
    const command = `node --expose-gc --max-old-space-size=${memory} build/src/index.js ${configFilename}`;
    console.log(`[${name}] Executing: ${command}`);

    let bestSize = code.length;
    const monitorInterval = setInterval(async () => {
      try {
        const mainFileCode = await fs.readFile(mainFile, 'utf8');
        if (mainFileCode && mainFileCode.length > 50 && mainFileCode.length < bestSize) {
          bestSize = mainFileCode.length;
          await fs.writeFile(bestSolutionFile, mainFileCode, 'utf8');
          console.log(`[${name}] Found better validated solution: ${bestSize}B`);
        }
      } catch (e) {
        // File might not exist yet or be in use
      }
    }, 2000);

    var startTime = performance.now();
    try {
      execSync(command, {
        cwd: optimizerPath,
        stdio: 'inherit',
        timeout: 1200000, // 20 minutes timeout
        maxBuffer: 1024 * 1024 * 10
      });
    } finally {
      clearInterval(monitorInterval);
    }

    const elapsedTime = performance.now() - startTime;
    console.log(`[${name}] GP optimization time: ${elapsedTime.toFixed(2)}ms`);
    const timeJsonPath = path.resolve(import.meta.dirname, '../time.json');
    const timeData = JSON.parse(await fs.readFile(timeJsonPath, 'utf-8'));
    if (!timeData.gp) {
      timeData.gp = {};
    }
    timeData.gp[name] = elapsedTime;
    // @ts-expect-error
    timeData.gp = Object.fromEntries(Object.entries(timeData.gp).sort((a, b) => a[1] - b[1]));
    await fs.writeFile(timeJsonPath, JSON.stringify(timeData, null, 2));

    let optimizedCode = await fs.readFile(bestSolutionFile, 'utf8').catch(() => null);

    if (!optimizedCode || optimizedCode.length === 0 || optimizedCode === code) {
      const mainFileCode = await fs.readFile(mainFile, 'utf8').catch(() => null);
      optimizedCode = (mainFileCode && mainFileCode.length < code.length) ? mainFileCode : code;
    }

    // Final safety: never return something larger than or equal to babel input
    if (!optimizedCode || optimizedCode.length >= code.length) {
      optimizedCode = code;
    }

    console.log(`[${name}] GP complete. Original: ${code.length}B, Optimized: ${optimizedCode.length}B`);

    await fs.unlink(configPath).catch(() => { });

    const cleanupDelay = code.length > 100000 ? 10000 : 1000;
    console.log(`[${name}] Waiting ${cleanupDelay / 1000}s for all processes to complete before cleanup...`);
    await new Promise(resolve => setTimeout(resolve, cleanupDelay));
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
      console.log(`[${name}] Cleanup completed successfully`);
    } catch (e) {
      console.log(`[${name}] Note: Temporary directory cleanup had issues (can be ignored)`);
    }

    return optimizedCode;

  } catch (error) {
    console.error(`[${name}] [gp] Optimization failed:`, error);
    await fs.unlink(configPath).catch(() => { });

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }

    return '';
  }
}
