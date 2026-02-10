#!/usr/bin/env node

// Test for novnc
// Usage: node test/novnc.js <path-to-bundled-file>

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = process.argv[2];

if (!bundlePath) {
  console.error('Usage: node test/novnc.js <path-to-bundled-file>');
  process.exit(1);
}

function getInitialHTML() {
  // Read vnc.html and extract body content
  const vncHtmlPath = path.join(__dirname, '../vendor/noVNC/vnc.html');
  const vncHtml = readFileSync(vncHtmlPath, 'utf-8');

  // Parse the HTML to extract body content
  const tempDom = new JSDOM(vncHtml);
  return tempDom.window.document.body.innerHTML;
}

function serializeDOM(document) {
  // Serialize the DOM tree to a comparable string
  return document.body.innerHTML;
}

function waitForDOMChanges(window, timeout = 1000) {
  return new Promise((resolve) => {
    let timeoutId;
    const observer = new window.MutationObserver(() => {
      // Reset timeout on each mutation
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 100); // Wait 100ms after last mutation
    });

    observer.observe(window.document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Fallback timeout
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeout);
  });
}

async function runInDom(modulePath) {
  const initialHTML = getInitialHTML();

  const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
${initialHTML}
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
  const originalLocalStorage = global.localStorage;

  try {
    global.window = dom.window;
    global.document = dom.window.document;
    Object.defineProperty(global, 'navigator', {
      value: dom.window.navigator,
      writable: true,
      configurable: true
    });
    global.WebSocket = class MockWebSocket {};
    global.MutationObserver = dom.window.MutationObserver;

    // Mock localStorage
    const storage = new Map();
    global.localStorage = {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
      clear: () => storage.clear(),
      get length() { return storage.size; },
      key: (index) => Array.from(storage.keys())[index] || null,
    };

    await import(modulePath);

    // Wait for DOM changes to complete
    await waitForDOMChanges(dom.window);

    return serializeDOM(dom.window.document);
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
    if (originalLocalStorage !== undefined) global.localStorage = originalLocalStorage;
    else delete global.localStorage;
  }
}

try {
  // Run the original source file
  const originalDOM = await runInDom(path.join(__dirname, '../src/novnc.js'));

  // Run the bundled file
  const bundledDOM = await runInDom(path.resolve(bundlePath));

  // Compare DOM trees
  if (originalDOM === bundledDOM) {
    console.log('✅ Test passed: DOM trees match');
    process.exit(0);
  } else {
    console.error('❌ Test failed: DOM trees do not match');
    console.error('\n=== Original DOM ===');
    console.error(originalDOM.substring(0, 500));
    console.error('\n=== Bundled DOM ===');
    console.error(bundledDOM.substring(0, 500));
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Test failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
