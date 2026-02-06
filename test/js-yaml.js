#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = process.argv[2];
if (!bundlePath) { console.error('Usage: node test/js-yaml.js <path-to-bundled-file>'); process.exit(1); }
async function captureConsoleOutput(modulePath) {
  let output = [];
  const originalLog = console.log;
  console.log = (...args) => { output.push(args); };
  try {
    process.env.YAML_STRING =  `bool_values:
  - true
  - False
  - ON
  - off
numbers:
  integer: 12345
  octal: 0o755        # 八进制
  hex: 0xDEADBEEF     # 十六进制
  float: 3.14159
  exponential: 1.2e+3
  infinity: .inf
  not_a_number: .nan

# 2. 字符串处理 (String Blocks)
strings:
  plain: 这是一个普通字符串，不需要引号
  quoted: "双引号可以包含转义字符: \n \t \u2764"
  folded: >
    如果你使用折叠块（大于号），
    换行符会被转换为空格，
    除非遇到空行。
  literal: |
    保留块（竖线）会保留
    所有的换行符
    以及缩进。

# 3. 锚点与别名 (Anchors & Aliases) - 重用数据
reusable_config: &default_settings
  timeout: 30
  adapter: postgres
  encoding: utf-8

inheritance_demo:
  <<: *default_settings  # 合并键 (Merge Key, YAML 1.1 常用)
  adapter: mysql         # 覆盖
  debug: true

# 4. 复杂键 (Complex Keys) - 使用问号表示键是一个对象
? - key_part_1
  - key_part_2
: value_for_complex_key

# 5. 序列与映射 (Collections)
nested_collections:
  - [item1, item2]       # 流式序列 (Flow sequence)
  - {name: Ben, age: 25} # 流式映射 (Flow mapping)
  -
    - block_item_1
    - block_item_2`;
    await import(modulePath + '?t=' + Date.now());
    return output;
  } finally {
    console.log = originalLog;
  }
}
try {
  const expected = await captureConsoleOutput(path.join(__dirname, '../src/js-yaml.js'));
  const actual = await captureConsoleOutput(path.resolve(bundlePath));
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    console.log('✅ Test passed');
    process.exit(0);
  } else {
    console.error('❌ Test failed');
    console.error('Expected:', JSON.stringify(expected, null, 2));
    console.error('Got:', JSON.stringify(actual, null, 2));
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
