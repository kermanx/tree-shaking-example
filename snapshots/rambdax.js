const funcTag = "[object Function]", genTag = "[object GeneratorFunction]";
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reIsHostCtor = /^\[object .+?Constructor\]$/;
const freeGlobal = typeof global === "object" && global && global.Object === Object && global;
const freeSelf = typeof self === "object" && self && self.Object === Object && self;
const root = freeGlobal || freeSelf || Function("return this")();
function getValue(object, key) {
	return object == null ? void 0 : object[key];
}
function isHostObject(value) {
	let result = false;
	if (value != null && typeof value.toString !== "function") {
		try {
			result = Boolean(String(value));
		} catch {}
	}
	return result;
}
const funcProto = Function.prototype, objectProto = Object.prototype;
const coreJsData = root["__core-js_shared__"];
const maskSrcKey = function() {
	const uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
const funcToString = funcProto.toString;
const { hasOwnProperty } = objectProto;
const objectToString = objectProto.toString;
const reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
const Map = getNative(root, "Map"), __unused_2157 = getNative(Object, "create");
function ListCache() {}
function MapCache() {
	this.a();
}
function mapCacheClear() {
	new (Map || ListCache)();
}
MapCache.prototype.a = mapCacheClear;
function baseIsNative(value) {
	if (!isObject(value) || isMasked(value)) {
		return false;
	}
	const pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
	return pattern.test(toSource(value));
}
function getNative(object, key) {
	const value = getValue(object, key);
	return baseIsNative(value) ? value : void 0;
}
function isMasked(func) {
	return Boolean(maskSrcKey) && maskSrcKey in func;
}
memoize();
function toSource(func) {
	if (func != null) {
		try {
			return funcToString.call(func);
		} catch {}
		try {
			return String(func);
		} catch {}
	}
	return "";
}
function memoize() {
	new MapCache();
	return;
}
function isFunction(value) {
	const tag = isObject(value) ? objectToString.call(value) : "";
	return tag == funcTag || tag == genTag;
}
function isObject(value) {
	const type = typeof value;
	return Boolean(value) && (type == "object" || type == "function");
}
function compose(...fns) {
	return (...args) => {
		const list = fns.slice();
		if (list.length > 0) {
			const fn = list.pop();
			let result = fn(...args);
			while (list.length > 0) {
				result = list.pop()(result);
			}
			return result;
		}
	};
}
function filterObject(fn, obj) {
	const willReturn = {};
	for (const prop in obj) {
		if (fn(obj[prop], prop, obj)) {
			willReturn[prop] = obj[prop];
		}
	}
	return willReturn;
}
function filter(fn, list) {
	if (arguments.length === 1) return (_list) => filter(fn, _list);
	if (list == void 0) {
		return [];
	}
	if (!Array.isArray(list)) {
		return filterObject(fn, list);
	}
	let index = -1;
	let resIndex = 0;
	const len = list.length;
	const willReturn = [];
	while (++index < len) {
		const value = list[index];
		if (fn(value, index)) {
			willReturn[resIndex++] = value;
		}
	}
	return willReturn;
}
function range(from, to) {
	if (arguments.length === 1) return (_to) => range(from, _to);
	if (Number.isNaN(Number(from)) || Number.isNaN(Number(to))) {
		throw new TypeError("Both arguments to range must be numbers");
	}
	if (to < from) return [];
	const len = to - from;
	const willReturn = Array(len);
	for (let i = 0; i < len; i++) {
		willReturn[i] = from + i;
	}
	return willReturn;
}
const __unused_8EBC = [range(65, 90), range(97, 122)];
range(49, 57);
function curry(fn, args = []) {
	return (..._args) => ((rest) => rest.length >= fn.length ? fn(...rest) : curry(fn, rest))([...args, ..._args]);
}
function multiply(a, b) {
	if (arguments.length === 1) return (_b) => multiply(a, _b);
	return a * b;
}
function reduceFn(fn, acc, list) {
	return list.reduce(fn, acc);
}
const reduce = curry(reduceFn);
reduce(multiply, 1);
function isOdd(x) {
	return x % 2 === 0;
}
function fn() {
	return compose(filter(isOdd), range(2))(10);
}
console.log(fn().join(","));
