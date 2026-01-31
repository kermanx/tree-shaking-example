export interface MinifyOptions {
  code: string
}

export const minifiers: Record<string, (options: MinifyOptions) => Promise<string>> = {
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