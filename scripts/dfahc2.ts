import type { OptimizeOptions } from './optimizer.ts';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { transformToEs5 } from './dfahc.ts';

const TIME_LIMIT_MS = 2 * 60 * 1000; // 2 minutes

export async function dfahc2({ name, code }: OptimizeOptions) {
  code = await transformToEs5(code);

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

    // Use very large trial counts — process will be killed at the 2-minute mark
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
      "heuristics": ["HC"],
      "port": 5000,
      "url": "ws://localhost",
      "clientTimeout": code.length > 600000 ? 300 : 120,
      "clientsTotal": 1,
      "copyFileTimeout": code.length > 600000 ? 300 : 120,
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
            "individuals": 100,
            "generations": 999999,
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

    console.log(`[${name}] Running JavaScriptHeuristicOptmizer (time-limited: 2min)...`);
    console.log(`[${name}] Library directory: ${libDir}`);
    console.log(`[${name}] Config: ${configPath}`);

    const { spawn } = await import('node:child_process');

    const configFilename = path.basename(configPath);
    const memory = code.length > 500000 ? 8192 : 4048;
    const args = [`--max-old-space-size=${memory}`, 'build/src/index.js', configFilename];
    console.log(`[${name}] Executing: node ${args.join(' ')}`);

    const startTime = performance.now();

    const child = spawn('node', args, {
      cwd: optimizerPath,
      stdio: 'inherit'
    });

    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        console.log(`[${name}] 2-minute time limit reached, stopping optimizer...`);
        child.kill('SIGTERM');
        setTimeout(() => {
          try { child.kill('SIGKILL'); } catch { }
        }, 5000);
      }, TIME_LIMIT_MS);

      child.on('exit', (exitCode, signal) => {
        clearTimeout(timer);
        if (signal) {
          console.log(`[${name}] Optimizer stopped by signal: ${signal}`);
        } else {
          console.log(`[${name}] Optimizer exited with code: ${exitCode}`);
        }
        resolve();
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        console.error(`[${name}] Optimizer process error:`, err);
        resolve();
      });
    });

    const elapsedTime = performance.now() - startTime;
    console.log(`[${name}] DFAHC2 optimization time: ${elapsedTime.toFixed(2)}ms`);
    const timeJsonPath = path.resolve(import.meta.dirname, '../time.json');
    const timeData = JSON.parse(await fs.readFile(timeJsonPath, 'utf-8'));
    if (!timeData.dfahc2) {
      timeData.dfahc2 = {};
    }
    timeData.dfahc2[name] = elapsedTime;
    // @ts-expect-error
    timeData.dfahc2 = Object.fromEntries(Object.entries(timeData.dfahc2).sort((a, b) => a[1] - b[1]));
    await fs.writeFile(timeJsonPath, JSON.stringify(timeData, null, 2));

    console.log(absoluteResultsDir);
    const resultPath = path.resolve(absoluteResultsDir, name, heuristicName, "0.js");
    let optimizedCode: string;
    try {
      optimizedCode = await fs.readFile(resultPath, 'utf8');
    } catch {
      console.warn(`[${name}] No result file found at ${resultPath}, returning original code`);
      optimizedCode = code;
    }

    if (code.startsWith('"use strict";') || code.startsWith("'use strict';")) {
      if (!optimizedCode.startsWith('"use strict";') && !optimizedCode.startsWith("'use strict';")) {
        optimizedCode = '"use strict";\n' + optimizedCode;
      }
    }

    console.log(`[${name}] Optimization complete. Original: ${code.length}B, Optimized: ${optimizedCode.length}B`);

    await fs.unlink(configPath).catch(() => { });

    const cleanupDelay = code.length > 100000 ? 10000 : 1000;
    console.log(`[${name}] Waiting ${cleanupDelay / 1000}s for all processes to complete before cleanup...`);
    await new Promise(resolve => setTimeout(resolve, cleanupDelay));
    return optimizedCode;
  } catch (error) {
    console.error(`[${name}] [heuristic] Optimization failed:`, error);
    await fs.unlink(configPath).catch(() => { });
    return '';
  } finally {
    setTimeout(async () => {
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch { }
    }, 1000);
  }
}
