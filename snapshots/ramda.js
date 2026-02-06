function _isPlaceholder(a) {
	return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}
/**
* Optimized internal one-arity curry function.
*
* @private
* @category Function
* @param {Function} fn The function to curry.
* @return {Function} The curried function.
*/
function _curry1(fn) {
	return function f1(a) {
		if (arguments.length === 0 || _isPlaceholder(a)) {
			return f1;
		} else {
			return fn.apply(this, arguments);
		}
	};
}
/**
* Optimized internal two-arity curry function.
*
* @private
* @category Function
* @param {Function} fn The function to curry.
* @return {Function} The curried function.
*/
function _curry2(fn) {
	return function f2(a, b) {
		switch (arguments.length) {
			case 0: return f2;
			case 1: return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
				return fn(a, _b);
			});
			default: return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
				return fn(_a, b);
			}) : _isPlaceholder(b) ? _curry1(function(_b) {
				return fn(a, _b);
			}) : fn(a, b);
		}
	};
}
function _arity(n, fn) {
	/* eslint-disable no-unused-vars */
	switch (n) {
		case 0: return function() {
			return fn.apply(void 0, arguments);
		};
		case 1: return function(a0) {
			return fn.apply(void 0, arguments);
		};
		case 2: return function(a0, a1) {
			return fn.apply(void 0, arguments);
		};
		case 3: return function(a0, a1, a2) {
			return fn.apply(void 0, arguments);
		};
		case 4: return function(a0, a1, a2, a3) {
			return fn.apply(void 0, arguments);
		};
		case 5: return function(a0, a1, a2, a3, a4) {
			return fn.apply(void 0, arguments);
		};
		case 6: return function(a0, a1, a2, a3, a4, a5) {
			return fn.apply(void 0, arguments);
		};
		case 7: return function(a0, a1, a2, a3, a4, a5, a6) {
			return fn.apply(void 0, arguments);
		};
		case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {
			return fn.apply(void 0, arguments);
		};
		case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
			return fn.apply(void 0, arguments);
		};
		case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
			return fn.apply(void 0, arguments);
		};
		default: throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
	}
}
/**
* Optimized internal three-arity curry function.
*
* @private
* @category Function
* @param {Function} fn The function to curry.
* @return {Function} The curried function.
*/
function _curry3(fn) {
	return function f3(a, b, c) {
		switch (arguments.length) {
			case 0: return f3;
			case 1: return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
				return fn(a, _b, _c);
			});
			case 2: return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
				return fn(_a, b, _c);
			}) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
				return fn(a, _b, _c);
			}) : _curry1(function(_c) {
				return fn(a, b, _c);
			});
			default: return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
				return fn(_a, _b, c);
			}) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
				return fn(_a, b, _c);
			}) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
				return fn(a, _b, _c);
			}) : _isPlaceholder(a) ? _curry1(function(_a) {
				return fn(_a, b, c);
			}) : _isPlaceholder(b) ? _curry1(function(_b) {
				return fn(a, _b, c);
			}) : _isPlaceholder(c) ? _curry1(function(_c) {
				return fn(a, b, _c);
			}) : fn(a, b, c);
		}
	};
}
/**
* Tests whether or not an object is an array.
*
* @private
* @param {*} val The object to test.
* @return {Boolean} `true` if `val` is an array, `false` otherwise.
* @example
*
*      _isArray([]); //=> true
*      _isArray(null); //=> false
*      _isArray({}); //=> false
*/
var _isArray = Array.isArray;
function _isTransformer(obj) {
	return obj != null && typeof obj["@@transducer/step"] === "function";
}
/**
* Returns a function that dispatches with different strategies based on the
* object in list position (last argument). If it is an array, executes [fn].
* Otherwise, if it has a function with one of the given method names, it will
* execute that function (functor case). Otherwise, if it is a transformer,
* uses transducer [xf] to return a new transformer (transducer case).
* Otherwise, it will default to executing [fn].
*
* @private
* @param {Array} methodNames properties to check for a custom implementation
* @param {Function} xf transducer to initialize if object is transformer
* @param {Function} fn default ramda implementation
* @return {Function} A function that dispatches on object in list position
*/
function _dispatchable(methodNames, xf, fn) {
	return function() {
		if (arguments.length === 0) {
			return fn();
		}
		var args = Array.prototype.slice.call(arguments, 0);
		var obj = args.pop();
		if (!_isArray(obj)) {
			var idx = 0;
			while (idx < 1) {
				if (typeof obj[methodNames[idx]] === "function") {
					return obj[methodNames[idx]].apply(obj, args);
				}
				idx += 1;
			}
			if (_isTransformer(obj)) {
				var transducer = xf.apply(null, args);
				return transducer(obj);
			}
		}
		return fn.apply(0, arguments);
	};
}
var _xfBase = {
	a: function() {
		return this.xf["@@transducer/init"]();
	},
	b: function(result) {
		return this.xf["@@transducer/result"](result);
	}
};
function _isString(x) {
	return Object.prototype.toString.call(x) === "[object String]";
}
/**
* Tests whether or not an object is similar to an array.
*
* @private
* @category Type
* @category List
* @sig * -> Boolean
* @param {*} x The object to test.
* @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
* @example
*
*      _isArrayLike([]); //=> true
*      _isArrayLike(true); //=> false
*      _isArrayLike({}); //=> false
*      _isArrayLike({length: 10}); //=> false
*      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
*/
var _isArrayLike = _curry1(function(x) {
	if (_isArray(x)) {
		return true;
	}
	if (!x) {
		return false;
	}
	if (typeof x !== "object") {
		return false;
	}
	if (_isString(x)) {
		return false;
	}
	if (x.nodeType === 1) {
		return !!x.length;
	}
	if (x.length === 0) {
		return true;
	}
	if (x.length > 0) {
		return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	}
	return false;
});
var _isArrayLike$1 = _isArrayLike;
var XWrap = function() {
	function XWrap(fn) {
		this.f = fn;
	}
	XWrap.prototype["@@transducer/init"] = function() {
		throw new Error("init not implemented on XWrap");
	};
	XWrap.prototype["@@transducer/result"] = function(acc) {
		return acc;
	};
	XWrap.prototype["@@transducer/step"] = function(acc, x) {
		return this.f(acc, x);
	};
	return XWrap;
}();
function _xwrap(fn) {
	return new XWrap(fn);
}
/**
* Creates a function that is bound to a context.
* Note: `R.bind` does not provide the additional argument-binding capabilities of
* [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
*
* @func
* @memberOf R
* @since v0.6.0
* @category Function
* @category Object
* @sig (* -> *) -> {*} -> (* -> *)
* @param {Function} fn The function to bind to context
* @param {Object} thisObj The context to bind `fn` to
* @return {Function} A function that will execute in the context of `thisObj`.
* @see R.partial
* @example
*
*      const log = R.bind(console.log, console);
*      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
*      // logs {a: 2}
* @symb R.bind(f, o)(a, b) = f.call(o, a, b)
*/
var bind = _curry2(function(fn, thisObj) {
	return _arity(fn.length, function() {
		return fn.apply(thisObj, arguments);
	});
});
var bind$1 = bind;
function _arrayReduce(xf, acc, list) {
	var idx = 0;
	var len = list.length;
	while (idx < len) {
		acc = xf["@@transducer/step"](acc, list[idx]);
		if (acc && acc["@@transducer/reduced"]) {
			acc = acc["@@transducer/value"];
			break;
		}
		idx += 1;
	}
	return xf["@@transducer/result"](acc);
}
function _iterableReduce(xf, acc, iter) {
	var step = iter.next();
	while (!step.done) {
		acc = xf["@@transducer/step"](acc, step.value);
		if (acc && acc["@@transducer/reduced"]) {
			acc = acc["@@transducer/value"];
			break;
		}
		step = iter.next();
	}
	return xf["@@transducer/result"](acc);
}
function _methodReduce(xf, acc, obj, methodName) {
	return xf["@@transducer/result"](obj[methodName](bind$1(xf["@@transducer/step"], xf), acc));
}
var symIterator = Symbol.iterator;
function _reduce(fn, acc, list) {
	if (typeof fn === "function") {
		fn = _xwrap(fn);
	}
	if (_isArrayLike$1(list)) {
		return _arrayReduce(fn, acc, list);
	}
	if (typeof list["fantasy-land/reduce"] === "function") {
		return _methodReduce(fn, acc, list, "fantasy-land/reduce");
	}
	if (list[symIterator] != null) {
		return _iterableReduce(fn, acc, list[symIterator]());
	}
	if (typeof list.next === "function") {
		return _iterableReduce(fn, acc, list);
	}
	if (typeof list.reduce === "function") {
		return _methodReduce(fn, acc, list, "reduce");
	}
	throw new TypeError("reduce: list must be array or iterable");
}
function _has(prop, obj) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}
var toString = Object.prototype.toString;
var _isArguments = function() {
	return toString.call(arguments) === "[object Arguments]" ? function(x) {
		return toString.call(x) === "[object Arguments]";
	} : function(x) {
		return _has("callee", x);
	};
}();
var _isArguments$1 = _isArguments;
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
var nonEnumerableProps = [
	"constructor",
	"valueOf",
	"isPrototypeOf",
	"toString",
	"propertyIsEnumerable",
	"hasOwnProperty",
	"toLocaleString"
];
var hasArgsEnumBug = function() {
	return arguments.propertyIsEnumerable("length");
}();
var contains = function(list, item) {
	var idx = 0;
	while (idx < list.length) {
		if (list[idx] === item) {
			return true;
		}
		idx += 1;
	}
	return false;
};
/**
* Returns a list containing the names of all the enumerable own properties of
* the supplied object.
* Note that the order of the output array is not guaranteed to be consistent
* across different JS platforms.
*
* @func
* @memberOf R
* @since v0.1.0
* @category Object
* @sig {k: v} -> [k]
* @param {Object} obj The object to extract properties from
* @return {Array} An array of the object's own properties.
* @see R.keysIn, R.values
* @example
*
*      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
*/
var keys = !hasArgsEnumBug ? _curry1(function(obj) {
	return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function(obj) {
	if (Object(obj) !== obj) {
		return [];
	}
	var prop, nIdx;
	var ks = [];
	var checkArgsLength = hasArgsEnumBug && _isArguments$1(obj);
	for (prop in obj) {
		if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
			ks[ks.length] = prop;
		}
	}
	if (hasEnumBug) {
		nIdx = 6;
		while (nIdx >= 0) {
			prop = nonEnumerableProps[nIdx];
			if (_has(prop, obj) && !contains(ks, prop)) {
				ks[ks.length] = prop;
			}
			nIdx -= 1;
		}
	}
	return ks;
});
var keys$1 = keys;
/**
* Returns a single item by iterating through the list, successively calling
* the iterator function and passing it an accumulator value and the current
* value from the array, and then passing the result to the next call.
*
* The iterator function receives two values: *(acc, value)*. It may use
* [`R.reduced`](#reduced) to shortcut the iteration.
*
* The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
* is *(value, acc)*.
*
* Note: `R.reduce` does not skip deleted or unassigned indices (sparse
* arrays), unlike the native `Array.prototype.reduce` method. For more details
* on this behavior, see:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
*
* Dispatches to the `reduce` method of the third argument, if present. When
* doing so, it is up to the user to handle the [`R.reduced`](#reduced)
* shortcuting, as this is not implemented by `reduce`.
*
* @func
* @memberOf R
* @since v0.1.0
* @category List
* @sig ((a, b) -> a) -> a -> [b] -> a
* @param {Function} fn The iterator function. Receives two values, the accumulator and the
*        current element from the array.
* @param {*} acc The accumulator value.
* @param {Array} list The list to iterate over.
* @return {*} The final, accumulated value.
* @see R.reduced, R.addIndex, R.reduceRight
* @example
*
*      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
*      //          -               -10
*      //         / \              / \
*      //        -   4           -6   4
*      //       / \              / \
*      //      -   3   ==>     -3   3
*      //     / \              / \
*      //    -   2           -1   2
*      //   / \              / \
*      //  0   1            0   1
*
* @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
*/
var reduce = _curry3(_reduce);
var reduce$1 = reduce;
function _pipe(f, g) {
	return function() {
		return g.call(this, f.apply(this, arguments));
	};
}
/**
* This checks whether a function has a [methodname] function. If it isn't an
* array it will execute that function otherwise it will default to the ramda
* implementation.
*
* @private
* @param {Function} fn ramda implemtation
* @param {String} methodname property to check for a custom implementation
* @return {Object} Whatever the return value of the method is.
*/
function _checkForMethod(methodname, fn) {
	return function() {
		var length = arguments.length;
		if (length === 0) {
			return fn();
		}
		var obj = arguments[length - 1];
		return _isArray(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
	};
}
/**
* Returns the elements of the given list or string (or object with a `slice`
* method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
*
* Dispatches to the `slice` method of the third argument, if present.
*
* @func
* @memberOf R
* @since v0.1.4
* @category List
* @sig Number -> Number -> [a] -> [a]
* @sig Number -> Number -> String -> String
* @param {Number} fromIndex The start index (inclusive).
* @param {Number} toIndex The end index (exclusive).
* @param {*} list
* @return {*}
* @example
*
*      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
*      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
*      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
*      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
*      R.slice(0, 3, 'ramda');                     //=> 'ram'
*/
var slice = _curry3(_checkForMethod("slice", function(fromIndex, toIndex, list) {
	return Array.prototype.slice.call(list, fromIndex, toIndex);
}));
var slice$1 = slice;
/**
* Returns all but the first element of the given list or string (or object
* with a `tail` method).
*
* Dispatches to the `slice` method of the first argument, if present.
*
* @func
* @memberOf R
* @since v0.1.0
* @category List
* @sig [a] -> [a]
* @sig String -> String
* @param {*} list
* @return {*}
* @see R.head, R.init, R.last
* @example
*
*      R.tail([1, 2, 3]);  //=> [2, 3]
*      R.tail([1, 2]);     //=> [2]
*      R.tail([1]);        //=> []
*      R.tail([]);         //=> []
*
*      R.tail('abc');  //=> 'bc'
*      R.tail('ab');   //=> 'b'
*      R.tail('a');    //=> ''
*      R.tail('');     //=> ''
*/
var tail = _curry1(_checkForMethod("tail", slice$1(1, Infinity)));
var tail$1 = tail;
/**
* Performs left-to-right function composition. The first argument may have
* any arity; the remaining arguments must be unary.
*
* In some libraries this function is named `sequence`.
*
* **Note:** The result of pipe is not automatically curried.
*
* @func
* @memberOf R
* @since v0.1.0
* @category Function
* @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
* @param {...Function} functions
* @return {Function}
* @see R.compose
* @example
*
*      const f = R.pipe(Math.pow, R.negate, R.inc);
*
*      f(3, 4); // -(3^4) + 1
* @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
*/
function pipe() {
	if (arguments.length === 0) {
		throw new Error("pipe requires at least one argument");
	}
	return _arity(arguments[0].length, reduce$1(_pipe, arguments[0], tail$1(arguments)));
}
/**
* Returns a new list or string with the elements or characters in reverse
* order.
*
* @func
* @memberOf R
* @since v0.1.0
* @category List
* @sig [a] -> [a]
* @sig String -> String
* @param {Array|String} list
* @return {Array|String}
* @example
*
*      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
*      R.reverse([1, 2]);     //=> [2, 1]
*      R.reverse([1]);        //=> [1]
*      R.reverse([]);         //=> []
*
*      R.reverse('abc');      //=> 'cba'
*      R.reverse('ab');       //=> 'ba'
*      R.reverse('a');        //=> 'a'
*      R.reverse('');         //=> ''
*/
var reverse = _curry1(function(list) {
	return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
});
var reverse$1 = reverse;
/**
* Performs right-to-left function composition. The last argument may have
* any arity; the remaining arguments must be unary.
*
* **Note:** The result of compose is not automatically curried.
*
* @func
* @memberOf R
* @since v0.1.0
* @category Function
* @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
* @param {...Function} ...functions The functions to compose
* @return {Function}
* @see R.pipe
* @example
*
*      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
*      const yellGreeting = R.compose(R.toUpper, classyGreeting);
*      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
*
*      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
*
* @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
*/
function compose() {
	if (arguments.length === 0) {
		throw new Error("compose requires at least one argument");
	}
	return pipe.apply(0, reverse$1(arguments));
}
function _filter(fn, list) {
	var idx = 0;
	var len = list.length;
	var result = [];
	while (idx < len) {
		if (fn(list[idx])) {
			result[result.length] = list[idx];
		}
		idx += 1;
	}
	return result;
}
function _isObject(x) {
	return Object.prototype.toString.call(x) === "[object Object]";
}
var XFilter = function() {
	function XFilter(f, xf) {
		this.xf = xf;
		this.f = f;
	}
	XFilter.prototype["@@transducer/init"] = _xfBase.a;
	XFilter.prototype["@@transducer/result"] = _xfBase.b;
	XFilter.prototype["@@transducer/step"] = function(result, input) {
		return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
	};
	return XFilter;
}();
var _xfilter = _curry2(function(f, xf) {
	return new XFilter(f, xf);
});
var _xfilter$1 = _xfilter;
/**
* Takes a predicate and a `Filterable`, and returns a new filterable of the
* same type containing the members of the given filterable which satisfy the
* given predicate. Filterable objects include plain objects or any object
* that has a filter method such as `Array`.
*
* Dispatches to the `filter` method of the second argument, if present.
*
* Acts as a transducer if a transformer is given in list position.
*
* @func
* @memberOf R
* @since v0.1.0
* @category List
* @sig Filterable f => (a -> Boolean) -> f a -> f a
* @param {Function} pred
* @param {Array} filterable
* @return {Array} Filterable
* @see R.reject, R.transduce, R.addIndex
* @example
*
*      const isEven = n => n % 2 === 0;
*
*      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
*
*      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
*/
var filter = _curry2(_dispatchable(["filter"], _xfilter$1, function(pred, filterable) {
	return _isObject(filterable) ? _reduce(function(acc, key) {
		if (pred(filterable[key])) {
			acc[key] = filterable[key];
		}
		return acc;
	}, {}, keys$1(filterable)) : _filter(pred, filterable);
}));
var filter$1 = filter;
function _isNumber(x) {
	return Object.prototype.toString.call(x) === "[object Number]";
}
/**
* Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
*
* @func
* @memberOf R
* @since v0.1.0
* @category List
* @sig Number -> Number -> [Number]
* @param {Number} from The first number in the list.
* @param {Number} to One more than the last number in the list.
* @return {Array} The list of numbers in the set `[a, b)`.
* @example
*
*      R.range(1, 5);    //=> [1, 2, 3, 4]
*      R.range(50, 53);  //=> [50, 51, 52]
*/
var range = _curry2(function(from, to) {
	if (!(_isNumber(from) && _isNumber(to))) {
		throw new TypeError("Both arguments to range must be numbers");
	}
	var result = [];
	var n = from;
	while (n < to) {
		result.push(n);
		n += 1;
	}
	return result;
});
var range$1 = range;
// const range = require('ramda/src/range')
// const compose = require('ramda/src/compose')
// const filter = require('ramda/src/filter')
function isOdd(x) {
	return x % 2 === 0;
}
function fn() {
	return compose(filter$1(isOdd), range$1(2))(10);
}
console.log(fn().join(","));
