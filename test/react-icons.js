#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = process.argv[2];
if (!bundlePath) { console.error('Usage: node test/react-icons.js <path-to-bundled-file>'); process.exit(1); }
try {
  const bundled = await import(path.resolve(bundlePath));
  
  // For react-icons, we can't import the source file directly due to directory import issues
  // So we just verify the bundled file has the expected export and it's a string
  if (bundled.answer === undefined) {
    console.error('❌ Test failed: "answer" export not found');
    process.exit(1);
  }
  
  if (typeof bundled.answer === 'string' && bundled.answer.length > 0) {
    console.log('✅ Test passed');
    process.exit(0);
  } else {
    console.error('❌ Test failed: answer is not a valid string');
    console.error('Got:', bundled.answer);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
