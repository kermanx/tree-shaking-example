const FUNC_ERROR_TEXT = "Expected a function", HASH_UNDEFINED = "__lodash_hash_undefined__", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", symbolTag = "[object Symbol]", reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reEscapeChar = /\\(\\)?/g, reIsHostCtor = /^\[object .+?Constructor\]$/, freeGlobal = typeof global == "object" && global && global.Object === Object && global, freeSelf = typeof self == "object" && self && self.Object === Object && self, root = freeGlobal || freeSelf || Function("return this")();
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function isHostObject(value) {
  let result = !1;
  if (value != null && typeof value.toString != "function")
    try {
      result = !!String(value);
    } catch {
    }
  return result;
}
const arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype, coreJsData = root["__core-js_shared__"], maskSrcKey = function() {
  const uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}(), funcToString = funcProto.toString, {
  hasOwnProperty
} = objectProto, objectToString = objectProto.toString, reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), {
  Symbol: Symbol$1
} = root, {
  splice
} = arrayProto, Map = getNative(root, "Map"), nativeCreate = getNative(Object, "create"), symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function Hash(entries) {
  let index = -1, length = entries ? entries.length : 0;
  for (this.clear(); ++index < length; ) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}
function hashGet(key) {
  const data = this.__data__;
  if (nativeCreate) {
    const result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : void 0;
}
function hashHas(key) {
  const data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
}
function hashSet(key, value) {
  const data = this.__data__;
  return data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value, this;
}
Hash.prototype.clear = hashClear;
Hash.prototype.delete = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function ListCache(entries) {
  let index = -1;
  const length = entries ? entries.length : 0;
  for (this.clear(); ++index < length; ) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function listCacheClear() {
  this.__data__ = [];
}
function listCacheDelete(key) {
  const data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0)
    return !1;
  const lastIndex = data.length - 1;
  return index == lastIndex ? data.pop() : splice.call(data, index, 1), !0;
}
function listCacheGet(key) {
  const data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  const data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? data.push([key, value]) : data[index][1] = value, this;
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype.delete = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
function MapCache(entries) {
  let index = -1;
  const length = entries ? entries.length : 0;
  for (this.clear(); ++index < length; ) {
    const entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function mapCacheClear() {
  this.__data__ = {
    hash: new Hash(),
    map: new (Map || ListCache)(),
    string: new Hash()
  };
}
function mapCacheDelete(key) {
  return getMapData(this, key).delete(key);
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  return getMapData(this, key).set(key, value), this;
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype.delete = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function assocIndexOf(array, key) {
  let {
    length
  } = array;
  for (; length--; )
    if (eq(array[length][0], key))
      return length;
  return -1;
}
function baseIsNative(value) {
  return !isObject(value) || isMasked(value) ? !1 : (isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor).test(toSource(value));
}
function baseToString(value) {
  if (typeof value == "string")
    return value;
  if (isSymbol(value))
    return symbolToString ? symbolToString.call(value) : "";
  const result = String(value);
  return result == "0" && 1 / value == -1 / 0 ? "-0" : result;
}
function getMapData(map, key) {
  const data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function getNative(object, key) {
  const value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
function isKeyable(value) {
  const type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
memoize((string) => {
  string = toString(string);
  const result = [];
  return reLeadingDot.test(string) && result.push(""), string.replace(rePropName, (match, number, quote, string2) => {
    result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
  }), result;
});
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch {
    }
    try {
      return String(func);
    } catch {
    }
  }
  return "";
}
function memoize(func, resolver) {
  if (typeof func != "function" || resolver && typeof resolver != "function")
    throw new TypeError(FUNC_ERROR_TEXT);
  var memoized = function() {
    const args = arguments, key = resolver ? resolver.apply(this, args) : args[0], {
      cache
    } = memoized;
    if (cache.has(key))
      return cache.get(key);
    const result = func.apply(this, args);
    return memoized.cache = cache.set(key, result), result;
  };
  return memoized.cache = new (memoize.Cache || MapCache)(), memoized;
}
memoize.Cache = MapCache;
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
function isFunction(value) {
  const tag = isObject(value) ? objectToString.call(value) : "";
  return tag == funcTag || tag == genTag;
}
function isObject(value) {
  const type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function compose(...fns) {
  if (fns.length === 0)
    throw new Error("compose requires at least one argument");
  return (...args) => {
    const list = fns.slice();
    if (list.length > 0) {
      let result = list.pop()(...args);
      for (; list.length > 0; )
        result = list.pop()(result);
      return result;
    }
  };
}
function filterObject(fn2, obj) {
  const willReturn = {};
  for (const prop in obj)
    fn2(obj[prop], prop, obj) && (willReturn[prop] = obj[prop]);
  return willReturn;
}
function filter(fn2, list) {
  if (arguments.length === 1) return (_list) => filter(fn2, _list);
  if (list == null)
    return [];
  if (!Array.isArray(list))
    return filterObject(fn2, list);
  let index = -1, resIndex = 0;
  const len = list.length, willReturn = [];
  for (; ++index < len; ) {
    const value = list[index];
    fn2(value, index) && (willReturn[resIndex++] = value);
  }
  return willReturn;
}
function range(from, to) {
  if (arguments.length === 1) return (_to) => range(from, _to);
  if (Number.isNaN(Number(from)) || Number.isNaN(Number(to)))
    throw new TypeError("Both arguments to range must be numbers");
  if (to < from) return [];
  const len = to - from, willReturn = Array(len);
  for (let i = 0; i < len; i++)
    willReturn[i] = from + i;
  return willReturn;
}
const charCodesString = [...range(65, 90), ...range(97, 122)];
[...charCodesString, ...range(49, 57)];
function curry(fn2, args = []) {
  return (..._args) => ((rest) => rest.length >= fn2.length ? fn2(...rest) : curry(fn2, rest))([...args, ..._args]);
}
function multiply(a, b) {
  return arguments.length === 1 ? (_b) => multiply(a, _b) : a * b;
}
function reduceFn(fn2, acc, list) {
  return list.reduce(fn2, acc);
}
const reduce = curry(reduceFn);
reduce(multiply, 1);
function isOdd(x) {
  return x % 2 === 0;
}
function fn(x) {
  return compose(
    filter(isOdd),
    range(2)
  )(x);
}
const answer = fn(10).join(",");
export {
  answer
};
