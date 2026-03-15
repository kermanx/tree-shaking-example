/** @externs */
var localStorage;
localStorage.getItem = function(name) {};
localStorage.setItem = function(name, value) {};
localStorage.removeItem = function(name) {};
localStorage.clear = function() {};

/** @externs */
function matchMedia(query) {}


/**
 * @fileoverview Externs for the modern Web Navigation API.
 * @externs
 */

/**
 * @constructor
 * @extends {EventTarget}
 */
function Navigation() {}

/** @type {NavigationHistoryEntry} */
Navigation.prototype.currentEntry;

/** @type {NavigationTransition} */
Navigation.prototype.transition;

/**
 * @return {!Array<!NavigationHistoryEntry>}
 */
Navigation.prototype.entries = function() {};

/**
 * @param {string} url
 * @param {Object=} options
 * @return {!Object} 
 */
Navigation.prototype.navigate = function(url, options) {};

/**
 * @param {Object=} options
 * @return {!Object}
 */
Navigation.prototype.reload = function(options) {};

/**
 * @param {Object=} options
 * @return {!Object}
 */
Navigation.prototype.back = function(options) {};

/**
 * @param {Object=} options
 * @return {!Object}
 */
Navigation.prototype.forward = function(options) {};

/**
 * @param {string} key
 * @param {Object=} options
 * @return {!Object}
 */
Navigation.prototype.traverseTo = function(key, options) {};

/**
 * @param {Object} options
 * @return {void}
 */
Navigation.prototype.updateCurrentEntry = function(options) {};

/**
 * @constructor
 */
function NavigationTransition() {}

/** @type {string} */
NavigationTransition.prototype.navigationType;

/** @type {NavigationHistoryEntry} */
NavigationTransition.prototype.from;

/** @type {Promise<void>} */
NavigationTransition.prototype.finished;

/**
 * @type {!Navigation}
 */
var navigation;

/**
 * @type {!Navigation}
 */
Window.prototype.navigation;

// sessionStorage
/** @type {!Object} */
var sessionStorage;
sessionStorage.getItem = function(name) {};
sessionStorage.setItem = function(name, value) {};
sessionStorage.removeItem = function(name) {};
sessionStorage.clear = function() {};

// innerWidth, innerHeight
/** @type {number} */
var innerWidth;
/** @type {number} */
var innerHeight;

// Node.js process global (used by path-browserify in browser bundles)
/** @type {!Object} */
var process;
process.cwd = function() { return ''; };

// open() is window.open() called without window prefix
/** @type {function(string=, string=, string=): Window} */
var open;
