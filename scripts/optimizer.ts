
// @ts-ignore
import { prepackSources } from 'prepack/lib/prepack-standalone.js'
import { gcc } from './cc.ts';
import assert from 'assert';
import { heuristic as dfahc } from './dfahc.ts';
import { jsshaker } from './jsshaker.ts';
import { lacuna } from './lacuna.ts';

export interface OptimizeOptions {
  name: string
  code: string
  env: 'browser' | 'node';
}

export const Optimizers: Record<string, (options: OptimizeOptions) => Promise<string>> = {
  jsshaker,
  async rollup({ code, env }) {
    const { rollup } = await import('rollup');
    const { nodeResolve } = await import('@rollup/plugin-node-resolve');
    const { default: virtual } = await import('@rollup/plugin-virtual');
    const { default: commonjs } = await import('@rollup/plugin-commonjs');
    const { default: replace } = await import('@rollup/plugin-replace');

    const bundle = await rollup({
      input: 'entry',
      plugins: [
        virtual({
          entry: code,
        }),
        replace({
          'import.meta.env.NODE_ENV': '"production"',
          'process.env.NODE_ENV': '"production"',
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
          preventAssignment: true,
        }),
        nodeResolve({ browser: env === 'browser' }),
        commonjs(),
      ],
      treeshake: {
        tryCatchDeoptimization: false,
        correctVarValueBeforeDeclaration: true,
        unknownGlobalSideEffects: false,
      },
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
        chunk_output_type: 'ES_MODULES',
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
        chunk_output_type: 'ES_MODULES',
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
  async lacuna1({ code }) {
    return lacuna({
      code,
      analyzers: { dynamic: 0.5, jelly: 0.5 },
      optimizationLevel: 1
    });
  },
  async lacuna2({ code }) {
    return lacuna({
      code,
      analyzers: { dynamic: 0.5, jelly: 0.5 },
      optimizationLevel: 2
    });
  },
  async lacuna3({ code }) {
    return lacuna({
      code,
      analyzers: { dynamic: 0.5, jelly: 0.5 },
      optimizationLevel: 3
    });
  },
  dfahc
}