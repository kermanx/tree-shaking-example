// generate-mock.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 你的 Benchmark 源码目录（根据你的实际情况修改）
const INPUT_CODE = path.resolve('../dist/glob_rollup.js'); 
// 生成的 mock 文件路径（需与你传给 GCC 的 --browser_resolver_prefix_replacements 路径一致）
const OUTPUT_MOCK_FILE = path.resolve('./cc-node-builtins.js');

// 匹配 import { a, b as c } from 'node:...' 语法的正则
const NAMED_IMPORT_REGEX = /import\s+\{([^}]+)\}\s+from\s+['"](?:node:)?([a-zA-Z0-9_-]+)['"]/g;

const uniqueExports = new Set();

// 提取文件中的命名导入
function extractImports(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = NAMED_IMPORT_REGEX.exec(code)) !== null) {
    const importClause = match[1]; // 提取 { ... } 里面的内容
    
    // 按逗号分割，处理多变量导入
    const imports = importClause.split(',');
    for (const imp of imports) {
      const trimmed = imp.trim();
      if (!trimmed) continue;
      
      // 处理 'originalName as aliasName' 的情况，我们只需要导出 originalName
      const originalName = trimmed.split(/\s+as\s+/)[0].trim();
      uniqueExports.add(originalName);
    }
  }
}

// 执行扫描
try {
  extractImports(INPUT_CODE);
} catch (err) {
  console.error(`读取目录失败: ${err.message}`);
  process.exit(1);
}

// 生成 mock 文件内容
let mockContent = `/**\n * Auto-generated mock file to prevent GCC NullPointerException\n */\n\n`;
mockContent += `export default {};\n\n`; // 兜底默认导出

for (const exportName of uniqueExports) {
  // 使用 function() {} 作为占位符，既能满足 AST 节点查找，又能在 Tree-shaking 中被安全识别为无副作用
  mockContent += `export const ${exportName} = function() {};\n`;
}

// 写入文件
fs.writeFileSync(OUTPUT_MOCK_FILE, mockContent, 'utf-8');
console.log(`✅ 成功生成 Mock 文件，包含 ${uniqueExports.size} 个命名导出，路径: ${OUTPUT_MOCK_FILE}`);