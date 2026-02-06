#!/usr/bin/env node

// Test for antd
// Usage: node test/antd.js <path-to-bundled-file>

import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = process.argv[2];

if (!bundlePath) {
  console.error('Usage: node test/antd.js <path-to-bundled-file>');
  process.exit(1);
}

async function runInDom(modulePath) {
  // Set up a fresh DOM environment
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    runScripts: 'outside-only',
  });

  const originalWindow = global.window;
  const originalDocument = global.document;
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(global, 'navigator');

  try {
    global.window = dom.window;
    global.document = dom.window.document;
    Object.defineProperty(global, 'navigator', {
      value: dom.window.navigator,
      writable: true,
      configurable: true
    });

    // Mock getComputedStyle for antd
    if (!dom.window.getComputedStyle) {
      dom.window.getComputedStyle = () => ({
        getPropertyValue: () => ''
      });
    }

    // Load the module
    await import(modulePath);

    // Give React time to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the rendered content
    const element = dom.window.document.getElementById('root');
    return element ? element.innerHTML : '';
  } finally {
    // Restore globals
    if (originalWindow !== undefined) global.window = originalWindow;
    else delete global.window;
    if (originalDocument !== undefined) global.document = originalDocument;
    else delete global.document;
    if (navigatorDescriptor) {
      Object.defineProperty(global, 'navigator', navigatorDescriptor);
    } else {
      delete global.navigator;
    }
  }
}

try {
  // Run the original source file
  const expectedOutput = await runInDom(path.join(__dirname, '../src/antd.js'));

  // Run the bundled file
  const actualOutput = await runInDom(path.resolve(bundlePath));

  // Compare outputs (normalize CSS class names)
  const normalizeOutput = (html) => html.replace(/css-[a-z0-9-]+/g, 'css-XXX');
  const normalizedExpected = normalizeOutput(expectedOutput);
  const normalizedActual = normalizeOutput(actualOutput);

  if (normalizedExpected === normalizedActual) {
    console.log('✅ Test passed');
    process.exit(0);
  } else {
    console.error('❌ Test failed: DOM output does not match');
    console.error('   Expected length:', expectedOutput.length);
    console.error('   Actual length:', actualOutput.length);
    console.error('   Expected:', expectedOutput.substring(0, 200));
    console.error('   Actual:', actualOutput.substring(0, 200));
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Test failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
