#!/usr/bin/env node
import path from 'path';
import { JSDOM } from 'jsdom';
const bundlePath = process.argv[2];
if (!bundlePath) { console.error('Usage: node test/vuetify.js <path-to-bundled-file>'); process.exit(1); }
try {
  // Set up minimal DOM for vuetify
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.SVGElement = dom.window.SVGElement;
  
  await import(path.resolve(bundlePath));
  console.log('✅ Test passed');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
