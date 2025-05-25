function _isPlaceholder(a) {
  return a != null && typeof a == "object" && a["@@functional/placeholder"] === !0;
}
function _curry1(fn2) {
  return function f1(a) {
    return arguments.length === 0 || _isPlaceholder(a) ? f1 : fn2.apply(this, arguments);
  };
}
function _curry2(fn2) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn2(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn2(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn2(a, _b);
        }) : fn2(a, b);
    }
  };
}
function _arity(n, fn2) {
  switch (n) {
    case 0:
      return function() {
        return fn2.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn2.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn2.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn2.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn2.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn2.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn2.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn2.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn2.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn2.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn2.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}
function _curry3(fn2) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn2(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
          return fn2(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn2(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn2(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
          return fn2(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
          return fn2(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn2(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn2(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn2(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn2(a, b, _c);
        }) : fn2(a, b, c);
    }
  };
}
const _isArray = Array.isArray || function(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] == "function";
}
function _dispatchable(methodNames, xf, fn2) {
  return function() {
    if (arguments.length === 0)
      return fn2();
    var args = Array.prototype.slice.call(arguments, 0), obj = args.pop();
    if (!_isArray(obj)) {
      for (var idx = 0; idx < methodNames.length; ) {
        if (typeof obj[methodNames[idx]] == "function")
          return obj[methodNames[idx]].apply(obj, args);
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn2.apply(this, arguments);
  };
}
const _xfBase = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}
var _isArrayLike = /* @__PURE__ */ _curry1(function(x) {
  return _isArray(x) ? !0 : !x || typeof x != "object" || _isString(x) ? !1 : x.nodeType === 1 ? !!x.length : x.length === 0 ? !0 : x.length > 0 ? x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1) : !1;
}), XWrap = /* @__PURE__ */ function() {
  function XWrap2(fn2) {
    this.f = fn2;
  }
  return XWrap2.prototype["@@transducer/init"] = function() {
    throw new Error("init not implemented on XWrap");
  }, XWrap2.prototype["@@transducer/result"] = function(acc) {
    return acc;
  }, XWrap2.prototype["@@transducer/step"] = function(acc, x) {
    return this.f(acc, x);
  }, XWrap2;
}();
function _xwrap(fn2) {
  return new XWrap(fn2);
}
var bind = /* @__PURE__ */ _curry2(function(fn2, thisObj) {
  return _arity(fn2.length, function() {
    return fn2.apply(thisObj, arguments);
  });
});
function _arrayReduce(xf, acc, list) {
  for (var idx = 0, len = list.length; idx < len; ) {
    if (acc = xf["@@transducer/step"](acc, list[idx]), acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}
function _iterableReduce(xf, acc, iter) {
  for (var step = iter.next(); !step.done; ) {
    if (acc = xf["@@transducer/step"](acc, step.value), acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
}
function _methodReduce(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind(xf["@@transducer/step"], xf), acc));
}
var symIterator = typeof Symbol < "u" ? Symbol.iterator : "@@iterator";
function _reduce(fn2, acc, list) {
  if (typeof fn2 == "function" && (fn2 = _xwrap(fn2)), _isArrayLike(list))
    return _arrayReduce(fn2, acc, list);
  if (typeof list["fantasy-land/reduce"] == "function")
    return _methodReduce(fn2, acc, list, "fantasy-land/reduce");
  if (list[symIterator] != null)
    return _iterableReduce(fn2, acc, list[symIterator]());
  if (typeof list.next == "function")
    return _iterableReduce(fn2, acc, list);
  if (typeof list.reduce == "function")
    return _methodReduce(fn2, acc, list, "reduce");
  throw new TypeError("reduce: list must be array or iterable");
}
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var toString = Object.prototype.toString, _isArguments = /* @__PURE__ */ function() {
  return toString.call(arguments) === "[object Arguments]" ? function(x) {
    return toString.call(x) === "[object Arguments]";
  } : function(x) {
    return _has("callee", x);
  };
}(), hasEnumBug = !/* @__PURE__ */ {
  toString: null
}.propertyIsEnumerable("toString"), nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"], hasArgsEnumBug = /* @__PURE__ */ function() {
  return arguments.propertyIsEnumerable("length");
}(), contains = function(list, item) {
  for (var idx = 0; idx < list.length; ) {
    if (list[idx] === item)
      return !0;
    idx += 1;
  }
  return !1;
}, keys = /* @__PURE__ */ _curry1(typeof Object.keys == "function" && !hasArgsEnumBug ? function(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
} : function(obj) {
  if (Object(obj) !== obj)
    return [];
  var prop, nIdx, ks = [], checkArgsLength = hasArgsEnumBug && _isArguments(obj);
  for (prop in obj)
    _has(prop, obj) && (!checkArgsLength || prop !== "length") && (ks[ks.length] = prop);
  if (hasEnumBug)
    for (nIdx = nonEnumerableProps.length - 1; nIdx >= 0; )
      prop = nonEnumerableProps[nIdx], _has(prop, obj) && !contains(ks, prop) && (ks[ks.length] = prop), nIdx -= 1;
  return ks;
}), reduce = /* @__PURE__ */ _curry3(_reduce);
function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
}
function _checkForMethod(methodname, fn2) {
  return function() {
    var length = arguments.length;
    if (length === 0)
      return fn2();
    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] != "function" ? fn2.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}
var slice = /* @__PURE__ */ _curry3(
  /* @__PURE__ */ _checkForMethod("slice", function(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
  })
), tail = /* @__PURE__ */ _curry1(
  /* @__PURE__ */ _checkForMethod(
    "tail",
    /* @__PURE__ */ slice(1, 1 / 0)
  )
);
function pipe() {
  if (arguments.length === 0)
    throw new Error("pipe requires at least one argument");
  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}
var reverse = /* @__PURE__ */ _curry1(function(list) {
  return _isString(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse();
});
function compose() {
  if (arguments.length === 0)
    throw new Error("compose requires at least one argument");
  return pipe.apply(this, reverse(arguments));
}
function _filter(fn2, list) {
  for (var idx = 0, len = list.length, result = []; idx < len; )
    fn2(list[idx]) && (result[result.length] = list[idx]), idx += 1;
  return result;
}
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
var XFilter = /* @__PURE__ */ function() {
  function XFilter2(f, xf) {
    this.xf = xf, this.f = f;
  }
  return XFilter2.prototype["@@transducer/init"] = _xfBase.init, XFilter2.prototype["@@transducer/result"] = _xfBase.result, XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  }, XFilter2;
}(), _xfilter = /* @__PURE__ */ _curry2(function(f, xf) {
  return new XFilter(f, xf);
}), filter = /* @__PURE__ */ _curry2(
  /* @__PURE__ */ _dispatchable(["filter"], _xfilter, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
      return pred(filterable[key]) && (acc[key] = filterable[key]), acc;
    }, {}, keys(filterable)) : (
      // else
      _filter(pred, filterable)
    );
  })
);
function _isNumber(x) {
  return Object.prototype.toString.call(x) === "[object Number]";
}
var range = /* @__PURE__ */ _curry2(function(from, to) {
  if (!(_isNumber(from) && _isNumber(to)))
    throw new TypeError("Both arguments to range must be numbers");
  for (var result = [], n = from; n < to; )
    result.push(n), n += 1;
  return result;
});
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
