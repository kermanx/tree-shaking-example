function curry(fn2, args = []) {
  return (..._args) => ((rest) => rest.length >= fn2.length ? fn2(...rest) : curry(fn2, rest))([...args, ..._args]);
}
const _isArray = Array.isArray;
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
const _keys = Object.keys;
function reduceFn(reducer, acc, list) {
  if (list === void 0)
    return acc;
  if (_isArray(list)) {
    let index = 0;
    const len = list.length;
    for (; index < len; )
      acc = reducer(acc, list[index], index, list), index++;
  } else {
    let index = 0;
    const keys = _keys(list), len = keys.length;
    for (; index < len; ) {
      const key = keys[index];
      acc = reducer(acc, key, list[key], list), index++;
    }
  }
  return acc;
}
const reduce = curry(reduceFn);
function filterObject(fn2, obj) {
  const willReturn = {};
  for (const prop in obj)
    fn2(obj[prop], prop, obj) && (willReturn[prop] = obj[prop]);
  return willReturn;
}
function filter(predicate, list) {
  if (arguments.length === 1) return (_list) => filter(predicate, _list);
  if (!list) return [];
  if (!_isArray(list))
    return filterObject(predicate, list);
  let index = 0;
  const len = list.length, willReturn = [];
  for (; index < len; ) {
    const value = list[index];
    predicate(value, index) && willReturn.push(value), index++;
  }
  return willReturn;
}
function multiply(x, y) {
  return arguments.length === 1 ? (_y) => multiply(x, _y) : x * y;
}
reduce(multiply, 1);
function range(start, end) {
  if (arguments.length === 1) return (_end) => range(start, _end);
  if (Number.isNaN(Number(start)) || Number.isNaN(Number(end)))
    throw new TypeError("Both arguments to range must be numbers");
  if (end < start) return [];
  const len = end - start, willReturn = Array(len);
  for (let i = 0; i < len; i++)
    willReturn[i] = start + i;
  return willReturn;
}
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
