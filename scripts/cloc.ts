import { spawn } from 'node:child_process';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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