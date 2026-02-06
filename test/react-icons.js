#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = process.argv[2];
if (!bundlePath) { console.error('Usage: node file.js <path-to-bundled-file>'); process.exit(1); }
async function captureConsoleOutput(modulePath) {
  let output = [];
  const originalLog = console.log;
  console.log = (...args) => { output.push(args); };
  try {
    await import(modulePath + '?t=' + Date.now());
    return output;
  } finally {
    console.log = originalLog;
  }
}
try {
  const expected = await captureConsoleOutput(path.join(__dirname, '../dist/react-icons_rollup.js'));
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
