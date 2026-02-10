/**
* This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
*
* ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
*/
const DEBUG_BUILD$2 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
/** Internal global with common properties and Sentry extensions  */
/** Get's the global object for the current JavaScript runtime */
const GLOBAL_OBJ = globalThis;
/**
* An object that contains globally accessible properties and maintains a scope stack.
* @hidden
*/
/**
* Returns the global shim registry.
*
* FIXME: This function is problematic, because despite always returning a valid Carrier,
* it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
* at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
**/
function getMainCarrier() {
	// This ensures a Sentry carrier exists
	getSentryCarrier(GLOBAL_OBJ);
	return GLOBAL_OBJ;
}
/** Will either get the existing sentry carrier, or create a new one. */
function getSentryCarrier(carrier) {
	const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
	// For now: First SDK that sets the .version property wins
	__SENTRY__.version = __SENTRY__.version || "10.38.0";
	// Intentionally populating and returning the version of "this" SDK instance
	// rather than what's set in .version so that "this" SDK always gets its carrier
	return __SENTRY__["10.38.0"] = __SENTRY__["10.38.0"] || {};
}
/**
* Returns a global singleton contained in the global `__SENTRY__[]` object.
*
* If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
* function and added to the `__SENTRY__` object.
*
* @param name name of the global singleton on __SENTRY__
* @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
* @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
* @returns the singleton
*/
function getGlobalSingleton(name, creator, obj = GLOBAL_OBJ) {
	const __SENTRY__ = obj.__SENTRY__ = obj.__SENTRY__ || {};
	const carrier = __SENTRY__["10.38.0"] = __SENTRY__["10.38.0"] || {};
	// Note: We do not want to set `carrier.version` here, as this may be called before any `init` is called, e.g. for the default scopes
	return carrier[name] || (carrier[name] = creator());
}
const CONSOLE_LEVELS = [
	"debug",
	"info",
	"warn",
	"error",
	"log",
	"assert",
	"trace"
];
/** This may be mutated by the console instrumentation. */
const originalConsoleMethods = {};
/**
* Temporarily disable sentry console instrumentations.
*
* @param callback The function to run against the original `console` messages
* @returns The results of the callback
*/
function consoleSandbox(callback) {
	if (!("console" in GLOBAL_OBJ)) {
		return callback();
	}
	const console = GLOBAL_OBJ.console;
	const wrappedFuncs = {};
	const wrappedLevels = Object.keys(originalConsoleMethods);
	// Restore all wrapped console methods
	wrappedLevels.forEach((level) => {
		const originalConsoleMethod = originalConsoleMethods[level];
		wrappedFuncs[level] = console[level];
		console[level] = originalConsoleMethod;
	});
	try {
		return callback();
	} finally {
		// Revert restoration to wrapped state
		wrappedLevels.forEach((level) => {
			console[level] = wrappedFuncs[level];
		});
	}
}
function isEnabled() {
	return _getLoggerSettings().enabled;
}
function log(...args) {
	_maybeLog("log", ...args);
}
function warn(...args) {
	_maybeLog("warn", ...args);
}
function error(...args) {
	_maybeLog("error", ...args);
}
function _maybeLog(level, ...args) {
	if (!DEBUG_BUILD$2) {
		return;
	}
	if (isEnabled()) {
		consoleSandbox(() => {
			GLOBAL_OBJ.console[level](`${"Sentry Logger "}[${level}]:`, ...args);
		});
	}
}
function _getLoggerSettings() {
	if (!DEBUG_BUILD$2) {
		return { enabled: false };
	}
	return getGlobalSingleton("loggerSettings", () => ({ enabled: false }));
}
/**
* This is a logger singleton which either logs things or no-ops if logging is not enabled.
*/
const debug = {
	a: log,
	b: warn,
	c: error
};
// Used to sanitize webpack (error: *) wrapped stack errors
const WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
const STRIP_FRAME_REGEXP = /captureMessage|captureException/;
/**
* Creates a stack parser with the supplied line parsers
*
* StackFrames are returned in the correct order for Sentry Exception
* frames and with Sentry SDK internal frames removed from the top and bottom
*
*/
function createStackParser(...parsers) {
	const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
	return (stack, skipFirstLines = 0, framesToPop = 0) => {
		const frames = [];
		const lines = stack.split("\n");
		for (let i = skipFirstLines; i < lines.length; i++) {
			let line = lines[i];
			// Truncate lines over 1kb because many of the regular expressions use
			// backtracking which results in run time that increases exponentially
			// with input size. Huge strings can result in hangs/Denial of Service:
			// https://github.com/getsentry/sentry-javascript/issues/2286
			if (line.length > 1024) {
				line = line.slice(0, 1024);
			}
			// https://github.com/getsentry/sentry-javascript/issues/5459
			// Remove webpack (error: *) wrappers
			const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
			// https://github.com/getsentry/sentry-javascript/issues/7813
			// Skip Error: lines
			if (cleanedLine.match(/\S*Error: /)) {
				continue;
			}
			for (const parser of sortedParsers) {
				const frame = parser(cleanedLine);
				if (frame) {
					frames.push(frame);
					break;
				}
			}
			if (frames.length >= 50 + framesToPop) {
				break;
			}
		}
		return stripSentryFramesAndReverse(frames.slice(framesToPop));
	};
}
/**
* Gets a stack parser implementation from Options.stackParser
* @see Options
*
* If options contains an array of line parsers, it is converted into a parser
*/
function stackParserFromStackParserOptions(stackParser) {
	if (Array.isArray(stackParser)) {
		return createStackParser(...stackParser);
	}
	return stackParser;
}
/**
* Removes Sentry frames from the top and bottom of the stack if present and enforces a limit of max number of frames.
* Assumes stack input is ordered from top to bottom and returns the reverse representation so call site of the
* function that caused the crash is the last frame in the array.
* @hidden
*/
function stripSentryFramesAndReverse(stack) {
	if (!stack.length) {
		return [];
	}
	const localStack = Array.from(stack);
	// If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
	if (/sentryWrapped/.test(getLastStackFrame(localStack).function || "")) {
		localStack.pop();
	}
	// Reversing in the middle of the procedure allows us to just pop the values off the stack
	localStack.reverse();
	// If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
	if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "")) {
		localStack.pop();
		// When using synthetic events, we will have a 2 levels deep stack, as `new Error('Sentry syntheticException')`
		// is produced within the scope itself, making it:
		//
		//   Sentry.captureException()
		//   scope.captureException()
		//
		// instead of just the top `Sentry` call itself.
		// This forces us to possibly strip an additional frame in the exact same was as above.
		if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "")) {
			localStack.pop();
		}
	}
	return localStack.slice(0, 50).map((frame) => ({
		...frame,
		filename: frame.filename || getLastStackFrame(localStack).filename,
		function: frame.function || "?"
	}));
}
function getLastStackFrame(arr) {
	return arr[arr.length - 1] || {};
}
/**
* Safely extract function name from itself
*/
function getFunctionName(fn) {
	try {
		if (!fn || typeof fn !== "function") {
			return "<anonymous>";
		}
		return fn.name || "<anonymous>";
	} catch {
		// Just accessing custom props in some Selenium environments
		// can cause a "Permission denied" exception (see raven-js#495).
		return "<anonymous>";
	}
}
/**
* Get's stack frames from an event without needing to check for undefined properties.
*/
function getFramesFromEvent(event) {
	const exception = event.exception;
	if (exception) {
		const frames = [];
		try {
			// @ts-expect-error Object could be undefined
			exception.values.forEach((value) => {
				// @ts-expect-error Value could be undefined
				if (value.stacktrace.frames) {
					// @ts-expect-error Value could be undefined
					frames.push(...value.stacktrace.frames);
				}
			});
			return frames;
		} catch {
			return void 0;
		}
	}
	return void 0;
}
/**
* Get the internal name of an internal Vue value, to represent it in a stacktrace.
*
* @param value The value to get the internal name of.
*/
function getVueInternalName(value) {
	// Check if it's a VNode (has __v_isVNode) or a component instance (has _isVue/__isVue)
	const isVNode = "__v_isVNode" in value && value.__v_isVNode;
	return isVNode ? "[VueVNode]" : "[VueViewModel]";
}
// We keep the handlers globally
const handlers = {};
const instrumented = {};
/** Add a handler function. */
function addHandler(type, handler) {
	handlers[type] = handlers[type] || [];
	handlers[type].push(handler);
}
/** Maybe run an instrumentation function, unless it was already called. */
function maybeInstrument(type, instrumentFn) {
	if (!instrumented[type]) {
		instrumented[type] = true;
		try {
			instrumentFn();
		} catch (e) {
			DEBUG_BUILD$2 && debug.c(`Error while instrumenting ${type}`, e);
		}
	}
}
/** Trigger handlers for a given instrumentation type. */
function triggerHandlers(type, data) {
	const typeHandlers = handlers[type];
	if (!typeHandlers) {
		return;
	}
	for (const handler of typeHandlers) {
		try {
			handler(data);
		} catch (e) {
			DEBUG_BUILD$2 && debug.c(`Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`, e);
		}
	}
}
let _oldOnErrorHandler = null;
/**
* Add an instrumentation handler for when an error is captured by the global error handler.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addGlobalErrorInstrumentationHandler(handler) {
	addHandler("error", handler);
	maybeInstrument("error", instrumentError);
}
function instrumentError() {
	_oldOnErrorHandler = GLOBAL_OBJ.onerror;
	// Note: The reason we are doing window.onerror instead of window.addEventListener('error')
	// is that we are using this handler in the Loader Script, to handle buffered errors consistently
	GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
		const handlerData = {
			column,
			error,
			line,
			msg,
			url
		};
		triggerHandlers("error", handlerData);
		if (_oldOnErrorHandler) {
			// eslint-disable-next-line prefer-rest-params
			return _oldOnErrorHandler.apply(this, arguments);
		}
		return false;
	};
	GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
}
let _oldOnUnhandledRejectionHandler = null;
/**
* Add an instrumentation handler for when an unhandled promise rejection is captured.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addGlobalUnhandledRejectionInstrumentationHandler(handler) {
	addHandler("unhandledrejection", handler);
	maybeInstrument("unhandledrejection", instrumentUnhandledRejection);
}
function instrumentUnhandledRejection() {
	_oldOnUnhandledRejectionHandler = GLOBAL_OBJ.onunhandledrejection;
	// Note: The reason we are doing window.onunhandledrejection instead of window.addEventListener('unhandledrejection')
	// is that we are using this handler in the Loader Script, to handle buffered rejections consistently
	GLOBAL_OBJ.onunhandledrejection = function(e) {
		const handlerData = e;
		triggerHandlers("unhandledrejection", handlerData);
		if (_oldOnUnhandledRejectionHandler) {
			// eslint-disable-next-line prefer-rest-params
			return _oldOnUnhandledRejectionHandler.apply(this, arguments);
		}
		return true;
	};
	GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
// eslint-disable-next-line @typescript-eslint/unbound-method
const objectToString = Object.prototype.toString;
/**
* Checks whether given value's type is one of a few Error or Error-like
* {@link isError}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isError(wat) {
	switch (objectToString.call(wat)) {
		case "[object Error]":
		case "[object Exception]":
		case "[object DOMException]":
		case "[object WebAssembly.Exception]": return true;
		default: return isInstanceOf(wat, Error);
	}
}
/**
* Checks whether given value is an instance of the given built-in class.
*
* @param wat The value to be checked
* @param className
* @returns A boolean representing the result.
*/
function isBuiltin(wat, className) {
	return objectToString.call(wat) === `[object ${className}]`;
}
/**
* Checks whether given value's type is ErrorEvent
* {@link isErrorEvent}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isErrorEvent$1(wat) {
	return isBuiltin(wat, "ErrorEvent");
}
/**
* Checks whether given value's type is DOMError
* {@link isDOMError}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isDOMError(wat) {
	return isBuiltin(wat, "DOMError");
}
/**
* Checks whether given value's type is DOMException
* {@link isDOMException}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isDOMException(wat) {
	return isBuiltin(wat, "DOMException");
}
/**
* Checks whether given value's type is a string
* {@link isString}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isString(wat) {
	return isBuiltin(wat, "String");
}
/**
* Checks whether given string is parameterized
* {@link isParameterizedString}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isParameterizedString(wat) {
	return typeof wat === "object" && wat !== null && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
}
/**
* Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
* {@link isPrimitive}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isPrimitive(wat) {
	return wat === null || isParameterizedString(wat) || typeof wat !== "object" && typeof wat !== "function";
}
/**
* Checks whether given value's type is an object literal, or a class instance.
* {@link isPlainObject}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isPlainObject(wat) {
	return isBuiltin(wat, "Object");
}
/**
* Checks whether given value's type is an Event instance
* {@link isEvent}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isEvent(wat) {
	return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
/**
* Checks whether given value's type is an Element instance
* {@link isElement}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isElement(wat) {
	return typeof Element !== "undefined" && isInstanceOf(wat, Element);
}
/**
* Checks whether given value's type is an regexp
* {@link isRegExp}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isRegExp(wat) {
	return isBuiltin(wat, "RegExp");
}
/**
* Checks whether given value has a then function.
* @param wat A value to be checked.
*/
function isThenable(wat) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return Boolean(wat?.then && typeof wat.then === "function");
}
/**
* Checks whether given value's type is a SyntheticEvent
* {@link isSyntheticEvent}.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isSyntheticEvent(wat) {
	return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
/**
* Checks whether given value's type is an instance of provided constructor.
* {@link isInstanceOf}.
*
* @param wat A value to be checked.
* @param base A constructor to be used in a check.
* @returns A boolean representing the result.
*/
// TODO: fix in v11, convert any to unknown
// export function isInstanceOf<T>(wat: unknown, base: { new (...args: any[]): T }): wat is T {
function isInstanceOf(wat, base) {
	try {
		return wat instanceof base;
	} catch {
		return false;
	}
}
/**
* Checks whether given value's type is a Vue ViewModel or a VNode.
*
* @param wat A value to be checked.
* @returns A boolean representing the result.
*/
function isVueViewModel(wat) {
	// Not using Object.prototype.toString because in Vue 3 it would read the instance's Symbol(Symbol.toStringTag) property.
	// We also need to check for __v_isVNode because Vue 3 component render instances have an internal __v_isVNode property.
	return !!(typeof wat === "object" && wat !== null && (wat.__isVue || wat._isVue || wat.__v_isVNode));
}
/**
* Checks whether the given parameter is a Standard Web API Request instance.
*
* Returns false if Request is not available in the current runtime.
*/
function isRequest(request) {
	return typeof Request !== "undefined" && isInstanceOf(request, Request);
}
const WINDOW$3 = GLOBAL_OBJ;
/**
* Given a child DOM element, returns a query-selector statement describing that
* and its ancestors
* e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
* @returns generated DOM path
*/
function htmlTreeAsString(elem, options = {}) {
	if (!elem) {
		return "<unknown>";
	}
	// try/catch both:
	// - accessing event.target (see getsentry/raven-js#838, #768)
	// - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
	// - can throw an exception in some circumstances.
	try {
		let currentElem = elem;
		const out = [];
		let height = 0;
		let len = 0;
		let nextStr;
		const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
		const maxStringLength = !Array.isArray(options) && options.maxStringLength || 80;
		while (currentElem && height++ < 5) {
			nextStr = _htmlElementAsString(currentElem, keyAttrs);
			// bail out if
			// - nextStr is the 'html' element
			// - the length of the string that would be created exceeds maxStringLength
			//   (ignore this limit if we are on the first iteration)
			if (nextStr === "html" || height > 1 && len + out.length * 3 + nextStr.length >= maxStringLength) {
				break;
			}
			out.push(nextStr);
			len += nextStr.length;
			currentElem = currentElem.parentNode;
		}
		return out.reverse().join(" > ");
	} catch {
		return "<unknown>";
	}
}
/**
* Returns a simple, query-selector representation of a DOM element
* e.g. [HTMLElement] => input#foo.btn[name=baz]
* @returns generated DOM path
*/
function _htmlElementAsString(el, keyAttrs) {
	const elem = el;
	const out = [];
	if (!elem?.tagName) {
		return "";
	}
	// @ts-expect-error WINDOW has HTMLElement
	if (WINDOW$3.HTMLElement) {
		// If using the component name annotation plugin, this value may be available on the DOM node
		if (elem instanceof HTMLElement && elem.dataset) {
			if (elem.dataset["sentryComponent"]) {
				return elem.dataset["sentryComponent"];
			}
			if (elem.dataset["sentryElement"]) {
				return elem.dataset["sentryElement"];
			}
		}
	}
	out.push(elem.tagName.toLowerCase());
	// Pairs of attribute keys defined in `serializeAttribute` and their values on element.
	const keyAttrPairs = keyAttrs?.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
	if (keyAttrPairs?.length) {
		keyAttrPairs.forEach((keyAttrPair) => {
			out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
		});
	} else {
		if (elem.id) {
			out.push(`#${elem.id}`);
		}
		const className = elem.className;
		if (className && isString(className)) {
			const classes = className.split(/\s+/);
			for (const c of classes) {
				out.push(`.${c}`);
			}
		}
	}
	const allowedAttrs = [
		"aria-label",
		"type",
		"name",
		"title",
		"alt"
	];
	for (const k of allowedAttrs) {
		const attr = elem.getAttribute(k);
		if (attr) {
			out.push(`[${k}="${attr}"]`);
		}
	}
	return out.join("");
}
/**
* A safe form of location.href
*/
function getLocationHref() {
	try {
		return WINDOW$3.document.location.href;
	} catch {
		return "";
	}
}
/**
* Given a DOM element, traverses up the tree until it finds the first ancestor node
* that has the `data-sentry-component` or `data-sentry-element` attribute with `data-sentry-component` taking
* precedence. This attribute is added at build-time by projects that have the component name annotation plugin installed.
*
* @returns a string representation of the component for the provided DOM element, or `null` if not found
*/
function getComponentName(elem) {
	// @ts-expect-error WINDOW has HTMLElement
	if (!WINDOW$3.HTMLElement) {
		return null;
	}
	let currentElem = elem;
	for (let i = 0; i < 5; i++) {
		if (!currentElem) {
			return null;
		}
		if (currentElem instanceof HTMLElement) {
			if (currentElem.dataset["sentryComponent"]) {
				return currentElem.dataset["sentryComponent"];
			}
			if (currentElem.dataset["sentryElement"]) {
				return currentElem.dataset["sentryElement"];
			}
		}
		currentElem = currentElem.parentNode;
	}
	return null;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
* Replace a method in an object with a wrapped version of itself.
*
* If the method on the passed object is not a function, the wrapper will not be applied.
*
* @param source An object that contains a method to be wrapped.
* @param name The name of the method to be wrapped.
* @param replacementFactory A higher-order function that takes the original version of the given method and returns a
* wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
* preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
* args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
* @returns void
*/
function fill(source, name, replacementFactory) {
	if (!(name in source)) {
		return;
	}
	// explicitly casting to unknown because we don't know the type of the method initially at all
	const original = source[name];
	if (typeof original !== "function") {
		return;
	}
	const wrapped = replacementFactory(original);
	// Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
	// otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
	if (typeof wrapped === "function") {
		markFunctionWrapped(wrapped, original);
	}
	try {
		source[name] = wrapped;
	} catch {
		DEBUG_BUILD$2 && debug.a(`Failed to replace method "${name}" in object`, source);
	}
}
/**
* Defines a non-enumerable property on the given object.
*
* @param obj The object on which to set the property
* @param name The name of the property to be set
* @param value The value to which to set the property
*/
function addNonEnumerableProperty(obj, name, value) {
	try {
		Object.defineProperty(obj, name, {
			value,
			writable: true,
			configurable: true
		});
	} catch {
		DEBUG_BUILD$2 && debug.a(`Failed to add non-enumerable property "${name}" to object`, obj);
	}
}
/**
* Remembers the original function on the wrapped function and
* patches up the prototype.
*
* @param wrapped the wrapper function
* @param original the original function that gets wrapped
*/
function markFunctionWrapped(wrapped, original) {
	try {
		const proto = original.prototype || {};
		wrapped.prototype = original.prototype = proto;
		addNonEnumerableProperty(wrapped, "__sentry_original__", original);
	} catch {}
}
/**
* This extracts the original function if available.  See
* `markFunctionWrapped` for more information.
*
* @param func the function to unwrap
* @returns the unwrapped version of the function if available.
*/
// eslint-disable-next-line @typescript-eslint/ban-types
function getOriginalFunction(func) {
	return func.__sentry_original__;
}
/**
* Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
* non-enumerable properties attached.
*
* @param value Initial source that we have to transform in order for it to be usable by the serializer
* @returns An Event or Error turned into an object - or the value argument itself, when value is neither an Event nor
*  an Error.
*/
function convertToPlainObject(value) {
	if (isError(value)) {
		return {
			message: value.message,
			name: value.name,
			stack: value.stack,
			...getOwnProperties(value)
		};
	} else if (isEvent(value)) {
		const newObj = {
			type: value.type,
			target: serializeEventTarget(value.target),
			currentTarget: serializeEventTarget(value.currentTarget),
			...getOwnProperties(value)
		};
		if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
			newObj.detail = value.detail;
		}
		return newObj;
	} else {
		return value;
	}
}
/** Creates a string representation of the target of an `Event` object */
function serializeEventTarget(target) {
	try {
		return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
	} catch {
		return "<unknown>";
	}
}
/** Filters out all but an object's own properties */
function getOwnProperties(obj) {
	if (typeof obj === "object" && obj !== null) {
		const extractedProps = {};
		for (const property in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, property)) {
				extractedProps[property] = obj[property];
			}
		}
		return extractedProps;
	} else {
		return {};
	}
}
/**
* Given any captured exception, extract its keys and create a sorted
* and truncated list that will be used inside the event message.
* eg. `Non-error exception captured with keys: foo, bar, baz`
*/
function extractExceptionKeysForMessage(exception) {
	const keys = Object.keys(convertToPlainObject(exception));
	keys.sort();
	return !keys[0] ? "[object has no keys]" : keys.join(", ");
}
// undefined = not yet resolved, null = no runner found, function = runner found
let RESOLVED_RUNNER;
/**
* Simple wrapper that allows SDKs to *secretly* set context wrapper to generate safe random IDs in cache components contexts
*/
function withRandomSafeContext(cb) {
	// Skips future symbol lookups if we've already resolved (or attempted to resolve) the runner once
	if (RESOLVED_RUNNER !== void 0) {
		return RESOLVED_RUNNER ? RESOLVED_RUNNER(cb) : cb();
	}
	const sym = Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__");
	const globalWithSymbol = GLOBAL_OBJ;
	if (sym in globalWithSymbol && typeof globalWithSymbol[sym] === "function") {
		RESOLVED_RUNNER = globalWithSymbol[sym];
		return RESOLVED_RUNNER(cb);
	}
	RESOLVED_RUNNER = null;
	return cb();
}
/**
* Identical to Math.random() but wrapped in withRandomSafeContext
* to ensure safe random number generation in certain contexts (e.g., Next.js Cache Components).
*/
function safeMathRandom() {
	return withRandomSafeContext(() => Math.random());
}
/**
* Identical to Date.now() but wrapped in withRandomSafeContext
* to ensure safe time value generation in certain contexts (e.g., Next.js Cache Components).
*/
function safeDateNow() {
	return withRandomSafeContext(() => Date.now());
}
/**
* Truncates given string to the maximum characters count
*
* @param str An object that contains serializable values
* @param max Maximum number of characters in truncated string (0 = unlimited)
* @returns string Encoded
*/
function truncate(str, max = 0) {
	if (typeof str !== "string" || max === 0) {
		return str;
	}
	return str.length <= max ? str : `${str.slice(0, max)}...`;
}
/**
* Join values in array
* @param input array of values to be joined together
* @param delimiter string to be placed in-between values
* @returns Joined values
*/
function safeJoin(input) {
	if (!Array.isArray(input)) {
		return "";
	}
	const output = [];
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < input.length; i++) {
		const value = input[i];
		try {
			// This is a hack to fix a Vue3-specific bug that causes an infinite loop of
			// console warnings. This happens when a Vue template is rendered with
			// an undeclared variable, which we try to stringify, ultimately causing
			// Vue to issue another warning which repeats indefinitely.
			// see: https://github.com/getsentry/sentry-javascript/pull/8981
			if (isVueViewModel(value)) {
				output.push(getVueInternalName(value));
			} else {
				output.push(String(value));
			}
		} catch {
			output.push("[value cannot be serialized]");
		}
	}
	return output.join(" ");
}
/**
* Checks if the given value matches a regex or string
*
* @param value The string to test
* @param pattern Either a regex or a string against which `value` will be matched
* @param requireExactStringMatch If true, `value` must match `pattern` exactly. If false, `value` will match
* `pattern` if it contains `pattern`. Only applies to string-type patterns.
*/
function isMatchingPattern(value, pattern) {
	if (!isString(value)) {
		return false;
	}
	if (isRegExp(pattern)) {
		return pattern.test(value);
	}
	if (isString(pattern)) {
		return value.includes(pattern);
	}
	return false;
}
/**
* Test the given string against an array of strings and regexes. By default, string matching is done on a
* substring-inclusion basis rather than a strict equality basis
*
* @param testString The string to test
* @param patterns The patterns against which to test the string
* @param requireExactStringMatch If true, `testString` must match one of the given string patterns exactly in order to
* count. If false, `testString` will match a string pattern if it contains that pattern.
* @returns
*/
function stringMatchesSomePattern(testString, patterns = []) {
	return patterns.some((pattern) => isMatchingPattern(testString, pattern));
}
function getCrypto() {
	const gbl = GLOBAL_OBJ;
	return gbl.crypto || gbl.msCrypto;
}
let emptyUuid;
function getRandomByte() {
	return safeMathRandom() * 16;
}
/**
* UUID4 generator
* @param crypto Object that provides the crypto API.
* @returns string Generated UUID4.
*/
function uuid4(crypto = getCrypto()) {
	try {
		if (crypto?.randomUUID) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return withRandomSafeContext(() => crypto.randomUUID()).replace(/-/g, "");
		}
	} catch {}
	if (!emptyUuid) {
		// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
		// Concatenating the following numbers as strings results in '10000000100040008000100000000000'
		emptyUuid = [1e7] + 1e3 + 4e3 + 8e3 + 1e11;
	}
	return emptyUuid.replace(/[018]/g, (c) => (c ^ (getRandomByte() & 15) >> c / 4).toString(16));
}
function getFirstException(event) {
	return event.exception?.values?.[0];
}
/**
* Extracts either message or type+value from an event that can be used for user-facing logs
* @returns event's description
*/
function getEventDescription(event) {
	const { message, event_id: eventId } = event;
	if (message) {
		return message;
	}
	const firstException = getFirstException(event);
	if (firstException) {
		if (firstException.type && firstException.value) {
			return `${firstException.type}: ${firstException.value}`;
		}
		return firstException.type || firstException.value || eventId || "<unknown>";
	}
	return eventId || "<unknown>";
}
/**
* Adds exception values, type and value to an synthetic Exception.
* @param event The event to modify.
* @param value Value of the exception.
* @param type Type of the exception.
* @hidden
*/
function addExceptionTypeValue(event, value) {
	const exception = event.exception = event.exception || {};
	const values = exception.values = exception.values || [];
	const firstException = values[0] = values[0] || {};
	if (!firstException.value) {
		firstException.value = value || "";
	}
	if (!firstException.type) {
		firstException.type = "Error";
	}
}
/**
* Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
*
* @param event The event to modify.
* @param newMechanism Mechanism data to add to the event.
* @hidden
*/
function addExceptionMechanism(event, newMechanism) {
	const firstException = getFirstException(event);
	if (!firstException) {
		return;
	}
	const defaultMechanism = {
		type: "generic",
		handled: true
	};
	const currentMechanism = firstException.mechanism;
	firstException.mechanism = {
		...defaultMechanism,
		...currentMechanism,
		...newMechanism
	};
	if (newMechanism && "data" in newMechanism) {
		const mergedData = {
			...currentMechanism?.data,
			...newMechanism.data
		};
		firstException.mechanism.data = mergedData;
	}
}
/**
* Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
* in question), and marks it captured if not.
*
* This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
* record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
* that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
* the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
* caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
* function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
* see it.
*
* Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
* them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
* object wrapper forms so that this check will always work. However, because we need to flag the exact object which
* will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
* must be done before the exception captured.
*
* @param A thrown exception to check or flag as having been seen
* @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
*/
function checkOrSetAlreadyCaught(exception) {
	if (isAlreadyCaptured(exception)) {
		return true;
	}
	try {
		// set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
		// `ExtraErrorData` integration
		addNonEnumerableProperty(exception, "__sentry_captured__", true);
	} catch {}
	return false;
}
function isAlreadyCaptured(exception) {
	try {
		return exception.__sentry_captured__;
	} catch {}
}
/**
* A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
* for accessing a high-resolution monotonic clock.
*/
/**
* Returns a timestamp in seconds since the UNIX epoch using the Date API.
*/
function dateTimestampInSeconds() {
	return safeDateNow() / 1e3;
}
/**
* Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
* support the API.
*
* Wrapping the native API works around differences in behavior from different browsers.
*/
function createUnixTimestampInSecondsFunc() {
	const { performance } = GLOBAL_OBJ;
	// Some browser and environments don't have a performance or timeOrigin, so we fallback to
	// using Date.now() to compute the starting time.
	if (!performance?.now || !performance.timeOrigin) {
		return dateTimestampInSeconds;
	}
	const timeOrigin = performance.timeOrigin;
	// performance.now() is a monotonic clock, which means it starts at 0 when the process begins. To get the current
	// wall clock time (actual UNIX timestamp), we need to add the starting time origin and the current time elapsed.
	//
	// TODO: This does not account for the case where the monotonic clock that powers performance.now() drifts from the
	// wall clock time, which causes the returned timestamp to be inaccurate. We should investigate how to detect and
	// correct for this.
	// See: https://github.com/getsentry/sentry-javascript/issues/2590
	// See: https://github.com/mdn/content/issues/4713
	// See: https://dev.to/noamr/when-a-millisecond-is-not-a-millisecond-3h6
	return () => {
		return (timeOrigin + withRandomSafeContext(() => performance.now())) / 1e3;
	};
}
let _cachedTimestampInSeconds;
/**
* Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
* availability of the Performance API.
*
* BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
* asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
* skew can grow to arbitrary amounts like days, weeks or months.
* See https://github.com/getsentry/sentry-javascript/issues/2590.
*/
function timestampInSeconds() {
	// We store this in a closure so that we don't have to create a new function every time this is called.
	const func = _cachedTimestampInSeconds ?? (_cachedTimestampInSeconds = createUnixTimestampInSecondsFunc());
	return func();
}
/**
* Creates a new `Session` object by setting certain default parameters. If optional @param context
* is passed, the passed properties are applied to the session object.
*
* @param context (optional) additional properties to be applied to the returned session object
*
* @returns a new `Session` object
*/
function makeSession(context) {
	// Both timestamp and started are in seconds since the UNIX epoch.
	const startingTime = timestampInSeconds();
	const session = {
		sid: uuid4(),
		init: true,
		started: startingTime,
		duration: 0,
		status: "ok",
		errors: 0,
		ignoreDuration: false,
		toJSON: () => sessionToJSON(session)
	};
	{
		{
			updateSession(session, context);
		}
	}
	return session;
}
/**
* Updates a session object with the properties passed in the context.
*
* Note that this function mutates the passed object and returns void.
* (Had to do this instead of returning a new and updated session because closing and sending a session
* makes an update to the session after it was passed to the sending logic.
* @see Client.captureSession )
*
* @param session the `Session` to update
* @param context the `SessionContext` holding the properties that should be updated in @param session
*/
// eslint-disable-next-line complexity
function updateSession(session, context) {
	if (context.user) {
		if (!session.ipAddress && context.user.ip_address) {
			session.ipAddress = context.user.ip_address;
		}
		if (!session.did && !context.did) {
			session.did = context.user.id || context.user.email || context.user.username;
		}
	}
	session.timestamp = context.timestamp || timestampInSeconds();
	if (context.abnormal_mechanism) {
		session.abnormal_mechanism = context.abnormal_mechanism;
	}
	if (context.ignoreDuration) {
		session.ignoreDuration = context.ignoreDuration;
	}
	if (context.sid) {
		// Good enough uuid validation. — Kamil
		session.sid = context.sid.length === 32 ? context.sid : uuid4();
	}
	if (context.init !== void 0) {
		session.init = context.init;
	}
	if (!session.did && context.did) {
		session.did = `${context.did}`;
	}
	if (typeof context.started === "number") {
		session.started = context.started;
	}
	if (session.ignoreDuration) {
		session.duration = void 0;
	} else if (typeof context.duration === "number") {
		session.duration = context.duration;
	} else {
		const duration = session.timestamp - session.started;
		session.duration = duration >= 0 ? duration : 0;
	}
	if (context.release) {
		session.release = context.release;
	}
	if (context.environment) {
		session.environment = context.environment;
	}
	if (!session.ipAddress && context.ipAddress) {
		session.ipAddress = context.ipAddress;
	}
	if (!session.userAgent && context.userAgent) {
		session.userAgent = context.userAgent;
	}
	if (typeof context.errors === "number") {
		session.errors = context.errors;
	}
	if (context.status) {
		session.status = context.status;
	}
}
/**
* Closes a session by setting its status and updating the session object with it.
* Internally calls `updateSession` to update the passed session object.
*
* Note that this function mutates the passed session (@see updateSession for explanation).
*
* @param session the `Session` object to be closed
* @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
*               this function will keep the previously set status, unless it was `'ok'` in which case
*               it is changed to `'exited'`.
*/
function closeSession(session) {
	let context = {};
	if (session.status === "ok") {
		context = { status: "exited" };
	}
	updateSession(session, context);
}
/**
* Serializes a passed session object to a JSON object with a slightly different structure.
* This is necessary because the Sentry backend requires a slightly different schema of a session
* than the one the JS SDKs use internally.
*
* @param session the session to be converted
*
* @returns a JSON object of the passed session
*/
function sessionToJSON(session) {
	return {
		sid: `${session.sid}`,
		init: session.init,
		started: new Date(session.started * 1e3).toISOString(),
		timestamp: new Date(session.timestamp * 1e3).toISOString(),
		status: session.status,
		errors: session.errors,
		did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : void 0,
		duration: session.duration,
		abnormal_mechanism: session.abnormal_mechanism,
		attrs: {
			release: session.release,
			environment: session.environment,
			ip_address: session.ipAddress,
			user_agent: session.userAgent
		}
	};
}
/**
* Shallow merge two objects.
* Does not mutate the passed in objects.
* Undefined/empty values in the merge object will overwrite existing values.
*
* By default, this merges 2 levels deep.
*/
function merge(initialObj, mergeObj, levels = 2) {
	// If the merge value is not an object, or we have no merge levels left,
	// we just set the value to the merge value
	if (!mergeObj || typeof mergeObj !== "object" || levels <= 0) {
		return mergeObj;
	}
	// If the merge object is an empty object, and the initial object is not undefined, we return the initial object
	if (initialObj && Object.keys(mergeObj).length === 0) {
		return initialObj;
	}
	// Clone object
	const output = { ...initialObj };
	// Merge values into output, resursively
	for (const key in mergeObj) {
		if (Object.prototype.hasOwnProperty.call(mergeObj, key)) {
			output[key] = merge(output[key], mergeObj[key], levels - 1);
		}
	}
	return output;
}
/**
* Generate a random, valid trace ID.
*/
function generateTraceId() {
	return uuid4();
}
/**
* Generate a random, valid span ID.
*/
function generateSpanId() {
	return uuid4().substring(16);
}
/**
* Set the active span for a given scope.
* NOTE: This should NOT be used directly, but is only used internally by the trace methods.
*/
function _setSpanForScope(scope, span) {
	if (span) {
		addNonEnumerableProperty(scope, "_sentrySpan", span);
	} else {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete scope["_sentrySpan"];
	}
}
/**
* Get the active span for a given scope.
* NOTE: This should NOT be used directly, but is only used internally by the trace methods.
*/
function _getSpanForScope(scope) {
	return scope["_sentrySpan"];
}
/**
* A context to be used for capturing an event.
* This can either be a Scope, or a partial ScopeContext,
* or a callback that receives the current scope and returns a new scope to use.
*/
/**
* Holds additional event information.
*/
class Scope {
	/** Flag if notifying is happening. */
	/** Callback for client to receive scope changes. */
	/** Callback list that will be called during event processing. */
	/** Array of breadcrumbs. */
	/** User */
	/** Tags */
	/** Attributes */
	/** Extra */
	/** Contexts */
	/** Attachments */
	/** Propagation Context for distributed tracing */
	/**
	* A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
	* sent to Sentry
	*/
	/** Fingerprint */
	/** Severity */
	/**
	* Transaction Name
	*
	* IMPORTANT: The transaction name on the scope has nothing to do with root spans/transaction objects.
	* It's purpose is to assign a transaction to the scope that's added to non-transaction events.
	*/
	/** Session */
	/** The client on this scope */
	/** Contains the last event id of a captured event.  */
	/** Conversation ID */
	// NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
	constructor() {
		this._notifyingListeners = false;
		this._scopeListeners = [];
		this._eventProcessors = [];
		this._breadcrumbs = [];
		this._attachments = [];
		this._user = {};
		this._tags = {};
		this._attributes = {};
		this._extra = {};
		this._contexts = {};
		this._sdkProcessingMetadata = {};
		this._propagationContext = {
			traceId: generateTraceId(),
			sampleRand: safeMathRandom()
		};
	}
	/**
	* Clone all data from this scope into a new scope.
	*/
	clone() {
		const newScope = new Scope();
		newScope._breadcrumbs = [...this._breadcrumbs];
		newScope._tags = { ...this._tags };
		newScope._attributes = { ...this._attributes };
		newScope._extra = { ...this._extra };
		newScope._contexts = { ...this._contexts };
		if (this._contexts.flags) {
			// We need to copy the `values` array so insertions on a cloned scope
			// won't affect the original array.
			newScope._contexts.flags = { values: [...this._contexts.flags.values] };
		}
		newScope._user = this._user;
		newScope._level = this._level;
		newScope._session = this._session;
		newScope._transactionName = this._transactionName;
		newScope._fingerprint = this._fingerprint;
		newScope._eventProcessors = [...this._eventProcessors];
		newScope._attachments = [...this._attachments];
		newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
		newScope._propagationContext = { ...this._propagationContext };
		newScope._client = this._client;
		newScope._lastEventId = this._lastEventId;
		newScope._conversationId = this._conversationId;
		_setSpanForScope(newScope, _getSpanForScope(this));
		return newScope;
	}
	/**
	* Update the client assigned to this scope.
	* Note that not every scope will have a client assigned - isolation scopes & the global scope will generally not have a client,
	* as well as manually created scopes.
	*/
	setClient(client) {
		this._client = client;
	}
	/**
	* Set the ID of the last captured error event.
	* This is generally only captured on the isolation scope.
	*/
	setLastEventId(lastEventId) {
		this._lastEventId = lastEventId;
	}
	/**
	* Get the client assigned to this scope.
	*/
	getClient() {
		return this._client;
	}
	/**
	* Get the ID of the last captured error event.
	* This is generally only available on the isolation scope.
	*/
	lastEventId() {
		return this._lastEventId;
	}
	/**
	* @inheritDoc
	*/
	addScopeListener(callback) {
		this._scopeListeners.push(callback);
	}
	/**
	* Add an event processor that will be called before an event is sent.
	*/
	addEventProcessor(callback) {
		this._eventProcessors.push(callback);
		return this;
	}
	/**
	* Set the user for this scope.
	* Set to `null` to unset the user.
	*/
	setUser(user) {
		// If null is passed we want to unset everything, but still define keys,
		// so that later down in the pipeline any existing values are cleared.
		this._user = user || {
			email: void 0,
			id: void 0,
			ip_address: void 0,
			username: void 0
		};
		if (this._session) {
			updateSession(this._session, { user });
		}
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Get the user from this scope.
	*/
	getUser() {
		return this._user;
	}
	/**
	* Set the conversation ID for this scope.
	* Set to `null` to unset the conversation ID.
	*/
	setConversationId(conversationId) {
		this._conversationId = conversationId || void 0;
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Set an object that will be merged into existing tags on the scope,
	* and will be sent as tags data with the event.
	*/
	setTags(tags) {
		this._tags = {
			...this._tags,
			...tags
		};
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Set a single tag that will be sent as tags data with the event.
	*/
	setTag(key, value) {
		return this.setTags({ [key]: value });
	}
	/**
	* Sets attributes onto the scope.
	*
	* These attributes are currently applied to logs and metrics.
	* In the future, they will also be applied to spans.
	*
	* Important: For now, only strings, numbers and boolean attributes are supported, despite types allowing for
	* more complex attribute types. We'll add this support in the future but already specify the wider type to
	* avoid a breaking change in the future.
	*
	* @param newAttributes - The attributes to set on the scope. You can either pass in key-value pairs, or
	* an object with a `value` and an optional `unit` (if applicable to your attribute).
	*
	* @example
	* ```typescript
	* scope.setAttributes({
	*   is_admin: true,
	*   payment_selection: 'credit_card',
	*   render_duration: { value: 'render_duration', unit: 'ms' },
	* });
	* ```
	*/
	setAttributes(newAttributes) {
		this._attributes = {
			...this._attributes,
			...newAttributes
		};
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Sets an attribute onto the scope.
	*
	* These attributes are currently applied to logs and metrics.
	* In the future, they will also be applied to spans.
	*
	* Important: For now, only strings, numbers and boolean attributes are supported, despite types allowing for
	* more complex attribute types. We'll add this support in the future but already specify the wider type to
	* avoid a breaking change in the future.
	*
	* @param key - The attribute key.
	* @param value - the attribute value. You can either pass in a raw value, or an attribute
	* object with a `value` and an optional `unit` (if applicable to your attribute).
	*
	* @example
	* ```typescript
	* scope.setAttribute('is_admin', true);
	* scope.setAttribute('render_duration', { value: 'render_duration', unit: 'ms' });
	* ```
	*/
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setAttribute(key, value) {
		return this.setAttributes({ [key]: value });
	}
	/**
	* Removes the attribute with the given key from the scope.
	*
	* @param key - The attribute key.
	*
	* @example
	* ```typescript
	* scope.removeAttribute('is_admin');
	* ```
	*/
	removeAttribute(key) {
		if (key in this._attributes) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete this._attributes[key];
			this._notifyScopeListeners();
		}
		return this;
	}
	/**
	* Set an object that will be merged into existing extra on the scope,
	* and will be sent as extra data with the event.
	*/
	setExtras(extras) {
		this._extra = {
			...this._extra,
			...extras
		};
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Set a single key:value extra entry that will be sent as extra data with the event.
	*/
	setExtra(key, extra) {
		this._extra = {
			...this._extra,
			[key]: extra
		};
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Sets the fingerprint on the scope to send with the events.
	* @param {string[]} fingerprint Fingerprint to group events in Sentry.
	*/
	setFingerprint(fingerprint) {
		this._fingerprint = fingerprint;
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Sets the level on the scope for future events.
	*/
	setLevel(level) {
		this._level = level;
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Sets the transaction name on the scope so that the name of e.g. taken server route or
	* the page location is attached to future events.
	*
	* IMPORTANT: Calling this function does NOT change the name of the currently active
	* root span. If you want to change the name of the active root span, use
	* `Sentry.updateSpanName(rootSpan, 'new name')` instead.
	*
	* By default, the SDK updates the scope's transaction name automatically on sensible
	* occasions, such as a page navigation or when handling a new request on the server.
	*/
	setTransactionName(name) {
		this._transactionName = name;
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Sets context data with the given name.
	* Data passed as context will be normalized. You can also pass `null` to unset the context.
	* Note that context data will not be merged - calling `setContext` will overwrite an existing context with the same key.
	*/
	setContext(key, context) {
		if (context === null) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete this._contexts[key];
		} else {
			this._contexts[key] = context;
		}
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Set the session for the scope.
	*/
	setSession(session) {
		if (!session) {
			delete this._session;
		} else {
			this._session = session;
		}
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Get the session from the scope.
	*/
	getSession() {
		return this._session;
	}
	/**
	* Updates the scope with provided data. Can work in three variations:
	* - plain object containing updatable attributes
	* - Scope instance that'll extract the attributes from
	* - callback function that'll receive the current scope as an argument and allow for modifications
	*/
	update(captureContext) {
		if (!captureContext) {
			return this;
		}
		const scopeToMerge = typeof captureContext === "function" ? captureContext(this) : captureContext;
		const scopeInstance = scopeToMerge instanceof Scope ? scopeToMerge.getScopeData() : isPlainObject(scopeToMerge) ? captureContext : void 0;
		const { tags, attributes, extra, user, contexts, level, fingerprint = [], propagationContext, conversationId } = scopeInstance || {};
		this._tags = {
			...this._tags,
			...tags
		};
		this._attributes = {
			...this._attributes,
			...attributes
		};
		this._extra = {
			...this._extra,
			...extra
		};
		this._contexts = {
			...this._contexts,
			...contexts
		};
		if (user && Object.keys(user).length) {
			this._user = user;
		}
		if (level) {
			this._level = level;
		}
		if (fingerprint.length) {
			this._fingerprint = fingerprint;
		}
		if (propagationContext) {
			this._propagationContext = propagationContext;
		}
		if (conversationId) {
			this._conversationId = conversationId;
		}
		return this;
	}
	/**
	* Clears the current scope and resets its properties.
	* Note: The client will not be cleared.
	*/
	clear() {
		// client is not cleared here on purpose!
		this._breadcrumbs = [];
		this._tags = {};
		this._attributes = {};
		this._extra = {};
		this._user = {};
		this._contexts = {};
		this._level = void 0;
		this._transactionName = void 0;
		this._fingerprint = void 0;
		this._session = void 0;
		this._conversationId = void 0;
		_setSpanForScope(this, void 0);
		this._attachments = [];
		this.setPropagationContext({
			traceId: generateTraceId(),
			sampleRand: safeMathRandom()
		});
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Adds a breadcrumb to the scope.
	* By default, the last 100 breadcrumbs are kept.
	*/
	addBreadcrumb(breadcrumb, maxBreadcrumbs) {
		const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : 100;
		// No data has been changed, so don't notify scope listeners
		if (maxCrumbs <= 0) {
			return this;
		}
		const mergedBreadcrumb = {
			timestamp: dateTimestampInSeconds(),
			...breadcrumb,
			message: breadcrumb.message ? truncate(breadcrumb.message, 2048) : breadcrumb.message
		};
		this._breadcrumbs.push(mergedBreadcrumb);
		if (this._breadcrumbs.length > maxCrumbs) {
			this._breadcrumbs = this._breadcrumbs.slice(-maxCrumbs);
			this._client?.recordDroppedEvent("buffer_overflow", "log_item");
		}
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Get the last breadcrumb of the scope.
	*/
	getLastBreadcrumb() {
		return this._breadcrumbs[this._breadcrumbs.length - 1];
	}
	/**
	* Clear all breadcrumbs from the scope.
	*/
	clearBreadcrumbs() {
		this._breadcrumbs = [];
		this._notifyScopeListeners();
		return this;
	}
	/**
	* Add an attachment to the scope.
	*/
	addAttachment(attachment) {
		this._attachments.push(attachment);
		return this;
	}
	/**
	* Clear all attachments from the scope.
	*/
	clearAttachments() {
		this._attachments = [];
		return this;
	}
	/**
	* Get the data of this scope, which should be applied to an event during processing.
	*/
	getScopeData() {
		return {
			breadcrumbs: this._breadcrumbs,
			attachments: this._attachments,
			contexts: this._contexts,
			tags: this._tags,
			attributes: this._attributes,
			extra: this._extra,
			user: this._user,
			level: this._level,
			fingerprint: this._fingerprint || [],
			eventProcessors: this._eventProcessors,
			propagationContext: this._propagationContext,
			sdkProcessingMetadata: this._sdkProcessingMetadata,
			transactionName: this._transactionName,
			span: _getSpanForScope(this),
			conversationId: this._conversationId
		};
	}
	/**
	* Add data which will be accessible during event processing but won't get sent to Sentry.
	*/
	setSDKProcessingMetadata(newData) {
		this._sdkProcessingMetadata = merge(this._sdkProcessingMetadata, newData, 2);
		return this;
	}
	/**
	* Add propagation context to the scope, used for distributed tracing
	*/
	setPropagationContext(context) {
		this._propagationContext = context;
		return this;
	}
	/**
	* Get propagation context from the scope, used for distributed tracing
	*/
	getPropagationContext() {
		return this._propagationContext;
	}
	/**
	* Capture an exception for this scope.
	*
	* @returns {string} The id of the captured Sentry event.
	*/
	captureException(exception, hint) {
		const eventId = hint?.event_id || uuid4();
		if (!this._client) {
			DEBUG_BUILD$2 && debug.b("No client configured on scope - will not capture exception!");
			return eventId;
		}
		const syntheticException = new Error("Sentry syntheticException");
		this._client.captureException(exception, {
			originalException: exception,
			syntheticException,
			...hint,
			event_id: eventId
		}, this);
		return eventId;
	}
	/**
	* Capture a message for this scope.
	*
	* @returns {string} The id of the captured message.
	*/
	captureMessage(message, level, hint) {
		const eventId = hint?.event_id || uuid4();
		if (!this._client) {
			DEBUG_BUILD$2 && debug.b("No client configured on scope - will not capture message!");
			return eventId;
		}
		const syntheticException = hint?.syntheticException ?? new Error(message);
		this._client.captureMessage(message, level, {
			originalException: message,
			syntheticException,
			...hint,
			event_id: eventId
		}, this);
		return eventId;
	}
	/**
	* Capture a Sentry event for this scope.
	*
	* @returns {string} The id of the captured event.
	*/
	captureEvent(event, hint) {
		const eventId = hint?.event_id || uuid4();
		if (!this._client) {
			DEBUG_BUILD$2 && debug.b("No client configured on scope - will not capture event!");
			return eventId;
		}
		this._client.captureEvent(event, {
			...hint,
			event_id: eventId
		}, this);
		return eventId;
	}
	/**
	* This will be called on every set call.
	*/
	_notifyScopeListeners() {
		// We need this check for this._notifyingListeners to be able to work on scope during updates
		// If this check is not here we'll produce endless recursion when something is done with the scope
		// during the callback.
		if (!this._notifyingListeners) {
			this._notifyingListeners = true;
			this._scopeListeners.forEach((callback) => {
				callback(this);
			});
			this._notifyingListeners = false;
		}
	}
}
/** Get the default current scope. */
function getDefaultCurrentScope() {
	return getGlobalSingleton("defaultCurrentScope", () => new Scope());
}
/** Get the default isolation scope. */
function getDefaultIsolationScope() {
	return getGlobalSingleton("defaultIsolationScope", () => new Scope());
}
/**
* This is an object that holds a stack of scopes.
*/
class AsyncContextStack {
	constructor(scope, isolationScope) {
		let assignedScope;
		if (!scope) {
			assignedScope = new Scope();
		} else {
			assignedScope = scope;
		}
		let assignedIsolationScope;
		if (!isolationScope) {
			assignedIsolationScope = new Scope();
		} else {
			assignedIsolationScope = isolationScope;
		}
		// scope stack for domains or the process
		this._stack = [{ scope: assignedScope }];
		this._isolationScope = assignedIsolationScope;
	}
	/**
	* Fork a scope for the stack.
	*/
	withScope(callback) {
		const scope = this._pushScope();
		let maybePromiseResult;
		try {
			maybePromiseResult = callback(scope);
		} catch (e) {
			this._popScope();
			throw e;
		}
		if (isThenable(maybePromiseResult)) {
			// @ts-expect-error - isThenable returns the wrong type
			return maybePromiseResult.then((res) => {
				this._popScope();
				return res;
			}, (e) => {
				this._popScope();
				throw e;
			});
		}
		this._popScope();
		return maybePromiseResult;
	}
	/**
	* Get the client of the stack.
	*/
	getClient() {
		return this.getStackTop().client;
	}
	/**
	* Returns the scope of the top stack.
	*/
	getScope() {
		return this.getStackTop().scope;
	}
	/**
	* Get the isolation scope for the stack.
	*/
	getIsolationScope() {
		return this._isolationScope;
	}
	/**
	* Returns the topmost scope layer in the order domain > local > process.
	*/
	getStackTop() {
		return this._stack[this._stack.length - 1];
	}
	/**
	* Push a scope to the stack.
	*/
	_pushScope() {
		// We want to clone the content of prev scope
		const scope = this.getScope().clone();
		this._stack.push({
			client: this.getClient(),
			scope
		});
		return scope;
	}
	/**
	* Pop a scope from the stack.
	*/
	_popScope() {
		if (this._stack.length <= 1) return false;
		return !!this._stack.pop();
	}
}
/**
* Get the global async context stack.
* This will be removed during the v8 cycle and is only here to make migration easier.
*/
function getAsyncContextStack() {
	const registry = getMainCarrier();
	const sentry = getSentryCarrier(registry);
	return sentry.stack = sentry.stack || new AsyncContextStack(getDefaultCurrentScope(), getDefaultIsolationScope());
}
function withScope$1(callback) {
	return getAsyncContextStack().withScope(callback);
}
function withSetScope(scope, callback) {
	const stack = getAsyncContextStack();
	return stack.withScope(() => {
		stack.getStackTop().scope = scope;
		return callback(scope);
	});
}
function withIsolationScope(callback) {
	return getAsyncContextStack().withScope(() => {
		return callback(getAsyncContextStack().getIsolationScope());
	});
}
/**
* Get the stack-based async context strategy.
*/
function getStackAsyncContextStrategy() {
	return {
		withIsolationScope,
		withScope: withScope$1,
		withSetScope,
		withSetIsolationScope: (__unused_86C4, callback) => {
			return withIsolationScope(callback);
		},
		getCurrentScope: () => getAsyncContextStack().getScope(),
		getIsolationScope: () => getAsyncContextStack().getIsolationScope()
	};
}
/**
* Get the current async context strategy.
* If none has been setup, the default will be used.
*/
function getAsyncContextStrategy(carrier) {
	const sentry = getSentryCarrier(carrier);
	if (sentry.acs) {
		return sentry.acs;
	}
	// Otherwise, use the default one (stack)
	return getStackAsyncContextStrategy();
}
/**
* Get the currently active scope.
*/
function getCurrentScope() {
	const carrier = getMainCarrier();
	const acs = getAsyncContextStrategy(carrier);
	return acs.getCurrentScope();
}
/**
* Get the currently active isolation scope.
* The isolation scope is active for the current execution context.
*/
function getIsolationScope() {
	const carrier = getMainCarrier();
	const acs = getAsyncContextStrategy(carrier);
	return acs.getIsolationScope();
}
/**
* Get the global scope.
* This scope is applied to _all_ events.
*/
function getGlobalScope() {
	return getGlobalSingleton("globalScope", () => new Scope());
}
/**
* Creates a new scope with and executes the given operation within.
* The scope is automatically removed once the operation
* finishes or throws.
*/
/**
* Either creates a new active scope, or sets the given scope as active scope in the given callback.
*/
function withScope(...rest) {
	const carrier = getMainCarrier();
	const acs = getAsyncContextStrategy(carrier);
	return acs.withScope(rest[0]);
}
/**
* Get the currently active client.
*/
function getClient() {
	return getCurrentScope().getClient();
}
/**
* Get a trace context for the given scope.
*/
function getTraceContextFromScope(scope) {
	const propagationContext = scope.getPropagationContext();
	const { traceId, parentSpanId, propagationSpanId } = propagationContext;
	const traceContext = {
		trace_id: traceId,
		span_id: propagationSpanId || generateSpanId()
	};
	if (parentSpanId) {
		traceContext.parent_span_id = parentSpanId;
	}
	return traceContext;
}
/** Try to unwrap a scope from a potential WeakRef wrapper. */
function unwrapScopeFromWeakRef(scopeRef) {
	if (!scopeRef) {
		return;
	}
	if (typeof scopeRef === "object" && "deref" in scopeRef && typeof scopeRef.deref === "function") {
		try {
			return scopeRef.deref();
		} catch {
			return;
		}
	}
	// Fallback to a direct scope
	return;
}
/**
* Grabs the scope and isolation scope off a span that were active when the span was started.
* If WeakRef was used and scopes have been garbage collected, returns undefined for those scopes.
*/
function getCapturedScopesOnSpan(span) {
	const spanWithScopes = span;
	return {
		a: spanWithScopes["_sentryScope"],
		b: unwrapScopeFromWeakRef(spanWithScopes["_sentryIsolationScope"])
	};
}
const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
/**
* Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
* from it.
*
* @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
* @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
*/
function baggageHeaderToDynamicSamplingContext(baggageHeader) {
	const baggageObject = parseBaggageHeader(baggageHeader);
	if (!baggageObject) {
		return void 0;
	}
	// Read all "sentry-" prefixed values out of the baggage object and put it onto a dynamic sampling context object.
	const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
		if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
			const nonPrefixedKey = key.slice(7);
			acc[nonPrefixedKey] = value;
		}
		return acc;
	}, {});
	// Only return a dynamic sampling context object if there are keys in it.
	// A keyless object means there were no sentry values on the header, which means that there is no DSC.
	if (Object.keys(dynamicSamplingContext).length > 0) {
		return dynamicSamplingContext;
	} else {
		return void 0;
	}
}
/**
* Take a baggage header and parse it into an object.
*/
function parseBaggageHeader(baggageHeader) {
	if (!baggageHeader || !isString(baggageHeader) && !Array.isArray(baggageHeader)) {
		return void 0;
	}
	if (Array.isArray(baggageHeader)) {
		// Combine all baggage headers into one object containing the baggage values so we can later read the Sentry-DSC-values from it
		return baggageHeader.reduce((acc, curr) => {
			const currBaggageObject = baggageHeaderToObject(curr);
			Object.entries(currBaggageObject).forEach(([key, value]) => {
				acc[key] = value;
			});
			return acc;
		}, {});
	}
	return baggageHeaderToObject(baggageHeader);
}
/**
* Will parse a baggage header, which is a simple key-value map, into a flat object.
*
* @param baggageHeader The baggage header to parse.
* @returns a flat object containing all the key-value pairs from `baggageHeader`.
*/
function baggageHeaderToObject(baggageHeader) {
	return baggageHeader.split(",").map((baggageEntry) => {
		const eqIdx = baggageEntry.indexOf("=");
		if (eqIdx === -1) {
			// Likely an invalid entry
			return [];
		}
		const key = baggageEntry.slice(0, eqIdx);
		const value = baggageEntry.slice(eqIdx + 1);
		return [key, value].map((keyOrValue) => {
			try {
				return decodeURIComponent(keyOrValue.trim());
			} catch {
				// We ignore errors here, e.g. if the value cannot be URL decoded.
				// This will then be skipped in the next step
				return;
			}
		});
	}).reduce((acc, [key, value]) => {
		if (key && value) {
			acc[key] = value;
		}
		return acc;
	}, {});
}
/** Regular expression used to extract org ID from a DSN host. */
const ORG_ID_REGEX = /^o(\d+)\./;
/** Regular expression used to parse a Dsn. */
const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
	return protocol === "http" || protocol === "https";
}
/**
* Renders the string representation of this Dsn.
*
* By default, this will render the public representation without the password
* component. To get the deprecated private representation, set `withPassword`
* to true.
*
* @param withPassword When set to true, the password will be included.
*/
function dsnToString(dsn) {
	const { host, path, port, projectId, protocol, publicKey } = dsn;
	return `${protocol}://${publicKey}${""}` + `@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
/**
* Parses a Dsn from a given string.
*
* @param str A Dsn as string
* @returns Dsn as DsnComponents or undefined if @param str is not a valid DSN string
*/
function dsnFromString() {
	const match = DSN_REGEX.exec("https://9523a043c1a34ad1b261c558b4d6a352@o383174.ingest.sentry.io/5273572");
	if (!match) {
		// This should be logged to the console
		consoleSandbox(() => {
			// eslint-disable-next-line no-console
			console.error(`Invalid Sentry Dsn: ${"https://9523a043c1a34ad1b261c558b4d6a352@o383174.ingest.sentry.io/5273572"}`);
		});
		return void 0;
	}
	const [protocol, publicKey, pass = "", host = "", port = "", lastPath = ""] = match.slice(1);
	let path = "";
	let projectId = lastPath;
	const split = projectId.split("/");
	if (split.length > 1) {
		path = split.slice(0, -1).join("/");
		projectId = split.pop();
	}
	if (projectId) {
		const projectMatch = projectId.match(/^\d+/);
		if (projectMatch) {
			projectId = projectMatch[0];
		}
	}
	return dsnFromComponents({
		a: host,
		b: pass,
		c: path,
		d: projectId,
		e: port,
		f: protocol,
		g: publicKey
	});
}
function dsnFromComponents(components) {
	return {
		protocol: components.f,
		publicKey: components.g || "",
		pass: components.b || "",
		host: components.a,
		port: components.e || "",
		path: components.c || "",
		projectId: components.d
	};
}
function validateDsn(dsn) {
	if (!DEBUG_BUILD$2) {
		return true;
	}
	const { port, projectId, protocol } = dsn;
	const requiredComponents = [
		"protocol",
		"publicKey",
		"host",
		"projectId"
	];
	const hasMissingRequiredComponent = requiredComponents.find((component) => {
		if (!dsn[component]) {
			debug.c(`Invalid Sentry Dsn: ${component} missing`);
			return true;
		}
		return false;
	});
	if (hasMissingRequiredComponent) {
		return false;
	}
	if (!projectId.match(/^\d+$/)) {
		debug.c(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
		return false;
	}
	if (!isValidProtocol(protocol)) {
		debug.c(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
		return false;
	}
	if (port && isNaN(parseInt(port, 10))) {
		debug.c(`Invalid Sentry Dsn: Invalid port ${port}`);
		return false;
	}
	return true;
}
/**
* Extract the org ID from a DSN host.
*
* @param host The host from a DSN
* @returns The org ID if found, undefined otherwise
*/
function extractOrgIdFromDsnHost(host) {
	const match = host.match(ORG_ID_REGEX);
	return match?.[1];
}
/**
*  Returns the organization ID of the client.
*
*  The organization ID is extracted from the DSN. If the client options include a `orgId`, this will always take precedence.
*/
function extractOrgIdFromClient(client) {
	const options = client.getOptions();
	const { host } = client.getDsn() || {};
	let org_id;
	if (options.orgId) {
		org_id = String(options.orgId);
	} else if (host) {
		org_id = extractOrgIdFromDsnHost(host);
	}
	return org_id;
}
/**
* Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
* @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
*/
function makeDsn() {
	const components = dsnFromString();
	if (!components || !validateDsn(components)) {
		return void 0;
	}
	return components;
}
/**
* Parse a sample rate from a given value.
* This will either return a boolean or number sample rate, if the sample rate is valid (between 0 and 1).
* If a string is passed, we try to convert it to a number.
*
* Any invalid sample rate will return `undefined`.
*/
function parseSampleRate(sampleRate) {
	if (typeof sampleRate === "boolean") {
		return Number(sampleRate);
	}
	const rate = typeof sampleRate === "string" ? parseFloat(sampleRate) : sampleRate;
	if (typeof rate !== "number" || isNaN(rate) || rate < 0 || rate > 1) {
		return void 0;
	}
	return rate;
}
let hasShownSpanDropWarning = false;
/**
* Convert a span to a trace context, which can be sent as the `trace` context in a non-transaction event.
*/
function spanToTraceContext(span) {
	const { spanId, traceId: trace_id, isRemote } = span.spanContext();
	// If the span is remote, we use a random/virtual span as span_id to the trace context,
	// and the remote span as parent_span_id
	const parent_span_id = isRemote ? spanId : spanToJSON(span).parent_span_id;
	const scope = getCapturedScopesOnSpan(span).a;
	const span_id = isRemote ? scope?.getPropagationContext().propagationSpanId || generateSpanId() : spanId;
	return {
		parent_span_id,
		span_id,
		trace_id
	};
}
/**
*  Converts the span links array to a flattened version to be sent within an envelope.
*
*  If the links array is empty, it returns `undefined` so the empty value can be dropped before it's sent.
*/
function convertSpanLinksForEnvelope(links) {
	if (links && links.length > 0) {
		return links.map(({ context: { spanId, traceId, traceFlags, ...restContext }, attributes }) => ({
			span_id: spanId,
			trace_id: traceId,
			sampled: traceFlags === 1,
			attributes,
			...restContext
		}));
	} else {
		return;
	}
}
/**
* Convert a span time input into a timestamp in seconds.
*/
function spanTimeInputToSeconds(input) {
	if (typeof input === "number") {
		return;
	}
	if (Array.isArray(input)) {
		// See {@link HrTime} for the array-based time format
		return;
	}
	if (input instanceof Date) {
		return input.getTime();
	}
	return timestampInSeconds();
}
/**
* Convert a span to a JSON representation.
*/
// Note: Because of this, we currently have a circular type dependency (which we opted out of in package.json).
// This is not avoidable as we need `spanToJSON` in `spanUtils.ts`, which in turn is needed by `span.ts` for backwards compatibility.
// And `spanToJSON` needs the Span class from `span.ts` to check here.
function spanToJSON(span) {
	if (spanIsSentrySpan(span)) {
		return span.getSpanJSON();
	}
	span.spanContext();
	// Handle a span from @opentelemetry/sdk-base-trace's `Span` class
	if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
		const { attributes, startTime, name, endTime, links } = span;
		// In preparation for the next major of OpenTelemetry, we want to support
		// looking up the parent span id according to the new API
		// In OTel v1, the parent span id is accessed as `parentSpanId`
		// In OTel v2, the parent span id is accessed as `spanId` on the `parentSpanContext`
		const parentSpanId = "parentSpanId" in span ? span.parentSpanId : "parentSpanContext" in span ? span.parentSpanContext?.spanId : void 0;
		return {
			data: attributes,
			description: name,
			parent_span_id: parentSpanId,
			a: spanTimeInputToSeconds(startTime),
			b: spanTimeInputToSeconds(endTime),
			c: convertSpanLinksForEnvelope(links)
		};
	}
	// Finally, at least we have `spanContext()`....
	// This should not actually happen in reality, but we need to handle it for type safety.
	return { data: {} };
}
function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
	const castSpan = span;
	return !!castSpan.attributes && !!castSpan.startTime && !!castSpan.name && !!castSpan.endTime && !!castSpan.status;
}
/** Exported only for tests. */
/**
* Sadly, due to circular dependency checks we cannot actually import the Span class here and check for instanceof.
* :( So instead we approximate this by checking if it has the `getSpanJSON` method.
*/
function spanIsSentrySpan(span) {
	return typeof span.getSpanJSON === "function";
}
/**
* Returns true if a span is sampled.
* In most cases, you should just use `span.isRecording()` instead.
* However, this has a slightly different semantic, as it also returns false if the span is finished.
* So in the case where this distinction is important, use this method.
*/
function spanIsSampled(span) {
	// We align our trace flags with the ones OpenTelemetry use
	// So we also check for sampled the same way they do.
	const { traceFlags } = span.spanContext();
	return traceFlags === 1;
}
/**
* Returns the root span of a given span.
*/
function getRootSpan(span) {
	return span["_sentryRootSpan"] || span;
}
/**
* Logs a warning once if `beforeSendSpan` is used to drop spans.
*/
function showSpanDropWarning() {
	if (!hasShownSpanDropWarning) {
		consoleSandbox(() => {
			// eslint-disable-next-line no-console
			console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.");
		});
		hasShownSpanDropWarning = true;
	}
}
// Treeshakable guard to remove all code related to tracing
/**
* Determines if span recording is currently enabled.
*
* Spans are recorded when at least one of `tracesSampleRate` and `tracesSampler`
* is defined in the SDK config. This function does not make any assumption about
* sampling decisions, it only checks if the SDK is configured to record spans.
*
* Important: This function only determines if span recording is enabled. Trace
* continuation and propagation is separately controlled and not covered by this function.
* If this function returns `false`, traces can still be propagated (which is what
* we refer to by "Tracing without Performance")
* @see https://develop.sentry.dev/sdk/telemetry/traces/tracing-without-performance/
*
* @param maybeOptions An SDK options object to be passed to this function.
* If this option is not provided, the function will use the current client's options.
*/
function hasSpansEnabled() {
	if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
		return false;
	}
	const options = getClient()?.getOptions();
	return !!options && (options.tracesSampleRate != null || !!options.tracesSampler);
}
function logIgnoredSpan(droppedSpan) {
	debug.a(`Ignoring span ${droppedSpan.op} - ${droppedSpan.description} because it matches \`ignoreSpans\`.`);
}
/**
* Check if a span should be ignored based on the ignoreSpans configuration.
*/
function shouldIgnoreSpan(span, ignoreSpans) {
	if (!ignoreSpans?.length || !span.description) {
		return false;
	}
	for (const pattern of ignoreSpans) {
		if (isStringOrRegExp(pattern)) {
			if (isMatchingPattern(span.description, pattern)) {
				DEBUG_BUILD$2 && logIgnoredSpan(span);
				return true;
			}
			continue;
		}
		if (!pattern.name && !pattern.op) {
			continue;
		}
		const nameMatches = pattern.name ? isMatchingPattern(span.description, pattern.name) : true;
		const opMatches = pattern.op ? span.op && isMatchingPattern(span.op, pattern.op) : true;
		// This check here is only correct because we can guarantee that we ran `isMatchingPattern`
		// for at least one of `nameMatches` and `opMatches`. So in contrary to how this looks,
		// not both op and name actually have to match. This is the most efficient way to check
		// for all combinations of name and op patterns.
		if (nameMatches && opMatches) {
			DEBUG_BUILD$2 && logIgnoredSpan(span);
			return true;
		}
	}
	return false;
}
/**
* Takes a list of spans, and a span that was dropped, and re-parents the child spans of the dropped span to the parent of the dropped span, if possible.
* This mutates the spans array in place!
*/
function reparentChildSpans(spans, dropSpan) {
	const droppedSpanParentId = dropSpan.parent_span_id;
	const droppedSpanId = dropSpan.span_id;
	// This should generally not happen, as we do not apply this on root spans
	// but to be safe, we just bail in this case
	if (!droppedSpanParentId) {
		return;
	}
	for (const span of spans) {
		if (span.parent_span_id === droppedSpanId) {
			span.parent_span_id = droppedSpanParentId;
		}
	}
}
function isStringOrRegExp(value) {
	return typeof value === "string" || value instanceof RegExp;
}
/**
* Creates a dynamic sampling context from a client.
*
* Dispatches the `createDsc` lifecycle hook as a side effect.
*/
function getDynamicSamplingContextFromClient(trace_id, client) {
	const options = client.getOptions();
	const { publicKey: public_key } = client.getDsn() || {};
	// Instead of conditionally adding non-undefined values, we add them and then remove them if needed
	// otherwise, the order of baggage entries changes, which "breaks" a bunch of tests etc.
	const dsc = {
		environment: options.environment || "production",
		release: options.release,
		public_key,
		trace_id,
		org_id: extractOrgIdFromClient(client)
	};
	client.emit("createDsc", dsc);
	return dsc;
}
/**
* Get the dynamic sampling context for the currently active scopes.
*/
function getDynamicSamplingContextFromScope(client, scope) {
	const propagationContext = scope.getPropagationContext();
	return propagationContext.dsc || getDynamicSamplingContextFromClient(propagationContext.traceId, client);
}
/**
* Creates a dynamic sampling context from a span (and client and scope)
*
* @param span the span from which a few values like the root span name and sample rate are extracted.
*
* @returns a dynamic sampling context
*/
function getDynamicSamplingContextFromSpan(span) {
	const client = getClient();
	if (!client) {
		return {};
	}
	const rootSpan = getRootSpan(span);
	const rootSpanJson = spanToJSON(rootSpan);
	const rootSpanAttributes = rootSpanJson.data;
	const traceState = rootSpan.spanContext().traceState;
	// The span sample rate that was locally applied to the root span should also always be applied to the DSC, even if the DSC is frozen.
	// This is so that the downstream traces/services can use parentSampleRate in their `tracesSampler` to make consistent sampling decisions across the entire trace.
	const rootSpanSampleRate = traceState?.get("sentry.sample_rate") ?? rootSpanAttributes["sentry.sample_rate"] ?? rootSpanAttributes["sentry.previous_trace_sample_rate"];
	function applyLocalSampleRateToDsc(dsc) {
		if (typeof rootSpanSampleRate === "number" || typeof rootSpanSampleRate === "string") {
			dsc.sample_rate = `${rootSpanSampleRate}`;
		}
		return dsc;
	}
	// For core implementation, we freeze the DSC onto the span as a non-enumerable property
	const frozenDsc = rootSpan["_frozenDsc"];
	if (frozenDsc) {
		return applyLocalSampleRateToDsc(frozenDsc);
	}
	// For OpenTelemetry, we freeze the DSC on the trace state
	const traceStateDsc = traceState?.get("sentry.dsc");
	// If the span has a DSC, we want it to take precedence
	const dscOnTraceState = traceStateDsc && baggageHeaderToDynamicSamplingContext(traceStateDsc);
	if (dscOnTraceState) {
		return applyLocalSampleRateToDsc(dscOnTraceState);
	}
	// Else, we generate it from the span
	const dsc = getDynamicSamplingContextFromClient(span.spanContext().traceId, client);
	// We don't want to have a transaction name in the DSC if the source is "url" because URLs might contain PII
	const source = rootSpanAttributes["sentry.source"];
	// after JSON conversion, txn.name becomes jsonSpan.description
	const name = rootSpanJson.description;
	if (source !== "url" && name) {
		dsc.transaction = name;
	}
	// How can we even land here with hasSpansEnabled() returning false?
	// Otel creates a Non-recording span in Tracing Without Performance mode when handling incoming requests
	// So we end up with an active span that is not sampled (neither positively nor negatively)
	if (hasSpansEnabled()) {
		dsc.sampled = String(spanIsSampled(rootSpan));
		dsc.sample_rand = traceState?.get("sentry.sample_rand") ?? getCapturedScopesOnSpan(rootSpan).a?.getPropagationContext().sampleRand.toString();
	}
	applyLocalSampleRateToDsc(dsc);
	client.emit("createDsc", dsc, rootSpan);
	return dsc;
}
/**
* Recursively normalizes the given object.
*
* - Creates a copy to prevent original input mutation
* - Skips non-enumerable properties
* - When stringifying, calls `toJSON` if implemented
* - Removes circular references
* - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
* - Translates known global objects/classes to a string representations
* - Takes care of `Error` object serialization
* - Optionally limits depth of final output
* - Optionally limits number of properties/elements included in any single object/array
*
* @param input The object to be normalized.
* @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
* @param maxProperties The max number of elements or properties to be included in any single array or
* object in the normalized output.
* @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(input, depth = 100, maxProperties = Infinity) {
	try {
		// since we're at the outermost level, we don't provide a key
		return visit("", input, depth, maxProperties);
	} catch (err) {
		return { ERROR: `**non-serializable** (${err})` };
	}
}
/** JSDoc */
function normalizeToSize(object, depth = 3, maxSize = 102400) {
	const normalized = normalize(object, depth);
	if (jsonSize(normalized) > maxSize) {
		return normalizeToSize(object, depth - 1, maxSize);
	}
	return normalized;
}
/**
* Visits a node to perform normalization on it
*
* @param key The key corresponding to the given node
* @param value The node to be visited
* @param depth Optional number indicating the maximum recursion depth
* @param maxProperties Optional maximum number of properties/elements included in any single object/array
* @param memo Optional Memo class handling decycling
*/
function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
	const [memoize, unmemoize] = memo;
	// Get the simple cases out of the way first
	if (value == null || ["boolean", "string"].includes(typeof value) || typeof value === "number" && Number.isFinite(value)) {
		return value;
	}
	const stringified = stringifyValue(key, value);
	// Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
	// Everything else will have already been serialized, so if we don't see that pattern, we're done.
	if (!stringified.startsWith("[object ")) {
		return stringified;
	}
	// From here on, we can assert that `value` is either an object or an array.
	// Do not normalize objects that we know have already been normalized. As a general rule, the
	// "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
	// have already been normalized.
	if (value["__sentry_skip_normalization__"]) {
		return value;
	}
	// We can set `__sentry_override_normalization_depth__` on an object to ensure that from there
	// We keep a certain amount of depth.
	// This should be used sparingly, e.g. we use it for the redux integration to ensure we get a certain amount of state.
	const remainingDepth = typeof value["__sentry_override_normalization_depth__"] === "number" ? value["__sentry_override_normalization_depth__"] : depth;
	// We're also done if we've reached the max depth
	if (remainingDepth === 0) {
		// At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
		return stringified.replace("object ", "");
	}
	// If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
	if (memoize(value)) {
		return "[Circular ~]";
	}
	// If the value has a `toJSON` method, we call it to extract more information
	const valueWithToJSON = value;
	if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
		try {
			const jsonValue = valueWithToJSON.toJSON();
			// We need to normalize the return value of `.toJSON()` in case it has circular references
			return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
		} catch {}
	}
	// At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
	// because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
	// property/entry, and keep track of the number of items we add to it.
	const normalized = Array.isArray(value) ? [] : {};
	let numAdded = 0;
	// Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
	// properties are non-enumerable and otherwise would get missed.
	const visitable = convertToPlainObject(value);
	for (const visitKey in visitable) {
		// Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
		if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
			continue;
		}
		if (numAdded >= maxProperties) {
			normalized[visitKey] = "[MaxProperties ~]";
			break;
		}
		// Recursively visit all the child nodes
		const visitValue = visitable[visitKey];
		normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
		numAdded++;
	}
	// Once we've visited all the branches, remove the parent from memo storage
	unmemoize(value);
	// Return accumulated values
	return normalized;
}
/* eslint-disable complexity */
/**
* Stringify the given value. Handles various known special values and types.
*
* Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
* the number 1231 into "[Object Number]", nor on `null`, as it will throw.
*
* @param value The value to stringify
* @returns A stringified representation of the given value
*/
function stringifyValue(key, value) {
	try {
		if (key === "domain" && value && typeof value === "object" && value._events) {
			return "[Domain]";
		}
		if (key === "domainEmitter") {
			return "[DomainEmitter]";
		}
		// It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
		// which won't throw if they are not present.
		if (typeof global !== "undefined" && value === global) {
			return "[Global]";
		}
		// eslint-disable-next-line no-restricted-globals
		if (typeof window !== "undefined" && value === window) {
			return "[Window]";
		}
		// eslint-disable-next-line no-restricted-globals
		if (typeof document !== "undefined" && value === document) {
			return "[Document]";
		}
		if (isVueViewModel(value)) {
			return getVueInternalName(value);
		}
		// React's SyntheticEvent thingy
		if (isSyntheticEvent(value)) {
			return "[SyntheticEvent]";
		}
		if (typeof value === "number" && !Number.isFinite(value)) {
			return `[${value}]`;
		}
		if (typeof value === "function") {
			return `[Function: ${getFunctionName(value)}]`;
		}
		if (typeof value === "symbol") {
			return `[${String(value)}]`;
		}
		// stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
		if (typeof value === "bigint") {
			return `[BigInt: ${String(value)}]`;
		}
		// Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
		// them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
		// `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
		// we can make sure that only plain objects come out that way.
		const objName = getConstructorName(value);
		// Handle HTML Elements
		if (/^HTML(\w*)Element$/.test(objName)) {
			return `[HTMLElement: ${objName}]`;
		}
		return `[object ${objName}]`;
	} catch (err) {
		return `**non-serializable** (${err})`;
	}
}
/* eslint-enable complexity */
function getConstructorName(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype?.constructor ? prototype.constructor.name : "null prototype";
}
/** Calculates bytes size of input string */
function utf8Length(value) {
	// eslint-disable-next-line no-bitwise
	return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonSize(value) {
	return utf8Length(JSON.stringify(value));
}
/**
* Helper to decycle json objects
*/
function memoBuilder() {
	const inner = new WeakSet();
	function memoize(obj) {
		if (inner.has(obj)) {
			return true;
		}
		inner.add(obj);
		return false;
	}
	function unmemoize(obj) {
		inner.delete(obj);
	}
	return [memoize, unmemoize];
}
/**
* Creates an envelope.
* Make sure to always explicitly provide the generic to this function
* so that the envelope types resolve correctly.
*/
function createEnvelope(headers, items) {
	return [headers, items];
}
/**
* Add an item to an envelope.
* Make sure to always explicitly provide the generic to this function
* so that the envelope types resolve correctly.
*/
function addItemToEnvelope(envelope, newItem) {
	const [headers, items] = envelope;
	return [headers, [...items, newItem]];
}
/**
* Convenience function to loop through the items and item types of an envelope.
* (This function was mostly created because working with envelope types is painful at the moment)
*
* If the callback returns true, the rest of the items will be skipped.
*/
function forEachEnvelopeItem(envelope, callback) {
	const envelopeItems = envelope[1];
	for (const envelopeItem of envelopeItems) {
		const envelopeItemType = envelopeItem[0].type;
		const result = callback(envelopeItem, envelopeItemType);
		if (result) {
			return true;
		}
	}
	return false;
}
/**
* Returns true if the envelope contains any of the given envelope item types
*/
function envelopeContainsItemType(envelope, types) {
	return forEachEnvelopeItem(envelope, (__unused_AD9E, type) => types.includes(type));
}
/**
* Encode a string to UTF8 array.
*/
function encodeUTF8(input) {
	const carrier = getSentryCarrier(GLOBAL_OBJ);
	return carrier.encodePolyfill ? carrier.encodePolyfill(input) : new TextEncoder().encode(input);
}
/**
* Serializes an envelope.
*/
function serializeEnvelope(envelope) {
	const [envHeaders, items] = envelope;
	// Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data
	let parts = JSON.stringify(envHeaders);
	function append(next) {
		if (typeof parts === "string") {
			parts = typeof next === "string" ? parts + next : [encodeUTF8(parts), next];
		} else {
			parts.push(typeof next === "string" ? encodeUTF8(next) : next);
		}
	}
	for (const item of items) {
		const [itemHeaders, payload] = item;
		append(`
${JSON.stringify(itemHeaders)}
`);
		if (typeof payload === "string" || payload instanceof Uint8Array) {
			append(payload);
		} else {
			let stringifiedPayload;
			try {
				stringifiedPayload = JSON.stringify(payload);
			} catch {
				// In case, despite all our efforts to keep `payload` circular-dependency-free, `JSON.stringify()` still
				// fails, we try again after normalizing it again with infinite normalization depth. This of course has a
				// performance impact but in this case a performance hit is better than throwing.
				stringifiedPayload = JSON.stringify(normalize(payload));
			}
			append(stringifiedPayload);
		}
	}
	return typeof parts === "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
	const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const buffer of buffers) {
		merged.set(buffer, offset);
		offset += buffer.length;
	}
	return merged;
}
/**
* Creates attachment envelope items
*/
function createAttachmentEnvelopeItem(attachment) {
	const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data) : attachment.data;
	return [{
		type: "attachment",
		length: buffer.length,
		filename: attachment.filename,
		content_type: attachment.contentType,
		attachment_type: attachment.attachmentType
	}, buffer];
}
const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
	session: "session",
	sessions: "session",
	attachment: "attachment",
	transaction: "transaction",
	event: "error",
	client_report: "internal",
	user_report: "default",
	profile: "profile",
	profile_chunk: "profile",
	replay_event: "replay",
	replay_recording: "replay",
	check_in: "monitor",
	feedback: "feedback",
	span: "span",
	raw_security: "security",
	log: "log_item",
	metric: "metric",
	trace_metric: "metric"
};
/**
* Maps the type of an envelope item to a data category.
*/
function envelopeItemTypeToDataCategory(type) {
	return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
/** Extracts the minimal SDK info from the metadata or an events */
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
	if (!metadataOrEvent?.sdk) {
		return;
	}
	const { name, version } = metadataOrEvent.sdk;
	return {
		name,
		version
	};
}
/**
* Creates event envelope headers, based on event, sdk info and tunnel
* Note: This function was extracted from the core package to make it available in Replay
*/
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
	const dynamicSamplingContext = event.sdkProcessingMetadata?.dynamicSamplingContext;
	return {
		event_id: event.event_id,
		sent_at: new Date().toISOString(),
		...sdkInfo && { sdk: sdkInfo },
		...!!tunnel && dsn && { dsn: dsnToString(dsn) },
		...dynamicSamplingContext && { trace: dynamicSamplingContext }
	};
}
/**
* Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
* Merge with existing data if any.
*
* @internal, exported only for testing
**/
function _enhanceEventWithSdkInfo(event, newSdkInfo) {
	if (!newSdkInfo) {
		return;
	}
	const eventSdkInfo = event.sdk || {};
	event.sdk = {
		...eventSdkInfo,
		name: eventSdkInfo.name || newSdkInfo.name,
		version: eventSdkInfo.version || newSdkInfo.version,
		integrations: [...event.sdk?.integrations || [], ...newSdkInfo.integrations || []],
		packages: [...event.sdk?.packages || [], ...newSdkInfo.packages || []],
		settings: event.sdk?.settings || newSdkInfo.settings ? {
			...event.sdk?.settings,
			...newSdkInfo.settings
		} : void 0
	};
	return;
}
/** Creates an envelope from a Session */
function createSessionEnvelope(session, dsn, metadata, tunnel) {
	const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
	const envelopeHeaders = {
		sent_at: new Date().toISOString(),
		...sdkInfo && { sdk: sdkInfo },
		...!!tunnel && dsn && { dsn: dsnToString(dsn) }
	};
	const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
	return createEnvelope(envelopeHeaders, [envelopeItem]);
}
/**
* Create an Envelope from an event.
*/
function createEventEnvelope(event, dsn, metadata, tunnel) {
	const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
	/*
	Note: Due to TS, event.type may be `replay_event`, theoretically.
	In practice, we never call `createEventEnvelope` with `replay_event` type,
	and we'd have to adjust a looot of types to make this work properly.
	We want to avoid casting this around, as that could lead to bugs (e.g. when we add another type)
	So the safe choice is to really guard against the replay_event type here.
	*/
	const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
	_enhanceEventWithSdkInfo(event, metadata?.sdk);
	const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
	// Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
	// sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
	// have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
	// of this `delete`, lest we miss putting it back in the next time the property is in use.)
	delete event.sdkProcessingMetadata;
	const eventItem = [{ type: eventType }, event];
	return createEnvelope(envelopeHeaders, [eventItem]);
}
/**
* Creates a resolved sync promise.
*
* @param value the value to resolve the promise with
* @returns the resolved sync promise
*/
function resolvedSyncPromise(value) {
	return new SyncPromise((resolve) => {
		resolve(value);
	});
}
/**
* Creates a rejected sync promise.
*
* @param value the value to reject the promise with
* @returns the rejected sync promise
*/
function rejectedSyncPromise(reason) {
	return new SyncPromise((__unused_FF59, reject) => {
		reject(reason);
	});
}
/**
* Thenable class that behaves like a Promise and follows it's interface
* but is not async internally
*/
class SyncPromise {
	constructor(executor) {
		this._state = 0;
		this._handlers = [];
		this._runExecutor(executor);
	}
	/** @inheritdoc */
	then(onfulfilled, onrejected) {
		return new SyncPromise((resolve, reject) => {
			this._handlers.push([
				false,
				(result) => {
					if (!onfulfilled) {
						// TODO: ¯\_(ツ)_/¯
						// TODO: FIXME
						resolve(result);
					} else {
						try {
							resolve(onfulfilled(result));
						} catch (e) {
							reject(e);
						}
					}
				},
				(reason) => {
					if (!onrejected) {
						reject(reason);
					} else {
						try {
							resolve(onrejected(reason));
						} catch (e) {
							reject(e);
						}
					}
				}
			]);
			this._executeHandlers();
		});
	}
	/** @inheritdoc */
	catch(onrejected) {
		return this.then((val) => val, onrejected);
	}
	/** @inheritdoc */
	finally(onfinally) {
		return new SyncPromise((resolve, reject) => {
			let val;
			let isRejected;
			return this.then((value) => {
				isRejected = false;
				val = value;
				if (onfinally) {
					onfinally();
				}
			}, (reason) => {
				isRejected = true;
				val = reason;
				if (onfinally) {
					onfinally();
				}
			}).then(() => {
				if (isRejected) {
					reject(val);
					return;
				}
				resolve(val);
			});
		});
	}
	/** Excute the resolve/reject handlers. */
	_executeHandlers() {
		if (this._state === 0) {
			return;
		}
		const cachedHandlers = this._handlers.slice();
		this._handlers = [];
		cachedHandlers.forEach((handler) => {
			if (handler[0]) {
				return;
			}
			if (this._state === 1) {
				handler[1](this._value);
			}
			if (this._state === 2) {
				handler[2](this._value);
			}
			handler[0] = true;
		});
	}
	/** Run the executor for the SyncPromise. */
	_runExecutor(executor) {
		const setResult = (state, value) => {
			if (this._state !== 0) {
				return;
			}
			if (isThenable(value)) {
				value.then(resolve, reject);
				return;
			}
			this._state = state;
			this._value = value;
			this._executeHandlers();
		};
		const resolve = (value) => {
			setResult(1, value);
		};
		const reject = (reason) => {
			setResult(2, reason);
		};
		try {
			executor(resolve, reject);
		} catch (e) {
			reject(e);
		}
	}
}
/**
* Process an array of event processors, returning the processed event (or `null` if the event was dropped).
*/
function notifyEventProcessors(processors, event, hint) {
	try {
		const result = _notifyEventProcessors(event, hint, processors, 0);
		return isThenable(result) ? result : resolvedSyncPromise(result);
	} catch (error) {
		return rejectedSyncPromise(error);
	}
}
function _notifyEventProcessors(event, hint, processors, index) {
	const processor = processors[index];
	if (!event || !processor) {
		return event;
	}
	const result = processor({ ...event }, hint);
	DEBUG_BUILD$2 && result === null && debug.a(`Event processor "${processor.id || "?"}" dropped event`);
	if (isThenable(result)) {
		return result.then((final) => _notifyEventProcessors(final, hint, processors, index + 1));
	}
	return _notifyEventProcessors(result, hint, processors, index + 1);
}
let parsedStackResults;
let lastSentryKeysCount;
let lastNativeKeysCount;
let cachedFilenameDebugIds;
/**
* Returns a map of filenames to debug identifiers.
* Supports both proprietary _sentryDebugIds and native _debugIds (e.g., from Vercel) formats.
*/
function getFilenameToDebugIdMap(stackParser) {
	const sentryDebugIdMap = GLOBAL_OBJ._sentryDebugIds;
	const nativeDebugIdMap = GLOBAL_OBJ._debugIds;
	if (!sentryDebugIdMap && !nativeDebugIdMap) {
		return {};
	}
	const sentryDebugIdKeys = sentryDebugIdMap ? Object.keys(sentryDebugIdMap) : [];
	const nativeDebugIdKeys = nativeDebugIdMap ? Object.keys(nativeDebugIdMap) : [];
	// If the count of registered globals hasn't changed since the last call, we
	// can just return the cached result.
	if (cachedFilenameDebugIds && sentryDebugIdKeys.length === lastSentryKeysCount && nativeDebugIdKeys.length === lastNativeKeysCount) {
		return cachedFilenameDebugIds;
	}
	lastSentryKeysCount = sentryDebugIdKeys.length;
	lastNativeKeysCount = nativeDebugIdKeys.length;
	// Build a map of filename -> debug_id from both sources
	cachedFilenameDebugIds = {};
	if (!parsedStackResults) {
		parsedStackResults = {};
	}
	const processDebugIds = (debugIdKeys, debugIdMap) => {
		for (const key of debugIdKeys) {
			const debugId = debugIdMap[key];
			const result = parsedStackResults?.[key];
			if (result && cachedFilenameDebugIds && debugId) {
				// Use cached filename but update with current debug ID
				cachedFilenameDebugIds[result[0]] = debugId;
				// Update cached result with new debug ID
				if (parsedStackResults) {
					parsedStackResults[key] = [result[0], debugId];
				}
			} else if (debugId) {
				const parsedStack = stackParser(key);
				for (let i = parsedStack.length - 1; i >= 0; i--) {
					const stackFrame = parsedStack[i];
					const filename = stackFrame?.filename;
					if (filename && cachedFilenameDebugIds && parsedStackResults) {
						cachedFilenameDebugIds[filename] = debugId;
						parsedStackResults[key] = [filename, debugId];
						break;
					}
				}
			}
		}
	};
	if (sentryDebugIdMap) {
		processDebugIds(sentryDebugIdKeys, sentryDebugIdMap);
	}
	// Native _debugIds will override _sentryDebugIds if same file
	if (nativeDebugIdMap) {
		processDebugIds(nativeDebugIdKeys, nativeDebugIdMap);
	}
	return cachedFilenameDebugIds;
}
/**
* Applies data from the scope to the event and runs all event processors on it.
*/
function applyScopeDataToEvent(event, data) {
	const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
	// Apply general data
	applyDataToEvent(event, data);
	// We want to set the trace context for normal events only if there isn't already
	// a trace context on the event. There is a product feature in place where we link
	// errors with transaction and it relies on that.
	if (span) {
		applySpanToEvent(event, span);
	}
	applyFingerprintToEvent(event, fingerprint);
	applyBreadcrumbsToEvent(event, breadcrumbs);
	applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
/** Merge data of two scopes together. */
function mergeScopeData(data, mergeData) {
	const { extra, tags, attributes, user, contexts, level, sdkProcessingMetadata, breadcrumbs, fingerprint, eventProcessors, attachments, propagationContext, transactionName, span } = mergeData;
	mergeAndOverwriteScopeData(data, "extra", extra);
	mergeAndOverwriteScopeData(data, "tags", tags);
	mergeAndOverwriteScopeData(data, "attributes", attributes);
	mergeAndOverwriteScopeData(data, "user", user);
	mergeAndOverwriteScopeData(data, "contexts", contexts);
	data.sdkProcessingMetadata = merge(data.sdkProcessingMetadata, sdkProcessingMetadata, 2);
	if (level) {
		data.level = level;
	}
	if (transactionName) {
		data.transactionName = transactionName;
	}
	if (span) {
		data.span = span;
	}
	if (breadcrumbs.length) {
		data.breadcrumbs = [...data.breadcrumbs, ...breadcrumbs];
	}
	if (fingerprint.length) {
		data.fingerprint = [...data.fingerprint, ...fingerprint];
	}
	if (eventProcessors.length) {
		data.eventProcessors = [...data.eventProcessors, ...eventProcessors];
	}
	if (attachments.length) {
		data.attachments = [...data.attachments, ...attachments];
	}
	data.propagationContext = {
		...data.propagationContext,
		...propagationContext
	};
}
/**
* Merges certain scope data. Undefined values will overwrite any existing values.
* Exported only for tests.
*/
function mergeAndOverwriteScopeData(data, prop, mergeVal) {
	data[prop] = merge(data[prop], mergeVal, 1);
}
/**
* Get the scope data for the current scope after merging with the
* global scope and isolation scope.
*
* @param currentScope - The current scope.
* @returns The scope data.
*/
function getCombinedScopeData(isolationScope, currentScope) {
	const scopeData = getGlobalScope().getScopeData();
	isolationScope && mergeScopeData(scopeData, isolationScope.getScopeData());
	currentScope && mergeScopeData(scopeData, currentScope.getScopeData());
	return scopeData;
}
function applyDataToEvent(event, data) {
	const { extra, tags, user, contexts, level, transactionName } = data;
	if (Object.keys(extra).length) {
		event.extra = {
			...extra,
			...event.extra
		};
	}
	if (Object.keys(tags).length) {
		event.tags = {
			...tags,
			...event.tags
		};
	}
	if (Object.keys(user).length) {
		event.user = {
			...user,
			...event.user
		};
	}
	if (Object.keys(contexts).length) {
		event.contexts = {
			...contexts,
			...event.contexts
		};
	}
	if (level) {
		event.level = level;
	}
	// transaction events get their `transaction` from the root span name
	if (transactionName && event.type !== "transaction") {
		event.transaction = transactionName;
	}
}
function applyBreadcrumbsToEvent(event, breadcrumbs) {
	const mergedBreadcrumbs = [...event.breadcrumbs || [], ...breadcrumbs];
	event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : void 0;
}
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
	event.sdkProcessingMetadata = {
		...event.sdkProcessingMetadata,
		...sdkProcessingMetadata
	};
}
function applySpanToEvent(event, span) {
	event.contexts = {
		trace: spanToTraceContext(span),
		...event.contexts
	};
	event.sdkProcessingMetadata = {
		dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
		...event.sdkProcessingMetadata
	};
	const rootSpan = getRootSpan(span);
	const transactionName = spanToJSON(rootSpan).description;
	if (transactionName && !event.transaction && event.type === "transaction") {
		event.transaction = transactionName;
	}
}
/**
* Applies fingerprint from the scope to the event if there's one,
* uses message if there's one instead or get rid of empty fingerprint
*/
function applyFingerprintToEvent(event, fingerprint) {
	// Make sure it's an array first and we actually have something in place
	event.fingerprint = event.fingerprint ? Array.isArray(event.fingerprint) ? event.fingerprint : [event.fingerprint] : [];
	// If we have something on the scope, then merge it with event
	if (fingerprint) {
		event.fingerprint = event.fingerprint.concat(fingerprint);
	}
	// If we have no data at all, remove empty array default
	if (!event.fingerprint.length) {
		delete event.fingerprint;
	}
}
/**
* This type makes sure that we get either a CaptureContext, OR an EventHint.
* It does not allow mixing them, which could lead to unexpected outcomes, e.g. this is disallowed:
* { user: { id: '123' }, mechanism: { handled: false } }
*/
/**
* Adds common information to events.
*
* The information includes release and environment from `options`,
* breadcrumbs and context (extra, tags and user) from the scope.
*
* Information that is already present in the event is never overwritten. For
* nested objects, such as the context, keys are merged.
*
* @param event The original event.
* @param hint May contain additional information about the original exception.
* @param scope A scope containing event metadata.
* @returns A new event with more information.
* @hidden
*/
function prepareEvent(options, event, hint, scope, client, isolationScope) {
	const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
	const prepared = {
		...event,
		event_id: event.event_id || hint.event_id || uuid4(),
		timestamp: event.timestamp || dateTimestampInSeconds()
	};
	const integrations = hint.integrations || options.integrations.map((i) => i.name);
	applyClientOptions(prepared, options);
	applyIntegrationsMetadata(prepared, integrations);
	if (client) {
		client.emit("applyFrameMetadata", event);
	}
	// Only put debug IDs onto frames for error events.
	if (event.type === void 0) {
		applyDebugIds(prepared, options.stackParser);
	}
	// If we have scope given to us, use it as the base for further modifications.
	// This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
	const finalScope = getFinalScope(scope, hint.captureContext);
	if (hint.mechanism) {
		addExceptionMechanism(prepared, hint.mechanism);
	}
	const clientEventProcessors = client ? client.getEventProcessors() : [];
	// This should be the last thing called, since we want that
	// {@link Scope.addEventProcessor} gets the finished prepared event.
	// Merge scope data together
	const data = getCombinedScopeData(isolationScope, finalScope);
	const attachments = [...hint.attachments || [], ...data.attachments];
	if (attachments.length) {
		hint.attachments = attachments;
	}
	applyScopeDataToEvent(prepared, data);
	const eventProcessors = [...clientEventProcessors, ...data.eventProcessors];
	const result = notifyEventProcessors(eventProcessors, prepared, hint);
	return result.then((evt) => {
		if (evt) {
			// We apply the debug_meta field only after all event processors have ran, so that if any event processors modified
			// file names (e.g.the RewriteFrames integration) the filename -> debug ID relationship isn't destroyed.
			// This should not cause any PII issues, since we're only moving data that is already on the event and not adding
			// any new data
			applyDebugMeta(evt);
		}
		if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
			return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
		}
		return evt;
	});
}
/**
* Enhances event using the client configuration.
* It takes care of all "static" values like environment, release and `dist`,
* as well as truncating overly long values.
*
* Only exported for tests.
*
* @param event event instance to be enhanced
*/
function applyClientOptions(event, options) {
	const { environment, release, dist, maxValueLength } = options;
	// empty strings do not make sense for environment, release, and dist
	// so we handle them the same as if they were not provided
	event.environment = event.environment || environment || "production";
	if (!event.release && release) {
		event.release = release;
	}
	if (!event.dist && dist) {
		event.dist = dist;
	}
	const request = event.request;
	if (request?.url && maxValueLength) {
		request.url = truncate(request.url, maxValueLength);
	}
	if (maxValueLength) {
		event.exception?.values?.forEach((exception) => {
			if (exception.value) {
				// Truncates error messages
				exception.value = truncate(exception.value, maxValueLength);
			}
		});
	}
}
/**
* Puts debug IDs into the stack frames of an error event.
*/
function applyDebugIds(event, stackParser) {
	// Build a map of filename -> debug_id
	const filenameDebugIdMap = getFilenameToDebugIdMap(stackParser);
	event.exception?.values?.forEach((exception) => {
		exception.stacktrace?.frames?.forEach((frame) => {
			if (frame.filename) {
				frame.debug_id = filenameDebugIdMap[frame.filename];
			}
		});
	});
}
/**
* Moves debug IDs from the stack frames of an error event into the debug_meta field.
*/
function applyDebugMeta(event) {
	// Extract debug IDs and filenames from the stack frames on the event.
	const filenameDebugIdMap = {};
	event.exception?.values?.forEach((exception) => {
		exception.stacktrace?.frames?.forEach((frame) => {
			if (frame.debug_id) {
				if (frame.abs_path) {
					filenameDebugIdMap[frame.abs_path] = frame.debug_id;
				} else if (frame.filename) {
					filenameDebugIdMap[frame.filename] = frame.debug_id;
				}
				delete frame.debug_id;
			}
		});
	});
	if (Object.keys(filenameDebugIdMap).length === 0) {
		return;
	}
	// Fill debug_meta information
	event.debug_meta = event.debug_meta || {};
	event.debug_meta.images = event.debug_meta.images || [];
	const images = event.debug_meta.images;
	Object.entries(filenameDebugIdMap).forEach(([filename, debug_id]) => {
		images.push({
			type: "sourcemap",
			code_file: filename,
			debug_id
		});
	});
}
/**
* This function adds all used integrations to the SDK info in the event.
* @param event The event that will be filled with all integrations.
*/
function applyIntegrationsMetadata(event, integrationNames) {
	if (integrationNames.length > 0) {
		event.sdk = event.sdk || {};
		event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
	}
}
/**
* Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
* Normalized keys:
* - `breadcrumbs.data`
* - `user`
* - `contexts`
* - `extra`
* @param event Event
* @returns Normalized event
*/
function normalizeEvent(event, depth, maxBreadth) {
	if (!event) {
		return null;
	}
	const normalized = {
		...event,
		...event.breadcrumbs && { breadcrumbs: event.breadcrumbs.map((b) => ({
			...b,
			...b.data && { data: normalize(b.data, depth, maxBreadth) }
		})) },
		...event.user && { user: normalize(event.user, depth, maxBreadth) },
		...event.contexts && { contexts: normalize(event.contexts, depth, maxBreadth) },
		...event.extra && { extra: normalize(event.extra, depth, maxBreadth) }
	};
	// event.contexts.trace stores information about a Transaction. Similarly,
	// event.spans[] stores information about child Spans. Given that a
	// Transaction is conceptually a Span, normalization should apply to both
	// Transactions and Spans consistently.
	// For now the decision is to skip normalization of Transactions and Spans,
	// so this block overwrites the normalized event to add back the original
	// Transaction information prior to normalization.
	if (event.contexts?.trace && normalized.contexts) {
		normalized.contexts.trace = event.contexts.trace;
		// event.contexts.trace.data may contain circular/dangerous data so we need to normalize it
		if (event.contexts.trace.data) {
			normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
		}
	}
	// event.spans[].data may contain circular/dangerous data so we need to normalize it
	if (event.spans) {
		normalized.spans = event.spans.map((span) => {
			return {
				...span,
				...span.data && { data: normalize(span.data, depth, maxBreadth) }
			};
		});
	}
	// event.contexts.flags (FeatureFlagContext) stores context for our feature
	// flag integrations. It has a greater nesting depth than our other typed
	// Contexts, so we re-normalize with a fixed depth of 3 here. We do not want
	// to skip this in case of conflicting, user-provided context.
	if (event.contexts?.flags && normalized.contexts) {
		normalized.contexts.flags = normalize(event.contexts.flags, 3, maxBreadth);
	}
	return normalized;
}
function getFinalScope(scope, captureContext) {
	if (!captureContext) {
		return scope;
	}
	const finalScope = scope ? scope.clone() : new Scope();
	finalScope.update(captureContext);
	return finalScope;
}
/**
* Captures an exception event and sends it to Sentry.
*
* @param exception The exception to capture.
* @param hint Optional additional data to attach to the Sentry event.
* @returns the id of the captured Sentry event.
*/
function captureException(exception) {
	return getCurrentScope().captureException(exception, void 0);
}
/**
* Captures a manually created event and sends it to Sentry.
*
* @param event The event to send to Sentry.
* @param hint Optional additional data to attach to the Sentry event.
* @returns the id of the captured event.
*/
function captureEvent(event, hint) {
	return getCurrentScope().captureEvent(event, hint);
}
/**
* Start a session on the current isolation scope.
*
* @param context (optional) additional properties to be applied to the returned session object
*
* @returns the new active session
*/
function startSession(context) {
	const isolationScope = getIsolationScope();
	const currentScope = getCurrentScope();
	// Will fetch userAgent if called from browser sdk
	const { userAgent } = GLOBAL_OBJ.navigator || {};
	const session = makeSession({
		user: currentScope.getUser() || isolationScope.getUser(),
		...userAgent && { userAgent },
		...context
	});
	// End existing session if there's one
	const currentSession = isolationScope.getSession();
	if (currentSession?.status === "ok") {
		updateSession(currentSession, { status: "exited" });
	}
	endSession();
	// Afterwards we set the new session on the scope
	isolationScope.setSession(session);
	return;
}
/**
* End the session on the current isolation scope.
*/
function endSession() {
	const isolationScope = getIsolationScope();
	const currentScope = getCurrentScope();
	const session = currentScope.getSession() || isolationScope.getSession();
	if (session) {
		closeSession(session);
	}
	_sendSessionUpdate();
	// the session is over; take it off of the scope
	isolationScope.setSession();
}
/**
* Sends the current Session on the scope
*/
function _sendSessionUpdate() {
	const isolationScope = getIsolationScope();
	const client = getClient();
	const session = isolationScope.getSession();
	if (session && client) {
		client.captureSession(session);
	}
}
/**
* Sends the current session on the scope to Sentry
*
* @param end If set the session will be marked as exited and removed from the scope.
*            Defaults to `false`.
*/
function captureSession() {
	// only send the update
	_sendSessionUpdate();
}
/** Returns the prefix to construct Sentry ingestion API endpoints. */
function getBaseApiEndpoint(dsn) {
	const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
	const port = dsn.port ? `:${dsn.port}` : "";
	return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
/** Returns the ingest API endpoint for target. */
function _getIngestEndpoint(dsn) {
	return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
/** Returns a URL-encoded string with auth config suitable for a query string. */
function _encodedAuth(dsn) {
	const params = { sentry_version: "7" };
	if (dsn.publicKey) {
		// We send only the minimum set of required information. See
		// https://github.com/getsentry/sentry-javascript/issues/2572.
		params.sentry_key = dsn.publicKey;
	}
	{
		{
			params.sentry_client = `${"sentry.javascript.browser"}/${"10.38.0"}`;
		}
	}
	return new URLSearchParams(params).toString();
}
/**
* Returns the envelope endpoint URL with auth in the query string.
*
* Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
*/
function getEnvelopeEndpointWithUrlEncodedAuth(dsn) {
	return `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn)}`;
}
const installedIntegrations = [];
/** Map of integrations assigned to a client */
/**
* Remove duplicates from the given array, preferring the last instance of any duplicate. Not guaranteed to
* preserve the order of integrations in the array.
*
* @private
*/
function filterDuplicates(integrations) {
	const integrationsByName = {};
	integrations.forEach((currentInstance) => {
		const { name } = currentInstance;
		const existingInstance = integrationsByName[name];
		// We want integrations later in the array to overwrite earlier ones of the same type, except that we never want a
		// default instance to overwrite an existing user instance
		if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
			return;
		}
		integrationsByName[name] = currentInstance;
	});
	return Object.values(integrationsByName);
}
/** Gets integrations to install */
function getIntegrationsToSetup(options) {
	const defaultIntegrations = options.a;
	// We flag default instances, so that later we can tell them apart from any user-created instances of the same class
	defaultIntegrations.forEach((integration) => {
		integration.isDefaultInstance = true;
	});
	let integrations;
	if (Array.isArray(void 0)) {
		integrations = [...defaultIntegrations];
	} else {
		{
			integrations = defaultIntegrations;
		}
	}
	return filterDuplicates(integrations);
}
/**
* Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
* integrations are added unless they were already provided before.
* @param integrations array of integration instances
* @param withDefault should enable default integrations
*/
function setupIntegrations(client, integrations) {
	const integrationIndex = {};
	integrations.forEach((integration) => {
		// guard against empty provided integrations
		if (integration) {
			setupIntegration(client, integration, integrationIndex);
		}
	});
	return integrationIndex;
}
/**
* Execute the `afterAllSetup` hooks of the given integrations.
*/
function afterSetupIntegrations(client, integrations) {
	for (const integration of integrations) {
		// guard against empty provided integrations
		if (integration?.afterAllSetup) {
			integration.afterAllSetup(client);
		}
	}
}
/** Setup a single integration.  */
function setupIntegration(client, integration, integrationIndex) {
	if (integrationIndex[integration.name]) {
		DEBUG_BUILD$2 && debug.a(`Integration skipped because it was already installed: ${integration.name}`);
		return;
	}
	integrationIndex[integration.name] = integration;
	// `setupOnce` is only called the first time
	if (!installedIntegrations.includes(integration.name) && typeof integration.setupOnce === "function") {
		integration.setupOnce();
		installedIntegrations.push(integration.name);
	}
	// `setup` is run for each client
	if (integration.setup && typeof integration.setup === "function") {
		integration.setup(client);
	}
	if (typeof integration.preprocessEvent === "function") {
		const callback = integration.preprocessEvent.bind(integration);
		client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
	}
	if (typeof integration.processEvent === "function") {
		const callback = integration.processEvent.bind(integration);
		const processor = Object.assign((event, hint) => callback(event, hint, client), { id: integration.name });
		client.addEventProcessor(processor);
	}
	DEBUG_BUILD$2 && debug.a(`Integration installed: ${integration.name}`);
}
/**
* Define an integration function that can be used to create an integration instance.
* Note that this by design hides the implementation details of the integration, as they are considered internal.
*/
function defineIntegration(fn) {
	return fn;
}
/**
* Creates a log container envelope item for a list of logs.
*
* @param items - The logs to include in the envelope.
* @returns The created log container envelope item.
*/
function createLogContainerEnvelopeItem(items) {
	return [{
		type: "log",
		item_count: items.length,
		content_type: "application/vnd.sentry.items.log+json"
	}, { items }];
}
/**
* Creates an envelope for a list of logs.
*
* Logs from multiple traces can be included in the same envelope.
*
* @param logs - The logs to include in the envelope.
* @param metadata - The metadata to include in the envelope.
* @param tunnel - The tunnel to include in the envelope.
* @param dsn - The DSN to include in the envelope.
* @returns The created envelope.
*/
function createLogEnvelope(logs, metadata, tunnel, dsn) {
	const headers = {};
	if (metadata?.sdk) {
		headers.sdk = {
			name: metadata.sdk.name,
			version: metadata.sdk.version
		};
	}
	if (!!tunnel && !!dsn) {
		headers.dsn = dsnToString(dsn);
	}
	return createEnvelope(headers, [createLogContainerEnvelopeItem(logs)]);
}
/**
* Flushes the logs buffer to Sentry.
*
* @param client - A client.
* @param maybeLogBuffer - A log buffer. Uses the log buffer for the given client if not provided.
*
* @experimental This method will experience breaking changes. This is not yet part of
* the stable Sentry SDK API and can be changed or removed without warning.
*/
function _INTERNAL_flushLogsBuffer(client) {
	const logBuffer = _INTERNAL_getLogBuffer(client) ?? [];
	if (logBuffer.length === 0) {
		return;
	}
	const clientOptions = client.getOptions();
	const envelope = createLogEnvelope(logBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
	// Clear the log buffer after envelopes have been constructed.
	_getBufferMap$1().set(client, []);
	client.emit("flushLogs");
	// sendEnvelope should not throw
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	client.sendEnvelope(envelope);
}
/**
* Returns the log buffer for a given client.
*
* Exported for testing purposes.
*
* @param client - The client to get the log buffer for.
* @returns The log buffer for the given client.
*/
function _INTERNAL_getLogBuffer(client) {
	return _getBufferMap$1().get(client);
}
function _getBufferMap$1() {
	// The reference to the Client <> LogBuffer map is stored on the carrier to ensure it's always the same
	return getGlobalSingleton("clientToLogBufferMap", () => new WeakMap());
}
/**
* Creates a metric container envelope item for a list of metrics.
*
* @param items - The metrics to include in the envelope.
* @returns The created metric container envelope item.
*/
function createMetricContainerEnvelopeItem(items) {
	return [{
		type: "trace_metric",
		item_count: items.length,
		content_type: "application/vnd.sentry.items.trace-metric+json"
	}, { items }];
}
/**
* Creates an envelope for a list of metrics.
*
* Metrics from multiple traces can be included in the same envelope.
*
* @param metrics - The metrics to include in the envelope.
* @param metadata - The metadata to include in the envelope.
* @param tunnel - The tunnel to include in the envelope.
* @param dsn - The DSN to include in the envelope.
* @returns The created envelope.
*/
function createMetricEnvelope(metrics, metadata, tunnel, dsn) {
	const headers = {};
	if (metadata?.sdk) {
		headers.sdk = {
			name: metadata.sdk.name,
			version: metadata.sdk.version
		};
	}
	if (!!tunnel && !!dsn) {
		headers.dsn = dsnToString(dsn);
	}
	return createEnvelope(headers, [createMetricContainerEnvelopeItem(metrics)]);
}
/**
* Flushes the metrics buffer to Sentry.
*
* @param client - A client.
* @param maybeMetricBuffer - A metric buffer. Uses the metric buffer for the given client if not provided.
*
* @experimental This method will experience breaking changes. This is not yet part of
* the stable Sentry SDK API and can be changed or removed without warning.
*/
function _INTERNAL_flushMetricsBuffer(client) {
	const metricBuffer = _INTERNAL_getMetricBuffer(client) ?? [];
	if (metricBuffer.length === 0) {
		return;
	}
	const clientOptions = client.getOptions();
	const envelope = createMetricEnvelope(metricBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
	// Clear the metric buffer after envelopes have been constructed.
	_getBufferMap().set(client, []);
	client.emit("flushMetrics");
	// sendEnvelope should not throw
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	client.sendEnvelope(envelope);
}
/**
* Returns the metric buffer for a given client.
*
* Exported for testing purposes.
*
* @param client - The client to get the metric buffer for.
* @returns The metric buffer for the given client.
*/
function _INTERNAL_getMetricBuffer(client) {
	return _getBufferMap().get(client);
}
function _getBufferMap() {
	// The reference to the Client <> MetricBuffer map is stored on the carrier to ensure it's always the same
	return getGlobalSingleton("clientToMetricBufferMap", () => new WeakMap());
}
const SENTRY_BUFFER_FULL_ERROR = Symbol.for("SentryBufferFullError");
/**
* Creates an new PromiseBuffer object with the specified limit
* @param limit max number of promises that can be stored in the buffer
*/
function makePromiseBuffer(limit) {
	const buffer = new Set();
	function isReady() {
		return buffer.size < limit;
	}
	/**
	* Remove a promise from the queue.
	*
	* @param task Can be any PromiseLike<T>
	* @returns Removed promise.
	*/
	function remove(task) {
		buffer.delete(task);
	}
	/**
	* Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
	*
	* @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
	*        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
	*        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
	*        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
	*        limit check.
	* @returns The original promise.
	*/
	function add(taskProducer) {
		if (!isReady()) {
			return rejectedSyncPromise(SENTRY_BUFFER_FULL_ERROR);
		}
		// start the task and add its promise to the queue
		const task = taskProducer();
		buffer.add(task);
		task.then(() => (remove(task), void 0), () => (remove(task), void 0));
		return task;
	}
	/**
	* Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
	*
	* @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
	* not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
	* `true`.
	* @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
	* `false` otherwise
	*/
	function drain(timeout) {
		if (!buffer.size) {
			return resolvedSyncPromise(true);
		}
		// We want to resolve even if one of the promises rejects
		const drainPromise = Promise.allSettled(Array.from(buffer)).then(() => true);
		if (!timeout) {
			return drainPromise;
		}
		const promises = [drainPromise, new Promise((resolve) => setTimeout(() => resolve(false), timeout))];
		// Promise.race will resolve to the first promise that resolves or rejects
		// So if the drainPromise resolves, the timeout promise will be ignored
		return Promise.race(promises);
	}
	return {
		get $() {
			return Array.from(buffer);
		},
		add,
		drain
	};
}
/**
* Extracts Retry-After value from the request header or returns default value
* @param header string representation of 'Retry-After' header
* @param now current unix timestamp
*
*/
function parseRetryAfterHeader(header, now = safeDateNow()) {
	const headerDelay = parseInt(`${header}`, 10);
	if (!isNaN(headerDelay)) {
		return headerDelay * 1e3;
	}
	const headerDate = Date.parse(`${header}`);
	if (!isNaN(headerDate)) {
		return headerDate - now;
	}
	return 6e4;
}
/**
* Gets the time that the given category is disabled until for rate limiting.
* In case no category-specific limit is set but a general rate limit across all categories is active,
* that time is returned.
*
* @return the time in ms that the category is disabled until or 0 if there's no active rate limit.
*/
function disabledUntil(limits, dataCategory) {
	return limits[dataCategory] || limits.all || 0;
}
/**
* Checks if a category is rate limited
*/
function isRateLimited(limits, dataCategory, now = safeDateNow()) {
	return disabledUntil(limits, dataCategory) > now;
}
/**
* Update ratelimits from incoming headers.
*
* @return the updated RateLimits object.
*/
function updateRateLimits(limits, { statusCode, headers }, now = safeDateNow()) {
	const updatedRateLimits = { ...limits };
	// "The name is case-insensitive."
	// https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
	const rateLimitHeader = headers?.["x-sentry-rate-limits"];
	const retryAfterHeader = headers?.["retry-after"];
	if (rateLimitHeader) {
		/**
		* rate limit headers are of the form
		*     <header>,<header>,..
		* where each <header> is of the form
		*     <retry_after>: <categories>: <scope>: <reason_code>: <namespaces>
		* where
		*     <retry_after> is a delay in seconds
		*     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
		*         <category>;<category>;...
		*     <scope> is what's being limited (org, project, or key) - ignored by SDK
		*     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
		*     <namespaces> Semicolon-separated list of metric namespace identifiers. Defines which namespace(s) will be affected.
		*         Only present if rate limit applies to the metric_bucket data category.
		*/
		for (const limit of rateLimitHeader.trim().split(",")) {
			const [retryAfter, categories, , , namespaces] = limit.split(":", 5);
			const headerDelay = parseInt(retryAfter, 10);
			const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
			if (!categories) {
				updatedRateLimits.all = now + delay;
			} else {
				for (const category of categories.split(";")) {
					if (category === "metric_bucket") {
						// namespaces will be present when category === 'metric_bucket'
						if (!namespaces || namespaces.split(";").includes("custom")) {
							updatedRateLimits[category] = now + delay;
						}
					} else {
						updatedRateLimits[category] = now + delay;
					}
				}
			}
		}
	} else if (retryAfterHeader) {
		updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
	} else if (statusCode === 429) {
		updatedRateLimits.all = now + 6e4;
	}
	return updatedRateLimits;
}
/**
* Creates an instance of a Sentry `Transport`
*
* @param options
* @param makeRequest
*/
function createTransport(options, makeRequest, buffer) {
	let rateLimits = {};
	const flush = (timeout) => buffer.drain(timeout);
	function send(envelope) {
		const filteredEnvelopeItems = [];
		// Drop rate limited items from envelope
		forEachEnvelopeItem(envelope, (item, type) => {
			const dataCategory = envelopeItemTypeToDataCategory(type);
			if (isRateLimited(rateLimits, dataCategory)) {
				options.recordDroppedEvent("ratelimit_backoff", dataCategory);
			} else {
				filteredEnvelopeItems.push(item);
			}
		});
		// Skip sending if envelope is empty after filtering out rate limited events
		if (filteredEnvelopeItems.length === 0) {
			return Promise.resolve({});
		}
		const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
		// Creates client report for each item in an envelope
		const recordEnvelopeLoss = (reason) => {
			// Don't record outcomes for client reports - we don't want to create a feedback loop if client reports themselves fail to send
			if (envelopeContainsItemType(filteredEnvelope, ["client_report"])) {
				DEBUG_BUILD$2 && debug.b(`Dropping client report. Will not send outcomes (reason: ${reason}).`);
				return;
			}
			forEachEnvelopeItem(filteredEnvelope, (__unused_E8F0, type) => {
				options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type));
			});
		};
		const requestTask = () => makeRequest({ a: serializeEnvelope(filteredEnvelope) }).then((response) => {
			// We don't want to throw on NOK responses, but we want to at least log them
			if (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
				DEBUG_BUILD$2 && debug.b(`Sentry responded with status code ${response.statusCode} to sent event.`);
			}
			rateLimits = updateRateLimits(rateLimits, response);
			return response;
		}, (error) => {
			recordEnvelopeLoss("network_error");
			DEBUG_BUILD$2 && debug.c("Encountered error running transport request:", error);
			throw error;
		});
		return buffer.add(requestTask).then((result) => result, (error) => {
			if (error === SENTRY_BUFFER_FULL_ERROR) {
				DEBUG_BUILD$2 && debug.c("Skipped sending event because buffer is full.");
				recordEnvelopeLoss("queue_overflow");
				return Promise.resolve({});
			} else {
				throw error;
			}
		});
	}
	return {
		send,
		flush
	};
}
/**
* Creates client report envelope
* @param discarded_events An array of discard events
* @param dsn A DSN that can be set on the header. Optional.
*/
function createClientReportEnvelope(discarded_events, dsn) {
	const clientReportItem = [{ type: "client_report" }, {
		timestamp: dateTimestampInSeconds(),
		discarded_events
	}];
	return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
}
/**
* Get a list of possible event messages from a Sentry event.
*/
function getPossibleEventMessages(event) {
	const possibleMessages = [];
	if (event.message) {
		possibleMessages.push(event.message);
	}
	try {
		// @ts-expect-error Try catching to save bundle size
		const lastException = event.exception.values[event.exception.values.length - 1];
		if (lastException?.value) {
			possibleMessages.push(lastException.value);
			if (lastException.type) {
				possibleMessages.push(`${lastException.type}: ${lastException.value}`);
			}
		}
	} catch {}
	return possibleMessages;
}
/**
* Converts a transaction event to a span JSON object.
*/
function convertTransactionEventToSpanJson(event) {
	const { trace_id, parent_span_id, span_id, status, origin, data, op } = event.contexts?.trace ?? {};
	return {
		data: data ?? {},
		description: event.transaction,
		op,
		parent_span_id,
		span_id: span_id ?? "",
		start_timestamp: event.start_timestamp ?? 0,
		status,
		timestamp: event.timestamp,
		trace_id: trace_id ?? "",
		origin,
		profile_id: data?.["sentry.profile_id"],
		exclusive_time: data?.["sentry.exclusive_time"],
		measurements: event.measurements,
		is_segment: true
	};
}
/**
* Converts a span JSON object to a transaction event.
*/
function convertSpanJsonToTransactionEvent(span) {
	return {
		type: "transaction",
		timestamp: span.timestamp,
		start_timestamp: span.start_timestamp,
		transaction: span.description,
		contexts: { trace: {
			trace_id: span.trace_id,
			span_id: span.span_id,
			parent_span_id: span.parent_span_id,
			op: span.op,
			status: span.status,
			origin: span.origin,
			data: {
				...span.data,
				...span.profile_id && { ["sentry.profile_id"]: span.profile_id },
				...span.exclusive_time && { ["sentry.exclusive_time"]: span.exclusive_time }
			}
		} },
		measurements: span.measurements
	};
}
const INTERNAL_ERROR_SYMBOL = Symbol.for("SentryInternalError");
const DO_NOT_SEND_EVENT_SYMBOL = Symbol.for("SentryDoNotSendEventError");
function _makeInternalError(message) {
	return {
		message,
		[INTERNAL_ERROR_SYMBOL]: true
	};
}
function _makeDoNotSendEventError(message) {
	return {
		message,
		[DO_NOT_SEND_EVENT_SYMBOL]: true
	};
}
function _isInternalError(error) {
	return !!error && typeof error === "object" && INTERNAL_ERROR_SYMBOL in error;
}
function _isDoNotSendEventError(error) {
	return !!error && typeof error === "object" && DO_NOT_SEND_EVENT_SYMBOL in error;
}
/**
* Sets up weight-based flushing for logs or metrics.
* This helper function encapsulates the common pattern of:
* 1. Tracking accumulated weight of items
* 2. Flushing when weight exceeds threshold (800KB)
* 3. Flushing after timeout period from the first item
*
* Uses closure variables to track weight and timeout state.
*/
function setupWeightBasedFlushing(client, __unused_7932, __unused_135A, estimateSizeFn, flushFn) {
	// Track weight and timeout in closure variables
	let weight = 0;
	let flushTimeout;
	let isTimerActive = false;
	// @ts-expect-error - TypeScript can't narrow generic hook types to match specific overloads, but we know this is type-safe
	client.on("flushMetrics", () => {
		weight = 0;
		clearTimeout(flushTimeout);
		isTimerActive = false;
	});
	// @ts-expect-error - TypeScript can't narrow generic hook types to match specific overloads, but we know this is type-safe
	client.on("afterCaptureMetric", (item) => {
		weight += estimateSizeFn(item);
		// We flush the buffer if it exceeds 0.8 MB
		// The weight is a rough estimate, so we flush way before the payload gets too big.
		if (weight >= 8e5) {
			flushFn(client);
		} else if (!isTimerActive) {
			// Only start timer if one isn't already running.
			// This prevents flushing being delayed by items that arrive close to the timeout limit
			// and thus resetting the flushing timeout and delaying items being flushed.
			isTimerActive = true;
			flushTimeout = setTimeout(() => {
				flushFn(client);
				// Note: isTimerActive is reset by the flushHook handler above, not here,
				// to avoid race conditions when new items arrive during the flush.
			}, 5e3);
		}
	});
	client.on("flush", () => {
		flushFn(client);
	});
}
/**
* Base implementation for all JavaScript SDK clients.
*
* Call the constructor with the corresponding options
* specific to the client subclass. To access these options later, use
* {@link Client.getOptions}.
*
* If a Dsn is specified in the options, it will be parsed and stored. Use
* {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
* invalid, the constructor will throw a {@link SentryException}. Note that
* without a valid Dsn, the SDK will not send any events to Sentry.
*
* Before sending an event, it is passed through
* {@link Client._prepareEvent} to add SDK information and scope data
* (breadcrumbs and context). To add more custom information, override this
* method and extend the resulting prepared event.
*
* To issue automatically created events (e.g. via instrumentation), use
* {@link Client.captureEvent}. It will prepare the event and pass it through
* the callback lifecycle. To issue auto-breadcrumbs, use
* {@link Client.addBreadcrumb}.
*
* @example
* class NodeClient extends Client<NodeOptions> {
*   public constructor(options: NodeOptions) {
*     super(options);
*   }
*
*   // ...
* }
*/
class Client {
	/** Options passed to the SDK. */
	/** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
	/** Array of set up integrations. */
	/** Number of calls being processed */
	/** Holds flushable  */
	// eslint-disable-next-line @typescript-eslint/ban-types
	/**
	* Initializes this client instance.
	*
	* @param options Options for the client.
	*/
	constructor(options) {
		this._options = options;
		this._integrations = {};
		this._numProcessing = 0;
		this._outcomes = {};
		this._hooks = {};
		this._eventProcessors = [];
		this._promiseBuffer = makePromiseBuffer(64);
		{
			{
				this._dsn = makeDsn();
			}
		}
		if (this._dsn) {
			const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn);
			this._transport = options.transport({
				recordDroppedEvent: this.recordDroppedEvent.bind(this),
				...void 0,
				url
			});
		}
		// Backfill enableLogs option from _experiments.enableLogs
		// TODO(v11): Remove or change default value
		// eslint-disable-next-line deprecation/deprecation
		this._options.enableLogs = void 0;
		// Setup metric flushing with weight and timeout tracking
		{
			{
				setupWeightBasedFlushing(this, 0, 0, estimateMetricSizeInBytes, _INTERNAL_flushMetricsBuffer);
			}
		}
	}
	/**
	* Captures an exception event and sends it to Sentry.
	*
	* Unlike `captureException` exported from every SDK, this method requires that you pass it the current scope.
	*/
	captureException(exception, hint, scope) {
		const eventId = uuid4();
		// ensure we haven't captured this very object before
		if (checkOrSetAlreadyCaught(exception)) {
			DEBUG_BUILD$2 && debug.a("Not capturing exception because it's already been captured.");
			return eventId;
		}
		const hintWithEventId = {
			event_id: eventId,
			...hint
		};
		this._process(() => this.eventFromException(exception, hintWithEventId).then((event) => this._captureEvent(event, hintWithEventId, scope)).then((res) => res), "error");
		return hintWithEventId.event_id;
	}
	/**
	* Captures a message event and sends it to Sentry.
	*
	* Unlike `captureMessage` exported from every SDK, this method requires that you pass it the current scope.
	*/
	captureMessage(message, level, hint, currentScope) {
		const hintWithEventId = {
			event_id: uuid4(),
			...hint
		};
		const eventMessage = isParameterizedString(message) ? message : String(message);
		const isMessage = isPrimitive(message);
		const promisedEvent = isMessage ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
		this._process(() => promisedEvent.then((event) => this._captureEvent(event, hintWithEventId, currentScope)), isMessage ? "unknown" : "error");
		return hintWithEventId.event_id;
	}
	/**
	* Captures a manually created event and sends it to Sentry.
	*
	* Unlike `captureEvent` exported from every SDK, this method requires that you pass it the current scope.
	*/
	captureEvent(event, hint, currentScope) {
		const eventId = uuid4();
		// ensure we haven't captured this very object before
		if (hint?.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
			DEBUG_BUILD$2 && debug.a("Not capturing exception because it's already been captured.");
			return eventId;
		}
		const hintWithEventId = {
			event_id: eventId,
			...hint
		};
		const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
		const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
		const capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
		const dataCategory = getDataCategoryByType(event.type);
		this._process(() => this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope, capturedSpanIsolationScope), dataCategory);
		return hintWithEventId.event_id;
	}
	/**
	* Captures a session.
	*/
	captureSession(session) {
		this.sendSession(session);
		// After sending, we set init false to indicate it's not the first occurrence
		updateSession(session, { init: false });
	}
	/**
	* Create a cron monitor check in and send it to Sentry. This method is not available on all clients.
	*
	* @param checkIn An object that describes a check in.
	* @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
	* to create a monitor automatically when sending a check in.
	* @param scope An optional scope containing event metadata.
	* @returns A string representing the id of the check in.
	*/
	/**
	* Get the current Dsn.
	*/
	getDsn() {
		return this._dsn;
	}
	/**
	* Get the current options.
	*/
	getOptions() {
		return this._options;
	}
	/**
	* Get the SDK metadata.
	* @see SdkMetadata
	*/
	getSdkMetadata() {
		return this._options._metadata;
	}
	/**
	* Returns the transport that is used by the client.
	* Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
	*/
	getTransport() {
		return this._transport;
	}
	/**
	* Wait for all events to be sent or the timeout to expire, whichever comes first.
	*
	* @param timeout Maximum time in ms the client should wait for events to be flushed. Omitting this parameter will
	*   cause the client to wait until all events are sent before resolving the promise.
	* @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
	* still events in the queue when the timeout is reached.
	*/
	// @ts-expect-error - PromiseLike is a subset of Promise
	async flush(timeout) {
		const transport = this._transport;
		if (!transport) {
			return true;
		}
		this.emit("flush");
		const clientFinished = await this._isClientDoneProcessing(timeout);
		const transportFlushed = await transport.flush(timeout);
		return clientFinished && transportFlushed;
	}
	/**
	* Flush the event queue and set the client to `enabled = false`. See {@link Client.flush}.
	*
	* @param {number} timeout Maximum time in ms the client should wait before shutting down. Omitting this parameter will cause
	*   the client to wait until all events are sent before disabling itself.
	* @returns {Promise<boolean>} A promise which resolves to `true` if the flush completes successfully before the timeout, or `false` if
	* it doesn't.
	*/
	// @ts-expect-error - PromiseLike is a subset of Promise
	async close(timeout) {
		const result = await this.flush(timeout);
		this.getOptions().enabled = false;
		this.emit("close");
		return result;
	}
	/**
	* Get all installed event processors.
	*/
	getEventProcessors() {
		return this._eventProcessors;
	}
	/**
	* Adds an event processor that applies to any event processed by this client.
	*/
	addEventProcessor(eventProcessor) {
		this._eventProcessors.push(eventProcessor);
	}
	/**
	* Initialize this client.
	* Call this after the client was set on a scope.
	*/
	init() {
		if (this._isEnabled() || this._options.integrations.some(({ name }) => name.startsWith("Spotlight"))) {
			this._setupIntegrations();
		}
	}
	/**
	* Gets an installed integration by its name.
	*
	* @returns {Integration|undefined} The installed integration or `undefined` if no integration with that `name` was installed.
	*/
	getIntegrationByName(integrationName) {
		return this._integrations[integrationName];
	}
	/**
	* Add an integration to the client.
	* This can be used to e.g. lazy load integrations.
	* In most cases, this should not be necessary,
	* and you're better off just passing the integrations via `integrations: []` at initialization time.
	* However, if you find the need to conditionally load & add an integration, you can use `addIntegration` to do so.
	*/
	addIntegration(integration) {
		const isAlreadyInstalled = this._integrations[integration.name];
		// This hook takes care of only installing if not already installed
		setupIntegration(this, integration, this._integrations);
		// Here we need to check manually to make sure to not run this multiple times
		if (!isAlreadyInstalled) {
			afterSetupIntegrations(this, [integration]);
		}
	}
	/**
	* Send a fully prepared event to Sentry.
	*/
	sendEvent(event, hint = {}) {
		this.emit("beforeSendEvent", event, hint);
		let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
		for (const attachment of hint.attachments || []) {
			env = addItemToEnvelope(env, createAttachmentEnvelopeItem(attachment));
		}
		// sendEnvelope should not throw
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.sendEnvelope(env).then((sendResponse) => this.emit("afterSendEvent", event, sendResponse));
	}
	/**
	* Send a session or session aggregrates to Sentry.
	*/
	sendSession(session) {
		// Backfill release and environment on session
		const { release: clientReleaseOption, environment: clientEnvironmentOption = "production" } = this._options;
		if ("aggregates" in session) {
			const sessionAttrs = session.attrs || {};
			if (!sessionAttrs.release && !clientReleaseOption) {
				DEBUG_BUILD$2 && debug.b("Discarded session because of missing or non-string release");
				return;
			}
			sessionAttrs.release = sessionAttrs.release || clientReleaseOption;
			sessionAttrs.environment = sessionAttrs.environment || clientEnvironmentOption;
			session.attrs = sessionAttrs;
		} else {
			if (!session.release && !clientReleaseOption) {
				DEBUG_BUILD$2 && debug.b("Discarded session because of missing or non-string release");
				return;
			}
			session.release = session.release || clientReleaseOption;
			session.environment = session.environment || clientEnvironmentOption;
		}
		this.emit("beforeSendSession", session);
		const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
		// sendEnvelope should not throw
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.sendEnvelope(env);
	}
	/**
	* Record on the client that an event got dropped (ie, an event that will not be sent to Sentry).
	*/
	recordDroppedEvent(reason, category, count = 1) {
		if (this._options.sendClientReports) {
			// We want to track each category (error, transaction, session, replay_event) separately
			// but still keep the distinction between different type of outcomes.
			// We could use nested maps, but it's much easier to read and type this way.
			// A correct type for map-based implementation if we want to go that route
			// would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
			// With typescript 4.1 we could even use template literal types
			const key = `${reason}:${category}`;
			DEBUG_BUILD$2 && debug.a(`Recording outcome: "${key}"${count > 1 ? ` (${count} times)` : ""}`);
			this._outcomes[key] = (this._outcomes[key] || 0) + count;
		}
	}
	/* eslint-disable @typescript-eslint/unified-signatures */
	/**
	* Register a callback for whenever a span is started.
	* Receives the span as argument.
	* @returns {() => void} A function that, when executed, removes the registered callback.
	*/
	/**
	* Register a hook on this client.
	*/
	on(hook, callback) {
		const hookCallbacks = this._hooks[hook] = this._hooks[hook] || new Set();
		// Wrap the callback in a function so that registering the same callback instance multiple
		// times results in the callback being called multiple times.
		// @ts-expect-error - The `callback` type is correct and must be a function due to the
		// individual, specific overloads of this function.
		// eslint-disable-next-line @typescript-eslint/ban-types
		const uniqueCallback = (...args) => callback(...args);
		hookCallbacks.add(uniqueCallback);
		// This function returns a callback execution handler that, when invoked,
		// deregisters a callback. This is crucial for managing instances where callbacks
		// need to be unregistered to prevent self-referencing in callback closures,
		// ensuring proper garbage collection.
		return () => {
			hookCallbacks.delete(uniqueCallback);
		};
	}
	/** Fire a hook whenever a span starts. */
	/**
	* Emit a hook that was previously registered via `on()`.
	*/
	emit(hook, ...rest) {
		const callbacks = this._hooks[hook];
		if (callbacks) {
			callbacks.forEach((callback) => callback(...rest));
		}
	}
	/**
	* Send an envelope to Sentry.
	*/
	// @ts-expect-error - PromiseLike is a subset of Promise
	async sendEnvelope(envelope) {
		this.emit("beforeEnvelope", envelope);
		if (this._isEnabled() && this._transport) {
			try {
				return await this._transport.send(envelope);
			} catch (reason) {
				DEBUG_BUILD$2 && debug.c("Error while sending envelope:", reason);
				return {};
			}
		}
		DEBUG_BUILD$2 && debug.c("Transport disabled");
		return {};
	}
	/* eslint-enable @typescript-eslint/unified-signatures */
	/** Setup integrations for this client. */
	_setupIntegrations() {
		const { integrations } = this._options;
		this._integrations = setupIntegrations(this, integrations);
		afterSetupIntegrations(this, integrations);
	}
	/** Updates existing session based on the provided event */
	_updateSessionFromEvent(session, event) {
		// initially, set `crashed` based on the event level and update from exceptions if there are any later on
		let crashed = event.level === "fatal";
		let errored = false;
		const exceptions = event.exception?.values;
		if (exceptions) {
			errored = true;
			// reset crashed to false if there are exceptions, to ensure `mechanism.handled` is respected.
			crashed = false;
			for (const ex of exceptions) {
				if (ex.mechanism?.handled === false) {
					crashed = true;
					break;
				}
			}
		}
		// A session is updated and that session update is sent in only one of the two following scenarios:
		// 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
		// 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
		const sessionNonTerminal = session.status === "ok";
		const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
		if (shouldUpdateAndSend) {
			updateSession(session, {
				...crashed && { status: "crashed" },
				errors: session.errors || Number(errored || crashed)
			});
			this.captureSession(session);
		}
	}
	/**
	* Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
	* "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
	*
	* @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
	* passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
	* `true`.
	* @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
	* `false` otherwise
	*/
	async _isClientDoneProcessing(timeout) {
		let ticked = 0;
		// if no timeout is provided, we wait "forever" until everything is processed
		while (!timeout || ticked < timeout) {
			await new Promise((resolve) => setTimeout(resolve, 1));
			if (!this._numProcessing) {
				return true;
			}
			ticked++;
		}
		return false;
	}
	/** Determines whether this SDK is enabled and a transport is present. */
	_isEnabled() {
		return this.getOptions().enabled !== false && this._transport !== void 0;
	}
	/**
	* Adds common information to events.
	*
	* The information includes release and environment from `options`,
	* breadcrumbs and context (extra, tags and user) from the scope.
	*
	* Information that is already present in the event is never overwritten. For
	* nested objects, such as the context, keys are merged.
	*
	* @param event The original event.
	* @param hint May contain additional information about the original exception.
	* @param currentScope A scope containing event metadata.
	* @returns A new event with more information.
	*/
	_prepareEvent(event, hint, currentScope, isolationScope) {
		const options = this.getOptions();
		const integrations = Object.keys(this._integrations);
		if (!hint.integrations && integrations.length) {
			hint.integrations = integrations;
		}
		this.emit("preprocessEvent", event, hint);
		if (!event.type) {
			isolationScope.setLastEventId(event.event_id || hint.event_id);
		}
		return prepareEvent(options, event, hint, currentScope, this, isolationScope).then((evt) => {
			if (evt === null) {
				return evt;
			}
			this.emit("postprocessEvent", evt, hint);
			evt.contexts = {
				trace: getTraceContextFromScope(currentScope),
				...evt.contexts
			};
			const dynamicSamplingContext = getDynamicSamplingContextFromScope(this, currentScope);
			evt.sdkProcessingMetadata = {
				dynamicSamplingContext,
				...evt.sdkProcessingMetadata
			};
			return evt;
		});
	}
	/**
	* Processes the event and logs an error in case of rejection
	* @param event
	* @param hint
	* @param scope
	*/
	_captureEvent(event, hint = {}, currentScope = getCurrentScope(), isolationScope = getIsolationScope()) {
		if (DEBUG_BUILD$2 && isErrorEvent(event)) {
			debug.a(`Captured error event \`${getPossibleEventMessages(event)[0] || "<unknown>"}\``);
		}
		return this._processEvent(event, hint, currentScope, isolationScope).then((finalEvent) => {
			return finalEvent.event_id;
		}, (reason) => {
			if (DEBUG_BUILD$2) {
				if (_isDoNotSendEventError(reason)) {
					debug.a(reason.message);
				} else if (_isInternalError(reason)) {
					debug.b(reason.message);
				} else {
					debug.b(reason);
				}
			}
			return void 0;
		});
	}
	/**
	* Processes an event (either error or message) and sends it to Sentry.
	*
	* This also adds breadcrumbs and context information to the event. However,
	* platform specific meta data (such as the User's IP address) must be added
	* by the SDK implementor.
	*
	*
	* @param event The event to send to Sentry.
	* @param hint May contain additional information about the original exception.
	* @param currentScope A scope containing event metadata.
	* @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
	*/
	_processEvent(event, hint, currentScope, isolationScope) {
		const options = this.getOptions();
		const { sampleRate } = options;
		const isTransaction = isTransactionEvent(event);
		const isError = isErrorEvent(event);
		const eventType = event.type || "error";
		const beforeSendLabel = `before send for type \`${eventType}\``;
		// 1.0 === 100% events are sent
		// 0.0 === 0% events are sent
		// Sampling for transaction happens somewhere else
		const parsedSampleRate = typeof sampleRate === "undefined" ? void 0 : parseSampleRate(sampleRate);
		if (isError && typeof parsedSampleRate === "number" && safeMathRandom() > parsedSampleRate) {
			this.recordDroppedEvent("sample_rate", "error");
			return rejectedSyncPromise(_makeDoNotSendEventError(`Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`));
		}
		const dataCategory = getDataCategoryByType(event.type);
		return this._prepareEvent(event, hint, currentScope, isolationScope).then((prepared) => {
			if (prepared === null) {
				this.recordDroppedEvent("event_processor", dataCategory);
				throw _makeDoNotSendEventError("An event processor returned `null`, will not send event.");
			}
			const isInternalException = hint.data && hint.data.__sentry__ === true;
			if (isInternalException) {
				return prepared;
			}
			const result = processBeforeSend(this, options, prepared, hint);
			return _validateBeforeSendResult(result, beforeSendLabel);
		}).then((processedEvent) => {
			if (processedEvent === null) {
				this.recordDroppedEvent("before_send", dataCategory);
				if (isTransaction) {
					const spans = event.spans || [];
					// the transaction itself counts as one span, plus all the child spans that are added
					const spanCount = 1 + spans.length;
					this.recordDroppedEvent("before_send", "span", spanCount);
				}
				throw _makeDoNotSendEventError(`${beforeSendLabel} returned \`null\`, will not send event.`);
			}
			const session = currentScope.getSession() || isolationScope.getSession();
			if (isError && session) {
				this._updateSessionFromEvent(session, processedEvent);
			}
			if (isTransaction) {
				const spanCountBefore = processedEvent.sdkProcessingMetadata?.spanCountBeforeProcessing || 0;
				const spanCountAfter = processedEvent.spans ? processedEvent.spans.length : 0;
				const droppedSpanCount = spanCountBefore - spanCountAfter;
				if (droppedSpanCount > 0) {
					this.recordDroppedEvent("before_send", "span", droppedSpanCount);
				}
			}
			// None of the Sentry built event processor will update transaction name,
			// so if the transaction name has been changed by an event processor, we know
			// it has to come from custom event processor added by a user
			const transactionInfo = processedEvent.transaction_info;
			if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
				processedEvent.transaction_info = {
					...transactionInfo,
					source: "custom"
				};
			}
			this.sendEvent(processedEvent, hint);
			return processedEvent;
		}).then(null, (reason) => {
			if (_isDoNotSendEventError(reason) || _isInternalError(reason)) {
				throw reason;
			}
			this.captureException(reason, {
				mechanism: {
					handled: false,
					type: "internal"
				},
				data: { __sentry__: true },
				originalException: reason
			});
			throw _makeInternalError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`);
		});
	}
	/**
	* Occupies the client with processing and event
	*/
	_process(taskProducer, dataCategory) {
		this._numProcessing++;
		this._promiseBuffer.add(taskProducer).then((value) => {
			this._numProcessing--;
			return value;
		}, (reason) => {
			this._numProcessing--;
			if (reason === SENTRY_BUFFER_FULL_ERROR) {
				this.recordDroppedEvent("queue_overflow", dataCategory);
			}
			return reason;
		});
	}
	/**
	* Clears outcomes on this client and returns them.
	*/
	_clearOutcomes() {
		const outcomes = this._outcomes;
		this._outcomes = {};
		return Object.entries(outcomes).map(([key, quantity]) => {
			const [reason, category] = key.split(":");
			return {
				reason,
				category,
				quantity
			};
		});
	}
	/**
	* Sends client reports as an envelope.
	*/
	_flushOutcomes() {
		DEBUG_BUILD$2 && debug.a("Flushing outcomes...");
		const outcomes = this._clearOutcomes();
		if (outcomes.length === 0) {
			DEBUG_BUILD$2 && debug.a("No outcomes to send");
			return;
		}
		// This is really the only place where we want to check for a DSN and only send outcomes then
		if (!this._dsn) {
			DEBUG_BUILD$2 && debug.a("No dsn provided, will not send outcomes");
			return;
		}
		DEBUG_BUILD$2 && debug.a("Sending outcomes:", outcomes);
		const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
		// sendEnvelope should not throw
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.sendEnvelope(envelope);
	}
}
function getDataCategoryByType(type) {
	return type === "replay_event" ? "replay" : type || "error";
}
/**
* Verifies that return value of configured `beforeSend` or `beforeSendTransaction` is of expected type, and returns the value if so.
*/
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
	const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
	if (isThenable(beforeSendResult)) {
		return beforeSendResult.then((event) => {
			if (!isPlainObject(event) && event !== null) {
				throw _makeInternalError(invalidValueError);
			}
			return event;
		}, (e) => {
			throw _makeInternalError(`${beforeSendLabel} rejected with ${e}`);
		});
	} else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
		throw _makeInternalError(invalidValueError);
	}
	return beforeSendResult;
}
/**
* Process the matching `beforeSendXXX` callback.
*/
function processBeforeSend(client, options, event, hint) {
	const { beforeSend, beforeSendTransaction, beforeSendSpan, ignoreSpans } = options;
	let processedEvent = event;
	if (isErrorEvent(processedEvent) && beforeSend) {
		return beforeSend(processedEvent, hint);
	}
	if (isTransactionEvent(processedEvent)) {
		// Avoid processing if we don't have to
		if (beforeSendSpan || ignoreSpans) {
			// 1. Process root span
			const rootSpanJson = convertTransactionEventToSpanJson(processedEvent);
			// 1.1 If the root span should be ignored, drop the whole transaction
			if (ignoreSpans?.length && shouldIgnoreSpan(rootSpanJson, ignoreSpans)) {
				// dropping the whole transaction!
				return null;
			}
			// 1.2 If a `beforeSendSpan` callback is defined, process the root span
			if (beforeSendSpan) {
				const processedRootSpanJson = beforeSendSpan(rootSpanJson);
				if (!processedRootSpanJson) {
					showSpanDropWarning();
				} else {
					// update event with processed root span values
					processedEvent = merge(event, convertSpanJsonToTransactionEvent(processedRootSpanJson));
				}
			}
			// 2. Process child spans
			if (processedEvent.spans) {
				const processedSpans = [];
				const initialSpans = processedEvent.spans;
				for (const span of initialSpans) {
					// 2.a If the child span should be ignored, reparent it to the root span
					if (ignoreSpans?.length && shouldIgnoreSpan(span, ignoreSpans)) {
						reparentChildSpans(initialSpans, span);
						continue;
					}
					// 2.b If a `beforeSendSpan` callback is defined, process the child span
					if (beforeSendSpan) {
						const processedSpan = beforeSendSpan(span);
						if (!processedSpan) {
							showSpanDropWarning();
							processedSpans.push(span);
						} else {
							processedSpans.push(processedSpan);
						}
					} else {
						processedSpans.push(span);
					}
				}
				const droppedSpans = processedEvent.spans.length - processedSpans.length;
				if (droppedSpans) {
					client.recordDroppedEvent("before_send", "span", droppedSpans);
				}
				processedEvent.spans = processedSpans;
			}
		}
		if (beforeSendTransaction) {
			if (processedEvent.spans) {
				// We store the # of spans before processing in SDK metadata,
				// so we can compare it afterwards to determine how many spans were dropped
				const spanCountBefore = processedEvent.spans.length;
				processedEvent.sdkProcessingMetadata = {
					...event.sdkProcessingMetadata,
					spanCountBeforeProcessing: spanCountBefore
				};
			}
			return beforeSendTransaction(processedEvent, hint);
		}
	}
	return processedEvent;
}
function isErrorEvent(event) {
	return event.type === void 0;
}
function isTransactionEvent(event) {
	return event.type === "transaction";
}
/**
* Estimate the size of a metric in bytes.
*
* @param metric - The metric to estimate the size of.
* @returns The estimated size of the metric in bytes.
*/
function estimateMetricSizeInBytes(metric) {
	let weight = 0;
	// Estimate byte size of 2 bytes per character. This is a rough estimate JS strings are stored as UTF-16.
	if (metric.name) {
		weight += metric.name.length * 2;
	}
	// Add weight for number
	weight += 8;
	return weight + estimateAttributesSizeInBytes(metric.attributes);
}
/**
* Estimate the size of attributes in bytes.
*
* @param attributes - The attributes object to estimate the size of.
* @returns The estimated size of the attributes in bytes.
*/
function estimateAttributesSizeInBytes(attributes) {
	if (!attributes) {
		return 0;
	}
	let weight = 0;
	Object.values(attributes).forEach((value) => {
		if (Array.isArray(value)) {
			weight += value.length * estimatePrimitiveSizeInBytes(value[0]);
		} else if (isPrimitive(value)) {
			weight += estimatePrimitiveSizeInBytes(value);
		} else {
			// For objects values, we estimate the size of the object as 100 bytes
			weight += 100;
		}
	});
	return weight;
}
function estimatePrimitiveSizeInBytes(value) {
	if (typeof value === "string") {
		return value.length * 2;
	} else if (typeof value === "number") {
		return 8;
	} else if (typeof value === "boolean") {
		return 4;
	}
	return 0;
}
function hasSentryFetchUrlHost(error) {
	return isError(error) && "__sentry_fetch_url_host__" in error && typeof error.__sentry_fetch_url_host__ === "string";
}
/**
* Enhances the error message with the hostname for better Sentry error reporting.
* This allows third-party packages to still match on the original error message,
* while Sentry gets the enhanced version with context.
*
* Only used internally
* @hidden
*/
function _enhanceErrorWithSentryInfo(error) {
	// If the error has a __sentry_fetch_url_host__ property (added by fetch instrumentation),
	// enhance the error message with the hostname.
	if (hasSentryFetchUrlHost(error)) {
		return `${error.message} (${error.__sentry_fetch_url_host__})`;
	}
	return error.message;
}
/** A class object that can instantiate Client objects. */
/**
* Internal function to create a new SDK client instance. The client is
* installed and then bound to the current scope.
*
* @param clientClass The client class to instantiate.
* @param options Options to pass to the client.
*/
function initAndBind(clientClass, options) {
	const scope = getCurrentScope();
	scope.update(void 0);
	const client = new clientClass(options);
	setCurrentClient(client);
	client.init();
	return client;
}
/**
* Make the given client the current client.
*/
function setCurrentClient(client) {
	getCurrentScope().setClient(client);
}
/**
* Parses string form of URL into an object
* // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
* // intentionally using regex and not <a/> href parsing trick because React Native and other
* // environments where DOM might not be available
* @returns parsed URL object
*/
function parseUrl(url) {
	if (!url) {
		return {};
	}
	const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
	if (!match) {
		return {};
	}
	// coerce to undefined values to empty string so we don't get 'undefined'
	const query = match[6] || "";
	const fragment = match[8] || "";
	return {
		a: match[4],
		b: match[5],
		c: match[2],
		d: match[5] + query + fragment
	};
}
/**
* Strips the content from a data URL, returning a placeholder with the MIME type.
*
* Data URLs can be very long (e.g. base64 encoded scripts for Web Workers),
* with little valuable information, often leading to envelopes getting dropped due
* to size limit violations. Therefore, we strip data URLs and replace them with a
* placeholder.
*
* @param url - The URL to process
* @param includeDataPrefix - If true, includes the first 10 characters of the data stream
*                            for debugging (e.g., to identify magic bytes like WASM's AGFzbQ).
*                            Defaults to true.
* @returns For data URLs, returns a short format like `data:text/javascript;base64,SGVsbG8gV2... [truncated]`.
*          For non-data URLs, returns the original URL unchanged.
*/
function stripDataUrlContent(url) {
	if (url.startsWith("data:")) {
		// Match the MIME type (everything after 'data:' until the first ';' or ',')
		const match = url.match(/^data:([^;,]+)/);
		const mimeType = match ? match[1] : "text/plain";
		const isBase64 = url.includes(";base64,");
		// Find where the actual data starts (after the comma)
		url.indexOf(",");
		return `data:${mimeType}${isBase64 ? ",base64" : ""}${""}`;
	}
	return url;
}
// By default, we want to infer the IP address, unless this is explicitly set to `null`
// We do this after all other processing is done
// If `ip_address` is explicitly set to `null` or a value, we leave it as is
/**
* @internal
*/
function addAutoIpAddressToSession(session) {
	if ("aggregates" in session) {
		if (session.attrs?.["ip_address"] === void 0) {
			session.attrs = {
				...session.attrs,
				ip_address: "{{auto}}"
			};
		}
	} else {
		if (session.ipAddress === void 0) {
			session.ipAddress = "{{auto}}";
		}
	}
}
/**
* A builder for the SDK metadata in the options for the SDK initialization.
*
* Note: This function is identical to `buildMetadata` in Remix and NextJS and SvelteKit.
* We don't extract it for bundle size reasons.
* @see https://github.com/getsentry/sentry-javascript/pull/7404
* @see https://github.com/getsentry/sentry-javascript/pull/4196
*
* If you make changes to this function consider updating the others as well.
*
* @param options SDK options object that gets mutated
* @param names list of package names
*/
function applySdkMetadata(options, __unused_7E18, names, source) {
	const metadata = {};
	{
		{
			metadata.sdk = {
				name: `sentry.javascript.${"browser"}`,
				packages: names.map((name) => ({
					name: `${source}:@sentry/${name}`,
					version: "10.38.0"
				})),
				version: "10.38.0"
			};
		}
	}
	options._metadata = metadata;
}
/**
* Records a new breadcrumb which will be attached to future events.
*
* Breadcrumbs will be added to subsequent events to provide more context on
* user's actions prior to an error or crash.
*/
function addBreadcrumb(breadcrumb, hint) {
	const client = getClient();
	const isolationScope = getIsolationScope();
	if (!client) return;
	const { beforeBreadcrumb = null, maxBreadcrumbs = 100 } = client.getOptions();
	if (maxBreadcrumbs <= 0) return;
	const timestamp = dateTimestampInSeconds();
	const mergedBreadcrumb = {
		timestamp,
		...breadcrumb
	};
	const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
	if (finalBreadcrumb === null) return;
	if (client.emit) {
		client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
	}
	isolationScope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
}
let originalFunctionToString;
const SETUP_CLIENTS = new WeakMap();
const _functionToStringIntegration = () => {
	return {
		name: "FunctionToString",
		setupOnce() {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			originalFunctionToString = Function.prototype.toString;
			// intrinsics (like Function.prototype) might be immutable in some environments
			// e.g. Node with --frozen-intrinsics, XS (an embedded JavaScript engine) or SES (a JavaScript proposal)
			try {
				Function.prototype.toString = function(...args) {
					const originalFunction = getOriginalFunction(this);
					const context = SETUP_CLIENTS.has(getClient()) && originalFunction !== void 0 ? originalFunction : this;
					return originalFunctionToString.apply(context, args);
				};
			} catch {}
		},
		setup(client) {
			SETUP_CLIENTS.set(client, true);
		}
	};
};
/**
* Patch toString calls to return proper name for wrapped functions.
*
* ```js
* Sentry.init({
*   integrations: [
*     functionToStringIntegration(),
*   ],
* });
* ```
*/
const functionToStringIntegration = defineIntegration(_functionToStringIntegration);
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
const DEFAULT_IGNORE_ERRORS = [
	/^Script error\.?$/,
	/^Javascript error: Script error\.? on line 0$/,
	/^ResizeObserver loop completed with undelivered notifications.$/,
	/^Cannot redefine property: googletag$/,
	/^Can't find variable: gmo$/,
	/^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
	"can't redefine non-configurable property \"solana\"",
	"vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
	"Can't find variable: _AutofillCallbackHandler",
	/^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
	/^Java exception was raised during method invocation$/
];
/**
* An integration that filters out events (errors and transactions) based on:
*
* - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
* - (Errors) A list of error messages or urls/filenames passed in via
*   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
*   - The same options passed to the integration directly via @param options
* - (Transactions/Spans) A list of root span (transaction) names passed in via
*   - Top level Sentry.init option (`ignoreTransactions`)
*   - The same option passed to the integration directly via @param options
*
* Events filtered by this integration will not be sent to Sentry.
*/
const eventFiltersIntegration = defineIntegration(() => {
	let mergedOptions;
	return {
		setup(client) {
			const clientOptions = client.getOptions();
			mergedOptions = _mergeOptions(0, clientOptions);
		},
		processEvent(event, __unused_0D54, client) {
			if (!mergedOptions) {
				const clientOptions = client.getOptions();
				mergedOptions = _mergeOptions(0, clientOptions);
			}
			return _shouldDropEvent$1(event, mergedOptions) ? null : event;
		}
	};
});
/**
* An integration that filters out events (errors and transactions) based on:
*
* - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
* - (Errors) A list of error messages or urls/filenames passed in via
*   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
*   - The same options passed to the integration directly via @param options
* - (Transactions/Spans) A list of root span (transaction) names passed in via
*   - Top level Sentry.init option (`ignoreTransactions`)
*   - The same option passed to the integration directly via @param options
*
* Events filtered by this integration will not be sent to Sentry.
*
* @deprecated this integration was renamed and will be removed in a future major version.
* Use `eventFiltersIntegration` instead.
*/
const inboundFiltersIntegration = defineIntegration(() => {
	return {
		...eventFiltersIntegration(),
		name: "InboundFilters"
	};
});
function _mergeOptions(__unused_143A, clientOptions = {}) {
	return {
		allowUrls: [...clientOptions.allowUrls || []],
		denyUrls: [...clientOptions.denyUrls || []],
		ignoreErrors: [...clientOptions.ignoreErrors || [], ...DEFAULT_IGNORE_ERRORS],
		ignoreTransactions: [...clientOptions.ignoreTransactions || []]
	};
}
function _shouldDropEvent$1(event, options) {
	if (!event.type) {
		// Filter errors
		if (_isIgnoredError(event, options.ignoreErrors)) {
			DEBUG_BUILD$2 && debug.b(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${getEventDescription(event)}`);
			return true;
		}
		if (_isUselessError(event)) {
			DEBUG_BUILD$2 && debug.b(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${getEventDescription(event)}`);
			return true;
		}
		if (_isDeniedUrl(event, options.denyUrls)) {
			DEBUG_BUILD$2 && debug.b(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${getEventDescription(event)}.
Url: ${_getEventFilterUrl(event)}`);
			return true;
		}
		if (!_isAllowedUrl(event, options.allowUrls)) {
			DEBUG_BUILD$2 && debug.b(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${getEventDescription(event)}.
Url: ${_getEventFilterUrl(event)}`);
			return true;
		}
	} else if (event.type === "transaction") {
		// Filter transactions
		if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
			DEBUG_BUILD$2 && debug.b(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${getEventDescription(event)}`);
			return true;
		}
	}
	return false;
}
function _isIgnoredError(event, ignoreErrors) {
	if (!ignoreErrors?.length) {
		return false;
	}
	return getPossibleEventMessages(event).some((message) => stringMatchesSomePattern(message, ignoreErrors));
}
function _isIgnoredTransaction(event, ignoreTransactions) {
	if (!ignoreTransactions?.length) {
		return false;
	}
	const name = event.transaction;
	return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
}
function _isDeniedUrl(event, denyUrls) {
	if (!denyUrls?.length) {
		return false;
	}
	const url = _getEventFilterUrl(event);
	return !url ? false : stringMatchesSomePattern(url, denyUrls);
}
function _isAllowedUrl(event, allowUrls) {
	if (!allowUrls?.length) {
		return true;
	}
	const url = _getEventFilterUrl(event);
	return !url ? true : stringMatchesSomePattern(url, allowUrls);
}
function _getLastValidUrl(frames = []) {
	for (let i = frames.length - 1; i >= 0; i--) {
		const frame = frames[i];
		if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]") {
			return frame.filename || null;
		}
	}
	return null;
}
function _getEventFilterUrl(event) {
	try {
		// If there are linked exceptions or exception aggregates we only want to match against the top frame of the "root" (the main exception)
		// The root always comes last in linked exceptions
		const rootException = [...event.exception?.values ?? []].reverse().find((value) => value.mechanism?.parent_id === void 0 && value.stacktrace?.frames?.length);
		const frames = rootException?.stacktrace?.frames;
		return frames ? _getLastValidUrl(frames) : null;
	} catch {
		DEBUG_BUILD$2 && debug.c(`Cannot extract url for event ${getEventDescription(event)}`);
		return null;
	}
}
function _isUselessError(event) {
	// We only want to consider events for dropping that actually have recorded exception values.
	if (!event.exception?.values?.length) {
		return false;
	}
	return !event.message && !event.exception.values.some((value) => value.stacktrace || value.type && value.type !== "Error" || value.value);
}
/**
* Creates exceptions inside `event.exception.values` for errors that are nested on properties based on the `key` parameter.
*/
function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, __unused_1E50, __unused_DC8A, event, hint) {
	if (!event.exception?.values || !hint || !isInstanceOf(hint.originalException, Error)) {
		return;
	}
	// Generally speaking the last item in `event.exception.values` is the exception originating from the original Error
	const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : void 0;
	// We only create exception grouping if there is an exception in the event.
	if (originalException) {
		event.exception.values = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, 5, hint.originalException, "cause", event.exception.values, originalException, 0);
	}
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error, key, prevExceptions, exception, exceptionId) {
	if (prevExceptions.length >= limit + 1) {
		return prevExceptions;
	}
	let newExceptions = [...prevExceptions];
	// Recursively call this function in order to walk down a chain of errors
	if (isInstanceOf(error[key], Error)) {
		applyExceptionGroupFieldsForParentException(exception, exceptionId, error);
		const newException = exceptionFromErrorImplementation(parser, error[key]);
		const newExceptionId = newExceptions.length;
		applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId);
		newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error[key], key, [newException, ...newExceptions], newException, newExceptionId);
	}
	// This will create exception grouping for AggregateErrors
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
	if (isExceptionGroup(error)) {
		error.errors.forEach((childError, i) => {
			if (isInstanceOf(childError, Error)) {
				applyExceptionGroupFieldsForParentException(exception, exceptionId, error);
				const newException = exceptionFromErrorImplementation(parser, childError);
				const newExceptionId = newExceptions.length;
				applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId);
				newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, childError, key, [newException, ...newExceptions], newException, newExceptionId);
			}
		});
	}
	return newExceptions;
}
function isExceptionGroup(error) {
	return Array.isArray(error.errors);
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId, error) {
	exception.mechanism = {
		handled: true,
		type: "auto.core.linked_errors",
		...isExceptionGroup(error) && { is_exception_group: true },
		...exception.mechanism,
		exception_id: exceptionId
	};
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
	exception.mechanism = {
		handled: true,
		...exception.mechanism,
		type: "chained",
		source,
		exception_id: exceptionId,
		parent_id: parentId
	};
}
/**
* Add an instrumentation handler for when a console.xxx method is called.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addConsoleInstrumentationHandler(handler) {
	addHandler("console", handler);
	maybeInstrument("console", instrumentConsole);
}
function instrumentConsole() {
	if (!("console" in GLOBAL_OBJ)) {
		return;
	}
	CONSOLE_LEVELS.forEach(function(level) {
		if (!(level in GLOBAL_OBJ.console)) {
			return;
		}
		fill(GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
			originalConsoleMethods[level] = originalConsoleMethod;
			return function(...args) {
				const handlerData = {
					args,
					level
				};
				triggerHandlers("console", handlerData);
				const log = originalConsoleMethods[level];
				log?.apply(GLOBAL_OBJ.console, args);
			};
		});
	});
}
/**
* Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
*
* @param level String representation of desired `SeverityLevel`.
* @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
*/
function severityLevelFromString(level) {
	return level === "warn" ? "warning" : [
		"fatal",
		"error",
		"warning",
		"log",
		"info",
		"debug"
	].includes(level) ? level : "log";
}
const _dedupeIntegration = () => {
	let previousEvent;
	return {
		name: "Dedupe",
		processEvent(currentEvent) {
			// We want to ignore any non-error type events, e.g. transactions or replays
			// These should never be deduped, and also not be compared against as _previousEvent.
			if (currentEvent.type) {
				return currentEvent;
			}
			// Juuust in case something goes wrong
			try {
				if (_shouldDropEvent(currentEvent, previousEvent)) {
					DEBUG_BUILD$2 && debug.b("Event dropped due to being a duplicate of previously captured event.");
					return null;
				}
			} catch {}
			return previousEvent = currentEvent;
		}
	};
};
/**
* Deduplication filter.
*/
const dedupeIntegration = defineIntegration(_dedupeIntegration);
/** only exported for tests. */
function _shouldDropEvent(currentEvent, previousEvent) {
	if (!previousEvent) {
		return false;
	}
	if (_isSameMessageEvent(currentEvent, previousEvent)) {
		return true;
	}
	if (_isSameExceptionEvent(currentEvent, previousEvent)) {
		return true;
	}
	return false;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
	const currentMessage = currentEvent.message;
	const previousMessage = previousEvent.message;
	// If neither event has a message property, they were both exceptions, so bail out
	if (!currentMessage && !previousMessage) {
		return false;
	}
	// If only one event has a stacktrace, but not the other one, they are not the same
	if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
		return false;
	}
	if (currentMessage !== previousMessage) {
		return false;
	}
	if (!_isSameFingerprint(currentEvent, previousEvent)) {
		return false;
	}
	if (!_isSameStacktrace(currentEvent, previousEvent)) {
		return false;
	}
	return true;
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
	const previousException = _getExceptionFromEvent(previousEvent);
	const currentException = _getExceptionFromEvent(currentEvent);
	if (!previousException || !currentException) {
		return false;
	}
	if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
		return false;
	}
	if (!_isSameFingerprint(currentEvent, previousEvent)) {
		return false;
	}
	if (!_isSameStacktrace(currentEvent, previousEvent)) {
		return false;
	}
	return true;
}
function _isSameStacktrace(currentEvent, previousEvent) {
	let currentFrames = getFramesFromEvent(currentEvent);
	let previousFrames = getFramesFromEvent(previousEvent);
	// If neither event has a stacktrace, they are assumed to be the same
	if (!currentFrames && !previousFrames) {
		return true;
	}
	// If only one event has a stacktrace, but not the other one, they are not the same
	if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
		return false;
	}
	currentFrames = currentFrames;
	previousFrames = previousFrames;
	// If number of frames differ, they are not the same
	if (previousFrames.length !== currentFrames.length) {
		return false;
	}
	// Otherwise, compare the two
	for (let i = 0; i < previousFrames.length; i++) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const frameA = previousFrames[i];
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const frameB = currentFrames[i];
		if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
			return false;
		}
	}
	return true;
}
function _isSameFingerprint(currentEvent, previousEvent) {
	let currentFingerprint = currentEvent.fingerprint;
	let previousFingerprint = previousEvent.fingerprint;
	// If neither event has a fingerprint, they are assumed to be the same
	if (!currentFingerprint && !previousFingerprint) {
		return true;
	}
	// If only one event has a fingerprint, but not the other one, they are not the same
	if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
		return false;
	}
	currentFingerprint = currentFingerprint;
	previousFingerprint = previousFingerprint;
	// Otherwise, compare the two
	try {
		return !!(currentFingerprint.join("") === previousFingerprint.join(""));
	} catch {
		return false;
	}
}
function _getExceptionFromEvent(event) {
	return event.exception?.values?.[0];
}
const _conversationIdIntegration = () => {
	return {
		name: "ConversationId",
		setup(client) {
			client.on("spanStart", (span) => {
				const scopeData = getCurrentScope().getScopeData();
				const isolationScopeData = getIsolationScope().getScopeData();
				const conversationId = scopeData.conversationId || isolationScopeData.conversationId;
				if (conversationId) {
					span.setAttribute("gen_ai.conversation.id", conversationId);
				}
			});
		}
	};
};
/**
* Automatically applies conversation ID from scope to spans.
*
* This integration reads the conversation ID from the current or isolation scope
* and applies it to spans when they start. This ensures the conversation ID is
* available for all AI-related operations.
*/
const conversationIdIntegration = defineIntegration(_conversationIdIntegration);
/**
* Determine a breadcrumb's log level (only `warning` or `error`) based on an HTTP status code.
*/
function getBreadcrumbLogLevelFromHttpStatusCode(statusCode) {
	// NOTE: undefined defaults to 'info' in Sentry
	if (statusCode === void 0) {
		return void 0;
	} else if (statusCode >= 400 && statusCode < 500) {
		return "warning";
	} else if (statusCode >= 500) {
		return "error";
	} else {
		return void 0;
	}
}
const WINDOW$2 = GLOBAL_OBJ;
/**
* Tells whether current environment supports History API
* {@link supportsHistory}.
*
* @returns Answer to the given question.
*/
function supportsHistory() {
	return "history" in WINDOW$2 && !!WINDOW$2.history;
}
/**
* isNative checks if the given function is a native implementation
*/
// eslint-disable-next-line @typescript-eslint/ban-types
function isNativeFunction(func) {
	return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
* Add an instrumentation handler for when a fetch request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addFetchInstrumentationHandler(handler) {
	addHandler("fetch", handler);
	maybeInstrument("fetch", () => instrumentFetch());
}
function instrumentFetch() {
	fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
		return function(...args) {
			// We capture the error right here and not in the Promise error callback because Safari (and probably other
			// browsers too) will wipe the stack trace up to this point, only leaving us with this file which is useless.
			// NOTE: If you are a Sentry user, and you are seeing this stack frame,
			//       it means the error, that was caused by your fetch call did not
			//       have a stack trace, so the SDK backfilled the stack trace so
			//       you can see which fetch call failed.
			const virtualError = new Error();
			const { a: method, b: url } = parseFetchArgs(args);
			const handlerData = {
				args,
				fetchData: {
					method,
					url
				},
				startTimestamp: timestampInSeconds() * 1e3,
				virtualError,
				headers: getHeadersFromFetchArgs(args)
			};
			// if there is no callback, fetch is instrumented directly
			{
				triggerHandlers("fetch", { ...handlerData });
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return originalFetch.apply(GLOBAL_OBJ, args).then(async (response) => {
				{
					triggerHandlers("fetch", {
						...handlerData,
						endTimestamp: timestampInSeconds() * 1e3,
						response
					});
				}
				return response;
			}, (error) => {
				triggerHandlers("fetch", {
					...handlerData,
					endTimestamp: timestampInSeconds() * 1e3,
					error
				});
				if (isError(error) && error.stack === void 0) {
					// NOTE: If you are a Sentry user, and you are seeing this stack frame,
					//       it means the error, that was caused by your fetch call did not
					//       have a stack trace, so the SDK backfilled the stack trace so
					//       you can see which fetch call failed.
					error.stack = virtualError.stack;
					addNonEnumerableProperty(error, "framesToPop", 1);
				}
				// We enhance fetch error messages with hostname information based on the configuration.
				// Possible messages we handle here:
				// * "Failed to fetch" (chromium)
				// * "Load failed" (webkit)
				// * "NetworkError when attempting to fetch resource." (firefox)
				const client = getClient();
				const enhanceOption = client?.getOptions().enhanceFetchErrorMessages ?? "always";
				const shouldEnhance = enhanceOption !== false;
				if (shouldEnhance && error instanceof TypeError && (error.message === "Failed to fetch" || error.message === "Load failed" || error.message === "NetworkError when attempting to fetch resource.")) {
					try {
						const url = new URL(handlerData.fetchData.url);
						const hostname = url.host;
						if (enhanceOption === "always") {
							// Modify the error message directly
							error.message = `${error.message} (${hostname})`;
						} else {
							// Store hostname as non-enumerable property for Sentry-only enhancement
							// This preserves the original error message for third-party packages
							addNonEnumerableProperty(error, "__sentry_fetch_url_host__", hostname);
						}
					} catch {}
				}
				// NOTE: If you are a Sentry user, and you are seeing this stack frame,
				//       it means the sentry.javascript SDK caught an error invoking your application code.
				//       This is expected behavior and NOT indicative of a bug with sentry.javascript.
				throw error;
			});
		};
	});
}
function hasProp(obj, prop) {
	return !!obj && typeof obj === "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
	if (typeof resource === "string") {
		return resource;
	}
	if (!resource) {
		return "";
	}
	if (hasProp(resource, "url")) {
		return resource.url;
	}
	if (resource.toString) {
		return resource.toString();
	}
	return "";
}
/**
* Parses the fetch arguments to find the used Http method and the url of the request.
* Exported for tests only.
*/
function parseFetchArgs(fetchArgs) {
	if (fetchArgs.length === 0) {
		return {
			a: "GET",
			b: ""
		};
	}
	if (fetchArgs.length === 2) {
		const [resource, options] = fetchArgs;
		return {
			b: getUrlFromResource(resource),
			a: hasProp(options, "method") ? String(options.method).toUpperCase() : isRequest(resource) && hasProp(resource, "method") ? String(resource.method).toUpperCase() : "GET"
		};
	}
	const arg = fetchArgs[0];
	return {
		b: getUrlFromResource(arg),
		a: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
	};
}
function getHeadersFromFetchArgs(fetchArgs) {
	const [requestArgument, optionsArgument] = fetchArgs;
	try {
		if (typeof optionsArgument === "object" && optionsArgument !== null && "headers" in optionsArgument && optionsArgument.headers) {
			return new Headers(optionsArgument.headers);
		}
		if (isRequest(requestArgument)) {
			return new Headers(requestArgument.headers);
		}
	} catch {}
	return;
}
const WINDOW$1 = GLOBAL_OBJ;
let ignoreOnError = 0;
/**
* @hidden
*/
function shouldIgnoreOnError() {
	return ignoreOnError > 0;
}
/**
* @hidden
*/
function ignoreNextOnError() {
	// onerror should trigger before setTimeout
	ignoreOnError++;
	setTimeout(() => {
		ignoreOnError--;
	});
}
// eslint-disable-next-line @typescript-eslint/ban-types
/**
* Instruments the given function and sends an event to Sentry every time the
* function throws an exception.
*
* @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
* has a correct `this` context.
* @returns The wrapped function.
* @hidden
*/
function wrap(fn, options = {}) {
	// for future readers what this does is wrap a function and then create
	// a bi-directional wrapping between them.
	//
	// example: wrapped = wrap(original);
	//  original.__sentry_wrapped__ -> wrapped
	//  wrapped.__sentry_original__ -> original
	function isFunction(fn) {
		return typeof fn === "function";
	}
	if (!isFunction(fn)) {
		return fn;
	}
	try {
		// if we're dealing with a function that was previously wrapped, return
		// the original wrapper.
		const wrapper = fn.__sentry_wrapped__;
		if (wrapper) {
			if (typeof wrapper === "function") {
				return wrapper;
			} else {
				// If we find that the `__sentry_wrapped__` function is not a function at the time of accessing it, it means
				// that something messed with it. In that case we want to return the originally passed function.
				return fn;
			}
		}
		// We don't wanna wrap it twice
		if (getOriginalFunction(fn)) {
			return fn;
		}
	} catch {
		// Just accessing custom props in some Selenium environments
		// can cause a "Permission denied" exception (see raven-js#495).
		// Bail on wrapping and return the function as-is (defers to window.onerror).
		return fn;
	}
	// Wrap the function itself
	// It is important that `sentryWrapped` is not an arrow function to preserve the context of `this`
	const sentryWrapped = function(...args) {
		try {
			// Also wrap arguments that are themselves functions
			const wrappedArguments = args.map((arg) => wrap(arg, options));
			// Attempt to invoke user-land function
			// NOTE: If you are a Sentry user, and you are seeing this stack frame, it
			//       means the sentry.javascript SDK caught an error invoking your application code. This
			//       is expected behavior and NOT indicative of a bug with sentry.javascript.
			return fn.apply(this, wrappedArguments);
		} catch (ex) {
			ignoreNextOnError();
			withScope((scope) => {
				scope.addEventProcessor((event) => {
					if (options.mechanism) {
						addExceptionTypeValue(event, void 0);
						addExceptionMechanism(event, options.mechanism);
					}
					event.extra = {
						...event.extra,
						arguments: args
					};
					return event;
				});
				// no need to add a mechanism here, we already add it via an event processor above
				captureException(ex);
			});
			throw ex;
		}
	};
	// Wrap the wrapped function in a proxy, to ensure any other properties of the original function remain available
	try {
		for (const property in fn) {
			if (Object.prototype.hasOwnProperty.call(fn, property)) {
				sentryWrapped[property] = fn[property];
			}
		}
	} catch {}
	// Signal that this function has been wrapped/filled already
	// for both debugging and to prevent it to being wrapped/filled twice
	markFunctionWrapped(sentryWrapped, fn);
	addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped);
	// Restore original function name (not all browsers allow that)
	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, "name");
		if (descriptor.configurable) {
			Object.defineProperty(sentryWrapped, "name", { get() {
				return fn.name;
			} });
		}
	} catch {}
	return sentryWrapped;
}
/**
* Get HTTP request data from the current page.
*/
function getHttpRequestData() {
	// grab as much info as exists and add it to the event
	const url = getLocationHref();
	const { referrer } = WINDOW$1.document || {};
	const { userAgent } = WINDOW$1.navigator || {};
	const headers = {
		...referrer && { Referer: referrer },
		...userAgent && { "User-Agent": userAgent }
	};
	const request = {
		url,
		headers
	};
	return request;
}
/**
* This function creates an exception from a JavaScript Error
*/
function exceptionFromError(stackParser, ex) {
	// Get the frames first since Opera can lose the stack if we touch anything else first
	const frames = parseStackFrames(stackParser, ex);
	const exception = {
		type: extractType(ex),
		value: extractMessage(ex)
	};
	if (frames.length) {
		exception.stacktrace = { frames };
	}
	if (exception.type === void 0 && exception.value === "") {
		exception.value = "Unrecoverable error caught";
	}
	return exception;
}
function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
	const client = getClient();
	const normalizeDepth = client?.getOptions().normalizeDepth;
	// If we can, we extract an exception from the object properties
	const errorFromProp = getErrorPropertyFromObject(exception);
	const extra = { __serialized__: normalizeToSize(exception, normalizeDepth) };
	if (errorFromProp) {
		return {
			exception: { values: [exceptionFromError(stackParser, errorFromProp)] },
			extra
		};
	}
	const event = {
		exception: { values: [{
			type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
			value: getNonErrorObjectExceptionValue(exception, { a: isUnhandledRejection })
		}] },
		extra
	};
	if (syntheticException) {
		const frames = parseStackFrames(stackParser, syntheticException);
		if (frames.length) {
			// event.exception.values[0] has been set above
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			event.exception.values[0].stacktrace = { frames };
		}
	}
	return event;
}
function eventFromError(stackParser, ex) {
	return { exception: { values: [exceptionFromError(stackParser, ex)] } };
}
/** Parses stack frames from an error */
function parseStackFrames(stackParser, ex) {
	// Access and store the stacktrace property before doing ANYTHING
	// else to it because Opera is not very good at providing it
	// reliably in other circumstances.
	const stacktrace = ex.stacktrace || ex.stack || "";
	const skipLines = getSkipFirstStackStringLines(ex);
	const framesToPop = getPopFirstTopFrames(ex);
	try {
		return stackParser(stacktrace, skipLines, framesToPop);
	} catch {}
	return [];
}
// Based on our own mapping pattern - https://github.com/getsentry/sentry/blob/9f08305e09866c8bd6d0c24f5b0aabdd7dd6c59c/src/sentry/lang/javascript/errormapping.py#L83-L108
const reactMinifiedRegexp = /Minified React error #\d+;/i;
/**
* Certain known React errors contain links that would be falsely
* parsed as frames. This function check for these errors and
* returns number of the stack string lines to skip.
*/
function getSkipFirstStackStringLines(ex) {
	if (ex && reactMinifiedRegexp.test(ex.message)) {
		return 1;
	}
	return 0;
}
/**
* If error has `framesToPop` property, it means that the
* creator tells us the first x frames will be useless
* and should be discarded. Typically error from wrapper function
* which don't point to the actual location in the developer's code.
*
* Example: https://github.com/zertosh/invariant/blob/master/invariant.js#L46
*/
function getPopFirstTopFrames(ex) {
	if (typeof ex.framesToPop === "number") {
		return ex.framesToPop;
	}
	return 0;
}
// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Exception
// @ts-expect-error - WebAssembly.Exception is a valid class
function isWebAssemblyException(exception) {
	// Check for support
	// @ts-expect-error - WebAssembly.Exception is a valid class
	if (typeof WebAssembly !== "undefined" && typeof WebAssembly.Exception !== "undefined") {
		// @ts-expect-error - WebAssembly.Exception is a valid class
		return exception instanceof WebAssembly.Exception;
	} else {
		return false;
	}
}
/**
* Extracts from errors what we use as the exception `type` in error events.
*
* Usually, this is the `name` property on Error objects but WASM errors need to be treated differently.
*/
function extractType(ex) {
	const name = ex?.name;
	// The name for WebAssembly.Exception Errors needs to be extracted differently.
	// Context: https://github.com/getsentry/sentry-javascript/issues/13787
	if (!name && isWebAssemblyException(ex)) {
		// Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
		const hasTypeInMessage = ex.message && Array.isArray(ex.message) && ex.message.length == 2;
		return hasTypeInMessage ? ex.message[0] : "WebAssembly.Exception";
	}
	return name;
}
/**
* There are cases where stacktrace.message is an Event object
* https://github.com/getsentry/sentry-javascript/issues/1949
* In this specific case we try to extract stacktrace.message.error.message
*/
function extractMessage(ex) {
	const message = ex?.message;
	if (isWebAssemblyException(ex)) {
		// For Node 18, Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
		if (Array.isArray(ex.message) && ex.message.length == 2) {
			return ex.message[1];
		}
		return "wasm exception";
	}
	if (!message) {
		return "No error message";
	}
	if (message.error && typeof message.error.message === "string") {
		return _enhanceErrorWithSentryInfo(message.error);
	}
	return _enhanceErrorWithSentryInfo(ex);
}
/**
* Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
* @hidden
*/
function eventFromException(stackParser, exception, hint, attachStacktrace) {
	const syntheticException = hint?.syntheticException || void 0;
	const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
	addExceptionMechanism(event);
	event.level = "error";
	if (hint?.event_id) {
		event.event_id = hint.event_id;
	}
	return resolvedSyncPromise(event);
}
/**
* Builds and Event from a Message
* @hidden
*/
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
	const syntheticException = hint?.syntheticException || void 0;
	const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
	event.level = level;
	if (hint?.event_id) {
		event.event_id = hint.event_id;
	}
	return resolvedSyncPromise(event);
}
/**
* @hidden
*/
function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
	let event;
	if (isErrorEvent$1(exception) && exception.error) {
		// If it is an ErrorEvent with `error` property, extract it to get actual Error
		const errorEvent = exception;
		return eventFromError(stackParser, errorEvent.error);
	}
	// If it is a `DOMError` (which is a legacy API, but still supported in some browsers) then we just extract the name
	// and message, as it doesn't provide anything else. According to the spec, all `DOMExceptions` should also be
	// `Error`s, but that's not the case in IE11, so in that case we treat it the same as we do a `DOMError`.
	//
	// https://developer.mozilla.org/en-US/docs/Web/API/DOMError
	// https://developer.mozilla.org/en-US/docs/Web/API/DOMException
	// https://webidl.spec.whatwg.org/#es-DOMException-specialness
	if (isDOMError(exception) || isDOMException(exception)) {
		const domException = exception;
		if ("stack" in exception) {
			event = eventFromError(stackParser, exception);
		} else {
			const name = domException.name || (isDOMError(domException) ? "DOMError" : "DOMException");
			const message = domException.message ? `${name}: ${domException.message}` : name;
			event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
			addExceptionTypeValue(event, message);
		}
		if ("code" in domException) {
			// eslint-disable-next-line deprecation/deprecation
			event.tags = {
				...void 0,
				"DOMException.code": `${domException.code}`
			};
		}
		return event;
	}
	if (isError(exception)) {
		// we have a real Error object, do nothing
		return eventFromError(stackParser, exception);
	}
	if (isPlainObject(exception) || isEvent(exception)) {
		// If it's a plain object or an instance of `Event` (the built-in JS kind, not this SDK's `Event` type), serialize
		// it manually. This will allow us to group events based on top-level keys which is much better than creating a new
		// group on any key/value change.
		const objectException = exception;
		event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
		addExceptionMechanism(event, { synthetic: true });
		return event;
	}
	// If none of previous checks were valid, then it means that it's not:
	// - an instance of DOMError
	// - an instance of DOMException
	// - an instance of Event
	// - an instance of Error
	// - a valid ErrorEvent (one with an error property)
	// - a plain Object
	//
	// So bail out and capture it as a simple message:
	event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
	addExceptionTypeValue(event, `${exception}`);
	addExceptionMechanism(event, { synthetic: true });
	return event;
}
function eventFromString(stackParser, message, syntheticException, attachStacktrace) {
	const event = {};
	if (attachStacktrace && syntheticException) {
		const frames = parseStackFrames(stackParser, syntheticException);
		if (frames.length) {
			event.exception = { values: [{
				value: message,
				stacktrace: { frames }
			}] };
		}
		addExceptionMechanism(event, { synthetic: true });
	}
	if (isParameterizedString(message)) {
		const { __sentry_template_string__, __sentry_template_values__ } = message;
		event.logentry = {
			message: __sentry_template_string__,
			params: __sentry_template_values__
		};
		return event;
	}
	event.message = message;
	return event;
}
function getNonErrorObjectExceptionValue(exception, { a: isUnhandledRejection }) {
	const keys = extractExceptionKeysForMessage(exception);
	const captureType = isUnhandledRejection ? "promise rejection" : "exception";
	// Some ErrorEvent instances do not have an `error` property, which is why they are not handled before
	// We still want to try to get a decent message for these cases
	if (isErrorEvent$1(exception)) {
		return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
	}
	if (isEvent(exception)) {
		const className = getObjectClassName(exception);
		return `Event \`${className}\` (type=${exception.type}) captured as ${captureType}`;
	}
	return `Object captured as ${captureType} with keys: ${keys}`;
}
function getObjectClassName(obj) {
	try {
		const prototype = Object.getPrototypeOf(obj);
		return prototype ? prototype.constructor.name : void 0;
	} catch {}
}
/** If a plain object has a property that is an `Error`, return this error. */
function getErrorPropertyFromObject(obj) {
	for (const prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			const value = obj[prop];
			if (value instanceof Error) {
				return value;
			}
		}
	}
	return void 0;
}
/**
* A magic string that build tooling can leverage in order to inject a release value into the SDK.
*/
/**
* The Sentry Browser SDK Client.
*
* @see BrowserOptions for documentation on configuration options.
* @see SentryClient for usage documentation.
*/
class BrowserClient extends Client {
	/**
	* Creates a new Browser SDK instance.
	*
	* @param options Configuration options for this SDK.
	*/
	constructor(options) {
		const opts = applyDefaultOptions(options);
		const sdkSource = WINDOW$1.SENTRY_SDK_SOURCE || "npm";
		applySdkMetadata(opts, 0, ["browser"], sdkSource);
		// Only allow IP inferral by Relay if sendDefaultPii is true
		{
			{
				opts._metadata.sdk.settings = {
					infer_ip: "never",
					...void 0
				};
			}
		}
		super(opts);
		const { sendDefaultPii, sendClientReports, enableLogs, _experiments, enableMetrics: enableMetricsOption } = this._options;
		// todo(v11): Remove the experimental flag
		// eslint-disable-next-line deprecation/deprecation
		const enableMetrics = enableMetricsOption ?? _experiments?.enableMetrics ?? true;
		// Flush logs and metrics when page becomes hidden (e.g., tab switch, navigation)
		// todo(v11): Remove the experimental flag
		if (WINDOW$1.document && (sendClientReports || enableLogs || enableMetrics)) {
			WINDOW$1.document.addEventListener("visibilitychange", () => {
				if (WINDOW$1.document.visibilityState === "hidden") {
					if (sendClientReports) {
						this._flushOutcomes();
					}
					if (enableLogs) {
						_INTERNAL_flushLogsBuffer(this);
					}
					if (enableMetrics) {
						_INTERNAL_flushMetricsBuffer(this);
					}
				}
			});
		}
		if (sendDefaultPii) {
			this.on("beforeSendSession", addAutoIpAddressToSession);
		}
	}
	/**
	* @inheritDoc
	*/
	eventFromException(exception, hint) {
		return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
	}
	/**
	* @inheritDoc
	*/
	eventFromMessage(message, level = "info", hint) {
		return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
	}
	/**
	* @inheritDoc
	*/
	_prepareEvent(event, hint, currentScope, isolationScope) {
		event.platform = event.platform || "javascript";
		return super._prepareEvent(event, hint, currentScope, isolationScope);
	}
}
/** Exported only for tests. */
function applyDefaultOptions(optionsArg) {
	return {
		release: typeof __SENTRY_RELEASE__ === "string" ? __SENTRY_RELEASE__ : WINDOW$1.SENTRY_RELEASE?.id,
		sendClientReports: true,
		parentSpanIsAlwaysRootSpan: true,
		...optionsArg
	};
}
/**
* This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
*
* ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
*/
const DEBUG_BUILD$1 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
const WINDOW = GLOBAL_OBJ;
let debounceTimerID;
let lastCapturedEventType;
let lastCapturedEventTargetId;
/**
* Add an instrumentation handler for when a click or a keypress happens.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addClickKeypressInstrumentationHandler(handler) {
	addHandler("dom", handler);
	maybeInstrument("dom", instrumentDOM);
}
/** Exported for tests only. */
function instrumentDOM() {
	if (!WINDOW.document) {
		return;
	}
	// Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
	// handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
	// we instrument `addEventListener` so that we don't end up attaching this handler twice.
	const triggerDOMHandler = triggerHandlers.bind(0, "dom");
	const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
	WINDOW.document.addEventListener("click", globalDOMEventHandler, false);
	WINDOW.document.addEventListener("keypress", globalDOMEventHandler, false);
	// After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
	// clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
	// way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
	// could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
	// guaranteed to fire at least once.)
	["EventTarget", "Node"].forEach((target) => {
		const globalObject = WINDOW;
		const proto = globalObject[target]?.prototype;
		// eslint-disable-next-line no-prototype-builtins
		if (!proto?.hasOwnProperty?.("addEventListener")) {
			return;
		}
		fill(proto, "addEventListener", function(originalAddEventListener) {
			return function(type, listener, options) {
				if (type === "click" || type == "keypress") {
					try {
						const handlers = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {};
						const handlerForType = handlers[type] = handlers[type] || { refCount: 0 };
						if (!handlerForType.handler) {
							const handler = makeDOMEventHandler(triggerDOMHandler);
							handlerForType.handler = handler;
							originalAddEventListener.call(this, type, handler, options);
						}
						handlerForType.refCount++;
					} catch {}
				}
				return originalAddEventListener.call(this, type, listener, options);
			};
		});
		fill(proto, "removeEventListener", function(originalRemoveEventListener) {
			return function(type, listener, options) {
				if (type === "click" || type == "keypress") {
					try {
						const handlers = this.__sentry_instrumentation_handlers__ || {};
						const handlerForType = handlers[type];
						if (handlerForType) {
							handlerForType.refCount--;
							// If there are no longer any custom handlers of the current type on this element, we can remove ours, too.
							if (handlerForType.refCount <= 0) {
								originalRemoveEventListener.call(this, type, handlerForType.handler, options);
								handlerForType.handler = void 0;
								delete handlers[type];
							}
							// If there are no longer any custom handlers of any type on this element, cleanup everything.
							if (Object.keys(handlers).length === 0) {
								delete this.__sentry_instrumentation_handlers__;
							}
						}
					} catch {}
				}
				return originalRemoveEventListener.call(this, type, listener, options);
			};
		});
	});
}
/**
* Check whether the event is similar to the last captured one. For example, two click events on the same button.
*/
function isSimilarToLastCapturedEvent(event) {
	// If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.
	if (event.type !== lastCapturedEventType) {
		return false;
	}
	try {
		// If both events have the same type, it's still possible that actions were performed on different targets.
		// e.g. 2 clicks on different buttons.
		if (!event.target || event.target._sentryId !== lastCapturedEventTargetId) {
			return false;
		}
	} catch {}
	// If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
	// to which an event listener was attached), we treat them as the same action, as we want to capture
	// only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.
	return true;
}
/**
* Decide whether an event should be captured.
* @param event event to be captured
*/
function shouldSkipDOMEvent(eventType, target) {
	// We are only interested in filtering `keypress` events for now.
	if (eventType !== "keypress") {
		return false;
	}
	if (!target?.tagName) {
		return true;
	}
	// Only consider keypress events on actual input elements. This will disregard keypresses targeting body
	// e.g.tabbing through elements, hotkeys, etc.
	if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
		return false;
	}
	return true;
}
/**
* Wraps addEventListener to capture UI breadcrumbs
*/
function makeDOMEventHandler(handler, globalListener = false) {
	return (event) => {
		// It's possible this handler might trigger multiple times for the same
		// event (e.g. event propagation through node ancestors).
		// Ignore if we've already captured that event.
		if (!event || event["_sentryCaptured"]) {
			return;
		}
		const target = getEventTarget(event);
		// We always want to skip _some_ events.
		if (shouldSkipDOMEvent(event.type, target)) {
			return;
		}
		// Mark event as "seen"
		addNonEnumerableProperty(event, "_sentryCaptured", true);
		if (target && !target._sentryId) {
			// Add UUID to event target so we can identify if
			addNonEnumerableProperty(target, "_sentryId", uuid4());
		}
		const name = event.type === "keypress" ? "input" : event.type;
		// If there is no last captured event, it means that we can safely capture the new event and store it for future comparisons.
		// If there is a last captured event, see if the new event is different enough to treat it as a unique one.
		// If that's the case, emit the previous event and store locally the newly-captured DOM event.
		if (!isSimilarToLastCapturedEvent(event)) {
			const handlerData = {
				event,
				name,
				global: globalListener
			};
			handler(handlerData);
			lastCapturedEventType = event.type;
			lastCapturedEventTargetId = target ? target._sentryId : void 0;
		}
		// Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
		clearTimeout(debounceTimerID);
		debounceTimerID = WINDOW.setTimeout(() => {
			lastCapturedEventTargetId = void 0;
			lastCapturedEventType = void 0;
		}, 1e3);
	};
}
function getEventTarget(event) {
	try {
		return event.target;
	} catch {
		// just accessing `target` property can throw an exception in some rare circumstances
		// see: https://github.com/getsentry/sentry-javascript/issues/838
		return null;
	}
}
let lastHref;
/**
* Add an instrumentation handler for when a fetch request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addHistoryInstrumentationHandler(handler) {
	addHandler("history", handler);
	maybeInstrument("history", instrumentHistory);
}
/**
* Exported just for testing
*/
function instrumentHistory() {
	// The `popstate` event may also be triggered on `pushState`, but it may not always reliably be emitted by the browser
	// Which is why we also monkey-patch methods below, in addition to this
	WINDOW.addEventListener("popstate", () => {
		const to = WINDOW.location.href;
		// keep track of the current URL state, as we always receive only the updated state
		const from = lastHref;
		lastHref = to;
		if (from === to) {
			return;
		}
		const handlerData = {
			from,
			to
		};
		triggerHandlers("history", handlerData);
	});
	// Just guard against this not being available, in weird environments
	if (!supportsHistory()) {
		return;
	}
	function historyReplacementFunction(originalHistoryFunction) {
		return function(...args) {
			const url = args.length > 2 ? args[2] : void 0;
			if (url) {
				const from = lastHref;
				// Ensure the URL is absolute
				// this can be either a path, then it is relative to the current origin
				// or a full URL of the current origin - other origins are not allowed
				// See: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState#url
				// coerce to string (this is what pushState does)
				const to = getAbsoluteUrl(String(url));
				// keep track of the current URL state, as we always receive only the updated state
				lastHref = to;
				if (from === to) {
					return originalHistoryFunction.apply(this, args);
				}
				const handlerData = {
					from,
					to
				};
				triggerHandlers("history", handlerData);
			}
			return originalHistoryFunction.apply(this, args);
		};
	}
	fill(WINDOW.history, "pushState", historyReplacementFunction);
	fill(WINDOW.history, "replaceState", historyReplacementFunction);
}
function getAbsoluteUrl(urlOrPath) {
	try {
		const url = new URL(urlOrPath, WINDOW.location.origin);
		return url.toString();
	} catch {
		// fallback, just do nothing
		return urlOrPath;
	}
}
/**
* We generally want to use window.fetch / window.setTimeout.
* However, in some cases this may be wrapped (e.g. by Zone.js for Angular),
* so we try to get an unpatched version of this from a sandboxed iframe.
*/
const cachedImplementations = {};
/**
* Get the native implementation of a browser function.
*
* This can be used to ensure we get an unwrapped version of a function, in cases where a wrapped function can lead to problems.
*
* The following methods can be retrieved:
* - `setTimeout`: This can be wrapped by e.g. Angular, causing change detection to be triggered.
* - `fetch`: This can be wrapped by e.g. ad-blockers, causing an infinite loop when a request is blocked.
*/
function getNativeImplementation() {
	const cached = cachedImplementations["a"];
	if (cached) {
		return cached;
	}
	let impl = WINDOW["fetch"];
	// Fast path to avoid DOM I/O
	if (isNativeFunction(impl)) {
		return cachedImplementations["a"] = impl.bind(WINDOW);
	}
	const document = WINDOW.document;
	// eslint-disable-next-line deprecation/deprecation
	if (document && typeof document.createElement === "function") {
		try {
			const sandbox = document.createElement("iframe");
			sandbox.hidden = true;
			document.head.appendChild(sandbox);
			const contentWindow = sandbox.contentWindow;
			if (contentWindow?.["fetch"]) {
				impl = contentWindow["fetch"];
			}
			document.head.removeChild(sandbox);
		} catch (e) {
			// Could not create sandbox iframe, just use window.xxx
			DEBUG_BUILD$1 && debug.b(`Could not create sandbox iframe for ${"fetch"} check, bailing to window.${"fetch"}: `, e);
		}
	}
	// Sanity check: This _should_ not happen, but if it does, we just skip caching...
	// This can happen e.g. in tests where fetch may not be available in the env, or similar.
	if (!impl) {
		return impl;
	}
	return cachedImplementations["a"] = impl.bind(WINDOW);
}
/** Clear a cached implementation. */
function clearCachedImplementation() {
	cachedImplementations["a"] = void 0;
}
const SENTRY_XHR_DATA_KEY = "__sentry_xhr_v3__";
/**
* Add an instrumentation handler for when an XHR request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addXhrInstrumentationHandler(handler) {
	addHandler("xhr", handler);
	maybeInstrument("xhr", instrumentXHR);
}
/** Exported only for tests. */
function instrumentXHR() {
	if (!WINDOW.XMLHttpRequest) {
		return;
	}
	const xhrproto = XMLHttpRequest.prototype;
	// eslint-disable-next-line @typescript-eslint/unbound-method
	xhrproto.open = new Proxy(xhrproto.open, { apply(originalOpen, xhrOpenThisArg, xhrOpenArgArray) {
		// NOTE: If you are a Sentry user, and you are seeing this stack frame,
		//       it means the error, that was caused by your XHR call did not
		//       have a stack trace. If you are using HttpClient integration,
		//       this is the expected behavior, as we are using this virtual error to capture
		//       the location of your XHR call, and group your HttpClient events accordingly.
		const virtualError = new Error();
		const startTimestamp = timestampInSeconds() * 1e3;
		// open() should always be called with two or more arguments
		// But to be on the safe side, we actually validate this and bail out if we don't have a method & url
		const method = isString(xhrOpenArgArray[0]) ? xhrOpenArgArray[0].toUpperCase() : void 0;
		const url = parseXhrUrlArg(xhrOpenArgArray[1]);
		if (!method || !url) {
			return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
		}
		xhrOpenThisArg[SENTRY_XHR_DATA_KEY] = {
			method,
			url,
			request_headers: {}
		};
		// if Sentry key appears in URL, don't capture it as a request
		if (method === "POST" && url.match(/sentry_key/)) {
			xhrOpenThisArg.__sentry_own_request__ = true;
		}
		const onreadystatechangeHandler = () => {
			// For whatever reason, this is not the same instance here as from the outer method
			const xhrInfo = xhrOpenThisArg[SENTRY_XHR_DATA_KEY];
			if (!xhrInfo) {
				return;
			}
			if (xhrOpenThisArg.readyState === 4) {
				try {
					// touching statusCode in some platforms throws
					// an exception
					xhrInfo.status_code = xhrOpenThisArg.status;
				} catch {}
				const handlerData = {
					endTimestamp: timestampInSeconds() * 1e3,
					startTimestamp,
					xhr: xhrOpenThisArg,
					virtualError
				};
				triggerHandlers("xhr", handlerData);
			}
		};
		if ("onreadystatechange" in xhrOpenThisArg && typeof xhrOpenThisArg.onreadystatechange === "function") {
			xhrOpenThisArg.onreadystatechange = new Proxy(xhrOpenThisArg.onreadystatechange, { apply(originalOnreadystatechange, onreadystatechangeThisArg, onreadystatechangeArgArray) {
				onreadystatechangeHandler();
				return originalOnreadystatechange.apply(onreadystatechangeThisArg, onreadystatechangeArgArray);
			} });
		} else {
			xhrOpenThisArg.addEventListener("readystatechange", onreadystatechangeHandler);
		}
		// Intercepting `setRequestHeader` to access the request headers of XHR instance.
		// This will only work for user/library defined headers, not for the default/browser-assigned headers.
		// Request cookies are also unavailable for XHR, as `Cookie` header can't be defined by `setRequestHeader`.
		xhrOpenThisArg.setRequestHeader = new Proxy(xhrOpenThisArg.setRequestHeader, { apply(originalSetRequestHeader, setRequestHeaderThisArg, setRequestHeaderArgArray) {
			const [header, value] = setRequestHeaderArgArray;
			const xhrInfo = setRequestHeaderThisArg[SENTRY_XHR_DATA_KEY];
			if (xhrInfo && isString(header) && isString(value)) {
				xhrInfo.request_headers[header.toLowerCase()] = value;
			}
			return originalSetRequestHeader.apply(setRequestHeaderThisArg, setRequestHeaderArgArray);
		} });
		return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
	} });
	// eslint-disable-next-line @typescript-eslint/unbound-method
	xhrproto.send = new Proxy(xhrproto.send, { apply(originalSend, sendThisArg, sendArgArray) {
		const sentryXhrData = sendThisArg[SENTRY_XHR_DATA_KEY];
		if (!sentryXhrData) {
			return originalSend.apply(sendThisArg, sendArgArray);
		}
		if (sendArgArray[0] !== void 0) {
			sentryXhrData.body = sendArgArray[0];
		}
		const handlerData = {
			startTimestamp: timestampInSeconds() * 1e3,
			xhr: sendThisArg
		};
		triggerHandlers("xhr", handlerData);
		return originalSend.apply(sendThisArg, sendArgArray);
	} });
}
/**
* Parses the URL argument of a XHR method to a string.
*
* See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open#url
* url: A string or any other object with a stringifier — including a URL object — that provides the URL of the resource to send the request to.
*
* @param url - The URL argument of an XHR method
* @returns The parsed URL string or undefined if the URL is invalid
*/
function parseXhrUrlArg(url) {
	if (isString(url)) {
		return url;
	}
	try {
		// If the passed in argument is not a string, it should have a `toString` method as a stringifier.
		// If that fails, we just return undefined (like in IE11 where URL is not available)
		return url.toString();
	} catch {}
	return void 0;
}
/**
* Creates a Transport that uses the Fetch API to send events to Sentry.
*/
function makeFetchTransport(options, nativeFetch = getNativeImplementation()) {
	let pendingBodySize = 0;
	let pendingCount = 0;
	async function makeRequest(request) {
		const requestSize = request.a.length;
		pendingBodySize += requestSize;
		pendingCount++;
		const requestOptions = {
			body: request.a,
			method: "POST",
			referrerPolicy: "strict-origin",
			headers: options.headers,
			keepalive: pendingBodySize <= 6e4 && pendingCount < 15,
			...options.fetchOptions
		};
		try {
			// Note: We do not need to suppress tracing here, because we are using the native fetch, instead of our wrapped one.
			const response = await nativeFetch(options.url, requestOptions);
			return {
				statusCode: response.status,
				headers: {
					"x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
					"retry-after": response.headers.get("Retry-After")
				}
			};
		} catch (e) {
			clearCachedImplementation();
			throw e;
		} finally {
			pendingBodySize -= requestSize;
			pendingCount--;
		}
	}
	return createTransport(options, makeRequest, makePromiseBuffer(options.bufferSize || 40));
}
/**
* This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
*
* ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
*/
const DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
function createFrame(filename, func, lineno, colno) {
	const frame = {
		filename,
		function: func === "<anonymous>" ? "?" : func,
		in_app: true
	};
	if (lineno !== void 0) {
		frame.lineno = lineno;
	}
	if (colno !== void 0) {
		frame.colno = colno;
	}
	return frame;
}
// This regex matches frames that have no function name (ie. are at the top level of a module).
// For example "at http://localhost:5000//script.js:1:126"
// Frames _with_ function names usually look as follows: "at commitLayoutEffects (react-dom.development.js:23426:1)"
const chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
// This regex matches all the frames that have a function name.
const chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
// Matches stack frames with data URIs instead of filename so we can still get the function name
// Example: "at dynamicFn (data:application/javascript,export function dynamicFn() {..."
const chromeDataUriRegex = /at (.+?) ?\(data:(.+?),/;
// Chromium based browsers: Chrome, Brave, new Opera, new Edge
// We cannot call this variable `chrome` because it can conflict with global `chrome` variable in certain environments
// See: https://github.com/getsentry/sentry-javascript/issues/6880
const chromeStackParserFn = (line) => {
	const dataUriMatch = line.match(chromeDataUriRegex);
	if (dataUriMatch) {
		return {
			filename: `<data:${dataUriMatch[2]}>`,
			function: dataUriMatch[1]
		};
	}
	// If the stack line has no function name, we need to parse it differently
	const noFnParts = chromeRegexNoFnName.exec(line);
	if (noFnParts) {
		const [, filename, line, col] = noFnParts;
		return createFrame(filename, "?", +line, +col);
	}
	const parts = chromeRegex.exec(line);
	if (parts) {
		const isEval = parts[2] && parts[2].indexOf("eval") === 0;
		if (isEval) {
			const subMatch = chromeEvalRegex.exec(parts[2]);
			if (subMatch) {
				// throw out eval line/column and use top-most line/column number
				parts[2] = subMatch[1];
				parts[3] = subMatch[2];
				parts[4] = subMatch[3];
			}
		}
		// Kamil: One more hack won't hurt us right? Understanding and adding more rules on top of these regexps right now
		// would be way too time consuming. (TODO: Rewrite whole RegExp to be more readable)
		const [func, filename] = extractSafariExtensionDetails(parts[1] || "?", parts[2]);
		return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
	}
	return;
};
const chromeStackLineParser = [30, chromeStackParserFn];
// gecko regex: `(?:bundle|\d+\.js)`: `bundle` is for react native, `\d+\.js` also but specifically for ram bundles because it
// generates filenames without a prefix like `file://` the filenames in the stacktrace are just 42.js
// We need this specific case for now because we want no other regex to match.
const geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
const geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const gecko = (line) => {
	const parts = geckoREgex.exec(line);
	if (parts) {
		const isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
		if (isEval) {
			const subMatch = geckoEvalRegex.exec(parts[3]);
			if (subMatch) {
				// throw out eval line/column and use top-most line number
				parts[1] = parts[1] || "eval";
				parts[3] = subMatch[1];
				parts[4] = subMatch[2];
				parts[5] = "";
			}
		}
		let filename = parts[3];
		let func = parts[1] || "?";
		[func, filename] = extractSafariExtensionDetails(func, filename);
		return createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
	}
	return;
};
const geckoStackLineParser = [50, gecko];
const defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser];
const defaultStackParser = createStackParser(...defaultStackLineParsers);
/**
* Safari web extensions, starting version unknown, can produce "frames-only" stacktraces.
* What it means, is that instead of format like:
*
* Error: wat
*   at function@url:row:col
*   at function@url:row:col
*   at function@url:row:col
*
* it produces something like:
*
*   function@url:row:col
*   function@url:row:col
*   function@url:row:col
*
* Because of that, it won't be captured by `chrome` RegExp and will fall into `Gecko` branch.
* This function is extracted so that we can use it in both places without duplicating the logic.
* Unfortunately "just" changing RegExp is too complicated now and making it pass all tests
* and fix this case seems like an impossible, or at least way too time-consuming task.
*/
const extractSafariExtensionDetails = (func, filename) => {
	const isSafariExtension = func.indexOf("safari-extension") !== -1;
	const isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
	return isSafariExtension || isSafariWebExtension ? [func.indexOf("@") !== -1 ? func.split("@")[0] : "?", isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`] : [func, filename];
};
const _breadcrumbsIntegration = () => {
	return {
		name: "Breadcrumbs",
		setup(client) {
			// TODO(v11): Remove this functionality and use `consoleIntegration` from @sentry/core instead.
			{
				{
					addConsoleInstrumentationHandler(_getConsoleBreadcrumbHandler(client));
				}
			}
			{
				{
					addClickKeypressInstrumentationHandler(_getDomBreadcrumbHandler(client));
				}
			}
			{
				{
					addXhrInstrumentationHandler(_getXhrBreadcrumbHandler(client));
				}
			}
			{
				{
					addFetchInstrumentationHandler(_getFetchBreadcrumbHandler(client));
				}
			}
			{
				{
					addHistoryInstrumentationHandler(_getHistoryBreadcrumbHandler(client));
				}
			}
			{
				{
					client.on("beforeSendEvent", _getSentryBreadcrumbHandler(client));
				}
			}
		}
	};
};
const breadcrumbsIntegration = defineIntegration(_breadcrumbsIntegration);
/**
* Adds a breadcrumb for Sentry events or transactions if this option is enabled.
*/
function _getSentryBreadcrumbHandler(client) {
	return function(event) {
		if (getClient() !== client) {
			return;
		}
		addBreadcrumb({
			category: `sentry.${event.type === "transaction" ? "transaction" : "event"}`,
			event_id: event.event_id,
			level: event.level,
			message: getEventDescription(event)
		}, { event });
	};
}
/**
* A HOC that creates a function that creates breadcrumbs from DOM API calls.
* This is a HOC so that we get access to dom options in the closure.
*/
function _getDomBreadcrumbHandler(client) {
	return function(handlerData) {
		if (getClient() !== client) {
			return;
		}
		let target;
		let componentName;
		// Accessing event.target can throw (see getsentry/raven-js#838, #768)
		try {
			const event = handlerData.event;
			const element = _isEvent(event) ? event.target : event;
			target = htmlTreeAsString(element, {
				keyAttrs: void 0,
				maxStringLength: void 0
			});
			componentName = getComponentName(element);
		} catch {
			target = "<unknown>";
		}
		if (target.length === 0) {
			return;
		}
		const breadcrumb = {
			category: `ui.${handlerData.name}`,
			message: target
		};
		if (componentName) {
			breadcrumb.data = { "ui.component_name": componentName };
		}
		addBreadcrumb(breadcrumb, {
			event: handlerData.event,
			name: handlerData.name,
			global: handlerData.global
		});
	};
}
/**
* Creates breadcrumbs from console API calls
*/
function _getConsoleBreadcrumbHandler(client) {
	return function(handlerData) {
		if (getClient() !== client) {
			return;
		}
		const breadcrumb = {
			category: "console",
			data: {
				arguments: handlerData.args,
				logger: "console"
			},
			level: severityLevelFromString(handlerData.level),
			message: safeJoin(handlerData.args)
		};
		if (handlerData.level === "assert") {
			if (handlerData.args[0] === false) {
				breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1)) || "console.assert"}`;
				breadcrumb.data.arguments = handlerData.args.slice(1);
			} else {
				// Don't capture a breadcrumb for passed assertions
				return;
			}
		}
		addBreadcrumb(breadcrumb, {
			input: handlerData.args,
			level: handlerData.level
		});
	};
}
/**
* Creates breadcrumbs from XHR API calls
*/
function _getXhrBreadcrumbHandler(client) {
	return function(handlerData) {
		if (getClient() !== client) {
			return;
		}
		const { startTimestamp, endTimestamp } = handlerData;
		const sentryXhrData = handlerData.xhr[SENTRY_XHR_DATA_KEY];
		// We only capture complete, non-sentry requests
		if (!startTimestamp || !endTimestamp || !sentryXhrData) {
			return;
		}
		const { method, url, status_code, body } = sentryXhrData;
		const data = {
			method,
			url,
			status_code
		};
		const hint = {
			xhr: handlerData.xhr,
			input: body,
			startTimestamp,
			endTimestamp
		};
		const breadcrumb = {
			category: "xhr",
			data,
			type: "http",
			level: getBreadcrumbLogLevelFromHttpStatusCode(status_code)
		};
		client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
		addBreadcrumb(breadcrumb, hint);
	};
}
/**
* Creates breadcrumbs from fetch API calls
*/
function _getFetchBreadcrumbHandler(client) {
	return function(handlerData) {
		if (getClient() !== client) {
			return;
		}
		const { startTimestamp, endTimestamp } = handlerData;
		// We only capture complete fetch requests
		if (!endTimestamp) {
			return;
		}
		if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === "POST") {
			// We will not create breadcrumbs for fetch requests that contain `sentry_key` (internal sentry requests)
			return;
		}
		if (handlerData.error) {
			const data = handlerData.fetchData;
			const hint = {
				data: handlerData.error,
				input: handlerData.args,
				startTimestamp,
				endTimestamp
			};
			const breadcrumb = {
				category: "fetch",
				data,
				level: "error",
				type: "http"
			};
			client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
			addBreadcrumb(breadcrumb, hint);
		} else {
			const response = handlerData.response;
			const data = {
				...handlerData.fetchData,
				status_code: response?.status
			};
			const hint = {
				input: handlerData.args,
				response,
				startTimestamp,
				endTimestamp
			};
			const breadcrumb = {
				category: "fetch",
				data,
				type: "http",
				level: getBreadcrumbLogLevelFromHttpStatusCode(data.status_code)
			};
			client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
			addBreadcrumb(breadcrumb, hint);
		}
	};
}
/**
* Creates breadcrumbs from history API calls
*/
function _getHistoryBreadcrumbHandler(client) {
	return function(handlerData) {
		if (getClient() !== client) {
			return;
		}
		let from = handlerData.from;
		let to = handlerData.to;
		const parsedLoc = parseUrl(WINDOW$1.location.href);
		let parsedFrom = from ? parseUrl(from) : void 0;
		const parsedTo = parseUrl(to);
		// Initial pushState doesn't provide `from` information
		if (!parsedFrom?.b) {
			parsedFrom = parsedLoc;
		}
		// Use only the path component of the URL if the URL matches the current
		// document (almost all the time when using pushState)
		if (parsedLoc.c === parsedTo.c && parsedLoc.a === parsedTo.a) {
			to = parsedTo.d;
		}
		if (parsedLoc.c === parsedFrom.c && parsedLoc.a === parsedFrom.a) {
			from = parsedFrom.d;
		}
		addBreadcrumb({
			category: "navigation",
			data: {
				from,
				to
			}
		});
	};
}
function _isEvent(event) {
	return !!event && !!event.target;
}
const DEFAULT_EVENT_TARGET = [
	"EventTarget",
	"Window",
	"Node",
	"ApplicationCache",
	"AudioTrackList",
	"BroadcastChannel",
	"ChannelMergerNode",
	"CryptoOperation",
	"EventSource",
	"FileReader",
	"HTMLUnknownElement",
	"IDBDatabase",
	"IDBRequest",
	"IDBTransaction",
	"KeyOperation",
	"MediaController",
	"MessagePort",
	"ModalWindow",
	"Notification",
	"SVGElementInstance",
	"Screen",
	"SharedWorker",
	"TextTrack",
	"TextTrackCue",
	"TextTrackList",
	"WebSocket",
	"WebSocketWorker",
	"Worker",
	"XMLHttpRequest",
	"XMLHttpRequestEventTarget",
	"XMLHttpRequestUpload"
];
const _browserApiErrorsIntegration = () => {
	return {
		name: "BrowserApiErrors",
		setupOnce() {
			{
				{
					fill(WINDOW$1, "setTimeout", _wrapTimeFunction);
				}
			}
			{
				{
					fill(WINDOW$1, "setInterval", _wrapTimeFunction);
				}
			}
			{
				{
					fill(WINDOW$1, "requestAnimationFrame", _wrapRAF);
				}
			}
			if ("XMLHttpRequest" in WINDOW$1) {
				fill(XMLHttpRequest.prototype, "send", _wrapXHR);
			}
			{
				{
					const eventTarget = Array.isArray(true) ? true : DEFAULT_EVENT_TARGET;
					eventTarget.forEach((target) => (_wrapEventTarget(target), void 0));
				}
			}
		}
	};
};
/**
* Wrap timer functions and event targets to catch errors and provide better meta data.
*/
const browserApiErrorsIntegration = defineIntegration(_browserApiErrorsIntegration);
function _wrapTimeFunction(original) {
	return function(...args) {
		const originalCallback = args[0];
		args[0] = wrap(originalCallback, { mechanism: {
			handled: false,
			type: `auto.browser.browserapierrors.${getFunctionName(original)}`
		} });
		return original.apply(this, args);
	};
}
function _wrapRAF(original) {
	return function(callback) {
		return original.apply(this, [wrap(callback, { mechanism: {
			data: { handler: getFunctionName(original) },
			handled: false,
			type: "auto.browser.browserapierrors.requestAnimationFrame"
		} })]);
	};
}
function _wrapXHR(originalSend) {
	return function(...args) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const xhr = this;
		const xmlHttpRequestProps = [
			"onload",
			"onerror",
			"onprogress",
			"onreadystatechange"
		];
		xmlHttpRequestProps.forEach((prop) => {
			if (prop in xhr && typeof xhr[prop] === "function") {
				fill(xhr, prop, function(original) {
					const wrapOptions = { mechanism: {
						data: { handler: getFunctionName(original) },
						handled: false,
						type: `auto.browser.browserapierrors.xhr.${prop}`
					} };
					// If Instrument integration has been called before BrowserApiErrors, get the name of original function
					const originalFunction = getOriginalFunction(original);
					if (originalFunction) {
						wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
					}
					// Otherwise wrap directly
					return wrap(original, wrapOptions);
				});
			}
		});
		return originalSend.apply(this, args);
	};
}
function _wrapEventTarget(target) {
	const globalObject = WINDOW$1;
	const proto = globalObject[target]?.prototype;
	// eslint-disable-next-line no-prototype-builtins
	if (!proto?.hasOwnProperty?.("addEventListener")) {
		return;
	}
	fill(proto, "addEventListener", function(original) {
		return function(eventName, fn, options) {
			try {
				if (isEventListenerObject(fn)) {
					// ESlint disable explanation:
					//  First, it is generally safe to call `wrap` with an unbound function. Furthermore, using `.bind()` would
					//  introduce a bug here, because bind returns a new function that doesn't have our
					//  flags(like __sentry_original__) attached. `wrap` checks for those flags to avoid unnecessary wrapping.
					//  Without those flags, every call to addEventListener wraps the function again, causing a memory leak.
					// eslint-disable-next-line @typescript-eslint/unbound-method
					fn.handleEvent = wrap(fn.handleEvent, { mechanism: {
						data: {
							handler: getFunctionName(fn),
							target
						},
						handled: false,
						type: "auto.browser.browserapierrors.handleEvent"
					} });
				}
			} catch {}
			return original.apply(this, [
				eventName,
				wrap(fn, { mechanism: {
					data: {
						handler: getFunctionName(fn),
						target
					},
					handled: false,
					type: "auto.browser.browserapierrors.addEventListener"
				} }),
				options
			]);
		};
	});
	fill(proto, "removeEventListener", function(originalRemoveEventListener) {
		return function(eventName, fn, options) {
			/**
			* There are 2 possible scenarios here:
			*
			* 1. Someone passes a callback, which was attached prior to Sentry initialization, or by using unmodified
			* method, eg. `document.addEventListener.call(el, name, handler). In this case, we treat this function
			* as a pass-through, and call original `removeEventListener` with it.
			*
			* 2. Someone passes a callback, which was attached after Sentry was initialized, which means that it was using
			* our wrapped version of `addEventListener`, which internally calls `wrap` helper.
			* This helper "wraps" whole callback inside a try/catch statement, and attached appropriate metadata to it,
			* in order for us to make a distinction between wrapped/non-wrapped functions possible.
			* If a function was wrapped, it has additional property of `__sentry_wrapped__`, holding the handler.
			*
			* When someone adds a handler prior to initialization, and then do it again, but after,
			* then we have to detach both of them. Otherwise, if we'd detach only wrapped one, it'd be impossible
			* to get rid of the initial handler and it'd stick there forever.
			*/
			try {
				const originalEventHandler = fn.__sentry_wrapped__;
				if (originalEventHandler) {
					originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
				}
			} catch {}
			return originalRemoveEventListener.call(this, eventName, fn, options);
		};
	});
}
function isEventListenerObject(obj) {
	return typeof obj.handleEvent === "function";
}
/**
* When added, automatically creates sessions which allow you to track adoption and crashes (crash free rate) in your Releases in Sentry.
* More information: https://docs.sentry.io/product/releases/health/
*
* Note: In order for session tracking to work, you need to set up Releases: https://docs.sentry.io/product/releases/
*/
const browserSessionIntegration = defineIntegration(() => {
	return {
		name: "BrowserSession",
		setupOnce() {
			if (typeof WINDOW$1.document === "undefined") {
				DEBUG_BUILD && debug.b("Using the `browserSessionIntegration` in non-browser environments is not supported.");
				return;
			}
			// The session duration for browser sessions does not track a meaningful
			// concept that can be used as a metric.
			// Automatically captured sessions are akin to page views, and thus we
			// discard their duration.
			startSession({ ignoreDuration: true });
			captureSession();
			// We want to create a session for every navigation as well
			addHistoryInstrumentationHandler(({ from, to }) => {
				// Don't create an additional session for the initial route or if the location did not change
				if (from !== void 0 && from !== to) {
					startSession({ ignoreDuration: true });
					captureSession();
				}
			});
		}
	};
});
const _globalHandlersIntegration = () => {
	return {
		name: "GlobalHandlers",
		setupOnce() {
			Error.stackTraceLimit = 50;
		},
		setup(client) {
			{
				{
					_installGlobalOnErrorHandler(client);
					globalHandlerLog("onerror");
				}
			}
			{
				{
					_installGlobalOnUnhandledRejectionHandler(client);
					globalHandlerLog("onunhandledrejection");
				}
			}
		}
	};
};
const globalHandlersIntegration = defineIntegration(_globalHandlersIntegration);
function _installGlobalOnErrorHandler(client) {
	addGlobalErrorInstrumentationHandler((data) => {
		const { stackParser, attachStacktrace } = getOptions();
		if (getClient() !== client || shouldIgnoreOnError()) {
			return;
		}
		const { msg, url, line, column, error } = data;
		const event = _enhanceEventWithInitialFrame(eventFromUnknownInput(stackParser, error || msg, void 0, attachStacktrace, false), url, line, column);
		event.level = "error";
		captureEvent(event, {
			originalException: error,
			mechanism: {
				handled: false,
				type: "auto.browser.global_handlers.onerror"
			}
		});
	});
}
function _installGlobalOnUnhandledRejectionHandler(client) {
	addGlobalUnhandledRejectionInstrumentationHandler((e) => {
		const { stackParser, attachStacktrace } = getOptions();
		if (getClient() !== client || shouldIgnoreOnError()) {
			return;
		}
		const error = _getUnhandledRejectionError(e);
		const event = isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, true);
		event.level = "error";
		captureEvent(event, {
			originalException: error,
			mechanism: {
				handled: false,
				type: "auto.browser.global_handlers.onunhandledrejection"
			}
		});
	});
}
/**
*
*/
function _getUnhandledRejectionError(error) {
	if (isPrimitive(error)) {
		return error;
	}
	// dig the object of the rejection out of known event types
	try {
		// PromiseRejectionEvents store the object of the rejection under 'reason'
		// see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
		if ("reason" in error) {
			return error.reason;
		}
		// something, somewhere, (likely a browser extension) effectively casts PromiseRejectionEvents
		// to CustomEvents, moving the `promise` and `reason` attributes of the PRE into
		// the CustomEvent's `detail` attribute, since they're not part of CustomEvent's spec
		// see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent and
		// https://github.com/getsentry/sentry-javascript/issues/2380
		if ("detail" in error && "reason" in error.detail) {
			return error.detail.reason;
		}
	} catch {}
	return error;
}
/**
* Create an event from a promise rejection where the `reason` is a primitive.
*
* @param reason: The `reason` property of the promise rejection
* @returns An Event object with an appropriate `exception` value
*/
function _eventFromRejectionWithPrimitive(reason) {
	return { exception: { values: [{
		type: "UnhandledRejection",
		value: `Non-Error promise rejection captured with value: ${String(reason)}`
	}] } };
}
function _enhanceEventWithInitialFrame(event, url, line, column) {
	// event.exception
	const e = event.exception = event.exception || {};
	// event.exception.values
	const ev = e.values = e.values || [];
	// event.exception.values[0]
	const ev0 = ev[0] = ev[0] || {};
	// event.exception.values[0].stacktrace
	const ev0s = ev0.stacktrace = ev0.stacktrace || {};
	// event.exception.values[0].stacktrace.frames
	const ev0sf = ev0s.frames = ev0s.frames || [];
	const colno = column;
	const lineno = line;
	const filename = getFilenameFromUrl(url) ?? getLocationHref();
	// event.exception.values[0].stacktrace.frames
	if (ev0sf.length === 0) {
		ev0sf.push({
			colno,
			filename,
			function: "?",
			in_app: true,
			lineno
		});
	}
	return event;
}
function globalHandlerLog(type) {
	DEBUG_BUILD && debug.a(`Global Handler attached: ${type}`);
}
function getOptions() {
	const client = getClient();
	const options = client?.getOptions() || {
		stackParser: () => [],
		attachStacktrace: false
	};
	return options;
}
function getFilenameFromUrl(url) {
	if (!isString(url) || url.length === 0) {
		return void 0;
	}
	// Strip data URL content to avoid long base64 strings in stack frames
	// (e.g. when initializing a Worker with a base64 encoded script)
	// Don't include data prefix for filenames as it's not useful for stack traces
	// Wrap with < > to indicate it's a placeholder
	if (url.startsWith("data:")) {
		return `<${stripDataUrlContent(url)}>`;
	}
	return url;
}
/**
* Collects information about HTTP request headers and
* attaches them to the event.
*/
const httpContextIntegration = defineIntegration(() => {
	return {
		name: "HttpContext",
		preprocessEvent(event) {
			// if none of the information we want exists, don't bother
			if (!WINDOW$1.navigator && !WINDOW$1.location && !WINDOW$1.document) {
				return;
			}
			const reqData = getHttpRequestData();
			const headers = {
				...reqData.headers,
				...event.request?.headers
			};
			event.request = {
				...reqData,
				...event.request,
				headers
			};
		}
	};
});
const _linkedErrorsIntegration = () => {
	return {
		name: "LinkedErrors",
		preprocessEvent(event, hint, client) {
			const options = client.getOptions();
			applyAggregateErrorsToEvent(
				// This differs from the LinkedErrors integration in core by using a different exceptionFromError function
				exceptionFromError,
				options.stackParser,
				0,
				0,
				event,
				hint
			);
		}
	};
};
/**
* Aggregrate linked errors in an event.
*/
const linkedErrorsIntegration = defineIntegration(_linkedErrorsIntegration);
/**
* Returns true if the SDK is running in an embedded browser extension.
* Stand-alone browser extensions (which do not share the same data as the main browser page) are fine.
*/
function checkAndWarnIfIsEmbeddedBrowserExtension() {
	if (_isEmbeddedBrowserExtension()) {
		if (DEBUG_BUILD) {
			consoleSandbox(() => {
				// eslint-disable-next-line no-console
				console.error("[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/");
			});
		}
		return true;
	}
	return false;
}
function _isEmbeddedBrowserExtension() {
	if (typeof WINDOW$1.window === "undefined") {
		// No need to show the error if we're not in a browser window environment (e.g. service workers)
		return false;
	}
	const _window = WINDOW$1;
	// Running the SDK in NW.js, which appears like a browser extension but isn't, is also fine
	// see: https://github.com/getsentry/sentry-javascript/issues/12668
	if (_window.nw) {
		return false;
	}
	const extensionObject = _window["chrome"] || _window["browser"];
	if (!extensionObject?.runtime?.id) {
		return false;
	}
	const href = getLocationHref();
	const extensionProtocols = [
		"chrome-extension",
		"moz-extension",
		"ms-browser-extension",
		"safari-web-extension"
	];
	// Running the SDK in a dedicated extension page and calling Sentry.init is fine; no risk of data leakage
	const isDedicatedExtensionPage = WINDOW$1 === WINDOW$1.top && extensionProtocols.some((protocol) => href.startsWith(`${protocol}://`));
	return !isDedicatedExtensionPage;
}
/** Get the default integrations for the browser SDK. */
function getDefaultIntegrations() {
	/**
	* Note: Please make sure this stays in sync with Angular SDK, which re-exports
	* `getDefaultIntegrations` but with an adjusted set of integrations.
	*/
	return [
		inboundFiltersIntegration(),
		functionToStringIntegration(),
		conversationIdIntegration(),
		browserApiErrorsIntegration(),
		breadcrumbsIntegration(),
		globalHandlersIntegration(),
		linkedErrorsIntegration(),
		dedupeIntegration(),
		httpContextIntegration(),
		browserSessionIntegration()
	];
}
/**
* The Sentry Browser SDK Client.
*
* To use this SDK, call the {@link init} function as early as possible when
* loading the web page. To set context information or send manual events, use
* the provided methods.
*
* @example
*
* ```
*
* import { init } from '@sentry/browser';
*
* init({
*   dsn: '__DSN__',
*   // ...
* });
* ```
*
* @example
* ```
*
* import { addBreadcrumb } from '@sentry/browser';
* addBreadcrumb({
*   message: 'My Breadcrumb',
*   // ...
* });
* ```
*
* @example
*
* ```
*
* import * as Sentry from '@sentry/browser';
* Sentry.captureMessage('Hello, world!');
* Sentry.captureException(new Error('Good bye'));
* Sentry.captureEvent({
*   message: 'Manual',
*   stacktrace: [
*     // ...
*   ],
* });
* ```
*
* @see {@link BrowserOptions} for documentation on configuration options.
*/
function init(options) {
	const shouldDisableBecauseIsBrowserExtenstion = checkAndWarnIfIsEmbeddedBrowserExtension();
	let defaultIntegrations = getDefaultIntegrations();
	const clientOptions = {
		...options,
		enabled: shouldDisableBecauseIsBrowserExtenstion ? false : void 0,
		stackParser: stackParserFromStackParserOptions(defaultStackParser),
		integrations: getIntegrationsToSetup({ a: defaultIntegrations }),
		transport: makeFetchTransport
	};
	return initAndBind(BrowserClient, clientOptions);
}
const client = init({ dsn: "https://9523a043c1a34ad1b261c558b4d6a352@o383174.ingest.sentry.io/5273572" });
console.log(JSON.stringify(client));
