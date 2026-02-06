function getDefaultExportFromCjs(x) {
	return x;
}
var react = {};
var react_production = {};
function requireReact_production() {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var assign = Object.assign;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null
	}, hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = false;
		if (null === children) invokeCallback = true;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = true;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = true;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(0, child, count++);
		});
		return result;
	}
	var Children = {
		a: mapChildren,
		b: function(children, forEachFunc) {
			mapChildren(children, function() {
				forEachFunc.apply(0, arguments);
			});
		}
	};
	react_production.b = Children;
	react_production.d = REACT_FRAGMENT_TYPE;
	react_production.g = REACT_STRICT_MODE_TYPE;
	react_production.i = ReactSharedInternals;
	react_production.m = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	react_production.n = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	react_production.o = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	react_production.q = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	react_production.r = isValidElement;
	react_production.y = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	react_production.z = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	react_production.C = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	react_production.F = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	react_production.G = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	react_production.H = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	react_production.I = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	react_production.K = function(reducer) {
		return ReactSharedInternals.H.useReducer(reducer, 0, void 0);
	};
	react_production.L = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	react_production.M = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	react_production.P = "19.2.4";
	return react_production;
}
var hasRequiredReact;
function requireReact() {
	if (hasRequiredReact) return react.a;
	hasRequiredReact = 1;
	{
		react.a = requireReact_production();
	}
	return react.a;
}
var reactExports = requireReact();
var React = getDefaultExportFromCjs(reactExports);
var client = {};
var reactDomClient_production = {};
var scheduler = {};
var scheduler_production = {};
function requireScheduler_production() {
	(function(exports$1) {
		function push(heap, node) {
			var index = heap.length;
			heap.push(node);
			a: for (; 0 < index;) {
				var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
				if (0 < compare(parent, node)) heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
				else break a;
			}
		}
		function peek(heap) {
			return 0 === heap.length ? null : heap[0];
		}
		function pop(heap) {
			if (0 === heap.length) return;
			var first = heap[0], last = heap.pop();
			if (last !== first) {
				heap[0] = last;
				a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;) {
					var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
					if (0 > compare(left, last)) rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
					else if (rightIndex < length && 0 > compare(right, last)) heap[index] = right, heap[rightIndex] = last, index = rightIndex;
					else break a;
				}
			}
			return;
		}
		function compare(a, b) {
			var diff = a.sortIndex - b.sortIndex;
			return 0 !== diff ? diff : a.id - b.id;
		}
		exports$1.a = void 0;
		if ("object" === typeof performance && "function" === typeof performance.now) {
			var localPerformance = performance;
			exports$1.a = function() {
				return localPerformance.now();
			};
		} else {
			var localDate = Date, initialTime = localDate.now();
			exports$1.a = function() {
				return localDate.now() - initialTime;
			};
		}
		var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
		function advanceTimers(currentTime) {
			for (var timer = peek(timerQueue); null !== timer;) {
				if (null === timer.callback) pop(timerQueue);
				else if (timer.startTime <= currentTime) pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
				else break;
				timer = peek(timerQueue);
			}
		}
		function handleTimeout(currentTime) {
			isHostTimeoutScheduled = false;
			advanceTimers(currentTime);
			if (!isHostCallbackScheduled) if (null !== peek(taskQueue)) isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
			else {
				var firstTimer = peek(timerQueue);
				null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
			}
		}
		var isMessageLoopRunning = false, taskTimeoutID = -1, startTime = -1;
		function shouldYieldToHost() {
			return needsPaint ? true : exports$1.a() - startTime < 5 ? false : true;
		}
		function performWorkUntilDeadline() {
			needsPaint = false;
			if (isMessageLoopRunning) {
				var currentTime = exports$1.a();
				startTime = currentTime;
				var hasMoreWork = true;
				try {
					a: {
						isHostCallbackScheduled = false;
						isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
						isPerformingWork = true;
						var previousPriorityLevel = currentPriorityLevel;
						try {
							b: {
								advanceTimers(currentTime);
								for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost());) {
									var callback = currentTask.callback;
									if ("function" === typeof callback) {
										currentTask.callback = null;
										currentPriorityLevel = currentTask.priorityLevel;
										var continuationCallback = callback(currentTask.expirationTime <= currentTime);
										currentTime = exports$1.a();
										if ("function" === typeof continuationCallback) {
											currentTask.callback = continuationCallback;
											advanceTimers(currentTime);
											hasMoreWork = true;
											break b;
										}
										currentTask === peek(taskQueue) && pop(taskQueue);
										advanceTimers(currentTime);
									} else pop(taskQueue);
									currentTask = peek(taskQueue);
								}
								if (null !== currentTask) hasMoreWork = true;
								else {
									var firstTimer = peek(timerQueue);
									null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
									hasMoreWork = false;
								}
							}
							break a;
						} finally {
							currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
						}
						hasMoreWork = void 0;
					}
				} finally {
					hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
				}
			}
		}
		var schedulePerformWorkUntilDeadline;
		if ("function" === typeof localSetImmediate) schedulePerformWorkUntilDeadline = function() {
			localSetImmediate(performWorkUntilDeadline);
		};
		else if ("undefined" !== typeof MessageChannel) {
			var channel = new MessageChannel(), port = channel.port2;
			channel.port1.onmessage = performWorkUntilDeadline;
			schedulePerformWorkUntilDeadline = function() {
				port.postMessage(null);
			};
		} else schedulePerformWorkUntilDeadline = function() {
			localSetTimeout(performWorkUntilDeadline, 0);
		};
		function requestHostTimeout(callback, ms) {
			taskTimeoutID = localSetTimeout(function() {
				callback(exports$1.a());
			}, ms);
		}
		exports$1.h = function(task) {
			task.callback = null;
		};
		exports$1.j = function() {
			return currentPriorityLevel;
		};
		exports$1.l = function() {
			needsPaint = true;
		};
		exports$1.n = function(priorityLevel, callback, options) {
			var currentTime = exports$1.a();
			"object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
			switch (priorityLevel) {
				case 1:
					var timeout = -1;
					break;
				case 2:
					timeout = 250;
					break;
				case 5:
					timeout = 1073741823;
					break;
				case 4:
					timeout = 1e4;
					break;
				default: timeout = 5e3;
			}
			timeout = options + timeout;
			priorityLevel = {
				id: taskIdCounter++,
				callback,
				priorityLevel,
				startTime: options,
				expirationTime: timeout,
				sortIndex: -1
			};
			options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
			return priorityLevel;
		};
		exports$1.o = shouldYieldToHost;
	})(scheduler_production);
	return scheduler_production;
}
function requireScheduler() {
	{
		scheduler.a = requireScheduler_production();
	}
	return scheduler.a;
}
var reactDom = {};
var reactDom_production = {};
function requireReactDom_production() {
	var Internals = { a: 0 };
	reactDom_production.a = Internals;
	return reactDom_production;
}
function requireReactDom() {
	function checkDCE() {
		/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
			return;
		}
		try {
			// Verify that the code above has been dead code eliminated (DCE'd).
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			// DevTools shouldn't crash React, no matter what.
			// We should still report in case we break this code.
			console.error(err);
		}
	}
	{
		// DCE check should happen before ReactDOM bundle executes so that
		// DevTools can report bad minification during injection.
		checkDCE();
		reactDom.a = requireReactDom_production();
	}
	return reactDom.a;
}
function requireReactDomClient_production() {
	var Scheduler = requireScheduler(), React = requireReact(), ReactDOM = requireReactDom();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function isValidContainer(node) {
		return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
	}
	function getNearestMountedFiber(fiber) {
		var node = fiber, nearestMounted = fiber;
		if (fiber.alternate) for (; node.return;) node = node.return;
		else {
			fiber = node;
			do
				node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
			while (fiber);
		}
		return 3 === node.tag ? nearestMounted : null;
	}
	function getSuspenseInstanceFromFiber(fiber) {
		if (13 === fiber.tag) {
			var suspenseState = fiber.memoizedState;
			null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
			if (null !== suspenseState) return suspenseState.dehydrated;
		}
		return null;
	}
	function getActivityInstanceFromFiber(fiber) {
		if (31 === fiber.tag) {
			var activityState = fiber.memoizedState;
			null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
			if (null !== activityState) return activityState.dehydrated;
		}
		return null;
	}
	var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return type.displayName || "Context";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch {}
		}
		return null;
	}
	var isArrayImpl = Array.isArray, ReactSharedInternals = React.i, ReactDOMSharedInternals = ReactDOM.a, sharedNotPendingObject = {
		pending: false,
		data: null,
		method: null,
		action: null
	}, valueStack = [], index = -1;
	function createCursor(defaultValue) {
		return { current: defaultValue };
	}
	function pop(cursor) {
		0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
	}
	function push(cursor, value) {
		index++;
		valueStack[index] = cursor.current;
		cursor.current = value;
	}
	var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
	function pushHostContainer(fiber, nextRootInstance) {
		push(rootInstanceStackCursor, nextRootInstance);
		push(contextFiberStackCursor, fiber);
		push(contextStackCursor, null);
		switch (nextRootInstance.nodeType) {
			case 9:
			case 11:
				fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
				break;
			default: if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI) nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
			else switch (fiber) {
				case "svg":
					fiber = 1;
					break;
				case "math":
					fiber = 2;
					break;
				default: fiber = 0;
			}
		}
		pop(contextStackCursor);
		push(contextStackCursor, fiber);
	}
	function popHostContainer() {
		pop(contextStackCursor);
		pop(contextFiberStackCursor);
		pop(rootInstanceStackCursor);
	}
	function pushHostContext(fiber) {
		null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
		var context = contextStackCursor.current;
		var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
		context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
	}
	function popHostContext(fiber) {
		contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
		hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
	}
	var prefix, suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = false;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = true;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if (Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$1) {
								control = x$1;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$2) {
							control = x$2;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
						do
							if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
								var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
								fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
								return frame;
							}
						while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					}
					break;
				}
			}
		} finally {
			reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeFiber(fiber, childFiber) {
		switch (fiber.tag) {
			case 26:
			case 27:
			case 5: return describeBuiltInComponentFrame(fiber.type);
			case 16: return describeBuiltInComponentFrame("Lazy");
			case 13: return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
			case 19: return describeBuiltInComponentFrame("SuspenseList");
			case 0:
			case 15: return describeNativeComponentFrame(fiber.type, false);
			case 11: return describeNativeComponentFrame(fiber.type.render, false);
			case 1: return describeNativeComponentFrame(fiber.type, true);
			case 31: return describeBuiltInComponentFrame("Activity");
			default: return "";
		}
	}
	function getStackByFiberInDevAndProd(workInProgress) {
		try {
			var info = "", previous = null;
			do
				info += describeFiber(workInProgress, previous), previous = workInProgress, workInProgress = workInProgress.return;
			while (workInProgress);
			return info;
		} catch (x) {
			return "\nError generating stack: " + x.message + "\n" + x.stack;
		}
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.n, cancelCallback$1 = Scheduler.h, shouldYield = Scheduler.o, requestPaint = Scheduler.l, now = Scheduler.a, getCurrentPriorityLevel = Scheduler.j, rendererID = null, injectedHook = null;
	function setIsStrictModeForDevtools(newIsStrictMode) {
		if (injectedHook && "function" === typeof injectedHook.setStrictMode) try {
			injectedHook.setStrictMode(rendererID, newIsStrictMode);
		} catch {}
	}
	var clz32 = Math.clz32;
	var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
	function getHighestPriorityLanes(lanes) {
		var pendingSyncLanes = lanes & 42;
		if (0 !== pendingSyncLanes) return pendingSyncLanes;
		switch (lanes & -lanes) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return lanes & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return lanes & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return lanes & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return lanes;
		}
	}
	function getNextLanes(root, wipLanes, rootHasPendingCommit) {
		var pendingLanes = root.pendingLanes;
		if (0 === pendingLanes) return 0;
		var nextLanes = 0, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes;
		root = root.warmLanes;
		var nonIdlePendingLanes = pendingLanes & 134217727;
		0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
		return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
	}
	function checkIfRootIsPrerendering(root, renderLanes) {
		return 0 === (root.pendingLanes & ~(root.suspendedLanes & ~root.pingedLanes) & renderLanes);
	}
	function computeExpirationTime(lane, currentTime) {
		switch (lane) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return currentTime + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return currentTime + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function claimNextRetryLane() {
		var lane = nextRetryLane;
		nextRetryLane <<= 1;
		0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
		return lane;
	}
	function createLaneMap(initial) {
		for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
		return laneMap;
	}
	function markRootUpdated$1(root, updateLane) {
		root.pendingLanes |= updateLane;
		268435456 !== updateLane && (root.suspendedLanes = 0, root.pingedLanes = 0, root.warmLanes = 0);
	}
	function markRootFinished(root, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
		var previouslyPendingLanes = root.pendingLanes;
		root.pendingLanes = remainingLanes;
		root.suspendedLanes = 0;
		root.pingedLanes = 0;
		root.warmLanes = 0;
		root.expiredLanes &= remainingLanes;
		root.entangledLanes &= remainingLanes;
		root.errorRecoveryDisabledLanes &= remainingLanes;
		root.shellSuspendCounter = 0;
		var entanglements = root.entanglements, expirationTimes = root.expirationTimes, hiddenUpdates = root.hiddenUpdates;
		for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes;) {
			var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
			entanglements[index$7] = 0;
			expirationTimes[index$7] = -1;
			var hiddenUpdatesForLane = hiddenUpdates[index$7];
			if (null !== hiddenUpdatesForLane) for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
				var update = hiddenUpdatesForLane[index$7];
				null !== update && (update.lane &= -536870913);
			}
			remainingLanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
		0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root.tag && (root.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
	}
	function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
		root.pendingLanes |= spawnedLane;
		root.suspendedLanes &= ~spawnedLane;
		var spawnedLaneIndex = 31 - clz32(spawnedLane);
		root.entangledLanes |= spawnedLane;
		root.entanglements[spawnedLaneIndex] = root.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
	}
	function markRootEntangled(root, entangledLanes) {
		var rootEntangledLanes = root.entangledLanes |= entangledLanes;
		for (root = root.entanglements; rootEntangledLanes;) {
			var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
			lane & entangledLanes | root[index$8] & entangledLanes && (root[index$8] |= entangledLanes);
			rootEntangledLanes &= ~lane;
		}
	}
	function getBumpedLaneForHydration(root, renderLanes) {
		var renderLane = renderLanes & -renderLanes;
		renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
		return 0 !== (renderLane & (root.suspendedLanes | renderLanes)) ? 0 : renderLane;
	}
	function getBumpedLaneForHydrationByLane(lane) {
		switch (lane) {
			case 2:
				lane = 1;
				break;
			case 8:
				lane = 4;
				break;
			case 32:
				lane = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				lane = 128;
				break;
			case 268435456:
				lane = 134217728;
				break;
			default: lane = 0;
		}
		return lane;
	}
	function lanesToEventPriority(lanes) {
		lanes &= -lanes;
		return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
	}
	function resolveUpdatePriority() {
		var updatePriority = ReactDOMSharedInternals.a;
		if (0 !== updatePriority) return updatePriority;
		updatePriority = window.event;
		return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
	}
	var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
	function detachDeletedInstance(node) {
		delete node[internalInstanceKey];
		delete node[internalPropsKey];
		delete node[internalEventHandlersKey];
		delete node[internalEventHandlerListenersKey];
		delete node[internalEventHandlesSetKey];
	}
	function getClosestInstanceFromNode(targetNode) {
		var targetInst = targetNode[internalInstanceKey];
		if (targetInst) return targetInst;
		for (var parentNode = targetNode.parentNode; parentNode;) {
			if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
				parentNode = targetInst.alternate;
				if (null !== targetInst.child || null !== parentNode && null !== parentNode.child) for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode;) {
					if (parentNode = targetNode[internalInstanceKey]) return parentNode;
					targetNode = getParentHydrationBoundary(targetNode);
				}
				return targetInst;
			}
			targetNode = parentNode;
			parentNode = targetNode.parentNode;
		}
		return null;
	}
	function getInstanceFromNode(node) {
		if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
			var tag = node.tag;
			if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag) return node;
		}
		return null;
	}
	function getNodeFromInstance(inst) {
		var tag = inst.tag;
		if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
		throw Error(formatProdErrorMessage(33));
	}
	function getResourcesFromRoot(root) {
		var resources = root[internalRootNodeResourcesKey];
		resources || (resources = root[internalRootNodeResourcesKey] = {
			hoistableStyles: new Map(),
			hoistableScripts: new Map()
		});
		return resources;
	}
	function markNodeAsHoistable(node) {
		node[internalHoistableMarker] = true;
	}
	var allNativeEvents = new Set(), registrationNameDependencies = {};
	function registerTwoPhaseEvent(registrationName, dependencies) {
		registerDirectEvent(registrationName, dependencies);
		registerDirectEvent(registrationName + "Capture", dependencies);
	}
	function registerDirectEvent(registrationName, dependencies) {
		registrationNameDependencies[registrationName] = dependencies;
		for (registrationName = 0; registrationName < dependencies.length; registrationName++) allNativeEvents.add(dependencies[registrationName]);
	}
	var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return true;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = true;
		illegalAttributeNameCache[attributeName] = true;
		return false;
	}
	function setValueForAttribute(node, name, value) {
		if (isAttributeNameSafe(name)) if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
					node.removeAttribute(name);
					return;
				case "boolean":
					var prefix$10 = name.toLowerCase().slice(0, 5);
					if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
						node.removeAttribute(name);
						return;
					}
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForKnownAttribute(node, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForNamespacedAttribute(node, namespace, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttributeNS(namespace, name, "" + value);
		}
	}
	function getToStringValue(value) {
		switch (typeof value) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return value;
			case "object": return value;
			default: return "";
		}
	}
	function isCheckable(elem) {
		var type = elem.type;
		return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
	}
	function trackValueOnNode(node, valueField, currentValue) {
		var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
		if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
			var get = descriptor.get, set = descriptor.set;
			Object.defineProperty(node, valueField, {
				configurable: true,
				get: function() {
					return get.call(this);
				},
				set: function(value) {
					currentValue = "" + value;
					set.call(this, value);
				}
			});
			Object.defineProperty(node, valueField, { enumerable: descriptor.enumerable });
			return {
				getValue: function() {
					return currentValue;
				},
				setValue: function(value) {
					currentValue = "" + value;
				},
				stopTracking: function() {
					node._valueTracker = null;
					delete node[valueField];
				}
			};
		}
	}
	function track(node) {
		if (!node._valueTracker) {
			var valueField = isCheckable(node) ? "checked" : "value";
			node._valueTracker = trackValueOnNode(node, valueField, "" + node[valueField]);
		}
	}
	function updateValueIfChanged(node) {
		if (!node) return false;
		var tracker = node._valueTracker;
		if (!tracker) return true;
		var lastValue = tracker.getValue();
		var value = "";
		node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
		node = value;
		return node !== lastValue ? (tracker.setValue(node), true) : false;
	}
	function getActiveElement(doc) {
		doc = doc || ("undefined" !== typeof document ? document : void 0);
		if ("undefined" === typeof doc) return null;
		try {
			return doc.activeElement || doc.body;
		} catch {
			return doc.body;
		}
	}
	var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
	function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
		return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, function(ch) {
			return "\\" + ch.charCodeAt(0).toString(16) + " ";
		});
	}
	function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
		element.name = "";
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
		if (null != value) if ("number" === type) {
			if (0 === value && "" === element.value || element.value != value) element.value = "" + getToStringValue(value);
		} else element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
		else "submit" !== type && "reset" !== type || element.removeAttribute("value");
		null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
		null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
		null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
	}
	function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating) {
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
		if (null != value || null != defaultValue) {
			if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
				track(element);
				return;
			}
			defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
			value = null != value ? "" + getToStringValue(value) : defaultValue;
			isHydrating || value === element.value || (element.value = value);
			element.defaultValue = value;
		}
		checked = null != checked ? checked : defaultChecked;
		checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
		element.checked = isHydrating ? element.checked : !!checked;
		element.defaultChecked = !!checked;
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
		track(element);
	}
	function setDefaultValue(node, type, value) {
		"number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
	}
	function updateOptions(node, multiple, propValue, setDefaultSelected) {
		node = node.options;
		if (multiple) {
			multiple = {};
			for (var i = 0; i < propValue.length; i++) multiple["$" + propValue[i]] = true;
			for (propValue = 0; propValue < node.length; propValue++) i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
		} else {
			propValue = "" + getToStringValue(propValue);
			multiple = null;
			for (i = 0; i < node.length; i++) {
				if (node[i].value === propValue) {
					node[i].selected = true;
					setDefaultSelected && (node[i].defaultSelected = true);
					return;
				}
				null !== multiple || node[i].disabled || (multiple = node[i]);
			}
			null !== multiple && (multiple.selected = true);
		}
	}
	function updateTextarea(element, value, defaultValue) {
		if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
			element.defaultValue !== value && (element.defaultValue = value);
			return;
		}
		element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
	}
	function initTextarea(element, value, defaultValue, children) {
		if (null == value) {
			if (null != children) {
				if (null != defaultValue) throw Error(formatProdErrorMessage(92));
				if (isArrayImpl(children)) {
					if (1 < children.length) throw Error(formatProdErrorMessage(93));
					children = children[0];
				}
				defaultValue = children;
			}
			null == defaultValue && (defaultValue = "");
			value = defaultValue;
		}
		defaultValue = getToStringValue(value);
		element.defaultValue = defaultValue;
		children = element.textContent;
		children === defaultValue && "" !== children && null !== children && (element.value = children);
		track(element);
	}
	function setTextContent(node, text) {
		if (text) {
			var firstChild = node.firstChild;
			if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
				firstChild.nodeValue = text;
				return;
			}
		}
		node.textContent = text;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function setValueForStyle(style, styleName, value) {
		var isCustomProperty = 0 === styleName.indexOf("--");
		null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style.setProperty(styleName, "") : "float" === styleName ? style.cssFloat = "" : style[styleName] = "" : isCustomProperty ? style.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style.cssFloat = value : style[styleName] = ("" + value).trim() : style[styleName] = value + "px";
	}
	function setValueForStyles(node, styles, prevStyles) {
		if (null != styles && "object" !== typeof styles) throw Error(formatProdErrorMessage(62));
		node = node.style;
		if (null != prevStyles) {
			for (var styleName in prevStyles) !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
			for (var styleName$16 in styles) styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
		} else for (var styleName$17 in styles) styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
	}
	function isCustomElement(tagName) {
		if (-1 === tagName.indexOf("-")) return false;
		switch (tagName) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return false;
			default: return true;
		}
	}
	var aliases = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	function noop$1() {}
	var currentReplayingEvent = null;
	function getEventTarget(nativeEvent) {
		nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
		nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
		return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
	}
	var restoreTarget = null, restoreQueue = null;
	function restoreStateOfTarget(target) {
		var internalInstance = getInstanceFromNode(target);
		if (internalInstance && (target = internalInstance.stateNode)) {
			var props = target[internalPropsKey] || null;
			a: switch (target = internalInstance.stateNode, internalInstance.type) {
				case "input":
					updateInput(target, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
					internalInstance = props.name;
					if ("radio" === props.type && null != internalInstance) {
						for (props = target; props.parentNode;) props = props.parentNode;
						props = props.querySelectorAll("input[name=\"" + escapeSelectorAttributeValueInsideDoubleQuotes("" + internalInstance) + "\"][type=\"radio\"]");
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
							var otherNode = props[internalInstance];
							if (otherNode !== target && otherNode.form === target.form) {
								var otherProps = otherNode[internalPropsKey] || null;
								if (!otherProps) throw Error(formatProdErrorMessage(90));
								updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
							}
						}
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
					}
					break a;
				case "textarea":
					updateTextarea(target, props.value, props.defaultValue);
					break a;
				case "select": internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
			}
		}
	}
	var isInsideEventHandler = false;
	function batchedUpdates$1(fn, a, b) {
		if (isInsideEventHandler) return fn(a, b);
		isInsideEventHandler = true;
		try {
			var JSCompiler_inline_result = fn(a);
			return JSCompiler_inline_result;
		} finally {
			if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
				if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn)) for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
			}
		}
	}
	function getListener(inst, registrationName) {
		var stateNode = inst.stateNode;
		if (null === stateNode) return null;
		var props = stateNode[internalPropsKey] || null;
		if (null === props) return null;
		stateNode = props[registrationName];
		a: switch (registrationName) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
				inst = !props;
				break a;
			default: inst = false;
		}
		if (inst) return null;
		if (stateNode && "function" !== typeof stateNode) throw Error(formatProdErrorMessage(231, registrationName, typeof stateNode));
		return stateNode;
	}
	var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
	if (canUseDOM) try {
		var options = {};
		Object.defineProperty(options, "passive", { get: function() {
			passiveBrowserEventsSupported = true;
		} });
		window.addEventListener("test", options, options);
		window.removeEventListener("test", options, options);
	} catch {
		passiveBrowserEventsSupported = false;
	}
	var root = null, startText = null, fallbackText = null;
	function getData() {
		if (fallbackText) return fallbackText;
		var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
		for (start = 0; start < startLength && startValue[start] === endValue[start]; start++);
		var minEnd = startLength - start;
		for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++);
		return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
	}
	function getEventCharCode(nativeEvent) {
		var keyCode = nativeEvent.keyCode;
		"charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
		10 === nativeEvent && (nativeEvent = 13);
		return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
	}
	function functionThatReturnsTrue() {
		return true;
	}
	function functionThatReturnsFalse() {
		return false;
	}
	function createSyntheticEvent(Interface) {
		function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
			this._reactName = reactName;
			this._targetInst = targetInst;
			this.type = reactEventType;
			this.nativeEvent = nativeEvent;
			this.target = nativeEventTarget;
			this.currentTarget = null;
			for (var propName in Interface) Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
			this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
			this.isPropagationStopped = functionThatReturnsFalse;
			return this;
		}
		assign(SyntheticBaseEvent.prototype, {
			preventDefault: function() {
				this.defaultPrevented = true;
				var event = this.nativeEvent;
				event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
			},
			stopPropagation: function() {
				var event = this.nativeEvent;
				event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
			},
			persist: function() {},
			isPersistent: functionThatReturnsTrue
		});
		return SyntheticBaseEvent;
	}
	var EventInterface = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(event) {
			return event.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, {
		view: 0,
		detail: 0
	}), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: getEventModifierState,
		button: 0,
		buttons: 0,
		relatedTarget: function(event) {
			return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
		},
		movementX: function(event) {
			if ("movementX" in event) return event.movementX;
			event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
			return lastMovementX;
		},
		movementY: function(event) {
			return "movementY" in event ? event.movementY : lastMovementY;
		}
	}), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	}), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, { clipboardData: function(event) {
		return "clipboardData" in event ? event.clipboardData : window.clipboardData;
	} }), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, translateToKey = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, modifierKeyToProp = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function modifierStateGetter(keyArg) {
		var nativeEvent = this.nativeEvent;
		return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
	}
	function getEventModifierState() {
		return modifierStateGetter;
	}
	var KeyboardEventInterface = assign({}, UIEventInterface, {
		key: function(nativeEvent) {
			if (nativeEvent.key) {
				var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
				if ("Unidentified" !== key) return key;
			}
			return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: getEventModifierState,
		charCode: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : 0;
		},
		keyCode: function(event) {
			return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		},
		which: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		}
	}), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	}), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: getEventModifierState
	}), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	}), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
		deltaX: function(event) {
			return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
		},
		deltaY: function(event) {
			return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	}), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
		newState: 0,
		oldState: 0
	}), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [
		9,
		13,
		27,
		32
	], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
	canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
	var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
	function isFallbackCompositionEnd(domEventName, nativeEvent) {
		switch (domEventName) {
			case "keyup": return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
			case "keydown": return 229 !== nativeEvent.keyCode;
			case "keypress":
			case "mousedown":
			case "focusout": return true;
			default: return false;
		}
	}
	function getDataFromCustomEvent(nativeEvent) {
		nativeEvent = nativeEvent.detail;
		return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
	}
	var isComposing = false;
	function getNativeBeforeInputChars(domEventName, nativeEvent) {
		switch (domEventName) {
			case "compositionend": return getDataFromCustomEvent(nativeEvent);
			case "keypress":
				if (32 !== nativeEvent.which) return null;
				hasSpaceKeypress = true;
				return SPACEBAR_CHAR;
			case "textInput": return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
			default: return null;
		}
	}
	function getFallbackBeforeInputChars(domEventName, nativeEvent) {
		if (isComposing) return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = (startText = root = null, null), isComposing = false, domEventName) : null;
		switch (domEventName) {
			case "paste": return null;
			case "keypress":
				if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
					if (nativeEvent.char && 1 < nativeEvent.char.length) return nativeEvent.char;
					if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
				}
				return null;
			case "compositionend": return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
			default: return null;
		}
	}
	var supportedInputTypes = {
		color: true,
		date: true,
		datetime: true,
		"datetime-local": true,
		email: true,
		month: true,
		number: true,
		password: true,
		range: true,
		search: true,
		tel: true,
		text: true,
		time: true,
		url: true,
		week: true
	};
	function isTextInputElement(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
	}
	function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
		restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
		inst = accumulateTwoPhaseListeners(inst, "onChange");
		0 < inst.length && (nativeEvent = new SyntheticEvent("onChange", "change", null, nativeEvent, target), dispatchQueue.push({
			event: nativeEvent,
			listeners: inst
		}));
	}
	var activeElement$1 = null, activeElementInst$1 = null;
	function runEventInBatch(dispatchQueue) {
		processDispatchQueue(dispatchQueue, 0);
	}
	function getInstIfValueChanged(targetInst) {
		var targetNode = getNodeFromInstance(targetInst);
		if (updateValueIfChanged(targetNode)) return targetInst;
	}
	function getTargetInstForChangeEvent(domEventName, targetInst) {
		if ("change" === domEventName) return targetInst;
	}
	var isInputEventSupported = false;
	if (canUseDOM) {
		var JSCompiler_inline_result$jscomp$286;
		if (canUseDOM) {
			var isSupported$jscomp$inline_427 = "oninput" in document;
			if (!isSupported$jscomp$inline_427) {
				var element$jscomp$inline_428 = document.createElement("div");
				element$jscomp$inline_428.setAttribute("oninput", "return;");
				isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
			}
			JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
		} else JSCompiler_inline_result$jscomp$286 = false;
		isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
	}
	function stopWatchingForValueChange() {
		activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
	}
	function handlePropertyChange(nativeEvent) {
		if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
			var dispatchQueue = [];
			createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
			batchedUpdates$1(runEventInBatch, dispatchQueue);
		}
	}
	function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
		"focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
	}
	function getTargetInstForInputEventPolyfill(domEventName) {
		if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName) return getInstIfValueChanged(activeElementInst$1);
	}
	function getTargetInstForClickEvent(domEventName, targetInst) {
		if ("click" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
		if ("input" === domEventName || "change" === domEventName) return getInstIfValueChanged(targetInst);
	}
	var objectIs = Object.is;
	function shallowEqual(objA, objB) {
		if (objectIs(objA, objB)) return true;
		if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB) return false;
		var keysA = Object.keys(objA), keysB = Object.keys(objB);
		if (keysA.length !== keysB.length) return false;
		for (keysB = 0; keysB < keysA.length; keysB++) {
			var currentKey = keysA[keysB];
			if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey])) return false;
		}
		return true;
	}
	function getLeafNode(node) {
		for (; node && node.firstChild;) node = node.firstChild;
		return node;
	}
	function getNodeForCharacterOffset(root, offset) {
		var node = getLeafNode(root);
		root = 0;
		for (var nodeEnd; node;) {
			if (3 === node.nodeType) {
				nodeEnd = root + node.textContent.length;
				if (root <= offset && nodeEnd >= offset) return {
					node,
					offset: offset - root
				};
				root = nodeEnd;
			}
			a: {
				for (; node;) {
					if (node.nextSibling) {
						node = node.nextSibling;
						break a;
					}
					node = node.parentNode;
				}
				node = void 0;
			}
			node = getLeafNode(node);
		}
	}
	function containsNode(outerNode, innerNode) {
		return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
	}
	function getActiveElementDeep(containerInfo) {
		containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
		for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement;) {
			try {
				var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
			} catch {
				JSCompiler_inline_result = false;
			}
			if (JSCompiler_inline_result) containerInfo = element.contentWindow;
			else break;
			element = getActiveElement(containerInfo.document);
		}
		return element;
	}
	function hasSelectionCapabilities(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
	}
	var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
	function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
		var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
		mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = {
			start: doc.selectionStart,
			end: doc.selectionEnd
		} : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
			anchorNode: doc.anchorNode,
			anchorOffset: doc.anchorOffset,
			focusNode: doc.focusNode,
			focusOffset: doc.focusOffset
		}), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
			event: nativeEvent,
			listeners: doc
		}), nativeEvent.target = activeElement)));
	}
	function makePrefixMap(styleProp, eventName) {
		var prefixes = {};
		prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
		prefixes["Webkit" + styleProp] = "webkit" + eventName;
		prefixes["Moz" + styleProp] = "moz" + eventName;
		return prefixes;
	}
	var vendorPrefixes = {
		animationend: makePrefixMap("Animation", "AnimationEnd"),
		animationiteration: makePrefixMap("Animation", "AnimationIteration"),
		animationstart: makePrefixMap("Animation", "AnimationStart"),
		transitionrun: makePrefixMap("Transition", "TransitionRun"),
		transitionstart: makePrefixMap("Transition", "TransitionStart"),
		transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
		transitionend: makePrefixMap("Transition", "TransitionEnd")
	}, style = {};
	canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
	function getVendorPrefixedEventName(eventName) {
		var prefixMap = vendorPrefixes[eventName], styleProp;
		for (styleProp in prefixMap) if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) return prefixMap[styleProp];
		return eventName;
	}
	var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	simpleEventPluginEvents.push("scrollEnd");
	function registerSimpleEvent(domEventName, reactName) {
		topLevelEventsToReactNames.set(domEventName, reactName);
		registerTwoPhaseEvent(reactName, [domEventName]);
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: true,
				cancelable: true,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	}, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
	function finishQueueingConcurrentUpdates() {
		for (var endIndex = concurrentQueuesIndex, i = (concurrentlyUpdatedLanes = concurrentQueuesIndex = 0, 0); i < endIndex;) {
			var fiber = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var queue = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var update = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var lane = concurrentQueues[i];
			concurrentQueues[i++] = null;
			if (null !== queue && null !== update) {
				var pending = queue.pending;
				null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
				queue.pending = update;
			}
			0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
		}
	}
	function enqueueUpdate$1(fiber, queue, update, lane) {
		concurrentQueues[concurrentQueuesIndex++] = fiber;
		concurrentQueues[concurrentQueuesIndex++] = queue;
		concurrentQueues[concurrentQueuesIndex++] = update;
		concurrentQueues[concurrentQueuesIndex++] = lane;
		concurrentlyUpdatedLanes |= lane;
		fiber.lanes |= lane;
		fiber = fiber.alternate;
		null !== fiber && (fiber.lanes |= lane);
	}
	function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
		enqueueUpdate$1(fiber, queue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function enqueueConcurrentRenderForLane(fiber, lane) {
		enqueueUpdate$1(fiber, null, null, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
		sourceFiber.lanes |= lane;
		var alternate = sourceFiber.alternate;
		null !== alternate && (alternate.lanes |= lane);
		for (var isHidden = false, parent = sourceFiber.return; null !== parent;) parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
		return 3 === sourceFiber.tag && (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912));
	}
	function getRootForUpdatedFiber(sourceFiber) {
		if (50 < nestedUpdateCount) throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
		for (var parent = sourceFiber.return; null !== parent;) sourceFiber = parent, parent = sourceFiber.return;
		return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
	}
	var emptyContextObject = {};
	function FiberNode(tag, pendingProps, key, mode) {
		this.tag = tag;
		this.key = key;
		this.sibling = (this.child = (this.return = (this.stateNode = (this.type = this.elementType = null, null), null), null), null);
		this.index = 0;
		this.refCleanup = this.ref = null;
		this.pendingProps = pendingProps;
		this.dependencies = (this.memoizedState = (this.updateQueue = this.memoizedProps = null, null), null);
		this.mode = mode;
		this.subtreeFlags = this.flags = 0;
		this.deletions = null;
		this.childLanes = this.lanes = 0;
		this.alternate = null;
	}
	function createFiberImplClass(tag, pendingProps, key, mode) {
		return new FiberNode(tag, pendingProps, key, mode);
	}
	function shouldConstruct(Component) {
		Component = Component.prototype;
		return !(!Component || !Component.isReactComponent);
	}
	function createWorkInProgress(current, pendingProps) {
		var workInProgress = current.alternate;
		null === workInProgress ? (workInProgress = createFiberImplClass(current.tag, pendingProps, current.key, current.mode), workInProgress.elementType = current.elementType, workInProgress.type = current.type, workInProgress.stateNode = current.stateNode, workInProgress.alternate = current, current.alternate = workInProgress) : (workInProgress.pendingProps = pendingProps, workInProgress.type = current.type, workInProgress.flags = 0, workInProgress.subtreeFlags = 0, workInProgress.deletions = null);
		workInProgress.flags = current.flags & 65011712;
		workInProgress.childLanes = current.childLanes;
		workInProgress.lanes = current.lanes;
		workInProgress.child = current.child;
		workInProgress.memoizedProps = current.memoizedProps;
		workInProgress.memoizedState = current.memoizedState;
		workInProgress.updateQueue = current.updateQueue;
		pendingProps = current.dependencies;
		workInProgress.dependencies = null === pendingProps ? null : {
			lanes: pendingProps.lanes,
			firstContext: pendingProps.firstContext
		};
		workInProgress.sibling = current.sibling;
		workInProgress.index = current.index;
		workInProgress.ref = current.ref;
		workInProgress.refCleanup = current.refCleanup;
		return workInProgress;
	}
	function resetWorkInProgress(workInProgress, renderLanes) {
		workInProgress.flags &= 65011714;
		var current = workInProgress.alternate;
		null === current ? (workInProgress.childLanes = 0, workInProgress.lanes = renderLanes, workInProgress.child = null, workInProgress.subtreeFlags = 0, workInProgress.memoizedProps = null, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.dependencies = null, workInProgress.stateNode = null) : (workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.subtreeFlags = 0, workInProgress.deletions = null, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue, workInProgress.type = current.type, renderLanes = current.dependencies, workInProgress.dependencies = null === renderLanes ? null : {
			lanes: renderLanes.lanes,
			firstContext: renderLanes.firstContext
		});
		return workInProgress;
	}
	function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
		var fiberTag = 0;
		owner = type;
		if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
		else if ("string" === typeof type) fiberTag = isHostHoistableType(type, pendingProps, contextStackCursor.current) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
		else a: switch (type) {
			case REACT_ACTIVITY_TYPE: return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
			case REACT_FRAGMENT_TYPE: return createFiberFromFragment(pendingProps.children, mode, lanes, key);
			case REACT_STRICT_MODE_TYPE:
				fiberTag = 8;
				mode |= 24;
				break;
			case REACT_PROFILER_TYPE: return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_TYPE: return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_LIST_TYPE: return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
			default:
				if ("object" === typeof type && null !== type) switch (type.$$typeof) {
					case REACT_CONTEXT_TYPE:
						fiberTag = 10;
						break a;
					case REACT_CONSUMER_TYPE:
						fiberTag = 9;
						break a;
					case REACT_FORWARD_REF_TYPE:
						fiberTag = 11;
						break a;
					case REACT_MEMO_TYPE:
						fiberTag = 14;
						break a;
					case REACT_LAZY_TYPE:
						fiberTag = 16;
						owner = null;
						break a;
				}
				fiberTag = 29;
				pendingProps = Error(formatProdErrorMessage(130, null === type ? "null" : typeof type, ""));
				owner = null;
		}
		key = createFiberImplClass(fiberTag, pendingProps, key, mode);
		key.elementType = type;
		key.type = owner;
		key.lanes = lanes;
		return key;
	}
	function createFiberFromFragment(elements, mode, lanes, key) {
		elements = createFiberImplClass(7, elements, key, mode);
		elements.lanes = lanes;
		return elements;
	}
	function createFiberFromText(content, mode, lanes) {
		content = createFiberImplClass(6, content, null, mode);
		content.lanes = lanes;
		return content;
	}
	function createFiberFromDehydratedFragment(dehydratedNode) {
		var fiber = createFiberImplClass(18, null, null, 0);
		fiber.stateNode = dehydratedNode;
		return fiber;
	}
	function createFiberFromPortal(portal, mode, lanes) {
		mode = createFiberImplClass(4, null !== portal.children ? portal.children : [], portal.key, mode);
		mode.lanes = lanes;
		mode.stateNode = {
			containerInfo: portal.containerInfo,
			pendingChildren: null,
			implementation: portal.implementation
		};
		return mode;
	}
	var CapturedStacks = new WeakMap();
	function createCapturedValueAtFiber(value, source) {
		if ("object" === typeof value && null !== value) {
			var existing = CapturedStacks.get(value);
			if (void 0 !== existing) return existing;
			source = {
				value,
				source,
				stack: getStackByFiberInDevAndProd(source)
			};
			CapturedStacks.set(value, source);
			return source;
		}
		return {
			value,
			source,
			stack: getStackByFiberInDevAndProd(source)
		};
	}
	var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
	function pushTreeFork(workInProgress, totalChildren) {
		forkStack[forkStackIndex++] = treeForkCount;
		forkStack[forkStackIndex++] = treeForkProvider;
		treeForkProvider = workInProgress;
		treeForkCount = totalChildren;
	}
	function pushTreeId(workInProgress, totalChildren, index) {
		idStack[idStackIndex++] = treeContextId;
		idStack[idStackIndex++] = treeContextOverflow;
		idStack[idStackIndex++] = treeContextProvider;
		treeContextProvider = workInProgress;
		var baseIdWithLeadingBit = treeContextId;
		workInProgress = treeContextOverflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit;
			treeContextOverflow = length + workInProgress;
		} else treeContextId = 1 << length | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress;
	}
	function pushMaterializedTreeId(workInProgress) {
		null !== workInProgress.return && (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
	}
	function popTreeContext(workInProgress) {
		for (; workInProgress === treeForkProvider;) treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
		for (; workInProgress === treeContextProvider;) treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
	}
	function restoreSuspendedTreeContext(workInProgress, suspendedContext) {
		idStack[idStackIndex++] = treeContextId;
		idStack[idStackIndex++] = treeContextOverflow;
		idStack[idStackIndex++] = treeContextProvider;
		treeContextId = suspendedContext.id;
		treeContextOverflow = suspendedContext.overflow;
		treeContextProvider = workInProgress;
	}
	var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
	function throwOnHydrationMismatch(fiber) {
		var error = Error(formatProdErrorMessage(418, 1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML", ""));
		queueHydrationError(createCapturedValueAtFiber(error, fiber));
		throw HydrationMismatchException;
	}
	function prepareToHydrateHostInstance(fiber) {
		var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
		instance[internalInstanceKey] = fiber;
		instance[internalPropsKey] = props;
		switch (type) {
			case "dialog":
				listenToNonDelegatedEvent("cancel", instance);
				listenToNonDelegatedEvent("close", instance);
				break;
			case "iframe":
			case "object":
			case "embed":
				listenToNonDelegatedEvent("load", instance);
				break;
			case "video":
			case "audio":
				for (type = 0; type < mediaEventTypes.length; type++) listenToNonDelegatedEvent(mediaEventTypes[type], instance);
				break;
			case "source":
				listenToNonDelegatedEvent("error", instance);
				break;
			case "img":
			case "image":
			case "link":
				listenToNonDelegatedEvent("error", instance);
				listenToNonDelegatedEvent("load", instance);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", instance);
				break;
			case "input":
				listenToNonDelegatedEvent("invalid", instance);
				initInput(instance, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, true);
				break;
			case "select":
				listenToNonDelegatedEvent("invalid", instance);
				break;
			case "textarea": listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
		}
		type = props.children;
		"string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
		instance || throwOnHydrationMismatch(fiber, true);
	}
	function popToNextHostParent(fiber) {
		for (hydrationParentFiber = fiber.return; hydrationParentFiber;) switch (hydrationParentFiber.tag) {
			case 5:
			case 31:
			case 13:
				rootOrSingletonContext = false;
				return;
			case 27:
			case 3:
				rootOrSingletonContext = true;
				return;
			default: hydrationParentFiber = hydrationParentFiber.return;
		}
	}
	function popHydrationState(fiber) {
		if (fiber !== hydrationParentFiber) return false;
		if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
		var tag = fiber.tag, JSCompiler_temp;
		if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
			if (JSCompiler_temp = 5 === tag) JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
			JSCompiler_temp = !JSCompiler_temp;
		}
		JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
		popToNextHostParent(fiber);
		if (13 === tag) {
			fiber = fiber.memoizedState;
			fiber = null !== fiber ? fiber.dehydrated : null;
			if (!fiber) throw Error(formatProdErrorMessage(317));
			nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
		} else if (31 === tag) {
			fiber = fiber.memoizedState;
			fiber = null !== fiber ? fiber.dehydrated : null;
			if (!fiber) throw Error(formatProdErrorMessage(317));
			nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
		} else 27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
		return true;
	}
	function resetHydrationState() {
		nextHydratableInstance = hydrationParentFiber = null;
		isHydrating = false;
	}
	function upgradeHydrationErrorsToRecoverable() {
		var queuedErrors = hydrationErrors;
		null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null);
		return queuedErrors;
	}
	function queueHydrationError(error) {
		null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
	}
	var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
	function pushProvider(__unused_4187, context, nextValue) {
		push(valueCursor, context._currentValue);
		context._currentValue = nextValue;
	}
	function popProvider(context) {
		context._currentValue = valueCursor.current;
		pop(valueCursor);
	}
	function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
		for (; null !== parent;) {
			var alternate = parent.alternate;
			(parent.childLanes & renderLanes) !== renderLanes ? (parent.childLanes |= renderLanes, null !== alternate && (alternate.childLanes |= renderLanes)) : null !== alternate && (alternate.childLanes & renderLanes) !== renderLanes && (alternate.childLanes |= renderLanes);
			if (parent === propagationRoot) break;
			parent = parent.return;
		}
	}
	function propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree) {
		var fiber = workInProgress.child;
		null !== fiber && (fiber.return = workInProgress);
		for (; null !== fiber;) {
			var list = fiber.dependencies;
			if (null !== list) {
				var nextFiber = fiber.child;
				list = list.firstContext;
				a: for (; null !== list;) {
					var dependency = list;
					list = fiber;
					for (var i = 0; i < contexts.length; i++) if (dependency.context === contexts[i]) {
						list.lanes |= renderLanes;
						dependency = list.alternate;
						null !== dependency && (dependency.lanes |= renderLanes);
						scheduleContextWorkOnParentPath(list.return, renderLanes, workInProgress);
						forcePropagateEntireTree || (nextFiber = null);
						break a;
					}
					list = dependency.next;
				}
			} else if (18 === fiber.tag) {
				nextFiber = fiber.return;
				if (null === nextFiber) throw Error(formatProdErrorMessage(341));
				nextFiber.lanes |= renderLanes;
				list = nextFiber.alternate;
				null !== list && (list.lanes |= renderLanes);
				scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
				nextFiber = null;
			} else nextFiber = fiber.child;
			if (null !== nextFiber) nextFiber.return = fiber;
			else for (nextFiber = fiber; null !== nextFiber;) {
				if (nextFiber === workInProgress) {
					nextFiber = null;
					break;
				}
				fiber = nextFiber.sibling;
				if (null !== fiber) {
					fiber.return = nextFiber.return;
					nextFiber = fiber;
					break;
				}
				nextFiber = nextFiber.return;
			}
			fiber = nextFiber;
		}
	}
	function propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree) {
		current = null;
		for (var parent = workInProgress, isInsidePropagationBailout = false; null !== parent;) {
			if (!isInsidePropagationBailout) {
				if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
				else if (0 !== (parent.flags & 262144)) break;
			}
			if (10 === parent.tag) {
				var currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent = currentParent.memoizedProps;
				if (null !== currentParent) {
					var context = parent.type;
					objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
				}
			} else if (parent === hostTransitionProviderCursor.current) {
				currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
			}
			parent = parent.return;
		}
		null !== current && propagateContextChanges(workInProgress, current, renderLanes, forcePropagateEntireTree);
		workInProgress.flags |= 262144;
	}
	function checkIfContextChanged(currentDependencies) {
		for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies;) {
			if (!objectIs(currentDependencies.context._currentValue, currentDependencies.memoizedValue)) return true;
			currentDependencies = currentDependencies.next;
		}
		return false;
	}
	function prepareToReadContext(workInProgress) {
		currentlyRenderingFiber$1 = workInProgress;
		lastContextDependency = null;
		workInProgress = workInProgress.dependencies;
		null !== workInProgress && (workInProgress.firstContext = null);
	}
	function readContext(context) {
		return readContextForConsumer(currentlyRenderingFiber$1, context);
	}
	function readContextDuringReconciliation(consumer, context) {
		null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
		return readContextForConsumer(consumer, context);
	}
	function readContextForConsumer(consumer, context) {
		var value = context._currentValue;
		context = {
			context,
			memoizedValue: value,
			next: null
		};
		if (null === lastContextDependency) {
			if (null === consumer) throw Error(formatProdErrorMessage(308));
			lastContextDependency = context;
			consumer.dependencies = {
				lanes: 0,
				firstContext: context
			};
			consumer.flags |= 524288;
		} else lastContextDependency = lastContextDependency.next = context;
		return value;
	}
	var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
		var listeners = [], signal = this.signal = {
			aborted: false,
			addEventListener: function(__unused_7CE5, listener) {
				listeners.push(listener);
			}
		};
		this.abort = function() {
			signal.aborted = true;
			listeners.forEach(function(listener) {
				return listener();
			});
		};
	}, scheduleCallback$2 = Scheduler.n, CacheContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function createCache() {
		return {
			controller: new AbortControllerLocal(),
			data: new Map(),
			refCount: 0
		};
	}
	function releaseCache(cache) {
		cache.refCount--;
		0 === cache.refCount && scheduleCallback$2(3, function() {
			cache.controller.abort();
		});
	}
	var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
	function entangleAsyncAction(__unused_22B5, thenable) {
		if (null === currentEntangledListeners) {
			var entangledListeners = currentEntangledListeners = [];
			currentEntangledPendingCount = 0;
			currentEntangledLane = requestTransitionLane();
			currentEntangledActionThenable = {
				status: "pending",
				value: void 0,
				then: function(resolve) {
					entangledListeners.push(resolve);
				}
			};
		}
		currentEntangledPendingCount++;
		thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
		return;
	}
	function pingEngtangledActionScope() {
		if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
			null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
			var listeners = currentEntangledListeners;
			currentEntangledListeners = null;
			currentEntangledLane = 0;
			currentEntangledActionThenable = null;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
		}
	}
	function chainThenableValue(thenable, result) {
		var listeners = [], thenableWithOverride = {
			status: "pending",
			value: null,
			reason: null,
			then: function(resolve) {
				listeners.push(resolve);
			}
		};
		thenable.then(function() {
			thenableWithOverride.status = "fulfilled";
			thenableWithOverride.value = result;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
		}, function(error) {
			thenableWithOverride.status = "rejected";
			thenableWithOverride.reason = error;
			for (error = 0; error < listeners.length; error++) (0, listeners[error])(void 0);
		});
		return thenableWithOverride;
	}
	ReactSharedInternals.S = function(__unused_D195, returnValue) {
		globalMostRecentTransitionTime = now();
		"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(0, returnValue);
	};
	var resumedCache = createCursor(null);
	function peekCacheFromPool() {
		var cacheResumedFromPreviousRender = resumedCache.current;
		return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
	}
	function pushTransition(__unused_2CCA, prevCachePool) {
		null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
	}
	function getSuspendedCache() {
		var cacheFromPool = peekCacheFromPool();
		return null === cacheFromPool ? null : {
			parent: CacheContext._currentValue,
			pool: cacheFromPool
		};
	}
	var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {} };
	function isThenableResolved(thenable) {
		thenable = thenable.status;
		return "fulfilled" === thenable || "rejected" === thenable;
	}
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop$1, noop$1), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
			default:
				if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
				else {
					thenableState = workInProgressRoot;
					if (null !== thenableState && 100 < thenableState.shellSuspendCounter) throw Error(formatProdErrorMessage(482));
					thenableState = thenable;
					thenableState.status = "pending";
					thenableState.then(function(fulfilledValue) {
						if ("pending" === thenable.status) {
							var fulfilledThenable = thenable;
							fulfilledThenable.status = "fulfilled";
							fulfilledThenable.value = fulfilledValue;
						}
					}, function(error) {
						if ("pending" === thenable.status) {
							var rejectedThenable = thenable;
							rejectedThenable.status = "rejected";
							rejectedThenable.reason = error;
						}
					});
				}
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	function resolveLazy(lazyType) {
		try {
			var init = lazyType._init;
			return init(lazyType._payload);
		} catch (x) {
			if (null !== x && "object" === typeof x && "function" === typeof x.then) throw suspendedThenable = x, SuspenseException;
			throw x;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	function checkIfUseWrappedInAsyncCatch(rejectedReason) {
		if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException) throw Error(formatProdErrorMessage(483));
	}
	var thenableState$1 = null, thenableIndexCounter$1 = 0;
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter$1;
		thenableIndexCounter$1 += 1;
		null === thenableState$1 && (thenableState$1 = []);
		return trackUsedThenable(thenableState$1, thenable, index);
	}
	function coerceRef(workInProgress, element) {
		element = element.props.ref;
		workInProgress.ref = void 0 !== element ? element : null;
	}
	function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
		if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE) throw Error(formatProdErrorMessage(525));
		returnFiber = Object.prototype.toString.call(newChild);
		throw Error(formatProdErrorMessage(31, "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber));
	}
	function createChildReconciler(shouldTrackSideEffects) {
		function deleteChild(returnFiber, childToDelete) {
			if (shouldTrackSideEffects) {
				var deletions = returnFiber.deletions;
				null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
			}
		}
		function deleteRemainingChildren(returnFiber, currentFirstChild) {
			for (; null !== currentFirstChild;) deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return;
		}
		function mapRemainingChildren(currentFirstChild) {
			for (var existingChildren = new Map(); null !== currentFirstChild;) null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return existingChildren;
		}
		function useFiber(fiber, pendingProps) {
			fiber = createWorkInProgress(fiber, pendingProps);
			fiber.index = 0;
			fiber.sibling = null;
			return fiber;
		}
		function placeChild(newFiber, lastPlacedIndex, newIndex) {
			newFiber.index = newIndex;
			if (!shouldTrackSideEffects) return newFiber.flags |= 1048576;
			newIndex = newFiber.alternate;
			if (null !== newIndex) return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
			newFiber.flags |= 67108866;
			return lastPlacedIndex;
		}
		function placeSingleChild(newFiber) {
			shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
			return newFiber;
		}
		function updateTextNode(returnFiber, current, textContent, lanes) {
			if (null === current || 6 !== current.tag) return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, textContent);
			current.return = returnFiber;
			return current;
		}
		function updateElement(returnFiber, current, element, lanes) {
			var elementType = element.type;
			if (elementType === REACT_FRAGMENT_TYPE) return updateFragment(returnFiber, current, element.props.children, lanes, element.key);
			if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type)) return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
			current = createFiberFromTypeAndProps(element.type, element.key, element.props, 0, returnFiber.mode, lanes);
			coerceRef(current, element);
			current.return = returnFiber;
			return current;
		}
		function updatePortal(returnFiber, current, portal, lanes) {
			if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, portal.children || []);
			current.return = returnFiber;
			return current;
		}
		function updateFragment(returnFiber, current, fragment, lanes, key) {
			if (null === current || 7 !== current.tag) return current = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current.return = returnFiber, current;
			current = useFiber(current, fragment);
			current.return = returnFiber;
			return current;
		}
		function createChild(returnFiber, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, 0, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
					case REACT_PORTAL_TYPE: return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return newChild = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), newChild.return = returnFiber, newChild;
				if ("function" === typeof newChild.then) return createChild(returnFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(0, newChild);
			}
			return null;
		}
		function updateSlot(returnFiber, oldFiber, newChild, lanes) {
			var key = null !== oldFiber ? oldFiber.key : null;
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_PORTAL_TYPE: return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(0, newChild);
			}
			return null;
		}
		function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
					case REACT_PORTAL_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(0, newChild);
			}
			return null;
		}
		function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (newIdx === newChildren.length) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; newIdx < newChildren.length; newIdx++) oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++) nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(null === nextOldFiber.key ? newIdx : nextOldFiber.key), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child), void 0;
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
			if (null == newChildren) throw Error(formatProdErrorMessage(151));
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (step.done) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; !step.done; newIdx++, step = newChildren.next()) step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next()) step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child), void 0;
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
			"object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE:
						a: {
							for (var key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) {
									key = newChild.type;
									if (key === REACT_FRAGMENT_TYPE) {
										if (7 === currentFirstChild.tag) {
											deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
											lanes = useFiber(currentFirstChild, newChild.props.children);
											lanes.return = returnFiber;
											returnFiber = lanes;
											break a;
										}
									} else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
										deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
										lanes = useFiber(currentFirstChild, newChild.props);
										coerceRef(lanes, newChild);
										lanes.return = returnFiber;
										returnFiber = lanes;
										break a;
									}
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								} else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, 0, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
						}
						return placeSingleChild(returnFiber);
					case REACT_PORTAL_TYPE:
						a: {
							for (key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
									deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
									lanes = useFiber(currentFirstChild, newChild.children || []);
									lanes.return = returnFiber;
									returnFiber = lanes;
									break a;
								} else {
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								}
								else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
							lanes.return = returnFiber;
							returnFiber = lanes;
						}
						return placeSingleChild(returnFiber);
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				}
				if (isArrayImpl(newChild)) return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
				if (getIteratorFn(newChild)) {
					key = getIteratorFn(newChild);
					if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
					newChild = key.call(newChild);
					return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
				}
				if ("function" === typeof newChild.then) return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(0, newChild);
			}
			return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : (deleteRemainingChildren(returnFiber, currentFirstChild), null);
		}
		return function(returnFiber, currentFirstChild, newChild, lanes) {
			try {
				thenableIndexCounter$1 = 0;
				var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				thenableState$1 = null;
				return firstChildFiber;
			} catch (x) {
				if (x === SuspenseException || x === SuspenseActionException) throw x;
				var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
				fiber.lanes = lanes;
				fiber.return = returnFiber;
				return fiber;
			}
		};
	}
	var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
	function initializeUpdateQueue(fiber) {
		fiber.updateQueue = {
			baseState: fiber.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function cloneUpdateQueue(current, workInProgress) {
		current = current.updateQueue;
		workInProgress.updateQueue === current && (workInProgress.updateQueue = {
			baseState: current.baseState,
			firstBaseUpdate: current.firstBaseUpdate,
			lastBaseUpdate: current.lastBaseUpdate,
			shared: current.shared,
			callbacks: null
		});
	}
	function createUpdate(lane) {
		return {
			lane,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function enqueueUpdate(fiber, update, lane) {
		var updateQueue = fiber.updateQueue;
		if (null === updateQueue) return null;
		updateQueue = updateQueue.shared;
		if (0 !== (executionContext & 2)) {
			var pending = updateQueue.pending;
			null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
			updateQueue.pending = update;
			update = getRootForUpdatedFiber(fiber);
			markUpdateLaneFromFiberToRoot(fiber, null, lane);
			return update;
		}
		enqueueUpdate$1(fiber, updateQueue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function entangleTransitions(root, fiber, lane) {
		fiber = fiber.updateQueue;
		if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
			var queueLanes = fiber.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			fiber.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
		var queue = workInProgress.updateQueue, current = workInProgress.alternate;
		if (null !== current && (current = current.updateQueue, queue === current)) {
			var newFirst = null, newLast = null;
			queue = queue.firstBaseUpdate;
			if (null !== queue) {
				do {
					var clone = {
						lane: queue.lane,
						tag: queue.tag,
						payload: queue.payload,
						callback: null,
						next: null
					};
					null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
					queue = queue.next;
				} while (null !== queue);
				null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
			} else newFirst = newLast = capturedUpdate;
			queue = {
				baseState: current.baseState,
				firstBaseUpdate: newFirst,
				lastBaseUpdate: newLast,
				shared: current.shared,
				callbacks: current.callbacks
			};
			workInProgress.updateQueue = queue;
			return;
		}
		workInProgress = queue.lastBaseUpdate;
		null === workInProgress ? queue.firstBaseUpdate = capturedUpdate : workInProgress.next = capturedUpdate;
		queue.lastBaseUpdate = capturedUpdate;
	}
	var didReadFromEntangledAsyncAction = false;
	function suspendIfUpdateReadFromEntangledAsyncAction() {
		if (didReadFromEntangledAsyncAction) {
			var entangledActionThenable = currentEntangledActionThenable;
			if (null !== entangledActionThenable) throw entangledActionThenable;
		}
	}
	function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes) {
		didReadFromEntangledAsyncAction = false;
		var queue = workInProgress$jscomp$0.updateQueue;
		hasForceUpdate = false;
		var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
		if (null !== pendingQueue) {
			queue.shared.pending = null;
			var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
			lastPendingUpdate.next = null;
			null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
			lastBaseUpdate = lastPendingUpdate;
			var current = workInProgress$jscomp$0.alternate;
			null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
		}
		if (null !== firstBaseUpdate) {
			var newState = queue.baseState;
			lastBaseUpdate = 0;
			current = (firstPendingUpdate = lastPendingUpdate = null, null);
			pendingQueue = firstBaseUpdate;
			do {
				var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
				if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
					null !== current && (current = current.next = {
						lane: 0,
						tag: pendingQueue.tag,
						payload: pendingQueue.payload,
						callback: null,
						next: null
					});
					a: {
						var workInProgress = workInProgress$jscomp$0, update = pendingQueue;
						updateLane = props;
						var instance = instance$jscomp$0;
						switch (update.tag) {
							case 1:
								workInProgress = update.payload;
								if ("function" === typeof workInProgress) {
									newState = workInProgress.call(instance, newState, updateLane);
									break a;
								}
								newState = workInProgress;
								break a;
							case 3: workInProgress.flags = workInProgress.flags & -65537 | 128;
							case 0:
								workInProgress = update.payload;
								updateLane = "function" === typeof workInProgress ? workInProgress.call(instance, newState, updateLane) : workInProgress;
								if (null === updateLane || void 0 === updateLane) break a;
								newState = assign({}, newState, updateLane);
								break a;
							case 2: hasForceUpdate = true;
						}
					}
					updateLane = pendingQueue.callback;
					null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
				} else isHiddenUpdate = {
					lane: updateLane,
					tag: pendingQueue.tag,
					payload: pendingQueue.payload,
					callback: pendingQueue.callback,
					next: null
				}, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
				pendingQueue = pendingQueue.next;
				if (null === pendingQueue) if (pendingQueue = queue.shared.pending, null === pendingQueue) break;
				else isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
			} while (1);
			null === current && (lastPendingUpdate = newState);
			queue.baseState = lastPendingUpdate;
			queue.firstBaseUpdate = firstPendingUpdate;
			queue.lastBaseUpdate = current;
			null === firstBaseUpdate && (queue.shared.lanes = 0);
			workInProgressRootSkippedLanes |= lastBaseUpdate;
			workInProgress$jscomp$0.lanes = lastBaseUpdate;
			workInProgress$jscomp$0.memoizedState = newState;
		}
	}
	function callCallback(callback, context) {
		if ("function" !== typeof callback) throw Error(formatProdErrorMessage(191, callback));
		callback.call(context);
	}
	function commitCallbacks(updateQueue, context) {
		var callbacks = updateQueue.callbacks;
		if (null !== callbacks) for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++) callCallback(callbacks[updateQueue], context);
	}
	var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
	function pushHiddenContext(fiber, context) {
		fiber = entangledRenderLanes;
		push(prevEntangledRenderLanesCursor, fiber);
		push(currentTreeHiddenStackCursor, context);
		entangledRenderLanes = fiber | context.baseLanes;
	}
	function reuseHiddenContextOnStack() {
		push(prevEntangledRenderLanesCursor, entangledRenderLanes);
		push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
	}
	function popHiddenContext() {
		entangledRenderLanes = prevEntangledRenderLanesCursor.current;
		pop(currentTreeHiddenStackCursor);
		pop(prevEntangledRenderLanesCursor);
	}
	var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
	function pushPrimaryTreeSuspenseHandler(handler) {
		var current = handler.alternate;
		push(suspenseStackCursor, suspenseStackCursor.current & 1);
		push(suspenseHandlerStackCursor, handler);
		null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
	}
	function pushDehydratedActivitySuspenseHandler(fiber) {
		push(suspenseStackCursor, suspenseStackCursor.current);
		push(suspenseHandlerStackCursor, fiber);
		null === shellBoundary && (shellBoundary = fiber);
	}
	function pushOffscreenSuspenseHandler(fiber) {
		22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
	}
	function reuseSuspenseHandlerOnStack() {
		push(suspenseStackCursor, suspenseStackCursor.current);
		push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
	}
	function popSuspenseHandler(fiber) {
		shellBoundary === fiber && (shellBoundary = null);
	}
	var suspenseStackCursor = createCursor(0);
	function findFirstSuspended(row) {
		for (var node = row; null !== node;) {
			if (13 === node.tag) {
				var state = node.memoizedState;
				if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state))) return node;
			} else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
				if (0 !== (node.flags & 128)) return node;
			} else if (null !== node.child) {
				node.child.return = node;
				node = node.child;
				continue;
			}
			if (node === row) break;
			for (; null === node.sibling;) {
				if (null === node.return || node.return === row) return null;
				node = node.return;
			}
			node.sibling.return = node.return;
			node = node.sibling;
		}
		return null;
	}
	var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
	function throwInvalidHookError() {
		throw Error(formatProdErrorMessage(321));
	}
	function areHookInputsEqual(nextDeps, prevDeps) {
		if (null === prevDeps) return false;
		for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) if (!objectIs(nextDeps[i], prevDeps[i])) return false;
		return true;
	}
	function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
		renderLanes = nextRenderLanes;
		currentlyRenderingFiber = workInProgress;
		workInProgress.memoizedState = null;
		workInProgress.updateQueue = null;
		workInProgress.lanes = 0;
		ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
		shouldDoubleInvokeUserFnsInHooksDEV = false;
		nextRenderLanes = Component(props, secondArg);
		shouldDoubleInvokeUserFnsInHooksDEV = false;
		didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(workInProgress, Component, props, secondArg));
		finishRenderingHooks(current);
		return nextRenderLanes;
	}
	function finishRenderingHooks(current) {
		ReactSharedInternals.H = ContextOnlyDispatcher;
		var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
		renderLanes = 0;
		workInProgressHook = (currentHook = currentlyRenderingFiber = null, null);
		didScheduleRenderPhaseUpdate = false;
		thenableIndexCounter = 0;
		thenableState = null;
		if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
		null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
	}
	function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
		currentlyRenderingFiber = workInProgress;
		var numberOfReRenders = 0;
		do {
			didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
			thenableIndexCounter = 0;
			didScheduleRenderPhaseUpdateDuringThisPass = false;
			if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
			numberOfReRenders += 1;
			workInProgressHook = currentHook = null;
			if (null != workInProgress.updateQueue) {
				var children = workInProgress.updateQueue;
				children.lastEffect = null;
				children.events = null;
				children.stores = null;
				null != children.memoCache && (children.memoCache.index = 0);
			}
			ReactSharedInternals.H = HooksDispatcherOnRerender;
			children = Component(props, secondArg);
		} while (didScheduleRenderPhaseUpdateDuringThisPass);
		return children;
	}
	function TransitionAwareHostComponent() {
		var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
		maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
		dispatcher = dispatcher.useState()[0];
		(null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
		return maybeThenable;
	}
	function checkDidRenderIdHook() {
		var didRenderIdHook = 0 !== localIdCounter;
		localIdCounter = 0;
		return didRenderIdHook;
	}
	function bailoutHooks(current, workInProgress, lanes) {
		workInProgress.updateQueue = current.updateQueue;
		workInProgress.flags &= -2053;
		current.lanes &= ~lanes;
	}
	function resetHooksOnUnwind(workInProgress) {
		if (didScheduleRenderPhaseUpdate) {
			for (workInProgress = workInProgress.memoizedState; null !== workInProgress;) {
				var queue = workInProgress.queue;
				null !== queue && (queue.pending = null);
				workInProgress = workInProgress.next;
			}
			didScheduleRenderPhaseUpdate = false;
		}
		renderLanes = 0;
		workInProgressHook = (currentHook = currentlyRenderingFiber = null, null);
		didScheduleRenderPhaseUpdateDuringThisPass = false;
		thenableIndexCounter = localIdCounter = 0;
		thenableState = null;
	}
	function mountWorkInProgressHook() {
		var hook = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
		return workInProgressHook;
	}
	function updateWorkInProgressHook() {
		if (null === currentHook) {
			var nextCurrentHook = currentlyRenderingFiber.alternate;
			nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
		} else nextCurrentHook = currentHook.next;
		var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
		if (null !== nextWorkInProgressHook) workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
		else {
			if (null === nextCurrentHook) {
				if (null === currentlyRenderingFiber.alternate) throw Error(formatProdErrorMessage(467));
				throw Error(formatProdErrorMessage(310));
			}
			currentHook = nextCurrentHook;
			nextCurrentHook = {
				memoizedState: currentHook.memoizedState,
				baseState: currentHook.baseState,
				baseQueue: currentHook.baseQueue,
				queue: currentHook.queue,
				next: null
			};
			null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
		}
		return workInProgressHook;
	}
	function createFunctionComponentUpdateQueue() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function useThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		thenable = trackUsedThenable(thenableState, thenable, index);
		index = currentlyRenderingFiber;
		null === (null === workInProgressHook ? index.memoizedState : workInProgressHook.next) && (index = index.alternate, ReactSharedInternals.H = null === index || null === index.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
		return thenable;
	}
	function use(usable) {
		if (null !== usable && "object" === typeof usable) {
			if ("function" === typeof usable.then) return useThenable(usable);
			if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
		}
		throw Error(formatProdErrorMessage(438, String(usable)));
	}
	function useMemoCache(size) {
		var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
		null !== updateQueue && (memoCache = updateQueue.memoCache);
		if (null == memoCache) {
			var current = currentlyRenderingFiber.alternate;
			null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
				data: current.data.map(function(array) {
					return array.slice();
				}),
				index: 0
			})));
		}
		null == memoCache && (memoCache = {
			data: [],
			index: 0
		});
		null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
		updateQueue.memoCache = memoCache;
		updateQueue = memoCache.data[memoCache.index];
		if (void 0 === updateQueue) for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++) updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
		memoCache.index++;
		return updateQueue;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function updateReducer(reducer) {
		var hook = updateWorkInProgressHook();
		return updateReducerImpl(hook, currentHook, reducer);
	}
	function updateReducerImpl(hook, current, reducer) {
		var queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
		if (null !== pendingQueue) {
			if (null !== baseQueue) {
				var baseFirst = baseQueue.next;
				baseQueue.next = pendingQueue.next;
				pendingQueue.next = baseFirst;
			}
			current.baseQueue = baseQueue = pendingQueue;
			queue.pending = null;
		}
		pendingQueue = hook.baseState;
		if (null === baseQueue) hook.memoizedState = pendingQueue;
		else {
			current = baseQueue.next;
			var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
			do {
				var updateLane = update.lane & -536870913;
				if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					var revertLane = update.revertLane;
					if (0 === revertLane) null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
					else if ((renderLanes & revertLane) === revertLane) {
						update = update.next;
						revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
						continue;
					} else updateLane = {
						lane: 0,
						revertLane: update.revertLane,
						gesture: null,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
					updateLane = update.action;
					shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
					pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
				} else revertLane = {
					lane: updateLane,
					revertLane: update.revertLane,
					gesture: update.gesture,
					action: update.action,
					hasEagerState: update.hasEagerState,
					eagerState: update.eagerState,
					next: null
				}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
				update = update.next;
			} while (null !== update && update !== current);
			null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
			if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer))) throw reducer;
			hook.memoizedState = pendingQueue;
			hook.baseState = baseFirst;
			hook.baseQueue = newBaseQueueLast;
			queue.lastRenderedState = pendingQueue;
		}
		null === baseQueue && (queue.lanes = 0);
		return [hook.memoizedState, queue.dispatch];
	}
	function rerenderReducer(reducer) {
		var hook = updateWorkInProgressHook(), queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
		if (null !== lastRenderPhaseUpdate) {
			queue.pending = null;
			var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
			do
				newState = reducer(newState, update.action), update = update.next;
			while (update !== lastRenderPhaseUpdate);
			objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
			hook.memoizedState = newState;
			null === hook.baseQueue && (hook.baseState = newState);
			queue.lastRenderedState = newState;
		}
		return [newState, dispatch];
	}
	function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
		var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
		if (isHydrating$jscomp$0) {
			if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
			getServerSnapshot = getServerSnapshot();
		} else getServerSnapshot = getSnapshot();
		var snapshotChanged = !objectIs((currentHook || hook).memoizedState, getServerSnapshot);
		snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
		hook = hook.queue;
		updateEffect(subscribeToStore.bind(0, fiber, hook, subscribe), [subscribe]);
		if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
			fiber.flags |= 2048;
			pushSimpleEffect(9, { destroy: void 0 }, updateStoreInstance.bind(0, fiber, hook, getServerSnapshot, getSnapshot), null);
			if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
			isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
		}
		return getServerSnapshot;
	}
	function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
		fiber.flags |= 16384;
		fiber = {
			getSnapshot,
			value: renderedSnapshot
		};
		getSnapshot = currentlyRenderingFiber.updateQueue;
		null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
	}
	function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
		inst.value = nextSnapshot;
		inst.getSnapshot = getSnapshot;
		checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	}
	function subscribeToStore(fiber, inst, subscribe) {
		return subscribe(function() {
			checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
		});
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch {
			return true;
		}
	}
	function forceStoreRerender(fiber) {
		var root = enqueueConcurrentRenderForLane(fiber, 2);
		null !== root && scheduleUpdateOnFiber(root, 0, 2);
	}
	function mountStateImpl(initialState) {
		var hook = mountWorkInProgressHook();
		if ("function" === typeof initialState) {
			var initialStateInitializer = initialState;
			initialState = initialStateInitializer();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(true);
				try {
					initialStateInitializer();
				} finally {
					setIsStrictModeForDevtools(false);
				}
			}
		}
		hook.memoizedState = hook.baseState = initialState;
		hook.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: basicStateReducer,
			lastRenderedState: initialState
		};
		return hook;
	}
	function updateOptimisticImpl(hook, __unused_E2A4, passthrough, reducer) {
		hook.baseState = passthrough;
		return updateReducerImpl(hook, currentHook, "function" === typeof reducer ? reducer : basicStateReducer);
	}
	function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
		if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
		fiber = actionQueue.action;
		if (null !== fiber) {
			var actionNode = {
				payload,
				action: fiber,
				next: null,
				isTransition: true,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(listener) {
					actionNode.listeners.push(listener);
				}
			};
			null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
			setState(actionNode);
			setPendingState = actionQueue.pending;
			null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
		}
	}
	function runActionStateAction(actionQueue, node) {
		var action = node.action, payload = node.payload, prevState = actionQueue.state;
		if (node.isTransition) {
			var prevTransition = ReactSharedInternals.T, currentTransition = {};
			ReactSharedInternals.T = currentTransition;
			try {
				var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
				null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
				handleActionReturnValue(actionQueue, node, returnValue);
			} catch (error) {
				onActionError(actionQueue, node, error);
			} finally {
				null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
			}
		} else try {
			prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
		} catch (error$66) {
			onActionError(actionQueue, node, error$66);
		}
	}
	function handleActionReturnValue(actionQueue, node, returnValue) {
		null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(function(nextState) {
			onActionSuccess(actionQueue, node, nextState);
		}, function(error) {
			return onActionError(actionQueue, node, error), void 0;
		}) : onActionSuccess(actionQueue, node, returnValue);
	}
	function onActionSuccess(actionQueue, actionNode, nextState) {
		actionNode.status = "fulfilled";
		actionNode.value = nextState;
		notifyActionListeners(actionNode);
		actionQueue.state = nextState;
		actionNode = actionQueue.pending;
		null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
	}
	function onActionError(actionQueue, actionNode, error) {
		var last = actionQueue.pending;
		actionQueue.pending = null;
		if (null !== last) {
			last = last.next;
			do
				actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
			while (actionNode !== last);
		}
		actionQueue.action = null;
	}
	function notifyActionListeners(actionNode) {
		actionNode = actionNode.listeners;
		for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
	}
	function actionStateReducer(__unused_B2F9, newState) {
		return newState;
	}
	function mountActionState(action, initialStateProp) {
		if (isHydrating) {
			var ssrFormState = workInProgressRoot.formState;
			if (null !== ssrFormState) {
				a: {
					var JSCompiler_inline_result = currentlyRenderingFiber;
					if (isHydrating) {
						if (nextHydratableInstance) {
							b: {
								var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
								for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType;) {
									if (!inRootOrSingleton) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
									JSCompiler_inline_result$jscomp$0 = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
									if (null === JSCompiler_inline_result$jscomp$0) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
								}
								inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
								JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
							}
							if (JSCompiler_inline_result$jscomp$0) {
								nextHydratableInstance = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
								JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
								break a;
							}
						}
						throwOnHydrationMismatch(JSCompiler_inline_result);
					}
					JSCompiler_inline_result = false;
				}
				JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
			}
		}
		ssrFormState = mountWorkInProgressHook();
		ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
		JSCompiler_inline_result = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: actionStateReducer,
			lastRenderedState: initialStateProp
		};
		ssrFormState.queue = JSCompiler_inline_result;
		ssrFormState = dispatchSetState.bind(0, currentlyRenderingFiber, JSCompiler_inline_result);
		JSCompiler_inline_result.dispatch = ssrFormState;
		JSCompiler_inline_result = mountStateImpl(false);
		inRootOrSingleton = dispatchOptimisticSetState.bind(0, currentlyRenderingFiber, false, JSCompiler_inline_result.queue);
		JSCompiler_inline_result = mountWorkInProgressHook();
		JSCompiler_inline_result$jscomp$0 = {
			state: initialStateProp,
			dispatch: null,
			action,
			pending: null
		};
		JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
		ssrFormState = dispatchActionState.bind(0, currentlyRenderingFiber, JSCompiler_inline_result$jscomp$0, inRootOrSingleton, ssrFormState);
		JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
		JSCompiler_inline_result.memoizedState = action;
		return [
			initialStateProp,
			ssrFormState,
			false
		];
	}
	function updateActionState(action) {
		var stateHook = updateWorkInProgressHook();
		return updateActionStateImpl(stateHook, currentHook, action);
	}
	function updateActionStateImpl(stateHook, currentStateHook, action) {
		currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0];
		stateHook = updateReducer(basicStateReducer)[0];
		if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then) try {
			var state = useThenable(currentStateHook);
		} catch (x) {
			if (x === SuspenseException) throw SuspenseActionException;
			throw x;
		}
		else state = currentStateHook;
		currentStateHook = updateWorkInProgressHook();
		var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
		action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(9, { destroy: void 0 }, actionStateActionEffect.bind(0, actionQueue, action), null));
		return [
			state,
			dispatch,
			stateHook
		];
	}
	function actionStateActionEffect(actionQueue, action) {
		actionQueue.action = action;
	}
	function rerenderActionState(action) {
		var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
		if (null !== currentStateHook) return updateActionStateImpl(stateHook, currentStateHook, action);
		updateWorkInProgressHook();
		stateHook = stateHook.memoizedState;
		currentStateHook = updateWorkInProgressHook();
		var dispatch = currentStateHook.queue.dispatch;
		currentStateHook.memoizedState = action;
		return [
			stateHook,
			dispatch,
			false
		];
	}
	function pushSimpleEffect(tag, inst, create, deps) {
		tag = {
			tag,
			create,
			deps,
			inst,
			next: null
		};
		inst = currentlyRenderingFiber.updateQueue;
		null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
		create = inst.lastEffect;
		null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
		return tag;
	}
	function updateRef() {
		return updateWorkInProgressHook().memoizedState;
	}
	function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
		var hook = mountWorkInProgressHook();
		currentlyRenderingFiber.flags |= fiberFlags;
		hook.memoizedState = pushSimpleEffect(1 | hookFlags, { destroy: void 0 }, create, void 0 === deps ? null : deps);
	}
	function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var inst = hook.memoizedState.inst;
		null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(1 | hookFlags, inst, create, deps));
	}
	function mountEffect(create, deps) {
		mountEffectImpl(8390656, 8, create, deps);
	}
	function updateEffect(create, deps) {
		updateEffectImpl(2048, 8, create, deps);
	}
	function useEffectEventImpl(payload) {
		currentlyRenderingFiber.flags |= 4;
		var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
		if (null === componentUpdateQueue) componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
		else {
			var events = componentUpdateQueue.events;
			null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
		}
	}
	function updateEvent(callback) {
		var ref = updateWorkInProgressHook().memoizedState;
		useEffectEventImpl({
			ref,
			nextImpl: callback
		});
		return function() {
			if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
			return ref.impl.apply(void 0, arguments);
		};
	}
	function updateInsertionEffect(create, deps) {
		return updateEffectImpl(4, 2, create, deps), void 0;
	}
	function updateLayoutEffect(create, deps) {
		return updateEffectImpl(4, 4, create, deps), void 0;
	}
	function imperativeHandleEffect(create, ref) {
		if ("function" === typeof ref) {
			create = create();
			var refCleanup = ref(create);
			return function() {
				"function" === typeof refCleanup ? refCleanup() : ref(null);
			};
		}
		if (null !== ref && void 0 !== ref) return create = create(), ref.current = create, function() {
			ref.current = null;
		};
	}
	function updateImperativeHandle(ref, create, deps) {
		deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
		updateEffectImpl(4, 4, imperativeHandleEffect.bind(0, create, ref), deps);
	}
	function mountDebugValue() {}
	function updateCallback(callback, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		hook.memoizedState = [callback, deps];
		return callback;
	}
	function updateMemo(nextCreate, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		prevState = nextCreate();
		if (shouldDoubleInvokeUserFnsInHooksDEV) {
			setIsStrictModeForDevtools(true);
			try {
				nextCreate();
			} finally {
				setIsStrictModeForDevtools(false);
			}
		}
		hook.memoizedState = [prevState, deps];
		return prevState;
	}
	function mountDeferredValueImpl(hook, value, initialValue) {
		if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return hook.memoizedState = value;
		hook.memoizedState = initialValue;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return initialValue;
	}
	function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
		if (objectIs(value, prevValue)) return value;
		if (null !== currentTreeHiddenStackCursor.current) return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
		if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return didReceiveUpdate = true, hook.memoizedState = value;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return prevValue;
	}
	function startTransition(fiber, queue, pendingState, finishedState, callback) {
		var previousPriority = ReactDOMSharedInternals.a;
		ReactDOMSharedInternals.a = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		dispatchOptimisticSetState(fiber, false, queue, pendingState);
		try {
			var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
				var thenableForFinishedState = chainThenableValue(returnValue, finishedState);
				dispatchSetStateInternal(fiber, queue, thenableForFinishedState, requestUpdateLane());
			} else dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane());
		} catch (error) {
			dispatchSetStateInternal(fiber, queue, {
				then: function() {},
				status: "rejected",
				reason: error
			}, requestUpdateLane());
		} finally {
			ReactDOMSharedInternals.a = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	}
	function noop() {}
	function startHostTransition(formFiber, pendingState, action, formData) {
		if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
		var queue = ensureFormComponentIsStateful(formFiber).queue;
		startTransition(formFiber, queue, pendingState, sharedNotPendingObject, null === action ? noop : function() {
			requestFormReset$1(formFiber);
			return action(formData);
		});
	}
	function ensureFormComponentIsStateful(formFiber) {
		var existingStateHook = formFiber.memoizedState;
		if (null !== existingStateHook) return existingStateHook;
		existingStateHook = {
			memoizedState: sharedNotPendingObject,
			baseState: sharedNotPendingObject,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: sharedNotPendingObject
			}
		};
		var initialResetState = {};
		existingStateHook.next = {
			memoizedState: initialResetState,
			baseState: initialResetState,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: initialResetState
			},
			next: null
		};
		formFiber.memoizedState = existingStateHook;
		formFiber = formFiber.alternate;
		null !== formFiber && (formFiber.memoizedState = existingStateHook);
		return existingStateHook;
	}
	function requestFormReset$1(formFiber) {
		var stateHook = ensureFormComponentIsStateful(formFiber);
		null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
		dispatchSetStateInternal(formFiber, stateHook.next.queue, {}, requestUpdateLane());
	}
	function useHostTransitionStatus() {
		return readContext(HostTransitionContext);
	}
	function updateId() {
		return updateWorkInProgressHook().memoizedState;
	}
	function updateRefresh() {
		return updateWorkInProgressHook().memoizedState;
	}
	function refreshCache(fiber) {
		for (var provider = fiber.return; null !== provider;) {
			switch (provider.tag) {
				case 24:
				case 3:
					var lane = requestUpdateLane();
					fiber = createUpdate(lane);
					var root$69 = enqueueUpdate(provider, fiber, lane);
					null !== root$69 && (scheduleUpdateOnFiber(root$69, 0, lane), entangleTransitions(root$69, provider, lane));
					provider = { cache: createCache() };
					fiber.payload = provider;
					return;
			}
			provider = provider.return;
		}
	}
	function dispatchReducerAction(fiber, queue, action) {
		var lane = requestUpdateLane();
		action = {
			lane,
			revertLane: 0,
			gesture: null,
			action,
			hasEagerState: false,
			eagerState: null,
			next: null
		};
		isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, 0, lane), entangleTransitionUpdate(action, queue, lane)));
	}
	function dispatchSetState(fiber, queue, action) {
		var lane = requestUpdateLane();
		dispatchSetStateInternal(fiber, queue, action, lane);
	}
	function dispatchSetStateInternal(fiber, queue, action, lane) {
		var update = {
			lane,
			revertLane: 0,
			gesture: null,
			action,
			hasEagerState: false,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
		else {
			var alternate = fiber.alternate;
			if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate)) try {
				var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
				update.hasEagerState = true;
				update.eagerState = eagerState;
				if (objectIs(eagerState, currentState)) return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates();
			} catch {}
			action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
			if (null !== action) return scheduleUpdateOnFiber(action, 0, lane), entangleTransitionUpdate(action, queue, lane);
		}
		return;
	}
	function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
		action = {
			lane: 2,
			revertLane: requestTransitionLane(),
			gesture: null,
			action,
			hasEagerState: false,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) {
			if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
		} else throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, 0, 2);
	}
	function isRenderPhaseUpdate(fiber) {
		var alternate = fiber.alternate;
		return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
	}
	function enqueueRenderPhaseUpdate(queue, update) {
		didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
		var pending = queue.pending;
		null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
		queue.pending = update;
	}
	function entangleTransitionUpdate(root, queue, lane) {
		if (0 !== (lane & 4194048)) {
			var queueLanes = queue.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			queue.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	var ContextOnlyDispatcher = {
		readContext,
		use,
		useCallback: throwInvalidHookError,
		useContext: throwInvalidHookError,
		useEffect: throwInvalidHookError,
		useImperativeHandle: throwInvalidHookError,
		useLayoutEffect: throwInvalidHookError,
		useInsertionEffect: throwInvalidHookError,
		useMemo: throwInvalidHookError,
		useReducer: throwInvalidHookError,
		useRef: throwInvalidHookError,
		useState: throwInvalidHookError,
		useDebugValue: throwInvalidHookError,
		useDeferredValue: throwInvalidHookError,
		useTransition: throwInvalidHookError,
		useSyncExternalStore: throwInvalidHookError,
		useId: throwInvalidHookError,
		useHostTransitionStatus: throwInvalidHookError,
		useFormState: throwInvalidHookError,
		useActionState: throwInvalidHookError,
		useOptimistic: throwInvalidHookError,
		useMemoCache: throwInvalidHookError,
		useCacheRefresh: throwInvalidHookError
	};
	ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
	var HooksDispatcherOnMount = {
		readContext,
		use,
		useCallback: function(callback, deps) {
			mountWorkInProgressHook().memoizedState = [callback, void 0 === deps ? null : deps];
			return callback;
		},
		useContext: readContext,
		useEffect: mountEffect,
		useImperativeHandle: function(ref, create, deps) {
			deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
			mountEffectImpl(4194308, 4, imperativeHandleEffect.bind(0, create, ref), deps);
		},
		useLayoutEffect: function(create, deps) {
			return mountEffectImpl(4194308, 4, create, deps), void 0;
		},
		useInsertionEffect: function(create, deps) {
			mountEffectImpl(4, 2, create, deps);
		},
		useMemo: function(nextCreate, deps) {
			var hook = mountWorkInProgressHook();
			deps = void 0 === deps ? null : deps;
			var nextValue = nextCreate();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(true);
				try {
					nextCreate();
				} finally {
					setIsStrictModeForDevtools(false);
				}
			}
			hook.memoizedState = [nextValue, deps];
			return nextValue;
		},
		useReducer: function(reducer, initialArg, init) {
			var hook = mountWorkInProgressHook();
			if (void 0 !== init) {
				var initialState = init(initialArg);
				if (shouldDoubleInvokeUserFnsInHooksDEV) {
					setIsStrictModeForDevtools(true);
					try {
						init(initialArg);
					} finally {
						setIsStrictModeForDevtools(false);
					}
				}
			} else initialState = initialArg;
			hook.memoizedState = hook.baseState = initialState;
			reducer = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: reducer,
				lastRenderedState: initialState
			};
			hook.queue = reducer;
			reducer = reducer.dispatch = dispatchReducerAction.bind(0, currentlyRenderingFiber, reducer);
			return [hook.memoizedState, reducer];
		},
		useRef: function(initialValue) {
			var hook = mountWorkInProgressHook();
			initialValue = { current: initialValue };
			return hook.memoizedState = initialValue;
		},
		useState: function(initialState) {
			initialState = mountStateImpl(initialState);
			var queue = initialState.queue, dispatch = dispatchSetState.bind(0, currentlyRenderingFiber, queue);
			queue.dispatch = dispatch;
			return [initialState.memoizedState, dispatch];
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			var hook = mountWorkInProgressHook();
			return mountDeferredValueImpl(hook, value, initialValue);
		},
		useTransition: function() {
			var stateHook = mountStateImpl(false);
			stateHook = startTransition.bind(0, currentlyRenderingFiber, stateHook.queue, true, false);
			mountWorkInProgressHook().memoizedState = stateHook;
			return [false, stateHook];
		},
		useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
			var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
			if (isHydrating) {
				if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
				getServerSnapshot = getServerSnapshot();
			} else {
				getServerSnapshot = getSnapshot();
				if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
				0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
			}
			hook.memoizedState = getServerSnapshot;
			var inst = {
				value: getServerSnapshot,
				getSnapshot
			};
			hook.queue = inst;
			mountEffect(subscribeToStore.bind(0, fiber, inst, subscribe), [subscribe]);
			fiber.flags |= 2048;
			pushSimpleEffect(9, { destroy: void 0 }, updateStoreInstance.bind(0, fiber, inst, getServerSnapshot, getSnapshot), null);
			return getServerSnapshot;
		},
		useId: function() {
			var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
			if (isHydrating) {
				var JSCompiler_inline_result = treeContextOverflow;
				var idWithLeadingBit = treeContextId;
				JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
				identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
				JSCompiler_inline_result = localIdCounter++;
				0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
				identifierPrefix += "_";
			} else JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
			return hook.memoizedState = identifierPrefix;
		},
		useHostTransitionStatus,
		useFormState: mountActionState,
		useActionState: mountActionState,
		useOptimistic: function(passthrough) {
			var hook = mountWorkInProgressHook();
			hook.memoizedState = hook.baseState = passthrough;
			var queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			hook.queue = queue;
			hook = dispatchOptimisticSetState.bind(0, currentlyRenderingFiber, true, queue);
			queue.dispatch = hook;
			return [passthrough, hook];
		},
		useMemoCache,
		useCacheRefresh: function() {
			return mountWorkInProgressHook().memoizedState = refreshCache.bind(0, currentlyRenderingFiber);
		},
		useEffectEvent: function(callback) {
			var hook = mountWorkInProgressHook(), ref = { impl: callback };
			hook.memoizedState = ref;
			return function() {
				if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
				return ref.impl.apply(void 0, arguments);
			};
		}
	}, HooksDispatcherOnUpdate = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: updateReducer,
		useRef: updateRef,
		useState: function() {
			return updateReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			var hook = updateWorkInProgressHook();
			return updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: updateActionState,
		useActionState: updateActionState,
		useOptimistic: function(passthrough, reducer) {
			var hook = updateWorkInProgressHook();
			return updateOptimisticImpl(hook, 0, passthrough, reducer);
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
	var HooksDispatcherOnRerender = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: rerenderReducer,
		useRef: updateRef,
		useState: function() {
			return rerenderReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			var hook = updateWorkInProgressHook();
			return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: rerenderActionState,
		useActionState: rerenderActionState,
		useOptimistic: function(passthrough, reducer) {
			var hook = updateWorkInProgressHook();
			if (null !== currentHook) return updateOptimisticImpl(hook, 0, passthrough, reducer);
			hook.baseState = passthrough;
			return [passthrough, hook.queue.dispatch];
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	HooksDispatcherOnRerender.useEffectEvent = updateEvent;
	function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
		ctor = workInProgress.memoizedState;
		getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
		getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
		workInProgress.memoizedState = getDerivedStateFromProps;
		0 === workInProgress.lanes && (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, 0, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueReplaceState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 1;
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, 0, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueForceUpdate: function(inst, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 2;
			void 0 !== callback && null !== callback && (update.callback = callback);
			callback = enqueueUpdate(inst, update, lane);
			null !== callback && (scheduleUpdateOnFiber(callback, 0, lane), entangleTransitions(callback, inst, lane));
		}
	};
	function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
		workInProgress = workInProgress.stateNode;
		return "function" === typeof workInProgress.shouldComponentUpdate ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
	}
	function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
		workInProgress = instance.state;
		"function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
		"function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
		instance.state !== workInProgress && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
	}
	function resolveClassComponentProps(Component, baseProps) {
		var newProps = baseProps;
		if ("ref" in baseProps) {
			newProps = {};
			for (var propName in baseProps) "ref" !== propName && (newProps[propName] = baseProps[propName]);
		}
		if (Component = Component.defaultProps) {
			newProps === baseProps && (newProps = assign({}, newProps));
			for (var propName$73 in Component) void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
		}
		return newProps;
	}
	function defaultOnUncaughtError(error) {
		reportGlobalError(error);
	}
	function defaultOnCaughtError(error) {
		console.error(error);
	}
	function defaultOnRecoverableError(error) {
		reportGlobalError(error);
	}
	function logUncaughtError(root, errorInfo) {
		try {
			var onUncaughtError = root.onUncaughtError;
			onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
		} catch (e$74) {
			setTimeout(function() {
				throw e$74;
			});
		}
	}
	function logCaughtError(root, boundary, errorInfo) {
		try {
			var onCaughtError = root.onCaughtError;
			onCaughtError(errorInfo.value, {
				componentStack: errorInfo.stack,
				errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
			});
		} catch (e$75) {
			setTimeout(function() {
				throw e$75;
			});
		}
	}
	function createRootErrorUpdate(root, errorInfo, lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		lane.payload = { element: null };
		lane.callback = function() {
			logUncaughtError(root, errorInfo);
		};
		return lane;
	}
	function createClassErrorUpdate(lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		return lane;
	}
	function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
		var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
		if ("function" === typeof getDerivedStateFromError) {
			var error = errorInfo.value;
			update.payload = function() {
				return getDerivedStateFromError(error);
			};
			update.callback = function() {
				logCaughtError(root, fiber, errorInfo);
			};
		}
		var inst = fiber.stateNode;
		null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
			logCaughtError(root, fiber, errorInfo);
			"function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
			var stack = errorInfo.stack;
			this.componentDidCatch(errorInfo.value, { componentStack: null !== stack ? stack : "" });
		});
	}
	function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
		sourceFiber.flags |= 32768;
		if (null !== value && "object" === typeof value && "function" === typeof value.then) {
			returnFiber = sourceFiber.alternate;
			null !== returnFiber && propagateParentContextChanges(0, sourceFiber, rootRenderLanes, true);
			sourceFiber = suspenseHandlerStackCursor.current;
			if (null !== sourceFiber) {
				switch (sourceFiber.tag) {
					case 31:
					case 13: return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = new Set([value]) : returnFiber.add(value), attachPingListener(root, value, rootRenderLanes)), false;
					case 22: return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([value])
					}, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = new Set([value]) : sourceFiber.add(value)), attachPingListener(root, value, rootRenderLanes)), false;
				}
				throw Error(formatProdErrorMessage(435, sourceFiber.tag));
			}
			attachPingListener(root, value, rootRenderLanes);
			renderDidSuspendDelayIfPossible();
			return false;
		}
		if (isHydrating) return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), { cause: value }), queueHydrationError(createCapturedValueAtFiber(returnFiber, sourceFiber))), root = root.current.alternate, root.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
		var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
		wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
		null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
		4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
		if (null === returnFiber) return true;
		value = createCapturedValueAtFiber(value, sourceFiber);
		sourceFiber = returnFiber;
		do {
			switch (sourceFiber.tag) {
				case 3: return sourceFiber.flags |= 65536, root = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root, root = createRootErrorUpdate(sourceFiber.stateNode, value, root), enqueueCapturedUpdate(sourceFiber, root), false;
				case 1: if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError)))) return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
			}
			sourceFiber = sourceFiber.return;
		} while (null !== sourceFiber);
		return false;
	}
	var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
	function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
		workInProgress.child = null === current ? mountChildFibers(workInProgress, null, nextChildren, renderLanes) : reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
	}
	function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
		Component = Component.render;
		var ref = workInProgress.ref;
		if ("ref" in nextProps) {
			var propsWithoutRef = {};
			for (var key in nextProps) "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
		} else propsWithoutRef = nextProps;
		prepareToReadContext(workInProgress);
		nextProps = renderWithHooks(current, workInProgress, Component, propsWithoutRef, ref, renderLanes);
		key = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && key && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null === current) {
			var type = Component.type;
			if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare) return workInProgress.tag = 15, workInProgress.type = type, updateSimpleMemoComponent(current, workInProgress, type, nextProps, renderLanes);
			current = createFiberFromTypeAndProps(Component.type, null, nextProps, 0, workInProgress.mode, renderLanes);
			current.ref = workInProgress.ref;
			current.return = workInProgress;
			return workInProgress.child = current;
		}
		type = current.child;
		if (!checkScheduledUpdateOrContext(current, renderLanes)) {
			var prevProps = type.memoizedProps;
			Component = Component.compare;
			Component = null !== Component ? Component : shallowEqual;
			if (Component(prevProps, nextProps) && current.ref === workInProgress.ref) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		workInProgress.flags |= 1;
		current = createWorkInProgress(type, nextProps);
		current.ref = workInProgress.ref;
		current.return = workInProgress;
		return workInProgress.child = current;
	}
	function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null !== current) {
			var prevProps = current.memoizedProps;
			if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref) if (didReceiveUpdate = false, workInProgress.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes)) 0 !== (current.flags & 131072) && (didReceiveUpdate = true);
			else return workInProgress.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
	}
	function updateOffscreenComponent(current, workInProgress, renderLanes, nextProps) {
		var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
		null === current && null === workInProgress.stateNode && (workInProgress.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		});
		if ("hidden" === nextProps.mode) {
			if (0 !== (workInProgress.flags & 128)) {
				prevState = null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
				if (null !== current) {
					nextProps = workInProgress.child = current.child;
					for (nextChildren = 0; null !== nextProps;) nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
					nextProps = nextChildren & ~prevState;
				} else nextProps = 0, workInProgress.child = null;
				return deferHiddenOffscreenComponent(current, workInProgress, prevState, renderLanes, nextProps), null;
			}
			if (0 !== (renderLanes & 536870912)) workInProgress.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, null !== current && pushTransition(0, null !== prevState ? prevState.cachePool : null), null !== prevState ? pushHiddenContext(0, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress);
			else return nextProps = workInProgress.lanes = 536870912, deferHiddenOffscreenComponent(current, workInProgress, null !== prevState ? prevState.baseLanes | renderLanes : renderLanes, renderLanes, nextProps), null;
		} else null !== prevState ? (pushTransition(0, prevState.cachePool), pushHiddenContext(0, prevState), reuseSuspenseHandlerOnStack(), workInProgress.memoizedState = null) : (null !== current && pushTransition(0, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	function bailoutOffscreenComponent(current, workInProgress) {
		null !== current && 22 === current.tag || null !== workInProgress.stateNode || (workInProgress.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		});
		return workInProgress.sibling;
	}
	function deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes, remainingChildLanes) {
		var JSCompiler_inline_result = peekCacheFromPool();
		JSCompiler_inline_result = null === JSCompiler_inline_result ? null : {
			parent: CacheContext._currentValue,
			pool: JSCompiler_inline_result
		};
		workInProgress.memoizedState = {
			baseLanes: nextBaseLanes,
			cachePool: JSCompiler_inline_result
		};
		null !== current && pushTransition(0, null);
		reuseHiddenContextOnStack();
		pushOffscreenSuspenseHandler(workInProgress);
		null !== current && propagateParentContextChanges(0, workInProgress, renderLanes, true);
		workInProgress.childLanes = remainingChildLanes;
		return;
	}
	function mountActivityChildren(workInProgress, nextProps) {
		nextProps = mountWorkInProgressOffscreenFiber({
			mode: nextProps.mode,
			children: nextProps.children
		}, workInProgress.mode);
		nextProps.ref = workInProgress.ref;
		workInProgress.child = nextProps;
		nextProps.return = workInProgress;
		return nextProps;
	}
	function retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes) {
		reconcileChildFibers(workInProgress, current.child, null, renderLanes);
		current = mountActivityChildren(workInProgress, workInProgress.pendingProps);
		current.flags |= 2;
		popSuspenseHandler(workInProgress);
		workInProgress.memoizedState = null;
		return current;
	}
	function updateActivityComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, didSuspend = 0 !== (workInProgress.flags & 128);
		workInProgress.flags &= -129;
		if (null === current) {
			if (isHydrating) {
				if ("hidden" === nextProps.mode) return current = mountActivityChildren(workInProgress, nextProps), workInProgress.lanes = 536870912, bailoutOffscreenComponent(null, current);
				pushDehydratedActivitySuspenseHandler(workInProgress);
				(current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress.memoizedState = {
					dehydrated: current,
					treeContext: null !== treeContextProvider ? {
						id: treeContextId,
						overflow: treeContextOverflow
					} : null,
					retryLane: 536870912,
					hydrationErrors: null
				}, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
				if (null === current) throw throwOnHydrationMismatch(workInProgress);
				workInProgress.lanes = 536870912;
				return null;
			}
			return mountActivityChildren(workInProgress, nextProps);
		}
		var prevState = current.memoizedState;
		if (null !== prevState) {
			var dehydrated = prevState.dehydrated;
			pushDehydratedActivitySuspenseHandler(workInProgress);
			if (didSuspend) if (workInProgress.flags & 256) workInProgress.flags &= -257, workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
			else if (null !== workInProgress.memoizedState) workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null;
			else throw Error(formatProdErrorMessage(558));
			else if (didReceiveUpdate || propagateParentContextChanges(0, workInProgress, renderLanes, false), didSuspend = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || didSuspend) {
				nextProps = workInProgressRoot;
				if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes), 0 !== dehydrated && dehydrated !== prevState.retryLane)) throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, 0, dehydrated), SelectiveHydrationException;
				renderDidSuspendDelayIfPossible();
				workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress, current), workInProgress = mountActivityChildren(workInProgress, nextProps), workInProgress.flags |= 4096;
			return workInProgress;
		}
		current = createWorkInProgress(current.child, {
			mode: nextProps.mode,
			children: nextProps.children
		});
		current.ref = workInProgress.ref;
		workInProgress.child = current;
		current.return = workInProgress;
		return current;
	}
	function markRef(current, workInProgress) {
		var ref = workInProgress.ref;
		if (null === ref) null !== current && null !== current.ref && (workInProgress.flags |= 4194816);
		else {
			if ("function" !== typeof ref && "object" !== typeof ref) throw Error(formatProdErrorMessage(284));
			if (null === current || current.ref !== ref) workInProgress.flags |= 4194816;
		}
	}
	function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		Component = renderWithHooks(current, workInProgress, Component, nextProps, void 0, renderLanes);
		nextProps = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, Component, renderLanes);
		return workInProgress.child;
	}
	function replayFunctionComponent(current, workInProgress, nextProps, Component, secondArg, renderLanes) {
		prepareToReadContext(workInProgress);
		workInProgress.updateQueue = null;
		nextProps = renderWithHooksAgain(workInProgress, Component, nextProps, secondArg);
		finishRenderingHooks(current);
		Component = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && Component && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		if (null === workInProgress.stateNode) {
			var context = emptyContextObject, contextType = Component.contextType;
			"object" === typeof contextType && null !== contextType && (context = readContext(contextType));
			context = new Component(nextProps, context);
			workInProgress.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
			context.updater = classComponentUpdater;
			workInProgress.stateNode = context;
			context._reactInternals = workInProgress;
			context = workInProgress.stateNode;
			context.props = nextProps;
			context.state = workInProgress.memoizedState;
			context.refs = {};
			initializeUpdateQueue(workInProgress);
			contextType = Component.contextType;
			context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
			context.state = workInProgress.memoizedState;
			contextType = Component.getDerivedStateFromProps;
			"function" === typeof contextType && (applyDerivedStateFromProps(workInProgress, 0, contextType, nextProps), context.state = workInProgress.memoizedState);
			"function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress, nextProps, context, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress.memoizedState);
			"function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308);
			nextProps = true;
		} else if (null === current) {
			context = workInProgress.stateNode;
			var unresolvedOldProps = workInProgress.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
			context.props = oldProps;
			var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
			contextType = emptyContextObject;
			"object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
			var getDerivedStateFromProps = Component.getDerivedStateFromProps;
			contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
			unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
			contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(0, context, nextProps, contextType);
			hasForceUpdate = false;
			var oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			oldContext = workInProgress.memoizedState;
			unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, 0, getDerivedStateFromProps, nextProps), oldContext = workInProgress.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, oldProps, nextProps, oldState, oldContext, contextType)) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), nextProps = false);
		} else {
			context = workInProgress.stateNode;
			cloneUpdateQueue(current, workInProgress);
			contextType = workInProgress.memoizedProps;
			contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
			context.props = contextType$jscomp$0;
			getDerivedStateFromProps = workInProgress.pendingProps;
			oldState = context.context;
			oldContext = Component.contextType;
			oldProps = emptyContextObject;
			"object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
			unresolvedOldProps = Component.getDerivedStateFromProps;
			(oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(0, context, nextProps, oldProps);
			hasForceUpdate = false;
			oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			var newState = workInProgress.memoizedState;
			contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(workInProgress, 0, unresolvedOldProps, nextProps), newState = workInProgress.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, contextType$jscomp$0, nextProps, oldState, newState, oldProps) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(nextProps, newState, oldProps)), "function" === typeof context.componentDidUpdate && (workInProgress.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), nextProps = false);
		}
		context = nextProps;
		markRef(current, workInProgress);
		nextProps = 0 !== (workInProgress.flags & 128);
		context || nextProps ? (context = workInProgress.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress.flags |= 1, null !== current && nextProps ? (workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes), workInProgress.child = reconcileChildFibers(workInProgress, null, Component, renderLanes)) : reconcileChildren(current, workInProgress, Component, renderLanes), workInProgress.memoizedState = context.state, current = workInProgress.child) : current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		return current;
	}
	function mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes) {
		resetHydrationState();
		workInProgress.flags |= 256;
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	var SUSPENDED_MARKER = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function mountSuspenseOffscreenState(renderLanes) {
		return {
			baseLanes: renderLanes,
			cachePool: getSuspendedCache()
		};
	}
	function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes) {
		current = null !== current ? current.childLanes & ~renderLanes : 0;
		primaryTreeDidDefer && (current |= workInProgressDeferredLane);
		return current;
	}
	function updateSuspenseComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress.flags & 128), JSCompiler_temp;
		(JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
		JSCompiler_temp && (showFallback = true, workInProgress.flags &= -129);
		JSCompiler_temp = 0 !== (workInProgress.flags & 32);
		workInProgress.flags &= -33;
		if (null === current) {
			if (isHydrating) {
				showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress) : reuseSuspenseHandlerOnStack();
				(current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress.memoizedState = {
					dehydrated: current,
					treeContext: null !== treeContextProvider ? {
						id: treeContextId,
						overflow: treeContextOverflow
					} : null,
					retryLane: 536870912,
					hydrationErrors: null
				}, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
				if (null === current) throw throwOnHydrationMismatch(workInProgress);
				isSuspenseInstanceFallback(current) ? workInProgress.lanes = 32 : workInProgress.lanes = 536870912;
				return null;
			}
			var nextPrimaryChildren = nextProps.children;
			nextProps = nextProps.fallback;
			if (showFallback) return reuseSuspenseHandlerOnStack(), showFallback = workInProgress.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber({
				mode: "hidden",
				children: nextPrimaryChildren
			}, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes, null), nextPrimaryChildren.return = workInProgress, nextProps.return = workInProgress, nextPrimaryChildren.sibling = nextProps, workInProgress.child = nextPrimaryChildren, nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
			pushPrimaryTreeSuspenseHandler(workInProgress);
			return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren);
		}
		var prevState = current.memoizedState;
		if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
			if (didSuspend) workInProgress.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags &= -257, workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes)) : null !== workInProgress.memoizedState ? (reuseSuspenseHandlerOnStack(), workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null) : (reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress.mode, nextProps = mountWorkInProgressOffscreenFiber({
				mode: "visible",
				children: nextProps.children
			}, showFallback), nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes, null), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress, nextPrimaryChildren.return = workInProgress, nextProps.sibling = nextPrimaryChildren, workInProgress.child = nextProps, reconcileChildFibers(workInProgress, current.child, null, renderLanes), nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, workInProgress = bailoutOffscreenComponent(null, nextProps));
			else if (pushPrimaryTreeSuspenseHandler(workInProgress), isSuspenseInstanceFallback(nextPrimaryChildren)) {
				JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
				if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
				JSCompiler_temp = digest;
				nextProps = Error(formatProdErrorMessage(419));
				nextProps.stack = "";
				nextProps.digest = JSCompiler_temp;
				queueHydrationError({
					value: nextProps,
					source: null,
					stack: null
				});
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else if (didReceiveUpdate || propagateParentContextChanges(0, workInProgress, renderLanes, false), JSCompiler_temp = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
				JSCompiler_temp = workInProgressRoot;
				if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes), 0 !== nextProps && nextProps !== prevState.retryLane)) throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, 0, nextProps), SelectiveHydrationException;
				isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress.flags |= 192, workInProgress.child = current.child, workInProgress = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(nextPrimaryChildren.nextSibling), hydrationParentFiber = workInProgress, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress, current), workInProgress = mountSuspensePrimaryChildren(workInProgress, nextProps.children), workInProgress.flags |= 4096);
			return workInProgress;
		}
		if (showFallback) return reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
			mode: "hidden",
			children: nextProps.children
		}), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(digest, nextPrimaryChildren) : (nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes, null), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress, nextProps.return = workInProgress, nextProps.sibling = nextPrimaryChildren, workInProgress.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? {
			parent: prevState,
			pool: prevState
		} : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
			baseLanes: nextPrimaryChildren.baseLanes | renderLanes,
			cachePool: showFallback
		}), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
		pushPrimaryTreeSuspenseHandler(workInProgress);
		renderLanes = current.child;
		current = renderLanes.sibling;
		renderLanes = createWorkInProgress(renderLanes, {
			mode: "visible",
			children: nextProps.children
		});
		renderLanes.return = workInProgress;
		renderLanes.sibling = null;
		null !== current && (JSCompiler_temp = workInProgress.deletions, null === JSCompiler_temp ? (workInProgress.deletions = [current], workInProgress.flags |= 16) : JSCompiler_temp.push(current));
		workInProgress.child = renderLanes;
		workInProgress.memoizedState = null;
		return renderLanes;
	}
	function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
		primaryChildren = mountWorkInProgressOffscreenFiber({
			mode: "visible",
			children: primaryChildren
		}, workInProgress.mode);
		primaryChildren.return = workInProgress;
		return workInProgress.child = primaryChildren;
	}
	function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
		offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
		offscreenProps.lanes = 0;
		return offscreenProps;
	}
	function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
		reconcileChildFibers(workInProgress, current.child, null, renderLanes);
		current = mountSuspensePrimaryChildren(workInProgress, workInProgress.pendingProps.children);
		current.flags |= 2;
		workInProgress.memoizedState = null;
		return current;
	}
	function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
		fiber.lanes |= renderLanes;
		var alternate = fiber.alternate;
		null !== alternate && (alternate.lanes |= renderLanes);
		scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
	}
	function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode, treeForkCount) {
		var renderState = workInProgress.memoizedState;
		null === renderState ? workInProgress.memoizedState = {
			isBackwards,
			rendering: null,
			renderingStartTime: 0,
			last: lastContentRow,
			tail,
			tailMode,
			treeForkCount
		} : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount);
	}
	function updateSuspenseListComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
		nextProps = nextProps.children;
		var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
		shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress.flags |= 128) : suspenseContext &= 1;
		push(suspenseStackCursor, suspenseContext);
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		nextProps = isHydrating ? treeForkCount : 0;
		if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128)) a: for (current = workInProgress.child; null !== current;) {
			if (13 === current.tag) null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
			else if (19 === current.tag) scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
			else if (null !== current.child) {
				current.child.return = current;
				current = current.child;
				continue;
			}
			if (current === workInProgress) break a;
			for (; null === current.sibling;) {
				if (null === current.return || current.return === workInProgress) break a;
				current = current.return;
			}
			current.sibling.return = current.return;
			current = current.sibling;
		}
		switch (revealOrder) {
			case "forwards":
				renderLanes = workInProgress.child;
				for (revealOrder = null; null !== renderLanes;) current = renderLanes.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes), renderLanes = renderLanes.sibling;
				renderLanes = revealOrder;
				null === renderLanes ? (revealOrder = workInProgress.child, workInProgress.child = null) : (revealOrder = renderLanes.sibling, renderLanes.sibling = null);
				initSuspenseListRenderState(workInProgress, false, revealOrder, renderLanes, tailMode, nextProps);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				renderLanes = null;
				revealOrder = workInProgress.child;
				for (workInProgress.child = null; null !== revealOrder;) {
					current = revealOrder.alternate;
					if (null !== current && null === findFirstSuspended(current)) {
						workInProgress.child = revealOrder;
						break;
					}
					current = revealOrder.sibling;
					revealOrder.sibling = renderLanes;
					renderLanes = revealOrder;
					revealOrder = current;
				}
				initSuspenseListRenderState(workInProgress, true, renderLanes, null, tailMode, nextProps);
				break;
			case "together":
				initSuspenseListRenderState(workInProgress, false, null, null, void 0, nextProps);
				break;
			default: workInProgress.memoizedState = null;
		}
		return workInProgress.child;
	}
	function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
		null !== current && (workInProgress.dependencies = current.dependencies);
		workInProgressRootSkippedLanes |= workInProgress.lanes;
		if (0 === (renderLanes & workInProgress.childLanes)) if (null !== current) {
			if (propagateParentContextChanges(0, workInProgress, renderLanes, false), 0 === (renderLanes & workInProgress.childLanes)) return null;
		} else return null;
		if (null !== current && workInProgress.child !== current.child) throw Error(formatProdErrorMessage(153));
		if (null !== workInProgress.child) {
			current = workInProgress.child;
			renderLanes = createWorkInProgress(current, current.pendingProps);
			workInProgress.child = renderLanes;
			for (renderLanes.return = workInProgress; null !== current.sibling;) current = current.sibling, renderLanes = renderLanes.sibling = createWorkInProgress(current, current.pendingProps), renderLanes.return = workInProgress;
			renderLanes.sibling = null;
		}
		return workInProgress.child;
	}
	function checkScheduledUpdateOrContext(current, renderLanes) {
		if (0 !== (current.lanes & renderLanes)) return true;
		current = current.dependencies;
		return null !== current && checkIfContextChanged(current) ? true : false;
	}
	function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes) {
		switch (workInProgress.tag) {
			case 3:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				pushProvider(0, CacheContext, current.memoizedState.cache);
				resetHydrationState();
				break;
			case 27:
			case 5:
				pushHostContext(workInProgress);
				break;
			case 4:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				break;
			case 10:
				pushProvider(0, workInProgress.type, workInProgress.memoizedProps.value);
				break;
			case 31:
				if (null !== workInProgress.memoizedState) return workInProgress.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress), null;
				break;
			case 13:
				var state$102 = workInProgress.memoizedState;
				if (null !== state$102) {
					if (null !== state$102.dehydrated) return pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags |= 128, null;
					if (0 !== (renderLanes & workInProgress.child.childLanes)) return updateSuspenseComponent(current, workInProgress, renderLanes);
					pushPrimaryTreeSuspenseHandler(workInProgress);
					current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
					return null !== current ? current.sibling : null;
				}
				pushPrimaryTreeSuspenseHandler(workInProgress);
				break;
			case 19:
				var didSuspendBefore = 0 !== (current.flags & 128);
				state$102 = 0 !== (renderLanes & workInProgress.childLanes);
				state$102 || (propagateParentContextChanges(0, workInProgress, renderLanes, false), state$102 = 0 !== (renderLanes & workInProgress.childLanes));
				if (didSuspendBefore) {
					if (state$102) return updateSuspenseListComponent(current, workInProgress, renderLanes);
					workInProgress.flags |= 128;
				}
				didSuspendBefore = workInProgress.memoizedState;
				null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
				push(suspenseStackCursor, suspenseStackCursor.current);
				if (state$102) break;
				else return null;
			case 22: return workInProgress.lanes = 0, updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
			case 24: pushProvider(0, CacheContext, current.memoizedState.cache);
		}
		return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	}
	function beginWork(current, workInProgress, renderLanes) {
		if (null !== current) if (current.memoizedProps !== workInProgress.pendingProps) didReceiveUpdate = true;
		else {
			if (!checkScheduledUpdateOrContext(current, renderLanes) && 0 === (workInProgress.flags & 128)) return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
			didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
		}
		else didReceiveUpdate = false, isHydrating && 0 !== (workInProgress.flags & 1048576) && pushTreeId(workInProgress, treeForkCount, workInProgress.index);
		workInProgress.lanes = 0;
		switch (workInProgress.tag) {
			case 16:
				a: {
					var props = workInProgress.pendingProps;
					current = resolveLazy(workInProgress.elementType);
					workInProgress.type = current;
					if ("function" === typeof current) shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress.tag = 1, workInProgress = updateClassComponent(null, workInProgress, current, props, renderLanes)) : (workInProgress.tag = 0, workInProgress = updateFunctionComponent(null, workInProgress, current, props, renderLanes));
					else {
						if (void 0 !== current && null !== current) {
							var $$typeof = current.$$typeof;
							if ($$typeof === REACT_FORWARD_REF_TYPE) {
								workInProgress.tag = 11;
								workInProgress = updateForwardRef(null, workInProgress, current, props, renderLanes);
								break a;
							} else if ($$typeof === REACT_MEMO_TYPE) {
								workInProgress.tag = 14;
								workInProgress = updateMemoComponent(null, workInProgress, current, props, renderLanes);
								break a;
							}
						}
						workInProgress = getComponentNameFromType(current) || current;
						throw Error(formatProdErrorMessage(306, workInProgress, ""));
					}
				}
				return workInProgress;
			case 0: return updateFunctionComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 1: return props = workInProgress.type, $$typeof = resolveClassComponentProps(props, workInProgress.pendingProps), updateClassComponent(current, workInProgress, props, $$typeof, renderLanes);
			case 3:
				a: {
					pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
					if (null === current) throw Error(formatProdErrorMessage(387));
					props = workInProgress.pendingProps;
					var prevState = workInProgress.memoizedState;
					$$typeof = prevState.element;
					cloneUpdateQueue(current, workInProgress);
					processUpdateQueue(workInProgress, props, null, renderLanes);
					var nextState = workInProgress.memoizedState;
					props = nextState.cache;
					pushProvider(0, CacheContext, props);
					props !== prevState.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, true);
					suspendIfUpdateReadFromEntangledAsyncAction();
					props = nextState.element;
					if (prevState.isDehydrated) if (prevState = {
						element: props,
						isDehydrated: false,
						cache: nextState.cache
					}, workInProgress.updateQueue.baseState = prevState, workInProgress.memoizedState = prevState, workInProgress.flags & 256) {
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
						break a;
					} else if (props !== $$typeof) {
						$$typeof = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress);
						queueHydrationError($$typeof);
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
						break a;
					} else {
						current = workInProgress.stateNode.containerInfo;
						switch (current.nodeType) {
							case 9:
								current = current.body;
								break;
							default: current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
						}
						nextHydratableInstance = getNextHydratable(current.firstChild);
						hydrationParentFiber = workInProgress;
						isHydrating = true;
						hydrationErrors = null;
						rootOrSingletonContext = true;
						renderLanes = mountChildFibers(workInProgress, null, props, renderLanes);
						for (workInProgress.child = renderLanes; renderLanes;) renderLanes.flags = renderLanes.flags & -3 | 4096, renderLanes = renderLanes.sibling;
					}
					else {
						resetHydrationState();
						if (props === $$typeof) {
							workInProgress = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
							break a;
						}
						reconcileChildren(current, workInProgress, props, renderLanes);
					}
					workInProgress = workInProgress.child;
				}
				return workInProgress;
			case 26: return markRef(current, workInProgress), null === current ? (renderLanes = getResource(workInProgress.type, null, workInProgress.pendingProps, null)) ? workInProgress.memoizedState = renderLanes : isHydrating || (renderLanes = workInProgress.type, current = workInProgress.pendingProps, props = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current).createElement(renderLanes), props[internalInstanceKey] = workInProgress, props[internalPropsKey] = current, setInitialProperties(props, renderLanes, current), markNodeAsHoistable(props), workInProgress.stateNode = props) : workInProgress.memoizedState = getResource(workInProgress.type, current.memoizedProps, workInProgress.pendingProps, current.memoizedState), null;
			case 27: return pushHostContext(workInProgress), null === current && isHydrating && (props = workInProgress.stateNode = resolveSingletonInstance(workInProgress.type, 0, rootInstanceStackCursor.current), hydrationParentFiber = workInProgress, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), markRef(current, workInProgress), null === current && (workInProgress.flags |= 4194304), workInProgress.child;
			case 5:
				if (null === current && isHydrating) {
					if ($$typeof = props = nextHydratableInstance) props = canHydrateInstance(props, workInProgress.type, workInProgress.pendingProps, rootOrSingletonContext), null !== props ? (workInProgress.stateNode = props, hydrationParentFiber = workInProgress, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
					$$typeof || throwOnHydrationMismatch(workInProgress);
				}
				pushHostContext(workInProgress);
				$$typeof = workInProgress.type;
				prevState = workInProgress.pendingProps;
				nextState = null !== current ? current.memoizedProps : null;
				props = prevState.children;
				shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress.flags |= 32);
				null !== workInProgress.memoizedState && ($$typeof = renderWithHooks(current, workInProgress, TransitionAwareHostComponent, 0, 0, renderLanes), HostTransitionContext._currentValue = $$typeof);
				markRef(current, workInProgress);
				reconcileChildren(current, workInProgress, props, renderLanes);
				return workInProgress.child;
			case 6:
				if (null === current && isHydrating) {
					if (current = renderLanes = nextHydratableInstance) renderLanes = canHydrateTextInstance(renderLanes, workInProgress.pendingProps, rootOrSingletonContext), null !== renderLanes ? (workInProgress.stateNode = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null, current = true) : current = false;
					current || throwOnHydrationMismatch(workInProgress);
				}
				return null;
			case 13: return updateSuspenseComponent(current, workInProgress, renderLanes);
			case 4: return pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo), props = workInProgress.pendingProps, null === current ? workInProgress.child = reconcileChildFibers(workInProgress, null, props, renderLanes) : reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
			case 11: return updateForwardRef(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 7: return reconcileChildren(current, workInProgress, workInProgress.pendingProps, renderLanes), workInProgress.child;
			case 8: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 12: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 10: return props = workInProgress.pendingProps, pushProvider(0, workInProgress.type, props.value), reconcileChildren(current, workInProgress, props.children, renderLanes), workInProgress.child;
			case 9: return $$typeof = workInProgress.type._context, props = workInProgress.pendingProps.children, prepareToReadContext(workInProgress), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress.flags |= 1, reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
			case 14: return updateMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 15: return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 19: return updateSuspenseListComponent(current, workInProgress, renderLanes);
			case 31: return updateActivityComponent(current, workInProgress, renderLanes);
			case 22: return updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
			case 24: return prepareToReadContext(workInProgress), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes), $$typeof = prevState), workInProgress.memoizedState = {
				parent: props,
				cache: $$typeof
			}, initializeUpdateQueue(workInProgress), pushProvider(0, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes) && (cloneUpdateQueue(current, workInProgress), processUpdateQueue(workInProgress, null, null, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress.memoizedState, $$typeof.parent !== props ? ($$typeof = {
				parent: props,
				cache: props
			}, workInProgress.memoizedState = $$typeof, 0 === workInProgress.lanes && (workInProgress.memoizedState = workInProgress.updateQueue.baseState = $$typeof), pushProvider(0, CacheContext, props)) : (props = prevState.cache, pushProvider(0, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, true))), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 29: throw workInProgress.pendingProps;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function markUpdate(workInProgress) {
		workInProgress.flags |= 4;
	}
	function preloadInstanceAndSuspendIfNeeded(workInProgress, type, __unused_9837, __unused_ED90, renderLanes) {
		if (type = 0 !== (workInProgress.mode & 32)) type = false;
		if (type) {
			if (workInProgress.flags |= 16777216, (renderLanes & 335544128) === renderLanes) if (workInProgress.stateNode.complete) workInProgress.flags |= 8192;
			else if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
			else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
		} else workInProgress.flags &= -16777217;
	}
	function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
		if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4)) workInProgress.flags &= -16777217;
		else if (workInProgress.flags |= 16777216, !preloadResource(resource)) if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
		else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
	}
	function scheduleRetryEffect(workInProgress, retryQueue) {
		null !== retryQueue && (workInProgress.flags |= 4);
		workInProgress.flags & 16384 && (retryQueue = 22 !== workInProgress.tag ? claimNextRetryLane() : 536870912, workInProgress.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
	}
	function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
		if (!isHydrating) switch (renderState.tailMode) {
			case "hidden":
				hasRenderedATailFallback = renderState.tail;
				for (var lastTailNode = null; null !== hasRenderedATailFallback;) null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
				null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
				break;
			case "collapsed":
				lastTailNode = renderState.tail;
				for (var lastTailNode$106 = null; null !== lastTailNode;) null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
				null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
		}
	}
	function bubbleProperties(completedWork) {
		var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
		if (didBailout) for (var child$107 = completedWork.child; null !== child$107;) newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
		else for (child$107 = completedWork.child; null !== child$107;) newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
		completedWork.subtreeFlags |= subtreeFlags;
		completedWork.childLanes = newChildLanes;
		return;
	}
	function completeWork(current, workInProgress, renderLanes) {
		var newProps = workInProgress.pendingProps;
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return bubbleProperties(workInProgress), null;
			case 1: return bubbleProperties(workInProgress), null;
			case 3:
				renderLanes = workInProgress.stateNode;
				newProps = null;
				null !== current && (newProps = current.memoizedState.cache);
				workInProgress.memoizedState.cache !== newProps && (workInProgress.flags |= 2048);
				popProvider(CacheContext);
				popHostContainer();
				renderLanes.pendingContext && (renderLanes.context = renderLanes.pendingContext, renderLanes.pendingContext = null);
				if (null === current || null === current.child) popHydrationState(workInProgress) ? markUpdate(workInProgress) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress.flags & 256) || (workInProgress.flags |= 1024, upgradeHydrationErrorsToRecoverable());
				bubbleProperties(workInProgress);
				return null;
			case 26:
				var type = workInProgress.type, nextResource = workInProgress.memoizedState;
				null === current ? (markUpdate(workInProgress), null !== nextResource ? (bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, 0, 0, 0, renderLanes))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress), bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), workInProgress.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress), bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, 0, 0, 0, renderLanes));
				return null;
			case 27:
				popHostContext(workInProgress);
				renderLanes = rootInstanceStackCursor.current;
				type = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					current = contextStackCursor.current;
					popHydrationState(workInProgress) ? prepareToHydrateHostInstance(workInProgress) : (current = resolveSingletonInstance(type, 0, renderLanes), workInProgress.stateNode = current, markUpdate(workInProgress));
				}
				bubbleProperties(workInProgress);
				return null;
			case 5:
				popHostContext(workInProgress);
				type = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					nextResource = contextStackCursor.current;
					if (popHydrationState(workInProgress)) prepareToHydrateHostInstance(workInProgress);
					else {
						var ownerDocument = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current);
						switch (nextResource) {
							case 1:
								nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
								break;
							case 2:
								nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
								break;
							default: switch (type) {
								case "svg":
									nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
									break;
								case "math":
									nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
									break;
								case "script":
									nextResource = ownerDocument.createElement("div");
									nextResource.innerHTML = "<script><\/script>";
									nextResource = nextResource.removeChild(nextResource.firstChild);
									break;
								case "select":
									nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", { is: newProps.is }) : ownerDocument.createElement("select");
									newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
									break;
								default: nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
							}
						}
						nextResource[internalInstanceKey] = workInProgress;
						nextResource[internalPropsKey] = newProps;
						a: for (ownerDocument = workInProgress.child; null !== ownerDocument;) {
							if (5 === ownerDocument.tag || 6 === ownerDocument.tag) nextResource.appendChild(ownerDocument.stateNode);
							else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
								ownerDocument.child.return = ownerDocument;
								ownerDocument = ownerDocument.child;
								continue;
							}
							if (ownerDocument === workInProgress) break a;
							for (; null === ownerDocument.sibling;) {
								if (null === ownerDocument.return || ownerDocument.return === workInProgress) break a;
								ownerDocument = ownerDocument.return;
							}
							ownerDocument.sibling.return = ownerDocument.return;
							ownerDocument = ownerDocument.sibling;
						}
						workInProgress.stateNode = nextResource;
						a: switch (setInitialProperties(nextResource, type, newProps), type) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								newProps = !!newProps.autoFocus;
								break a;
							case "img":
								newProps = true;
								break a;
							default: newProps = false;
						}
						newProps && markUpdate(workInProgress);
					}
				}
				bubbleProperties(workInProgress);
				preloadInstanceAndSuspendIfNeeded(workInProgress, 0, 0, 0, renderLanes);
				return null;
			case 6:
				if (current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if ("string" !== typeof newProps && null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
					current = rootInstanceStackCursor.current;
					if (popHydrationState(workInProgress)) {
						current = workInProgress.stateNode;
						renderLanes = workInProgress.memoizedProps;
						newProps = null;
						type = hydrationParentFiber;
						if (null !== type) switch (type.tag) {
							case 27:
							case 5: newProps = type.memoizedProps;
						}
						current[internalInstanceKey] = workInProgress;
						current = current.nodeValue === renderLanes || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes) ? true : false;
						current || throwOnHydrationMismatch(workInProgress, true);
					} else current = getOwnerDocumentFromRootContainer(current).createTextNode(newProps), current[internalInstanceKey] = workInProgress, workInProgress.stateNode = current;
				}
				bubbleProperties(workInProgress);
				return null;
			case 31:
				renderLanes = workInProgress.memoizedState;
				if (null === current || null !== current.memoizedState) {
					newProps = popHydrationState(workInProgress);
					if (null !== renderLanes) {
						if (null === current) {
							if (!newProps) throw Error(formatProdErrorMessage(318));
							current = workInProgress.memoizedState;
							current = null !== current ? current.dehydrated : null;
							if (!current) throw Error(formatProdErrorMessage(557));
							current[internalInstanceKey] = workInProgress;
						} else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
						bubbleProperties(workInProgress);
						current = false;
					} else renderLanes = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes), current = true;
					if (!current) {
						if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
						popSuspenseHandler(workInProgress);
						return null;
					}
					if (0 !== (workInProgress.flags & 128)) throw Error(formatProdErrorMessage(558));
				}
				bubbleProperties(workInProgress);
				return null;
			case 13:
				newProps = workInProgress.memoizedState;
				if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
					type = popHydrationState(workInProgress);
					if (null !== newProps && null !== newProps.dehydrated) {
						if (null === current) {
							if (!type) throw Error(formatProdErrorMessage(318));
							type = workInProgress.memoizedState;
							type = null !== type ? type.dehydrated : null;
							if (!type) throw Error(formatProdErrorMessage(317));
							type[internalInstanceKey] = workInProgress;
						} else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
						bubbleProperties(workInProgress);
						type = false;
					} else type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
					if (!type) {
						if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
						popSuspenseHandler(workInProgress);
						return null;
					}
				}
				popSuspenseHandler(workInProgress);
				if (0 !== (workInProgress.flags & 128)) return workInProgress.lanes = renderLanes, workInProgress;
				renderLanes = null !== newProps;
				current = null !== current && null !== current.memoizedState;
				renderLanes && (newProps = workInProgress.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
				renderLanes !== current && renderLanes && (workInProgress.child.flags |= 8192);
				scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
				bubbleProperties(workInProgress);
				return null;
			case 4: return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress.stateNode.containerInfo), bubbleProperties(workInProgress), null;
			case 10: return popProvider(workInProgress.type), bubbleProperties(workInProgress), null;
			case 19:
				pop(suspenseStackCursor);
				newProps = workInProgress.memoizedState;
				if (null === newProps) return bubbleProperties(workInProgress), null;
				type = 0 !== (workInProgress.flags & 128);
				nextResource = newProps.rendering;
				if (null === nextResource) if (type) cutOffTailIfNeeded(newProps, false);
				else {
					if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128)) for (current = workInProgress.child; null !== current;) {
						nextResource = findFirstSuspended(current);
						if (null !== nextResource) {
							workInProgress.flags |= 128;
							cutOffTailIfNeeded(newProps, false);
							current = nextResource.updateQueue;
							workInProgress.updateQueue = current;
							scheduleRetryEffect(workInProgress, current);
							workInProgress.subtreeFlags = 0;
							current = renderLanes;
							for (renderLanes = workInProgress.child; null !== renderLanes;) resetWorkInProgress(renderLanes, current), renderLanes = renderLanes.sibling;
							push(suspenseStackCursor, suspenseStackCursor.current & 1 | 2);
							isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount);
							return workInProgress.child;
						}
						current = current.sibling;
					}
					null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress.lanes = 4194304);
				}
				else {
					if (!type) if (current = findFirstSuspended(nextResource), null !== current) {
						if (workInProgress.flags |= 128, type = true, current = current.updateQueue, workInProgress.updateQueue = current, scheduleRetryEffect(workInProgress, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating) return bubbleProperties(workInProgress), null;
					} else 2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes && (workInProgress.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress.lanes = 4194304);
					newProps.isBackwards ? (nextResource.sibling = workInProgress.child, workInProgress.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress.child = nextResource, newProps.last = nextResource);
				}
				if (null !== newProps.tail) return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes = suspenseStackCursor.current, push(suspenseStackCursor, type ? renderLanes & 1 | 2 : renderLanes & 1), isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount), current;
				bubbleProperties(workInProgress);
				return null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), newProps = null !== workInProgress.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress.flags |= 8192) : newProps && (workInProgress.flags |= 8192), newProps ? 0 !== (renderLanes & 536870912) && 0 === (workInProgress.flags & 128) && (bubbleProperties(workInProgress), workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192)) : bubbleProperties(workInProgress), renderLanes = workInProgress.updateQueue, null !== renderLanes && scheduleRetryEffect(workInProgress, renderLanes.retryQueue), renderLanes = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress.memoizedState && null !== workInProgress.memoizedState.cachePool && (newProps = workInProgress.memoizedState.cachePool.pool), newProps !== renderLanes && (workInProgress.flags |= 2048), null !== current && pop(resumedCache), null;
			case 24: return renderLanes = null, null !== current && (renderLanes = current.memoizedState.cache), workInProgress.memoizedState.cache !== renderLanes && (workInProgress.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function unwindWork(current, workInProgress) {
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 1: return current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 3: return popProvider(CacheContext), popHostContainer(), current = workInProgress.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 26:
			case 27:
			case 5: return popHostContext(workInProgress), null;
			case 31:
				if (null !== workInProgress.memoizedState) {
					popSuspenseHandler(workInProgress);
					if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
					resetHydrationState();
				}
				current = workInProgress.flags;
				return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 13:
				popSuspenseHandler(workInProgress);
				current = workInProgress.memoizedState;
				if (null !== current && null !== current.dehydrated) {
					if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
					resetHydrationState();
				}
				current = workInProgress.flags;
				return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 19: return pop(suspenseStackCursor), null;
			case 4: return popHostContainer(), null;
			case 10: return popProvider(workInProgress.type), null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 24: return popProvider(CacheContext), null;
			case 25: return null;
			default: return null;
		}
	}
	function unwindInterruptedWork(current, interruptedWork) {
		popTreeContext(interruptedWork);
		switch (interruptedWork.tag) {
			case 3:
				popProvider(CacheContext);
				popHostContainer();
				break;
			case 26:
			case 27:
			case 5:
				popHostContext(interruptedWork);
				break;
			case 4:
				popHostContainer();
				break;
			case 31:
				null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
				break;
			case 13:
				popSuspenseHandler(interruptedWork);
				break;
			case 19:
				pop(suspenseStackCursor);
				break;
			case 10:
				popProvider(interruptedWork.type);
				break;
			case 22:
			case 23:
				popSuspenseHandler(interruptedWork);
				popHiddenContext();
				null !== current && pop(resumedCache);
				break;
			case 24: popProvider(CacheContext);
		}
	}
	function commitHookEffectListMount(flags, finishedWork) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						lastEffect = void 0;
						var create = updateQueue.create, inst = updateQueue.inst;
						lastEffect = create();
						inst.destroy = lastEffect;
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						var inst = updateQueue.inst, destroy = inst.destroy;
						if (void 0 !== destroy) {
							inst.destroy = void 0;
							lastEffect = finishedWork;
							var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
							try {
								destroy_();
							} catch (error) {
								captureCommitPhaseError(lastEffect, nearestMountedAncestor, error);
							}
						}
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitClassCallbacks(finishedWork) {
		var updateQueue = finishedWork.updateQueue;
		if (null !== updateQueue) {
			var instance = finishedWork.stateNode;
			try {
				commitCallbacks(updateQueue, instance);
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
		}
	}
	function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
		instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
		instance.state = current.memoizedState;
		try {
			instance.componentWillUnmount();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyAttachRef(current, nearestMountedAncestor) {
		try {
			var ref = current.ref;
			if (null !== ref) {
				switch (current.tag) {
					case 26:
					case 27:
					case 5:
						var instanceToUse = current.stateNode;
						break;
					case 30:
						instanceToUse = current.stateNode;
						break;
					default: instanceToUse = current.stateNode;
				}
				"function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
			}
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyDetachRef(current, nearestMountedAncestor) {
		var ref = current.ref, refCleanup = current.refCleanup;
		if (null !== ref) if ("function" === typeof refCleanup) try {
			refCleanup();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		} finally {
			current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
		}
		else if ("function" === typeof ref) try {
			ref(null);
		} catch (error$140) {
			captureCommitPhaseError(current, nearestMountedAncestor, error$140);
		}
		else ref.current = null;
	}
	function commitHostMount(finishedWork) {
		var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
		try {
			a: switch (type) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					props.autoFocus && instance.focus();
					break a;
				case "img": props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHostUpdate(finishedWork, newProps, oldProps) {
		try {
			var domElement = finishedWork.stateNode;
			updateProperties(domElement, finishedWork.type, oldProps, newProps);
			domElement[internalPropsKey] = newProps;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function isHostParent(fiber) {
		return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
	}
	function getHostSibling(fiber) {
		a: for (;;) {
			for (; null === fiber.sibling;) {
				if (null === fiber.return || isHostParent(fiber.return)) return null;
				fiber = fiber.return;
			}
			fiber.sibling.return = fiber.return;
			for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag;) {
				if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
				if (fiber.flags & 2) continue a;
				if (null === fiber.child || 4 === fiber.tag) continue a;
				else fiber.child.return = fiber, fiber = fiber.child;
			}
			if (!(fiber.flags & 2)) return fiber.stateNode;
		}
	}
	function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node)) for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
	}
	function insertOrAppendPlacementNode(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node)) for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
	}
	function commitHostSingletonAcquisition(finishedWork) {
		var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
		try {
			for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length;) singleton.removeAttributeNode(attributes[0]);
			setInitialProperties(singleton, type, props);
			singleton[internalInstanceKey] = finishedWork;
			singleton[internalPropsKey] = props;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, needsFormReset = false, PossiblyWeakSet = Set, nextEffect = null;
	function commitBeforeMutationEffects(root, firstChild) {
		root = root.containerInfo;
		eventsEnabled = _enabled;
		root = getActiveElementDeep(root);
		if (hasSelectionCapabilities(root)) {
			if ("selectionStart" in root) var JSCompiler_temp = {
				start: root.selectionStart,
				end: root.selectionEnd
			};
			else a: {
				JSCompiler_temp = (JSCompiler_temp = root.ownerDocument) && JSCompiler_temp.defaultView || window;
				var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
				if (selection && 0 !== selection.rangeCount) {
					JSCompiler_temp = selection.anchorNode;
					var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
					selection = selection.focusOffset;
					var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root, parentNode = null;
					b: for (;;) {
						for (var next;;) {
							node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
							node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
							3 === node.nodeType && (length += node.nodeValue.length);
							if (null === (next = node.firstChild)) break;
							parentNode = node;
							node = next;
						}
						for (;;) {
							if (node === root) break b;
							parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
							parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
							if (null !== (next = node.nextSibling)) break;
							node = parentNode;
							parentNode = node.parentNode;
						}
						node = next;
					}
					JSCompiler_temp = -1 === start || -1 === end ? null : {
						start,
						end
					};
				} else JSCompiler_temp = null;
			}
			JSCompiler_temp = JSCompiler_temp || {
				start: 0,
				end: 0
			};
		} else JSCompiler_temp = null;
		selectionInformation = {
			focusedElem: root,
			selectionRange: JSCompiler_temp
		};
		_enabled = false;
		for (nextEffect = firstChild; null !== nextEffect;) if (firstChild = nextEffect, root = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root) root.return = firstChild, nextEffect = root;
		else for (; null !== nextEffect;) {
			firstChild = nextEffect;
			focusNode = firstChild.alternate;
			root = firstChild.flags;
			switch (firstChild.tag) {
				case 0:
					if (0 !== (root & 4) && (root = firstChild.updateQueue, root = null !== root ? root.events : null, null !== root)) for (JSCompiler_temp = 0; JSCompiler_temp < root.length; JSCompiler_temp++) anchorOffset = root[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (0 !== (root & 1024) && null !== focusNode) {
						root = void 0;
						JSCompiler_temp = firstChild;
						anchorOffset = focusNode.memoizedProps;
						focusNode = focusNode.memoizedState;
						selection = JSCompiler_temp.stateNode;
						try {
							var resolvedPrevProps = resolveClassComponentProps(JSCompiler_temp.type, anchorOffset);
							root = selection.getSnapshotBeforeUpdate(resolvedPrevProps, focusNode);
							selection.__reactInternalSnapshotBeforeUpdate = root;
						} catch (error) {
							captureCommitPhaseError(JSCompiler_temp, JSCompiler_temp.return, error);
						}
					}
					break;
				case 3:
					if (0 !== (root & 1024)) {
						if (root = firstChild.stateNode.containerInfo, JSCompiler_temp = root.nodeType, 9 === JSCompiler_temp) clearContainerSparingly(root);
						else if (1 === JSCompiler_temp) switch (root.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								clearContainerSparingly(root);
								break;
							default: root.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (0 !== (root & 1024)) throw Error(formatProdErrorMessage(163));
			}
			root = firstChild.sibling;
			if (null !== root) {
				root.return = firstChild.return;
				nextEffect = root;
				break;
			}
			nextEffect = firstChild.return;
		}
	}
	function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitHookEffectListMount(5, finishedWork);
				break;
			case 1:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 4) if (finishedRoot = finishedWork.stateNode, null === current) try {
					finishedRoot.componentDidMount();
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				else {
					var prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
					current = current.memoizedState;
					try {
						finishedRoot.componentDidUpdate(prevProps, current, finishedRoot.__reactInternalSnapshotBeforeUpdate);
					} catch (error$139) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error$139);
					}
				}
				flags & 64 && commitClassCallbacks(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
					current = null;
					if (null !== finishedWork.child) switch (finishedWork.child.tag) {
						case 27:
						case 5:
							current = finishedWork.child.stateNode;
							break;
						case 1: current = finishedWork.child.stateNode;
					}
					try {
						commitCallbacks(finishedRoot, current);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 27: null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
			case 26:
			case 5:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				null === current && flags & 4 && commitHostMount(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 12:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				break;
			case 31:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
				break;
			case 13:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
				flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(0, finishedWork), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
				break;
			case 22:
				flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
				if (!flags) {
					current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
					prevProps = offscreenSubtreeIsHidden;
					var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
					offscreenSubtreeIsHidden = flags;
					(offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, 0 !== (finishedWork.subtreeFlags & 8772)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
					offscreenSubtreeIsHidden = prevProps;
					offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				}
				break;
			case 30: break;
			default: recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
		}
	}
	function detachFiberAfterEffects(fiber) {
		var alternate = fiber.alternate;
		null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
		fiber.child = null;
		fiber.deletions = null;
		fiber.sibling = null;
		5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
		fiber.stateNode = null;
		fiber.return = null;
		fiber.dependencies = null;
		fiber.memoizedProps = null;
		fiber.memoizedState = null;
		fiber.pendingProps = null;
		fiber.stateNode = null;
		fiber.updateQueue = null;
	}
	var hostParent = null, hostParentIsContainer = false;
	function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
		for (parent = parent.child; null !== parent;) commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
	}
	function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
		if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount) try {
			injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
		} catch {}
		switch (deletedFiber.tag) {
			case 26:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
				break;
			case 27:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
				isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				releaseSingletonInstance(deletedFiber.stateNode);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 5: offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
			case 6:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = null;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				if (null !== hostParent) if (hostParentIsContainer) try {
					(9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				else try {
					hostParent.removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				break;
			case 18:
				null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, deletedFiber.stateNode), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
				break;
			case 4:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = deletedFiber.stateNode.containerInfo;
				hostParentIsContainer = true;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
				offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 1:
				offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent));
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 21:
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 22:
				offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				offscreenSubtreeWasHidden = prevHostParent;
				break;
			default: recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
		}
	}
	function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
		if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
			finishedRoot = finishedRoot.dehydrated;
			try {
				retryIfBlockedOn(finishedRoot);
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
		}
	}
	function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
		if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot)))) try {
			retryIfBlockedOn(finishedRoot);
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function getRetryCache(finishedWork) {
		switch (finishedWork.tag) {
			case 31:
			case 13:
			case 19:
				var retryCache = finishedWork.stateNode;
				null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
				return retryCache;
			case 22: return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
			default: throw Error(formatProdErrorMessage(435, finishedWork.tag));
		}
	}
	function attachSuspenseRetryListeners(finishedWork, wakeables) {
		var retryCache = getRetryCache(finishedWork);
		wakeables.forEach(function(wakeable) {
			if (!retryCache.has(wakeable)) {
				retryCache.add(wakeable);
				var retry = resolveRetryWakeable.bind(0, finishedWork, wakeable);
				wakeable.then(retry, retry);
			}
		});
	}
	function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
		var deletions = parentFiber.deletions;
		if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
			var childToDelete = deletions[i], root = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
			a: for (; null !== parent;) {
				switch (parent.tag) {
					case 27:
						if (isSingletonScope(parent.type)) {
							hostParent = parent.stateNode;
							hostParentIsContainer = false;
							break a;
						}
						break;
					case 5:
						hostParent = parent.stateNode;
						hostParentIsContainer = false;
						break a;
					case 3:
					case 4:
						hostParent = parent.stateNode.containerInfo;
						hostParentIsContainer = true;
						break a;
				}
				parent = parent.return;
			}
			if (null === hostParent) throw Error(formatProdErrorMessage(160));
			commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
			hostParent = null;
			hostParentIsContainer = false;
			root = childToDelete.alternate;
			null !== root && (root.return = null);
			childToDelete.return = null;
		}
		if (parentFiber.subtreeFlags & 13886) for (parentFiber = parentFiber.child; null !== parentFiber;) commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
	}
	var currentHoistableRoot = null;
	function commitMutationEffectsOnFiber(finishedWork, root) {
		var current = finishedWork.alternate, flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
				break;
			case 1:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
				break;
			case 26:
				var hoistableRoot = currentHoistableRoot;
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (flags & 4) {
					var currentResource = null !== current ? current.memoizedState : null;
					flags = finishedWork.memoizedState;
					if (null === current) if (null === flags) if (null === finishedWork.stateNode) {
						a: {
							flags = finishedWork.type;
							current = finishedWork.memoizedProps;
							hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
							b: switch (flags) {
								case "title":
									currentResource = hoistableRoot.getElementsByTagName("title")[0];
									if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop")) currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(currentResource, hoistableRoot.querySelector("head > title"));
									setInitialProperties(currentResource, flags, current);
									currentResource[internalInstanceKey] = finishedWork;
									markNodeAsHoistable(currentResource);
									flags = currentResource;
									break a;
								case "link":
									var maybeNodes = getHydratableHoistableCache("link", "href", hoistableRoot).get(flags + (current.href || ""));
									if (maybeNodes) {
										for (var i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								case "meta":
									if (maybeNodes = getHydratableHoistableCache("meta", "content", hoistableRoot).get(flags + (current.content || ""))) {
										for (i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								default: throw Error(formatProdErrorMessage(468, flags));
							}
							currentResource[internalInstanceKey] = finishedWork;
							markNodeAsHoistable(currentResource);
							flags = currentResource;
						}
						finishedWork.stateNode = flags;
					} else mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode);
					else finishedWork.stateNode = acquireResource(hoistableRoot, flags, finishedWork.memoizedProps);
					else currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode) : acquireResource(hoistableRoot, flags, finishedWork.memoizedProps)) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				}
				break;
			case 27:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				null !== current && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				break;
			case 5:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (finishedWork.flags & 32) {
					hoistableRoot = finishedWork.stateNode;
					try {
						setTextContent(hoistableRoot, "");
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(finishedWork, hoistableRoot, null !== current ? current.memoizedProps : hoistableRoot));
				flags & 1024 && (needsFormReset = true);
				break;
			case 6:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				if (flags & 4) {
					if (null === finishedWork.stateNode) throw Error(formatProdErrorMessage(162));
					flags = finishedWork.memoizedProps;
					current = finishedWork.stateNode;
					try {
						current.nodeValue = flags;
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 3:
				tagCaches = null;
				hoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(root.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				currentHoistableRoot = hoistableRoot;
				commitReconciliationEffects(finishedWork);
				if (flags & 4 && null !== current && current.memoizedState.isDehydrated) try {
					retryIfBlockedOn(root.containerInfo);
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
				break;
			case 4:
				flags = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				currentHoistableRoot = flags;
				break;
			case 12:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				break;
			case 31:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 13:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 22:
				hoistableRoot = null !== finishedWork.memoizedState;
				var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
				recursivelyTraverseMutationEffects(root, finishedWork);
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
				commitReconciliationEffects(finishedWork);
				if (flags & 8192) a: for (root = finishedWork.stateNode, root._visibility = hoistableRoot ? root._visibility & -2 : root._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root = finishedWork;;) {
					if (5 === root.tag || 26 === root.tag) {
						if (null === current) {
							wasHidden = current = root;
							try {
								if (currentResource = wasHidden.stateNode, hoistableRoot) maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
								else {
									i = wasHidden.stateNode;
									var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
									i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
								}
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if (6 === root.tag) {
						if (null === current) {
							wasHidden = root;
							try {
								wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if (18 === root.tag) {
						if (null === current) {
							wasHidden = root;
							try {
								var instance = wasHidden.stateNode;
								hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if ((22 !== root.tag && 23 !== root.tag || null === root.memoizedState || root === finishedWork) && null !== root.child) {
						root.child.return = root;
						root = root.child;
						continue;
					}
					if (root === finishedWork) break a;
					for (; null === root.sibling;) {
						if (null === root.return || root.return === finishedWork) break a;
						current === root && (current = null);
						root = root.return;
					}
					current === root && (current = null);
					root.sibling.return = root.return;
					root = root.sibling;
				}
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
				break;
			case 19:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 30: break;
			case 21: break;
			default: recursivelyTraverseMutationEffects(root, finishedWork), commitReconciliationEffects(finishedWork);
		}
	}
	function commitReconciliationEffects(finishedWork) {
		var flags = finishedWork.flags;
		if (flags & 2) {
			try {
				for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber;) {
					if (isHostParent(parentFiber)) {
						hostParentFiber = parentFiber;
						break;
					}
					parentFiber = parentFiber.return;
				}
				if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
				switch (hostParentFiber.tag) {
					case 27:
						var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
						insertOrAppendPlacementNode(finishedWork, before, parent);
						break;
					case 5:
						var parent$141 = hostParentFiber.stateNode;
						hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
						var before$142 = getHostSibling(finishedWork);
						insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
						break;
					case 3:
					case 4:
						var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
						insertOrAppendPlacementNodeIntoContainer(finishedWork, before$144, parent$143);
						break;
					default: throw Error(formatProdErrorMessage(161));
				}
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
			finishedWork.flags &= -3;
		}
		flags & 4096 && (finishedWork.flags &= -4097);
	}
	function recursivelyResetForms(parentFiber) {
		if (parentFiber.subtreeFlags & 1024) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var fiber = parentFiber;
			recursivelyResetForms(fiber);
			5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseLayoutEffects(root, parentFiber) {
		if (parentFiber.subtreeFlags & 8772) for (parentFiber = parentFiber.child; null !== parentFiber;) commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
	}
	function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedWork = parentFiber;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 1:
					safelyDetachRef(finishedWork, finishedWork.return);
					var instance = finishedWork.stateNode;
					"function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 27: releaseSingletonInstance(finishedWork.stateNode);
				case 26:
				case 5:
					safelyDetachRef(finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 30:
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				default: recursivelyTraverseDisappearLayoutEffects(finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					commitHookEffectListMount(4, finishedWork);
					break;
				case 1:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					current = finishedWork;
					finishedRoot = current.stateNode;
					if ("function" === typeof finishedRoot.componentDidMount) try {
						finishedRoot.componentDidMount();
					} catch (error) {
						captureCommitPhaseError(current, current.return, error);
					}
					current = finishedWork;
					finishedRoot = current.updateQueue;
					if (null !== finishedRoot) {
						var instance = current.stateNode;
						try {
							var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
							if (null !== hiddenCallbacks) for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++) callCallback(hiddenCallbacks[finishedRoot], instance);
						} catch (error) {
							captureCommitPhaseError(current, current.return, error);
						}
					}
					includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 27: commitHostSingletonAcquisition(finishedWork);
				case 26:
				case 5:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 12:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					break;
				case 31:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
					break;
				case 13:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 30: break;
				default: recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitOffscreenPassiveMountEffects(current, finishedWork) {
		var previousCache = null;
		null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
		current = null;
		null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
		current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
	}
	function commitCachePassiveMountEffect(current, finishedWork) {
		current = null;
		null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
		finishedWork = finishedWork.memoizedState.cache;
		finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
	}
	function recursivelyTraversePassiveMountEffects(root, parentFiber) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveMountOnFiber(root, parentFiber), parentFiber = parentFiber.sibling;
	}
	function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				flags & 2048 && commitHookEffectListMount(9, finishedWork);
				break;
			case 1:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				break;
			case 3:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
				break;
			case 12:
				if (flags & 2048) {
					recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
					finishedRoot = finishedWork.stateNode;
					try {
						var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
						"function" === typeof onPostCommit && onPostCommit(id, null === finishedWork.alternate ? "mount" : "update", finishedRoot.passiveEffectDuration, -0);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				} else recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				break;
			case 31:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				break;
			case 13:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				break;
			case 23: break;
			case 22:
				_finishedWork$memoize2 = finishedWork.stateNode;
				id = finishedWork.alternate;
				null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork) : recursivelyTraverseAtomicPassiveEffects(0, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, 0 !== (finishedWork.subtreeFlags & 10256) || false));
				flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
				break;
			case 24:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
				flags & 2048 && commitCachePassiveMountEffect(0, finishedWork);
				break;
			default: recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
		}
	}
	function recursivelyTraverseReconnectPassiveEffects(__unused_E330, parentFiber, __unused_A503, __unused_E58D, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, includeWorkInProgressEffects);
					commitHookEffectListMount(8, finishedWork);
					break;
				case 23: break;
				case 22:
					var instance = finishedWork.stateNode;
					null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, includeWorkInProgressEffects) : recursivelyTraverseAtomicPassiveEffects(0, finishedWork) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, includeWorkInProgressEffects));
					includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(0, finishedWork);
					break;
				default: recursivelyTraverseReconnectPassiveEffects(0, finishedWork, 0, 0, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseAtomicPassiveEffects(__unused_E330_0, parentFiber) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 22:
					recursivelyTraverseAtomicPassiveEffects(0, finishedWork);
					flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseAtomicPassiveEffects(0, finishedWork);
					flags & 2048 && commitCachePassiveMountEffect(0, finishedWork);
					break;
				default: recursivelyTraverseAtomicPassiveEffects(0, finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	var suspenseyCommitFlag = 8192;
	function recursivelyAccumulateSuspenseyCommit(parentFiber, __unused_DD38_1, suspendedState) {
		if (parentFiber.subtreeFlags & suspenseyCommitFlag) for (parentFiber = parentFiber.child; null !== parentFiber;) accumulateSuspenseyCommitOnFiber(parentFiber, 0, suspendedState), parentFiber = parentFiber.sibling;
	}
	function accumulateSuspenseyCommitOnFiber(fiber, __unused_DD38_2, suspendedState) {
		switch (fiber.tag) {
			case 26:
				recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState);
				fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(suspendedState, currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps);
				break;
			case 5:
				recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState);
				break;
			case 3:
			case 4:
				var previousHoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
				recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState);
				currentHoistableRoot = previousHoistableRoot;
				break;
			case 22:
				null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState));
				break;
			default: recursivelyAccumulateSuspenseyCommit(fiber, 0, suspendedState);
		}
	}
	function detachAlternateSiblings(parentFiber) {
		var previousFiber = parentFiber.alternate;
		if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
			previousFiber.child = null;
			do
				previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
			while (null !== parentFiber);
		}
	}
	function recursivelyTraversePassiveUnmountEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
	}
	function commitPassiveUnmountOnFiber(finishedWork) {
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 12:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 22:
				var instance = finishedWork.stateNode;
				null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			default: recursivelyTraversePassiveUnmountEffects(finishedWork);
		}
	}
	function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			deletions = parentFiber;
			switch (deletions.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, deletions, deletions.return);
					recursivelyTraverseDisconnectPassiveEffects(deletions);
					break;
				case 22:
					i = deletions.stateNode;
					i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
					break;
				default: recursivelyTraverseDisconnectPassiveEffects(deletions);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
		for (; null !== nextEffect;) {
			var fiber = nextEffect;
			switch (fiber.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
					break;
				case 23:
				case 22:
					if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
						var cache = fiber.memoizedState.cachePool.pool;
						null != cache && cache.refCount++;
					}
					break;
				case 24: releaseCache(fiber.memoizedState.cache);
			}
			cache = fiber.child;
			if (null !== cache) cache.return = fiber, nextEffect = cache;
			else a: for (fiber = deletedSubtreeRoot; null !== nextEffect;) {
				cache = nextEffect;
				var sibling = cache.sibling, returnFiber = cache.return;
				detachFiberAfterEffects(cache);
				if (cache === fiber) {
					nextEffect = null;
					break a;
				}
				if (null !== sibling) {
					sibling.return = returnFiber;
					nextEffect = sibling;
					break a;
				}
				nextEffect = returnFiber;
			}
		}
	}
	var DefaultAsyncDispatcher = {
		getCacheForType: function(resourceType) {
			var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
			void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
			return cacheForType;
		},
		cacheSignal: function() {
			return readContext(CacheContext).controller.signal;
		}
	}, PossiblyWeakMap = Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
	function requestUpdateLane() {
		return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
	}
	function requestDeferredLane() {
		if (0 === workInProgressDeferredLane) if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
			var lane = nextTransitionDeferredLane;
			nextTransitionDeferredLane <<= 1;
			0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
			workInProgressDeferredLane = lane;
		} else workInProgressDeferredLane = 536870912;
		lane = suspenseHandlerStackCursor.current;
		null !== lane && (lane.flags |= 32);
		return workInProgressDeferredLane;
	}
	function scheduleUpdateOnFiber(root, __unused_BDE4, lane) {
		if (root === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) prepareFreshStack(root, 0), markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, false);
		markRootUpdated$1(root, lane);
		if (0 === (executionContext & 2) || root !== workInProgressRoot) root === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, false)), ensureRootIsScheduled(root);
	}
	function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
		do {
			if (0 === exitStatus) {
				workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
				break;
			} else {
				forceSync = root$jscomp$0.current.alternate;
				if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
					exitStatus = renderRootSync(root$jscomp$0, lanes, false);
					renderWasConcurrent = false;
					continue;
				}
				if (2 === exitStatus) {
					renderWasConcurrent = lanes;
					if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent) var JSCompiler_inline_result = 0;
					else JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
					if (0 !== JSCompiler_inline_result) {
						lanes = JSCompiler_inline_result;
						a: {
							var root = root$jscomp$0;
							exitStatus = workInProgressRootConcurrentErrors;
							var wasRootDehydrated = root.current.memoizedState.isDehydrated;
							wasRootDehydrated && (prepareFreshStack(root, JSCompiler_inline_result).flags |= 256);
							JSCompiler_inline_result = renderRootSync(root, JSCompiler_inline_result, false);
							if (2 !== JSCompiler_inline_result) {
								if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
									root.errorRecoveryDisabledLanes |= renderWasConcurrent;
									workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
									exitStatus = 4;
									break a;
								}
								renderWasConcurrent = workInProgressRootRecoverableErrors;
								workInProgressRootRecoverableErrors = exitStatus;
								null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, renderWasConcurrent));
							}
							exitStatus = JSCompiler_inline_result;
						}
						renderWasConcurrent = false;
						if (2 !== exitStatus) continue;
					}
				}
				if (1 === exitStatus) {
					prepareFreshStack(root$jscomp$0, 0);
					markRootSuspended(root$jscomp$0, lanes, 0, true);
					break;
				}
				a: {
					shouldTimeSlice = root$jscomp$0;
					renderWasConcurrent = exitStatus;
					switch (renderWasConcurrent) {
						case 0:
						case 1: throw Error(formatProdErrorMessage(345));
						case 4: if ((lanes & 4194048) !== lanes) break;
						case 6:
							markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
							break a;
						case 2:
							workInProgressRootRecoverableErrors = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(formatProdErrorMessage(329));
					}
					if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
						markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
						if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
						pendingEffectsLanes = lanes;
						shouldTimeSlice.timeoutHandle = scheduleTimeout(commitRootWhenReady.bind(0, shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, 0, 0, 0, 0), exitStatus);
						break a;
					}
					commitRootWhenReady(shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings);
				}
			}
			break;
		} while (1);
		ensureRootIsScheduled(root$jscomp$0);
	}
	function commitRootWhenReady(root, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, __unused_6C43, suspendedCommitReason) {
		root.timeoutHandle = -1;
		suspendedCommitReason = finishedWork.subtreeFlags;
		if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
			suspendedCommitReason = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: true,
				waitingForViewTransition: false,
				unsuspend: noop$1
			};
			accumulateSuspenseyCommitOnFiber(finishedWork, 0, suspendedCommitReason);
			var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
			timeoutOffset = waitForCommitToBeReady(suspendedCommitReason, timeoutOffset);
			if (null !== timeoutOffset) {
				pendingEffectsLanes = lanes;
				root.cancelPendingCommit = timeoutOffset(commitRoot.bind(0, root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, 0, 0, 0, 0, 0));
				markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
				return;
			}
		}
		commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
	}
	function isRenderConsistentWithExternalStores(finishedWork) {
		for (var node = finishedWork;;) {
			var tag = node.tag;
			if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag))) for (var i = 0; i < tag.length; i++) {
				var check = tag[i], getSnapshot = check.getSnapshot;
				check = check.value;
				try {
					if (!objectIs(getSnapshot(), check)) return false;
				} catch {
					return false;
				}
			}
			tag = node.child;
			if (node.subtreeFlags & 16384 && null !== tag) tag.return = node, node = tag;
			else {
				if (node === finishedWork) break;
				for (; null === node.sibling;) {
					if (null === node.return || node.return === finishedWork) return true;
					node = node.return;
				}
				node.sibling.return = node.return;
				node = node.sibling;
			}
		}
		return true;
	}
	function markRootSuspended(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
		suspendedLanes &= ~workInProgressRootPingedLanes;
		suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
		root.suspendedLanes |= suspendedLanes;
		root.pingedLanes &= ~suspendedLanes;
		didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
		didAttemptEntireTree = root.expirationTimes;
		for (var lanes = suspendedLanes; 0 < lanes;) {
			var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
			didAttemptEntireTree[index$6] = -1;
			lanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
	}
	function flushSyncWork$1() {
		return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
	}
	function resetWorkInProgressStack() {
		if (null !== workInProgress) {
			if (0 === workInProgressSuspendedReason) var interruptedWork = workInProgress.return;
			else interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
			for (; null !== interruptedWork;) unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
			workInProgress = null;
		}
	}
	function prepareFreshStack(root, lanes) {
		var timeoutHandle = root.timeoutHandle;
		-1 !== timeoutHandle && (root.timeoutHandle = -1, cancelTimeout(timeoutHandle));
		timeoutHandle = root.cancelPendingCommit;
		null !== timeoutHandle && (root.cancelPendingCommit = null, timeoutHandle());
		pendingEffectsLanes = 0;
		resetWorkInProgressStack();
		workInProgressRoot = root;
		workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
		workInProgressRootRenderLanes = lanes;
		workInProgressSuspendedReason = 0;
		workInProgressThrownValue = null;
		workInProgressRootDidSkipSuspendedSiblings = false;
		workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		workInProgressRootDidAttachPingListener = false;
		workInProgressSuspendedRetryLanes = (workInProgressDeferredLane = (workInProgressRootPingedLanes = (workInProgressRootInterleavedUpdatedLanes = (workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0, 0), 0), 0), 0);
		workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
		workInProgressRootDidIncludeRecursiveRenderUpdate = false;
		0 !== (lanes & 8) && (lanes |= lanes & 32);
		var allEntangledLanes = root.entangledLanes;
		if (0 !== allEntangledLanes) for (root = root.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes;) {
			var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
			lanes |= root[index$4];
			allEntangledLanes &= ~lane;
		}
		entangledRenderLanes = lanes;
		finishQueueingConcurrentUpdates();
		return timeoutHandle;
	}
	function handleThrow(root, thrownValue) {
		currentlyRenderingFiber = null;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
		workInProgressThrownValue = thrownValue;
		null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current)));
	}
	function shouldRemainOnPreviousScreen() {
		var handler = suspenseHandlerStackCursor.current;
		return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
	}
	function pushDispatcher() {
		var prevDispatcher = ReactSharedInternals.H;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
	}
	function pushAsyncDispatcher() {
		var prevAsyncDispatcher = ReactSharedInternals.A;
		ReactSharedInternals.A = DefaultAsyncDispatcher;
		return prevAsyncDispatcher;
	}
	function renderDidSuspendDelayIfPossible() {
		workInProgressRootExitStatus = 4;
		workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
		0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, false);
	}
	function renderRootSync(root, lanes, shouldYieldForPrerendering) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) workInProgressTransitions = null, prepareFreshStack(root, lanes);
		lanes = false;
		var exitStatus = workInProgressRootExitStatus;
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
					switch (workInProgressSuspendedReason) {
						case 8:
							resetWorkInProgressStack();
							exitStatus = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							null === suspenseHandlerStackCursor.current && (lanes = true);
							var reason = workInProgressSuspendedReason;
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
							if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
								exitStatus = 0;
								break a;
							}
							break;
						default: reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
					}
				}
				workLoopSync();
				exitStatus = workInProgressRootExitStatus;
				break;
			} catch (thrownValue$165) {
				handleThrow(root, thrownValue$165);
			}
		while (1);
		lanes && root.shellSuspendCounter++;
		lastContextDependency = currentlyRenderingFiber$1 = null;
		executionContext = prevExecutionContext;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
		return exitStatus;
	}
	function workLoopSync() {
		for (; null !== workInProgress;) performUnitOfWork(workInProgress);
	}
	function renderRootConcurrent(root, lanes) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					lanes = workInProgress;
					var thrownValue = workInProgressThrownValue;
					b: switch (workInProgressSuspendedReason) {
						case 1:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
							break;
						case 2:
						case 9:
							if (isThenableResolved(thrownValue)) {
								workInProgressSuspendedReason = 0;
								workInProgressThrownValue = null;
								replaySuspendedUnitOfWork(lanes);
								break;
							}
							lanes = function() {
								2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root || (workInProgressSuspendedReason = 7);
								ensureRootIsScheduled(root);
							};
							thrownValue.then(lanes, lanes);
							break a;
						case 3:
							workInProgressSuspendedReason = 7;
							break a;
						case 4:
							workInProgressSuspendedReason = 5;
							break a;
						case 7:
							isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
							break;
						case 5:
							var resource = null;
							switch (workInProgress.tag) {
								case 26: resource = workInProgress.memoizedState;
								case 5:
								case 27:
									var hostFiber = workInProgress;
									if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
										workInProgressSuspendedReason = 0;
										workInProgressThrownValue = null;
										var sibling = hostFiber.sibling;
										if (null !== sibling) workInProgress = sibling;
										else {
											var returnFiber = hostFiber.return;
											null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
										}
										break b;
									}
							}
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
							break;
						case 6:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
							break;
						case 8:
							resetWorkInProgressStack();
							workInProgressRootExitStatus = 6;
							break a;
						default: throw Error(formatProdErrorMessage(462));
					}
				}
				workLoopConcurrentByScheduler();
				break;
			} catch (thrownValue$167) {
				handleThrow(root, thrownValue$167);
			}
		while (1);
		lastContextDependency = currentlyRenderingFiber$1 = null;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		executionContext = prevExecutionContext;
		if (null !== workInProgress) return 0;
		workInProgressRoot = null;
		workInProgressRootRenderLanes = 0;
		finishQueueingConcurrentUpdates();
		return workInProgressRootExitStatus;
	}
	function workLoopConcurrentByScheduler() {
		for (; null !== workInProgress && !shouldYield();) performUnitOfWork(workInProgress);
	}
	function performUnitOfWork(unitOfWork) {
		var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function replaySuspendedUnitOfWork(unitOfWork) {
		var next = unitOfWork;
		var current = next.alternate;
		switch (next.tag) {
			case 15:
			case 0:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type, void 0, workInProgressRootRenderLanes);
				break;
			case 11:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type.render, next.ref, workInProgressRootRenderLanes);
				break;
			case 5: resetHooksOnUnwind(next);
			default: unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
		}
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, suspendedReason) {
		lastContextDependency = currentlyRenderingFiber$1 = null;
		resetHooksOnUnwind(unitOfWork);
		thenableState$1 = null;
		thenableIndexCounter$1 = 0;
		var returnFiber = unitOfWork.return;
		try {
			if (throwException(root, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
				workInProgressRootExitStatus = 1;
				logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
				workInProgress = null;
				return;
			}
		} catch (error) {
			if (null !== returnFiber) throw workInProgress = returnFiber, error;
			workInProgressRootExitStatus = 1;
			logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
			workInProgress = null;
			return;
		}
		if (unitOfWork.flags & 32768) {
			if (isHydrating || 1 === suspendedReason) root = true;
			else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912)) root = false;
			else if (workInProgressRootDidSkipSuspendedSiblings = root = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason) suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
			unwindUnitOfWork(unitOfWork, root);
		} else completeUnitOfWork(unitOfWork);
	}
	function completeUnitOfWork(unitOfWork) {
		var completedWork = unitOfWork;
		do {
			if (0 !== (completedWork.flags & 32768)) {
				unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
				return;
			}
			unitOfWork = completedWork.return;
			var next = completeWork(completedWork.alternate, completedWork, entangledRenderLanes);
			if (null !== next) {
				workInProgress = next;
				return;
			}
			completedWork = completedWork.sibling;
			if (null !== completedWork) {
				workInProgress = completedWork;
				return;
			}
			workInProgress = completedWork = unitOfWork;
		} while (null !== completedWork);
		0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
	}
	function unwindUnitOfWork(unitOfWork, skipSiblings) {
		do {
			var next = unwindWork(unitOfWork.alternate, unitOfWork);
			if (null !== next) {
				next.flags &= 32767;
				workInProgress = next;
				return;
			}
			next = unitOfWork.return;
			null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
			if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
				workInProgress = unitOfWork;
				return;
			}
			workInProgress = unitOfWork = next;
		} while (null !== unitOfWork);
		workInProgressRootExitStatus = 6;
		workInProgress = null;
	}
	function commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
		root.cancelPendingCommit = null;
		do
			flushPendingEffects();
		while (0 !== pendingEffectsStatus);
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		if (null !== finishedWork) {
			if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
			didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
			didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
			markRootFinished(root, lanes, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
			root === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
			pendingFinishedWork = finishedWork;
			pendingEffectsRoot = root;
			pendingEffectsLanes = lanes;
			pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
			pendingRecoverableErrors = recoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root.callbackNode = null, root.callbackPriority = 0, scheduleCallback$1(0, function() {
				flushPassiveEffects();
				return null;
			})) : (root.callbackNode = null, root.callbackPriority = 0);
			recoverableErrors = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
				recoverableErrors = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				transitions = ReactDOMSharedInternals.a;
				ReactDOMSharedInternals.a = 2;
				spawnedLane = executionContext;
				executionContext |= 4;
				try {
					commitBeforeMutationEffects(root, finishedWork);
				} finally {
					executionContext = spawnedLane, ReactDOMSharedInternals.a = transitions, ReactSharedInternals.T = recoverableErrors;
				}
			}
			pendingEffectsStatus = 1;
			flushMutationEffects();
			flushLayoutEffects();
			flushSpawnedWork();
		}
	}
	function flushMutationEffects() {
		if (1 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
				rootMutationHasEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.a;
				ReactDOMSharedInternals.a = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitMutationEffectsOnFiber(finishedWork, root);
					var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
					if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(priorFocusedElem.ownerDocument.documentElement, priorFocusedElem)) {
						if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
							var start = priorSelectionRange.start, end = priorSelectionRange.end;
							void 0 === end && (end = start);
							if ("selectionStart" in priorFocusedElem) priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(end, priorFocusedElem.value.length);
							else {
								var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
								if (win.getSelection) {
									var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
									!selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
									var startMarker = getNodeForCharacterOffset(priorFocusedElem, start$jscomp$0), endMarker = getNodeForCharacterOffset(priorFocusedElem, end$jscomp$0);
									if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
										var range = doc.createRange();
										range.setStart(startMarker.node, startMarker.offset);
										selection.removeAllRanges();
										start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
									}
								}
							}
						}
						doc = [];
						for (selection = priorFocusedElem; selection = selection.parentNode;) 1 === selection.nodeType && doc.push({
							element: selection,
							left: selection.scrollLeft,
							top: selection.scrollTop
						});
						"function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
						for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
							var info = doc[priorFocusedElem];
							info.element.scrollLeft = info.left;
							info.element.scrollTop = info.top;
						}
					}
					_enabled = !!eventsEnabled;
					selectionInformation = eventsEnabled = null;
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.a = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
				}
			}
			root.current = finishedWork;
			pendingEffectsStatus = 2;
		}
	}
	function flushLayoutEffects() {
		if (2 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
			if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
				rootHasLayoutEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.a;
				ReactDOMSharedInternals.a = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork);
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.a = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
				}
			}
			pendingEffectsStatus = 3;
		}
	}
	function flushSpawnedWork() {
		if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			requestPaint();
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root, root.pendingLanes));
			var remainingLanes = root.pendingLanes;
			0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
			lanesToEventPriority(lanes);
			finishedWork = finishedWork.stateNode;
			if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot) try {
				injectedHook.onCommitFiberRoot(rendererID, finishedWork, void 0, 128 === (finishedWork.current.flags & 128));
			} catch {}
			if (null !== recoverableErrors) {
				finishedWork = ReactSharedInternals.T;
				remainingLanes = ReactDOMSharedInternals.a;
				ReactDOMSharedInternals.a = 2;
				ReactSharedInternals.T = null;
				try {
					for (var onRecoverableError = root.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
						var recoverableError = recoverableErrors[i];
						onRecoverableError(recoverableError.value, { componentStack: recoverableError.stack });
					}
				} finally {
					ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.a = remainingLanes;
				}
			}
			0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
			ensureRootIsScheduled(root);
			remainingLanes = root.pendingLanes;
			0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root) : nestedUpdateCount = 0;
			flushSyncWorkAcrossRoots_impl(0);
		}
	}
	function releaseRootPooledCache(root, remainingLanes) {
		0 === (root.pooledCacheLanes &= remainingLanes) && (remainingLanes = root.pooledCache, null != remainingLanes && (root.pooledCache = null, releaseCache(remainingLanes)));
	}
	function flushPendingEffects() {
		flushMutationEffects();
		flushLayoutEffects();
		flushSpawnedWork();
		return flushPassiveEffects();
	}
	function flushPassiveEffects() {
		if (5 !== pendingEffectsStatus) return false;
		var root = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
		pendingEffectsRemainingLanes = 0;
		var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.a;
		try {
			ReactDOMSharedInternals.a = 32 > renderPriority ? 32 : renderPriority;
			ReactSharedInternals.T = null;
			var root$jscomp$0 = pendingEffectsRoot;
			pendingEffectsStatus = 0;
			pendingFinishedWork = pendingEffectsRoot = null;
			pendingEffectsLanes = 0;
			if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
			var prevExecutionContext = executionContext;
			executionContext |= 4;
			commitPassiveUnmountOnFiber(root$jscomp$0.current);
			commitPassiveMountOnFiber(root$jscomp$0, root$jscomp$0.current);
			executionContext = prevExecutionContext;
			flushSyncWorkAcrossRoots_impl(0);
			if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot) try {
				injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
			} catch {}
			return true;
		} finally {
			ReactDOMSharedInternals.a = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root, remainingLanes);
		}
	}
	function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
		sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
		sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
		rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
		null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
	}
	function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
		if (3 === sourceFiber.tag) captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
		else for (; null !== nearestMountedAncestor;) {
			if (3 === nearestMountedAncestor.tag) {
				captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error);
				break;
			} else if (1 === nearestMountedAncestor.tag) {
				var instance = nearestMountedAncestor.stateNode;
				if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
					sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
					error = createClassErrorUpdate(2);
					instance = enqueueUpdate(nearestMountedAncestor, error, 2);
					null !== instance && (initializeClassErrorUpdate(error, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
					break;
				}
			}
			nearestMountedAncestor = nearestMountedAncestor.return;
		}
	}
	function attachPingListener(root, wakeable, lanes) {
		var pingCache = root.pingCache;
		if (null === pingCache) {
			pingCache = root.pingCache = new PossiblyWeakMap();
			var threadIDs = new Set();
			pingCache.set(wakeable, threadIDs);
		} else threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = new Set(), pingCache.set(wakeable, threadIDs));
		threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root = pingSuspendedRoot.bind(0, root, wakeable, lanes), wakeable.then(root, root));
	}
	function pingSuspendedRoot(root, wakeable, pingedLanes) {
		var pingCache = root.pingCache;
		null !== pingCache && pingCache.delete(wakeable);
		root.pingedLanes |= root.suspendedLanes & pingedLanes;
		root.warmLanes &= ~pingedLanes;
		workInProgressRoot === root && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
		ensureRootIsScheduled(root);
	}
	function retryTimedOutBoundary(boundaryFiber, retryLane) {
		0 === retryLane && (retryLane = claimNextRetryLane());
		boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
		null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
	}
	function retryDehydratedSuspenseBoundary(boundaryFiber) {
		var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
		null !== suspenseState && (retryLane = suspenseState.retryLane);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function resolveRetryWakeable(boundaryFiber, wakeable) {
		var retryLane = 0;
		switch (boundaryFiber.tag) {
			case 31:
			case 13:
				var retryCache = boundaryFiber.stateNode;
				var suspenseState = boundaryFiber.memoizedState;
				null !== suspenseState && (retryLane = suspenseState.retryLane);
				break;
			case 19:
				retryCache = boundaryFiber.stateNode;
				break;
			case 22:
				retryCache = boundaryFiber.stateNode._retryCache;
				break;
			default: throw Error(formatProdErrorMessage(314));
		}
		null !== retryCache && retryCache.delete(wakeable);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function scheduleCallback$1(__unused_2146, callback) {
		return scheduleCallback$3(3, callback);
	}
	var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
	function ensureRootIsScheduled(root) {
		root !== lastScheduledRoot && null === root.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root : lastScheduledRoot = lastScheduledRoot.next = root);
		mightHavePendingSyncWork = true;
		didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
	}
	function flushSyncWorkAcrossRoots_impl(syncTransitionLanes) {
		if (!isFlushingWork && mightHavePendingSyncWork) {
			isFlushingWork = true;
			do {
				var didPerformSomeWork = false;
				for (var root$170 = firstScheduledRoot; null !== root$170;) {
					if (0 !== syncTransitionLanes) {
						var pendingLanes = root$170.pendingLanes;
						if (0 === pendingLanes) var JSCompiler_inline_result = 0;
						else {
							var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
							JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
							JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
							JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
						}
						0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
					} else JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(root$170, root$170 === workInProgressRoot ? JSCompiler_inline_result : 0, null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
					root$170 = root$170.next;
				}
			} while (didPerformSomeWork);
			isFlushingWork = false;
		}
	}
	function processRootScheduleInImmediateTask() {
		processRootScheduleInMicrotask();
	}
	function processRootScheduleInMicrotask() {
		mightHavePendingSyncWork = didScheduleMicrotask = false;
		var syncTransitionLanes = 0;
		0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
		for (var currentTime = now(), prev = null, root = firstScheduledRoot; null !== root;) {
			var next = root.next, nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
			if (0 === nextLanes) root.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
			else if (prev = root, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3)) mightHavePendingSyncWork = true;
			root = next;
		}
		0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
		0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
	}
	function scheduleTaskForRootDuringMicrotask(root, currentTime) {
		for (var suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes, expirationTimes = root.expirationTimes, lanes = root.pendingLanes & -62914561; 0 < lanes;) {
			var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
			if (-1 === expirationTime) {
				if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes)) expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
			} else expirationTime <= currentTime && (root.expiredLanes |= lane);
			lanes &= ~lane;
		}
		currentTime = workInProgressRoot;
		suspendedLanes = workInProgressRootRenderLanes;
		suspendedLanes = getNextLanes(root, root === currentTime ? suspendedLanes : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		pingedLanes = root.callbackNode;
		if (0 === suspendedLanes || root === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root.callbackNode = null, root.callbackPriority = 0;
		if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root, suspendedLanes)) {
			currentTime = suspendedLanes & -suspendedLanes;
			if (currentTime === root.callbackPriority) return currentTime;
			null !== pingedLanes && cancelCallback$1(pingedLanes);
			switch (lanesToEventPriority(suspendedLanes)) {
				case 2:
				case 8:
					suspendedLanes = 2;
					break;
				case 32:
					suspendedLanes = 3;
					break;
				case 268435456:
					suspendedLanes = 5;
					break;
				default: suspendedLanes = 3;
			}
			pingedLanes = performWorkOnRootViaSchedulerTask.bind(0, root);
			suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
			root.callbackPriority = currentTime;
			root.callbackNode = suspendedLanes;
			return currentTime;
		}
		null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
		root.callbackPriority = 2;
		root.callbackNode = null;
		return 2;
	}
	function performWorkOnRootViaSchedulerTask(root, didTimeout) {
		if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus) return root.callbackNode = null, root.callbackPriority = 0, null;
		var originalCallbackNode = root.callbackNode;
		if (flushPendingEffects() && root.callbackNode !== originalCallbackNode) return null;
		var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
		workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
		performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
		scheduleTaskForRootDuringMicrotask(root, now());
		return null != root.callbackNode && root.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(0, root) : null;
	}
	function performSyncWorkOnRoot(root, lanes) {
		performWorkOnRoot(root, lanes, true);
	}
	function scheduleImmediateRootScheduleTask() {
		scheduleMicrotask(function() {
			0 !== (executionContext & 6) ? scheduleCallback$3(1, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
		});
	}
	function requestTransitionLane() {
		if (0 === currentEventTransitionLane) {
			var actionScopeLane = currentEntangledLane;
			0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
			currentEventTransitionLane = actionScopeLane;
		}
		return currentEventTransitionLane;
	}
	function coerceFormActionProp(actionProp) {
		return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
	}
	function createFormDataWithSubmitter(form, submitter) {
		var temp = submitter.ownerDocument.createElement("input");
		temp.name = submitter.name;
		temp.value = submitter.value;
		form.id && temp.setAttribute("form", form.id);
		submitter.parentNode.insertBefore(temp, submitter);
		form = new FormData(form);
		temp.parentNode.removeChild(temp);
		return form;
	}
	function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
		if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
			var action = coerceFormActionProp((nativeEventTarget[internalPropsKey] || null).action), submitter = nativeEvent.submitter;
			submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
			var event = new SyntheticEvent("action", "action", null, nativeEvent, nativeEventTarget);
			dispatchQueue.push({
				event,
				listeners: [{
					instance: null,
					listener: function() {
						if (nativeEvent.defaultPrevented) {
							if (0 !== currentEventTransitionLane) {
								var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
								startHostTransition(maybeTargetInst, {
									pending: true,
									data: formData,
									method: nativeEventTarget.method,
									action
								}, null);
							}
						} else "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(maybeTargetInst, {
							pending: true,
							data: formData,
							method: nativeEventTarget.method,
							action
						}, action, formData));
					},
					currentTarget: nativeEventTarget
				}]
			});
		}
	}
	for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
		var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
		registerSimpleEvent(domEventName$jscomp$inline_1579, "on" + capitalizedEvent$jscomp$inline_1580);
	}
	registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
	registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
	registerSimpleEvent(ANIMATION_START, "onAnimationStart");
	registerSimpleEvent("dblclick", "onDoubleClick");
	registerSimpleEvent("focusin", "onFocus");
	registerSimpleEvent("focusout", "onBlur");
	registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
	registerSimpleEvent(TRANSITION_START, "onTransitionStart");
	registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
	registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
	registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
	registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
	registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
	registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
	registerTwoPhaseEvent("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
	registerTwoPhaseEvent("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
	registerTwoPhaseEvent("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]);
	registerTwoPhaseEvent("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), nonDelegatedEvents = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes));
	function processDispatchQueue(dispatchQueue, eventSystemFlags) {
		eventSystemFlags = 0 !== (eventSystemFlags & 4);
		for (var i = 0; i < dispatchQueue.length; i++) {
			var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
			_dispatchQueue$i = _dispatchQueue$i.listeners;
			a: {
				var previousInstance = void 0;
				if (eventSystemFlags) for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
					var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
				else for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
					_dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
					instance = _dispatchListeners$i.instance;
					currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
			}
		}
	}
	function listenToNonDelegatedEvent(domEventName, targetElement) {
		var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
		void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = new Set());
		var listenerSetKey = domEventName + "__bubble";
		JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
	}
	function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
		var eventSystemFlags = 0;
		isCapturePhaseListener && (eventSystemFlags |= 4);
		addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
	}
	var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
	function listenToAllSupportedEvents(rootContainerElement) {
		if (!rootContainerElement[listeningMarker]) {
			rootContainerElement[listeningMarker] = true;
			allNativeEvents.forEach(function(domEventName) {
				"selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
			});
			var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
			null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
		}
	}
	function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
		switch (getEventPriority(domEventName)) {
			case 2:
				var listenerWrapper = dispatchDiscreteEvent;
				break;
			case 8:
				listenerWrapper = dispatchContinuousEvent;
				break;
			default: listenerWrapper = dispatchEvent;
		}
		eventSystemFlags = listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
		listenerWrapper = void 0;
		!passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
		isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
			capture: true,
			passive: listenerWrapper
		}) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, { passive: listenerWrapper }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
	}
	function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
		var ancestorInst = targetInst$jscomp$0;
		if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0) a: for (;;) {
			if (null === targetInst$jscomp$0) return;
			var nodeTag = targetInst$jscomp$0.tag;
			if (3 === nodeTag || 4 === nodeTag) {
				var container = targetInst$jscomp$0.stateNode.containerInfo;
				if (container === targetContainer) break;
				if (4 === nodeTag) for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag;) {
					var grandTag = nodeTag.tag;
					if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer) return;
					nodeTag = nodeTag.return;
				}
				for (; null !== container;) {
					nodeTag = getClosestInstanceFromNode(container);
					if (null === nodeTag) return;
					grandTag = nodeTag.tag;
					if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
						targetInst$jscomp$0 = ancestorInst = nodeTag;
						continue a;
					}
					container = container.parentNode;
				}
			}
			targetInst$jscomp$0 = targetInst$jscomp$0.return;
		}
		batchedUpdates$1(function() {
			var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
			a: {
				var reactName = topLevelEventsToReactNames.get(domEventName);
				if (void 0 !== reactName) {
					var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
					switch (domEventName) {
						case "keypress": if (0 === getEventCharCode(nativeEvent)) break a;
						case "keydown":
						case "keyup":
							SyntheticEventCtor = SyntheticKeyboardEvent;
							break;
						case "focusin":
							reactEventType = "focus";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "focusout":
							reactEventType = "blur";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "beforeblur":
						case "afterblur":
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "click": if (2 === nativeEvent.button) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							SyntheticEventCtor = SyntheticMouseEvent;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							SyntheticEventCtor = SyntheticDragEvent;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							SyntheticEventCtor = SyntheticTouchEvent;
							break;
						case ANIMATION_END:
						case ANIMATION_ITERATION:
						case ANIMATION_START:
							SyntheticEventCtor = SyntheticAnimationEvent;
							break;
						case TRANSITION_END:
							SyntheticEventCtor = SyntheticTransitionEvent;
							break;
						case "scroll":
						case "scrollend":
							SyntheticEventCtor = SyntheticUIEvent;
							break;
						case "wheel":
							SyntheticEventCtor = SyntheticWheelEvent;
							break;
						case "copy":
						case "cut":
						case "paste":
							SyntheticEventCtor = SyntheticClipboardEvent;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							SyntheticEventCtor = SyntheticPointerEvent;
							break;
						case "toggle":
						case "beforetoggle": SyntheticEventCtor = SyntheticToggleEvent;
					}
					var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
					inCapturePhase = [];
					for (var instance = targetInst, lastHostComponent; null !== instance;) {
						var _instance = instance;
						lastHostComponent = _instance.stateNode;
						_instance = _instance.tag;
						5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(createDispatchListener(instance, _instance, lastHostComponent)));
						if (accumulateTargetOnly) break;
						instance = instance.return;
					}
					0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
						event: reactName,
						listeners: inCapturePhase
					}));
				}
			}
			if (0 === (eventSystemFlags & 7)) {
				a: {
					reactName = "mouseover" === domEventName || "pointerover" === domEventName;
					SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
					if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey])) break a;
					if (SyntheticEventCtor || reactName) {
						reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
						if (SyntheticEventCtor) {
							if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase)) reactEventType = null;
						} else SyntheticEventCtor = null, reactEventType = targetInst;
						if (SyntheticEventCtor !== reactEventType) {
							inCapturePhase = SyntheticMouseEvent;
							_instance = "onMouseLeave";
							reactEventName = "onMouseEnter";
							instance = "mouse";
							if ("pointerout" === domEventName || "pointerover" === domEventName) inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
							accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
							lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
							reactName = new inCapturePhase(_instance, instance + "leave", SyntheticEventCtor, nativeEvent, nativeEventTarget);
							reactName.target = accumulateTargetOnly;
							reactName.relatedTarget = lastHostComponent;
							_instance = null;
							getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(reactEventName, instance + "enter", reactEventType, nativeEvent, nativeEventTarget), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
							accumulateTargetOnly = _instance;
							if (SyntheticEventCtor && reactEventType) b: {
								inCapturePhase = getParent;
								reactEventName = SyntheticEventCtor;
								instance = reactEventType;
								lastHostComponent = 0;
								for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance)) lastHostComponent++;
								_instance = 0;
								for (var tempB = instance; tempB; tempB = inCapturePhase(tempB)) _instance++;
								for (; 0 < lastHostComponent - _instance;) reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
								for (; 0 < _instance - lastHostComponent;) instance = inCapturePhase(instance), _instance--;
								for (; lastHostComponent--;) {
									if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
										inCapturePhase = reactEventName;
										break b;
									}
									reactEventName = inCapturePhase(reactEventName);
									instance = inCapturePhase(instance);
								}
								inCapturePhase = null;
							}
							else inCapturePhase = null;
							null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(dispatchQueue, reactName, SyntheticEventCtor, inCapturePhase, false);
							null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(dispatchQueue, accumulateTargetOnly, reactEventType, inCapturePhase, true);
						}
					}
				}
				a: {
					reactName = targetInst ? getNodeFromInstance(targetInst) : window;
					SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
					if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type) var getTargetInstFunc = getTargetInstForChangeEvent;
					else if (isTextInputElement(reactName)) if (isInputEventSupported) getTargetInstFunc = getTargetInstForInputOrChangeEvent;
					else {
						getTargetInstFunc = getTargetInstForInputEventPolyfill;
						var handleEventFunc = handleEventsForInputEventPolyfill;
					}
					else SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
					if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
						createAndAccumulateChangeEvent(dispatchQueue, getTargetInstFunc, nativeEvent, nativeEventTarget);
						break a;
					}
					handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
					"focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
				}
				handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
				switch (domEventName) {
					case "focusin":
						if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable) activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
						break;
					case "focusout":
						lastSelection = (activeElementInst = activeElement = null, null);
						break;
					case "mousedown":
						mouseDown = true;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						mouseDown = false;
						constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
						break;
					case "selectionchange": if (skipSelectionChangeEvent) break;
					case "keydown":
					case "keyup": constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
				}
				var fallbackData;
				if (canUseCompositionEvent) b: {
					switch (domEventName) {
						case "compositionstart":
							var eventType = "onCompositionStart";
							break b;
						case "compositionend":
							eventType = "onCompositionEnd";
							break b;
						case "compositionupdate":
							eventType = "onCompositionUpdate";
							break b;
					}
					eventType = void 0;
				}
				else isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
				eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: eventType,
					listeners: handleEventFunc
				}), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
				if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent)) eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: handleEventFunc,
					listeners: eventType
				}), handleEventFunc.data = fallbackData);
				extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
			}
			processDispatchQueue(dispatchQueue, eventSystemFlags);
		});
	}
	function createDispatchListener(instance, listener, currentTarget) {
		return {
			instance,
			listener,
			currentTarget
		};
	}
	function accumulateTwoPhaseListeners(targetFiber, reactName) {
		for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber;) {
			var _instance2 = targetFiber, stateNode = _instance2.stateNode;
			_instance2 = _instance2.tag;
			5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(createDispatchListener(targetFiber, _instance2, stateNode)), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(createDispatchListener(targetFiber, _instance2, stateNode)));
			if (3 === targetFiber.tag) return listeners;
			targetFiber = targetFiber.return;
		}
		return [];
	}
	function getParent(inst) {
		if (null === inst) return null;
		do
			inst = inst.return;
		while (inst && 5 !== inst.tag && 27 !== inst.tag);
		return inst ? inst : null;
	}
	function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
		for (var registrationName = event._reactName, listeners = []; null !== target && target !== common;) {
			var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
			_instance3 = _instance3.tag;
			if (null !== alternate && alternate === common) break;
			5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(createDispatchListener(target, stateNode, alternate))) : (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(createDispatchListener(target, stateNode, alternate))));
			target = target.return;
		}
		0 !== listeners.length && dispatchQueue.push({
			event,
			listeners
		});
	}
	var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
	function normalizeMarkupForTextOrAttribute(markup) {
		return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
	}
	function checkForUnmatchedText(serverText, clientText) {
		clientText = normalizeMarkupForTextOrAttribute(clientText);
		return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
	}
	function setProp(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "children":
				"string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
				break;
			case "className":
				setValueForKnownAttribute(domElement, "class", value);
				break;
			case "tabIndex":
				setValueForKnownAttribute(domElement, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				setValueForKnownAttribute(domElement, key, value);
				break;
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "data": if ("object" !== tag) {
				setValueForKnownAttribute(domElement, "data", value);
				break;
			}
			case "src":
			case "href":
				if ("" === value && ("a" !== tag || "href" !== key)) {
					domElement.removeAttribute(key);
					break;
				}
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "action":
			case "formAction":
				if ("function" === typeof value) {
					domElement.setAttribute(key, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, 0, "name", props.name), setProp(domElement, 0, "formEncType", props.formEncType), setProp(domElement, 0, "formMethod", props.formMethod), setProp(domElement, 0, "formTarget", props.formTarget)) : (setProp(domElement, 0, "encType", props.encType), setProp(domElement, 0, "method", props.method), setProp(domElement, 0, "target", props.target)));
				if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "multiple":
				domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "muted":
				domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
					domElement.removeAttribute("xlink:href");
					break;
				}
				key = sanitizeURL("" + value);
				domElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", key);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
				break;
			case "capture":
			case "download":
				true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "rowSpan":
			case "start":
				null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
				break;
			case "popover":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				setValueForAttribute(domElement, "popover", value);
				break;
			case "xlinkActuate":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:arcrole", value);
				break;
			case "xlinkRole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:role", value);
				break;
			case "xlinkShow":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:show", value);
				break;
			case "xlinkTitle":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:title", value);
				break;
			case "xlinkType":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:type", value);
				break;
			case "xmlBase":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:base", value);
				break;
			case "xmlLang":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:lang", value);
				break;
			case "xmlSpace":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:space", value);
				break;
			case "is":
				setValueForAttribute(domElement, "is", value);
				break;
			case "innerText":
			case "textContent": break;
			default: if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1]) key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
		}
	}
	function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "children":
				"string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!registrationNameDependencies.hasOwnProperty(key)) a: {
				if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
					"function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
					domElement.addEventListener(tag, value, props);
					break a;
				}
				key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
			}
		}
	}
	function setInitialProperties(domElement, tag, props) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				var hasSrc = false, hasSrcSet = false, propKey;
				for (propKey in props) if (props.hasOwnProperty(propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "src":
							hasSrc = true;
							break;
						case "srcSet":
							hasSrcSet = true;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
						default: setProp(domElement, tag, propKey, propValue, props, null);
					}
				}
				hasSrcSet && setProp(domElement, 0, "srcSet", props.srcSet);
				hasSrc && setProp(domElement, tag, "src", props.src);
				return;
			case "input":
				listenToNonDelegatedEvent("invalid", domElement);
				var defaultValue = (propKey = (propValue = hasSrcSet = null, null), null), checked = null, defaultChecked = null;
				for (hasSrc in props) if (props.hasOwnProperty(hasSrc)) {
					var propValue$184 = props[hasSrc];
					if (null != propValue$184) switch (hasSrc) {
						case "name":
							hasSrcSet = propValue$184;
							break;
						case "type":
							propValue = propValue$184;
							break;
						case "checked":
							checked = propValue$184;
							break;
						case "defaultChecked":
							defaultChecked = propValue$184;
							break;
						case "value":
							propKey = propValue$184;
							break;
						case "defaultValue":
							defaultValue = propValue$184;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propValue$184) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: setProp(domElement, tag, hasSrc, propValue$184, props, null);
					}
				}
				initInput(domElement, propKey, defaultValue, checked, defaultChecked, propValue, hasSrcSet, false);
				return;
			case "select":
				listenToNonDelegatedEvent("invalid", domElement);
				hasSrc = (propValue = propKey = null, null);
				for (hasSrcSet in props) if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue)) switch (hasSrcSet) {
					case "value":
						propKey = defaultValue;
						break;
					case "defaultValue":
						propValue = defaultValue;
						break;
					case "multiple": hasSrc = defaultValue;
					default: setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
				}
				tag = propKey;
				props = propValue;
				domElement.multiple = !!hasSrc;
				null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
				return;
			case "textarea":
				listenToNonDelegatedEvent("invalid", domElement);
				propKey = (hasSrcSet = hasSrc = null, null);
				for (propValue in props) if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue)) switch (propValue) {
					case "value":
						hasSrc = defaultValue;
						break;
					case "defaultValue":
						hasSrcSet = defaultValue;
						break;
					case "children":
						propKey = defaultValue;
						break;
					case "dangerouslySetInnerHTML":
						if (null != defaultValue) throw Error(formatProdErrorMessage(91));
						break;
					default: setProp(domElement, tag, propValue, defaultValue, props, null);
				}
				initTextarea(domElement, hasSrc, hasSrcSet, propKey);
				return;
			case "option":
				for (checked in props) if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc)) switch (checked) {
					case "selected":
						domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
						break;
					default: setProp(domElement, tag, checked, hasSrc, props, null);
				}
				return;
			case "dialog":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				listenToNonDelegatedEvent("cancel", domElement);
				listenToNonDelegatedEvent("close", domElement);
				break;
			case "iframe":
			case "object":
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "video":
			case "audio":
				for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++) listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
				break;
			case "image":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", domElement);
				break;
			case "embed":
			case "source":
			case "link": listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (defaultChecked in props) if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc)) switch (defaultChecked) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
					default: setProp(domElement, tag, defaultChecked, hasSrc, props, null);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (propValue$184 in props) props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(domElement, tag, propValue$184, hasSrc, props, void 0));
				return;
			}
		}
		for (defaultValue in props) props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
	}
	function updateProperties(domElement, tag, lastProps, nextProps) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
				for (propKey in lastProps) {
					var lastProp = lastProps[propKey];
					if (lastProps.hasOwnProperty(propKey) && null != lastProp) switch (propKey) {
						case "checked": break;
						case "value": break;
						case "defaultValue": lastDefaultValue = lastProp;
						default: nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
					}
				}
				for (var propKey$201 in nextProps) {
					var propKey = nextProps[propKey$201];
					lastProp = lastProps[propKey$201];
					if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp)) switch (propKey$201) {
						case "type":
							type = propKey;
							break;
						case "name":
							name = propKey;
							break;
						case "checked":
							checked = propKey;
							break;
						case "defaultChecked":
							defaultChecked = propKey;
							break;
						case "value":
							value = propKey;
							break;
						case "defaultValue":
							defaultValue = propKey;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propKey) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: propKey !== lastProp && setProp(domElement, tag, propKey$201, propKey, nextProps, lastProp);
					}
				}
				updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
				return;
			case "select":
				propKey = (value = (defaultValue = propKey$201 = null, null), null);
				for (type in lastProps) if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue) switch (type) {
					case "value": break;
					case "multiple": propKey = lastDefaultValue;
					default: nextProps.hasOwnProperty(type) || setProp(domElement, tag, type, null, nextProps, lastDefaultValue);
				}
				for (name in nextProps) if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue)) switch (name) {
					case "value":
						propKey$201 = type;
						break;
					case "defaultValue":
						defaultValue = type;
						break;
					case "multiple": value = type;
					default: type !== lastDefaultValue && setProp(domElement, tag, name, type, nextProps, lastDefaultValue);
				}
				tag = defaultValue;
				lastProps = value;
				nextProps = propKey;
				null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
				return;
			case "textarea":
				propKey = propKey$201 = null;
				for (defaultValue in lastProps) if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue)) switch (defaultValue) {
					case "value": break;
					case "children": break;
					default: setProp(domElement, tag, defaultValue, null, nextProps, name);
				}
				for (value in nextProps) if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type)) switch (value) {
					case "value":
						propKey$201 = name;
						break;
					case "defaultValue":
						propKey = name;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (null != name) throw Error(formatProdErrorMessage(91));
						break;
					default: name !== type && setProp(domElement, tag, value, name, nextProps, type);
				}
				updateTextarea(domElement, propKey$201, propKey);
				return;
			case "option":
				for (var propKey$217 in lastProps) if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217)) switch (propKey$217) {
					case "selected":
						domElement.selected = false;
						break;
					default: setProp(domElement, tag, propKey$217, null, nextProps, propKey$201);
				}
				for (lastDefaultValue in nextProps) if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey)) switch (lastDefaultValue) {
					case "selected":
						domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
						break;
					default: setProp(domElement, tag, lastDefaultValue, propKey$201, nextProps, propKey);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var propKey$222 in lastProps) propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
				for (checked in nextProps) if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey)) switch (checked) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (null != propKey$201) throw Error(formatProdErrorMessage(137, tag));
						break;
					default: setProp(domElement, tag, checked, propKey$201, nextProps, propKey);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (var propKey$227 in lastProps) propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(domElement, tag, propKey$227, void 0, nextProps, propKey$201);
				for (defaultChecked in nextProps) propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(domElement, tag, defaultChecked, propKey$201, nextProps, propKey);
				return;
			}
		}
		for (var propKey$232 in lastProps) propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
		for (lastProp in nextProps) propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
	}
	function isLikelyStaticResource(initiatorType) {
		switch (initiatorType) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return true;
			default: return false;
		}
	}
	function estimateBandwidth() {
		if ("function" === typeof performance.getEntriesByType) {
			for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
				var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
				if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
					initiatorType = 0;
					duration = entry.responseEnd;
					for (i += 1; i < resourceEntries.length; i++) {
						var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
						if (overlapStartTime > duration) break;
						var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
						overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
					}
					--i;
					bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
					count++;
					if (10 < count) break;
				}
			}
			if (0 < count) return bits / count / 1e6;
		}
		return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
	}
	var eventsEnabled = null, selectionInformation = null;
	function getOwnerDocumentFromRootContainer(rootContainerElement) {
		return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
	}
	function getOwnHostContext(namespaceURI) {
		switch (namespaceURI) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function getChildHostContextProd(parentNamespace, type) {
		if (0 === parentNamespace) switch (type) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
	}
	function shouldSetTextContent(type, props) {
		return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
	}
	var currentPopstateTransitionEvent = null;
	function shouldAttemptEagerTransition() {
		var event = window.event;
		if (event && "popstate" === event.type) {
			if (event === currentPopstateTransitionEvent) return false;
			currentPopstateTransitionEvent = event;
			return true;
		}
		currentPopstateTransitionEvent = null;
		return false;
	}
	var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : scheduleTimeout;
	function isSingletonScope(type) {
		return "head" === type;
	}
	function clearHydrationBoundary(parentInstance, hydrationInstance) {
		var node = hydrationInstance, depth = 0;
		do {
			var nextNode = node.nextSibling;
			parentInstance.removeChild(node);
			if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node || "/&" === node) {
				if (0 === depth) {
					parentInstance.removeChild(nextNode);
					retryIfBlockedOn(hydrationInstance);
					return;
				}
				depth--;
			} else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node) depth++;
			else if ("html" === node) releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
			else if ("head" === node) {
				node = parentInstance.ownerDocument.head;
				releaseSingletonInstance(node);
				for (var node$jscomp$0 = node.firstChild; node$jscomp$0;) {
					var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
					node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
					node$jscomp$0 = nextNode$jscomp$0;
				}
			} else "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
			node = nextNode;
		} while (node);
		retryIfBlockedOn(hydrationInstance);
	}
	function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
		var node = suspenseInstance;
		suspenseInstance = 0;
		do {
			var nextNode = node.nextSibling;
			1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
			if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node) if (0 === suspenseInstance) break;
			else suspenseInstance--;
			else "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
			node = nextNode;
		} while (node);
	}
	function clearContainerSparingly(container) {
		var nextNode = container.firstChild;
		nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
		for (; nextNode;) {
			var node = nextNode;
			nextNode = nextNode.nextSibling;
			switch (node.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					clearContainerSparingly(node);
					detachDeletedInstance(node);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if ("stylesheet" === node.rel.toLowerCase()) continue;
			}
			container.removeChild(node);
		}
	}
	function canHydrateInstance(instance, type, props, inRootOrSingleton) {
		for (; 1 === instance.nodeType;) {
			var anyProps = props;
			if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
				if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type)) break;
			} else if (!inRootOrSingleton) if ("input" === type && "hidden" === instance.type) {
				var name = null == anyProps.name ? null : "" + anyProps.name;
				if ("hidden" === anyProps.type && instance.getAttribute("name") === name) return instance;
			} else return instance;
			else if (!instance[internalHoistableMarker]) switch (type) {
				case "meta":
					if (!instance.hasAttribute("itemprop")) break;
					return instance;
				case "link":
					name = instance.getAttribute("rel");
					if ("stylesheet" === name && instance.hasAttribute("data-precedence")) break;
					else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title)) break;
					return instance;
				case "style":
					if (instance.hasAttribute("data-precedence")) break;
					return instance;
				case "script":
					name = instance.getAttribute("src");
					if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop")) break;
					return instance;
				default: return instance;
			}
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) break;
		}
		return null;
	}
	function canHydrateTextInstance(instance, text, inRootOrSingleton) {
		if ("" === text) return null;
		for (; 3 !== instance.nodeType;) {
			if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) return null;
		}
		return instance;
	}
	function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
		for (; 8 !== instance.nodeType;) {
			if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) return null;
		}
		return instance;
	}
	function isSuspenseInstancePending(instance) {
		return "$?" === instance.data || "$~" === instance.data;
	}
	function isSuspenseInstanceFallback(instance) {
		return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
	}
	function registerSuspenseInstanceRetry(instance, callback) {
		var ownerDocument = instance.ownerDocument;
		if ("$~" === instance.data) instance._reactRetry = callback;
		else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState) callback();
		else {
			var listener = function() {
				callback();
				ownerDocument.removeEventListener("DOMContentLoaded", listener);
			};
			ownerDocument.addEventListener("DOMContentLoaded", listener);
			instance._reactRetry = listener;
		}
	}
	function getNextHydratable(node) {
		for (; null != node; node = node.nextSibling) {
			var nodeType = node.nodeType;
			if (1 === nodeType || 3 === nodeType) break;
			if (8 === nodeType) {
				nodeType = node.data;
				if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType) break;
				if ("/$" === nodeType || "/&" === nodeType) return null;
			}
		}
		return node;
	}
	var previousHydratableOnEnteringScopedSingleton = null;
	function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
		hydrationInstance = hydrationInstance.nextSibling;
		for (var depth = 0; hydrationInstance;) {
			if (8 === hydrationInstance.nodeType) {
				var data = hydrationInstance.data;
				if ("/$" === data || "/&" === data) {
					if (0 === depth) return getNextHydratable(hydrationInstance.nextSibling);
					depth--;
				} else "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
			}
			hydrationInstance = hydrationInstance.nextSibling;
		}
		return null;
	}
	function getParentHydrationBoundary(targetInstance) {
		targetInstance = targetInstance.previousSibling;
		for (var depth = 0; targetInstance;) {
			if (8 === targetInstance.nodeType) {
				var data = targetInstance.data;
				if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
					if (0 === depth) return targetInstance;
					depth--;
				} else "/$" !== data && "/&" !== data || depth++;
			}
			targetInstance = targetInstance.previousSibling;
		}
		return null;
	}
	function resolveSingletonInstance(type, props, rootContainerInstance) {
		props = getOwnerDocumentFromRootContainer(rootContainerInstance);
		switch (type) {
			case "html":
				type = props.documentElement;
				if (!type) throw Error(formatProdErrorMessage(452));
				return type;
			case "head":
				type = props.head;
				if (!type) throw Error(formatProdErrorMessage(453));
				return type;
			case "body":
				type = props.body;
				if (!type) throw Error(formatProdErrorMessage(454));
				return type;
			default: throw Error(formatProdErrorMessage(451));
		}
	}
	function releaseSingletonInstance(instance) {
		for (var attributes = instance.attributes; attributes.length;) instance.removeAttributeNode(attributes[0]);
		detachDeletedInstance(instance);
	}
	var preloadPropsMap = new Map(), __unused_5B68 = new Set();
	function getHoistableRoot(container) {
		return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
	}
	function getResource(type, currentProps, pendingProps, currentResource) {
		var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
		if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
		switch (type) {
			case "meta":
			case "title": return null;
			case "style": return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
					type = getStyleKey(pendingProps.href);
					var styles$243 = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, resource$244 = styles$243.get(type);
					resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(getStylesheetSelectorFromKey(type))) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
						rel: "preload",
						as: "style",
						href: pendingProps.href,
						crossOrigin: pendingProps.crossOrigin,
						integrity: pendingProps.integrity,
						media: pendingProps.media,
						hrefLang: pendingProps.hrefLang,
						referrerPolicy: pendingProps.referrerPolicy
					}, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(JSCompiler_inline_result, type, pendingProps, resource$244.state)));
					if (currentProps && null === currentResource) throw Error(formatProdErrorMessage(528, ""));
					return resource$244;
				}
				if (currentProps && null !== currentResource) throw Error(formatProdErrorMessage(529, ""));
				return null;
			case "script": return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(formatProdErrorMessage(444, type));
		}
	}
	function getStyleKey(href) {
		return "href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"";
	}
	function getStylesheetSelectorFromKey(key) {
		return "link[rel=\"stylesheet\"][" + key + "]";
	}
	function stylesheetPropsFromRawProps(rawProps) {
		return assign({}, rawProps, {
			"data-precedence": rawProps.precedence,
			precedence: null
		});
	}
	function preloadStylesheet(ownerDocument, key, preloadProps, state) {
		ownerDocument.querySelector("link[rel=\"preload\"][as=\"style\"][" + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
			return state.loading |= 1;
		}), key.addEventListener("error", function() {
			return state.loading |= 2;
		}), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
	}
	function getScriptKey(src) {
		return "[src=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(src) + "\"]";
	}
	function getScriptSelectorFromKey(key) {
		return "script[async]" + key;
	}
	function acquireResource(hoistableRoot, resource, props) {
		resource.count++;
		if (null === resource.instance) switch (resource.type) {
			case "style":
				var instance = hoistableRoot.querySelector("style[data-href~=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + "\"]");
				if (instance) return resource.instance = instance, markNodeAsHoistable(instance), instance;
				var styleProps = assign({}, props, {
					"data-href": props.href,
					"data-precedence": props.precedence,
					href: null,
					precedence: null
				});
				instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement("style");
				markNodeAsHoistable(instance);
				setInitialProperties(instance, "style", styleProps);
				insertStylesheet(instance, props.precedence, hoistableRoot);
				return resource.instance = instance;
			case "stylesheet":
				styleProps = getStyleKey(props.href);
				var instance$249 = hoistableRoot.querySelector(getStylesheetSelectorFromKey(styleProps));
				if (instance$249) return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
				instance = stylesheetPropsFromRawProps(props);
				(styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
				instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
				markNodeAsHoistable(instance$249);
				var linkInstance = instance$249;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance$249, "link", instance);
				resource.state.loading |= 4;
				insertStylesheet(instance$249, props.precedence, hoistableRoot);
				return resource.instance = instance$249;
			case "script":
				instance$249 = getScriptKey(props.src);
				if (styleProps = hoistableRoot.querySelector(getScriptSelectorFromKey(instance$249))) return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
				instance = props;
				if (styleProps = preloadPropsMap.get(instance$249)) instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
				hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
				styleProps = hoistableRoot.createElement("script");
				markNodeAsHoistable(styleProps);
				setInitialProperties(styleProps, "link", instance);
				hoistableRoot.head.appendChild(styleProps);
				return resource.instance = styleProps;
			case "void": return null;
			default: throw Error(formatProdErrorMessage(443, resource.type));
		}
		else "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
		return resource.instance;
	}
	function insertStylesheet(instance, precedence, root) {
		for (var nodes = root.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.dataset.precedence === precedence) prior = node;
			else if (prior !== last) break;
		}
		prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root.nodeType ? root.head : root, precedence.insertBefore(instance, precedence.firstChild));
	}
	function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
		null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
		null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
		null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
	}
	function adoptPreloadPropsForScript(scriptProps, preloadProps) {
		null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
		null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
		null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
	}
	var tagCaches = null;
	function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
		if (null === tagCaches) {
			var cache = new Map();
			var caches = tagCaches = new Map();
			caches.set(ownerDocument, cache);
		} else caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = new Map(), caches.set(ownerDocument, cache));
		if (cache.has(type)) return cache;
		cache.set(type, null);
		ownerDocument = ownerDocument.getElementsByTagName(type);
		for (caches = 0; caches < ownerDocument.length; caches++) {
			var node = ownerDocument[caches];
			if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
				var nodeKey = node.getAttribute(keyAttribute) || "";
				nodeKey = type + nodeKey;
				var existing = cache.get(nodeKey);
				existing ? existing.push(node) : cache.set(nodeKey, [node]);
			}
		}
		return cache;
	}
	function mountHoistable(hoistableRoot, type, instance) {
		hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
		hoistableRoot.head.insertBefore(instance, "title" === type ? hoistableRoot.querySelector("head > title") : null);
	}
	function isHostHoistableType(type, props, hostContext) {
		if (1 === hostContext || null != props.itemProp) return false;
		switch (type) {
			case "meta":
			case "title": return true;
			case "style":
				if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href) break;
				return true;
			case "link":
				if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError) break;
				switch (props.rel) {
					case "stylesheet": return type = props.disabled, "string" === typeof props.precedence && null == type;
					default: return true;
				}
			case "script": if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src) return true;
		}
		return false;
	}
	function preloadResource(resource) {
		return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
	}
	function suspendResource(state, hoistableRoot, resource, props) {
		if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
			if (null === resource.instance) {
				var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));
				if (instance) {
					hoistableRoot = instance._p;
					null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
					resource.state.loading |= 4;
					resource.instance = instance;
					markNodeAsHoistable(instance);
					return;
				}
				instance = hoistableRoot.ownerDocument || hoistableRoot;
				props = stylesheetPropsFromRawProps(props);
				(key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
				instance = instance.createElement("link");
				markNodeAsHoistable(instance);
				var linkInstance = instance;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance, "link", props);
				resource.instance = instance;
			}
			null === state.stylesheets && (state.stylesheets = new Map());
			state.stylesheets.set(resource, hoistableRoot);
			(hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
		}
	}
	var estimatedBytesWithinLimit = 0;
	function waitForCommitToBeReady(state, timeoutOffset) {
		state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
		return 0 < state.count || 0 < state.imgCount ? function(commit) {
			var stylesheetTimer = setTimeout(function() {
				state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
				if (state.unsuspend) {
					var unsuspend = state.unsuspend;
					state.unsuspend = null;
					unsuspend();
				}
			}, 6e4 + timeoutOffset);
			0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
			var imgTimer = setTimeout(function() {
				state.waitingForImages = false;
				if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
					var unsuspend = state.unsuspend;
					state.unsuspend = null;
					unsuspend();
				}
			}, (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset);
			state.unsuspend = commit;
			return function() {
				state.unsuspend = null;
				clearTimeout(stylesheetTimer);
				clearTimeout(imgTimer);
			};
		} : null;
	}
	function onUnsuspend() {
		this.count--;
		if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
			if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
			else if (this.unsuspend) {
				var unsuspend = this.unsuspend;
				this.unsuspend = null;
				unsuspend();
			}
		}
	}
	var precedencesByRoot = null;
	function insertSuspendedStylesheets(state, resources) {
		state.stylesheets = null;
		null !== state.unsuspend && (state.count++, precedencesByRoot = new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
	}
	function insertStylesheetIntoRoot(root, resource) {
		if (!(resource.state.loading & 4)) {
			var precedences = precedencesByRoot.get(root);
			if (precedences) var last = precedences.get(null);
			else {
				precedences = new Map();
				precedencesByRoot.set(root, precedences);
				for (var nodes = root.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media")) precedences.set(node.dataset.precedence, node), last = node;
				}
				last && precedences.set(null, last);
			}
			nodes = resource.instance;
			node = nodes.getAttribute("data-precedence");
			i = precedences.get(node) || last;
			i === last && precedences.set(null, nodes);
			precedences.set(node, nodes);
			this.count++;
			last = onUnsuspend.bind(this);
			nodes.addEventListener("load", last);
			nodes.addEventListener("error", last);
			i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root = 9 === root.nodeType ? root.head : root, root.insertBefore(nodes, root.firstChild));
			resource.state.loading |= 4;
		}
	}
	var HostTransitionContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Provider: null,
		Consumer: null,
		_currentValue: sharedNotPendingObject,
		_currentValue2: sharedNotPendingObject,
		_threadCount: 0
	};
	function FiberRootNode(containerInfo, __unused_FCC2, __unused_659A, __unused_0B9F, onUncaughtError, onCaughtError, onRecoverableError) {
		this.tag = 1;
		this.containerInfo = containerInfo;
		this.pingCache = this.pendingChildren = null;
		this.timeoutHandle = -1;
		this.callbackNode = (this.next = (this.pendingContext = (this.context = this.cancelPendingCommit = null, null), null), null);
		this.callbackPriority = 0;
		this.expirationTimes = createLaneMap(-1);
		this.entangledLanes = (this.shellSuspendCounter = (this.errorRecoveryDisabledLanes = (this.expiredLanes = (this.warmLanes = (this.pingedLanes = (this.suspendedLanes = this.pendingLanes = 0, 0), 0), 0), 0), 0), 0);
		this.entanglements = createLaneMap(0);
		this.hiddenUpdates = createLaneMap(null);
		this.identifierPrefix = "";
		this.onUncaughtError = onUncaughtError;
		this.onCaughtError = onCaughtError;
		this.onRecoverableError = onRecoverableError;
		this.pooledCacheLanes = 0;
		this.formState = null;
		this.incompleteTransitions = new Map();
	}
	function createFiberRoot(containerInfo, tag, __unused_659A_0, __unused_947B, __unused_796C, isStrictMode, __unused_0B9F_0, __unused_EFCE, onUncaughtError, onCaughtError, onRecoverableError) {
		containerInfo = new FiberRootNode(containerInfo, 0, 0, 0, onUncaughtError, onCaughtError, onRecoverableError);
		isStrictMode = createFiberImplClass(3, null, null, 1);
		containerInfo.current = isStrictMode;
		isStrictMode.stateNode = containerInfo;
		tag = createCache();
		tag.refCount++;
		containerInfo.pooledCache = tag;
		tag.refCount++;
		isStrictMode.memoizedState = {
			element: null,
			isDehydrated: false,
			cache: tag
		};
		initializeUpdateQueue(isStrictMode);
		return containerInfo;
	}
	function getContextForSubtree() {
		{
			return emptyContextObject;
		}
	}
	function updateContainerImpl(rootFiber, lane, element, container, parentComponent) {
		parentComponent = getContextForSubtree();
		null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
		container = createUpdate(lane);
		container.payload = { element };
		element = enqueueUpdate(rootFiber, container, lane);
		null !== element && (scheduleUpdateOnFiber(element, 0, lane), entangleTransitions(element, rootFiber, lane));
	}
	function markRetryLaneImpl(fiber, retryLane) {
		fiber = fiber.memoizedState;
		if (null !== fiber && null !== fiber.dehydrated) {
			var a = fiber.retryLane;
			fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
		}
	}
	function markRetryLaneIfNotHydrated(fiber, retryLane) {
		markRetryLaneImpl(fiber, retryLane);
		(fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
	}
	function attemptContinuousHydration(fiber) {
		if (13 === fiber.tag || 31 === fiber.tag) {
			var root = enqueueConcurrentRenderForLane(fiber, 67108864);
			null !== root && scheduleUpdateOnFiber(root, 0, 67108864);
			markRetryLaneIfNotHydrated(fiber, 67108864);
		}
	}
	var _enabled = true;
	function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.a;
		try {
			ReactDOMSharedInternals.a = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.a = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.a;
		try {
			ReactDOMSharedInternals.a = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.a = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (_enabled) {
			var blockedOn = findInstanceBlockingEvent(nativeEvent);
			if (null === blockedOn) dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer), clearIfContinuousEvent(domEventName, nativeEvent);
			else if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) nativeEvent.stopPropagation();
			else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
				for (; null !== blockedOn;) {
					var fiber = getInstanceFromNode(blockedOn);
					if (null !== fiber) switch (fiber.tag) {
						case 3:
							fiber = fiber.stateNode;
							if (fiber.current.memoizedState.isDehydrated) {
								var lanes = getHighestPriorityLanes(fiber.pendingLanes);
								if (0 !== lanes) {
									var root = fiber;
									root.pendingLanes |= 2;
									for (root.entangledLanes |= 2; lanes;) {
										var lane = 1 << 31 - clz32(lanes);
										root.entanglements[1] |= lane;
										lanes &= ~lane;
									}
									ensureRootIsScheduled(fiber);
									0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
								}
							}
							break;
						case 31:
						case 13: root = enqueueConcurrentRenderForLane(fiber, 2), null !== root && scheduleUpdateOnFiber(root, 0, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
					}
					fiber = findInstanceBlockingEvent(nativeEvent);
					null === fiber && dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
					if (fiber === blockedOn) break;
					blockedOn = fiber;
				}
				null !== blockedOn && nativeEvent.stopPropagation();
			} else dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
		}
	}
	function findInstanceBlockingEvent(nativeEvent) {
		nativeEvent = getEventTarget(nativeEvent);
		return findInstanceBlockingTarget(nativeEvent);
	}
	var return_targetInst = null;
	function findInstanceBlockingTarget(targetNode) {
		return_targetInst = null;
		targetNode = getClosestInstanceFromNode(targetNode);
		if (null !== targetNode) {
			var nearestMounted = getNearestMountedFiber(targetNode);
			if (null === nearestMounted) targetNode = null;
			else {
				var tag = nearestMounted.tag;
				if (13 === tag) {
					targetNode = getSuspenseInstanceFromFiber(nearestMounted);
					if (null !== targetNode) return targetNode;
					targetNode = null;
				} else if (31 === tag) {
					targetNode = getActivityInstanceFromFiber(nearestMounted);
					if (null !== targetNode) return targetNode;
					targetNode = null;
				} else if (3 === tag) {
					if (nearestMounted.stateNode.current.memoizedState.isDehydrated) return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
					targetNode = null;
				} else nearestMounted !== targetNode && (targetNode = null);
			}
		}
		return_targetInst = targetNode;
		return null;
	}
	function getEventPriority(domEventName) {
		switch (domEventName) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (getCurrentPriorityLevel()) {
				case 1: return 2;
				case 2: return 8;
				case 3:
				case 4: return 32;
				case 5: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = new Map(), queuedPointerCaptures = new Map(), discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function clearIfContinuousEvent(domEventName, nativeEvent) {
		switch (domEventName) {
			case "focusin":
			case "focusout":
				queuedFocus = null;
				break;
			case "dragenter":
			case "dragleave":
				queuedDrag = null;
				break;
			case "mouseover":
			case "mouseout":
				queuedMouse = null;
				break;
			case "pointerover":
			case "pointerout":
				queuedPointers.delete(nativeEvent.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": queuedPointerCaptures.delete(nativeEvent.pointerId);
		}
	}
	function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent) return existingQueuedEvent = {
			blockedOn,
			domEventName,
			eventSystemFlags,
			nativeEvent,
			targetContainers: [targetContainer]
		}, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
		existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
		blockedOn = existingQueuedEvent.targetContainers;
		null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
		return existingQueuedEvent;
	}
	function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		switch (domEventName) {
			case "focusin": return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
			case "dragenter": return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
			case "mouseover": return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), true;
			case "pointerover":
				var pointerId = nativeEvent.pointerId;
				queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent));
				return true;
			case "gotpointercapture": return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), true;
		}
		return false;
	}
	function attemptReplayContinuousQueuedEvent(queuedEvent) {
		if (null !== queuedEvent.blockedOn) return false;
		for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length;) {
			var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
			if (null === nextBlockedOn) {
				nextBlockedOn = queuedEvent.nativeEvent;
				var nativeEventClone = new nextBlockedOn.constructor(nextBlockedOn.type, nextBlockedOn);
				currentReplayingEvent = nativeEventClone;
				nextBlockedOn.target.dispatchEvent(nativeEventClone);
				currentReplayingEvent = null;
			} else return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
			targetContainers.shift();
		}
		return true;
	}
	function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
		attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
	}
	function replayUnblockedEvents() {
		hasScheduledReplayAttempt = false;
		null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
		null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
		null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
		queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
		queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
	}
	function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
		queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.n(3, replayUnblockedEvents)));
	}
	var lastScheduledReplayQueue = null;
	function scheduleReplayQueueIfNeeded(formReplayingQueue) {
		lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.n(3, function() {
			lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
			for (var i = 0; i < formReplayingQueue.length; i += 3) {
				var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
				if ("function" !== typeof submitterOrAction) if (null === findInstanceBlockingTarget(submitterOrAction || form)) continue;
				else break;
				var formInst = getInstanceFromNode(form);
				null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(formInst, {
					pending: true,
					data: formData,
					method: form.method,
					action: submitterOrAction
				}, submitterOrAction, formData));
			}
		}));
	}
	function retryIfBlockedOn(unblocked) {
		function unblock(queuedEvent) {
			return scheduleCallbackIfUnblocked(queuedEvent, unblocked), void 0;
		}
		null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
		null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
		null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
		queuedPointers.forEach(unblock);
		queuedPointerCaptures.forEach(unblock);
		{
			var i;
		}
		i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
		if (null != i) for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
			var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
			if ("function" === typeof submitterOrAction) formProps || scheduleReplayQueueIfNeeded(i);
			else if (formProps) {
				var action = null;
				if (submitterOrAction && submitterOrAction.hasAttribute("formAction")) if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null) action = formProps.formAction;
				else {
					if (null !== findInstanceBlockingTarget(form)) continue;
				}
				else action = formProps.action;
				"function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
				scheduleReplayQueueIfNeeded(i);
			}
		}
		var queuedTarget;
	}
	function ReactDOMRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
	ReactDOMRoot.prototype.render = function(children) {
		var root = this._internalRoot;
		if (null === root) throw Error(formatProdErrorMessage(409));
		var current = root.current, lane = requestUpdateLane();
		updateContainerImpl(current, lane, children, root);
	};
	ReactDOMRoot.prototype.unmount = function() {
		var root = this._internalRoot;
		if (null !== root) {
			this._internalRoot = null;
			var container = root.containerInfo;
			updateContainerImpl(root.current, 2, null, root);
			flushSyncWork$1();
			container[internalContainerInstanceKey] = null;
		}
	};
	var internals$jscomp$inline_2347 = {
		bundleType: 0,
		version: "19.2.4",
		rendererPackageName: "react-dom",
		currentDispatcherRef: ReactSharedInternals,
		reconcilerVersion: "19.2.4"
	};
	if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
		var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber) try {
			rendererID = hook$jscomp$inline_2348.inject(internals$jscomp$inline_2347), injectedHook = hook$jscomp$inline_2348;
		} catch {}
	}
	reactDomClient_production.a = function(container, options) {
		if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
		var onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
		options = createFiberRoot(container, 0, 0, 0, 0, 0, 0, 0, onUncaughtError, onCaughtError, onRecoverableError);
		container[internalContainerInstanceKey] = options.current;
		listenToAllSupportedEvents(container);
		return new ReactDOMRoot(options);
	};
	return reactDomClient_production;
}
function requireClient() {
	function checkDCE() {
		/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
			return;
		}
		try {
			// Verify that the code above has been dead code eliminated (DCE'd).
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			// DevTools shouldn't crash React, no matter what.
			// We should still report in case we break this code.
			console.error(err);
		}
	}
	{
		// DCE check should happen before ReactDOM bundle executes so that
		// DevTools can report bad minification during injection.
		checkDCE();
		client.a = requireReactDomClient_production();
	}
	return client.a;
}
var clientExports = requireClient();
var ReactDOM = getDefaultExportFromCjs(clientExports);
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
function useEvent(callback) {
	const fnRef = reactExports.L(callback);
	fnRef.current = callback;
	const memoFn = reactExports.y((...args) => fnRef.current?.(...args), []);
	return memoFn;
}
function canUseDom() {
	return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
/**
* Wrap `React.useLayoutEffect` which will not throw warning message in test env
*/
const useInternalLayoutEffect = canUseDom() ? reactExports.H : reactExports.C;
const useLayoutEffect = (callback, deps) => {
	const firstMountRef = reactExports.L(true);
	useInternalLayoutEffect(() => {
		return callback();
	}, deps);
	// We tell react that first mount has passed
	useInternalLayoutEffect(() => {
		firstMountRef.current = false;
		return () => {
			firstMountRef.current = true;
		};
	}, []);
};
/**
* Same as React.useState but `setState` accept `ignoreDestroy` param to not to setState after destroyed.
* We do not make this auto is to avoid real memory leak.
* Developer should confirm it's safe to ignore themselves.
*/
const useSafeState = (defaultValue) => {
	const destroyRef = reactExports.L(false);
	const [value, setValue] = reactExports.M(defaultValue);
	reactExports.C(() => {
		destroyRef.current = false;
		return () => {
			destroyRef.current = true;
		};
	}, []);
	function safeSetState(updater, ignoreDestroy) {
		if (ignoreDestroy && destroyRef.current) {
			return;
		}
		setValue(updater);
	}
	return [value, safeSetState];
};
var reactIs = {};
var reactIs_production_min = {};
function requireReactIs_production_min() {
	var b = Symbol.for("react.element"), c = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), h = Symbol.for("react.context"), k = Symbol.for("react.server_context"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), q = Symbol.for("react.lazy");
	function v(a) {
		if ("object" === typeof a && null !== a) {
			var r = a.$$typeof;
			switch (r) {
				case b: switch (a = a.type, a) {
					case d:
					case f:
					case e:
					case m:
					case n: return a;
					default: switch (a = a && a.$$typeof, a) {
						case k:
						case h:
						case l:
						case q:
						case p:
						case g: return a;
						default: return r;
					}
				}
				case c: return r;
			}
		}
	}
	reactIs_production_min.d = l;
	reactIs_production_min.u = function(a) {
		return v(a) === p;
	};
	return reactIs_production_min;
}
function requireReactIs() {
	{
		reactIs.a = requireReactIs_production_min();
	}
	return reactIs.a;
}
var reactIsExports = requireReactIs();
function useMemo(getValue, condition, shouldUpdate) {
	const cacheRef = reactExports.L({});
	if (!("value" in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
		cacheRef.current.value = getValue();
		cacheRef.current.condition = condition;
	}
	return cacheRef.current.value;
}
const REACT_ELEMENT_TYPE_18 = Symbol.for("react.element");
const REACT_ELEMENT_TYPE_19 = Symbol.for("react.transitional.element");
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
/**
* Compatible with React 18 or 19 to check if node is a Fragment.
*/
function isFragment$1(object) {
	return object && typeof object === "object" && (object.$$typeof === REACT_ELEMENT_TYPE_18 || object.$$typeof === REACT_ELEMENT_TYPE_19) && object.type === REACT_FRAGMENT_TYPE;
}
const ReactMajorVersion = Number(reactExports.P.split(".")[0]);
const fillRef = (ref, node) => {
	if (typeof ref === "function") {
		ref(node);
	} else if (typeof ref === "object" && ref && "current" in ref) {
		ref.current = node;
	}
};
/**
* Merge refs into one ref function to support ref passing.
*/
const composeRef = (...refs) => {
	const refList = refs.filter(Boolean);
	if (refList.length <= 1) {
		return refList[0];
	}
	return (node) => {
		refs.forEach((ref) => {
			fillRef(ref, node);
		});
	};
};
const useComposeRef = (...refs) => {
	return useMemo(
		() => composeRef(...refs),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs,
		(prev, next) => prev.length !== 2 || prev.every((ref, i) => ref !== next[i])
	);
};
const supportRef = (nodeOrComponent) => {
	if (!nodeOrComponent) {
		return false;
	}
	// React 19 no need `forwardRef` anymore. So just pass if is a React element.
	if (isReactElement(nodeOrComponent) && ReactMajorVersion >= 19) {
		return true;
	}
	const type = reactIsExports.u(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;
	// Function component node
	if (typeof type === "function" && !type.prototype?.render && type.$$typeof !== reactIsExports.d) {
		return false;
	}
	// Class component
	if (typeof nodeOrComponent === "function" && !nodeOrComponent.prototype?.render && nodeOrComponent.$$typeof !== reactIsExports.d) {
		return false;
	}
	return true;
};
function isReactElement(node) {
	return reactExports.r(node) && !isFragment$1(node);
}
/**
* In React 19. `ref` is not a property from node.
* But a property from `props.ref`.
* To check if `props.ref` exist or fallback to `ref`.
*/
const getNodeRef = (node) => {
	if (node && isReactElement(node)) {
		const ele = node;
		// Source from:
		// https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/getReactNodeRef/getReactNodeRef.ts
		return ele.props.propertyIsEnumerable("ref") ? ele.props.ref : ele.ref;
	}
	return null;
};
/* eslint-disable no-console */
let warned = {};
function call(__unused_49C5, valid, message) {
	if (!valid && !warned[message]) {
		warned[message] = true;
	}
}
/** @see Same as {@link warning}, but only warn once for the same message */
function warningOnce(valid, message) {
	call(0, valid, message);
}
function omit(obj, fields) {
	const clone = Object.assign({}, obj);
	if (Array.isArray(fields)) {
		fields.forEach((key) => {
			delete clone[key];
		});
	}
	return clone;
}
function toArray(children, option = {}) {
	let ret = [];
	React.b.b(children, (child) => {
		if ((child === void 0 || child === null) && !option.keepEmpty) {
			return;
		}
		if (Array.isArray(child)) {
			ret = ret.concat(toArray(child));
		} else if (isFragment$1(child) && child.props) {
			ret = ret.concat(toArray(child.props.children, option));
		} else {
			ret.push(child);
		}
	});
	return ret;
}
function isDOM(node) {
	// https://developer.mozilla.org/en-US/docs/Web/API/Element
	// Since XULElement is also subclass of Element, we only need HTMLElement and SVGElement
	return node instanceof HTMLElement || node instanceof SVGElement;
}
/**
* Retrieves a DOM node via a ref, and does not invoke `findDOMNode`.
*/
function getDOM(node) {
	if (node && typeof node === "object" && isDOM(node.nativeElement)) {
		return node.nativeElement;
	}
	if (isDOM(node)) {
		return node;
	}
	return null;
}
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
	if (null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
let raf = (callback) => +setTimeout(callback, 16);
let caf = (num) => clearTimeout(num);
if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
	raf = (callback) => window.requestAnimationFrame(callback);
	caf = (handle) => window.cancelAnimationFrame(handle);
}
let rafUUID = 0;
const rafIds = new Map();
function cleanup(id) {
	rafIds.delete(id);
}
const wrapperRaf = (callback) => {
	rafUUID += 1;
	const id = rafUUID;
	function callRef(leftTimes) {
		if (leftTimes === 0) {
			// Clean up
			cleanup(id);
			// Trigger
			callback();
		} else {
			// Next raf
			const realId = raf(() => {
				callRef(leftTimes - 1);
			});
			// Bind real raf id
			rafIds.set(id, realId);
		}
	}
	callRef(1);
	return id;
};
wrapperRaf.a = (id) => {
	const realId = rafIds.get(id);
	cleanup(id);
	return caf(realId);
};
const defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
	if (customizePrefixCls) {
		return customizePrefixCls;
	}
	return suffixCls ? `${"ant"}-${suffixCls}` : "ant";
};
// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
const ConfigContext = reactExports.n({
	getPrefixCls: defaultGetPrefixCls,
	iconPrefixCls: "anticon"
});
const EMPTY_OBJECT = {};
/**
* Get ConfigProvider configured component props.
* This help to reduce bundle size for saving `?.` operator.
* Do not use as `useMemo` deps since we do not cache the object here.
*
* NOTE: not refactor this with `useMemo` since memo will cost another memory space,
* which will waste both compare calculation & memory.
*/
function useComponentConfig() {
	const context = reactExports.z(ConfigContext);
	const { getPrefixCls, direction } = context;
	const propValue = context["button"];
	return {
		classNames: EMPTY_OBJECT,
		styles: EMPTY_OBJECT,
		...propValue,
		getPrefixCls,
		direction
	};
}
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
	// 'm' and 'r' are mixing constants generated offline.
	// They're not really 'magic', they just happen to work well.
	// const m = 0x5bd1e995;
	// const r = 24;
	// Initialize the hash
	var h = 0;
	var k, i = 0, len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
		k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
		k ^= k >>> 24;
		h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	switch (len) {
		case 3: h ^= (str.charCodeAt(i + 2) & 255) << 16;
		case 2: h ^= (str.charCodeAt(i + 1) & 255) << 8;
		case 1:
			h ^= str.charCodeAt(i) & 255;
			h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	// bytes are well-incorporated.
	h ^= h >>> 13;
	h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	return ((h ^ h >>> 15) >>> 0).toString(36);
}
function contains(root, n) {
	if (!root) {
		return false;
	}
	// Use native if support
	if (root.contains) {
		return root.contains(n);
	}
	// `document.contains` not support with IE11
	let node = n;
	while (node) {
		if (node === root) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
const APPEND_ORDER = "data-rc-order";
const APPEND_PRIORITY = "data-rc-priority";
const containerCache = new Map();
function getMark({ mark }) {
	if (mark) {
		return mark.startsWith("data-") ? mark : `data-${mark}`;
	}
	return "rc-util-key";
}
function getContainer(option) {
	if (option.attachTo) {
		return option.attachTo;
	}
	const head = document.querySelector("head");
	return head || document.body;
}
function getOrder(prepend) {
	if (prepend === "queue") {
		return "prependQueue";
	}
	return prepend ? "prepend" : "append";
}
/**
* Find style which inject by rc-util
*/
function findStyles(container) {
	return Array.from((containerCache.get(container) || container).children).filter((node) => node.tagName === "STYLE");
}
function injectCSS(css, option) {
	if (!canUseDom()) {
		return null;
	}
	const { csp, prepend, priority = 0 } = option;
	const mergedOrder = getOrder(prepend);
	const isPrependQueue = mergedOrder === "prependQueue";
	const styleNode = document.createElement("style");
	styleNode.setAttribute(APPEND_ORDER, mergedOrder);
	if (isPrependQueue && priority) {
		styleNode.setAttribute(APPEND_PRIORITY, `${priority}`);
	}
	if (csp?.nonce) {
		styleNode.nonce = csp?.nonce;
	}
	styleNode.innerHTML = css;
	const container = getContainer(option);
	const { firstChild } = container;
	if (prepend) {
		// If is queue `prepend`, it will prepend first style and then append rest style
		if (isPrependQueue) {
			const existStyle = (option.styles || findStyles(container)).filter((node) => {
				// Ignore style which not injected by rc-util with prepend
				if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) {
					return false;
				}
				// Ignore style which priority less then new style
				const nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
				return priority >= nodePriority;
			});
			if (existStyle.length) {
				container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
				return styleNode;
			}
		}
		// Use `insertBefore` as `prepend`
		container.insertBefore(styleNode, firstChild);
	} else {
		container.appendChild(styleNode);
	}
	return styleNode;
}
function findExistNode(key, option) {
	let { styles } = option;
	styles ||= findStyles(getContainer(option));
	return styles.find((node) => node.getAttribute(getMark(option)) === key);
}
function removeCSS(key, option) {
	const existNode = findExistNode(key, option);
	if (existNode) {
		const container = getContainer(option);
		container.removeChild(existNode);
	}
}
/**
* qiankun will inject `appendChild` to insert into other
*/
function syncRealContainer(container, option) {
	const cachedRealContainer = containerCache.get(container);
	// Find real container when not cached or cached container removed
	if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
		const placeholderStyle = injectCSS("", option);
		const { parentNode } = placeholderStyle;
		containerCache.set(container, parentNode);
		container.removeChild(placeholderStyle);
	}
}
function updateCSS(css, key, originOption) {
	const container = getContainer(originOption);
	const styles = findStyles(container);
	const option = {
		...originOption,
		styles
	};
	// Sync real parent
	syncRealContainer(container, option);
	const existNode = findExistNode(key, option);
	if (existNode) {
		if (option.csp?.nonce && existNode.nonce !== option.csp?.nonce) {
			existNode.nonce = option.csp?.nonce;
		}
		if (existNode.innerHTML !== css) {
			existNode.innerHTML = css;
		}
		return existNode;
	}
	const newNode = injectCSS(css, option);
	newNode.setAttribute(getMark(option), key);
	return newNode;
}
/** Connect key with `SPLIT` */
function pathKey(keys) {
	return keys.join("%");
}
/** Record update id for extract static style order. */
let updateId = 0;
class Entity {
	constructor(instanceId) {
		this.instanceId = instanceId;
	}
	/** @private Internal cache map. Do not access this directly */
	cache = new Map();
	/** @private Record update times for each key */
	updateTimes = new Map();
	extracted = new Set();
	get(keys) {
		return this.opGet(pathKey(keys));
	}
	/** A fast get cache with `get` concat. */
	opGet(keyPathStr) {
		return this.cache.get(keyPathStr) || null;
	}
	update(keys, valueFn) {
		return this.opUpdate(pathKey(keys), valueFn);
	}
	/** A fast get cache with `get` concat. */
	opUpdate(keyPathStr, valueFn) {
		const prevValue = this.cache.get(keyPathStr);
		const nextValue = valueFn(prevValue);
		if (nextValue === null) {
			this.cache.delete(keyPathStr);
			this.updateTimes.delete(keyPathStr);
		} else {
			this.cache.set(keyPathStr, nextValue);
			this.updateTimes.set(keyPathStr, updateId);
			updateId += 1;
		}
	}
}
const ATTR_TOKEN = "data-token-hash";
const ATTR_MARK = "data-css-hash";
// Mark css-in-js instance in style element
const CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
function createCache() {
	const cssinjsInstanceId = Math.random().toString(12).slice(2);
	// Tricky SSR: Move all inline style to the head.
	// PS: We do not recommend tricky mode.
	if (typeof document !== "undefined" && document.head && document.body) {
		const styles = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || [];
		const { firstChild } = document.head;
		Array.from(styles).forEach((style) => {
			style[CSS_IN_JS_INSTANCE] ||= cssinjsInstanceId;
			// Not force move if no head
			if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
				document.head.insertBefore(style, firstChild);
			}
		});
		// Deduplicate of moved styles
		const styleHash = {};
		Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach((style) => {
			const hash = style.getAttribute(ATTR_MARK);
			if (styleHash[hash]) {
				if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
					style.parentNode?.removeChild(style);
				}
			} else {
				styleHash[hash] = true;
			}
		});
	}
	return new Entity(cssinjsInstanceId);
}
const StyleContext = reactExports.n({
	hashPriority: "low",
	cache: createCache(),
	defaultCache: true,
	autoPrefix: false
});
class ThemeCache {
	constructor() {
		this.a = new Map();
		this.b = [];
		this.c = 0;
	}
	d(derivativeOption, updateCallTimes = false) {
		let cache = { map: this.a };
		derivativeOption.forEach((derivative) => {
			if (!cache) {
				cache = void 0;
			} else {
				cache = cache?.map?.get(derivative);
			}
		});
		if (cache?.value && updateCallTimes) {
			cache.value[1] = this.c++;
		}
		return cache?.value;
	}
	e(derivativeOption) {
		return this.d(derivativeOption, true)?.[0];
	}
	f(derivativeOption) {
		return !!this.d(derivativeOption);
	}
	g(derivativeOption, value) {
		// New cache
		if (!this.f(derivativeOption)) {
			this.b.push(derivativeOption);
		}
		let cache = this.a;
		derivativeOption.forEach((derivative, index) => {
			if (index === derivativeOption.length - 1) {
				cache.set(derivative, { value: [value, this.c++] });
			} else {
				const cacheValue = cache.get(derivative);
				if (!cacheValue) {
					cache.set(derivative, { map: new Map() });
				} else if (!cacheValue.map) {
					cacheValue.map = new Map();
				}
				cache = cache.get(derivative).map;
			}
		});
	}
}
let uuid = 0;
/**
* Theme with algorithms to derive tokens from design tokens.
* Use `createTheme` first which will help to manage the theme instance cache.
*/
class Theme {
	constructor(derivatives) {
		this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
		this.id = uuid;
		uuid += 1;
	}
	getDerivativeToken(token) {
		return this.derivatives.reduce((result, derivative) => derivative(token, result), void 0);
	}
}
const cacheThemes = new ThemeCache();
/**
* Same as new Theme, but will always return same one if `derivative` not changed.
*/
function createTheme(derivatives) {
	const derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
	// Create new theme if not exist
	if (!cacheThemes.f(derivativeArr)) {
		cacheThemes.g(derivativeArr, new Theme(derivativeArr));
	}
	// Get theme from cache and return
	return cacheThemes.e(derivativeArr);
}
// Create a cache for memo concat
const resultCache = new WeakMap();
const RESULT_VALUE = {};
function memoResult(callback, deps) {
	let current = resultCache;
	for (let i = 0; i < 2; i += 1) {
		const dep = deps[i];
		if (!current.has(dep)) {
			current.set(dep, new WeakMap());
		}
		current = current.get(dep);
	}
	if (!current.has(RESULT_VALUE)) {
		current.set(RESULT_VALUE, callback());
	}
	return current.get(RESULT_VALUE);
}
// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap();
/**
* Flatten token to string, this will auto cache the result when token not change
*/
function flattenToken(token) {
	let str = flattenTokenCache.get(token) || "";
	if (!str) {
		Object.keys(token).forEach((key) => {
			const value = token[key];
			str += key;
			if (value instanceof Theme) {
				str += value.id;
			} else if (value && typeof value === "object") {
				str += flattenToken(value);
			} else {
				str += value;
			}
		});
		// https://github.com/ant-design/ant-design/issues/48386
		// Should hash the string to avoid style tag name too long
		str = murmur2(str);
		// Put in cache
		flattenTokenCache.set(token, str);
	}
	return str;
}
/**
* Convert derivative token to key string
*/
function token2key(token, salt) {
	return murmur2(`${salt}_${flattenToken(token)}`);
}
const isClientSide = canUseDom();
function unit$1(num) {
	if (typeof num === "number") {
		return `${num}px`;
	}
	return num;
}
function where(options) {
	const { a: hashCls, b: hashPriority = "low" } = options;
	if (!hashCls) {
		return "";
	}
	const hashSelector = `.${hashCls}`;
	return hashPriority === "low" ? `:where(${hashSelector})` : hashSelector;
}
const isNonNullable$1 = (val) => {
	return val !== void 0 && val !== null;
};
const token2CSSVar = (token, prefix = "") => {
	return `--${prefix ? `${prefix}-` : ""}${token}`.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2").replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
};
const serializeCSSVar = (cssVars, hashId, options) => {
	const { a: hashCls, b: hashPriority = "low" } = options;
	if (!Object.keys(cssVars).length) {
		return "";
	}
	return `${where({
		a: hashCls,
		b: hashPriority
	})}.${hashId}${options.c ? `.${options.c}` : ""}{${Object.entries(cssVars).map(([key, value]) => `${key}:${value};`).join("")}}`;
};
const transformToken = (token, themeKey, config) => {
	const { a: hashCls, b: hashPriority = "low", c: prefix, d: unitless, e: ignore, f: preserve } = config;
	const cssVars = {};
	const result = {};
	Object.entries(token).forEach(([key, value]) => {
		if (preserve?.[key]) {
			result[key] = value;
		} else if ((typeof value === "string" || typeof value === "number") && !ignore?.[key]) {
			const cssVar = token2CSSVar(key, prefix);
			cssVars[cssVar] = typeof value === "number" && !unitless?.[key] ? `${value}px` : String(value);
			result[key] = `var(${cssVar})`;
		}
	});
	return [result, serializeCSSVar(cssVars, themeKey, {
		c: config.f,
		a: hashCls,
		b: hashPriority
	})];
};
const effectMap = new Map();
function useGlobalCache(prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect) {
	const { cache: globalCache } = reactExports.z(StyleContext);
	const fullPath = [prefix, ...keyPath];
	const fullPathStr = pathKey(fullPath);
	const buildCache = (updater) => {
		globalCache.opUpdate(fullPathStr, (prevCache) => {
			const [times = 0, cache] = prevCache || [void 0, void 0];
			// HMR should always ignore cache since developer may change it
			let tmpCache = cache;
			const mergedCache = tmpCache || cacheFn();
			const data = [times, mergedCache];
			// Call updater if need additional logic
			return updater ? updater(data) : data;
		});
	};
	// Create cache
	reactExports.I(
		() => {
			buildCache();
		},
		[fullPathStr]
		/* eslint-enable */
	);
	let cacheEntity = globalCache.opGet(fullPathStr);
	const cacheContent = cacheEntity[1];
	// Remove if no need anymore
	reactExports.G(() => {
		buildCache(([times, cache]) => [times + 1, cache]);
		if (!effectMap.has(fullPathStr)) {
			onCacheEffect(cacheContent);
			effectMap.set(fullPathStr, true);
			// 微任务清理缓存，可以认为是单次 batch render 中只触发一次 effect
			Promise.resolve().then(() => {
				effectMap.delete(fullPathStr);
			});
		}
		return () => {
			globalCache.opUpdate(fullPathStr, (prevCache) => {
				const [times = 0, cache] = prevCache || [];
				const nextCount = times - 1;
				if (nextCount === 0) {
					onCacheRemove(cache);
					effectMap.delete(fullPathStr);
					return null;
				}
				return [times - 1, cache];
			});
		};
	}, [fullPathStr]);
	return cacheContent;
}
const EMPTY_OVERRIDE = {};
const tokenKeys = new Map();
function recordCleanToken(tokenKey) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
	if (typeof document !== "undefined") {
		const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`);
		styles.forEach((style) => {
			if (style[CSS_IN_JS_INSTANCE] === instanceId) {
				style.parentNode?.removeChild(style);
			}
		});
	}
}
// Remove will check current keys first
function cleanTokenStyle(tokenKey, instanceId) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
	const cleanableKeyList = new Set();
	tokenKeys.forEach((value, key) => {
		if (value <= 0) cleanableKeyList.add(key);
	});
	// Should keep tokens under threshold for not to insert style too often
	if (tokenKeys.size - cleanableKeyList.size > -1) {
		cleanableKeyList.forEach((key) => {
			removeStyleTags(key, instanceId);
			tokenKeys.delete(key);
		});
	}
}
/**
* Cache theme derivative token as global shared one
* @param theme Theme entity
* @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
* @param option Additional config
* @returns Call Theme.getDerivativeToken(tokenObject) to get token
*/
function useCacheToken(theme, tokens, option) {
	const { cache: { instanceId }, container, hashPriority } = reactExports.z(StyleContext);
	const { a: salt, b: override = EMPTY_OVERRIDE, c: compute, d: cssVar } = option;
	// Basic - We do basic cache here
	const mergedToken = memoResult(() => Object.assign({}, ...tokens), tokens);
	const tokenStr = flattenToken(mergedToken);
	const overrideTokenStr = flattenToken(override);
	const cssVarStr = flattenToken(cssVar);
	const cachedToken = useGlobalCache("token", [
		salt,
		theme.id,
		tokenStr,
		overrideTokenStr,
		cssVarStr
	], () => {
		const mergedDerivativeToken = compute(mergedToken, override, theme);
		const actualToken = { ...mergedDerivativeToken };
		// Optimize for `useStyleRegister` performance
		const mergedSalt = `${salt}_${cssVar.prefix}`;
		const hashId = murmur2(mergedSalt);
		const hashCls = `${"css"}-${hashId}`;
		actualToken._tokenKey = token2key(actualToken, mergedSalt);
		// Replace token value with css variables
		const [tokenWithCssVar, cssVarsStr] = transformToken(mergedDerivativeToken, cssVar.key, {
			c: cssVar.prefix,
			e: cssVar.ignore,
			d: cssVar.unitless,
			f: cssVar.preserve,
			b: hashPriority,
			a: cssVar.hashed ? hashCls : void 0
		});
		tokenWithCssVar._hashId = hashId;
		recordCleanToken(cssVar.key);
		return [
			tokenWithCssVar,
			hashCls,
			actualToken,
			cssVarsStr,
			cssVar.key
		];
	}, ([, , , , themeKey]) => {
		// Remove token will remove all related style
		cleanTokenStyle(themeKey, instanceId);
	}, ([, , , cssVarsStr, themeKey]) => {
		if (!cssVarsStr) {
			return;
		}
		const style = updateCSS(cssVarsStr, murmur2(`css-var-${themeKey}`), {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		});
		style[CSS_IN_JS_INSTANCE] = instanceId;
		// Used for `useCacheToken` to remove on batch when token removed
		style.setAttribute(ATTR_TOKEN, themeKey);
	});
	return cachedToken;
}
var unitlessKeys = {
	animationIterationCount: 1,
	borderImageOutset: 1,
	borderImageSlice: 1,
	borderImageWidth: 1,
	boxFlex: 1,
	boxFlexGroup: 1,
	boxOrdinalGroup: 1,
	columnCount: 1,
	columns: 1,
	flex: 1,
	flexGrow: 1,
	flexPositive: 1,
	flexShrink: 1,
	flexNegative: 1,
	flexOrder: 1,
	gridRow: 1,
	gridRowEnd: 1,
	gridRowSpan: 1,
	gridRowStart: 1,
	gridColumn: 1,
	gridColumnEnd: 1,
	gridColumnSpan: 1,
	gridColumnStart: 1,
	msGridRow: 1,
	msGridRowSpan: 1,
	msGridColumn: 1,
	msGridColumnSpan: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	tabSize: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1,
	WebkitLineClamp: 1,
	fillOpacity: 1,
	floodOpacity: 1,
	stopOpacity: 1,
	strokeDasharray: 1,
	strokeDashoffset: 1,
	strokeMiterlimit: 1,
	strokeOpacity: 1,
	strokeWidth: 1
};
var unitless$1 = unitlessKeys;
/**
* @param {number}
* @return {number}
*/
var abs = Math.abs;
/**
* @param {number}
* @return {string}
*/
var from = String.fromCharCode;
/**
* @param {object}
* @return {object}
*/
var assign = Object.assign;
/**
* @param {string} value
* @param {number} length
* @return {number}
*/
function hash(value, length) {
	return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
/**
* @param {string} value
* @return {string}
*/
function trim(value) {
	return value.trim();
}
/**
* @param {string} value
* @param {RegExp} pattern
* @return {string?}
*/
function match(value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value;
}
/**
* @param {string} value
* @param {(string|RegExp)} pattern
* @param {string} replacement
* @return {string}
*/
function replace(value, pattern, replacement) {
	return value.replace(pattern, replacement);
}
/**
* @param {string} value
* @param {string} search
* @param {number} position
* @return {number}
*/
function indexof(value, search, position) {
	return value.indexOf(search, position);
}
/**
* @param {string} value
* @param {number} index
* @return {number}
*/
function charat(value, index) {
	return value.charCodeAt(index) | 0;
}
/**
* @param {string} value
* @param {number} begin
* @param {number} end
* @return {string}
*/
function substr(value, begin, end) {
	return value.slice(begin, end);
}
/**
* @param {string} value
* @return {number}
*/
function strlen(value) {
	return value.length;
}
/**
* @param {any[]} value
* @return {number}
*/
function sizeof(value) {
	return value.length;
}
/**
* @param {any} value
* @param {any[]} array
* @return {any}
*/
function append(value, array) {
	return array.push(value), value;
}
/**
* @param {string[]} array
* @param {function} callback
* @return {string}
*/
function combine(array, callback) {
	return array.map(callback).join("");
}
/**
* @param {string[]} array
* @param {RegExp} pattern
* @return {string[]}
*/
function filter(array, pattern) {
	return array.filter(function(value) {
		return !match(value, pattern);
	});
}
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
/**
* @param {string} value
* @param {object | null} root
* @param {object | null} parent
* @param {string} type
* @param {string[] | string} props
* @param {object[] | string} children
* @param {object[]} siblings
* @param {number} length
*/
function node(value, root, parent, type, props, children, length, siblings) {
	return {
		value,
		root,
		parent,
		type,
		props,
		children,
		line,
		column,
		length,
		return: "",
		siblings
	};
}
/**
* @param {object} root
* @param {object} props
* @return {object}
*/
function copy(root, props) {
	return assign(node("", null, null, "", null, null, 0, root.siblings), root, { length: -root.length }, props);
}
/**
* @param {object} root
*/
function lift(root) {
	while (root.root) root = copy(root.root, { children: [root] });
	append(root, root.siblings);
}
/**
* @return {number}
*/
function char() {
	return character;
}
/**
* @return {number}
*/
function prev() {
	character = position > 0 ? charat(characters, --position) : 0;
	if (column--, character === 10) column = 1, line--;
	return character;
}
/**
* @return {number}
*/
function next() {
	character = position < length ? charat(characters, position++) : 0;
	if (column++, character === 10) column = 1, line++;
	return character;
}
/**
* @return {number}
*/
function peek() {
	return charat(characters, position);
}
/**
* @return {number}
*/
function caret() {
	return position;
}
/**
* @param {number} begin
* @param {number} end
* @return {string}
*/
function slice(begin, end) {
	return substr(characters, begin, end);
}
/**
* @param {number} type
* @return {number}
*/
function token(type) {
	switch (type) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
/**
* @param {string} value
* @return {any[]}
*/
function alloc(value) {
	return line = column = 1, length = strlen(characters = value), position = 0, [];
}
/**
* @param {any} value
* @return {any}
*/
function dealloc(value) {
	return characters = "", value;
}
/**
* @param {number} type
* @return {string}
*/
function delimit(type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
/**
* @param {number} type
* @return {string}
*/
function whitespace(type) {
	while (character = peek()) if (character < 33) next();
	else break;
	return token(type) > 2 || token(character) > 3 ? "" : " ";
}
/**
* @param {number} index
* @param {number} count
* @return {string}
*/
function escaping(index, count) {
	while (--count && next())
 // not 0-9 A-F a-f
	if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
/**
* @param {number} type
* @return {number}
*/
function delimiter(type) {
	while (next()) switch (character) {
		case type: return position;
		case 34:
		case 39:
			if (type !== 34 && type !== 39) delimiter(character);
			break;
		case 40:
			if (type === 41) delimiter(type);
			break;
		case 92:
			next();
			break;
	}
	return position;
}
/**
* @param {number} type
* @param {number} index
* @return {number}
*/
function commenter(type, index) {
	while (next())
 // //
	if (type + character === 57) break;
	else if (type + character === 84 && peek() === 47) break;
	return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
/**
* @param {number} index
* @return {string}
*/
function identifier(index) {
	while (!token(peek())) next();
	return slice(index, position);
}
/**
* @param {string} value
* @return {object[]}
*/
function compile(value) {
	return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {string[]} rule
* @param {string[]} rules
* @param {string[]} rulesets
* @param {number[]} pseudo
* @param {number[]} points
* @param {string[]} declarations
* @return {object}
*/
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var character = 0;
	var type = "";
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = "";
	while (scanning) switch (previous = character, character = next()) {
		case 40: if (previous != 108 && charat(characters, length - 1) == 58) {
			if (indexof(characters += replace(delimit(character), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1) ampersand = -1;
			break;
		}
		case 34:
		case 39:
		case 91:
			characters += delimit(character);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			characters += whitespace(previous);
			break;
		case 92:
			characters += escaping(caret() - 1, 7);
			continue;
		case 47:
			switch (peek()) {
				case 42:
				case 47:
					append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
					if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters) && substr(characters, -1, void 0) !== " ") characters += " ";
					break;
				default: characters += "/";
			}
			break;
		case 123 * variable: points[index++] = strlen(characters) * ampersand;
		case 125 * variable:
		case 59:
		case 0:
			switch (character) {
				case 0:
				case 125: scanning = 0;
				case 59 + offset:
					if (ampersand == -1) characters = replace(characters, /\f/g, "");
					if (property > 0 && (strlen(characters) - length || variable === 0 && previous === 47)) append(property > 32 ? declaration(characters + ";", rule, parent, length - 1, declarations) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2, declarations), declarations);
					break;
				case 59: characters += ";";
				default:
					append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
					if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);
					else {
						switch (atrule) {
							case 99: if (charat(characters, 3) === 110) break;
							case 108: if (charat(characters, 2) === 97) break;
							default: offset = 0;
							case 100:
							case 109:
							case 115:
						}
						if (offset) parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, 0, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
						else parse(characters, reference, reference, reference, [""], children, 0, points, children);
					}
			}
			index = (offset = property = 0, 0), variable = ampersand = 1, type = characters = "", length = pseudo;
			break;
		case 58: length = 1 + strlen(characters), property = previous;
		default:
			if (variable < 1) {
				if (character == 123) --variable;
				else if (character == 125 && variable++ == 0 && prev() == 125) continue;
			}
			switch (characters += from(character), character * variable) {
				case 38:
					ampersand = offset > 0 ? 1 : (characters += "\f", -1);
					break;
				case 44:
					points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
					break;
				case 64:
					// -
					if (peek() === 45) characters += delimit(next());
					atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
					break;
				case 45: if (previous === 45 && strlen(characters) == 2) variable = 0;
			}
	}
	return rulesets;
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} index
* @param {number} offset
* @param {string[]} rules
* @param {number[]} points
* @param {string} type
* @param {string[]} props
* @param {string[]} children
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [""];
	var size = sizeof(rule);
	for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	return node(value, root, parent, offset === 0 ? "rule" : type, props, children, length, siblings);
}
/**
* @param {number} value
* @param {object} root
* @param {object?} parent
* @param {object[]} siblings
* @return {object}
*/
function comment(value, root, parent, siblings) {
	return node(value, root, parent, "comm", from(char()), substr(value, 2, -2), 0, siblings);
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function declaration(value, root, parent, length, siblings) {
	return node(value, root, parent, "decl", substr(value, 0, length), substr(value, length + 1, -1), length, siblings);
}
/**
* @param {string} value
* @param {number} length
* @param {object[]} children
* @return {string}
*/
function prefix(value, length, children) {
	switch (hash(value, length)) {
		case 5103: return "-webkit-" + "print-" + value + value;
		case 5737:
		case 4201:
		case 3177:
		case 3433:
		case 1641:
		case 4457:
		case 2921:
		case 5572:
		case 6356:
		case 5844:
		case 3191:
		case 6645:
		case 3005:
		case 4215:
		case 6389:
		case 5109:
		case 5365:
		case 5621:
		case 3829:
		case 6391:
		case 5879:
		case 5623:
		case 6135:
		case 4599: return "-webkit-" + value + value;
		case 4855: return "-webkit-" + value.replace("add", "source-over").replace("substract", "source-out").replace("intersect", "source-in").replace("exclude", "xor") + value;
		case 4789: return "-moz-" + value + value;
		case 5349:
		case 4246:
		case 4810:
		case 6968:
		case 2756: return "-webkit-" + value + "-moz-" + value + "-ms-" + value + value;
		case 5936: switch (charat(value, length + 11)) {
			case 114: return "-webkit-" + value + "-ms-" + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
			case 108: return "-webkit-" + value + "-ms-" + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
			case 45: return "-webkit-" + value + "-ms-" + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
		}
		case 6828:
		case 4268:
		case 2903: return "-webkit-" + value + "-ms-" + value + value;
		case 6165: return "-webkit-" + value + "-ms-" + "flex-" + value + value;
		case 5187: return "-webkit-" + value + replace(value, /(\w+).+(:[^]+)/, "-webkit-" + "box-$1$2" + "-ms-" + "flex-$1$2") + value;
		case 5443: return "-webkit-" + value + "-ms-" + "flex-item-" + replace(value, /flex-|-self/g, "") + (!match(value, /flex-|baseline/) ? "-ms-" + "grid-row-" + replace(value, /flex-|-self/g, "") : "") + value;
		case 4675: return "-webkit-" + value + "-ms-" + "flex-line-pack" + replace(value, /align-content|flex-|-self/g, "") + value;
		case 5548: return "-webkit-" + value + "-ms-" + replace(value, "shrink", "negative") + value;
		case 5292: return "-webkit-" + value + "-ms-" + replace(value, "basis", "preferred-size") + value;
		case 6060: return "-webkit-box-" + replace(value, "-grow", "") + "-webkit-" + value + "-ms-" + replace(value, "grow", "positive") + value;
		case 4554: return "-webkit-" + replace(value, /([^-])(transform)/g, "$1-webkit-$2") + value;
		case 6187: return replace(replace(replace(value, /(zoom-|grab)/, "-webkit-$1"), /(image-set)/, "-webkit-$1"), value, "") + value;
		case 5495:
		case 3959: return replace(value, /(image-set\([^]*)/, "-webkit-$1" + "$`$1");
		case 4968: return replace(replace(value, /(.+:)(flex-)?(.*)/, "-webkit-" + "box-pack:$3" + "-ms-" + "flex-pack:$3"), /space-between/, "justify") + "-webkit-" + value + value;
		case 4200:
			if (!match(value, /flex-|baseline/)) return "-ms-" + "grid-column-align" + substr(value, length) + value;
			break;
		case 2592:
		case 3360: return "-ms-" + replace(value, "template-", "") + value;
		case 4384:
		case 3616:
			if (children && children.some(function(element, index) {
				return length = index, match(element.props, /grid-\w+-end/);
			})) {
				return ~indexof(value + (children = children[length].value), "span", 0) ? value : "-ms-" + replace(value, "-start", "") + value + "-ms-" + "grid-row-span:" + (~indexof(children, "span", 0) ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ";";
			}
			return "-ms-" + replace(value, "-start", "") + value;
		case 4896:
		case 4128: return children && children.some(function(element) {
			return match(element.props, /grid-\w+-start/);
		}) ? value : "-ms-" + replace(replace(value, "-end", "-span"), "span ", "") + value;
		case 4095:
		case 3583:
		case 4068:
		case 2532: return replace(value, /(.+)-inline(.+)/, "-webkit-$1$2") + value;
		case 8116:
		case 7059:
		case 5753:
		case 5535:
		case 5445:
		case 5701:
		case 4933:
		case 4677:
		case 5533:
		case 5789:
		case 5021:
		case 4765:
			// stretch, max-content, min-content, fill-available
			if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
				case 109:
 // -
				if (charat(value, length + 4) !== 45) break;
				case 102: return replace(value, /(.+:)(.+)-([^]+)/, "$1-webkit-" + "$2-$3" + "$1" + "-moz-" + (charat(value, length + 3) == 108 ? "$3" : "$2-$3")) + value;
				case 115: return ~indexof(value, "stretch", 0) ? prefix(replace(value, "stretch", "fill-available"), length, children) + value : value;
			}
			break;
		case 5152:
		case 5920: return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(__unused_0FCF, a, b, c, d, e, f) {
			return "-ms-" + a + ":" + b + f + (c ? "-ms-" + a + "-span:" + (d ? e : +e - +b) + f : "") + value;
		});
		case 4949:
			// stick(y)?
			if (charat(value, length + 6) === 121) return replace(value, ":", ":-webkit-") + value;
			break;
		case 6444:
			switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
				case 120: return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1-webkit-" + (charat(value, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + "-webkit-" + "$2$3" + "$1" + "-ms-" + "$2box$3") + value;
				case 100: return replace(value, ":", ":-ms-") + value;
			}
			break;
		case 5719:
		case 2647:
		case 2135:
		case 3927:
		case 2391: return replace(value, "scroll-", "scroll-snap-") + value;
	}
	return value;
}
/**
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function serialize(children, callback) {
	var output = "";
	for (var i = 0; i < children.length; i++) output += callback(children[i], i, children, callback) || "";
	return output;
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function stringify(element, __unused_D143, children, callback) {
	switch (element.type) {
		case "@layer": if (element.children.length) break;
		case "@import":
		case "@namespace":
		case "decl": return element.return = element.return || element.value;
		case "comm": return "";
		case "@keyframes": return element.return = element.value + "{" + serialize(element.children, callback) + "}";
		case "rule": if (!strlen(element.value = element.props.join(","))) return "";
	}
	return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
/**
* @param {function[]} collection
* @return {function}
*/
function middleware(collection) {
	return function(element, index, children, callback) {
		var output = "";
		for (var i = 0; i < 2; i++) output += collection[i](element, index, children, callback) || "";
		return output;
	};
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
*/
function prefixer(element, __unused_D143_0, children, callback) {
	if (element.length > -1) {
		if (!element.return) switch (element.type) {
			case "decl":
				element.return = prefix(element.value, element.length, children);
				return;
			case "@keyframes": return serialize([copy(element, { value: replace(element.value, "@", "@-webkit-") })], callback);
			case "rule": if (element.length) return combine(children = element.props, function(value) {
				switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
					case ":read-only":
					case ":read-write":
						lift(copy(element, { props: [replace(value, /:(read-\w+)/, ":-moz-$1")] }));
						lift(copy(element, { props: [value] }));
						assign(element, { props: filter(children, callback) });
						break;
					case "::placeholder":
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":-webkit-" + "input-$1")] }));
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":-moz-$1")] }));
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, "-ms-input-$1")] }));
						lift(copy(element, { props: [value] }));
						assign(element, { props: filter(children, callback) });
						break;
				}
				return "";
			});
		}
	}
}
const ATTR_CACHE_MAP = "data-ant-cssinjs-cache-path";
/**
* This marks style from the css file.
* Which means not exist in `<style />` tag.
*/
const CSS_FILE_STYLE = "_FILE_STYLE__";
let cachePathMap;
let fromCSSFile = true;
function prepare() {
	if (!cachePathMap) {
		cachePathMap = {};
		if (canUseDom()) {
			const div = document.createElement("div");
			div.className = ATTR_CACHE_MAP;
			div.style.position = "fixed";
			div.style.visibility = "hidden";
			div.style.top = "-9999px";
			document.body.appendChild(div);
			let content = getComputedStyle(div).content || "";
			content = content.replace(/^"/, "").replace(/"$/, "");
			// Fill data
			content.split(";").forEach((item) => {
				const [path, hash] = item.split(":");
				cachePathMap[path] = hash;
			});
			// Remove inline record style
			const inlineMapStyle = document.querySelector(`style[${ATTR_CACHE_MAP}]`);
			if (inlineMapStyle) {
				fromCSSFile = false;
				inlineMapStyle.parentNode?.removeChild(inlineMapStyle);
			}
			document.body.removeChild(div);
		}
	}
}
function existPath(path) {
	prepare();
	return !!cachePathMap[path];
}
function getStyleAndHash(path) {
	const hash = cachePathMap[path];
	let styleStr = null;
	if (hash && canUseDom()) {
		if (fromCSSFile) {
			styleStr = CSS_FILE_STYLE;
		} else {
			const style = document.querySelector(`style[${ATTR_MARK}="${cachePathMap[path]}"]`);
			if (style) {
				styleStr = style.innerHTML;
			} else {
				// Clean up since not exist anymore
				delete cachePathMap[path];
			}
		}
	}
	return [styleStr, hash];
}
const MULTI_VALUE = "_multi_value_";
// ============================================================================
// ==                                 Parser                                 ==
// ============================================================================
// Preprocessor style content to browser support one
function normalizeStyle(styleStr, autoPrefix) {
	const serialized = autoPrefix ? serialize(compile(styleStr), middleware([prefixer, stringify])) : serialize(compile(styleStr), stringify);
	return serialized.replace(/\{%%%\:[^;];}/g, ";");
}
function isCompoundCSSProperty(value) {
	return typeof value === "object" && value && ("_skip_check_" in value || MULTI_VALUE in value);
}
// 注入 hash 值
function injectSelectorHash(key, hashId, hashPriority = "high") {
	if (!hashId) {
		return key;
	}
	const hashSelector = where({
		a: hashId,
		b: hashPriority
	});
	// 注入 hashId
	const keys = key.split(",").map((k) => {
		const fullPath = k.trim().split(/\s+/);
		// 如果 Selector 第一个是 HTML Element，那我们就插到它的后面。反之，就插到最前面。
		let firstPath = fullPath[0] || "";
		const htmlElement = firstPath.match(/^\w+/)?.[0] || "";
		firstPath = `${htmlElement}${hashSelector}${firstPath.slice(htmlElement.length)}`;
		return [firstPath, ...fullPath.slice(1)].join(" ");
	});
	return keys.join(",");
}
// Parse CSSObject to style content
const parseStyle = (interpolation, config = {}, { root, injectHash, parentSelectors } = {
	root: true,
	parentSelectors: []
}) => {
	const { hashId, layer, hashPriority, transformers = [] } = config;
	let styleStr = "";
	let effectStyle = {};
	function parseKeyframes(keyframes) {
		const animationName = keyframes.getName(hashId);
		if (!effectStyle[animationName]) {
			const [parsedStr] = parseStyle(keyframes.style, config, {
				root: false,
				parentSelectors
			});
			effectStyle[animationName] = `@keyframes ${keyframes.getName(hashId)}${parsedStr}`;
		}
	}
	function flattenList(list, fullList = []) {
		list.forEach((item) => {
			if (Array.isArray(item)) {
				flattenList(item, fullList);
			} else if (item) {
				fullList.push(item);
			}
		});
		return fullList;
	}
	const flattenStyleList = flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]);
	flattenStyleList.forEach((originStyle) => {
		// Only root level can use raw string
		const style = typeof originStyle === "string" && !root ? {} : originStyle;
		if (typeof style === "string") {
			styleStr += `${style}
`;
		} else if (style._keyframe) {
			// Keyframe
			parseKeyframes(style);
		} else {
			const mergedStyle = transformers.reduce((prev, trans) => trans?.visit?.(prev) || prev, style);
			// Normal CSSObject
			Object.keys(mergedStyle).forEach((key) => {
				const value = mergedStyle[key];
				if (typeof value === "object" && value && (key !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
					let subInjectHash = false;
					// 当成嵌套对象来处理
					let mergedKey = key.trim();
					// Whether treat child as root. In most case it is false.
					let nextRoot = false;
					// 拆分多个选择器
					if ((root || injectHash) && hashId) {
						if (mergedKey.startsWith("@")) {
							// 略过媒体查询，交给子节点继续插入 hashId
							subInjectHash = true;
						} else if (mergedKey === "&") {
							// 抹掉 root selector 上的单个 &
							mergedKey = injectSelectorHash("", hashId, hashPriority);
						} else {
							// 注入 hashId
							mergedKey = injectSelectorHash(key, hashId, hashPriority);
						}
					} else if (root && !hashId && (mergedKey === "&" || mergedKey === "")) {
						// In case of `{ '&': { a: { color: 'red' } } }` or `{ '': { a: { color: 'red' } } }` without hashId,
						// we will get `&{a:{color:red;}}` or `{a:{color:red;}}` string for stylis to compile.
						// But it does not conform to stylis syntax,
						// and finally we will get `{color:red;}` as css, which is wrong.
						// So we need to remove key in root, and treat child `{ a: { color: 'red' } }` as root.
						mergedKey = "";
						nextRoot = true;
					}
					const [parsedStr, childEffectStyle] = parseStyle(value, config, {
						root: nextRoot,
						injectHash: subInjectHash,
						parentSelectors: [...parentSelectors, mergedKey]
					});
					effectStyle = {
						...effectStyle,
						...childEffectStyle
					};
					styleStr += `${mergedKey}${parsedStr}`;
				} else {
					function appendStyle(cssKey, cssValue) {
						// 如果是样式则直接插入
						const styleName = cssKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
						// Auto suffix with px
						let formatValue = cssValue;
						if (!unitless$1[cssKey] && typeof formatValue === "number" && formatValue !== 0) {
							formatValue = `${formatValue}px`;
						}
						// handle animationName & Keyframe value
						if (cssKey === "animationName" && cssValue?._keyframe) {
							parseKeyframes(cssValue);
							formatValue = cssValue.getName(hashId);
						}
						styleStr += `${styleName}:${formatValue};`;
					}
					const actualValue = value?.value ?? value;
					if (typeof value === "object" && value?.[MULTI_VALUE] && Array.isArray(actualValue)) {
						actualValue.forEach((item) => {
							appendStyle(key, item);
						});
					} else {
						if (isNonNullable$1(actualValue)) {
							appendStyle(key, actualValue);
						}
					}
				}
			});
		}
	});
	if (!root) {
		styleStr = `{${styleStr}}`;
	} else if (layer) {
		// fixme: https://github.com/thysultan/stylis/pull/339
		if (styleStr) {
			styleStr = `@layer ${layer.name} {${styleStr}}`;
		}
		if (layer.dependencies) {
			effectStyle[`@layer ${layer.name}`] = layer.dependencies.map((deps) => `@layer ${deps}, ${layer.name};`).join("\n");
		}
	}
	return [styleStr, effectStyle];
};
// ============================================================================
// ==                                Register                                ==
// ============================================================================
function uniqueHash(path, styleStr) {
	return murmur2(`${path.join("%")}${styleStr}`);
}
/**
* Register a style to the global style sheet.
*/
function useStyleRegister(info, styleFn) {
	const { path, hashId, layer, nonce, clientOnly, order = 0 } = info;
	const { hashPriority, container, transformers, linters, cache, layer: enableLayer, autoPrefix } = reactExports.z(StyleContext);
	const fullPath = [hashId || ""];
	if (enableLayer) {
		fullPath.push("layer");
	}
	fullPath.push(...path);
	// Check if need insert style
	let isMergedClientSide = isClientSide;
	useGlobalCache(
		"style",
		fullPath,
		// Create cache if needed
		() => {
			const cachePath = fullPath.join("|");
			// Get style from SSR inline style directly
			if (existPath(cachePath)) {
				const [inlineCacheStyleStr, styleHash] = getStyleAndHash(cachePath);
				if (inlineCacheStyleStr) {
					return [
						inlineCacheStyleStr,
						styleHash,
						{},
						clientOnly,
						order
					];
				}
			}
			// Generate style
			const styleObj = styleFn();
			const [parsedStyle, effectStyle] = parseStyle(styleObj, {
				hashId,
				hashPriority,
				layer: enableLayer ? layer : void 0,
				path: path.join("-"),
				transformers,
				linters
			});
			const styleStr = normalizeStyle(parsedStyle, autoPrefix || false);
			const styleId = uniqueHash(fullPath, styleStr);
			return [
				styleStr,
				styleId,
				effectStyle,
				clientOnly,
				order
			];
		},
		// Remove cache if no need
		() => 0,
		// Effect: Inject style here
		(cacheValue) => {
			const [styleStr, styleId, effectStyle, , priority] = cacheValue;
			if (isMergedClientSide && styleStr !== CSS_FILE_STYLE) {
				const mergedCSSConfig = {
					mark: ATTR_MARK,
					prepend: enableLayer ? false : "queue",
					attachTo: container,
					priority
				};
				const nonceStr = typeof nonce === "function" ? nonce() : nonce;
				if (nonceStr) {
					mergedCSSConfig.csp = { nonce: nonceStr };
				}
				// ================= Split Effect Style =================
				// We will split effectStyle here since @layer should be at the top level
				const effectLayerKeys = [];
				const effectRestKeys = [];
				Object.keys(effectStyle).forEach((key) => {
					if (key.startsWith("@layer")) {
						effectLayerKeys.push(key);
					} else {
						effectRestKeys.push(key);
					}
				});
				// ================= Inject Layer Style =================
				// Inject layer style
				effectLayerKeys.forEach((effectKey) => {
					updateCSS(normalizeStyle(effectStyle[effectKey], autoPrefix || false), `_layer-${effectKey}`, {
						...mergedCSSConfig,
						prepend: true
					});
				});
				// ==================== Inject Style ====================
				// Inject style
				const style = updateCSS(styleStr, styleId, mergedCSSConfig);
				style[CSS_IN_JS_INSTANCE] = cache.instanceId;
				// ================ Inject Effect Style =================
				// Inject client side effect style
				effectRestKeys.forEach((effectKey) => {
					updateCSS(normalizeStyle(effectStyle[effectKey], autoPrefix || false), `_effect-${effectKey}`, mergedCSSConfig);
				});
			}
		}
	);
}
const useCSSVarRegister = (config, fn) => {
	const { a: key, b: prefix, c: unitless, d: ignore, e: token, f: scope = "" } = config;
	const { cache: { instanceId }, container, hashPriority } = reactExports.z(StyleContext);
	const { _tokenKey: tokenKey } = token;
	const stylePath = [
		...config.g,
		key,
		scope,
		tokenKey
	];
	const __unused_403A = useGlobalCache("cssVar", stylePath, () => {
		const originToken = fn();
		const [mergedToken, cssVarsStr] = transformToken(originToken, key, {
			c: prefix,
			d: unitless,
			e: ignore,
			f: scope,
			b: hashPriority,
			a: void 0
		});
		const styleId = uniqueHash(stylePath, cssVarsStr);
		return [
			mergedToken,
			cssVarsStr,
			styleId,
			key
		];
	}, ([, , styleId]) => {
		if (isClientSide) {
			removeCSS(styleId, {
				mark: ATTR_MARK,
				attachTo: container
			});
		}
	}, ([, cssVarsStr, styleId]) => {
		if (!cssVarsStr) {
			return;
		}
		const style = updateCSS(cssVarsStr, styleId, {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		});
		style[CSS_IN_JS_INSTANCE] = instanceId;
		// Used for `useCacheToken` to remove on batch when token removed
		style.setAttribute(ATTR_TOKEN, key);
	});
	return;
};
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = function(o) {
		return typeof o;
	}, _typeof(o);
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			{
				i = (t = t.call(r)).next;
				for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true);
			}
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function toPrimitive(t) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, "string");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return String(t);
}
function toPropertyKey(t) {
	var i = toPrimitive(t);
	return "symbol" == _typeof(i) ? i : i + "";
}
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), true).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
	}
}
function _createClass(e, r) {
	return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e;
	}, _setPrototypeOf(t, e);
}
function _inherits(t, e) {
	t.prototype = Object.create(e.prototype, { constructor: {
		value: t,
		writable: true,
		configurable: true
	} }), Object.defineProperty(t, "prototype", { writable: false }), _setPrototypeOf(t, e);
}
function _getPrototypeOf(t) {
	return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf(t);
}
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch {}
	return (_isNativeReflectConstruct = function() {
		return !!t;
	})();
}
function _possibleConstructorReturn(t, e) {
	if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(t);
}
function _createSuper(t) {
	var r = _isNativeReflectConstruct();
	return function() {
		var e, o = _getPrototypeOf(t);
		if (r) {
			var s = _getPrototypeOf(this).constructor;
			e = Reflect.construct(o, arguments, s);
		} else e = o.apply(this, arguments);
		return _possibleConstructorReturn(this, e);
	};
}
var AbstractCalculator = _createClass(function AbstractCalculator() {
	_classCallCheck(this, AbstractCalculator);
});
var AbstractCalculator$1 = AbstractCalculator;
var regexp = new RegExp("CALC_UNIT", "g");
function unit(value) {
	if (typeof value === "number") {
		return "".concat(value).concat("CALC_UNIT");
	}
	return value;
}
var CSSCalculator = function(_AbstractCalculator) {
	_inherits(CSSCalculator, _AbstractCalculator);
	var _super = _createSuper(CSSCalculator);
	function CSSCalculator(num, unitlessCssVar) {
		var _this;
		_classCallCheck(this, CSSCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", "");
		_defineProperty(_assertThisInitialized(_this), "unitlessCssVar", void 0);
		_defineProperty(_assertThisInitialized(_this), "lowPriority", void 0);
		var numType = _typeof(num);
		_this.unitlessCssVar = unitlessCssVar;
		if (num instanceof CSSCalculator) {
			_this.result = "(".concat(num.result, ")");
		} else if (numType === "number") {
			_this.result = unit(num);
		} else if (numType === "string") {
			_this.result = num;
		}
		return _this;
	}
	_createClass(CSSCalculator, [
		{
			key: "add",
			value: function(num) {
				if (num instanceof CSSCalculator) {
					this.result = "".concat(this.result, " + ").concat(num.getResult());
				} else if (typeof num === "number" || typeof num === "string") {
					this.result = "".concat(this.result, " + ").concat(unit(num));
				}
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "sub",
			value: function(num) {
				if (num instanceof CSSCalculator) {
					this.result = "".concat(this.result, " - ").concat(num.getResult());
				} else if (typeof num === "number" || typeof num === "string") {
					this.result = "".concat(this.result, " - ").concat(unit(num));
				}
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "mul",
			value: function(num) {
				if (this.lowPriority) {
					this.result = "(".concat(this.result, ")");
				}
				if (num instanceof CSSCalculator) {
					this.result = "".concat(this.result, " * ").concat(num.getResult(true));
				} else if (typeof num === "number" || typeof num === "string") {
					this.result = "".concat(this.result, " * ").concat(num);
				}
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "div",
			value: function(num) {
				if (this.lowPriority) {
					this.result = "(".concat(this.result, ")");
				}
				if (num instanceof CSSCalculator) {
					this.result = "".concat(this.result, " / ").concat(num.getResult(true));
				} else if (typeof num === "number" || typeof num === "string") {
					this.result = "".concat(this.result, " / ").concat(num);
				}
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "getResult",
			value: function(force) {
				return this.lowPriority || force ? "(".concat(this.result, ")") : this.result;
			}
		},
		{
			key: "equal",
			value: function(options) {
				var _this2 = this;
				var _ref = options || {}, cssUnit = _ref.unit;
				var mergedUnit = true;
				if (typeof cssUnit === "boolean") {
					mergedUnit = cssUnit;
				} else if (Array.from(this.unitlessCssVar).some(function(cssVar) {
					return _this2.result.includes(cssVar);
				})) {
					mergedUnit = false;
				}
				this.result = this.result.replace(regexp, mergedUnit ? "px" : "");
				if (typeof this.lowPriority !== "undefined") {
					return "calc(".concat(this.result, ")");
				}
				return this.result;
			}
		}
	]);
	return CSSCalculator;
}(AbstractCalculator$1);
var __unused_76FD = function(_AbstractCalculator) {
	_inherits(NumCalculator, _AbstractCalculator);
	var _super = _createSuper(NumCalculator);
	function NumCalculator(num) {
		var _this;
		_classCallCheck(this, NumCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", 0);
		if (num instanceof NumCalculator) {
			_this.result = num.result;
		} else if (typeof num === "number") {
			_this.result = num;
		}
		return _this;
	}
	_createClass(NumCalculator, [
		{
			key: "add",
			value: function(num) {
				if (num instanceof NumCalculator) {
					this.result += num.result;
				} else if (typeof num === "number") {
					this.result += num;
				}
				return this;
			}
		},
		{
			key: "sub",
			value: function(num) {
				if (num instanceof NumCalculator) {
					this.result -= num.result;
				} else if (typeof num === "number") {
					this.result -= num;
				}
				return this;
			}
		},
		{
			key: "mul",
			value: function(num) {
				if (num instanceof NumCalculator) {
					this.result *= num.result;
				} else if (typeof num === "number") {
					this.result *= num;
				}
				return this;
			}
		},
		{
			key: "div",
			value: function(num) {
				if (num instanceof NumCalculator) {
					this.result /= num.result;
				} else if (typeof num === "number") {
					this.result /= num;
				}
				return this;
			}
		},
		{
			key: "equal",
			value: function() {
				return this.result;
			}
		}
	]);
	return;
}(AbstractCalculator$1);
var genCalc = function(__unused_F7FC, unitlessCssVar) {
	var Calculator = CSSCalculator;
	return function(num) {
		return new Calculator(num, unitlessCssVar);
	};
};
var genCalc$1 = genCalc;
var getCompVarPrefix = function(component, prefix) {
	return "".concat([prefix, component.replace(/([A-Z]+)([A-Z][a-z]+)/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2")].filter(Boolean).join("-"));
};
var getCompVarPrefix$1 = getCompVarPrefix;
function getComponentToken(component, token, defaultToken, options) {
	var customToken = _objectSpread2({}, token[component]);
	if (options !== null && true && options.deprecatedTokens) {
		var deprecatedTokens = options.deprecatedTokens;
		deprecatedTokens.forEach(function(_ref) {
			var _ref2 = _slicedToArray(_ref, 2), oldTokenKey = _ref2[0], newTokenKey = _ref2[1];
			// Should wrap with `if` clause, or there will be `undefined` in object.
			if (customToken !== null && customToken !== void 0 && customToken[oldTokenKey] || customToken !== null && customToken !== void 0 && customToken[newTokenKey]) {
				var _customToken$newToken;
				(_customToken$newToken = customToken[newTokenKey]) !== null && _customToken$newToken !== void 0 || (customToken[newTokenKey] = customToken === null || customToken === void 0 ? void 0 : customToken[oldTokenKey]);
			}
		});
	}
	var mergedToken = _objectSpread2(_objectSpread2({}, defaultToken), customToken);
	// Remove same value as global token to minimize size
	Object.keys(mergedToken).forEach(function(key) {
		if (mergedToken[key] === token[key]) {
			delete mergedToken[key];
		}
	});
	return mergedToken;
}
var enableStatistic = typeof CSSINJS_STATISTIC !== "undefined";
var recording = true;
/**
* This function will do as `Object.assign` in production. But will use Object.defineProperty:get to
* pass all value access in development. To support statistic field usage with alias token.
*/
function merge() {
	for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
		objs[_key] = arguments[_key];
	}
	/* istanbul ignore next */
	if (!enableStatistic) {
		return Object.assign.apply(0, [{}].concat(objs));
	}
	recording = false;
	var ret = {};
	objs.forEach(function(obj) {
		if (_typeof(obj) !== "object") {
			return;
		}
		var keys = Object.keys(obj);
		keys.forEach(function(key) {
			Object.defineProperty(ret, key, {
				configurable: true,
				enumerable: true,
				get: function() {
					return obj[key];
				}
			});
		});
	});
	recording = true;
	return ret;
}
/** @internal Internal Usage. Not use in your production. */
var statistic = {};
/* istanbul ignore next */
function noop() {}
/** Statistic token usage case. Should use `merge` function if you do not want spread record. */
var statisticToken = function(token) {
	var tokenKeys;
	var proxy = token;
	var flush = noop;
	if (enableStatistic && true) {
		tokenKeys = new Set();
		proxy = new Proxy(token, { get: function(obj, prop) {
			if (recording) {
				var _tokenKeys;
				(_tokenKeys = tokenKeys) === null || _tokenKeys === void 0 || _tokenKeys.add(prop);
			}
			return obj[prop];
		} });
		flush = function(componentName, componentToken) {
			var _statistic$componentN;
			statistic[componentName] = {
				global: Array.from(tokenKeys),
				component: _objectSpread2(_objectSpread2({}, (_statistic$componentN = statistic[componentName]) === null || _statistic$componentN === void 0 ? void 0 : _statistic$componentN.component), componentToken)
			};
		};
	}
	return {
		a: proxy,
		b: flush
	};
};
var statisticToken$1 = statisticToken;
function getDefaultComponentToken(component, token, getDefaultToken) {
	if (typeof getDefaultToken === "function") {
		var _token$component;
		return getDefaultToken(merge(token, (_token$component = token[component]) !== null && _token$component !== void 0 ? _token$component : {}));
	}
	return getDefaultToken !== null && getDefaultToken !== void 0 ? getDefaultToken : {};
}
function genMaxMin() {
	return {
		a: function() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}
			return "max(".concat(args.map(function(value) {
				return unit$1(value);
			}).join(","), ")");
		},
		b: function() {
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}
			return "min(".concat(args.map(function(value) {
				return unit$1(value);
			}).join(","), ")");
		}
	};
}
/**
* A helper class to map keys to values.
* It supports both primitive keys and object keys.
*/
var ArrayKeyMap = function() {
	function ArrayKeyMap() {
		_classCallCheck(this, ArrayKeyMap);
		_defineProperty(this, "map", new Map());
		// Use WeakMap to avoid memory leak
		_defineProperty(this, "objectIDMap", new WeakMap());
		_defineProperty(this, "nextID", 0);
		_defineProperty(this, "lastAccessBeat", new Map());
		// We will clean up the cache when reach the limit
		_defineProperty(this, "accessBeat", 0);
	}
	_createClass(ArrayKeyMap, [
		{
			key: "set",
			value: function(keys, value) {
				// New set will trigger clear
				this.clear();
				// Set logic
				var compositeKey = this.getCompositeKey(keys);
				this.map.set(compositeKey, value);
				this.lastAccessBeat.set(compositeKey, Date.now());
			}
		},
		{
			key: "get",
			value: function(keys) {
				var compositeKey = this.getCompositeKey(keys);
				var cache = this.map.get(compositeKey);
				this.lastAccessBeat.set(compositeKey, Date.now());
				this.accessBeat += 1;
				return cache;
			}
		},
		{
			key: "getCompositeKey",
			value: function(keys) {
				var _this = this;
				var ids = keys.map(function(key) {
					if (key && _typeof(key) === "object") {
						return "obj_".concat(_this.getObjectID(key));
					}
					return "".concat(_typeof(key), "_").concat(key);
				});
				return ids.join("|");
			}
		},
		{
			key: "getObjectID",
			value: function(obj) {
				if (this.objectIDMap.has(obj)) {
					return this.objectIDMap.get(obj);
				}
				var id = this.nextID;
				this.objectIDMap.set(obj, id);
				this.nextID += 1;
				return id;
			}
		},
		{
			key: "clear",
			value: function() {
				var _this2 = this;
				if (this.accessBeat > 1e4) {
					var now = Date.now();
					this.lastAccessBeat.forEach(function(beat, key) {
						if (now - beat > 6e5) {
							_this2.map.delete(key);
							_this2.lastAccessBeat.delete(key);
						}
					});
					this.accessBeat = 0;
				}
			}
		}
	]);
	return ArrayKeyMap;
}();
var uniqueMap = new ArrayKeyMap();
/**
* Like `useMemo`, but this hook result will be shared across all instances.
*/
function useUniqueMemo(memoFn, deps) {
	return React.I(function() {
		var cachedValue = uniqueMap.get(deps);
		if (cachedValue) {
			return cachedValue;
		}
		var newValue = memoFn();
		uniqueMap.set(deps, newValue);
		return newValue;
	}, deps);
}
function genStyleUtils(config) {
	// Dependency inversion for preparing basic config.
	var _config$useCSP = config.a, useCSP = _config$useCSP, useToken = config.b, usePrefix = config.c, getResetStyles = config.d, getCommonStyle = config.e, getCompUnitless = config.f;
	function genStyleHooks(__unused_4FFA, styleFn, getDefaultToken, options) {
		var componentName = Array.isArray("Button") ? "B" : "Button";
		function prefixToken(key) {
			return "".concat(String(componentName)).concat(key.slice(0, 1).toUpperCase()).concat(key.slice(1));
		}
		// Fill unitless
		var originUnitless = (options === null || false ? void 0 : options.unitless) || {};
		var originCompUnitless = getCompUnitless();
		var compUnitless = _objectSpread2(_objectSpread2({}, originCompUnitless), {}, _defineProperty({}, prefixToken("zIndexPopup"), true));
		Object.keys(originUnitless).forEach(function(key) {
			compUnitless[prefixToken(key)] = originUnitless[key];
		});
		// Options
		var mergedOptions = _objectSpread2(_objectSpread2({}, options), {}, {
			unitless: compUnitless,
			prefixToken
		});
		// Hooks
		var useStyle = genComponentStyleHook("Button", styleFn, getDefaultToken, mergedOptions);
		var useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);
		return function(prefixCls) {
			var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
			var hashId = useStyle(prefixCls, rootCls);
			var cssVarCls = useCSSVar(rootCls);
			return [hashId, cssVarCls];
		};
	}
	function genCSSVarRegister(component, getDefaultToken, options) {
		var compUnitless = options.unitless, prefixToken = options.prefixToken, ignore = options.ignore;
		return function(rootCls) {
			var _useToken = useToken(), cssVar = _useToken.a, realToken = _useToken.b;
			useCSSVarRegister({
				g: [component],
				b: cssVar.prefix,
				a: cssVar.key,
				c: compUnitless,
				d: ignore,
				e: realToken,
				f: rootCls
			}, function() {
				var defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentToken = getComponentToken(component, realToken, defaultToken, { deprecatedTokens: options === null || options === void 0 ? void 0 : options.deprecatedTokens });
				if (defaultToken) {
					Object.keys(defaultToken).forEach(function(key) {
						componentToken[prefixToken(key)] = componentToken[key];
						delete componentToken[key];
					});
				}
				return componentToken;
			});
			return cssVar === null || false ? void 0 : cssVar.key;
		};
	}
	function genComponentStyleHook(componentName, styleFn, getDefaultToken) {
		var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		var cells = Array.isArray(componentName) ? componentName : [componentName, componentName];
		var _cells = _slicedToArray(cells, 1), component = _cells[0];
		var concatComponent = cells.join("-");
		var mergedLayer = { name: "antd" };
		// Return new style hook
		return function(prefixCls) {
			var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
			var _useToken2 = useToken(), theme = _useToken2.c, realToken = _useToken2.b, hashId = _useToken2.d, token = _useToken2.e, cssVar = _useToken2.a, zeroRuntime = _useToken2.f;
			// Update of `disabledRuntimeStyle` would cause React hook error, so memoized it and never update.
			var memoizedZeroRuntime = reactExports.I(function() {
				return zeroRuntime;
			}, []);
			if (memoizedZeroRuntime) {
				return hashId;
			}
			var _usePrefix = usePrefix(), rootPrefixCls = _usePrefix.a, iconPrefixCls = _usePrefix.b;
			var csp = useCSP();
			// Use unique memo to share the result across all instances
			var calc = useUniqueMemo(function() {
				var unitlessCssVar = new Set();
				Object.keys(options.unitless || {}).forEach(function(key) {
					// Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
					// We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
					unitlessCssVar.add(token2CSSVar(key, cssVar.prefix));
					unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix$1(component, cssVar.prefix)));
				});
				return genCalc$1(0, unitlessCssVar);
			}, [
				"css",
				component,
				cssVar === null || false ? void 0 : cssVar.prefix
			]);
			var _genMaxMin = genMaxMin(), max = _genMaxMin.a, min = _genMaxMin.b;
			// Shared config
			var sharedConfig = {
				theme,
				token,
				hashId,
				nonce: function() {
					return csp.nonce;
				},
				clientOnly: options.clientOnly,
				layer: mergedLayer,
				order: options.order || -999
			};
			// This if statement is safe, as it will only be used if the generator has the function. It's not dynamic.
			{
				{
					// Generate style for all need reset tags.
					useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
						clientOnly: false,
						path: ["Shared", rootPrefixCls]
					}), function() {
						return getResetStyles(token, { a: { a: iconPrefixCls } });
					});
				}
			}
			useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, { path: [
				concatComponent,
				prefixCls,
				iconPrefixCls
			] }), function() {
				if (options.injectStyle === false) {
					return [];
				}
				var _statisticToken = statisticToken$1(token), proxyToken = _statisticToken.a, flush = _statisticToken.b;
				var defaultComponentToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentCls = ".".concat(prefixCls);
				var componentToken = getComponentToken(component, realToken, defaultComponentToken, { deprecatedTokens: options.deprecatedTokens });
				if (defaultComponentToken && _typeof(defaultComponentToken) === "object") {
					Object.keys(defaultComponentToken).forEach(function(key) {
						defaultComponentToken[key] = "var(".concat(token2CSSVar(key, getCompVarPrefix$1(component, cssVar.prefix)), ")");
					});
				}
				var mergedToken = merge(proxyToken, {
					componentCls,
					prefixCls,
					iconCls: ".".concat(iconPrefixCls),
					antCls: ".".concat(rootPrefixCls),
					calc,
					max,
					min
				}, defaultComponentToken);
				var styleInterpolation = styleFn(mergedToken, {
					hashId,
					prefixCls,
					rootPrefixCls,
					iconPrefixCls
				});
				flush(component, componentToken);
				var commonStyle = getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont);
				return [options.resetStyle === false ? null : commonStyle, styleInterpolation];
			});
			return hashId;
		};
	}
	function genSubStyleComponent(componentName, styleFn, getDefaultToken) {
		var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		var useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, _objectSpread2({
			resetStyle: false,
			order: -998
		}, options));
		var StyledComponent = function(_ref) {
			var prefixCls = _ref.prefixCls, _ref$rootCls = _ref.rootCls, rootCls = _ref$rootCls === void 0 ? prefixCls : _ref$rootCls;
			useStyle(prefixCls, rootCls);
			return null;
		};
		return StyledComponent;
	}
	return {
		a: genStyleHooks,
		b: genSubStyleComponent,
		c: genComponentStyleHook
	};
}
const PresetColors = [
	"blue",
	"purple",
	"cyan",
	"green",
	"magenta",
	"pink",
	"red",
	"orange",
	"yellow",
	"volcano",
	"geekblue",
	"lime",
	"gold"
];
function getLineHeight(fontSize) {
	return (fontSize + 8) / fontSize;
}
// https://zhuanlan.zhihu.com/p/32746810
function getFontSizes(base) {
	const fontSizes = Array.from({ length: 10 }).map((__unused_8C62, index) => {
		const i = index - 1;
		const baseSize = base * Math.E ** (i / 5);
		const intSize = index > 1 ? Math.floor(baseSize) : Math.ceil(baseSize);
		// Convert to even
		return Math.floor(intSize / 2) * 2;
	});
	fontSizes[1] = base;
	return fontSizes.map((size) => ({
		size,
		lineHeight: getLineHeight(size)
	}));
}
const defaultPresetColors = {
	blue: "#1677FF",
	purple: "#722ED1",
	cyan: "#13C2C2",
	green: "#52C41A",
	magenta: "#EB2F96",
	pink: "#EB2F96",
	red: "#F5222D",
	orange: "#FA8C16",
	yellow: "#FADB14",
	volcano: "#FA541C",
	geekblue: "#2F54EB",
	gold: "#FAAD14",
	lime: "#A0D911"
};
const seedToken = {
	...defaultPresetColors,
	colorPrimary: "#1677ff",
	colorSuccess: "#52c41a",
	colorWarning: "#faad14",
	colorError: "#ff4d4f",
	colorInfo: "#1677ff",
	colorLink: "",
	colorTextBase: "",
	colorBgBase: "",
	fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'",
	fontFamilyCode: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
	fontSize: 14,
	lineWidth: 1,
	lineType: "solid",
	motionUnit: .1,
	motionBase: 0,
	motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
	motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
	motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
	motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
	motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
	motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
	motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
	motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
	borderRadius: 6,
	sizeUnit: 4,
	sizeStep: 4,
	sizePopupArrow: 16,
	controlHeight: 32,
	zIndexBase: 0,
	zIndexPopupBase: 1e3,
	opacityImage: 1,
	wireframe: false,
	motion: true
};
// 36 Hex to reduce the size of the file
var presetColors = {
	aliceblue: "9ehhb",
	antiquewhite: "9sgk7",
	aqua: "1ekf",
	aquamarine: "4zsno",
	azure: "9eiv3",
	beige: "9lhp8",
	bisque: "9zg04",
	black: "0",
	blanchedalmond: "9zhe5",
	blue: "73",
	blueviolet: "5e31e",
	brown: "6g016",
	burlywood: "8ouiv",
	cadetblue: "3qba8",
	chartreuse: "4zshs",
	chocolate: "87k0u",
	coral: "9yvyo",
	cornflowerblue: "3xael",
	cornsilk: "9zjz0",
	crimson: "8l4xo",
	cyan: "1ekf",
	darkblue: "3v",
	darkcyan: "rkb",
	darkgoldenrod: "776yz",
	darkgray: "6mbhl",
	darkgreen: "jr4",
	darkgrey: "6mbhl",
	darkkhaki: "7ehkb",
	darkmagenta: "5f91n",
	darkolivegreen: "3bzfz",
	darkorange: "9yygw",
	darkorchid: "5z6x8",
	darkred: "5f8xs",
	darksalmon: "9441m",
	darkseagreen: "5lwgf",
	darkslateblue: "2th1n",
	darkslategray: "1ugcv",
	darkslategrey: "1ugcv",
	darkturquoise: "14up",
	darkviolet: "5rw7n",
	deeppink: "9yavn",
	deepskyblue: "11xb",
	dimgray: "442g9",
	dimgrey: "442g9",
	dodgerblue: "16xof",
	firebrick: "6y7tu",
	floralwhite: "9zkds",
	forestgreen: "1cisi",
	fuchsia: "9y70f",
	gainsboro: "8m8kc",
	ghostwhite: "9pq0v",
	goldenrod: "8j4f4",
	gold: "9zda8",
	gray: "50i2o",
	green: "pa8",
	greenyellow: "6senj",
	grey: "50i2o",
	honeydew: "9eiuo",
	hotpink: "9yrp0",
	indianred: "80gnw",
	indigo: "2xcoy",
	ivory: "9zldc",
	khaki: "9edu4",
	lavenderblush: "9ziet",
	lavender: "90c8q",
	lawngreen: "4vk74",
	lemonchiffon: "9zkct",
	lightblue: "6s73a",
	lightcoral: "9dtog",
	lightcyan: "8s1rz",
	lightgoldenrodyellow: "9sjiq",
	lightgray: "89jo3",
	lightgreen: "5nkwg",
	lightgrey: "89jo3",
	lightpink: "9z6wx",
	lightsalmon: "9z2ii",
	lightseagreen: "19xgq",
	lightskyblue: "5arju",
	lightslategray: "4nwk9",
	lightslategrey: "4nwk9",
	lightsteelblue: "6wau6",
	lightyellow: "9zlcw",
	lime: "1edc",
	limegreen: "1zcxe",
	linen: "9shk6",
	magenta: "9y70f",
	maroon: "4zsow",
	mediumaquamarine: "40eju",
	mediumblue: "5p",
	mediumorchid: "79qkz",
	mediumpurple: "5r3rv",
	mediumseagreen: "2d9ip",
	mediumslateblue: "4tcku",
	mediumspringgreen: "1di2",
	mediumturquoise: "2uabw",
	mediumvioletred: "7rn9h",
	midnightblue: "z980",
	mintcream: "9ljp6",
	mistyrose: "9zg0x",
	moccasin: "9zfzp",
	navajowhite: "9zest",
	navy: "3k",
	oldlace: "9wq92",
	olive: "50hz4",
	olivedrab: "472ub",
	orange: "9z3eo",
	orangered: "9ykg0",
	orchid: "8iu3a",
	palegoldenrod: "9bl4a",
	palegreen: "5yw0o",
	paleturquoise: "6v4ku",
	palevioletred: "8k8lv",
	papayawhip: "9zi6t",
	peachpuff: "9ze0p",
	peru: "80oqn",
	pink: "9z8wb",
	plum: "8nba5",
	powderblue: "6wgdi",
	purple: "4zssg",
	rebeccapurple: "3zk49",
	red: "9y6tc",
	rosybrown: "7cv4f",
	royalblue: "2jvtt",
	saddlebrown: "5fmkz",
	salmon: "9rvci",
	sandybrown: "9jn1c",
	seagreen: "1tdnb",
	seashell: "9zje6",
	sienna: "6973h",
	silver: "7ir40",
	skyblue: "5arjf",
	slateblue: "45e4t",
	slategray: "4e100",
	slategrey: "4e100",
	snow: "9zke2",
	springgreen: "1egv",
	steelblue: "2r1kk",
	tan: "87yx8",
	teal: "pds",
	thistle: "8ggk8",
	tomato: "9yqfb",
	turquoise: "2j4r4",
	violet: "9b10u",
	wheat: "9ld4j",
	white: "9zldr",
	whitesmoke: "9lhpx",
	yellow: "9zl6o",
	yellowgreen: "61fzm"
};
const round = Math.round;
/**
* Support format, alpha unit will check the % mark:
* - rgba(102, 204, 255, .5)      -> [102, 204, 255, 0.5]
* - rgb(102 204 255 / .5)        -> [102, 204, 255, 0.5]
* - rgb(100%, 50%, 0% / 50%)     -> [255, 128, 0, 0.5]
* - hsl(270, 60, 40, .5)         -> [270, 60, 40, 0.5]
* - hsl(270deg 60% 40% / 50%)   -> [270, 60, 40, 0.5]
*
* When `base` is provided, the percentage value will be divided by `base`.
*/
function splitColorStr(str, parseNum) {
	const match = str.replace(/^[^(]*\((.*)/, "$1").replace(/\).*/, "").match(/\d*\.?\d+%?/g) || [];
	const numList = match.map((item) => parseFloat(item));
	for (let i = 0; i < 3; i += 1) {
		numList[i] = parseNum(numList[i] || 0, match[i] || "", i);
	}
	// For alpha. 50% should be 0.5
	if (match[3]) {
		numList[3] = match[3].includes("%") ? numList[3] / 100 : numList[3];
	} else {
		// By default, alpha is 1
		numList[3] = 1;
	}
	return numList;
}
const parseHSVorHSL = (num, __unused_387B, index) => index === 0 ? num : num / 100;
/** round and limit number to integer between 0-255 */
function limitRange(value, max) {
	const mergedMax = max || 255;
	if (value > mergedMax) {
		return mergedMax;
	}
	if (value < 0) {
		return 0;
	}
	return value;
}
class FastColor {
	/**
	* All FastColor objects are valid. So isValid is always true. This property is kept to be compatible with TinyColor.
	*/
	isValid = true;
	/**
	* Red, R in RGB
	*/
	r = 0;
	/**
	* Green, G in RGB
	*/
	g = 0;
	/**
	* Blue, B in RGB
	*/
	b = 0;
	/**
	* Alpha/Opacity, A in RGBA/HSLA
	*/
	a = 1;
	constructor(input) {
		/**
		* Always check 3 char in the object to determine the format.
		* We not use function in check to save bundle size.
		* e.g. 'rgb' -> { r: 0, g: 0, b: 0 }.
		*/
		function matchFormat(str) {
			return str[0] in input && str[1] in input && str[2] in input;
		}
		if (!!input) if (typeof input === "string") {
			const trimStr = input.trim();
			function matchPrefix(prefix) {
				return trimStr.startsWith(prefix);
			}
			if (/^#?[A-F\d]{3,8}$/i.test(trimStr)) {
				this.fromHexString(trimStr);
			} else if (matchPrefix("rgb")) {
				this.fromRgbString(trimStr);
			} else if (matchPrefix("hsl")) {
				this.fromHslString(trimStr);
			} else if (matchPrefix("hsv") || matchPrefix("hsb")) {
				this.fromHsvString(trimStr);
			} else {
				// From preset color
				const presetColor = presetColors[trimStr.toLowerCase()];
				if (presetColor) {
					this.fromHexString(
						// Convert 36 hex to 16 hex
						parseInt(presetColor, 36).toString(16).padStart(6, "0")
					);
				}
			}
		} else if (input instanceof FastColor) {
			this.r = input.r;
			this.g = input.g;
			this.b = input.b;
			this.a = input.a;
			this._h = input._h;
			this._hsl_s = input._hsl_s;
			this._hsv_s = input._hsv_s;
			this._l = input._l;
			this._v = input._v;
		} else if (matchFormat("rgb")) {
			this.r = limitRange(input.r);
			this.g = limitRange(input.g);
			this.b = limitRange(input.b);
			this.a = typeof input.a === "number" ? limitRange(input.a, 1) : 1;
		} else if (matchFormat("hsl")) {
			this.fromHsl(input);
		} else if (matchFormat("hsv")) {
			this.fromHsv(input);
		} else {
			throw new Error("@ant-design/fast-color: unsupported input " + JSON.stringify(input));
		}
	}
	// ======================= Setter =======================
	setR(value) {
		return this._sc("r", value);
	}
	setG(value) {
		return this._sc("g", value);
	}
	setB(value) {
		return this._sc("b", value);
	}
	setA(value) {
		return this._sc("a", value, 1);
	}
	setHue(value) {
		const hsv = this.toHsv();
		hsv.h = value;
		return this._c(hsv);
	}
	// ======================= Getter =======================
	/**
	* Returns the perceived luminance of a color, from 0-1.
	* @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	*/
	getLuminance() {
		function adjustGamma(raw) {
			const val = raw / 255;
			return val <= .03928 ? val / 12.92 : Math.pow((val + .055) / 1.055, 2.4);
		}
		const R = adjustGamma(this.r);
		const G = adjustGamma(this.g);
		const B = adjustGamma(this.b);
		return .2126 * R + .7152 * G + .0722 * B;
	}
	getHue() {
		if (typeof this._h === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) {
				this._h = 0;
			} else {
				this._h = round(60 * (this.r === this.getMax() ? (this.g - this.b) / delta + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / delta + 2 : (this.r - this.g) / delta + 4));
			}
		}
		return this._h;
	}
	/**
	* @deprecated should use getHSVSaturation or getHSLSaturation instead
	*/
	getSaturation() {
		return this.getHSVSaturation();
	}
	getHSVSaturation() {
		if (typeof this._hsv_s === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) {
				this._hsv_s = 0;
			} else {
				this._hsv_s = delta / this.getMax();
			}
		}
		return this._hsv_s;
	}
	getHSLSaturation() {
		if (typeof this._hsl_s === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) {
				this._hsl_s = 0;
			} else {
				const l = this.getLightness();
				this._hsl_s = delta / 255 / (1 - Math.abs(2 * l - 1));
			}
		}
		return this._hsl_s;
	}
	getLightness() {
		if (typeof this._l === "undefined") {
			this._l = (this.getMax() + this.getMin()) / 510;
		}
		return this._l;
	}
	getValue() {
		if (typeof this._v === "undefined") {
			this._v = this.getMax() / 255;
		}
		return this._v;
	}
	/**
	* Returns the perceived brightness of the color, from 0-255.
	* Note: this is not the b of HSB
	* @see http://www.w3.org/TR/AERT#color-contrast
	*/
	getBrightness() {
		if (typeof this._brightness === "undefined") {
			this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1e3;
		}
		return this._brightness;
	}
	// ======================== Func ========================
	darken(amount = 10) {
		const h = this.getHue();
		const s = this.getSaturation();
		let l = this.getLightness() - amount / 100;
		if (l < 0) {
			l = 0;
		}
		return this._c({
			h,
			s,
			l,
			a: this.a
		});
	}
	lighten(amount = 10) {
		const h = this.getHue();
		const s = this.getSaturation();
		let l = this.getLightness() + amount / 100;
		if (l > 1) {
			l = 1;
		}
		return this._c({
			h,
			s,
			l,
			a: this.a
		});
	}
	/**
	* Mix the current color a given amount with another color, from 0 to 100.
	* 0 means no mixing (return current color).
	*/
	mix(input, amount = 50) {
		const color = this._c(input);
		const p = amount / 100;
		const calc = (key) => (color[key] - this[key]) * p + this[key];
		const rgba = {
			r: round(calc("r")),
			g: round(calc("g")),
			b: round(calc("b")),
			a: round(calc("a") * 100) / 100
		};
		return this._c(rgba);
	}
	/**
	* Mix the color with pure white, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return white.
	*/
	tint(amount = 10) {
		return this.mix({
			r: 255,
			g: 255,
			b: 255,
			a: 1
		}, amount);
	}
	/**
	* Mix the color with pure black, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return black.
	*/
	shade(amount = 10) {
		return this.mix({
			r: 0,
			g: 0,
			b: 0,
			a: 1
		}, amount);
	}
	onBackground(background) {
		const bg = this._c(background);
		const alpha = this.a + bg.a * (1 - this.a);
		const calc = (key) => {
			return round((this[key] * this.a + bg[key] * bg.a * (1 - this.a)) / alpha);
		};
		return this._c({
			r: calc("r"),
			g: calc("g"),
			b: calc("b"),
			a: alpha
		});
	}
	// ======================= Status =======================
	isDark() {
		return this.getBrightness() < 128;
	}
	isLight() {
		return this.getBrightness() >= 128;
	}
	// ======================== MISC ========================
	equals(other) {
		return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
	}
	clone() {
		return this._c(this);
	}
	// ======================= Format =======================
	toHexString() {
		let hex = "#";
		const rHex = (this.r || 0).toString(16);
		hex += rHex.length === 2 ? rHex : "0" + rHex;
		const gHex = (this.g || 0).toString(16);
		hex += gHex.length === 2 ? gHex : "0" + gHex;
		const bHex = (this.b || 0).toString(16);
		hex += bHex.length === 2 ? bHex : "0" + bHex;
		if (typeof this.a === "number" && this.a >= 0 && this.a < 1) {
			const aHex = round(this.a * 255).toString(16);
			hex += aHex.length === 2 ? aHex : "0" + aHex;
		}
		return hex;
	}
	/** CSS support color pattern */
	toHsl() {
		return {
			h: this.getHue(),
			s: this.getHSLSaturation(),
			l: this.getLightness(),
			a: this.a
		};
	}
	/** CSS support color pattern */
	toHslString() {
		const h = this.getHue();
		const s = round(this.getHSLSaturation() * 100);
		const l = round(this.getLightness() * 100);
		return this.a !== 1 ? `hsla(${h},${s}%,${l}%,${this.a})` : `hsl(${h},${s}%,${l}%)`;
	}
	/** Same as toHsb */
	toHsv() {
		return {
			h: this.getHue(),
			s: this.getHSVSaturation(),
			v: this.getValue(),
			a: this.a
		};
	}
	toRgb() {
		return {
			r: this.r,
			g: this.g,
			b: this.b,
			a: this.a
		};
	}
	toRgbString() {
		return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
	}
	toString() {
		return this.toRgbString();
	}
	// ====================== Privates ======================
	/** Return a new FastColor object with one channel changed */
	_sc(rgb, value, max) {
		const clone = this.clone();
		clone[rgb] = limitRange(value, max);
		return clone;
	}
	_c(input) {
		return new this.constructor(input);
	}
	getMax() {
		if (typeof this._max === "undefined") {
			this._max = Math.max(this.r, this.g, this.b);
		}
		return this._max;
	}
	getMin() {
		if (typeof this._min === "undefined") {
			this._min = Math.min(this.r, this.g, this.b);
		}
		return this._min;
	}
	fromHexString(trimStr) {
		const withoutPrefix = trimStr.replace("#", "");
		function connectNum(index1, index2) {
			return parseInt(withoutPrefix[index1] + withoutPrefix[index2 || index1], 16);
		}
		if (withoutPrefix.length < 6) {
			// #rgb or #rgba
			this.r = connectNum(0);
			this.g = connectNum(1);
			this.b = connectNum(2);
			this.a = withoutPrefix[3] ? connectNum(3) / 255 : 1;
		} else {
			// #rrggbb or #rrggbbaa
			this.r = connectNum(0, 1);
			this.g = connectNum(2, 3);
			this.b = connectNum(4, 5);
			this.a = withoutPrefix[6] ? connectNum(6, 7) / 255 : 1;
		}
	}
	fromHsl({ h: _h, s, l, a }) {
		const h = (_h % 360 + 360) % 360;
		this._h = h;
		this._hsl_s = s;
		this._l = l;
		this.a = typeof a === "number" ? a : 1;
		if (s <= 0) {
			const rgb = round(l * 255);
			this.r = rgb;
			this.g = rgb;
			this.b = rgb;
			return;
		}
		let r = 0, g = 0, b = 0;
		const huePrime = h / 60;
		const chroma = (1 - Math.abs(2 * l - 1)) * s;
		const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
		if (huePrime >= 0 && huePrime < 1) {
			r = chroma;
			g = secondComponent;
		} else if (huePrime >= 1 && huePrime < 2) {
			r = secondComponent;
			g = chroma;
		} else if (huePrime >= 2 && huePrime < 3) {
			g = chroma;
			b = secondComponent;
		} else if (huePrime >= 3 && huePrime < 4) {
			g = secondComponent;
			b = chroma;
		} else if (huePrime >= 4 && huePrime < 5) {
			r = secondComponent;
			b = chroma;
		} else if (huePrime >= 5 && huePrime < 6) {
			r = chroma;
			b = secondComponent;
		}
		const lightnessModification = l - chroma / 2;
		this.r = round((r + lightnessModification) * 255);
		this.g = round((g + lightnessModification) * 255);
		this.b = round((b + lightnessModification) * 255);
	}
	fromHsv({ h: _h, s, v, a }) {
		const h = (_h % 360 + 360) % 360;
		this._h = h;
		this._hsv_s = s;
		this._v = v;
		this.a = typeof a === "number" ? a : 1;
		const vv = round(v * 255);
		this.r = vv;
		this.g = vv;
		this.b = vv;
		if (s <= 0) {
			return;
		}
		const hh = h / 60;
		const i = Math.floor(hh);
		const ff = hh - i;
		const p = round(v * (1 - s) * 255);
		const q = round(v * (1 - s * ff) * 255);
		const t = round(v * (1 - s * (1 - ff)) * 255);
		switch (i) {
			case 0:
				this.g = t;
				this.b = p;
				break;
			case 1:
				this.r = q;
				this.b = p;
				break;
			case 2:
				this.r = p;
				this.b = t;
				break;
			case 3:
				this.r = p;
				this.g = q;
				break;
			case 4:
				this.r = t;
				this.g = p;
				break;
			case 5:
			default:
				this.g = p;
				this.b = q;
				break;
		}
	}
	fromHsvString(trimStr) {
		const cells = splitColorStr(trimStr, parseHSVorHSL);
		this.fromHsv({
			h: cells[0],
			s: cells[1],
			v: cells[2],
			a: cells[3]
		});
	}
	fromHslString(trimStr) {
		const cells = splitColorStr(trimStr, parseHSVorHSL);
		this.fromHsl({
			h: cells[0],
			s: cells[1],
			l: cells[2],
			a: cells[3]
		});
	}
	fromRgbString(trimStr) {
		const cells = splitColorStr(trimStr, (num, txt) => txt.includes("%") ? round(num / 100 * 255) : num);
		this.r = cells[0];
		this.g = cells[1];
		this.b = cells[2];
		this.a = cells[3];
	}
}
const saturationStep = .16;
const saturationStep2 = .05;
const brightnessStep1 = .05;
const brightnessStep2 = .15;
function getHue(hsv, i, light) {
	let hue;
	// 根据色相不同，色相转向不同
	if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
		hue = light ? Math.round(hsv.h) - 2 * i : Math.round(hsv.h) + 2 * i;
	} else {
		hue = light ? Math.round(hsv.h) + 2 * i : Math.round(hsv.h) - 2 * i;
	}
	if (hue < 0) {
		hue += 360;
	} else if (hue >= 360) {
		hue -= 360;
	}
	return hue;
}
function getSaturation(hsv, i, light) {
	// grey color don't change saturation
	if (hsv.h === 0 && hsv.s === 0) {
		return hsv.s;
	}
	let saturation;
	if (light) {
		saturation = hsv.s - saturationStep * i;
	} else if (i === 4) {
		saturation = hsv.s + saturationStep;
	} else {
		saturation = hsv.s + saturationStep2 * i;
	}
	// 边界值修正
	if (saturation > 1) {
		saturation = 1;
	}
	// 第一格的 s 限制在 0.06-0.1 之间
	if (light && i === 5 && saturation > .1) {
		saturation = .1;
	}
	if (saturation < .06) {
		saturation = .06;
	}
	return Math.round(saturation * 100) / 100;
}
function getValue(hsv, i, light) {
	let value;
	if (light) {
		value = hsv.v + brightnessStep1 * i;
	} else {
		value = hsv.v - brightnessStep2 * i;
	}
	// Clamp value between 0 and 1
	value = Math.max(0, Math.min(1, value));
	return Math.round(value * 100) / 100;
}
function generate$1(color) {
	const patterns = [];
	const pColor = new FastColor(color);
	const hsv = pColor.toHsv();
	for (let i = 5; i > 0; i -= 1) {
		const c = new FastColor({
			h: getHue(hsv, i, true),
			s: getSaturation(hsv, i, true),
			v: getValue(hsv, i, true)
		});
		patterns.push(c);
	}
	patterns.push(pColor);
	for (let i = 1; i <= 4; i += 1) {
		const c = new FastColor({
			h: getHue(hsv, i),
			s: getSaturation(hsv, i),
			v: getValue(hsv, i)
		});
		patterns.push(c);
	}
	return patterns.map((c) => c.toHexString());
}
// Generated by script. Do NOT modify!
const presetPrimaryColors = {
	"red": "#F5222D",
	"volcano": "#FA541C",
	"orange": "#FA8C16",
	"gold": "#FAAD14",
	"yellow": "#FADB14",
	"lime": "#A0D911",
	"green": "#52C41A",
	"cyan": "#13C2C2",
	"blue": "#1677FF",
	"geekblue": "#2F54EB",
	"purple": "#722ED1",
	"magenta": "#EB2F96",
	"grey": "#666666"
};
const red = [
	"#fff1f0",
	"#ffccc7",
	"#ffa39e",
	"#ff7875",
	"#ff4d4f",
	"#f5222d",
	"#cf1322",
	"#a8071a",
	"#820014",
	"#5c0011"
];
red.primary = "#f5222d";
const volcano = [
	"#fff2e8",
	"#ffd8bf",
	"#ffbb96",
	"#ff9c6e",
	"#ff7a45",
	"#fa541c",
	"#d4380d",
	"#ad2102",
	"#871400",
	"#610b00"
];
volcano.primary = "#fa541c";
const orange = [
	"#fff7e6",
	"#ffe7ba",
	"#ffd591",
	"#ffc069",
	"#ffa940",
	"#fa8c16",
	"#d46b08",
	"#ad4e00",
	"#873800",
	"#612500"
];
orange.primary = "#fa8c16";
const gold = [
	"#fffbe6",
	"#fff1b8",
	"#ffe58f",
	"#ffd666",
	"#ffc53d",
	"#faad14",
	"#d48806",
	"#ad6800",
	"#874d00",
	"#613400"
];
gold.primary = "#faad14";
const yellow = [
	"#feffe6",
	"#ffffb8",
	"#fffb8f",
	"#fff566",
	"#ffec3d",
	"#fadb14",
	"#d4b106",
	"#ad8b00",
	"#876800",
	"#614700"
];
yellow.primary = "#fadb14";
const lime = [
	"#fcffe6",
	"#f4ffb8",
	"#eaff8f",
	"#d3f261",
	"#bae637",
	"#a0d911",
	"#7cb305",
	"#5b8c00",
	"#3f6600",
	"#254000"
];
lime.primary = "#a0d911";
const green = [
	"#f6ffed",
	"#d9f7be",
	"#b7eb8f",
	"#95de64",
	"#73d13d",
	"#52c41a",
	"#389e0d",
	"#237804",
	"#135200",
	"#092b00"
];
green.primary = "#52c41a";
const cyan = [
	"#e6fffb",
	"#b5f5ec",
	"#87e8de",
	"#5cdbd3",
	"#36cfc9",
	"#13c2c2",
	"#08979c",
	"#006d75",
	"#00474f",
	"#002329"
];
cyan.primary = "#13c2c2";
const blue = [
	"#e6f4ff",
	"#bae0ff",
	"#91caff",
	"#69b1ff",
	"#4096ff",
	"#1677ff",
	"#0958d9",
	"#003eb3",
	"#002c8c",
	"#001d66"
];
blue.primary = "#1677ff";
const geekblue = [
	"#f0f5ff",
	"#d6e4ff",
	"#adc6ff",
	"#85a5ff",
	"#597ef7",
	"#2f54eb",
	"#1d39c4",
	"#10239e",
	"#061178",
	"#030852"
];
geekblue.primary = "#2f54eb";
const purple = [
	"#f9f0ff",
	"#efdbff",
	"#d3adf7",
	"#b37feb",
	"#9254de",
	"#722ed1",
	"#531dab",
	"#391085",
	"#22075e",
	"#120338"
];
purple.primary = "#722ed1";
const magenta = [
	"#fff0f6",
	"#ffd6e7",
	"#ffadd2",
	"#ff85c0",
	"#f759ab",
	"#eb2f96",
	"#c41d7f",
	"#9e1068",
	"#780650",
	"#520339"
];
magenta.primary = "#eb2f96";
const grey = [
	"#a6a6a6",
	"#999999",
	"#8c8c8c",
	"#808080",
	"#737373",
	"#666666",
	"#404040",
	"#1a1a1a",
	"#000000",
	"#000000"
];
grey.primary = "#666666";
const presetPalettes = {
	red,
	volcano,
	orange,
	gold,
	yellow,
	lime,
	green,
	cyan,
	blue,
	geekblue,
	purple,
	magenta,
	grey
};
function genColorMapToken(seed, { a: generateColorPalettes, b: generateNeutralColorPalettes }) {
	const { colorSuccess: colorSuccessBase, colorWarning: colorWarningBase, colorError: colorErrorBase, colorInfo: colorInfoBase, colorPrimary: colorPrimaryBase, colorBgBase, colorTextBase } = seed;
	const primaryColors = generateColorPalettes(colorPrimaryBase);
	const successColors = generateColorPalettes(colorSuccessBase);
	const warningColors = generateColorPalettes(colorWarningBase);
	const errorColors = generateColorPalettes(colorErrorBase);
	const infoColors = generateColorPalettes(colorInfoBase);
	const neutralColors = generateNeutralColorPalettes(colorBgBase, colorTextBase);
	// Color Link
	const colorLink = seed.colorLink || seed.colorInfo;
	const linkColors = generateColorPalettes(colorLink);
	const colorErrorBgFilledHover = new FastColor(errorColors[1]).mix(new FastColor(errorColors[3]), 50).toHexString();
	return {
		...neutralColors,
		colorPrimaryBg: primaryColors[1],
		colorPrimaryBgHover: primaryColors[2],
		colorPrimaryBorder: primaryColors[3],
		colorPrimaryBorderHover: primaryColors[4],
		colorPrimaryHover: primaryColors[5],
		colorPrimary: primaryColors[6],
		colorPrimaryActive: primaryColors[7],
		colorPrimaryTextHover: primaryColors[8],
		colorPrimaryText: primaryColors[9],
		colorPrimaryTextActive: primaryColors[10],
		colorSuccessBg: successColors[1],
		colorSuccessBgHover: successColors[2],
		colorSuccessBorder: successColors[3],
		colorSuccessBorderHover: successColors[4],
		colorSuccessHover: successColors[4],
		colorSuccess: successColors[6],
		colorSuccessActive: successColors[7],
		colorSuccessTextHover: successColors[8],
		colorSuccessText: successColors[9],
		colorSuccessTextActive: successColors[10],
		colorErrorBg: errorColors[1],
		colorErrorBgHover: errorColors[2],
		colorErrorBgFilledHover,
		colorErrorBgActive: errorColors[3],
		colorErrorBorder: errorColors[3],
		colorErrorBorderHover: errorColors[4],
		colorErrorHover: errorColors[5],
		colorError: errorColors[6],
		colorErrorActive: errorColors[7],
		colorErrorTextHover: errorColors[8],
		colorErrorText: errorColors[9],
		colorErrorTextActive: errorColors[10],
		colorWarningBg: warningColors[1],
		colorWarningBgHover: warningColors[2],
		colorWarningBorder: warningColors[3],
		colorWarningBorderHover: warningColors[4],
		colorWarningHover: warningColors[4],
		colorWarning: warningColors[6],
		colorWarningActive: warningColors[7],
		colorWarningTextHover: warningColors[8],
		colorWarningText: warningColors[9],
		colorWarningTextActive: warningColors[10],
		colorInfoBg: infoColors[1],
		colorInfoBgHover: infoColors[2],
		colorInfoBorder: infoColors[3],
		colorInfoBorderHover: infoColors[4],
		colorInfoHover: infoColors[4],
		colorInfo: infoColors[6],
		colorInfoActive: infoColors[7],
		colorInfoTextHover: infoColors[8],
		colorInfoText: infoColors[9],
		colorInfoTextActive: infoColors[10],
		colorLinkHover: linkColors[4],
		colorLink: linkColors[6],
		colorLinkActive: linkColors[7],
		colorBgMask: new FastColor("#000").setA(.45).toRgbString(),
		colorWhite: "#fff"
	};
}
const genRadius = (radiusBase) => {
	let radiusLG = radiusBase;
	let radiusSM = radiusBase;
	let radiusXS = radiusBase;
	let radiusOuter = radiusBase;
	// radiusLG
	if (radiusBase < 6 && radiusBase >= 5) {
		radiusLG = radiusBase + 1;
	} else if (radiusBase < 16 && radiusBase >= 6) {
		radiusLG = radiusBase + 2;
	} else if (radiusBase >= 16) {
		radiusLG = 16;
	}
	// radiusSM
	if (radiusBase < 7 && radiusBase >= 5) {
		radiusSM = 4;
	} else if (radiusBase < 8 && radiusBase >= 7) {
		radiusSM = 5;
	} else if (radiusBase < 14 && radiusBase >= 8) {
		radiusSM = 6;
	} else if (radiusBase < 16 && radiusBase >= 14) {
		radiusSM = 7;
	} else if (radiusBase >= 16) {
		radiusSM = 8;
	}
	// radiusXS
	if (radiusBase < 6 && radiusBase >= 2) {
		radiusXS = 1;
	} else if (radiusBase >= 6) {
		radiusXS = 2;
	}
	// radiusOuter
	if (radiusBase > 4 && radiusBase < 8) {
		radiusOuter = 4;
	} else if (radiusBase >= 8) {
		radiusOuter = 6;
	}
	return {
		borderRadius: radiusBase,
		borderRadiusXS: radiusXS,
		borderRadiusSM: radiusSM,
		borderRadiusLG: radiusLG,
		borderRadiusOuter: radiusOuter
	};
};
function genCommonMapToken(token) {
	const { motionUnit, motionBase, borderRadius, lineWidth } = token;
	return {
		motionDurationFast: `${(motionBase + motionUnit).toFixed(1)}s`,
		motionDurationMid: `${(motionBase + motionUnit * 2).toFixed(1)}s`,
		motionDurationSlow: `${(motionBase + motionUnit * 3).toFixed(1)}s`,
		lineWidthBold: lineWidth + 1,
		...genRadius(borderRadius)
	};
}
const genControlHeight = (token) => {
	const { controlHeight } = token;
	return {
		controlHeightSM: controlHeight * .75,
		controlHeightXS: controlHeight * .5,
		controlHeightLG: controlHeight * 1.25
	};
};
const genFontMapToken = (fontSize) => {
	const fontSizePairs = getFontSizes(fontSize);
	const fontSizes = fontSizePairs.map((pair) => pair.size);
	const lineHeights = fontSizePairs.map((pair) => pair.lineHeight);
	const fontSizeMD = fontSizes[1];
	const fontSizeSM = fontSizes[0];
	const fontSizeLG = fontSizes[2];
	const lineHeight = lineHeights[1];
	const lineHeightSM = lineHeights[0];
	const lineHeightLG = lineHeights[2];
	return {
		fontSizeSM,
		fontSize: fontSizeMD,
		fontSizeLG,
		fontSizeXL: fontSizes[3],
		fontSizeHeading1: fontSizes[6],
		fontSizeHeading2: fontSizes[5],
		fontSizeHeading3: fontSizes[4],
		fontSizeHeading4: fontSizes[3],
		fontSizeHeading5: fontSizes[2],
		lineHeight,
		lineHeightLG,
		lineHeightSM,
		fontHeight: Math.round(lineHeight * fontSizeMD),
		fontHeightLG: Math.round(lineHeightLG * fontSizeLG),
		fontHeightSM: Math.round(lineHeightSM * fontSizeSM),
		lineHeightHeading1: lineHeights[6],
		lineHeightHeading2: lineHeights[5],
		lineHeightHeading3: lineHeights[4],
		lineHeightHeading4: lineHeights[3],
		lineHeightHeading5: lineHeights[2]
	};
};
function genSizeMapToken(token) {
	const { sizeUnit, sizeStep } = token;
	return {
		sizeXXL: sizeUnit * (sizeStep + 8),
		sizeXL: sizeUnit * (sizeStep + 4),
		sizeLG: sizeUnit * (sizeStep + 2),
		sizeMD: sizeUnit * (sizeStep + 1),
		sizeMS: sizeUnit * sizeStep,
		size: sizeUnit * sizeStep,
		sizeSM: sizeUnit * (sizeStep - 1),
		sizeXS: sizeUnit * (sizeStep - 2),
		sizeXXS: sizeUnit * (sizeStep - 3)
	};
}
const getAlphaColor$1 = (baseColor, alpha) => new FastColor(baseColor).setA(alpha).toRgbString();
const getSolidColor = (baseColor, brightness) => {
	const instance = new FastColor(baseColor);
	return instance.darken(brightness).toHexString();
};
const generateColorPalettes = (baseColor) => {
	const colors = generate$1(baseColor);
	return {
		1: colors[0],
		2: colors[1],
		3: colors[2],
		4: colors[3],
		5: colors[4],
		6: colors[5],
		7: colors[6],
		8: colors[4],
		9: colors[5],
		10: colors[6]
	};
};
const generateNeutralColorPalettes = (bgBaseColor, textBaseColor) => {
	const colorBgBase = bgBaseColor || "#fff";
	const colorTextBase = textBaseColor || "#000";
	return {
		colorBgBase,
		colorTextBase,
		colorText: getAlphaColor$1(colorTextBase, .88),
		colorTextSecondary: getAlphaColor$1(colorTextBase, .65),
		colorTextTertiary: getAlphaColor$1(colorTextBase, .45),
		colorTextQuaternary: getAlphaColor$1(colorTextBase, .25),
		colorFill: getAlphaColor$1(colorTextBase, .15),
		colorFillSecondary: getAlphaColor$1(colorTextBase, .06),
		colorFillTertiary: getAlphaColor$1(colorTextBase, .04),
		colorFillQuaternary: getAlphaColor$1(colorTextBase, .02),
		colorBgSolid: getAlphaColor$1(colorTextBase, 1),
		colorBgSolidHover: getAlphaColor$1(colorTextBase, .75),
		colorBgSolidActive: getAlphaColor$1(colorTextBase, .95),
		colorBgLayout: getSolidColor(colorBgBase, 4),
		colorBgContainer: getSolidColor(colorBgBase, 0),
		colorBgElevated: getSolidColor(colorBgBase, 0),
		colorBgSpotlight: getAlphaColor$1(colorTextBase, .85),
		colorBgBlur: "transparent",
		colorBorder: getSolidColor(colorBgBase, 15),
		colorBorderDisabled: getSolidColor(colorBgBase, 15),
		colorBorderSecondary: getSolidColor(colorBgBase, 6)
	};
};
function derivative(token) {
	// pink is deprecated name of magenta, keep this for backwards compatibility
	presetPrimaryColors.pink = "#EB2F96";
	presetPalettes.pink = presetPalettes.magenta;
	const colorPalettes = Object.keys(defaultPresetColors).map((colorKey) => {
		const colors = token[colorKey] === presetPrimaryColors[colorKey] ? presetPalettes[colorKey] : generate$1(token[colorKey]);
		return Array.from({ length: 10 }, () => 1).reduce((prev, __unused_1561, i) => {
			prev[`${colorKey}-${i + 1}`] = colors[i];
			prev[`${colorKey}${i + 1}`] = colors[i];
			return prev;
		}, {});
	}).reduce((prev, cur) => {
		prev = {
			...prev,
			...cur
		};
		return prev;
	}, {});
	return {
		...token,
		...colorPalettes,
		...genColorMapToken(token, {
			a: generateColorPalettes,
			b: generateNeutralColorPalettes
		}),
		...genFontMapToken(token.fontSize),
		...genSizeMapToken(token),
		...genControlHeight(token),
		...genCommonMapToken(token)
	};
}
const defaultTheme = createTheme(derivative);
// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
const defaultConfig = {
	token: seedToken,
	override: { override: seedToken },
	hashed: true
};
const DesignTokenContext = React.n(defaultConfig);
function isStableColor(color) {
	return color >= 0 && color <= 255;
}
function getAlphaColor(frontColor, backgroundColor) {
	const { r: fR, g: fG, b: fB, a: originAlpha } = new FastColor(frontColor).toRgb();
	if (originAlpha < 1) {
		return frontColor;
	}
	const { r: bR, g: bG, b: bB } = new FastColor(backgroundColor).toRgb();
	for (let fA = .01; fA <= 1; fA += .01) {
		const r = Math.round((fR - bR * (1 - fA)) / fA);
		const g = Math.round((fG - bG * (1 - fA)) / fA);
		const b = Math.round((fB - bB * (1 - fA)) / fA);
		if (isStableColor(r) && isStableColor(g) && isStableColor(b)) {
			return new FastColor({
				r,
				g,
				b,
				a: Math.round(fA * 100) / 100
			}).toRgbString();
		}
	}
	// fallback
	/* istanbul ignore next */
	return new FastColor({
		r: fR,
		g: fG,
		b: fB,
		a: 1
	}).toRgbString();
}
/**
* Seed (designer) > Derivative (designer) > Alias (developer).
*
* Merge seed & derivative & override token and generate alias token for developer.
*/
function formatToken(derivativeToken) {
	const { override, ...restToken } = derivativeToken;
	const overrideTokens = { ...override };
	Object.keys(seedToken).forEach((token) => {
		delete overrideTokens[token];
	});
	const mergedToken = {
		...restToken,
		...overrideTokens
	};
	// Motion
	if (mergedToken.motion === false) {
		mergedToken.motionDurationFast = "0s";
		mergedToken.motionDurationMid = "0s";
		mergedToken.motionDurationSlow = "0s";
	}
	// Generate alias token
	const aliasToken = {
		...mergedToken,
		colorFillContent: mergedToken.colorFillSecondary,
		colorFillContentHover: mergedToken.colorFill,
		colorFillAlter: mergedToken.colorFillQuaternary,
		colorBgContainerDisabled: mergedToken.colorFillTertiary,
		colorBorderBg: mergedToken.colorBgContainer,
		colorSplit: getAlphaColor(mergedToken.colorBorderSecondary, mergedToken.colorBgContainer),
		colorTextPlaceholder: mergedToken.colorTextQuaternary,
		colorTextDisabled: mergedToken.colorTextQuaternary,
		colorTextHeading: mergedToken.colorText,
		colorTextLabel: mergedToken.colorTextSecondary,
		colorTextDescription: mergedToken.colorTextTertiary,
		colorTextLightSolid: mergedToken.colorWhite,
		colorHighlight: mergedToken.colorError,
		colorBgTextHover: mergedToken.colorFillSecondary,
		colorBgTextActive: mergedToken.colorFill,
		colorIcon: mergedToken.colorTextTertiary,
		colorIconHover: mergedToken.colorText,
		colorErrorOutline: getAlphaColor(mergedToken.colorErrorBg, mergedToken.colorBgContainer),
		colorWarningOutline: getAlphaColor(mergedToken.colorWarningBg, mergedToken.colorBgContainer),
		fontSizeIcon: mergedToken.fontSizeSM,
		lineWidthFocus: mergedToken.lineWidth * 3,
		lineWidth: mergedToken.lineWidth,
		controlOutlineWidth: mergedToken.lineWidth * 2,
		controlInteractiveSize: mergedToken.controlHeight / 2,
		controlItemBgHover: mergedToken.colorFillTertiary,
		controlItemBgActive: mergedToken.colorPrimaryBg,
		controlItemBgActiveHover: mergedToken.colorPrimaryBgHover,
		controlItemBgActiveDisabled: mergedToken.colorFill,
		controlTmpOutline: mergedToken.colorFillQuaternary,
		controlOutline: getAlphaColor(mergedToken.colorPrimaryBg, mergedToken.colorBgContainer),
		lineType: mergedToken.lineType,
		borderRadius: mergedToken.borderRadius,
		borderRadiusXS: mergedToken.borderRadiusXS,
		borderRadiusSM: mergedToken.borderRadiusSM,
		borderRadiusLG: mergedToken.borderRadiusLG,
		fontWeightStrong: 600,
		opacityLoading: .65,
		linkDecoration: "none",
		linkHoverDecoration: "none",
		linkFocusDecoration: "none",
		controlPaddingHorizontal: 12,
		controlPaddingHorizontalSM: 8,
		paddingXXS: mergedToken.sizeXXS,
		paddingXS: mergedToken.sizeXS,
		paddingSM: mergedToken.sizeSM,
		padding: mergedToken.size,
		paddingMD: mergedToken.sizeMD,
		paddingLG: mergedToken.sizeLG,
		paddingXL: mergedToken.sizeXL,
		paddingContentHorizontalLG: mergedToken.sizeLG,
		paddingContentVerticalLG: mergedToken.sizeMS,
		paddingContentHorizontal: mergedToken.sizeMS,
		paddingContentVertical: mergedToken.sizeSM,
		paddingContentHorizontalSM: mergedToken.size,
		paddingContentVerticalSM: mergedToken.sizeXS,
		marginXXS: mergedToken.sizeXXS,
		marginXS: mergedToken.sizeXS,
		marginSM: mergedToken.sizeSM,
		margin: mergedToken.size,
		marginMD: mergedToken.sizeMD,
		marginLG: mergedToken.sizeLG,
		marginXL: mergedToken.sizeXL,
		marginXXL: mergedToken.sizeXXL,
		boxShadow: "\n      0 6px 16px 0 rgba(0, 0, 0, 0.08),\n      0 3px 6px -4px rgba(0, 0, 0, 0.12),\n      0 9px 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowSecondary: "\n      0 6px 16px 0 rgba(0, 0, 0, 0.08),\n      0 3px 6px -4px rgba(0, 0, 0, 0.12),\n      0 9px 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowTertiary: "\n      0 1px 2px 0 rgba(0, 0, 0, 0.03),\n      0 1px 6px -1px rgba(0, 0, 0, 0.02),\n      0 2px 4px 0 rgba(0, 0, 0, 0.02)\n    ",
		screenXS: 480,
		screenXSMin: 480,
		screenXSMax: 575,
		screenSM: 576,
		screenSMMin: 576,
		screenSMMax: 767,
		screenMD: 768,
		screenMDMin: 768,
		screenMDMax: 991,
		screenLG: 992,
		screenLGMin: 992,
		screenLGMax: 1199,
		screenXL: 1200,
		screenXLMin: 1200,
		screenXLMax: 1599,
		screenXXL: 1600,
		screenXXLMin: 1600,
		boxShadowPopoverArrow: "2px 2px 5px rgba(0, 0, 0, 0.05)",
		boxShadowCard: `
      0 1px 2px -2px ${new FastColor("rgba(0, 0, 0, 0.16)").toRgbString()},
      0 3px 6px 0 ${new FastColor("rgba(0, 0, 0, 0.12)").toRgbString()},
      0 5px 12px 4px ${new FastColor("rgba(0, 0, 0, 0.09)").toRgbString()}
    `,
		boxShadowDrawerRight: "\n      -6px 0 16px 0 rgba(0, 0, 0, 0.08),\n      -3px 0 6px -4px rgba(0, 0, 0, 0.12),\n      -9px 0 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowDrawerLeft: "\n      6px 0 16px 0 rgba(0, 0, 0, 0.08),\n      3px 0 6px -4px rgba(0, 0, 0, 0.12),\n      9px 0 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowDrawerUp: "\n      0 6px 16px 0 rgba(0, 0, 0, 0.08),\n      0 3px 6px -4px rgba(0, 0, 0, 0.12),\n      0 9px 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowDrawerDown: "\n      0 -6px 16px 0 rgba(0, 0, 0, 0.08),\n      0 -3px 6px -4px rgba(0, 0, 0, 0.12),\n      0 -9px 28px 8px rgba(0, 0, 0, 0.05)\n    ",
		boxShadowTabsOverflowLeft: "inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowRight: "inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowTop: "inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowBottom: "inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)",
		...overrideTokens
	};
	return aliasToken;
}
const unitless = {
	lineHeight: true,
	lineHeightSM: true,
	lineHeightLG: true,
	lineHeightHeading1: true,
	lineHeightHeading2: true,
	lineHeightHeading3: true,
	lineHeightHeading4: true,
	lineHeightHeading5: true,
	opacityLoading: true,
	fontWeightStrong: true,
	zIndexPopupBase: true,
	zIndexBase: true,
	opacityImage: true
};
const ignore = {
	motionBase: true,
	motionUnit: true
};
const preserve = {
	screenXS: true,
	screenXSMin: true,
	screenXSMax: true,
	screenSM: true,
	screenSMMin: true,
	screenSMMax: true,
	screenMD: true,
	screenMDMin: true,
	screenMDMax: true,
	screenLG: true,
	screenLGMin: true,
	screenLGMax: true,
	screenXL: true,
	screenXLMin: true,
	screenXLMax: true,
	screenXXL: true,
	screenXXLMin: true
};
const getComputedToken = (originToken, overrideToken, theme) => {
	const derivativeToken = theme.getDerivativeToken(originToken);
	const { override, ...components } = overrideToken;
	// Merge with override
	let mergedDerivativeToken = {
		...derivativeToken,
		override
	};
	// Format if needed
	mergedDerivativeToken = formatToken(mergedDerivativeToken);
	{
		{
			Object.entries(components).forEach(([key, value]) => {
				const { theme: componentTheme, ...componentTokens } = value;
				let mergedComponentToken = componentTokens;
				if (componentTheme) {
					mergedComponentToken = getComputedToken({
						...mergedDerivativeToken,
						...componentTokens
					}, { override: componentTokens }, componentTheme);
				}
				mergedDerivativeToken[key] = mergedComponentToken;
			});
		}
	}
	return mergedDerivativeToken;
};
// ================================== Hook ==================================
function useToken() {
	const { token: rootDesignToken, hashed, theme, override, cssVar: ctxCssVar, zeroRuntime } = React.z(DesignTokenContext);
	const cssVar = {
		prefix: ctxCssVar?.prefix ?? "ant",
		key: ctxCssVar?.key ?? "css-var-root"
	};
	const salt = `${"6.2.3"}-${hashed || ""}`;
	const mergedTheme = theme || defaultTheme;
	const [token, hashId, realToken] = useCacheToken(mergedTheme, [seedToken, rootDesignToken], {
		a: salt,
		b: override,
		c: getComputedToken,
		d: {
			...cssVar,
			unitless,
			ignore,
			preserve
		}
	});
	return [
		mergedTheme,
		realToken,
		hashed ? hashId : "",
		token,
		cssVar,
		!!zeroRuntime
	];
}
const resetIcon = () => ({
	display: "inline-flex",
	alignItems: "center",
	color: "inherit",
	fontStyle: "normal",
	lineHeight: 0,
	textAlign: "center",
	textTransform: "none",
	verticalAlign: "-0.125em",
	textRendering: "optimizeLegibility",
	"-webkit-font-smoothing": "antialiased",
	"-moz-osx-font-smoothing": "grayscale",
	"> *": { lineHeight: 1 },
	svg: { display: "inline-block" }
});
const genLinkStyle = (token) => ({ a: {
	color: token.colorLink,
	textDecoration: token.linkDecoration,
	backgroundColor: "transparent",
	outline: "none",
	cursor: "pointer",
	transition: `color ${token.motionDurationSlow}`,
	"-webkit-text-decoration-skip": "objects",
	"&:hover": { color: token.colorLinkHover },
	"&:active": { color: token.colorLinkActive },
	"&:active, &:hover": {
		textDecoration: token.linkHoverDecoration,
		outline: 0
	},
	"&:focus": {
		textDecoration: token.linkFocusDecoration,
		outline: 0
	},
	"&[disabled]": {
		color: token.colorTextDisabled,
		cursor: "not-allowed"
	}
} });
const genCommonStyle = (token, componentPrefixCls, rootCls, resetFont) => {
	const prefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
	const rootPrefixSelector = rootCls ? `.${rootCls}` : prefixSelector;
	const resetStyle = {
		boxSizing: "border-box",
		"&::before, &::after": { boxSizing: "border-box" }
	};
	let resetFontStyle = {};
	if (resetFont !== false) {
		resetFontStyle = {
			fontFamily: token.fontFamily,
			fontSize: token.fontSize
		};
	}
	return { [rootPrefixSelector]: {
		...resetFontStyle,
		...resetStyle,
		[prefixSelector]: resetStyle
	} };
};
const genFocusOutline = (token) => ({
	outline: `${unit$1(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
	outlineOffset: 1,
	transition: "outline-offset 0s, outline 0s"
});
const genFocusStyle = (token) => ({ "&:focus-visible": genFocusOutline(token) });
const genIconStyle = (iconPrefixCls) => ({ [`.${iconPrefixCls}`]: {
	...resetIcon(),
	[`.${iconPrefixCls} .${iconPrefixCls}-icon`]: { display: "block" }
} });
const { a: genStyleHooks, c: genComponentStyleHook, b: genSubStyleComponent } = genStyleUtils({
	c: () => {
		const { getPrefixCls, iconPrefixCls } = reactExports.z(ConfigContext);
		const rootPrefixCls = getPrefixCls();
		return {
			a: rootPrefixCls,
			b: iconPrefixCls
		};
	},
	b: () => {
		const [theme, realToken, hashId, token, cssVar, zeroRuntime] = useToken();
		return {
			c: theme,
			b: realToken,
			d: hashId,
			e: token,
			a: cssVar,
			f: zeroRuntime
		};
	},
	a: () => {
		const { csp } = reactExports.z(ConfigContext);
		return csp ?? {};
	},
	d: (token, config) => {
		const linkStyle = genLinkStyle(token);
		return [
			linkStyle,
			{ "&": linkStyle },
			genIconStyle(config.a.a ?? "anticon")
		];
	},
	e: genCommonStyle,
	f: () => unitless
});
const genCssVar = (antCls, component) => {
	const cssPrefix = `--${antCls.replace(/\./g, "")}-${component}-`;
	const varName = (name) => {
		return `${cssPrefix}${name}`;
	};
	const varRef = (name, fallback) => {
		return fallback ? `var(${cssPrefix}${"color"}, ${fallback})` : `var(${cssPrefix}${name})`;
	};
	return [varName, varRef];
};
const IconContext = reactExports.n({});
function getRoot(ele) {
	return ele?.getRootNode?.();
}
/**
* Check if is in shadowRoot
*/
function inShadow(ele) {
	return getRoot(ele) instanceof ShadowRoot;
}
/**
* Return shadowRoot if possible
*/
function getShadowRoot(ele) {
	return inShadow(ele) ? getRoot(ele) : null;
}
function camelCase(input) {
	return input.replace(/-(.)/g, (__unused_359B, g) => g.toUpperCase());
}
function warning(valid, message) {
	warningOnce(valid, `[@ant-design/icons] ${message}`);
}
function isIconDefinition(target) {
	return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
}
function normalizeAttrs(attrs = {}) {
	return Object.keys(attrs).reduce((acc, key) => {
		const val = attrs[key];
		switch (key) {
			case "class":
				acc.className = val;
				delete acc.class;
				break;
			default:
				delete acc[key];
				acc[camelCase(key)] = val;
		}
		return acc;
	}, {});
}
function generate(node, key, rootProps) {
	if (!rootProps) {
		return React.o(node.tag, {
			key,
			...normalizeAttrs(node.attrs)
		}, (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)));
	}
	return React.o(node.tag, {
		key,
		...normalizeAttrs(node.attrs),
		...rootProps
	}, (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)));
}
function getSecondaryColor(primaryColor) {
	// choose the second color
	return generate$1(primaryColor)[0];
}
function normalizeTwoToneColors(twoToneColor) {
	if (!twoToneColor) {
		return [];
	}
	return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
}
const iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n  vertical-align: inherit;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
const useInsertStyles = (eleRef) => {
	const { csp, prefixCls, layer } = reactExports.z(IconContext);
	let mergedStyleStr = iconStyles;
	if (prefixCls) {
		mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
	}
	if (layer) {
		mergedStyleStr = `@layer ${layer} {
${mergedStyleStr}
}`;
	}
	reactExports.C(() => {
		const ele = eleRef.current;
		const shadowRoot = getShadowRoot(ele);
		updateCSS(mergedStyleStr, "@ant-design-icons", {
			prepend: !layer,
			csp,
			attachTo: shadowRoot
		});
	}, []);
};
const twoToneColorPalette = {};
function setTwoToneColors({ primaryColor, secondaryColor }) {
	twoToneColorPalette.primaryColor = primaryColor;
	twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
	twoToneColorPalette.calculated = !!secondaryColor;
}
function getTwoToneColors() {
	return { ...twoToneColorPalette };
}
const IconBase = (props) => {
	const { icon, className, onClick, style, primaryColor, secondaryColor, ...restProps } = props;
	const svgRef = reactExports.L(null);
	let colors = twoToneColorPalette;
	if (primaryColor) {
		colors = {
			primaryColor,
			secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
		};
	}
	useInsertStyles(svgRef);
	warning(isIconDefinition(icon), `icon should be icon definiton, but got ${icon}`);
	if (!isIconDefinition(icon)) {
		return null;
	}
	let target = icon;
	if (target && typeof target.icon === "function") {
		target = {
			...target,
			icon: target.icon(colors.primaryColor, colors.secondaryColor)
		};
	}
	return generate(target.icon, `svg-${target.name}`, {
		className,
		onClick,
		style,
		"data-icon": target.name,
		width: "1em",
		height: "1em",
		fill: "currentColor",
		"aria-hidden": "true",
		...restProps,
		ref: svgRef
	});
};
IconBase.displayName = "IconReact";
IconBase.getTwoToneColors = getTwoToneColors;
IconBase.setTwoToneColors = setTwoToneColors;
function setTwoToneColor(twoToneColor) {
	const [primaryColor, secondaryColor] = normalizeTwoToneColors(twoToneColor);
	return IconBase.setTwoToneColors({
		primaryColor,
		secondaryColor
	});
}
function getTwoToneColor() {
	const colors = IconBase.getTwoToneColors();
	if (!colors.calculated) {
		return colors.primaryColor;
	}
	return [colors.primaryColor, colors.secondaryColor];
}
function _extends$1() {
	_extends$1 = Object.assign.bind();
	return _extends$1.apply(this, arguments);
}
// Initial setting
// should move it to antd main repo?
setTwoToneColor(blue.primary);
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34757#issuecomment-488848720
const Icon = reactExports.q((props, ref) => {
	const { className, icon, spin, rotate, tabIndex, onClick, twoToneColor, ...restProps } = props;
	const { prefixCls = "anticon", rootClassName } = reactExports.z(IconContext);
	const classString = clsx(rootClassName, prefixCls, {
		[`${prefixCls}-${icon.name}`]: !!icon.name,
		[`${prefixCls}-spin`]: !!spin || icon.name === "loading"
	}, className);
	let iconTabIndex = tabIndex;
	if (iconTabIndex === void 0 && onClick) {
		iconTabIndex = -1;
	}
	const svgStyle = rotate ? {
		msTransform: `rotate(${rotate}deg)`,
		transform: `rotate(${rotate}deg)`
	} : void 0;
	const [primaryColor, secondaryColor] = normalizeTwoToneColors(twoToneColor);
	return reactExports.o("span", _extends$1({
		role: "img",
		"aria-label": icon.name
	}, restProps, {
		ref,
		tabIndex: iconTabIndex,
		onClick,
		className: classString
	}), reactExports.o(IconBase, {
		icon,
		primaryColor,
		secondaryColor,
		style: svgStyle
	}));
});
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;
const Context = reactExports.n({});
/**
* Same as React.useState but will always get latest state.
* This is useful when React merge multiple state updates into one.
* e.g. onTransitionEnd trigger multiple event at once will be merged state update in React.
*/
function useSyncState() {
	const [, forceUpdate] = reactExports.K((x) => x + 1);
	const currentValueRef = reactExports.L("none");
	const getValue = useEvent(() => {
		return currentValueRef.current;
	});
	const setValue = useEvent((updater) => {
		currentValueRef.current = typeof updater === "function" ? updater(currentValueRef.current) : updater;
		forceUpdate();
	});
	return [getValue, setValue];
}
// ================= Transition =================
// Event wrapper. Copy from react source code
function makePrefixMap(styleProp, eventName) {
	const prefixes = {};
	prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
	prefixes[`Webkit${styleProp}`] = `webkit${eventName}`;
	prefixes[`Moz${styleProp}`] = `moz${eventName}`;
	prefixes[`ms${styleProp}`] = `MS${eventName}`;
	prefixes[`O${styleProp}`] = `o${eventName.toLowerCase()}`;
	return prefixes;
}
function getVendorPrefixes(domSupport, win) {
	const prefixes = {
		a: makePrefixMap("Animation", "AnimationEnd"),
		b: makePrefixMap("Transition", "TransitionEnd")
	};
	if (domSupport) {
		if (!("AnimationEvent" in win)) {
			delete prefixes.a.animation;
		}
		if (!("TransitionEvent" in win)) {
			delete prefixes.b.transition;
		}
	}
	return prefixes;
}
const vendorPrefixes = getVendorPrefixes(canUseDom(), typeof window !== "undefined" ? window : {});
let style = {};
if (canUseDom()) {
	({style: style} = document.createElement("div"));
}
const prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
	const prefixMap = vendorPrefixes[eventName];
	{
		{
			const stylePropList = Object.keys(prefixMap);
			const len = stylePropList.length;
			for (let i = 0; i < len; i += 1) {
				const styleProp = stylePropList[i];
				if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
					prefixedEventNames[eventName] = prefixMap[styleProp];
					return prefixedEventNames[eventName];
				}
			}
		}
	}
	return "";
}
const internalAnimationEndName = getVendorPrefixedEventName("a");
const internalTransitionEndName = getVendorPrefixedEventName("b");
const supportTransition = !!(internalAnimationEndName && internalTransitionEndName);
const animationEndName = internalAnimationEndName || "animationend";
const transitionEndName = internalTransitionEndName || "transitionend";
function getTransitionName(transitionName, transitionType) {
	if (!transitionName) return null;
	if (typeof transitionName === "object") {
		const type = transitionType.replace(/-\w/g, (match) => match[1].toUpperCase());
		return transitionName[type];
	}
	return `${transitionName}-${transitionType}`;
}
var useDomMotionEvents = (onInternalMotionEnd) => {
	const cacheElementRef = reactExports.L();
	// Remove events
	function removeMotionEvents(element) {
		if (element) {
			element.removeEventListener(transitionEndName, onInternalMotionEnd);
			element.removeEventListener(animationEndName, onInternalMotionEnd);
		}
	}
	// Patch events
	function patchMotionEvents(element) {
		if (cacheElementRef.current && cacheElementRef.current !== element) {
			removeMotionEvents(cacheElementRef.current);
		}
		if (element && element !== cacheElementRef.current) {
			element.addEventListener(transitionEndName, onInternalMotionEnd);
			element.addEventListener(animationEndName, onInternalMotionEnd);
			// Save as cache in case dom removed trigger by `motionDeadline`
			cacheElementRef.current = element;
		}
	}
	// Clean up when removed
	reactExports.C(() => () => {
		removeMotionEvents(cacheElementRef.current);
		cacheElementRef.current = null;
	}, []);
	return [patchMotionEvents, ,];
};
// It's safe to use `useLayoutEffect` but the warning is annoying
const useIsomorphicLayoutEffect = canUseDom() ? reactExports.H : reactExports.C;
var useNextFrame = () => {
	const nextFrameRef = reactExports.L(null);
	function cancelNextFrame() {
		wrapperRaf.a(nextFrameRef.current);
	}
	function nextFrame(callback, delay = 2) {
		cancelNextFrame();
		const nextFrameId = wrapperRaf(() => {
			if (delay <= 1) {
				callback({ a: () => nextFrameId !== nextFrameRef.current });
			} else {
				nextFrame(callback, 1);
			}
		});
		nextFrameRef.current = nextFrameId;
	}
	reactExports.C(() => () => {
		cancelNextFrame();
	}, []);
	return [nextFrame, cancelNextFrame];
};
const FULL_STEP_QUEUE = [
	"prepare",
	"start",
	"active",
	"end"
];
const SIMPLE_STEP_QUEUE = ["prepare", "prepared"];
function isActive(step) {
	return step === "active" || step === "end";
}
var useStepQueue = (status, prepareOnly, callback) => {
	const [step, setStep] = useSafeState("none");
	const [nextFrame, cancelNextFrame] = useNextFrame();
	function startQueue() {
		setStep("prepare", true);
	}
	const STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;
	useIsomorphicLayoutEffect(() => {
		if (step !== "none" && step !== "end") {
			const index = STEP_QUEUE.indexOf(step);
			const nextStep = STEP_QUEUE[index + 1];
			const result = callback(step);
			if (result === false) {
				// Skip when no needed
				setStep(nextStep, true);
			} else if (nextStep) {
				// Do as frame for step update
				nextFrame((info) => {
					function doNext() {
						// Skip since current queue is ood
						if (info.a()) return;
						setStep(nextStep, true);
					}
					if (result === true) {
						doNext();
					} else {
						// Only promise should be async
						Promise.resolve(result).then(doNext);
					}
				});
			}
		}
	}, [status, step]);
	reactExports.C(() => () => {
		cancelNextFrame();
	}, []);
	return [startQueue, step];
};
function useStatus(supportMotion, visible, getElement, { motionEnter = true, motionAppear = true, motionLeave = true, motionDeadline, motionLeaveImmediately, onAppearPrepare, onEnterPrepare, onLeavePrepare, onAppearStart, onEnterStart, onLeaveStart, onAppearActive, onEnterActive, onLeaveActive, onAppearEnd, onEnterEnd, onLeaveEnd, onVisibleChanged }) {
	// Used for outer render usage to avoid `visible: false & status: none` to render nothing
	const [asyncVisible, setAsyncVisible] = useSafeState();
	const [getStatus, setStatus] = useSyncState();
	const [style, setStyle] = useSafeState(null);
	const currentStatus = getStatus();
	const mountedRef = reactExports.L(false);
	const deadlineRef = reactExports.L(null);
	// =========================== Dom Node ===========================
	function getDomElement() {
		return getElement();
	}
	// ========================== Motion End ==========================
	const activeRef = reactExports.L(false);
	/**
	* Clean up status & style
	*/
	function updateMotionEndStatus() {
		setStatus("none");
		setStyle(null, true);
	}
	const onInternalMotionEnd = useEvent((event) => {
		const status = getStatus();
		// Do nothing since not in any transition status.
		// This may happen when `motionDeadline` trigger.
		if (status === "none") {
			return;
		}
		const element = getDomElement();
		if (event && !event.deadline && event.target !== element) {
			// event exists
			// not initiated by deadline
			// transitionEnd not fired by inner elements
			return;
		}
		const currentActive = activeRef.current;
		let canEnd;
		if (status === "appear" && currentActive) {
			canEnd = onAppearEnd?.(element, event);
		} else if (status === "enter" && currentActive) {
			canEnd = onEnterEnd?.(element, event);
		} else if (status === "leave" && currentActive) {
			canEnd = onLeaveEnd?.(element, event);
		}
		// Only update status when `canEnd` and not destroyed
		if (currentActive && canEnd !== false) {
			updateMotionEndStatus();
		}
	});
	const [patchMotionEvents] = useDomMotionEvents(onInternalMotionEnd);
	// ============================= Step =============================
	const getEventHandlers = (targetStatus) => {
		switch (targetStatus) {
			case "appear": return {
				["prepare"]: onAppearPrepare,
				["start"]: onAppearStart,
				["active"]: onAppearActive
			};
			case "enter": return {
				["prepare"]: onEnterPrepare,
				["start"]: onEnterStart,
				["active"]: onEnterActive
			};
			case "leave": return {
				["prepare"]: onLeavePrepare,
				["start"]: onLeaveStart,
				["active"]: onLeaveActive
			};
			default: return {};
		}
	};
	const eventHandlers = reactExports.I(() => getEventHandlers(currentStatus), [currentStatus]);
	const [startStep, step] = useStepQueue(currentStatus, !supportMotion, (newStep) => {
		// Only prepare step can be skip
		if (newStep === "prepare") {
			const onPrepare = eventHandlers["prepare"];
			if (!onPrepare) {
				return false;
			}
			return onPrepare(getDomElement());
		}
		// Rest step is sync update
		if (step in eventHandlers) {
			setStyle(eventHandlers[step]?.(getDomElement(), null) || null);
		}
		if (step === "active" && currentStatus !== "none") {
			// Patch events when motion needed
			patchMotionEvents(getDomElement());
			if (motionDeadline > 0) {
				clearTimeout(deadlineRef.current);
				deadlineRef.current = setTimeout(() => {
					onInternalMotionEnd({ deadline: true });
				}, motionDeadline);
			}
		}
		if (step === "prepared") {
			updateMotionEndStatus();
		}
		return true;
	});
	const active = isActive(step);
	activeRef.current = active;
	// ============================ Status ============================
	const visibleRef = reactExports.L(null);
	// Update with new status
	useIsomorphicLayoutEffect(() => {
		// When use Suspense, the `visible` will repeat trigger,
		// But not real change of the `visible`, we need to skip it.
		// https://github.com/ant-design/ant-design/issues/44379
		if (mountedRef.current && visibleRef.current === visible) {
			return;
		}
		setAsyncVisible(visible);
		const isMounted = mountedRef.current;
		mountedRef.current = true;
		// if (!supportMotion) {
		//   return;
		// }
		let nextStatus;
		// Appear
		if (!isMounted && visible && motionAppear) {
			nextStatus = "appear";
		}
		// Enter
		if (isMounted && visible && motionEnter) {
			nextStatus = "enter";
		}
		// Leave
		if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) {
			nextStatus = "leave";
		}
		const nextEventHandlers = getEventHandlers(nextStatus);
		// Update to next status
		if (nextStatus && (supportMotion || nextEventHandlers["prepare"])) {
			setStatus(nextStatus);
			startStep();
		} else {
			// Set back in case no motion but prev status has prepare step
			setStatus("none");
		}
		visibleRef.current = visible;
	}, [visible]);
	// ============================ Effect ============================
	// Reset when motion changed
	reactExports.C(() => {
		if (currentStatus === "appear" && !motionAppear || currentStatus === "enter" && !motionEnter || currentStatus === "leave" && !motionLeave) {
			setStatus("none");
		}
	}, [
		motionAppear,
		motionEnter,
		motionLeave
	]);
	reactExports.C(() => () => {
		mountedRef.current = false;
		clearTimeout(deadlineRef.current);
	}, []);
	// Trigger `onVisibleChanged`
	const firstMountChangeRef = reactExports.L(false);
	reactExports.C(() => {
		// [visible & motion not end] => [!visible & motion end] still need trigger onVisibleChanged
		if (asyncVisible) {
			firstMountChangeRef.current = true;
		}
		if (asyncVisible !== void 0 && currentStatus === "none") {
			// Skip first render is invisible since it's nothing changed
			if (firstMountChangeRef.current || asyncVisible) {
				onVisibleChanged?.(asyncVisible);
			}
			firstMountChangeRef.current = true;
		}
	}, [asyncVisible, currentStatus]);
	// ============================ Styles ============================
	let mergedStyle = style;
	if (eventHandlers["prepare"] && step === "start") {
		mergedStyle = {
			transition: "none",
			...mergedStyle
		};
	}
	return [
		getStatus,
		step,
		mergedStyle,
		asyncVisible ?? visible
	];
}
/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */
/**
* `transitionSupport` is used for none transition test case.
* Default we use browser transition event support check.
*/
function genCSSMotion(config) {
	let transitionSupport = config;
	function isSupportTransition(props, contextMotion) {
		return !!(props.motionName && transitionSupport && contextMotion !== false);
	}
	const CSSMotion = reactExports.q((props, ref) => {
		const { visible = true, removeOnLeave = true, forceRender, children, motionName, leavedClassName, eventProps } = props;
		const { motion: contextMotion } = reactExports.z(Context);
		const supportMotion = isSupportTransition(props, contextMotion);
		// Ref to the react node, it may be a HTMLElement
		const nodeRef = reactExports.L();
		function getDomElement() {
			return getDOM(nodeRef.current);
		}
		const [getStatus, statusStep, statusStyle, mergedVisible] = useStatus(supportMotion, visible, getDomElement, props);
		const status = getStatus();
		// Record whether content has rendered
		// Will return null for un-rendered even when `removeOnLeave={false}`
		const renderedRef = reactExports.L(mergedVisible);
		if (mergedVisible) {
			renderedRef.current = true;
		}
		// ====================== Refs ======================
		const refObj = reactExports.I(() => {
			const obj = {};
			Object.defineProperties(obj, {
				nativeElement: {
					enumerable: true,
					get: getDomElement
				},
				inMotion: {
					enumerable: true,
					get: () => () => getStatus() !== "none"
				},
				enableMotion: {
					enumerable: true,
					get: () => () => supportMotion
				}
			});
			return obj;
		}, []);
		// We lock `deps` here since function return object
		// will repeat trigger ref from `refConfig` -> `null` -> `refConfig`
		reactExports.F(ref, () => refObj, []);
		// ===================== Render =====================
		let motionChildren;
		const mergedProps = {
			...eventProps,
			visible
		};
		if (!children) {
			// No children
			motionChildren = null;
		} else if (status === "none") {
			// Stable children
			if (mergedVisible) {
				motionChildren = children({ ...mergedProps }, nodeRef);
			} else if (!removeOnLeave && renderedRef.current && leavedClassName) {
				motionChildren = children({
					...mergedProps,
					className: leavedClassName
				}, nodeRef);
			} else if (forceRender || !removeOnLeave && !leavedClassName) {
				motionChildren = children({
					...mergedProps,
					style: { display: "none" }
				}, nodeRef);
			} else {
				motionChildren = null;
			}
		} else {
			// In motion
			let statusSuffix;
			if (statusStep === "prepare") {
				statusSuffix = "prepare";
			} else if (isActive(statusStep)) {
				statusSuffix = "active";
			} else if (statusStep === "start") {
				statusSuffix = "start";
			}
			const motionCls = getTransitionName(motionName, `${status}-${statusSuffix}`);
			motionChildren = children({
				...mergedProps,
				className: clsx(getTransitionName(motionName, status), {
					[motionCls]: motionCls && statusSuffix,
					[motionName]: typeof motionName === "string"
				}),
				style: statusStyle
			}, nodeRef);
		}
		// Auto inject ref if child node not have `ref` props
		if (reactExports.r(motionChildren) && supportRef(motionChildren)) {
			const originNodeRef = getNodeRef(motionChildren);
			if (!originNodeRef) {
				motionChildren = reactExports.m(motionChildren, { ref: nodeRef });
			}
		}
		return motionChildren;
	});
	CSSMotion.displayName = "CSSMotion";
	return CSSMotion;
}
var CSSMotion = genCSSMotion(supportTransition);
// \b([A-Za-z_$][\w$]*)\s*!==\s*(?:undefined\s*&&\s*\1\s*!==\s*null|null\s*&&\s*\1\s*!==\s*undefined)\b
// \b([A-Za-z_$][\w$\.]*)\s*===\s*(?:undefined|null)\s*\|\|\s*\1\s*===\s*(?:undefined|null)\b
const isNonNullable = (val) => {
	return val !== void 0 && val !== null;
};
// ========================= ClassNames =========================
const mergeClassNames = (schema, ...classNames) => {
	const mergedSchema = schema || {};
	return classNames.filter(Boolean).reduce((acc, cur) => {
		// Loop keys of the current classNames
		Object.keys(cur || {}).forEach((key) => {
			const keySchema = mergedSchema[key];
			const curVal = cur[key];
			if (keySchema && typeof keySchema === "object") {
				if (curVal && typeof curVal === "object") {
					// Loop fill
					acc[key] = mergeClassNames(keySchema, acc[key], curVal);
				} else {
					// Covert string to object structure
					const { _default: defaultField } = keySchema;
					if (defaultField) {
						acc[key] = acc[key] || {};
						acc[key][defaultField] = clsx(acc[key][defaultField], curVal);
					}
				}
			} else {
				// Flatten fill
				acc[key] = clsx(acc[key], curVal);
			}
		});
		return acc;
	}, {});
};
const useSemanticClassNames = (schema, ...classNames) => {
	return reactExports.I(() => mergeClassNames.apply(0, [schema].concat(classNames)), [schema].concat(classNames));
};
// =========================== Styles ===========================
const mergeStyles = (...styles) => {
	return styles.filter(Boolean).reduce((acc, cur = {}) => {
		Object.keys(cur).forEach((key) => {
			acc[key] = {
				...acc[key],
				...cur[key]
			};
		});
		return acc;
	}, {});
};
const useSemanticStyles = (...styles) => {
	return reactExports.I(() => mergeStyles.apply(0, styles), [].concat(styles));
};
const resolveStyleOrClass = (value, info) => {
	return typeof value === "function" ? value(info) : value;
};
/**
* @desc Merge classNames and styles from multiple sources. When `schema` is provided, it **must** provide the nest object structure.
* @descZH 合并来自多个来源的 classNames 和 styles，当提供了 `schema` 时，必须提供嵌套的对象结构。
*/
const useMergeSemantic = (classNamesList, stylesList, info) => {
	const resolvedClassNamesList = classNamesList.map((classNames) => classNames ? resolveStyleOrClass(classNames, info) : void 0);
	const resolvedStylesList = stylesList.map((styles) => styles ? resolveStyleOrClass(styles, info) : void 0);
	const mergedClassNames = useSemanticClassNames.apply(0, [void 0].concat(_toConsumableArray(resolvedClassNamesList)));
	const mergedStyles = useSemanticStyles.apply(0, _toConsumableArray(resolvedStylesList));
	return reactExports.I(() => {
		{
			return [mergedClassNames, mergedStyles];
		}
	}, [
		mergedClassNames,
		mergedStyles,
		void 0
	]);
};
var isVisible = (element) => {
	if (!element) {
		return false;
	}
	if (element instanceof Element) {
		if (element.offsetParent) {
			return true;
		}
		if (element.getBBox) {
			const { width, height } = element.getBBox();
			if (width || height) {
				return true;
			}
		}
		if (element.getBoundingClientRect) {
			const { width, height } = element.getBoundingClientRect();
			if (width || height) {
				return true;
			}
		}
	}
	return false;
};
function isFragment(child) {
	return child && React.r(child) && child.type === React.d;
}
const replaceElement = (element, replacement, props) => {
	if (!React.r(element)) {
		return replacement;
	}
	return React.m(element, typeof props === "function" ? props(element.props || {}) : props);
};
function cloneElement(element, props) {
	return replaceElement(element, element, props);
}
const DisabledContext = reactExports.n(false);
const SizeContext = reactExports.n(void 0);
// This icon file is generated automatically.
var LoadingOutlined$1 = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "0 0 1024 1024",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" }
		}]
	},
	"name": "loading",
	"theme": "outlined"
};
var LoadingOutlinedSvg = LoadingOutlined$1;
function _extends() {
	_extends = Object.assign.bind();
	return _extends.apply(this, arguments);
}
const LoadingOutlined = (props, ref) => reactExports.o(Icon, _extends({}, props, {
	ref,
	icon: LoadingOutlinedSvg
}));
/**![loading](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTk4OCA1NDhjLTE5LjkgMC0zNi0xNi4xLTM2LTM2IDAtNTkuNC0xMS42LTExNy0zNC42LTE3MS4zYTQ0MC40NSA0NDAuNDUgMCAwMC05NC4zLTEzOS45IDQzNy43MSA0MzcuNzEgMCAwMC0xMzkuOS05NC4zQzYyOSA4My42IDU3MS40IDcyIDUxMiA3MmMtMTkuOSAwLTM2LTE2LjEtMzYtMzZzMTYuMS0zNiAzNi0zNmM2OS4xIDAgMTM2LjIgMTMuNSAxOTkuMyA0MC4zQzc3Mi4zIDY2IDgyNyAxMDMgODc0IDE1MGM0NyA0NyA4My45IDEwMS44IDEwOS43IDE2Mi43IDI2LjcgNjMuMSA0MC4yIDEzMC4yIDQwLjIgMTk5LjMuMSAxOS45LTE2IDM2LTM1LjkgMzZ6IiAvPjwvc3ZnPg==) */
const RefIcon = reactExports.q(LoadingOutlined);
const MARK = "__rc_react_root__";
// ========================== Render ==========================
function render(node, container) {
	const root = container[MARK] || clientExports.a(container);
	root.render(node);
	container[MARK] = root;
}
// ========================= Unmount ==========================
async function unmount(container) {
	// Delay to unmount to avoid React 18 sync warning
	return Promise.resolve().then(() => {
		container[MARK]?.unmount();
		delete container[MARK];
	});
}
const genWaveStyle = (token) => {
	const { componentCls, colorPrimary, antCls } = token;
	const [, varRef] = genCssVar(antCls, "wave");
	return { [componentCls]: {
		position: "absolute",
		background: "transparent",
		pointerEvents: "none",
		boxSizing: "border-box",
		color: varRef("color", colorPrimary),
		boxShadow: "0 0 0 0 currentcolor",
		opacity: .2,
		"&.wave-motion-appear": {
			transition: [`box-shadow 0.4s ${token.motionEaseOutCirc}`, `opacity 2s ${token.motionEaseOutCirc}`].join(","),
			"&-active": {
				boxShadow: "0 0 0 6px currentcolor",
				opacity: 0
			},
			"&.wave-quick": { transition: [`box-shadow ${token.motionDurationSlow} ${token.motionEaseInOut}`, `opacity ${token.motionDurationSlow} ${token.motionEaseInOut}`].join(",") }
		}
	} };
};
var useStyle$1 = genComponentStyleHook("Wave", genWaveStyle);
const TARGET_CLS = `${"ant"}-wave-target`;
function isValidWaveColor(color) {
	return color && typeof color === "string" && color !== "#fff" && color !== "#ffffff" && color !== "rgb(255, 255, 255)" && color !== "rgba(255, 255, 255, 1)" && !/rgba\((?:\d*, ){3}0\)/.test(color) && color !== "transparent" && color !== "canvastext";
}
function getTargetWaveColor(node, colorSource = null) {
	const style = getComputedStyle(node);
	const { borderTopColor, borderColor, backgroundColor } = style;
	if (colorSource && isValidWaveColor(style[colorSource])) {
		return style[colorSource];
	}
	return [
		borderTopColor,
		borderColor,
		backgroundColor
	].find(isValidWaveColor) ?? null;
}
function validateNum(value) {
	return Number.isNaN(value) ? 0 : value;
}
const WaveEffect = (props) => {
	const { className, target, component, colorSource } = props;
	const divRef = reactExports.L(null);
	const { getPrefixCls } = reactExports.z(ConfigContext);
	const rootPrefixCls = getPrefixCls();
	const [varName] = genCssVar(rootPrefixCls, "wave");
	// ===================== Effect =====================
	const [color, setWaveColor] = reactExports.M(null);
	const [borderRadius, setBorderRadius] = reactExports.M([]);
	const [left, setLeft] = reactExports.M(0);
	const [top, setTop] = reactExports.M(0);
	const [width, setWidth] = reactExports.M(0);
	const [height, setHeight] = reactExports.M(0);
	const [enabled, setEnabled] = reactExports.M(false);
	const waveStyle = {
		left,
		top,
		width,
		height,
		borderRadius: borderRadius.map((radius) => `${radius}px`).join(" ")
	};
	if (color) {
		waveStyle[varName("color")] = color;
	}
	function syncPos() {
		const nodeStyle = getComputedStyle(target);
		// Get wave color from target
		setWaveColor(getTargetWaveColor(target, colorSource));
		const isStatic = nodeStyle.position === "static";
		// Rect
		const { borderLeftWidth, borderTopWidth } = nodeStyle;
		setLeft(isStatic ? target.offsetLeft : validateNum(-Number.parseFloat(borderLeftWidth)));
		setTop(isStatic ? target.offsetTop : validateNum(-Number.parseFloat(borderTopWidth)));
		setWidth(target.offsetWidth);
		setHeight(target.offsetHeight);
		// Get border radius
		const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = nodeStyle;
		setBorderRadius([
			borderTopLeftRadius,
			borderTopRightRadius,
			borderBottomRightRadius,
			borderBottomLeftRadius
		].map((radius) => validateNum(Number.parseFloat(radius))));
	}
	reactExports.C(() => {
		if (target) {
			// We need delay to check position here
			// since UI may change after click
			const id = wrapperRaf(() => {
				syncPos();
				setEnabled(true);
			});
			// Add resize observer to follow size
			let resizeObserver;
			if (typeof ResizeObserver !== "undefined") {
				resizeObserver = new ResizeObserver(syncPos);
				resizeObserver.observe(target);
			}
			return () => {
				wrapperRaf.a(id);
				resizeObserver?.disconnect();
			};
		}
	}, [target]);
	if (!enabled) {
		return null;
	}
	const isSmallComponent = (component === "Checkbox" || component === "Radio") && target?.classList.contains(TARGET_CLS);
	return reactExports.o(CSSMotion, {
		visible: true,
		motionAppear: true,
		motionName: "wave-motion",
		motionDeadline: 5e3,
		onAppearEnd: (__unused_8577, event) => {
			if (event.deadline || event.propertyName === "opacity") {
				const holder = divRef.current?.parentElement;
				unmount(holder).then(() => {
					holder?.remove();
				});
			}
			return false;
		}
	}, ({ className: motionClassName }, ref) => reactExports.o("div", {
		ref: composeRef(divRef, ref),
		className: clsx(className, motionClassName, { "wave-quick": isSmallComponent }),
		style: waveStyle
	}));
};
const showWaveEffect = (target, info) => {
	const { component } = info;
	// Skip for unchecked checkbox
	if (component === "Checkbox" && !target.querySelector("input")?.checked) {
		return;
	}
	// Create holder
	const holder = document.createElement("div");
	holder.style.position = "absolute";
	holder.style.left = "0px";
	holder.style.top = "0px";
	target?.insertBefore(holder, target?.firstChild);
	render(reactExports.o(WaveEffect, {
		...info,
		target
	}), holder);
};
const useWave = (nodeRef, className, component, colorSource) => {
	const { wave } = reactExports.z(ConfigContext);
	const [, token, hashId] = useToken();
	const showWave = useEvent((event) => {
		const node = nodeRef.current;
		if (wave?.disabled || !node) {
			return;
		}
		const targetNode = node.querySelector(`.${TARGET_CLS}`) || node;
		const { showEffect } = wave || {};
		// Customize wave effect
		(showEffect || showWaveEffect)(targetNode, {
			className,
			token,
			component,
			event,
			hashId,
			colorSource
		});
	});
	const rafId = reactExports.L(null);
	// Clean up RAF on unmount to prevent memory leaks and stale callbacks
	reactExports.C(() => () => {
		wrapperRaf.a(rafId.current);
	}, []);
	// Merge trigger event into one for each frame
	const showDebounceWave = (event) => {
		wrapperRaf.a(rafId.current);
		rafId.current = wrapperRaf(() => {
			showWave(event);
		});
	};
	return showDebounceWave;
};
const Wave = (props) => {
	const { children, disabled, component, colorSource } = props;
	const { getPrefixCls } = reactExports.z(ConfigContext);
	const containerRef = reactExports.L(null);
	// ============================== Style ===============================
	const prefixCls = getPrefixCls("wave");
	const hashId = useStyle$1(prefixCls);
	// =============================== Wave ===============================
	const showWave = useWave(containerRef, clsx(prefixCls, hashId), component, colorSource);
	// ============================== Effect ==============================
	React.C(() => {
		const node = containerRef.current;
		if (!node || node.nodeType !== window.Node.ELEMENT_NODE || disabled) {
			return;
		}
		// Click handler
		const onClick = (e) => {
			// Fix radio button click twice
			if (!isVisible(e.target) || !node.getAttribute || node.getAttribute("disabled") || node.disabled || node.className.includes("disabled") && !node.className.includes("disabled:") || node.getAttribute("aria-disabled") === "true" || node.className.includes("-leave")) {
				return;
			}
			showWave(e);
		};
		// Bind events
		node.addEventListener("click", onClick, true);
		return () => {
			node.removeEventListener("click", onClick, true);
		};
	}, [disabled]);
	// ============================== Render ==============================
	if (!React.r(children)) {
		return children ?? null;
	}
	const ref = supportRef(children) ? composeRef(getNodeRef(children), containerRef) : containerRef;
	return cloneElement(children, { ref });
};
const useSize = (customSize) => {
	const size = React.z(SizeContext);
	const mergedSize = React.I(() => {
		{
			{
				return customSize(size);
			}
		}
	}, [customSize, size]);
	return mergedSize;
};
const SpaceCompactItemContext = reactExports.n(null);
const useCompactItemContext = (prefixCls, direction) => {
	const compactItemContext = reactExports.z(SpaceCompactItemContext);
	const compactItemClassnames = reactExports.I(() => {
		if (!compactItemContext) {
			return "";
		}
		const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
		const separator = compactDirection === "vertical" ? "-vertical-" : "-";
		return clsx(`${prefixCls}-compact${separator}item`, {
			[`${prefixCls}-compact${separator}first-item`]: isFirstItem,
			[`${prefixCls}-compact${separator}last-item`]: isLastItem,
			[`${prefixCls}-compact${separator}item-rtl`]: direction === "rtl"
		});
	}, [
		prefixCls,
		direction,
		compactItemContext
	]);
	return {
		a: compactItemContext?.compactSize,
		b: compactItemClassnames
	};
};
const GroupSizeContext = reactExports.n(void 0);
const ButtonGroup = (props) => {
	const { getPrefixCls, direction } = reactExports.z(ConfigContext);
	const { prefixCls: customizePrefixCls, size, className, ...others } = props;
	const prefixCls = getPrefixCls("btn-group", customizePrefixCls);
	const [, , hashId] = useToken();
	const sizeCls = reactExports.I(() => {
		switch (size) {
			case "large": return "lg";
			case "small": return "sm";
			default: return "";
		}
	}, [size]);
	const classes = clsx(prefixCls, {
		[`${prefixCls}-${sizeCls}`]: sizeCls,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, className, hashId);
	return reactExports.o(GroupSizeContext.Provider, { value: size }, reactExports.o("div", {
		...others,
		className: classes
	}));
};
const rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str) {
	return typeof str === "string";
}
function isUnBorderedButtonVariant(type) {
	return type === "text" || type === "link";
}
function splitCNCharsBySpace(child, needInserted, style, className) {
	if (!isNonNullable(child) || child === "") {
		return;
	}
	const SPACE = needInserted ? " " : "";
	if (typeof child !== "string" && typeof child !== "number" && isString(child.type) && isTwoCNChar(child.props.children)) {
		return cloneElement(child, (oriProps) => {
			const mergedCls = clsx(oriProps.className, className) || void 0;
			const mergedStyle = {
				...style,
				...oriProps.style
			};
			return {
				...oriProps,
				children: oriProps.children.split("").join(SPACE),
				className: mergedCls,
				style: mergedStyle
			};
		});
	}
	if (isString(child)) {
		return React.o("span", {
			className,
			style
		}, isTwoCNChar(child) ? child.split("").join(SPACE) : child);
	}
	if (isFragment(child)) {
		return React.o("span", {
			className,
			style
		}, child);
	}
	return cloneElement(child, (oriProps) => ({
		...oriProps,
		className: clsx(oriProps.className, className) || void 0,
		style: {
			...oriProps.style,
			...style
		}
	}));
}
function spaceChildren(children, needInserted, style, className) {
	let isPrevChildPure = false;
	const childList = [];
	React.b.b(children, (child) => {
		const type = typeof child;
		const isCurrentChildPure = type === "string" || type === "number";
		if (isPrevChildPure && isCurrentChildPure) {
			const lastIndex = childList.length - 1;
			const lastChild = childList[lastIndex];
			childList[lastIndex] = `${lastChild}${child}`;
		} else {
			childList.push(child);
		}
		isPrevChildPure = isCurrentChildPure;
	});
	return React.b.a(childList, (child) => splitCNCharsBySpace(child, needInserted, style, className));
}
[
	"default",
	"primary",
	"danger"
].concat(_toConsumableArray(PresetColors));
const IconWrapper = reactExports.q((props, ref) => {
	const { className, style, children, prefixCls } = props;
	const iconWrapperCls = clsx(`${prefixCls}-icon`, className);
	return React.o("span", {
		ref,
		className: iconWrapperCls,
		style
	}, children);
});
const InnerLoadingIcon = reactExports.q((props, ref) => {
	const { prefixCls, className, style, iconClassName } = props;
	const mergedIconCls = clsx(`${prefixCls}-loading-icon`, className);
	return React.o(IconWrapper, {
		prefixCls,
		className: mergedIconCls,
		style,
		ref
	}, React.o(RefIcon, { className: iconClassName }));
});
const getCollapsedWidth = () => ({
	width: 0,
	opacity: 0,
	transform: "scale(0)"
});
const getRealWidth = (node) => ({
	width: node.scrollWidth,
	opacity: 1,
	transform: "scale(1)"
});
const DefaultLoadingIcon = (props) => {
	const { prefixCls, loading, existIcon, className, style, mount } = props;
	const visible = !!loading;
	if (existIcon) {
		return React.o(InnerLoadingIcon, {
			prefixCls,
			className,
			style
		});
	}
	return React.o(CSSMotion, {
		visible,
		motionName: `${prefixCls}-loading-icon-motion`,
		motionAppear: !mount,
		motionEnter: !mount,
		motionLeave: !mount,
		removeOnLeave: true,
		onAppearStart: getCollapsedWidth,
		onAppearActive: getRealWidth,
		onEnterStart: getCollapsedWidth,
		onEnterActive: getRealWidth,
		onLeaveStart: getRealWidth,
		onLeaveActive: getCollapsedWidth
	}, ({ className: motionCls, style: motionStyle }, ref) => {
		const mergedStyle = {
			...style,
			...motionStyle
		};
		return React.o(InnerLoadingIcon, {
			prefixCls,
			className: clsx(className, motionCls),
			style: mergedStyle,
			ref
		});
	});
};
const genButtonBorderStyle = (buttonTypeCls, borderColor) => ({ [`> span, > ${buttonTypeCls}`]: {
	"&:not(:last-child)": { [`&, & > ${buttonTypeCls}`]: { "&:not(:disabled)": { borderInlineEndColor: borderColor } } },
	"&:not(:first-child)": { [`&, & > ${buttonTypeCls}`]: { "&:not(:disabled)": { borderInlineStartColor: borderColor } } }
} });
const genGroupStyle = (token) => {
	const { componentCls, fontSize, lineWidth, groupBorderColor, colorErrorHover } = token;
	return { [`${componentCls}-group`]: [
		{
			position: "relative",
			display: "inline-flex",
			[`> span, > ${componentCls}`]: {
				"&:not(:last-child)": { [`&, & > ${componentCls}`]: {
					borderStartEndRadius: 0,
					borderEndEndRadius: 0
				} },
				"&:not(:first-child)": {
					marginInlineStart: token.calc(lineWidth).mul(-1).equal(),
					[`&, & > ${componentCls}`]: {
						borderStartStartRadius: 0,
						borderEndStartRadius: 0
					}
				}
			},
			[componentCls]: {
				position: "relative",
				zIndex: 1,
				"&:hover, &:focus, &:active": { zIndex: 2 },
				"&[disabled]": { zIndex: 0 }
			},
			[`${componentCls}-icon-only`]: { fontSize }
		},
		genButtonBorderStyle(`${componentCls}-primary`, groupBorderColor),
		genButtonBorderStyle(`${componentCls}-danger`, colorErrorHover)
	] };
};
const getRoundNumber = (value) => Math.round(Number(value || 0));
const convertHsb2Hsv = (color) => {
	if (color instanceof FastColor) {
		return color;
	}
	if (color && typeof color === "object" && "h" in color && "b" in color) {
		const { b, ...resets } = color;
		return {
			...resets,
			v: b
		};
	}
	if (typeof color === "string" && /hsb/.test(color)) {
		return color.replace(/hsb/, "hsv");
	}
	return color;
};
class Color extends FastColor {
	constructor(color) {
		super(convertHsb2Hsv(color));
	}
	toHsbString() {
		const hsb = this.toHsb();
		const saturation = getRoundNumber(hsb.s * 100);
		const lightness = getRoundNumber(hsb.b * 100);
		const hue = getRoundNumber(hsb.h);
		const alpha = hsb.a;
		const hsbString = `hsb(${hue}, ${saturation}%, ${lightness}%)`;
		const hsbaString = `hsba(${hue}, ${saturation}%, ${lightness}%, ${alpha.toFixed(alpha === 0 ? 0 : 2)})`;
		return alpha === 1 ? hsbString : hsbaString;
	}
	toHsb() {
		const { v, ...resets } = this.toHsv();
		return {
			...resets,
			b: v,
			a: this.a
		};
	}
}
const generateColor = () => {
	return new Color("#1677ff");
};
generateColor();
const toHexFormat = (value, alpha) => value?.replace(/[^0-9a-f]/gi, "").slice(0, alpha ? 8 : 6) || "";
const getHex = (value, alpha) => value ? toHexFormat(value, alpha) : "";
let AggregationColor = function() {
	function AggregationColor(color) {
		_classCallCheck(this, AggregationColor);
		this.cleared = false;
		// Clone from another AggregationColor
		if (color instanceof AggregationColor) {
			this.metaColor = color.metaColor.clone();
			this.colors = color.colors?.map((info) => ({
				color: new AggregationColor(info.color),
				percent: info.percent
			}));
			this.cleared = color.cleared;
			return;
		}
		const isArray = Array.isArray(color);
		if (isArray && color.length) {
			this.colors = color.map(({ color: c, percent }) => ({
				color: new AggregationColor(c),
				percent
			}));
			this.metaColor = new Color(this.colors[0].color.metaColor);
		} else {
			this.metaColor = new Color(isArray ? "" : color);
		}
		if (!color || isArray && !this.colors) {
			this.metaColor = this.metaColor.setA(0);
			this.cleared = true;
		}
	}
	return _createClass(AggregationColor, [
		{
			key: "toHsb",
			value: function() {
				return this.metaColor.toHsb();
			}
		},
		{
			key: "toHsbString",
			value: function() {
				return this.metaColor.toHsbString();
			}
		},
		{
			key: "toHex",
			value: function() {
				return getHex(this.toHexString(), this.metaColor.a < 1);
			}
		},
		{
			key: "toHexString",
			value: function() {
				return this.metaColor.toHexString();
			}
		},
		{
			key: "toRgb",
			value: function() {
				return this.metaColor.toRgb();
			}
		},
		{
			key: "toRgbString",
			value: function() {
				return this.metaColor.toRgbString();
			}
		},
		{
			key: "isGradient",
			value: function() {
				return !!this.colors && !this.cleared;
			}
		},
		{
			key: "getColors",
			value: function() {
				return this.colors || [{
					color: this,
					percent: 0
				}];
			}
		},
		{
			key: "toCssString",
			value: function() {
				const { colors } = this;
				// CSS line-gradient
				if (colors) {
					const colorsStr = colors.map((c) => `${c.color.toRgbString()} ${c.percent}%`).join(", ");
					return `linear-gradient(90deg, ${colorsStr})`;
				}
				return this.metaColor.toRgbString();
			}
		},
		{
			key: "equals",
			value: function(color) {
				if (!color || this.isGradient() !== color.isGradient()) {
					return false;
				}
				if (!this.isGradient()) {
					return this.toHexString() === color.toHexString();
				}
				return this.colors.length === color.colors.length && this.colors.every((c, i) => {
					const target = color.colors[i];
					return c.percent === target.percent && c.color.equals(target.color);
				});
			}
		}
	]);
}();
const isBright = (value) => {
	const { r, g, b, a } = value.toRgb();
	const hsv = new Color(value.toRgbString()).onBackground("#fff").toHsv();
	if (a <= .5) {
		// Adapted to dark mode
		return hsv.v > .5;
	}
	return r * .299 + g * .587 + b * .114 > 192;
};
const prepareToken = (token) => {
	const { paddingInline, onlyIconSize, borderColorDisabled } = token;
	const buttonToken = merge(token, {
		buttonPaddingHorizontal: paddingInline,
		buttonPaddingVertical: 0,
		buttonIconOnlyFontSize: onlyIconSize,
		colorBorderDisabled: borderColorDisabled
	});
	return buttonToken;
};
const prepareComponentToken = (token) => {
	const contentFontSize = token.contentFontSize ?? token.fontSize;
	const contentFontSizeSM = token.contentFontSizeSM ?? token.fontSize;
	const contentFontSizeLG = token.contentFontSizeLG ?? token.fontSizeLG;
	const contentLineHeight = token.contentLineHeight ?? getLineHeight(contentFontSize);
	const contentLineHeightSM = token.contentLineHeightSM ?? getLineHeight(contentFontSizeSM);
	const contentLineHeightLG = token.contentLineHeightLG ?? getLineHeight(contentFontSizeLG);
	const solidTextColor = isBright(new AggregationColor(token.colorBgSolid)) ? "#000" : "#fff";
	const shadowColorTokens = PresetColors.reduce((prev, colorKey) => ({
		...prev,
		[`${colorKey}ShadowColor`]: `0 ${unit$1(token.controlOutlineWidth)} 0 ${getAlphaColor(token[`${colorKey}1`], token.colorBgContainer)}`
	}), {});
	const defaultBgDisabled = token.colorBgContainerDisabled;
	const dashedBgDisabled = token.colorBgContainerDisabled;
	return {
		...shadowColorTokens,
		fontWeight: 400,
		iconGap: token.marginXS,
		defaultShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
		primaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
		dangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
		primaryColor: token.colorTextLightSolid,
		dangerColor: token.colorTextLightSolid,
		borderColorDisabled: token.colorBorderDisabled,
		defaultGhostColor: token.colorBgContainer,
		ghostBg: "transparent",
		defaultGhostBorderColor: token.colorBgContainer,
		paddingInline: token.paddingContentHorizontal - token.lineWidth,
		paddingInlineLG: token.paddingContentHorizontal - token.lineWidth,
		paddingInlineSM: 8 - token.lineWidth,
		onlyIconSize: "inherit",
		onlyIconSizeSM: "inherit",
		onlyIconSizeLG: "inherit",
		groupBorderColor: token.colorPrimaryHover,
		linkHoverBg: "transparent",
		textTextColor: token.colorText,
		textTextHoverColor: token.colorText,
		textTextActiveColor: token.colorText,
		textHoverBg: token.colorFillTertiary,
		defaultColor: token.colorText,
		defaultBg: token.colorBgContainer,
		defaultBorderColor: token.colorBorder,
		defaultBorderColorDisabled: token.colorBorder,
		defaultHoverBg: token.colorBgContainer,
		defaultHoverColor: token.colorPrimaryHover,
		defaultHoverBorderColor: token.colorPrimaryHover,
		defaultActiveBg: token.colorBgContainer,
		defaultActiveColor: token.colorPrimaryActive,
		defaultActiveBorderColor: token.colorPrimaryActive,
		solidTextColor,
		contentFontSize,
		contentFontSizeSM,
		contentFontSizeLG,
		contentLineHeight,
		contentLineHeightSM,
		contentLineHeightLG,
		paddingBlock: Math.max((token.controlHeight - contentFontSize * contentLineHeight) / 2 - token.lineWidth, 0),
		paddingBlockSM: Math.max((token.controlHeightSM - contentFontSizeSM * contentLineHeightSM) / 2 - token.lineWidth, 0),
		paddingBlockLG: Math.max((token.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token.lineWidth, 0),
		defaultBgDisabled,
		dashedBgDisabled
	};
};
const genVariantStyle = (token) => {
	const { componentCls, antCls } = token;
	const [varName, varRef] = genCssVar(antCls, "btn");
	return { [componentCls]: [
		(
		// ==============================================================
		// ==                         Variable                         ==
		// ==============================================================
		{
			[varName("border-width")]: "1px",
			[varName("border-color")]: "#000",
			[varName("border-color-hover")]: varRef("border-color"),
			[varName("border-color-active")]: varRef("border-color"),
			[varName("border-color-disabled")]: varRef("border-color"),
			[varName("border-style")]: "solid",
			[varName("text-color")]: "#000",
			[varName("text-color-hover")]: varRef("text-color"),
			[varName("text-color-active")]: varRef("text-color"),
			[varName("text-color-disabled")]: varRef("text-color"),
			[varName("bg-color")]: "#ddd",
			[varName("bg-color-hover")]: varRef("bg-color"),
			[varName("bg-color-active")]: varRef("bg-color"),
			[varName("bg-color-disabled")]: token.colorBgContainerDisabled,
			[varName("bg-color-container")]: token.colorBgContainer,
			[varName("shadow")]: "none"
		}),
		(
		// ==============================================================
		// ==                         Template                         ==
		// ==============================================================
		{
			border: [
				varRef("border-width"),
				varRef("border-style"),
				varRef("border-color")
			].join(" "),
			color: varRef("text-color"),
			backgroundColor: varRef("bg-color"),
			[`&:not(:disabled):not(${componentCls}-disabled)`]: {
				"&:hover": {
					border: [
						varRef("border-width"),
						varRef("border-style"),
						varRef("border-color-hover")
					].join(" "),
					color: varRef("text-color-hover"),
					backgroundColor: varRef("bg-color-hover")
				},
				"&:active": {
					border: [
						varRef("border-width"),
						varRef("border-style"),
						varRef("border-color-active")
					].join(" "),
					color: varRef("text-color-active"),
					backgroundColor: varRef("bg-color-active")
				}
			}
		}),
		(
		// ==============================================================
		// ==                         Variants                         ==
		// ==============================================================
		{
			[`&${componentCls}-variant-solid`]: {
				[varName("solid-bg-color")]: varRef("color-base"),
				[varName("solid-bg-color-hover")]: varRef("color-hover"),
				[varName("solid-bg-color-active")]: varRef("color-active"),
				[varName("border-color")]: "transparent",
				[varName("text-color")]: token.colorTextLightSolid,
				[varName("bg-color")]: varRef("solid-bg-color"),
				[varName("bg-color-hover")]: varRef("solid-bg-color-hover"),
				[varName("bg-color-active")]: varRef("solid-bg-color-active"),
				boxShadow: varRef("shadow")
			},
			[`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
				[varName("border-color")]: varRef("color-base"),
				[varName("border-color-hover")]: varRef("color-hover"),
				[varName("border-color-active")]: varRef("color-active"),
				[varName("bg-color")]: varRef("bg-color-container"),
				[varName("text-color")]: varRef("color-base"),
				[varName("text-color-hover")]: varRef("color-hover"),
				[varName("text-color-active")]: varRef("color-active"),
				boxShadow: varRef("shadow")
			},
			[`&${componentCls}-variant-dashed`]: {
				[varName("border-style")]: "dashed",
				[varName("bg-color-disabled")]: token.dashedBgDisabled
			},
			[`&${componentCls}-variant-filled`]: {
				[varName("border-color")]: "transparent",
				[varName("text-color")]: varRef("color-base"),
				[varName("bg-color")]: varRef("color-light"),
				[varName("bg-color-hover")]: varRef("color-light-hover"),
				[varName("bg-color-active")]: varRef("color-light-active")
			},
			[`&${componentCls}-variant-text, &${componentCls}-variant-link`]: {
				[varName("border-color")]: "transparent",
				[varName("text-color")]: varRef("color-base"),
				[varName("text-color-hover")]: varRef("color-hover"),
				[varName("text-color-active")]: varRef("color-active"),
				[varName("bg-color")]: "transparent",
				[varName("bg-color-hover")]: "transparent",
				[varName("bg-color-active")]: "transparent",
				[`&:disabled, &${token.componentCls}-disabled`]: {
					background: "transparent",
					borderColor: "transparent"
				}
			},
			[`&${componentCls}-variant-text`]: {
				[varName("bg-color-hover")]: varRef("color-light"),
				[varName("bg-color-active")]: varRef("color-light-active")
			}
		}),
		(
		// ==============================================================
		// ==                          Colors                          ==
		// ==============================================================
		{
			[`&${componentCls}-variant-link`]: {
				[varName("color-base")]: token.colorLink,
				[varName("color-hover")]: token.colorLinkHover,
				[varName("color-active")]: token.colorLinkActive
			},
			[`&${componentCls}-color-primary`]: {
				[varName("color-base")]: token.colorPrimary,
				[varName("color-hover")]: token.colorPrimaryHover,
				[varName("color-active")]: token.colorPrimaryActive,
				[varName("color-light")]: token.colorPrimaryBg,
				[varName("color-light-hover")]: token.colorPrimaryBgHover,
				[varName("color-light-active")]: token.colorPrimaryBorder,
				[varName("shadow")]: token.primaryShadow,
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.primaryColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				}
			},
			[`&${componentCls}-color-dangerous`]: {
				[varName("color-base")]: token.colorError,
				[varName("color-hover")]: token.colorErrorHover,
				[varName("color-active")]: token.colorErrorActive,
				[varName("color-light")]: token.colorErrorBg,
				[varName("color-light-hover")]: token.colorErrorBgFilledHover,
				[varName("color-light-active")]: token.colorErrorBgActive,
				[varName("shadow")]: token.dangerShadow,
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.dangerColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				}
			},
			[`&${componentCls}-color-default`]: {
				[varName("solid-bg-color")]: token.colorBgSolid,
				[varName("solid-bg-color-hover")]: token.colorBgSolidHover,
				[varName("solid-bg-color-active")]: token.colorBgSolidActive,
				[varName("color-base")]: token.defaultBorderColor,
				[varName("color-hover")]: token.defaultHoverBorderColor,
				[varName("color-active")]: token.defaultActiveBorderColor,
				[varName("color-light")]: token.colorFillTertiary,
				[varName("color-light-hover")]: token.colorFillSecondary,
				[varName("color-light-active")]: token.colorFill,
				[varName("text-color")]: token.defaultColor,
				[varName("text-color-hover")]: token.defaultHoverColor,
				[varName("text-color-active")]: token.defaultActiveColor,
				[varName("shadow")]: token.defaultShadow,
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.solidTextColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				},
				[`&${componentCls}-variant-filled, &${componentCls}-variant-text`]: {
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				},
				[`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
					[varName("text-color")]: token.defaultColor,
					[varName("text-color-hover")]: token.defaultHoverColor,
					[varName("text-color-active")]: token.defaultActiveColor,
					[varName("bg-color-container")]: token.defaultBg,
					[varName("bg-color-hover")]: token.defaultHoverBg,
					[varName("bg-color-active")]: token.defaultActiveBg
				},
				[`&${componentCls}-variant-text`]: {
					[varName("text-color")]: token.textTextColor,
					[varName("text-color-hover")]: token.textTextHoverColor,
					[varName("text-color-active")]: token.textTextActiveColor,
					[varName("bg-color-hover")]: token.textHoverBg
				},
				[`&${componentCls}-background-ghost`]: { [`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
					[varName("text-color")]: token.defaultGhostColor,
					[varName("border-color")]: token.defaultGhostBorderColor
				} }
			}
		}),
		PresetColors.map((colorKey) => {
			const darkColor = token[`${colorKey}6`];
			const lightColor = token[`${colorKey}1`];
			const hoverColor = token[`${colorKey}5`];
			const lightHoverColor = token[`${colorKey}2`];
			const lightActiveColor = token[`${colorKey}3`];
			const activeColor = token[`${colorKey}7`];
			const shadowColor = token[`${colorKey}ShadowColor`];
			return { [`&${componentCls}-color-${colorKey}`]: {
				[varName("color-base")]: darkColor,
				[varName("color-hover")]: hoverColor,
				[varName("color-active")]: activeColor,
				[varName("color-light")]: lightColor,
				[varName("color-light-hover")]: lightHoverColor,
				[varName("color-light-active")]: lightActiveColor,
				[varName("shadow")]: shadowColor
			} };
		}),
		(
		// ==============================================================
		// ==                         Disabled                         ==
		// ==============================================================
		{ [`&:disabled, &${token.componentCls}-disabled`]: {
			cursor: "not-allowed",
			borderColor: token.colorBorderDisabled,
			background: varRef("bg-color-disabled"),
			color: token.colorTextDisabled,
			boxShadow: "none"
		} }),
		(
		// ==============================================================
		// ==                          Ghost                           ==
		// ==============================================================
		{ [`&${componentCls}-background-ghost`]: {
			[varName("bg-color")]: "transparent",
			[varName("shadow")]: "none"
		} })
	] };
};
// ============================== Shared ==============================
const genSharedButtonStyle = (token) => {
	const { componentCls, iconCls, fontWeight, opacityLoading, motionDurationSlow, motionEaseInOut, iconGap, calc } = token;
	return { [componentCls]: {
		outline: "none",
		position: "relative",
		display: "inline-flex",
		gap: iconGap,
		alignItems: "center",
		justifyContent: "center",
		fontWeight,
		whiteSpace: "nowrap",
		textAlign: "center",
		backgroundImage: "none",
		cursor: "pointer",
		transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
		userSelect: "none",
		touchAction: "manipulation",
		"&:disabled > *": { pointerEvents: "none" },
		[`${componentCls}-icon > svg`]: resetIcon(),
		"> a": { color: "currentColor" },
		"&:not(:disabled)": genFocusStyle(token),
		[`&${componentCls}-two-chinese-chars::first-letter`]: { letterSpacing: "0.34em" },
		[`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
			marginInlineEnd: "-0.34em",
			letterSpacing: "0.34em"
		},
		[`&${componentCls}-icon-only`]: {
			paddingInline: 0,
			[`&${componentCls}-compact-item`]: { flex: "none" }
		},
		[`&${componentCls}-loading`]: {
			opacity: opacityLoading,
			cursor: "default"
		},
		[`${componentCls}-loading-icon`]: { transition: [
			"width",
			"opacity",
			"margin"
		].map((transition) => `${transition} ${motionDurationSlow} ${motionEaseInOut}`).join(",") },
		[`&:not(${componentCls}-icon-end)`]: { [`${componentCls}-loading-icon-motion`]: {
			"&-appear-start, &-enter-start": { marginInlineEnd: calc(iconGap).mul(-1).equal() },
			"&-appear-active, &-enter-active": { marginInlineEnd: 0 },
			"&-leave-start": { marginInlineEnd: 0 },
			"&-leave-active": { marginInlineEnd: calc(iconGap).mul(-1).equal() }
		} },
		"&-icon-end": {
			flexDirection: "row-reverse",
			[`${componentCls}-loading-icon-motion`]: {
				"&-appear-start, &-enter-start": { marginInlineStart: calc(iconGap).mul(-1).equal() },
				"&-appear-active, &-enter-active": { marginInlineStart: 0 },
				"&-leave-start": { marginInlineStart: 0 },
				"&-leave-active": { marginInlineStart: calc(iconGap).mul(-1).equal() }
			}
		}
	} };
};
// ============================== Shape ===============================
const genCircleButtonStyle = (token) => ({
	minWidth: token.controlHeight,
	paddingInline: 0,
	borderRadius: "50%"
});
// =============================== Size ===============================
const genButtonStyle = (token, prefixCls = "") => {
	const { componentCls, controlHeight, fontSize, borderRadius, buttonPaddingHorizontal, iconCls, buttonPaddingVertical, buttonIconOnlyFontSize } = token;
	return [
		{ [prefixCls]: {
			fontSize,
			height: controlHeight,
			padding: `${unit$1(buttonPaddingVertical)} ${unit$1(buttonPaddingHorizontal)}`,
			borderRadius,
			[`&${componentCls}-icon-only`]: {
				width: controlHeight,
				[iconCls]: { fontSize: buttonIconOnlyFontSize }
			}
		} },
		(
		// Shape - patch prefixCls again to override solid border radius style
		{ [`${componentCls}${componentCls}-circle${prefixCls}`]: genCircleButtonStyle(token) }),
		{ [`${componentCls}${componentCls}-round${prefixCls}`]: {
			borderRadius: token.controlHeight,
			[`&:not(${componentCls}-icon-only)`]: { paddingInline: token.buttonPaddingHorizontal }
		} }
	];
};
const genSizeBaseButtonStyle = (token) => {
	const baseToken = merge(token, { fontSize: token.contentFontSize });
	return genButtonStyle(baseToken, token.componentCls);
};
const genSizeSmallButtonStyle = (token) => {
	const smallToken = merge(token, {
		controlHeight: token.controlHeightSM,
		fontSize: token.contentFontSizeSM,
		padding: token.paddingXS,
		buttonPaddingHorizontal: token.paddingInlineSM,
		buttonPaddingVertical: 0,
		borderRadius: token.borderRadiusSM,
		buttonIconOnlyFontSize: token.onlyIconSizeSM
	});
	return genButtonStyle(smallToken, `${token.componentCls}-sm`);
};
const genSizeLargeButtonStyle = (token) => {
	const largeToken = merge(token, {
		controlHeight: token.controlHeightLG,
		fontSize: token.contentFontSizeLG,
		buttonPaddingHorizontal: token.paddingInlineLG,
		buttonPaddingVertical: 0,
		borderRadius: token.borderRadiusLG,
		buttonIconOnlyFontSize: token.onlyIconSizeLG
	});
	return genButtonStyle(largeToken, `${token.componentCls}-lg`);
};
const genBlockButtonStyle = (token) => {
	const { componentCls } = token;
	return { [componentCls]: { [`&${componentCls}-block`]: { width: "100%" } } };
};
// ============================== Export ==============================
var useStyle = genStyleHooks(0, (token) => {
	const buttonToken = prepareToken(token);
	return [
		genSharedButtonStyle(buttonToken),
		genSizeBaseButtonStyle(buttonToken),
		genSizeSmallButtonStyle(buttonToken),
		genSizeLargeButtonStyle(buttonToken),
		genBlockButtonStyle(buttonToken),
		genVariantStyle(buttonToken),
		genGroupStyle(buttonToken)
	];
}, prepareComponentToken, { unitless: {
	fontWeight: true,
	contentLineHeight: true,
	contentLineHeightSM: true,
	contentLineHeightLG: true
} });
// handle border collapse
function compactItemBorder(token, parentCls, __unused_2B13, prefixCls) {
	const hoverEffects = [
		"hover",
		"focus",
		"active"
	].filter(Boolean).map((n) => `&:${n} ${""}`).join(",");
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginInlineEnd: token.calc(token.lineWidth).mul(-1).equal() },
		[`&-item:not(${prefixCls}-status-success)`]: { zIndex: 2 },
		"&-item": {
			[hoverEffects]: { zIndex: 3 },
			...{},
			[`&[disabled] ${""}`]: { zIndex: 0 }
		}
	};
}
// handle border-radius
function compactItemBorderRadius(prefixCls, parentCls) {
	return {
		[`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item) ${""}`]: { borderRadius: 0 },
		[`&-item:not(${parentCls}-last-item)${parentCls}-first-item`]: { [`& ${""}, &${prefixCls}-sm ${""}, &${prefixCls}-lg ${""}`]: {
			borderStartEndRadius: 0,
			borderEndEndRadius: 0
		} },
		[`&-item:not(${parentCls}-first-item)${parentCls}-last-item`]: { [`& ${""}, &${prefixCls}-sm ${""}, &${prefixCls}-lg ${""}`]: {
			borderStartStartRadius: 0,
			borderEndStartRadius: 0
		} }
	};
}
function genCompactItemStyle(token) {
	const { componentCls } = token;
	const mergedComponentCls = componentCls;
	const compactCls = `${mergedComponentCls}-compact`;
	return { [compactCls]: {
		...compactItemBorder(token, compactCls, 0, mergedComponentCls),
		...compactItemBorderRadius(mergedComponentCls, compactCls)
	} };
}
function compactItemVerticalBorder(token, parentCls, prefixCls) {
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginBottom: token.calc(token.lineWidth).mul(-1).equal() },
		[`&-item:not(${prefixCls}-status-success)`]: { zIndex: 2 },
		"&-item": {
			"&:hover,&:focus,&:active": { zIndex: 3 },
			"&[disabled]": { zIndex: 0 }
		}
	};
}
function compactItemBorderVerticalRadius(prefixCls, parentCls) {
	return {
		[`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item)`]: { borderRadius: 0 },
		[`&-item${parentCls}-first-item:not(${parentCls}-last-item)`]: { [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
			borderEndEndRadius: 0,
			borderEndStartRadius: 0
		} },
		[`&-item${parentCls}-last-item:not(${parentCls}-first-item)`]: { [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
			borderStartStartRadius: 0,
			borderStartEndRadius: 0
		} }
	};
}
function genCompactItemVerticalStyle(token) {
	const compactCls = `${token.componentCls}-compact-vertical`;
	return { [compactCls]: {
		...compactItemVerticalBorder(token, compactCls, token.componentCls),
		...compactItemBorderVerticalRadius(token.componentCls, compactCls)
	} };
}
const genButtonCompactStyle = (token) => {
	const { antCls, componentCls, lineWidth, calc, colorBgContainer } = token;
	const solidSelector = `${componentCls}-variant-solid:not([disabled])`;
	const insetOffset = calc(lineWidth).mul(-1).equal();
	const [varName, varRef] = genCssVar(antCls, "btn");
	const getCompactBorderStyle = (vertical) => {
		const itemCls = `${componentCls}-compact${vertical ? "-vertical" : ""}-item`;
		return { [itemCls]: {
			[varName("compact-connect-border-color")]: varRef("bg-color-hover"),
			[`&${solidSelector}`]: {
				transition: "none",
				[`& + ${solidSelector}:before`]: [{
					position: "absolute",
					backgroundColor: varRef("compact-connect-border-color"),
					content: "\"\""
				}, vertical ? {
					top: insetOffset,
					insetInline: insetOffset,
					height: lineWidth
				} : {
					insetBlock: insetOffset,
					insetInlineStart: insetOffset,
					width: lineWidth
				}],
				"&:hover:before": { display: "none" }
			}
		} };
	};
	// Special styles for solid Button
	return [
		getCompactBorderStyle(),
		getCompactBorderStyle(true),
		{ [`${solidSelector}${componentCls}-color-default`]: { [varName("compact-connect-border-color")]: `color-mix(in srgb, ${varRef("bg-color-hover")} 75%, ${colorBgContainer})` } }
	];
};
// ============================== Export ==============================
var Compact = genSubStyleComponent(["Button", "compact"], (token) => {
	const buttonToken = prepareToken(token);
	return [
		genCompactItemStyle(buttonToken),
		genCompactItemVerticalStyle(buttonToken),
		genButtonCompactStyle(buttonToken)
	];
}, prepareComponentToken);
function getLoadingConfig(loading) {
	if (typeof loading === "object" && loading) {
		let delay = loading.delay;
		delay = !Number.isNaN(delay) && typeof delay === "number" ? delay : 0;
		return {
			loading: delay <= 0,
			delay
		};
	}
	return {
		loading: !!loading,
		delay: 0
	};
}
const ButtonTypeMap = {
	default: ["default", "outlined"],
	primary: ["primary", "solid"],
	dashed: ["default", "dashed"],
	link: ["link", "link"],
	text: ["default", "text"]
};
const InternalCompoundedButton = React.q((props, ref) => {
	const { _skipSemantic, loading = false, prefixCls: customizePrefixCls, color, variant, type, danger = false, shape: customizeShape, size: customizeSize, disabled: customDisabled, className, rootClassName, children, icon, iconPosition, iconPlacement, ghost = false, block = false, htmlType = "button", classNames, styles, style, autoInsertSpace, autoFocus, ...rest } = props;
	const childNodes = toArray(children);
	// https://github.com/ant-design/ant-design/issues/47605
	// Compatible with original `type` behavior
	const mergedType = type || "default";
	const { button } = React.z(ConfigContext);
	const shape = customizeShape || button?.shape || "default";
	const [parsedColor, parsedVariant] = reactExports.I(() => {
		// >>>>> Local
		// Color & Variant
		if (color && variant) {
			return [color, variant];
		}
		// Sugar syntax
		if (type || danger) {
			const colorVariantPair = ButtonTypeMap[mergedType] || [];
			if (danger) {
				return ["danger", colorVariantPair[1]];
			}
			return colorVariantPair;
		}
		// >>> Context fallback
		if (button?.color && button?.variant) {
			return [button.color, button.variant];
		}
		return ["default", "outlined"];
	}, [
		color,
		variant,
		type,
		danger,
		button?.color,
		button?.variant,
		mergedType
	]);
	const [mergedColor, mergedVariant] = reactExports.I(() => {
		if (ghost && parsedVariant === "solid") {
			return [parsedColor, "outlined"];
		}
		return [parsedColor, parsedVariant];
	}, [
		parsedColor,
		parsedVariant,
		ghost
	]);
	const isDanger = mergedColor === "danger";
	const mergedColorText = isDanger ? "dangerous" : mergedColor;
	const { getPrefixCls, direction, autoInsertSpace: contextAutoInsertSpace, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles } = useComponentConfig();
	const mergedInsertSpace = autoInsertSpace ?? contextAutoInsertSpace ?? true;
	const prefixCls = getPrefixCls("btn", customizePrefixCls);
	const [hashId, cssVarCls] = useStyle(prefixCls);
	const disabled = reactExports.z(DisabledContext);
	const mergedDisabled = customDisabled ?? disabled;
	const groupSize = reactExports.z(GroupSizeContext);
	const loadingOrDelay = reactExports.I(() => getLoadingConfig(loading), [loading]);
	const [innerLoading, setLoading] = reactExports.M(loadingOrDelay.loading);
	const [hasTwoCNChar, setHasTwoCNChar] = reactExports.M(false);
	const buttonRef = reactExports.L(null);
	const mergedRef = useComposeRef(ref, buttonRef);
	const needInserted = childNodes.length === 1 && !icon && !isUnBorderedButtonVariant(mergedVariant);
	// ========================= Mount ==========================
	// Record for mount status.
	// This will help to no to show the animation of loading on the first mount.
	const isMountRef = reactExports.L(true);
	React.C(() => {
		isMountRef.current = false;
		return () => {
			isMountRef.current = true;
		};
	}, []);
	// ========================= Effect =========================
	// Loading. Should use `useLayoutEffect` to avoid low perf multiple click issue.
	// https://github.com/ant-design/ant-design/issues/51325
	useLayoutEffect(() => {
		let delayTimer = null;
		if (loadingOrDelay.delay > 0) {
			delayTimer = setTimeout(() => {
				delayTimer = null;
				setLoading(true);
			}, loadingOrDelay.delay);
		} else {
			setLoading(loadingOrDelay.loading);
		}
		function cleanupTimer() {
			if (delayTimer) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}
		}
		return cleanupTimer;
	}, [loadingOrDelay.delay, loadingOrDelay.loading]);
	// Two chinese characters check
	reactExports.C(() => {
		// FIXME: for HOC usage like <FormatMessage />
		if (!buttonRef.current || !mergedInsertSpace) {
			return;
		}
		const buttonText = buttonRef.current.textContent || "";
		if (needInserted && isTwoCNChar(buttonText)) {
			if (!hasTwoCNChar) {
				setHasTwoCNChar(true);
			}
		} else if (hasTwoCNChar) {
			setHasTwoCNChar(false);
		}
	});
	// Auto focus
	reactExports.C(() => {
		if (autoFocus && buttonRef.current) {
			buttonRef.current.focus();
		}
	}, []);
	// ========================= Events =========================
	const handleClick = React.y((e) => {
		// FIXME: https://github.com/ant-design/ant-design/issues/30207
		if (innerLoading || mergedDisabled) {
			e.preventDefault();
			return;
		}
		props.onClick?.("href" in props ? e : e);
	}, [
		props.onClick,
		innerLoading,
		mergedDisabled
	]);
	// ========================== Size ==========================
	const { a: compactSize, b: compactItemClassnames } = useCompactItemContext(prefixCls, direction);
	const sizeClassNameMap = {
		large: "lg",
		small: "sm",
		middle: void 0
	};
	const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? groupSize ?? ctxSize);
	const sizeCls = sizeFullName ? sizeClassNameMap[sizeFullName] ?? "" : "";
	const iconType = innerLoading ? "loading" : icon;
	const mergedIconPlacement = iconPlacement ?? iconPosition ?? "start";
	const linkButtonRestProps = omit(rest, ["navigate"]);
	// =========== Merged Props for Semantic ===========
	const mergedProps = {
		...props,
		type: mergedType,
		color: mergedColor,
		variant: mergedVariant,
		danger: isDanger,
		shape,
		size: sizeFullName,
		disabled: mergedDisabled,
		loading: innerLoading,
		iconPlacement: mergedIconPlacement
	};
	// ========================= Style ==========================
	const [mergedClassNames, mergedStyles] = useMergeSemantic([_skipSemantic ? void 0 : contextClassNames, classNames], [_skipSemantic ? void 0 : contextStyles, styles], { props: mergedProps });
	// ========================= Render =========================
	const classes = clsx(prefixCls, hashId, cssVarCls, {
		[`${prefixCls}-${shape}`]: shape !== "default" && shape !== "square" && shape,
		[`${prefixCls}-${mergedType}`]: mergedType,
		[`${prefixCls}-dangerous`]: danger,
		[`${prefixCls}-color-${mergedColorText}`]: mergedColorText,
		[`${prefixCls}-variant-${mergedVariant}`]: mergedVariant,
		[`${prefixCls}-${sizeCls}`]: sizeCls,
		[`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
		[`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonVariant(mergedVariant),
		[`${prefixCls}-loading`]: innerLoading,
		[`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && mergedInsertSpace && !innerLoading,
		[`${prefixCls}-block`]: block,
		[`${prefixCls}-rtl`]: direction === "rtl",
		[`${prefixCls}-icon-end`]: mergedIconPlacement === "end"
	}, compactItemClassnames, className, rootClassName, contextClassName, mergedClassNames.root);
	const fullStyle = {
		...mergedStyles.root,
		...contextStyle,
		...style
	};
	const iconSharedProps = {
		className: mergedClassNames.icon,
		style: mergedStyles.icon
	};
	/**
	* Extract icon node
	* If there is a custom icon and not in loading state: show custom icon
	*/
	const iconWrapperElement = (child) => React.o(IconWrapper, {
		prefixCls,
		...iconSharedProps
	}, child);
	const defaultLoadingIconElement = React.o(DefaultLoadingIcon, {
		existIcon: !!icon,
		prefixCls,
		loading: innerLoading,
		mount: isMountRef.current,
		...iconSharedProps
	});
	/**
	* Using if-else statements can improve code readability without affecting future expansion.
	*/
	let iconNode;
	if (icon && !innerLoading) {
		iconNode = iconWrapperElement(icon);
	} else if (loading && typeof loading === "object" && loading.icon) {
		iconNode = iconWrapperElement(loading.icon);
	} else {
		iconNode = defaultLoadingIconElement;
	}
	const contentNode = isNonNullable(children) ? spaceChildren(children, needInserted && mergedInsertSpace, mergedStyles.content, mergedClassNames.content) : null;
	if (linkButtonRestProps.href !== void 0) {
		return React.o("a", {
			...linkButtonRestProps,
			className: clsx(classes, { [`${prefixCls}-disabled`]: mergedDisabled }),
			href: mergedDisabled ? void 0 : linkButtonRestProps.href,
			style: fullStyle,
			onClick: handleClick,
			ref: mergedRef,
			tabIndex: mergedDisabled ? -1 : 0,
			"aria-disabled": mergedDisabled
		}, iconNode, contentNode);
	}
	let buttonNode = React.o("button", {
		...rest,
		type: htmlType,
		className: classes,
		style: fullStyle,
		onClick: handleClick,
		disabled: mergedDisabled,
		ref: mergedRef
	}, iconNode, contentNode, compactItemClassnames && React.o(Compact, { prefixCls }));
	if (!isUnBorderedButtonVariant(mergedVariant)) {
		buttonNode = React.o(Wave, {
			component: "Button",
			disabled: innerLoading
		}, buttonNode);
	}
	return buttonNode;
});
const Button = InternalCompoundedButton;
Button.Group = ButtonGroup;
Button.__ANT_BUTTON = true;
var jsxRuntime = {};
var reactJsxRuntime_production = {};
function requireReactJsxRuntime_production() {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	function jsxProd(type, config, maybeKey) {
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) maybeKey[propName] = config[propName];
		} else maybeKey = config;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key: null,
			ref: null,
			props: maybeKey
		};
	}
	reactJsxRuntime_production.b = jsxProd;
	return reactJsxRuntime_production;
}
function requireJsxRuntime() {
	{
		jsxRuntime.a = requireReactJsxRuntime_production();
	}
	return jsxRuntime.a;
}
var jsxRuntimeExports = requireJsxRuntime();
const container = document.getElementById("root");
const root = ReactDOM.a(container);
root.render(jsxRuntimeExports.b(React.g, { children: jsxRuntimeExports.b(Button, {
	variant: "text",
	children: "Text"
}) }));
