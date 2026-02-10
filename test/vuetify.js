#!/usr/bin/env node

// Test for vuetify
// Usage: node test/vuetify.js <path-to-bundled-file>

import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = process.argv[2];

if (!bundlePath) {
  console.error('Usage: node test/vuetify.js <path-to-bundled-file>');
  process.exit(1);
}

// Mock CSS imports
import Module from 'module';
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain) {
  if (request.endsWith('.css')) {
    return request;
  }
  return originalResolveFilename.call(this, request, parent, isMain);
};

const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request.endsWith('.css')) {
    return {};
  }
  return originalLoad.call(this, request, parent, isMain);
};

async function runInDom(modulePath) {
  // Set up a fresh DOM environment
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
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

    // Mock getComputedStyle for vuetify
    const getComputedStyleMock = () => ({
      getPropertyValue: () => ''
    });
    if (!dom.window.getComputedStyle) {
      dom.window.getComputedStyle = getComputedStyleMock;
    }
    global.getComputedStyle = getComputedStyleMock;

    global.Element = dom.window.Element;
    global.HTMLElement = dom.window.HTMLElement;
    global.SVGElement = dom.window.SVGElement;
    global.ShadowRoot = dom.window.ShadowRoot || class ShadowRoot {};

    // Load the module
    await import(modulePath);

    // Give Vue time to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the rendered content
    const element = dom.window.document.getElementById('app');
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
    delete global.getComputedStyle;
    delete global.Element;
    delete global.HTMLElement;
    delete global.SVGElement;
    delete global.ShadowRoot;
  }
}

try {
  // Run the original source file
  const expectedOutput = await runInDom(path.join(__dirname, '../dist/vuetify_rollup.js'));

  // Run the bundled file
  const actualOutput = await runInDom(path.resolve(bundlePath));

  // Compare outputs (normalize CSS class names and Vue-specific attributes)
  const normalizeOutput = (html) => html
    .replace(/v-[a-z0-9-]+="[^"]*"/g, '')
    .replace(/data-v-[a-z0-9]+/g, 'data-v-XXX')
    .replace(/\s+/g, ' ')
    .trim();

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
