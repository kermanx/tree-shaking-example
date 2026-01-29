export interface ShakeOptions {
  code: string
}

export const shakers: Record<string, (options: ShakeOptions) => Promise<string>> = {
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
  }
}