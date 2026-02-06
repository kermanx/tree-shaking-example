#!/usr/bin/env node

// Test for novnc
// Usage: node test/novnc.js <path-to-bundled-file>

import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = process.argv[2];

if (!bundlePath) {
  console.error('Usage: node test/novnc.js <path-to-bundled-file>');
  process.exit(1);
}

async function runInDom(modulePath) {
  const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div id="noVNC_control_bar"></div>
  <div id="noVNC_status"></div>
  <canvas id="noVNC_canvas"></canvas>
</body>
</html>`, {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });

  const originalWindow = global.window;
  const originalDocument = global.document;
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(global, 'navigator');
  const originalWebSocket = global.WebSocket;
  const originalMutationObserver = global.MutationObserver;

  try {
    global.window = dom.window;
    global.document = dom.window.document;
    Object.defineProperty(global, 'navigator', {
      value: dom.window.navigator,
      writable: true,
      configurable: true
    });
    global.WebSocket = class MockWebSocket {};

    // Mock MutationObserver for noVNC
    global.MutationObserver = class MockMutationObserver {
      constructor() {}
      observe() {}
      disconnect() {}
    };

    await import(modulePath);

    return true;
  } finally {
    if (originalWindow !== undefined) global.window = originalWindow;
    else delete global.window;
    if (originalDocument !== undefined) global.document = originalDocument;
    else delete global.document;
    if (navigatorDescriptor) {
      Object.defineProperty(global, 'navigator', navigatorDescriptor);
    } else {
      delete global.navigator;
    }
    if (originalWebSocket !== undefined) global.WebSocket = originalWebSocket;
    else delete global.WebSocket;
    if (originalMutationObserver !== undefined) global.MutationObserver = originalMutationObserver;
    else delete global.MutationObserver;
  }
}

try {
  // Run the original source file
  await runInDom(path.join(__dirname, '../src/novnc.js'));

  // Run the bundled file
  await runInDom(path.resolve(bundlePath));

  console.log('✅ Test passed: Both original and bundled files loaded successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Test failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
