var __spreadArrays = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
/**
* Creates a function with `data-first` and `data-last` signatures.
*
* `purry` is a dynamic function and it's not type safe. It should be wrapped by a function that have proper typings.
* Refer to the example below for correct usage.
*
* @param fn the function to purry.
* @param args the arguments
* @signature R.purry(fn, arguments);
* @example-raw
*    function _findIndex(array, fn) {
*      for (let i = 0; i < array.length; i++) {
*        if (fn(array[i])) {
*          return i;
*        }
*      }
*      return -1;
*    }
*
*    // data-first
*    function findIndex<T>(array: T[], fn: (item: T) => boolean): number;
*
*    // data-last
*    function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;
*
*    function findIndex() {
*      return R.purry(_findIndex, arguments);
*    }
* @category Function
*/
function purry(fn, args, lazy) {
	var diff = fn.length - args.length;
	var arrayArgs = Array.from(args);
	if (diff === 0) {
		return fn.apply(void 0, arrayArgs);
	}
	if (diff === 1) {
		var ret = function(data) {
			return fn.apply(void 0, __spreadArrays([data], arrayArgs));
		};
		if (lazy || fn.lazy) {
			ret.lazy = lazy || fn.lazy;
			ret.lazyArgs = args;
		}
		return ret;
	}
	throw new Error("Wrong number of arguments");
}
function pipe(value) {
	var operations = [];
	for (var _i = 1; _i < arguments.length; _i++) {
		operations[_i - 1] = arguments[_i];
	}
	var ret = value;
	var lazyOps = operations.map(function(op) {
		var _a = op, lazy = _a.lazy, lazyArgs = _a.lazyArgs;
		if (lazy) {
			var fn = lazy.apply(void 0, lazyArgs);
			fn.indexed = lazy.indexed;
			fn.single = lazy.single;
			fn.index = 0;
			fn.items = [];
			return fn;
		}
		return null;
	});
	var opIdx = 0;
	while (opIdx < operations.length) {
		var op = operations[opIdx];
		var lazyOp = lazyOps[opIdx];
		if (!lazyOp) {
			ret = op(ret);
			opIdx++;
			continue;
		}
		var lazySeq = [];
		for (var j = opIdx; j < operations.length; j++) {
			if (lazyOps[j]) {
				lazySeq.push(lazyOps[j]);
				if (lazyOps[j].single) {
					break;
				}
			} else {
				break;
			}
		}
		var acc = [];
		for (var j = 0; j < ret.length; j++) {
			var item = ret[j];
			if (_processItem({
				item,
				acc,
				lazySeq
			})) {
				break;
			}
		}
		var lastLazySeq = lazySeq[lazySeq.length - 1];
		if (lastLazySeq.single) {
			ret = acc[0];
		} else {
			ret = acc;
		}
		opIdx += lazySeq.length;
	}
	return ret;
}
function _processItem(_a) {
	var item = _a.item, lazySeq = _a.lazySeq, acc = _a.acc;
	if (lazySeq.length === 0) {
		acc.push(item);
		return false;
	}
	var lazyResult = {
		done: false,
		hasNext: false
	};
	var isDone = false;
	for (var i = 0; i < lazySeq.length; i++) {
		var lazyFn = lazySeq[i];
		var indexed = lazyFn.indexed;
		var index = lazyFn.index;
		var items = lazyFn.items;
		items.push(item);
		lazyResult = indexed ? lazyFn(item, index, items) : lazyFn(item);
		lazyFn.index++;
		if (lazyResult.hasNext) {
			if (lazyResult.hasMany) {
				var nextValues = lazyResult.next;
				for (var _i = 0, nextValues_1 = nextValues; _i < nextValues_1.length; _i++) {
					var subItem = nextValues_1[_i];
					var subResult = _processItem({
						item: subItem,
						acc,
						lazySeq: lazySeq.slice(i + 1)
					});
					if (subResult) {
						return true;
					}
				}
				return false;
			} else {
				item = lazyResult.next;
			}
		}
		if (!lazyResult.hasNext) {
			break;
		}
		// process remaining functions in the pipe
		// but don't process remaining elements in the input array
		if (lazyResult.done) {
			isDone = true;
		}
	}
	if (lazyResult.hasNext) {
		acc.push(item);
	}
	if (isDone) {
		return true;
	}
	return false;
}
function _reduceLazy(array, lazy) {
	return array.reduce(function(acc, item) {
		var result = lazy(item);
		{
			if (result.hasNext === true) {
				acc.push(result.next);
			}
		}
		return acc;
	}, []);
}
function filter() {
	return purry(_filter(), arguments, filter.a);
}
var _filter = function() {
	return function(array, fn) {
		return _reduceLazy(array, filter.a(fn));
	};
};
var _lazy = function() {
	return function(fn) {
		return function(value) {
			var valid = fn(value);
			if (!!valid === true) {
				return {
					done: false,
					hasNext: true,
					next: value
				};
			}
			return {
				done: false,
				hasNext: false
			};
		};
	};
};
(function(filter) {
	filter.a = _lazy();
})(filter);
function range() {
	return purry(_range, arguments);
}
function _range(start, end) {
	var ret = [];
	for (var i = start; i < end; i++) {
		ret.push(i);
	}
	return ret;
}
function isOdd(x) {
	return x % 2 === 0;
}
function fn() {
	return pipe(10, (x) => range(2, x), (x) => filter(x, isOdd));
}
const answer = fn().join(",");
export { answer };
