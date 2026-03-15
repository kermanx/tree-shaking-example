import { spawn } from 'node:child_process';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Define precise type interfaces
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
  // Language name as key (e.g., "TypeScript", "Rust", "Markdown")
  [language: string]: ClocLanguageStats | any;
  // Summary field
  SUM: ClocLanguageStats;
}

/**
 * Count total lines of code for a set of files
 * 
 * @param filePaths - Set of absolute or relative file paths
 * @returns Promise<ClocLanguageStats> - Returns summary statistics (SUM)
 */
export async function countTotalLines(filePaths: Set<string>): Promise<ClocLanguageStats> {
  // Handle edge cases
  if (filePaths.size === 0) {
    return { nFiles: 0, blank: 0, comment: 0, code: 0 };
  }

  // Create temporary file list to avoid "Argument list too long" (E2BIG) error
  const tempFileListPath = join(tmpdir(), `cloc-list-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);

  // Convert Set to newline-separated string
  const fileContent = Array.from(filePaths).join('\n');

  try {
    await writeFile(tempFileListPath, fileContent, 'utf-8');

    // Call cloc with arguments:
    // --list-file: Read path list from file
    // --json: Output in JSON format for easy parsing
    // --quiet: Suppress unnecessary output
    const result = await runCloc(['--list-file', tempFileListPath, '--json', '--quiet']);

    // Return summary data (SUM)
    return result.SUM;

  } finally {
    // Cleanup temporary file (ensure cleanup happens even if cloc fails)
    await unlink(tempFileListPath).catch(() => { /* ignore cleanup errors */ });
  }
}

/**
 * Helper function to execute cloc command
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
        // cloc may return non-zero if no valid files found, check stderr to determine
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
    // Match all package names after node_modules/, take the last one (supports pnpm's .pnpm directory structure)
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
const projectRoot = resolve(import.meta.dirname, '..');

export function updateAllFilesAndPackages(newFiles: Set<string>, newPackages: Set<string>): void {
  const oldAllPkgs = existsSync(allPkgsPath) ? JSON.parse(readFileSync(allPkgsPath, 'utf-8')) : [];
  const newAllPkgs = [...new Set([...oldAllPkgs, ...newPackages])].sort();
  writeFileSync(allPkgsPath, JSON.stringify(newAllPkgs, null, 2), 'utf-8');

  const oldAllFiles = existsSync(allFilesPath) ? JSON.parse(readFileSync(allFilesPath, 'utf-8')) : [];
  const newAllFiles = [...new Set([...oldAllFiles, ...newFiles])].sort().map((file: string) => {
    // Convert absolute paths to paths relative to project root
    const relativePath = file.startsWith(projectRoot) ? file.slice(projectRoot.length + 1) : file;
    return relativePath;
  });
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
