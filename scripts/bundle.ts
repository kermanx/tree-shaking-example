import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { cwd } from 'node:process';
import { countTotalLines } from './cloc.ts';

interface BundleOptions {
  name: string;
  entry: string;
  env: 'browser' | 'node';
  cjs: boolean;
  excludeReact: boolean;
}

export const bundlers: Record<string, (options: BundleOptions) => Promise<string>> = {
  async esbuild({ entry, env, cjs }) {
    const esbuild = await import('esbuild');
    const result = await esbuild.build({
      entryPoints: [entry],
      format: cjs ? 'cjs' : 'esm',
      bundle: true,
      write: false,
      platform: env === 'node' ? 'node' : 'browser',
      define: {
        'import.meta.env.NODE_ENV': '"production"',
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.PROD': 'true',
        'import.meta.env.DEV': 'false',
      },
    });
    assert(result.outputFiles && result.outputFiles.length === 1, 'Expected exactly one output file');
    return result.outputFiles[0].text;
  },
  async rollup({ name, entry, env, cjs, excludeReact }) {
    const { rollup } = await import('rollup');
    const { nodeResolve } = await import('@rollup/plugin-node-resolve');
    const { default: commonjs } = await import('@rollup/plugin-commonjs');
    const { default: replace } = await import('@rollup/plugin-replace');

    const bundle = await rollup({
      input: entry,
      plugins: [
        // PrivateToDollarPlugin(),
        ClocPlugin(name),
        SkipCSS(),
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
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }
        warn(warning);
      },
      external: excludeReact ? ['react', 'react/jsx-runtime', 'classnames'] : undefined,
    });
    const { output } = await bundle.generate({
      format: cjs ? 'cjs' : 'esm',
    });
    assert(output.length === 1, 'Expected exactly one output chunk');

    return output[0].code;
  },
  async parcel({ entry, env, cjs }) {
    const { default: _Parcel } = await import('@parcel/core');
    const { Volume } = await import('memfs');
    // @ts-expect-error
    const Parcel = _Parcel.Parcel as typeof _Parcel;
    const bundler = new Parcel({
      entries: entry,
      defaultConfig: '@parcel/config-default',
      mode: 'production',
      shouldDisableCache: true,
      shouldContentHash: false,
      logLevel: 'error',
      env: {
        NODE_ENV: 'production',
      },
      outputFS: {
        ...new Volume() as any,
        cwd() {
          return cwd();
        },
        mkdirp(path: string) {
          (this as any).mkdirpSync(path);
        },
      },
    });
    const { bundleGraph } = await bundler.run();
    const bundles = bundleGraph.getBundles();
    assert(bundles.length === 1, 'Expected exactly one bundle');
    const assets = bundles[0].getEntryAssets();
    assert(assets.length === 1, 'Expected exactly one entry asset');
    return await assets[0].getCode();
  },
  async webpack({ entry, env, cjs }) {
    const { default: webpack } = await import('webpack');
    const { Volume } = await import('memfs');
    const { Union } = await import('unionfs');
    const fs = await import('node:fs');

    const ufs = new Union();
    ufs.use(new Volume() as any).use(fs);

    const compiler = webpack({
      mode: 'production',
      optimization: {
        minimize: false,
      },
      entry,
      experiments: {
        outputModule: true,
      },
      output: {
        filename: 'bundle.js',
        path: '/dist',
        module: !cjs,
        library: {
          type: cjs ? 'commonjs' : 'module',
        },
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        fullySpecified: false,
      },
      plugins: [
        new webpack.DefinePlugin({
          'import.meta.env.NODE_ENV': '"production"',
          'process.env.NODE_ENV': '"production"',
          'import.meta.env.PROD': true,
          'import.meta.env.DEV': false,
        }),
      ],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            type: 'javascript/esm',
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
    })!;
    compiler.inputFileSystem = ufs as any;
    compiler.outputFileSystem = ufs as any;
    return new Promise<string>((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        if (stats?.hasErrors()) return reject(new Error(stats.toString()));
        const output = ufs.readFileSync('/dist/bundle.js', 'utf-8');
        resolve(output);
      });
    });
  },
  async rolldown({ name, entry, env, cjs }) {
    const { build } = await import('rolldown');
    const result = await build({
      platform: env,
      input: entry,
      write: false,
      plugins: [
        // PrivateToDollarPlugin(),
        ClocPlugin(name),
        SkipCSS()
      ],
      transform: {
        define: {
          'import.meta.env.NODE_ENV': '"production"',
          'process.env.NODE_ENV': '"production"',
          'import.meta.env.PROD': 'true',
          'import.meta.env.DEV': 'false',
        },
      },
      output: {
        format: cjs ? 'cjs' : 'esm',
      },
    });
    assert(result.output.length === 1, 'Expected exactly one output');
    return result.output[0].code;
  }
};

function ClocPlugin(name: string) {
  if (!process.env.CLOC) return null;

  const files = new Set<string>();

  return {
    name: 'loc-counter',
    transform: {
      order: 'pre',
      async handler(_code: string, id: string) {
        id = id.split('?')[0];
        id = id[0] === '\0' ? id.slice(1) : id;
        if (!existsSync(id)) {
          console.log(`Warning: file ${JSON.stringify(id)} does not exist`);
        } else {
          files.add(id);
        }
        return null;
      }
    },
    async generateBundle() {
      const { summary } = await import('./cli.ts');

      const result = await countTotalLines(files);
      summary[name] = result;

      const size = await countTotalSize(files);
      summary['__size'] ??= {};
      summary['__size'][name] = size;
    }
  } satisfies import('rollup').Plugin;
}

import fsp from 'node:fs/promises';
async function countTotalSize(files: Set<string>) {
  const sizes = await Promise.all(
    Array.from(files).map(async (file) => {
      const stat = await fsp.stat(file);
      return stat.size;
    })
  );
  return sizes.reduce((a, b) => a + b, 0);
}

function SkipCSS() {
  return {
    name: 'skip-css',
    load(id: string) {
      if (id.endsWith('.css')) {
        return '';
      }
      return null;
    }
  }
}

import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import type { Plugin } from 'rollup';

export default function PrivateToDollarPlugin(): Plugin {
  return {
    name: 'private-to-dollar',

    // transform 钩子允许我们修改代码
    transform(code: string, id: string) {
      // 1. 利用 Rollup 内置的解析器将代码转为 AST
      // Rollup 的 this.parse 会自动处理当前环境支持的最新语法
      const ast = this.parse(code);

      // 2. 初始化 MagicString 以便进行字符串操作并生成 SourceMap
      const s = new MagicString(code);
      let hasChanged = false;

      // 3. 遍历 AST
      walk(ast, {
        enter(node) {
          // 在 ESTree 规范中，#field 对应的节点类型是 PrivateIdentifier
          if (node.type === 'PrivateIdentifier') {
            // node.start 指向 '#' 的位置
            // node.end 指向标识符结束的位置
            // 我们只替换开头的第一个字符 '#'
            s.overwrite(node.range![0], node.range![0] + 1, '$');
            hasChanged = true;
          }
        }
      });

      // 4. 如果没有私有成员，直接返回 null，Rollup 会跳过后续处理
      if (!hasChanged) return null;

      // 5. 返回转换后的代码和生成的 SourceMap
      return {
        code: s.toString(),
        map: s.generateMap({
          source: id,
          file: id + '.map',
          includeContent: true
        })
      };
    }
  };
}
