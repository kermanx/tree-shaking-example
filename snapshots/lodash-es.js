/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
/** Detect free variable `self`. */
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
/** Built-in value references. */
var Symbol = root$1.Symbol;
var Symbol$1 = Symbol;
/** Used for built-in method references. */
var objectProto$d = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString$1 = objectProto$d.toString;
/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value) {
	var isOwn = hasOwnProperty$a.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = void 0;
		var unmasked = true;
	} catch {}
	var result = nativeObjectToString$1.call(value);
	if (unmasked) {
		if (isOwn) {
			value[symToStringTag$1] = tag;
		} else {
			delete value[symToStringTag$1];
		}
	}
	return result;
}
/** Used for built-in method references. */
var objectProto$c = Object.prototype;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString = objectProto$c.toString;
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
	return nativeObjectToString.call(value);
}
/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value) {
	if (value == null) {
		return value === void 0 ? "[object Undefined]" : "[object Null]";
	}
	return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
/**
* Checks if `value` is object-like. A value is object-like if it's not `null`
* and has a `typeof` result of "object".
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
* @example
*
* _.isObjectLike({});
* // => true
*
* _.isObjectLike([1, 2, 3]);
* // => true
*
* _.isObjectLike(_.noop);
* // => false
*
* _.isObjectLike(null);
* // => false
*/
function isObjectLike(value) {
	return value != null && typeof value == "object";
}
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == "[object Symbol]";
}
/**
* Checks if `value` is classified as an `Array` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array, else `false`.
* @example
*
* _.isArray([1, 2, 3]);
* // => true
*
* _.isArray(document.body.children);
* // => false
*
* _.isArray('abc');
* // => false
*
* _.isArray(_.noop);
* // => false
*/
var isArray = Array.isArray;
var isArray$1 = isArray;
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
* character of `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the index of the last non-whitespace character.
*/
function trimmedEndIndex(string) {
	var index = string.length;
	while (index-- && reWhitespace.test(string.charAt(index)));
	return index;
}
/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;
/**
* The base implementation of `_.trim`.
*
* @private
* @param {string} string The string to trim.
* @returns {string} Returns the trimmed string.
*/
function baseTrim(string) {
	return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;
/**
* Converts `value` to a number.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to process.
* @returns {number} Returns the number.
* @example
*
* _.toNumber(3.2);
* // => 3.2
*
* _.toNumber(Number.MIN_VALUE);
* // => 5e-324
*
* _.toNumber(Infinity);
* // => Infinity
*
* _.toNumber('3.2');
* // => 3.2
*/
function toNumber(value) {
	if (typeof value == "number") {
		return value;
	}
	if (isSymbol(value)) {
		return NaN;
	}
	if (isObject(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject(other) ? other + "" : other;
	}
	if (typeof value != "string") {
		return value === 0 ? value : +value;
	}
	value = baseTrim(value);
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NaN : +value;
}
/**
* Converts `value` to a finite number.
*
* @static
* @memberOf _
* @since 4.12.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted number.
* @example
*
* _.toFinite(3.2);
* // => 3.2
*
* _.toFinite(Number.MIN_VALUE);
* // => 5e-324
*
* _.toFinite(Infinity);
* // => 1.7976931348623157e+308
*
* _.toFinite('3.2');
* // => 3.2
*/
function toFinite(value) {
	if (!value) {
		return value === 0 ? value : 0;
	}
	value = toNumber(value);
	if (value === Infinity || value === -Infinity) {
		var sign = value < 0 ? -1 : 1;
		return sign * 17976931348623157e292;
	}
	return value === value ? value : 0;
}
/**
* This method returns the first argument it receives.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {*} value Any value.
* @returns {*} Returns `value`.
* @example
*
* var object = { 'a': 1 };
*
* console.log(_.identity(object) === object);
* // => true
*/
function identity(value) {
	return value;
}
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction(value) {
	if (!isObject(value)) {
		return false;
	}
	// The use of `Object#toString` avoids issues with the `typeof` operator
	// in Safari 9 which returns 'object' for typed arrays and other constructors.
	var tag = baseGetTag(value);
	return tag == "[object Function]" || tag == "[object GeneratorFunction]" || tag == "[object AsyncFunction]" || tag == "[object Proxy]";
}
/** Used to detect overreaching core-js shims. */
var coreJsData = root$1["__core-js_shared__"];
var coreJsData$1 = coreJsData;
/** Used to detect methods masquerading as native. */
var maskSrcKey = function() {
	var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$1.call(func);
		} catch {}
		try {
			return func + "";
		} catch {}
	}
	return "";
}
/**
* Used to match `RegExp`
* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */
var funcProto = Function.prototype, objectProto$b = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
/** Used to detect if a method is native. */
var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$9).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value) {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	return pattern.test(toSource(value));
}
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? void 0 : object[key];
}
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : void 0;
}
/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root$1, "WeakMap");
var WeakMap$1 = WeakMap;
/** Used to store function metadata. */
var metaMap = WeakMap$1 && new WeakMap$1();
var metaMap$1 = metaMap;
/** Built-in value references. */
var objectCreate = Object.create;
/**
* The base implementation of `_.create` without support for assigning
* properties to the created object.
*
* @private
* @param {Object} proto The object to inherit from.
* @returns {Object} Returns the new object.
*/
var baseCreate = function() {
	return function(proto) {
		if (!isObject(proto)) {
			return {};
		}
		{
			{
				return objectCreate(proto);
			}
		}
	};
}();
var baseCreate$1 = baseCreate;
/**
* A faster alternative to `Function#apply`, this function invokes `func`
* with the `this` binding of `thisArg` and the arguments of `args`.
*
* @private
* @param {Function} func The function to invoke.
* @param {*} thisArg The `this` binding of `func`.
* @param {Array} args The arguments to invoke `func` with.
* @returns {*} Returns the result of `func`.
*/
function apply(func, thisArg, args) {
	switch (args.length) {
		case 0: return func.call(thisArg);
		case 1: return func.call(thisArg, args[0]);
		case 2: return func.call(thisArg, args[0], args[1]);
		case 3: return func.call(thisArg, args[0], args[1], args[2]);
	}
	return func.apply(thisArg, args);
}
/**
* The function whose prototype chain sequence wrappers inherit from.
*
* @private
*/
function baseLodash() {}
/**
* Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
*
* @private
* @constructor
* @param {*} value The value to wrap.
*/
function LazyWrapper(value) {
	this.__wrapped__ = value;
	this.__actions__ = [];
	this.__dir__ = 1;
	this.__filtered__ = false;
	this.__iteratees__ = [];
	this.__takeCount__ = 4294967295;
	this.__views__ = [];
}
// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate$1(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
/**
* This method returns `undefined`.
*
* @static
* @memberOf _
* @since 2.3.0
* @category Util
* @example
*
* _.times(2, _.noop);
* // => [undefined, undefined]
*/
function noop() {
	// No operation performed.
}
/**
* Gets metadata for `func`.
*
* @private
* @param {Function} func The function to query.
* @returns {*} Returns the metadata for `func`.
*/
var getData = !metaMap$1 ? noop : function(func) {
	return metaMap$1.get(func);
};
var getData$1 = getData;
/** Used to lookup unminified function names. */
var realNames = {};
var realNames$1 = realNames;
/** Used for built-in method references. */
var objectProto$a = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
/**
* Gets the name of `func`.
*
* @private
* @param {Function} func The function to query.
* @returns {string} Returns the function name.
*/
function getFuncName(func) {
	var result = func.name + "", array = realNames$1[result], length = hasOwnProperty$8.call(realNames$1, result) ? array.length : 0;
	while (length--) {
		var data = array[length], otherFunc = data.func;
		if (otherFunc == null || otherFunc == func) {
			return data.name;
		}
	}
	return result;
}
/**
* The base constructor for creating `lodash` wrapper objects.
*
* @private
* @param {*} value The value to wrap.
* @param {boolean} [chainAll] Enable explicit method chain sequences.
*/
function LodashWrapper(value, chainAll) {
	this.__wrapped__ = value;
	this.__actions__ = [];
	this.__chain__ = !!chainAll;
	this.__index__ = 0;
	this.__values__ = void 0;
}
LodashWrapper.prototype = baseCreate$1(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
/**
* Copies the values of `source` to `array`.
*
* @private
* @param {Array} source The array to copy values from.
* @param {Array} [array=[]] The array to copy values to.
* @returns {Array} Returns `array`.
*/
function copyArray(source, array) {
	var index = -1, length = source.length;
	array = Array(length);
	while (++index < length) {
		array[index] = source[index];
	}
	return array;
}
/**
* Creates a clone of `wrapper`.
*
* @private
* @param {Object} wrapper The wrapper to clone.
* @returns {Object} Returns the cloned wrapper.
*/
function wrapperClone(wrapper) {
	if (wrapper instanceof LazyWrapper) {
		return wrapper.clone();
	}
	var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	result.__actions__ = copyArray(wrapper.__actions__);
	result.__index__ = wrapper.__index__;
	result.__values__ = wrapper.__values__;
	return result;
}
/** Used for built-in method references. */
var objectProto$9 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
/**
* Creates a `lodash` object which wraps `value` to enable implicit method
* chain sequences. Methods that operate on and return arrays, collections,
* and functions can be chained together. Methods that retrieve a single value
* or may return a primitive value will automatically end the chain sequence
* and return the unwrapped value. Otherwise, the value must be unwrapped
* with `_#value`.
*
* Explicit chain sequences, which must be unwrapped with `_#value`, may be
* enabled using `_.chain`.
*
* The execution of chained methods is lazy, that is, it's deferred until
* `_#value` is implicitly or explicitly called.
*
* Lazy evaluation allows several methods to support shortcut fusion.
* Shortcut fusion is an optimization to merge iteratee calls; this avoids
* the creation of intermediate arrays and can greatly reduce the number of
* iteratee executions. Sections of a chain sequence qualify for shortcut
* fusion if the section is applied to an array and iteratees accept only
* one argument. The heuristic for whether a section qualifies for shortcut
* fusion is subject to change.
*
* Chaining is supported in custom builds as long as the `_#value` method is
* directly or indirectly included in the build.
*
* In addition to lodash methods, wrappers have `Array` and `String` methods.
*
* The wrapper `Array` methods are:
* `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
*
* The wrapper `String` methods are:
* `replace` and `split`
*
* The wrapper methods that support shortcut fusion are:
* `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
* `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
* `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
*
* The chainable wrapper methods are:
* `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
* `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
* `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
* `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
* `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
* `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
* `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
* `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
* `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
* `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
* `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
* `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
* `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
* `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
* `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
* `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
* `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
* `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
* `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
* `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
* `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
* `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
* `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
* `zipObject`, `zipObjectDeep`, and `zipWith`
*
* The wrapper methods that are **not** chainable by default are:
* `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
* `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
* `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
* `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
* `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
* `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
* `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
* `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
* `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
* `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
* `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
* `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
* `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
* `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
* `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
* `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
* `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
* `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
* `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
* `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
* `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
* `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
* `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
* `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
* `upperFirst`, `value`, and `words`
*
* @name _
* @constructor
* @category Seq
* @param {*} value The value to wrap in a `lodash` instance.
* @returns {Object} Returns the new `lodash` wrapper instance.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* var wrapped = _([1, 2, 3]);
*
* // Returns an unwrapped value.
* wrapped.reduce(_.add);
* // => 6
*
* // Returns a wrapped value.
* var squares = wrapped.map(square);
*
* _.isArray(squares);
* // => false
*
* _.isArray(squares.value());
* // => true
*/
function lodash(value) {
	if (isObjectLike(value) && !isArray$1(value) && !(value instanceof LazyWrapper)) {
		if (value instanceof LodashWrapper) {
			return value;
		}
		if (hasOwnProperty$7.call(value, "__wrapped__")) {
			return wrapperClone(value);
		}
	}
	return new LodashWrapper(value);
}
// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
/**
* Checks if `func` has a lazy counterpart.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` has a lazy counterpart,
*  else `false`.
*/
function isLaziable(func) {
	var funcName = getFuncName(func), other = lodash[funcName];
	if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
		return false;
	}
	if (func === other) {
		return true;
	}
	var data = getData$1(other);
	return !!data && func === data[0];
}
/**
* Creates a function that'll short out and invoke `identity` instead
* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
* milliseconds.
*
* @private
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new shortable function.
*/
function shortOut(func) {
	return function() {
		return func.apply(0, arguments);
	};
}
/**
* Creates a function that returns `value`.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {*} value The value to return from the new function.
* @returns {Function} Returns the new constant function.
* @example
*
* var objects = _.times(2, _.constant({ 'a': 1 }));
*
* console.log(objects);
* // => [{ 'a': 1 }, { 'a': 1 }]
*
* console.log(objects[0] === objects[1]);
* // => true
*/
function constant(value) {
	return function() {
		return value;
	};
}
var defineProperty = function() {
	try {
		var func = getNative(Object, "defineProperty");
		return func;
	} catch {}
}();
var defineProperty$1 = defineProperty;
/**
* The base implementation of `setToString` without support for hot loop shorting.
*
* @private
* @param {Function} func The function to modify.
* @param {Function} string The `toString` result.
* @returns {Function} Returns `func`.
*/
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
	return defineProperty$1(func, "toString", {
		"configurable": true,
		"enumerable": false,
		"value": constant(string),
		"writable": true
	});
};
var baseSetToString$1 = baseSetToString;
/**
* Sets the `toString` method of `func` to return `string`.
*
* @private
* @param {Function} func The function to modify.
* @param {Function} string The `toString` result.
* @returns {Function} Returns `func`.
*/
var setToString = shortOut(baseSetToString$1);
var setToString$1 = setToString;
/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
* Checks if `value` is a valid array-like index.
*
* @private
* @param {*} value The value to check.
* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
*/
function isIndex(value, length) {
	var type = typeof value;
	length = length == null ? 9007199254740991 : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;
/**
* A specialized version of `baseRest` which transforms the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @param {Function} transform The rest array transform.
* @returns {Function} Returns the new function.
*/
function overRest(func, start, transform) {
	start = nativeMax$1(func.length - 1, 0);
	return function() {
		var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
		while (++index < length) {
			array[index] = args[start + index];
		}
		index = -1;
		var otherArgs = Array(start + 1);
		while (++index < start) {
			otherArgs[index] = args[index];
		}
		otherArgs[start] = transform(array);
		return apply(func, this, otherArgs);
	};
}
/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3);
* // => true
*
* _.isLength(Number.MIN_VALUE);
* // => false
*
* _.isLength(Infinity);
* // => false
*
* _.isLength('3');
* // => false
*/
function isLength(value) {
	return typeof value == "number" && value > -1 && value % 1 == 0 && value <= 9007199254740991;
}
/**
* Checks if `value` is array-like. A value is considered array-like if it's
* not a function and has a `value.length` that's an integer greater than or
* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
* @example
*
* _.isArrayLike([1, 2, 3]);
* // => true
*
* _.isArrayLike(document.body.children);
* // => true
*
* _.isArrayLike('abc');
* // => true
*
* _.isArrayLike(_.noop);
* // => false
*/
function isArrayLike(value) {
	return value != null && isLength(value.length) && !isFunction(value);
}
/** Used for built-in method references. */
var objectProto$8 = Object.prototype;
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$8;
	return value === proto;
}
/**
* The base implementation of `_.times` without support for iteratee shorthands
* or max array length checks.
*
* @private
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the array of results.
*/
function baseTimes(n, iteratee) {
	var index = -1, result = Array(n);
	while (++index < n) {
		result[index] = iteratee(index);
	}
	return result;
}
/**
* The base implementation of `_.isArguments`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*/
function baseIsArguments(value) {
	return isObjectLike(value) && baseGetTag(value) == "[object Arguments]";
}
/** Used for built-in method references. */
var objectProto$7 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;
/**
* Checks if `value` is likely an `arguments` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*  else `false`.
* @example
*
* _.isArguments(function() { return arguments; }());
* // => true
*
* _.isArguments([1, 2, 3]);
* // => false
*/
var isArguments = baseIsArguments(function() {
	return arguments;
}()) ? baseIsArguments : function(value) {
	return isObjectLike(value) && hasOwnProperty$6.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
var isArguments$1 = isArguments;
/**
* This method returns `false`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `false`.
* @example
*
* _.times(2, _.stubFalse);
* // => [false, false]
*/
function stubFalse() {
	return false;
}
/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
/** Built-in value references. */
var Buffer = moduleExports$1 ? root$1.Buffer : void 0;
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
/**
* Checks if `value` is a buffer.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
* @example
*
* _.isBuffer(new Buffer(2));
* // => true
*
* _.isBuffer(new Uint8Array(2));
* // => false
*/
var isBuffer = nativeIsBuffer || stubFalse;
var isBuffer$1 = isBuffer;
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags["[object Float32Array]"] = typedArrayTags["[object Float64Array]"] = typedArrayTags["[object Int8Array]"] = typedArrayTags["[object Int16Array]"] = typedArrayTags["[object Int32Array]"] = typedArrayTags["[object Uint8Array]"] = typedArrayTags["[object Uint8ClampedArray]"] = typedArrayTags["[object Uint16Array]"] = typedArrayTags["[object Uint32Array]"] = true;
typedArrayTags["[object Arguments]"] = typedArrayTags["[object Array]"] = typedArrayTags["[object ArrayBuffer]"] = typedArrayTags["[object Boolean]"] = typedArrayTags["[object DataView]"] = typedArrayTags["[object Date]"] = typedArrayTags["[object Error]"] = typedArrayTags["[object Function]"] = typedArrayTags["[object Map]"] = typedArrayTags["[object Number]"] = typedArrayTags["[object Object]"] = typedArrayTags["[object RegExp]"] = typedArrayTags["[object Set]"] = typedArrayTags["[object String]"] = typedArrayTags["[object WeakMap]"] = false;
/**
* The base implementation of `_.isTypedArray` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
*/
function baseIsTypedArray(value) {
	return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
/**
* The base implementation of `_.unary` without support for storing metadata.
*
* @private
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
*/
function baseUnary(func) {
	return function(value) {
		return func(value);
	};
}
/** Detect free variable `exports`. */
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal$1.process;
/** Used to access faster Node.js helpers. */
var nodeUtil = function() {
	try {
		// Use `util.types` for Node.js 10+.
		var types = freeModule && freeModule.require && freeModule.require("util").types;
		if (types) {
			return types;
		}
		// Legacy `process.binding('util')` for Node.js < 10.
		return freeProcess && freeProcess.binding && freeProcess.binding("util");
	} catch {}
}();
var nodeUtil$1 = nodeUtil;
/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
/**
* Checks if `value` is classified as a typed array.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
* @example
*
* _.isTypedArray(new Uint8Array);
* // => true
*
* _.isTypedArray([]);
* // => false
*/
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray$1 = isTypedArray;
/** Used for built-in method references. */
var objectProto$6 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value) {
	var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
	for (var key in value) {
		if (hasOwnProperty$5.call(value, key) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
			result.push(key);
		}
	}
	return result;
}
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);
var nativeKeys$1 = nativeKeys;
/** Used for built-in method references. */
var objectProto$5 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!isPrototype(object)) {
		return nativeKeys$1(object);
	}
	var result = [];
	for (var key in Object(object)) {
		if (hasOwnProperty$4.call(object, key) && key != "constructor") {
			result.push(key);
		}
	}
	return result;
}
/**
* Creates an array of the own enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects. See the
* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* for more details.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keys(new Foo);
* // => ['a', 'b'] (iteration order is not guaranteed)
*
* _.keys('hi');
* // => ['0', '1']
*/
function keys(object) {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/* Built-in method references that are verified to be native. */
getNative(Object, "create");
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache() {}
/* Built-in method references that are verified to be native. */
var Map = getNative(root$1, "Map");
var Map$1 = Map;
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	new (Map$1 || ListCache)();
}
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache() {
	this.a();
}
// Add methods to `MapCache`.
MapCache.prototype.a = mapCacheClear;
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize() {
	new memoize.a();
	return;
}
// Expose `MapCache`.
memoize.a = MapCache;
/**
* A specialized version of `_.memoize` which clears the memoized function's
* cache when it exceeds `MAX_MEMOIZE_SIZE`.
*
* @private
* @param {Function} func The function to have its output memoized.
* @returns {Function} Returns the new memoized function.
*/
function memoizeCapped() {
	memoize();
	return;
}
/**
* Converts `string` to a property path array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the property path array.
*/
memoizeCapped();
/**
* Appends the elements of `values` to `array`.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to append.
* @returns {Array} Returns `array`.
*/
function arrayPush(array, values) {
	var index = -1, length = values.length, offset = array.length;
	while (++index < length) {
		array[offset + index] = values[index];
	}
	return;
}
/** Built-in value references. */
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
/**
* Checks if `value` is a flattenable `arguments` object or array.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
*/
function isFlattenable(value) {
	return isArray$1(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
/**
* The base implementation of `_.flatten` with support for restricting flattening.
*
* @private
* @param {Array} array The array to flatten.
* @param {number} depth The maximum recursion depth.
* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
* @param {Array} [result=[]] The initial result value.
* @returns {Array} Returns the new flattened array.
*/
function baseFlatten(array, __unused_D2B7, predicate, __unused_59D2, result) {
	var index = -1, length = array.length;
	predicate = isFlattenable;
	result = [];
	while (++index < length) {
		var value = array[index];
		if (predicate(value)) {
			{
				arrayPush(result, value);
			}
		} else {
			result[result.length] = value;
		}
	}
	return result;
}
/**
* Flattens `array` a single level deep.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to flatten.
* @returns {Array} Returns the new flattened array.
* @example
*
* _.flatten([1, [2, [3, [4]], 5]]);
* // => [1, 2, [3, [4]], 5]
*/
function flatten(array) {
	var length = array == null ? 0 : array.length;
	return length ? baseFlatten(array) : [];
}
/**
* A specialized version of `baseRest` which flattens the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @returns {Function} Returns the new function.
*/
function flatRest(func) {
	return setToString$1(overRest(func, 0, flatten), func + "");
}
/**
* A specialized version of `_.filter` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function arrayFilter(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (predicate(value)) {
			result[resIndex++] = value;
		}
	}
	return result;
}
/* Built-in method references that are verified to be native. */
var DataView = getNative(root$1, "DataView");
var DataView$1 = DataView;
/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$1, "Promise");
var Promise$2 = Promise$1;
/* Built-in method references that are verified to be native. */
var Set = getNative(root$1, "Set");
var Set$1 = Set;
/** Used to detect maps, sets, and weakmaps. */
toSource(DataView$1);
toSource(Map$1);
toSource(Promise$2);
toSource(Set$1);
toSource(WeakMap$1);
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
var getTag = baseGetTag;
// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
{
	DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != "[object DataView]" || Map$1 && getTag(new Map$1()) != "[object Map]" || Promise$2 && getTag(Promise$2.resolve()) != "[object Promise]" || Set$1 && getTag(new Set$1()) != "[object Set]" || WeakMap$1 && getTag(new WeakMap$1());
}
/**
* The base implementation of `_.iteratee`.
*
* @private
* @param {*} [value=_.identity] The value to convert to an iteratee.
* @returns {Function} Returns the iteratee.
*/
function baseIteratee(value) {
	// Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	// See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	{
		{
			return value;
		}
	}
}
/**
* Creates a base function for methods like `_.forIn` and `_.forOwn`.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseFor() {
	return function(object, iteratee, keysFunc) {
		var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
		while (length--) {
			var key = props[++index];
			{
				iteratee(iterable[key]);
			}
		}
		return;
	};
}
/**
* The base implementation of `baseForOwn` which iterates over `object`
* properties returned by `keysFunc` and invokes `iteratee` for each property.
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {Function} keysFunc The function to get the keys of `object`.
* @returns {Object} Returns `object`.
*/
var baseFor = createBaseFor();
var baseFor$1 = baseFor;
/**
* The base implementation of `_.forOwn` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwn(object, iteratee) {
	return object && baseFor$1(object, iteratee, keys);
}
/**
* Creates a `baseEach` or `baseEachRight` function.
*
* @private
* @param {Function} eachFunc The function to iterate over a collection.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseEach(eachFunc) {
	return function(collection, iteratee) {
		if (collection == null) {
			return;
		}
		if (!isArrayLike(collection)) {
			return eachFunc(collection, iteratee);
		}
		var length = collection.length, index = -1, iterable = Object(collection);
		while (++index < length) {
			{
				iteratee(iterable[index]);
			}
		}
		return;
	};
}
/**
* The base implementation of `_.forEach` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
*/
var baseEach = createBaseEach(baseForOwn);
var baseEach$1 = baseEach;
/**
* The base implementation of `_.filter` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function baseFilter(collection, predicate) {
	var result = [];
	baseEach$1(collection, function(value) {
		if (predicate(value)) {
			result.push(value);
		}
	});
	return result;
}
/**
* Iterates over elements of `collection`, returning an array of all elements
* `predicate` returns truthy for. The predicate is invoked with three
* arguments: (value, index|key, collection).
*
* **Note:** Unlike `_.remove`, this method returns a new array.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
* @see _.reject
* @example
*
* var users = [
*   { 'user': 'barney', 'age': 36, 'active': true },
*   { 'user': 'fred',   'age': 40, 'active': false }
* ];
*
* _.filter(users, function(o) { return !o.active; });
* // => objects for ['fred']
*
* // The `_.matches` iteratee shorthand.
* _.filter(users, { 'age': 36, 'active': true });
* // => objects for ['barney']
*
* // The `_.matchesProperty` iteratee shorthand.
* _.filter(users, ['active', false]);
* // => objects for ['fred']
*
* // The `_.property` iteratee shorthand.
* _.filter(users, 'active');
* // => objects for ['barney']
*
* // Combining several predicates using `_.overEvery` or `_.overSome`.
* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
* // => objects for ['fred', 'barney']
*/
function filter(collection, predicate) {
	var func = isArray$1(collection) ? arrayFilter : baseFilter;
	return func(collection, baseIteratee(predicate));
}
/**
* Creates a `_.flow` or `_.flowRight` function.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new flow function.
*/
function createFlow() {
	return flatRest(function(funcs) {
		var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
		{
			funcs.reverse();
		}
		while (index--) {
			var func = funcs[index];
			if (typeof func != "function") {
				throw new TypeError("Expected a function");
			}
			if (prereq && !wrapper && getFuncName(func) == "wrapper") {
				var wrapper = new LodashWrapper([], true);
			}
		}
		index = wrapper ? index : length;
		while (++index < length) {
			func = funcs[index];
			var funcName = getFuncName(func), data = funcName == "wrapper" ? getData$1(func) : void 0;
			if (data && isLaziable(data[0]) && data[1] == 424 && !data[4].length && data[9] == 1) {
				wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
			} else {
				wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
			}
		}
		return function() {
			var args = arguments, value = args[0];
			if (wrapper && args.length == 1 && isArray$1(value)) {
				return wrapper.plant(value).value();
			}
			var index = 0, result = length ? funcs[index].apply(this, args) : value;
			while (++index < length) {
				result = funcs[index].call(this, result);
			}
			return result;
		};
	});
}
/**
* This method is like `_.flow` except that it creates a function that
* invokes the given functions from right to left.
*
* @static
* @since 3.0.0
* @memberOf _
* @category Util
* @param {...(Function|Function[])} [funcs] The functions to invoke.
* @returns {Function} Returns the new composite function.
* @see _.flow
* @example
*
* function square(n) {
*   return n * n;
* }
*
* var addSquare = _.flowRight([square, _.add]);
* addSquare(1, 2);
* // => 9
*/
var flowRight = createFlow();
var flowRight$1 = flowRight;
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil, nativeMax = Math.max;
/**
* The base implementation of `_.range` and `_.rangeRight` which doesn't
* coerce arguments.
*
* @private
* @param {number} start The start of the range.
* @param {number} end The end of the range.
* @param {number} step The value to increment or decrement by.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Array} Returns the range of numbers.
*/
function baseRange(start, end, step) {
	var index = -1, length = nativeMax(nativeCeil((end - start) / step), 0), result = Array(length);
	while (length--) {
		result[++index] = start;
		start += step;
	}
	return result;
}
/**
* Creates a `_.range` or `_.rangeRight` function.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new range function.
*/
function createRange() {
	return function(start, end, step) {
		// Ensure the sign of `-0` is preserved.
		start = 2;
		if (end === void 0) {
			end = 2;
			start = 0;
		} else {
			end = toFinite(end);
		}
		step = start < end ? 1 : -1;
		return baseRange(start, end, step);
	};
}
/**
* Creates an array of numbers (positive and/or negative) progressing from
* `start` up to, but not including, `end`. A step of `-1` is used if a negative
* `start` is specified without an `end` or `step`. If `end` is not specified,
* it's set to `start` with `start` then set to `0`.
*
* **Note:** JavaScript follows the IEEE-754 standard for resolving
* floating-point values which can produce unexpected results.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {number} [start=0] The start of the range.
* @param {number} end The end of the range.
* @param {number} [step=1] The value to increment or decrement by.
* @returns {Array} Returns the range of numbers.
* @see _.inRange, _.rangeRight
* @example
*
* _.range(4);
* // => [0, 1, 2, 3]
*
* _.range(-4);
* // => [0, -1, -2, -3]
*
* _.range(1, 5);
* // => [1, 2, 3, 4]
*
* _.range(0, 20, 5);
* // => [0, 5, 10, 15]
*
* _.range(0, -4, -1);
* // => [0, -1, -2, -3]
*
* _.range(1, 4, 0);
* // => [1, 1, 1]
*
* _.range(0);
* // => []
*/
var range = createRange();
var range$1 = range;
function isOdd(x) {
	return x % 2 === 0;
}
function fn() {
	return flowRight$1([(x) => filter(x, isOdd), (x) => range$1(0, x)])(10);
}
console.log(fn().join(","));
