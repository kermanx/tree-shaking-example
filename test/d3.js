#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = process.argv[2];

if (!bundlePath) {
  console.error('Usage: node file.js <path-to-bundled-file>');
  process.exit(1);
}

async function captureConsoleOutput(modulePath) {
  let output = [];
  const originalLog = console.log;

  // Create a JSDOM instance for d3
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const originalWindow = global.window;
  const originalDocument = global.document;

  try {
    // Set up global DOM environment
    global.window = dom.window;
    global.document = dom.window.document;

    console.log = (...args) => { output.push(args); };

    await import(modulePath + '?t=' + Date.now());

    return output;
  } finally {
    console.log = originalLog;

    // Restore globals
    if (originalWindow !== undefined) global.window = originalWindow;
    else delete global.window;
    if (originalDocument !== undefined) global.document = originalDocument;
    else delete global.document;
  }
}

try {
  const expected = await captureConsoleOutput(path.join(__dirname, '../src/d3.js'));
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
  console.error(error.stack);
  process.exit(1);
}
