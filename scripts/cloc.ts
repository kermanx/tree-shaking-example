import { spawn } from 'node:child_process';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// 1. 定义精确的类型接口
export interface ClocLanguageStats {
  nFiles: number;
  blank: number;
  comment: number;
  code: number;
}

export interface ClocResult {
  header: {
    cloc_url: string;
    cloc_version: string;
    elapsed_seconds: number;
    n_files: number;
    n_lines: number;
    files_per_second: number;
    lines_per_second: number;
  };
  // 语言名称作为 key (e.g., "TypeScript", "Rust", "Markdown")
  [language: string]: ClocLanguageStats | any;
  // 汇总字段
  SUM: ClocLanguageStats;
}

/**
 * 统计文件集合的代码行数
 * 
 * @param filePaths - 文件的绝对路径或相对路径集合
 * @returns Promise<ClocLanguageStats> - 返回汇总的统计信息 (SUM)
 */
export async function countTotalLines(filePaths: Set<string>): Promise<ClocLanguageStats> {
  // 0. 边界情况处理
  if (filePaths.size === 0) {
    return { nFiles: 0, blank: 0, comment: 0, code: 0 };
  }

  // 1. 创建临时文件列表
  // 为什么这样做？避免 "Argument list too long" (E2BIG) 错误
  const tempFileListPath = join(tmpdir(), `cloc-list-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);

  // 将 Set 转换为换行符分隔的字符串
  const fileContent = Array.from(filePaths).join('\n');

  try {
    await writeFile(tempFileListPath, fileContent, 'utf-8');

    // 2. 调用 cloc
    // --list-file: 从文件读取路径列表
    // --json: 输出易于解析的 JSON
    // --quiet: 抑制非必要的输出
    const result = await runCloc(['--list-file', tempFileListPath, '--json', '--quiet']);

    // 3. 返回汇总数据 (SUM)
    // 如果你需要分语言的统计，可以返回整个 result
    return result.SUM;

  } finally {
    // 4. 清理临时文件 (Ensure cleanup happens even if cloc fails)
    await unlink(tempFileListPath).catch(() => { /* ignore cleanup errors */ });
  }
}

/**
 * 底层执行 cloc 的辅助函数
 */
function runCloc(args: string[]): Promise<ClocResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('cloc', args);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => (stdout += data));
    child.stderr.on('data', (data) => (stderr += data));

    child.on('close', (code) => {
      if (code !== 0) {
        // cloc 如果没有找到有效文件有时也会返回非0，需要结合 stderr 判断
        reject(new Error(`cloc failed with code ${code}: ${stderr}`));
        return;
      }

      try {
        const json = JSON.parse(stdout) as ClocResult;
        resolve(json);
      } catch (e) {
        reject(new Error(`Failed to parse cloc output: ${(e as Error).message}`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Failed to spawn cloc. Is it installed? Details: ${err.message}`));
    });
  });
}


import fsp from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function extractFile(id: string) {
  id = id.split("?")[0];
  id = id[0] === "\0" ? id.slice(1) : id;
  if (id.endsWith('ts') || id.endsWith('tsx') || id.endsWith('js') || id.endsWith('jsx') || id.endsWith('svg')
    || id.endsWith('vue') || id.endsWith('svelte') || id.endsWith('json'))
    if (existsSync(id)) return id;
  return null;
}


export async function countTotalSize(files: Set<string>) {
  const sizes = await Promise.all(
    Array.from(files).map(async (file) => {
      const stat = await fsp.stat(file);
      return stat.size;
    })
  );
  return sizes.reduce((a, b) => a + b, 0);
}


export function extractPackages(files: Set<string>): Set<string> {
  const packages = new Set<string>();
  for (const file of files) {
    // 匹配所有 node_modules/ 后的包名，取最后一个（支持 pnpm 的 .pnpm 目录结构）
    const matches = file.matchAll(/node_modules\/(@[^/]+\/[^/]+|[^/@]+)/g);
    const matchArray = Array.from(matches);
    if (matchArray.length > 0) {
      const lastMatch = matchArray[matchArray.length - 1];
      packages.add(lastMatch[1]);
    }
  }
  return packages;
}

const allPkgsPath = resolve(import.meta.dirname, '../data/allPackages.json');
const allFilesPath = resolve(import.meta.dirname, '../data/allFiles.json');

export function updateAllFilesAndPackages(newFiles: Set<string>, newPackages: Set<string>): void {
  const oldAllPkgs = existsSync(allPkgsPath) ? JSON.parse(readFileSync(allPkgsPath, 'utf-8')) : [];
  const newAllPkgs = [...new Set([...oldAllPkgs, ...newPackages])].sort();
  writeFileSync(allPkgsPath, JSON.stringify(newAllPkgs, null, 2), 'utf-8');

  const oldAllFiles = existsSync(allFilesPath) ? JSON.parse(readFileSync(allFilesPath, 'utf-8')) : [];
  const newAllFiles = [...new Set([...oldAllFiles, ...newFiles])].sort();
  writeFileSync(allFilesPath, JSON.stringify(newAllFiles, null, 2), 'utf-8');
}

if (import.meta.main) {
  // Input: allPackages.json, allFiles.json
  // Output: Total LOC, Total Size, Total Files, Total Packages
  const files = new Set<string>(JSON.parse(readFileSync(allFilesPath, 'utf-8')));
  const packages = new Set<string>(JSON.parse(readFileSync(allPkgsPath, 'utf-8')));

  const totalLines = await countTotalLines(files);
  const totalSize = await countTotalSize(files);

  console.log(`Total Lines: ${totalLines.nFiles} files, ${totalLines.code} lines of code, ${totalLines.comment} comments, ${totalLines.blank} blank lines`);
  console.log(`Total Size: ${totalSize} bytes`);
  console.log(`Total Packages: ${packages.size}`);

  const allSuffixes = new Set<string>();
  for (const file of files) {
    const suffix = file.split('.').pop();
    if (suffix) allSuffixes.add(suffix);
  }
  console.log(`File Suffixes: ${Array.from(allSuffixes).sort().join(', ')}`);
}
