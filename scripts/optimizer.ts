export interface OptimizeOptions {
  code: string
}

export const Optimizers: Record<string, (options: OptimizeOptions) => Promise<string>> = {
  async jsshaker({ code }) {
    const { shakeSingleModule } = await import('jsshaker');
    const result = shakeSingleModule(code, {
      preset: "smallest",
      jsx: "react",
    });
    for (const msg of result.diagnostics) {
      console.log('[jsshaker]', msg);
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
  async esbuild({ code }) {
    const esbuild = await import('esbuild');
    const result = await esbuild.transform(code, {
      minify: true,
      loader: 'js',
    });
    return result.code;
  },
  async terser({ code }) {
    const { minify } = await import('terser');
    const result = await minify(code);
    return result.code!;
  },
  async swc({ code }) {
    const { transform } = await import('@swc/core');
    const result = await transform(code, {
      minify: true,
    });
    return result.code!;
  },
  async oxc({ code }) {
    const { minify } = await import('oxc-minify');
    const result = await minify('_.mjs', code, {
      module: true,
      compress: true,
      mangle: true,
      codegen: {
        removeWhitespace: false,
      },
    });
    return result.code;
  }
}