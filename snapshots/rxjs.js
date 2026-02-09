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
/* global Reflect, Promise */
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf;
	return extendStatics(d, b);
};
function __extends(d, b) {
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = (__.prototype = b.prototype, new __());
}
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
	return typeof x === "function";
}
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
	setTimeout(function() {
		throw err;
	}, 0);
}
/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
	closed: true,
	next: function() {},
	error: function(err) {
		{
			{
				hostReportError(err);
			}
		}
	},
	complete: function() {}
};
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = function() {
	return Array.isArray;
}();
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
	return x !== null && typeof x === "object";
}
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = function() {
	function UnsubscriptionErrorImpl(errors) {
		Error.call(this);
		this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
			return i + 1 + ") " + err.toString();
		}).join("\n  ") : "";
		this.name = "UnsubscriptionError";
		this.errors = errors;
		return this;
	}
	UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
	return UnsubscriptionErrorImpl;
}();
var UnsubscriptionError = UnsubscriptionErrorImpl;
/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
var Subscription = function() {
	function Subscription(unsubscribe) {
		this.closed = false;
		this._parentOrParents = null;
		this._subscriptions = null;
		if (unsubscribe) {
			this._unsubscribe = unsubscribe;
		}
	}
	Subscription.prototype.unsubscribe = function() {
		var errors;
		if (this.closed) {
			return;
		}
		var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
		this.closed = true;
		this._parentOrParents = null;
		this._subscriptions = null;
		if (_parentOrParents instanceof Subscription) {
			_parentOrParents.remove(this);
		} else if (_parentOrParents !== null) {
			for (var index = 0; index < _parentOrParents.length; ++index) {
				var parent_1 = _parentOrParents[index];
				parent_1.remove(this);
			}
		}
		if (isFunction(_unsubscribe)) {
			try {
				_unsubscribe.call(this);
			} catch (e) {
				errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
			}
		}
		if (isArray(_subscriptions)) {
			var index = -1;
			var len = _subscriptions.length;
			while (++index < len) {
				var sub = _subscriptions[index];
				if (isObject(sub)) {
					try {
						sub.unsubscribe();
					} catch (e) {
						errors = errors || [];
						if (e instanceof UnsubscriptionError) {
							errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
						} else {
							errors.push(e);
						}
					}
				}
			}
		}
		if (errors) {
			throw new UnsubscriptionError(errors);
		}
	};
	Subscription.prototype.add = function(teardown) {
		var subscription = teardown;
		if (!teardown) {
			return Subscription.EMPTY;
		}
		switch (typeof teardown) {
			case "function": subscription = new Subscription(teardown);
			case "object":
				if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== "function") {
					return subscription;
				} else if (this.closed) {
					subscription.unsubscribe();
					return subscription;
				} else if (!(subscription instanceof Subscription)) {
					var tmp = subscription;
					subscription = new Subscription();
					subscription._subscriptions = [tmp];
				}
				break;
			default: {
				throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
			}
		}
		var _parentOrParents = subscription._parentOrParents;
		if (_parentOrParents === null) {
			subscription._parentOrParents = this;
		} else if (_parentOrParents instanceof Subscription) {
			if (_parentOrParents === this) {
				return subscription;
			}
			subscription._parentOrParents = [_parentOrParents, this];
		} else if (_parentOrParents.indexOf(this) === -1) {
			_parentOrParents.push(this);
		} else {
			return subscription;
		}
		var subscriptions = this._subscriptions;
		if (subscriptions === null) {
			this._subscriptions = [subscription];
		} else {
			subscriptions.push(subscription);
		}
		return subscription;
	};
	Subscription.prototype.remove = function(subscription) {
		var subscriptions = this._subscriptions;
		if (subscriptions) {
			var subscriptionIndex = subscriptions.indexOf(subscription);
			if (subscriptionIndex !== -1) {
				subscriptions.splice(subscriptionIndex, 1);
			}
		}
	};
	Subscription.EMPTY = function(empty) {
		empty.closed = true;
		return empty;
	}(new Subscription());
	return Subscription;
}();
function flattenUnsubscriptionErrors(errors) {
	return errors.reduce(function(errs, err) {
		return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
	}, []);
}
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = function() {
	return Symbol("rxSubscriber");
}();
/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = function(_super) {
	__extends(Subscriber, _super);
	function Subscriber(destinationOrNext, error, complete) {
		var _this = _super.call(this) || this;
		_this.syncErrorValue = null;
		_this.syncErrorThrown = false;
		_this.syncErrorThrowable = false;
		_this.isStopped = false;
		switch (arguments.length) {
			case 0:
				_this.destination = empty;
				break;
			case 1:
				if (!destinationOrNext) {
					_this.destination = empty;
					break;
				}
				if (typeof destinationOrNext === "object") {
					if (destinationOrNext instanceof Subscriber) {
						_this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
						_this.destination = destinationOrNext;
						destinationOrNext.add(_this);
					} else {
						_this.syncErrorThrowable = true;
						_this.destination = new SafeSubscriber(_this, destinationOrNext);
					}
					break;
				}
			default:
				_this.syncErrorThrowable = true;
				_this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
				break;
		}
		return _this;
	}
	Subscriber.prototype[rxSubscriber] = function() {
		return this;
	};
	Subscriber.create = function(next, error, complete) {
		var subscriber = new Subscriber(next, error, complete);
		subscriber.syncErrorThrowable = false;
		return subscriber;
	};
	Subscriber.prototype.next = function(value) {
		if (!this.isStopped) {
			this._next(value);
		}
	};
	Subscriber.prototype.error = function(err) {
		if (!this.isStopped) {
			this.isStopped = true;
			this._error(err);
		}
	};
	Subscriber.prototype.complete = function() {
		if (!this.isStopped) {
			this.isStopped = true;
			this._complete();
		}
	};
	Subscriber.prototype.unsubscribe = function() {
		if (this.closed) {
			return;
		}
		this.isStopped = true;
		_super.prototype.unsubscribe.call(this);
	};
	Subscriber.prototype._next = function(value) {
		this.destination.next(value);
	};
	Subscriber.prototype._error = function(err) {
		this.destination.error(err);
		this.unsubscribe();
	};
	Subscriber.prototype._complete = function() {
		this.destination.complete();
		this.unsubscribe();
	};
	Subscriber.prototype._unsubscribeAndRecycle = function() {
		var _parentOrParents = this._parentOrParents;
		this._parentOrParents = null;
		this.unsubscribe();
		this.closed = false;
		this.isStopped = false;
		this._parentOrParents = _parentOrParents;
		return this;
	};
	return Subscriber;
}(Subscription);
var SafeSubscriber = function(_super) {
	__extends(SafeSubscriber, _super);
	function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
		var _this = _super.call(this) || this;
		_this._parentSubscriber = _parentSubscriber;
		var next;
		var context = _this;
		if (isFunction(observerOrNext)) {
			next = observerOrNext;
		} else if (observerOrNext) {
			next = observerOrNext.next;
			error = observerOrNext.error;
			complete = observerOrNext.complete;
			if (observerOrNext !== empty) {
				context = Object.create(observerOrNext);
				if (isFunction(context.unsubscribe)) {
					_this.add(context.unsubscribe.bind(context));
				}
				context.unsubscribe = _this.unsubscribe.bind(_this);
			}
		}
		_this._context = context;
		_this._next = next;
		_this._error = error;
		_this._complete = complete;
		return _this;
	}
	SafeSubscriber.prototype.next = function(value) {
		if (!this.isStopped && this._next) {
			{
				{
					this.__tryOrUnsub(this._next, value);
				}
			}
		}
	};
	SafeSubscriber.prototype.error = function(err) {
		if (!this.isStopped) {
			var _parentSubscriber = this._parentSubscriber;
			if (this._error) {
				{
					{
						this.__tryOrUnsub(this._error, err);
						this.unsubscribe();
					}
				}
			} else if (!_parentSubscriber.syncErrorThrowable) {
				this.unsubscribe();
				hostReportError(err);
			} else {
				{
					{
						hostReportError(err);
					}
				}
				this.unsubscribe();
			}
		}
	};
	SafeSubscriber.prototype.complete = function() {
		var _this = this;
		if (!this.isStopped) {
			if (this._complete) {
				var wrappedComplete = function() {
					return _this._complete.call(_this._context);
				};
				{
					{
						this.__tryOrUnsub(wrappedComplete);
						this.unsubscribe();
					}
				}
			} else {
				this.unsubscribe();
			}
		}
	};
	SafeSubscriber.prototype.__tryOrUnsub = function(fn, value) {
		try {
			fn.call(this._context, value);
		} catch (err) {
			this.unsubscribe();
			{
				{
					hostReportError(err);
				}
			}
		}
	};
	SafeSubscriber.prototype.__tryOrSetError = function() {
		{
			{
				throw new Error("bad call");
			}
		}
	};
	SafeSubscriber.prototype._unsubscribe = function() {
		var _parentSubscriber = this._parentSubscriber;
		this._context = null;
		this._parentSubscriber = null;
		_parentSubscriber.unsubscribe();
	};
	return SafeSubscriber;
}(Subscriber);
/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
function canReportError(observer) {
	while (observer) {
		var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
		if (closed_1 || isStopped) {
			return false;
		} else if (destination && destination instanceof Subscriber) {
			observer = destination;
		} else {
			observer = null;
		}
	}
	return true;
}
/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
	if (nextOrObserver) {
		if (nextOrObserver instanceof Subscriber) {
			return nextOrObserver;
		}
		if (nextOrObserver[rxSubscriber]) {
			return nextOrObserver[rxSubscriber]();
		}
	}
	if (!nextOrObserver && !error && !complete) {
		return new Subscriber(empty);
	}
	return new Subscriber(nextOrObserver, error, complete);
}
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = function() {
	return Symbol.observable || "@@observable";
}();
/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
	return x;
}
/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
function pipeFromArray(fns) {
	if (fns.length === 0) {
		return identity;
	}
	if (fns.length === 1) {
		return fns[0];
	}
	return function(input) {
		return fns.reduce(function(prev, fn) {
			return fn(prev);
		}, input);
	};
}
/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
var Observable = function() {
	function Observable(subscribe) {
		this._isScalar = false;
		if (subscribe) {
			this._subscribe = subscribe;
		}
	}
	Observable.prototype.lift = function(operator) {
		var observable = new Observable();
		observable.source = this;
		observable.operator = operator;
		return observable;
	};
	Observable.prototype.subscribe = function(observerOrNext, error, complete) {
		var operator = this.operator;
		var sink = toSubscriber(observerOrNext, error, complete);
		if (operator) {
			sink.add(operator.call(sink, this.source));
		} else {
			sink.add(this.source || false ? this._subscribe(sink) : this._trySubscribe(sink));
		}
		return sink;
	};
	Observable.prototype._trySubscribe = function(sink) {
		try {
			return this._subscribe(sink);
		} catch (err) {
			if (canReportError(sink)) {
				sink.error(err);
			} else {
				console.warn(err);
			}
		}
	};
	Observable.prototype.forEach = function(next, promiseCtor) {
		var _this = this;
		promiseCtor = getPromiseCtor(promiseCtor);
		return new promiseCtor(function(resolve, reject) {
			var subscription;
			subscription = _this.subscribe(function(value) {
				try {
					next(value);
				} catch (err) {
					reject(err);
					if (subscription) {
						subscription.unsubscribe();
					}
				}
			}, reject, resolve);
		});
	};
	Observable.prototype._subscribe = function(subscriber) {
		var source = this.source;
		return source && source.subscribe(subscriber);
	};
	Observable.prototype[observable] = function() {
		return this;
	};
	Observable.prototype.pipe = function() {
		var operations = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			operations[_i] = arguments[_i];
		}
		if (operations.length === 0) {
			return this;
		}
		return pipeFromArray(operations)(this);
	};
	Observable.prototype.toPromise = function(promiseCtor) {
		var _this = this;
		promiseCtor = getPromiseCtor(promiseCtor);
		return new promiseCtor(function(resolve, reject) {
			var value;
			_this.subscribe(function(x) {
				return value = x;
			}, function(err) {
				return reject(err);
			}, function() {
				return resolve(value);
			});
		});
	};
	return Observable;
}();
function getPromiseCtor(promiseCtor) {
	if (!promiseCtor) {
		promiseCtor = Promise;
	}
	if (!promiseCtor) {
		throw new Error("no Promise impl found");
	}
	return promiseCtor;
}
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project) {
	return function(source) {
		return source.lift(new MapOperator(project));
	};
}
var MapOperator = function() {
	function MapOperator(project) {
		this.project = project;
		this.thisArg = void 0;
	}
	MapOperator.prototype.call = function(subscriber, source) {
		return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	};
	return MapOperator;
}();
var MapSubscriber = function(_super) {
	__extends(MapSubscriber, _super);
	function MapSubscriber(destination, project, thisArg) {
		var _this = _super.call(this, destination) || this;
		_this.project = project;
		_this.count = 0;
		_this.thisArg = thisArg || _this;
		return _this;
	}
	MapSubscriber.prototype._next = function(value) {
		var result;
		try {
			result = this.project.call(this.thisArg, value, this.count++);
		} catch (err) {
			this.destination.error(err);
			return;
		}
		this.destination.next(result);
	};
	return MapSubscriber;
}(Subscriber);
/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function filter(predicate) {
	return function(source) {
		return source.lift(new FilterOperator(predicate));
	};
}
var FilterOperator = function() {
	function FilterOperator(predicate) {
		this.predicate = predicate;
		this.thisArg = void 0;
	}
	FilterOperator.prototype.call = function(subscriber, source) {
		return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	};
	return FilterOperator;
}();
var FilterSubscriber = function(_super) {
	__extends(FilterSubscriber, _super);
	function FilterSubscriber(destination, predicate, thisArg) {
		var _this = _super.call(this, destination) || this;
		_this.predicate = predicate;
		_this.thisArg = thisArg;
		_this.count = 0;
		return _this;
	}
	FilterSubscriber.prototype._next = function(value) {
		var result;
		try {
			result = this.predicate.call(this.thisArg, value, this.count++);
		} catch (err) {
			this.destination.error(err);
			return;
		}
		if (result) {
			this.destination.next(value);
		}
	};
	return FilterSubscriber;
}(Subscriber);
/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function range() {
	return new Observable(function(subscriber) {
		var index = 0;
		var current = 1;
		{
			do {
				if (index++ >= 200) {
					subscriber.complete();
					break;
				}
				subscriber.next(current++);
				if (subscriber.closed) {
					break;
				}
			} while (true);
		}
		return void 0;
	});
}
let answer = [];
range().pipe(filter((x) => x % 2 === 1), map((x) => x + x)).subscribe((x) => answer.push(x));
console.log(answer.join(","));
