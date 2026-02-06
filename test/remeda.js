#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = process.argv[2];
if (!bundlePath) { console.error('Usage: node test/remeda.js <path-to-bundled-file>'); process.exit(1); }
try {
  const bundled = await import(path.resolve(bundlePath));
  const expected = (await import(path.join(__dirname, '../src/remeda.js'))).answer;
  if (JSON.stringify(bundled.answer) === JSON.stringify(expected)) {
    console.log('✅ Test passed');
    process.exit(0);
  } else {
    console.error('❌ Test failed');
    console.error('Expected:', expected);
    console.error('Got:', bundled.answer);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
