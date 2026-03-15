/**
 * @fileoverview Externs for Node.js Buffer API.
 * @externs
 */

/**
 * @constructor
 * @extends {Uint8Array}
 * @param {number|string|!Array|!ArrayBuffer|!Uint8Array} arg1
 * @param {(string|number)=} arg2
 * @param {number=} arg3
 */
function Buffer(arg1, arg2, arg3) {}

/**
 * @param {number} size
 * @param {(string|!Buffer|number)=} fill
 * @param {string=} encoding
 * @return {!Buffer}
 */
Buffer.alloc = function(size, fill, encoding) {};

/**
 * @param {number} size
 * @return {!Buffer}
 */
Buffer.allocUnsafe = function(size) {};

/**
 * @param {number} size
 * @return {!Buffer}
 */
Buffer.allocUnsafeSlow = function(size) {};

/**
 * @param {string|!Buffer|!ArrayBuffer|!Array|!Uint8Array} arrayBufferOrString
 * @param {(number|string)=} byteOffsetOrEncoding
 * @param {number=} length
 * @return {!Buffer}
 */
Buffer.from = function(arrayBufferOrString, byteOffsetOrEncoding, length) {};

/**
 * @param {!Array<!Buffer|!Uint8Array>} list
 * @param {number=} totalLength
 * @return {!Buffer}
 */
Buffer.concat = function(list, totalLength) {};

/**
 * @param {*} obj
 * @return {boolean}
 */
Buffer.isBuffer = function(obj) {};

/**
 * @param {string|!Buffer|!ArrayBuffer|!ArrayBufferView} string
 * @param {string=} encoding
 * @return {number}
 */
Buffer.byteLength = function(string, encoding) {};

/**
 * @param {string=} encoding
 * @param {number=} start
 * @param {number=} end
 * @return {string}
 */
Buffer.prototype.toString = function(encoding, start, end) {};

/**
 * @param {!Buffer|!Uint8Array} target
 * @param {number=} targetStart
 * @param {number=} sourceStart
 * @param {number=} sourceEnd
 * @return {number}
 */
Buffer.prototype.copy = function(target, targetStart, sourceStart, sourceEnd) {};

/**
 * @param {number=} start
 * @param {number=} end
 * @return {!Buffer}
 */
Buffer.prototype.slice = function(start, end) {};

/**
 * @param {!Buffer|!Uint8Array} otherBuffer
 * @return {boolean}
 */
Buffer.prototype.equals = function(otherBuffer) {};

/**
 * @param {string|!Buffer|!Uint8Array|number} value
 * @param {number=} offset
 * @param {number=} end
 * @param {string=} encoding
 * @return {!Buffer}
 */
Buffer.prototype.fill = function(value, offset, end, encoding) {};

/**
 * @param {string} string
 * @param {number=} offset
 * @param {number=} length
 * @param {string=} encoding
 * @return {number}
 */
Buffer.prototype.write = function(string, offset, length, encoding) {};

/**
 * @param {number} value
 * @param {number=} offset
 * @return {number}
 */
Buffer.prototype.writeUInt8 = function(value, offset) {};

/**
 * @param {number=} offset
 * @return {number}
 */
Buffer.prototype.readUInt8 = function(offset) {};

/** @type {number} */
Buffer.poolSize;

/**
 * Declare the global Buffer variable
 * @type {function(new:Buffer, ...*): ?}
 */
var global;
global.Buffer = Buffer;
Window.prototype.Buffer = Buffer;