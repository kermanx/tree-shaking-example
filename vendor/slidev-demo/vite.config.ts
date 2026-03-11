import { defineConfig } from "vite";
import { countTotalLines, countTotalSize, extractFile, extractPackages, updateAllFilesAndPackages } from "../../scripts/cloc.ts";


function ClocPlugin() {
  if (!process.env.CLOC) return null;
  const files = new Set<string>();
  return {
    name: "cloc-plugin",
    transform: {
      order: "pre" as const,
      handler(_code: string, id: string) {
        const file = extractFile(id);
        if (file) files.add(file);
        return null;
      },
    },
    async closeBundle() {
      const lines = await countTotalLines(files);
      const size = await countTotalSize(files);
      const packages = extractPackages(files);
      updateAllFilesAndPackages(files, packages);
      console.log({ lines, size, packages })
    },
  };
}

export default defineConfig({
  plugins: [
    ClocPlugin(),
    {
      name: 'override-config',
      enforce: 'post',
      config: {
        order: 'post',
        handler(config) {
          // @ts-expect-error
          config.build.rollupOptions.output.manualChunks = undefined
          // @ts-expect-error
          config.build.rollupOptions.output.inlineDynamicImports = {}
          // @ts-expect-error
          config.build.rollupOptions.output.entryFileNames = 'assets/index.mjs'
        }
      }
    }
  ],
  build: {
    minify: false,
  },
})
