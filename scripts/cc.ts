import { spawn } from 'child_process';
import binaryPath from 'google-closure-compiler-linux';
import { join } from 'path';

/**
 * Configuration options interface for Closure Compiler
 * Keys are parameter names (without --), values are parameter values.
 * When value is true, it's used as a flag switch; arrays will pass the parameter multiple times.
 */
export interface ClosureCompilerOptions {
  [key: string]: string | number | boolean | string[] | undefined;
}

export function gcc(
  jsSource: string,
  env: string,
  options: ClosureCompilerOptions = {}
): Promise<string> {
  return gccWithTiming(jsSource, env, options).then(result => result.code);
}

export function gccWithTiming(
  jsSource: string,
  env: string,
  options: ClosureCompilerOptions = {}
): Promise<{ code: string; time: number }> {
  if (jsSource.includes('const Text = ') || jsSource.includes('var Symbol = root$1.Symbol')
    || jsSource.includes('var escape = (function (str) {')
    || jsSource.includes('var Selection = selection.prototype.constructor')
    || jsSource.includes('class Keyframe {') || jsSource.includes('const Map = getNative(root,') || jsSource.includes('var dump  ')) {
    jsSource = `(function(){${jsSource}})()`;
  }
  if (jsSource.includes('supportsWebCodecsH264Decode = await _checkWebCodecsH264DecodeSupport')) {
    jsSource = `(async function(){${jsSource}})()`;
  }

  // Fix known bugs in embedded webpack bundle (cose-bl/layout-base):
  // 1. Missing 'this.' prefix for property access (getPred1/getPred2/getNext/isProcessed/shiftToLastRow/update)
  if (jsSource.includes('function __webpack_require__')) {
    jsSource = jsSource
      .replaceAll('return pred1;', 'return this.pred1;')
      .replaceAll('return pred2;', 'return this.pred2;')
      .replaceAll('return next;', 'return this.next;')
      .replaceAll('return processed;', 'return this.processed;')
      .replaceAll('instance.getLongestRowIndex(', 'this.getLongestRowIndex(')
      .replaceAll('update(nodes4[i2]);', 'this.update(nodes4[i2]);');
  }


  // options.env ||= env === 'browser' ? 'BROWSER' : 'CUSTOM';
  options.module_resolution ||= env === 'browser' ? 'BROWSER' : 'BROWSER_WITH_TRANSFORMED_PREFIXES';
  options.browser_resolver_prefix_replacements ||= env === 'browser' ? undefined : [
    'node:stream',
    'node:url',
    'node:path',
    'fs',
    'node:fs/promises',
    'node:events',
    'node:string_decoder',
    'node:fs'
  ].map(name => `${name}=${join(import.meta.dirname, 'cc-node-builtin.js')}`);
  options['externs'] ||= join(import.meta.dirname, `cc-${env}-externs.js`);
  options.jscomp_off = 'checkVars'; // Disable undeclaredVars check, doesn't affect optimization results

  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const args: string[] = [];

    for (const [key, value] of Object.entries(options)) {
      let flagName = key.startsWith('-') ? key : `--${key}`;

      if (!key.startsWith('-') && /[A-Z]/.test(key)) {
        flagName = '--' + key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      }

      if (Array.isArray(value)) {
        value.forEach(v => args.push(flagName, String(v)));
      } else if (value === true) {
        args.push(flagName);
      } else if (value !== false && value !== null && value !== undefined) {
        args.push(flagName + '=' + String(value));
      }
    }

    console.log(binaryPath, args.join(' '));

    const child = spawn(binaryPath, args, {
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      errorOutput += chunk.toString();
    });

    child.on('error', (err) => {
      reject(new Error(`Failed to spawn Closure Compiler: ${err.message}`));
    });

    child.on('close', (code) => {
      const endTime = performance.now();
      const time = endTime - startTime;

      if (code === 0) {
        resolve({ code: output, time });
      } else {
        reject(new Error(`Closure Compiler failed (exit code ${code}):\n${errorOutput}`));
      }
    });

    try {
      child.stdin.write(jsSource);
      child.stdin.end();
    } catch (e) {
      reject(new Error('Failed to write to stdin'));
    }
  });
}
