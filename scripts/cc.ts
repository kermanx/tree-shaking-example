import { spawn } from 'child_process';
import binaryPath from 'google-closure-compiler-linux';

/**
 * Closure Compiler 的配置选项接口
 * 键名为参数名（不带 --），值为参数值。
 * 值为 true 时仅作为 flag 开关；值为数组时会多次传入该参数。
 */
export interface ClosureCompilerOptions {
  [key: string]: string | number | boolean | string[];
}

/**
 * 使用 Google Closure Compiler 优化 JavaScript 代码
 *
 * @param jsSource - 需要优化的原始 JavaScript 源码字符串
 * @param options - 编译器配置对象 (例如: { compilation_level: 'ADVANCED', language_out: 'ECMASCRIPT5' })
 * @returns Promise<string> - 优化后的代码
 */
export function gcc(
  jsSource: string,
  options: ClosureCompilerOptions = {}
): Promise<string> {
  return gccWithTiming(jsSource, options).then(result => result.code);
}

/**
 * 使用 Google Closure Compiler 优化 JavaScript 代码，并返回计时信息
 *
 * @param jsSource - 需要优化的原始 JavaScript 源码字符串
 * @param options - 编译器配置对象
 * @returns Promise<{code: string, time: number}> - 优化后的代码和执行时间(ms)
 */
export function gccWithTiming(
  jsSource: string,
  options: ClosureCompilerOptions = {}
): Promise<{ code: string; time: number }> {
  if (jsSource.includes('const Text = ') || jsSource.includes('var dump  ')) {
    jsSource = `(function(){${jsSource}})()`; // 包裹在块作用域中，避免全局变量污染
  }

  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    // 1. 构建命令行参数
    const args: string[] = [];

    for (const [key, value] of Object.entries(options)) {
      // 自动处理 key，如果用户没写 -- 前缀则补上
      // 建议用户传入 snake_case (如 compilation_level)，但也兼容 camelCase (如 compilationLevel)
      // Google Closure Compiler 主要使用 snake_case 风格的参数
      let flagName = key.startsWith('-') ? key : `--${key}`;

      // 简单的 camelCase 转 snake_case 处理 (可选，为了更好的 TS 体验)
      if (!key.startsWith('-') && /[A-Z]/.test(key)) {
        flagName = '--' + key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      }

      if (Array.isArray(value)) {
        // 如果是数组，则同一个 flag 传入多次 (例如 --externs a.js --externs b.js)
        value.forEach(v => args.push(flagName, String(v)));
      } else if (value === true) {
        // 布尔值为 true，仅作为开关 flag (例如 --angular_pass)
        args.push(flagName);
      } else if (value !== false && value !== null && value !== undefined) {
        // 普通键值对
        args.push(flagName + '=' + String(value));
      }
    }

    console.log(binaryPath, args.join(' ')); // 调试输出完整命令行

    // 2. 启动子进程
    // stdio 配置: [stdin(pipe), stdout(pipe), stderr(pipe)]
    const child = spawn(binaryPath, args, {
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    // 3. 收集标准输出 (编译后的代码)
    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    // 4. 收集错误输出 (报错或警告)
    child.stderr.on('data', (chunk) => {
      errorOutput += chunk.toString();
    });

    // 5. 处理进程错误 (如无法启动)
    child.on('error', (err) => {
      reject(new Error(`Failed to spawn Closure Compiler: ${err.message}`));
    });

    // 6. 进程结束处理
    child.on('close', (code) => {
      const endTime = performance.now();
      const time = endTime - startTime;

      if (code === 0) {
        resolve({ code: output, time });
      } else {
        // 即使退出码非0，有时 stdout 也有内容，但通常意味着失败
        reject(new Error(`Closure Compiler failed (exit code ${code}):\n${errorOutput}`));
      }
    });

    // 7. 将源码写入标准输入流，并结束写入
    try {
      child.stdin.write(jsSource);
      child.stdin.end();
    } catch (e) {
      reject(new Error('Failed to write to stdin'));
    }
  });
}
