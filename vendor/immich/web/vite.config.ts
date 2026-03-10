import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { existsSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type ProxyOptions, type UserConfig } from 'vite';

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
      process.stdout.write(`\nCLOC_JSON_BEGIN\n${result}\nCLOC_JSON_END\n`);
    },
  };
}

const upstream = {
  target: process.env.IMMICH_SERVER_URL || 'http://immich-server:2283/',
  secure: true,
  changeOrigin: true,
  logLevel: 'info',
  ws: true,
};

const proxy: Record<string, string | ProxyOptions> = {
  '/api': upstream,
  '/.well-known/immich': upstream,
  '/custom.css': upstream,
};

export default defineConfig({
  build: {
    target: 'es2022',
  },
  resolve: {
    alias: {
      'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
      // eslint-disable-next-line unicorn/prefer-module
      '@test-data': path.resolve(__dirname, './src/test-data'),
      // '@immich/ui': path.resolve(__dirname, '../../ui'),
    },
  },
  server: {
    // connect to a remote backend during web-only development
    proxy,
    allowedHosts: true,
  },
  preview: {
    proxy,
  },
  plugins: [
    ClocPlugin(),
    enhancedImages(),
    tailwindcss(),
    sveltekit(),
    process.env.BUILD_STATS === 'true'
      ? visualizer({
          emitFile: true,
          filename: 'stats.html',
        })
      : undefined,
    svelteTesting(),
  ],
  optimizeDeps: {
    entries: ['src/**/*.{svelte,ts,html}'],
  },
  test: {
    name: 'web:unit',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-data/setup.ts'],
    sequence: {
      hooks: 'list',
    },
    env: {
      TZ: 'UTC',
    },
  },
} as UserConfig);
