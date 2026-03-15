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
  octal: 0o755        # Octal
  hex: 0xDEADBEEF     # Hexadecimal
  float: 3.14159
  exponential: 1.2e+3
  infinity: .inf
  not_a_number: .nan

# 2. String Blocks
strings:
  plain: This is a plain string without quotes
  quoted: "Double quotes can contain escape sequences: \n \t \u2764"
  folded: >
    If you use folded blocks (greater than sign),
    newlines are converted to spaces,
    unless there is a blank line.
  literal: |
    Literal blocks (pipe character) preserve
    all newline characters
    and indentation.

# 3. Anchors & Aliases - Data reuse
reusable_config: &default_settings
  timeout: 30
  adapter: postgres
  encoding: utf-8

inheritance_demo:
  <<: *default_settings  # Merge Key (commonly used in YAML 1.1)
  adapter: mysql         # Override
  debug: true

# 4. Complex Keys - Use question mark to indicate key is an object
? - key_part_1
  - key_part_2
: value_for_complex_key

# 5. Sequences and Mappings (Collections)
nested_collections:
  - [item1, item2]       # Flow sequence
  - {name: Ben, age: 25} # Flow mapping
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
  const expected = await captureConsoleOutput(path.join(import.meta.dirname, '../benchmarks/js-yaml.js'));
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
