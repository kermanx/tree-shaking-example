/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
  return extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) b2.hasOwnProperty(p) && (d2[p] = b2[p]);
  }, extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function isFunction(x) {
  return typeof x == "function";
}
var _enable_super_gross_mode_that_will_cause_bad_things = !1, config = {
  set useDeprecatedSynchronousErrorHandling(value) {
    if (value) {
      var error = /* @__PURE__ */ new Error();
      "" + error.stack;
    }
    _enable_super_gross_mode_that_will_cause_bad_things = value;
  },
  get useDeprecatedSynchronousErrorHandling() {
    return _enable_super_gross_mode_that_will_cause_bad_things;
  }
};
function hostReportError(err) {
  setTimeout(function() {
    throw err;
  }, 0);
}
var empty = {
  closed: !0,
  next: function(value) {
  },
  error: function(err) {
    if (config.useDeprecatedSynchronousErrorHandling)
      throw err;
    hostReportError(err);
  },
  complete: function() {
  }
}, isArray = /* @__PURE__ */ function() {
  return Array.isArray || function(x) {
    return x && typeof x.length == "number";
  };
}();
function isObject(x) {
  return x !== null && typeof x == "object";
}
var UnsubscriptionErrorImpl = /* @__PURE__ */ function() {
  function UnsubscriptionErrorImpl2(errors) {
    return Error.call(this), this.message = errors ? errors.length + ` errors occurred during unsubscription:
` + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = errors, this;
  }
  return UnsubscriptionErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype), UnsubscriptionErrorImpl2;
}(), UnsubscriptionError = UnsubscriptionErrorImpl, Subscription = /* @__PURE__ */ function() {
  function Subscription2(unsubscribe) {
    this.closed = !1, this._parentOrParents = null, this._subscriptions = null, unsubscribe && (this._unsubscribe = unsubscribe);
  }
  return Subscription2.prototype.unsubscribe = function() {
    var errors;
    if (!this.closed) {
      var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
      if (this.closed = !0, this._parentOrParents = null, this._subscriptions = null, _parentOrParents instanceof Subscription2)
        _parentOrParents.remove(this);
      else if (_parentOrParents !== null)
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      if (isFunction(_unsubscribe))
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
        }
      if (isArray(_subscriptions))
        for (var index = -1, len = _subscriptions.length; ++index < len; ) {
          var sub = _subscriptions[index];
          if (isObject(sub))
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [], e instanceof UnsubscriptionError ? errors = errors.concat(flattenUnsubscriptionErrors(e.errors)) : errors.push(e);
            }
        }
      if (errors)
        throw new UnsubscriptionError(errors);
    }
  }, Subscription2.prototype.add = function(teardown) {
    var subscription = teardown;
    if (!teardown)
      return Subscription2.EMPTY;
    switch (typeof teardown) {
      case "function":
        subscription = new Subscription2(teardown);
      case "object":
        if (subscription === this || subscription.closed || typeof subscription.unsubscribe != "function")
          return subscription;
        if (this.closed)
          return subscription.unsubscribe(), subscription;
        if (!(subscription instanceof Subscription2)) {
          var tmp = subscription;
          subscription = new Subscription2(), subscription._subscriptions = [tmp];
        }
        break;
      default:
        throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
    }
    var _parentOrParents = subscription._parentOrParents;
    if (_parentOrParents === null)
      subscription._parentOrParents = this;
    else if (_parentOrParents instanceof Subscription2) {
      if (_parentOrParents === this)
        return subscription;
      subscription._parentOrParents = [_parentOrParents, this];
    } else if (_parentOrParents.indexOf(this) === -1)
      _parentOrParents.push(this);
    else
      return subscription;
    var subscriptions = this._subscriptions;
    return subscriptions === null ? this._subscriptions = [subscription] : subscriptions.push(subscription), subscription;
  }, Subscription2.prototype.remove = function(subscription) {
    var subscriptions = this._subscriptions;
    if (subscriptions) {
      var subscriptionIndex = subscriptions.indexOf(subscription);
      subscriptionIndex !== -1 && subscriptions.splice(subscriptionIndex, 1);
    }
  }, Subscription2.EMPTY = function(empty2) {
    return empty2.closed = !0, empty2;
  }(new Subscription2()), Subscription2;
}();
function flattenUnsubscriptionErrors(errors) {
  return errors.reduce(function(errs, err) {
    return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
  }, []);
}
var rxSubscriber = /* @__PURE__ */ function() {
  return typeof Symbol == "function" ? /* @__PURE__ */ Symbol("rxSubscriber") : "@@rxSubscriber_" + /* @__PURE__ */ Math.random();
}(), Subscriber = /* @__PURE__ */ function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destinationOrNext, error, complete) {
    var _this = _super.call(this) || this;
    switch (_this.syncErrorValue = null, _this.syncErrorThrown = !1, _this.syncErrorThrowable = !1, _this.isStopped = !1, arguments.length) {
      case 0:
        _this.destination = empty;
        break;
      case 1:
        if (!destinationOrNext) {
          _this.destination = empty;
          break;
        }
        if (typeof destinationOrNext == "object") {
          destinationOrNext instanceof Subscriber2 ? (_this.syncErrorThrowable = destinationOrNext.syncErrorThrowable, _this.destination = destinationOrNext, destinationOrNext.add(_this)) : (_this.syncErrorThrowable = !0, _this.destination = new SafeSubscriber(_this, destinationOrNext));
          break;
        }
      default:
        _this.syncErrorThrowable = !0, _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
        break;
    }
    return _this;
  }
  return Subscriber2.prototype[rxSubscriber] = function() {
    return this;
  }, Subscriber2.create = function(next, error, complete) {
    var subscriber = new Subscriber2(next, error, complete);
    return subscriber.syncErrorThrowable = !1, subscriber;
  }, Subscriber2.prototype.next = function(value) {
    this.isStopped || this._next(value);
  }, Subscriber2.prototype.error = function(err) {
    this.isStopped || (this.isStopped = !0, this._error(err));
  }, Subscriber2.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, Subscriber2.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, _super.prototype.unsubscribe.call(this));
  }, Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  }, Subscriber2.prototype._error = function(err) {
    this.destination.error(err), this.unsubscribe();
  }, Subscriber2.prototype._complete = function() {
    this.destination.complete(), this.unsubscribe();
  }, Subscriber2.prototype._unsubscribeAndRecycle = function() {
    var _parentOrParents = this._parentOrParents;
    return this._parentOrParents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parentOrParents = _parentOrParents, this;
  }, Subscriber2;
}(Subscription), SafeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(_parentSubscriber, observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    _this._parentSubscriber = _parentSubscriber;
    var next, context = _this;
    return isFunction(observerOrNext) ? next = observerOrNext : observerOrNext && (next = observerOrNext.next, error = observerOrNext.error, complete = observerOrNext.complete, observerOrNext !== empty && (context = Object.create(observerOrNext), isFunction(context.unsubscribe) && _this.add(context.unsubscribe.bind(context)), context.unsubscribe = _this.unsubscribe.bind(_this))), _this._context = context, _this._next = next, _this._error = error, _this._complete = complete, _this;
  }
  return SafeSubscriber2.prototype.next = function(value) {
    if (!this.isStopped && this._next) {
      var _parentSubscriber = this._parentSubscriber;
      !config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable ? this.__tryOrUnsub(this._next, value) : this.__tryOrSetError(_parentSubscriber, this._next, value) && this.unsubscribe();
    }
  }, SafeSubscriber2.prototype.error = function(err) {
    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber, useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
      if (this._error)
        !useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable ? (this.__tryOrUnsub(this._error, err), this.unsubscribe()) : (this.__tryOrSetError(_parentSubscriber, this._error, err), this.unsubscribe());
      else if (_parentSubscriber.syncErrorThrowable)
        useDeprecatedSynchronousErrorHandling ? (_parentSubscriber.syncErrorValue = err, _parentSubscriber.syncErrorThrown = !0) : hostReportError(err), this.unsubscribe();
      else {
        if (this.unsubscribe(), useDeprecatedSynchronousErrorHandling)
          throw err;
        hostReportError(err);
      }
    }
  }, SafeSubscriber2.prototype.complete = function() {
    var _this = this;
    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber;
      if (this._complete) {
        var wrappedComplete = function() {
          return _this._complete.call(_this._context);
        };
        !config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable ? (this.__tryOrUnsub(wrappedComplete), this.unsubscribe()) : (this.__tryOrSetError(_parentSubscriber, wrappedComplete), this.unsubscribe());
      } else
        this.unsubscribe();
    }
  }, SafeSubscriber2.prototype.__tryOrUnsub = function(fn, value) {
    try {
      fn.call(this._context, value);
    } catch (err) {
      if (this.unsubscribe(), config.useDeprecatedSynchronousErrorHandling)
        throw err;
      hostReportError(err);
    }
  }, SafeSubscriber2.prototype.__tryOrSetError = function(parent, fn, value) {
    if (!config.useDeprecatedSynchronousErrorHandling)
      throw new Error("bad call");
    try {
      fn.call(this._context, value);
    } catch (err) {
      return config.useDeprecatedSynchronousErrorHandling ? (parent.syncErrorValue = err, parent.syncErrorThrown = !0, !0) : (hostReportError(err), !0);
    }
    return !1;
  }, SafeSubscriber2.prototype._unsubscribe = function() {
    var _parentSubscriber = this._parentSubscriber;
    this._context = null, this._parentSubscriber = null, _parentSubscriber.unsubscribe();
  }, SafeSubscriber2;
}(Subscriber);
function canReportError(observer) {
  for (; observer; ) {
    var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
    if (closed_1 || isStopped)
      return !1;
    destination && destination instanceof Subscriber ? observer = destination : observer = null;
  }
  return !0;
}
function toSubscriber(nextOrObserver, error, complete) {
  if (nextOrObserver) {
    if (nextOrObserver instanceof Subscriber)
      return nextOrObserver;
    if (nextOrObserver[rxSubscriber])
      return nextOrObserver[rxSubscriber]();
  }
  return !nextOrObserver && !error && !complete ? new Subscriber(empty) : new Subscriber(nextOrObserver, error, complete);
}
var observable = /* @__PURE__ */ function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function identity(x) {
  return x;
}
function pipeFromArray(fns) {
  return fns.length === 0 ? identity : fns.length === 1 ? fns[0] : function(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
var Observable = /* @__PURE__ */ function() {
  function Observable2(subscribe) {
    this._isScalar = !1, subscribe && (this._subscribe = subscribe);
  }
  return Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    return observable2.source = this, observable2.operator = operator, observable2;
  }, Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var operator = this.operator, sink = toSubscriber(observerOrNext, error, complete);
    if (operator ? sink.add(operator.call(sink, this.source)) : sink.add(this.source || config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink)), config.useDeprecatedSynchronousErrorHandling && sink.syncErrorThrowable && (sink.syncErrorThrowable = !1, sink.syncErrorThrown))
      throw sink.syncErrorValue;
    return sink;
  }, Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      config.useDeprecatedSynchronousErrorHandling && (sink.syncErrorThrown = !0, sink.syncErrorValue = err), canReportError(sink) ? sink.error(err) : console.warn(err);
    }
  }, Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    return promiseCtor = getPromiseCtor(promiseCtor), new promiseCtor(function(resolve, reject) {
      var subscription;
      subscription = _this.subscribe(function(value) {
        try {
          next(value);
        } catch (err) {
          reject(err), subscription && subscription.unsubscribe();
        }
      }, reject, resolve);
    });
  }, Observable2.prototype._subscribe = function(subscriber) {
    var source = this.source;
    return source && source.subscribe(subscriber);
  }, Observable2.prototype[observable] = function() {
    return this;
  }, Observable2.prototype.pipe = function() {
    for (var operations = [], _i = 0; _i < arguments.length; _i++)
      operations[_i] = arguments[_i];
    return operations.length === 0 ? this : pipeFromArray(operations)(this);
  }, Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    return promiseCtor = getPromiseCtor(promiseCtor), new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  }, Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  }, Observable2;
}();
function getPromiseCtor(promiseCtor) {
  if (promiseCtor || (promiseCtor = Promise), !promiseCtor)
    throw new Error("no Promise impl found");
  return promiseCtor;
}
function map(project, thisArg) {
  return function(source) {
    if (typeof project != "function")
      throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
    return source.lift(new MapOperator(project, thisArg));
  };
}
var MapOperator = /* @__PURE__ */ function() {
  function MapOperator2(project, thisArg) {
    this.project = project, this.thisArg = thisArg;
  }
  return MapOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
  }, MapOperator2;
}(), MapSubscriber = /* @__PURE__ */ function(_super) {
  __extends(MapSubscriber2, _super);
  function MapSubscriber2(destination, project, thisArg) {
    var _this = _super.call(this, destination) || this;
    return _this.project = project, _this.count = 0, _this.thisArg = thisArg || _this, _this;
  }
  return MapSubscriber2.prototype._next = function(value) {
    var result;
    try {
      result = this.project.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  }, MapSubscriber2;
}(Subscriber);
function filter(predicate, thisArg) {
  return function(source) {
    return source.lift(new FilterOperator(predicate, thisArg));
  };
}
var FilterOperator = /* @__PURE__ */ function() {
  function FilterOperator2(predicate, thisArg) {
    this.predicate = predicate, this.thisArg = thisArg;
  }
  return FilterOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
  }, FilterOperator2;
}(), FilterSubscriber = /* @__PURE__ */ function(_super) {
  __extends(FilterSubscriber2, _super);
  function FilterSubscriber2(destination, predicate, thisArg) {
    var _this = _super.call(this, destination) || this;
    return _this.predicate = predicate, _this.thisArg = thisArg, _this.count = 0, _this;
  }
  return FilterSubscriber2.prototype._next = function(value) {
    var result;
    try {
      result = this.predicate.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    result && this.destination.next(value);
  }, FilterSubscriber2;
}(Subscriber);
function range(start, count, scheduler) {
  return new Observable(function(subscriber) {
    var index = 0, current = start;
    do {
      if (index++ >= count) {
        subscriber.complete();
        break;
      }
      if (subscriber.next(current++), subscriber.closed)
        break;
    } while (!0);
  });
}
let answer = [];
range(1, 200).pipe(
  filter((x) => x % 2 === 1),
  map((x) => x + x)
).subscribe((x) => answer.push(x));
answer = answer.join(",");
export {
  answer
};
