var __spreadArrays = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
function purry(fn2, args, lazy) {
  var diff = fn2.length - args.length, arrayArgs = Array.from(args);
  if (diff === 0)
    return fn2.apply(void 0, arrayArgs);
  if (diff === 1) {
    var ret = function(data) {
      return fn2.apply(void 0, __spreadArrays([data], arrayArgs));
    };
    return (lazy || fn2.lazy) && (ret.lazy = lazy || fn2.lazy, ret.lazyArgs = args), ret;
  }
  throw new Error("Wrong number of arguments");
}
function pipe(value) {
  for (var operations = [], _i = 1; _i < arguments.length; _i++)
    operations[_i - 1] = arguments[_i];
  for (var ret = value, lazyOps = operations.map(function(op2) {
    var _a = op2, lazy = _a.lazy, lazyArgs = _a.lazyArgs;
    if (lazy) {
      var fn2 = lazy.apply(void 0, lazyArgs);
      return fn2.indexed = lazy.indexed, fn2.single = lazy.single, fn2.index = 0, fn2.items = [], fn2;
    }
    return null;
  }), opIdx = 0; opIdx < operations.length; ) {
    var op = operations[opIdx], lazyOp = lazyOps[opIdx];
    if (!lazyOp) {
      ret = op(ret), opIdx++;
      continue;
    }
    for (var lazySeq = [], j = opIdx; j < operations.length && lazyOps[j]; j++)
      if (lazySeq.push(lazyOps[j]), lazyOps[j].single)
        break;
    for (var acc = [], j = 0; j < ret.length; j++) {
      var item = ret[j];
      if (_processItem({ item, acc, lazySeq }))
        break;
    }
    var lastLazySeq = lazySeq[lazySeq.length - 1];
    lastLazySeq.single ? ret = acc[0] : ret = acc, opIdx += lazySeq.length;
  }
  return ret;
}
function _processItem(_a) {
  var item = _a.item, lazySeq = _a.lazySeq, acc = _a.acc;
  if (lazySeq.length === 0)
    return acc.push(item), !1;
  for (var lazyResult = { done: !1, hasNext: !1 }, isDone = !1, i = 0; i < lazySeq.length; i++) {
    var lazyFn = lazySeq[i], indexed = lazyFn.indexed, index = lazyFn.index, items = lazyFn.items;
    if (items.push(item), lazyResult = indexed ? lazyFn(item, index, items) : lazyFn(item), lazyFn.index++, lazyResult.hasNext)
      if (lazyResult.hasMany) {
        for (var nextValues = lazyResult.next, _i = 0, nextValues_1 = nextValues; _i < nextValues_1.length; _i++) {
          var subItem = nextValues_1[_i], subResult = _processItem({
            item: subItem,
            acc,
            lazySeq: lazySeq.slice(i + 1)
          });
          if (subResult)
            return !0;
        }
        return !1;
      } else
        item = lazyResult.next;
    if (!lazyResult.hasNext)
      break;
    lazyResult.done && (isDone = !0);
  }
  return lazyResult.hasNext && acc.push(item), !!isDone;
}
function _reduceLazy(array, lazy, indexed) {
  return array.reduce(function(acc, item, index) {
    var result = indexed ? lazy(item, index, array) : lazy(item);
    return result.hasMany === !0 ? acc.push.apply(acc, result.next) : result.hasNext === !0 && acc.push(result.next), acc;
  }, []);
}
var _toLazyIndexed = function(fn2) {
  return fn2.indexed = !0, fn2;
};
function filter() {
  return purry(_filter(!1), arguments, filter.lazy);
}
var _filter = function(indexed) {
  return function(array, fn2) {
    return _reduceLazy(array, indexed ? filter.lazyIndexed(fn2) : filter.lazy(fn2), indexed);
  };
}, _lazy = function(indexed) {
  return function(fn2) {
    return function(value, index, array) {
      var valid = indexed ? fn2(value, index, array) : fn2(value);
      return valid ? {
        done: !1,
        hasNext: !0,
        next: value
      } : {
        done: !1,
        hasNext: !1
      };
    };
  };
};
(function(filter2) {
  function indexed() {
    return purry(_filter(!0), arguments, filter2.lazyIndexed);
  }
  filter2.indexed = indexed, filter2.lazy = _lazy(!1), filter2.lazyIndexed = _toLazyIndexed(_lazy(!0));
})(filter || (filter = {}));
function range() {
  return purry(_range, arguments);
}
function _range(start, end) {
  for (var ret = [], i = start; i < end; i++)
    ret.push(i);
  return ret;
}
function isOdd(x) {
  return x % 2 === 0;
}
function fn(x) {
  return pipe(
    x,
    (x2) => range(2, x2),
    (x2) => filter(x2, isOdd)
  );
}
const answer = fn(10).join(",");
export {
  answer
};
