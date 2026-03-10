import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';
import { existsSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

function ClocPlugin() {
  if (!process.env.CLOC) return null;
  const files = new Set<string>();
  return {
    name: 'cloc-plugin',
    transform: {
      order: 'pre' as const,
      handler(_code: string, id: string) {
        id = id.split('?')[0];
        id = id[0] === '\0' ? id.slice(1) : id;
        if (existsSync(id)) files.add(id);
        return null;
      },
    },
    async closeBundle() {
      const listPath = join(tmpdir(), `cloc-list-${Date.now()}.txt`);
      await writeFile(listPath, Array.from(files).join('\n'), 'utf-8');
      const result = await new Promise<string>((resolve, reject) => {
        const child = spawn('cloc', ['--list-file', listPath, '--json', '--quiet']);
        let out = '';
        child.stdout.on('data', (d: Buffer) => (out += d));
        child.on('close', (code: number) => (code === 0 ? resolve(out) : reject(new Error(`cloc exit ${code}`))));
        child.on('error', reject);
      });
      await unlink(listPath).catch(() => {});
      process.stderr.write(`\nCLOC_JSON_BEGIN\n${result}\nCLOC_JSON_END\n`);
    },
  };
}

export default defineConfig(async () => {
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
        minify: process.env.NO_MIN ? false : 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: undefined,
            inlineDynamicImports: true,
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
