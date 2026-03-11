import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

import { extractFile, countTotalLines, countTotalSize, extractPackages, updateAllFilesAndPackages } from '../../../../scripts/cloc';

function ClocPlugin() {
  if (!process.env.CLOC) return null;
  const files = new Set<string>();
  return {
    name: 'cloc-plugin',
    transform: {
      order: 'pre' as const,
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

export default defineConfig(() => {
  return {
    application: {},
    vite: {
      plugins: [
        ClocPlugin(),
        ElementPlus({
          format: 'esm',
        }),
      ],
      build: {
        minify: false,
        rollupOptions: {
          output: {
            manualChunks: undefined,
            inlineDynamicImports: true,
            entryFileNames: 'assets/index.mjs',
          },
        },
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
