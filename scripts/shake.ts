export interface ShakeOptions {
  code: string
}

export const shakers: Record<string, (options: ShakeOptions) => Promise<string>> = {
  async jsshaker({ code }) {
    const { treeShake } = await import('@kermanx/tree-shaker');
    const result = treeShake(code, "smallest", false);
    for (const msg of result.diagnostics) {
      console.log(msg)
    }
    return result.output;
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
  }
}